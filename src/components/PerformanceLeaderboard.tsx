import React, { useState, useMemo } from 'react';
import { 
  GramPanchayatPerformance, 
  TalukHierarchyData, 
  DistrictHierarchyData, 
  LanguageMode, 
  WorkerInfo 
} from '../types';
import { 
  MYSURU_TALUK_PANCHAYATS_DATA, 
  KARNATAKA_DISTRICTS_DATA, 
  STATEWIDE_RDPR_METRICS 
} from '../data/governanceHierarchyData';
import { 
  Trophy, 
  Medal, 
  Award, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Star, 
  ShieldCheck, 
  Search, 
  Filter, 
  Download, 
  Share2, 
  Sparkles, 
  Building2, 
  Compass, 
  Globe2, 
  Wrench, 
  Users, 
  ChevronRight,
  ArrowUpRight,
  BarChart3,
  ExternalLink,
  Flame,
  Check
} from 'lucide-react';

interface PerformanceLeaderboardProps {
  workers: WorkerInfo[];
  lang: LanguageMode;
  onSelectGramPanchayat?: (gpName: string) => void;
  onSelectWorker?: (workerId: string) => void;
}

type TabMode = 'panchayats' | 'taluks' | 'districts' | 'technicians';
type SortMetric = 'rank' | 'healthScore' | 'slaSpeed' | 'citizenRating' | 'recovery';

