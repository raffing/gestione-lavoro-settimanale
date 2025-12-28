import type { Building, Worker, WorkAssignment, User, DayOfWeek } from '../types';

// Mock users
export const mockUsers: User[] = [
  { id: 'u1', username: 'admin', name: 'Amministratore', role: 'admin' },
  { id: 'u2', username: 'mario', name: 'Mario Rossi', role: 'operaio' },
  { id: 'u3', username: 'luigi', name: 'Luigi Verdi', role: 'operaio' },
];

// Mock workers
export const mockWorkers: Worker[] = [
  { id: 'w1', name: 'Mario Rossi', userId: 'u2' },
  { id: 'w2', name: 'Luigi Verdi', userId: 'u3' },
];

// Mock buildings based on lista-condomini.txt
export const mockBuildings: Building[] = [
  {
    id: 'b1',
    name: 'Ufficio Gas',
    type: 'ufficio',
    scheduledDays: [1, 3, 4, 5],
    timeEstimations: [
      { workerCount: 1, minutes: 60 },
      { workerCount: 2, minutes: 40 },
    ],
  },
  {
    id: 'b2',
    name: 'Piazza Pitta 1',
    type: 'condominio',
    scheduledDays: [1, 3, 4, 5],
    timeEstimations: [
      { workerCount: 1, minutes: 30 },
      { workerCount: 2, minutes: 20 },
    ],
  },
  {
    id: 'b3',
    name: 'Piazza Pitta 2',
    type: 'condominio',
    scheduledDays: [1, 2, 3, 4, 5],
    timeEstimations: [
      { workerCount: 1, minutes: 30 },
      { workerCount: 2, minutes: 20 },
    ],
  },
  {
    id: 'b4',
    name: 'Washington 17',
    type: 'condominio',
    scheduledDays: [1, 2, 3, 4, 5],
    timeEstimations: [
      { workerCount: 1, minutes: 45 },
      { workerCount: 2, minutes: 30 },
    ],
  },
  {
    id: 'b5',
    name: 'Washington 27',
    type: 'condominio',
    scheduledDays: [1, 2, 3, 4, 5],
    timeEstimations: [
      { workerCount: 1, minutes: 30 },
      { workerCount: 2, minutes: 20 },
    ],
  },
  {
    id: 'b6',
    name: 'Washington 37',
    type: 'condominio',
    scheduledDays: [1, 2, 3, 4, 5],
    timeEstimations: [
      { workerCount: 1, minutes: 30 },
      { workerCount: 2, minutes: 20 },
    ],
  },
  {
    id: 'b7',
    name: 'Londra',
    type: 'condominio',
    scheduledDays: [1, 2, 3, 4, 5],
    timeEstimations: [
      { workerCount: 1, minutes: 30 },
      { workerCount: 2, minutes: 20 },
    ],
  },
  {
    id: 'b8',
    name: 'San Giacomo',
    type: 'condominio',
    scheduledDays: [1, 2, 3, 4, 5],
    timeEstimations: [
      { workerCount: 1, minutes: 15 },
      { workerCount: 2, minutes: 10 },
    ],
  },
  {
    id: 'b9',
    name: 'Paolillo',
    type: 'condominio',
    scheduledDays: [1, 2, 3, 4, 5],
    timeEstimations: [
      { workerCount: 1, minutes: 40 },
      { workerCount: 2, minutes: 25 },
    ],
  },
  {
    id: 'b10',
    name: 'Battaglia',
    type: 'condominio',
    scheduledDays: [1, 2, 3, 4, 5],
    timeEstimations: [
      { workerCount: 1, minutes: 30 },
      { workerCount: 2, minutes: 20 },
    ],
  },
  {
    id: 'b11',
    name: 'Ferrante 17',
    type: 'condominio',
    scheduledDays: [1, 2, 3, 4, 5],
    timeEstimations: [
      { workerCount: 1, minutes: 30 },
      { workerCount: 2, minutes: 20 },
    ],
  },
  {
    id: 'b12',
    name: 'Pastore 16',
    type: 'condominio',
    scheduledDays: [1, 2, 3, 4, 5],
    timeEstimations: [
      { workerCount: 1, minutes: 30 },
      { workerCount: 2, minutes: 20 },
    ],
  },
  {
    id: 'b13',
    name: 'Pastore 36',
    type: 'condominio',
    scheduledDays: [1, 2, 3, 4, 5],
    timeEstimations: [
      { workerCount: 1, minutes: 30 },
      { workerCount: 2, minutes: 20 },
    ],
  },
  {
    id: 'b14',
    name: 'Veneto',
    type: 'condominio',
    scheduledDays: [1, 2, 3, 4, 5],
    timeEstimations: [
      { workerCount: 1, minutes: 30 },
      { workerCount: 2, minutes: 20 },
    ],
  },
  {
    id: 'b15',
    name: 'Ferrante 11',
    type: 'condominio',
    scheduledDays: [1, 2, 3, 4, 5],
    timeEstimations: [
      { workerCount: 1, minutes: 20 },
      { workerCount: 2, minutes: 15 },
    ],
  },
  {
    id: 'b16',
    name: 'Structa 45',
    type: 'ufficio',
    scheduledDays: [2],
    timeEstimations: [
      { workerCount: 1, minutes: 60 },
      { workerCount: 2, minutes: 40 },
    ],
  },
  {
    id: 'b17',
    name: 'Petrucci',
    type: 'condominio',
    scheduledDays: [2],
    timeEstimations: [
      { workerCount: 1, minutes: 30 },
      { workerCount: 2, minutes: 20 },
    ],
  },
];

// Generate assignments for each building on each scheduled day
export const generateAssignments = (
  buildings: Building[],
  workers: Worker[]
): WorkAssignment[] => {
  const assignments: WorkAssignment[] = [];
  let idCounter = 1;

  buildings.forEach((building) => {
    building.scheduledDays.forEach((day) => {
      // Simple assignment logic: distribute between workers
      // Some buildings get both workers, some get individual workers
      let workerIds: string[];
      
      if (building.timeEstimations[0]?.minutes > 45) {
        // Bigger jobs get both workers
        workerIds = workers.map((w) => w.id);
      } else if (idCounter % 3 === 0) {
        // Every third gets both workers
        workerIds = workers.map((w) => w.id);
      } else if (idCounter % 2 === 0) {
        // Alternate between workers
        workerIds = [workers[0].id];
      } else {
        workerIds = [workers[1 % workers.length].id];
      }

      assignments.push({
        id: `a${idCounter}`,
        buildingId: building.id,
        dayOfWeek: day as DayOfWeek,
        workerIds,
      });
      idCounter++;
    });
  });

  return assignments;
};

export const mockAssignments = generateAssignments(mockBuildings, mockWorkers);
