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
    <div className="min-h-screen flex bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300 font-body relative overflow-x-hidden">
      
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

      {/* Sidebar Container */}
      <div className={`
        fixed md:sticky top-0 h-screen z-50 transition-all duration-300 ease-in-out shrink-0 flex
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        ${isSidebarCollapsed ? 'w-20' : 'w-72'}
      `}>
        <aside className="w-full min-h-full border-r border-[var(--border-strong)] bg-[var(--bg-card)] backdrop-blur-xl flex flex-col relative overflow-hidden">
          
          {/* Collapse Toggle - Desktop Only */}
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="hidden md:flex absolute -right-3 top-10 w-6 h-6 bg-[var(--accent-primary)] text-white rounded-full items-center justify-center border border-white/20 shadow-lg z-[60] hover:scale-110 transition-transform"
          >
            {isSidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>

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
      <main className="flex-1 p-6 md:p-10 mt-16 md:mt-0 relative min-w-0 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
