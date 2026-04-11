// @ts-nocheck
import React from 'react';
import { Card } from './ui/Card';
import { Calculator, Dumbbell, ChevronRight, Flame, Trophy, StickyNote as StickyNoteIcon, FileText, Plus, Trash2, Activity, Zap } from 'lucide-react';
import { PRCalcResult, ViewState, User, StickyNote } from '../types';

import { getTranslation, getDailyQuote } from '../translations';

// Memoized Note Input Form to prevent re-renders during typing
const NoteInputForm = React.memo(({
  language,
  onAddNote,
  onClose
}: {
  language: any;
  onAddNote: (title: string, text: string, color: string) => void;
  onClose: () => void;
}) => {
  const [noteTitle, setNoteTitle] = React.useState('');
  const [noteText, setNoteText] = React.useState('');
  const titleRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    titleRef.current?.focus();
  }, []);

  const handleSave = () => {
    if (noteText.trim() || noteTitle.trim()) {
      onAddNote(noteTitle, noteText, '');
      setNoteTitle('');
      setNoteText('');
      onClose();
    }
  };

  return (
    <div className="glass-card p-6 mb-8 animate-fade-in relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-glow)] to-transparent opacity-50 pointer-events-none"></div>
      <input
        ref={titleRef}
        type="text"
        className="w-full bg-transparent border-0 outline-none focus:ring-0 text-[var(--text-main)] placeholder:text-[var(--text-muted)] text-xl font-heading font-bold mb-3 relative z-10"
        placeholder={language === 'tr' ? 'Başlık ekle...' : 'Add title...'}
        value={noteTitle}
        onChange={(e) => setNoteTitle(e.target.value)}
      />
      <textarea
        className="w-full bg-transparent border-0 outline-none focus:ring-0 text-[var(--text-main)] placeholder:text-[var(--text-muted)] text-base resize-none min-h-[80px] font-body relative z-10"
        placeholder={language === 'tr' ? 'Notunu yaz...' : 'Write your note...'}
        value={noteText}
        onChange={(e) => setNoteText(e.target.value)}
      />
      <div className="flex items-center justify-end mt-4 relative z-10">
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-[var(--text-muted)] font-medium hover:text-[var(--text-main)] transition-colors"
          >
            {language === 'tr' ? 'İptal' : 'Cancel'}
          </button>
          <button
            onClick={handleSave}
            disabled={!noteText.trim() && !noteTitle.trim()}
            className="btn-primary"
          >
            {language === 'tr' ? 'Not Ekle' : 'Add Note'}
          </button>
        </div>
      </div>
    </div>
  );
});

