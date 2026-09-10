import React from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ExternalLink, 
  ShieldCheck, 
  Twitter, 
  Facebook, 
  Youtube, 
  MessageCircle, 
  Globe, 
  HelpCircle,
  Building2,
  FileCheck
} from 'lucide-react';
import { LanguageMode } from '../types';
import { ThemeConfig } from '../types/theme';

interface FooterProps {
  lang: LanguageMode;
  theme: ThemeConfig;
}

export const Footer: React.FC<FooterProps> = ({ lang, theme }) => {
  return (
    <footer className={`mt-auto border-t ${theme.classes.footerBorder} ${theme.isDark ? 'bg-slate-900 text-slate-300' : 'bg-slate-950 text-slate-300'} transition-colors duration-300`}>
      {/* Top Advisory / Citizen Emergency Help Banner */}
      <div className="border-b border-slate-800/80 bg-slate-900/90 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2 text-amber-300">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-bold">
              {lang === 'kn' 
                ? 'ಗ್ರಾಮೀಣ ಸಾರ್ವಜನಿಕ ತುರ್ತು ದೂರು ಸಹಾಯವಾಣಿ: ೨೪/೭ ಸೇವೆ ಲಭ್ಯ' 
                : 'Rural Civic Asset Emergency Redressal: 24/7 Automated Triage Available'}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-slate-300">
            <a 
              href="tel:1902" 
              className="flex items-center space-x-1 hover:text-amber-300 transition-colors font-bold text-amber-400"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{lang === 'kn' ? 'ಉಚಿತ ಟೋಲ್-ಫ್ರೀ: ೧೯೦೨' : 'Toll-Free Helpline: 1902'}</span>
            </a>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <a 
              href="tel:18004258666" 
              className="flex items-center space-x-1 hover:text-amber-300 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>1800 425 8666</span>
            </a>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <a 
              href="mailto:support-rdpr@karnataka.gov.in" 
              className="flex items-center space-x-1 hover:text-amber-300 transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>support-rdpr@karnataka.gov.in</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Information Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Government Administration & Office Address */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-900 to-amber-600 flex items-center justify-center text-white shadow-md">
                <Building2 className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h3 className="text-sm font-black tracking-tight text-white">
                  {lang === 'kn' ? 'ಗ್ರಾಮೀಣಾಭಿವೃದ್ಧಿ ಮತ್ತು ಪಂಚಾಯತ್ ರಾಜ್' : 'Rural Development & Panchayat Raj'}
                </h3>
                <p className="text-[11px] text-amber-400 font-semibold">
                  {lang === 'kn' ? 'ಕರ್ನಾಟಕ ಸರ್ಕಾರ' : 'Government of Karnataka'}
                </p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-slate-400 leading-relaxed">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-200">
                    {lang === 'kn' ? 'ಪ್ರಧಾನ ಕಾರ್ಯಾಲಯ:' : 'State Secretariat & Directorate:'}
                  </p>
                  <p>
                    {lang === 'kn'
                      ? '೩ನೇ ಗೇಟ್, ೩ನೇ ಮಹಡಿ, ಎಂ.ಎಸ್. ಕಟ್ಟಡ, ಡಾ. ಬಿ.ಆರ್. ಅಂಬೇಡ್ಕರ್ ವೀಧಿ, ಬೆಂಗಳೂರು – ೫೬೦೦೦೧'
                      : '3rd Gate, 3rd Floor, M.S. Building, Dr. B.R. Ambedkar Veedhi, Bengaluru, Karnataka – 560001'}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-2 pt-1">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-200">
                    {lang === 'kn' ? 'ಕಚೇರಿ ಸಮಯ:' : 'Office Working Hours:'}
                  </p>
                  <p>
                    {lang === 'kn' 
                      ? 'ಸೋಮವಾರ – ಶನಿವಾರ: ಬೆಳಗ್ಗೆ ೯:೩೦ ರಿಂದ ಸಂಜೆ ೬:೦೦ (೨ನೇ & ೪ನೇ ಶನಿವಾರ ರಜೆ)' 
                      : 'Monday – Saturday: 9:30 AM – 6:00 PM (Except 2nd & 4th Saturdays)'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Official Contact Numbers & Support Desk */}
          <div className="space-y-3">
            <h4 className="text-xs font-black tracking-wider uppercase text-amber-400 border-b border-slate-800 pb-2">
              {lang === 'kn' ? 'ಸಂಪರ್ಕ ವಿವರಗಳು (Contact Details)' : 'Official Contact Directory'}
            </h4>
            
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <span className="text-[11px] text-slate-400 block font-medium">
                  {lang === 'kn' ? 'ಪಂಚಾಯತ್ ಸಹಾಯವಾಣಿ (Toll Free):' : 'Grievance Redressal Helpline:'}
                </span>
                <a href="tel:1902" className="text-sm font-black text-amber-300 hover:underline flex items-center gap-1.5 mt-0.5">
                  <Phone className="w-3.5 h-3.5" />
                  1902 / 1800 425 8666
                </a>
              </li>

              <li>
                <span className="text-[11px] text-slate-400 block font-medium">
                  {lang === 'kn' ? 'ಸಚಿವಾಲಯ ದೂರವಾಣಿ (Secretariat):' : 'RDPR Secretariat PBX:'}
                </span>
                <a href="tel:08022353980" className="hover:text-amber-300 transition-colors block font-mono text-slate-200">
                  080-2235 3980 / 080-2226 0524
                </a>
              </li>

              <li>
                <span className="text-[11px] text-slate-400 block font-medium">
                  {lang === 'kn' ? 'ಅಧಿಕೃತ ಇಮೇಲ್ (Official Email):' : 'Direct Support Email:'}
                </span>
                <a href="mailto:grievance-rdpr@karnataka.gov.in" className="hover:text-amber-300 transition-colors block text-slate-200 truncate">
                  grievance-rdpr@karnataka.gov.in
                </a>
              </li>

              <li>
                <span className="text-[11px] text-slate-400 block font-medium">
                  {lang === 'kn' ? 'ಸ್ಥಳೀಯ ಬೆಳವಡಿ ಪಂಚಾಯತ್ ಕಚೇರಿ:' : 'Local Pilot Gram Panchayat:'}
                </span>
                <span className="text-slate-300 font-medium block">
                  Belavadi GP, Mysuru Taluk: 0821-2402110
                </span>
              </li>
            </ul>
          </div>

          {/* Column 3: Social Media & Citizen Channels */}
          <div className="space-y-3">
            <h4 className="text-xs font-black tracking-wider uppercase text-amber-400 border-b border-slate-800 pb-2">
              {lang === 'kn' ? 'ಸಾಮಾಜಿಕ ಜಾಲತಾಣಗಳು (Social Handles)' : 'Social Media & Citizen Handles'}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {lang === 'kn'
                ? 'ಇಲಾಖೆಯ ಅಧಿಕೃತ ಪ್ರಕಟಣೆಗಳು, ಕಾಮಗಾರಿ ಅಪ್ಡೇಟ್‌ಗಳು ಮತ್ತು ಸಾರ್ವಜನಿಕ ಮಾಹಿತಿಗಾಗಿ ಸಂಪರ್ಕದಲ್ಲಿರಿ.'
                : 'Follow official channels for Gram Panchayat schemes, real-time maintenance alerts, and public advisories.'}
            </p>

            <div className="space-y-2 pt-1 text-xs">
              <a 
                href="https://twitter.com/KarnatakaRDPR" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2.5 p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-all border border-slate-800"
              >
                <Twitter className="w-4 h-4 text-sky-400 shrink-0" />
                <div className="truncate">
                  <span className="font-bold block text-[11px] text-white">Twitter (X): @KarnatakaRDPR</span>
                  <span className="text-[10px] text-slate-400">Official Government Handle</span>
                </div>
              </a>

              <a 
                href="https://facebook.com/RDPRKarnataka" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2.5 p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-all border border-slate-800"
              >
                <Facebook className="w-4 h-4 text-blue-400 shrink-0" />
                <div className="truncate">
                  <span className="font-bold block text-[11px] text-white">Facebook: @RDPRKarnataka</span>
                  <span className="text-[10px] text-slate-400">Panchayat Raj Community Page</span>
                </div>
              </a>

              <a 
                href="https://youtube.com/@RDPRKarnataka" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2.5 p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-all border border-slate-800"
              >
                <Youtube className="w-4 h-4 text-red-400 shrink-0" />
                <div className="truncate">
                  <span className="font-bold block text-[11px] text-white">YouTube: RDPR Karnataka</span>
                  <span className="text-[10px] text-slate-400">Video Tutorials & Awareness</span>
                </div>
              </a>

              <a 
                href="https://wa.me/919480812345" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2.5 p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-all border border-slate-800"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <div className="truncate">
                  <span className="font-bold block text-[11px] text-white">WhatsApp Grievance Bot</span>
                  <span className="text-[10px] text-slate-400">+91 94808 12345 (Automated Helpline Desk)</span>
                </div>
              </a>
            </div>
          </div>

          {/* Column 4: Official Government Links & Civic Portals */}
          <div className="space-y-3">
            <h4 className="text-xs font-black tracking-wider uppercase text-amber-400 border-b border-slate-800 pb-2">
              {lang === 'kn' ? 'ಸರ್ಕಾರಿ ಪೋರ್ಟಲ್‌ಗಳು (Govt Portals)' : 'State Portals & Governance'}
            </h4>
            
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <a 
                  href="https://rdpr.karnataka.gov.in" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center justify-between hover:text-amber-300 transition-colors py-1 group border-b border-slate-800/60"
                >
                  <span className="flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-400" />
                    <span>RDPR Karnataka Official</span>
                  </span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>

              <li>
                <a 
                  href="https://sevasindhu.karnataka.gov.in" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center justify-between hover:text-amber-300 transition-colors py-1 group border-b border-slate-800/60"
                >
                  <span className="flex items-center gap-1.5">
                    <FileCheck className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-400" />
                    <span>Seva Sindhu 2.0 (Citizen Services)</span>
                  </span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>

              <li>
                <a 
                  href="https://bapujiseva.karnataka.gov.in" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center justify-between hover:text-amber-300 transition-colors py-1 group border-b border-slate-800/60"
                >
                  <span className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-400" />
                    <span>Bapuji Seva Kendra (Panchayats)</span>
                  </span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>

              <li>
                <a 
                  href="https://panchatantra.karnataka.gov.in" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center justify-between hover:text-amber-300 transition-colors py-1 group border-b border-slate-800/60"
                >
                  <span className="flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-400" />
                    <span>Panchatantra 2.0 Grama Swaraj</span>
                  </span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>

              <li>
                <a 
                  href="https://rti.karnataka.gov.in" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center justify-between hover:text-amber-300 transition-colors py-1 group"
                >
                  <span className="flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-400" />
                    <span>RTI (Right to Information) Portal</span>
                  </span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>

            <div className="pt-2">
              <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-[11px] text-slate-400">
                <span className="text-amber-400 font-bold block mb-0.5">
                  {lang === 'kn' ? 'ಗ್ರಾಮ ಆಸ್ತಿ ಡಿಜಿಟಲ್ ನೋಂದಣಿ' : '15th Finance Commission Tracking'}
                </span>
                <span>
                  {lang === 'kn' 
                    ? 'ಎಲ್ಲಾ ದುರಸ್ತಿ ಮತ್ತು ನಿರ್ವಹಣಾ ವೆಚ್ಚಗಳು ಡಿಜಿಟಲ್ ಲೆಡ್ಜರ್‌ನಲ್ಲಿ ಪಾರದರ್ಶಕವಾಗಿ ದಾಖಲಾಗುತ್ತವೆ.' 
                    : 'Public asset lifecycle logs, warranty recovery, and geo-tagged expenditure tracking are publicly auditable.'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal, Disclaimer & Standards Strip */}
        <div className="mt-10 pt-6 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
            <span className="text-slate-300 font-semibold">
              © {new Date().getFullYear()} Government of Karnataka.
            </span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span>
              {lang === 'kn'
                ? 'ಕರ್ನಾಟಕದ ನಾಗರಿಕರಿಗಾಗಿ ಪ್ರೀತಿಯಿಂದ ನಿರ್ಮಿಸಲಾಗಿದೆ ♥ (Made with ♥ for Rural Citizens)'
                : 'Built for Belavadi Gram Panchayat (RDPR) • Made with ♥ for Karnataka citizens.'}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-400 text-[11px]">
            <span className="hover:text-slate-200 cursor-pointer">
              {lang === 'kn' ? 'ಗೌಪ್ಯತಾ ನೀತಿ (Privacy Policy)' : 'Privacy Policy'}
            </span>
            <span>•</span>
            <span className="hover:text-slate-200 cursor-pointer">
              {lang === 'kn' ? 'ಬಳಕೆಯ ನಿಯಮಗಳು (Terms of Use)' : 'Terms of Use'}
            </span>
            <span>•</span>
            <span className="hover:text-slate-200 cursor-pointer">
              {lang === 'kn' ? 'ಹಕ್ಕುಸ್ವಾಮ್ಯ ನೀತಿ (Copyright)' : 'Citizen Charter'}
            </span>
            <span>•</span>
            <span className="text-amber-400 font-semibold">
              v2.6 State Gov Portal
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
