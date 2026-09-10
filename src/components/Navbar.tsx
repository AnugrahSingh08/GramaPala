import React, { useState } from 'react';
import { ActiveRole, LanguageMode, UserSession } from '../types';
import { ThemeConfig } from '../types/theme';
import { PWAInstallButton } from './PWAInstallButton';
import { WHATSAPP_BOT_NUMBER } from '../utils/notificationSystem';
import { 
  Building2, 
  User, 
  Wrench, 
  FileText, 
  BarChart3, 
  Languages, 
  Camera, 
  MapPin, 
  Globe2, 
  Compass, 
  ChevronDown, 
  Layers, 
  LogOut, 
  ShieldCheck, 
  Sparkles,
  Trophy,
  Bell,
  MessageSquare
} from 'lucide-react';

interface NavbarProps {
  activeRole: ActiveRole;
  onRoleChange: (role: ActiveRole) => void;
  lang: LanguageMode;
  onToggleLang: () => void;
  pendingVerificationsCount: number;
  unassignedComplaintsCount: number;
  assignedTasksCount: number;
  onOpenReportModal: () => void;
  theme: ThemeConfig;
  userSession: UserSession | null;
  onSwitchPortal: () => void;
  onOpenWhatsAppBot?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeRole,
  onRoleChange,
  lang,
  onToggleLang,
  pendingVerificationsCount,
  unassignedComplaintsCount,
  assignedTasksCount,
  onOpenReportModal,
  theme,
  userSession,
  onSwitchPortal,
  onOpenWhatsAppBot,
}) => {
  const [isHierarchyMenuOpen, setIsHierarchyMenuOpen] = useState(false);

  const isGovernanceRole = ['panchayat', 'taluk', 'district', 'state'].includes(activeRole);
  const userCategory = userSession?.category || 'citizen';

  return (
    <header className={`sticky top-0 z-50 ${theme.classes.navBg} border-b ${theme.classes.navBorder} shadow-xs transition-colors duration-300`}>
      {/* Top Karnataka GovTech Banner */}
      <div className={`${theme.classes.topBannerBg} border-b ${theme.classes.topBannerBorder} ${theme.classes.topBannerText} text-xs px-3 sm:px-6 py-1.5 flex items-center justify-between font-medium transition-colors duration-300`}>
        <div className="flex items-center space-x-2 truncate">
          <span className="inline-block w-2 h-2 rounded-full bg-amber-400 shrink-0"></span>
          <span className="font-semibold tracking-wide truncate">
            {lang === 'kn'
              ? 'ಕರ್ನಾಟಕ ಸರ್ಕಾರ • ಗ್ರಾಮೀಣಾಭಿವೃದ್ಧಿ ಮತ್ತು ಪಂಚಾಯತ್ ರಾಜ್ ಇಲಾಖೆ'
              : 'Government of Karnataka • Dept. of Rural Development & Panchayat Raj'}
          </span>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          {/* Active User Chip */}
          {userSession && (
            <div className="hidden sm:flex items-center space-x-1.5 bg-black/20 px-2.5 py-0.5 rounded-lg border border-white/10 text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span className="text-amber-200 font-bold">
                {lang === 'kn' && userSession.nameKn ? userSession.nameKn : userSession.name}
              </span>
              <span className="text-white/60">({userSession.badge})</span>
            </div>
          )}

          {/* Switch Portal / Logout Button */}
          <button
            onClick={onSwitchPortal}
            className="flex items-center space-x-1 hover:opacity-90 transition-colors bg-white/10 hover:bg-white/20 px-2 sm:px-2.5 py-0.8 rounded-lg text-xs font-bold cursor-pointer border border-white/20 text-white"
            title="Switch Login Category / Logout"
          >
            <LogOut className="w-3 h-3 text-amber-300" />
            <span>{lang === 'kn' ? 'ಲಾಗಿನ್ ಬದಲಾಯಿಸಿ' : 'Switch Portal'}</span>
          </button>

          {/* Language Switcher */}
          <button
            onClick={onToggleLang}
            className="flex items-center space-x-1 hover:opacity-90 transition-colors bg-white/10 hover:bg-white/15 px-2.5 py-0.8 rounded-lg text-xs font-semibold cursor-pointer border border-white/20 text-white"
            title="Switch Language"
          >
            <Languages className="w-3 h-3 text-amber-300" />
            <span>{lang === 'kn' ? 'English' : 'ಕನ್ನಡ'}</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-2.5 shrink-0">
            <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl ${theme.classes.logoBg} flex items-center justify-center font-black text-white shadow-sm transition-all duration-300`}>
              <Building2 className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className={`text-base sm:text-lg font-black tracking-tight ${theme.classes.textPrimary}`}>
                  {lang === 'kn' ? 'ಗ್ರಾಮಪಾಲ' : 'GramaPala'}
                </span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-bold uppercase ${
                  userCategory === 'citizen' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                  userCategory === 'worker' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                  'bg-purple-100 text-purple-900 border border-purple-300'
                }`}>
                  {userCategory === 'citizen' ? (lang === 'kn' ? 'ನಾಗರಿಕ ಪೋರ್ಟಲ್' : 'Citizen') :
                   userCategory === 'worker' ? (lang === 'kn' ? 'ಕ್ಷೇತ್ರ ಕರ್ಮಿಕ' : 'Field Ops') :
                   (lang === 'kn' ? 'ಆಡಳಿತ ಶ್ರೇಣಿ' : 'Governance')}
                </span>
              </div>
              <p className={`text-[10px] ${theme.classes.textSecondary} font-medium hidden xl:block leading-tight`}>
                {userSession ? `${userSession.designation} • ${userSession.location}` : (lang === 'kn' ? 'ಸಾರ್ವಜನಿಕ ಆಸ್ತಿ ನಿರ್ವಹಣೆ' : 'Public Asset Grievance & Verification')}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Scoped by User Category */}
          <nav 
            className={`hidden md:flex items-center gap-1 ${
              theme.isDark ? 'bg-slate-800/90 border-slate-700' : 'bg-slate-100/90 border-slate-200/90'
            } p-1 rounded-xl border shadow-2xs shrink-0`}
            aria-label="Dashboard Role Navigation"
          >
            {/* 1. CITIZEN PORTAL TABS */}
            {userCategory === 'citizen' && (
              <>
                <button
                  id="nav-role-citizen"
                  onClick={() => onRoleChange('citizen')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all relative cursor-pointer ${
                    activeRole === 'citizen'
                      ? theme.classes.activeNavTab
                      : theme.classes.inactiveNavTab
                  }`}
                >
                  <User className="w-3.5 h-3.5 shrink-0" style={{ color: theme.swatchPrimary }} />
                  <span className="whitespace-nowrap">{lang === 'kn' ? 'ನನ್ನ ದೂರುಗಳು & ಪರಿಶೀಲನೆ' : 'Citizen Grievances & Verification'}</span>
                  {pendingVerificationsCount > 0 && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" title="Pending Verification" />
                  )}
                </button>

                <button
                  id="nav-role-leaderboard-citizen"
                  onClick={() => onRoleChange('leaderboard')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all relative cursor-pointer ${
                    activeRole === 'leaderboard'
                      ? theme.classes.activeNavTab
                      : theme.classes.inactiveNavTab
                  }`}
                >
                  <Trophy className="w-3.5 h-3.5 shrink-0 text-amber-500" />
                  <span className="whitespace-nowrap">{lang === 'kn' ? 'ಲೀಡರ್‌ಬೋರ್ಡ್' : 'Leaderboard'}</span>
                </button>

                <button
                  id="nav-role-live-map"
                  onClick={() => onRoleChange('live_map')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all relative cursor-pointer ${
                    activeRole === 'live_map'
                      ? theme.classes.activeNavTab
                      : theme.classes.inactiveNavTab
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                  <span className="whitespace-nowrap">{lang === 'kn' ? 'ಗ್ರಾಮಪಾಲ ಲೈವ್ ಮ್ಯಾಪ್' : 'Village Live Civic Map'}</span>
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shrink-0" />
                </button>
              </>
            )}

            {/* 2. GOVERNANCE PORTAL TABS (PDO, Taluk, District, State, Passports, Analytics, Leaderboard, Alerts) */}
            {userCategory === 'governance' && (
              <>
                {/* Governance Hierarchy Dropdown */}
                <div className="relative z-50">
                  <button
                    onClick={() => setIsHierarchyMenuOpen(!isHierarchyMenuOpen)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isGovernanceRole
                        ? theme.classes.activeNavTab
                        : theme.classes.inactiveNavTab
                    }`}
                    title="Select Administrative Governance Tier"
                  >
                    <Layers className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                    <span className="whitespace-nowrap">
                      {activeRole === 'panchayat' && (lang === 'kn' ? 'ಗ್ರಾಮ ಪಂಚಾಯತ್ (PDO)' : 'Gram Panchayat (PDO)')}
                      {activeRole === 'taluk' && (lang === 'kn' ? 'ತಾಲೂಕು ಪಂಚಾಯತ್ (EO)' : 'Taluk Panchayat (EO)')}
                      {activeRole === 'district' && (lang === 'kn' ? 'ಜಿಲ್ಲಾ ಪಂಚಾಯತ್ (CEO)' : 'District (ZP CEO)')}
                      {activeRole === 'state' && (lang === 'kn' ? 'ರಾಜ್ಯ ಸರ್ಕಾರ (Apex)' : 'State RDPR Apex')}
                      {!isGovernanceRole && (lang === 'kn' ? 'ಆಡಳಿತ ಶ್ರೇಣಿ' : 'Governance ▾')}
                    </span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                    {unassignedComplaintsCount > 0 && (
                      <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.2 rounded-full font-extrabold leading-none">
                        {unassignedComplaintsCount}
                      </span>
                    )}
                  </button>

                  {/* Backdrop overlay to close dropdown on click outside */}
                  {isHierarchyMenuOpen && (
                    <div 
                      className="fixed inset-0 z-40 bg-black/5" 
                      onClick={() => setIsHierarchyMenuOpen(false)} 
                    />
                  )}

                  {/* Hierarchy Dropdown Menu */}
                  {isHierarchyMenuOpen && (
                    <div 
                      className="absolute left-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-100 ring-1 ring-black/10"
                    >
                      <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2.5 py-1.5">
                        {lang === 'kn' ? 'ಆಡಳಿತ ಶ್ರೇಣಿ (Governance Tiers)' : 'Select Administrative Level'}
                      </div>

                      {/* 1. State Level */}
                      <button
                        onClick={() => {
                          onRoleChange('state');
                          setIsHierarchyMenuOpen(false);
                        }}
                        className={`w-full text-left flex items-start space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          activeRole === 'state' ? 'bg-purple-50 text-purple-900 ring-1 ring-purple-200' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <Globe2 className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
                        <div>
                          <div className="font-bold">{lang === 'kn' ? 'ರಾಜ್ಯ ಸರ್ಕಾರ (Apex State)' : 'State Government (Apex)'}</div>
                          <div className="text-[10px] text-slate-400 font-normal">31 Districts & 15th FC Grants</div>
                        </div>
                      </button>

                      {/* 2. District Level */}
                      <button
                        onClick={() => {
                          onRoleChange('district');
                          setIsHierarchyMenuOpen(false);
                        }}
                        className={`w-full text-left flex items-start space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          activeRole === 'district' ? 'bg-indigo-50 text-indigo-900 ring-1 ring-indigo-200' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <Compass className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                        <div>
                          <div className="font-bold">{lang === 'kn' ? 'ಜಿಲ್ಲಾ ಪಂಚಾಯತ್ (Zilla Panchayat)' : 'District (Zilla Panchayat)'}</div>
                          <div className="text-[10px] text-slate-400 font-normal">All Taluks Consolidation & Priority</div>
                        </div>
                      </button>

                      {/* 3. Taluk Level */}
                      <button
                        onClick={() => {
                          onRoleChange('taluk');
                          setIsHierarchyMenuOpen(false);
                        }}
                        className={`w-full text-left flex items-start space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          activeRole === 'taluk' ? 'bg-amber-50 text-amber-900 ring-1 ring-amber-200' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <Building2 className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                        <div>
                          <div className="font-bold">{lang === 'kn' ? 'ತಾಲೂಕು ಪಂಚಾಯತ್ (Taluk Level)' : 'Taluk Panchayat (EO Level)'}</div>
                          <div className="text-[10px] text-slate-400 font-normal">Inter-Panchayat Benchmarking</div>
                        </div>
                      </button>

                      {/* 4. Gram Panchayat Level */}
                      <button
                        onClick={() => {
                          onRoleChange('panchayat');
                          setIsHierarchyMenuOpen(false);
                        }}
                        className={`w-full text-left flex items-start space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          activeRole === 'panchayat' ? 'bg-emerald-50 text-emerald-900 ring-1 ring-emerald-200' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <Building2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                        <div>
                          <div className="font-bold">{lang === 'kn' ? 'ಗ್ರಾಮ ಪಂಚಾಯತ್ (PDO Level)' : 'Gram Panchayat (PDO Level)'}</div>
                          <div className="text-[10px] text-slate-400 font-normal">Belavadi GP Asset Registry & Dispatch</div>
                        </div>
                      </button>
                    </div>
                  )}
                </div>

                {/* Performance Leaderboard */}
                <button
                  id="nav-role-leaderboard"
                  onClick={() => onRoleChange('leaderboard')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all relative cursor-pointer ${
                    activeRole === 'leaderboard'
                      ? theme.classes.activeNavTab
                      : theme.classes.inactiveNavTab
                  }`}
                >
                  <Trophy className="w-3.5 h-3.5 shrink-0 text-amber-500" />
                  <span className="whitespace-nowrap">{lang === 'kn' ? 'ಲೀಡರ್‌ಬೋರ್ಡ್' : 'Leaderboard'}</span>
                </button>

                {/* Automated Alerts */}
                <button
                  id="nav-role-alerts"
                  onClick={() => onRoleChange('alerts')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all relative cursor-pointer ${
                    activeRole === 'alerts'
                      ? theme.classes.activeNavTab
                      : theme.classes.inactiveNavTab
                  }`}
                >
                  <Bell className="w-3.5 h-3.5 shrink-0 text-rose-500" />
                  <span className="whitespace-nowrap">{lang === 'kn' ? 'ಸ್ವಯಂಚಾಲಿತ ಎಚ್ಚರಿಕೆ' : 'Automated Alerts'}</span>
                </button>

                {/* Asset Passport */}
                <button
                  id="nav-role-passport"
                  onClick={() => onRoleChange('asset_passport')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all relative cursor-pointer ${
                    activeRole === 'asset_passport'
                      ? theme.classes.activeNavTab
                      : theme.classes.inactiveNavTab
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 shrink-0 text-slate-500" />
                  <span className="whitespace-nowrap">{lang === 'kn' ? 'ಆಸ್ತಿ ಪಾಸ್‌ಪೋರ್ಟ್' : 'Asset Passports'}</span>
                </button>

                {/* GovTech Analytics */}
                <button
                  id="nav-role-analytics"
                  onClick={() => onRoleChange('analytics')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all relative cursor-pointer ${
                    activeRole === 'analytics'
                      ? theme.classes.activeNavTab
                      : theme.classes.inactiveNavTab
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5 shrink-0 text-slate-500" />
                  <span className="whitespace-nowrap">{lang === 'kn' ? 'ವಿಶ್ಲೇಷಣೆ' : 'Analytics'}</span>
                </button>

                {/* Live Map */}
                <button
                  id="nav-role-live-map"
                  onClick={() => onRoleChange('live_map')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all relative cursor-pointer ${
                    activeRole === 'live_map'
                      ? theme.classes.activeNavTab
                      : theme.classes.inactiveNavTab
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                  <span className="whitespace-nowrap">{lang === 'kn' ? 'ಮ್ಯಾಪ್' : 'GIS Map'}</span>
                </button>
              </>
            )}

            {/* 3. FIELD WORKER PORTAL TABS */}
            {userCategory === 'worker' && (
              <>
                <button
                  id="nav-role-worker"
                  onClick={() => onRoleChange('worker')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all relative cursor-pointer ${
                    activeRole === 'worker'
                      ? theme.classes.activeNavTab
                      : theme.classes.inactiveNavTab
                  }`}
                >
                  <Wrench className="w-3.5 h-3.5 shrink-0" style={{ color: theme.swatchPrimary }} />
                  <span className="whitespace-nowrap">{lang === 'kn' ? 'ನಿಯೋಜಿತ ದುರಸ್ತಿ ಕಾರ್ಯಗಳು' : 'My Assigned Work Orders'}</span>
                  {assignedTasksCount > 0 && (
                    <span className="bg-emerald-600 text-white text-[9px] px-1.5 py-0.2 rounded-full font-extrabold leading-none">
                      {assignedTasksCount}
                    </span>
                  )}
                </button>

                <button
                  id="nav-role-leaderboard-worker"
                  onClick={() => onRoleChange('leaderboard')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all relative cursor-pointer ${
                    activeRole === 'leaderboard'
                      ? theme.classes.activeNavTab
                      : theme.classes.inactiveNavTab
                  }`}
                >
                  <Trophy className="w-3.5 h-3.5 shrink-0 text-amber-500" />
                  <span className="whitespace-nowrap">{lang === 'kn' ? 'ಸಾಧಕರ ಪಟ್ಟಿ' : 'Leaderboard'}</span>
                </button>

                <button
                  id="nav-role-live-map"
                  onClick={() => onRoleChange('live_map')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all relative cursor-pointer ${
                    activeRole === 'live_map'
                      ? theme.classes.activeNavTab
                      : theme.classes.inactiveNavTab
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                  <span className="whitespace-nowrap">{lang === 'kn' ? 'ಕ್ಷೇತ್ರ ಮ್ಯಾಪ್ & ಮಾರ್ಗ' : 'Field Route & Map'}</span>
                </button>
              </>
            )}
          </nav>

          {/* Quick Action / Report Button & WhatsApp Bot Launch & PWA Install */}
          <div className="flex items-center space-x-2 shrink-0">
            {onOpenWhatsAppBot && (
              <button
                onClick={onOpenWhatsAppBot}
                className="flex items-center space-x-1.5 bg-emerald-600/15 hover:bg-emerald-600/25 text-emerald-800 border border-emerald-500/40 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs"
                title={`Chat with GramaPala WhatsApp Bot (${WHATSAPP_BOT_NUMBER})`}
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden lg:inline font-mono">{WHATSAPP_BOT_NUMBER}</span>
                <span className="lg:hidden font-bold">WhatsApp</span>
              </button>
            )}

            <PWAInstallButton />
            <button
              onClick={onOpenReportModal}
              className={`flex items-center space-x-1.5 ${theme.classes.btnPrimary} ${theme.classes.btnPrimaryHover} ${theme.classes.btnPrimaryText} px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs ${theme.classes.btnPrimaryShadow} transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer`}
              title="Report Broken Asset"
            >
              <Camera className="w-3.5 h-3.5 opacity-90" />
              <span className="hidden sm:inline">{lang === 'kn' ? '+ ಹೊಸ ದೂರು' : '+ Report Asset'}</span>
              <span className="sm:hidden font-bold">{lang === 'kn' ? '+ ದೂರು' : '+ Report'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="md:hidden py-2 border-t border-slate-100 overflow-x-auto">
          <nav 
            className={`flex items-center gap-1 ${
              theme.isDark ? 'bg-slate-800/90 border-slate-700' : 'bg-slate-100/90 border-slate-200/90'
            } p-1 rounded-xl border shadow-2xs min-w-max`}
            aria-label="Mobile Role Navigation"
          >
            {userCategory === 'citizen' && (
              <>
                <button
                  onClick={() => onRoleChange('citizen')}
                  className={`flex items-center space-x-1 py-1.5 px-2.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    activeRole === 'citizen' ? theme.classes.activeNavTab : theme.classes.inactiveNavTab
                  }`}
                >
                  <User className="w-3 h-3" />
                  <span>{lang === 'kn' ? 'ನನ್ನ ದೂರುಗಳು' : 'Grievances'}</span>
                </button>
                <button
                  onClick={() => onRoleChange('leaderboard')}
                  className={`flex items-center space-x-1 py-1.5 px-2.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    activeRole === 'leaderboard' ? theme.classes.activeNavTab : theme.classes.inactiveNavTab
                  }`}
                >
                  <Trophy className="w-3 h-3 text-amber-500" />
                  <span>{lang === 'kn' ? 'ಲೀಡರ್‌ಬೋರ್ಡ್' : 'Leaderboard'}</span>
                </button>
                <button
                  onClick={() => onRoleChange('live_map')}
                  className={`flex items-center space-x-1 py-1.5 px-2.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    activeRole === 'live_map' ? theme.classes.activeNavTab : theme.classes.inactiveNavTab
                  }`}
                >
                  <MapPin className="w-3 h-3 text-emerald-600" />
                  <span>{lang === 'kn' ? 'ಮ್ಯಾಪ್' : 'Map'}</span>
                </button>
              </>
            )}

            {userCategory === 'governance' && (
              <>
                <button
                  onClick={() => onRoleChange('panchayat')}
                  className={`flex items-center space-x-1 py-1.5 px-2.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    activeRole === 'panchayat' ? theme.classes.activeNavTab : theme.classes.inactiveNavTab
                  }`}
                >
                  <Building2 className="w-3 h-3" />
                  <span>{lang === 'kn' ? 'ಗ್ರಾ.ಪಂ.' : 'GP (PDO)'}</span>
                </button>

                <button
                  onClick={() => onRoleChange('leaderboard')}
                  className={`flex items-center space-x-1 py-1.5 px-2.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    activeRole === 'leaderboard' ? theme.classes.activeNavTab : theme.classes.inactiveNavTab
                  }`}
                >
                  <Trophy className="w-3 h-3 text-amber-500" />
                  <span>{lang === 'kn' ? 'ಲೀಡರ್‌ಬೋರ್ಡ್' : 'Leaderboard'}</span>
                </button>

                <button
                  onClick={() => onRoleChange('alerts')}
                  className={`flex items-center space-x-1 py-1.5 px-2.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    activeRole === 'alerts' ? theme.classes.activeNavTab : theme.classes.inactiveNavTab
                  }`}
                >
                  <Bell className="w-3 h-3 text-rose-500" />
                  <span>{lang === 'kn' ? 'ಎಚ್ಚರಿಕೆ' : 'Alerts'}</span>
                </button>

                <button
                  onClick={() => onRoleChange('taluk')}
                  className={`flex items-center space-x-1 py-1.5 px-2.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    activeRole === 'taluk' ? theme.classes.activeNavTab : theme.classes.inactiveNavTab
                  }`}
                >
                  <Layers className="w-3 h-3 text-amber-600" />
                  <span>{lang === 'kn' ? 'ತಾಲೂಕು' : 'Taluk'}</span>
                </button>

                <button
                  onClick={() => onRoleChange('district')}
                  className={`flex items-center space-x-1 py-1.5 px-2.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    activeRole === 'district' ? theme.classes.activeNavTab : theme.classes.inactiveNavTab
                  }`}
                >
                  <Compass className="w-3 h-3 text-indigo-600" />
                  <span>{lang === 'kn' ? 'ಜಿಲ್ಲೆ' : 'District'}</span>
                </button>

                <button
                  onClick={() => onRoleChange('state')}
                  className={`flex items-center space-x-1 py-1.5 px-2.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    activeRole === 'state' ? theme.classes.activeNavTab : theme.classes.inactiveNavTab
                  }`}
                >
                  <Globe2 className="w-3 h-3 text-purple-600" />
                  <span>{lang === 'kn' ? 'ರಾಜ್ಯ' : 'State'}</span>
                </button>

                <button
                  onClick={() => onRoleChange('asset_passport')}
                  className={`flex items-center space-x-1 py-1.5 px-2.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    activeRole === 'asset_passport' ? theme.classes.activeNavTab : theme.classes.inactiveNavTab
                  }`}
                >
                  <FileText className="w-3 h-3 text-slate-500" />
                  <span>{lang === 'kn' ? 'ಪಾಸ್‌ಪೋರ್ಟ್' : 'Passport'}</span>
                </button>
              </>
            )}

            {userCategory === 'worker' && (
              <>
                <button
                  onClick={() => onRoleChange('worker')}
                  className={`flex items-center space-x-1 py-1.5 px-2.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    activeRole === 'worker' ? theme.classes.activeNavTab : theme.classes.inactiveNavTab
                  }`}
                >
                  <Wrench className="w-3 h-3" />
                  <span>{lang === 'kn' ? 'ದುರಸ್ತಿ ಕಾರ್ಯಗಳು' : 'Work Orders'}</span>
                </button>
                <button
                  onClick={() => onRoleChange('leaderboard')}
                  className={`flex items-center space-x-1 py-1.5 px-2.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    activeRole === 'leaderboard' ? theme.classes.activeNavTab : theme.classes.inactiveNavTab
                  }`}
                >
                  <Trophy className="w-3 h-3 text-amber-500" />
                  <span>{lang === 'kn' ? 'ಸಾಧಕರು' : 'Leaderboard'}</span>
                </button>
                <button
                  onClick={() => onRoleChange('live_map')}
                  className={`flex items-center space-x-1 py-1.5 px-2.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    activeRole === 'live_map' ? theme.classes.activeNavTab : theme.classes.inactiveNavTab
                  }`}
                >
                  <MapPin className="w-3 h-3 text-emerald-600" />
                  <span>{lang === 'kn' ? 'ಮ್ಯಾಪ್' : 'Map'}</span>
                </button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};
