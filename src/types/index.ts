// Day of the week (1-7, Monday to Sunday)
export type DayOfWeek = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export const DAY_NAMES: Record<DayOfWeek, string> = {
  1: 'Lunedì',
  2: 'Martedì',
  3: 'Mercoledì',
  4: 'Giovedì',
  5: 'Venerdì',
  6: 'Sabato',
  7: 'Domenica',
};

// User roles
export type UserRole = 'admin' | 'operaio';

// User type
export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
}

// Worker (operaio)
export interface Worker {
  id: string;
  name: string;
  userId?: string; // Optional link to user account
}

// Time estimation based on worker count
export interface TimeEstimation {
  workerCount: number; // Number of workers
  minutes: number; // Estimated time in minutes
}

// Building (Condominio/Ufficio)
export interface Building {
  id: string;
  name: string;
  address?: string;
  type: 'condominio' | 'ufficio';
  scheduledDays: DayOfWeek[]; // Days when this building needs to be cleaned
  timeEstimations: TimeEstimation[]; // Time estimates based on worker count
  notes?: string;
}

// Assignment of workers to a building for a specific day
export interface WorkAssignment {
  id: string;
  buildingId: string;
  dayOfWeek: DayOfWeek;
  workerIds: string[]; // Can be one or more workers
}

// Task completion status for a specific date
export interface TaskCompletion {
  id: string;
  assignmentId: string;
  date: string; // ISO date string (YYYY-MM-DD)
  completed: boolean;
  completedAt?: string; // ISO datetime string
  completedBy?: string; // Worker ID who marked it complete
}

// Weekly schedule - aggregated view for display
export interface DailySchedule {
  day: DayOfWeek;
  assignments: Array<{
    assignment: WorkAssignment;
    building: Building;
    workers: Worker[];
    estimatedTime: number; // in minutes
    completed: boolean;
  }>;
  totalEstimatedTime: number;
}

// Authentication context types
export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

// App state context types
export interface AppState {
  buildings: Building[];
  workers: Worker[];
  assignments: WorkAssignment[];
  completions: TaskCompletion[];
}

export interface AppContextType extends AppState {
  // Building operations
  addBuilding: (building: Omit<Building, 'id'>) => void;
  updateBuilding: (id: string, building: Partial<Building>) => void;
  deleteBuilding: (id: string) => void;
  
  // Worker operations
  addWorker: (worker: Omit<Worker, 'id'>) => void;
  updateWorker: (id: string, worker: Partial<Worker>) => void;
  deleteWorker: (id: string) => void;
  
  // Assignment operations
  addAssignment: (assignment: Omit<WorkAssignment, 'id'>) => void;
  updateAssignment: (id: string, assignment: Partial<WorkAssignment>) => void;
  deleteAssignment: (id: string) => void;
  
  // Completion operations
  toggleCompletion: (assignmentId: string, date: string, workerId?: string) => void;
  
  // Computed data
  getDailySchedule: (day: DayOfWeek, date?: string) => DailySchedule;
  getWeeklySchedule: (weekStartDate?: string) => DailySchedule[];
}
