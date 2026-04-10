import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ViewState, Language, AppNotification } from '../types';
import { getTranslation } from '../translations';
import {
  LayoutDashboard,
  Calculator,
  Menu,
  X,
  LogOut,
  Settings,
  Sparkles,
  Info,
  Shield,
  Bell,
  Trophy,
  FlaskConical
} from 'lucide-react';


interface LayoutProps {
  children: React.ReactNode;
  activeView: ViewState;
  onNavigate: (view: ViewState) => void;
  onLogout: () => void;
  user: { name: string; photoUrl?: string };
  language: Language;
  syncStatus?: 'synced' | 'syncing' | 'error';
  notifications?: AppNotification[];
  onMarkNotificationRead?: (id: string) => void;
  onClearAllNotifications?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeView, onNavigate, onLogout, user, language, syncStatus, notifications, onMarkNotificationRead, onClearAllNotifications }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);


  const unreadCount = notifications?.filter(n => !n.read).length || 0;

  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      setIsDark(true);
    }
  }, []);

  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);




  // Swipe Gesture Logic - Optimized for 60fps
  const touchStart = useRef<{ x: number, y: number } | null>(null);
  const touchEnd = useRef<{ x: number, y: number } | null>(null);
  const minSwipeDistance = 75; // px required to trigger

  const onTouchStart = (e: React.TouchEvent) => {
    touchEnd.current = null;
    touchStart.current = { x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY };
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEnd.current = { x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY };
  };

  const onTouchEnd = () => {
    if (!touchStart.current || !touchEnd.current) return;
    const distanceX = touchStart.current.x - touchEnd.current.x;
    const distanceY = touchStart.current.y - touchEnd.current.y;
    const isRightSwipe = distanceX < -minSwipeDistance;

    // Ensure horizontal swipe is dominant and sufficiently long
    if (isRightSwipe && Math.abs(distanceX) > Math.abs(distanceY)) {
      setIsSidebarOpen(true);
    }
  };

  const menuItems = useMemo(() => [
    { id: 'dashboard', label: getTranslation(language, 'dashboard'), icon: LayoutDashboard },
    { id: 'calculator', label: getTranslation(language, 'calculators'), icon: Calculator },
    { id: 'about', label: getTranslation(language, 'about_app'), icon: Info },
    { id: 'settings', label: getTranslation(language, 'settings'), icon: Settings },
    { id: 'test', label: 'Diagnostic', icon: FlaskConical },

  ], [language]);
  const handleNav = (id: string) => {
    onNavigate(id as ViewState);
    setIsSidebarOpen(false);
  };

  return (
    <div
      className="min-h-screen flex bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300 font-body"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Mobile Header - Industrial */}
      <div className="md:hidden fixed top-0 w-full bg-[var(--bg-card)] z-50 px-4 py-3 flex justify-between items-center border-b border-[var(--border-color)]">
        <div
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="bg-[var(--accent-primary)] p-1.5 rounded-[var(--radius-sm)]">
            <Sparkles size={18} className="text-[#14110F]" />
          </div>
          <span className="text-xl font-heading tracking-wider text-[var(--accent-primary)]">WFIT</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Notification Bell - Mobile */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => {
                const wasOpen = isNotificationOpen;
                setIsNotificationOpen(!isNotificationOpen);
                if (!wasOpen && notifications && notifications.length > 0) {
                  notifications.forEach(n => {
                    if (!n.read) onMarkNotificationRead?.(n.id);
                  });
                }
              }}
              className="p-2 text-[var(--text-muted)] hover:text-[var(--accent-primary)] relative"
            >
              <Bell size={22} />
              {unreadCount > 0 && !isNotificationOpen ? (
                <span className="absolute top-0 right-0 w-5 h-5 bg-[var(--accent-primary)] text-[#14110F] text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              ) : (
                notifications && notifications.length > 0 && !isNotificationOpen && (
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-[var(--accent-primary)] rounded-full" />
                )
              )}
            </button>

            {/* Notification Dropdown */}
            {isNotificationOpen && (
              <div className="absolute right-0 top-12 w-72 max-h-96 overflow-y-auto bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[var(--radius-main)] shadow-2xl z-50">
                <div className="p-4 border-b border-[var(--border-color)] flex items-center justify-between">
                  <h3 className="font-heading text-lg text-[var(--accent-primary)]">{language === 'tr' ? 'Bildirimler' : 'Notifications'}</h3>
                  {notifications && notifications.length > 0 && (
                    <button
                      onClick={() => onClearAllNotifications?.()}
                      className="text-xs text-[var(--text-muted)] hover:text-[var(--text-main)] font-medium underline"
                    >
                      {language === 'tr' ? 'Tümünü Temizle' : 'Clear All'}
                    </button>
                  )}
                </div>
                <div className="divide-y divide-[var(--border-color)]">
                  {notifications && notifications.length > 0 ? (
                    notifications.slice(0, 10).map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-4 hover:bg-[var(--bg-hover)] transition-colors cursor-pointer ${!notif.read ? 'bg-[rgba(200,123,42,0.05)]' : ''}`}
                        onClick={() => onMarkNotificationRead?.(notif.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-[var(--radius-sm)] ${notif.type === 'achievement' ? 'text-[var(--accent-primary)] bg-[rgba(200,123,42,0.1)]' : 'text-[var(--text-muted)] bg-[rgba(255,255,255,0.05)]'}`}>
                            {notif.type === 'achievement' ? <Trophy size={16} /> : <Bell size={16} />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm text-[var(--text-main)] truncate font-heading tracking-wide is-uppercase">{notif.title}</p>
                            <p className="text-xs text-[var(--text-muted)] mt-0.5 line-clamp-2">{notif.message}</p>
                            <p className="text-[10px] text-[var(--border-strong)] mt-1">
                              {new Date(notif.createdAt).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                          {!notif.read && (
                            <div className="w-2 h-2 rounded-full bg-[var(--accent-primary)] mt-2" />
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center">
                      <Bell size={32} className="mx-auto text-[var(--border-strong)] mb-2" />
                      <p className="text-sm text-[var(--text-muted)]">{language === 'tr' ? 'Bildirim yok' : 'No notifications'}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-[var(--text-main)]">
            <Menu />
          </button>
        </div>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Vintage Workshop */}
      <aside className={`fixed md:sticky top-0 h-screen w-64 z-50 transition-transform duration-300 ease-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} border-r border-[var(--border-strong)] bg-[var(--bg-card)]`}>
        <div className="h-full flex flex-col relative overflow-hidden">

          {/* Logo Area */}
          <div className="p-6 relative z-10 flex justify-between items-center border-b border-[var(--border-color)] bg-[var(--bg-card)]">
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => { handleNav('dashboard'); }}
            >
              <div className="relative bg-[var(--accent-primary)] p-2 rounded-[var(--radius-sm)] group-hover:bg-[#E08C3B] transition-colors">
                <Sparkles size={20} className="text-[#14110F]" />
              </div>
              <div>
                <span className="text-2xl font-heading tracking-widest text-[var(--text-main)] block leading-none group-hover:text-[var(--accent-primary)] transition-colors">WFIT</span>
                <span className="text-[10px] text-[var(--text-muted)] font-bold tracking-[0.2em] uppercase block mt-1">WORKSHOP</span>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors">
              <X size={24} />
            </button>
          </div>

          {/* Navigation - Industrial Dense List */}
          <nav className="flex-1 overflow-y-auto custom-scrollbar relative z-10 py-6 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center gap-3 px-5 py-2.5 transition-all duration-200 group relative border-l-2
                  ${activeView === item.id
                    ? 'border-[var(--accent-primary)] bg-[rgba(200,123,42,0.08)]'
                    : 'border-transparent hover:border-[var(--border-strong)] hover:bg-[var(--bg-hover)]'
                  }`}
              >
                {/* Icon Box */}
                <div className={`
                  relative z-10 w-8 h-8 flex items-center justify-center rounded-[2px] border transition-all duration-200
                  ${activeView === item.id
                    ? 'bg-[var(--accent-primary)] border-[var(--accent-primary)] text-[#14110F]' // Active: Solid Orange Box
                    : 'bg-[#14110F] border-[var(--border-color)] text-[var(--text-muted)] group-hover:border-[var(--accent-primary)] group-hover:text-[var(--accent-primary)]' // Inactive: Dark Box
                  }
                `}>
                  <item.icon size={16} strokeWidth={activeView === item.id ? 2.5 : 2} />
                </div>

                {/* Text Label */}
                <span className={`
                  relative z-10 text-base font-heading tracking-widest uppercase pt-0.5 transition-all duration-200 text-left
                  ${activeView === item.id
                    ? 'text-[var(--text-main)] translate-x-1'
                    : 'text-[var(--text-muted)] group-hover:text-[var(--text-main)] group-hover:translate-x-1'
                  }
                `}>
                  {item.label}
                </span>

                {/* Active Glow Effect (Optional subtle detail) */}
                {activeView === item.id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-primary)]/5 to-transparent pointer-events-none" />
                )}
              </button>
            ))}
          </nav>

          {/* Bottom/Services */}
          <div className="p-4 relative z-10 space-y-3 bg-[var(--bg-card)] border-t border-[var(--border-color)]">

            {/* Sync Status */}
            {syncStatus && (
              <div className={`flex items-center justify-center gap-2 py-1.5 px-3 rounded-[var(--radius-sm)] border text-[10px] font-bold uppercase tracking-wider ${syncStatus === 'synced' ? 'bg-[#1A2F1A] border-[#2E5C2E] text-[#4CAF50]' :
                syncStatus === 'syncing' ? 'bg-[#1A2533] border-[#2E4266] text-[#64B5F6]' :
                  'bg-[#331A1A] border-[#662E2E] text-[#EF5350]'
                }`}>
                <div className={`w-1.5 h-1.5 rounded-full ${syncStatus === 'synced' ? 'bg-[#4CAF50]' :
                  syncStatus === 'syncing' ? 'bg-[#64B5F6] animate-ping' :
                    'bg-[#EF5350]'}`}
                />
                {syncStatus === 'synced' ? getTranslation(language, 'data_synced') :
                  syncStatus === 'syncing' ? getTranslation(language, 'syncing') :
                    getTranslation(language, 'sync_error')}
              </div>
            )}

            {/* User Profile Card */}
            <div onClick={() => handleNav('settings')} className="relative cursor-pointer group border border-[var(--border-color)] bg-[var(--bg-main)] p-3 md:p-2 rounded-[var(--radius-sm)] hover:border-[var(--accent-primary)] transition-colors">
              <div className="flex items-center gap-4 md:gap-3">
                <div className="w-11 h-11 md:w-9 md:h-9 rounded-[var(--radius-sm)] bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-center overflow-hidden">
                  {user.photoUrl ? (
                    <img src={user.photoUrl} className="w-full h-full object-cover" alt={user.name} />
                  ) : (
                    <span className="font-bold text-[var(--accent-primary)] text-lg">{user.name[0]}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base md:text-sm font-bold text-[var(--text-main)] truncate font-heading tracking-wide uppercase">{user.name}</p>
                  <p className="text-[10px] md:text-[9px] font-bold text-[#14110F] bg-[var(--accent-primary)] px-2 md:px-1.5 py-0.5 rounded-[2px] inline-block mt-1 md:mt-0.5">MEMBER</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); onLogout(); }}
                  className="p-1.5 text-[var(--text-muted)] hover:text-[#EF5350] transition-colors"
                >
                  <LogOut size={20} className="md:w-4 md:h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 mt-16 md:mt-0 overflow-x-hidden relative">
        {/* Desktop Header Bar */}
        <div className="hidden md:flex justify-end items-center mb-6 border-b border-[var(--border-color)] pb-4">
          <div className="relative" ref={notificationRef}>
            {/* Bell Button */}
            <button
              onClick={() => {
                const wasOpen = isNotificationOpen;
                setIsNotificationOpen(!isNotificationOpen);
                if (!wasOpen && notifications && notifications.length > 0) {
                  notifications.forEach(n => {
                    if (!n.read) onMarkNotificationRead?.(n.id);
                  });
                }
              }}
              className="group relative p-2.5 rounded-[var(--radius-sm)] border border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[var(--accent-primary)] transition-all"
            >
              <Bell size={20} className={`transition-colors ${isNotificationOpen ? 'text-[var(--accent-primary)]' : 'text-[var(--text-muted)] group-hover:text-[var(--text-main)]'}`} />

              {/* Notification badge */}
              {unreadCount > 0 && !isNotificationOpen ? (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[var(--accent-primary)] text-[#14110F] text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce shadow-sm">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              ) : (
                notifications && notifications.length > 0 && !isNotificationOpen && (
                  <span className="absolute top-0 right-0 w-2 h-2 bg-[var(--accent-primary)] rounded-full" />
                )
              )}
            </button>

            {/* Desktop Notification Dropdown */}
            {isNotificationOpen && (
              <div className="absolute right-0 top-14 w-80 max-h-[500px] overflow-hidden rounded-[var(--radius-main)] shadow-2xl bg-[var(--bg-card)] border border-[var(--accent-primary)] z-50 animate-fade-in">
                {/* Header */}
                <div className="p-4 border-b border-[var(--border-strong)] bg-[var(--bg-hover)] flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Bell size={18} className="text-[var(--accent-primary)]" />
                    <h3 className="font-heading tracking-wide text-lg text-[var(--text-main)]">{language === 'tr' ? 'Bildirimler' : 'Notifications'}</h3>
                  </div>
                  {notifications && notifications.length > 0 && (
                    <button
                      onClick={() => onClearAllNotifications?.()}
                      className="px-3 py-1 bg-[var(--bg-main)] border border-[var(--border-color)] hover:border-[var(--accent-primary)] rounded-[var(--radius-sm)] text-[10px] text-[var(--text-muted)] font-bold uppercase transition-all"
                    >
                      {language === 'tr' ? 'Temizle' : 'Clear'}
                    </button>
                  )}
                </div>

                {/* Notifications List */}
                <div className="bg-[var(--bg-card)] max-h-[350px] overflow-y-auto custom-scrollbar">
                  {notifications && notifications.length > 0 ? (
                    <div className="divide-y divide-[var(--border-color)]">
                      {notifications.slice(0, 15).map((notif) => (
                        <div
                          key={notif.id}
                          className={`group relative p-4 cursor-pointer transition-colors hover:bg-[var(--bg-hover)] ${!notif.read
                            ? 'bg-[rgba(200,123,42,0.03)]'
                            : ''
                            }`}
                          onClick={() => onMarkNotificationRead?.(notif.id)}
                        >
                          <div className="flex items-start gap-4">
                            <div className={`relative p-2 rounded-[var(--radius-sm)] border ${notif.type === 'achievement'
                              ? 'border-[#C87B2A] text-[#C87B2A] bg-[#C87B2A]/10'
                              : 'border-[var(--border-color)] text-[var(--text-muted)] bg-[var(--bg-main)]'
                              }`}>
                              {notif.type === 'achievement' ? <Trophy size={16} /> : <Bell size={16} />}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="font-bold text-sm text-[var(--text-main)] font-heading tracking-wide uppercase">{notif.title}</p>
                                {!notif.read && (
                                  <span className="px-1.5 py-0.5 bg-[var(--accent-primary)] text-[#14110F] text-[9px] font-bold rounded-[2px] uppercase">
                                    {language === 'tr' ? 'Yeni' : 'New'}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-[var(--text-muted)] mt-1 line-clamp-2">{notif.message}</p>
                              <p className="text-[10px] text-[var(--text-muted)] opacity-60 mt-2 font-mono">
                                {new Date(notif.createdAt).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-12 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full border border-[var(--border-color)] bg-[var(--bg-main)] flex items-center justify-center">
                        <Bell size={24} className="text-[var(--text-muted)]" />
                      </div>
                      <p className="text-[var(--text-muted)] font-medium font-heading tracking-wide">{language === 'tr' ? 'Henüz bildirim yok' : 'No notifications'}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="max-w-7xl mx-auto space-y-8 pb-10">
          {children}
        </div>
      </main>
    </div>
  );
};
