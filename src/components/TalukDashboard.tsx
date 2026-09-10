import React, { useState, useMemo } from 'react';
import { 
  GramPanchayatPerformance, 
  LanguageMode,
  Complaint,
  OfficerDisciplinaryDossier
} from '../types';
import { MYSURU_TALUK_PANCHAYATS_DATA } from '../data/governanceHierarchyData';
import { 
  Building2, 
  TrendingUp, 
  AlertTriangle, 
  ShieldCheck, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  Search, 
  Filter, 
  ArrowUpRight, 
  ChevronRight, 
  Phone, 
  Award, 
  BarChart3, 
  Layers,
  Sparkles,
  Info,
  Check,
  PauseCircle,
  ShieldAlert,
  Flame,
  ArrowRight,
  Gavel,
  Zap,
  Users
} from 'lucide-react';

interface TalukDashboardProps {
  lang: LanguageMode;
  complaints?: Complaint[];
  officerDossiers?: OfficerDisciplinaryDossier[];
  onReviewPauseRequest?: (complaintId: string, decision: 'Approved' | 'Rejected', notes?: string) => void;
  onEscalateToCEO?: (complaintId: string, reason: string) => void;
  onSelectPanchayat?: (panchayatId: string) => void;
  onNavigateToDistrict?: () => void;
  onNavigateToState?: () => void;
}

