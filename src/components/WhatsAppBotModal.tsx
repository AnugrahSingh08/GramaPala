import React, { useState, useEffect, useRef } from 'react';
import { Complaint, LanguageMode, Asset } from '../types';
import { 
  WHATSAPP_BOT_NUMBER, 
  WHATSAPP_RAW_NUMBER, 
  getWhatsAppBotLink 
} from '../utils/notificationSystem';
import { 
  Send, 
  Phone, 
  MessageSquare, 
  CheckCheck, 
  Camera, 
  MapPin, 
  Mic, 
  AlertTriangle, 
  ExternalLink, 
  QrCode, 
  Sparkles, 
  FileText, 
  CheckCircle2, 
  Clock, 
  X, 
  ChevronRight, 
  RefreshCw,
  Copy,
  Check,
  ShieldCheck,
  Building2,
  Paperclip
} from 'lucide-react';

interface WhatsAppBotModalProps {
  isOpen: boolean;
  onClose: () => void;
  complaints: Complaint[];
  assets: Asset[];
  onNewGrievanceSubmitted?: (complaint: Complaint) => void;
  lang: LanguageMode;
}

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
  imageUrl?: string;
  options?: { label: string; action: string; payload?: any }[];
  ticketCard?: {
    id: string;
    asset: string;
    status: string;
    ward: string;
    sla: string;
  };
}

