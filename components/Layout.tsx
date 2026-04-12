import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ViewState, Language } from '../types';
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
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeView: ViewState;
  onNavigate: (view: ViewState) => void;
  onLogout: () => void;
  user: { name: string; photoUrl?: string };
  language: Language;
  syncStatus?: 'synced' | 'syncing' | 'error';
}

export const Layout: React.FC<LayoutProps> = ({ children, activeView, onNavigate, onLogout, user, language, syncStatus }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // Swipe & Drag Logic
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const handleDragEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 75; // px

    if (distance < -minSwipeDistance) {
      // Swiped right -> Open menu or uncollapse
      if (window.innerWidth < 768) setIsSidebarOpen(true);
      else setIsSidebarCollapsed(false);
    } else if (distance > minSwipeDistance) {
      // Swiped left -> Close menu or collapse
      if (window.innerWidth < 768) setIsSidebarOpen(false);
      else setIsSidebarCollapsed(true);
    }
    
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Dynamic Background Icon based on view
  const ViewBackgroundIcon = useMemo(() => {
    switch (activeView) {
      case 'dashboard': return LayoutDashboard;
      case 'calculator': return Calculator;
      case 'settings': return Settings;
      case 'about': return Info;
      default: return Sparkles;
    }
  }, [activeView]);

  const menuItems = useMemo(() => [
    { id: 'dashboard', label: getTranslation(language, 'dashboard'), icon: LayoutDashboard },
    { id: 'calculator', label: getTranslation(language, 'calculators'), icon: Calculator },
    { id: 'about', label: getTranslation(language, 'about_app'), icon: Info },
    { id: 'settings', label: getTranslation(language, 'settings'), icon: Settings },
  ], [language]);

  const handleNav = (id: string) => {
    onNavigate(id as ViewState);
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  return (
    <div 
      className="min-h-screen flex bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300 font-body relative"
      onTouchStart={(e) => { touchStartX.current = e.targetTouches[0].clientX; touchEndX.current = null; }}
      onTouchMove={(e) => { touchEndX.current = e.targetTouches[0].clientX; }}
      onTouchEnd={handleDragEnd}
      onMouseDown={(e) => { touchStartX.current = e.clientX; touchEndX.current = null; }}
      onMouseMove={(e) => { if (e.buttons === 1) touchEndX.current = e.clientX; }}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
    >
      
      {/* Dynamic Silhoutte Background Icon */}
      <div className="view-bg-icon">
        <ViewBackgroundIcon size="1em" strokeWidth={1} />
      </div>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full bg-[var(--bg-card)]/80 backdrop-blur-md z-50 px-4 py-3 flex justify-between items-center border-b border-[var(--border-color)]">
        <div className="flex items-center gap-2" onClick={() => handleNav('dashboard')}>
          <div className="bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] p-1.5 rounded-xl">
            <Sparkles size={18} className="text-white" />
          </div>
          <span className="text-xl font-heading font-bold text-[var(--text-main)]">WFIT</span>
        </div>
        <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-[var(--text-main)]">
          <Menu />
        </button>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className={`
        fixed top-0 bottom-0 left-0 z-50 transition-all duration-300 ease-in-out flex
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        ${isSidebarCollapsed ? 'w-24' : 'w-72 sm:w-80'}
      `}>
        {/* Collapse Toggle - Desktop Only - Moved outside overflow-hidden container */}
        <button 
          onClick={(e) => { e.stopPropagation(); setIsSidebarCollapsed(!isSidebarCollapsed); }}
          className={`
            hidden md:flex absolute -right-4 top-12 w-8 h-8 bg-[var(--accent-primary)] text-white rounded-full items-center justify-center border-4 border-[var(--bg-main)] shadow-xl z-[100] hover:scale-110 active:scale-95 transition-transform duration-200
          `}
        >
          {isSidebarCollapsed ? <ChevronRight size={16} strokeWidth={3} /> : <ChevronLeft size={16} strokeWidth={3} />}
        </button>

        <aside className="w-full min-h-full border-r border-[var(--border-strong)] bg-[var(--bg-card)]/80 backdrop-blur-2xl flex flex-col relative overflow-hidden transition-all duration-300">

          {/* Logo Area */}
          <div className={`p-6 flex items-center gap-3 border-b border-[var(--border-color)] shrink-0 ${isSidebarCollapsed ? 'justify-center' : ''}`}>
            <div className="bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] p-2.5 rounded-2xl shadow-lg shadow-[var(--accent-glow)]">
              <Sparkles size={22} className="text-white" />
            </div>
            {!isSidebarCollapsed && (
              <div>
                <span className="text-2xl font-heading font-black tracking-tight text-[var(--text-main)] leading-none">WFIT</span>
                <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest block mt-1">Fitness Hub</span>
              </div>
            )}
            {isSidebarOpen && (
              <button onClick={() => setIsSidebarOpen(false)} className="md:hidden ml-auto text-[var(--text-muted)]">
                <X size={24} />
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-8 space-y-2 px-3 custom-scrollbar">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`
                  w-full flex items-center gap-3 p-3 rounded-2xl transition-all duration-300 group relative
                  ${activeView === item.id ? 'bg-[var(--accent-glow)] text-[var(--accent-primary)]' : 'text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-main)]'}
                  ${isSidebarCollapsed ? 'justify-center' : ''}
                `}
              >
                <item.icon size={22} className={`shrink-0 transition-transform duration-300 ${activeView === item.id ? 'scale-110' : 'group-hover:scale-110'}`} />
                {!isSidebarCollapsed && <span className="font-semibold text-sm">{item.label}</span>}
                
                {activeView === item.id && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[var(--accent-primary)] rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* User Profile Card */}
          <div className="p-4 border-t border-[var(--border-color)] shrink-0 bg-[var(--bg-card)]">
            <div 
              onClick={() => handleNav('settings')}
              className={`
                flex items-center gap-3 p-3 rounded-2xl bg-[var(--bg-main)]/50 border border-[var(--border-color)] cursor-pointer hover:border-[var(--accent-primary)] transition-all
                ${isSidebarCollapsed ? 'justify-center' : ''}
              `}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--bg-card-solid)] to-[var(--bg-main)] border border-[var(--border-color)] flex items-center justify-center overflow-hidden shrink-0">
                {user.photoUrl ? (
                  <img src={user.photoUrl} className="w-full h-full object-cover" alt={user.name} />
                ) : (
                  <span className="font-bold text-[var(--accent-primary)]">{user.name[0]}</span>
                )}
              </div>
              {!isSidebarCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[var(--text-main)] truncate">{user.name}</p>
                  <p className="text-[9px] font-black text-[var(--accent-primary)] uppercase tracking-tighter">Gold Member</p>
                </div>
              )}
              {!isSidebarCollapsed && (
                <button onClick={(e) => { e.stopPropagation(); onLogout(); }} className="p-2 text-[var(--text-muted)] hover:text-red-500 transition-colors">
                  <LogOut size={18} />
                </button>
              )}
            </div>
            {isSidebarCollapsed && (
               <button onClick={onLogout} title="Logout" className="w-full flex justify-center p-3 mt-2 text-[var(--text-muted)] hover:text-red-500 transition-colors">
                  <LogOut size={22} />
               </button>
            )}
          </div>
        </aside>
      </div>

      {/* Main Content */}
      <main className={`flex-1 p-4 sm:p-6 md:p-10 mt-16 md:mt-0 relative min-w-0 min-h-screen transition-all duration-300 ${isSidebarCollapsed ? 'md:ml-24' : 'md:ml-[20rem]'}`}>
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
