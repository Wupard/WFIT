// @ts-nocheck
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
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20 px-4">
      {/* Header */}
      <div className="glass-card p-10 relative overflow-hidden rounded-2xl border border-[var(--border-color)]">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-glow)] to-transparent opacity-50 pointer-events-none"></div>
        <div className="absolute right-0 top-0 p-8 opacity-5 transform translate-x-10 -translate-y-10 pointer-events-none">
          <SettingsIcon size={180} className="text-[var(--accent-primary)]" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-4 mb-3">
              <div className="p-3.5 bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-xl shadow-lg border border-white/10">
                <SettingsIcon size={28} className="text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-[var(--text-main)]">
                {t.title}
              </h1>
            </div>
            <p className="text-[var(--text-muted)] text-sm font-medium">
              Manage your profile and application preferences
            </p>
          </div>
        </div>
      </div>

      {/* Profile Section */}
      <div className="glass-card rounded-2xl border border-[var(--border-color)] overflow-hidden">
        <div className="bg-[rgba(139,92,246,0.03)] px-8 py-5 border-b border-[var(--border-color)]">
          <h3 className="font-heading font-semibold text-lg text-[var(--text-main)]">{t.profile}</h3>
        </div>

        <div className="p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
            {/* Photo Section */}
            <div className="flex flex-col items-center gap-4">
              <div className="w-32 h-32 bg-[var(--bg-main)] rounded-full flex items-center justify-center flex-shrink-0 border-4 border-[var(--border-color)] overflow-hidden relative group shadow-lg focus-within:border-[var(--accent-primary)] transition-all">
                {photoUrl ? (
                  <img src={photoUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  <div className="flex flex-col items-center gap-2 opacity-50">
                    <UserIcon size={40} className="text-[var(--text-muted)]" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-sm">
                  <span className="text-xs font-semibold text-white">
                    {getTranslation(settings.language, 'change')}
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex-1 text-center md:text-left space-y-6">
              <div>
                <h2 className="text-3xl font-heading font-bold text-[var(--text-main)] mb-2">{user.name}</h2>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <span className="px-3 py-1 bg-[var(--accent-glow)] border border-[var(--border-color)] rounded-md text-[var(--accent-primary)] text-xs font-medium">
                    ID: {user.id.slice(0, 8)}
                  </span>
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-md">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium text-green-500">Online</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl">
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                  {getTranslation(settings.language, 'update_photo_desc')}
                </p>
              </div>

              <div className="flex justify-center md:justify-start pt-2">
                <button onClick={handleSaveProfile} className="btn-primary flex items-center gap-2">
                  <Save size={18} /> {getTranslation(settings.language, 'save_changes')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* App Preferences */}
        <div className="glass-card p-8 rounded-2xl border border-[var(--border-color)]">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-[var(--bg-main)] rounded-xl border border-[var(--border-color)] text-[var(--accent-primary)]">
              <Globe size={20} />
            </div>
            <h3 className="text-xl font-heading font-semibold text-[var(--text-main)]">{t.appSettings}</h3>
          </div>

          <div className="space-y-8">
            <div className="space-y-3">
              <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider ml-1">{t.language}</span>
              <div className="grid grid-cols-2 gap-3 bg-[var(--bg-main)] p-1.5 rounded-xl border border-[var(--border-color)]">
                <button
                  onClick={() => onUpdateSettings({ ...settings, language: 'en' })}
                  className={`py-2.5 text-sm font-medium rounded-lg transition-all ${settings.language === 'en' ? 'bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white shadow-md' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
                >
                  English
                </button>
                <button
                  onClick={() => onUpdateSettings({ ...settings, language: 'tr' })}
                  className={`py-2.5 text-sm font-medium rounded-lg transition-all ${settings.language === 'tr' ? 'bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white shadow-md' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
                >
                  Türkçe
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider ml-1">{t.theme}</span>
              <div className="grid grid-cols-2 gap-3 bg-[var(--bg-main)] p-1.5 rounded-xl border border-[var(--border-color)]">
                <button
                  onClick={() => onUpdateSettings({ ...settings, theme: 'light' })}
                  className={`flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${settings.theme === 'light' ? 'bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white shadow-md' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
                >
                  <Sun size={16} /> {getTranslation(settings.language, 'light')}
                </button>
                <button
                  onClick={() => onUpdateSettings({ ...settings, theme: 'dark' })}
                  className={`flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${settings.theme === 'dark' ? 'bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white shadow-md' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
                >
                  <Moon size={16} /> {getTranslation(settings.language, 'dark_theme')}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Security / Recovery */}
        <div className="glass-card p-8 rounded-2xl border border-[var(--border-color)]">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-[var(--bg-main)] rounded-xl border border-[var(--border-color)] text-[var(--accent-primary)]">
              <Lock size={20} />
            </div>
            <h3 className="text-xl font-heading font-semibold text-[var(--text-main)]">{t.security}</h3>
          </div>

          <div className="space-y-6">
            <div className="p-6 bg-[var(--bg-main)] rounded-xl border border-[var(--border-color)] relative">
              <h4 className="text-sm font-semibold text-[var(--text-main)] mb-2">{t.passwordReset}</h4>
              <p className="text-xs text-[var(--text-muted)] mb-6 leading-relaxed">
                {t.emailInfo}
              </p>
              <div className="flex flex-col gap-4">
                <div className="text-sm font-medium text-[var(--text-main)] bg-[var(--bg-card)] px-4 py-3 rounded-lg border border-[var(--border-color)] break-all">
                  {user.email}
                </div>
                <button onClick={handlePasswordReset} className="btn-secondary w-full">
                  {t.sendLink}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Action: Logout */}
      <div className="p-8 bg-red-500/5 border border-red-500/20 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden group hover:border-red-500/40 transition-colors">
        <div className="absolute right-0 top-0 p-4 opacity-5 transform translate-x-8 -translate-y-8 pointer-events-none group-hover:scale-110 transition-transform duration-500">
          <ShieldAlert size={140} className="text-red-500" />
        </div>
        <div className="relative z-10 text-center md:text-left">
          <h3 className="font-heading font-bold text-2xl text-red-500 mb-1">{getTranslation(settings.language, 'account')}</h3>
          <p className="text-sm text-red-400/80">{getTranslation(settings.language, 'logout_desc') || "Safely end your session"}</p>
        </div>
        <button
          onClick={onLogout}
          className="relative z-10 px-8 py-3.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-semibold rounded-xl flex items-center gap-2 border border-red-500/20 transition-all"
        >
          <LogOut size={18} />
          {getTranslation(settings.language, 'logout') || "Sign Out"}
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
