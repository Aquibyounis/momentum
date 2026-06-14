export type ColorTag = 'green' | 'blue' | 'amber' | 'red' | 'purple' | 'gray';

export interface BlueprintTask {
  id: number;
  time_label: string;
  title: string;
  description?: string;
  phase_name: string;
  phase_order: number;
  sort_order: number;
  color_tag?: ColorTag;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PhaseGroup {
  phase_name: string;
  phase_order: number;
  tasks: BlueprintTask[];
}

export interface TaskCompletion {
  id: number;
  entry_date: string;
  blueprint_task_id: number;
  title_snapshot: string;
  time_snapshot: string;
  phase_snapshot: string;
  is_completed: boolean;
  completed_at?: string;
}

export interface PrayerCompletion {
  id: number;
  entry_date: string;
  prayer_name: 'Fajr' | 'Zuhr' | 'Asr' | 'Maghrib' | 'Isha';
  is_completed: boolean;
  completed_at?: string;
}

export interface DailyEntry {
  id: number;
  entry_date: string;
  day_number: number;
  notes?: string;
  tasks: TaskCompletion[];
  prayers: PrayerCompletion[];
}

export interface DayListItem {
  entry_date: string;
  day_number: number;
  notes?: string | null;
  tasks_total: number;
  tasks_completed: number;
  prayers_completed: number;
}

export type Mode = 'locked' | 'viewer' | 'admin';

export interface ModeContextType {
  mode: Mode;
  isAdmin: boolean;
  isViewer: boolean;
  unlock: (pin: string) => boolean;
  lock: () => void;
}

export interface DayData {
  entry: {
    id: number;
    entry_date: string;
    day_number: number;
    notes?: string;
  };
  tasks: TaskCompletion[];
  prayers: PrayerCompletion[];
  dayNumber: number;
  quote: string;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error';
}
