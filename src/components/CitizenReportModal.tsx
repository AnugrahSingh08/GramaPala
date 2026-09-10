import React, { useState, useEffect, useMemo } from 'react';
import { AssetCategory, PriorityLevel, Complaint, Asset, BillOfQuantities, VoiceNoteRecord } from '../types';
import { 
  X, 
  Upload, 
  Camera, 
  AlertTriangle, 
  CheckCircle2, 
  MapPin, 
  Loader2,
  ShieldAlert,
  Search,
  RefreshCw,
  BarChart2,
  Ticket,
  Send,
  ArrowRight,
  Info,
  Mic,
  MicOff,
  Volume2,
  MessageSquare,
  Smartphone,
  Globe,
  Sparkles,
  DollarSign,
  ThumbsUp,
  ShieldCheck,
  Clock
} from 'lucide-react';

interface CitizenReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (complaint: Partial<Complaint>) => void;
  lang: 'en' | 'kn';
  assets?: Asset[];
  complaints?: Complaint[];
}

const SAMPLE_PRESETS = [
  {
    title: 'Broken Streetlight',
    titleKn: 'ಒಡೆದ ಬೀದಿ ದೀಪ',
    category: 'Streetlight' as AssetCategory,
    ward: 'Ward 3',
    location: 'Main Bazaar Road, Near Govt High School, Belavadi',
    description: 'Streetlight luminaire has fallen loose and wires are exposed. Dark at night near school.',
    photoUrl: 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&w=800&q=80',
    gps: { lat: 12.3365, lng: 76.6192 },
    voiceTranscriptionEn: 'Streetlight in front of high school broken and hanging by wire. Pitch dark for children.',
    voiceTranscriptionKn: 'ಶಾಲೆಯ ಮುಂದಿನ ಬೀದಿ ದೀಪ ಕಳಚಿ ಬಿದ್ದಿದ್ದು, ರಾತ್ರಿ ಮಕ್ಕಳಿಗೆ ತೊಂದರೆಯಾಗಿದೆ.',
    boqEstimated: 6500,
  },
  {
    title: 'Burst Water Pipe',
    titleKn: 'ಕುಡಿಯುವ ನೀರಿನ ಪೈಪ್ ಸೋರಿಕೆ',
    category: 'Water Supply' as AssetCategory,
    ward: 'Ward 2',
    location: 'Maramma Temple Street, Ward 2, Belavadi',
    description: 'High pressure drinking water pipe has ruptured, flooding road and wasting village potable water.',
    photoUrl: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80',
    gps: { lat: 12.3358, lng: 76.6205 },
    voiceTranscriptionEn: 'Main drinking water pipeline cracked near Maramma temple, road completely flooded with clean water.',
    voiceTranscriptionKn: 'ಮಾರಮ್ಮ ದೇವಸ್ಥಾನದ ಬಳಿ ಕುಡಿಯುವ ನೀರಿನ ಮುಖ್ಯ ಪೈಪ್ ಒಡೆದಿದೆ, ನೀರು ವ್ಯರ್ಥವಾಗುತ್ತಿದೆ.',
    boqEstimated: 4200,
  },
  {
    title: 'Dangerous Road Crater',
    titleKn: 'ರಸ್ತೆ ದೊಡ್ಡ ಗುಂಡಿ',
    category: 'Rural Road' as AssetCategory,
    ward: 'Ward 4',
    location: 'Village Entrance Link Road, Ward 4',
    description: 'Deep tarmac subsidence and road hole after rain. 2-wheelers and milk tractors slipping.',
    photoUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    gps: { lat: 12.3382, lng: 76.6174 },
    voiceTranscriptionEn: 'Deep road potholes near village entrance caused by monsoon rain. Dangerous for bikes.',
    voiceTranscriptionKn: 'ಗ್ರಾಮದ ಪ್ರವೇಶ ದ್ವಾರದ ಬಳಿ ರಸ್ತೆ ಗುಂಡಿ ಬಿದ್ದಿದ್ದು ವಾಹನ ಸವಾರರು ಬೀಳುತ್ತಿದ್ದಾರೆ.',
    boqEstimated: 31050,
  },
];

