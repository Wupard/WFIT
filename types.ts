
export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'achievement';
  createdAt: string;
  read: boolean;
}



export interface User {
  id: string;
  name: string;
  email: string;
  photoUrl?: string;
}





export interface PRCalcResult {
  reps: number;
  weight: number;
  oneRepMax: number;
}




export type Language = 'en' | 'tr';

export interface AppSettings {
  language: Language;
  theme: 'light' | 'dark';
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
  type: 'workout';
  title: string;
  details?: string;
}

export type ViewState = 'dashboard' | 'calculator' | 'settings' | 'about' | 'test';


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

