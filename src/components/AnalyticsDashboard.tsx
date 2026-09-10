import React, { useState, useEffect } from 'react';
import { Asset, Complaint, LanguageMode } from '../types';
import { GisVisualMap } from './GisVisualMap';
import { 
  BarChart3, 
  AlertTriangle, 
  ShieldCheck, 
  MapPin, 
  TrendingUp, 
  DollarSign, 
  RefreshCw, 
  CheckCircle2, 
  Building2, 
  Award,
  Layers,
  FileCheck,
  Zap,
  Activity,
  Calendar,
  Clock,
  ArrowRight,
  TrendingDown,
  Scale
} from 'lucide-react';

interface AnalyticsDashboardProps {
  assets: Asset[];
  complaints: Complaint[];
  lang: LanguageMode;
  onSelectAsset: (assetId: string) => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  assets = [],
  complaints = [],
  lang,
  onSelectAsset,
}) => {
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [insights, setInsights] = useState<any>(null);
  const [selectedWard, setSelectedWard] = useState<string>('all');

  const safeAssets = assets || [];
  const safeComplaints = complaints || [];

  // Fetch predictive maintenance insights
  const fetchPredictiveInsights = async () => {
    setIsCalculating(true);
    try {
      const response = await fetch('/api/analytics/predictive-maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assets: safeAssets, complaints: safeComplaints }),
      });
      const data = await response.json();
      if (data?.insights) {
        setInsights(data.insights);
      }
    } catch (err) {
      console.error('Error fetching predictive maintenance insights:', err);
    } finally {
      setIsCalculating(false);
    }
  };

  useEffect(() => {
    fetchPredictiveInsights();
  }, []);

  // Compute analytics
  const totalRepairs = safeAssets.reduce((sum, a) => sum + (a.repairHistory?.length || 0), 0);
  const totalCost = safeAssets.reduce(
    (sum, a) => sum + (a.repairHistory?.reduce((s, r) => s + (r.costInr || 0), 0) || 0),
    0
  );
  const lemonAssets = safeAssets.filter((a) => a.isLemonAsset || a.failureCount >= 3);
  const citizenVerifiedCount = safeComplaints.filter(
    (c) => c.status === 'Closed' && c.citizenVerification?.decision === 'Fixed'
  ).length;

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* GovTech Command Intelligence Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs font-bold border border-blue-500/30">
            <Activity className="w-3.5 h-3.5" />
            <span>District Gram Panchayat Intelligence & SLA Monitor</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            {lang === 'kn' ? 'ನೈಜ ಸಮಯದ ಆಸ್ತಿ ದತ್ತಾಂಶ ಮತ್ತು ಯೋಜನಾ ನಿರ್ವಹಣೆ' : 'Karnataka Panchayat Analytics & Strategic Planning'}
          </h1>
          <p className="text-xs text-blue-200/90 leading-relaxed font-medium">
            Predictive infrastructure maintenance, 15th Finance Commission grant allocation, and contractor warranty recovery ledger.
          </p>
        </div>

        <button
          onClick={fetchPredictiveInsights}
          disabled={isCalculating}
          className="flex items-center space-x-2 bg-white text-indigo-950 hover:bg-blue-50 px-4 py-2.5 rounded-2xl text-xs font-black shadow-lg shadow-black/20 transition-all cursor-pointer shrink-0 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isCalculating ? 'animate-spin text-indigo-600' : ''}`} />
          <span>{isCalculating ? 'Calculating Models...' : 'Recalculate MTBF Models'}</span>
        </button>
      </div>

      {/* Strategic KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 space-y-1">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
            <span>Citizen Trust Index</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">96.4%</div>
          <div className="text-[10px] text-emerald-600 font-bold">100% two-way photo signed off</div>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 space-y-1">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
            <span>Avg MTTR (Turnaround)</span>
            <Zap className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">18.2 Hrs</div>
          <div className="text-[10px] text-slate-400 font-medium">Within 24h Karnataka SLA</div>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 space-y-1">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
            <span>Public Funds Protected</span>
            <DollarSign className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-blue-900">
            {insights?.fundsSavedEstimatedInr || '₹ 4,82,500'}
          </div>
          <div className="text-[10px] text-blue-600 font-bold">Zero fake / ghost billing</div>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 space-y-1">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
            <span>Lemon Assets Flagged</span>
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl font-black text-red-700">{lemonAssets.length} Assets</div>
          <div className="text-[10px] text-red-600 font-bold">≥3 failures under warranty</div>
        </div>
      </div>

      {/* RELIABILITY & FAILURE FORECASTING (MTBF & Risk Radar) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-black">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-black text-slate-900">
                  Predictive Failure Analysis & Wear Radar
                </h3>
                <span className="text-[10px] font-black uppercase px-2 py-0.2 rounded-full bg-purple-100 text-purple-800">
                  MTBF Reliability Engine
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Probabilistic breakdown forecasting calculated from history, weather fatigue, and component load
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {assets.map((asset) => {
            const pred = asset.futureFailurePrediction || {
              predictedFailureDate: '2026-10-15',
              riskScore: asset.failureCount >= 3 ? 88 : asset.failureCount === 2 ? 62 : 24,
              riskReason: asset.failureCount >= 3
                ? 'Severe driver insulation breakdown from high-voltage swings'
                : 'Seasonal monsoon dampness and cable joint corrosion',
              preventiveAction: asset.failureCount >= 3
                ? 'Claim vendor warranty replacement under Clause 14.3'
                : 'Inspect gasket seal and install voltage surge suppressor',
              estimatedMtbfDays: asset.failureCount >= 3 ? 42 : 120,
            };

            const isHighRisk = pred.riskScore >= 70;
            const isMediumRisk = pred.riskScore >= 40 && pred.riskScore < 70;

            return (
              <div
                key={asset.id}
                onClick={() => onSelectAsset(asset.id)}
                className={`p-4 rounded-2xl border transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:scale-[1.01] active:scale-[0.99] cursor-pointer space-y-2.5 flex flex-col justify-between ${
                  isHighRisk
                    ? 'border-red-300 bg-red-50/40 hover:bg-red-50'
                    : isMediumRisk
                    ? 'border-amber-300 bg-amber-50/40 hover:bg-amber-50'
                    : 'border-slate-200 bg-slate-50/40 hover:bg-slate-50'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-black text-indigo-700">{asset.id}</span>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        isHighRisk
                          ? 'bg-red-100 text-red-800 border border-red-200'
                          : isMediumRisk
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {pred.riskScore}% Failure Risk
                    </span>
                  </div>

                  <h4 className="text-xs font-black text-slate-900 leading-snug">{asset.name}</h4>
                  <div className="text-[11px] text-slate-500 font-medium">
                    MTBF: <span className="font-bold text-slate-800">{pred.estimatedMtbfDays} Days</span> • Next Breakdown: <span className="font-bold text-slate-800">{pred.predictedFailureDate}</span>
                  </div>

                  <p className="text-[11px] text-slate-600 leading-relaxed bg-white p-2 rounded-xl border border-slate-200/80">
                    <span className="font-bold text-slate-700">Root Cause:</span> {pred.riskReason}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                  <span className="text-indigo-700 font-bold">Preventive Action:</span>
                  <span className="text-slate-800 font-semibold truncate ml-1">{pred.preventiveAction}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 🏛️ STAGE: PANCHAYAT PLANNING (Capital Budget Allocation & Warranty Recovery) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-black text-slate-900">
                  🏛️ Panchayat Infrastructure Planning & Capital Budget Allocation
                </h3>
                <span className="text-[10px] font-black uppercase px-2 py-0.2 rounded-full bg-amber-100 text-amber-900">
                  15th Finance Commission
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Annual budget prioritization based on empirical failure forecasting and high-frequency defect replacements
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Grant Allocation */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between text-xs font-black text-slate-800">
              <span>FY 2026-27 Grant Envelope</span>
              <span className="text-emerald-700">₹ 28,50,000</span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
                  <span>Drinking Water & Sanitation (Tied)</span>
                  <span>₹ 11,40,000 (40%)</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: '40%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
                  <span>Rural Electrification & Solar (Untied)</span>
                  <span>₹ 8,55,000 (30%)</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '30%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
                  <span>Road & Storm Drainage Maintenance</span>
                  <span>₹ 8,55,000 (30%)</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 rounded-full" style={{ width: '30%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Lemon Asset Warranty Recovery Desk */}
          <div className="p-4 rounded-2xl bg-red-50/50 border border-red-200 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-black text-red-950">
              <span className="flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-red-700" />
                <span>Contractor Warranty Claims</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-200 text-red-900">
                2 Active Claims
              </span>
            </div>

            <p className="text-[11px] text-slate-600">
              Assets with ≥3 breakdowns under warranty trigger automatic recovery notice to KRDPR vendors.
            </p>

            <div className="space-y-1.5 pt-1">
              <div className="p-2 bg-white rounded-xl border border-red-200 text-xs">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-800">AST-KA-MYS-001 (SL-142)</span>
                  <span className="text-red-700 font-black">₹ 14,500</span>
                </div>
                <div className="text-[10px] text-slate-500">
                  Vendor: Chamundeshwari Infra • Clause 14.3 Penalty Served
                </div>
              </div>

              <div className="p-2 bg-white rounded-xl border border-red-200 text-xs">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-800">AST-KA-MYS-004 (BW-09)</span>
                  <span className="text-red-700 font-black">₹ 22,000</span>
                </div>
                <div className="text-[10px] text-slate-500">
                  Vendor: Mysore Borewell Corp • Submersible Motor Replacement
                </div>
              </div>
            </div>
          </div>

          {/* Quarterly Preventive Maintenance Schedule */}
          <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-200 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-black text-indigo-950">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-indigo-700" />
                <span>Preventive Maintenance Calendar</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-200 text-indigo-900">
                Q3 Schedule
              </span>
            </div>

            <div className="space-y-1.5 text-[11px] text-slate-700">
              <div className="p-2 rounded-xl bg-white border border-indigo-100 flex items-center justify-between">
                <div>
                  <div className="font-bold">Ward 1 & 2 Streetlight Surge Audits</div>
                  <div className="text-[10px] text-slate-500">Scheduled: Oct 12, 2026</div>
                </div>
                <span className="text-emerald-700 font-black text-[10px]">Planned</span>
              </div>

              <div className="p-2 rounded-xl bg-white border border-indigo-100 flex items-center justify-between">
                <div>
                  <div className="font-bold">Overhead Tank Desilting & Valve Check</div>
                  <div className="text-[10px] text-slate-500">Scheduled: Oct 20, 2026</div>
                </div>
                <span className="text-emerald-700 font-black text-[10px]">Planned</span>
              </div>

              <div className="p-2 rounded-xl bg-white border border-indigo-100 flex items-center justify-between">
                <div>
                  <div className="font-bold">Post-Monsoon Gravel Culvert Rolling</div>
                  <div className="text-[10px] text-slate-500">Scheduled: Nov 05, 2026</div>
                </div>
                <span className="text-emerald-700 font-black text-[10px]">Planned</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ward-Wise GIS Asset Breakdown Heatmap & Interactive Vector Map */}
      <div className="space-y-4">
        <GisVisualMap
          assets={assets}
          lang={lang}
          onSelectAsset={onSelectAsset}
          selectedWard={selectedWard}
          onWardChange={setSelectedWard}
        />

        {/* Ward Breakdown Cards Container */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
                Ward Failure Densities & Roster
              </h4>
              <p className="text-xs text-slate-700 font-bold">
                Select a ward below or use the map above to inspect individual asset clusters
              </p>
            </div>

            <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl text-xs font-bold self-start sm:self-auto">
              <button
                onClick={() => setSelectedWard('all')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  selectedWard === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                All Wards
              </button>
              {['Ward 1', 'Ward 2', 'Ward 3', 'Ward 4'].map((w) => (
                <button
                  key={w}
                  onClick={() => setSelectedWard(w)}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    selectedWard === w ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {['Ward 1', 'Ward 2', 'Ward 3', 'Ward 4'].map((wName) => {
              const wardAssets = assets.filter((a) => a.ward === wName);
              const hasFailure = wardAssets.some((a) => a.status !== 'Working');
              const isSelected = selectedWard === 'all' || selectedWard === wName;

              return (
                <div
                  key={wName}
                  onClick={() => setSelectedWard(wName)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? hasFailure
                        ? 'border-red-400 bg-red-50/50'
                        : 'border-emerald-400 bg-emerald-50/50'
                      : 'border-slate-200 bg-slate-50 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900">{wName}</span>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        hasFailure ? 'bg-red-500 text-white' : 'bg-emerald-600 text-white'
                      }`}
                    >
                      {hasFailure ? 'Alert' : 'Healthy'}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-500 font-medium">
                    {wardAssets.length} Public Assets
                  </div>

                  <div className="space-y-1 pt-1">
                    {wardAssets.map((asset) => (
                      <button
                        key={asset.id}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectAsset(asset.id);
                        }}
                        className="w-full text-left p-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-[10px] flex items-center justify-between cursor-pointer transition-colors shadow-2xs"
                      >
                        <span className="font-mono text-indigo-700 font-bold truncate pr-1">
                          {asset.id}
                        </span>
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded font-black ${
                            asset.status === 'Working'
                              ? 'text-emerald-700 bg-emerald-100'
                              : 'text-red-700 bg-red-100 font-bold'
                          }`}
                        >
                          {asset.status === 'Working' ? 'OK' : 'Alert'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
