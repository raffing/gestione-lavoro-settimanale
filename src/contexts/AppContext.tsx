import {
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import type {
  AppContextType,
  AppState,
  Building,
  Worker,
  WorkAssignment,
  TaskCompletion,
  DailySchedule,
  DayOfWeek,
} from '../types';
import { mockBuildings, mockWorkers, mockAssignments } from '../data/mockData';
import { AppContext } from './appContextDef';

// Helper to generate unique IDs
const generateId = () => Math.random().toString(36).substring(2, 11);

// Helper to get today's ISO date string
const getTodayISO = () => new Date().toISOString().split('T')[0];

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => {
    // Try to load from localStorage
    const stored = localStorage.getItem('appState');
    if (stored) {
      return JSON.parse(stored);
    }
    return {
      buildings: mockBuildings,
      workers: mockWorkers,
      assignments: mockAssignments,
      completions: [],
    };
  });

  // Persist state to localStorage
  const persistState = useCallback((newState: AppState) => {
    localStorage.setItem('appState', JSON.stringify(newState));
    setState(newState);
  }, []);

  // Building operations
  const addBuilding = useCallback(
    (building: Omit<Building, 'id'>) => {
      const newBuilding = { ...building, id: generateId() };
      persistState({
        ...state,
        buildings: [...state.buildings, newBuilding],
      });
    },
    [state, persistState]
  );

  const updateBuilding = useCallback(
    (id: string, building: Partial<Building>) => {
      persistState({
        ...state,
        buildings: state.buildings.map((b) =>
          b.id === id ? { ...b, ...building } : b
        ),
      });
    },
    [state, persistState]
  );

  const deleteBuilding = useCallback(
    (id: string) => {
      persistState({
        ...state,
        buildings: state.buildings.filter((b) => b.id !== id),
        assignments: state.assignments.filter((a) => a.buildingId !== id),
      });
    },
    [state, persistState]
  );

  // Worker operations
  const addWorker = useCallback(
    (worker: Omit<Worker, 'id'>) => {
      const newWorker = { ...worker, id: generateId() };
      persistState({
        ...state,
        workers: [...state.workers, newWorker],
      });
    },
    [state, persistState]
  );

  const updateWorker = useCallback(
    (id: string, worker: Partial<Worker>) => {
      persistState({
        ...state,
        workers: state.workers.map((w) =>
          w.id === id ? { ...w, ...worker } : w
        ),
      });
    },
    [state, persistState]
  );

  const deleteWorker = useCallback(
    (id: string) => {
      persistState({
        ...state,
        workers: state.workers.filter((w) => w.id !== id),
        assignments: state.assignments.map((a) => ({
          ...a,
          workerIds: a.workerIds.filter((wId) => wId !== id),
        })),
      });
    },
    [state, persistState]
  );

  // Assignment operations
  const addAssignment = useCallback(
    (assignment: Omit<WorkAssignment, 'id'>) => {
      const newAssignment = { ...assignment, id: generateId() };
      persistState({
        ...state,
        assignments: [...state.assignments, newAssignment],
      });
    },
    [state, persistState]
  );

  const updateAssignment = useCallback(
    (id: string, assignment: Partial<WorkAssignment>) => {
      persistState({
        ...state,
        assignments: state.assignments.map((a) =>
          a.id === id ? { ...a, ...assignment } : a
        ),
      });
    },
    [state, persistState]
  );

  const deleteAssignment = useCallback(
    (id: string) => {
      persistState({
        ...state,
        assignments: state.assignments.filter((a) => a.id !== id),
      });
    },
    [state, persistState]
  );

  // Completion operations
  const toggleCompletion = useCallback(
    (assignmentId: string, date: string, workerId?: string) => {
      const existing = state.completions.find(
        (c) => c.assignmentId === assignmentId && c.date === date
      );

      if (existing) {
        // Toggle off - remove completion
        persistState({
          ...state,
          completions: state.completions.filter((c) => c.id !== existing.id),
        });
      } else {
        // Add completion
        const newCompletion: TaskCompletion = {
          id: generateId(),
          assignmentId,
          date,
          completed: true,
          completedAt: new Date().toISOString(),
          completedBy: workerId,
        };
        persistState({
          ...state,
          completions: [...state.completions, newCompletion],
        });
      }
    },
    [state, persistState]
  );

  // Get estimated time based on worker count
  const getEstimatedTime = useCallback(
    (building: Building, workerCount: number): number => {
      // Find exact match first
      const exact = building.timeEstimations.find(
        (t) => t.workerCount === workerCount
      );
      if (exact) return exact.minutes;

      // Fallback to closest estimate or first one
      const sorted = [...building.timeEstimations].sort(
        (a, b) =>
          Math.abs(a.workerCount - workerCount) -
          Math.abs(b.workerCount - workerCount)
      );
      return sorted[0]?.minutes ?? 30;
    },
    []
  );

  // Get daily schedule
  const getDailySchedule = useCallback(
    (day: DayOfWeek, date?: string): DailySchedule => {
      const targetDate = date ?? getTodayISO();
      const dayAssignments = state.assignments.filter(
        (a) => a.dayOfWeek === day
      );

      const assignments = dayAssignments.map((assignment) => {
        const building = state.buildings.find(
          (b) => b.id === assignment.buildingId
        )!;
        const workers = state.workers.filter((w) =>
          assignment.workerIds.includes(w.id)
        );
        const estimatedTime = getEstimatedTime(building, workers.length);
        const completion = state.completions.find(
          (c) => c.assignmentId === assignment.id && c.date === targetDate
        );

        return {
          assignment,
          building,
          workers,
          estimatedTime,
          completed: completion?.completed ?? false,
        };
      });

      const totalEstimatedTime = assignments.reduce(
        (sum, a) => sum + a.estimatedTime,
        0
      );

      return {
        day,
        assignments,
        totalEstimatedTime,
      };
    },
    [state, getEstimatedTime]
  );

  // Get weekly schedule
  const getWeeklySchedule = useCallback(
    (weekStartDate?: string): DailySchedule[] => {
      const startDate = weekStartDate
        ? new Date(weekStartDate)
        : getWeekStart(new Date());

      return ([1, 2, 3, 4, 5, 6, 7] as DayOfWeek[]).map((day) => {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + day - 1);
        return getDailySchedule(day, date.toISOString().split('T')[0]);
      });
    },
    [getDailySchedule]
  );

  const value: AppContextType = {
    ...state,
    addBuilding,
    updateBuilding,
    deleteBuilding,
    addWorker,
    updateWorker,
    deleteWorker,
    addAssignment,
    updateAssignment,
    deleteAssignment,
    toggleCompletion,
    getDailySchedule,
    getWeeklySchedule,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Helper to get the start of the week (Monday)
function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}