export const TalukDashboard: React.FC<TalukDashboardProps> = ({
  lang,
  complaints = [],
  officerDossiers = [],
  onReviewPauseRequest,
  onEscalateToCEO,
  onSelectPanchayat,
  onNavigateToDistrict,
  onNavigateToState,
}) => {
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'escalations' | 'dossiers'>('leaderboard');
  const [panchayats, setPanchayats] = useState<GramPanchayatPerformance[]>(MYSURU_TALUK_PANCHAYATS_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Exemplary' | 'Normal' | 'Needs Attention' | 'Critical Alert'>('All');
  const [sortBy, setSortBy] = useState<'rank' | 'healthScore' | 'activeComplaints' | 'budgetSpent'>('rank');
  const [selectedGpForModal, setSelectedGpForModal] = useState<GramPanchayatPerformance | null>(null);

  // Filter complaints escalated to Tier 2 (EO Level) or with Pending Pause Requests
  const eoEscalatedComplaints = useMemo(() => {
    return complaints.filter(
      (c) =>
        c.escalationState?.currentTier === 'Tier 2: EO' ||
        (c.pauseRequest && c.pauseRequest.status === 'Pending') ||
        (c.escalationState && c.escalationState.dayElapsed >= 7 && c.status !== 'Closed')
    );
  }, [complaints]);

  const pendingPauseRequests = useMemo(() => {
    return complaints.filter((c) => c.pauseRequest && c.pauseRequest.status === 'Pending');
  }, [complaints]);

  // Filter and sort Panchayats
  const filteredPanchayats = panchayats
    .filter((gp) => {
      const matchesSearch = 
        gp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (gp.nameKn && gp.nameKn.includes(searchQuery)) ||
        gp.pdoName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || gp.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'rank') return a.rank - b.rank;
      if (sortBy === 'healthScore') return b.healthScore - a.healthScore;
      if (sortBy === 'activeComplaints') return b.activeComplaints - a.activeComplaints;
      if (sortBy === 'budgetSpent') return b.budgetSpentInr - a.budgetSpentInr;
      return 0;
    });

  // Aggregate Taluk stats
  const totalGps = panchayats.length;
  const totalAssetsTracked = panchayats.reduce((sum, gp) => sum + gp.totalAssets, 0);
  const totalActiveIssues = panchayats.reduce((sum, gp) => sum + gp.activeComplaints, 0);
  const avgTalukHealth = (panchayats.reduce((sum, gp) => sum + gp.healthScore, 0) / totalGps).toFixed(1);
  const totalWarrantyRecovered = panchayats.reduce((sum, gp) => sum + gp.warrantyClaimsRecoveredInr, 0);

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Multi-Level Governance Breadcrumb & Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-600">
          <span className="text-slate-400">Hierarchy:</span>
          {onNavigateToState && (
            <>
              <button 
                onClick={onNavigateToState}
                className="text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer"
              >
                {lang === 'kn' ? 'ಕರ್ನಾಟಕ ರಾಜ್ಯ' : 'Karnataka State'}
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </>
          )}
          {onNavigateToDistrict && (
            <>
              <button 
                onClick={onNavigateToDistrict}
                className="text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer"
              >
                {lang === 'kn' ? 'ಮೈಸೂರು ಜಿಲ್ಲಾ ಪಂಚಾಯತ್' : 'Mysuru Zilla Panchayat'}
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </>
          )}
          <span className="text-slate-900 font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md">
            {lang === 'kn' ? 'ಮೈಸೂರು ತಾಲೂಕು ಪಂಚಾಯತ್' : 'Mysuru Taluk Panchayat (Tier 2: EO)'}
          </span>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-500 font-medium">
            {lang === 'kn' ? 'ತಾಲೂಕು ಕಾರ್ಯನಿರ್ವಾಹಕ ಅಧಿಕಾರಿ (EO)' : 'Taluk Executive Officer (EO) Desk'}
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        </div>
      </div>

      {/* Main Taluk Header Banner */}
      <div className="bg-gradient-to-r from-amber-700 via-orange-800 to-amber-950 text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center space-x-2 text-amber-200 text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-4 h-4" />
            <span>Tier 2 Governance • 3-Day Taluk Escalation Window</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black">
            {lang === 'kn' ? 'ಮೈಸೂರು ತಾಲೂಕು ಪಂಚಾಯಿತಿ - ಕಾರ್ಯನಿರ್ವಾಹಕ ಅಧಿಕಾರಿ ಕಚೇರಿ' : 'Mysuru Taluk Panchayat — Executive Officer Command Center'}
          </h1>
          <p className="text-xs text-amber-100 leading-relaxed font-medium">
            Monitor Gram Panchayat health scores, evaluate BDO pause requests, reallocate backup contractors, and enforce 3-day SLA compliance.
          </p>
        </div>

        {/* Action Tabs */}
        <div className="flex items-center gap-2 bg-black/20 p-1.5 rounded-2xl border border-white/10 shrink-0 flex-wrap">
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'leaderboard' ? 'bg-white text-slate-900 shadow-sm' : 'text-white hover:bg-white/10'
            }`}
          >
            GP Leaderboard ({panchayats.length})
          </button>
          <button
            onClick={() => setActiveTab('escalations')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'escalations' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-white hover:bg-white/10'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>EO Escalations ({eoEscalatedComplaints.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('dossiers')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'dossiers' ? 'bg-red-500 text-white shadow-sm' : 'text-white hover:bg-white/10'
            }`}
          >
            <Gavel className="w-3.5 h-3.5" />
            <span>3-Strike Dossiers ({officerDossiers.length})</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">{lang === 'kn' ? 'ಸರಾಸರಿ ಆರೋಗ್ಯ ಸೂಚ್ಯಂಕ' : 'Avg Taluk Health'}</span>
            <Sparkles className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">{avgTalukHealth}%</div>
          <div className="text-[11px] font-semibold text-emerald-600 mt-0.5">Top 5% in Mysuru District</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">{lang === 'kn' ? 'ಸಕ್ರಿಯ ಸಾರ್ವಜನಿಕ ಆಸ್ತಿಗಳು' : 'Public Assets'}</span>
            <Layers className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">{(totalAssetsTracked ?? 0).toLocaleString()}</div>
          <div className="text-[11px] font-semibold text-slate-500 mt-0.5">Across {totalGps} Gram Panchayats</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">{lang === 'kn' ? 'ವಾರೆಂಟಿ ಉಳಿತಾಯ' : 'Warranty Recovered'}</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">₹{(totalWarrantyRecovered / 100000).toFixed(1)} Lakh</div>
          <div className="text-[11px] font-semibold text-emerald-600 mt-0.5">Free vendor replacements</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">{lang === 'kn' ? 'ಬಾಕಿ ದೂರುಗಳು' : 'Active Grievances'}</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">{totalActiveIssues}</div>
          <div className="text-[11px] font-semibold text-amber-700 mt-0.5">{pendingPauseRequests.length} Pause Requests</div>
        </div>
      </div>

      {/* Tab 1: Leaderboard */}
      {activeTab === 'leaderboard' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center space-x-2">
                  <span>{lang === 'kn' ? 'ಗ್ರಾಮ ಪಂಚಾಯತ್‌ಗಳ ಕಾರ್ಯಕ್ಷಮತೆ ಶ್ರೇಯಾಂಕ' : 'Gamified Gram Panchayat Leaderboard'}</span>
                  <span className="text-xs font-bold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full">
                    Ranked by SLA & Citizen Satisfaction
                  </span>
                </h3>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-500 font-bold shrink-0">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 rounded-xl px-2.5 py-1.5 cursor-pointer"
                >
                  <option value="rank">Taluk Rank (Top to Bottom)</option>
                  <option value="healthScore">Health Index Score</option>
                  <option value="activeComplaints">Pending Complaints</option>
                  <option value="budgetSpent">Budget Spent</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Gram Panchayat or PDO name..."
                  className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl pl-9 pr-3 py-2 font-medium text-slate-800 placeholder-slate-400"
                />
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {(['All', 'Exemplary', 'Normal', 'Needs Attention', 'Critical Alert'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`text-xs px-2.5 py-1.2 rounded-lg font-bold transition-all cursor-pointer ${
                      statusFilter === status
                        ? 'bg-amber-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Rank</th>
                  <th className="py-3 px-4">Gram Panchayat</th>
                  <th className="py-3 px-4">PDO In-Charge</th>
                  <th className="py-3 px-4">Asset Health</th>
                  <th className="py-3 px-4">SLA Compliance</th>
                  <th className="py-3 px-4">Pending / Active</th>
                  <th className="py-3 px-4">Warranty Saved</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPanchayats.map((gp) => (
                  <tr key={gp.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-black text-slate-900">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs ${
                        gp.rank === 1 ? 'bg-amber-400 text-slate-950 font-black' :
                        gp.rank === 2 ? 'bg-slate-200 text-slate-800 font-bold' :
                        gp.rank === 3 ? 'bg-amber-700 text-white font-bold' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {gp.rank}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{gp.name}</div>
                      <div className="text-[10px] text-slate-500">{gp.id}</div>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">{gp.pdoName}</td>
                    <td className="py-3 px-4">
                      <div className="font-black text-slate-900">{gp.healthScore}%</div>
                      <div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden mt-1">
                        <div
                          className={`h-full ${gp.healthScore >= 90 ? 'bg-emerald-500' : gp.healthScore >= 75 ? 'bg-amber-500' : 'bg-rose-500'}`}
                          style={{ width: `${gp.healthScore}%` }}
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4 font-black text-emerald-700">{gp.slaComplianceRate}%</td>
                    <td className="py-3 px-4 font-bold text-amber-700">{gp.activeComplaints} tickets</td>
                    <td className="py-3 px-4 font-bold text-slate-800">₹{(gp.warrantyClaimsRecoveredInr ?? 0).toLocaleString('en-IN')}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onSelectPanchayat && onSelectPanchayat(gp.id)}
                        className="bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold px-3 py-1 rounded-xl transition-all cursor-pointer"
                      >
                        Inspect GP ➔
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Tier 2 EO Escalations */}
      {activeTab === 'escalations' && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-300 p-4 rounded-3xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ShieldAlert className="w-6 h-6 text-amber-700 shrink-0" />
              <div>
                <h4 className="text-sm font-black text-amber-950">
                  Tier 2 Statutory Escalation Queue (Day 7 to Day 10)
                </h4>
                <p className="text-xs text-amber-900 font-medium">
                  When BDO breaches Day 7 SLA, tickets route to EO. If unresolved by Day 10, case escalates to District CEO with automatic officer strike.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {eoEscalatedComplaints.length === 0 ? (
              <div className="col-span-2 bg-white p-12 text-center text-slate-400 rounded-3xl border border-slate-200">
                No active grievances currently breached or escalated to Tier 2 EO level.
              </div>
            ) : (
              eoEscalatedComplaints.map((c) => (
                <div key={c.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 space-y-3.5">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono font-black text-indigo-700">{c.id}</span>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-red-100 text-red-800">
                          {c.escalationState?.currentTier || 'Tier 2: EO'}
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-slate-900 mt-1">{c.assetName}</h4>
                      <p className="text-xs text-slate-500">{c.location} • {c.ward}</p>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-black text-rose-700">Day {c.escalationState?.dayElapsed || 7} / 10</div>
                      <div className="text-[10px] text-slate-400">EO Window: 3 Days</div>
                    </div>
                  </div>

                  {/* Pause Request Card */}
                  {c.pauseRequest && (
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs space-y-2">
                      <div className="flex items-center justify-between font-bold text-slate-800">
                        <span className="flex items-center space-x-1.5">
                          <PauseCircle className="w-4 h-4 text-amber-600" />
                          <span>Pause Request: {c.pauseRequest.reason}</span>
                        </span>
                        <span className={`px-2 py-0.2 rounded text-[10px] ${
                          c.pauseRequest.status === 'Approved' ? 'bg-emerald-100 text-emerald-800 font-black' :
                          c.pauseRequest.status === 'Rejected' ? 'bg-red-100 text-red-800 font-black' :
                          'bg-amber-100 text-amber-800 font-bold'
                        }`}>
                          {c.pauseRequest.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 font-medium leading-relaxed">{c.pauseRequest.details}</p>

                      {c.pauseRequest.status === 'Pending' && onReviewPauseRequest && (
                        <div className="pt-2 flex items-center justify-end space-x-2 border-t border-slate-200">
                          <button
                            onClick={() => onReviewPauseRequest(c.id, 'Rejected', 'Delay not justified under monsoon SOP.')}
                            className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-lg transition-colors cursor-pointer text-xs"
                          >
                            Reject Pause
                          </button>
                          <button
                            onClick={() => onReviewPauseRequest(c.id, 'Approved', 'Monsoon flooding verified. Clock frozen for 5 days.')}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors cursor-pointer text-xs"
                          >
                            Approve Legitimate Pause
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Escalate to CEO button */}
                  {onEscalateToCEO && (
                    <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                      <span className="text-[11px] text-slate-500">Day 10 Breach threshold:</span>
                      <button
                        onClick={() => onEscalateToCEO(c.id, 'EO 3-day SLA window exceeded. Re-routing to District CEO for emergency fund override.')}
                        className="flex items-center space-x-1 text-xs font-black text-red-700 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>Escalate to CEO (Tier 3)</span>
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 3: 3-Strike Disciplinary Dossiers */}
      {activeTab === 'dossiers' && (
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 p-4 rounded-3xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Gavel className="w-6 h-6 text-red-700 shrink-0" />
              <div>
                <h4 className="text-sm font-black text-red-950">
                  Statutory 3-Strike Disciplinary Rule (RDPR Audit Monitor)
                </h4>
                <p className="text-xs text-red-900 font-medium">
                  Any BDO, EO, or Officer who accumulates 3 consecutive SLA strikes triggers an automated disciplinary dossier forwarded to RDPR State HQ for formal suspension proceedings.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {officerDossiers.map((dossier) => (
              <div key={dossier.dossierId} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-400">{dossier.dossierId}</span>
                    <h4 className="text-sm font-black text-slate-900 mt-0.5">{dossier.officerName}</h4>
                    <p className="text-xs text-slate-500 font-medium">{dossier.designation} • {dossier.talukOrPanchayat}</p>
                  </div>

                  <div className={`px-2.5 py-1 rounded-xl text-xs font-black flex items-center space-x-1 ${
                    dossier.totalStrikes >= 3 ? 'bg-red-600 text-white animate-bounce' :
                    dossier.totalStrikes === 2 ? 'bg-amber-500 text-slate-950' : 'bg-slate-100 text-slate-700'
                  }`}>
                    <Flame className="w-3.5 h-3.5" />
                    <span>{dossier.totalStrikes} / 3 Strikes</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1.5 text-xs">
                  <div className="font-bold text-slate-700">Breach Log:</div>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px]">
                    {dossier.criticalCasesBreached.map((c, idx) => (
                      <li key={idx}>{c}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                  <span className="text-slate-500 font-semibold">RDPR Status:</span>
                  <span className={`font-black ${
                    dossier.totalStrikes >= 3 ? 'text-red-700' : 'text-amber-700'
                  }`}>
                    {dossier.rdprActionStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
