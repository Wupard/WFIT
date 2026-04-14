import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { getTranslation } from './translations';
import { Dashboard } from './components/Dashboard';

import { Calculators } from './components/Calculators';
import { Settings } from './components/Settings';
import { Login } from './components/Login';
import { About } from './components/About';
import { AIChatbot } from './components/AIChatbot';
import { User, ViewState, PRCalcResult, AppSettings, HistoryEvent, StickyNote } from './types';
// FIREBASE IMPORTLARI
import { auth, db, saveUserData, logoutUser } from './services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { onSnapshot, doc } from 'firebase/firestore';

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


  // 1. FIREBASE AUTH LISTENER & REAL-TIME SYNC
  useEffect(() => {
    let unsubscribeSnapshot: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          id: currentUser.uid,
          name: currentUser.displayName || 'User',
          email: currentUser.email || '',
          photoUrl: currentUser.photoURL || undefined
        });

        // Real-time listener setup
        unsubscribeSnapshot = onSnapshot(doc(db, "users", currentUser.uid), (docSnap) => {
          if (docSnap.exists()) {
            const savedData = docSnap.data();
            if (savedData.historyLog) setHistoryLog(savedData.historyLog);
            if (savedData.lastPr) setLastPr(savedData.lastPr);
            if (savedData.settings) setSettings(prev => ({ ...prev, ...savedData.settings }));
            if (savedData.notes) setNotes(savedData.notes);
            
            // LocalStorage sync
            Object.entries(savedData).forEach(([key, value]) => {
              try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
            });
          }
          setLoadingData(false);
        }, (error) => {
          console.error("Snapshot error:", error);
          setLoadingData(false);
        });

      } else {
        setUser(null);
        setLoadingData(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
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
          setSyncStatus('synced');
        } catch (error) {
          console.error("Sync error:", error);
          setSyncStatus('error');
        }

        // LocalStorage fallback
        Object.entries(dataToSave).forEach(([key, value]) => {
          try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
        });
        
        try {
          localStorage.setItem('userParams', JSON.stringify({
            photoUrl: user.photoUrl,
            id: user.id
          }));
        } catch (e) { }

      }, 2000); 
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

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = async () => {
    await logoutUser(); 
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
      setUser(prev => prev ? { ...prev, ...(photoUrl !== undefined && { photoUrl }) } : null);
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
    setNotes(prev => [...prev, newNote]);
  };

  const handleDeleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
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
