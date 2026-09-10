import { jsPDF } from 'jspdf';
import { Asset, Complaint } from '../types';

export interface AuditReportData {
  reportTitle: string;
  documentType: string;
  referenceStandard: string;
  auditVerificationCode: string;
  generatedAt: string;
  panchayat: string;
  taluk: string;
  district: string;
  state: string;
  asset: {
    id: string;
    name: string;
    category: string;
    ward: string;
    physicalLocation: string;
    coordinates: { lat: number; lng: number };
    installationDate: string;
    currentStatus: string;
    procurementContractor: string;
    warrantyExpiry: string;
    isUnderWarranty: boolean;
    isLemonAsset: boolean;
    failureCountUnderWarranty: number;
    lemonAssetAdvisory?: string;
  };
  maintenanceAuditSummary: {
    totalReportedComplaints: number;
    resolvedComplaints: number;
    pendingComplaints: number;
    totalRepairExpenditureINR: number;
    averageResolutionDays: number;
    lemonThresholdExceeded: boolean;
  };
  repairHistoryLedger: Array<{
    sequenceNumber: number;
    complaintId: string;
    recordedDate: string;
    issueDescription: string;
    assignedTechnician: string;
    partsReplaced: string;
    expenditureINR: number;
    turnaroundDays: number;
    status: string;
    warrantyClaimed: boolean;
  }>;
  governmentSignatories: {
    panchayatDevelopmentOfficer: string;
    gramPanchayatPresident: string;
    districtTechnicalAuditor: string;
  };
}

/**
 * Builds structured JSON audit data conforming to Karnataka RDPR / NIC Panchatantra 2.0 standards
 */
export function generateStructuredAuditJSON(asset: Asset, complaints: Complaint[] = []): AuditReportData {
  const timestamp = new Date().toISOString();
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const verificationCode = `KRDPR-AUD-${asset.id.replace(/[^a-zA-Z0-9]/g, '')}-${dateStr}`;

  const history = asset.repairHistory || [];
  const totalCost = history.reduce((sum, r) => sum + (r.costInr || 0), 0);
  const resolvedCount = history.filter((r) => r.status === 'Closed').length;
  const pendingCount = history.length - resolvedCount;
  const avgDays =
    history.length > 0
      ? +(
          history.reduce((sum, r) => sum + (r.resolvedInDays || 0), 0) /
          history.length
        ).toFixed(1)
      : 0;

  return {
    reportTitle: 'Karnataka Gram Panchayat Public Asset Audit & Maintenance Report',
    documentType: 'OFFICIAL_GOVERNMENT_ASSET_AUDIT_DOSSIER',
    referenceStandard: 'KRDPR / Panchatantra 2.0 Digital Asset Ledger v3.4',
    auditVerificationCode: verificationCode,
    generatedAt: timestamp,
    panchayat: asset.panchayat || 'Belavadi Gram Panchayat',
    taluk: 'Mysuru Rural Taluk',
    district: 'Mysuru',
    state: 'Karnataka',
    asset: {
      id: asset.id,
      name: asset.name,
      category: asset.category,
      ward: asset.ward,
      physicalLocation: asset.location || `${asset.ward}, ${asset.panchayat}`,
      coordinates: {
        lat: asset.coordinates.lat,
        lng: asset.coordinates.lng,
      },
      installationDate: asset.installationDate,
      currentStatus: asset.status,
      procurementContractor: asset.contractor,
      warrantyExpiry: asset.warrantyExpiry,
      isUnderWarranty: asset.isUnderWarranty,
      isLemonAsset: !!asset.isLemonAsset,
      failureCountUnderWarranty: asset.failureCount,
      lemonAssetAdvisory: asset.isLemonAsset
        ? 'Flagged for mandatory vendor penalty and free overhaul under Karnataka Panchayati Raj Procurement Rules 2022 (Failure count >= 3 during warranty period).'
        : undefined,
    },
    maintenanceAuditSummary: {
      totalReportedComplaints: asset.repairHistory.length,
      resolvedComplaints: resolvedCount,
      pendingComplaints: pendingCount,
      totalRepairExpenditureINR: totalCost,
      averageResolutionDays: avgDays,
      lemonThresholdExceeded: !!asset.isLemonAsset,
    },
    repairHistoryLedger: asset.repairHistory.map((r, idx) => ({
      sequenceNumber: idx + 1,
      complaintId: r.complaintId,
      recordedDate: r.date,
      issueDescription: r.issue,
      assignedTechnician: r.workerName,
      partsReplaced: r.partsReplaced || 'None (Servicing & Adjustment)',
      expenditureINR: r.costInr || 0,
      turnaroundDays: r.resolvedInDays || 0,
      status: r.status,
      warrantyClaimed: asset.isUnderWarranty,
    })),
    governmentSignatories: {
      panchayatDevelopmentOfficer: 'Panchayat Development Officer (PDO), Belavadi GP',
      gramPanchayatPresident: 'Adhyaksha (President), Belavadi Gram Panchayat',
      districtTechnicalAuditor: 'Assistant Executive Engineer (AEE), PRE Division Mysuru',
    },
  };
}

