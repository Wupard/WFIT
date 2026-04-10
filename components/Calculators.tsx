import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Calculator, Info, ArrowRight, AlertTriangle, Scale, Activity, Clock, Dumbbell, Save, CheckCircle, Target, ScanLine, RefreshCw, ChevronRight, Ruler } from 'lucide-react';
import { Gender, PRCalcResult, Language } from '../types';
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

// --- TAB 1: CONVERTER ---
const UnitConverter = ({ language }: { language: Language }) => {
  const [kg, setKg] = useState<number | null>(null);
  const [lbs, setLbs] = useState<number | null>(null);
  const [cm, setCm] = useState<number | null>(null);
  const [ft, setFt] = useState<number | null>(null);
  const [inch, setInch] = useState<number | null>(null);

  const handleWeightChange = (value: string, unit: 'kg' | 'lbs') => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      setKg(null); setLbs(null); return;
    }
    if (unit === 'kg') {
      setKg(numValue); setLbs(numValue * 2.20462);
    } else {
      setLbs(numValue); setKg(numValue / 2.20462);
    }
  };

  const handleHeightChange = (value: string, unit: 'cm' | 'ft' | 'inch') => {
    let newCm: number | null = null;
    let newFt: number | null = null;
    let newInch: number | null = null;

    if (unit === 'cm') {
      newCm = parseFloat(value);
      if (!isNaN(newCm)) {
        const totalInches = newCm / 2.54;
        newFt = Math.floor(totalInches / 12);
        newInch = parseFloat((totalInches % 12).toFixed(1));
      }
    } else if (unit === 'ft') {
      newFt = parseFloat(value);
      newInch = inch;
      if (!isNaN(newFt)) {
        const totalInches = (newFt * 12) + (isNaN(newInch) ? 0 : newInch || 0);
        newCm = parseFloat((totalInches * 2.54).toFixed(1));
      }
    } else if (unit === 'inch') {
      newInch = parseFloat(value);
      newFt = ft;
      if (!isNaN(newInch)) {
        const totalInches = (isNaN(newFt) ? 0 : newFt || 0) * 12 + newInch;
        newCm = parseFloat((totalInches * 2.54).toFixed(1));
      }
    }

    setCm(isNaN(newCm) ? null : newCm);
    setFt(isNaN(newFt) ? null : newFt);
    setInch(isNaN(newInch) ? null : newInch);
  };

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Weight Conversion */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b-2 border-[#26211D] pb-3">
            <Scale size={20} className="text-[var(--accent-primary)]" />
            <h3 className="font-heading tracking-[0.2em] text-xl text-[var(--text-main)] uppercase m-0">{getTranslation(language, 'weight')} // MASS</h3>
          </div>
          <div className="space-y-6">
            <FloatingInput label="INITIAL_METRIC" value={kg || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleWeightChange(e.target.value, 'kg')} placeholder="0.00" suffix="KG" />
            <div className="flex justify-center py-2 opacity-20"><RefreshCw size={24} className="animate-spin-slow" /></div>
            <FloatingInput label="IMPERIAL_READOUT" value={lbs ? lbs.toFixed(2) : ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleWeightChange(e.target.value, 'lbs')} placeholder="0.00" suffix="LBS" />
          </div>
        </div>

        {/* Height Conversion */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b-2 border-[#26211D] pb-3">
            <Ruler size={20} className="text-[var(--accent-primary)]" />
            <h3 className="font-heading tracking-[0.2em] text-xl text-[var(--text-main)] uppercase m-0">{getTranslation(language, 'height')} // SCALE</h3>
          </div>
          <div className="space-y-6">
            <FloatingInput label="METRIC_DEPTH" value={cm || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleHeightChange(e.target.value, 'cm')} placeholder="0.00" suffix="CM" />
            <div className="flex justify-center py-2 opacity-20"><RefreshCw size={24} className="animate-spin-slow" /></div>
            <div className="grid grid-cols-2 gap-4">
              <FloatingInput label="UNIT_FEET" value={ft || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleHeightChange(e.target.value, 'ft')} placeholder="0" suffix="FT" />
              <FloatingInput label="UNIT_INCH" value={inch || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleHeightChange(e.target.value, 'inch')} placeholder="0.0" suffix="IN" />
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 bg-[#14110F] border-2 border-[#26211D] relative overflow-hidden">
        <div className="absolute top-0 right-0 p-1 opacity-5"><Info size={48} /></div>
        <p className="text-[10px] text-[var(--text-muted)] font-mono uppercase tracking-tight leading-relaxed m-0">
          <span className="text-[var(--accent-primary)] font-bold mr-2">// PROTOCOL:</span>
          All conversions use high-precision coefficients. CM to Inches (2.54), KG to LBS (2.20462). Bi-directional sync enabled.
        </p>
      </div>
    </div>
  );
};

// --- TAB 2: BODY FAT ---
const BodyFatCalculator = ({ language }: { language: Language }) => {
  const [gender, setGender] = useState<Gender>(Gender.Male);
  const [height, setHeight] = useState('');
  const [waist, setWaist] = useState('');
  const [neck, setNeck] = useState('');
  const [hip, setHip] = useState('');
  const [result, setResult] = useState<number | null>(null);

  const calculateBodyFat = (e: React.FormEvent) => {
    e.preventDefault();
    const h = parseFloat(height);
    const w = parseFloat(waist);
    const n = parseFloat(neck);
    const hi = parseFloat(hip);

    if (h > 0 && w > 0 && n > 0) {
      let bf = 0;
      if (gender === Gender.Male) {
        if (w - n <= 1) return; // Formula requires positive value for log10
        bf = 495 / (1.0324 - 0.19077 * Math.log10(w - n) + 0.15456 * Math.log10(h)) - 450;
      } else {
        if (!hi || (w + hi - n) <= 1) return;
        bf = 495 / (1.29579 - 0.35004 * Math.log10(w + hi - n) + 0.22100 * Math.log10(h)) - 450;
      }
      setResult(Math.max(0, parseFloat(bf.toFixed(1))));
    }
  };

  const interpretationStrings: any = {
    essential_fat: { text: getTranslation(language, 'essential_fat_label'), color: "text-blue-500" },
    athletic: { text: getTranslation(language, 'athletic_label'), color: "text-[var(--accent-primary)]" },
    fitness: { text: getTranslation(language, 'fitness_label'), color: "text-[var(--accent-primary)]" },
    average: { text: getTranslation(language, 'average_label'), color: "text-amber-500" },
    obese: { text: getTranslation(language, 'obese_label'), color: "text-red-500" }
  };

  const getInterpretation = (bf: number, g: Gender) => {
    if (g === Gender.Male) {
      if (bf < 6) return interpretationStrings.essential_fat;
      if (bf < 14) return interpretationStrings.athletic;
      if (bf < 18) return interpretationStrings.fitness;
      if (bf < 25) return interpretationStrings.average;
      return interpretationStrings.obese;
    } else {
      if (bf < 14) return interpretationStrings.essential_fat;
      if (bf < 21) return interpretationStrings.athletic;
      if (bf < 25) return interpretationStrings.fitness;
      if (bf < 32) return interpretationStrings.average;
      return interpretationStrings.obese;
    }
  };

  const interpretation = result !== null ? getInterpretation(result, gender) : null;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-start gap-4 p-5 bg-[#14110F] border-2 border-[#26211D] relative overflow-hidden">
        <div className="absolute top-0 right-0 p-1 opacity-5"><Activity size={48} /></div>
        <Info className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
        <div>
          <p className="text-[10px] text-amber-600 font-mono font-bold uppercase tracking-widest mb-1">US_NAVY_CERTIFIED_METHOD</p>
          <p className="text-xs text-[var(--text-muted)] font-mono uppercase tracking-tight leading-relaxed">
            Estimates regional adipose content through circumferential scanning. NOT A MEDICAL DIAGNOSIS.
          </p>
        </div>
      </div>

      <div className="flex gap-6 mb-4">
        {[Gender.Male, Gender.Female].map((g) => (
          <button
            key={g} type="button" onClick={() => setGender(g)}
            className={`flex-1 py-3 border-2 transition-all font-heading tracking-widest uppercase shadow-[4px_4px_0px_#000] active:shadow-none
              ${gender === g ? 'bg-[var(--accent-primary)] text-black border-black' : 'bg-[#14110F] border-[#26211D] text-[#3A3530]'}`}
          >
            {getTranslation(language, g.toLowerCase() as any) || g}
          </button>
        ))}
      </div>

      <form onSubmit={calculateBodyFat} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FloatingInput label="HEIGHT_DATA" value={height} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHeight(e.target.value)} placeholder="0.0" suffix="CM" />
        <FloatingInput label="NECK_GIRTH" value={neck} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNeck(e.target.value)} placeholder="0.0" suffix="CM" />
        <FloatingInput label="WAIST_GIRTH" value={waist} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWaist(e.target.value)} placeholder="0.0" suffix="CM" />
        {gender === Gender.Female && (
          <FloatingInput label="HIP_GIRTH" value={hip} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHip(e.target.value)} placeholder="0.0" suffix="CM" />
        )}
        <div className="md:col-span-2 mt-4">
          <button type="submit" className="btn-primary w-full py-4 text-xl tracking-[0.2em] shadow-[10px_10px_0px_#000]">
            {getTranslation(language, 'calculate') || 'RUN_ANALYTICS'} // BEGIN_SCAN
          </button>
        </div>
      </form>

      {result !== null && (
        <div className="panel-technical p-10 bg-[#1D1916] border-2 border-[var(--accent-primary)] text-center shadow-[15px_15px_0px_rgba(0,0,0,0.5)] animate-scale-in relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 opacity-5"><Target size={120} /></div>
          <p className="text-[10px] text-[#3A3530] uppercase font-mono font-bold tracking-[0.3em] mb-4">BODY_FAT_ESTIMATE</p>
          <p className="text-7xl font-heading text-[var(--text-main)] tracking-tighter mb-4">{result}%</p>
          <p className={`text-xl font-heading tracking-widest uppercase leading-none border-t border-[#26211D] pt-6 ${interpretation?.color}`}>
            {interpretation?.text}
          </p>
        </div>
      )}
    </div>
  );
};

