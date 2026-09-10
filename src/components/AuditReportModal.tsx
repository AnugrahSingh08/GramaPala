import React, { useState } from 'react';
import { Asset, Complaint, LanguageMode } from '../types';
import {
  generateStructuredAuditJSON,
  downloadAuditReportJSON,
  downloadAuditReportPDF,
} from '../utils/auditReportGenerator';
import {
  FileText,
  Download,
  FileCode,
  Printer,
  X,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Building2,
  Clock,
  Calendar,
  Layers,
  Sparkles,
  DollarSign
} from 'lucide-react';

interface AuditReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: Asset;
  complaints?: Complaint[];
  lang: LanguageMode;
}

export const AuditReportModal: React.FC<AuditReportModalProps> = ({
  isOpen,
  onClose,
  asset,
  complaints = [],
  lang,
}) => {
  const [downloadingFormat, setDownloadingFormat] = useState<'pdf' | 'json' | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const auditData = generateStructuredAuditJSON(asset, complaints);

  const handleDownloadPDF = () => {
    setDownloadingFormat('pdf');
    try {
      downloadAuditReportPDF(asset, complaints);
      setDownloadSuccess('PDF Audit Report generated and downloaded successfully!');
      setTimeout(() => setDownloadSuccess(null), 3500);
    } catch (err) {
      console.error('Failed to generate PDF audit report', err);
    } finally {
      setDownloadingFormat(null);
    }
  };

  const handleDownloadJSON = () => {
    setDownloadingFormat('json');
    try {
      downloadAuditReportJSON(asset, complaints);
      setDownloadSuccess('Structured JSON Audit dataset downloaded successfully!');
      setTimeout(() => setDownloadSuccess(null), 3500);
    } catch (err) {
      console.error('Failed to generate JSON audit dataset', err);
    } finally {
      setDownloadingFormat(null);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 bg-slate-900 text-white flex items-start justify-between relative overflow-hidden">
          <div className="space-y-1 relative z-10">
            <div className="inline-flex items-center space-x-1.5 bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full text-[11px] font-bold border border-amber-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Official Government Audit Documentation</span>
            </div>
            <h2 className="text-base sm:text-xl font-black tracking-tight">
              {lang === 'kn'
                ? 'ಸಾರ್ವಜನಿಕ ಆಸ್ತಿ ಅಧಿಕೃತ ಲೆಕ್ಕಪರಿಶೋಧನಾ ವರದಿ'
                : 'Asset Audit & Maintenance Dossier'}
            </h2>
            <p className="text-xs text-slate-300 font-medium">
              Conforming to KRDPR Panchatantra 2.0 & 15th Finance Commission Asset Audit Standards
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-colors cursor-pointer relative z-10"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success Alert Banner */}
        {downloadSuccess && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-2.5 text-xs text-emerald-800 flex items-center space-x-2 font-bold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{downloadSuccess}</span>
          </div>
        )}

        {/* Scrollable Audit Report Preview Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-slate-800 text-xs">
          {/* Official Verification Reference Tag */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Audit Dossier Verification Code
              </div>
              <div className="font-mono font-black text-slate-900 text-xs sm:text-sm">
                {auditData.auditVerificationCode}
              </div>
            </div>
            <div className="text-right sm:text-right">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Audit Standard Authority
              </div>
              <div className="font-bold text-slate-700 text-xs">
                KRDPR / Panchatantra 2.0 Digital Ledger
              </div>
            </div>
          </div>

          {/* Lemon Asset Alert Banner (if applicable) */}
          {asset.isLemonAsset && (
            <div className="p-4 rounded-2xl bg-red-50 border-2 border-red-200 text-red-950 space-y-1">
              <div className="flex items-center space-x-2 font-black text-xs text-red-700">
                <AlertTriangle className="w-4 h-4" />
                <span>STATUTORY CONTRACTOR WARRANTY PENALTY ADVISORY</span>
              </div>
              <p className="text-xs leading-relaxed">
                This public asset has broken down <strong className="font-extrabold">{asset.failureCount} times</strong> during its active warranty period. In accordance with Karnataka Grama Panchayat Public Procurement & Infrastructure Rules, this report constitutes legal notice for vendor rectification by <strong className="font-extrabold">{asset.contractor}</strong>.
              </p>
            </div>
          )}

          {/* Section 1: Asset Core Details Matrix */}
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-600 flex items-center space-x-1.5">
              <Building2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>1. Asset Profile & Geo-Physical Verification</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div>
                <span className="text-[10px] font-bold text-slate-400">Asset ID</span>
                <p className="font-mono font-black text-indigo-700 text-xs">{asset.id}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400">Category</span>
                <p className="font-bold text-slate-900 text-xs">{asset.category}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400">Ward & GP</span>
                <p className="font-bold text-slate-900 text-xs">{asset.ward}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400">Current Health</span>
                <p
                  className={`font-black text-xs ${
                    asset.status === 'Working' ? 'text-emerald-600' : 'text-red-600'
                  }`}
                >
                  {asset.status}
                </p>
              </div>
              <div className="col-span-2">
                <span className="text-[10px] font-bold text-slate-400">Physical Location</span>
                <p className="font-medium text-slate-800 text-xs truncate" title={asset.location}>
                  {asset.location || `${asset.ward}, ${asset.panchayat}`}
                </p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400">GPS Coordinates</span>
                <p className="font-mono text-slate-700 text-[11px]">
                  {asset.coordinates.lat.toFixed(4)}°N, {asset.coordinates.lng.toFixed(4)}°E
                </p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400">Commissioned</span>
                <p className="font-bold text-slate-800 text-xs">{asset.installationDate}</p>
              </div>
            </div>
          </div>

          {/* Section 2: Procurement & Warranty Integrity */}
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-600 flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>2. Procurement Contractor & Warranty Status</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div>
                <span className="text-[10px] font-bold text-slate-400">Vendor / Contractor</span>
                <p className="font-extrabold text-slate-900 text-xs">{asset.contractor}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400">Warranty Expiration</span>
                <p
                  className={`font-bold text-xs ${
                    asset.isUnderWarranty ? 'text-emerald-700' : 'text-slate-500'
                  }`}
                >
                  {asset.warrantyExpiry} ({asset.isUnderWarranty ? 'Active' : 'Expired'})
                </p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400">Failures During Warranty</span>
                <p
                  className={`font-black text-xs ${
                    asset.failureCount >= 3 ? 'text-red-600 font-extrabold' : 'text-slate-700'
                  }`}
                >
                  {asset.failureCount} Events {asset.isLemonAsset ? '(Lemon Threshold Exceeded)' : ''}
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Financial & Resolution Metrics */}
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-600 flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>3. Financial Expenditure & Repair Performance</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400">Total Breakdown Incidents</span>
                <p className="text-base font-black text-slate-900 mt-0.5">
                  {auditData.maintenanceAuditSummary.totalReportedComplaints}
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400">Resolved vs Pending</span>
                <p className="text-base font-black text-slate-900 mt-0.5">
                  {auditData.maintenanceAuditSummary.resolvedComplaints} /{' '}
                  {auditData.maintenanceAuditSummary.pendingComplaints}
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400">Total Maintenance Cost</span>
                <p className="text-base font-black text-emerald-700 mt-0.5">
                  ₹{(auditData.maintenanceAuditSummary?.totalRepairExpenditureINR ?? 0).toLocaleString('en-IN')}
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400">Mean Time To Repair (MTTR)</span>
                <p className="text-base font-black text-slate-900 mt-0.5">
                  {auditData.maintenanceAuditSummary.averageResolutionDays} Days
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: Full Repair History Ledger Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-600 flex items-center space-x-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-700" />
                <span>4. Complete Repair History Ledger ({asset.repairHistory.length} Records)</span>
              </h4>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-900 text-white text-[10px] uppercase tracking-wider">
                    <th className="p-2.5 font-bold">#</th>
                    <th className="p-2.5 font-bold">Date</th>
                    <th className="p-2.5 font-bold">Complaint ID</th>
                    <th className="p-2.5 font-bold">Defect / Issue</th>
                    <th className="p-2.5 font-bold">Technician</th>
                    <th className="p-2.5 font-bold">Replaced Parts</th>
                    <th className="p-2.5 font-bold">Cost</th>
                    <th className="p-2.5 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {asset.repairHistory.map((rec, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-2.5 font-mono text-slate-400 text-[11px]">{idx + 1}</td>
                      <td className="p-2.5 font-medium whitespace-nowrap">{rec.date}</td>
                      <td className="p-2.5 font-mono font-bold text-indigo-700 whitespace-nowrap">
                        {rec.complaintId}
                      </td>
                      <td className="p-2.5 font-medium max-w-[180px]">{rec.issue}</td>
                      <td className="p-2.5 text-slate-600 whitespace-nowrap">{rec.workerName}</td>
                      <td className="p-2.5 text-slate-600 max-w-[140px] truncate">
                        {rec.partsReplaced || 'None'}
                      </td>
                      <td className="p-2.5 font-bold whitespace-nowrap">
                        ₹{(rec.costInr || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="p-2.5 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            rec.status === 'Closed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {rec.status === 'Closed' ? `${rec.resolvedInDays}d Fix` : 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 5: Government Signatories Attestation */}
          <div className="pt-2 border-t border-slate-200">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-3">
              Statutory Attestation & Digital Verification Block
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <div className="h-8 border-b border-dashed border-slate-300 mb-1 flex items-end justify-center text-[10px] font-mono text-emerald-700">
                  [DIGITALLY VERIFIED - PDO]
                </div>
                <span className="font-bold text-slate-900 block">Panchayat Development Officer</span>
                <span className="text-slate-400 text-[10px]">Belavadi Gram Panchayat</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <div className="h-8 border-b border-dashed border-slate-300 mb-1 flex items-end justify-center text-[10px] font-mono text-indigo-700">
                  [GP SEAL ATTESTED]
                </div>
                <span className="font-bold text-slate-900 block">Gram Panchayat Adhyaksha</span>
                <span className="text-slate-400 text-[10px]">Belavadi Gram Panchayat</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <div className="h-8 border-b border-dashed border-slate-300 mb-1 flex items-end justify-center text-[10px] font-mono text-amber-700">
                  [AUDIT COMPLIANT]
                </div>
                <span className="font-bold text-slate-900 block">Executive Technical Auditor</span>
                <span className="text-slate-400 text-[10px]">Panchayati Raj Engineering Div.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 font-medium">
            Select format for official submission to Taluk / Zilla Panchayat
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Download Structured JSON Button */}
            <button
              onClick={handleDownloadJSON}
              disabled={downloadingFormat !== null}
              className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs"
            >
              <FileCode className="w-4 h-4 text-indigo-600" />
              <span>{downloadingFormat === 'json' ? 'Generating JSON...' : 'Download JSON (NIC Format)'}</span>
            </button>

            {/* Download PDF Audit Report Button */}
            <button
              onClick={handleDownloadPDF}
              disabled={downloadingFormat !== null}
              className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md shadow-indigo-600/20"
            >
              <Download className="w-4 h-4" />
              <span>{downloadingFormat === 'pdf' ? 'Generating PDF...' : 'Download Official PDF Report'}</span>
            </button>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="p-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
              title="Print Audit Report"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
