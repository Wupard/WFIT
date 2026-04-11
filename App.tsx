import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { getTranslation } from './translations';
import { Dashboard } from './components/Dashboard';

import { Calculators } from './components/Calculators';
import { Settings } from './components/Settings';
import { Login } from './components/Login';
import { About } from './components/About';
import { AIChatbot } from './components/AIChatbot';
import { TestPage } from './components/TestPage';
import { User, ViewState, PRCalcResult, AppSettings, HistoryEvent, StickyNote, AppNotification } from './types';
// FIREBASE IMPORTLARI
import { auth, saveUserData, getUserData, logoutUser } from './services/firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Initial Mock Data
const MOCK_USER: User = {
  id: '1',
  name: 'Alex Fitness',
  email: 'alex@wfit.com',
  photoUrl: 'https://picsum.photos/200'
};

export const App = () => {
  // --- STATE ---
  const [user, setUser] = useState<User | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [view, setView] = useState<ViewState>('dashboard');
  const [settings, setSettings] = useState<AppSettings>({ language: 'tr', theme: 'dark' });

  // Data States
  const [lastPr, setLastPr] = useState<PRCalcResult | undefined>(undefined);
  const [historyLog, setHistoryLog] = useState<HistoryEvent[]>([]);
  const [notes, setNotes] = useState<StickyNote[]>([]); // Notes State

  // Simple Sync States
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'error'>('synced');


  // 1. FIREBASE AUTH LISTENER (GİRİŞ KONTROLÜ)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Kullanıcı giriş yapmış, verileri çekelim
        let initialUser: User = {
          id: currentUser.uid,
          name: currentUser.displayName || 'User',
          email: currentUser.email || '',
          photoUrl: currentUser.photoURL || undefined
        };

        try {
          const lsUser = localStorage.getItem('userParams');
          if (lsUser) {
            const parsedUser = JSON.parse(lsUser);
            if (parsedUser.id === currentUser.uid) {
              initialUser = { ...initialUser, ...parsedUser };
            }
          }
        } catch (e) { console.error("LS user load error", e) }

        setUser(initialUser);

        // Yardımcı fonksiyon: LocalStorage'dan verileri yükle
        const loadFromLocalStorage = () => {
          console.log("Firebase başarısız veya veri yok, LocalStorage kullanılıyor...");
          try {
            const lsHistoryLog = localStorage.getItem('historyLog');
            if (lsHistoryLog) setHistoryLog(JSON.parse(lsHistoryLog));
            const lsLastPr = localStorage.getItem('lastPr');
            if (lsLastPr) setLastPr(JSON.parse(lsLastPr));
            const lsSettings = localStorage.getItem('settings');
            if (lsSettings) setSettings(JSON.parse(lsSettings));
            const lsNotes = localStorage.getItem('notes');
            if (lsNotes) setNotes(JSON.parse(lsNotes));
          } catch (e) {
            console.error('LocalStorage yükleme hatası:', e);
          }
        };

        // Firestore'dan verileri al
        try {
          const savedData = await getUserData(currentUser.uid);
          if (savedData) {
            // Firestore'da veri varsa, state'leri güncelle
            if (savedData.historyLog) setHistoryLog(savedData.historyLog);
            if (savedData.lastPr) setLastPr(savedData.lastPr);
            if (savedData.settings) setSettings(savedData.settings);
            if (savedData.notes) setNotes(savedData.notes);

            if (savedData.photoUrl) {
              setUser(u => {
                if (!u) return u;
                return {
                  ...u,
                  photoUrl: savedData.photoUrl
                };
              });
            }
          } else {
            // Firestore'da veri yoksa LocalStorage dene
            loadFromLocalStorage();
          }
        } catch (error) {
          console.error("Veri yükleme hatası:", error);
          // Hata durumunda LocalStorage DENE
          loadFromLocalStorage();
        }
      } else {
        // Kullanıcı yoksa veya çıkış yaptıysa
        setUser(null);
      }
      setLoadingData(false);
    });

    // Theme Local Storage Check (Yedek)
    if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setSettings(s => ({ ...s, theme: 'dark' }));
    } else {
      document.documentElement.classList.remove('dark');
      setSettings(s => ({ ...s, theme: 'light' }));
    }

    return () => unsubscribe();
  }, []);


  // 2. OTOMATİK VERİ KAYDETME (AUTO SAVE)
  useEffect(() => {
    if (user && !loadingData) {
      setSyncStatus('syncing');
      const timeout = setTimeout(async () => {
        const dataToSave = {
          lastPr,
          settings,
          photoUrl: user?.photoUrl,
          notes,
          historyLog
        };

        try {
          await saveUserData(user.id, dataToSave);
          console.log("Veriler buluta senkronize edildi.");
          setSyncStatus('synced');
        } catch (error) {
          console.error("Sync error:", error);
          setSyncStatus('error');
        }

        // LocalStorage fallback (ve user params)
        Object.entries(dataToSave).forEach(([key, value]) => {
          try {
            localStorage.setItem(key, JSON.stringify(value));
          } catch (e) {
            // ignore
          }
        });
        try {
          localStorage.setItem('userParams', JSON.stringify({
            photoUrl: user.photoUrl,
            id: user.id
          }));
        } catch (e) { }

      }, 2000); // 2 saniye debounce
      return () => clearTimeout(timeout);
    }
  }, [historyLog, lastPr, settings, user, loadingData, notes]);

  // Theme Değişikliği
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [settings.theme]);

  // Welcome notification on first load (must be before early returns)
  // Welcome state tracking
  useEffect(() => {
    const welcomeShown = localStorage.getItem('welcome_shown');
    if (user && !loadingData && !welcomeShown) {
      localStorage.setItem('welcome_shown', 'true');
    }
  }, [user, loadingData, settings.language]);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = async () => {
    await logoutUser(); // Firebase Logout
    setUser(null);
    setView('dashboard');
  };

  const handleSavePr = (pr: PRCalcResult) => {
    setLastPr(pr);
    setHistoryLog(prev => [{
      id: `hp_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      type: 'workout',
      title: 'New 1RM Record',
      details: `${pr.oneRepMax} kg (Est.)`
    }, ...prev]);
  };

  const handleUpdateProfile = (photoUrl?: string) => {
    if (user) {
      const updated = {
        ...user,
        ...(photoUrl !== undefined && { photoUrl })
      };
      setUser(updated);
    }
  };

  if (loadingData) {
    return (
      <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] flex items-center justify-center relative overflow-hidden font-body">
         <div className="texture-overlay"></div>
        <div className="flex flex-col items-center gap-4 z-10">
          <div className="w-12 h-12 border-4 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[var(--text-muted)] animate-pulse tracking-widest uppercase font-heading text-xl">{getTranslation(settings.language, 'loading')}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const handleAddNote = (title: string, text: string, color: string) => {
    const newNote: StickyNote = {
      id: Date.now().toString(),
      title,
      text,
      createdAt: new Date().toISOString(),
      color
    };
    setNotes([...notes, newNote]);
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };



  return (
    <Layout
      activeView={view}
      onNavigate={setView}
      onLogout={handleLogout}
      user={user}
      language={settings.language}
      syncStatus={syncStatus}
    >
      {view === 'dashboard' && <Dashboard user={user} lastPr={lastPr} onNavigate={setView} language={settings.language} notes={notes} onAddNote={handleAddNote} onDeleteNote={handleDeleteNote} />}

      {view === 'calculator' && <Calculators onSavePr={handleSavePr} language={settings.language} />}
      {view === 'settings' && (
        <Settings
          user={user}
          settings={settings}
          onUpdateSettings={setSettings}
          onUpdateProfile={handleUpdateProfile}
          onLogout={handleLogout}
        />
      )}
      {view === 'about' && <About language={settings.language} />}

      <AIChatbot user={user} />
    </Layout>
  );
};

export default App;
