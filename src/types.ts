export type AssetCategory =
  | 'Streetlight'
  | 'Water Supply'
  | 'Public Toilet'
  | 'Rural Road'
  | 'Borewell Pump'
  | 'Drainage';

export type AssetStatus = 'Working' | 'Degraded' | 'Critical Failure' | 'Under Repair' | 'Healthy' | 'Needs Attention' | 'Poor' | 'Critical';

export type ComplaintStatus =
  | 'Pending'
  | 'Reported'
  | 'Assigned'
  | 'In Progress'
  | 'Under Repair'
  | 'Completed'
  | 'Resolved'
  | 'Closed'
  | 'Reopened';

export type PriorityLevel = 'Critical' | 'High' | 'Medium' | 'Low';

export interface RepairProof {
  photoUrl: string;
  beforePhotoUrl?: string;
  completedAt: string;
  workerNotes: string;
  partsReplaced?: string[];
  geoTag: string;
  contractorVerified: boolean;
  actionType?: 'Repair' | 'Replace';
  repairCost?: {
    partsCost: number;
    laborCost: number;
    totalCost: number;
  };
  qaVerification?: {
    verified: boolean;
    confidence: number;
    summary: string;
    inspectedAt: string;
  };
}

export interface RepairGalleryPhoto {
  id?: string;
  url: string;
  caption: string;
  type: 'damage_report' | 'repair_proof' | 'component' | 'inspection';
  timestamp?: string;
  geoTag?: string;
  capturedBy?: string;
}

export interface AssetRepairRecord {
  complaintId: string;
  date: string;
  issue: string;
  resolvedInDays: number;
  workerName: string;
  status: 'Closed' | 'Reopened' | 'Pending';
  costInr: number;
  partsReplaced?: string;
  repairProof?: RepairProof;
  damagePhotoUrl?: string;
  galleryPhotos?: RepairGalleryPhoto[];
}

export interface Asset {
  id: string; // e.g. "SL-0241" or "KA-MYS-SL-102"
  assetCode?: string; // e.g. "SL-0241"
  name: string;
  category: AssetCategory;
  panchayat: string; // e.g. "Belavadi Gram Panchayat"
  ward: string; // "Ward 3"
  location?: string; // e.g. "Main Bazaar Junction, Belavadi"
  coordinates: { lat: number; lng: number };
  status: AssetStatus;
  installationDate: string;
  ageYears?: number; // e.g. 5
  complaintCount?: number; // e.g. 11
  repairCount?: number; // e.g. 6
  maintenanceCost?: number; // e.g. 18400
  healthScore?: number; // e.g. 24 / 100
  failureRiskPercent?: number; // e.g. 87%
  contractor: string;
  warrantyExpiry: string;
  isUnderWarranty: boolean;
  isLemonAsset: boolean;
  failureCount: number;
  imageUrl: string;
  repairHistory: AssetRepairRecord[];
  qrCodeUrl?: string;
  futureFailurePrediction?: {
    riskScore: number;
    predictedFailureDate: string;
    mtbfDays: number;
    riskReason: string;
    preventiveAction: string;
  };
  repairVsReplaceRecommendation?: {
    recommendation: 'Repair' | 'Replace' | 'Inspect';
    cumulativeRepairCostInr: number;
    newUnitCostInr: number;
    savingsEstimateInr: number;
    justification: string;
    reason?: string;
  };
}

export interface WorkerInfo {
  id: string;
  name: string;
  phone: string;
  trade: string;
  panchayat: string;
  activeTasks: number;
  completedTasks: number;
  rating: number;
}

export interface CitizenVerification {
  verifiedAt: string;
  decision: 'Fixed' | 'Not Fixed';
  feedback?: string;
  rating?: number;
}

export interface TriageReport {
  assetType: string;
  damageSeverity: 'Critical' | 'High' | 'Medium' | 'Low';
  recommendedSLA: string;
  specialistRequired: string;
  kannadaTitle: string;
  formalSummaryEn: string;
  formalSummaryKn: string;
  hazardWarning: string;
  suggestedAction: string;
  lemonAssetCheck?: string;
}

export interface WorkOrder {
  orderId: string;
  issuedAt: string;
  authorizedBudget: number;
  actionType: 'Repair' | 'Replace';
  targetSla: string;
  pdoApprovalSignature: string;
  instructions: string;
}

export interface RankedBudgetItem {
  id: string;
  assetCode: string;
  assetName: string;
  category: AssetCategory;
  action: 'Repair' | 'Replace';
  estimatedCost: number;
  healthScore: number;
  failureRisk: number;
  communityImpact: number;
  priorityScore: number;
  urgency: 'Critical' | 'High' | 'Medium';
  allocated: boolean;
  reason: string;
}

