import React, { useState } from 'react';
import { Complaint, LanguageMode, PdoNotificationAlert } from '../types';
import { 
  WHATSAPP_BOT_NUMBER, 
  PDO_CONTACT, 
  getWhatsAppBotLink, 
  notifyPdoCriticalGrievance 
} from '../utils/notificationSystem';
import { 
  Bell, 
  AlertTriangle, 
  Phone, 
  MessageSquare, 
  Radio, 
  Send, 
  CheckCircle2, 
  ShieldAlert, 
  Flame, 
  Clock, 
  Layers, 
  ExternalLink, 
  Volume2, 
  VolumeX, 
  Filter, 
  Sparkles,
  RefreshCw,
  Sliders,
  Check
} from 'lucide-react';

interface AutomatedAlertsCenterProps {
  complaints: Complaint[];
  activeAlerts: PdoNotificationAlert[];
  onTriggerTestAlert?: (alert: PdoNotificationAlert) => void;
  lang: LanguageMode;
}

interface AlertLogEntry {
  id: string;
  timestamp: string;
  type: 'CRITICAL_DISPATCH' | 'AMBER_ALERT' | 'EO_ESCALATION' | 'DISCIPLINARY_STRIKE' | 'CITIZEN_SOS';
  recipient: string;
  channel: 'WhatsApp' | 'SMS' | 'Push';
  status: 'Delivered' | 'Pending' | 'Acknowledged';
  title: string;
  details: string;
  complaintId?: string;
  severity: 'High' | 'Critical' | 'Severe';
}

