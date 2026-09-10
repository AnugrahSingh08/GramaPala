import React, { useEffect, useState } from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { offlineSyncService, QueuedRepairSubmission } from '../services/offlineSyncService';
import { WifiOff, Wifi, RefreshCw, Layers, CheckCircle2, AlertCircle, SignalHigh, SignalLow } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const { isOnline, isSimulatedOffline, toggleSimulatedOffline } = useOnlineStatus();
  const [queuedCount, setQueuedCount] = useState<number>(0);
  const [syncStatus, setSyncStatus] = useState<{ syncing: boolean; total: number; current: number }>({
    syncing: false,
    total: 0,
    current: 0,
  });
  const [isQueueModalOpen, setIsQueueModalOpen] = useState(false);
  const [queuedItems, setQueuedItems] = useState<QueuedRepairSubmission[]>([]);

  useEffect(() => {
    const updateQueue = () => {
      const items = offlineSyncService.getQueuedSubmissions();
      setQueuedItems(items);
      setQueuedCount(items.length);
    };

    updateQueue();

    const handleQueueChange = (e: any) => {
      const items = e.detail?.queue || offlineSyncService.getQueuedSubmissions();
      setQueuedItems(items);
      setQueuedCount(items.length);
    };

    const handleSyncStatus = (e: any) => {
      if (e.detail) {
        setSyncStatus(e.detail);
      }
    };

    window.addEventListener('gramapala:offline_queue_changed', handleQueueChange);
    window.addEventListener('gramapala:offline_sync_status', handleSyncStatus);

    return () => {
      window.removeEventListener('gramapala:offline_queue_changed', handleQueueChange);
      window.removeEventListener('gramapala:offline_sync_status', handleSyncStatus);
    };
  }, []);

  const handleManualSync = () => {
    if (isSimulatedOffline) {
      toggleSimulatedOffline(false);
    }
    offlineSyncService.syncPendingQueue();
  };

  return (
    <>
      {/* Floating Offline & Sync Notification Ribbon */}
      <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-auto">
        {syncStatus.syncing && (
          <div className="flex items-center gap-2 rounded-2xl bg-indigo-950 text-white border border-indigo-700 px-3.5 py-2 text-xs font-bold shadow-xl animate-pulse">
            <RefreshCw className="w-4 h-4 text-indigo-400 animate-spin shrink-0" />
            <span>
              Auto-syncing {syncStatus.current}/{syncStatus.total} offline repair proofs to cloud...
            </span>
          </div>
        )}

        {!isOnline && (
          <div className="flex items-center justify-between gap-3 rounded-2xl bg-slate-900/95 backdrop-blur-md text-white border border-amber-500/40 p-3 text-xs font-semibold shadow-2xl">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <WifiOff className="w-4 h-4" />
              </div>
              <div>
                <div className="font-black text-amber-300 flex items-center gap-1.5">
                  <span>Offline (Rural Area)</span>
                  {isSimulatedOffline && (
                    <span className="text-[10px] bg-amber-500/30 text-amber-200 px-1.5 py-0.2 rounded">Simulated</span>
                  )}
                </div>
                <div className="text-[11px] text-slate-300">
                  {queuedCount > 0 ? `${queuedCount} repair(s) queued for auto-upload` : 'All tasks cached for offline work'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {queuedCount > 0 && (
                <button
                  onClick={() => setIsQueueModalOpen(true)}
                  className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 px-2 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer"
                >
                  View ({queuedCount})
                </button>
              )}
              <button
                onClick={() => toggleSimulatedOffline(!isSimulatedOffline)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-2 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer flex items-center gap-1"
                title="Restore simulated network connection"
              >
                <Wifi className="w-3 h-3" />
                <span>Reconnect</span>
              </button>
            </div>
          </div>
        )}

        {isOnline && queuedCount > 0 && !syncStatus.syncing && (
          <div className="flex items-center justify-between gap-2 rounded-2xl bg-emerald-950 text-emerald-100 border border-emerald-600 p-2.5 text-xs font-semibold shadow-lg">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>{queuedCount} pending report(s) ready to sync</span>
            </div>
            <button
              onClick={handleManualSync}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-2.5 py-1 rounded-lg text-xs font-black transition cursor-pointer"
            >
              Sync Now
            </button>
          </div>
        )}
      </div>

      {/* Queued Items Modal */}
      {isQueueModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-5 shadow-2xl border border-slate-200 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-amber-600" />
                  <span>Offline Upload Queue ({queuedItems.length})</span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  Photos and repair logs stored in local cache. Will auto-upload on 4G signal.
                </p>
              </div>
              <button
                onClick={() => setIsQueueModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-3 space-y-2.5">
              {queuedItems.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400 font-medium">
                  Queue is empty. All repair proofs are synchronized with the cloud!
                </div>
              ) : (
                queuedItems.map((item) => (
                  <div key={item.queueId} className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-mono text-[10px] font-bold text-indigo-600">{item.complaintId}</span>
                        <h4 className="font-black text-slate-900">{item.assetName}</h4>
                        <div className="text-[10px] text-slate-500">{item.ward} • {item.workerName}</div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                        item.status === 'syncing' ? 'bg-indigo-100 text-indigo-800 animate-pulse' :
                        item.status === 'error' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {item.status.toUpperCase()}
                      </span>
                    </div>

                    {item.proofData.photoUrl && (
                      <div className="flex items-center gap-2">
                        <img
                          src={item.proofData.photoUrl}
                          alt="Offline Repair Proof"
                          className="w-12 h-12 rounded-lg object-cover border border-slate-200"
                        />
                        <div className="text-[11px] text-slate-600 flex-1 truncate">
                          {item.proofData.workerNotes || 'Repair completed'}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200">
                      <span>Queued: {new Date(item.queuedAt).toLocaleTimeString()}</span>
                      <span>₹{item.proofData.repairCost?.totalCost || 0}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => offlineSyncService.clearQueue()}
                className="text-xs font-bold text-red-600 hover:text-red-700 px-3 py-1.5 rounded-xl hover:bg-red-50 cursor-pointer"
              >
                Clear Queue
              </button>
              <button
                onClick={() => {
                  handleManualSync();
                  setIsQueueModalOpen(false);
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Upload Now</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
