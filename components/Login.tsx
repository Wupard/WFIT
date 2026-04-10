
import React, { useState } from 'react';
import { GoogleOneTap } from './GoogleOneTap';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Shield, Lock, ArrowRight, Mail, User as UserIcon, Check, X, Chrome, Eye, EyeOff } from 'lucide-react';
import {
  loginWithGoogle,
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail
} from '../services/firebase';
import { Toast, ToastType } from './ui/Toast';

// Google Icon SVG
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

interface LoginProps {
  onLogin: (user: any) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'reset'>('login');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ isVisible: boolean; message: string; type: ToastType }>({
    isVisible: false,
    message: '',
    type: 'success'
  });

  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');

  // UI States
  const [showPassword, setShowPassword] = useState(false);

  const showToast = (message: string, type: ToastType = 'error') => {
    setToast({ isVisible: true, message, type });
  };

  const getFirebaseErrorMessage = (error: any) => {
    switch (error.code) {
      case 'auth/invalid-credential': return 'E-posta veya şifre hatalı.';
      case 'auth/user-not-found': return 'Bu e-posta adresiyle kayıtlı bir kullanıcı bulunamadı.';
      case 'auth/wrong-password': return 'Girdiğiniz şifre hatalı.';
      case 'auth/email-already-in-use': return 'Bu e-posta zaten kullanılıyor.';
      case 'auth/invalid-email': return 'Geçersiz e-posta adresi.';
      case 'auth/weak-password': return 'Şifre çok zayıf (min 6 karakter).';
      case 'auth/too-many-requests': return 'Çok fazla deneme. Lütfen bekleyin.';
      default: return error.message || 'Hata oluştu.';
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const firebaseUser = await loginWithGoogle();
      onLogin({
        id: firebaseUser.uid,
        name: firebaseUser.displayName || 'User',
        email: firebaseUser.email || '',
        photoUrl: firebaseUser.photoURL || undefined
      });
    } catch (error: any) {
      showToast(getFirebaseErrorMessage(error), 'error');
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = (email: string) => {
    const validDomains = ['@gmail.com', '@hotmail.com'];
    return validDomains.some(domain => email.toLowerCase().endsWith(domain));
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!email || !password) {
      showToast('Tüm alanları doldurun.', 'error');
      setLoading(false);
      return;
    }
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      onLogin({
        id: user.uid,
        name: user.displayName || 'User',
        email: user.email || '',
        photoUrl: user.photoURL || undefined
      });
    } catch (error: any) {
      showToast(getFirebaseErrorMessage(error), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!email || !password || !confirmPassword || !username) {
      showToast('Tüm alanları doldurun.', 'error');
      setLoading(false);
      return;
    }
    if (!validateEmail(email)) {
      showToast('Sadece @gmail.com ve @hotmail.com.', 'error');
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      showToast('Şifreler eşleşmiyor.', 'error');
      setLoading(false);
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: username });
      showToast('Kayıt başarılı! Giriş yapılıyor...', 'success');
      setTimeout(() => {
        const user = userCredential.user;
        onLogin({
          id: user.uid,
          name: username,
          email: user.email || '',
          photoUrl: user.photoURL || undefined
        });
      }, 1500);
    } catch (error: any) {
      showToast(getFirebaseErrorMessage(error), 'error');
    } finally {
      if (toast.type !== 'success') setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!email) {
      showToast('Lütfen e-posta girin.', 'error');
      setLoading(false);
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      showToast('Sıfırlama linki gönderildi.', 'success');
      setTimeout(() => setMode('login'), 5000);
    } catch (error: any) {
      showToast(getFirebaseErrorMessage(error), 'error');
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen bg-[#14110F] flex items-center justify-center p-4 relative overflow-hidden font-body">
      <div className="texture-overlay opacity-20"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>

      <div className="max-w-md w-full animate-fade-in-up relative z-10">
        <div className="vintage-card p-0 overflow-hidden shadow-[12px_12px_0px_#000]">
          {/* Header Section - Industrial Stamped */}
          <div className="bg-[#1D1916] p-8 text-center border-b-2 border-[var(--border-strong)] relative">
            <div className="absolute top-0 left-0 w-24 h-24 border-l-4 border-t-4 border-[var(--accent-primary)] opacity-10 pointer-events-none"></div>

            <div className="w-24 h-24 mx-auto flex items-center justify-center mb-6 relative group">
              <div className="absolute inset-0 border-2 border-[var(--accent-primary)] rounded-[2px] rotate-45 group-hover:rotate-180 transition-transform duration-1000 opacity-20"></div>
              <div className={`relative z-10 w-20 h-20 rounded-[2px] flex items-center justify-center text-black shadow-[4px_4px_0px_#000] border-2 border-black/10 bg-[var(--accent-primary)]`}>
                <span className="font-heading text-6xl select-none pt-2">W</span>
              </div>
            </div>

            <h1 className="text-4xl font-heading tracking-widest text-[var(--text-main)] uppercase text-stamped">
              {mode === 'register' ? 'PROTOCOL: JOIN' : 'WFIT_AUTHENTICATE'}
            </h1>
            <p className="text-[var(--text-muted)] mt-2 font-mono text-[10px] uppercase tracking-[0.4em] opacity-60">
              {mode === 'register' ? 'INITIALIZING_USER_DATA' : 'READY_FOR_TRANSMISSION'}
            </p>
          </div>

          <div className="p-8 space-y-8 bg-[#1D1916]/50">
            {/* Login / Register Toggle - Switch Aesthetics */}
            {mode !== 'reset' && (
              <div className="flex bg-[#14110F] border-2 border-[#26211D] p-1 rounded-[2px] shadow-[inset_2px_2px_4px_#000]">
                <button
                  onClick={() => setMode('login')}
                  className={`flex-1 py-3 text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-200 ${mode === 'login' ? 'bg-[var(--accent-primary)] text-black shadow-[2px_2px_0px_#000]' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
                >
                  GİRİŞ YAP
                </button>
                <button
                  onClick={() => setMode('register')}
                  className={`flex-1 py-3 text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-200 ${mode === 'register' ? 'bg-[var(--accent-primary)] text-black shadow-[2px_2px_0px_#000]' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
                >
                  KAYIT OL
                </button>
              </div>
            )}

            {/* Forms */}
            {mode === 'reset' ? (
              <form onSubmit={handlePasswordReset} className="space-y-6 animate-fade-in">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[var(--accent-primary)] uppercase tracking-widest ml-1">E-Posta Adresi</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"><Mail size={18} /></div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-[#14110F] border border-[#26211D] rounded-[2px] text-[var(--text-main)] font-mono text-sm focus:outline-none focus:border-[var(--accent-primary)] transition-all shadow-[inset_2px_2px_4px_#000]"
                      placeholder="EMAIL_ADDRESS"
                    />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-sm tracking-widest">SIFIRLAMA LİNKİ GÖNDER</button>
                <button type="button" onClick={() => setMode('login')} className="w-full text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] hover:text-[var(--accent-primary)] transition-all">ANA MENÜYE DÖN</button>
              </form>
            ) : (
              <form onSubmit={mode === 'login' ? handleEmailLogin : handleRegister} className="space-y-5 animate-fade-in">
                {mode === 'register' && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-[var(--accent-primary)] uppercase tracking-widest ml-1">Tanımlayıcı / Username</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"><UserIcon size={18} /></div>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-[#14110F] border border-[#26211D] rounded-[2px] text-[var(--text-main)] font-mono text-xs focus:outline-none focus:border-[var(--accent-primary)] shadow-[inset_2px_2px_4px_#000]"
                        placeholder="NAME_ID"
                      />
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[var(--accent-primary)] uppercase tracking-widest ml-1">Veri Girişi / Email</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"><Mail size={18} /></div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-[#14110F] border border-[#26211D] rounded-[2px] text-[var(--text-main)] font-mono text-xs focus:outline-none focus:border-[var(--accent-primary)] shadow-[inset_2px_2px_4px_#000]"
                      placeholder="MAIL_PROTOCOL@GMAIL.COM"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[var(--accent-primary)] uppercase tracking-widest ml-1">Güvenlik / Password</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"><Lock size={18} /></div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-4 bg-[#14110F] border border-[#26211D] rounded-[2px] text-[var(--text-main)] font-mono text-xs focus:outline-none focus:border-[var(--accent-primary)] shadow-[inset_2px_2px_4px_#000]"
                      placeholder="••••••••"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--accent-primary)]">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                {mode === 'register' && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-[var(--accent-primary)] uppercase tracking-widest ml-1">Onay / Confirm</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"><Check size={18} /></div>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`w-full pl-12 pr-4 py-4 bg-[#14110F] border rounded-[2px] text-[var(--text-main)] font-mono text-xs focus:outline-none shadow-[inset_2px_2px_4px_#000] ${confirmPassword && password !== confirmPassword ? 'border-[#A83232]' : 'border-[#26211D] focus:border-[var(--accent-primary)]'}`}
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                )}

                <button type="submit" disabled={loading} className="btn-primary w-full py-5 text-xl mt-4">
                  {loading ? 'İşleniyor...' : (mode === 'login' ? 'GİRİŞ YAP' : 'SİSTEME KAYDOL')}
                </button>

                <div className="relative py-4 flex items-center gap-4">
                  <div className="h-px bg-[#26211D] flex-1"></div>
                  <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.3em]">OR</span>
                  <div className="h-px bg-[#26211D] flex-1"></div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-full py-4 flex items-center justify-center gap-4 bg-[#14110F] border border-[#26211D] rounded-[2px] hover:border-[var(--accent-primary)] transition-all font-bold text-[var(--text-main)] text-[10px] tracking-[0.2em] group shadow-[4px_4px_0px_#000] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
                  >
                    <GoogleIcon />
                    GOOGLE İLE BAĞLAN
                  </button>
                </div>

                {mode === 'login' && (
                  <div className="text-center pt-4">
                    <button type="button" onClick={() => setMode('reset')} className="text-[10px] font-bold text-[var(--text-muted)] hover:text-[var(--accent-primary)] uppercase tracking-widest border-b border-transparent hover:border-[var(--accent-primary)] transition-all">
                      ŞİFREMİ UNUTTUM
                    </button>
                  </div>
                )}
              </form>
            )}
          </div>



        </div>

        {/* Technical Specs Footer */}
        <div className="mt-8 flex justify-between items-end opacity-40 px-2">
          <div className="text-[8px] font-mono text-[var(--text-muted)] uppercase leading-tight">
            Protocol: WFIT_OS_v4.2<br />
            Status: SECURE<br />
            Hardware: BIOS_REL_2026
          </div>
          <div className="text-[8px] font-mono text-[var(--text-muted)] text-right uppercase leading-tight">
            Location: TR_CLUSTER_01<br />
            Latency: 12ms<br />
            Encryption: RSA_4096
          </div>
        </div>
      </div>

      <GoogleOneTap
        onSuccess={(firebaseUser) => {
          onLogin({
            id: firebaseUser.uid,
            name: firebaseUser.displayName || 'User',
            email: firebaseUser.email || '',
            photoUrl: firebaseUser.photoURL || undefined
          });
          showToast('Google ile giriş başarılı.', 'success');
        }}
        onError={(err) => console.error("One Tap Error", err)}
      />

      <Toast
        message={toast.message}
        isVisible={toast.isVisible}
        type={toast.type}
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
      />
    </div>
  );
};

