import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { getTranslation } from '../translations';
import { WeightLog, Language, BodyMeasurementLog, User, BodyMeasurements } from '../types';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine, LineChart, Line } from 'recharts';
import { Plus, Target, TrendingDown, TrendingUp, Ruler, Scale } from 'lucide-react';

interface WeightTrackerProps {
  logs: WeightLog[];
  measurementLogs?: BodyMeasurementLog[];
  user?: User | null;
  onAddLog: (weight: number) => void;
  onAddMeasurement?: (measurements: BodyMeasurements) => void;
  targetWeight?: number;
  onUpdateTargetWeight?: (weight: number) => void;
  onClearLogs?: () => void;
  language: Language;
}

// Internal Floating Input
const FloatingInput = ({ label, value, onChange, placeholder }: any) => (
  <div className="relative group">
    <label className="text-[10px] font-bold text-[var(--accent-primary)] uppercase tracking-[0.2em] mb-1 block ml-1">{label}</label>
    <input
      type="number"
      step="0.1"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-2 bg-[#14110F] border border-[var(--border-color)] rounded-[2px] focus:outline-none focus:border-[var(--accent-primary)] transition-all text-[var(--text-main)] font-mono placeholder-[var(--text-muted)] text-lg"
    />
  </div>
);

export const WeightTracker: React.FC<WeightTrackerProps> = ({
  logs, measurementLogs = [], user,
  onAddLog, onAddMeasurement, targetWeight, onUpdateTargetWeight, onClearLogs, language
}) => {
  const [activeTab, setActiveTab] = useState<'weight' | 'measurements'>('weight');

  // Weight State
  const [weight, setWeight] = useState('');
  const [newTargetWeight, setNewTargetWeight] = useState(targetWeight?.toString() || '');
  const [showTargetInput, setShowTargetInput] = useState(false);

  // Measurement State
  const [measurements, setMeasurements] = useState<BodyMeasurements>({
    waist: user?.measurements?.waist,
    arm: user?.measurements?.arm,
    chest: user?.measurements?.chest,
    shoulder: user?.measurements?.shoulder,
    leg: user?.measurements?.leg,
    neck: user?.measurements?.neck
  });

  // Sync state with user data
  React.useEffect(() => {
    if (user?.measurements) {
      setMeasurements(prev => ({ ...prev, ...user.measurements }));
    }
  }, [user?.measurements]);

  const handleSubmitWeight = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(weight);
    if (!isNaN(w) && w > 0) {
      onAddLog(w);
      setWeight('');
    }
  };

  const handleSubmitMeasurements = (e: React.FormEvent) => {
    e.preventDefault();
    if (onAddMeasurement) {
      onAddMeasurement(measurements);
    }
  };

  const handleSaveTarget = () => {
    const w = parseFloat(newTargetWeight);
    if (!isNaN(w) && w > 0 && onUpdateTargetWeight) {
      onUpdateTargetWeight(w);
      setShowTargetInput(false);
    }
  };

  const currentWeight = logs.length > 0 ? logs[logs.length - 1].weight : 0;
  const startWeight = logs.length > 0 ? logs[0].weight : 0;
  const totalLost = startWeight - currentWeight;
  const toGoal = targetWeight ? currentWeight - targetWeight : 0;
  const progressPercent = targetWeight && startWeight !== targetWeight
    ? Math.min(100, Math.max(0, ((startWeight - currentWeight) / (startWeight - targetWeight)) * 100))
    : 0;

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[var(--border-color)] pb-4">
        <div>
          <h2 className="text-3xl font-heading text-[var(--text-main)] tracking-wide uppercase flex items-center gap-3">
            <div className="p-1.5 bg-[var(--accent-primary)] text-[#14110F] rounded-[2px] inline-flex">
              {activeTab === 'weight' ? <Scale size={24} /> : <Ruler size={24} />}
            </div>
            {activeTab === 'weight' && getTranslation(language, 'weight_tracker')}
            {activeTab === 'measurements' && getTranslation(language, 'body_measurements')}
          </h2>
          <p className="text-[var(--text-muted)] font-mono text-sm mt-1 uppercase tracking-widest pl-1">
            {activeTab === 'weight' && getTranslation(language, 'track_weight_desc')}
            {activeTab === 'measurements' && getTranslation(language, 'track_body_desc')}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex p-1 bg-[#14110F] border border-[var(--border-color)] rounded-[2px] self-start md:self-auto">
          <button
            onClick={() => setActiveTab('weight')}
            className={`px-4 py-2 rounded-[1px] text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'weight' ? 'bg-[var(--accent-primary)] text-[#14110F]' : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[rgba(255,255,255,0.05)]'}`}
          >
            {getTranslation(language, 'weight')}
          </button>
          <button
            onClick={() => setActiveTab('measurements')}
            className={`px-4 py-2 rounded-[1px] text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'measurements' ? 'bg-[var(--accent-primary)] text-[#14110F]' : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[rgba(255,255,255,0.05)]'}`}
          >
            {getTranslation(language, 'measurements')}
          </button>
        </div>
      </div>

      {activeTab === 'weight' && (
        <div className="space-y-6 animate-slide-up">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="vintage-card p-4 rounded-[2px] border border-[var(--border-color)] bg-[#1D1916]">
              <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em]">{getTranslation(language, 'current')}</div>
              <div className="text-2xl font-heading text-[var(--text-main)] mt-1 tracking-wide">{currentWeight} <span className="text-sm font-mono text-[var(--text-muted)]">KG</span></div>
            </div>
            <div className="vintage-card p-4 rounded-[2px] border border-[var(--border-color)] bg-[#1D1916]">
              <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em]">{getTranslation(language, 'total_lost')}</div>
              <div className={`text-2xl font-heading mt-1 flex items-center gap-1 ${totalLost > 0 ? 'text-[#4CAF50]' : totalLost < 0 ? 'text-[#EF5350]' : 'text-[var(--text-muted)]'}`}>
                {totalLost > 0 ? <TrendingDown size={16} /> : totalLost < 0 ? <TrendingUp size={16} /> : null}
                {Math.abs(totalLost).toFixed(1)} <span className="text-sm font-mono text-[var(--text-muted)]">KG</span>
              </div>
            </div>
            <div className="panel-technical p-4 relative overflow-hidden group bg-[var(--bg-card)]">
              {/* Replaced gradient with technical panel */}
              <div className="text-[10px] font-bold text-[var(--accent-primary)] uppercase tracking-[0.2em]">{getTranslation(language, 'target_goal')}</div>
              <div className="text-2xl font-heading mt-1 flex items-center gap-2 text-[var(--text-main)] tracking-wide">
                <Target size={18} className="text-[var(--accent-primary)]" />
                {targetWeight ? `${targetWeight} kg` : getTranslation(language, 'not_set')}
              </div>
              <button
                onClick={() => setShowTargetInput(!showTargetInput)}
                className="absolute top-2 right-2 text-[var(--text-muted)] hover:text-[var(--accent-primary)] text-[10px] uppercase font-bold tracking-wider border border-[var(--border-color)] px-2 py-0.5 rounded-[2px]"
              >
                {targetWeight ? getTranslation(language, 'edit') : getTranslation(language, 'set')}
              </button>
            </div>
            <div className="vintage-card p-4 rounded-[2px] border border-[var(--border-color)] bg-[#1D1916]">
              <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em]">{getTranslation(language, 'to_goal')}</div>
              <div className={`text-2xl font-heading mt-1 tracking-wide ${toGoal > 0 ? 'text-[var(--accent-primary)]' : toGoal < 0 ? 'text-[#4CAF50]' : 'text-[var(--text-muted)]'}`}>
                {targetWeight ? `${Math.abs(toGoal).toFixed(1)} kg` : '-'}
              </div>
            </div>
          </div>

          {/* Target Weight Input */}
          {showTargetInput && (
            <div className="bg-[#14110F] rounded-[2px] p-4 border border-[var(--accent-primary)] flex items-center gap-4 animate-fade-in shadow-[0px_0px_10px_rgba(200,123,42,0.1)]">
              <Target size={24} className="text-[var(--accent-primary)]" />
              <input
                type="number"
                step="0.1"
                value={newTargetWeight}
                onChange={(e) => setNewTargetWeight(e.target.value)}
                placeholder={getTranslation(language, 'enter_target_weight')}
                className="flex-1 px-4 py-2 bg-[#14110F] border border-[var(--border-color)] rounded-[2px] focus:outline-none focus:border-[var(--accent-primary)] text-[var(--text-main)] font-mono"
              />
              <Button onClick={handleSaveTarget} size="sm" className="bg-[var(--accent-primary)] text-black font-bold uppercase tracking-wider">{getTranslation(language, 'save_target')}</Button>
              <button onClick={() => setShowTargetInput(false)} className="text-[var(--text-muted)] hover:text-[#EF5350]">✕</button>
            </div>
          )}

          {/* Progress Bar */}
          {targetWeight && (
            <div className="bg-[#14110F] rounded-[2px] p-4 border border-[var(--border-color)]">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-[var(--text-muted)] text-xs font-bold uppercase tracking-wider">{getTranslation(language, 'progress_to_goal')}</span>
                <span className="font-mono font-bold text-[var(--accent-primary)]">{progressPercent.toFixed(0)}%</span>
              </div>
              <div className="h-2 bg-[#000000] border border-[var(--border-color)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--accent-primary)] transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2" title={getTranslation(language, 'progress')}>
              <div className="h-80 w-full mt-4 min-h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={logs} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorWeightMain" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#C87B2A" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#C87B2A" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="rgba(200, 123, 42, 0.1)" />
                    <XAxis dataKey="date" stroke="#555" fontSize={10} tickLine={false} axisLine={false} dy={10} tick={{ fill: '#A09B96' }} />
                    <YAxis stroke="#555" fontSize={10} tickLine={false} axisLine={false} domain={['dataMin - 5', 'dataMax + 5']} dx={-10} tick={{ fill: '#A09B96' }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1D1916', borderRadius: '4px', border: '1px solid #C87B2A', boxShadow: 'none' }}
                      itemStyle={{ color: '#EAEAEA', fontFamily: 'monospace' }}
                      cursor={{ stroke: '#C87B2A', strokeWidth: 1, strokeDasharray: '4 4' }}
                    />
                    {targetWeight && (
                      <ReferenceLine
                        y={targetWeight}
                        stroke="#4CAF50"
                        strokeDasharray="5 5"
                        strokeWidth={1}
                        label={{ value: `${getTranslation(language, 'goal')}: ${targetWeight}kg`, fill: '#4CAF50', fontSize: 10, position: 'right' }}
                      />
                    )}
                    <Area type="monotone" dataKey="weight" stroke="#C87B2A" strokeWidth={2} fillOpacity={1} fill="url(#colorWeightMain)" animationDuration={1500} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card title={getTranslation(language, 'log_entry')}>
              <form onSubmit={handleSubmitWeight} className="space-y-6 mt-4">
                <FloatingInput
                  label={getTranslation(language, 'current_weight_kg')}
                  value={weight}
                  onChange={(e: any) => setWeight(e.target.value)}
                  placeholder="0.0"
                />
                <Button type="submit" className="w-full bg-[var(--accent-primary)] text-black border border-black shadow-[2px_2px_0px_#000] hover:translate-[1px_1px] hover:shadow-[1px_1px_0px_#000] transition-all uppercase font-bold tracking-widest" disabled={!weight} size="lg">
                  <Plus size={20} />
                  {getTranslation(language, 'add_entry')}
                </Button>
              </form>

              <div className="mt-8">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wide">{getTranslation(language, 'history_title')}</h4>
                  {onClearLogs && logs.length > 0 && (
                    <button
                      onClick={onClearLogs}
                      className="text-xs font-semibold text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 px-2 py-1 rounded transition-colors"
                    >
                      {getTranslation(language, 'clear_history')}
                    </button>
                  )}
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {logs.slice().reverse().map((log, i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-[#14110F] border border-[var(--border-color)] rounded-[2px]">
                      <span className="text-[var(--text-muted)] text-xs font-mono">{log.date}</span>
                      <span className="font-bold text-[var(--accent-primary)]">{log.weight} kg</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'measurements' && (
        <div className="space-y-6 animate-slide-up">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card title={getTranslation(language, 'measurement_history_chart')}>
                <div className="h-80 w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={measurementLogs.map(m => ({ date: m.date, ...m.measurements }))}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(200, 123, 42, 0.1)" opacity={0.5} />
                      <XAxis dataKey="date" stroke="#555" fontSize={10} tickLine={false} axisLine={false} dy={10} tick={{ fill: '#A09B96' }} />
                      <YAxis stroke="#555" fontSize={10} tickLine={false} axisLine={false} dx={-10} tick={{ fill: '#A09B96' }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1D1916', borderRadius: '4px', border: '1px solid #C87B2A' }}
                        itemStyle={{ color: '#EAEAEA', fontFamily: 'monospace' }}
                        cursor={{ stroke: '#C87B2A', strokeWidth: 1, strokeDasharray: '4 4' }}
                      />
                      <Line type="monotone" dataKey="waist" stroke="#C87B2A" strokeWidth={2} dot={{ r: 3, fill: '#C87B2A' }} name={getTranslation(language, 'waist_circumference')} />
                      <Line type="monotone" dataKey="arm" stroke="#4CAF50" strokeWidth={2} dot={{ r: 3, fill: '#4CAF50' }} name={getTranslation(language, 'arm_circumference')} />
                      <Line type="monotone" dataKey="chest" stroke="#EF5350" strokeWidth={2} dot={{ r: 3, fill: '#EF5350' }} name={getTranslation(language, 'chest')} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
            <div>
              <Card title={getTranslation(language, 'update_measurements')}>
                <form onSubmit={handleSubmitMeasurements} className="space-y-4 mt-2">
                  <div className="grid grid-cols-2 gap-4">
                    <FloatingInput label={getTranslation(language, 'waist_circumference')} value={measurements.waist || ''} onChange={(e: any) => setMeasurements({ ...measurements, waist: parseFloat(e.target.value) })} placeholder="cm" />
                    <FloatingInput label={getTranslation(language, 'arm_circumference')} value={measurements.arm || ''} onChange={(e: any) => setMeasurements({ ...measurements, arm: parseFloat(e.target.value) })} placeholder="cm" />
                    <FloatingInput label={getTranslation(language, 'shoulder')} value={measurements.shoulder || ''} onChange={(e: any) => setMeasurements({ ...measurements, shoulder: parseFloat(e.target.value) })} placeholder="cm" />
                    <FloatingInput label={getTranslation(language, 'chest')} value={measurements.chest || ''} onChange={(e: any) => setMeasurements({ ...measurements, chest: parseFloat(e.target.value) })} placeholder="cm" />
                    <FloatingInput label={getTranslation(language, 'leg')} value={measurements.leg || ''} onChange={(e: any) => setMeasurements({ ...measurements, leg: parseFloat(e.target.value) })} placeholder="cm" />
                    <FloatingInput label={getTranslation(language, 'neck_circumference')} value={measurements.neck || ''} onChange={(e: any) => setMeasurements({ ...measurements, neck: parseFloat(e.target.value) })} placeholder="cm" />
                  </div>
                  <Button type="submit" className="w-full mt-4 bg-[var(--accent-primary)] text-black border border-black shadow-[2px_2px_0px_#000] hover:translate-[1px_1px] hover:shadow-[1px_1px_0px_#000] transition-all uppercase font-bold tracking-widest" size="lg">
                    <Ruler size={20} /> {getTranslation(language, 'save_measurements')}
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};