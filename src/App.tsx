import React, { useState, useEffect } from 'react';
import { 
  ActiveRole, 
  LanguageMode, 
  Asset, 
  Complaint, 
  WorkerInfo, 
  PdoNotificationAlert, 
  WorkOrder, 
  UserSession,
  OfficerDisciplinaryDossier,
  PauseRequest
} from './types';
import { THEMES } from './types/theme';
import { INITIAL_ASSETS, INITIAL_COMPLAINTS, INITIAL_WORKERS, MOCK_OFFICER_DOSSIERS } from './data/mockData';
import { AuthGateway } from './components/AuthGateway';
import { Navbar } from './components/Navbar';
import { CitizenHome } from './components/CitizenHome';
import { CitizenReportModal } from './components/CitizenReportModal';
import { CitizenVerifyModal } from './components/CitizenVerifyModal';
import { PanchayatDashboard } from './components/PanchayatDashboard';
import { WorkerDashboard } from './components/WorkerDashboard';
import { AssetPassportView } from './components/AssetPassportView';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { LiveCivicMapFeed } from './components/LiveCivicMapFeed';
import { TalukDashboard } from './components/TalukDashboard';
import { DistrictDashboard } from './components/DistrictDashboard';
import { StateDashboard } from './components/StateDashboard';
import { PerformanceLeaderboard } from './components/PerformanceLeaderboard';
import { AutomatedAlertsCenter } from './components/AutomatedAlertsCenter';
import { WhatsAppBotModal } from './components/WhatsAppBotModal';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';
import { PdoNotificationBanner } from './components/PdoNotificationBanner';
import { OfflineIndicator } from './components/OfflineIndicator';
import { Footer } from './components/Footer';
import { notifyPdoCriticalGrievance, isCriticalGrievance } from './utils/notificationSystem';
import { 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';

export default function App() {
  const [userSession, setUserSession] = useState<UserSession | null>(() => {
    try {
      const saved = localStorage.getItem('gramapala_session');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Session storage parse error', e);
    }
    return null; // Gateway opens first!
  });

  const [activeRole, setActiveRole] = useState<ActiveRole>(() => {
    return userSession ? userSession.activeRole : 'citizen';
  });
  const [lang, setLang] = useState<LanguageMode>('en');
  const [isWhatsAppBotOpen, setIsWhatsAppBotOpen] = useState<boolean>(false);

  // App State with local storage fallback
  const [assets, setAssets] = useState<Asset[]>(() => {
    try {
      const saved = localStorage.getItem('gramapala_assets') || localStorage.getItem('gramsetu_assets');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Asset storage parse error', e);
    }
    return INITIAL_ASSETS;
  });

  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    try {
      const saved = localStorage.getItem('gramapala_complaints') || localStorage.getItem('gramsetu_complaints');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Complaint storage parse error', e);
    }
    return INITIAL_COMPLAINTS;
  });

  const [workers, setWorkers] = useState<WorkerInfo[]>(INITIAL_WORKERS);
  const [currentWorkerId, setCurrentWorkerId] = useState<string>(INITIAL_WORKERS[0]?.id || 'W-01');
  const [selectedAssetId, setSelectedAssetId] = useState<string>(INITIAL_ASSETS[0]?.id || 'SL-0241');

  // Officer Disciplinary Dossiers (3-Strike Rule)
  const [officerDossiers, setOfficerDossiers] = useState<OfficerDisciplinaryDossier[]>(() => {
    try {
      const saved = localStorage.getItem('gramapala_officer_dossiers');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Dossier storage parse error', e);
    }
    return MOCK_OFFICER_DOSSIERS;
  });

  // Modals state
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [verifyComplaintTarget, setVerifyComplaintTarget] = useState<Complaint | null>(null);
  const [targetComplaintId, setTargetComplaintId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string; type: 'success' | 'alert' } | null>(null);

  // Finalized Karnataka Royal Navy & Gold Theme
  const currentTheme = THEMES.royal;

  // Persistent automated PDO notification alerts
  const [pdoAlerts, setPdoAlerts] = useState<PdoNotificationAlert[]>(() => {
    try {
      const saved = localStorage.getItem('gramapala_pdo_alerts') || localStorage.getItem('gramsetu_pdo_alerts');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Alert storage sync error', e);
    }
    const initialCritical = INITIAL_COMPLAINTS.find(
      (c) => c.id === 'CMP-2026-101' && c.status === 'Pending'
    );
    if (initialCritical) {
      return [notifyPdoCriticalGrievance(initialCritical)];
    }
    return [];
  });

  // Auto-sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('gramapala_assets', JSON.stringify(assets));
    } catch (e) {
      console.warn('Storage sync failed', e);
    }
  }, [assets]);

  useEffect(() => {
    try {
      localStorage.setItem('gramapala_complaints', JSON.stringify(complaints));
    } catch (e) {
      console.warn('Storage sync failed', e);
    }
  }, [complaints]);

  useEffect(() => {
    try {
      localStorage.setItem('gramapala_pdo_alerts', JSON.stringify(pdoAlerts));
    } catch (e) {
      console.warn('Storage sync failed', e);
    }
  }, [pdoAlerts]);

  useEffect(() => {
    try {
      localStorage.setItem('gramapala_officer_dossiers', JSON.stringify(officerDossiers));
    } catch (e) {
      console.warn('Storage sync failed', e);
    }
  }, [officerDossiers]);

  // Listen for background service worker / offline sync events
  useEffect(() => {
    const handleProofSynced = (e: any) => {
      const detail = e.detail;
      if (detail && detail.complaintId && detail.proofData) {
        handleSubmitRepairProof(detail.complaintId, detail.proofData);
      }
    };

    const handleCustomToast = (e: any) => {
      const detail = e.detail;
      if (detail && detail.title && detail.message) {
        showToast(detail.title, detail.message, detail.type || 'success');
      }
    };

    window.addEventListener('gramapala:repair_proof_synced', handleProofSynced);
    window.addEventListener('gramapala:toast', handleCustomToast);

    return () => {
      window.removeEventListener('gramapala:repair_proof_synced', handleProofSynced);
      window.removeEventListener('gramapala:toast', handleCustomToast);
    };
  }, []);

  const showToast = (title: string, desc: string, type: 'success' | 'alert' = 'success') => {
    setToastMessage({ title, desc, type });
    setTimeout(() => setToastMessage(null), 4500);
  };

  // 1. Citizen reports complaint (Multi-channel intake + BOQ + Trust scoring)
  const handleCreateComplaint = (newComplaintData: Partial<Complaint>) => {
    const newId = `CMP-2026-${Math.floor(100 + Math.random() * 900)}`;
    const fullComplaint: Complaint = {
      id: newId,
      assetId: newComplaintData.assetId || 'SL-0241',
      assetName: newComplaintData.assetName || 'Public Asset',
      category: newComplaintData.category || 'Streetlight',
      location: newComplaintData.location || 'Ward 3 Junction',
      ward: newComplaintData.ward || 'Ward 3',
      channel: newComplaintData.channel || 'Web Portal',
      reportedBy: newComplaintData.reportedBy || {
        name: 'Citizen',
        phone: '+91 98860 12390',
        village: 'Belavadi GP',
        trustProfile: {
          score: 94,
          status: 'Verified Citizen',
          accurateReportsCount: 4,
          totalSubmissions: 4,
          flaggedSpamAttempts: 0,
        },
      },
      reportedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      description: newComplaintData.description || '',
      descriptionKn: newComplaintData.descriptionKn,
      photoUrl: newComplaintData.photoUrl || '',
      voiceNote: newComplaintData.voiceNote,
      status: 'Pending',
      priority: newComplaintData.priority || 'High',
      slaDeadline: newComplaintData.slaDeadline || new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
      triage: newComplaintData.triage,
      billOfQuantities: newComplaintData.billOfQuantities,
      escalationState: {
        currentTier: 'Tier 1: BDO',
        dayElapsed: 0,
        slaDaysTotal: 7,
        amberAlertActive: false,
        strikesIssued: [],
        reopenWindowDaysRemaining: 15,
      },
      communityImpactScore: newComplaintData.communityImpactScore || 65,
      communityImpactDetails: newComplaintData.communityImpactDetails,
      gpsCoordinates: newComplaintData.gpsCoordinates,
      matchedAssetDistanceMeters: newComplaintData.matchedAssetDistanceMeters,
      contractorPaymentStatus: 'Pending Verification',
    };

    setComplaints((prev) => [fullComplaint, ...prev]);

    // Update corresponding asset failure count & repair history
    setAssets((prev) =>
      prev.map((asset) => {
        if (asset.id === fullComplaint.assetId) {
          const newFailCount = (asset.failureCount || 0) + 1;
          return {
            ...asset,
            status: 'Critical Failure',
            failureCount: newFailCount,
            isLemonAsset: newFailCount >= 3,
            repairHistory: [
              ...asset.repairHistory,
              {
                complaintId: newId,
                date: fullComplaint.reportedAt.split(' ')[0],
                issue: fullComplaint.description,
                resolvedInDays: 0,
                workerName: 'Pending Assignment',
                status: 'Pending',
                costInr: fullComplaint.billOfQuantities?.totalEstimatedInr || 0,
              },
            ],
          };
        }
        return asset;
      })
    );

    // Automated Notification System for Panchayat PDOs
    if (isCriticalGrievance(fullComplaint)) {
      const alertData = notifyPdoCriticalGrievance(fullComplaint);
      setPdoAlerts((prev) => [alertData, ...prev.filter((a) => a.complaintId !== alertData.complaintId)]);
      showToast(
        'Critical Grievance Dispatched to BDO/PDO!',
        `Automated SOS broadcast triggered for ${fullComplaint.category} via ${fullComplaint.channel}.`,
        'alert'
      );
    } else {
      showToast(
        'Grievance Registered Successfully!',
        `Complaint ${newId} logged via ${fullComplaint.channel}. Assigned to 7-Day BDO SLA Queue.`
      );
    }
  };

  // 2. Panchayat assigns field worker & dispatches Digital Work Order
  const handleAssignWorker = (complaintId: string, workerId: string, workOrder?: WorkOrder) => {
    const worker = workers.find((w) => w.id === workerId);
    if (!worker) return;

    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === complaintId) {
          return {
            ...c,
            status: 'Assigned',
            assignedWorker: worker,
            assignedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
            workOrder: workOrder || {
              orderId: `WO-2026-MYS-${Math.floor(100 + Math.random() * 900)}`,
              issuedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
              authorizedBudget: c.billOfQuantities?.totalEstimatedInr || 2200,
              actionType: 'Repair',
              targetSla: '24 Hours',
              pdoApprovalSignature: 'M. S. Patil (Belavadi PDO)',
              instructions: 'Inspect and repair asset according to technical specifications & certified BOQ items.',
            },
          };
        }
        return c;
      })
    );

    setPdoAlerts((prev) => prev.filter((a) => a.complaintId !== complaintId));

    setWorkers((prev) =>
      prev.map((w) => (w.id === workerId ? { ...w, activeTasks: w.activeTasks + 1 } : w))
    );

    setAssets((prev) =>
      prev.map((a) => {
        const matchingComplaint = complaints.find((c) => c.id === complaintId);
        if (matchingComplaint && a.id === matchingComplaint.assetId) {
          return { ...a, status: 'Under Repair' };
        }
        return a;
      })
    );

    showToast(
      'Work Order & Tender Dispatched!',
      `${worker.name} assigned. Digital work order ${workOrder?.orderId || ''} dispatched.`
    );
  };

  // 3. Pause Request Workflow (BDO requests -> EO reviews)
  const handleRequestPause = (complaintId: string, pauseData: { reason: PauseRequest['reason']; details: string; proofUrl?: string }) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const pauseReq: PauseRequest = {
      requestedBy: 'M. S. Patil (Belavadi BDO / PDO)',
      requestedAt: nowStr,
      reason: pauseData.reason,
      details: pauseData.details,
      proofUrl: pauseData.proofUrl || 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80',
      status: 'Pending',
    };

    setComplaints((prev) =>
      prev.map((c) => (c.id === complaintId ? { ...c, pauseRequest: pauseReq } : c))
    );

    showToast(
      'Pause Request Submitted to EO!',
      `Legitimate delay notice for ticket ${complaintId} forwarded to Taluk Executive Officer for statutory review.`
    );
  };

  const handleReviewPauseRequest = (complaintId: string, decision: 'Approved' | 'Rejected', reviewerNotes?: string) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === complaintId && c.pauseRequest) {
          return {
            ...c,
            pauseRequest: {
              ...c.pauseRequest,
              status: decision,
              reviewedBy: 'K. R. Jagadish (Taluk Executive Officer)',
              reviewedAt: nowStr,
              reviewerNotes: reviewerNotes || (decision === 'Approved' ? 'Weather / procurement delay verified on-site. SLA clock frozen.' : 'Delay justification insufficient. Proceed with emergency repair.'),
            },
          };
        }
        return c;
      })
    );

    showToast(
      `Pause Request ${decision}!`,
      decision === 'Approved' ? 'SLA clock frozen until site access restored.' : 'EO rejected pause. BDO must proceed immediately.',
      decision === 'Approved' ? 'success' : 'alert'
    );
  };

  // 4. Worker uploads repair proof
  const handleSubmitRepairProof = (
    complaintId: string,
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
    }
  ) => {
    const completionTimestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);

    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === complaintId) {
          return {
            ...c,
            status: 'Completed',
            escalationState: c.escalationState ? {
              ...c.escalationState,
              autoCloseTimeoutHoursRemaining: 48,
            } : undefined,
            repairProof: {
              photoUrl: proofData.photoUrl,
              beforePhotoUrl: proofData.beforePhotoUrl || c.photoUrl,
              completedAt: completionTimestamp,
              workerNotes: proofData.workerNotes,
              partsReplaced: proofData.partsReplaced,
              geoTag: proofData.geoTag,
              contractorVerified: true,
              actionType: proofData.actionType || 'Repair',
              repairCost: proofData.repairCost,
              qaVerification: proofData.qaVerification,
            },
          };
        }
        return c;
      })
    );

    setAssets((prev) =>
      prev.map((a) => {
        const matchingComplaint = complaints.find((c) => c.id === complaintId);
        if (matchingComplaint && a.id === matchingComplaint.assetId) {
          return {
            ...a,
            repairHistory: a.repairHistory.map((rec) => {
              if (rec.complaintId === complaintId) {
                return {
                  ...rec,
                  workerName: matchingComplaint.assignedWorker?.name || rec.workerName,
                  partsReplaced: proofData.partsReplaced?.join(', ') || rec.partsReplaced,
                  damagePhotoUrl: matchingComplaint.photoUrl || rec.damagePhotoUrl,
                  costInr: proofData.repairCost?.totalCost || rec.costInr || 1500,
                  repairProof: {
                    photoUrl: proofData.photoUrl,
                    completedAt: completionTimestamp,
                    workerNotes: proofData.workerNotes,
                    partsReplaced: proofData.partsReplaced,
                    geoTag: proofData.geoTag,
                    contractorVerified: true,
                    actionType: proofData.actionType || 'Repair',
                    repairCost: proofData.repairCost,
                    qaVerification: proofData.qaVerification,
                  },
                };
              }
              return rec;
            }),
          };
        }
        return a;
      })
    );

    showToast(
      'Repair Proof Submitted (48-Hr Fallback Active)',
      'Proof photo & parts log submitted. Citizen notified for inspection.'
    );
  };

  // 5. Citizen verification: FIXED or NOT FIXED (Two-Way Closed-Loop & Strike Logging)
  const handleVerifyDecision = (
    complaintId: string,
    decision: 'Fixed' | 'Not Fixed',
    feedback?: string,
    rating?: number
  ) => {
    const verifiedComplaint = complaints.find((c) => c.id === complaintId);
    if (!verifiedComplaint) return;

    if (decision === 'Fixed') {
      const isHighRating = (rating || 5) >= 4;
      setComplaints((prev) =>
        prev.map((c) => {
          if (c.id === complaintId) {
            return {
              ...c,
              status: 'Closed',
              contractorPaymentStatus: isHighRating ? 'Fast-Track Approved' : 'Pending Verification',
              citizenVerification: {
                verifiedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
                decision: 'Fixed',
                feedback,
                rating: rating || 5,
              },
            };
          }
          return c;
        })
      );

      // Update Asset Passport History & Future Failure Prediction
      setAssets((prev) =>
        prev.map((a) => {
          if (a.id === verifiedComplaint.assetId) {
            const nextMtbf = Math.max(90, Math.floor(140 - ((a.failureCount || 1) * 10)));
            const predDate = new Date();
            predDate.setDate(predDate.getDate() + nextMtbf);
            const predictedDateStr = predDate.toISOString().split('T')[0];

            return {
              ...a,
              status: 'Working',
              futureFailurePrediction: {
                predictedFailureDate: predictedDateStr,
                riskScore: 18,
                riskReason: 'Post-repair burn-in phase. Routine load monitoring active.',
                preventiveAction: 'Quarterly sensor diagnostic & terminal cleaning in next cycle.',
                estimatedMtbfDays: nextMtbf,
              },
              repairHistory: a.repairHistory.map((rec) => {
                if (rec.complaintId === complaintId) {
                  return {
                    ...rec,
                    status: 'Closed',
                    resolvedInDays: 1,
                    workerName: verifiedComplaint.assignedWorker?.name || 'Field Lineman',
                    costInr: verifiedComplaint.repairProof?.repairCost?.totalCost || rec.costInr || 1200,
                    partsReplaced: verifiedComplaint.repairProof?.partsReplaced?.join(', ') || 'Inspected and Refurbished',
                  };
                }
                return rec;
              }),
            };
          }
          return a;
        })
      );

      showToast(
        'Case Closed & Digital Invoice Fast-Tracked!',
        isHighRating 
          ? 'Citizen confirmed fix (★5). Fast-track digital invoice release authorized for contractor.' 
          : 'Citizen verified repair. Asset Passport history permanently updated.'
      );
    } else {
      // Reopen complaint & log penalty strike against contractor/worker
      setComplaints((prev) =>
        prev.map((c) => {
          if (c.id === complaintId) {
            return {
              ...c,
              status: 'Reopened',
              reopenCount: (c.reopenCount || 0) + 1,
              contractorPaymentStatus: 'Withheld / Penalty Penalty',
              citizenVerification: {
                verifiedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
                decision: 'Not Fixed',
                feedback,
              },
            };
          }
          return c;
        })
      );

      showToast(
        'Complaint Reopened & Contractor Strike Logged!',
        'Citizen rejected repair proof. Payment withheld and audit strike recorded.',
        'alert'
      );
    }
  };

  // 6. Manual & Automated SLA Escalation Trigger (BDO -> EO -> CEO -> RDPR)
  const handleEscalateComplaint = (complaintId: string, nextTier: 'Tier 2: EO' | 'Tier 3: CEO' | 'Tier 4: RDPR HQ', reason: string) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    let targetOfficerName = 'BDO Suresh Patil';
    let targetOfficerRole: 'BDO' | 'EO' | 'CEO' = 'BDO';

    if (nextTier === 'Tier 3: CEO') {
      targetOfficerName = 'EO G. N. Shivanna';
      targetOfficerRole = 'EO';
    } else if (nextTier === 'Tier 4: RDPR HQ') {
      targetOfficerName = 'CEO District Administration';
      targetOfficerRole = 'CEO';
    }

    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === complaintId) {
          const currentStrikes = c.escalationState?.strikesIssued || [];
          const newStrike = {
            targetRole: targetOfficerRole,
            targetName: targetOfficerName,
            strikeNumber: currentStrikes.length + 1,
            issuedAt: nowStr,
            reason: reason,
          };

          return {
            ...c,
            escalationState: {
              currentTier: nextTier,
              dayElapsed: nextTier === 'Tier 2: EO' ? 7 : nextTier === 'Tier 3: CEO' ? 10 : 12,
              slaDaysTotal: nextTier === 'Tier 2: EO' ? 10 : nextTier === 'Tier 3: CEO' ? 12 : 14,
              amberAlertActive: true,
              strikesIssued: [...currentStrikes, newStrike],
              reopenWindowDaysRemaining: 15,
            },
          };
        }
        return c;
      })
    );

    // Update Officer Disciplinary Dossiers (3-Strike Rule)
    setOfficerDossiers((prev) => {
      const existing = prev.find((d) => d.officerName.includes(targetOfficerRole));
      if (existing) {
        const newCount = existing.totalStrikes + 1;
        return prev.map((d) =>
          d.dossierId === existing.dossierId
            ? {
                ...d,
                totalStrikes: newCount,
                criticalCasesBreached: [...d.criticalCasesBreached, `${complaintId} (${reason})`],
                rdprActionStatus: newCount >= 3 ? 'Suspension Recommended' : 'Show-Cause Notice Served',
              }
            : d
        );
      } else {
        const newDossier: OfficerDisciplinaryDossier = {
          dossierId: `RDPR-DOS-2026-${Math.floor(100 + Math.random() * 900)}`,
          officerId: `OFF-${targetOfficerRole}-01`,
          officerName: targetOfficerName,
          designation: `${targetOfficerRole} Officer`,
          talukOrPanchayat: 'Belavadi GP / Mysuru Taluk',
          totalStrikes: 1,
          criticalCasesBreached: [`${complaintId} (${reason})`],
          dossierGeneratedAt: nowStr,
          rdprActionStatus: 'Pending Review',
        };
        return [newDossier, ...prev];
      }
    });

    showToast(
      `SLA Breach: Escalated to ${nextTier}!`,
      `Strike recorded against ${targetOfficerName}. Case re-routed for immediate administrative intervention.`,
      'alert'
    );
  };

  // 7. Auto-Close Fallback (48 Hours rule)
  const handleAutoCloseFallback = (complaintId: string) => {
    const target = complaints.find((c) => c.id === complaintId);
    if (!target || target.status !== 'Completed') return;

    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === complaintId) {
          return {
            ...c,
            status: 'Closed',
            citizenVerification: {
              verifiedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
              decision: 'Fixed',
              feedback: 'Auto-closed under 48-Hour Government Fallback Rule (No citizen dispute lodged).',
              rating: 4,
            },
          };
        }
        return c;
      })
    );

    showToast(
      '48-Hour Fallback Auto-Closed',
      `Ticket ${complaintId} automatically closed under statutory citizen audit fallback rules.`
    );
  };

  // Reset to original mock data for fresh demos
  const handleResetData = () => {
    localStorage.removeItem('gramapala_assets');
    localStorage.removeItem('gramapala_complaints');
    localStorage.removeItem('gramapala_pdo_alerts');
    localStorage.removeItem('gramapala_officer_dossiers');
    localStorage.removeItem('gramsetu_assets');
    localStorage.removeItem('gramsetu_complaints');
    localStorage.removeItem('gramsetu_pdo_alerts');
    setAssets(INITIAL_ASSETS);
    setComplaints(INITIAL_COMPLAINTS);
    setWorkers(INITIAL_WORKERS);
    setOfficerDossiers(MOCK_OFFICER_DOSSIERS);

    const initialCritical = INITIAL_COMPLAINTS.find(
      (c) => c.id === 'CMP-2026-101' && c.status === 'Pending'
    );
    if (initialCritical) {
      setPdoAlerts([notifyPdoCriticalGrievance(initialCritical)]);
    } else {
      setPdoAlerts([]);
    }

    showToast('Demo Reset', 'Reset all mock assets, complaints, dossiers, and timeline records to initial state.');
  };

  const handleDismissAlert = (alertId: string) => {
    setPdoAlerts((prev) => prev.filter((a) => a.id !== alertId));
  };

  const handleNavigateToAssign = (complaintId: string) => {
    setTargetComplaintId(complaintId);
    setActiveRole('panchayat');
    showToast(
      'PDO Command Center Active',
      `Assigned triage view for complaint ${complaintId}. Select certified technician to dispatch.`
    );
  };

  const handleNavigateToAsset = (assetId: string) => {
    setSelectedAssetId(assetId);
    setActiveRole('asset_passport');
  };

  const handleTriggerTestAlert = () => {
    const testComplaint: Complaint = {
      id: `CMP-2026-${Math.floor(200 + Math.random() * 700)}`,
      assetId: 'KA-MYS-WP-018',
      assetName: 'Drinking Water Pipeline #18',
      category: 'Water Supply',
      location: 'Maramma Temple Street, Ward 2',
      ward: 'Ward 2',
      channel: 'WhatsApp Bot',
      reportedBy: {
        name: 'Smt. Roopa Devi',
        phone: '+91 94481 99210',
        village: 'Belavadi GP',
        trustProfile: {
          score: 98,
          status: 'Verified Citizen',
          accurateReportsCount: 6,
          totalSubmissions: 6,
          flaggedSpamAttempts: 0,
        },
      },
      reportedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      description: 'Major drinking water pipe rupture flooding temple street. Water pressure zero across Ward 2.',
      descriptionKn: 'ಕುಡಿಯುವ ನೀರಿನ ಪೈಪ್ ಒಡೆದು ರಸ್ತೆಯಲ್ಲಿ ನೀರು ಹರಿಯುತ್ತಿದೆ. ವಾರ್ಡ್ ೨ ರಲ್ಲಿ ನೀರಿನ ಕೊರತೆ.',
      photoUrl: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80',
      status: 'Pending',
      priority: 'Critical',
      slaDeadline: new Date(Date.now() + 6 * 3600 * 1000).toISOString(),
      billOfQuantities: {
        items: [
          { item: '100mm PVC Union Socket', quantity: '2 Units', rateInr: 650, amountInr: 1300 },
          { item: 'Rubber Gasket & Solvent Cement', quantity: '1 Set', rateInr: 450, amountInr: 450 },
          { item: 'Hydraulic Trench Excavation', quantity: '3 Hours', rateInr: 500, amountInr: 1500 },
        ],
        materialCostInr: 1750,
        laborCostInr: 1500,
        contingencyInr: 350,
        totalEstimatedInr: 3600,
        preApprovedTenderLimitInr: 5000,
        isPreApproved: true,
      },
      triage: {
        assetType: 'Water Supply',
        damageSeverity: 'Critical',
        recommendedSLA: '6 Hours',
        specialistRequired: 'Plumbing & Hydraulic Technician',
        kannadaTitle: 'ಕುಡಿಯುವ ನೀರಿನ ಪೈಪ್ ಸೋರಿಕೆ - ತುರ್ತು ದುರಸ್ತಿ',
        formalSummaryEn: 'High-pressure pipeline burst at Maramma Temple Street. Urgent valve closure and pipe replacement required.',
        formalSummaryKn: 'ಕುಡಿಯುವ ನೀರಿನ ಪೈಪ್ ಒಡೆದಿದೆ. ತಕ್ಷಣ ಪ್ಲಂಬರ್ ನಿಯೋಜನೆ ಅಗತ್ಯ.',
        hazardWarning: 'Severe water wastage & road flooding. Risk of road sinkage.',
        suggestedAction: 'Isolate Ward 2 distribution valve, dispatch Ramesh Gowda (Plumber), replace 100mm PVC union socket.',
      },
    };
    handleCreateComplaint(testComplaint);
  };

  const handleLogin = (session: UserSession) => {
    setUserSession(session);
    setActiveRole(session.activeRole);
    if (session.category === 'worker' && session.idOrPhone) {
      setCurrentWorkerId(session.idOrPhone);
    }
    try {
      localStorage.setItem('gramapala_session', JSON.stringify(session));
    } catch (e) {
      console.warn('Storage sync failed', e);
    }
    showToast(
      lang === 'kn' ? `ಸ್ವಾಗತ, ${session.nameKn || session.name}!` : `Welcome, ${session.name}!`,
      lang === 'kn' ? `${session.designationKn || session.designation} (${session.badge})` : `Logged in as ${session.designation} (${session.badge})`,
      'success'
    );
  };

  const handleSwitchPortal = () => {
    setUserSession(null);
    try {
      localStorage.removeItem('gramapala_session');
    } catch (e) {
      console.warn('Storage sync failed', e);
    }
    showToast(
      lang === 'kn' ? 'ಲಾಗಿನ್ ದ್ವಾರಕ್ಕೆ ಮರಳಲಾಗಿದೆ' : 'Returned to Access Gateway',
      lang === 'kn' ? 'ಮತ್ತೊಂದು ವಿಭಾಗವನ್ನು ಆಯ್ಕೆಮಾಡಿ' : 'Select a login category to proceed',
      'alert'
    );
  };

  const safeComplaints = complaints || [];
  const pendingVerificationsCount = safeComplaints.filter((c) => c.status === 'Completed').length;
  const unassignedComplaintsCount = safeComplaints.filter((c) => c.status === 'Pending').length;
  const assignedTasksCount = safeComplaints.filter(
    (c) =>
      (c.status === 'Assigned' || c.status === 'In Progress') &&
      (!c.assignedWorker || c.assignedWorker.id === currentWorkerId)
  ).length;

  // Render AuthGateway if no active session
  if (!userSession) {
    return (
      <AuthGateway
        onLogin={handleLogin}
        lang={lang}
        onToggleLang={() => setLang((prev) => (prev === 'en' ? 'kn' : 'en'))}
      />
    );
  }

  return (
    <div className={`min-h-screen ${currentTheme.classes.appBg} ${currentTheme.classes.textPrimary} flex flex-col font-['Plus_Jakarta_Sans',sans-serif] transition-colors duration-300`}>
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 max-w-sm w-full animate-in fade-in slide-in-from-top-4 duration-300">
          <div
            className={`p-4 rounded-2xl shadow-xl border flex items-start space-x-3 ${
              toastMessage.type === 'alert'
                ? 'bg-red-50 border-red-200 text-red-950'
                : 'bg-emerald-50 border-emerald-200 text-emerald-950'
            }`}
          >
            {toastMessage.type === 'alert' ? (
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            )}
            <div className="text-xs">
              <div className="font-extrabold">{toastMessage.title}</div>
              <div className="text-slate-600 font-medium mt-0.5 leading-relaxed">{toastMessage.desc}</div>
            </div>
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        activeRole={activeRole}
        onRoleChange={setActiveRole}
        lang={lang}
        onToggleLang={() => setLang((prev) => (prev === 'en' ? 'kn' : 'en'))}
        pendingVerificationsCount={pendingVerificationsCount}
        unassignedComplaintsCount={unassignedComplaintsCount}
        assignedTasksCount={assignedTasksCount}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        theme={currentTheme}
        userSession={userSession}
        onSwitchPortal={handleSwitchPortal}
        onOpenWhatsAppBot={() => setIsWhatsAppBotOpen(true)}
      />

      {/* Persistent PDO Automated Notification Banner for Critical Grievances */}
      {activeRole === 'panchayat' && (
        <PdoNotificationBanner
          alerts={pdoAlerts}
          onDismissAlert={handleDismissAlert}
          onNavigateToAssign={handleNavigateToAssign}
          onNavigateToAsset={handleNavigateToAsset}
          lang={lang}
          onTriggerTestAlert={handleTriggerTestAlert}
        />
      )}

      {/* Main Role-Based Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeRole === 'citizen' && (
          <CitizenHome
            complaints={complaints}
            onOpenReportModal={() => setIsReportModalOpen(true)}
            onOpenVerifyModal={(comp) => setVerifyComplaintTarget(comp)}
            onOpenLiveMap={() => setActiveRole('live_map')}
            lang={lang}
            theme={currentTheme}
          />
        )}

        {activeRole === 'live_map' && (
          <LiveCivicMapFeed
            complaints={complaints}
            assets={assets}
            lang={lang}
            onToggleLang={() => setLang((prev) => (prev === 'en' ? 'kn' : 'en'))}
            onSelectAsset={(assetId) => {
              setSelectedAssetId(assetId);
              setActiveRole('asset_passport');
            }}
            onOpenReportModal={() => setIsReportModalOpen(true)}
            onOpenVerifyModal={(comp) => setVerifyComplaintTarget(comp)}
            onOpenPanchayatDispatch={(compId) => {
              setTargetComplaintId(compId);
              setActiveRole('panchayat');
            }}
            onOpenAnalytics={() => setActiveRole('analytics')}
          />
        )}

        {activeRole === 'panchayat' && (
          <PanchayatDashboard
            complaints={complaints}
            workers={workers}
            assets={assets}
            targetComplaintId={targetComplaintId}
            onAssignWorker={handleAssignWorker}
            onRequestPause={handleRequestPause}
            onEscalateComplaint={handleEscalateComplaint}
            onSelectAssetPassport={(assetId) => {
              setSelectedAssetId(assetId);
              setActiveRole('asset_passport');
            }}
            lang={lang}
          />
        )}

        {activeRole === 'taluk' && (
          <TalukDashboard
            complaints={complaints}
            officerDossiers={officerDossiers}
            onReviewPauseRequest={handleReviewPauseRequest}
            onEscalateToCEO={(complaintId, reason) => handleEscalateComplaint(complaintId, 'Tier 3: CEO', reason)}
            lang={lang}
            onSelectPanchayat={(gpId) => {
              setActiveRole('panchayat');
            }}
            onNavigateToDistrict={() => setActiveRole('district')}
            onNavigateToState={() => setActiveRole('state')}
          />
        )}

        {activeRole === 'district' && (
          <DistrictDashboard
            complaints={complaints}
            officerDossiers={officerDossiers}
            onEscalateToRDPR={(complaintId, reason) => handleEscalateComplaint(complaintId, 'Tier 4: RDPR HQ', reason)}
            lang={lang}
            onNavigateToTaluk={(tlkId) => {
              setActiveRole('taluk');
            }}
            onNavigateToState={() => setActiveRole('state')}
            onNavigateToPanchayat={() => setActiveRole('panchayat')}
          />
        )}

        {activeRole === 'state' && (
          <StateDashboard
            complaints={complaints}
            officerDossiers={officerDossiers}
            lang={lang}
            onNavigateToDistrict={(distId) => {
              setActiveRole('district');
            }}
            onNavigateToTaluk={(tlkId) => {
              setActiveRole('taluk');
            }}
            onNavigateToPanchayat={() => setActiveRole('panchayat')}
          />
        )}

        {activeRole === 'worker' && (
          <WorkerDashboard
            complaints={complaints}
            workers={workers}
            currentWorkerId={currentWorkerId}
            onSelectWorker={setCurrentWorkerId}
            onSubmitRepairProof={handleSubmitRepairProof}
            lang={lang}
          />
        )}

        {activeRole === 'leaderboard' && (
          <PerformanceLeaderboard
            lang={lang}
            complaints={complaints}
            workers={workers}
            onSelectPanchayat={(gpId) => setActiveRole('panchayat')}
          />
        )}

        {activeRole === 'alerts' && (
          <AutomatedAlertsCenter
            lang={lang}
            complaints={complaints}
            onTriggerTestAlert={handleTriggerTestAlert}
          />
        )}

        {activeRole === 'asset_passport' && (
          <AssetPassportView
            assets={assets}
            complaints={complaints}
            selectedAssetId={selectedAssetId}
            onSelectAsset={setSelectedAssetId}
            lang={lang}
          />
        )}

        {activeRole === 'analytics' && (
          <AnalyticsDashboard
            assets={assets}
            complaints={complaints}
            lang={lang}
            onSelectAsset={(assetId) => {
              setSelectedAssetId(assetId);
              setActiveRole('asset_passport');
            }}
          />
        )}
      </main>

      {/* Official Government of Karnataka Footer with Contact Details & Social Handles */}
      <Footer lang={lang} theme={currentTheme} />

      {/* Floating WhatsApp Quick Action Button */}
      <WhatsAppFloatingButton
        onClick={() => setIsWhatsAppBotOpen(true)}
        lang={lang}
      />

      {/* WhatsApp Interactive Bot Simulation Modal */}
      <WhatsAppBotModal
        isOpen={isWhatsAppBotOpen}
        onClose={() => setIsWhatsAppBotOpen(false)}
        lang={lang}
        onNewComplaintSubmitted={handleCreateComplaint}
      />

      {/* Modal 1: Report Issue */}
      <CitizenReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={handleCreateComplaint}
        lang={lang}
        assets={assets}
        complaints={complaints}
      />

      {/* Modal 2: Verify Repair Proof */}
      <CitizenVerifyModal
        isOpen={Boolean(verifyComplaintTarget)}
        complaint={verifyComplaintTarget}
        onClose={() => setVerifyComplaintTarget(null)}
        onVerifyDecision={handleVerifyDecision}
        lang={lang}
      />

      {/* Floating Offline & Sync Notification Ribbon */}
      <OfflineIndicator />
    </div>
  );
}
