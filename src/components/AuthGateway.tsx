import React, { useState } from 'react';
import { AuthCategory, ActiveRole, UserSession, LanguageMode } from '../types';
import { 
  User, 
  Building2, 
  Wrench, 
  ShieldCheck, 
  Languages, 
  ArrowRight, 
  Smartphone,
  CheckCircle2,
  PhoneCall,
  Bell,
  Clock,
  Sparkles,
  Info
} from 'lucide-react';

interface AuthGatewayProps {
  onLogin: (session: UserSession) => void;
  lang: LanguageMode;
  onToggleLang: () => void;
}

export const AuthGateway: React.FC<AuthGatewayProps> = ({
  onLogin,
  lang,
  onToggleLang,
}) => {
  const [category, setCategory] = useState<AuthCategory>('citizen');
  const [governanceTier, setGovernanceTier] = useState<'panchayat' | 'taluk' | 'district' | 'state'>('panchayat');

  // Input states
  const [username, setUsername] = useState('Sunitha Gowda');
  const [identifier, setIdentifier] = useState('9886012390');
  const [password, setPassword] = useState('citizen@123');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [showSmsBanner, setShowSmsBanner] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Auto-populate when category changes
  const handleCategoryChange = (newCat: AuthCategory) => {
    setCategory(newCat);
    setOtpSent(false);
    setOtp('');
    setShowSmsBanner(false);
    if (newCat === 'citizen') {
      setUsername('Sunitha Gowda');
      setIdentifier('9886012390');
      setPassword('citizen@123');
    } else if (newCat === 'governance') {
      setUsername('K. M. Ramesh');
      setIdentifier('PDO-MYS-BELAVADI-491');
      setPassword('karnataka@gov');
    } else {
      setUsername('Sri Suresh K.');
      setIdentifier('W-01 (Borewell Tech)');
      setPassword('worker@2026');
    }
  };

  const handleTierChange = (tier: 'panchayat' | 'taluk' | 'district' | 'state') => {
    setGovernanceTier(tier);
    if (tier === 'panchayat') {
      setUsername('K. M. Ramesh');
      setIdentifier('PDO-MYS-BELAVADI-491');
    } else if (tier === 'taluk') {
      setUsername('Dr. S. Patil');
      setIdentifier('EO-TALUK-MYS-102');
    } else if (tier === 'district') {
      setUsername('Smt. Kavitha IAS');
      setIdentifier('CEO-ZP-MYS-001');
    } else {
      setUsername('Dr. G. V. Rao IAS');
      setIdentifier('STATE-RDPR-SEC-01');
    }
  };

  const handleSendOtp = () => {
    setOtpSent(true);
    setOtp('7789');
    setShowSmsBanner(true);
    setTimeout(() => {
      setShowSmsBanner(false);
    }, 7000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (category === 'citizen') {
      onLogin({
        category: 'citizen',
        name: username || 'Sunitha Gowda',
        nameKn: 'ಸುನೀತಾ ಗೌಡ',
        designation: 'Citizen / Ward Resident',
        designationKn: 'ಗ್ರಾಮ ನಿವಾಸಿ',
        idOrPhone: identifier || '+91 98860 12390',
        location: 'Belavadi GP, Ward 3',
        locationKn: 'ಬೆಳವಾಡಿ ಗ್ರಾ.ಪಂ, ವಾರ್ಡ್ ೩',
        activeRole: 'citizen',
        avatarInitials: 'SG',
        badge: 'Verified Resident',
      });
    } else if (category === 'governance') {
      const designations = {
        panchayat: {
          title: 'Panchayat Development Officer (PDO)',
          titleKn: 'ಪಂಚಾಯತ್ ಅಭಿವೃದ್ಧಿ ಅಧಿಕಾರಿ (ಪಿ.ಡಿ.ಒ)',
          loc: 'Belavadi Gram Panchayat',
          badge: 'PDO Authorized',
          role: 'panchayat' as ActiveRole,
        },
        taluk: {
          title: 'Executive Officer (Taluk Panchayat)',
          titleKn: 'ಕಾರ್ಯನಿರ್ವಾಹಕ ಅಧಿಕಾರಿ (ತಾ.ಪಂ.)',
          loc: 'Mysuru Taluk Panchayat',
          badge: 'Taluk EO Level',
          role: 'taluk' as ActiveRole,
        },
        district: {
          title: 'Chief Executive Officer (Zilla Panchayat)',
          titleKn: 'ಮುಖ್ಯ ಕಾರ್ಯನಿರ್ವಾಹಕ ಅಧಿಕಾರಿ (ಜಿ.ಪಂ)',
          loc: 'Mysuru Zilla Panchayat',
          badge: 'District CEO Level',
          role: 'district' as ActiveRole,
        },
        state: {
          title: 'Principal Secretary, RDPR Apex',
          titleKn: 'ಪ್ರಧಾನ ಕಾರ್ಯದರ್ಶಿ, ಗ್ರಾಮೀಣಾಭಿವೃದ್ಧಿ',
          loc: 'Karnataka State Apex Secretariat',
          badge: 'State Apex Secretariat',
          role: 'state' as ActiveRole,
        },
      };

      const cur = designations[governanceTier];
      onLogin({
        category: 'governance',
        name: username || 'Officer',
        designation: cur.title,
        designationKn: cur.titleKn,
        idOrPhone: identifier,
        location: cur.loc,
        activeRole: cur.role,
        governanceTier: governanceTier,
        avatarInitials: username.slice(0, 2).toUpperCase(),
        badge: cur.badge,
      });
    } else {
      onLogin({
        category: 'worker',
        name: username || 'Sri Suresh K.',
        designation: 'Field Technician (Borewell & Electrical Lead)',
        designationKn: 'ಕ್ಷೇತ್ರ ತಂತ್ರಜ್ಞ',
        idOrPhone: identifier || 'W-01',
        location: 'Belavadi GP Field Ops Hub',
        activeRole: 'worker',
        avatarInitials: 'SK',
        badge: 'Certified Technician',
        workerTrade: 'Borewell & Electrical',
      });
    }
  };

  // 1-Click quick login
  const handleQuickLogin = (cat: AuthCategory, tier?: 'panchayat' | 'taluk' | 'district' | 'state') => {
    if (cat === 'citizen') {
      onLogin({
        category: 'citizen',
        name: 'Sunitha Gowda',
        nameKn: 'ಸುನೀತಾ ಗೌಡ',
        designation: 'Citizen / Ward Resident',
        designationKn: 'ಗ್ರಾಮ ನಿವಾಸಿ',
        idOrPhone: '+91 98860 12390',
        location: 'Belavadi GP, Ward 3',
        locationKn: 'ಬೆಳವಾಡಿ ಗ್ರಾ.ಪಂ, ವಾರ್ಡ್ ೩',
        activeRole: 'citizen',
        avatarInitials: 'SG',
        badge: 'Verified Resident',
      });
    } else if (cat === 'governance') {
      const selectedTier = tier || 'panchayat';
      if (selectedTier === 'panchayat') {
        onLogin({
          category: 'governance',
          name: 'K. M. Ramesh',
          nameKn: 'ಕೆ. ಎಂ. ರಮೇಶ್',
          designation: 'Panchayat Development Officer (PDO)',
          designationKn: 'ಪಂಚಾಯತ್ ಅಭಿವೃದ್ಧಿ ಅಧಿಕಾರಿ (ಪಿ.ಡಿ.ಒ)',
          idOrPhone: 'PDO-MYS-BELAVADI-491',
          location: 'Belavadi Gram Panchayat',
          activeRole: 'panchayat',
          governanceTier: 'panchayat',
          avatarInitials: 'KR',
          badge: 'PDO Authorized',
        });
      } else if (selectedTier === 'taluk') {
        onLogin({
          category: 'governance',
          name: 'Dr. S. Patil',
          nameKn: 'ಡಾ. ಎಸ್. ಪಾಟೀಲ್',
          designation: 'Executive Officer (Taluk Panchayat)',
          designationKn: 'ಕಾರ್ಯನಿರ್ವಾಹಕ ಅಧಿಕಾರಿ (ತಾ.ಪಂ.)',
          idOrPhone: 'EO-TALUK-MYS-102',
          location: 'Mysuru Taluk Panchayat',
          activeRole: 'taluk',
          governanceTier: 'taluk',
          avatarInitials: 'SP',
          badge: 'Taluk EO Level',
        });
      } else if (selectedTier === 'district') {
        onLogin({
          category: 'governance',
          name: 'Smt. Kavitha IAS',
          nameKn: 'ಶ್ರೀಮತಿ ಕವಿತಾ ಐ.ಎ.ಎಸ್.',
          designation: 'Chief Executive Officer (Zilla Panchayat)',
          designationKn: 'ಮುಖ್ಯ ಕಾರ್ಯನಿರ್ವಾಹಕ ಅಧಿಕಾರಿ (ಜಿ.ಪಂ)',
          idOrPhone: 'CEO-ZP-MYS-001',
          location: 'Mysuru Zilla Panchayat',
          activeRole: 'district',
          governanceTier: 'district',
          avatarInitials: 'KA',
          badge: 'District CEO Level',
        });
      } else {
        onLogin({
          category: 'governance',
          name: 'Dr. G. V. Rao IAS',
          nameKn: 'ಡಾ. ಜಿ. ವಿ. ರಾವ್ ಐ.ಎ.ಎಸ್.',
          designation: 'Principal Secretary, RDPR Apex',
          designationKn: 'ಪ್ರಧಾನ ಕಾರ್ಯದರ್ಶಿ, ಗ್ರಾಮೀಣಾಭಿವೃದ್ಧಿ',
          idOrPhone: 'STATE-RDPR-SEC-01',
          location: 'Karnataka State Apex Secretariat',
          activeRole: 'state',
          governanceTier: 'state',
          avatarInitials: 'GR',
          badge: 'State Apex Secretariat',
        });
      }
    } else {
      onLogin({
        category: 'worker',
        name: 'Sri Suresh K.',
        designation: 'Field Technician (Borewell & Electrical Lead)',
        designationKn: 'ಕ್ಷೇತ್ರ ತಂತ್ರಜ್ಞ',
        idOrPhone: 'W-01',
        location: 'Belavadi GP Field Ops Hub',
        activeRole: 'worker',
        avatarInitials: 'SK',
        badge: 'Certified Technician',
        workerTrade: 'Borewell & Electrical',
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-amber-500 selection:text-slate-900 font-sans relative overflow-x-hidden">
      {/* Real-time SMS Notification Toast Simulator */}
      {showSmsBanner && (
        <div className="fixed top-4 right-4 z-50 max-w-sm w-full bg-slate-900/95 border border-amber-500/40 rounded-2xl p-3.5 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Smartphone className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between text-[11px] font-bold text-amber-400">
                <span>KA-GOV-SMS (RDPR)</span>
                <span className="text-slate-400 font-mono text-[10px]">Just now</span>
              </div>
              <p className="text-xs text-slate-200 font-medium mt-0.5">
                Your GramaPala OTP is <strong className="text-amber-300 font-mono font-bold">7789</strong>. Valid for 10 minutes. Do not share.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Top Gov Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-4 sm:px-8 py-2.5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center font-black text-slate-950 shadow-sm">
            <Building2 className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-base tracking-tight text-white">
                {lang === 'kn' ? 'ಗ್ರಾಮಪಾಲ' : 'GramaPala'}
              </span>
              <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.2 rounded-md font-bold uppercase">
                GovTech v2.4
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">
              {lang === 'kn' ? 'ಕರ್ನಾಟಕ ಸರ್ಕಾರ • ಗ್ರಾಮೀಣಾಭಿವೃದ್ಧಿ ಮತ್ತು ಪಂಚಾಯತ್ ರಾಜ್ ಇಲಾಖೆ' : 'Govt. of Karnataka • Dept. of Rural Development & Panchayat Raj'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onToggleLang}
            className="flex items-center space-x-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
          >
            <Languages className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'kn' ? 'English' : 'ಕನ್ನಡ'}</span>
          </button>
        </div>
      </header>

      {/* Main Form Center Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-6">
        <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl backdrop-blur-xl">
          {/* Header text */}
          <div className="text-center mb-5">
            <div className="inline-flex items-center space-x-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-0.8 rounded-full text-[11px] font-bold mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{lang === 'kn' ? 'ಅಧಿಕೃತ ಸುರಕ್ಷಿತ ಪ್ರವೇಶ' : 'Secure Civic Access Gateway'}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {lang === 'kn' ? 'ಗ್ರಾಮಪಾಲ ಲಾಗಿನ್' : 'Sign In to GramaPala'}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              {lang === 'kn' ? 'ನಿಮ್ಮ ವಿಭಾಗ ಆಯ್ಕೆಮಾಡಿ ಮತ್ತು ಲಾಗಿನ್ ಆಗಿ' : 'Select your user category to load scoped workspace'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Step 1: Category Selection Question */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                {lang === 'kn' ? '೧. ನಿಮ್ಮ ಬಳಕೆದಾರ ವಿಭಾಗ (Who is logging in?)' : '1. Select User Category'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleCategoryChange('citizen')}
                  className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-1 ${
                    category === 'citizen'
                      ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow-md scale-[1.02]'
                      : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-600 font-medium'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span className="text-xs">{lang === 'kn' ? 'ನಾಗರಿಕ' : 'Citizen'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCategoryChange('governance')}
                  className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-1 ${
                    category === 'governance'
                      ? 'bg-purple-600 text-white border-purple-400 font-black shadow-md scale-[1.02]'
                      : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-600 font-medium'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span className="text-xs">{lang === 'kn' ? 'ಪಿ.ಡಿ.ಒ / ಆಡಳಿತ' : 'PDO / Gov'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCategoryChange('worker')}
                  className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-1 ${
                    category === 'worker'
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black shadow-md scale-[1.02]'
                      : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-600 font-medium'
                  }`}
                >
                  <Wrench className="w-4 h-4" />
                  <span className="text-xs">{lang === 'kn' ? 'ಕರ್ಮಿಕ' : 'Worker'}</span>
                </button>
              </div>

              {/* Scoped Role Capabilities Preview Pill */}
              <div className="mt-2 text-[11px] px-2.5 py-1.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-300 flex items-center space-x-1.5">
                <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">
                  {category === 'citizen' && (lang === 'kn' ? 'ದೂರು ದಾಖಲಿಸಿ, ಲೈವ್ ನಕ್ಷೆ ವೀಕ್ಷಿಸಿ ಮತ್ತು ೨-ವೇ ಪರಿಶೀಲಿಸಿ' : 'Report asset defects, view live civic map & verify repairs')}
                  {category === 'governance' && (lang === 'kn' ? 'ಆಸ್ತಿ ರಿಜಿಸ್ಟ್ರಿ, ಕರ್ಮಿಕ ನಿಯೋಜನೆ ಮತ್ತು ಆಡಿಟ್ ಅನಾಲಿಟಿಕ್ಸ್' : 'Manage GP asset registry, dispatch workers & view audits')}
                  {category === 'worker' && (lang === 'kn' ? 'ಕಾರ್ಯ ಆದೇಶಗಳು, ಫೋಟೋ ಪುರಾವೆ ಮತ್ತು ಭಾಗಗಳ ಬಿಲ್ ಸಲ್ಲಿಕೆ' : 'View work orders, upload repair proofs & invoice parts')}
                </span>
              </div>
            </div>

            {/* If Governance, select tier */}
            {category === 'governance' && (
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {lang === 'kn' ? 'ಆಡಳಿತ ಶ್ರೇಣಿ (Administrative Tier)' : 'Administrative Tier'}
                </label>
                <select
                  value={governanceTier}
                  onChange={(e) => handleTierChange(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 font-semibold"
                >
                  <option value="panchayat">Gram Panchayat (PDO - Belavadi)</option>
                  <option value="taluk">Taluk Panchayat (EO - Mysuru)</option>
                  <option value="district">Zilla Panchayat (CEO - Mysuru)</option>
                  <option value="state">State Apex (RDPR Secretariat - Bengaluru)</option>
                </select>
              </div>
            )}

            {/* Username / Name */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {lang === 'kn' ? '೨. ಹೆಸರು / ಬಳಕೆದಾರರ ಹೆಸರು' : '2. Username / Full Name'}
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 font-medium"
                placeholder="Enter username"
              />
            </div>

            {/* Identifier / Phone / ID */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {category === 'citizen'
                  ? (lang === 'kn' ? '೩. ಮೊಬೈಲ್ ಸಂಖ್ಯೆ / ಮತದಾರರ ID' : '3. Mobile Number / Voter ID')
                  : (lang === 'kn' ? '೩. ಅಧಿಕೃತ ID / ಕೋಡ್' : '3. Official ID / Emp Code')}
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 font-mono"
                placeholder={category === 'citizen' ? '9886012390' : 'PDO-MYS-BELAVADI-491'}
              />
            </div>

            {/* Password / PIN */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {lang === 'kn' ? '೪. ಪಾಸ್‌ವರ್ಡ್ / ಪಿನ್' : '4. Password / Security PIN'}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 font-mono"
                placeholder="••••••••"
              />
            </div>

            {/* OTP Section */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-300">
                  {lang === 'kn' ? '೫. OTP ಪರಿಶೀಲನಾ ಕೋಡ್' : '5. OTP Verification Code'}
                </label>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="text-[11px] text-amber-400 hover:text-amber-300 font-bold cursor-pointer transition-colors"
                >
                  {otpSent ? '✓ OTP Sent (7789)' : 'Send / Auto-fill OTP'}
                </button>
              </div>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP (e.g. 7789)"
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 font-mono tracking-widest text-center font-bold"
              />
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 text-amber-500 focus:ring-amber-500"
                />
                <span>{lang === 'kn' ? 'ನನ್ನನ್ನು ನೆನಪಿಡಿ' : 'Remember my session'}</span>
              </label>
              <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Sakala Protected
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-2 flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 py-2.5 sm:py-3 rounded-2xl font-black text-sm shadow-lg hover:shadow-amber-500/20 transition-all cursor-pointer active:scale-[0.99]"
            >
              <span>{lang === 'kn' ? 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಪ್ರವೇಶಿಸಿ' : 'Enter GramaPala Workspace'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Instant 1-Click Evaluation Bar */}
          <div className="mt-5 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                {lang === 'kn' ? 'ತ್ವರಿತ ೧-ಕ್ಲಿಕ್ ಪರೀಕ್ಷೆ' : 'Instant 1-Click Login:'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 text-xs font-bold">
              <button
                type="button"
                onClick={() => handleQuickLogin('citizen')}
                className="bg-slate-800/90 hover:bg-slate-700 text-amber-300 py-1.8 px-2 rounded-xl text-center cursor-pointer border border-slate-700 transition-colors"
              >
                👤 Citizen
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('governance', 'panchayat')}
                className="bg-slate-800/90 hover:bg-slate-700 text-purple-300 py-1.8 px-2 rounded-xl text-center cursor-pointer border border-slate-700 transition-colors"
              >
                🏛️ PDO (GP)
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('worker')}
                className="bg-slate-800/90 hover:bg-slate-700 text-emerald-300 py-1.8 px-2 rounded-xl text-center cursor-pointer border border-slate-700 transition-colors"
              >
                🔧 Worker
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Official Gov Helpline Footer */}
      <footer className="border-t border-slate-800/60 py-3 px-4 bg-slate-900/40 text-center text-xs text-slate-400 space-y-1">
        <div className="flex items-center justify-center space-x-3 text-[11px]">
          <span className="text-amber-400 font-bold">KRDPR Helpline: 1800-425-8666</span>
          <span>•</span>
          <span>Panchatantra 2.0 Linked</span>
          <span>•</span>
          <span>e-Swathu Integrated</span>
        </div>
        <p className="text-[10px] text-slate-500">
          {lang === 'kn'
            ? 'ಗ್ರಾಮಪಾಲ • ಕರ್ನಾಟಕ ಸರ್ಕಾರ ಗ್ರಾಮೀಣಾಭಿವೃದ್ಧಿ ಮತ್ತು ಪಂಚಾಯತ್ ರಾಜ್ ಇಲಾಖೆ'
            : 'GramaPala • Government of Karnataka Dept. of Rural Development & Panchayat Raj'}
        </p>
      </footer>
    </div>
  );
};