export const PerformanceLeaderboard: React.FC<PerformanceLeaderboardProps> = ({
  workers = [],
  lang,
  onSelectGramPanchayat,
  onSelectWorker,
}) => {
  const [activeTab, setActiveTab] = useState<TabMode>('panchayats');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortMetric, setSortMetric] = useState<SortMetric>('rank');
  const [timeframe, setTimeframe] = useState<'month' | 'quarter' | 'annual'>('month');
  const [selectedGpModal, setSelectedGpModal] = useState<GramPanchayatPerformance | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  // Extended GP dataset for a rich leaderboard
  const allGps: GramPanchayatPerformance[] = useMemo(() => {
    return [
      ...MYSURU_TALUK_PANCHAYATS_DATA,
      {
        id: 'GP-BIL-07',
        name: 'Bilikere Gram Panchayat',
        nameKn: 'ಬಿಳಿಕೆರೆ ಗ್ರಾಮ ಪಂಚಾಯತ್',
        talukId: 'TLK-HNS',
        talukName: 'Hunsur Taluk',
        districtName: 'Mysuru',
        totalAssets: 48,
        workingAssets: 43,
        failingAssets: 3,
        criticalAssets: 2,
        activeComplaints: 3,
        resolvedComplaints: 45,
        avgResolutionTimeHours: 17.5,
        budgetAllocatedInr: 5200000,
        budgetSpentInr: 4600000,
        warrantyClaimsRecoveredInr: 380000,
        healthScore: 93.4,
        rank: 1,
        status: 'Exemplary',
        pdoName: 'Sri Anantharaju K (PDO)',
        pdoPhone: '+91 94481 23456',
        topRiskCategory: 'Canal Sluice Valves',
      },
      {
        id: 'GP-BAN-08',
        name: 'Bannur Gram Panchayat',
        nameKn: 'ಬನ್ನೂರು ಗ್ರಾಮ ಪಂಚಾಯತ್',
        talukId: 'TLK-TNP',
        talukName: 'T. Narasipura Taluk',
        districtName: 'Mysuru',
        totalAssets: 62,
        workingAssets: 51,
        failingAssets: 7,
        criticalAssets: 4,
        activeComplaints: 5,
        resolvedComplaints: 57,
        avgResolutionTimeHours: 23.4,
        budgetAllocatedInr: 5600000,
        budgetSpentInr: 4800000,
        warrantyClaimsRecoveredInr: 290000,
        healthScore: 84.6,
        rank: 6,
        status: 'Normal',
        pdoName: 'Smt. Shailaja M (PDO)',
        pdoPhone: '+91 94481 23457',
        topRiskCategory: 'Overhead Tanks Overflow',
      },
    ];
  }, []);

  // Filtered and Sorted Gram Panchayats
  const sortedGps = useMemo(() => {
    return allGps
      .filter((gp) => 
        gp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gp.talukName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gp.pdoName.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        if (sortMetric === 'healthScore') return b.healthScore - a.healthScore;
        if (sortMetric === 'slaSpeed') return a.avgResolutionTimeHours - b.avgResolutionTimeHours;
        if (sortMetric === 'recovery') return b.warrantyClaimsRecoveredInr - a.warrantyClaimsRecoveredInr;
        return a.rank - b.rank;
      });
  }, [allGps, searchQuery, sortMetric]);

  // Taluk Rankings
  const talukList = useMemo(() => {
    const mysuruDistrict = KARNATAKA_DISTRICTS_DATA.find((d) => d.code === 'KA-MYS');
    return (mysuruDistrict?.talukPerformance || []).sort((a, b) => b.healthIndex - a.healthIndex);
  }, []);

  // District Standings
  const districtList = useMemo(() => {
    return [...KARNATAKA_DISTRICTS_DATA].sort((a, b) => b.overallHealthIndex - a.overallHealthIndex);
  }, []);

  // Field Technicians Index
  const sortedWorkers = useMemo(() => {
    return [...workers].sort((a, b) => {
      if (b.rating !== a.rating) return b.rating - a.rating;
      return b.completedTasks - a.completedTasks;
    });
  }, [workers]);

  const handleExportDossier = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Banner with Karnataka GovTech Identity */}
      <div className="bg-gradient-to-r from-amber-900 via-slate-900 to-slate-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-amber-500/30 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 bg-amber-500/20 border border-amber-400/40 px-3 py-1 rounded-full text-xs font-black text-amber-300">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Karnataka RDPR State Infrastructure Benchmark</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {lang === 'kn' ? 'ಸಾರ್ವಜನಿಕ ಸೇವಾ ಸಾಧನಾ ಲೀಡರ್‌ಬೋರ್ಡ್' : 'Civic Asset Performance Leaderboard'}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Real-time competitive index evaluating 5,958 Gram Panchayats on SLA Resolution Velocity, Asset Uptime %, Citizen Verification Ratings, and Warranty Recovery.
            </p>
          </div>

          {/* Quick Metrics Cards */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-black/40 border border-white/10 backdrop-blur-xs rounded-2xl p-3.5 text-center min-w-[110px]">
              <div className="text-[10px] text-amber-300 font-extrabold uppercase">State Avg Health</div>
              <div className="text-xl font-black text-white mt-0.5">88.6%</div>
              <div className="text-[10px] text-emerald-400 font-bold flex items-center justify-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> +2.4% MoM
              </div>
            </div>

            <div className="bg-black/40 border border-white/10 backdrop-blur-xs rounded-2xl p-3.5 text-center min-w-[110px]">
              <div className="text-[10px] text-amber-300 font-extrabold uppercase">Top Panchayat</div>
              <div className="text-sm font-black text-amber-300 mt-0.5 truncate max-w-[120px]">Bilikere GP</div>
              <div className="text-[10px] text-slate-300 font-bold">93.4 Score</div>
            </div>

            <button
              onClick={handleExportDossier}
              disabled={isExporting}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black px-4 py-3 rounded-2xl text-xs shadow-lg transition-all cursor-pointer flex items-center space-x-2 shrink-0 disabled:opacity-50"
            >
              {exportSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-950" />
                  <span>Dossier Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>{isExporting ? 'Generating...' : 'Export Leaderboard PDF'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto p-0.5">
          <button
            onClick={() => setActiveTab('panchayats')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'panchayats'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Gram Panchayats (GP)</span>
            <span className="text-[10px] bg-black/10 px-1.5 py-0.2 rounded-full font-extrabold">
              {allGps.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('taluks')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'taluks'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Taluk Panchayats (TP)</span>
            <span className="text-[10px] bg-black/10 px-1.5 py-0.2 rounded-full font-extrabold">
              {talukList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('districts')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'districts'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Globe2 className="w-4 h-4" />
            <span>Districts (ZP)</span>
            <span className="text-[10px] bg-black/10 px-1.5 py-0.2 rounded-full font-extrabold">
              {districtList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('technicians')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'technicians'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Technicians & Contractors</span>
            <span className="text-[10px] bg-black/10 px-1.5 py-0.2 rounded-full font-extrabold">
              {workers.length}
            </span>
          </button>
        </div>

        {/* Timeframe Filter */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl shrink-0">
          <button
            onClick={() => setTimeframe('month')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
              timeframe === 'month' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => setTimeframe('quarter')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
              timeframe === 'quarter' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Q3 FY26
          </button>
          <button
            onClick={() => setTimeframe('annual')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
              timeframe === 'annual' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Annual
          </button>
        </div>
      </div>

      {/* 1. GRAM PANCHAYATS TAB */}
      {activeTab === 'panchayats' && (
        <div className="space-y-4">
          {/* Search & Sort Filters */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search Gram Panchayat, Taluk, or PDO..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
              <span className="text-xs font-bold text-slate-500">Sort by:</span>
              <select
                value={sortMetric}
                onChange={(e) => setSortMetric(e.target.value as SortMetric)}
                className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="rank">State Rank (Official)</option>
                <option value="healthScore">Health Score Index</option>
                <option value="slaSpeed">Fastest SLA Resolution (Hours)</option>
                <option value="recovery">Warranty Recovered (₹)</option>
              </select>
            </div>
          </div>

          {/* Podium for Top 3 Gram Panchayats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {sortedGps.slice(0, 3).map((gp, idx) => {
              const rankOrder = idx === 0 ? 1 : idx === 1 ? 2 : 3;
              const medalColor = 
                rankOrder === 1 ? 'from-amber-400 to-amber-600 text-amber-950 border-amber-300' :
                rankOrder === 2 ? 'from-slate-300 to-slate-400 text-slate-900 border-slate-300' :
                'from-amber-700 to-amber-800 text-white border-amber-600';

              return (
                <div
                  key={gp.id}
                  className={`bg-white rounded-3xl p-5 border-2 ${
                    rankOrder === 1 ? 'border-amber-400 shadow-lg ring-4 ring-amber-100' : 'border-slate-200 shadow-sm'
                  } relative overflow-hidden flex flex-col justify-between space-y-4`}
                >
                  {/* Top Badge */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${medalColor} flex items-center justify-center font-black text-base shadow-sm shrink-0`}>
                        #{rankOrder}
                      </div>
                      <div>
                        <span className="text-[10px] font-extrabold uppercase text-slate-400">
                          {gp.talukName}
                        </span>
                        <h3 className="text-sm font-black text-slate-900">{gp.name}</h3>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-black text-amber-600">{gp.healthScore}</span>
                      <div className="text-[9px] font-bold text-slate-400 uppercase">Health Score</div>
                    </div>
                  </div>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs">
                    <div>
                      <div className="text-[10px] text-slate-500">Avg Resolution:</div>
                      <div className="font-extrabold text-slate-800 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-emerald-600" />
                        <span>{gp.avgResolutionTimeHours} hrs</span>
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] text-slate-500">SLA Adherence:</div>
                      <div className="font-extrabold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>98.4%</span>
                      </div>
                    </div>

                    <div className="col-span-2 pt-1 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Warranty Recovered:</span>
                      <span className="font-black text-indigo-700">₹{(gp.warrantyClaimsRecoveredInr / 100000).toFixed(2)} Lakhs</span>
                    </div>
                  </div>

                  {/* PDO Contact Chip */}
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                    <span className="text-[11px] text-slate-500">{gp.pdoName}</span>
                    <button
                      onClick={() => setSelectedGpModal(gp)}
                      className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>View Dossier</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Full Table Leaderboard */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <span>Gram Panchayat Standing Registry ({sortedGps.length})</span>
              </h3>
              <span className="text-xs font-bold text-slate-500">Updated: Today, 02:00 AM IST</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-extrabold text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Rank</th>
                    <th className="py-3 px-4">Gram Panchayat & Taluk</th>
                    <th className="py-3 px-4">Health Score</th>
                    <th className="py-3 px-4">Resolution Velocity</th>
                    <th className="py-3 px-4">Total Assets</th>
                    <th className="py-3 px-4">Resolved Grievances</th>
                    <th className="py-3 px-4">Warranty Recovery</th>
                    <th className="py-3 px-4">PDO In-Charge</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {sortedGps.map((gp, idx) => (
                    <tr key={gp.id} className="hover:bg-amber-50/40 transition-colors">
                      <td className="py-3.5 px-4 font-black">
                        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-xl font-black text-xs ${
                          idx === 0 ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                          idx === 1 ? 'bg-slate-100 text-slate-800' :
                          idx === 2 ? 'bg-amber-50 text-amber-800' : 'text-slate-600'
                        }`}>
                          #{idx + 1}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-black text-slate-900">{gp.name}</div>
                        <div className="text-[10px] text-slate-400">{gp.talukName} • {gp.districtName}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-black text-amber-700">{gp.healthScore}</span>
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                            {gp.status}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-slate-700">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{gp.avgResolutionTimeHours} Hours</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600">
                        {gp.workingAssets} / {gp.totalAssets} Active
                      </td>

                      <td className="py-3.5 px-4 font-bold text-emerald-700">
                        {gp.resolvedComplaints} resolved
                      </td>

                      <td className="py-3.5 px-4 font-black text-indigo-700">
                        ₹{(gp.warrantyClaimsRecoveredInr / 100000).toFixed(2)}L
                      </td>

                      <td className="py-3.5 px-4 text-slate-600">
                        <div className="font-bold">{gp.pdoName}</div>
                        <div className="text-[10px] text-slate-400">{gp.pdoPhone}</div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedGpModal(gp)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-amber-100 hover:text-amber-900 text-slate-700 font-bold text-[11px] transition-colors cursor-pointer"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. TALUKS TAB */}
      {activeTab === 'taluks' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {talukList.map((taluk, idx) => (
              <div
                key={taluk.id}
                className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2.5">
                    <span className="w-8 h-8 rounded-xl bg-purple-100 text-purple-900 font-black flex items-center justify-center text-xs">
                      #{idx + 1}
                    </span>
                    <div>
                      <h4 className="text-sm font-black text-slate-900">{taluk.name}</h4>
                      <div className="text-[10px] text-slate-400">{taluk.totalGramPanchayats} Gram Panchayats</div>
                    </div>
                  </div>

                  <span className="text-sm font-black text-purple-700">{taluk.healthIndex}%</span>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400">Total Assets:</span>
                    <div className="font-bold text-slate-800">{taluk.totalAssets} Units</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400">Avg Resolution:</span>
                    <div className="font-bold text-slate-800">{taluk.avgResolutionHours} hrs</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400">Resolved:</span>
                    <div className="font-bold text-emerald-700">{taluk.resolvedComplaints}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400">Warranty Claimed:</span>
                    <div className="font-bold text-indigo-700">₹{taluk.warrantyClaimsRecoveredInrLakhs}L</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. DISTRICTS TAB */}
      {activeTab === 'districts' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-900">
                Karnataka State 31 District Infrastructure Index
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-extrabold text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Rank</th>
                    <th className="py-3 px-4">District</th>
                    <th className="py-3 px-4">Health Index</th>
                    <th className="py-3 px-4">Taluks / GPs</th>
                    <th className="py-3 px-4">Total Assets</th>
                    <th className="py-3 px-4">Resolved Grievances</th>
                    <th className="py-3 px-4">Grant Utilized</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {districtList.map((dist, idx) => (
                    <tr key={dist.id} className="hover:bg-slate-50">
                      <td className="py-3.5 px-4 font-black">#{idx + 1}</td>
                      <td className="py-3.5 px-4 font-black text-slate-900">{dist.name}</td>
                      <td className="py-3.5 px-4 font-black text-amber-700">{dist.overallHealthIndex}%</td>
                      <td className="py-3.5 px-4 text-slate-600">{dist.totalTaluks} Taluks • {dist.totalGramPanchayats} GPs</td>
                      <td className="py-3.5 px-4 font-mono">{(dist.totalPublicAssets ?? 0).toLocaleString()}</td>
                      <td className="py-3.5 px-4 font-bold text-emerald-700">{(dist.resolvedComplaints ?? 0).toLocaleString()}</td>
                      <td className="py-3.5 px-4 text-slate-700">₹{dist.budgetUtilizedInrLakhs} Lakhs</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. TECHNICIANS & CONTRACTORS TAB */}
      {activeTab === 'technicians' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {sortedWorkers.map((worker, idx) => (
              <div
                key={worker.id}
                className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:shadow-lg transition-all space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      idx === 0 ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                      idx === 1 ? 'bg-slate-100 text-slate-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {idx === 0 ? '🏆 Star Performer' : `Rank #${idx + 1}`}
                    </span>
                    <div className="flex items-center space-x-1 text-amber-600 font-black text-xs">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{worker.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 text-white flex items-center justify-center font-black text-lg">
                      {worker.name[0]}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900">{worker.name}</h4>
                      <p className="text-[11px] text-slate-500">{worker.trade}</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500 text-[11px]">Completed Repairs:</span>
                      <span className="font-bold text-slate-800">{worker.completedTasks}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 text-[11px]">Active Tasks:</span>
                      <span className="font-bold text-amber-700">{worker.activeTasks}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 text-[11px]">Jurisdiction:</span>
                      <span className="font-bold text-slate-700 truncate max-w-[120px]">{worker.panchayat}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-mono text-slate-400">{worker.phone}</span>
                  {onSelectWorker && (
                    <button
                      onClick={() => onSelectWorker(worker.id)}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
                    >
                      Assign Job →
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* GP Detail Modal */}
      {selectedGpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-extrabold text-amber-600 uppercase">
                  Panchayat Performance Dossier
                </span>
                <h3 className="text-base font-black text-slate-900">{selectedGpModal.name}</h3>
                <p className="text-xs text-slate-500">
                  {selectedGpModal.talukName} • {selectedGpModal.districtName}
                </p>
              </div>
              <button
                onClick={() => setSelectedGpModal(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <span className="text-[10px] text-slate-400">Overall Health Score:</span>
                <div className="text-xl font-black text-amber-600">{selectedGpModal.healthScore}%</div>
                <div className="text-[10px] font-bold text-emerald-600">Status: {selectedGpModal.status}</div>
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <span className="text-[10px] text-slate-400">Avg Resolution SLA:</span>
                <div className="text-xl font-black text-slate-900">{selectedGpModal.avgResolutionTimeHours} hrs</div>
                <div className="text-[10px] font-bold text-slate-500">State Target: &lt;24 hrs</div>
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <span className="text-[10px] text-slate-400">Public Assets:</span>
                <div className="font-bold text-slate-800">{selectedGpModal.workingAssets} Operational</div>
                <div className="text-[10px] text-red-500 font-bold">{selectedGpModal.criticalAssets} Critical Defect</div>
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <span className="text-[10px] text-slate-400">Warranty Claimed:</span>
                <div className="font-bold text-indigo-700">₹{(selectedGpModal.warrantyClaimsRecoveredInr / 100000).toFixed(2)} Lakhs</div>
                <div className="text-[10px] text-slate-500">Contractor Penalty Deductions</div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-xs space-y-1 text-amber-950">
              <div className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                <span>Officer in Charge (PDO):</span>
              </div>
              <p className="text-[11px] text-slate-700">
                {selectedGpModal.pdoName} • Phone: {selectedGpModal.pdoPhone}
              </p>
              <div className="text-[10px] text-slate-500">
                Top Risk Focus: {selectedGpModal.topRiskCategory}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end space-x-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedGpModal(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Close
              </button>
              {onSelectGramPanchayat && (
                <button
                  onClick={() => {
                    onSelectGramPanchayat(selectedGpModal.name);
                    setSelectedGpModal(null);
                  }}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2 rounded-xl text-xs font-black shadow-xs cursor-pointer"
                >
                  View Panchayat Portal →
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