// --- TAB 3: WEIGHT LOSS PROJECTION ---
const WeightLossProjector = ({ language }: { language: Language }) => {
  const [current, setCurrent] = useState('');
  const [target, setTarget] = useState('');
  const [rate, setRate] = useState('0.5');
  const [projection, setProjection] = useState<{ weeks: number, months: number, date: string } | null>(null);

  const calculateProjection = (e: React.FormEvent) => {
    e.preventDefault();
    const c = parseFloat(current);
    const t = parseFloat(target);
    const r = parseFloat(rate);

    if (c > 0 && t > 0 && r > 0 && c > t) {
      const diff = c - t;
      const weeks = diff / r;
      const months = weeks / 4.345;
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + (weeks * 7));

      setProjection({
        weeks: Math.round(weeks * 10) / 10,
        months: Math.round(months * 10) / 10,
        date: targetDate.toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', { month: 'long', year: 'numeric' }).toUpperCase()
      });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {parseFloat(rate) > 1 && (
        <div className="flex items-center gap-4 p-5 bg-[#14110F] border-2 border-red-900 shadow-[inset_4px_4px_10px_#000]">
          <AlertTriangle className="text-red-500 flex-shrink-0" size={24} />
          <p className="text-xs text-red-500 font-mono uppercase tracking-tight leading-relaxed">
            <span className="font-bold underline">WARNING:</span> RATE {rate}KG/WK EXCEEDS NOMINAL PARAMETERS. RISK OF MUSCLE DEGRADATION DETECTED.
          </p>
        </div>
      )}

      <form onSubmit={calculateProjection} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FloatingInput label="INITIAL_WEIGHT" value={current} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrent(e.target.value)} placeholder="0.0" suffix="KG" />
          <FloatingInput label="TARGET_GOAL" value={target} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTarget(e.target.value)} placeholder="0.0" suffix="KG" />
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-mono font-bold text-[#3A3530] uppercase tracking-widest ml-1">WEEKLY_DEPLETION_RATE (KG)</label>
          <div className="grid grid-cols-4 gap-4">
            {[0.25, 0.5, 0.75, 1.0].map(r => (
              <button
                key={r} type="button" onClick={() => setRate(r.toString())}
                className={`py-3 border-2 font-mono text-xs font-bold transition-all shadow-[4px_4px_0px_#000] active:shadow-none
                   ${rate === r.toString() ? 'bg-[var(--accent-primary)] text-black border-black' : 'bg-[#14110F] border-[#26211D] text-[#3A3530]'}`}
              >
                {r}KG
              </button>
            ))}
          </div>
          <div className="pt-4 px-2">
            <input
              type="range" min="0.1" max="1.5" step="0.1"
              value={rate} onChange={(e) => setRate(e.target.value)}
              className="w-full h-1 bg-[#26211D] appearance-none cursor-pointer accent-[var(--accent-primary)]"
            />
            <div className="text-center text-[10px] font-mono font-bold text-[var(--accent-primary)] mt-3 tracking-widest uppercase">RATE: {rate} KG / WEEK</div>
          </div>
        </div>

        <button type="submit" className="btn-primary w-full py-4 text-xl tracking-[0.2em] shadow-[10px_10px_0px_#000]">
          {getTranslation(language, 'calculate') || 'EXECUTE_SIMULATION'} // RUN
        </button>
      </form>

      {projection && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-scale-in">
          {[
            { l: 'MONTHS', v: projection.months, c: 'text-[var(--text-main)]', sc: 'PERIOD' },
            { l: 'WEEKS', v: projection.weeks, c: 'text-[var(--accent-primary)]', sc: 'INTERVAL' },
            { l: 'TARGET_DATE', v: projection.date, c: 'text-amber-500', sc: 'EST_COMPLETION' }
          ].map((item) => (
            <div key={item.l} className="panel-technical p-6 bg-[#1D1916] border-2 border-[#26211D] text-center shadow-[6px_6px_0px_#000]">
              <p className="text-[9px] text-[#3A3530] uppercase font-mono font-bold mb-4 tracking-widest">{item.l}</p>
              <p className={`text-2xl font-heading tracking-widest ${item.c} m-0`}>{item.v}</p>
              <p className="text-[8px] text-[#3A3530] font-mono mt-2 uppercase">{item.sc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- TAB 4: PR CALCULATOR ---
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
  const [activeTab, setActiveTab] = useState<'units' | 'bodyfat' | 'weightloss' | 'pr'>('pr');

  const tabs = [
    { id: 'pr', label: 'PR_CALC', icon: Dumbbell },
    { id: 'bodyfat', label: 'BF_SCAN', icon: Activity },
    { id: 'weightloss', label: 'PROJECTION', icon: Clock },
    { id: 'units', label: 'CONVERTER', icon: Scale },
  ];

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
                {getTranslation(language, 'calculators') || 'BIO_METRIC_TOOLS'}
              </h2>
            </div>
            <p className="text-[var(--text-muted)] font-mono text-sm uppercase tracking-[0.3em] ml-1 opacity-70">
              MODULE_ID: CALC_X9 // ANALYTICAL_SUITE
            </p>
          </div>

          <div className="flex bg-[#14110F] p-1.5 border-2 border-[#26211D] rounded-[2px] shadow-[6px_6px_0px_#000]">
            {tabs.map(tab => (
              <button
                key={tab.id} onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-3 px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap
                    ${activeTab === tab.id ? 'bg-[var(--accent-primary)] text-black shadow-[3px_3px_0px_#000]' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
              >
                <tab.icon size={16} /> <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="panel-technical bg-[#1D1916] border-2 border-[#26211D] p-10 shadow-[15px_15px_0px_rgba(0,0,0,0.5)]">
        {activeTab === 'units' && <UnitConverter language={language} />}
        {activeTab === 'bodyfat' && <BodyFatCalculator language={language} />}
        {activeTab === 'weightloss' && <WeightLossProjector language={language} />}
        {activeTab === 'pr' && <PRCalculatorTab onSave={onSavePr} language={language} />}
      </div>
    </div>
  );
};
