import { Complaint, RepairProof, WorkerInfo } from '../types';

export interface QueuedRepairSubmission {
  queueId: string;
  complaintId: string;
  workerId: string;
  workerName: string;
  assetName: string;
  ward: string;
  queuedAt: string;
  proofData: {
    photoUrl: string;
    beforePhotoUrl?: string;
    workerNotes: string;
    partsReplaced: string[];
    geoTag: string;
    actionType?: 'Repair' | 'Replace';
    repairCost?: {
      partsCost: number;
      laborCost: number;
      totalCost: number;
    };
    qaVerification?: {
      verified: boolean;
      confidence: number;
      summary: string;
      inspectedAt: string;
    };
  };
  retryCount: number;
  status: 'pending' | 'syncing' | 'completed' | 'error';
  errorMessage?: string;
}

const STORAGE_QUEUE_KEY = 'gramapala_offline_repair_queue_v1';
const STORAGE_CACHED_TASKS_KEY = 'gramapala_offline_worker_tasks_v1';

export class OfflineSyncService {
  private static instance: OfflineSyncService;
  private isSyncInProgress = false;

  private constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        console.log('[OfflineSync] Network restored, attempting auto-sync of queued repairs...');
        this.syncPendingQueue();
      });

      window.addEventListener('gramapala:network_online', () => {
        this.syncPendingQueue();
      });
    }
  }

  public static getInstance(): OfflineSyncService {
    if (!OfflineSyncService.instance) {
      OfflineSyncService.instance = new OfflineSyncService();
    }
    return OfflineSyncService.instance;
  }

  // Get all queued items
  public getQueuedSubmissions(): QueuedRepairSubmission[] {
    try {
      const data = localStorage.getItem(STORAGE_QUEUE_KEY);
      if (!data) return [];
      return JSON.parse(data) as QueuedRepairSubmission[];
    } catch (err) {
      console.error('[OfflineSync] Failed to read queue:', err);
      return [];
    }
  }

  // Save queue to local storage
  private saveQueue(queue: QueuedRepairSubmission[]): void {
    try {
      localStorage.setItem(STORAGE_QUEUE_KEY, JSON.stringify(queue));
      this.notifyQueueChanged();
    } catch (err) {
      console.error('[OfflineSync] Failed to save queue:', err);
    }
  }

  // Enqueue a repair submission when worker is in low/no signal rural area
  public enqueueRepairSubmission(
    complaintId: string,
    worker: WorkerInfo,
    task: Complaint,
    proofData: QueuedRepairSubmission['proofData']
  ): QueuedRepairSubmission {
    const queue = this.getQueuedSubmissions();
    const newEntry: QueuedRepairSubmission = {
      queueId: `sync_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      complaintId,
      workerId: worker.id,
      workerName: worker.name,
      assetName: task.assetName,
      ward: task.ward,
      queuedAt: new Date().toISOString(),
      proofData,
      retryCount: 0,
      status: 'pending',
    };

    queue.push(newEntry);
    this.saveQueue(queue);

    console.log(`[OfflineSync] Enqueued repair proof for ticket ${complaintId} (Asset: ${task.assetName})`);
    return newEntry;
  }

  // Remove a specific submission
  public removeSubmission(queueId: string): void {
    const queue = this.getQueuedSubmissions().filter((item) => item.queueId !== queueId);
    this.saveQueue(queue);
  }

  // Clear all
  public clearQueue(): void {
    this.saveQueue([]);
  }

  // Cache assigned tasks locally for complete offline inspection
  public cacheWorkerTasks(workerId: string, tasks: Complaint[]): void {
    try {
      const allCachedStr = localStorage.getItem(STORAGE_CACHED_TASKS_KEY);
      const allCached: Record<string, { tasks: Complaint[]; updatedAt: string }> = allCachedStr
        ? JSON.parse(allCachedStr)
        : {};

      allCached[workerId] = {
        tasks,
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem(STORAGE_CACHED_TASKS_KEY, JSON.stringify(allCached));
    } catch (err) {
      console.warn('[OfflineSync] Could not cache tasks offline:', err);
    }
  }

  public getCachedWorkerTasks(workerId: string): Complaint[] | null {
    try {
      const allCachedStr = localStorage.getItem(STORAGE_CACHED_TASKS_KEY);
      if (!allCachedStr) return null;
      const allCached = JSON.parse(allCachedStr);
      return allCached[workerId]?.tasks || null;
    } catch {
      return null;
    }
  }

  // Process sync queue
  public async syncPendingQueue(
    onItemSynced?: (item: QueuedRepairSubmission) => void
  ): Promise<{ syncedCount: number; failedCount: number }> {
    if (this.isSyncInProgress) {
      console.log('[OfflineSync] Sync already in progress, skipping duplicate call.');
      return { syncedCount: 0, failedCount: 0 };
    }

    const queue = this.getQueuedSubmissions();
    const pendingItems = queue.filter((i) => i.status === 'pending' || i.status === 'error');

    if (pendingItems.length === 0) {
      return { syncedCount: 0, failedCount: 0 };
    }

    this.isSyncInProgress = true;
    this.notifySyncStatus({ syncing: true, total: pendingItems.length, current: 0 });

    let syncedCount = 0;
    let failedCount = 0;

    for (let index = 0; index < pendingItems.length; index++) {
      const item = pendingItems[index];
      this.notifySyncStatus({ syncing: true, total: pendingItems.length, current: index + 1 });

      try {
        // Mark item as syncing
        this.updateItemStatus(item.queueId, 'syncing');

        // Simulate network upload time for photos/proof
        await new Promise((resolve) => setTimeout(resolve, 600));

        // Call callback or trigger global event
        if (onItemSynced) {
          onItemSynced(item);
        }

        window.dispatchEvent(
          new CustomEvent('gramapala:repair_proof_synced', {
            detail: {
              complaintId: item.complaintId,
              proofData: item.proofData,
              workerId: item.workerId,
              queueId: item.queueId,
            },
          })
        );

        // Remove from queue upon successful upload
        this.removeSubmission(item.queueId);
        syncedCount++;
      } catch (err: any) {
        console.error(`[OfflineSync] Failed to upload queued item ${item.queueId}:`, err);
        this.updateItemStatus(item.queueId, 'error', err?.message || 'Network upload timeout');
        failedCount++;
      }
    }

    this.isSyncInProgress = false;
    this.notifySyncStatus({ syncing: false, total: pendingItems.length, current: pendingItems.length });

    if (syncedCount > 0) {
      window.dispatchEvent(
        new CustomEvent('gramapala:toast', {
          detail: {
            title: '📡 Auto-Sync Completed!',
            message: `${syncedCount} offline task report(s) & photos uploaded successfully to GramaPala cloud.`,
            type: 'success',
          },
        })
      );
    }

    return { syncedCount, failedCount };
  }

  private updateItemStatus(
    queueId: string,
    status: QueuedRepairSubmission['status'],
    errorMessage?: string
  ) {
    const queue = this.getQueuedSubmissions();
    const updated = queue.map((i) => {
      if (i.queueId === queueId) {
        return {
          ...i,
          status,
          errorMessage,
          retryCount: status === 'error' ? i.retryCount + 1 : i.retryCount,
        };
      }
      return i;
    });
    this.saveQueue(updated);
  }

  private notifyQueueChanged() {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('gramapala:offline_queue_changed', {
          detail: { queue: this.getQueuedSubmissions() },
        })
      );
    }
  }

  private notifySyncStatus(status: { syncing: boolean; total: number; current: number }) {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('gramapala:offline_sync_status', {
          detail: status,
        })
      );
    }
  }
}

export const offlineSyncService = OfflineSyncService.getInstance();
