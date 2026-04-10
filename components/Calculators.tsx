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
    <label className="text-[10px] font-bold text-[var(--accent-primary)] uppercase tracking-[0.2em] mb-1.5 block ml-1 font-mono">
      {label}
    </label>
    <div className="relative">
      <input
        type={type}
        step={step}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-[#14110F] border-2 border-[#26211D] focus:border-[var(--accent-primary)] outline-none transition-all text-[var(--text-main)] font-mono placeholder-[#3A3530] rounded-[2px]"
      />
      {suffix && (
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#3A3530] text-[10px] font-bold uppercase tracking-widest font-mono group-focus-within:text-[var(--accent-primary)] transition-colors">
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
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-start gap-4 p-5 bg-[#14110F] border-2 border-[#26211D] relative overflow-hidden">
        <div className="absolute top-0 right-0 p-1 opacity-5"><Dumbbell size={48} /></div>
        <Info className="text-purple-600 flex-shrink-0 mt-0.5" size={20} />
        <div>
          <p className="text-[10px] text-purple-600 font-mono font-bold uppercase tracking-widest mb-1">STRENGTH_LOAD // EPLEY_ESTIMATE</p>
          <p className="text-xs text-[var(--text-muted)] font-mono uppercase tracking-tight leading-relaxed">
            Estimates structural maximum strength. Optimal accuracy in 1-10 repetition range.
          </p>
        </div>
      </div>

      <div className="flex justify-center mb-4">
        <div className="flex p-1 bg-[#14110F] border-2 border-[#26211D] rounded-[2px] shadow-[6px_6px_0px_#000]">
          {['kg', 'lbs'].map(u => (
            <button
              key={u} type="button" onClick={() => setUnit(u as any)}
              className={`px-8 py-2 font-heading text-xs tracking-widest transition-all
                  ${unit === u ? 'bg-[var(--accent-primary)] text-black shadow-[3px_3px_0px_#000]' : 'text-[#3A3530] hover:text-[var(--text-muted)]'}`}
            >
              {u.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={calculate} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FloatingInput label={`MASS_INPUT_${unit.toUpperCase()}`} value={weight} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWeight(e.target.value)} placeholder="0" suffix={unit.toUpperCase()} />
          <FloatingInput label="REPETITION_COUNT" value={reps} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setReps(e.target.value)} placeholder="0" />
        </div>
        <button type="submit" className="btn-primary w-full py-5 text-2xl tracking-[0.3em] shadow-[10px_10px_0px_#000]">
          {getTranslation(language, 'calculate') || 'RUN_LOAD_ANALYTICS'} // START
        </button>
      </form>

      {result && (
        <div className="animate-scale-in space-y-8 pt-4">
          <div className="panel-technical p-10 bg-[#1D1916] border-2 border-[var(--accent-primary)] text-center shadow-[15px_15px_0px_rgba(0,0,0,0.5)] bg-grid-pattern relative">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><Dumbbell size={180} /></div>
            <p className="text-[10px] text-[#3A3530] uppercase font-mono font-bold tracking-[0.3em] mb-4">ESTIMATED_MAX_CAPACITY</p>
            <div className="flex items-baseline justify-center gap-3 mb-6">
              <p className="text-8xl font-heading text-[var(--text-main)] tracking-tighter m-0">{result.oneRepMax}</p>
              <span className="text-2xl font-heading text-[var(--accent-primary)]">KG</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {[
              { l: 'TRAINING_LOAD (90%)', v: Math.round(result.oneRepMax * 0.9) },
              { l: 'HYPERTROPHY_ZONE (70%)', v: Math.round(result.oneRepMax * 0.7) }
            ].map((zone) => (
              <div key={zone.l} className="p-6 bg-[#14110F] border-2 border-[#26211D] text-center shadow-[6px_6px_0px_#000]">
                <p className="text-[9px] text-[#3A3530] font-mono font-bold uppercase mb-3 tracking-widest">{zone.l}</p>
                <p className="text-3xl font-heading text-[var(--text-main)] m-0">{zone.v} <span className="text-xs font-mono font-bold text-[#3A3530]">KG</span></p>
              </div>
            ))}
          </div>

          {onSave && (
            <button
              onClick={handleSave} disabled={saved}
              className={`w-full py-4 border-2 font-heading tracking-widest uppercase transition-all shadow-[8px_8px_0px_#000] active:shadow-none
                ${saved ? 'bg-[#1D1916] border-green-900 text-green-900 shadow-none grayscale' : 'bg-[#1D1916] border-[var(--accent-primary)] text-[var(--accent-primary)] hover:bg-[var(--accent-primary)] hover:text-black'}`}
            >
              {saved ? <span className="flex items-center justify-center gap-3"><CheckCircle size={20} /> RECORD_ARCHIVED</span> : <span className="flex items-center justify-center gap-3"><Save size={20} /> SYNC_TO_HISTORY</span>}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export const Calculators: React.FC<CalculatorsProps> = ({ onSavePr, language }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-fade-in pb-20 px-4">
      <div className="panel-technical p-10 bg-[#1D1916] border-2 border-[#26211D] bg-grid-pattern relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><Calculator size={180} className="text-[var(--accent-primary)]" /></div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 bg-[#14110F] border-2 border-[var(--accent-primary)] text-[var(--accent-primary)] shadow-[4px_4px_0px_#000]">
                <Calculator size={32} />
              </div>
              <h2 className="text-4xl md:text-5xl font-heading text-[var(--text-main)] tracking-widest uppercase text-stamped">
                {getTranslation(language, 'calculators') || 'STRENGTH_ANALYTICS'}
              </h2>
            </div>
            <p className="text-[var(--text-muted)] font-mono text-sm uppercase tracking-[0.3em] ml-1 opacity-70">
              MODULE_ID: CALC_X9 // STRENGTH_SUITE
            </p>
          </div>
        </div>
      </div>

      <div className="panel-technical bg-[#1D1916] border-2 border-[#26211D] p-10 shadow-[15px_15px_0px_rgba(0,0,0,0.5)]">
        <PRCalculatorTab onSave={onSavePr} language={language} />
      </div>
    </div>
  );
};
