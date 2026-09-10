import React from 'react';
import { MessageSquare, Sparkles } from 'lucide-react';
import { WHATSAPP_BOT_NUMBER } from '../utils/notificationSystem';

interface WhatsAppFloatingButtonProps {
  onClick: () => void;
  lang?: 'en' | 'kn';
}

export const WhatsAppFloatingButton: React.FC<WhatsAppFloatingButtonProps> = ({
  onClick,
  lang = 'en',
}) => {
  return (
    <div className="fixed bottom-5 right-5 z-40 flex items-center space-x-2 group">
      {/* Tooltip badge */}
      <div className="hidden sm:flex items-center space-x-1.5 bg-slate-950/90 text-white px-3 py-1.5 rounded-full border border-emerald-500/50 shadow-xl backdrop-blur-xs text-xs font-bold translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>{lang === 'kn' ? 'ವಾಟ್ಸಾಪ್ ಬಾಟ್' : 'WhatsApp Bot'}:</span>
        <span className="font-mono text-emerald-300">{WHATSAPP_BOT_NUMBER}</span>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={onClick}
        aria-label="Open GramaPala WhatsApp Bot"
        className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-2xl shadow-emerald-900/50 border-2 border-emerald-300 hover:scale-105 active:scale-95 transition-all cursor-pointer relative"
      >
        <MessageSquare className="w-7 h-7" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border border-white text-[8px] font-black items-center justify-center text-white">
            ✓
          </span>
        </span>
      </button>
    </div>
  );
};