export interface BudgetOptimizationResult {
  totalBudget: number;
  allocatedBudget: number;
  balanceRemaining: number;
  itemsFundedCount: number;
  totalItemsEvaluated: number;
  rankedItems: RankedBudgetItem[];
}

export interface BillOfQuantitiesItem {
  item: string;
  quantity: string;
  rateInr: number;
  amountInr: number;
}

export interface BillOfQuantities {
  items: BillOfQuantitiesItem[];
  materialCostInr: number;
  laborCostInr: number;
  contingencyInr: number;
  totalEstimatedInr: number;
  preApprovedTenderLimitInr: number;
  isPreApproved: boolean;
}

export interface VoiceNoteRecord {
  durationSeconds: number;
  language: 'kn' | 'en' | 'hi';
  transcriptionEn: string;
  transcriptionKn: string;
  detectedKeywords: string[];
  audioWaveform?: number[];
}

export interface CitizenTrustProfile {
  score: number; // 0 - 100
  status: 'Verified Citizen' | 'Standard Citizen' | 'Shadow-Flagged';
  accurateReportsCount: number;
  totalSubmissions: number;
  flaggedSpamAttempts: number;
}

export interface PauseRequest {
  requestedBy: string;
  requestedAt: string;
  reason: 'Monsoon Flooding / Inaccessible' | 'Specialized Parts Procurement Delay' | 'Power Grid Disconnection Required' | 'Civil Structural Re-engineering Needed';
  details: string;
  proofUrl?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  reviewedBy?: string;
  reviewedAt?: string;
  reviewerNotes?: string;
}

export interface SlaEscalationState {
  currentTier: 'Tier 1: BDO' | 'Tier 2: EO' | 'Tier 3: CEO' | 'Tier 4: RDPR HQ';
  dayElapsed: number; // 0 to 14
  slaDaysTotal: number; // 7 for BDO, +3 for EO, +2 for CEO, +2 for RDPR
  amberAlertActive: boolean; // Day 6, Day 9, Day 11 alerts
  strikesIssued: Array<{
    targetRole: 'BDO' | 'EO' | 'CEO' | 'Contractor';
    targetName: string;
    strikeNumber: number;
    issuedAt: string;
    reason: string;
  }>;
  autoCloseTimeoutHoursRemaining?: number; // 48-hour citizen verification fallback
  reopenWindowDaysRemaining?: number; // 15-day reopen window
}

export interface OfficerDisciplinaryDossier {
  officerId: string;
  officerName: string;
  designation: string;
  talukOrPanchayat: string;
  totalStrikes: number;
  criticalCasesBreached: string[];
  dossierGeneratedAt: string;
  rdprActionStatus: 'Pending Review' | 'Show-Cause Notice Served' | 'Suspension Recommended' | 'Explanation Accepted';
  dossierId: string;
}

export interface Complaint {
  id: string; // e.g. "NAS-00021" or "CMP-2026-101"
  assetId: string;
  assetName: string;
  category: AssetCategory;
  location: string;
  ward: string;
  channel: 'Web Portal' | 'Mobile App' | 'WhatsApp Bot';
  reportedBy: {
    name: string;
    phone: string;
    village: string;
    trustProfile?: CitizenTrustProfile;
  };
  reportedAt: string;
  description: string;
  descriptionKn?: string;
  photoUrl: string;
  voiceNote?: VoiceNoteRecord;
  status: ComplaintStatus;
  priority: PriorityLevel;
  slaDeadline: string;
  assignedWorker?: WorkerInfo;
  assignedAt?: string;
  repairProof?: RepairProof;
  citizenVerification?: CitizenVerification;
  triage?: TriageReport;
  billOfQuantities?: BillOfQuantities;
  pauseRequest?: PauseRequest;
  escalationState?: SlaEscalationState;
  reopenCount?: number;
  gpsCoordinates?: { lat: number; lng: number; accuracyMeters: number };
  matchedAssetDistanceMeters?: number;
  duplicateStatus?: {
    isDuplicate: boolean;
    existingComplaintId?: string;
    reportedHoursAgo?: number;
    coSignersCount?: number;
    message: string;
  };
  communityImpactScore?: number; // 0-100 impact score
  communityImpactDetails?: {
    householdsAffected: number;
    vitalService: string;
    riskFactor: string;
  };
  workOrder?: WorkOrder;
  isFishyFlagged?: boolean; // Offline physical inspection trigger
  contractorPaymentStatus?: 'Pending Verification' | 'Fast-Track Approved' | 'Withheld / Penalty Penalty' | 'Disbursed';
}

