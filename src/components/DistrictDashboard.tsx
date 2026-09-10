import React, { useState } from 'react';
import { 
  DistrictHierarchyData, 
  TalukHierarchyData, 
  LanguageMode 
} from '../types';
import { KARNATAKA_DISTRICTS_DATA } from '../data/governanceHierarchyData';
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
  Compass,
  MapPin,
  TrendingDown,
  Sparkles
} from 'lucide-react';

interface DistrictDashboardProps {
  lang: LanguageMode;
  onNavigateToTaluk?: (talukId: string) => void;
  onNavigateToState?: () => void;
  onNavigateToPanchayat?: () => void;
}

export const DistrictDashboard: React.FC<DistrictDashboardProps> = ({
  lang,
  onNavigateToTaluk,
  onNavigateToState,
  onNavigateToPanchayat,
}) => {
  const [districts] = useState<DistrictHierarchyData[]>(KARNATAKA_DISTRICTS_DATA);
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('DIST-MYS');
  const [talukSearch, setTalukSearch] = useState('');

  const currentDistrict = districts.find((d) => d.id === selectedDistrictId) || districts[0];
  const talukList = currentDistrict.talukPerformance || [];

  const filteredTaluks = talukList.filter((t) => 
    t.name.toLowerCase().includes(talukSearch.toLowerCase()) ||
    (t.nameKn && t.nameKn.includes(talukSearch))
  );

  // Aggregated stats
  const totalTaluksInDist = currentDistrict.totalTaluks;
  const totalGpsInDist = currentDistrict.totalGramPanchayats;
  const totalAssetsInDist = currentDistrict.totalPublicAssets;
  const activeGrievances = currentDistrict.activeComplaints;
  const resolvedGrievances = currentDistrict.resolvedComplaints;
  const budgetAllocated = currentDistrict.budgetAllocatedInrLakhs;
  const budgetSpent = currentDistrict.budgetUtilizedInrLakhs;
  const warrantyClaims = currentDistrict.warrantyRecoveryClaimsInrLakhs;

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Governance Level Breadcrumbs */}
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
          <span className="text-slate-900 font-bold bg-indigo-100 text-indigo-900 px-2 py-0.5 rounded-md">
            {lang === 'kn' ? `${currentDistrict.nameKn || currentDistrict.name} ಜಿಲ್ಲಾ ಪಂಚಾಯತ್` : `${currentDistrict.name} Zilla Panchayat (ZP Level)`}
          </span>
          {onNavigateToTaluk && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <button 
                onClick={() => onNavigateToTaluk('TLK-MYS')}
                className="text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer"
              >
                {lang === 'kn' ? 'ಮೈಸೂರು ತಾಲೂಕು' : 'Mysuru Taluk'}
              </button>
            </>
          )}
        </div>

        {/* District Selector Pill */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-500 font-bold">{lang === 'kn' ? 'ಜಿಲ್ಲೆ ಬದಲಾಯಿಸಿ:' : 'Select District:'}</span>
          <select
            value={selectedDistrictId}
            onChange={(e) => setSelectedDistrictId(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 rounded-xl px-3 py-1.5 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            {districts.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} {d.nameKn ? `(${d.nameKn})` : ''} - Health: {d.overallHealthIndex}%
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Hero Zilla Panchayat Command Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-indigo-500/20 text-indigo-200 px-3 py-1 rounded-full text-xs font-bold border border-indigo-400/30">
            <Compass className="w-3.5 h-3.5" />
            <span>Zilla Panchayat (ZP) District Infrastructure Command Hub</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            {lang === 'kn' 
              ? `${currentDistrict.nameKn || currentDistrict.name} ಜಿಲ್ಲಾ ಪಂಚಾಯತ್ ಆಡಳಿತ ಮತ್ತು ಆಸ್ತಿ ಕಣ್ಗಾವಲು` 
              : `${currentDistrict.name} District Infrastructure & Multi-Taluk Governance`}
          </h1>
          <p className="text-xs text-indigo-100/90 leading-relaxed font-medium">
            {lang === 'kn'
              ? 'ಜಿಲ್ಲೆಯ ಎಲ್ಲಾ ತಾಲೂಕುಗಳು ಮತ್ತು ಗ್ರಾಮ ಪಂಚಾಯತ್‌ಗಳ ಆಸ್ತಿ ಕಾರ್ಯಕ್ಷಮತೆ, ಅನುದಾನ ಬಳಕೆ, ಗ್ಯಾರಂಟಿ ಕ್ಲೈಮ್‌ಗಳು ಮತ್ತು ತುರ್ತು ಹಸ್ತಕ್ಷೇಪ ಯೋಜನೆಗಳು.'
              : 'Consolidated view of all Taluks, district-wide infrastructure health indexing, capital budget vs asset condition alignment, and performance benchmarking.'}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-white/10 backdrop-blur-xs border border-white/20 px-4 py-3 rounded-2xl text-center">
            <div className="text-[10px] uppercase font-bold text-indigo-200">District Health Index</div>
            <div className="text-2xl font-black text-white">{currentDistrict.overallHealthIndex}%</div>
            <div className="text-[10px] text-emerald-300 font-bold">Grade A Tier</div>
          </div>
        </div>
      </div>

      {/* District KPI Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-1">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
            <span>{lang === 'kn' ? 'ತಾಲೂಕುಗಳು & ಗ್ರಾ.ಪಂ.' : 'Taluks & Gram Panchayats'}</span>
            <Layers className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{totalTaluksInDist} Taluks</div>
          <div className="text-[10px] text-slate-500 font-medium">{totalGpsInDist} Panchayats • {(totalAssetsInDist ?? 0).toLocaleString()} Assets</div>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-1">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
            <span>{lang === 'kn' ? 'ಸಕ್ರಿಯ ದೂರುಗಳು' : 'Grievance Resolution'}</span>
            <Activity className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{activeGrievances} Open</div>
          <div className="text-[10px] text-emerald-600 font-bold">{(resolvedGrievances ?? 0).toLocaleString()} Resolved (94%)</div>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-1">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
            <span>{lang === 'kn' ? 'ಜಿಲ್ಲಾ ಅನುದಾನ ಬಳಕೆ' : 'District Budget Utilization'}</span>
            <DollarSign className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {((budgetSpent / budgetAllocated) * 100).toFixed(1)}%
          </div>
          <div className="text-[10px] text-blue-600 font-bold">
            ₹ {(budgetSpent / 100).toFixed(1)} Cr / ₹ {(budgetAllocated / 100).toFixed(1)} Cr
          </div>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-1">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
            <span>{lang === 'kn' ? 'ಗ್ಯಾರಂಟಿ ರಿಕವರಿ ಕ್ಲೈಮ್ಸ್' : 'Liquidated Damages Recovered'}</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700">
            ₹ {(warrantyClaims / 100).toFixed(2)} Cr
          </div>
          <div className="text-[10px] text-emerald-600 font-bold">100% Contractor Penalties Collected</div>
        </div>
      </div>

      {/* Priority Intervention Zones Alert for District CEO */}
      <div className="bg-rose-50 border border-rose-200 rounded-3xl p-4.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 mt-0.5">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="space-y-0.5">
            <h4 className="text-xs font-black text-rose-950">
              {lang === 'kn' ? 'ಜಿಲ್ಲಾ CEO ಗಮನಕ್ಕೆ: ಆದ್ಯತೆಯ ಹಸ್ತಕ್ಷೇಪ ವಲಯಗಳು' : 'District CEO Priority Intervention Advisory'}
            </h4>
            <p className="text-xs text-rose-900 leading-relaxed font-medium">
              {currentDistrict.criticalInterventionZones} high-risk clusters identified in {currentDistrict.name} with MTBF &lt; 30 days.
              Special technical inspection teams ordered for water supply motors in Nanjangud & T. Narasipura.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button 
            onClick={() => onNavigateToTaluk && onNavigateToTaluk('TLK-NRJ')}
            className="bg-rose-850 hover:bg-rose-900 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            Review Priority Clusters
          </button>
        </div>
      </div>

      {/* Taluk Performance Breakdown Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center space-x-2">
              <span>{lang === 'kn' ? 'ತಾಲೂಕುವಾರು ಕಾರ್ಯಕ್ಷಮತೆ ಮತ್ತು ಹೋಲಿಕೆ' : 'Taluk-wise Performance & Infrastructure Index'}</span>
              <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full">
                {talukList.length} Taluks in {currentDistrict.name}
              </span>
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Benchmark health scores, pending issues, grant utilization, and frequent failure rates across Taluks.
            </p>
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={talukSearch}
              onChange={(e) => setTalukSearch(e.target.value)}
              placeholder="Filter Taluk name..."
              className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl pl-9 pr-3 py-2 font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Taluk Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Taluk Name</th>
                <th className="py-3 px-3 text-center">GPs / Assets</th>
                <th className="py-3 px-3 text-center">Health Index</th>
                <th className="py-3 px-3 text-center">Active Complaints</th>
                <th className="py-3 px-3 text-center">Avg Resolution</th>
                <th className="py-3 px-3 text-right">Budget Utilized</th>
                <th className="py-3 px-3 text-right">Warranty Penalty</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredTaluks.map((taluk) => {
                const isRank1 = taluk.rank === 1;

                return (
                  <tr key={taluk.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2.5">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                          isRank1 ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-slate-100 text-slate-600'
                        }`}>
                          #{taluk.rank}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-xs flex items-center space-x-1.5">
                            <span>{taluk.name}</span>
                            {isRank1 && <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                          </div>
                          {taluk.nameKn && <div className="text-[11px] text-slate-500">{taluk.nameKn}</div>}
                          <div className="text-[10px] text-slate-400">
                            Failing assets: <span className="font-semibold text-rose-600">{taluk.frequentlyFailingAssetsCount} lemon units</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <div className="font-bold text-slate-900">{taluk.totalGramPanchayats} GPs</div>
                      <div className="text-[10px] text-slate-500">{taluk.totalAssets} Assets</div>
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <div 
                        className="inline-flex items-center space-x-1 font-black text-xs px-2.5 py-1 rounded-xl"
                        style={{
                          backgroundColor: taluk.healthIndex >= 90 ? '#dcfce7' : taluk.healthIndex >= 85 ? '#fef3c7' : '#fee2e2',
                          color: taluk.healthIndex >= 90 ? '#15803d' : taluk.healthIndex >= 85 ? '#b45309' : '#b91c1c'
                        }}
                      >
                        <span>{taluk.healthIndex}%</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <div className="font-bold text-rose-600">{taluk.activeComplaints}</div>
                      <div className="text-[10px] text-slate-400">of {taluk.resolvedComplaints + taluk.activeComplaints}</div>
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <div className="font-bold text-slate-800">{taluk.avgResolutionHours}h</div>
                      <div className="text-[10px] text-emerald-600">SLA: 24h</div>
                    </td>

                    <td className="py-3.5 px-3 text-right">
                      <div className="font-bold text-slate-900">₹ {taluk.budgetUtilizedInrLakhs}L</div>
                      <div className="text-[10px] text-slate-500">of ₹ {taluk.budgetAllocatedInrLakhs}L ({((taluk.budgetUtilizedInrLakhs / taluk.budgetAllocatedInrLakhs) * 100).toFixed(0)}%)</div>
                    </td>

                    <td className="py-3.5 px-3 text-right">
                      <div className="font-bold text-emerald-700">₹ {taluk.warrantyClaimsRecoveredInrLakhs}L</div>
                      <div className="text-[10px] text-emerald-600">Recovered</div>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => onNavigateToTaluk && onNavigateToTaluk(taluk.id)}
                        className="inline-flex items-center space-x-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-950 border border-indigo-200 px-2.5 py-1.2 rounded-lg text-xs font-bold transition-all cursor-pointer hover:scale-[1.02]"
                      >
                        <span>Open Taluk</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
