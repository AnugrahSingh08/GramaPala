export type ThemeId = 'emerald' | 'royal' | 'cobalt' | 'terracotta' | 'midnight';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  nameKn: string;
  tagline: string;
  taglineKn: string;
  swatchPrimary: string;
  swatchSecondary: string;
  isDark: boolean;
  classes: {
    appBg: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    topBannerBg: string;
    topBannerText: string;
    topBannerBorder: string;
    navBg: string;
    navBorder: string;
    logoBg: string;
    logoBadge: string;
    btnPrimary: string;
    btnPrimaryHover: string;
    btnPrimaryText: string;
    btnPrimaryShadow: string;
    cardBg: string;
    cardBorder: string;
    cardHoverBorder: string;
    heroBg: string;
    heroBorder: string;
    heroBadgeBg: string;
    heroBadgeText: string;
    heroBadgeBorder: string;
    accentBadgeBg: string;
    accentBadgeText: string;
    accentBadgeBorder: string;
    activeNavTab: string;
    inactiveNavTab: string;
    progressFill: string;
    footerBg: string;
    footerBorder: string;
  };
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  emerald: {
    id: 'emerald',
    name: 'GovTech Emerald',
    nameKn: 'ಹಸಿರು ಎಮರಾಲ್ಡ್',
    tagline: 'Clean, sustainable, high-trust rural governance',
    taglineKn: 'ಸ್ವಚ್ಛ ಮತ್ತು ಸುಸ್ಥಿರ ಗ್ರಾಮೀಣ ಆಡಳಿತ',
    swatchPrimary: '#059669',
    swatchSecondary: '#0f172a',
    isDark: false,
    classes: {
      appBg: 'bg-slate-50/70',
      textPrimary: 'text-slate-900',
      textSecondary: 'text-slate-600',
      textMuted: 'text-slate-400',
      topBannerBg: 'bg-slate-900',
      topBannerText: 'text-slate-200',
      topBannerBorder: 'border-slate-800',
      navBg: 'bg-white/95 backdrop-blur-md',
      navBorder: 'border-slate-200/90',
      logoBg: 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-emerald-900/10',
      logoBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      btnPrimary: 'bg-emerald-600',
      btnPrimaryHover: 'hover:bg-emerald-700',
      btnPrimaryText: 'text-white',
      btnPrimaryShadow: 'shadow-emerald-700/20',
      cardBg: 'bg-white',
      cardBorder: 'border-slate-200/90',
      cardHoverBorder: 'hover:border-emerald-300',
      heroBg: 'bg-white',
      heroBorder: 'border-slate-200/80',
      heroBadgeBg: 'bg-emerald-50',
      heroBadgeText: 'text-emerald-800',
      heroBadgeBorder: 'border-emerald-200',
      accentBadgeBg: 'bg-emerald-50',
      accentBadgeText: 'text-emerald-800',
      accentBadgeBorder: 'border-emerald-200',
      activeNavTab: 'bg-white text-slate-900 shadow-xs border border-slate-200/90',
      inactiveNavTab: 'text-slate-600 hover:text-slate-900 hover:bg-white/60',
      progressFill: 'bg-emerald-600',
      footerBg: 'bg-white',
      footerBorder: 'border-slate-200',
    },
  },
  royal: {
    id: 'royal',
    name: 'Karnataka Royal Navy & Gold',
    nameKn: 'ರಾಜಗಾಂಭೀರ್ಯ (ನೀಲಿ & ಚಿನ್ನ)',
    tagline: 'Mysore palace prestige, official state pride & authority',
    taglineKn: 'ಮೈಸೂರು ಅರಮನೆಯ ಗೌರವ, ರಾಜ್ಯ ಹೆಮ್ಮೆ & ಅಧಿಕೃತತೆ',
    swatchPrimary: '#1e3a8a',
    swatchSecondary: '#d97706',
    isDark: false,
    classes: {
      appBg: 'bg-amber-50/25',
      textPrimary: 'text-slate-950',
      textSecondary: 'text-slate-700',
      textMuted: 'text-slate-400',
      topBannerBg: 'bg-gradient-to-r from-blue-950 via-indigo-950 to-amber-950',
      topBannerText: 'text-amber-100',
      topBannerBorder: 'border-amber-500/30',
      navBg: 'bg-white/95 backdrop-blur-md',
      navBorder: 'border-amber-200/60',
      logoBg: 'bg-gradient-to-br from-indigo-900 via-blue-900 to-amber-600 text-white shadow-indigo-950/20',
      logoBadge: 'bg-amber-100 text-amber-900 border-amber-300 font-bold',
      btnPrimary: 'bg-gradient-to-r from-indigo-900 to-blue-800',
      btnPrimaryHover: 'hover:from-indigo-950 hover:to-blue-900',
      btnPrimaryText: 'text-amber-100',
      btnPrimaryShadow: 'shadow-indigo-900/25',
      cardBg: 'bg-white',
      cardBorder: 'border-amber-200/60',
      cardHoverBorder: 'hover:border-amber-400',
      heroBg: 'bg-gradient-to-br from-white via-amber-50/20 to-blue-50/15',
      heroBorder: 'border-amber-200/70',
      heroBadgeBg: 'bg-amber-100',
      heroBadgeText: 'text-amber-900 font-bold',
      heroBadgeBorder: 'border-amber-300',
      accentBadgeBg: 'bg-amber-100/80',
      accentBadgeText: 'text-amber-950',
      accentBadgeBorder: 'border-amber-300',
      activeNavTab: 'bg-white text-indigo-950 shadow-xs border border-amber-300/80 font-bold',
      inactiveNavTab: 'text-slate-600 hover:text-indigo-950 hover:bg-amber-50/40',
      progressFill: 'bg-gradient-to-r from-indigo-800 to-amber-600',
      footerBg: 'bg-white',
      footerBorder: 'border-amber-200/60',
    },
  },
  cobalt: {
    id: 'cobalt',
    name: 'Executive Cobalt Blue',
    nameKn: 'ಎಕ್ಸಿಕ್ಯುಟಿವ್ ಕೋಬಾಲ್ಟ್',
    tagline: 'Modern, high-precision GovTech & public digital infrastructure',
    taglineKn: 'ಆಧುನಿಕ, ನಿಖರವಾದ ಡಿಜಿಟಲ್ ಆಡಳಿತ ವೇದಿಕೆ',
    swatchPrimary: '#2563eb',
    swatchSecondary: '#0f172a',
    isDark: false,
    classes: {
      appBg: 'bg-slate-50',
      textPrimary: 'text-slate-900',
      textSecondary: 'text-slate-600',
      textMuted: 'text-slate-400',
      topBannerBg: 'bg-slate-900',
      topBannerText: 'text-slate-100',
      topBannerBorder: 'border-slate-800',
      navBg: 'bg-white/95 backdrop-blur-md',
      navBorder: 'border-blue-100',
      logoBg: 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-blue-600/20',
      logoBadge: 'bg-blue-50 text-blue-700 border-blue-200',
      btnPrimary: 'bg-blue-600',
      btnPrimaryHover: 'hover:bg-blue-700',
      btnPrimaryText: 'text-white',
      btnPrimaryShadow: 'shadow-blue-600/25',
      cardBg: 'bg-white',
      cardBorder: 'border-slate-200',
      cardHoverBorder: 'hover:border-blue-300',
      heroBg: 'bg-white',
      heroBorder: 'border-slate-200',
      heroBadgeBg: 'bg-blue-50',
      heroBadgeText: 'text-blue-800',
      heroBadgeBorder: 'border-blue-200',
      accentBadgeBg: 'bg-blue-50',
      accentBadgeText: 'text-blue-800',
      accentBadgeBorder: 'border-blue-200',
      activeNavTab: 'bg-white text-blue-900 shadow-xs border border-blue-200 font-bold',
      inactiveNavTab: 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60',
      progressFill: 'bg-blue-600',
      footerBg: 'bg-white',
      footerBorder: 'border-slate-200',
    },
  },
  terracotta: {
    id: 'terracotta',
    name: 'Warm Terracotta & Sand',
    nameKn: 'ಮಣ್ಣಿನ ಕಣ್ಮಣಿ (ಟೆರಾಕೋಟಾ)',
    tagline: 'Warm rural roots, village craft, and natural earth tones',
    taglineKn: 'ಗ್ರಾಮೀಣ ಬೇರುಗಳು, ಮಣ್ಣಿನ ಸೌಂದರ್ಯ & ಸಾಂಪ್ರದಾಯಿಕತೆ',
    swatchPrimary: '#c2410c',
    swatchSecondary: '#78350f',
    isDark: false,
    classes: {
      appBg: 'bg-stone-100/60',
      textPrimary: 'text-stone-900',
      textSecondary: 'text-stone-600',
      textMuted: 'text-stone-400',
      topBannerBg: 'bg-stone-900',
      topBannerText: 'text-orange-200',
      topBannerBorder: 'border-orange-950',
      navBg: 'bg-white/95 backdrop-blur-md',
      navBorder: 'border-stone-200',
      logoBg: 'bg-gradient-to-br from-orange-600 to-amber-700 text-white shadow-orange-900/15',
      logoBadge: 'bg-orange-50 text-orange-800 border-orange-200',
      btnPrimary: 'bg-orange-700',
      btnPrimaryHover: 'hover:bg-orange-800',
      btnPrimaryText: 'text-white',
      btnPrimaryShadow: 'shadow-orange-900/20',
      cardBg: 'bg-white',
      cardBorder: 'border-stone-200/90',
      cardHoverBorder: 'hover:border-orange-300',
      heroBg: 'bg-white',
      heroBorder: 'border-stone-200',
      heroBadgeBg: 'bg-orange-50',
      heroBadgeText: 'text-orange-900 font-semibold',
      heroBadgeBorder: 'border-orange-200',
      accentBadgeBg: 'bg-orange-50',
      accentBadgeText: 'text-orange-900',
      accentBadgeBorder: 'border-orange-200',
      activeNavTab: 'bg-white text-stone-900 shadow-xs border border-stone-300 font-bold',
      inactiveNavTab: 'text-stone-600 hover:text-stone-900 hover:bg-stone-100',
      progressFill: 'bg-orange-700',
      footerBg: 'bg-white',
      footerBorder: 'border-stone-200',
    },
  },
  midnight: {
    id: 'midnight',
    name: 'Midnight Command (Dark)',
    nameKn: 'ಮಿಡ್‌ನೈಟ್ ಡಾರ್ಕ್ ಮೋಡ್',
    tagline: 'High-contrast executive night mode with radiant green accents',
    taglineKn: 'ರಾತ್ರಿ ವೀಕ್ಷಣೆಗೆ ಅನುಕೂಲಕರ ಕತ್ತಲೆ ಮೋಡ್',
    swatchPrimary: '#10b981',
    swatchSecondary: '#020617',
    isDark: true,
    classes: {
      appBg: 'bg-slate-950',
      textPrimary: 'text-slate-100',
      textSecondary: 'text-slate-300',
      textMuted: 'text-slate-500',
      topBannerBg: 'bg-black',
      topBannerText: 'text-slate-300',
      topBannerBorder: 'border-slate-800',
      navBg: 'bg-slate-900/95 backdrop-blur-md',
      navBorder: 'border-slate-800',
      logoBg: 'bg-gradient-to-br from-emerald-500 to-teal-600 text-slate-950 font-black shadow-emerald-500/20',
      logoBadge: 'bg-emerald-950/80 text-emerald-400 border-emerald-800',
      btnPrimary: 'bg-emerald-500',
      btnPrimaryHover: 'hover:bg-emerald-400',
      btnPrimaryText: 'text-slate-950 font-extrabold',
      btnPrimaryShadow: 'shadow-emerald-500/20',
      cardBg: 'bg-slate-900',
      cardBorder: 'border-slate-800',
      cardHoverBorder: 'hover:border-emerald-500/50',
      heroBg: 'bg-slate-900',
      heroBorder: 'border-slate-800',
      heroBadgeBg: 'bg-emerald-950/60',
      heroBadgeText: 'text-emerald-400',
      heroBadgeBorder: 'border-emerald-800',
      accentBadgeBg: 'bg-slate-800',
      accentBadgeText: 'text-emerald-400',
      accentBadgeBorder: 'border-slate-700',
      activeNavTab: 'bg-slate-800 text-emerald-400 shadow-xs border border-emerald-500/40 font-bold',
      inactiveNavTab: 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50',
      progressFill: 'bg-emerald-500',
      footerBg: 'bg-slate-950',
      footerBorder: 'border-slate-800',
    },
  },
};