export type ActiveRole = 
  | 'citizen' 
  | 'live_map' 
  | 'panchayat' 
  | 'taluk' 
  | 'district' 
  | 'state' 
  | 'worker' 
  | 'asset_passport' 
  | 'analytics'
  | 'leaderboard'
  | 'alerts';

export type AuthCategory = 'citizen' | 'governance' | 'worker';

export interface UserSession {
  category: AuthCategory;
  name: string;
  nameKn?: string;
  designation: string;
  designationKn?: string;
  idOrPhone: string;
  location: string;
  locationKn?: string;
  activeRole: ActiveRole;
  governanceTier?: 'panchayat' | 'taluk' | 'district' | 'state';
  avatarInitials: string;
  badge: string;
  workerTrade?: string;
}

export type GovernanceTier = 'gram_panchayat' | 'taluk_panchayat' | 'zilla_panchayat' | 'state_government';

export type InfrastructureHealthTier = 'Exemplary' | 'Normal' | 'Needs Attention' | 'Critical Alert';

export interface GramPanchayatPerformance {
  id: string;
  name: string;
  nameKn?: string;
  talukId: string;
  talukName: string;
  districtName: string;
  totalAssets: number;
  workingAssets: number;
  failingAssets: number;
  criticalAssets: number;
  activeComplaints: number;
  resolvedComplaints: number;
  avgResolutionTimeHours: number;
  budgetAllocatedInr: number;
  budgetSpentInr: number;
  warrantyClaimsRecoveredInr: number;
  healthScore: number;
  rank: number;
  status: InfrastructureHealthTier;
  pdoName: string;
  pdoPhone: string;
  topRiskCategory: string;
}

export interface TalukHierarchyData {
  id: string;
  name: string;
  nameKn?: string;
  districtId: string;
  districtName: string;
  totalGramPanchayats: number;
  totalAssets: number;
  activeComplaints: number;
  resolvedComplaints: number;
  healthIndex: number;
  budgetAllocatedInrLakhs: number;
  budgetUtilizedInrLakhs: number;
  warrantyClaimsRecoveredInrLakhs: number;
  frequentlyFailingAssetsCount: number;
  avgResolutionHours: number;
  rank: number;
}

export interface DistrictHierarchyData {
  id: string;
  name: string;
  nameKn?: string;
  code: string;
  totalTaluks: number;
  totalGramPanchayats: number;
  totalPublicAssets: number;
  activeComplaints: number;
  resolvedComplaints: number;
  overallHealthIndex: number;
  budgetAllocatedInrLakhs: number;
  budgetUtilizedInrLakhs: number;
  warrantyRecoveryClaimsInrLakhs: number;
  criticalInterventionZones: number;
  talukPerformance: TalukHierarchyData[];
}

export interface StateHierarchyData {
  totalDistricts: number;
  totalTaluks: number;
  totalGramPanchayats: number;
  totalPublicAssetsTracked: number;
  totalActiveGrievances: number;
  totalResolvedGrievances: number;
  statewideHealthIndex: number;
  total15thFinanceGrantAllocatedCr: number;
  totalGrantUtilizedCr: number;
  totalContractorPenaltiesRecoveredCr: number;
  averageStateResolutionTimeHours: number;
  highRiskTaluksCount: number;
  topPerformingDistricts: string[];
  priorityInterventionDistricts: string[];
  sectoralHealthBreakdown: {
    category: string;
    totalAssets: number;
    healthIndex: number;
    criticalCount: number;
    budgetCr: number;
  }[];
}

export interface InterventionPriority {
  id: string;
  level: 'Taluk' | 'Gram Panchayat' | 'Asset Cluster';
  name: string;
  district: string;
  riskFactor: string;
  urgency: 'Immediate' | 'Medium' | 'Scheduled';
  recommendedAction: string;
  estimatedFundingRequiredLakhs: number;
}

export type LanguageMode = 'en' | 'kn';

export interface PdoNotificationAlert {
  id: string;
  complaintId: string;
  title: string;
  titleKn?: string;
  category: AssetCategory;
  ward: string;
  location: string;
  priority: PriorityLevel;
  reportedAt: string;
  slaDeadline: string;
  reportedBy: {
    name: string;
    phone: string;
    village?: string;
  };
  assetId: string;
  assetName: string;
  hazardWarning?: string;
  formalSummary?: string;
  timestamp: number;
  acknowledged?: boolean;
}
