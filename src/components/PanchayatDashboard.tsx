import React, { useState, useMemo, useEffect } from 'react';
import { Complaint, WorkerInfo, LanguageMode, Asset, WorkOrder, PauseRequest, BillOfQuantities } from '../types';
import { 
  Search, 
  UserCheck, 
  AlertCircle, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  ShieldAlert, 
  Wrench, 
  Phone, 
  Zap,
  X,
  FileText,
  Scale,
  ClipboardList,
  ArrowRight,
  DollarSign,
  Building2,
  Calendar,
  Check,
  PauseCircle,
  AlertTriangle,
  Receipt,
  Eye,
  Camera,
  Layers,
  Flame
} from 'lucide-react';

interface PanchayatDashboardProps {
  complaints: Complaint[];
  workers: WorkerInfo[];
  assets: Asset[];
  onAssignWorker: (complaintId: string, workerId: string, workOrder?: WorkOrder) => void;
  onRequestPause?: (complaintId: string, pauseData: { reason: PauseRequest['reason']; details: string; proofUrl?: string }) => void;
  onEscalateComplaint?: (complaintId: string, nextTier: 'Tier 2: EO' | 'Tier 3: CEO' | 'Tier 4: RDPR HQ', reason: string) => void;
  onSelectAssetPassport: (assetId: string) => void;
  lang: LanguageMode;
  targetComplaintId?: string | null;
}

