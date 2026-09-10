import { Complaint, PdoNotificationAlert } from '../types';

/**
 * Simulated automated notification utility for Karnataka Panchayat Development Officers (PDOs).
 * Logs formatted telemetry to the browser console representing the automated SMS/WhatsApp/Push
 * dispatch gateway maintained under Karnataka Rural Development & Panchayat Raj (KRDPR).
 */

export const WHATSAPP_BOT_NUMBER = '+91-6283647871';
export const WHATSAPP_RAW_NUMBER = '916283647871';

export const PDO_CONTACT = {
  designation: 'Panchayat Development Officer (PDO)',
  name: 'Sri S. Kumar, KAS (Jr)',
  panchayat: 'Belavadi Gram Panchayat',
  taluk: 'Mysuru Rural Taluk',
  district: 'Mysuru District',
  phone: '+91 6283647871',
  whatsapp: '+91-6283647871',
  email: 'pdo.belavadi-mysuru@karnataka.gov.in',
  jeName: 'Sri Ramesh M. (Junior Engineer, Rural Water & Works)',
  jePhone: '+91 6283647871',
  botHelpline: '+91-6283647871',
};

/**
 * Creates direct WhatsApp link with pre-filled message for GramaPala Bot
 */
export function getWhatsAppBotLink(action: 'report' | 'track' | 'sos' | 'worker_update' | 'custom', params?: { ticketId?: string; assetName?: string; location?: string; customMessage?: string }): string {
  let text = '';
  switch (action) {
    case 'report':
      text = `*GramaPala Seva Bot (ಗ್ರಾಮಪಾಲ ಸೇವೆ)*\n\nHi! I want to report a broken public asset:\n📍 Location: ${params?.location || 'Belavadi GP'}\n⚙️ Asset Type: ${params?.assetName || 'Streetlight / Water / Road'}\n\nPlease register my complaint and assign a technician.`;
      break;
    case 'track':
      text = `*GramaPala Ticket Tracking*\n\nHi, please check status of Grievance Ticket: *${params?.ticketId || 'GP-2025-01'}*`;
      break;
    case 'sos':
      text = `🚨 *EMERGENCY CIVIC HAZARD SOS*\n\nUrgent breakdown reported at ${params?.location || 'Belavadi Main Road'}.\nAsset: ${params?.assetName || 'High-Tension Wire / Broken Water Main'}\nImmediate PDO dispatch requested!`;
      break;
    case 'worker_update':
      text = `*Field Ops Update (Technician)*\n\nRepair completed for Ticket *${params?.ticketId || 'GP-2025-01'}* (${params?.assetName || 'Asset'}). Uploading proof of repair.`;
      break;
    case 'custom':
    default:
      text = params?.customMessage || 'Hi GramaPala Bot (+91-6283647871), I need assistance with Gram Panchayat services.';
      break;
  }

  return `https://wa.me/${WHATSAPP_RAW_NUMBER}?text=${encodeURIComponent(text)}`;
}

/**
 * Checks whether a complaint is deemed critical requiring automated PDO immediate dispatch.
 */
export function isCriticalGrievance(complaint: Partial<Complaint>): boolean {
  if (complaint.priority === 'Critical') return true;
  if (complaint.priority === 'High') return true;
  const triage = complaint.triage;
  if (triage?.damageSeverity === 'Critical' || triage?.damageSeverity === 'High') return true;
  if (triage?.hazardWarning && triage.hazardWarning.trim().length > 0) return true;
  return false;
}

/**
 * Triggers the automated PDO notification:
 * 1. Formats and prints an eye-catching, high-visibility log in the console.
 * 2. Emits an audible frequency pulse (if browser allows Web Audio).
 * 3. Returns the structured PdoNotificationAlert for persistent UI banner display.
 */
export function notifyPdoCriticalGrievance(complaint: Complaint): PdoNotificationAlert {
  const alertId = `PDO-ALERT-${Date.now().toString().slice(-6)}`;
  
  const alertData: PdoNotificationAlert = {
    id: alertId,
    complaintId: complaint.id,
    title: `URGENT: ${complaint.category} Breakdown in ${complaint.ward}`,
    titleKn: complaint.descriptionKn || `${complaint.ward} ನಲ್ಲಿ ${complaint.category} ತುರ್ತು ದುರಸ್ತಿ`,
    category: complaint.category,
    ward: complaint.ward,
    location: complaint.location,
    priority: complaint.priority,
    reportedAt: complaint.reportedAt,
    slaDeadline: complaint.slaDeadline,
    reportedBy: {
      name: complaint.reportedBy?.name || 'Citizen',
      phone: complaint.reportedBy?.phone || 'N/A',
      village: complaint.reportedBy?.village || 'Belavadi GP',
    },
    assetId: complaint.assetId,
    assetName: complaint.assetName,
    hazardWarning: complaint.triage?.hazardWarning || (complaint.priority === 'Critical' ? 'Immediate public safety risk reported.' : undefined),
    formalSummary: complaint.triage?.formalSummaryEn || complaint.description,
    timestamp: Date.now(),
    acknowledged: false,
  };

  // 1. Log rich console output representing the automated notification system
  logPdoAutomatedConsole(alertData, complaint);

  // 2. Play gentle alert chime if audio context is supported
  playSimulatedAlertBeep();

  return alertData;
}

