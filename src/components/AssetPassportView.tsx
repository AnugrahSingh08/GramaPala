import React, { useState } from 'react';
import { Asset, Complaint, LanguageMode } from '../types';
import { RepairPhotoGallery } from './RepairPhotoGallery';
import { AuditReportModal } from './AuditReportModal';
import { 
  FileText, 
  QrCode, 
  Search, 
  AlertTriangle, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Wrench, 
  Calendar, 
  TrendingUp, 
  CheckCircle2, 
  DollarSign, 
  ExternalLink,
  Printer,
  Download
} from 'lucide-react';

interface AssetPassportViewProps {
  assets: Asset[];
  complaints?: Complaint[];
  selectedAssetId?: string;
  onSelectAsset: (assetId: string) => void;
  lang: LanguageMode;
}

export const AssetPassportView: React.FC<AssetPassportViewProps> = ({
  assets = [],
  complaints = [],
  selectedAssetId,
  onSelectAsset,
  lang,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showQRModal, setShowQRModal] = useState<boolean>(false);
  const [showAuditModal, setShowAuditModal] = useState<boolean>(false);

  const safeAssets = assets || [];
  const activeAsset = safeAssets.find((a) => a.id === selectedAssetId) || safeAssets[0];

  const filteredAssets = safeAssets.filter((asset) => {
    if (categoryFilter !== 'all' && asset.category !== categoryFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        asset.id.toLowerCase().includes(q) ||
        asset.name.toLowerCase().includes(q) ||
        asset.ward.toLowerCase().includes(q) ||
        asset.contractor.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full text-xs font-bold border border-amber-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Digital Twin & Public Asset Registry</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            {lang === 'kn' ? 'ಗ್ರಾಮ ಪಂಚಾಯತ್ ಸಾರ್ವಜನಿಕ ಆಸ್ತಿ ಪಾಸ್‌ಪೋರ್ಟ್' : 'Public Asset Passport & Maintenance DNA'}
          </h1>
          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            {lang === 'kn'
              ? 'ಪ್ರತಿಯೊಂದು ಬೀದಿ ದೀಪ, ಬೋರ್‌ವೆಲ್ ಮತ್ತು ರಸ್ತೆಯ ಸಂಪೂರ್ಣ ದುರಸ್ತಿ ಇತಿಹಾಸ, ಗುತ್ತಿಗೆದಾರರ ವಾರಂಟಿ ಮತ್ತು ಆವರ್ತಕ ವೈಫಲ್ಯಗಳ ದಾಖಲೆ.'
              : 'Every physical public asset has a digital passport documenting lifecycle failures, contractor warranties, MTTR metrics, and "Lemon Asset" accountability.'}
          </p>
        </div>

        {/* Lemon Asset Alert Indicator */}
        <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 flex items-center space-x-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center font-black">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="text-xs">
            <div className="font-bold text-red-300">Lemon Asset Watchdog</div>
            <div className="text-slate-300 text-[11px]">
              {assets.filter((a) => a.isLemonAsset).length} assets flagged with ≥3 breakdowns
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Asset Catalog & Detailed Asset Passport File */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Asset Catalog Search & Selection (4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Asset ID (e.g. SL-102)..."
                className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-300 font-medium"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full text-xs font-semibold px-2.5 py-1.5 rounded-xl border border-slate-300 bg-white"
            >
              <option value="all">All Categories</option>
              <option value="Streetlight">Streetlights</option>
              <option value="Water Supply">Water Supply Pipelines</option>
              <option value="Borewell Pump">Borewell Pumps</option>
              <option value="Rural Road">Rural Roads</option>
              <option value="Public Toilet">Public Toilets</option>
            </select>
          </div>

          {/* List of Assets */}
          <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
            {filteredAssets.map((asset) => {
              const isSelected = activeAsset.id === asset.id;
              return (
                <div
                  key={asset.id}
                  onClick={() => onSelectAsset(asset.id)}
                  className={`p-3.5 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs active:scale-[0.99] cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'border-amber-500 bg-amber-50/70 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={asset.imageUrl}
                      alt={asset.name}
                      className="w-11 h-11 rounded-xl object-cover border border-slate-200 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="text-xs font-mono font-black text-slate-900">{asset.id}</span>
                        {asset.isLemonAsset && (
                          <span className="text-[9px] font-black bg-red-100 text-red-700 px-1.5 py-0.2 rounded uppercase">
                            Lemon Alert
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-bold text-slate-700 line-clamp-1">{asset.name}</div>
                      <div className="text-[11px] text-slate-400">{asset.ward}</div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 uppercase ${
                      asset.status === 'Working'
                        ? 'bg-emerald-100 text-emerald-800'
                        : asset.status === 'Critical Failure'
                        ? 'bg-red-100 text-red-800 animate-pulse'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {asset.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Complete Asset Passport Profile Card (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-6">
            {/* Passport Header with QR Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
              <div className="flex items-start space-x-3.5">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-black shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-mono font-black text-amber-700">{activeAsset.id}</span>
                    <span
                      className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase ${
                        activeAsset.status === 'Working'
                          ? 'bg-emerald-100 text-emerald-800'
                          : activeAsset.status === 'Critical Failure'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      Status: {activeAsset.status}
                    </span>
                    {activeAsset.isLemonAsset && (
                      <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase flex items-center space-x-1">
                        <AlertTriangle className="w-3 h-3" />
                        <span>High Failure Rate (Lemon Asset)</span>
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg font-black text-slate-900 mt-1">{activeAsset.name}</h2>
                  <p className="text-xs text-slate-500 font-medium">
                    {activeAsset.panchayat} • {activeAsset.ward} • Installed {activeAsset.installationDate}
                  </p>
                </div>
              </div>

              {/* Action Buttons: Download Audit Report & Physical QR Tag */}
              <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
                <button
                  onClick={() => setShowAuditModal(true)}
                  className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md shadow-indigo-600/20"
                  title="Generate structured JSON or PDF summary of asset repair history for official government documentation"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Audit Report</span>
                </button>

                <button
                  onClick={() => setShowQRModal(true)}
                  className="flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border border-slate-200"
                >
                  <QrCode className="w-4 h-4 text-slate-700" />
                  <span>Physical QR Tag</span>
                </button>
              </div>
            </div>

            {/* Lemon Asset Alert Callout if applicable */}
            {activeAsset.isLemonAsset && (
              <div className="bg-red-50 border-2 border-red-200 p-4 rounded-2xl space-y-1.5">
                <div className="flex items-center space-x-2 text-xs font-black text-red-900">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span>CONTRACTOR WARRANTY DEFECT AUDIT (LEMON ASSET ALERT)</span>
                </div>
                <p className="text-xs text-red-800 leading-relaxed font-medium">
                  This public asset has suffered <strong className="font-extrabold">{activeAsset.failureCount} recorded breakdowns</strong> since installation. Under Karnataka Panchayat Procurement Rules, assets with ≥3 failures under warranty trigger mandatory vendor show-cause notice and free component overhaul by contractor: <strong>{activeAsset.contractor}</strong>.
                </p>
              </div>
            )}

            {/* Asset Metadata Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <div>
                <div className="text-[11px] font-bold text-slate-400">Category</div>
                <div className="text-xs font-black text-slate-900 mt-0.5">{activeAsset.category}</div>
              </div>
              <div>
                <div className="text-[11px] font-bold text-slate-400">Contractor / Vendor</div>
                <div className="text-xs font-black text-slate-900 mt-0.5 line-clamp-1">{activeAsset.contractor}</div>
              </div>
              <div>
                <div className="text-[11px] font-bold text-slate-400">Warranty Expiry</div>
                <div className="text-xs font-black text-slate-900 mt-0.5">{activeAsset.warrantyExpiry}</div>
              </div>
              <div>
                <div className="text-[11px] font-bold text-slate-400">GPS Coordinates</div>
                <div className="text-xs font-mono font-bold text-slate-900 mt-0.5">
                  {activeAsset.coordinates.lat}° N, {activeAsset.coordinates.lng}° E
                </div>
              </div>
            </div>

            {/* Complete Repair History Timeline (From Problem Statement Page 4) */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="text-sm font-black text-slate-900 flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>Immutable Repair & Maintenance History</span>
                </h3>
                <div className="flex items-center space-x-2.5">
                  <span className="text-xs text-slate-400 font-medium">
                    {activeAsset.repairHistory.length} Recorded Complaints
                  </span>
                  <button
                    onClick={() => setShowAuditModal(true)}
                    className="inline-flex items-center space-x-1.5 text-xs font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/80 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                    title="Export official audit report"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Audit Dossier</span>
                  </button>
                </div>
              </div>

              {/* Visual Condition Progression Timeline Ribbon */}
              <div className="bg-slate-50/90 border border-slate-200/90 rounded-2xl p-3.5 sm:p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-indigo-600" />
                    <span className="text-xs font-black text-slate-900 uppercase tracking-wide">
                      Lifecycle Health & Condition Progression
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 text-[11px] font-bold">
                    <span className="flex items-center space-x-1 text-emerald-700">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>Working</span>
                    </span>
                    <span className="flex items-center space-x-1 text-amber-700">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      <span>Repaired</span>
                    </span>
                    <span className="flex items-center space-x-1 text-red-700">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      <span>Defect</span>
                    </span>
                  </div>
                </div>

                {/* Milestone Progression Cards */}
                <div className="flex items-center overflow-x-auto pb-1 gap-2 sm:gap-3 scrollbar-none">
                  {/* Initial Commissioning Milestone */}
                  <div className="shrink-0 flex items-center space-x-2 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-2xs">
                    <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-[11px]">
                      <div className="font-extrabold text-slate-900">Commissioned</div>
                      <div className="text-slate-400 text-[10px] font-mono">{activeAsset.installationDate}</div>
                    </div>
                  </div>

                  {activeAsset.repairHistory.map((h, i) => {
                    const isClosed = h.status === 'Closed';
                    return (
                      <React.Fragment key={`milestone-${h.complaintId}-${i}`}>
                        <span className="text-slate-300 font-bold shrink-0">➔</span>
                        <div
                          className={`shrink-0 flex items-center space-x-2 px-3 py-2 rounded-xl border shadow-2xs ${
                            isClosed
                              ? 'bg-white border-slate-200'
                              : 'bg-red-50 border-red-300 text-red-950'
                          }`}
                        >
                          <div
                            className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${
                              isClosed
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-red-100 text-red-700 animate-pulse'
                            }`}
                          >
                            {isClosed ? <Wrench className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                          </div>
                          <div className="text-[11px] max-w-[130px]">
                            <div className="font-extrabold truncate text-slate-900">{h.complaintId}</div>
                            <div className="text-slate-500 text-[10px] truncate">{h.date}</div>
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>

              {/* Timeline Cards */}
              <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {activeAsset.repairHistory.map((rec, idx) => {
                  const matchingComplaint = complaints.find((c) => c.id === rec.complaintId);

                  return (
                    <div key={idx} className="relative group">
                      {/* Circle marker */}
                      <div
                        className={`absolute -left-[23px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
                          rec.status === 'Closed'
                            ? 'bg-emerald-500'
                            : rec.status === 'Pending'
                            ? 'bg-red-500 animate-ping'
                            : 'bg-amber-500'
                        }`}
                      />

                      <div className="bg-slate-50 hover:bg-slate-100/70 transition-colors p-4 rounded-2xl border border-slate-200/90 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-mono font-bold text-indigo-700">{rec.complaintId}</span>
                            <span className="text-[11px] text-slate-400">• {rec.date}</span>
                          </div>
                          <span
                            className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                              rec.status === 'Closed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {rec.status === 'Closed' ? `Fixed in ${rec.resolvedInDays} Day${rec.resolvedInDays === 1 ? '' : 's'}` : 'Pending Fix'}
                          </span>
                        </div>

                        <p className="text-xs font-bold text-slate-800">{rec.issue}</p>

                        <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-1.5 border-t border-slate-200/60 gap-1">
                          <span>Technician: {rec.workerName}</span>
                          {rec.partsReplaced && (
                            <span className="text-indigo-900 font-medium">Replaced: {rec.partsReplaced}</span>
                          )}
                          {typeof rec.costInr === 'number' && rec.costInr > 0 && (
                            <span className="font-bold text-slate-700">Cost: ₹{rec.costInr.toLocaleString('en-IN')}</span>
                          )}
                        </div>

                        {/* Visual Condition Photo Gallery */}
                        <RepairPhotoGallery
                          record={rec}
                          complaint={matchingComplaint}
                          assetName={activeAsset.name}
                          assetId={activeAsset.id}
                          lang={lang}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Physical QR Code Tag Modal */}
      {showQRModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <span className="text-xs font-extrabold uppercase text-slate-500 tracking-wider">
                Physical Asset QR Tag
              </span>
              <button
                onClick={() => setShowQRModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Simulated QR Code Canvas */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 inline-block">
              <div className="w-48 h-48 bg-white border-4 border-slate-900 p-2 rounded-xl flex flex-col items-center justify-center relative">
                <QrCode className="w-36 h-36 text-slate-900" />
                <div className="text-[10px] font-mono font-black text-slate-900 mt-1">
                  {activeAsset.id}
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-black text-slate-900">{activeAsset.name}</h4>
              <p className="text-xs text-slate-500">{activeAsset.ward} • Belavadi Gram Panchayat</p>
              <p className="text-[11px] text-slate-400">
                Villagers can scan this QR code on any streetlight pole or water tap to instantly view past repairs or log new breakdown!
              </p>
            </div>

            <button
              onClick={() => window.print()}
              className="w-full flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Metal Tag for Pole</span>
            </button>
          </div>
        </div>
      )}

      {/* Official Government Audit Report Modal */}
      <AuditReportModal
        isOpen={showAuditModal}
        onClose={() => setShowAuditModal(false)}
        asset={activeAsset}
        complaints={complaints}
        lang={lang}
      />
    </div>
  );
};