export const PanchayatDashboard: React.FC<PanchayatDashboardProps> = ({
  complaints = [],
  workers = [],
  assets = [],
  onAssignWorker,
  onRequestPause,
  onEscalateComplaint,
  onSelectAssetPassport,
  lang,
  targetComplaintId,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('actionable');
  const [wardFilter, setWardFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>((complaints && complaints[0]) || null);
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>((workers && workers[0]?.id) || '');
  const [isAssignModalOpen, setIsAssignModalOpen] = useState<boolean>(false);
  const [isPauseModalOpen, setIsPauseModalOpen] = useState<boolean>(false);

  // Pause Request State
  const [pauseReason, setPauseReason] = useState<PauseRequest['reason']>('Monsoon Flooding / Inaccessible');
  const [pauseDetails, setPauseDetails] = useState<string>('Waterlogging exceeds 2.5ft following continuous heavy rains. Sub-grade excavation temporarily inaccessible.');
  const [pauseProofUrl, setPauseProofUrl] = useState<string>('https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80');

  // Work order configuration states
  const [workOrderActionType, setWorkOrderActionType] = useState<'Repair' | 'Replace'>('Repair');
  const [authorizedBudget, setAuthorizedBudget] = useState<number>(2400);
  const [targetSlaHours, setTargetSlaHours] = useState<number>(24);
  const [workOrderNotes, setWorkOrderNotes] = useState<string>('Inspect component failure, replace defective parts with certified spares, and upload geo-stamped repair proof.');

  // Check for Amber Alerts (Day 6 warning of 7-Day BDO SLA)
  const amberAlertTickets = useMemo(() => {
    return complaints.filter(
      (c) =>
        (c.status === 'Pending' || c.status === 'Assigned') &&
        (c.escalationState?.dayElapsed === 6 || c.escalationState?.amberAlertActive)
    );
  }, [complaints]);

  // Memoized task metrics
  const metrics = useMemo(() => {
    const list = complaints || [];
    const total = list.length;
    const pending = list.filter((c) => c.status === 'Pending').length;
    const inProgress = list.filter((c) => c.status === 'Assigned' || c.status === 'In Progress').length;
    const awaitingVerify = list.filter((c) => c.status === 'Completed').length;
    const closed = list.filter((c) => c.status === 'Closed').length;
    const reopened = list.filter((c) => c.status === 'Reopened').length;
    return { total, pending, inProgress, awaitingVerify, closed, reopened };
  }, [complaints]);

  // Synchronize targeted or updated complaint
  useEffect(() => {
    if (targetComplaintId) {
      const match = complaints.find((c) => c.id === targetComplaintId);
      if (match) {
        setSelectedComplaint(match);
        if (statusFilter !== 'all' && statusFilter !== match.status && statusFilter !== 'actionable') {
          setStatusFilter('all');
        }
        return;
      }
    }
    if (selectedComplaint) {
      const current = complaints.find((c) => c.id === selectedComplaint.id);
      if (current) {
        setSelectedComplaint(current);
        return;
      }
    }
    if (complaints.length > 0) {
      setSelectedComplaint(complaints[0]);
    }
  }, [targetComplaintId, complaints]);

  // Priority sort: actionable items first
  const priorityOrder: Record<string, number> = {
    Pending: 1,
    Reopened: 2,
    Assigned: 3,
    'In Progress': 4,
    Completed: 5,
    Closed: 6,
  };

  const filteredComplaints = useMemo(() => {
    return complaints
      .filter((c) => {
        if (statusFilter === 'actionable') {
          return c.status === 'Pending' || c.status === 'Reopened';
        }
        if (statusFilter === 'Assigned') {
          return c.status === 'Assigned' || c.status === 'In Progress';
        }
        if (statusFilter !== 'all' && c.status !== statusFilter) return false;
        if (wardFilter !== 'all' && c.ward !== wardFilter) return false;
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          return (
            c.id.toLowerCase().includes(q) ||
            c.assetName.toLowerCase().includes(q) ||
            c.location.toLowerCase().includes(q) ||
            c.category.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        const pA = priorityOrder[a.status] || 99;
        const pB = priorityOrder[b.status] || 99;
        return pA - pB;
      });
  }, [complaints, statusFilter, wardFilter, searchQuery]);

  // Matched asset for currently selected complaint
  const matchedAsset = useMemo(() => {
    if (!selectedComplaint) return null;
    return assets.find((a) => a.id === selectedComplaint.assetId) || assets[0];
  }, [selectedComplaint, assets]);

  // Calculate Repair vs Replace lifecycle recommendation
  const repairVsReplaceRecommendation = useMemo(() => {
    if (!matchedAsset) {
      return {
        recommendation: 'Repair' as const,
        justification: 'Standard component servicing recommended.',
        savings: 3500,
        action: 'Repair',
      };
    }
    const isLemon = matchedAsset.isLemonAsset || (matchedAsset.failureCount || 0) >= 3;
    const isWarranty = matchedAsset.isUnderWarranty;

    if (isLemon) {
      return {
        recommendation: 'Replace' as const,
        justification: `Asset ${matchedAsset.id} has broken down ${matchedAsset.failureCount} times. ${
          isWarranty ? 'Contractor warranty clause is active: claim free full unit replacement.' : 'Cumulative repair exceeds unit value. Recommend capital replacement under 15th FC grants.'
        }`,
        savings: isWarranty ? 14500 : 7200,
        action: 'Replace',
      };
    }
    return {
      recommendation: 'Repair' as const,
      justification: 'Minor isolated component failure. Component repair is 78% cheaper than asset retirement.',
      savings: 4200,
      action: 'Repair',
    };
  }, [matchedAsset]);

  const handleOpenAssign = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    const matchedWorker = workers.find((w) => {
      if (complaint.category === 'Streetlight' && w.trade.toLowerCase().includes('lineman')) return true;
      if (complaint.category.includes('Water') && w.trade.toLowerCase().includes('plumb')) return true;
      if (complaint.category.includes('Road') && w.trade.toLowerCase().includes('civil')) return true;
      return false;
    });
    if (matchedWorker) setSelectedWorkerId(matchedWorker.id);
    
    setWorkOrderActionType(repairVsReplaceRecommendation.recommendation);
    setAuthorizedBudget(
      complaint.billOfQuantities?.totalEstimatedInr || 
      (repairVsReplaceRecommendation.recommendation === 'Replace' ? 7500 : 2200)
    );
    setIsAssignModalOpen(true);
  };

  const handleConfirmAssign = () => {
    if (!selectedComplaint || !selectedWorkerId) return;
    
    const workOrder: WorkOrder = {
      orderId: `WO-2026-MYS-${Math.floor(100 + Math.random() * 900)}`,
      issuedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      authorizedBudget: authorizedBudget,
      actionType: workOrderActionType,
      targetSla: `${targetSlaHours} Hours`,
      pdoApprovalSignature: 'M. S. Patil (Belavadi BDO/PDO)',
      instructions: workOrderNotes,
    };

    onAssignWorker(selectedComplaint.id, selectedWorkerId, workOrder);
    setIsAssignModalOpen(false);
  };

  const handlePreApprovedTenderDispatch = (complaint: Complaint) => {
    if (!complaint) return;
    const matchedWorker = workers.find((w) => {
      if (complaint.category === 'Streetlight' && w.trade.toLowerCase().includes('lineman')) return true;
      if (complaint.category.includes('Water') && w.trade.toLowerCase().includes('plumb')) return true;
      if (complaint.category.includes('Road') && w.trade.toLowerCase().includes('civil')) return true;
      return false;
    }) || workers[0];

    const boqTotal = complaint.billOfQuantities?.totalEstimatedInr || 3200;
    const workOrder: WorkOrder = {
      orderId: `WO-TENDER-FAST-${Math.floor(100 + Math.random() * 900)}`,
      issuedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      authorizedBudget: boqTotal,
      actionType: 'Repair',
      targetSla: '24 Hours',
      pdoApprovalSignature: 'M. S. Patil (Belavadi BDO - Auto-Approved Tender)',
      instructions: `1-Click Fast-Track Tender Dispatch based on AI-verified Bill of Quantities (₹${boqTotal}). Execute repairs immediately.`,
    };

    onAssignWorker(complaint.id, matchedWorker.id, workOrder);
  };

  const handleSubmitPauseRequest = () => {
    if (!selectedComplaint || !onRequestPause) return;
    onRequestPause(selectedComplaint.id, {
      reason: pauseReason,
      details: pauseDetails,
      proofUrl: pauseProofUrl,
    });
    setIsPauseModalOpen(false);
  };

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Amber Alert Banner (Day 6 SLA Warning) */}
      {amberAlertTickets.length > 0 && (
        <div className="bg-amber-500 text-slate-950 p-4 rounded-3xl shadow-lg border-2 border-amber-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-pulse">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-950 text-amber-300 flex items-center justify-center shrink-0">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-amber-950">
                ⚠️ Statutory SLA Breach Warning — Day 6 of 7-Day Window
              </div>
              <div className="text-sm font-extrabold text-slate-950">
                {amberAlertTickets.length} grievance(s) nearing Day 7 SLA breach. Strike 1 will be logged if unresolved in 24 hours.
              </div>
            </div>
          </div>
          <div className="text-xs font-black bg-slate-950 text-white px-3 py-1.5 rounded-xl shrink-0">
            Escalates to EO in 24h
          </div>
        </div>
      )}

      {/* Top BDO / PDO Command Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">
              Tier 1 Administrative Console • 7-Day Statutory SLA
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">
            {lang === 'kn' ? 'ಬೆಳವಡಿ ಗ್ರಾಮ ಪಂಚಾಯತ್ - ಬಿ.ಡಿ.ಒ / ಪಿ.ಡಿ.ಒ ಕಮಾಂಡ್ ಡೆಸ್ಕ್' : 'Belavadi Gram Panchayat — BDO & PDO Operations Desk'}
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Triage citizen grievances with AI-Estimated BOQs, dispatch 1-click pre-approved tenders, and manage legitimate pause workflows.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-amber-50 border border-amber-300 px-3 py-1.5 rounded-2xl text-xs font-bold text-amber-900 flex items-center space-x-2">
            <Scale className="w-4 h-4 text-amber-600" />
            <span>3-Strike Disciplinary Rule Active</span>
          </div>
        </div>
      </div>

      {/* Metric Counters Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <button
          onClick={() => setStatusFilter('actionable')}
          className={`p-3 rounded-2xl border text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 cursor-pointer ${
            statusFilter === 'actionable'
              ? 'bg-red-50 border-red-300 ring-2 ring-red-400'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-[11px] font-bold text-red-700">Action Required</div>
          <div className="text-xl font-black text-slate-900 mt-0.5">{metrics.pending + metrics.reopened}</div>
          <div className="text-[10px] text-slate-400 font-medium">Needs Work Order</div>
        </button>

        <button
          onClick={() => setStatusFilter('Pending')}
          className={`p-3 rounded-2xl border text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 cursor-pointer ${
            statusFilter === 'Pending'
              ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-400'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-[11px] font-bold text-amber-700">New Grievances</div>
          <div className="text-xl font-black text-slate-900 mt-0.5">{metrics.pending}</div>
          <div className="text-[10px] text-slate-400 font-medium">7-Day SLA Clock</div>
        </button>

        <button
          onClick={() => setStatusFilter('Assigned')}
          className={`p-3 rounded-2xl border text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 cursor-pointer ${
            statusFilter === 'Assigned'
              ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-400'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-[11px] font-bold text-blue-700">Tenders & Work Orders</div>
          <div className="text-xl font-black text-slate-900 mt-0.5">{metrics.inProgress}</div>
          <div className="text-[10px] text-slate-400 font-medium">Technicians in Field</div>
        </button>

        <button
          onClick={() => setStatusFilter('Completed')}
          className={`p-3 rounded-2xl border text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 cursor-pointer ${
            statusFilter === 'Completed'
              ? 'bg-purple-50 border-purple-300 ring-2 ring-purple-400'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-[11px] font-bold text-purple-700">48-Hr Fallback Queue</div>
          <div className="text-xl font-black text-slate-900 mt-0.5">{metrics.awaitingVerify}</div>
          <div className="text-[10px] text-slate-400 font-medium">Citizen Audit Active</div>
        </button>

        <button
          onClick={() => setStatusFilter('Closed')}
          className={`p-3 rounded-2xl border text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 cursor-pointer ${
            statusFilter === 'Closed'
              ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-400'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-[11px] font-bold text-emerald-700">Verified & Invoiced</div>
          <div className="text-xl font-black text-slate-900 mt-0.5">{metrics.closed}</div>
          <div className="text-[10px] text-slate-400 font-medium">Fast-Track Paid</div>
        </button>

        <button
          onClick={() => setStatusFilter('all')}
          className={`p-3 rounded-2xl border text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 cursor-pointer ${
            statusFilter === 'all'
              ? 'bg-slate-100 border-slate-400 ring-2 ring-slate-400'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-[11px] font-bold text-slate-700">Total Lifecycle</div>
          <div className="text-xl font-black text-slate-900 mt-0.5">{metrics.total}</div>
          <div className="text-[10px] text-slate-400 font-medium">All Grievances</div>
        </button>
      </div>

      {/* Main Split Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Complaints Feed (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Filter toolbar */}
            <div className="p-3.5 border-b border-slate-100 flex flex-wrap gap-2.5 items-center justify-between">
              <div className="relative flex-1 min-w-[180px]">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search grievance ID, asset, channel, ward..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <select
                value={wardFilter}
                onChange={(e) => setWardFilter(e.target.value)}
                className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
              >
                <option value="all">All Wards</option>
                <option value="Ward 1">Ward 1</option>
                <option value="Ward 2">Ward 2</option>
                <option value="Ward 3">Ward 3</option>
                <option value="Ward 4">Ward 4</option>
              </select>
            </div>

            {/* List */}
            <div className="divide-y divide-slate-100 max-h-[640px] overflow-y-auto">
              {filteredComplaints.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  No grievances found matching this filter.
                </div>
              ) : (
                filteredComplaints.map((c) => {
                  const isSelected = selectedComplaint?.id === c.id;
                  const isActionable = c.status === 'Pending' || c.status === 'Reopened';
                  const isPaused = c.pauseRequest?.status === 'Approved';

                  return (
                    <div
                      key={c.id}
                      onClick={() => setSelectedComplaint(c)}
                      className={`p-3.5 hover:bg-slate-50/90 transition-all duration-150 active:scale-[0.995] cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected ? 'bg-amber-50/60 border-l-4 border-amber-600 shadow-xs' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <img
                          src={c.photoUrl}
                          alt="Grievance thumbnail"
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="space-y-0.5">
                          <div className="flex items-center space-x-2 flex-wrap">
                            <span className="text-xs font-mono font-black text-indigo-700">{c.id}</span>
                            <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                              {c.category}
                            </span>
                            <span className="text-[10px] text-slate-500 font-bold">{c.ward}</span>
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                              {c.channel || 'Web Portal'}
                            </span>
                            {c.billOfQuantities && (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                                BOQ: ₹{c.billOfQuantities.totalEstimatedInr}
                              </span>
                            )}
                            {isPaused && (
                              <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 flex items-center space-x-1">
                                <PauseCircle className="w-2.5 h-2.5 text-amber-700" />
                                <span>Clock Paused</span>
                              </span>
                            )}
                          </div>
                          <h4 className="text-xs font-black text-slate-900 leading-snug">{c.assetName}</h4>
                          <p className="text-[11px] text-slate-500 line-clamp-1">{c.location}</p>
                        </div>
                      </div>

                      <div className="text-right space-y-1.5 shrink-0 flex flex-col items-end">
                        <span
                          className={`inline-block text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            c.status === 'Pending'
                              ? 'bg-red-100 text-red-800'
                              : c.status === 'Assigned' || c.status === 'In Progress'
                              ? 'bg-blue-100 text-blue-800'
                              : c.status === 'Completed'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {c.status}
                        </span>

                        {isActionable ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenAssign(c);
                            }}
                            className="flex items-center space-x-1 bg-amber-600 hover:bg-amber-700 text-white px-2.5 py-1 rounded-lg text-[10px] font-black shadow-xs transition-all cursor-pointer"
                          >
                            <ClipboardList className="w-3 h-3" />
                            <span>Work Order</span>
                          </button>
                        ) : (
                          <div className="text-[10px] text-slate-400 font-medium">
                            {c.workOrder?.orderId || 'SLA 7 Days'}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right: Selected Grievance, AI-Estimated BOQ, Asset Passport & Actions (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {selectedComplaint ? (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 space-y-4 sticky top-20">
              {/* Header */}
              <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-black text-indigo-700">{selectedComplaint.id}</span>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.2 rounded-full uppercase ${
                        selectedComplaint.status === 'Pending'
                          ? 'bg-red-100 text-red-800'
                          : selectedComplaint.status === 'Completed'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {selectedComplaint.status}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500">
                      Tier 1 BDO SLA (7 Days)
                    </span>
                  </div>
                  <h3 className="text-sm font-black text-slate-900 mt-1">{selectedComplaint.assetName}</h3>
                </div>

                <button
                  onClick={() => onSelectAssetPassport(selectedComplaint.assetId)}
                  className="text-[11px] font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-xl transition-colors cursor-pointer border border-amber-200"
                >
                  View Passport ➔
                </button>
              </div>

              {/* Photo & Reporter Info */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 h-36">
                <img
                  src={selectedComplaint.photoUrl}
                  alt="Grievance Photo"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-3 text-white text-xs">
                  <div className="font-bold flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-300" />
                    <span>{selectedComplaint.location}</span>
                  </div>
                  <div className="text-[11px] text-slate-300 mt-0.5 flex items-center justify-between">
                    <span>Reported by: {selectedComplaint.reportedBy.name}</span>
                    <span className="text-amber-300 font-bold">Via {selectedComplaint.channel}</span>
                  </div>
                </div>
              </div>

              {/* 🧾 AI-Estimated Bill of Quantities (BOQ) with 1-Click Pre-Approved Tender */}
              {selectedComplaint.billOfQuantities && (
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5 text-xs font-black text-emerald-950">
                      <Receipt className="w-4 h-4 text-emerald-700" />
                      <span>AI-Estimated Bill of Quantities (BOQ)</span>
                    </div>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                      Pre-Approved ≤ ₹{(selectedComplaint.billOfQuantities.preApprovedTenderLimitInr ?? 25000).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="bg-white rounded-xl border border-emerald-100 divide-y divide-slate-100 text-xs overflow-hidden">
                    {selectedComplaint.billOfQuantities.items.map((item, idx) => (
                      <div key={idx} className="p-2 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-slate-800">{item.item}</div>
                          <div className="text-[10px] text-slate-500">Qty: {item.quantity} @ ₹{item.rateInr}</div>
                        </div>
                        <div className="font-black text-slate-900">₹{item.amountInr}</div>
                      </div>
                    ))}
                    <div className="p-2 bg-emerald-50/50 flex items-center justify-between font-black text-emerald-950">
                      <span>Total Estimated Cost</span>
                      <span className="text-sm">₹{(selectedComplaint.billOfQuantities.totalEstimatedInr ?? 0).toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {selectedComplaint.status === 'Pending' && (
                    <button
                      onClick={() => handlePreApprovedTenderDispatch(selectedComplaint)}
                      className="w-full flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-3 rounded-xl text-xs font-black shadow-xs transition-all cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>1-Click Pre-Approved Tender & Lineman Dispatch</span>
                    </button>
                  )}
                </div>
              )}

              {/* Pause Request Status & Button */}
              {selectedComplaint.pauseRequest ? (
                <div className={`p-3 rounded-2xl border text-xs space-y-1 ${
                  selectedComplaint.pauseRequest.status === 'Approved'
                    ? 'bg-amber-50 border-amber-300 text-amber-950'
                    : selectedComplaint.pauseRequest.status === 'Pending'
                    ? 'bg-slate-50 border-slate-200 text-slate-800'
                    : 'bg-rose-50 border-rose-200 text-rose-950'
                }`}>
                  <div className="flex items-center justify-between font-black">
                    <span className="flex items-center space-x-1.5">
                      <PauseCircle className="w-4 h-4 text-amber-600" />
                      <span>Legitimate Pause Request: {selectedComplaint.pauseRequest.status}</span>
                    </span>
                    <span className="text-[10px] text-slate-500">{selectedComplaint.pauseRequest.requestedAt}</span>
                  </div>
                  <p className="text-[11px] font-medium leading-relaxed">{selectedComplaint.pauseRequest.reason}: {selectedComplaint.pauseRequest.details}</p>
                  {selectedComplaint.pauseRequest.reviewerNotes && (
                    <div className="text-[10px] font-bold pt-1 border-t border-slate-200">
                      EO Review: {selectedComplaint.pauseRequest.reviewerNotes}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedComplaint(selectedComplaint);
                      setIsPauseModalOpen(true);
                    }}
                    className="flex-1 flex items-center justify-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 py-2 px-3 rounded-xl text-xs font-bold border border-slate-300 transition-all cursor-pointer"
                  >
                    <PauseCircle className="w-3.5 h-3.5 text-slate-600" />
                    <span>Submit Legitimate Delay Pause (To EO)</span>
                  </button>
                </div>
              )}

              {/* Work Order Action Button */}
              {selectedComplaint.status === 'Pending' || selectedComplaint.status === 'Reopened' ? (
                <button
                  onClick={() => handleOpenAssign(selectedComplaint)}
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-600 to-indigo-700 hover:from-amber-700 hover:to-indigo-800 text-white py-3 px-4 rounded-2xl text-xs font-black shadow-md transition-all cursor-pointer"
                >
                  <ClipboardList className="w-4 h-4" />
                  <span>Custom Digital Work Order & Assign Technician</span>
                </button>
              ) : selectedComplaint.workOrder ? (
                <div className="bg-blue-50 border border-blue-200 p-3 rounded-2xl text-xs space-y-1">
                  <div className="flex items-center justify-between font-black text-blue-950">
                    <span>Work Order: {selectedComplaint.workOrder.orderId}</span>
                    <span className="px-2 py-0.2 rounded bg-blue-200 text-blue-900 uppercase text-[10px]">
                      {selectedComplaint.workOrder.actionType}
                    </span>
                  </div>
                  <div className="text-slate-600 text-[11px]">
                    Authorized Budget: ₹{selectedComplaint.workOrder.authorizedBudget} • Target SLA: {selectedComplaint.workOrder.targetSla}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Signed by: {selectedComplaint.workOrder.pdoApprovalSignature}
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center text-slate-400">
              Select a complaint from the left to view asset history and issue work orders.
            </div>
          )}
        </div>
      </div>

      {/* 📝 Step: Digital Work Order Modal */}
      {isAssignModalOpen && selectedComplaint && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="relative bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 overflow-hidden my-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <ClipboardList className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    Issue Digital Work Order: {selectedComplaint.id}
                  </h3>
                  <p className="text-xs text-slate-500">{selectedComplaint.assetName}</p>
                </div>
              </div>
              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 pt-3">
              {/* Action Type & Budget */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Action Type (Recommended)
                  </label>
                  <select
                    value={workOrderActionType}
                    onChange={(e) => setWorkOrderActionType(e.target.value as 'Repair' | 'Replace')}
                    className="w-full text-xs font-bold px-3 py-2 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-amber-500 cursor-pointer"
                  >
                    <option value="Repair">Repair / Component Servicing</option>
                    <option value="Replace">Complete Unit Replacement</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Authorized Budget (₹)
                  </label>
                  <input
                    type="number"
                    value={authorizedBudget}
                    onChange={(e) => setAuthorizedBudget(Number(e.target.value))}
                    className="w-full text-xs font-bold px-3 py-2 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-amber-500"
                  >
                  </input>
                </div>
              </div>

              {/* Target SLA */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Target Field Execution SLA Window
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[12, 24, 48].map((hrs) => (
                    <button
                      key={hrs}
                      type="button"
                      onClick={() => setTargetSlaHours(hrs)}
                      className={`py-1.5 text-xs font-black rounded-xl border cursor-pointer transition-all ${
                        targetSlaHours === hrs
                          ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {hrs} Hours
                    </button>
                  ))}
                </div>
              </div>

              {/* Worker Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Assign Certified Field Worker
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {workers.map((worker) => {
                    const isSelected = selectedWorkerId === worker.id;
                    return (
                      <div
                        key={worker.id}
                        onClick={() => setSelectedWorkerId(worker.id)}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/70 shadow-xs ring-1 ring-indigo-500'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${
                              isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {worker.name[0]}
                          </div>
                          <div>
                            <div className="text-xs font-black text-slate-900">{worker.name}</div>
                            <div className="text-[11px] text-slate-500">{worker.trade}</div>
                          </div>
                        </div>

                        <div className="text-right text-[11px] font-medium text-slate-600">
                          <div>★ {worker.rating}</div>
                          <div className="text-slate-400">{worker.activeTasks} active</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Instructions */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Panchayat Instructions to Worker
                </label>
                <textarea
                  rows={2}
                  value={workOrderNotes}
                  onChange={(e) => setWorkOrderNotes(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white"
                />
              </div>

              {/* Actions */}
              <div className="pt-3 flex items-center justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmAssign}
                  className="flex items-center space-x-1.5 bg-gradient-to-r from-amber-600 to-indigo-600 hover:from-amber-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-md transition-all cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Dispatch Digital Work Order</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ⏸️ Modal: Legitimate Delay Pause Request */}
      {isPauseModalOpen && selectedComplaint && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="relative bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 overflow-hidden my-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <PauseCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    Submit Legitimate Pause Request
                  </h3>
                  <p className="text-xs text-slate-500">Ticket {selectedComplaint.id} • Requires Taluk EO Approval</p>
                </div>
              </div>
              <button
                onClick={() => setIsPauseModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Legitimate Cause of Delay
                </label>
                <select
                  value={pauseReason}
                  onChange={(e) => setPauseReason(e.target.value as PauseRequest['reason'])}
                  className="w-full text-xs font-bold px-3 py-2 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-amber-500 cursor-pointer"
                >
                  <option value="Monsoon Flooding / Inaccessible">Monsoon Flooding / Inaccessible</option>
                  <option value="Specialized Parts Procurement Delay">Specialized Parts Procurement Delay</option>
                  <option value="Power Grid Disconnection Required">Power Grid Disconnection Required (KPTCL)</option>
                  <option value="Civil Structural Re-engineering Needed">Civil Structural Re-engineering Needed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Site Evidence Photo URL
                </label>
                <input
                  type="text"
                  value={pauseProofUrl}
                  onChange={(e) => setPauseProofUrl(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Engineering Justification & Field Notes
                </label>
                <textarea
                  rows={3}
                  value={pauseDetails}
                  onChange={(e) => setPauseDetails(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white"
                />
              </div>
            </div>

            <div className="pt-3 flex items-center justify-end space-x-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsPauseModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitPauseRequest}
                className="flex items-center space-x-1.5 bg-amber-600 hover:bg-amber-700 text-white px-5 py-2 rounded-xl text-xs font-black shadow-xs transition-all cursor-pointer"
              >
                <PauseCircle className="w-4 h-4" />
                <span>Submit to Executive Officer (EO)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
