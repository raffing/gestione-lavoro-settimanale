import { useState, useMemo } from 'react';
import { useApp } from '../hooks/useApp';
import type { DayOfWeek, WorkAssignment } from '../types';
import { DAY_NAMES } from '../types';
import { Plus, Pencil, Trash2, X, Calendar, Users, Building2 } from 'lucide-react';

const DAYS: DayOfWeek[] = [1, 2, 3, 4, 5, 6, 7];

interface AssignmentFormData {
  buildingId: string;
  dayOfWeek: DayOfWeek;
  workerIds: string[];
}

const defaultFormData: AssignmentFormData = {
  buildingId: '',
  dayOfWeek: 1,
  workerIds: [],
};

export default function AssignmentsPage() {
  const { buildings, workers, assignments, addAssignment, updateAssignment, deleteAssignment } = useApp();
  const [selectedDay, setSelectedDay] = useState<DayOfWeek | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<AssignmentFormData>(defaultFormData);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filteredAssignments = useMemo(() => {
    if (selectedDay === 'all') return assignments;
    return assignments.filter((a) => a.dayOfWeek === selectedDay);
  }, [assignments, selectedDay]);

  const openModal = (assignment?: WorkAssignment) => {
    if (assignment) {
      setEditingId(assignment.id);
      setFormData({
        buildingId: assignment.buildingId,
        dayOfWeek: assignment.dayOfWeek,
        workerIds: [...assignment.workerIds],
      });
    } else {
      setEditingId(null);
      setFormData(defaultFormData);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData(defaultFormData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateAssignment(editingId, formData);
    } else {
      addAssignment(formData);
    }
    closeModal();
  };

  const toggleWorker = (workerId: string) => {
    setFormData((prev) => ({
      ...prev,
      workerIds: prev.workerIds.includes(workerId)
        ? prev.workerIds.filter((id) => id !== workerId)
        : [...prev.workerIds, workerId],
    }));
  };

  const handleDelete = (id: string) => {
    deleteAssignment(id);
    setDeleteConfirmId(null);
  };

  const getBuildingName = (buildingId: string) => {
    return buildings.find((b) => b.id === buildingId)?.name ?? 'Edificio sconosciuto';
  };

  const getWorkerNames = (workerIds: string[]) => {
    return workerIds
      .map((id) => workers.find((w) => w.id === id)?.name)
      .filter(Boolean)
      .join(', ');
  };

  // Get buildings that are scheduled for the selected day
  const availableBuildings = useMemo(() => {
    return buildings.filter((b) => b.scheduledDays.includes(formData.dayOfWeek));
  }, [buildings, formData.dayOfWeek]);

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">Assegnazioni</h1>
          <button
            onClick={() => openModal()}
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Aggiungi</span>
          </button>
        </div>

        {/* Day Filter */}
        <div className="flex overflow-x-auto py-2 px-2 gap-1 border-t">
          <button
            onClick={() => setSelectedDay('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              selectedDay === 'all'
                ? 'bg-teal-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Tutti
          </button>
          {DAYS.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                selectedDay === day
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {DAY_NAMES[day].substring(0, 3)}
            </button>
          ))}
        </div>
      </div>

      {/* Assignment List */}
      <div className="p-4 space-y-3">
        {filteredAssignments.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center shadow-sm">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Nessuna assegnazione trovata</p>
            <button
              onClick={() => openModal()}
              className="mt-4 text-teal-600 font-medium"
            >
              Crea la prima assegnazione
            </button>
          </div>
        ) : (
          filteredAssignments.map((assignment) => (
            <div
              key={assignment.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gray-800">
                        {getBuildingName(assignment.buildingId)}
                      </h3>
                      <span className="px-2 py-0.5 bg-teal-100 text-teal-700 rounded-full text-xs font-medium">
                        {DAY_NAMES[assignment.dayOfWeek]}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-1 text-sm text-gray-500">
                      <Users className="w-4 h-4" />
                      <span>{getWorkerNames(assignment.workerIds) || 'Nessun operaio'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openModal(assignment)}
                      className="p-2 text-gray-500 hover:text-teal-600 hover:bg-gray-100 rounded-lg transition-colors"
                      aria-label="Modifica"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(assignment.id)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-lg transition-colors"
                      aria-label="Elimina"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Delete Confirmation */}
              {deleteConfirmId === assignment.id && (
                <div className="bg-red-50 px-4 py-3 flex items-center justify-between">
                  <span className="text-sm text-red-700">
                    Confermi l&apos;eliminazione?
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setDeleteConfirmId(null)}
                      className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      Annulla
                    </button>
                    <button
                      onClick={() => handleDelete(assignment.id)}
                      className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Elimina
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
          <div className="bg-white w-full sm:max-w-lg sm:rounded-xl max-h-[90vh] overflow-y-auto rounded-t-xl">
            <div className="sticky top-0 bg-white border-b px-4 py-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">
                {editingId ? 'Modifica Assegnazione' : 'Nuova Assegnazione'}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Chiudi"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              {/* Day Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giorno della settimana *
                </label>
                <div className="flex flex-wrap gap-2">
                  {DAYS.map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, dayOfWeek: day, buildingId: '' }))
                      }
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        formData.dayOfWeek === day
                          ? 'bg-teal-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {DAY_NAMES[day].substring(0, 3)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Building Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Edificio *
                </label>
                {availableBuildings.length === 0 ? (
                  <div className="bg-orange-50 text-orange-700 px-4 py-3 rounded-lg text-sm">
                    Nessun edificio programmato per {DAY_NAMES[formData.dayOfWeek]}
                  </div>
                ) : (
                  <select
                    value={formData.buildingId}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, buildingId: e.target.value }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                    required
                  >
                    <option value="">Seleziona un edificio</option>
                    {availableBuildings.map((building) => (
                      <option key={building.id} value={building.id}>
                        {building.name} ({building.type})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Worker Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Operai assegnati *
                </label>
                {workers.length === 0 ? (
                  <div className="bg-orange-50 text-orange-700 px-4 py-3 rounded-lg text-sm">
                    Nessun operaio disponibile. Aggiungi prima degli operai.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {workers.map((worker) => (
                      <button
                        key={worker.id}
                        type="button"
                        onClick={() => toggleWorker(worker.id)}
                        className={`w-full px-4 py-3 rounded-lg border-2 text-left flex items-center gap-3 transition-colors ${
                          formData.workerIds.includes(worker.id)
                            ? 'border-teal-600 bg-teal-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            formData.workerIds.includes(worker.id)
                              ? 'bg-teal-600 border-teal-600'
                              : 'border-gray-300'
                          }`}
                        >
                          {formData.workerIds.includes(worker.id) && (
                            <svg
                              className="w-3 h-3 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </div>
                        <span className="font-medium text-gray-800">
                          {worker.name}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected Building Info */}
              {formData.buildingId && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="w-5 h-5 text-gray-500" />
                    <span className="font-medium text-gray-700">Tempi stimati</span>
                  </div>
                  {buildings
                    .find((b) => b.id === formData.buildingId)
                    ?.timeEstimations.map((te, index) => (
                      <p key={index} className="text-sm text-gray-600">
                        {te.workerCount} operaio/i: {te.minutes} minuti
                      </p>
                    ))}
                </div>
              )}

              {/* Submit */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={
                    !formData.buildingId ||
                    formData.workerIds.length === 0
                  }
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingId ? 'Salva modifiche' : 'Crea assegnazione'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
