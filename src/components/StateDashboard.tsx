import React, { useState, useMemo } from 'react';
import { 
  StateHierarchyData, 
  DistrictHierarchyData, 
  LanguageMode,
  Complaint,
  OfficerDisciplinaryDossier
} from '../types';
import { 
  STATEWIDE_RDPR_METRICS, 
  KARNATAKA_DISTRICTS_DATA 
} from '../data/governanceHierarchyData';
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
  Layers, 
  Award, 
  BarChart3, 
  Activity,
  Globe2,
  FileCheck2,
  PieChart,
  Zap,
  Sparkles,
  TrendingDown,
  Scale,
  Gavel,
  Flame,
  UserCheck,
  Building,
  Check
} from 'lucide-react';

interface StateDashboardProps {
  lang: LanguageMode;
  complaints?: Complaint[];
  officerDossiers?: OfficerDisciplinaryDossier[];
  onNavigateToDistrict?: (districtId: string) => void;
  onNavigateToTaluk?: (talukId: string) => void;
  onNavigateToPanchayat?: () => void;
}

export const StateDashboard: React.FC<StateDashboardProps> = ({
  lang,
  complaints = [],
  officerDossiers = [],
  onNavigateToDistrict,
  onNavigateToTaluk,
  onNavigateToPanchayat,
}) => {
  const [activeTab, setActiveTab] = useState<'districts' | 'tier4_hq' | 'dossiers'>('districts');
  const [stateMetrics] = useState<StateHierarchyData>(STATEWIDE_RDPR_METRICS);
  const [districts] = useState<DistrictHierarchyData[]>(KARNATAKA_DISTRICTS_DATA);
  const [searchDistrict, setSearchDistrict] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [dossierState, setDossierState] = useState<OfficerDisciplinaryDossier[]>(officerDossiers);

  const filteredDistricts = districts.filter((d) => 
    d.name.toLowerCase().includes(searchDistrict.toLowerCase()) ||
    (d.nameKn && d.nameKn.includes(searchDistrict))
  );

  const tier4EscalatedComplaints = useMemo(() => {
    return complaints.filter(
      (c) => c.escalationState?.currentTier === 'Tier 4: RDPR HQ' || (c.escalationState && c.escalationState.dayElapsed >= 14)
    );
  }, [complaints]);

  const handleIssueNotice = (dossierId: string, action: 'Show Cause Issued' | 'Suspended') => {
    setDossierState((prev) =>
      prev.map((d) => (d.dossierId === dossierId ? { ...d, rdprActionStatus: action } : d))
    );
  };

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* State Governance Top Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-600">
          <span className="text-slate-400">Hierarchy:</span>
          <span className="text-purple-950 font-black bg-purple-100 text-purple-900 px-2.5 py-0.5 rounded-md">
            {lang === 'kn' ? 'ಕರ್ನಾಟಕ ಸರಕಾರ - ಆರ್‌ಡಿಪಿಆರ್ ಪ್ರಧಾನ ಕಚೇರಿ' : 'Government of Karnataka — RDPR State HQ (Tier 4)'}
          </span>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-500 font-medium">
            Principal Secretary Desk • State Command
          </span>
          <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse"></span>
        </div>
      </div>

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-950 text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center space-x-2 text-purple-200 text-xs font-bold uppercase tracking-wider">
            <Globe2 className="w-4 h-4" />
            <span>Apex Oversight • 31 Districts • 6,000+ Gram Panchayats</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black">
            {lang === 'kn' ? 'ಗ್ರಾಮೀಣಾಭಿವೃದ್ಧಿ ಮತ್ತು ಪಂಚಾಯತ್ ರಾಜ್ ಇಲಾಖೆ' : 'Rural Development & Panchayat Raj Department (RDPR)'}
          </h1>
          <p className="text-xs text-purple-100 leading-relaxed font-medium">
            Real-time public asset registry, 3-strike disciplinary tribunal, fast-track vendor payments, and statutory governance enforcement.
          </p>
        </div>

        {/* Action Tabs */}
        <div className="flex items-center gap-2 bg-black/30 p-1.5 rounded-2xl border border-white/10 shrink-0 flex-wrap">
          <button
            onClick={() => setActiveTab('districts')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'districts' ? 'bg-white text-slate-900 shadow-sm' : 'text-white hover:bg-white/10'
            }`}
          >
            Districts Overview ({districts.length})
          </button>
          <button
            onClick={() => setActiveTab('tier4_hq')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'tier4_hq' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-white hover:bg-white/10'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Tier 4 Escalations ({tier4EscalatedComplaints.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('dossiers')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'dossiers' ? 'bg-red-500 text-white shadow-sm' : 'text-white hover:bg-white/10'
            }`}
          >
            <Gavel className="w-3.5 h-3.5" />
            <span>3-Strike Disciplinary Tribunals</span>
          </button>
        </div>
      </div>

      {/* Statewide KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">State Asset Index</span>
            <Activity className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">{stateMetrics.statewideHealthIndex ?? 87.2}%</div>
          <div className="text-[11px] font-semibold text-purple-700 mt-0.5">31 Districts Monitored</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Tracked Public Assets</span>
            <Layers className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">{(stateMetrics.totalPublicAssetsTracked ?? 482600).toLocaleString()}</div>
          <div className="text-[11px] font-semibold text-slate-500 mt-0.5">Geo-tagged with QR Passports</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Warranty Saved (State)</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">₹{stateMetrics.totalContractorPenaltiesRecoveredCr ?? 42.8} Cr</div>
          <div className="text-[11px] font-semibold text-emerald-600 mt-0.5">Section 18 Vendor Claims</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Resolved Grievances</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">{((stateMetrics.totalResolvedGrievances ?? 74200) / 1000).toFixed(1)}k</div>
          <div className="text-[11px] font-semibold text-emerald-700 mt-0.5">48-Hr Citizen Audited</div>
        </div>
      </div>

      {/* Tab 1: Districts Table */}
      {activeTab === 'districts' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-black text-slate-900">Karnataka Zilla Panchayats (31 Districts)</h3>
              <p className="text-xs text-slate-500">Click drill-down to review specific Taluk Panchayats and field operations.</p>
            </div>
            <div className="relative max-w-xs w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchDistrict}
                onChange={(e) => setSearchDistrict(e.target.value)}
                placeholder="Search District..."
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl pl-9 pr-3 py-2 font-medium"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">District (Zilla Panchayat)</th>
                  <th className="py-3.5 px-3 text-center">Taluks / Assets</th>
                  <th className="py-3.5 px-3 text-center">Health Index</th>
                  <th className="py-3.5 px-3 text-center">Active Issues</th>
                  <th className="py-3.5 px-3 text-right">Budget Utilized</th>
                  <th className="py-3.5 px-3 text-right">Warranty Saved</th>
                  <th className="py-3.5 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredDistricts.map((district) => (
                  <tr key={district.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 text-xs">{district.name}</div>
                      {district.nameKn && <div className="text-[11px] text-slate-500">{district.nameKn}</div>}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <div className="font-bold text-slate-900">{district.totalTaluks} Taluks</div>
                      <div className="text-[10px] text-slate-500">{district.totalPublicAssets.toLocaleString()} Assets</div>
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span className={`inline-flex items-center space-x-1 font-black text-xs px-2.5 py-1 rounded-xl ${
                        district.overallHealthIndex >= 90 ? 'bg-emerald-100 text-emerald-800' :
                        district.overallHealthIndex >= 80 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {district.overallHealthIndex}%
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-center font-bold text-rose-600">{district.activeComplaints}</td>
                    <td className="py-3.5 px-3 text-right font-bold text-slate-900">₹{(district.budgetUtilizedInrLakhs / 100).toFixed(1)} Cr</td>
                    <td className="py-3.5 px-3 text-right font-bold text-emerald-700">₹{(district.warrantyRecoveryClaimsInrLakhs / 100).toFixed(2)} Cr</td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => onNavigateToDistrict && onNavigateToDistrict(district.id)}
                        className="inline-flex items-center space-x-1 bg-purple-50 hover:bg-purple-100 text-purple-950 border border-purple-200 px-2.5 py-1.2 rounded-lg text-xs font-bold transition-all cursor-pointer"
                      >
                        <span>Drill Down ZP</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Tier 4 HQ Escalations */}
      {activeTab === 'tier4_hq' && (
        <div className="space-y-4">
          <div className="bg-purple-50 border border-purple-300 p-4 rounded-3xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Zap className="w-6 h-6 text-purple-700 shrink-0" />
              <div>
                <h4 className="text-sm font-black text-purple-950">
                  Tier 4: State RDPR HQ Emergency Takeover (Day 14+)
                </h4>
                <p className="text-xs text-purple-900 font-medium">
                  Direct central emergency fund deployment with automated contractor dispatch bypass for multi-week unresolved civic failures.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tier4EscalatedComplaints.length === 0 ? (
              <div className="col-span-2 bg-white p-12 text-center text-slate-400 rounded-3xl border border-slate-200">
                No active grievances currently at Tier 4 State HQ takeover stage.
              </div>
            ) : (
              tier4EscalatedComplaints.map((c) => (
                <div key={c.id} className="bg-white rounded-3xl border border-purple-200 shadow-sm p-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-mono font-black text-purple-700">{c.id}</span>
                      <h4 className="text-sm font-black text-slate-900 mt-1">{c.assetName}</h4>
                      <p className="text-xs text-slate-500">{c.location} • {c.ward}</p>
                    </div>
                    <span className="text-xs font-black bg-purple-100 text-purple-900 px-2.5 py-1 rounded-xl">
                      State Emergency Fund Active
                    </span>
                  </div>

                  <div className="bg-purple-50 p-3 rounded-2xl text-xs space-y-1 text-purple-950 font-medium">
                    <div><strong>Diagnosis:</strong> {c.triage?.suggestedAction || c.description}</div>
                    <div><strong>Escalation Path:</strong> BDO (Day 6) ➔ EO (Day 9) ➔ CEO (Day 13) ➔ RDPR HQ</div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className="text-slate-500 font-bold">State Flying Squad:</span>
                    <button className="bg-purple-900 text-white font-bold px-3 py-1.5 rounded-xl hover:bg-purple-800 transition-all cursor-pointer">
                      Dispatch State Squad ⚡
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 3: 3-Strike Disciplinary Tribunals */}
      {activeTab === 'dossiers' && (
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 p-4 rounded-3xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Gavel className="w-6 h-6 text-red-700 shrink-0" />
              <div>
                <h4 className="text-sm font-black text-red-950">
                  Karnataka Civil Services (KCS) Disciplinary Tribunal
                </h4>
                <p className="text-xs text-red-900 font-medium">
                  Review officers with 3 accumulated strikes. Issue formal Show Cause Notices or Suspension Orders under Section 19 of the Karnataka Panchayat Raj Act.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dossierState.map((dossier) => (
              <div key={dossier.dossierId} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-400">{dossier.dossierId}</span>
                    <h4 className="text-sm font-black text-slate-900 mt-0.5">{dossier.officerName}</h4>
                    <p className="text-xs text-slate-500 font-medium">{dossier.designation} • {dossier.talukOrPanchayat}</p>
                  </div>

                  <div className="px-2.5 py-1 rounded-xl text-xs font-black bg-red-600 text-white flex items-center space-x-1">
                    <Flame className="w-3.5 h-3.5" />
                    <span>{dossier.totalStrikes} / 3 Strikes</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1 text-xs">
                  <div className="font-bold text-slate-700">Breach Records:</div>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px]">
                    {dossier.criticalCasesBreached.map((c, idx) => (
                      <li key={idx}>{c}</li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className={`font-black ${dossier.rdprActionStatus === 'Suspended' ? 'text-red-700' : 'text-amber-700'}`}>
                    {dossier.rdprActionStatus}
                  </span>

                  <div className="flex items-center space-x-1.5">
                    {dossier.rdprActionStatus !== 'Suspended' && (
                      <button
                        onClick={() => handleIssueNotice(dossier.dossierId, 'Show Cause Issued')}
                        className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold rounded-lg text-[11px] cursor-pointer"
                      >
                        Show Cause
                      </button>
                    )}
                    <button
                      onClick={() => handleIssueNotice(dossier.dossierId, 'Suspended')}
                      className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-[11px] cursor-pointer"
                    >
                      Suspend
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
