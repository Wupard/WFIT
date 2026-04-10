import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { getTranslation } from './translations';
import { Dashboard } from './components/Dashboard';
import { WeightTracker } from './components/WeightTracker';
import { Calculators } from './components/Calculators';
import { Settings } from './components/Settings';
import { Login } from './components/Login';
import { About } from './components/About';
import { AIChatbot } from './components/AIChatbot';
import { TestPage } from './components/TestPage';
import { User, WeightLog, ViewState, PRCalcResult, AppSettings, HistoryEvent, ExerciseHistory, ExerciseLogEntry, BodyMeasurementLog, StickyNote, AppNotification } from './types';
// FIREBASE IMPORTLARI
import { auth, saveUserData, getUserData, logoutUser } from './services/firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Initial Mock Data
const MOCK_USER: User = {
  id: '1',
  name: 'Alex Fitness',
  email: 'alex@wfit.com',
  photoUrl: 'https://picsum.photos/200',
  targetWeight: 80.0,
  streak: 0,
  lastWorkoutDate: '2023-10-01'
};

const INITIAL_WEIGHT_LOGS: WeightLog[] = [];







// Defaults moved to defaults.ts



export const App = () => {
  // --- STATE ---
  const [user, setUser] = useState<User | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [view, setView] = useState<ViewState>('dashboard');
  const [settings, setSettings] = useState<AppSettings>({ language: 'tr', theme: 'dark' });

  // Data States
  const [weightLogs, setWeightLogs] = useState<WeightLog[]>(INITIAL_WEIGHT_LOGS);
  const [measurementLogs, setMeasurementLogs] = useState<BodyMeasurementLog[]>([]);
  const [exerciseHistory, setExerciseHistory] = useState<ExerciseHistory>({});
  const [lastPr, setLastPr] = useState<PRCalcResult | undefined>(undefined);
  const [historyLog, setHistoryLog] = useState<HistoryEvent[]>([]);
  const [notes, setNotes] = useState<StickyNote[]>([]); // Notes State
  const [notifications, setNotifications] = useState<AppNotification[]>([]); // Notifications State

  // Simple Sync States
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'error'>('synced');
  const [targetWeight, setTargetWeight] = useState<number | undefined>(undefined);
  const [streak, setStreak] = useState<number>(0);
  const [lastWorkoutDate, setLastWorkoutDate] = useState<string | undefined>(undefined);


  // Sync State


  // 1. FIREBASE AUTH LISTENER (GİRİŞ KONTROLÜ)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Kullanıcı giriş yapmış, verileri çekelim
        // Önce LocalStorage'dan "user" bilgisini kontrol et (özellikle photoUrl için)
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
              // Ensure legacy or missing fields handled
              if (parsedUser.unlockedAchievements) {
                initialUser.unlockedAchievements = parsedUser.unlockedAchievements;
              }
            }
          }
        } catch (e) { console.error("LS user load error", e) }

        setUser(initialUser);

        // Yardımcı fonksiyon: LocalStorage'dan verileri yükle
        const loadFromLocalStorage = () => {
          console.log("Firebase başarısız veya veri yok, LocalStorage kullanılıyor...");
          try {
            const lsWeightLogs = localStorage.getItem('weightLogs');
            if (lsWeightLogs) setWeightLogs(JSON.parse(lsWeightLogs));
            const lsHistoryLog = localStorage.getItem('historyLog');
            if (lsHistoryLog) setHistoryLog(JSON.parse(lsHistoryLog));
            const lsLastPr = localStorage.getItem('lastPr');
            if (lsLastPr) setLastPr(JSON.parse(lsLastPr));
            const lsSettings = localStorage.getItem('settings');
            if (lsSettings) setSettings(JSON.parse(lsSettings));
            const lsTargetWeight = localStorage.getItem('targetWeight');
            if (lsTargetWeight) setTargetWeight(JSON.parse(lsTargetWeight));
            const lsStreak = localStorage.getItem('streak');
            if (lsStreak) setStreak(JSON.parse(lsStreak));
            const lsLastWorkoutDate = localStorage.getItem('lastWorkoutDate');
            if (lsLastWorkoutDate) setLastWorkoutDate(JSON.parse(lsLastWorkoutDate));
            const lsExerciseHistory = localStorage.getItem('exerciseHistory');
            if (lsExerciseHistory) setExerciseHistory(JSON.parse(lsExerciseHistory));
            const lsMeasurementLogs = localStorage.getItem('measurementLogs');
            if (lsMeasurementLogs) setMeasurementLogs(JSON.parse(lsMeasurementLogs));
            const lsNotes = localStorage.getItem('notes');
            if (lsNotes) setNotes(JSON.parse(lsNotes));
            const lsNotifications = localStorage.getItem('notifications');
            if (lsNotifications) setNotifications(JSON.parse(lsNotifications));
          } catch (e) {
            console.error('LocalStorage yükleme hatası:', e);
          }
        };

        // Firestore'dan verileri al
        try {
          const savedData = await getUserData(currentUser.uid);
          if (savedData) {
            // Firestore'da veri varsa, state'leri güncelle
            if (savedData.weightLogs) setWeightLogs(savedData.weightLogs);
            if (savedData.historyLog) setHistoryLog(savedData.historyLog);
            if (savedData.lastPr) setLastPr(savedData.lastPr);
            if (savedData.settings) setSettings(savedData.settings);
            if (savedData.targetWeight != null) setTargetWeight(savedData.targetWeight);
            if (savedData.streak != null) setStreak(savedData.streak);
            if (savedData.lastWorkoutDate) setLastWorkoutDate(savedData.lastWorkoutDate);
            if (savedData.exerciseHistory) setExerciseHistory(savedData.exerciseHistory);
            if (savedData.measurementLogs) setMeasurementLogs(savedData.measurementLogs);
            if (savedData.notes) setNotes(savedData.notes);
            if (savedData.notifications) setNotifications(savedData.notifications);



            // Kullanıcı profil fotosunu ve ölçüleri de Firestore'dan alabiliriz
            if (savedData.photoUrl || savedData.measurements) {
              setUser(u => {
                if (!u) return u;
                return {
                  ...u,
                  ...(savedData.photoUrl && { photoUrl: savedData.photoUrl }),
                  ...(savedData.measurements && { measurements: savedData.measurements })
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







  // 1.8 HISTORY SANITIZATION (Remove Duplicates)
  useEffect(() => {
    if (!loadingData && user && exerciseHistory) {
      setExerciseHistory(prev => {
        let hasChanges = false;
        const newHistory = { ...prev };

        Object.keys(newHistory).forEach(key => {
          const logs = newHistory[key];
          if (!logs || logs.length === 0) return;

          const uniqueLogs: ExerciseLogEntry[] = [];
          const seen = new Set<string>();

          logs.forEach(log => {
            // Create a unique key for each log entry
            // Using date, weight, and reps. 
            // We use 'reps' as string comparison.
            const uniqueKey = `${log.date}-${log.weight}-${log.reps}`;

            if (!seen.has(uniqueKey)) {
              seen.add(uniqueKey);
              uniqueLogs.push(log);
            }
          });

          if (uniqueLogs.length !== logs.length) {
            hasChanges = true;
            newHistory[key] = uniqueLogs;
          }
        });

        if (hasChanges) {
          console.log("Duplicate exercise logs cleaned up.");
          return newHistory;
        }
        return prev;
      });
    }
  }, [loadingData, user]);

  // 2. OTOMATİK VERİ KAYDETME (AUTO SAVE)
  useEffect(() => {
    if (user && !loadingData) {
      setSyncStatus('syncing');
      const timeout = setTimeout(async () => {
        const dataToSave = {
          weightLogs,
          historyLog,
          lastPr,
          settings,
          targetWeight,
          streak,
          lastWorkoutDate,
          exerciseHistory,
          measurementLogs,
          // user specific fields that we want to save to the main doc for easy access
          photoUrl: user?.photoUrl,
          measurements: user?.measurements,
          notes,
          notifications
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
        // User'a özel alanları da ayrıca bir anahtarda tutalım ki yüklerken karışmasın veya yukarıdaki loop yeterli olmuyorsa
        try {
          localStorage.setItem('userParams', JSON.stringify({
            photoUrl: user.photoUrl,
            id: user.id,
            measurements: user.measurements
          }));
        } catch (e) { }

      }, 2000); // 2 saniye debounce
      return () => clearTimeout(timeout);
    }
  }, [weightLogs, historyLog, lastPr, settings, targetWeight, streak, lastWorkoutDate, user, loadingData, notes]);

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
  useEffect(() => {
    const welcomeShown = localStorage.getItem('welcome_shown');

    // Sadece daha önce gösterilmediyse ekle
    if (user && !loadingData && !welcomeShown) {
      const welcomeNotif: AppNotification = {
        id: 'welcome',
        title: settings.language === 'tr' ? 'Hoş Geldin! 🎉' : 'Welcome! 🎉',
        message: settings.language === 'tr'
          ? `Merhaba ${user.name}! Antrenmanına bugün de devam et.`
          : `Hello ${user.name}! Keep up with your training today.`,
        type: 'success',
        createdAt: new Date().toISOString(),
        read: false
      };

      setNotifications(prev => [welcomeNotif, ...prev]);
      localStorage.setItem('welcome_shown', 'true');
    }
  }, [user, loadingData]);

  const handleLogin = (loggedInUser: User) => {
    // Login.tsx'ten gelen tetikleme (State zaten onAuthStateChanged ile güncelleniyor ama UX için tutabiliriz)
    setUser(loggedInUser);
  };



  const handleLogout = async () => {
    await logoutUser(); // Firebase Logout
    setUser(null);
    setView('dashboard');
  };

  const addWeightLog = (weight: number) => {
    const newLog = {
      date: new Date().toISOString().split('T')[0],
      weight
    };
    setWeightLogs([...weightLogs, newLog]);
    setHistoryLog(prev => [{
      id: `h_${Date.now()}`,
      date: newLog.date,
      type: 'weight',
      title: 'Weighed In',
      details: `${weight} kg`
    }, ...prev]);
  };

  const handleClearWeightLogs = () => {
    if (window.confirm(getTranslation(settings.language, 'confirm_clear_history'))) {
      setWeightLogs([]);
    }
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







  const handleUpdateProfile = (photoUrl?: string, measurements?: any) => {
    if (user) {
      // Create history log if measurements are updated
      if (measurements) {
        setHistoryLog(prev => [{
          id: `hm_${Date.now()}`,
          date: new Date().toISOString(), // Full timestamp as requested
          type: 'weight', // Reusing weight or could use 'measurement' if added to types
          title: 'Measurements Updated',
          details: 'Body measurements recorded'
        }, ...prev]);
      }

      const updated = {
        ...user,
        ...(photoUrl !== undefined && { photoUrl }),
        ...(measurements !== undefined && { measurements })
      };
      setUser(updated);
      // Firebase save is handled by auto-save effect
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



  const handleLogExercise = (exerciseName: string, weight: number, reps: string) => {
    const today = new Date().toISOString().split('T')[0];

    // Check for duplicates before adding
    const currentLogs = exerciseHistory[exerciseName] || [];
    const isDuplicate = currentLogs.some(
      log => log.date === today && log.weight === weight && log.reps === reps
    );

    if (isDuplicate) {
      console.log("Duplicate log prevented:", exerciseName);
      return;
    }

    const newLog: ExerciseLogEntry = { date: today, weight, reps };

    setExerciseHistory(prev => {
      const existing = prev[exerciseName] || [];
      return {
        ...prev,
        [exerciseName]: [...existing, newLog]
      };
    });

    const historyItem: HistoryEvent = {
      id: Date.now().toString(),
      date: today,
      type: 'workout',
      title: `${exerciseName} Logged`,
      details: `${weight}kg x ${reps}`
    };
    setHistoryLog(prev => [historyItem, ...prev]);
  };

  const handleLogMeasurement = (measurements: any) => {
    const today = new Date().toISOString().split('T')[0];
    const newLog: BodyMeasurementLog = { date: today, measurements };

    // Update logs
    setMeasurementLogs(prev => [...prev, newLog]);

    // Update user profile measurements
    setUser(u => u ? { ...u, measurements } : null);

    // Add history event
    const historyItem: HistoryEvent = {
      id: Date.now().toString(),
      date: today,
      type: 'weight', // Re-using weight type icon for now
      title: 'Measurements Updated',
      details: 'Body measurements logged'
    };
    setHistoryLog(prev => [historyItem, ...prev]);
  };

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

  // Notification Handlers
  const addNotification = (title: string, message: string, type: AppNotification['type'] = 'info') => {
    const newNotification: AppNotification = {
      id: Date.now().toString(),
      title,
      message,
      type,
      createdAt: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const handleMarkNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <Layout
      activeView={view}
      onNavigate={setView}
      onLogout={handleLogout}
      user={user}
      language={settings.language}
      syncStatus={syncStatus}
      notifications={notifications}
      onMarkNotificationRead={handleMarkNotificationRead}
      onClearAllNotifications={handleClearAllNotifications}
    >
      {view === 'dashboard' && <Dashboard user={{ ...user, streak }} weightLogs={weightLogs} lastPr={lastPr} targetWeight={targetWeight} onNavigate={setView} language={settings.language} notes={notes} onAddNote={handleAddNote} onDeleteNote={handleDeleteNote} />}
      {view === 'weight' && (
        <WeightTracker
          logs={weightLogs}
          measurementLogs={measurementLogs}
          user={user}
          onAddLog={addWeightLog}
          onAddMeasurement={handleLogMeasurement}
          targetWeight={targetWeight}
          onUpdateTargetWeight={setTargetWeight}
          onClearLogs={handleClearWeightLogs}
          language={settings.language}
        />
      )}
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
      {view === 'test' && <TestPage language={settings.language} />}



      <AIChatbot user={user} />
    </Layout>
  );
};

export default App;
