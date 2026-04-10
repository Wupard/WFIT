import React, { useState } from 'react';
import { AppSettings, User } from '../types';
import { User as UserIcon, Globe, Moon, Sun, Save, Lock, LogOut, Settings as SettingsIcon, ShieldAlert } from 'lucide-react';
import { auth, sendPasswordResetEmail } from '../services/firebase';
import confetti from 'canvas-confetti';
import { Toast, ToastType } from './ui/Toast';
import { getTranslation } from '../translations';

export interface SettingsProps {
  user: User;
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onUpdateProfile: (photoUrl?: string) => void;
  onLogout: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ user, settings, onUpdateSettings, onUpdateProfile, onLogout }) => {
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl || '');
  const [toast, setToast] = useState<{ isVisible: boolean; message: string; type: ToastType }>({
    isVisible: false,
    message: '',
    type: 'success'
  });

  const fireConfetti = () => {
    const duration = 2000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    const random = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 50 * (timeLeft / duration);
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: random(0.1, 0.3), y: Math.random() - 0.2 } }));
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: random(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
  };

  const handleSaveProfile = () => {
    onUpdateProfile(photoUrl);
    fireConfetti();
    setToast({
      isVisible: true,
      message: getTranslation(settings.language, 'saved_success'),
      type: 'success'
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => setPhotoUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordReset = async () => {
    if (!user.email) return;
    try {
      await sendPasswordResetEmail(auth, user.email);
      setToast({
        isVisible: true,
        message: getTranslation(settings.language, 'reset_sent'),
        type: 'success'
      });
    } catch (error: any) {
      console.error('Password reset error:', error);
      setToast({
        isVisible: true,
        message: getTranslation(settings.language, 'reset_error'),
        type: 'error'
      });
    }
  };

  const t = {
    title: getTranslation(settings.language, 'settings'),
    profile: getTranslation(settings.language, 'profile'),
    appSettings: getTranslation(settings.language, 'app_preferences'),
    language: getTranslation(settings.language, 'language'),
    theme: getTranslation(settings.language, 'theme'),
    security: getTranslation(settings.language, 'security'),
    passwordReset: getTranslation(settings.language, 'password_reset'),
    sendLink: getTranslation(settings.language, 'send_reset_link'),
    emailInfo: getTranslation(settings.language, 'email_info'),
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fade-in pb-20 px-4">
      {/* Heavy Header Plate */}
      <div className="border-b-4 border-[var(--border-strong)] pb-6 relative">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <SettingsIcon size={120} className="text-[var(--accent-primary)]" />
        </div>
        <div className="flex items-center gap-5 relative z-10">
          <div className="p-4 bg-[#1D1916] border-2 border-[var(--border-color)] text-[var(--accent-primary)] shadow-[6px_6px_0px_#000]">
            <SettingsIcon size={32} />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-heading text-[var(--text-main)] tracking-[0.2em] uppercase text-stamped">{t.title}</h1>
            <p className="text-[var(--text-muted)] font-mono text-xs mt-1 uppercase tracking-[0.3em]">SYSTEM_CONFIG // HARDWARE_AND_USER_ID</p>
          </div>
        </div>
      </div>

      {/* Personnel File Profile Section */}
      <div className="panel-technical p-0 bg-[#1D1916] bg-grid-pattern overflow-hidden relative border-2 border-[#26211D]">
        <div className="bg-[#14110F] px-6 py-3 border-b-2 border-[#26211D] flex items-center justify-between">
          <h3 className="font-heading tracking-widest text-lg text-[var(--text-main)] uppercase m-0 leading-none">{t.profile}</h3>
          <span className="text-[10px] font-mono text-[var(--accent-primary)] font-bold">CLEARANCE_LEVEL: ALPHA</span>
        </div>

        <div className="p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
            {/* Photo Section */}
            <div className="flex flex-col items-center gap-4">
              <div className="w-36 h-36 bg-[#0E0C0B] flex items-center justify-center flex-shrink-0 border-4 border-[#26211D] overflow-hidden relative group rounded-[2px] shadow-[8px_8px_0px_#000] focus-within:border-[var(--accent-primary)] transition-colors">
                {photoUrl ? (
                  <img src={photoUrl} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                ) : (
                  <div className="flex flex-col items-center gap-2 opacity-30">
                    <UserIcon size={48} className="text-[var(--text-muted)]" />
                    <span className="text-[8px] font-mono uppercase">NO_SIGNAL</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <span className="text-[10px] font-bold text-[var(--accent-primary)] uppercase tracking-widest text-center px-4">
                    {getTranslation(settings.language, 'change')} // UPLOAD
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
              <div className="text-[10px] font-mono font-bold text-[var(--accent-primary)] bg-[#14110F] border border-[#26211D] px-4 py-1.5 uppercase tracking-widest shadow-[4px_4px_0px_#000]">
                {getTranslation(settings.language, 'click_upload')}
              </div>
            </div>

            <div className="flex-1 text-center md:text-left space-y-6">
              <div>
                <h2 className="text-4xl font-heading text-[var(--text-main)] tracking-widest uppercase mb-1">{user.name}</h2>
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <span className="px-2 py-0.5 bg-[rgba(200,123,42,0.1)] border border-[var(--accent-primary)] text-[var(--accent-primary)] text-[10px] font-mono font-bold uppercase tracking-widest">
                    ID: {user.id.slice(0, 12).toUpperCase()}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-[9px] font-mono text-[var(--text-muted)] uppercase tracking-widest">ACTIVE_SESSION</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[#14110F] border-2 border-[#26211D] relative">
                <div className="absolute -top-[1.5px] -left-[1.5px] w-4 h-4 border-t-2 border-l-2 border-[var(--accent-primary)]"></div>
                <p className="text-sm text-[var(--text-muted)] font-mono leading-relaxed uppercase tracking-tight">
                  {getTranslation(settings.language, 'update_photo_desc')}
                </p>
              </div>

              <div className="flex justify-center md:justify-start pt-2">
                <button onClick={handleSaveProfile} className="btn-primary flex items-center gap-3 px-8">
                  <Save size={20} /> {getTranslation(settings.language, 'save_changes')}
                </button>
              </div>
            </div>
          </div>


        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* App Preferences */}
        <div className="panel-technical p-8 bg-[#1D1916] border-2 border-[#26211D]">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-[#14110F] text-[var(--accent-primary)] border border-[#26211D]">
              <Globe size={20} />
            </div>
            <h3 className="text-2xl font-heading tracking-[0.15em] text-[var(--text-main)] uppercase m-0">{t.appSettings}</h3>
          </div>

          <div className="space-y-10">
            <div className="space-y-4">
              <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-[0.3em] ml-1">{t.language}</span>
              <div className="grid grid-cols-2 gap-3 bg-[#14110F] p-2 border-2 border-[#26211D]">
                <button
                  onClick={() => onUpdateSettings({ ...settings, language: 'en' })}
                  className={`py-3 text-[11px] font-mono font-bold uppercase tracking-widest transition-all border ${settings.language === 'en' ? 'bg-[var(--accent-primary)] text-black border-black shadow-[2px_2px_0px_#000]' : 'text-[var(--text-muted)] border-transparent hover:border-[#26211D]'}`}
                >
                  [ ENGLISH ]
                </button>
                <button
                  onClick={() => onUpdateSettings({ ...settings, language: 'tr' })}
                  className={`py-3 text-[11px] font-mono font-bold uppercase tracking-widest transition-all border ${settings.language === 'tr' ? 'bg-[var(--accent-primary)] text-black border-black shadow-[2px_2px_0px_#000]' : 'text-[var(--text-muted)] border-transparent hover:border-[#26211D]'}`}
                >
                  [ TÜRKÇE ]
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-[0.3em] ml-1">{t.theme}</span>
              <div className="grid grid-cols-2 gap-3 bg-[#14110F] p-2 border-2 border-[#26211D]">
                <button
                  onClick={() => onUpdateSettings({ ...settings, theme: 'light' })}
                  className={`flex items-center justify-center gap-2 py-3 text-[11px] font-mono font-bold uppercase tracking-widest transition-all border ${settings.theme === 'light' ? 'bg-[var(--accent-primary)] text-black border-black shadow-[2px_2px_0px_#000]' : 'text-[var(--text-muted)] border-transparent hover:text-[var(--text-main)]'}`}
                >
                  <Sun size={14} /> {getTranslation(settings.language, 'light')}
                </button>
                <button
                  onClick={() => onUpdateSettings({ ...settings, theme: 'dark' })}
                  className={`flex items-center justify-center gap-2 py-3 text-[11px] font-mono font-bold uppercase tracking-widest transition-all border ${settings.theme === 'dark' ? 'bg-[var(--accent-primary)] text-black border-black shadow-[2px_2px_0px_#000]' : 'text-[var(--text-muted)] border-transparent hover:text-[var(--text-main)]'}`}
                >
                  <Moon size={14} /> {getTranslation(settings.language, 'dark_theme')}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Security / Recovery */}
        <div className="panel-technical p-8 bg-[#1D1916] border-2 border-[#26211D]">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-[#14110F] text-[var(--accent-primary)] border border-[#26211D]">
              <Lock size={20} />
            </div>
            <h3 className="text-2xl font-heading tracking-[0.15em] text-[var(--text-main)] uppercase m-0">{t.security}</h3>
          </div>

          <div className="space-y-6">
            <div className="p-6 bg-[#14110F] border-2 border-[#26211D] relative">
              <div className="absolute top-2 right-2 flex items-center gap-1.5">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-[8px] font-mono uppercase text-blue-500 font-bold">READY</span>
              </div>
              <h4 className="text-[12px] font-bold text-[var(--text-main)] uppercase tracking-[0.15em] mb-2">{t.passwordReset}</h4>
              <p className="text-[10px] text-[var(--text-muted)] font-mono uppercase tracking-tight mb-6 leading-relaxed">
                {t.emailInfo}
              </p>
              <div className="flex flex-col gap-4">
                <div className="text-xs font-mono text-[var(--accent-primary)] bg-[#0E0C0B] px-4 py-3 border border-[#26211D] break-all">
                  CMD_RECOVER_TO: {user.email}
                </div>
                <button onClick={handlePasswordReset} className="btn-secondary w-full py-3 text-[11px] font-bold uppercase tracking-widest border-2 hover:bg-[var(--accent-primary)] hover:text-black transition-all">
                  {t.sendLink} // EXEC_REQUEST
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Action: Logout */}
      <div className="p-8 bg-[#331A1A] border-4 border-[#A83232] rounded-[2px] flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">
          <ShieldAlert size={120} className="text-[#EF5350]" />
        </div>
        <div className="relative z-10 text-center md:text-left">
          <h3 className="font-heading tracking-[0.2em] text-3xl text-[#EF5350] uppercase m-0">{getTranslation(settings.language, 'account')}</h3>
          <p className="text-[11px] text-[#EF5350] font-mono uppercase tracking-widest mt-1 opacity-80">{getTranslation(settings.language, 'logout_desc') || "TERMINATE_CURRENT_CONNECTION // SIG_EXIT"}</p>
        </div>
        <button
          onClick={onLogout}
          className="relative z-10 px-10 py-4 bg-[#A83232] text-white font-heading text-xl tracking-[0.2em] uppercase shadow-[6px_6px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none active:translate-x-2 active:translate-y-2 transition-all flex items-center gap-3 border-2 border-black"
        >
          <LogOut size={22} strokeWidth={3} />
          {getTranslation(settings.language, 'logout') || "DISCONNECT"}
        </button>
      </div>

      <Toast
        message={toast.message}
        isVisible={toast.isVisible}
        type={toast.type}
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
      />
    </div>
  );
};
