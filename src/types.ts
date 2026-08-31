export type Category = 'Gym' | 'School' | 'Work' | 'Study' | 'Personal' | 'Task';

export interface UserProfile {
  name: string;
  weight?: string;
  height?: string;
  goal?: string;
}

export type MuscleGroup = 
  | 'Pecho' 
  | 'Espalda' 
  | 'Hombros' 
  | 'Bíceps' 
  | 'Tríceps' 
  | 'Cuádriceps' 
  | 'Isquios' 
  | 'Glúteos' 
  | 'Gemelos' 
  | 'Core / Abdomen' 
  | 'Cardio / Movilidad';

export interface ExerciseSet {
  id: string;
  setNumber: number;
  reps: number | string; // e.g. 8-10 or 12
  weightKg?: number;
  isCompleted?: boolean;
  rpe?: number; // Rate of perceived exertion
}

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  sets: ExerciseSet[];
  restSeconds?: number;
  notes?: string;
}

export interface WorkoutRoutine {
  id: string;
  name: string; // e.g., "Upper A - Enfoque Empuje & Tracción"
  shortName: string; // e.g., "Upper A"
  targetMuscles: MuscleGroup[];
  exercises: Exercise[];
  estimatedMinutes?: number;
  isRestDay?: boolean;
}

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0=Domingo, 1=Lunes, ... 6=Sábado

export interface WorkoutSplit {
  id: string;
  name: string; // e.g., "Upper / Lower (4 días)", "Push / Pull / Legs (6 días)"
  description: string;
  isCustom?: boolean;
  // Mapping from day of week (1=Lunes, 2=Martes, ..., 0=Domingo) to Routine ID or 'rest'
  schedule: Record<number, string>; // dayOfWeek -> routineId or 'REST'
  routines: WorkoutRoutine[];
}

export interface GymProgramSettings {
  startDate: string; // YYYY-MM-DD
  durationWeeks: number;
  startWeight: number; // in kg
  targetWeight: number; // in kg
  keyLifts?: { 
    id: string; 
    name: string; 
    initialWeight: number;
    currentWeight?: number;
    targetWeight?: number;
  }[];
}

export interface GymDayLog {
  date: string; // YYYY-MM-DD
  routineId: string;
  isCompleted: boolean;
  durationMinutes?: number;
  completedSets: Record<string, boolean>; // exerciseId_setNumber -> boolean
  performances?: Record<string, { reps: string | number; weightKg: number }[]>;
  notes?: string;
}

export interface Activity {
  id: string;
  title: string;
  category: Category;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string;
  isCompleted: boolean;
  description?: string;
}

export interface Task {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:mm (optional scheduled time)
  category?: Category;
  isCompleted: boolean;
  dueDate?: string;
  description?: string;
}

export interface DaySummary {
  date: string;
  totalActivities: number;
  completedActivities: number;
}

