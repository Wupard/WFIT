import React from 'react';
import { Card } from './ui/Card';
import { Activity, TrendingUp, Calendar, Scale, Calculator, Dumbbell, ChevronRight, Sparkles, Flame, Droplets, Trophy, ArrowUpRight, Plus, Trash2, StickyNote as StickyNoteIcon, FileText, BarChart3, X } from 'lucide-react';
import { WeightLog, PRCalcResult, ViewState, User, StickyNote } from '../types';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
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
  weightLogs: WeightLog[];
  lastPr?: PRCalcResult;
  targetWeight?: number;
  onNavigate: (view: ViewState) => void;
  language: any;
  notes: StickyNote[];
  onAddNote: (title: string, text: string, color: string) => void;
  onDeleteNote: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, weightLogs, lastPr, targetWeight, onNavigate, language, notes, onAddNote, onDeleteNote }) => {
  const latestWeight = weightLogs.length > 0 ? weightLogs[weightLogs.length - 1].weight : 0;
  const previousWeight = weightLogs.length > 1 ? weightLogs[weightLogs.length - 2].weight : latestWeight;
  const weightDiff = (latestWeight - previousWeight).toFixed(1);
  const isWeightDown = latestWeight < previousWeight;
  const dailyQuote = getDailyQuote(language);
  const [isAddingNote, setIsAddingNote] = React.useState(false);
  const [showWeeklyReport, setShowWeeklyReport] = React.useState(false);
  const [showMonthlyReport, setShowMonthlyReport] = React.useState(false);

  // Weekly data
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const weeklyLogs = weightLogs.filter(l => new Date(l.date) >= oneWeekAgo);
  const weeklyWeightChange = weeklyLogs.length >= 2
    ? (weeklyLogs[weeklyLogs.length - 1].weight - weeklyLogs[0].weight).toFixed(1)
    : '0';

  // Monthly data
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  const monthlyLogs = weightLogs.filter(l => new Date(l.date) >= oneMonthAgo);
  const monthlyWeightChange = monthlyLogs.length >= 2
    ? (monthlyLogs[monthlyLogs.length - 1].weight - monthlyLogs[0].weight).toFixed(1)
    : '0';
  const avgWeeklyLoss = monthlyLogs.length >= 2
    ? (Number(monthlyWeightChange) / 4).toFixed(1)
    : '0';

  // Calculate estimated time to reach target
  let estimatedWeeks = 0;
  let weeksString = "-";

  if (targetWeight && weightLogs.length >= 2) {
    const firstLog = weightLogs[0];
    const lastLog = weightLogs[weightLogs.length - 1];

    const daysDiff = (new Date(lastLog.date).getTime() - new Date(firstLog.date).getTime()) / (1000 * 3600 * 24);
    const weightLost = firstLog.weight - lastLog.weight;

    if (daysDiff > 0 && weightLost > 0 && latestWeight > targetWeight) {
      const lossPerDay = weightLost / daysDiff;
      const remaining = latestWeight - targetWeight;
      const daysRemaining = remaining / lossPerDay;
      estimatedWeeks = Math.round(daysRemaining / 7);
      weeksString = getTranslation(language, 'target_in_weeks', { weeks: estimatedWeeks });
    }
  }

  const StatCard = ({ icon: Icon, label, value, unit, gradient, subText, delay }: any) => (
    <div
      className="panel-technical p-5 relative overflow-visible group hover:border-[var(--accent-primary)] transition-all duration-200 animate-slide-up bg-[var(--bg-card)]"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Corner accents */}
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

  const ActionCard = ({ icon: Icon, label, view, gradient, desc }: any) => (
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
      {/* Greeting Header - Retro Workshop Style */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 animate-fade-in border-b-2 border-[var(--border-strong)] pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 bg-[var(--accent-primary)] text-[#121110] text-[10px] font-bold uppercase tracking-[0.2em] font-mono">
              SYSTEM_READY
            </span>
            <span className="text-[10px] text-[var(--accent-secondary)] font-bold uppercase tracking-[0.2em] font-mono animate-pulse">
              /// SECURE_ACCESS
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl bebas text-[var(--text-main)] leading-none mb-2 tracking-wide">
            WELCOME BACK,<br />
            <span className="text-[var(--accent-primary)]">{user.name}</span>
          </h1>
          <p className="text-[var(--text-muted)] text-base font-body max-w-lg mb-4 leading-relaxed">
            {getTranslation(language, 'ready_to_crush')}
          </p>
          <div className="flex items-center gap-4">
            <div className="h-[2px] w-10 bg-[var(--accent-primary)]"></div>
            <span className="pacifico text-[var(--accent-primary)] text-xl opacity-90 transform -rotate-1">
              Discipline over motivation.
            </span>
          </div>
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

      {/* Daily Directive - Industrial Plate Style */}
      {/* Daily Directive - Industrial Plate Style */}
      <div className="relative group overflow-hidden p-6 border border-[var(--border-strong)] bg-[var(--bg-card)] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] animate-fade-in-up bg-grid-pattern mb-8">

        <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-10 -translate-y-10 pointer-events-none">
          <Dumbbell size={140} className="text-[var(--accent-primary)]" />
        </div>

        {/* Decorative corner markers */}
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

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={Activity}
          label={getTranslation(language, 'current_weight')}
          value={latestWeight}
          unit="kg"
          gradient=""
          delay={100}
        />
        <StatCard
          icon={TrendingUp}
          label={getTranslation(language, 'target_goal')}
          value={targetWeight || '-'}
          unit="kg"
          gradient=""
          delay={200}
        />
        <StatCard
          icon={ArrowUpRight}
          label={getTranslation(language, 'progress')}
          value={`${Number(weightDiff) > 0 ? '+' : ''}${weightDiff}`}
          unit="kg"
          gradient=""
          subText={isWeightDown ? getTranslation(language, 'great_job') : getTranslation(language, 'keep_pushing')}
          delay={300}
        />
        <StatCard
          icon={Flame}
          label={getTranslation(language, 'streak')}
          value={user.streak || 0}
          unit={getTranslation(language, 'days')}
          gradient=""
          subText={getTranslation(language, 'you_re_on_fire')}
          delay={400}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weight Chart */}
        <div className="lg:col-span-2 space-y-4 animate-slide-up" style={{ animationDelay: '500ms' }}>
          <h2 className="text-xl font-heading tracking-widest text-[var(--text-main)] flex items-center gap-2 uppercase">
            <div className="w-1 h-5 bg-[var(--accent-primary)]"></div>
            {getTranslation(language, 'weight_analytics')}
          </h2>
          <Card className="h-80 relative overflow-visible group vintage-card p-0 bg-[#0E0C0B] border border-[var(--border-color)] rounded-[2px]">
            {/* Corner Markers for Chart */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[var(--accent-primary)]"></div>
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[var(--accent-primary)]"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[var(--accent-primary)]"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[var(--accent-primary)]"></div>

            {weeksString !== '-' && (
              <div className="absolute top-6 right-6 z-10 bg-[#121110] px-3 py-1.5 border border-[var(--accent-primary)] flex items-center gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <span className="w-1.5 h-1.5 bg-[var(--accent-primary)] animate-pulse" />
                <span className="text-xs font-bold text-[var(--text-main)] uppercase tracking-[0.1em] font-mono">{weeksString}</span>
              </div>
            )}

            <div className="w-full h-[300px] mt-8 px-4">
              {weightLogs.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weightLogs.length === 1 ? [...weightLogs, { ...weightLogs[0], date: 'Now' }] : weightLogs} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#C87B2A" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#C87B2A" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="date"
                      stroke="#555"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      tickMargin={10}
                      tick={{ fill: '#A09B96' }}
                    />
                    <YAxis
                      stroke="#555"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      domain={['dataMin - 5', 'dataMax + 5']}
                      tick={{ fill: '#A09B96' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1D1916',
                        borderRadius: '4px',
                        color: '#EAEAEA',
                        boxShadow: 'none',
                        border: '1px solid #C87B2A',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '12px'
                      }}
                      itemStyle={{ color: '#C87B2A', fontWeight: 600 }}
                      cursor={{ stroke: '#C87B2A', strokeWidth: 1, strokeDasharray: '4 4' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="weight"
                      stroke="#C87B2A"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorWeight)"
                      animationDuration={2000}
                      isAnimationActive={false}
                    />
                    {targetWeight && (
                      <ReferenceLine
                        y={targetWeight}
                        stroke="#4CAF50"
                        strokeDasharray="4 4"
                        strokeWidth={2}
                        label={{
                          position: 'right',
                          value: 'GOAL',
                          fill: '#4CAF50',
                          fontSize: 10,
                          fontWeight: 'bold',
                          dy: -10
                        }}
                      />
                    )}
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-[var(--text-muted)]">
                  <Activity size={48} className="mb-4 opacity-20" />
                  <p className="text-lg font-medium">{getTranslation(language, 'no_weight_data')}</p>
                  <p className="text-sm">{getTranslation(language, 'start_tracking')}</p>
                  <button
                    onClick={() => onNavigate('weight')}
                    className="mt-4 px-4 py-2 border border-[var(--accent-primary)] text-[var(--accent-primary)] uppercase tracking-wider text-sm font-bold hover:bg-[rgba(200,123,42,0.1)] transition-colors"
                  >
                    {getTranslation(language, 'add_first_log')}
                  </button>
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-4 animate-slide-up" style={{ animationDelay: '600ms' }}>
          <h2 className="text-xl font-heading tracking-widest text-[var(--text-main)] flex items-center gap-2 uppercase">
            <div className="w-1 h-5 bg-[var(--accent-primary)]"></div>
            {getTranslation(language, 'quick_actions')}
          </h2>
          <div className="grid grid-cols-1 gap-3">
            <ActionCard
              icon={Scale}
              label={getTranslation(language, 'weight_tracker')}
              desc={getTranslation(language, 'track_weight_desc')}
              view="weight"
              gradient=""
            />
            <ActionCard
              icon={Calculator}
              label={getTranslation(language, 'calculators')}
              desc={getTranslation(language, 'essential_calcs')}
              view="calculator"
              gradient=""
            />
          </div>
        </div>
      </div>

      {/* REPORTS SECTION */}
      <div className="animate-slide-up" style={{ animationDelay: '650ms' }}>
        <div className="flex items-center gap-2 mb-4 border-b border-[var(--border-color)] pb-2 inline-block pr-12">
          <div className="w-1 h-5 bg-[var(--accent-primary)]"></div>
          <h2 className="text-xl font-heading tracking-widest text-[var(--text-main)] uppercase">
            {language === 'tr' ? 'Raporlar' : 'Reports'}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Weekly Report Card */}
          <button
            onClick={() => setShowWeeklyReport(true)}
            className="group relative overflow-visible rounded-[2px] p-6 text-left transition-all duration-300 hover:border-[var(--accent-primary)] border border-[var(--border-strong)] bg-[var(--bg-card)] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] active:translate-y-1 active:shadow-none"
          >
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[var(--text-muted)] opacity-50 group-hover:border-[var(--accent-primary)] group-hover:opacity-100 transition-all"></div>
            <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[var(--text-muted)] opacity-50 group-hover:border-[var(--accent-primary)] group-hover:opacity-100 transition-all"></div>
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-[var(--text-muted)] opacity-50 group-hover:border-[var(--accent-primary)] group-hover:opacity-100 transition-all"></div>
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[var(--text-muted)] opacity-50 group-hover:border-[var(--accent-primary)] group-hover:opacity-100 transition-all"></div>

            <div className="absolute top-0 right-0 p-3 opacity-5 transform translate-x-4 -translate-y-4 group-hover:opacity-10 transition-opacity">
              <BarChart3 size={80} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-[#1A1A1A] border border-[var(--border-color)] group-hover:border-[var(--accent-primary)] transition-colors">
                  <BarChart3 size={20} className="text-[var(--text-main)]" />
                </div>
                <ChevronRight size={20} className="text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="text-lg font-heading tracking-wide text-[var(--text-main)] mb-1 uppercase">
                {language === 'tr' ? 'Haftalık Rapor' : 'Weekly Report'}
              </h3>
              <p className="text-[var(--text-muted)] text-xs font-mono tracking-tight">
                {language === 'tr' ? 'Son 7 günün özeti' : 'Last 7 days summary'}
              </p>
            </div>
          </button>

          {/* Monthly Report Card */}
          <button
            onClick={() => setShowMonthlyReport(true)}
            className="group relative overflow-visible rounded-[2px] p-8 text-left transition-all duration-300 hover:border-[var(--accent-primary)] border border-[var(--border-strong)] bg-[var(--bg-card)] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] active:translate-y-1 active:shadow-none"
          >
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[var(--text-muted)] opacity-50 group-hover:border-[var(--accent-primary)] group-hover:opacity-100 transition-all"></div>
            <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[var(--text-muted)] opacity-50 group-hover:border-[var(--accent-primary)] group-hover:opacity-100 transition-all"></div>
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-[var(--text-muted)] opacity-50 group-hover:border-[var(--accent-primary)] group-hover:opacity-100 transition-all"></div>
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[var(--text-muted)] opacity-50 group-hover:border-[var(--accent-primary)] group-hover:opacity-100 transition-all"></div>

            <div className="absolute top-0 right-0 p-3 opacity-5 transform translate-x-4 -translate-y-4 group-hover:opacity-10 transition-opacity">
              <Calendar size={80} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-[#1A1A1A] border border-[var(--border-color)] group-hover:border-[var(--accent-primary)] transition-colors">
                  <Calendar size={20} className="text-[var(--text-main)]" />
                </div>
                <ChevronRight size={20} className="text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="text-lg font-heading tracking-wide text-[var(--text-main)] mb-1 uppercase">
                {language === 'tr' ? 'Aylık Rapor' : 'Monthly Report'}
              </h3>
              <p className="text-[var(--text-muted)] text-xs font-mono tracking-tight">
                {language === 'tr' ? 'Son 30 günün detaylı analizi' : 'Last 30 days detailed analysis'}
              </p>
            </div>
          </button>
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

        {
          isAddingNote && (
            <NoteInputForm
              language={language}
              onAddNote={onAddNote}
              onClose={() => setIsAddingNote(false)}
            />
          )
        }

        {
          notes && notes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className={`group relative p-6 rounded-[2px] border border-[var(--border-color)] bg-[var(--bg-card)] transition-all duration-300 hover:border-[var(--accent-primary)] min-h-[180px] flex flex-col ${note.color?.split(' ')[1] || ''}`}
                  style={{ borderLeftWidth: '4px', borderLeftColor: note.color?.includes('border') ? note.color.split('border-[')[1]?.replace(']', '') : 'var(--border-color)' }}
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
          )
        }
      </div>

      {/* Weekly Report Modal - Industrial */}
      {showWeeklyReport && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="bg-[var(--bg-card)] border-2 border-[var(--border-strong)] rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-md w-full max-h-[90vh] overflow-y-auto relative">

            {/* Modal Header */}
            <div className="p-5 border-b-2 border-[var(--border-color)] bg-[#14110F]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[var(--accent-primary)] text-[#14110F]">
                    <BarChart3 size={20} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-heading tracking-widest text-[var(--text-main)] uppercase leading-none">{language === 'tr' ? 'Haftalık Rapor' : 'Weekly Report'}</h2>
                    <p className="text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-[0.2em] font-mono mt-1">{language === 'tr' ? 'Son 7 gün' : 'Last 7 days'}</p>
                  </div>
                </div>
                <button onClick={() => setShowWeeklyReport(false)} className="p-2 text-[var(--text-muted)] hover:text-[#EF5350] transition-colors border border-transparent hover:border-[#EF5350]">
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4 bg-grid-pattern">
              {/* Weight Change */}
              <div className="flex items-center justify-between p-4 bg-[#14110F] border border-[var(--border-color)]">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[var(--text-muted)]/10 text-[var(--text-muted)]">
                    <TrendingUp size={20} />
                  </div>
                  <span className="font-bold text-[var(--text-main)] uppercase tracking-wide text-sm font-mono">{language === 'tr' ? 'Kilo Değişimi' : 'Weight Change'}</span>
                </div>
                <span className={`text-2xl font-heading tracking-wide ${Number(weeklyWeightChange) < 0 ? 'text-[#4CAF50]' : Number(weeklyWeightChange) > 0 ? 'text-[#EF5350]' : 'text-[var(--text-muted)]'}`}>
                  {Number(weeklyWeightChange) > 0 ? '+' : ''}{weeklyWeightChange} <span className="text-sm text-[var(--text-muted)]">kg</span>
                </span>
              </div>

              {/* Weigh-ins */}
              <div className="flex items-center justify-between p-4 bg-[#14110F] border border-[var(--border-color)]">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[var(--text-muted)]/10 text-[var(--text-muted)]">
                    <Activity size={20} />
                  </div>
                  <span className="font-bold text-[var(--text-main)] uppercase tracking-wide text-sm font-mono">{language === 'tr' ? 'Tartım Sayısı' : 'Weigh-ins'}</span>
                </div>
                <span className="text-2xl font-heading tracking-wide text-[var(--text-main)]">{weeklyLogs.length}</span>
              </div>

              {/* Current Streak */}
              <div className="flex items-center justify-between p-4 bg-[#14110F] border border-[var(--border-color)]">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[var(--text-muted)]/10 text-[var(--text-muted)]">
                    <Flame size={20} />
                  </div>
                  <span className="font-bold text-[var(--text-main)] uppercase tracking-wide text-sm font-mono">{language === 'tr' ? 'Aktif Seri' : 'Active Streak'}</span>
                </div>
                <span className="text-2xl font-heading tracking-wide text-[var(--accent-primary)]">{user.streak || 0} <span className="text-sm font-bold">{language === 'tr' ? 'GÜN' : 'DAYS'}</span></span>
              </div>

              {/* Weekly Summary */}
              <div className="p-4 bg-[rgba(200,123,42,0.05)] border border-[var(--border-strong)] mt-4">
                <p className="text-[var(--accent-primary)] text-center font-bold uppercase text-sm tracking-widest font-mono">
                  {Number(weeklyWeightChange) < 0
                    ? (language === 'tr' ? 'CEPHENDE İYİ İŞ ÇIKARDIN!' : 'GOOD WORK ON THE FRONT!')
                    : (language === 'tr' ? 'DİSİPLİNİ ELDEN BIRAKMA!' : 'MAINTAIN DISCIPLINE!')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Monthly Report Modal - Industrial */}
      {
        showMonthlyReport && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-[var(--bg-card)] border border-[var(--border-strong)] rounded-[var(--radius-main)] shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="p-4 border-b border-[var(--border-color)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[var(--accent-primary)] text-[#14110F] rounded-[var(--radius-sm)]">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <h2 className="text-xl font-heading tracking-wider text-[var(--text-main)] uppercase">{language === 'tr' ? 'Aylık Rapor' : 'Monthly Report'}</h2>
                      <p className="text-[var(--text-muted)] text-xs font-bold uppercase tracking-widest leading-none">{language === 'tr' ? 'Son 30 gün' : 'Last 30 days'}</p>
                    </div>
                  </div>
                  <button onClick={() => setShowMonthlyReport(false)} className="p-2 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
                    <X size={24} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-4">
                {/* Monthly Weight Change */}
                <div className="flex items-center justify-between p-4 bg-[#14110F] border border-[var(--border-color)] rounded-[var(--radius-sm)]">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[var(--text-muted)]/10 rounded-[var(--radius-sm)] text-[var(--text-muted)]">
                      <TrendingUp size={20} />
                    </div>
                    <span className="font-bold text-[var(--text-main)] uppercase tracking-wide text-sm">{language === 'tr' ? 'Toplam Kilo Değişimi' : 'Total Weight Change'}</span>
                  </div>
                  <span className={`text-xl font-heading tracking-wide ${Number(monthlyWeightChange) < 0 ? 'text-[#4CAF50]' : Number(monthlyWeightChange) > 0 ? 'text-[#EF5350]' : 'text-[var(--text-muted)]'}`}>
                    {Number(monthlyWeightChange) > 0 ? '+' : ''}{monthlyWeightChange} kg
                  </span>
                </div>

                {/* Average Weekly */}
                <div className="flex items-center justify-between p-4 bg-[#14110F] border border-[var(--border-color)] rounded-[var(--radius-sm)]">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[var(--text-muted)]/10 rounded-[var(--radius-sm)] text-[var(--text-muted)]">
                      <BarChart3 size={20} />
                    </div>
                    <span className="font-bold text-[var(--text-main)] uppercase tracking-wide text-sm">{language === 'tr' ? 'Haftalık Ortalama' : 'Weekly Average'}</span>
                  </div>
                  <span className="text-xl font-heading tracking-wide text-[var(--text-main)]">{avgWeeklyLoss} kg</span>
                </div>

                {/* Total Weigh-ins */}
                <div className="flex items-center justify-between p-4 bg-[#14110F] border border-[var(--border-color)] rounded-[var(--radius-sm)]">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[var(--text-muted)]/10 rounded-[var(--radius-sm)] text-[var(--text-muted)]">
                      <Activity size={20} />
                    </div>
                    <span className="font-bold text-[var(--text-main)] uppercase tracking-wide text-sm">{language === 'tr' ? 'Toplam Tartım' : 'Total Weigh-ins'}</span>
                  </div>
                  <span className="text-xl font-heading tracking-wide text-[var(--text-main)]">{monthlyLogs.length}</span>
                </div>

                {/* Target Progress */}
                {targetWeight && (
                  <div className="p-4 bg-[#14110F] border border-[var(--border-color)] rounded-[var(--radius-sm)]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-[var(--text-main)] uppercase tracking-wide text-sm">{language === 'tr' ? 'Hedefe İlerleme' : 'Target Progress'}</span>
                      <span className="text-sm font-mono text-[var(--text-muted)]">{latestWeight} → {targetWeight} kg</span>
                    </div>
                    <div className="w-full h-3 bg-[#0E0C0B] rounded-full overflow-hidden border border-[var(--border-color)]">
                      <div
                        className="h-full bg-[var(--accent-primary)] transition-all duration-500"
                        style={{ width: `${Math.min(100, Math.max(0, (1 - (latestWeight - targetWeight) / (weightLogs[0]?.weight - targetWeight || 1)) * 100))}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Monthly Summary */}
                <div className="p-4 bg-[rgba(200,123,42,0.1)] border border-[var(--border-strong)] rounded-[var(--radius-sm)]">
                  <p className="text-[var(--accent-primary)] text-center font-bold uppercase text-sm tracking-wide">
                    {Number(monthlyWeightChange) < 0
                      ? (language === 'tr' ? 'RAPOR OLUMLU. DEVAM ET.' : 'REPORT POSITIVE. CARRY ON.')
                      : (language === 'tr' ? 'DAHA SIKI ÇALIŞMAN GEREKECEK.' : 'YOU WILL NEED TO WORK HARDER.')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
      }

    </div>
  );
};