import React from 'react';
import { Card } from './ui/Card';
import { Calculator, Dumbbell, ChevronRight, Flame, Trophy, StickyNote as StickyNoteIcon, FileText, Plus, Trash2 } from 'lucide-react';
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
  // Use vintage colors for notes
  const [selectedColor, setSelectedColor] = React.useState('bg-[#331A1A] border-[#662E2E]');
  const titleRef = React.useRef<HTMLInputElement>(null);

  const NOTE_COLORS = [
    { bg: 'bg-[#331A1A] border-[#662E2E] text-[#EF5350]' }, // Red
    { bg: 'bg-[#1A2F1A] border-[#2E5C2E] text-[#4CAF50]' }, // Green
    { bg: 'bg-[#1A2533] border-[#2E4266] text-[#64B5F6]' }, // Blue
    { bg: 'bg-[#332A00] border-[#665200] text-[#FFC107]' }, // Yellow
    { bg: 'bg-[#0E0C0B] border-[var(--border-color)] text-[var(--accent-primary)]' }, // Default
  ];

  React.useEffect(() => {
    titleRef.current?.focus();
  }, []);

  const handleSave = () => {
    if (noteText.trim() || noteTitle.trim()) {
      onAddNote(noteTitle, noteText, selectedColor);
      setNoteTitle('');
      setNoteText('');
      onClose();
    }
  };

  return (
    <div className="vintage-card p-6 rounded-[var(--radius-main)] mb-8 animate-fade-in border border-[var(--border-strong)] bg-[#14110F] bg-grid-pattern">
      <input
        ref={titleRef}
        type="text"
        className="w-full bg-transparent border-0 outline-none focus:ring-0 text-[var(--text-main)] placeholder:text-[var(--text-muted)] text-xl font-bold mb-3 font-heading tracking-wide uppercase"
        placeholder={language === 'tr' ? 'Başlık ekle...' : 'Add title...'}
        value={noteTitle}
        onChange={(e) => setNoteTitle(e.target.value)}
      />
      <textarea
        className="w-full bg-transparent border-0 outline-none focus:ring-0 text-[var(--text-main)] placeholder:text-[var(--text-muted)] text-base resize-none min-h-[80px] font-mono"
        placeholder={language === 'tr' ? 'Notunu yaz...' : 'Write your note...'}
        value={noteText}
        onChange={(e) => setNoteText(e.target.value)}
      />
      <div className="flex items-center justify-between mt-4 border-t border-[var(--border-color)] pt-4">
        <div className="flex gap-2">
          {NOTE_COLORS.map((color, index) => (
            <button
              key={index}
              onClick={() => setSelectedColor(`${color.bg.split(' ')[0]} ${color.bg.split(' ')[1]}`)}
              className={`w-6 h-6 rounded-[2px] ${color.bg.split(' ')[0]} border ${color.bg.split(' ')[1]} ${selectedColor.includes(color.bg.split(' ')[0]) ? 'ring-1 ring-[var(--accent-primary)] ring-offset-1 ring-offset-black' : 'opacity-70'} transition-all`}
            />
          ))}
        </div>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-[var(--text-muted)] font-medium hover:text-[var(--text-main)]"
          >
            {language === 'tr' ? 'İptal' : 'Cancel'}
          </button>
          <button
            onClick={handleSave}
            disabled={!noteText.trim() && !noteTitle.trim()}
            className="px-4 py-2 bg-[var(--accent-primary)] text-[#14110F] rounded-[var(--radius-sm)] text-sm font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-[#E08C3B] disabled:opacity-50 disabled:cursor-not-allowed transition-all uppercase tracking-wider border border-[#14110F]"
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
      className="panel-technical p-5 relative overflow-visible group hover:border-[var(--accent-primary)] transition-all duration-200 animate-slide-up bg-[var(--bg-card)]"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[var(--text-muted)] opacity-30 group-hover:border-[var(--accent-primary)] group-hover:opacity-100 transition-all"></div>
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[var(--text-muted)] opacity-30 group-hover:border-[var(--accent-primary)] group-hover:opacity-100 transition-all"></div>
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[var(--text-muted)] opacity-30 group-hover:border-[var(--accent-primary)] group-hover:opacity-100 transition-all"></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[var(--text-muted)] opacity-30 group-hover:border-[var(--accent-primary)] group-hover:opacity-100 transition-all"></div>

      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex justify-between items-start mb-1">
          <div>
            <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] mb-0.5 font-mono leading-none">{label}</p>
            {subText && (
              <div className="text-[9px] font-mono text-[var(--accent-secondary)] mt-0.5 uppercase tracking-wider">{subText}</div>
            )}
          </div>
          <Icon size={18} className="text-[var(--text-muted)] opacity-30 group-hover:text-[var(--accent-primary)] group-hover:opacity-100 transition-all" />
        </div>

        <div className="flex items-baseline gap-1 mt-3">
          <span className="text-4xl font-heading text-[var(--text-main)] tracking-wider leading-none">{value}</span>
          <span className="text-[10px] font-bold text-[var(--text-muted)] font-mono self-end mb-1">{unit}</span>
        </div>
      </div>
    </div>
  );

  const ActionCard = ({ icon: Icon, label, view, desc }: any) => (
    <button
      onClick={() => onNavigate(view)}
      className="group relative overflow-hidden rounded-[2px] border border-[var(--border-color)] bg-[var(--bg-card)] p-4 text-left transition-all duration-200 hover:border-[var(--accent-primary)] hover:bg-[#26211D]"
    >
      <div className="flex items-center gap-4">
        <div className="p-3 bg-[#14110F] border border-[var(--border-color)] text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] group-hover:border-[var(--accent-primary)] transition-colors">
          <Icon size={20} />
        </div>
        <div className="flex-1">
          <h3 className="font-heading font-bold text-lg text-[var(--text-main)] uppercase tracking-wider">{label}</h3>
          <p className="text-[10px] text-[var(--text-muted)] font-mono uppercase tracking-widest opacity-70">{desc}</p>
        </div>
        <ChevronRight size={16} className="text-[var(--border-strong)] group-hover:text-[var(--accent-primary)] transition-colors" />
      </div>
    </button>
  );

  return (
    <div className="space-y-8 pb-10">
      {/* Greeting Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 animate-fade-in border-b-2 border-[var(--border-strong)] pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 bg-[var(--accent-primary)] text-[#121110] text-[10px] font-bold uppercase tracking-[0.2em] font-mono">
              SYSTEM_READY
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl bebas text-[var(--text-main)] leading-none mb-2 tracking-wide">
            WELCOME BACK,<br />
            <span className="text-[var(--accent-primary)]">{user.name}</span>
          </h1>
          <p className="text-[var(--text-muted)] text-base font-body max-w-lg mb-4 leading-relaxed">
            {getTranslation(language, 'ready_to_crush')}
          </p>
        </div>

        <div className="hidden lg:block self-start md:self-end">
          <div className="flex flex-col items-end gap-1">
            <span className="text-[10px] text-[var(--text-muted)] font-mono tracking-[0.2em] uppercase">CURRENT_DATE</span>
            <div className="text-base font-bold text-[var(--text-main)] border-2 border-[var(--border-strong)] px-3 py-1.5 font-mono tracking-[0.1em] bg-[#121110] shadow-[3px_3px_0px_var(--accent-primary)]">
              {new Date().toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', { weekday: 'long', month: 'long', day: 'numeric' }).toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      {/* Daily Directive */}
      <div className="relative group overflow-hidden p-6 border border-[var(--border-strong)] bg-[var(--bg-card)] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] animate-fade-in-up bg-grid-pattern mb-8">
        <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-10 -translate-y-10 pointer-events-none">
          <Dumbbell size={140} className="text-[var(--accent-primary)]" />
        </div>
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[var(--accent-primary)]"></div>
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[var(--accent-primary)]"></div>
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[var(--accent-primary)]"></div>
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[var(--accent-primary)]"></div>

        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-[var(--accent-primary)] p-0.5 rounded-[1px]">
              <Flame size={12} className="text-[#14110F]" />
            </div>
            <span className="text-[10px] font-bold text-[var(--accent-primary)] uppercase tracking-[0.3em]">DAILY_DIRECTIVE // MOTIVATION</span>
          </div>
          <p className="text-2xl md:text-3xl pacifico leading-relaxed mb-4 text-[var(--text-main)] opacity-95">"{dailyQuote.text}"</p>
          <div className="flex items-center gap-3">
            <div className="h-[2px] w-6 bg-[var(--accent-primary)]" />
            <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">{dailyQuote.author}</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <StatCard
          icon={Trophy}
          label={language === 'tr' ? 'EN YÜKSEK 1RM' : 'HEAVIEST 1RM'}
          value={lastPr ? lastPr.oneRepMax : '-'}
          unit="kg"
          subText={getTranslation(language, 'great_job')}
          delay={100}
        />
        <StatCard
          icon={Calculator}
          label={language === 'tr' ? 'HESAPLAMALAR' : 'ANALYSIS'}
          value="READY"
          unit=""
          subText="SYSTEM STATUS"
          delay={200}
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-4 animate-slide-up" style={{ animationDelay: '300ms' }}>
          <h2 className="text-xl font-heading tracking-widest text-[var(--text-main)] flex items-center gap-2 uppercase">
            <div className="w-1 h-5 bg-[var(--accent-primary)]"></div>
            {getTranslation(language, 'quick_actions')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <ActionCard
              icon={Calculator}
              label={getTranslation(language, 'calculators')}
              desc={getTranslation(language, 'essential_calcs')}
              view="calculator"
            />
             <ActionCard
              icon={FileText}
              label={getTranslation(language, 'about_app')}
              desc={getTranslation(language, 'educational_content')}
              view="about"
            />
          </div>
        </div>
      </div>

      {/* NOTES SECTION */}
      <div className="animate-slide-up" style={{ animationDelay: '700ms' }}>
        <div className="flex items-center justify-between mb-6 border-b border-[var(--border-color)] pb-2">
          <h2 className="text-xl font-heading tracking-wider text-[var(--text-main)] flex items-center gap-2 uppercase">
            <StickyNoteIcon className="text-[var(--accent-primary)]" /> {language === 'tr' ? 'Hızlı Notlar' : 'Quick Notes'}
          </h2>
          <button
            onClick={() => setIsAddingNote(!isAddingNote)}
            className="p-2 bg-[#1A1A1A] border border-[var(--border-color)] text-[var(--text-muted)] rounded-[var(--radius-sm)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-colors"
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {notes.map((note) => (
              <div
                key={note.id}
                className="group relative p-6 rounded-[2px] border border-[var(--border-color)] bg-[var(--bg-card)] transition-all duration-300 hover:border-[var(--accent-primary)] min-h-[180px] flex flex-col"
              >
                <div className="flex-1">
                  {note.title && (
                    <h3 className="text-[var(--text-main)] font-heading tracking-wide text-lg mb-2 uppercase">{note.title}</h3>
                  )}
                  {note.text && (
                    <p className="text-[var(--text-muted)] whitespace-pre-wrap text-sm font-mono">{note.text}</p>
                  )}
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--border-color)] opacity-50 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs text-[var(--text-muted)] font-bold">
                    {new Date(note.createdAt).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', { day: 'numeric', month: 'short' }).toUpperCase()}
                  </span>
                  <button
                    onClick={() => onDeleteNote(note.id)}
                    className="p-1.5 text-[var(--text-muted)] hover:text-[#EF5350] transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !isAddingNote && (
            <div className="text-center py-12 rounded-[var(--radius-main)] border border-dashed border-[var(--border-color)] bg-[rgba(255,255,255,0.02)]">
              <StickyNoteIcon size={48} className="mx-auto text-[var(--border-strong)] mb-4" />
              <p className="text-[var(--text-muted)] font-medium font-heading tracking-wide">{language === 'tr' ? 'Henüz not eklenmemiş.' : 'No notes added yet.'}</p>
              <button
                onClick={() => setIsAddingNote(true)}
                className="mt-2 text-[var(--accent-primary)] font-bold uppercase tracking-wider hover:underline text-sm"
              >
                {language === 'tr' ? 'İlk notunu oluştur' : 'Create your first note'}
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
};