import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Calculator, Info, Dumbbell, Save, CheckCircle, Target } from 'lucide-react';
import { PRCalcResult, Language } from '../types';
import { getTranslation } from '../translations';

interface CalculatorsProps {
  onSavePr?: (pr: PRCalcResult) => void;
  language: Language;
}

interface FloatingInputProps {
  label: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  type?: string;
  suffix?: string;
  step?: string;
}

const FloatingInput = ({ label, value, onChange, placeholder, type = "number", suffix, step = "any" }: FloatingInputProps) => (
  <div className="relative group w-full">
    <label className="text-xs font-semibold text-[var(--accent-primary)] uppercase tracking-wider mb-2 block ml-1">
      {label}
    </label>
    <div className="relative">
      <input
        type={type}
        step={step}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-5 py-3.5 bg-[var(--bg-main)] border border-[var(--border-color)] focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-glow)] outline-none transition-all text-[var(--text-main)] font-medium placeholder-[var(--text-muted)] rounded-xl"
      />
      {suffix && (
        <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-xs font-bold uppercase tracking-widest group-focus-within:text-[var(--accent-primary)] transition-colors">
          {suffix}
        </span>
      )}
    </div>
  </div>
);

// --- 1RM CALCULATOR ---
const PRCalculatorTab = ({ onSave, language }: { onSave?: (pr: PRCalcResult) => void, language: Language }) => {
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [unit, setUnit] = useState<'kg' | 'lbs'>('kg');
  const [result, setResult] = useState<{ oneRepMax: number, weightKg: number } | null>(null);
  const [saved, setSaved] = useState(false);

  const calculate = (e: React.FormEvent) => {
    e.preventDefault();
    let w = parseFloat(weight);
    const r = parseFloat(reps);
    if (w > 0 && r > 0) {
      let weightInKg = unit === 'lbs' ? w * 0.45359237 : w;
      const oneRepMax = Math.round(weightInKg * (1 + r / 30));
      setResult({ oneRepMax, weightKg: weightInKg });
      setSaved(false);
    }
  };

  const handleSave = () => {
    if (result && onSave) {
      onSave({ weight: result.weightKg, reps: parseFloat(reps), oneRepMax: result.oneRepMax });
      setSaved(true);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in relative z-10">
      <div className="flex items-start gap-4 p-5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-glow)] to-transparent opacity-20 pointer-events-none"></div>
        <div className="absolute top-0 right-0 p-2 opacity-10"><Dumbbell size={64} /></div>
        <Info className="text-[var(--accent-primary)] flex-shrink-0 mt-0.5 relative z-10" size={20} />
        <div className="relative z-10">
          <p className="text-xs text-[var(--accent-primary)] font-bold uppercase tracking-wider mb-1">Epley Formula</p>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed">
            Estimates your theoretical one-rep maximum based on submaximal efforts. Optimal accuracy when utilizing 1-10 repetitions.
          </p>
        </div>
      </div>

      <div className="flex justify-center mb-6">
        <div className="flex p-1 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl">
          {['kg', 'lbs'].map(u => (
            <button
              key={u} type="button" onClick={() => setUnit(u as any)}
              className={`px-8 py-2 text-sm font-semibold tracking-wider rounded-lg transition-all
                  ${unit === u ? 'bg-[var(--accent-primary)] text-white shadow-md' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
            >
              {u.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={calculate} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FloatingInput label={`Weight`} value={weight} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWeight(e.target.value)} placeholder="0" suffix={unit.toUpperCase()} />
          <FloatingInput label="Reps" value={reps} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setReps(e.target.value)} placeholder="0" />
        </div>
        <button type="submit" className="btn-primary w-full py-4 text-lg mt-2">
          {getTranslation(language, 'calculate') || 'Calculate 1RM'}
        </button>
      </form>

      {result && (
        <div className="animate-scale-in space-y-6 pt-6">
          <div className="glass-card p-10 bg-[var(--bg-card)] border border-[var(--accent-primary)] text-center relative overflow-hidden rounded-2xl shadow-lg">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_70%)] pointer-events-none"></div>
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><Dumbbell size={180} /></div>
            
            <p className="text-xs text-[var(--text-muted)] uppercase font-semibold tracking-widest mb-4 relative z-10">Estimated 1RM</p>
            <div className="flex items-baseline justify-center gap-3 mb-2 relative z-10">
              <p className="text-7xl font-heading font-extrabold text-[var(--text-main)] tracking-tight m-0">{result.oneRepMax}</p>
              <span className="text-xl font-heading font-bold text-[var(--accent-primary)]">KG</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { l: 'Strength (90%)', v: Math.round(result.oneRepMax * 0.9) },
              { l: 'Hypertrophy (70%)', v: Math.round(result.oneRepMax * 0.7) }
            ].map((zone) => (
              <div key={zone.l} className="p-5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl text-center">
                <p className="text-[10px] text-[var(--text-muted)] font-semibold uppercase mb-2 tracking-widest">{zone.l}</p>
                <p className="text-2xl font-heading font-bold text-[var(--text-main)] m-0">{zone.v} <span className="text-xs font-semibold text-[var(--text-muted)]">KG</span></p>
              </div>
            ))}
          </div>

          {onSave && (
            <button
              onClick={handleSave} disabled={saved}
              className={`w-full py-3.5 rounded-xl font-semibold tracking-wide uppercase transition-all flex items-center justify-center gap-2 mt-4
                ${saved ? 'bg-green-500/10 border border-green-500/30 text-green-500 cursor-not-allowed' : 'bg-transparent border border-[var(--border-strong)] text-[var(--accent-primary)] hover:border-[var(--accent-primary)] hover:bg-[var(--accent-glow)]'}`}
            >
              {saved ? <><CheckCircle size={18} /> Record Saved</> : <><Save size={18} /> Save Record</>}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export const Calculators: React.FC<CalculatorsProps> = ({ onSavePr, language }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20 px-4">
      {/* Header */}
      <div className="glass-card p-10 relative overflow-hidden rounded-2xl border border-[var(--border-color)]">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-glow)] to-transparent opacity-50 pointer-events-none"></div>
        <div className="absolute right-0 top-0 p-8 opacity-5 transform translate-x-10 -translate-y-10 pointer-events-none">
          <Calculator size={180} className="text-[var(--accent-primary)]" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-4 mb-3">
              <div className="p-3.5 bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-xl shadow-lg border border-white/10">
                <Calculator size={28} className="text-white" />
              </div>
              <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-[var(--text-main)]">
                {getTranslation(language, 'calculators') || 'Analytics'}
              </h2>
            </div>
            <p className="text-[var(--text-muted)] text-sm font-medium">
              Precision tools for strength tracking
            </p>
          </div>
        </div>
      </div>

      <div className="glass-card border border-[var(--border-color)] p-8 lg:p-10 rounded-2xl relative">
         <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent-primary)] opacity-[0.03] blur-[80px] pointer-events-none rounded-full"></div>
        <PRCalculatorTab onSave={onSavePr} language={language} />
      </div>
    </div>
  );
};