export const AutomatedAlertsCenter: React.FC<AutomatedAlertsCenterProps> = ({
  complaints = [],
  activeAlerts = [],
  onTriggerTestAlert,
  lang,
}) => {
  const [selectedChannel, setSelectedChannel] = useState<'all' | 'WhatsApp' | 'SMS'>('all');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulatedSuccess, setSimulatedSuccess] = useState(false);

  // Default simulated alert logs
  const [alertLogs, setAlertLogs] = useState<AlertLogEntry[]>([
    {
      id: 'LOG-8812',
      timestamp: 'Today, 09:15 AM',
      type: 'CRITICAL_DISPATCH',
      recipient: `PDO (${WHATSAPP_BOT_NUMBER})`,
      channel: 'WhatsApp',
      status: 'Delivered',
      title: 'Water Pipe Rupture in Ward 2',
      details: 'Automated 1-Click technician dispatch link and geo-location sent to PDO Sri S. Kumar.',
      complaintId: 'CMP-2026-061',
      severity: 'Critical',
    },
    {
      id: 'LOG-8811',
      timestamp: 'Today, 08:30 AM',
      type: 'AMBER_ALERT',
      recipient: `JE & PDO (${WHATSAPP_BOT_NUMBER})`,
      channel: 'SMS',
      status: 'Delivered',
      title: 'Day 6 Amber Alert: Road rut erosion',
      details: '24 hours remaining before automatic escalation to Taluk Executive Officer (EO).',
      complaintId: 'CMP-2026-074',
      severity: 'High',
    },
    {
      id: 'LOG-8809',
      timestamp: 'Yesterday, 04:20 PM',
      type: 'CITIZEN_SOS',
      recipient: `Emergency Cell (${WHATSAPP_BOT_NUMBER})`,
      channel: 'WhatsApp',
      status: 'Acknowledged',
      title: 'Live High-Tension Sparking near Bus Stop',
      details: 'Auto-triage AI flagged life hazard. Lineman dispatched with 45m SLA.',
      complaintId: 'CMP-2026-042',
      severity: 'Severe',
    },
    {
      id: 'LOG-8804',
      timestamp: 'Yesterday, 11:00 AM',
      type: 'DISCIPLINARY_STRIKE',
      recipient: `ZP CEO & RDPR Apex (${WHATSAPP_BOT_NUMBER})`,
      channel: 'SMS',
      status: 'Delivered',
      title: 'Strike #3 Show-Cause Notice Generated',
      details: 'SLA breached >10 days on primary health water pump. Dossier filed to RDPR.',
      complaintId: 'CMP-2026-029',
      severity: 'Critical',
    },
  ]);

  const handleSimulateCustomAlert = (type: 'water' | 'wire' | 'amber') => {
    setIsSimulating(true);

    setTimeout(() => {
      let newLog: AlertLogEntry;

      if (type === 'water') {
        newLog = {
          id: `LOG-${Math.floor(Math.random() * 9000 + 1000)}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'CRITICAL_DISPATCH',
          recipient: `PDO (${WHATSAPP_BOT_NUMBER})`,
          channel: 'WhatsApp',
          status: 'Delivered',
          title: 'Drinking Water Pipeline Burst (Simulated)',
          details: `Immediate dispatch triggered to WhatsApp number ${WHATSAPP_BOT_NUMBER}. Auto-assigned to Plumber Ramesh Gowda.`,
          complaintId: 'CMP-2026-099',
          severity: 'Critical',
        };
      } else if (type === 'wire') {
        newLog = {
          id: `LOG-${Math.floor(Math.random() * 9000 + 1000)}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'CITIZEN_SOS',
          recipient: `Emergency Gateway (${WHATSAPP_BOT_NUMBER})`,
          channel: 'WhatsApp',
          status: 'Delivered',
          title: 'Live Wire Snapped Hazard (Simulated SOS)',
          details: `Priority alert pushed to Lineman Basavaraju and PDO at ${WHATSAPP_BOT_NUMBER}. Immediate perimeter cordoning advisory.`,
          complaintId: 'CMP-2026-101',
          severity: 'Severe',
        };
      } else {
        newLog = {
          id: `LOG-${Math.floor(Math.random() * 9000 + 1000)}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'AMBER_ALERT',
          recipient: `Taluk EO & PDO (${WHATSAPP_BOT_NUMBER})`,
          channel: 'SMS',
          status: 'Delivered',
          title: 'Day 6 SLA Amber Warning (Simulated)',
          details: `Statutory 24-hour warning served before automatic escalation to Executive Officer.`,
          complaintId: 'CMP-2026-102',
          severity: 'High',
        };
      }

      setAlertLogs((prev) => [newLog, ...prev]);
      setIsSimulating(false);
      setSimulatedSuccess(true);
      setTimeout(() => setSimulatedSuccess(false), 3000);
    }, 800);
  };

  const filteredLogs = alertLogs.filter((log) => {
    if (selectedChannel === 'all') return true;
    return log.channel === selectedChannel;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-slate-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-rose-500/30 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 bg-rose-500/20 border border-rose-400/40 px-3 py-1 rounded-full text-xs font-black text-rose-300">
              <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              <span>Automated RDPR Dispatch & Escalation Engine</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {lang === 'kn' ? 'ಸ್ವಯಂಚಾಲಿತ ಎಚ್ಚರಿಕೆ & ತುರ್ತು ಕಂಟ್ರೋಲ್ ಸೆಂಟರ್' : 'Automated Alerts & Telemetry Center'}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Real-time multi-channel automated broadcast sending instant WhatsApp alerts to{' '}
              <strong className="text-emerald-400 font-mono">{WHATSAPP_BOT_NUMBER}</strong>, SMS DLT gateway, and administrative hierarchy.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-black/40 border border-white/10 backdrop-blur-xs rounded-2xl p-3.5 text-center min-w-[110px]">
              <div className="text-[10px] text-rose-300 font-extrabold uppercase">Active Alerts</div>
              <div className="text-xl font-black text-white mt-0.5">{alertLogs.length}</div>
              <div className="text-[10px] text-emerald-400 font-bold">100% Delivered</div>
            </div>

            <div className="bg-black/40 border border-white/10 backdrop-blur-xs rounded-2xl p-3.5 text-center min-w-[110px]">
              <div className="text-[10px] text-emerald-300 font-extrabold uppercase">WhatsApp Gateway</div>
              <div className="text-sm font-black text-emerald-400 mt-0.5 font-mono">{WHATSAPP_BOT_NUMBER}</div>
              <div className="text-[10px] text-slate-300 font-bold">Verified Business API</div>
            </div>

            <a
              href={getWhatsAppBotLink('sos')}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-black px-4 py-3 rounded-2xl text-xs shadow-lg transition-all cursor-pointer flex items-center space-x-2 shrink-0"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Open WhatsApp Bot</span>
            </a>
          </div>
        </div>
      </div>

      {/* Simulator Actions & Alert Rules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Test Alert Dispatch Simulator */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Simulate Automated Alert Broadcast</span>
              </h3>
              <p className="text-xs text-slate-500">
                Trigger real-time simulated notifications directly to the official mobile number ({WHATSAPP_BOT_NUMBER})
              </p>
            </div>

            {simulatedSuccess && (
              <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 animate-in fade-in">
                <Check className="w-3.5 h-3.5" /> Dispatched!
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => handleSimulateCustomAlert('water')}
              disabled={isSimulating}
              className="p-4 rounded-2xl border border-blue-200 bg-blue-50/50 hover:bg-blue-100/60 transition-all text-left space-y-2 group cursor-pointer disabled:opacity-50"
            >
              <div className="flex items-center justify-between">
                <span className="text-xl">💧</span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-200 text-blue-900">
                  Critical
                </span>
              </div>
              <h4 className="text-xs font-black text-blue-950 group-hover:text-blue-700">
                Water Main Burst
              </h4>
              <p className="text-[11px] text-slate-600 leading-tight">
                Dispatches immediate 1-Click assignment to Plumber and WhatsApp alert to PDO.
              </p>
            </button>

            <button
              onClick={() => handleSimulateCustomAlert('wire')}
              disabled={isSimulating}
              className="p-4 rounded-2xl border border-rose-200 bg-rose-50/50 hover:bg-rose-100/60 transition-all text-left space-y-2 group cursor-pointer disabled:opacity-50"
            >
              <div className="flex items-center justify-between">
                <span className="text-xl">⚡</span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-rose-200 text-rose-900">
                  Severe SOS
                </span>
              </div>
              <h4 className="text-xs font-black text-rose-950 group-hover:text-rose-700">
                Live Wire Hazard
              </h4>
              <p className="text-[11px] text-slate-600 leading-tight">
                Broadcasts emergency siren, life-safety alert, and notifies Ward Lineman instantly.
              </p>
            </button>

            <button
              onClick={() => handleSimulateCustomAlert('amber')}
              disabled={isSimulating}
              className="p-4 rounded-2xl border border-amber-200 bg-amber-50/50 hover:bg-amber-100/60 transition-all text-left space-y-2 group cursor-pointer disabled:opacity-50"
            >
              <div className="flex items-center justify-between">
                <span className="text-xl">⚠️</span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                  Day 6 Amber
                </span>
              </div>
              <h4 className="text-xs font-black text-amber-950 group-hover:text-amber-700">
                SLA Breach Warning
              </h4>
              <p className="text-[11px] text-slate-600 leading-tight">
                Auto-schedules escalation to Taluk Executive Officer if unresolved in 24 hrs.
              </p>
            </button>
          </div>
        </div>

        {/* Right: Automated Escalation Matrix Rules */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
              <Layers className="w-4 h-4" />
              <span>Automated Escalation Matrix</span>
            </h3>
            <span className="text-[10px] font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-400">
              Rule Engine v3
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-start space-x-2.5">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                0h
              </div>
              <div>
                <div className="font-bold text-slate-200">Day 0: PDO & Lineman Dispatch</div>
                <div className="text-[10px] text-slate-400">Instant WhatsApp to {WHATSAPP_BOT_NUMBER}</div>
              </div>
            </div>

            <div className="flex items-start space-x-2.5">
              <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                6d
              </div>
              <div>
                <div className="font-bold text-slate-200">Day 6: Amber Alert Warning</div>
                <div className="text-[10px] text-slate-400">24h statutory notice before EO takeover</div>
              </div>
            </div>

            <div className="flex items-start space-x-2.5">
              <div className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                7d
              </div>
              <div>
                <div className="font-bold text-slate-200">Day 7: Taluk EO Auto-Escalation</div>
                <div className="text-[10px] text-slate-400">Direct budget takeover & contractor audit</div>
              </div>
            </div>

            <div className="flex items-start space-x-2.5">
              <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                10d
              </div>
              <div>
                <div className="font-bold text-slate-200">Day 10: ZP CEO Disciplinary Strike</div>
                <div className="text-[10px] text-slate-400">Formal Show-Cause notice under RDPR Act</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Automated Alert Logs */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-black text-slate-900">
              Real-Time Automated Alert Dispatch Logs ({filteredLogs.length})
            </h3>
            <p className="text-xs text-slate-500">
              Audit trail of automated messages pushed to WhatsApp, SMS, and Push channels
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-500">Channel:</span>
            <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setSelectedChannel('all')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  selectedChannel === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedChannel('WhatsApp')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  selectedChannel === 'WhatsApp' ? 'bg-white text-emerald-800 shadow-2xs' : 'text-slate-500'
                }`}
              >
                WhatsApp
              </button>
              <button
                onClick={() => setSelectedChannel('SMS')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  selectedChannel === 'SMS' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                }`}
              >
                SMS
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-extrabold text-[10px]">
              <tr>
                <th className="py-3 px-4">Log ID & Time</th>
                <th className="py-3 px-4">Alert Classification</th>
                <th className="py-3 px-4">Channel & Recipient</th>
                <th className="py-3 px-4">Grievance / Subject</th>
                <th className="py-3 px-4">Dispatch Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-mono font-bold text-slate-900">{log.id}</div>
                    <div className="text-[10px] text-slate-400">{log.timestamp}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full ${
                      log.severity === 'Severe' ? 'bg-purple-100 text-purple-900 border border-purple-300' :
                      log.severity === 'Critical' ? 'bg-rose-100 text-rose-900 border border-rose-300' :
                      'bg-amber-100 text-amber-900 border border-amber-300'
                    }`}>
                      {log.type}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-1.5 font-bold text-slate-800">
                      {log.channel === 'WhatsApp' ? (
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Phone className="w-3.5 h-3.5 text-blue-600" />
                      )}
                      <span>{log.channel}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">{log.recipient}</div>
                  </td>

                  <td className="py-3.5 px-4 max-w-xs">
                    <div className="font-bold text-slate-900">{log.title}</div>
                    <div className="text-[10px] text-slate-500 truncate">{log.details}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      {log.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <a
                      href={getWhatsAppBotLink('custom', {
                        customMessage: `Inquiry regarding Alert ${log.id} (${log.title}) sent to ${WHATSAPP_BOT_NUMBER}`,
                      })}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[11px] inline-flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Verify</span>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
