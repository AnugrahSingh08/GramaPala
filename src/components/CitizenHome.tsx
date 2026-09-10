import React, { useState } from 'react';
import { Complaint, LanguageMode } from '../types';
import { ThemeConfig } from '../types/theme';
import { 
  Camera, 
  MapPin, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  Lightbulb, 
  Droplet, 
  Navigation, 
  Trash2, 
  Search,
  UserCheck,
  Clock,
  Sparkles,
  Zap,
  BellRing
} from 'lucide-react';

interface CitizenHomeProps {
  complaints: Complaint[];
  onOpenReportModal: () => void;
  onOpenVerifyModal: (complaint: Complaint) => void;
  onOpenLiveMap?: () => void;
  lang: LanguageMode;
  theme: ThemeConfig;
}

export const CitizenHome: React.FC<CitizenHomeProps> = ({
  complaints = [],
  onOpenReportModal,
  onOpenVerifyModal,
  onOpenLiveMap,
  lang,
  theme,
}) => {
  const [filter, setFilter] = useState<'all' | 'action_required' | 'active' | 'closed'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const safeComplaints = complaints || [];
  const pendingVerification = safeComplaints.filter((c) => c.status === 'Completed');
  const activeComplaints = safeComplaints.filter(
    (c) => c.status === 'Pending' || c.status === 'Assigned' || c.status === 'In Progress' || c.status === 'Reopened'
  );
  const closedComplaints = safeComplaints.filter((c) => c.status === 'Closed');

  const filteredComplaints = safeComplaints.filter((c) => {
    if (filter === 'action_required' && c.status !== 'Completed') return false;
    if (filter === 'active' && c.status === 'Closed') return false;
    if (filter === 'closed' && c.status !== 'Closed') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = c.assetName?.toLowerCase().includes(q);
      const matchLoc = c.location?.toLowerCase().includes(q);
      const matchId = c.id?.toLowerCase().includes(q);
      const matchCat = c.category?.toLowerCase().includes(q);
      if (!matchName && !matchLoc && !matchId && !matchCat) return false;
    }

    return true;
  });

  const categories = [
    {
      id: 'Streetlight',
      name: lang === 'kn' ? 'ಬೀದಿ ದೀಪಗಳು' : 'Streetlights',
      desc: lang === 'kn' ? 'ಬಲ್ಬ್, ಕಂಬ, ವೈರ್ ಸಮಸ್ಯೆ' : 'Pole, bulb & wiring issues',
      icon: Lightbulb,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
    },
    {
      id: 'Water Supply',
      name: lang === 'kn' ? 'ಕುಡಿಯುವ ನೀರು' : 'Water Supply',
      desc: lang === 'kn' ? 'ಪೈಪ್ ಸೋರಿಕೆ, ಪಂಪ್ ದೋಷ' : 'Pipeline leaks & pump repairs',
      icon: Droplet,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
    },
    {
      id: 'Rural Road',
      name: lang === 'kn' ? 'ಗ್ರಾಮೀಣ ರಸ್ತೆಗಳು' : 'Village Roads',
      desc: lang === 'kn' ? 'ಗುಂಡಿ, ಚರಂಡಿ ಮುಚ್ಚಿರುವುದು' : 'Potholes & drain blockage',
      icon: Navigation,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    },
    {
      id: 'Sanitation',
      name: lang === 'kn' ? 'ನೈರ್ಮಲ್ಯ & ಸ್ವಚ್ಛತೆ' : 'Sanitation',
      desc: lang === 'kn' ? 'ಸಾರ್ವಜನಿಕ ಶೌಚಾಲಯ, ತ್ಯಾಜ್ಯ' : 'Public toilet & waste clearance',
      icon: Trash2,
      color: 'text-purple-600 bg-purple-50 border-purple-200',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Friendly, Clean Hero Section */}
      <div className={`${theme.classes.heroBg} rounded-3xl border ${theme.classes.heroBorder} p-6 sm:p-8 shadow-xs relative overflow-hidden transition-colors duration-300`}>
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className={`inline-flex items-center space-x-2 ${theme.classes.heroBadgeBg} border ${theme.classes.heroBadgeBorder} ${theme.classes.heroBadgeText} px-3 py-1 rounded-full text-xs font-semibold`}>
            <span 
              className="w-2 h-2 rounded-full animate-pulse" 
              style={{ backgroundColor: theme.swatchPrimary }}
            />
            <span>
              {lang === 'kn'
                ? 'ಗ್ರಾಮೀಣ ನಾಗರಿಕ ಕುಂದುಕೊರತೆ ವೇದಿಕೆ'
                : 'Citizen Public Asset Grievance Redressal'}
            </span>
          </div>

          <h1 className={`text-2xl sm:text-3xl font-extrabold ${theme.classes.textPrimary} tracking-tight leading-tight`}>
            {lang === 'kn'
              ? 'ಗ್ರಾಮದ ಸಾರ್ವಜನಿಕ ಆಸ್ತಿ ಹಾನಿಯಾಗಿದೆಯೇ? ತಕ್ಷಣ ವರದಿ ಮಾಡಿ'
              : 'Report Damaged Public Infrastructure in Your Village'}
          </h1>

          <p className={`text-sm sm:text-base ${theme.classes.textSecondary} leading-relaxed font-normal max-w-2xl`}>
            {lang === 'kn'
              ? 'ಹಾಳಾದ ಬೀದಿ ದೀಪ, ಒಡೆದ ನೀರಿನ ಪೈಪ್ ಅಥವಾ ರಸ್ತೆ ಗುಂಡಿಗಳನ್ನು ಸುಲಭವಾಗಿ ವರದಿ ಮಾಡಿ. ಕರ್ಮಿಕರು ದುರಸ್ತಿ ಮಾಡಿದ ನಂತರ ನಿಮ್ಮ ಫೋಟೋ ಪರಿಶೀಲನೆಯ ನಂತರವೇ ದೂರು ಮುಕ್ತಾಯಗೊಳ್ಳುತ್ತದೆ.'
              : 'Snap a photo of broken streetlights, water pipeline leaks, or road hazards. Panchayat assigns technicians immediately, and the task is only closed after you verify the repair photo.'}
          </p>

          <div className="pt-2 flex flex-wrap gap-3 items-center">
            <button
              onClick={onOpenReportModal}
              className={`flex items-center space-x-2.5 ${theme.classes.btnPrimary} ${theme.classes.btnPrimaryHover} ${theme.classes.btnPrimaryText} px-5 py-3 rounded-2xl text-sm font-bold shadow-md ${theme.classes.btnPrimaryShadow} transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer`}
            >
              <Camera className="w-4 h-4 opacity-90" />
              <span>
                {lang === 'kn' ? 'ಹೊಸ ದೂರು ಸಲ್ಲಿಸಿ' : '+ Report Broken Asset'}
              </span>
            </button>

            {onOpenLiveMap && (
              <button
                onClick={onOpenLiveMap}
                className="flex items-center space-x-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-300 px-4 py-3 rounded-2xl text-sm font-bold transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-xs"
              >
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>
                  {lang === 'kn' ? 'ಗ್ರಾಮಪಾಲ ಲೈವ್ ಮ್ಯಾಪ್' : '🗺️ GramaPala Live Map'}
                </span>
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              </button>
            )}

            {pendingVerification.length > 0 && (
              <button
                onClick={() => onOpenVerifyModal(pendingVerification[0])}
                className="flex items-center space-x-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 px-4 py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer shadow-xs"
              >
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>
                  {lang === 'kn'
                    ? `${pendingVerification.length} ದುರಸ್ತಿ ಪರಿಶೀಲನೆ ಬಾಕಿ ಇದೆ`
                    : `${pendingVerification.length} Repair Awaiting Your Review`}
                </span>
                <ArrowRight className="w-4 h-4 text-amber-700" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Quick Category Action Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className={`text-sm font-bold ${theme.classes.textPrimary} uppercase tracking-wider`}>
            {lang === 'kn' ? 'ತ್ವರಿತ ವರದಿ ವಿಭಾಗಗಳು' : 'Quick Report Categories'}
          </h2>
          <span className={`text-xs ${theme.classes.textMuted}`}>
            {lang === 'kn' ? 'ಯಾವುದಾದರೂ ವಿಭಾಗವನ್ನು ಆರಿಸಿ' : 'Click to report an issue'}
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={onOpenReportModal}
                className={`${theme.classes.cardBg} ${theme.classes.cardHoverBorder} border ${theme.classes.cardBorder} rounded-2xl p-4 text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:scale-[1.015] active:scale-[0.98] group cursor-pointer flex flex-col justify-between`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${cat.color} group-hover:scale-105 transition-transform duration-200`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-xs ${theme.classes.textMuted} group-hover:translate-x-1 transition-transform duration-200`}>
                    →
                  </span>
                </div>
                <div>
                  <h3 className={`font-bold ${theme.classes.textPrimary} text-sm group-hover:text-amber-600 transition-colors`}>{cat.name}</h3>
                  <p className={`text-xs ${theme.classes.textMuted} mt-0.5 line-clamp-1`}>{cat.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Verification Notice Card (Only when repair is ready for citizen review) */}
      {pendingVerification.length > 0 && (
        <div className={`${theme.classes.cardBg} border ${theme.classes.cardBorder} p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs`}>
          <div className="flex items-start space-x-3.5">
            <div 
              className="w-10 h-10 rounded-xl text-white flex items-center justify-center shrink-0 shadow-xs"
              style={{ backgroundColor: theme.swatchPrimary }}
            >
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className={`text-sm font-bold ${theme.classes.textPrimary}`}>
                  {lang === 'kn'
                    ? 'ದುರಸ್ತಿ ಪೂರ್ಣಗೊಂಡಿದೆ: ನಿಮ್ಮ ಅನುಮೋದನೆ ಅಗತ್ಯವಿದೆ'
                    : 'Technician Finished Repair! Please Verify'}
                </h3>
                <span 
                  className="text-white text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: theme.swatchPrimary }}
                >
                  Step 4
                </span>
              </div>
              <p className={`text-xs ${theme.classes.textSecondary} mt-1 max-w-xl`}>
                {lang === 'kn'
                  ? `${pendingVerification[0].assetName} (${pendingVerification[0].location}) ದುರಸ್ತಿಯಾಗಿದೆ ಎಂದು ವರದಿಯಾಗಿದೆ. ಮೊದಲು/ನಂತರದ ಫೋಟೋಗಳನ್ನು ಹೋಲಿಸಿ ದೂರು ಮುಕ್ತಾಯಗೊಳಿಸಿ.`
                  : `Repair proof uploaded for ${pendingVerification[0].assetName} (${pendingVerification[0].location}). Inspect the Before & After photos to confirm the fix.`}
              </p>
            </div>
          </div>

          <button
            onClick={() => onOpenVerifyModal(pendingVerification[0])}
            className={`w-full sm:w-auto flex items-center justify-center space-x-2 ${theme.classes.btnPrimary} ${theme.classes.btnPrimaryHover} ${theme.classes.btnPrimaryText} px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer shrink-0`}
          >
            <span>{lang === 'kn' ? 'ಫೋಟೋ ಪರಿಶೀಲಿಸಿ' : 'Inspect & Verify Fix'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Ward Civic Services Live Pulse & Sakala SLA */}
      <div className={`${theme.classes.cardBg} border ${theme.classes.cardBorder} rounded-2xl p-4 sm:p-5 shadow-xs`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className={`text-xs sm:text-sm font-bold ${theme.classes.textPrimary}`}>
              {lang === 'kn' ? 'ಬೆಳವಾಡಿ ಗ್ರಾಮ - ದೈನಂದಿನ ನಾಗರಿಕ ಸೌಲಭ್ಯಗಳ ಸ್ಥಿತಿ' : 'Belavadi GP • Daily Public Civic Services Pulse'}
            </h3>
          </div>
          <span className="text-[11px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
            {lang === 'kn' ? 'ಸಕಾಲ ಕಾಯ್ದೆ ಅಡಿಯಲ್ಲಿ ಖಾತರಿ' : 'Karnataka Sakala 48h SLA'}
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className={`p-2.5 rounded-xl border ${theme.isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-blue-50/60 border-blue-100'} flex items-start space-x-2.5`}>
            <Droplet className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-slate-900 dark:text-white">{lang === 'kn' ? 'ಕುಡಿಯುವ ನೀರಿನ ಸರಬರಾಜು' : 'Water Supply Schedule'}</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{lang === 'kn' ? 'ಟ್ಯಾಂಕ್ ೩: ಇಂದು ಸಂಜೆ ೪:೩೦' : 'Tank 3: Today 04:30 PM'}</div>
            </div>
          </div>

          <div className={`p-2.5 rounded-xl border ${theme.isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-amber-50/60 border-amber-100'} flex items-start space-x-2.5`}>
            <Zap className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-slate-900 dark:text-white">{lang === 'kn' ? 'ಬೀದಿ ದೀಪ ಜಾಲ' : 'Streetlight Grid'}</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{lang === 'kn' ? '೯೪.೨% ಸಕ್ರಿಯ (೨ ದುರಸ್ತಿ)' : '94.2% Active (2 in repair)'}</div>
            </div>
          </div>

          <div className={`p-2.5 rounded-xl border ${theme.isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-emerald-50/60 border-emerald-100'} flex items-start space-x-2.5`}>
            <Clock className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-slate-900 dark:text-white">{lang === 'kn' ? 'ಸರಾಸರಿ ಪರಿಹಾರ ಸಮಯ' : 'Avg Resolution Time'}</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{lang === 'kn' ? '೧೮.೪ ಗಂಟೆಗಳು (SLA ಒಳಗೆ)' : '18.4 Hours (Within SLA)'}</div>
            </div>
          </div>

          <div className={`p-2.5 rounded-xl border ${theme.isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-purple-50/60 border-purple-100'} flex items-start space-x-2.5`}>
            <BellRing className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-slate-900 dark:text-white">{lang === 'kn' ? 'ಗ್ರಾಮ ಸಭೆ ಅಧಿಸೂಚನೆ' : 'Gram Sabha Notice'}</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{lang === 'kn' ? '೧೫ ನೇ ತಾರೀಕು, ೧೦:೩೦ AM' : '15th Sept, 10:30 AM at GP'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Complaints Tracking Section */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2">
          <div>
            <h2 className={`text-lg font-bold ${theme.classes.textPrimary}`}>
              {lang === 'kn' ? 'ಗ್ರಾಮದ ದೂರುಗಳ ಸ್ಥಿತಿ' : 'Village Grievance Status'}
            </h2>
            <p className={`text-xs ${theme.classes.textMuted}`}>
              {lang === 'kn'
                ? 'ಸಾರ್ವಜನಿಕ ಆಸ್ತಿ ದುರಸ್ತಿ ಪ್ರಕ್ರಿಯೆಯನ್ನು ನೇರವಾಗಿ ವೀಕ್ಷಿಸಿ'
                : 'Track the status of reported public issues in real time'}
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder={lang === 'kn' ? 'ಹುಡುಕಿ...' : 'Search grievances...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-8.5 pr-3 py-1.5 ${theme.classes.cardBg} border ${theme.classes.cardBorder} rounded-xl text-xs w-full sm:w-48 ${theme.classes.textPrimary} placeholder-slate-400 focus:outline-hidden focus:ring-1 transition-all`}
              />
            </div>

            {/* Filter Pills */}
            <div className={`flex items-center space-x-1 ${theme.isDark ? 'bg-slate-800' : 'bg-slate-100'} p-1 rounded-xl text-xs font-bold self-start sm:self-auto overflow-x-auto border ${theme.classes.cardBorder}`}>
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  filter === 'all'
                    ? `${theme.classes.activeNavTab}`
                    : `${theme.classes.textSecondary} hover:${theme.classes.textPrimary}`
                }`}
              >
                {lang === 'kn' ? 'ಎಲ್ಲವೂ' : 'All'} ({complaints.length})
              </button>
              <button
                onClick={() => setFilter('action_required')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  filter === 'action_required'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-amber-700 hover:bg-amber-100/50'
                }`}
              >
                {lang === 'kn' ? 'ಪರಿಶೀಲಿಸಿ' : 'Needs Review'} ({pendingVerification.length})
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  filter === 'active'
                    ? `${theme.classes.activeNavTab}`
                    : `${theme.classes.textSecondary} hover:${theme.classes.textPrimary}`
                }`}
              >
                {lang === 'kn' ? 'ಪ್ರಗತಿಯಲ್ಲಿದೆ' : 'In Progress'} ({activeComplaints.length})
              </button>
              <button
                onClick={() => setFilter('closed')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  filter === 'closed'
                    ? `${theme.classes.activeNavTab}`
                    : `${theme.classes.textSecondary} hover:${theme.classes.textPrimary}`
                }`}
              >
                {lang === 'kn' ? 'ಮುಕ್ತಾಯ' : 'Resolved'} ({closedComplaints.length})
              </button>
            </div>
          </div>
        </div>

        {/* Complaints Grid */}
        {filteredComplaints.length === 0 ? (
          <div className={`${theme.classes.cardBg} border ${theme.classes.cardBorder} rounded-2xl p-8 text-center space-y-2`}>
            <p className={`text-sm font-semibold ${theme.classes.textPrimary}`}>
              {lang === 'kn' ? 'ಯಾವುದೇ ದೂರುಗಳು ಕಂಡುಬಂದಿಲ್ಲ' : 'No grievances found'}
            </p>
            <p className={`text-xs ${theme.classes.textMuted}`}>
              {lang === 'kn'
                ? 'ಹೊಸ ದೂರು ದಾಖಲಿಸಲು ಮೇಲಿನ ಬಟನ್ ಬಳಸಿ.'
                : 'Try clearing your search or report a new village issue above.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredComplaints.map((item) => (
              <div
                key={item.id}
                className={`${theme.classes.cardBg} rounded-2xl border ${theme.classes.cardBorder} ${theme.classes.cardHoverBorder} shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-200 p-5 flex flex-col justify-between space-y-3.5`}
              >
                {/* Header: ID + Category + Status Pill */}
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs font-mono font-bold ${theme.classes.textMuted}`}>{item.id}</span>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${theme.isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'}`}>
                        {item.category}
                      </span>
                    </div>
                    <h3 className={`text-sm font-extrabold ${theme.classes.textPrimary} leading-snug`}>{item.assetName}</h3>
                  </div>

                  {/* Status Pill */}
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-xl tracking-wide shrink-0 ${
                      item.status === 'Completed'
                        ? 'bg-amber-50 text-amber-900 border border-amber-300 font-extrabold'
                        : item.status === 'Closed'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : item.status === 'Assigned'
                        ? 'bg-blue-50 text-blue-800 border border-blue-200'
                        : item.status === 'Reopened'
                        ? 'bg-rose-50 text-rose-800 border border-rose-200'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {item.status === 'Completed'
                      ? (lang === 'kn' ? 'ಪರಿಶೀಲನೆ ಬಾಕಿ' : 'Needs Citizen Review')
                      : item.status === 'Closed'
                      ? (lang === 'kn' ? 'ಪರಿಹರಿಸಲಾಗಿದೆ' : 'Resolved')
                      : item.status === 'Assigned'
                      ? (lang === 'kn' ? 'ಕರ್ಮಿಕರಿಗೆ ನಿಯೋಜಿತ' : 'Technician Assigned')
                      : item.status === 'Pending'
                      ? (lang === 'kn' ? 'ವರದಿಯಾಗಿದೆ' : 'Reported')
                      : item.status}
                  </span>
                </div>

                {/* Photo & Description snippet */}
                <div className="flex space-x-3.5 items-center">
                  <img
                    src={item.photoUrl}
                    alt={item.assetName}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className={`text-xs ${theme.classes.textSecondary} leading-relaxed line-clamp-2`}>
                    <p className={`font-normal ${theme.classes.textPrimary}`}>{item.description}</p>
                    <div className={`flex items-center space-x-2 mt-1.5 text-[11px] ${theme.classes.textMuted} font-medium`}>
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span className="truncate max-w-[140px]">{item.location}</span>
                      </span>
                      <span>•</span>
                      <span>{item.reportedAt}</span>
                    </div>
                  </div>
                </div>

                {/* 3-Step Clean Lifecycle Indicator */}
                <div className={`pt-2 border-t ${theme.isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                  <div className={`flex items-center justify-between text-[11px] font-semibold ${theme.classes.textMuted} mb-1.5`}>
                    <span className={item.status !== 'Pending' ? 'font-bold' : 'font-bold'}>
                      1. Reported
                    </span>
                    <span
                      className={
                        item.status === 'Assigned' || item.status === 'Completed' || item.status === 'Closed'
                          ? 'font-bold'
                          : ''
                      }
                      style={{ color: item.status !== 'Pending' ? theme.swatchPrimary : undefined }}
                    >
                      2. In Repair
                    </span>
                    <span 
                      className={item.status === 'Closed' ? 'font-bold' : ''}
                      style={{ color: item.status === 'Closed' ? theme.swatchPrimary : undefined }}
                    >
                      3. Verified & Closed
                    </span>
                  </div>
                  <div className={`w-full h-1.5 ${theme.isDark ? 'bg-slate-800' : 'bg-slate-100'} rounded-full overflow-hidden flex`}>
                    <div
                      className={`h-full ${theme.classes.progressFill} transition-all duration-500 rounded-full`}
                      style={{
                        width:
                          item.status === 'Pending'
                            ? '33%'
                            : item.status === 'Assigned'
                            ? '66%'
                            : item.status === 'Completed'
                            ? '85%'
                            : '100%',
                      }}
                    />
                  </div>
                </div>

                {/* Footer Action */}
                {item.status === 'Completed' ? (
                  <button
                    onClick={() => onOpenVerifyModal(item)}
                    className={`w-full flex items-center justify-center space-x-2 ${theme.classes.btnPrimary} ${theme.classes.btnPrimaryHover} ${theme.classes.btnPrimaryText} py-2 px-3.5 rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer`}
                  >
                    <ShieldCheck className="w-4 h-4 opacity-90" />
                    <span>
                      {lang === 'kn' ? 'ದುರಸ್ತಿ ಪರಿಶೀಲಿಸಿ & ಅನುಮೋದಿಸಿ' : 'Inspect Proof & Confirm Fix'}
                    </span>
                  </button>
                ) : item.status === 'Closed' ? (
                  <div className="flex items-center justify-between text-xs text-emerald-800 bg-emerald-50/70 px-3 py-1.5 rounded-xl font-semibold border border-emerald-100">
                    <span className="flex items-center space-x-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{lang === 'kn' ? 'ನಾಗರಿಕರು ಪರಿಶೀಲಿಸಿ ಮುಕ್ತಾಯಗೊಳಿಸಿದ್ದಾರೆ' : 'Citizen Verified & Closed'}</span>
                    </span>
                    <span className="text-[11px] text-emerald-700">
                      ✓ Fixed
                    </span>
                  </div>
                ) : (
                  <div className={`flex items-center justify-between text-[11px] ${theme.classes.textMuted} font-medium ${theme.isDark ? 'bg-slate-800/60 border-slate-800' : 'bg-slate-50 border-slate-100'} px-3 py-1.5 rounded-xl border`}>
                    <span className="flex items-center space-x-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        {item.assignedWorker?.name || (lang === 'kn' ? 'ಪಂಚಾಯತ್ ಪರಿಶೀಲನೆಯಲ್ಲಿದೆ' : 'Pending Panchayat Assignment')}
                      </span>
                    </span>
                    <span className="font-semibold" style={{ color: theme.swatchPrimary }}>{item.priority || 'Normal'} Priority</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
