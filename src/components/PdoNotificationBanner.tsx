import React, { useState } from 'react';
import { PdoNotificationAlert, ActiveRole, LanguageMode } from '../types';
import { PDO_CONTACT, calculateSlaRemaining } from '../utils/notificationSystem';
import { 
  AlertTriangle, 
  ShieldAlert, 
  ArrowRight, 
  X, 
  Phone, 
  MessageSquare, 
  Radio, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Clock,
  Sparkles,
  Zap
} from 'lucide-react';

interface PdoNotificationBannerProps {
  alerts: PdoNotificationAlert[];
  onDismissAlert: (alertId: string) => void;
  onNavigateToAssign: (complaintId: string) => void;
  onNavigateToAsset: (assetId: string) => void;
  lang: LanguageMode;
  onTriggerTestAlert?: () => void;
}

export const PdoNotificationBanner: React.FC<PdoNotificationBannerProps> = ({
  alerts,
  onDismissAlert,
  onNavigateToAssign,
  onNavigateToAsset,
  lang,
  onTriggerTestAlert,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  if (!alerts || alerts.length === 0) return null;

  // Ensure index within bounds
  const safeIndex = Math.min(currentIndex, alerts.length - 1);
  const activeAlert = alerts[safeIndex] || alerts[0];
  const slaInfo = calculateSlaRemaining(activeAlert.slaDeadline);

  return (
    <div 
      id="pdo-persistent-notification-banner"
      className="w-full bg-gradient-to-r from-red-700 via-red-800 to-amber-900 text-white shadow-lg border-b-2 border-amber-400/80 transition-all duration-300 relative z-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        {/* Main Banner Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          {/* Left section: Icon + Urgent Tag + Key Message */}
          <div className="flex items-start sm:items-center space-x-3 flex-1 min-w-0">
            {/* Animated Beacon Indicator */}
            <div className="relative shrink-0 mt-0.5 sm:mt-0">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-400"></span>
              </span>
              <div className="mt-1 p-1.5 rounded-lg bg-red-950/70 border border-red-500/50 text-amber-300">
                <ShieldAlert className="w-5 h-5" />
              </div>
            </div>

            {/* Alert Details */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-red-900/90 text-amber-300 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md tracking-wider border border-red-500/40 flex items-center space-x-1">
                  <Radio className="w-3 h-3 animate-pulse text-red-400" />
                  <span>
                    {lang === 'kn' ? 'ಪಿಡಿಒ ಸ್ವಯಂಚಾಲಿತ ಎಚ್ಚರಿಕೆ' : 'PDO AUTOMATED DISPATCH ALERT'}
                  </span>
                </span>

                <span className="bg-amber-400 text-red-950 font-black text-[10px] px-2 py-0.5 rounded">
                  {activeAlert.priority} PRIORITY
                </span>

                <span className="text-red-200 text-xs font-semibold">
                  ID: <span className="text-white font-mono font-bold">{activeAlert.complaintId}</span>
                </span>

                {alerts.length > 1 && (
                  <span className="bg-red-950/80 text-amber-200 text-[11px] font-bold px-2 py-0.5 rounded-full border border-red-600/40">
                    Alert {safeIndex + 1} of {alerts.length}
                  </span>
                )}
              </div>

              {/* Main alert description text */}
              <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                <span className="font-bold text-white text-sm truncate">
                  {lang === 'kn' ? (activeAlert.titleKn || activeAlert.title) : activeAlert.title}
                </span>
                <span className="text-red-200">•</span>
                <span className="text-amber-200 font-medium">
                  {activeAlert.location} ({activeAlert.ward})
                </span>
                {activeAlert.hazardWarning && (
                  <>
                    <span className="text-red-200">•</span>
                    <span className="text-amber-300 font-bold bg-red-950/80 px-1.5 py-0.2 rounded border border-amber-500/30">
                      ⚠️ {activeAlert.hazardWarning}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right section: Action Buttons & Controls */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end shrink-0 pt-2 md:pt-0 border-t border-red-800/50 md:border-t-0">
            {/* Multi-alert navigator if multiple */}
            {alerts.length > 1 && (
              <div className="flex items-center space-x-1 bg-red-950/60 rounded-lg p-0.5 border border-red-700/50 mr-1">
                <button
                  onClick={() => setCurrentIndex((prev) => (prev > 0 ? prev - 1 : alerts.length - 1))}
                  className="p-1 hover:bg-red-800/80 rounded text-amber-200 cursor-pointer"
                  title="Previous Alert"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-bold px-1 text-red-200">
                  {safeIndex + 1}/{alerts.length}
                </span>
                <button
                  onClick={() => setCurrentIndex((prev) => (prev < alerts.length - 1 ? prev + 1 : 0))}
                  className="p-1 hover:bg-red-800/80 rounded text-amber-200 cursor-pointer"
                  title="Next Alert"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Toggle dispatch logs / details */}
            <button
              id="pdo-alert-toggle-details"
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-2.5 py-1.5 bg-red-950/80 hover:bg-red-900 border border-red-600/50 rounded-lg text-xs font-semibold text-amber-200 flex items-center space-x-1 transition-colors cursor-pointer"
              title="View SMS/WhatsApp Automated Gateway logs"
            >
              <Radio className="w-3.5 h-3.5 text-amber-400" />
              <span>{isExpanded ? (lang === 'kn' ? 'ಮುಚ್ಚಿ' : 'Hide Gateway Log') : (lang === 'kn' ? 'ಗೇಟ್‌ವೇ ಲಾಗ್‌' : 'Gateway Telemetry')}</span>
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5 ml-0.5" /> : <ChevronDown className="w-3.5 h-3.5 ml-0.5" />}
            </button>

            {/* Direct Action: Assign Field Technician */}
            <button
              id="pdo-alert-assign-button"
              onClick={() => onNavigateToAssign(activeAlert.complaintId)}
              className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-red-950 rounded-lg text-xs font-black shadow-md flex items-center space-x-1.5 transition-transform active:scale-95 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-red-950" />
              <span>{lang === 'kn' ? 'ಸಿಬ್ಬಂದಿ ನಿಯೋಜಿಸಿ' : 'Assign Technician Now'}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
            </button>

            {/* Dismiss / Acknowledge */}
            <button
              id="pdo-alert-dismiss-button"
              onClick={() => onDismissAlert(activeAlert.id)}
              className="p-1.5 hover:bg-red-900/90 text-red-200 hover:text-white rounded-lg transition-colors cursor-pointer ml-1"
              title="Acknowledge and dismiss this notification banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Expandable Gateway Telemetry & Simulation Details */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-red-700/60 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs animate-in fade-in duration-200">
            {/* Column 1: Automated Dispatch Channels */}
            <div className="bg-red-950/60 p-3 rounded-xl border border-red-600/40">
              <div className="text-[11px] font-extrabold text-amber-300 uppercase tracking-wider flex items-center space-x-1.5 mb-2">
                <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                <span>Simulated Dispatch Channels</span>
              </div>
              <ul className="space-y-1.5 text-red-100">
                <li className="flex items-center justify-between">
                  <span className="text-red-300">Gov SMS (DLT: KA-GOVPDO):</span>
                  <span className="font-bold text-emerald-300 flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Delivered</span>
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-red-300">WhatsApp SOS Dispatch:</span>
                  <span className="font-bold text-emerald-300 flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Sent with Photo</span>
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-red-300">Panchayat Mobile App Push:</span>
                  <span className="font-bold text-amber-300">Active High-Priority</span>
                </li>
              </ul>
            </div>

            {/* Column 2: PDO Recipient & Escalation */}
            <div className="bg-red-950/60 p-3 rounded-xl border border-red-600/40">
              <div className="text-[11px] font-extrabold text-amber-300 uppercase tracking-wider flex items-center space-x-1.5 mb-2">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>Designated Panchayat Authority</span>
              </div>
              <div className="text-red-100 space-y-1">
                <div className="font-bold text-white">{PDO_CONTACT.name}</div>
                <div className="text-red-300 text-[11px]">
                  {PDO_CONTACT.designation}, {PDO_CONTACT.panchayat}
                </div>
                <div className="text-amber-200 font-mono text-[11px]">
                  Mobile: {PDO_CONTACT.phone}
                </div>
                <div className="text-[11px] text-red-300">
                  JE Escort: {PDO_CONTACT.jeName} ({PDO_CONTACT.jePhone})
                </div>
              </div>
            </div>

            {/* Column 3: SLA & Asset Info */}
            <div className="bg-red-950/60 p-3 rounded-xl border border-red-600/40 flex flex-col justify-between">
              <div>
                <div className="text-[11px] font-extrabold text-amber-300 uppercase tracking-wider flex items-center space-x-1.5 mb-2">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>SLA Countdown & Asset Tag</span>
                </div>
                <div className="text-red-100 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-red-300">SLA Window:</span>
                    <span className={`font-bold ${slaInfo.isUrgent ? 'text-amber-300' : 'text-white'}`}>
                      {slaInfo.text}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-red-300">Asset Tag:</span>
                    <button
                      onClick={() => onNavigateToAsset(activeAlert.assetId)}
                      className="font-mono font-bold text-amber-300 hover:underline flex items-center space-x-1 cursor-pointer"
                    >
                      <span>{activeAlert.assetId}</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-2 mt-2 border-t border-red-800/60 text-[11px] text-red-300 flex items-center justify-between">
                <span>Check browser developer console for live telemetry</span>
                {onTriggerTestAlert && (
                  <button
                    onClick={onTriggerTestAlert}
                    className="text-[10px] text-amber-300 hover:text-white underline font-semibold cursor-pointer"
                  >
                    Simulate Another Alert
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