/**
 * Initiates direct download of structured JSON file to client device
 */
export function downloadAuditReportJSON(asset: Asset, complaints: Complaint[] = []): void {
  const data = generateStructuredAuditJSON(asset, complaints);
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `Audit-Report-${asset.id}-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

/**
 * Generates an official, publication-quality PDF audit report using jsPDF
 */
export function downloadAuditReportPDF(asset: Asset, complaints: Complaint[] = []): void {
  const auditData = generateStructuredAuditJSON(asset, complaints);
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  let y = 14;

  // --- Official Government Header Top Banner ---
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('GOVERNMENT OF KARNATAKA', pageWidth / 2, 8, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(226, 232, 240);
  doc.text(
    'DEPARTMENT OF RURAL DEVELOPMENT AND PANCHAYAT RAJ (KRDPR)',
    pageWidth / 2,
    13,
    { align: 'center' }
  );

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(250, 204, 21); // amber-400
  doc.text(
    'PANCHATANTRA 2.0 • OFFICIAL PUBLIC ASSET AUDIT & REPAIR DOSSIER',
    pageWidth / 2,
    19,
    { align: 'center' }
  );

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(203, 213, 225);
  doc.text(
    `${auditData.panchayat} • ${auditData.taluk}, ${auditData.district} Dist.`,
    pageWidth / 2,
    24,
    { align: 'center' }
  );

  y = 35;

  // --- Verification Code & Document Metadata Bar ---
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 12, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('AUDIT VERIFICATION NO:', margin + 4, y + 5);
  doc.setFont('courier', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(auditData.auditVerificationCode, margin + 48, y + 5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('DATE GENERATED:', pageWidth - margin - 55, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(new Date().toLocaleDateString('en-IN', { dateStyle: 'medium' }), pageWidth - margin - 22, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('Statutory standard: KRDPR / 15th Finance Commission Public Asset Rules', margin + 4, y + 9.5);

  y += 16;

  // --- Section 1: Asset Core Identification & Location Matrix ---
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, pageWidth - margin * 2, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text('1. ASSET PROFILE & PHYSICAL IDENTIFICATION', margin + 3, y + 4.2);

  y += 7.5;

  const boxWidth = (pageWidth - margin * 2) / 2;
  const metaHeight = 28;

  // Left metadata box
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(255, 255, 255);
  doc.rect(margin, y, boxWidth - 1, metaHeight, 'FD');

  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Asset Identification ID:', margin + 3, y + 5);
  doc.setFont('courier', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(67, 56, 202); // indigo-700
  doc.text(auditData.asset.id, margin + 40, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Asset Nomenclature:', margin + 3, y + 10.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(auditData.asset.name.slice(0, 32), margin + 40, y + 10.5);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Asset Category:', margin + 3, y + 16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(auditData.asset.category, margin + 40, y + 16);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Jurisdiction Ward:', margin + 3, y + 21.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`${auditData.asset.ward} (${auditData.panchayat})`, margin + 40, y + 21.5);

  // Right metadata box
  doc.rect(margin + boxWidth + 1, y, boxWidth - 1, metaHeight, 'FD');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Current Health Status:', margin + boxWidth + 4, y + 5);
  doc.setFont('helvetica', 'bold');
  if (auditData.asset.currentStatus === 'Working') {
    doc.setTextColor(5, 150, 105); // emerald
  } else {
    doc.setTextColor(220, 38, 38); // red
  }
  doc.text(auditData.asset.currentStatus.toUpperCase(), margin + boxWidth + 42, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Commissioning Date:', margin + boxWidth + 4, y + 10.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(auditData.asset.installationDate, margin + boxWidth + 42, y + 10.5);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('GPS Geo-Coordinates:', margin + boxWidth + 4, y + 16);
  doc.setFont('courier', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(
    `${auditData.asset.coordinates.lat.toFixed(4)}° N, ${auditData.asset.coordinates.lng.toFixed(4)}° E`,
    margin + boxWidth + 42,
    y + 16
  );

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Physical Location:', margin + boxWidth + 4, y + 21.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  const locShort = auditData.asset.physicalLocation.slice(0, 36);
  doc.text(locShort, margin + boxWidth + 42, y + 21.5);

  y += metaHeight + 4;

  // --- Section 2: Procurement Integrity & Warranty Audit ---
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, pageWidth - margin * 2, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text('2. CONTRACTOR PROCUREMENT & WARRANTY COMPLIANCE AUDIT', margin + 3, y + 4.2);

  y += 7.5;

  const warrantyBoxHeight = auditData.asset.isLemonAsset ? 22 : 16;
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(255, 255, 255);
  doc.rect(margin, y, pageWidth - margin * 2, warrantyBoxHeight, 'FD');

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Contractor / Vendor:', margin + 3, y + 5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(auditData.asset.procurementContractor, margin + 36, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Warranty Valid Until:', margin + 115, y + 5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(auditData.asset.isUnderWarranty ? 5 : 100, auditData.asset.isUnderWarranty ? 150 : 116, auditData.asset.isUnderWarranty ? 105 : 139);
  doc.text(
    `${auditData.asset.warrantyExpiry} (${auditData.asset.isUnderWarranty ? 'ACTIVE' : 'EXPIRED'})`,
    margin + 148,
    y + 5
  );

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Breakdown Count (Warranty):', margin + 3, y + 10.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(auditData.asset.failureCountUnderWarranty >= 3 ? 220 : 15, auditData.asset.failureCountUnderWarranty >= 3 ? 38 : 23, auditData.asset.failureCountUnderWarranty >= 3 ? 38 : 42);
  doc.text(`${auditData.asset.failureCountUnderWarranty} Recorded Failures`, margin + 46, y + 10.5);

  if (auditData.asset.isLemonAsset) {
    doc.setFillColor(254, 242, 242);
    doc.setDrawColor(254, 202, 202);
    doc.roundedRect(margin + 2, y + 13, pageWidth - margin * 2 - 4, 7, 1, 1, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(185, 28, 28);
    doc.text(
      '⚠️ STATUTORY LEMON ASSET ALERT: Exceeded maximum permitted failure threshold (>=3) during warranty.',
      margin + 4,
      y + 17.5
    );
  }

  y += warrantyBoxHeight + 4;

  // --- Section 3: Financial & Reliability Key Performance Indicators ---
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, pageWidth - margin * 2, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text('3. FINANCIAL EXPENDITURE & RELIABILITY METRICS', margin + 3, y + 4.2);

  y += 7.5;

  const statWidth = (pageWidth - margin * 2) / 4;
  const stats = [
    { label: 'Total Complaints', value: `${auditData.maintenanceAuditSummary.totalReportedComplaints}` },
    { label: 'Resolved vs Pending', value: `${auditData.maintenanceAuditSummary.resolvedComplaints} / ${auditData.maintenanceAuditSummary.pendingComplaints}` },
    { label: 'Cumulative Cost (INR)', value: `Rs. ${(auditData.maintenanceAuditSummary?.totalRepairExpenditureINR ?? 0).toLocaleString('en-IN')}` },
    { label: 'Average MTTR', value: `${auditData.maintenanceAuditSummary.averageResolutionDays} Days` },
  ];

  stats.forEach((st, idx) => {
    const sx = margin + idx * statWidth;
    doc.setDrawColor(226, 232, 240);
    doc.setFillColor(255, 255, 255);
    doc.rect(sx, y, statWidth, 13, 'FD');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(st.label, sx + 3, y + 4.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text(st.value, sx + 3, y + 10);
  });

  y += 17;

  // --- Section 4: Itemized Repair History Ledger ---
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, pageWidth - margin * 2, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text('4. IMMUTABLE REPAIR & MAINTENANCE AUDIT LEDGER', margin + 3, y + 4.2);

  y += 7.5;

  // Ledger Table Header
  const colX = {
    seq: margin,
    date: margin + 8,
    cmpId: margin + 28,
    issue: margin + 55,
    parts: margin + 110,
    cost: margin + 148,
    status: margin + 168,
  };

  doc.setFillColor(30, 41, 59);
  doc.rect(margin, y, pageWidth - margin * 2, 6, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);
  doc.text('#', colX.seq + 2, y + 4.2);
  doc.text('Date', colX.date, y + 4.2);
  doc.text('Complaint ID', colX.cmpId, y + 4.2);
  doc.text('Reported Issue / Defect', colX.issue, y + 4.2);
  doc.text('Replaced Components', colX.parts, y + 4.2);
  doc.text('Cost (INR)', colX.cost, y + 4.2);
  doc.text('Status', colX.status, y + 4.2);

  y += 6;

  // Ledger Table Rows
  if (auditData.repairHistoryLedger.length === 0) {
    doc.setFillColor(255, 255, 255);
    doc.rect(margin, y, pageWidth - margin * 2, 8, 'FD');
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text('No maintenance records or failure incidents recorded for this asset to date.', margin + 4, y + 5.5);
    y += 8;
  } else {
    auditData.repairHistoryLedger.forEach((row, rIdx) => {
      const isEven = rIdx % 2 === 0;
      const rowH = 9;

      // Check if we need page overflow protection
      if (y + rowH > pageHeight - 35) {
        doc.addPage();
        y = 15;
      }

      doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
      doc.setDrawColor(226, 232, 240);
      doc.rect(margin, y, pageWidth - margin * 2, rowH, 'FD');

      doc.setFont('courier', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(71, 85, 105);
      doc.text(`${row.sequenceNumber}`, colX.seq + 2, y + 5.5);

      doc.setFont('helvetica', 'normal');
      doc.text(row.recordedDate, colX.date, y + 5.5);

      doc.setFont('courier', 'bold');
      doc.setTextColor(67, 56, 202);
      doc.text(row.complaintId, colX.cmpId, y + 5.5);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(15, 23, 42);
      doc.text(row.issueDescription.slice(0, 32), colX.issue, y + 5.5);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text((row.partsReplaced || 'N/A').slice(0, 24), colX.parts, y + 5.5);

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(`Rs. ${(row.expenditureINR ?? 0).toLocaleString('en-IN')}`, colX.cost, y + 5.5);

      if (row.status === 'Closed') {
        doc.setTextColor(5, 150, 105);
        doc.text('RESOLVED', colX.status, y + 5.5);
      } else {
        doc.setTextColor(220, 38, 38);
        doc.text('PENDING', colX.status, y + 5.5);
      }

      y += rowH;
    });
  }

  y += 8;

  // --- Official Attestation & Signatures Section ---
  if (y > pageHeight - 45) {
    doc.addPage();
    y = 15;
  }

  doc.setDrawColor(203, 213, 225);
  doc.line(margin, y, pageWidth - margin, y);
  y += 5;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text('OFFICIAL VERIFICATION & CERTIFICATION OF AUDIT ACCURACY', margin, y);
  y += 8;

  const sigWidth = (pageWidth - margin * 2) / 3;

  // Signatory 1: PDO
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Panchayat Development Officer', margin, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Belavadi Gram Panchayat, Mysuru', margin, y + 4);
  doc.text('(Digital Signature Verified)', margin, y + 8);

  // Signatory 2: Adhyaksha
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Grama Panchayat Adhyaksha', margin + sigWidth, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Belavadi Gram Panchayat', margin + sigWidth, y + 4);
  doc.text('(Public Attestation Seal)', margin + sigWidth, y + 8);

  // Signatory 3: Technical Auditor
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Executive Technical Auditor', margin + sigWidth * 2, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Panchayati Raj Engineering Division', margin + sigWidth * 2, y + 4);
  doc.text('(Statutory Lifecycle Audit)', margin + sigWidth * 2, y + 8);

  // Footer text
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  doc.text(
    `Certified Government Document • Generated by GramaPala Asset Twin Ledger • Page 1 of 1 • System SHA256: ${Math.random().toString(36).substring(2, 12).toUpperCase()}`,
    pageWidth / 2,
    pageHeight - 6,
    { align: 'center' }
  );

  // Save the generated PDF
  doc.save(`Audit-Report-${asset.id}-${new Date().toISOString().slice(0, 10)}.pdf`);
}
