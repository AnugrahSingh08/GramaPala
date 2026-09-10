import React, { useState } from 'react';
import { Complaint } from '../types';
import confetti from 'canvas-confetti';
import { 
  X, 
  CheckCircle2, 
  XCircle, 
  MapPin, 
  Calendar, 
  Wrench, 
  ShieldCheck, 
  FileCheck,
  Star,
  DollarSign,
  ClipboardList,
  Clock,
  AlertTriangle,
  Zap,
  ShieldAlert
} from 'lucide-react';

interface CitizenVerifyModalProps {
  isOpen: boolean;
  complaint: Complaint | null;
  onClose: () => void;
  onVerifyDecision: (
    complaintId: string, 
    decision: 'Fixed' | 'Not Fixed', 
    feedback?: string, 
    rating?: number
  ) => void;
  lang: 'en' | 'kn';
}

export const CitizenVerifyModal: React.FC<CitizenVerifyModalProps> = ({
  isOpen,
  complaint,
  onClose,
  onVerifyDecision,
  lang,
}) => {
  const [activeViewMode, setActiveViewMode] = useState<'split' | 'before' | 'after'>('split');
  const [feedback, setFeedback] = useState<string>('');
  const [rating, setRating] = useState<number>(5);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen || !complaint) return null;

  const handleDecision = (decision: 'Fixed' | 'Not Fixed') => {
    setIsSubmitting(true);
    if (decision === 'Fixed') {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // ignore confetti failures
      }
    }
    setTimeout(() => {
      onVerifyDecision(complaint.id, decision, feedback, rating);
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  const beforePhoto = complaint.photoUrl || 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&w=800&q=80';
  const afterPhoto = complaint.repairProof?.photoUrl || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="relative bg-white rounded-3xl max-w-3xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  {lang === 'kn' ? 'ನಾಗರಿಕ ದುರಸ್ತಿ ಪರಿಶೀಲನೆ (Citizen Sign-Off)' : 'Citizen Verification: Physical On-Ground Audit'}
                </h2>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-300">
                  {complaint.id}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Verify completed work order, inspect before/after evidence, and authorize contractor payment.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto space-y-4 pt-4 pr-1 flex-1">
          {/* 48-Hour Fallback Rule Banner */}
          <div className="bg-amber-50 border border-amber-300 p-3 rounded-2xl flex items-start justify-between text-amber-950 text-xs">
            <div className="flex items-start space-x-2.5">
              <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-extrabold text-amber-900">48-Hour Inactivity Fallback Active:</span>
                <p className="text-[11px] text-amber-800 font-medium mt-0.5">
                  If citizen does not take action within 48 hours, system will auto-close the grievance with an active 15-day reopen window.
                </p>
              </div>
            </div>
            <span className="bg-amber-200/80 text-amber-900 font-mono font-black text-[10px] px-2 py-1 rounded-lg shrink-0">
              ⏳ 38h 15m remaining
            </span>
          </div>

          {/* Quality Assurance & Visual Verification Badge */}
          <div className="bg-gradient-to-br from-indigo-50 via-white to-amber-50 p-3.5 rounded-2xl border border-indigo-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="items-center space-x-2.5 flex">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shrink-0">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-black text-indigo-950 flex items-center gap-1.5">
                  <span>Quality Assurance & AI Vision Check Passed</span>
                  <span className="text-[10px] font-extrabold px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    {complaint.repairProof?.qaVerification?.confidence || 96}% Confidence
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">
                  {complaint.repairProof?.qaVerification?.summary || 'Comparative inspection verifies component replacement and physical hazard clearance.'}
                </p>
              </div>
            </div>

            {/* Cost & Work Order Pills */}
            <div className="flex items-center space-x-2 shrink-0">
              <div className="bg-amber-100/80 border border-amber-300 px-2.5 py-1 rounded-xl text-center">
                <div className="text-[9px] font-bold text-amber-800 uppercase">Repair Cost</div>
                <div className="text-xs font-black text-amber-950">
                  ₹{complaint.repairProof?.repairCost?.totalCost || complaint.billOfQuantities?.totalEstimatedInr || 1850}
                </div>
              </div>

              {complaint.workOrder && (
                <div className="bg-blue-100/80 border border-blue-300 px-2.5 py-1 rounded-xl text-center">
                  <div className="text-[9px] font-bold text-blue-800 uppercase">Work Order</div>
                  <div className="text-xs font-black text-blue-950">
                    {complaint.workOrder.orderId}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Interactive Before vs After Visual Comparison */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">
                Visual Evidence Comparison (📷 Before vs 📷 After)
              </span>
              <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => setActiveViewMode('split')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    activeViewMode === 'split' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  Side-by-Side
                </button>
                <button
                  type="button"
                  onClick={() => setActiveViewMode('before')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    activeViewMode === 'before' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  Before Only
                </button>
                <button
                  type="button"
                  onClick={() => setActiveViewMode('after')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    activeViewMode === 'after' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  After Only
                </button>
              </div>
            </div>

            {/* Split / Side-by-Side Image Cards */}
            {activeViewMode === 'split' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Before Photo */}
                <div className="rounded-2xl border border-red-200 bg-red-50/20 overflow-hidden relative group">
                  <div className="absolute top-2.5 left-2.5 z-10 bg-red-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    <span>📷 Before Photo (Reported Damage)</span>
                  </div>
                  <img
                    src={beforePhoto}
                    alt="Reported Damage"
                    className="w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="p-2.5 bg-white/95 text-[11px] text-slate-600 border-t border-slate-100 flex items-center justify-between">
                    <span>Reported: {complaint.reportedAt}</span>
                    <span className="font-semibold text-red-600">{complaint.category}</span>
                  </div>
                </div>

                {/* After Photo */}
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/20 overflow-hidden relative group">
                  <div className="absolute top-2.5 left-2.5 z-10 bg-emerald-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3 text-white" />
                    <span>📷 After Photo (Repair Proof)</span>
                  </div>
                  <img
                    src={afterPhoto}
                    alt="Repaired Asset"
                    className="w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="p-2.5 bg-white/95 text-[11px] text-slate-600 border-t border-slate-100 flex items-center justify-between">
                    <span>Completed: {complaint.repairProof?.completedAt || 'Recently'}</span>
                    <span className="font-bold text-emerald-600">Proof Geotagged</span>
                  </div>
                </div>
              </div>
            ) : activeViewMode === 'before' ? (
              <div className="rounded-2xl border border-red-200 overflow-hidden relative">
                <div className="absolute top-2.5 left-2.5 z-10 bg-red-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase">
                  Before: Reported Damage
                </div>
                <img
                  src={beforePhoto}
                  alt="Reported Damage"
                  className="w-full h-64 object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : (
              <div className="rounded-2xl border border-emerald-200 overflow-hidden relative">
                <div className="absolute top-2.5 left-2.5 z-10 bg-emerald-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase">
                  After: Field Worker Repair Proof
                </div>
                <img
                  src={afterPhoto}
                  alt="Repaired Asset"
                  className="w-full h-64 object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}
          </div>

          {/* Technician Field Notes & Replaced Parts Metadata */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-800">
                <Wrench className="w-4 h-4 text-emerald-600" />
                <span>Field Technician Repair Report</span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                Contractor: {complaint.assignedWorker?.name || 'Venkatesh Rural Electricals'}
              </span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed bg-white p-2.5 rounded-xl border border-slate-200/80 font-medium">
              "{complaint.repairProof?.workerNotes || 'Inspected fixture, reconnected cable wiring, tested electrical load and secured housing bracket.'}"
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600">
              <div className="flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Geotag: {complaint.repairProof?.geoTag || '12.3365° N, 76.6192° E (Verified in Ward 3)'}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Parts: {complaint.repairProof?.partsReplaced?.join(', ') || 'Standard Certified Components'}</span>
              </div>
            </div>
          </div>

          {/* Citizen Feedback & Rating */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">
                {lang === 'kn' ? 'ನಿಮ್ಮ ಅಭಿಪ್ರಾಯ ಮತ್ತು ರೇಟಿಂಗ್' : 'Citizen Rating & Feedback (Triggers Contractor Payment)'}
              </label>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-0.5 text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <textarea
              rows={2}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Add your feedback on ground repair quality (e.g. 'Streetlight is working bright now, high road safety')..."
              className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            />
          </div>

          {/* Consequence Notification Pill */}
          <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-600" />
              <span>4+ Star Approval fast-tracks digital payment. Reopening applies penalty strike to contractor.</span>
            </span>
          </div>

          {/* Verification Decision Buttons: FIXED vs NOT FIXED */}
          <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* NOT FIXED Button */}
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleDecision('Not Fixed')}
              className="flex items-center justify-center space-x-2 py-3 px-4 rounded-2xl border-2 border-red-200 bg-red-50/50 hover:bg-red-100 text-red-700 font-extrabold text-xs transition-all cursor-pointer"
            >
              <XCircle className="w-4 h-4 text-red-600" />
              <div className="text-left">
                <div className="leading-tight">
                  {lang === 'kn' ? '✗ ಸರಿಯಾಗಿಲ್ಲ (Reopen & Apply Strike)' : '✗ Not Fixed (Reopen & Flag Fake Closure)'}
                </div>
                <div className="text-[10px] text-red-600 font-normal">
                  Applies penalty strike to contractor & alerts BDO
                </div>
              </div>
            </button>

            {/* FIXED Button */}
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleDecision('Fixed')}
              className="flex items-center justify-center space-x-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/25 transition-all hover:scale-[1.01] active:scale-[0.98] cursor-pointer"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-200" />
              <div className="text-left">
                <div className="leading-tight">
                  {lang === 'kn' ? '✓ ಪರಿಶೀಲಿಸಿ ಮುಕ್ತಾಯಗೊಳಿಸಿ' : '✓ Verified Fixed (Release Fast-Track Payment)'}
                </div>
                <div className="text-[10px] text-emerald-100 font-normal">
                  Closes ticket & clears contractor digital invoice
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
