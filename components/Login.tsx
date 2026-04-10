
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
    <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center p-4 relative overflow-hidden font-body">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(139,92,246,0.08),transparent_60%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>

      <div className="max-w-md w-full animate-fade-in-up relative z-10">
        <div className="vintage-card p-0 overflow-hidden">
          {/* Header Section - Industrial Stamped */}
          <div className="p-8 text-center border-b border-[var(--border-color)] relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.05),transparent_70%)] pointer-events-none"></div>

            <div className="w-20 h-20 mx-auto flex items-center justify-center mb-6 relative">
              <div className="absolute inset-0 bg-[var(--accent-primary)] rounded-2xl opacity-10 blur-xl"></div>
              <div className="relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] shadow-lg">
                <span className="font-heading text-4xl text-white select-none">W</span>
              </div>
            </div>

            <h1 className="text-2xl font-heading text-[var(--text-main)]">
              {mode === 'register' ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-[var(--text-muted)] mt-2 text-sm">
              {mode === 'register' ? 'Join the WFIT community' : 'Sign in to continue'}
            </p>
          </div>

          <div className="p-8 space-y-6">
            {/* Login / Register Toggle - Switch Aesthetics */}
            {mode !== 'reset' && (
              <div className="flex bg-[var(--bg-main)] p-1 rounded-xl border border-[var(--border-color)]">
                <button
                  onClick={() => setMode('login')}
                  className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${mode === 'login' ? 'bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white shadow-md' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
                >
                  Giriş Yap
                </button>
                <button
                  onClick={() => setMode('register')}
                  className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${mode === 'register' ? 'bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white shadow-md' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
                >
                  Kayıt Ol
                </button>
              </div>
            )}

            {/* Forms */}
            {mode === 'reset' ? (
              <form onSubmit={handlePasswordReset} className="space-y-5 animate-fade-in">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[var(--text-muted)] ml-1">E-Posta Adresi</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"><Mail size={18} /></div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl text-[var(--text-main)] text-sm focus:outline-none focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-glow)] transition-all"
                      placeholder="email@gmail.com"
                    />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-sm">Sıfırlama Linki Gönder</button>
                <button type="button" onClick={() => setMode('login')} className="w-full text-sm text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-all">Geri Dön</button>
              </form>
            ) : (
              <form onSubmit={mode === 'login' ? handleEmailLogin : handleRegister} className="space-y-4 animate-fade-in">
                {mode === 'register' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[var(--text-muted)] ml-1">Kullanıcı Adı</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"><UserIcon size={18} /></div>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl text-[var(--text-main)] text-sm focus:outline-none focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-glow)] transition-all"
                        placeholder="İsim"
                      />
                    </div>
                  </div>
                )}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[var(--text-muted)] ml-1">E-Posta</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"><Mail size={18} /></div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl text-[var(--text-main)] text-sm focus:outline-none focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-glow)] transition-all"
                      placeholder="email@gmail.com"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[var(--text-muted)] ml-1">Şifre</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"><Lock size={18} /></div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-3.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl text-[var(--text-main)] text-sm focus:outline-none focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-glow)] transition-all"
                      placeholder="••••••••"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--accent-primary)]">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                {mode === 'register' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[var(--text-muted)] ml-1">Şifre Onayı</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"><Check size={18} /></div>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`w-full pl-12 pr-4 py-3.5 bg-[var(--bg-main)] border rounded-xl text-[var(--text-main)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-glow)] transition-all ${confirmPassword && password !== confirmPassword ? 'border-red-500' : 'border-[var(--border-color)] focus:border-[var(--accent-primary)]'}`}
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                )}

                <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base mt-2">
                  {loading ? 'İşleniyor...' : (mode === 'login' ? 'Giriş Yap' : 'Kayıt Ol')}
                </button>

                <div className="relative py-3 flex items-center gap-4">
                  <div className="h-px bg-[var(--border-color)] flex-1"></div>
                  <span className="text-xs text-[var(--text-muted)]">veya</span>
                  <div className="h-px bg-[var(--border-color)] flex-1"></div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-full py-3.5 flex items-center justify-center gap-3 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl hover:border-[var(--accent-primary)] transition-all font-medium text-[var(--text-main)] text-sm"
                  >
                    <GoogleIcon />
                    Google ile Bağlan
                  </button>
                </div>

                {mode === 'login' && (
                  <div className="text-center pt-4">
                    <button type="button" onClick={() => setMode('reset')} className="text-sm text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-all">
                      Şifremi Unuttum
                    </button>
                  </div>
                )}
              </form>
            )}
          </div>



        </div>

        {/* Technical Specs Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-[var(--text-muted)] opacity-50">WFIT v5.0 — Secure Connection</p>
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