interface DashboardProps {
  user: User;
  lastPr?: PRCalcResult;
  onNavigate: (view: ViewState) => void;
  language: any;
  notes: StickyNote[];
  onAddNote: (title: string, text: string, color: string) => void;
  onDeleteNote: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, lastPr, onNavigate, language, notes, onAddNote, onDeleteNote }) => {
  const dailyQuote = getDailyQuote(language);
  const [isAddingNote, setIsAddingNote] = React.useState(false);

  const StatCard = ({ icon: Icon, label, value, unit, subText, delay }: any) => (
    <div
      className="glass-card p-6 relative overflow-hidden group hover:border-[var(--accent-primary)] transition-all duration-300 animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform translate-x-4 -translate-y-4">
        <Icon size={100} className="text-[var(--accent-primary)]" />
      </div>

      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1">{label}</p>
            {subText && (
              <div className="text-[10px] font-medium text-[var(--accent-primary)] uppercase bg-[var(--accent-glow)] inline-block px-2 py-0.5 rounded-md">{subText}</div>
            )}
          </div>
          <div className="p-2 bg-[var(--bg-main)] rounded-lg border border-[var(--border-color)] group-hover:border-[var(--accent-primary)] group-hover:text-[var(--accent-primary)] text-[var(--text-muted)] transition-all">
            <Icon size={18} />
          </div>
        </div>

        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-4xl font-heading font-bold text-[var(--text-main)] leading-none">{value}</span>
          <span className="text-sm font-medium text-[var(--text-muted)] self-end mb-1">{unit}</span>
        </div>
      </div>
    </div>
  );

  const ActionCard = ({ icon: Icon, label, view, desc }: any) => (
    <button
      onClick={() => onNavigate(view)}
      className="group relative overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 text-left transition-all duration-300 hover:border-[var(--accent-primary)] hover:shadow-[0_8px_30px_rgba(139,92,246,0.12)]"
    >
      <div className="flex items-center gap-4">
        <div className="p-3 bg-[var(--bg-main)] rounded-xl border border-[var(--border-color)] text-[var(--text-muted)] group-hover:text-white group-hover:bg-gradient-to-br group-hover:from-[var(--accent-primary)] group-hover:to-[var(--accent-secondary)] group-hover:border-transparent transition-all">
          <Icon size={22} />
        </div>
        <div className="flex-1">
          <h3 className="font-heading font-semibold text-lg text-[var(--text-main)]">{label}</h3>
          <p className="text-xs text-[var(--text-muted)] opacity-80 mt-0.5">{desc}</p>
        </div>
        <ChevronRight size={18} className="text-[var(--border-strong)] group-hover:text-[var(--accent-primary)] group-hover:translate-x-1 transition-all" />
      </div>
    </button>
  );

  return (
    <div className="space-y-8 pb-10">
      {/* Greeting Header */}
      <div className="glass-card p-10 md:p-12 mb-10 border border-[var(--border-color)] overflow-hidden relative group rounded-3xl">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg-card)] to-transparent pointer-events-none"></div>
        <div className="absolute -inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(139,92,246,0.15),transparent_50%)] pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-[var(--accent-glow)] text-[var(--accent-primary)] text-[10px] font-bold uppercase tracking-[0.2em] rounded-full border border-[var(--accent-primary)]/20 shadow-sm shadow-[var(--accent-glow)]">
                {language === 'tr' ? 'AKTİF' : 'ACTIVE'}
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-heading font-black text-[var(--text-main)] leading-[1.1] tracking-tight">
              {language === 'tr' ? 'Tekrar Hoş Geldin,' : 'Good to see you,'}<br />
              <span className="bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent">{user.name}</span>
            </h1>
            <p className="text-[var(--text-muted)] text-lg font-medium max-w-xl leading-relaxed opacity-80">
              {getTranslation(language, 'ready_to_crush')}
            </p>
          </div>

          <div className="hidden lg:flex flex-col items-end gap-2">
            <span className="text-[10px] text-[var(--accent-primary)] font-black uppercase tracking-[0.3em] mb-1">Calendar</span>
            <div className="text-sm font-bold text-[var(--text-main)] bg-[var(--bg-main)]/60 backdrop-blur-md border border-[var(--border-color)] px-6 py-3 rounded-2xl shadow-xl">
              {new Date().toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </div>
      </div>

      {/* Daily Directive */}
      <div className="relative overflow-hidden rounded-2xl border border-[var(--border-color)] bg-gradient-to-br from-[var(--bg-card)] to-[var(--bg-main)] p-8 shadow-lg animate-fade-in-up mb-8 group hover:border-[var(--border-strong)] transition-colors">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none transform translate-x-8 -translate-y-8">
          <Flame size={120} className="text-[var(--accent-primary)]" />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_100%,rgba(139,92,246,0.08),transparent_50%)] pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] p-1.5 rounded-md">
              <Flame size={14} className="text-white" />
            </div>
            <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Daily Inspiration</span>
          </div>
          <p className="text-2xl md:text-3xl font-heading font-medium leading-relaxed mb-6 text-[var(--text-main)]">"{dailyQuote.text}"</p>
          <div className="flex items-center gap-3">
            <div className="h-px w-8 bg-[var(--border-strong)] transition-colors group-hover:bg-[var(--accent-primary)]" />
            <p className="text-xs font-semibold text-[var(--accent-primary)] uppercase tracking-widest">{dailyQuote.author}</p>
          </div>
        </div>
      </div>


      {/* NOTES SECTION */}
      <div className="animate-slide-up mt-10" style={{ animationDelay: '700ms' }}>
        <div className="flex items-center justify-between mb-6 border-b border-[var(--border-color)] pb-3">
          <h2 className="text-xl font-heading font-semibold text-[var(--text-main)] flex items-center gap-3">
            <div className="p-1.5 bg-[var(--accent-glow)] border border-[var(--border-color)] rounded-md text-[var(--accent-primary)]">
              <StickyNoteIcon size={18} />
            </div>
            {language === 'tr' ? 'Hızlı Notlar' : 'Quick Notes'}
          </h2>
          <button
            onClick={() => setIsAddingNote(!isAddingNote)}
            className="p-2 bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-muted)] rounded-lg hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-all shadow-sm"
          >
            <Plus size={20} className={isAddingNote ? 'rotate-45 transition-transform' : 'transition-transform'} />
          </button>
        </div>

        {isAddingNote && (
          <NoteInputForm
            language={language}
            onAddNote={onAddNote}
            onClose={() => setIsAddingNote(false)}
          />
        )}

        {notes && notes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <div
                key={note.id}
                className="group relative p-6 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] transition-all duration-300 hover:border-[var(--accent-primary)] hover:shadow-lg min-h-[180px] flex flex-col overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-[var(--accent-glow)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                <div className="relative z-10 flex-1">
                  {note.title && (
                    <h3 className="text-[var(--text-main)] font-heading font-bold text-lg mb-2">{note.title}</h3>
                  )}
                  {note.text && (
                    <p className="text-[var(--text-muted)] whitespace-pre-wrap text-sm font-body">{note.text}</p>
                  )}
                </div>
                <div className="relative z-10 flex items-center justify-between mt-6 pt-4 border-t border-[var(--border-color)] opacity-60 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs text-[var(--text-muted)] font-medium">
                    {new Date(note.createdAt).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', { day: 'numeric', month: 'long' })}
                  </span>
                  <button
                    onClick={() => onDeleteNote(note.id)}
                    className="p-1.5 text-[var(--text-muted)] hover:text-red-400 hover:bg-red-400/10 rounded-md transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !isAddingNote && (
            <div className="text-center py-16 rounded-2xl border border-dashed border-[var(--border-strong)] bg-[var(--bg-card)]">
              <div className="w-16 h-16 mx-auto bg-[var(--accent-glow)] rounded-full flex items-center justify-center mb-4">
                <StickyNoteIcon size={32} className="text-[var(--accent-primary)]" />
              </div>
              <p className="text-[var(--text-main)] font-medium font-heading text-lg">{language === 'tr' ? 'Henüz not eklenmemiş.' : 'No notes added yet.'}</p>
              <p className="text-sm text-[var(--text-muted)] mt-1 mb-4">Capture your workout thoughts or daily logs here.</p>
              <button
                onClick={() => setIsAddingNote(true)}
                className="btn-primary"
              >
                {language === 'tr' ? 'İlk notunu oluştur' : 'Create Note'}
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
};