export const WhatsAppBotModal: React.FC<WhatsAppBotModalProps> = ({
  isOpen,
  onClose,
  complaints = [],
  assets = [],
  onNewGrievanceSubmitted,
  lang,
}) => {
  const [activeTab, setActiveTab] = useState<'simulator' | 'direct' | 'qr'>('simulator');
  const [chatLanguage, setChatLanguage] = useState<'en' | 'kn'>(lang || 'en');
  const [inputMessage, setInputMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initialBotGreeting: ChatMessage = {
    id: 'msg-1',
    sender: 'bot',
    text: chatLanguage === 'kn' 
      ? `🙏 ನಮಸ್ಕಾರ! ನಾನು ಗ್ರಾಮಪಾಲ (GramaPala) ವಾಟ್ಸಾಪ್ ಸಹಾಯಕಿ ಬಾಟ್. \n\nನನ್ನ ಅಧಿಕೃತ ಸಹಾಯವಾಣಿ ಸಂಖ್ಯೆ: *${WHATSAPP_BOT_NUMBER}*.\n\nನಿಮ್ಮ ಗ್ರಾಮ ಪಂಚಾಯತಿಯ ಸಾರ್ವಜನಿಕ ಆಸ್ತಿ (ಬೀದಿ ದೀಪ, ಕುಡಿಯುವ ನೀರು, ರಸ್ತೆ) ದುರಸ್ತಿಗಾಗಿ ನಾನು ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?`
      : `🙏 Welcome to *GramaPala Seva WhatsApp Bot*! \n\nOfficial Helpline: *${WHATSAPP_BOT_NUMBER}* (Karnataka RDPR)\n\nI can help you report broken public assets, track existing complaints, or verify completed repairs in your Gram Panchayat. How can I assist you today?`,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    options: [
      { label: '📸 Report Broken Asset', action: 'report_issue' },
      { label: '🔍 Track Ticket Status', action: 'track_ticket' },
      { label: '🚨 Emergency Civic SOS', action: 'sos_alert' },
      { label: '✅ Verify Completed Repair', action: 'verify_repair' },
    ],
  };

  const [messages, setMessages] = useState<ChatMessage[]>([initialBotGreeting]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(WHATSAPP_BOT_NUMBER);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendMessage = (customText?: string) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInputMessage('');
    setIsTyping(true);

    // Simulate Bot Response Engine
    setTimeout(() => {
      generateBotResponse(textToSend);
      setIsTyping(false);
    }, 900);
  };

  const handleOptionClick = (option: { label: string; action: string; payload?: any }) => {
    handleSendMessage(option.label);

    setTimeout(() => {
      if (option.action === 'report_issue') {
        const botReply: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `Please select the public asset category you want to report in Belavadi Gram Panchayat:`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          options: [
            { label: '💡 Streetlight / Mast Defect', action: 'category_streetlight' },
            { label: '💧 Drinking Water / Pipe Burst', action: 'category_water' },
            { label: '🛣️ Rural Road / Pothole Damage', action: 'category_road' },
            { label: '🚾 Public Sanitation / Toilet', action: 'category_toilet' },
          ],
        };
        setMessages((prev) => [...prev, botReply]);
      } else if (option.action.startsWith('category_')) {
        const catName = option.label.replace(/^[^\w\s]+/, '').trim();
        const newTicketId = `GP-${new Date().getFullYear()}-${Math.floor(Math.random() * 800 + 100)}`;
        
        const botReply: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `✅ *GRIEVANCE REGISTERED SUCCESSFULLY!*\n\n🎫 *Ticket ID:* \`${newTicketId}\`\n📍 *Ward:* Ward 3, Belavadi Main Market\n⚙️ *Category:* ${catName}\n⏱️ *Statutory SLA:* 24 Hours\n\n🚨 *Automated Push Sent:* Alert dispatched directly to Panchayat Development Officer (PDO) & Junior Engineer at *${WHATSAPP_BOT_NUMBER}*. Lineman has been auto-assigned!`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          ticketCard: {
            id: newTicketId,
            asset: `${catName} (Public Infrastructure)`,
            status: 'Assigned to Technician',
            ward: 'Ward 3, Belavadi',
            sla: '24 Hours (Guaranteed Resolution)',
          },
          options: [
            { label: `🔍 Track ${newTicketId}`, action: 'track_ticket' },
            { label: '📞 Call Gram Panchayat Helpline', action: 'contact_pdo' },
          ],
        };
        setMessages((prev) => [...prev, botReply]);
      } else if (option.action === 'track_ticket') {
        const activeTickets = complaints.slice(0, 3);
        const botReply: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `Here are the latest live grievance tickets tracked in your Gram Panchayat:`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          options: activeTickets.map((c) => ({
            label: `Ticket ${c.id}: ${c.category} (${c.status})`,
            action: 'view_specific_ticket',
            payload: c,
          })),
        };
        setMessages((prev) => [...prev, botReply]);
      } else if (option.action === 'sos_alert') {
        const botReply: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `🚨 *CRITICAL CIVIC HAZARD SOS TRIGGERED!*\n\nYour alert has been broadcast via high-priority automated dispatch to:\n• *Panchayat Development Officer (PDO)*: ${WHATSAPP_BOT_NUMBER}\n• *Junior Engineer (RWSS)*: ${WHATSAPP_BOT_NUMBER}\n• *Karnataka State Emergency Dispatch Server*\n\nLineman response team ETA: *45 minutes*. Please maintain a safe perimeter.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          options: [
            { label: '📞 Direct Call Emergency Officer', action: 'contact_pdo' },
            { label: '💬 Open Real WhatsApp Chat', action: 'open_wa_direct' },
          ],
        };
        setMessages((prev) => [...prev, botReply]);
      } else if (option.action === 'verify_repair') {
        const pendingVerify = complaints.find((c) => c.status === 'Completed') || complaints[0];
        const botReply: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `Field technician has submitted repair proof for *${pendingVerify.assetName}* (${pendingVerify.id}).\n\nPlease inspect the repair proof photo and confirm if the asset is working:`,
          imageUrl: pendingVerify.repairProof?.photoUrl || pendingVerify.photoUrl,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          options: [
            { label: '👍 Yes, Fully Fixed (Approve)', action: 'approve_repair' },
            { label: '👎 No, Defect Still Exists (Reopen)', action: 'reject_repair' },
          ],
        };
        setMessages((prev) => [...prev, botReply]);
      } else if (option.action === 'approve_repair') {
        const botReply: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `🎉 *Thank you for your Citizen Verification!* The ticket is now officially CLOSED on the Karnataka GramaPala portal. Contractor payment has been fast-track cleared. Your Citizen Trust score has increased to *100%*.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, botReply]);
      } else if (option.action === 'reject_repair') {
        const botReply: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `⚠️ *Grievance Reopened!* An automated disciplinary warning has been flagged to the technician and contractor. The PDO has been alerted on *${WHATSAPP_BOT_NUMBER}* for physical re-inspection.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, botReply]);
      }
    }, 400);
  };

  const generateBotResponse = (userText: string) => {
    const textLower = userText.toLowerCase();

    if (textLower.includes('track') || textLower.includes('status') || textLower.includes('cmp') || textLower.includes('gp-')) {
      const matchTicket = complaints.find((c) => textLower.includes(c.id.toLowerCase())) || complaints[0];
      const botReply: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `📊 *Status for Ticket ${matchTicket.id}:*\n\n• *Asset:* ${matchTicket.assetName}\n• *Location:* ${matchTicket.ward}, ${matchTicket.location}\n• *Current Status:* *${matchTicket.status.toUpperCase()}*\n• *Technician:* ${matchTicket.assignedWorker?.name || 'Assigned to Ward Lineman'}\n• *SLA Deadline:* ${matchTicket.slaDeadline}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        ticketCard: {
          id: matchTicket.id,
          asset: matchTicket.assetName,
          status: matchTicket.status,
          ward: matchTicket.ward,
          sla: matchTicket.slaDeadline,
        },
      };
      setMessages((prev) => [...prev, botReply]);
    } else if (textLower.includes('hi') || textLower.includes('hello') || textLower.includes('namaste') || textLower.includes('ನಮಸ್ಕಾರ')) {
      const botReply: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `Hello! I'm active on WhatsApp at *${WHATSAPP_BOT_NUMBER}*. You can report broken streetlights, water leakages, roads, or track complaints directly here. What would you like to do?`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        options: [
          { label: '📸 Report Broken Asset', action: 'report_issue' },
          { label: '🔍 Track Ticket Status', action: 'track_ticket' },
          { label: '🚨 Emergency Civic SOS', action: 'sos_alert' },
        ],
      };
      setMessages((prev) => [...prev, botReply]);
    } else {
      const botReply: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `I received your message: "${userText}". Our automated AI engine is analyzing your request. You can also chat directly with our official number *${WHATSAPP_BOT_NUMBER}* on real WhatsApp!`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        options: [
          { label: '📸 Report Broken Asset', action: 'report_issue' },
          { label: '🔍 Track Ticket Status', action: 'track_ticket' },
          { label: '🚨 Emergency Civic SOS', action: 'sos_alert' },
        ],
      };
      setMessages((prev) => [...prev, botReply]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 sm:p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-slate-900 rounded-3xl shadow-2xl border border-emerald-500/40 overflow-hidden flex flex-col md:flex-row max-h-[92vh] h-[720px]">
        
        {/* Left Sidebar: WhatsApp Bot Info & Direct WhatsApp Links */}
        <div className="w-full md:w-80 bg-slate-950 p-5 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800 shrink-0">
          <div className="space-y-4">
            {/* WhatsApp Brand Header */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white flex items-center justify-center shadow-lg shadow-emerald-900/40 shrink-0">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <h3 className="text-base font-black text-white">GramaPala Seva</h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="text-[11px] text-emerald-400 font-bold">Official WhatsApp Bot</p>
              </div>
            </div>

            {/* Official Mobile Number Card */}
            <div className="bg-gradient-to-br from-emerald-950/80 to-slate-900 border border-emerald-500/50 rounded-2xl p-3.5 space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-300">
                Automated Bot & Helpline Mobile
              </span>
              <div className="flex items-center justify-between">
                <span className="text-base font-black text-white font-mono tracking-tight">
                  {WHATSAPP_BOT_NUMBER}
                </span>
                <button
                  onClick={handleCopyNumber}
                  className="p-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 transition-colors cursor-pointer"
                  title="Copy Phone Number"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                24/7 AI-Powered Grievance Intake, Instant Ticket Generation, & PDO Alert Dispatch.
              </p>
            </div>

            {/* Direct WhatsApp Action Buttons */}
            <div className="space-y-2 pt-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Launch on Real WhatsApp
              </span>

              <a
                href={getWhatsAppBotLink('report')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-200 text-xs font-bold transition-all group cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <Camera className="w-4 h-4 text-emerald-400" />
                  <span>Report Broken Asset</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
              </a>

              <a
                href={getWhatsAppBotLink('track', { ticketId: complaints[0]?.id || 'GP-2025-01' })}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold transition-all group cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>Track Live Grievance</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </a>

              <a
                href={getWhatsAppBotLink('sos')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/50 border border-rose-600/40 text-rose-200 text-xs font-bold transition-all group cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>Emergency SOS Dispatch</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-rose-400 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          </div>

          {/* Bottom QR Code & Switcher */}
          <div className="pt-3 border-t border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px]">Chatbot Language:</span>
              <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg">
                <button
                  onClick={() => setChatLanguage('en')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    chatLanguage === 'en' ? 'bg-emerald-600 text-white' : 'text-slate-400'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setChatLanguage('kn')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    chatLanguage === 'kn' ? 'bg-emerald-600 text-white' : 'text-slate-400'
                  }`}
                >
                  ಕನ್ನಡ
                </button>
              </div>
            </div>

            <div className="text-[10px] text-slate-500 text-center font-mono">
              TRAI Registered: KA-RDPR-BOT
            </div>
          </div>
        </div>

        {/* Right Main Panel: WhatsApp Chat Simulator UI */}
        <div className="flex-1 flex flex-col bg-[#0b141a] relative">
          {/* WhatsApp Chat Top Bar */}
          <div className="bg-[#202c33] p-3 sm:px-4 flex items-center justify-between text-white border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center font-black text-white shrink-0 relative">
                <Building2 className="w-5 h-5" />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#202c33] rounded-full" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <h4 className="text-sm font-black text-slate-100">GramaPala Seva Helpline</h4>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-[11px] text-emerald-400 font-mono">
                  {WHATSAPP_BOT_NUMBER} • Online
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <a
                href={getWhatsAppBotLink('custom')}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open in App</span>
              </a>

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* WhatsApp Chat Messages Scroll Container */}
          <div 
            className="flex-1 overflow-y-auto p-4 space-y-3"
            style={{
              backgroundImage: 'radial-gradient(#1f2c34 1px, transparent 1px)',
              backgroundSize: '16px 16px',
            }}
          >
            {/* Encryption Notice */}
            <div className="flex justify-center">
              <div className="bg-[#182229] border border-amber-500/20 text-amber-200 text-[10px] px-3 py-1 rounded-lg text-center max-w-md shadow-xs">
                🔒 Official Government of Karnataka Service. End-to-end verified gateway for {WHATSAPP_BOT_NUMBER}.
              </div>
            </div>

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-md rounded-2xl p-3 text-xs shadow-md space-y-2 ${
                    msg.sender === 'user'
                      ? 'bg-[#005c4b] text-slate-100 rounded-tr-xs'
                      : 'bg-[#202c33] text-slate-200 rounded-tl-xs'
                  }`}
                >
                  {/* Photo attachment if present */}
                  {msg.imageUrl && (
                    <div className="rounded-xl overflow-hidden border border-slate-700 max-h-48 mb-2">
                      <img src={msg.imageUrl} alt="Attachment" className="w-full h-full object-cover" />
                    </div>
                  )}

                  {/* Message Text with basic markdown rendering */}
                  <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>

                  {/* Ticket Card preview inside WhatsApp bubble */}
                  {msg.ticketCard && (
                    <div className="bg-[#111b21] border border-emerald-500/40 rounded-xl p-2.5 text-[11px] space-y-1 text-slate-300">
                      <div className="flex items-center justify-between text-emerald-400 font-bold">
                        <span>Ticket: {msg.ticketCard.id}</span>
                        <span className="text-[10px] bg-emerald-500/20 px-1.5 py-0.2 rounded font-mono">
                          {msg.ticketCard.status}
                        </span>
                      </div>
                      <div className="text-white font-medium">{msg.ticketCard.asset}</div>
                      <div className="text-slate-400 text-[10px]">{msg.ticketCard.ward} • {msg.ticketCard.sla}</div>
                    </div>
                  )}

                  {/* Time + Ticks */}
                  <div className="flex items-center justify-end space-x-1 text-[10px] text-slate-400 pt-0.5">
                    <span>{msg.time}</span>
                    {msg.sender === 'user' && (
                      <CheckCheck className="w-3.5 h-3.5 text-sky-400" />
                    )}
                  </div>
                </div>

                {/* Quick Reply Action Buttons */}
                {msg.options && msg.options.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2 max-w-[85%] sm:max-w-md">
                    {msg.options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleOptionClick(opt)}
                        className="bg-[#202c33] hover:bg-[#2a3942] border border-emerald-500/30 text-emerald-300 hover:text-emerald-200 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center space-x-1.5 bg-[#202c33] text-slate-400 px-3 py-2 rounded-2xl rounded-tl-xs w-24 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce delay-100" />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce delay-200" />
                <span className="text-[10px] ml-1">typing</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* WhatsApp Chat Input Footer */}
          <div className="bg-[#202c33] p-2.5 sm:p-3 border-t border-slate-800 flex items-center space-x-2">
            <button
              onClick={() => handleOptionClick({ label: '📸 Upload Defect Photo', action: 'report_issue' })}
              className="p-2 rounded-full text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors cursor-pointer"
              title="Attach Photo"
            >
              <Camera className="w-5 h-5" />
            </button>

            <button
              onClick={() => handleOptionClick({ label: '📍 Share GPS Location', action: 'report_issue' })}
              className="p-2 rounded-full text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors cursor-pointer"
              title="Share Location"
            >
              <MapPin className="w-5 h-5" />
            </button>

            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type a message (e.g. Broken streetlight in Ward 3)..."
              className="flex-1 bg-[#2a3942] text-white text-xs px-4 py-2.5 rounded-xl border border-transparent focus:border-emerald-500 focus:outline-none placeholder:text-slate-400"
            />

            <button
              onClick={() => handleSendMessage()}
              disabled={!inputMessage.trim()}
              className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              title="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