export const CitizenReportModal: React.FC<CitizenReportModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  lang,
  assets = [],
  complaints = [],
}) => {
  const [channel, setChannel] = useState<'Web Portal' | 'Mobile App' | 'WhatsApp Bot'>('WhatsApp Bot');
  const [photoUrl, setPhotoUrl] = useState<string>(SAMPLE_PRESETS[0].photoUrl);
  const [category, setCategory] = useState<AssetCategory>('Streetlight');
  const [ward, setWard] = useState<string>('Ward 3');
  const [location, setLocation] = useState<string>(SAMPLE_PRESETS[0].location);
  const [description, setDescription] = useState<string>(SAMPLE_PRESETS[0].description);
  const [citizenName, setCitizenName] = useState<string>('Prakash Rao');
  const [citizenPhone, setCitizenPhone] = useState<string>('+91 98860 12390');
  const [gpsCoordinates, setGpsCoordinates] = useState<{ lat: number; lng: number; accuracy: number }>({
    lat: 12.3365,
    lng: 76.6192,
    accuracy: 2.8,
  });

  // Voice Note Recording Simulator
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [voiceNote, setVoiceNote] = useState<VoiceNoteRecord | null>({
    durationSeconds: 12,
    language: 'kn',
    transcriptionKn: 'ನಮ್ಮ ಶಾಲೆಯ ಮುಂದಿರುವ ಬೀದಿ ದೀಪ ಕಂಬದ ದೀಪ ಕೆಳಗೆ ಬಿದ್ದಿದೆ, ರಾತ್ರಿ ವೇಳೆ ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಕತ್ತಲೆಯಾಗಿದೆ ದಯವಿಟ್ಟು ಸರಿಪಡಿಸಿ.',
    transcriptionEn: 'The streetlight fixture in front of our high school has fallen down, pitch dark for students and villagers at night. Please fix.',
    detectedKeywords: ['Streetlight', 'Broken Fixture', 'School Junction', 'High Risk'],
    audioWaveform: [30, 45, 80, 95, 60, 40, 75, 90, 85, 50, 65, 30],
  });

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [triageReport, setTriageReport] = useState<any>(null);
  const [matchedAsset, setMatchedAsset] = useState<Asset | null>(null);
  const [duplicateCheck, setDuplicateCheck] = useState<{ isDuplicate: boolean; complaintId?: string; coSignersCount: number; message: string }>({
    isDuplicate: false,
    coSignersCount: 0,
    message: 'Verified unique grievance.',
  });
  const [submittedTicket, setSubmittedTicket] = useState<{ complaintId: string; timestamp: string; isClubbed?: boolean } | null>(null);

  // Citizen Trust Profile
  const citizenTrust = useMemo(() => ({
    score: 98,
    status: 'Verified Citizen' as const,
    accurateReportsCount: 14,
    totalSubmissions: 14,
    flaggedSpamAttempts: 0,
  }), []);

  // Dynamic Community Impact Score calculation (0-100)
  const impactScore = useMemo(() => {
    let score = 60;
    if (category === 'Water Supply' || category === 'Borewell Pump') score += 25;
    if (category === 'Streetlight') score += 18;
    if (category === 'Rural Road') score += 20;
    if (description.toLowerCase().includes('school') || location.toLowerCase().includes('school')) score += 10;
    if (description.toLowerCase().includes('wire') || description.toLowerCase().includes('dark') || description.toLowerCase().includes('danger')) score += 5;
    return Math.min(score, 98);
  }, [category, description, location]);

  // AI-Estimated Bill of Quantities (BOQ) Scope
  const estimatedBOQ: BillOfQuantities = useMemo(() => {
    if (category === 'Streetlight') {
      return {
        items: [
          { item: '60W IP66 Smart LED Luminaire Cast Head', quantity: '1 Unit', rateInr: 4200, amountInr: 4200 },
          { item: 'Heavy-Duty Galvanized Mast Mounting Arm', quantity: '1 Set', rateInr: 1100, amountInr: 1100 },
          { item: 'FR Grade 4 sq.mm Copper Wiring & MCB Joint', quantity: '10 Mtr', rateInr: 70, amountInr: 700 },
          { item: 'Certified Lineman Technical Installation Charge', quantity: '1 Job', rateInr: 500, amountInr: 500 },
        ],
        materialCostInr: 6000,
        laborCostInr: 500,
        contingencyInr: 0,
        totalEstimatedInr: 6500,
        preApprovedTenderLimitInr: 8000,
        isPreApproved: true,
      };
    }
    if (category === 'Water Supply') {
      return {
        items: [
          { item: '110mm HDPE Pressure Coupling & Pipe Section', quantity: '3 Mtr', rateInr: 650, amountInr: 1950 },
          { item: 'Cast Iron Sluice Valve Repair Kit', quantity: '1 Unit', rateInr: 1450, amountInr: 1450 },
          { item: 'Hydraulic Plumber Skilled Repair Labor', quantity: '1 Job', rateInr: 800, amountInr: 800 },
        ],
        materialCostInr: 3400,
        laborCostInr: 800,
        contingencyInr: 0,
        totalEstimatedInr: 4200,
        preApprovedTenderLimitInr: 6000,
        isPreApproved: true,
      };
    }
    if (category === 'Rural Road') {
      return {
        items: [
          { item: 'Cold Bituminous Asphalt Patch Mix', quantity: '45 Bags', rateInr: 450, amountInr: 20250 },
          { item: 'Wet Mix Macadam Granular Sub-base', quantity: '4 Cu.m', rateInr: 1200, amountInr: 4800 },
          { item: 'Road Masonry & Compaction Roller Team', quantity: '2 Days', rateInr: 2500, amountInr: 5000 },
        ],
        materialCostInr: 25050,
        laborCostInr: 5000,
        contingencyInr: 1000,
        totalEstimatedInr: 31050,
        preApprovedTenderLimitInr: 50000,
        isPreApproved: true,
      };
    }
    return {
      items: [
        { item: 'Mechanical Maintenance Kit & Hardware', quantity: '1 Set', rateInr: 2000, amountInr: 2000 },
        { item: 'Field Technician Labor Charge', quantity: '1 Job', rateInr: 800, amountInr: 800 },
      ],
      materialCostInr: 2000,
      laborCostInr: 800,
      contingencyInr: 0,
      totalEstimatedInr: 2800,
      preApprovedTenderLimitInr: 5000,
      isPreApproved: true,
    };
  }, [category]);

  // Find Existing Asset from Registry matching GPS/Category
  useEffect(() => {
    const safeAssets = assets || [];
    const candidates = safeAssets.filter((a) => a && (a.category === category || a.ward === ward));
    if (candidates.length > 0) {
      const match = candidates.find((c) => c.ward === ward && c.category === category) || candidates[0];
      setMatchedAsset(match);
    } else {
      setMatchedAsset(safeAssets[0] || null);
    }
  }, [category, ward, assets]);

  // Duplicate Grievance Detection & Clustering
  useEffect(() => {
    if (!matchedAsset) return;
    const safeComplaints = complaints || [];
    const existing = safeComplaints.find(
      (c) => c && (c.assetId === matchedAsset.id || c.id === 'NAS-00021') && (c.status === 'Pending' || c.status === 'Reported' || c.status === 'Assigned' || c.status === 'In Progress')
    );
    if (existing) {
      setDuplicateCheck({
        isDuplicate: true,
        complaintId: existing.id,
        coSignersCount: (existing.duplicateStatus?.coSignersCount || 5) + 1,
        message: `Existing open ticket (${existing.id}) found within radius R on this asset. Submitting will auto-club into Master Ticket, increment Community Upvote count, and subscribe your mobile number to real-time SMS/WhatsApp updates!`,
      });
    } else {
      setDuplicateCheck({
        isDuplicate: false,
        coSignersCount: 0,
        message: 'No open grievances within 150m. Clean new master ticket submission.',
      });
    }
  }, [matchedAsset, complaints]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
        runDiagnostics(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const applyPreset = (preset: typeof SAMPLE_PRESETS[0]) => {
    setCategory(preset.category);
    setWard(preset.ward);
    setLocation(preset.location);
    setDescription(preset.description);
    setPhotoUrl(preset.photoUrl);
    setGpsCoordinates({ lat: preset.gps.lat, lng: preset.gps.lng, accuracy: 2.5 });
    setTriageReport(null);
    setVoiceNote({
      durationSeconds: 10,
      language: 'kn',
      transcriptionEn: preset.voiceTranscriptionEn,
      transcriptionKn: preset.voiceTranscriptionKn,
      detectedKeywords: [preset.category, preset.ward, 'Citizen Audio Log'],
      audioWaveform: [35, 60, 90, 80, 45, 70, 85, 60, 40, 75, 50, 30],
    });
  };

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        setVoiceNote({
          durationSeconds: 8,
          language: 'kn',
          transcriptionEn: `Voice Note: Urgent repair requested for damaged ${category} in ${ward}. Hazard nearby.`,
          transcriptionKn: `ಧ್ವನಿ ಸಂದೇಶ: ${ward} ನಲ್ಲಿರುವ ${category} ಹಾನಿಯಾಗಿದ್ದು ತಕ್ಷಣ ದುರಸ್ತಿ ಮಾಡಬೇಕೆಂದು ಕೋರಲಾಗಿದೆ.`,
          detectedKeywords: [category, ward, 'Audio Verified'],
          audioWaveform: [40, 70, 95, 80, 60, 85, 90, 65, 50, 70, 40, 20],
        });
      }, 2500);
    } else {
      setIsRecording(false);
    }
  };

  const runDiagnostics = async (imgUrl = photoUrl) => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/grievance/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: imgUrl,
          userNotes: description,
          assetHint: category,
          ward: ward,
        }),
      });
      const data = await response.json();
      if (data?.analysis) {
        setTriageReport(data.analysis);
        if (data.analysis.assetType) {
          const matchedCat = ['Streetlight', 'Water Supply', 'Public Toilet', 'Rural Road', 'Borewell Pump', 'Drainage'].find(
            (c) => c.toLowerCase() === data.analysis.assetType.toLowerCase()
          );
          if (matchedCat) setCategory(matchedCat as AssetCategory);
        }
      }
    } catch (err) {
      console.error('Classification error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedId = duplicateCheck.isDuplicate ? (duplicateCheck.complaintId || 'NAS-00021') : `NAS-${Math.floor(10000 + Math.random() * 90000)}`;
    
    const newComplaintData: Partial<Complaint> = {
      id: generatedId,
      assetId: matchedAsset?.id || (category === 'Streetlight' ? 'SL-0241' : 'WT-0082'),
      assetName: matchedAsset?.name || `${category} Asset (${ward})`,
      category,
      location,
      ward,
      channel,
      reportedBy: {
        name: citizenName,
        phone: citizenPhone,
        village: 'Belavadi Gram Panchayat',
        trustProfile: citizenTrust,
      },
      description,
      descriptionKn: triageReport?.formalSummaryKn || 'ಸಾರ್ವಜನಿಕ ಆಸ್ತಿ ದುರಸ್ತಿ ಕೋರಿಕೆ',
      photoUrl,
      voiceNote: voiceNote || undefined,
      status: 'Reported',
      priority: (triageReport?.damageSeverity as PriorityLevel) || 'Critical',
      slaDeadline: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
      gpsCoordinates: {
        lat: gpsCoordinates.lat,
        lng: gpsCoordinates.lng,
        accuracyMeters: gpsCoordinates.accuracy,
      },
      matchedAssetDistanceMeters: 8,
      duplicateStatus: {
        isDuplicate: duplicateCheck.isDuplicate,
        existingComplaintId: duplicateCheck.complaintId,
        coSignersCount: duplicateCheck.isDuplicate ? duplicateCheck.coSignersCount : 1,
        message: duplicateCheck.message,
      },
      communityImpactScore: impactScore,
      communityImpactDetails: {
        householdsAffected: Math.floor(impactScore * 4.2),
        vitalService: category === 'Water Supply' ? 'Drinking Water Line' : 'Rural Electrification & Safety',
        riskFactor: triageReport?.hazardWarning || 'Public safety and mobility hazard',
      },
      billOfQuantities: estimatedBOQ,
      escalationState: {
        currentTier: 'Tier 1: BDO',
        dayElapsed: 1,
        slaDaysTotal: 7,
        amberAlertActive: false,
        strikesIssued: [],
        autoCloseTimeoutHoursRemaining: 48,
        reopenWindowDaysRemaining: 15,
      },
      triage: triageReport || {
        assetType: category,
        damageSeverity: 'Critical',
        recommendedSLA: '12 Hours',
        specialistRequired: category === 'Streetlight' ? 'Electrician' : 'Plumbing Technician',
        kannadaTitle: 'ಸಾರ್ವಜನಿಕ ಆಸ್ತಿ ದುರಸ್ತಿ',
        formalSummaryEn: description,
        formalSummaryKn: 'ಸಾರ್ವಜನಿಕ ಆಸ್ತಿ ದುರಸ್ತಿ ಅಗತ್ಯವಿದೆ.',
        hazardWarning: 'Precaution advised in the vicinity.',
        suggestedAction: 'Dispatch field inspection squad with pre-approved BOQ materials.',
      },
    };

    onSubmit(newComplaintData);
    setSubmittedTicket({
      complaintId: generatedId,
      timestamp: new Date().toLocaleTimeString(),
      isClubbed: duplicateCheck.isDuplicate,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* Ticket Confirmation Screen if just submitted */}
        {submittedTicket ? (
          <div className="p-6 text-center space-y-5 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner border border-emerald-300">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black uppercase tracking-wider">
                <Ticket className="w-3.5 h-3.5" />
                <span>{submittedTicket.isClubbed ? 'Master Ticket Co-Signed & Upvoted' : 'Master Ticket Dispatched to BDO Tier 1'}</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900">
                Ticket: {submittedTicket.complaintId}
              </h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                {submittedTicket.isClubbed
                  ? `Your report was automatically clustered into active Master Ticket ${submittedTicket.complaintId}. The Community Upvote counter was incremented and your phone is subscribed to WhatsApp/SMS status triggers.`
                  : `Your grievance has been auto-triaged, matched to registered public asset ${matchedAsset?.id}, and dispatched to the BDO queue with AI-estimated Bill of Quantities.`
                }
              </p>
            </div>

            {/* Receipt Card */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 max-w-md mx-auto text-left text-xs space-y-2.5">
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-semibold">Intake Channel</span>
                <span className="font-bold text-emerald-800 flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5" /> {channel}
                </span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-semibold">Citizen Trust Score</span>
                <span className="font-black text-emerald-700 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> {citizenTrust.score}/100 ({citizenTrust.status})
                </span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-semibold">Community Impact Score</span>
                <span className="font-black text-indigo-700">{impactScore} / 100 (Critical)</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-semibold">AI Pre-Approved BOQ</span>
                <span className="font-black text-slate-900">₹{(estimatedBOQ?.totalEstimatedInr ?? 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-semibold">48-Hour Fallback Rule</span>
                <span className="font-medium text-slate-700">Auto-close with 15-day reopen window</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Escalation SLA</span>
                <span className="font-bold text-amber-700">BDO Tier 1 (7-Day SLA • Day 6 Amber Alert)</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-center space-x-3">
              <button
                type="button"
                onClick={() => {
                  setSubmittedTicket(null);
                  onClose();
                }}
                className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold px-6 py-2.5 rounded-xl text-xs shadow-md transition-all cursor-pointer"
              >
                Track Live in Citizen Portal
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center font-bold shadow-md shadow-amber-500/20">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900">
                    {lang === 'kn' ? 'ಸಾರ್ವಜನಿಕ ಆಸ್ತಿ ಹಾನಿ ದೂರು (Zero-Friction Intake)' : 'Citizen Intake: Report Public Asset Grievance'}
                  </h2>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Multi-channel intake • Voice-to-Text • AI BOQ estimation • Deduplication & Anti-Spam protection
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

            {/* Channel Selection: WhatsApp Bot, Mobile App, Web Portal */}
            <div className="pt-2.5 pb-2">
              <div className="flex items-center justify-between text-[11px] text-slate-600 mb-1.5 font-bold">
                <span>1. Multi-Channel Intake Channel:</span>
                <span className="text-[10px] text-emerald-700 font-extrabold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <ShieldCheck className="w-3 h-3" /> Trust Score: {citizenTrust.score}/100
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setChannel('WhatsApp Bot')}
                  className={`flex items-center justify-center space-x-1.5 p-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    channel === 'WhatsApp Bot'
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-emerald-50 hover:text-emerald-800'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp Bot</span>
                </button>
                <button
                  type="button"
                  onClick={() => setChannel('Mobile App')}
                  className={`flex items-center justify-center space-x-1.5 p-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    channel === 'Mobile App'
                      ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-indigo-50 hover:text-indigo-800'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Mobile App</span>
                </button>
                <button
                  type="button"
                  onClick={() => setChannel('Web Portal')}
                  className={`flex items-center justify-center space-x-1.5 p-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    channel === 'Web Portal'
                      ? 'bg-slate-900 text-white border-slate-950 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Web Portal</span>
                </button>
              </div>
            </div>

            {/* Quick Demo Presets Strip */}
            <div className="pb-2">
              <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1 font-bold">
                <span>⚡ Quick Test Scenarios:</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {SAMPLE_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => applyPreset(preset)}
                    className="text-left text-xs p-2 rounded-xl border border-slate-200 hover:border-amber-500 hover:bg-amber-50/50 transition-all cursor-pointer group"
                  >
                    <div className="font-bold text-slate-800 group-hover:text-amber-800 line-clamp-1">
                      {preset.title}
                    </div>
                    <div className="text-[10px] text-slate-500">{preset.ward} • ₹{preset.boqEstimated}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSubmit} className="overflow-y-auto space-y-3.5 pt-1 pr-1 flex-1">
              {/* Photo Upload & AI Vision Diagnostics */}
              <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-amber-600" />
                    <span>Photo Capture & AI Vision Classification</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => runDiagnostics()}
                    disabled={isAnalyzing}
                    className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
                    <span>{isAnalyzing ? 'Classifying...' : 'Re-run AI Vision'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  <div className="sm:col-span-5 relative h-28 rounded-xl overflow-hidden border-2 border-dashed border-amber-400 bg-amber-50 flex items-center justify-center group">
                    <img
                      src={photoUrl}
                      alt="Asset damage"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-white text-xs font-bold gap-1">
                      <Upload className="w-4 h-4" />
                      <span>Upload Photo</span>
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    </label>
                  </div>

                  <div className="sm:col-span-7 space-y-1.5 text-xs">
                    {isAnalyzing ? (
                      <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center space-x-2 text-indigo-800 font-bold">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Extracting visual features & damage severity...</span>
                      </div>
                    ) : triageReport ? (
                      <div className="p-2.5 bg-white border border-indigo-200 rounded-xl space-y-1 shadow-xs">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-extrabold text-indigo-900">Detected: {triageReport.assetType}</span>
                          <span className="font-black text-red-700 bg-red-100 px-1.5 py-0.5 rounded">Severity: {triageReport.damageSeverity}</span>
                        </div>
                        <p className="text-[11px] text-slate-700 leading-snug line-clamp-2">{triageReport.formalSummaryEn}</p>
                        {triageReport.hazardWarning && (
                          <div className="text-[10px] text-amber-900 bg-amber-50 px-2 py-0.5 rounded font-medium">
                            ⚠️ {triageReport.hazardWarning}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-[11px] space-y-1">
                        <div className="font-bold">Detected Asset: {category}</div>
                        <div>Fault: Dangling luminaire & exposed electrical wiring.</div>
                        <button
                          type="button"
                          onClick={() => runDiagnostics()}
                          className="text-[10px] font-black underline text-amber-800 cursor-pointer"
                        >
                          Run Gemini Vision Diagnostics
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Voice Note in Regional Language (Voice-to-Text) */}
              <div className="bg-indigo-50/70 p-3 rounded-2xl border border-indigo-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-indigo-950 flex items-center gap-1.5">
                    <Volume2 className="w-4 h-4 text-indigo-600" />
                    <span>Regional Voice Note (Kannada / English)</span>
                  </span>
                  <button
                    type="button"
                    onClick={toggleRecording}
                    className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-black transition-all cursor-pointer ${
                      isRecording
                        ? 'bg-red-600 text-white animate-pulse'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    {isRecording ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                    <span>{isRecording ? 'Listening (Kannada)...' : 'Record Audio Note'}</span>
                  </button>
                </div>

                {voiceNote && (
                  <div className="bg-white rounded-xl p-2.5 border border-indigo-100 text-xs space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-slate-800 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-indigo-600" />
                        AI Voice-to-Text Transcription:
                      </span>
                      <span className="font-mono text-[10px] text-slate-500">{voiceNote.durationSeconds}s duration</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 font-medium text-slate-700 text-[11px] leading-relaxed">
                      "{voiceNote.transcriptionKn}"
                    </div>
                    <div className="text-[10px] text-indigo-700 font-semibold italic">
                      English: "{voiceNote.transcriptionEn}"
                    </div>
                  </div>
                )}
              </div>

              {/* Deduplication & Community Upvote Cluster */}
              <div className={`p-3 rounded-xl border text-xs space-y-1.5 ${
                duplicateCheck.isDuplicate
                  ? 'bg-amber-50 border-amber-300 text-amber-950'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-950'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-extrabold flex items-center gap-1">
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>AI Deduplication & Incident Clustering</span>
                  </span>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    duplicateCheck.isDuplicate ? 'bg-amber-200 text-amber-900' : 'bg-emerald-200 text-emerald-900'
                  }`}>
                    {duplicateCheck.isDuplicate ? `Clustered into ${duplicateCheck.complaintId}` : 'Unique Ticket'}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  {duplicateCheck.message}
                </p>
                {duplicateCheck.isDuplicate && (
                  <div className="flex items-center space-x-2 pt-1">
                    <div className="flex items-center gap-1 bg-amber-200/70 text-amber-900 px-2 py-0.5 rounded text-[10px] font-bold">
                      <ThumbsUp className="w-3 h-3" />
                      <span>{duplicateCheck.coSignersCount} Villagers Co-Signed</span>
                    </div>
                    <span className="text-[10px] text-amber-800">Priority score boosted automatically.</span>
                  </div>
                )}
              </div>

              {/* AI Estimated Bill of Quantities (BOQ) Breakdown */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-800 flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                    <span>AI-Estimated Bill of Quantities (BOQ)</span>
                  </span>
                  <span className="font-black text-slate-900 bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md text-[11px]">
                    Total: ₹{(estimatedBOQ?.totalEstimatedInr ?? 0).toLocaleString('en-IN')} (Pre-Approved)
                  </span>
                </div>
                <div className="space-y-1">
                  {estimatedBOQ.items.map((it, idx) => (
                    <div key={idx} className="flex items-center justify-between text-[11px] text-slate-600 border-b border-slate-100 pb-1">
                      <span>• {it.item} ({it.quantity})</span>
                      <span className="font-mono font-semibold text-slate-800">₹{it.amountInr}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* GPS Geotag & Matched Asset Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-200 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-blue-900 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-blue-600" />
                      <span>Live GPS Pin</span>
                    </span>
                    <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                      Locked ±{gpsCoordinates.accuracy}m
                    </span>
                  </div>
                  <div className="font-mono text-[11px] text-slate-700">
                    {gpsCoordinates.lat}° N, {gpsCoordinates.lng}° E
                  </div>
                  <div className="text-[10px] text-slate-500">{location}</div>
                </div>

                <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-purple-950 flex items-center gap-1">
                      <BarChart2 className="w-3.5 h-3.5 text-purple-600" />
                      <span>Community Impact</span>
                    </span>
                    <span className="text-[11px] font-black bg-purple-200 text-purple-900 px-2 py-0.5 rounded-full">
                      {impactScore} / 100
                    </span>
                  </div>
                  <div className="text-[10px] text-purple-800 font-medium">
                    Affects ~{Math.floor(impactScore * 4.2)} households • High pedestrian density
                  </div>
                </div>
              </div>

              {/* Asset Category & Ward Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Asset Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as AssetCategory)}
                    className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                  >
                    <option value="Streetlight">Streetlight (ಬೀದಿ ದೀಪ)</option>
                    <option value="Water Supply">Water Pipeline / Taps (ಕುಡಿಯುವ ನೀರು)</option>
                    <option value="Borewell Pump">Borewell Pump (ಕೊಳವೆಬಾವಿ ಪಂಪ್)</option>
                    <option value="Rural Road">Rural Road / Pothole (ಗ್ರಾಮೀಣ ರಸ್ತೆ)</option>
                    <option value="Public Toilet">Public Toilet (ಸಾರ್ವಜನಿಕ ಶೌಚಾಲಯ)</option>
                    <option value="Drainage">Drainage Canal (ಚರಂಡಿ)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Panchayat Ward
                  </label>
                  <select
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                  >
                    <option value="Ward 1">Ward 1 - North Belavadi</option>
                    <option value="Ward 2">Ward 2 - Temple Street</option>
                    <option value="Ward 3">Ward 3 - Milk Dairy & High School</option>
                    <option value="Ward 4">Ward 4 - Chamundi Approach Link</option>
                  </select>
                </div>
              </div>

              {/* Citizen Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-0.5">
                    Citizen Name
                  </label>
                  <input
                    type="text"
                    value={citizenName}
                    onChange={(e) => setCitizenName(e.target.value)}
                    required
                    className="w-full text-xs font-medium px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-0.5">
                    Mobile Phone (WhatsApp & SMS Alerts)
                  </label>
                  <input
                    type="text"
                    value={citizenPhone}
                    onChange={(e) => setCitizenPhone(e.target.value)}
                    required
                    className="w-full text-xs font-medium px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
              </div>

              {/* Submit Action */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <div className="text-[11px] text-slate-500 font-medium">
                  {duplicateCheck.isDuplicate ? 'Will co-sign active incident.' : 'Creates master ticket with 7-Day BDO SLA.'}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center space-x-1.5 bg-gradient-to-r from-amber-600 to-indigo-600 hover:from-amber-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-md shadow-amber-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>{duplicateCheck.isDuplicate ? 'Co-Sign Master Ticket' : 'Dispatch Master Ticket'}</span>
                  </button>
                </div>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
