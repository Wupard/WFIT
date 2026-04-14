// @ts-nocheck
import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Calculator, Info, Dumbbell, Save, CheckCircle, Target, Scale, Activity, Zap, TrendingUp, User as UserIcon, Flame } from 'lucide-react';
import { PRCalcResult, Language } from '../types';
import { getTranslation } from '../translations';

interface CalculatorsProps {
  onSavePr?: (pr: PRCalcResult) => void;
  language: Language;
}

const FloatingInput = ({ label, value, onChange, placeholder, type = "number", suffix, step = "any" }: any) => (
  <div className="relative group w-full">
    <label className="text-xs font-semibold text-[var(--accent-primary)] uppercase tracking-wider mb-2 block ml-1">
      {label}
    </label>
    <div className="relative">
      <input
        type={type}
        step={step}
        min="0"
        max="999"
        value={value}
        onChange={(e) => {
          const val = e.target.value;
          if (val === '' || (parseFloat(val) <= 999 && parseFloat(val) >= 0)) {
            onChange(e);
          }
        }}
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

// 1. PR (1RM) CALCULATOR
const PRCalculator = ({ onSave, language }: any) => {
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [unit, setUnit] = useState<'kg' | 'lbs'>('kg');
  const [result, setResult] = useState(null);
  const [saved, setSaved] = useState(false);

  const calculate = () => {
    const w = parseFloat(weight);
    const r = parseFloat(reps);
    if (w > 0 && r > 0) {
      const weightKg = unit === 'lbs' ? w * 0.453592 : w;
      const oneRepMax = Math.round(weightKg * (1 + r / 30));
      setResult({ oneRepMax, weightKg });
      setSaved(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FloatingInput label={getTranslation(language, 'weight')} value={weight} onChange={e => setWeight(e.target.value)} placeholder="0" suffix={unit.toUpperCase()} />
        <FloatingInput label={getTranslation(language, 'repetitions')} value={reps} onChange={e => setReps(e.target.value)} placeholder="0" />
      </div>
      <button onClick={calculate} className="btn-primary w-full py-4 text-lg">{getTranslation(language, 'calculate')}</button>
      {result && (
        <div className="p-8 bg-[var(--bg-card)] border border-[var(--accent-primary)] rounded-2xl text-center space-y-4 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><Dumbbell size={120} /></div>
          <p className="text-xs text-[var(--text-muted)] uppercase font-bold tracking-[0.2em]">{getTranslation(language, 'estimated_1rm')}</p>
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-6xl font-black text-[var(--text-main)]">{result.oneRepMax}</span>
            <span className="text-xl font-bold text-[var(--accent-primary)]">KG</span>
          </div>
        </div>
      )}
    </div>
  );
};

// 2. UNIT CONVERTER
const UnitConverter = ({ language }: any) => {
  const [kg, setKg] = useState('');
  const [lbs, setLbs] = useState('');

  const handleKgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setKg(value);
    if (value === '' || isNaN(parseFloat(value))) {
      setLbs('');
    } else {
      setLbs((parseFloat(value) * 2.20462).toFixed(2));
    }
  };

  const handleLbsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLbs(value);
    if (value === '' || isNaN(parseFloat(value))) {
      setKg('');
    } else {
      setKg((parseFloat(value) * 0.453592).toFixed(2));
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <FloatingInput
            label="KILOGRAM (KG)"
            value={kg}
            onChange={handleKgChange}
            placeholder="0"
            suffix="KG"
          />
        </div>
        <div className="space-y-2">
          <FloatingInput
            label="POUNDS (LBS)"
            value={lbs}
            onChange={handleLbsChange}
            placeholder="0"
            suffix="LB"
          />
        </div>
      </div>

      <div className="p-8 bg-gradient-to-br from-[var(--bg-card)] to-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl text-center relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Scale size={100} /></div>
        <p className="text-xs font-bold text-[var(--accent-primary)] uppercase tracking-widest mb-1">{getTranslation(language, 'tab_lbs_kg')}</p>
        <p className="text-[var(--text-muted)] text-sm opacity-80">
          {language === 'tr' ? 'Her iki alandan da giriş yapabilirsiniz, değerler otomatik güncellenir.' : 'Enter value in either field to convert instantly.'}
        </p>
      </div>
    </div>
  );
};

// 3. BODY FAT (NAVY METHOD)
const BodyFatCalc = ({ language }: any) => {
  const [gender, setGender] = useState('male');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [waist, setWaist] = useState('');
  const [neck, setNeck] = useState('');
  const [hip, setHip] = useState('');
  const [bf, setBf] = useState(null);

  const calculate = () => {
    const h = parseFloat(height), w = parseFloat(waist), n = parseFloat(neck), hp = parseFloat(hip);
    if (!h || !w || !n) return;
    let result;
    if (gender === 'male') {
      result = 495 / (1.0324 - 0.19077 * Math.log10(w - n) + 0.15456 * Math.log10(h)) - 450;
    } else {
      result = 495 / (1.29579 - 0.35004 * Math.log10(w + hp - n) + 0.221 * Math.log10(h)) - 450;
    }
    setBf(result.toFixed(1));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex p-1 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl w-fit mx-auto mb-4">
        <button onClick={() => setGender('male')} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${gender === 'male' ? 'bg-[var(--accent-primary)] text-white' : 'text-[var(--text-muted)]'}`}>{getTranslation(language, 'male')}</button>
        <button onClick={() => setGender('female')} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${gender === 'female' ? 'bg-[var(--accent-primary)] text-white' : 'text-[var(--text-muted)]'}`}>{getTranslation(language, 'female')}</button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FloatingInput label={getTranslation(language, 'height')} value={height} onChange={e => setHeight(e.target.value)} placeholder="cm" suffix="CM" />
        <FloatingInput label={getTranslation(language, 'waist')} value={waist} onChange={e => setWaist(e.target.value)} placeholder="cm" suffix="CM" />
        <FloatingInput label={getTranslation(language, 'neck')} value={neck} onChange={e => setNeck(e.target.value)} placeholder="cm" suffix="CM" />
        {gender === 'female' && <FloatingInput label={getTranslation(language, 'hip')} value={hip} onChange={e => setHip(e.target.value)} placeholder="cm" suffix="CM" />}
      </div>
      <button onClick={calculate} className="btn-primary w-full py-4 text-lg">{getTranslation(language, 'calculate_bodyfat')}</button>
      {bf && (
        <div className="p-8 bg-gradient-to-br from-[var(--bg-card)] to-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl text-center">
          <p className="text-xs font-bold text-[var(--accent-primary)] uppercase tracking-widest mb-2">% Fat Percentage</p>
          <p className="text-6xl font-black text-[var(--text-main)]">{bf}%</p>
        </div>
      )}
    </div>
  );
};

// 4. PROGRESS (STRENGTH COMPARISON)
const StrengthProgress = ({ language }: any) => {
  const [oldW, setOldW] = useState('');
  const [oldR, setOldR] = useState('');
  const [newW, setNewW] = useState('');
  const [newR, setNewR] = useState('');
  const [diff, setDiff] = useState(null);

  const calculate = () => {
    const old1RM = parseFloat(oldW) * (1 + parseFloat(oldR) / 30);
    const new1RM = parseFloat(newW) * (1 + parseFloat(newR) / 30);
    if (!old1RM || !new1RM) return;
    setDiff(((new1RM - old1RM) / old1RM * 100).toFixed(1));
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-2 gap-6 pb-6 border-b border-[var(--border-color)]">
        <h4 className="col-span-2 text-xs font-black text-[var(--accent-primary)] uppercase tracking-widest">{getTranslation(language, 'past_lift')}</h4>
        <FloatingInput label="Weight" value={oldW} onChange={e => setOldW(e.target.value)} placeholder="kg" />
        <FloatingInput label="Reps" value={oldR} onChange={e => setOldR(e.target.value)} placeholder="reps" />
      </div>
      <div className="grid grid-cols-2 gap-6">
        <h4 className="col-span-2 text-xs font-black text-[var(--accent-secondary)] uppercase tracking-widest">{getTranslation(language, 'current_lift')}</h4>
        <FloatingInput label="Weight" value={newW} onChange={e => setNewW(e.target.value)} placeholder="kg" />
        <FloatingInput label="Reps" value={newR} onChange={e => setNewR(e.target.value)} placeholder="reps" />
      </div>
      <button onClick={calculate} className="btn-primary w-full py-4 text-lg">{getTranslation(language, 'compare_strength')}</button>
      {diff !== null && (
        <div className="p-8 glass-card border-[3px] border-[var(--accent-primary)] text-center rounded-3xl">
          <TrendingUp className="mx-auto mb-4 text-[var(--accent-primary)]" size={40} />
          <p className="text-2xl font-black text-[var(--text-main)]">{getTranslation(language, 'comparison_result').replace('{diff}', diff)}</p>
          <div className="mt-4 h-2 bg-[var(--bg-main)] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] transition-all duration-1000" style={{ width: `${Math.min(100, Math.max(0, parseFloat(diff)))}%` }}></div>
          </div>
        </div>
      )}
    </div>
  );
};

// 5. MACROS & CALORIES (SURPLUS/MAINTAIN)
const MacroCalc = ({ language }: any) => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [activity, setActivity] = useState('1.2');
  const [macros, setMacros] = useState(null);

  const calculate = () => {
    const w = parseFloat(weight), h = parseFloat(height), a = parseFloat(age), act = parseFloat(activity);
    if (!w || !h || !a) return;

    // Mifflin-St Jeor
    let bmr = gender === 'male'
      ? (10 * w) + (6.25 * h) - (5 * a) + 5
      : (10 * w) + (6.25 * h) - (5 * a) - 161;

    const tdee = bmr * act;
    setMacros({
      kcal: Math.round(tdee),
      p: Math.round(w * 2), // 2g/kg
      f: Math.round(w * 0.8), // 0.8g/kg
      c: Math.round((tdee - (w * 2 * 4) - (w * 0.8 * 9)) / 4)
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <FloatingInput label={getTranslation(language, 'weight')} value={weight} onChange={e => setWeight(e.target.value)} placeholder="kg" />
        <FloatingInput label={getTranslation(language, 'height')} value={height} onChange={e => setHeight(e.target.value)} placeholder="cm" />
        <FloatingInput label={getTranslation(language, 'age')} value={age} onChange={e => setAge(e.target.value)} placeholder="years" />
      </div>
      <div className="space-y-3">
        <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">{getTranslation(language, 'activity_level')}</label>
        <select
          value={activity}
          onChange={e => setActivity(e.target.value)}
          className="w-full px-5 py-3.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl outline-none text-[var(--text-main)]"
        >
          <option value="1.2">{getTranslation(language, 'sedentary')}</option>
          <option value="1.375">{getTranslation(language, 'light_active')}</option>
          <option value="1.55">{getTranslation(language, 'mod_active')}</option>
          <option value="1.725">{getTranslation(language, 'very_active')}</option>
          <option value="1.9">{getTranslation(language, 'extra_active')}</option>
        </select>
      </div>
      <button onClick={calculate} className="btn-primary w-full py-4 text-lg">{getTranslation(language, 'calculate_macros')}</button>
      {macros && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4">
          <div className="p-4 bg-[var(--accent-glow)] border border-[var(--accent-primary)] rounded-2xl text-center">
            <Flame className="mx-auto mb-1 text-[var(--accent-primary)]" size={20} />
            <p className="text-[10px] uppercase font-black text-[var(--text-muted)]">{getTranslation(language, 'calories')}</p>
            <p className="text-2xl font-black text-[var(--text-main)]">{macros.kcal}</p>
          </div>
          <div className="p-4 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl text-center">
            <p className="text-[10px] uppercase font-black text-[var(--text-muted)]">{getTranslation(language, 'protein')}</p>
            <p className="text-2xl font-black text-blue-400">{macros.p}g</p>
          </div>
          <div className="p-4 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl text-center">
            <p className="text-[10px] uppercase font-black text-[var(--text-muted)]">{getTranslation(language, 'carbs')}</p>
            <p className="text-2xl font-black text-amber-500">{macros.c}g</p>
          </div>
          <div className="p-4 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl text-center">
            <p className="text-[10px] uppercase font-black text-[var(--text-muted)]">{getTranslation(language, 'fats')}</p>
            <p className="text-2xl font-black text-rose-500">{macros.f}g</p>
          </div>
        </div>
      )}
    </div>
  );
}

export const Calculators: React.FC<CalculatorsProps> = ({ onSavePr, language }) => {
  const [activeTab, setActiveTab] = useState('1rm');

  const tabs = [
    { id: '1rm', icon: Target, label: getTranslation(language, 'tab_1rm') },
    { id: 'converter', icon: Scale, label: getTranslation(language, 'tab_lbs_kg') },
    { id: 'bodyfat', icon: UserIcon, label: getTranslation(language, 'tab_bodyfat') },
    { id: 'progress', icon: TrendingUp, label: getTranslation(language, 'tab_progress') },
    { id: 'macros', icon: Zap, label: getTranslation(language, 'tab_macros') },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-20 px-4">
      {/* Header */}
      <div className="glass-card p-8 md:p-12 relative overflow-hidden rounded-[2.5rem] border border-[var(--border-color)]">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-glow)] to-transparent opacity-50 pointer-events-none"></div>
        <div className="absolute right-0 top-0 p-8 opacity-[0.03] transform translate-x-10 -translate-y-10 pointer-events-none">
          <Calculator size={300} className="text-[var(--accent-primary)]" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
              <div className="p-4 bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-2xl shadow-2xl shadow-[var(--accent-glow)] border border-white/10">
                <Calculator size={32} className="text-white" />
              </div>
              <h2 className="text-4xl md:text-6xl font-heading font-black text-[var(--text-main)] tracking-tight">
                {getTranslation(language, 'calculators')}
              </h2>
            </div>
            <p className="text-[var(--text-muted)] text-lg font-medium opacity-80 max-w-xl">
              {getTranslation(language, 'essential_calcs')}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Tab Switcher */}
        <div className="lg:w-72 flex flex-row lg:flex-col gap-2 p-2 bg-[var(--bg-card)]/50 backdrop-blur-md rounded-3xl border border-[var(--border-color)] overflow-x-auto lg:overflow-x-visible hide-scrollbar sticky top-24 h-fit z-30">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-300 min-w-fit flex-1 lg:flex-none
                ${activeTab === tab.id
                  ? 'bg-[var(--accent-primary)] text-white shadow-lg shadow-[var(--accent-glow)] scale-[1.02]'
                  : 'text-[var(--text-muted)] hover:bg-[var(--bg-main)] hover:text-[var(--text-main)]'}
              `}
            >
              <tab.icon size={20} className={activeTab === tab.id ? 'text-white' : 'text-[var(--accent-primary)]'} />
              <span className="font-bold text-sm whitespace-nowrap">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 glass-card p-6 md:p-10 rounded-[2rem] border border-[var(--border-color)] min-h-[500px] relative bg-gradient-to-b from-[var(--bg-card)] to-transparent">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent-primary)] opacity-[0.05] blur-[100px] pointer-events-none rounded-full"></div>

          {activeTab === '1rm' && <PRCalculator language={language} onSave={onSavePr} />}
          {activeTab === 'converter' && <UnitConverter language={language} />}
          {activeTab === 'bodyfat' && <BodyFatCalc language={language} />}
          {activeTab === 'progress' && <StrengthProgress language={language} />}
          {activeTab === 'macros' && <MacroCalc language={language} />}
        </div>
      </div>
    </div>
  );
};
