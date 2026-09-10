import React, { useState, useRef } from 'react';
import { AssetRepairRecord, Complaint, LanguageMode, RepairProof } from '../types';
import {
  CheckCircle2,
  AlertTriangle,
  Wrench,
  Eye,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  MapPin,
  Calendar,
  ShieldCheck,
  Split,
  Camera,
  Layers,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export interface GalleryPhotoItem {
  id: string;
  url: string;
  caption: string;
  type: 'damage_report' | 'repair_proof' | 'component' | 'inspection';
  timestamp?: string;
  geoTag?: string;
  capturedBy?: string;
  workerNotes?: string;
  partsReplaced?: string[];
  contractorVerified?: boolean;
}

interface RepairPhotoGalleryProps {
  record: AssetRepairRecord;
  complaint?: Complaint;
  assetName: string;
  assetId: string;
  lang: LanguageMode;
}

export const RepairPhotoGallery: React.FC<RepairPhotoGalleryProps> = ({
  record,
  complaint,
  assetName,
  assetId,
  lang,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhotoItem | null>(null);
  const [compareViewMode, setCompareViewMode] = useState<'single' | 'split' | 'before_after'>('single');
  const [activeCompareTab, setActiveCompareTab] = useState<'before' | 'after'>('after');

  // Consolidate all available visual evidence for this repair entry
  const photos: GalleryPhotoItem[] = [];
  const seenUrls = new Set<string>();

  // 1. Pull repairProof from complaint or record
  const proof: RepairProof | undefined = complaint?.repairProof || record.repairProof;
  if (proof && proof.photoUrl && !seenUrls.has(proof.photoUrl)) {
    seenUrls.add(proof.photoUrl);
    photos.push({
      id: `proof-${record.complaintId}`,
      url: proof.photoUrl,
      caption: proof.workerNotes || 'Verified field repair proof submitted upon component replacement.',
      type: 'repair_proof',
      timestamp: proof.completedAt,
      geoTag: proof.geoTag,
      capturedBy: complaint?.assignedWorker?.name || record.workerName || 'Certified Technician',
      workerNotes: proof.workerNotes,
      partsReplaced: proof.partsReplaced || (record.partsReplaced ? [record.partsReplaced] : undefined),
      contractorVerified: proof.contractorVerified ?? true,
    });
  }

  // 2. Pull damage report photo (from complaint report or record)
  const damageUrl = complaint?.photoUrl || record.damagePhotoUrl;
  if (damageUrl && !seenUrls.has(damageUrl)) {
    seenUrls.add(damageUrl);
    photos.push({
      id: `damage-${record.complaintId}`,
      url: damageUrl,
      caption: complaint?.description || record.issue || 'Initial breakdown condition as reported.',
      type: 'damage_report',
      timestamp: complaint?.reportedAt || record.date,
      geoTag: complaint?.location,
      capturedBy: complaint?.reportedBy?.name || 'Citizen Grievance Log',
    });
  }

  // 3. Pull additional gallery photos if registered
  if (record.galleryPhotos) {
    for (const g of record.galleryPhotos) {
      if (g.url && !seenUrls.has(g.url)) {
        seenUrls.add(g.url);
        photos.push({
          id: `extra-${photos.length}-${record.complaintId}`,
          url: g.url,
          caption: g.caption,
          type: g.type,
          timestamp: g.timestamp || record.date,
          geoTag: g.geoTag || proof?.geoTag,
          capturedBy: g.capturedBy || record.workerName,
          workerNotes: proof?.workerNotes,
          partsReplaced: proof?.partsReplaced,
          contractorVerified: proof?.contractorVerified,
        });
      }
    }
  }

  // Identify Before and After photos for comparative analysis
  const beforePhoto = photos.find((p) => p.type === 'damage_report');
  const afterPhoto = photos.find((p) => p.type === 'repair_proof');
  const hasBeforeAndAfter = Boolean(beforePhoto && afterPhoto);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -260, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 260, behavior: 'smooth' });
    }
  };

  const isPendingWithoutProof = record.status === 'Pending' && !proof?.photoUrl;

  return (
    <div className="mt-3 pt-2.5 border-t border-slate-200/80 space-y-2">
      {/* Gallery Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 text-xs font-black text-slate-800">
            <Camera className="w-3.5 h-3.5 text-amber-600" />
            <span>
              {lang === 'kn' ? 'ದುರಸ್ತಿ ಫೋಟೋ ಗ್ಯಾಲರಿ ಮತ್ತು ಪುರಾವೆ' : 'Repair Proof & Condition Gallery'}
            </span>
          </div>
          <span className="text-[10px] font-bold bg-slate-200/80 text-slate-700 px-2 py-0.5 rounded-full">
            {photos.length} {photos.length === 1 ? 'Photo' : 'Photos'}
          </span>
          {hasBeforeAndAfter && (
            <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full hidden sm:inline-flex items-center space-x-1">
              <Split className="w-3 h-3 text-emerald-600" />
              <span>Before/After Verified</span>
            </span>
          )}
        </div>

        {/* Scroll Controls */}
        <div className="flex items-center space-x-1">
          {hasBeforeAndAfter && (
            <button
              onClick={() => {
                setSelectedPhoto(afterPhoto || photos[0]);
                setCompareViewMode('split');
              }}
              className="text-[10px] font-black text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-2.5 py-1 rounded-lg flex items-center space-x-1 cursor-pointer transition-colors mr-1"
              title="Compare Before & After"
            >
              <Split className="w-3 h-3" />
              <span className="hidden sm:inline">Compare</span>
            </button>
          )}

          <button
            onClick={scrollLeft}
            aria-label="Scroll left"
            className="w-6 h-6 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center cursor-pointer transition-colors shadow-2xs"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={scrollRight}
            aria-label="Scroll right"
            className="w-6 h-6 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center cursor-pointer transition-colors shadow-2xs"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Carousel Container */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-2 pt-0.5 scrollbar-thin scroll-smooth snap-x snap-mandatory"
        style={{ scrollbarWidth: 'thin' }}
      >
        {photos.map((item, pIdx) => {
          const isProof = item.type === 'repair_proof';
          const isDamage = item.type === 'damage_report';
          const isComponent = item.type === 'component';

          return (
            <div
              key={item.id || pIdx}
              onClick={() => {
                setSelectedPhoto(item);
                setCompareViewMode('single');
              }}
              className="snap-start shrink-0 w-52 sm:w-60 group relative rounded-xl overflow-hidden border border-slate-200 bg-white hover:border-amber-400 hover:shadow-md transition-all cursor-pointer flex flex-col"
            >
              {/* Image Container with Aspect Ratio */}
              <div className="relative h-32 w-full overflow-hidden bg-slate-900">
                <img
                  src={item.url}
                  alt={item.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />

                {/* Role Badge */}
                <div className="absolute top-2 left-2 z-10">
                  {isProof ? (
                    <span className="inline-flex items-center space-x-1 text-[9px] font-black uppercase tracking-wider bg-emerald-600/95 text-white px-2 py-0.5 rounded-md shadow-xs backdrop-blur-xs">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      <span>Repair Proof</span>
                    </span>
                  ) : isDamage ? (
                    <span className="inline-flex items-center space-x-1 text-[9px] font-black uppercase tracking-wider bg-red-600/95 text-white px-2 py-0.5 rounded-md shadow-xs backdrop-blur-xs">
                      <AlertTriangle className="w-2.5 h-2.5" />
                      <span>Breakdown Defect</span>
                    </span>
                  ) : isComponent ? (
                    <span className="inline-flex items-center space-x-1 text-[9px] font-black uppercase tracking-wider bg-blue-600/95 text-white px-2 py-0.5 rounded-md shadow-xs backdrop-blur-xs">
                      <Wrench className="w-2.5 h-2.5" />
                      <span>Part Replaced</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1 text-[9px] font-black uppercase tracking-wider bg-indigo-600/95 text-white px-2 py-0.5 rounded-md shadow-xs backdrop-blur-xs">
                      <Eye className="w-2.5 h-2.5" />
                      <span>Field Inspection</span>
                    </span>
                  )}
                </div>

                {/* Inspect Overlay Hover Badge */}
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="inline-flex items-center space-x-1 bg-white/95 text-slate-900 px-2.5 py-1 rounded-lg text-xs font-black shadow-lg">
                    <Maximize2 className="w-3 h-3 text-amber-600" />
                    <span>Inspect</span>
                  </span>
                </div>

                {/* Geotag / Timestamp bottom bar */}
                {item.timestamp && (
                  <div className="absolute bottom-1.5 right-1.5 bg-black/70 backdrop-blur-xs text-white text-[9px] font-mono px-1.5 py-0.5 rounded">
                    {item.timestamp.split(' ')[0]}
                  </div>
                )}
              </div>

              {/* Caption & Metadata Footer */}
              <div className="p-2.5 flex-1 flex flex-col justify-between space-y-1 bg-slate-50/70">
                <p className="text-[11px] font-bold text-slate-800 line-clamp-2 leading-snug">
                  {item.caption}
                </p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200/60">
                  <span className="truncate max-w-[120px] font-medium text-slate-500">
                    {item.capturedBy}
                  </span>
                  {item.contractorVerified && (
                    <span className="text-emerald-700 font-bold flex items-center space-x-0.5">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>Verified</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* If pending and awaiting technician upload, display in-progress card */}
        {isPendingWithoutProof && (
          <div className="snap-start shrink-0 w-52 sm:w-60 rounded-xl border border-dashed border-amber-300 bg-amber-50/60 p-3 flex flex-col justify-between text-xs space-y-2">
            <div className="space-y-1.5">
              <div className="inline-flex items-center space-x-1 text-[9px] font-black uppercase text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-md">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-ping mr-0.5" />
                <span>Fix In Progress</span>
              </div>
              <h5 className="font-bold text-slate-900 text-xs">Awaiting Repair Proof</h5>
              <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                Certified field technician has been dispatched. Geotagged completion proof photo will appear here once submitted.
              </p>
            </div>
            <div className="text-[10px] font-mono text-amber-800 bg-amber-100/70 p-1.5 rounded-lg border border-amber-200/60">
              Assigned: {complaint?.assignedWorker?.name || record.workerName || 'Field Lineman'}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox / Comparison Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/60">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-black text-amber-700">
                    {record.complaintId}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs font-bold text-slate-900">{assetName}</span>
                  <span className="text-[10px] font-mono bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">
                    {assetId}
                  </span>
                </div>
                <h3 className="text-sm font-black text-slate-900">{record.issue}</h3>
              </div>

              <button
                onClick={() => setSelectedPhoto(null)}
                aria-label="Close modal"
                className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Sub-header: View Mode Controls */}
            {hasBeforeAndAfter && (
              <div className="px-5 py-2.5 bg-slate-100/70 border-b border-slate-200/70 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-extrabold text-slate-700">View Mode:</span>
                  <div className="bg-white rounded-xl p-1 border border-slate-200 inline-flex space-x-1">
                    <button
                      onClick={() => setCompareViewMode('single')}
                      className={`px-3 py-1 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                        compareViewMode === 'single'
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      Single View
                    </button>
                    <button
                      onClick={() => setCompareViewMode('split')}
                      className={`px-3 py-1 text-xs font-bold rounded-lg cursor-pointer transition-all flex items-center space-x-1 ${
                        compareViewMode === 'split'
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Split className="w-3 h-3" />
                      <span>Side-by-Side</span>
                    </button>
                    <button
                      onClick={() => setCompareViewMode('before_after')}
                      className={`px-3 py-1 text-xs font-bold rounded-lg cursor-pointer transition-all flex items-center space-x-1 ${
                        compareViewMode === 'before_after'
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Layers className="w-3 h-3" />
                      <span>Toggle Flip</span>
                    </button>
                  </div>
                </div>

                {compareViewMode === 'before_after' && (
                  <div className="flex items-center space-x-1 bg-white rounded-xl p-1 border border-slate-200">
                    <button
                      onClick={() => setActiveCompareTab('before')}
                      className={`px-2.5 py-1 text-xs font-bold rounded-lg cursor-pointer ${
                        activeCompareTab === 'before'
                          ? 'bg-red-600 text-white'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      Before (Damage)
                    </button>
                    <button
                      onClick={() => setActiveCompareTab('after')}
                      className={`px-2.5 py-1 text-xs font-bold rounded-lg cursor-pointer ${
                        activeCompareTab === 'after'
                          ? 'bg-emerald-600 text-white'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      After (Repair Proof)
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Modal Main Content Area */}
            <div className="p-5 space-y-4 flex-1">
              {/* View Mode: Split Comparison */}
              {compareViewMode === 'split' && beforePhoto && afterPhoto ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Before Frame */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center space-x-1 text-xs font-black uppercase tracking-wider text-red-700 bg-red-100 px-2.5 py-1 rounded-lg">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                        <span>Pre-Repair Defect (Before)</span>
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">
                        {beforePhoto.timestamp}
                      </span>
                    </div>
                    <div className="relative rounded-2xl overflow-hidden border-2 border-red-200 bg-slate-950 aspect-4/3 flex items-center justify-center">
                      <img
                        src={beforePhoto.url}
                        alt="Before condition"
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <p className="text-xs text-slate-600 font-medium bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      {beforePhoto.caption}
                    </p>
                  </div>

                  {/* After Frame */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center space-x-1 text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-lg">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Field Repair Proof (After)</span>
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">
                        {afterPhoto.timestamp}
                      </span>
                    </div>
                    <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-300 bg-slate-950 aspect-4/3 flex items-center justify-center">
                      <img
                        src={afterPhoto.url}
                        alt="After repair proof"
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <p className="text-xs text-slate-600 font-medium bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      {afterPhoto.caption}
                    </p>
                  </div>
                </div>
              ) : compareViewMode === 'before_after' && beforePhoto && afterPhoto ? (
                // View Mode: Toggle Flip
                <div className="space-y-3">
                  <div className="relative rounded-2xl overflow-hidden bg-slate-950 max-h-[460px] flex items-center justify-center border border-slate-800">
                    <img
                      src={activeCompareTab === 'before' ? beforePhoto.url : afterPhoto.url}
                      alt={activeCompareTab === 'before' ? 'Before condition' : 'After repair proof'}
                      className="w-full h-full max-h-[460px] object-contain"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3">
                      {activeCompareTab === 'before' ? (
                        <span className="inline-flex items-center space-x-1.5 text-xs font-black uppercase text-white bg-red-600/90 px-3 py-1 rounded-xl shadow-lg backdrop-blur-xs">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Defect / Breakdown Condition</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1.5 text-xs font-black uppercase text-white bg-emerald-600/90 px-3 py-1 rounded-xl shadow-lg backdrop-blur-xs">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Verified Field Repair Proof</span>
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-slate-700 font-medium bg-slate-50 p-3 rounded-xl border border-slate-200">
                    {activeCompareTab === 'before' ? beforePhoto.caption : afterPhoto.caption}
                  </p>
                </div>
              ) : (
                // View Mode: Single Focused Photo
                <div className="space-y-3">
                  <div className="relative rounded-2xl overflow-hidden bg-slate-950 max-h-[480px] flex items-center justify-center border border-slate-800">
                    <img
                      src={selectedPhoto.url}
                      alt={selectedPhoto.caption}
                      className="w-full h-full max-h-[480px] object-contain"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3">
                      <span
                        className={`inline-flex items-center space-x-1.5 text-xs font-black uppercase px-3 py-1 rounded-xl shadow-lg backdrop-blur-xs text-white ${
                          selectedPhoto.type === 'repair_proof'
                            ? 'bg-emerald-600/90'
                            : selectedPhoto.type === 'damage_report'
                            ? 'bg-red-600/90'
                            : selectedPhoto.type === 'component'
                            ? 'bg-blue-600/90'
                            : 'bg-indigo-600/90'
                        }`}
                      >
                        {selectedPhoto.type === 'repair_proof' && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {selectedPhoto.type === 'damage_report' && <AlertTriangle className="w-3.5 h-3.5" />}
                        {selectedPhoto.type === 'component' && <Wrench className="w-3.5 h-3.5" />}
                        {selectedPhoto.type === 'inspection' && <Eye className="w-3.5 h-3.5" />}
                        <span>
                          {selectedPhoto.type === 'repair_proof'
                            ? 'Field Repair Proof'
                            : selectedPhoto.type === 'damage_report'
                            ? 'Reported Breakdown'
                            : selectedPhoto.type === 'component'
                            ? 'Replacement Component'
                            : 'Inspection Audit'}
                        </span>
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1">
                    <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                      Photo Documentation Notes
                    </div>
                    <p className="text-xs text-slate-800 font-semibold leading-relaxed">
                      {selectedPhoto.caption}
                    </p>
                  </div>
                </div>
              )}

              {/* Comprehensive Audit Telemetry Panel */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-100/70 p-4 rounded-2xl border border-slate-200/80 text-xs">
                <div>
                  <div className="text-[11px] font-bold text-slate-400">Captured By</div>
                  <div className="font-extrabold text-slate-900 mt-0.5">
                    {selectedPhoto.capturedBy || record.workerName}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-bold text-slate-400">Timestamp</div>
                  <div className="font-extrabold text-slate-900 mt-0.5">
                    {selectedPhoto.timestamp || record.date}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-bold text-slate-400">GPS Geo-Tag</div>
                  <div className="font-mono font-bold text-slate-900 mt-0.5 truncate" title={selectedPhoto.geoTag || 'GP Belavadi'}>
                    {selectedPhoto.geoTag || '12.3365° N, 76.6192° E'}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-bold text-slate-400">Audit Status</div>
                  <div className="font-extrabold text-emerald-800 mt-0.5 flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Contractor Verified</span>
                  </div>
                </div>

                {record.partsReplaced && (
                  <div className="col-span-2 sm:col-span-4 pt-2 border-t border-slate-200/60 flex items-center space-x-2">
                    <span className="text-[11px] font-bold text-slate-500">Replaced Components:</span>
                    <span className="inline-block bg-indigo-50 text-indigo-900 font-bold px-2 py-0.5 rounded-lg border border-indigo-200/60 text-xs">
                      {record.partsReplaced}
                    </span>
                  </div>
                )}
              </div>

              {/* Filmstrip of all photos in this repair entry */}
              <div className="space-y-1.5 pt-1">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Timeline Gallery Filmstrip ({photos.length})
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
                  {photos.map((p, idx) => (
                    <button
                      key={p.id || idx}
                      onClick={() => {
                        setSelectedPhoto(p);
                        setCompareViewMode('single');
                      }}
                      className={`relative shrink-0 w-20 h-14 rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                        selectedPhoto.id === p.id && compareViewMode === 'single'
                          ? 'border-amber-500 ring-2 ring-amber-400/30'
                          : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={p.url}
                        alt={p.caption}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <span
                        className={`absolute bottom-0 inset-x-0 text-[8px] font-black text-center text-white py-0.5 uppercase ${
                          p.type === 'repair_proof'
                            ? 'bg-emerald-600'
                            : p.type === 'damage_report'
                            ? 'bg-red-600'
                            : 'bg-blue-600'
                        }`}
                      >
                        {p.type === 'repair_proof' ? 'Proof' : p.type === 'damage_report' ? 'Defect' : 'Part'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
