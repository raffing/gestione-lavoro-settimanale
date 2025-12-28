import { useState, useMemo } from 'react';
import { useApp } from '../hooks/useApp';
import { useAuth } from '../hooks/useAuth';
import type { DayOfWeek } from '../types';
import { DAY_NAMES } from '../types';
import {
  Check,
  Clock,
  Users,
  Building2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

// Get current day of week (1-7, Monday to Sunday)
function getCurrentDayOfWeek(): DayOfWeek {
  const day = new Date().getDay();
  return (day === 0 ? 7 : day) as DayOfWeek;
}

function getDateForDay(day: DayOfWeek, baseDate: Date = new Date()): string {
  const currentDay = baseDate.getDay();
  const currentDayMondayBased = currentDay === 0 ? 7 : currentDay;
  const diff = day - currentDayMondayBased;
  const date = new Date(baseDate);
  date.setDate(baseDate.getDate() + diff);
  return date.toISOString().split('T')[0];
}

function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}min`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}min`;
}

export default function DashboardPage() {
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(getCurrentDayOfWeek());
  const [weekOffset, setWeekOffset] = useState(0);
  const { getDailySchedule, toggleCompletion, workers } = useApp();
  const { user, isAdmin } = useAuth();

  const baseDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + weekOffset * 7);
    return date;
  }, [weekOffset]);

  const currentDate = useMemo(
    () => getDateForDay(selectedDay, baseDate),
    [selectedDay, baseDate]
  );

  const schedule = useMemo(
    () => getDailySchedule(selectedDay, currentDate),
    [getDailySchedule, selectedDay, currentDate]
  );

  // Filter assignments for the current worker if they're not an admin
  const filteredAssignments = useMemo(() => {
    if (isAdmin) return schedule.assignments;
    const currentWorker = workers.find((w) => w.userId === user?.id);
    if (!currentWorker) return schedule.assignments;
    return schedule.assignments.filter((a) =>
      a.assignment.workerIds.includes(currentWorker.id)
    );
  }, [schedule.assignments, isAdmin, workers, user]);

  const completedCount = filteredAssignments.filter((a) => a.completed).length;
  const totalEstimatedTime = filteredAssignments.reduce(
    (sum, a) => sum + a.estimatedTime,
    0
  );
  const completedTime = filteredAssignments
    .filter((a) => a.completed)
    .reduce((sum, a) => sum + a.estimatedTime, 0);

  const handleToggleCompletion = (assignmentId: string) => {
    const currentWorker = workers.find((w) => w.userId === user?.id);
    toggleCompletion(assignmentId, currentDate, currentWorker?.id);
  };

  const formatDateDisplay = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Day Selector */}
      <div className="bg-white shadow-sm lg:sticky lg:top-0 z-10">
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <button
            onClick={() => setWeekOffset((w) => w - 1)}
            className="p-2 hover:bg-gray-100 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Settimana precedente"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-medium text-gray-600">
            {formatDateDisplay(currentDate)}
          </span>
          <button
            onClick={() => setWeekOffset((w) => w + 1)}
            className="p-2 hover:bg-gray-100 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Settimana successiva"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <div className="flex overflow-x-auto py-2 px-2 gap-2 scrollbar-hide">
          {([1, 2, 3, 4, 5, 6, 7] as DayOfWeek[]).map((day) => {
            const isSelected = day === selectedDay;
            const isToday = day === getCurrentDayOfWeek() && weekOffset === 0;
            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`flex-1 min-w-[64px] py-3 px-2 rounded-xl text-center transition-colors ${
                  isSelected
                    ? 'bg-teal-600 text-white'
                    : isToday
                    ? 'bg-teal-100 text-teal-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="text-xs font-medium">
                  {DAY_NAMES[day].substring(0, 3)}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                <Building2 className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {completedCount}/{filteredAssignments.length}
                </p>
                <p className="text-sm text-gray-500">Completati</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {formatTime(totalEstimatedTime - completedTime)}
                </p>
                <p className="text-sm text-gray-500">Rimanente</p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Progresso giornaliero</span>
            <span className="font-medium text-teal-600">
              {filteredAssignments.length > 0
                ? Math.round(
                    (completedCount / filteredAssignments.length) * 100
                  )
                : 0}
              %
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-teal-600 h-3 rounded-full transition-all duration-300"
              style={{
                width: `${
                  filteredAssignments.length > 0
                    ? (completedCount / filteredAssignments.length) * 100
                    : 0
                }%`,
              }}
            />
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-3">
          {filteredAssignments.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center shadow-sm">
              <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">
                Nessun lavoro programmato per questo giorno
              </p>
            </div>
          ) : (
            filteredAssignments.map(
              ({ assignment, building, workers, estimatedTime, completed }) => (
                <div
                  key={assignment.id}
                  className={`bg-white rounded-xl shadow-sm overflow-hidden transition-all ${
                    completed ? 'opacity-60' : ''
                  }`}
                >
                  <button
                    onClick={() => handleToggleCompletion(assignment.id)}
                    className="w-full p-4 text-left flex items-start gap-4"
                  >
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                        completed
                          ? 'bg-teal-600 border-teal-600'
                          : 'border-gray-300'
                      }`}
                    >
                      {completed && <Check className="w-4 h-4 text-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3
                        className={`font-semibold text-gray-800 ${
                          completed ? 'line-through' : ''
                        }`}
                      >
                        {building.name}
                      </h3>
                      <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatTime(estimatedTime)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {workers.map((w) => w.name).join(', ')}
                        </span>
                      </div>
                      <span
                        className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium ${
                          building.type === 'ufficio'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {building.type === 'ufficio' ? 'Ufficio' : 'Condominio'}
                      </span>
                    </div>
                  </button>
                </div>
              )
            )
          )}
        </div>
      </div>
    </div>
  );
}