/**
 * Formatted console output representing the KRDPR Automated Dispatch System
 */
function logPdoAutomatedConsole(alert: PdoNotificationAlert, complaint: Complaint) {
  const isTopCritical = alert.priority === 'Critical';
  const badgeColor = isTopCritical ? '#dc2626' : '#ea580c';
  const timestamp = new Date().toLocaleTimeString('en-IN', { hour12: false });

  console.groupCollapsed(
    `%c 🚨 [KRDPR PDO AUTOMATED DISPATCH GATEWAY] ${alert.priority.toUpperCase()} GRIEVANCE ESCALATION: ${alert.complaintId} (${alert.category}) `,
    `background: ${badgeColor}; color: #ffffff; font-weight: 800; font-size: 13px; padding: 4px 8px; border-radius: 4px;`
  );

  console.log(
    `%cAutomated State Dispatch Server v3.4 | Karnataka Rural Infrastructure Management System (KRIMS)`,
    'color: #0284c7; font-weight: 600;'
  );

  console.table({
    'Dispatch Status': 'SENT & DELIVERED (Simulated)',
    'Primary Recipient': `${PDO_CONTACT.name} (${PDO_CONTACT.designation})`,
    'Recipient Mobile': PDO_CONTACT.phone,
    'Secondary Escalation': `${PDO_CONTACT.jeName} (${PDO_CONTACT.jePhone})`,
    'Gram Panchayat': PDO_CONTACT.panchayat,
    'Complaint ID': alert.complaintId,
    'Asset Tag': alert.assetId,
    'Category': alert.category,
    'Ward / Location': `${alert.ward} - ${alert.location}`,
    'Priority Level': alert.priority,
    'SLA Resolution Window': complaint.triage?.recommendedSLA || '12-24 Hours',
    'Citizen Reporter': `${alert.reportedBy.name} (${alert.reportedBy.phone})`,
    'Safety Hazard Flag': alert.hazardWarning ? 'YES - IMMEDIATE ACTION REQ.' : 'NO',
    'Timestamp': `${new Date().toLocaleDateString('en-IN')} ${timestamp}`,
  });

  console.log(
    `%c[SMS GATEWAY (TRAI DLT: KA-GOVPDO)]%c "ALERT: Critical ${alert.category} issue reported at ${alert.location}. CompID: ${alert.complaintId}. Safety risk: ${alert.hazardWarning || 'Urgent repair'}. Assign technician immediately on GramaPala Portal."`,
    'background: #047857; color: #fff; padding: 2px 4px; border-radius: 2px; font-weight: bold;',
    'color: #064e3b; font-weight: 500;'
  );

  console.log(
    `%c[WHATSAPP BUSINESS SOS DISPATCH]%c Pushed Geo-tagged report, photo attachment, and 1-Click Assignment Link to ${PDO_CONTACT.whatsapp} & Ward Member.`,
    'background: #15803d; color: #fff; padding: 2px 4px; border-radius: 2px; font-weight: bold;',
    'color: #14532d; font-weight: 500;'
  );

  console.log(
    `%c[STATUTORY TRIAGE SUMMARY]%c ${alert.formalSummary || 'Public asset requires priority maintenance.'}`,
    'background: #4f46e5; color: #fff; padding: 2px 4px; border-radius: 2px; font-weight: bold;',
    'color: #312e81; font-weight: 500;'
  );

  console.groupEnd();
}

/**
 * Gentle Web Audio synthesizer beep for simulated hardware notification
 */
function playSimulatedAlertBeep() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.setValueAtTime(880, ctx.currentTime + 0.12); // A5

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.36);
  } catch (e) {
    // Audio contexts may be blocked by autoplay policies until user gesture; ignore silently
  }
}

/**
 * Formats countdown or remaining hours for SLA
 */
export function calculateSlaRemaining(slaDeadlineStr: string): { text: string; isUrgent: boolean } {
  try {
    const deadline = new Date(slaDeadlineStr).getTime();
    const now = Date.now();
    const diffHours = Math.round((deadline - now) / (1000 * 60 * 60));

    if (diffHours <= 0) {
      return { text: 'SLA Expired (Immediate Action)', isUrgent: true };
    }
    if (diffHours <= 6) {
      return { text: `${diffHours}h remaining (Critical SLA)`, isUrgent: true };
    }
    return { text: `${diffHours}h remaining`, isUrgent: false };
  } catch {
    return { text: '24h SLA target', isUrgent: false };
  }
}
