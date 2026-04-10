
export interface BodyMeasurements {
  wrist?: number;
  arm?: number;
  shoulder?: number;
  chest?: number;
  waist?: number;
  leg?: number;
  neck?: number;
}

export interface BodyMeasurementLog {
  date: string;
  measurements: BodyMeasurements;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'achievement';
  createdAt: string;
  read: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string; // Lucide icon name or emoji
  type: 'streak' | 'weight' | 'workout' | 'general';
}

export interface User {
  id: string;
  name: string;
  email: string;
  photoUrl?: string;
  targetWeight?: number;
  streak?: number;
  lastWorkoutDate?: string;
  measurements?: BodyMeasurements;
  unlockedAchievements?: string[]; // IDs of unlocked achievements
}


export interface WeightLog {
  date: string;
  weight: number;
}

export interface WatchItem {
  id: string;
  title: string;
  url: string;
  addedAt: string;
  watched: boolean;
  description?: string; // AI generated plot or user description
}

export interface DietPlan {
  id: string;
  createdAt: string;
  content: string; // Markdown content from Gemini
  goal: string;
}

export enum Gender {
  Male = 'Male',
  Female = 'Female'
}

export interface PRCalcResult {
  reps: number;
  weight: number;
  oneRepMax: number;
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  weight?: number; // Current weight lifted
  lastWeight?: number; // Previous session weight for progressive overload
  completed: boolean;
  completedAt?: string; // ISO date string when completed
  performedReps?: string; // Actual reps performed
  videoUrl?: string;
  description?: string;
}

export interface WorkoutDay {
  id: string;
  title: string;
  exercises: Exercise[];
}

export interface PostureRecord {
  id: string;
  date: string;
  score: number; // 1-10 scale
  summary: string;
  analysis: string;
  exercises: Exercise[]; // Corrective exercises
}

export type Language = 'en' | 'tr';

export interface AppSettings {
  language: Language;
  theme: 'light' | 'dark';
}

// --- NEW DIET TYPES ---

export interface MacroNutrients {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  fiber: number;
}

export interface DietMeal {
  id: string;
  title: string; // e.g. "Breakfast"
  description: string; // e.g. "3 eggs, oats..."
  macros: MacroNutrients;
  completed: boolean;
}

export interface PreSetDietPlan {
  id: string;
  title: string;
  description: string;
  meals: DietMeal[]; // The daily template
  totalMacros: MacroNutrients;
}

export interface ActiveDietSession {
  planId: string;
  startDate: string;
  durationWeeks: number;
  lastLogDate: string; // To reset daily tracking
  consumedMacros: MacroNutrients;
  completedMeals: string[]; // IDs of meals eaten today
}

// --- CHATBOT & HISTORY TYPES ---

export type ChatRole = 'user' | 'model';

export interface ChatMessage {
  role: ChatRole;
  text: string;
  timestamp: Date;
}

export interface HistoryEvent {
  id: string;
  date: string;
  type: 'workout' | 'diet' | 'weight' | 'posture';
  title: string;
  details?: string;
}

export type ViewState = 'dashboard' | 'weight' | 'metrics' | 'calculator' | 'settings' | 'about' | 'test';

export interface BeforeAfterItem {
  id: string;
  date: string;
  photoUrlBefore?: string; // Opsiyonel, sadece tek foto da olabilir
  photoUrlAfter?: string;
  note?: string;
}

export interface ExerciseLogEntry {
  date: string;
  weight: number;
  reps: string;
}


export type ExerciseHistory = Record<string, ExerciseLogEntry[]>;

export interface StickyNote {
  id: string;
  title: string;
  text: string;
  createdAt: string;
  color: string;
}

