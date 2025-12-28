import { useState } from 'react';
import { useApp } from '../hooks/useApp';
import type { Building, DayOfWeek, TimeEstimation } from '../types';
import { DAY_NAMES } from '../types';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Building2,
  Calendar,
  Clock,
} from 'lucide-react';

const DAYS: DayOfWeek[] = [1, 2, 3, 4, 5, 6, 7];

interface BuildingFormData {
  name: string;
  address: string;
  type: 'condominio' | 'ufficio';
  scheduledDays: DayOfWeek[];
  timeEstimations: TimeEstimation[];
  notes: string;
}

const defaultFormData: BuildingFormData = {
  name: '',
  address: '',
  type: 'condominio',
  scheduledDays: [],
  timeEstimations: [
    { workerCount: 1, minutes: 30 },
    { workerCount: 2, minutes: 20 },
  ],
  notes: '',
};

export default function BuildingsPage() {
  const { buildings, addBuilding, updateBuilding, deleteBuilding } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<BuildingFormData>(defaultFormData);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const openModal = (building?: Building) => {
    if (building) {
      setEditingId(building.id);
      setFormData({
        name: building.name,
        address: building.address ?? '',
        type: building.type,
        scheduledDays: [...building.scheduledDays],
        timeEstimations: [...building.timeEstimations],
        notes: building.notes ?? '',
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
      updateBuilding(editingId, formData);
    } else {
      addBuilding(formData);
    }
    closeModal();
  };

  const toggleDay = (day: DayOfWeek) => {
    setFormData((prev) => ({
      ...prev,
      scheduledDays: prev.scheduledDays.includes(day)
        ? prev.scheduledDays.filter((d) => d !== day)
        : [...prev.scheduledDays, day].sort((a, b) => a - b),
    }));
  };

  const updateTimeEstimation = (
    index: number,
    field: keyof TimeEstimation,
    value: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      timeEstimations: prev.timeEstimations.map((te, i) =>
        i === index ? { ...te, [field]: value } : te
      ),
    }));
  };

  const addTimeEstimation = () => {
    setFormData((prev) => ({
      ...prev,
      timeEstimations: [
        ...prev.timeEstimations,
        { workerCount: prev.timeEstimations.length + 1, minutes: 30 },
      ],
    }));
  };

  const removeTimeEstimation = (index: number) => {
    if (formData.timeEstimations.length > 1) {
      setFormData((prev) => ({
        ...prev,
        timeEstimations: prev.timeEstimations.filter((_, i) => i !== index),
      }));
    }
  };

  const handleDelete = (id: string) => {
    deleteBuilding(id);
    setDeleteConfirmId(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm lg:sticky lg:top-0 z-10 px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">Gestione Edifici</h1>
          <button
            onClick={() => openModal()}
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors min-h-[44px]"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Aggiungi</span>
          </button>
        </div>
      </div>

      {/* Building List */}
      <div className="p-4 space-y-3">
        {buildings.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center shadow-sm">
            <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Nessun edificio configurato</p>
            <button
              onClick={() => openModal()}
              className="mt-4 text-teal-600 font-medium"
            >
              Aggiungi il primo edificio
            </button>
          </div>
        ) : (
          buildings.map((building) => (
            <div
              key={building.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-800">
                        {building.name}
                      </h3>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          building.type === 'ufficio'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {building.type === 'ufficio' ? 'Ufficio' : 'Condominio'}
                      </span>
                    </div>
                    {building.address && (
                      <p className="text-sm text-gray-500 mt-1">
                        {building.address}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openModal(building)}
                      className="p-2 text-gray-500 hover:text-teal-600 hover:bg-gray-100 rounded-lg transition-colors"
                      aria-label="Modifica"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(building.id)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-lg transition-colors"
                      aria-label="Elimina"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {building.scheduledDays
                        .map((d) => DAY_NAMES[d].substring(0, 3))
                        .join(', ')}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>
                      {building.timeEstimations
                        .map((t) => `${t.workerCount}op: ${t.minutes}min`)
                        .join(' | ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Delete Confirmation */}
              {deleteConfirmId === building.id && (
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
                      onClick={() => handleDelete(building.id)}
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
          <div className="bg-white w-full sm:max-w-lg sm:rounded-xl h-full sm:h-auto sm:max-h-[90vh] overflow-y-auto rounded-t-xl sm:rounded-t-xl">
            <div className="sticky top-0 bg-white border-b px-4 py-3 flex items-center justify-between z-10">
              <h2 className="text-lg font-semibold text-gray-800">
                {editingId ? 'Modifica Edificio' : 'Nuovo Edificio'}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Chiudi"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                  placeholder="Es. Condominio Via Roma 1"
                  required
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Indirizzo
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, address: e.target.value }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                  placeholder="Es. Via Roma 1, Milano"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo *
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, type: 'condominio' }))
                    }
                    className={`flex-1 py-3 rounded-lg border-2 font-medium transition-colors min-h-[48px] ${
                      formData.type === 'condominio'
                        ? 'border-teal-600 bg-teal-50 text-teal-700'
                        : 'border-gray-300 text-gray-600'
                    }`}
                  >
                    Condominio
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, type: 'ufficio' }))
                    }
                    className={`flex-1 py-3 rounded-lg border-2 font-medium transition-colors min-h-[48px] ${
                      formData.type === 'ufficio'
                        ? 'border-teal-600 bg-teal-50 text-teal-700'
                        : 'border-gray-300 text-gray-600'
                    }`}
                  >
                    Ufficio
                  </button>
                </div>
              </div>

              {/* Scheduled Days */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giorni programmati *
                </label>
                <div className="flex flex-wrap gap-2">
                  {DAYS.map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors min-h-[44px] min-w-[52px] ${
                        formData.scheduledDays.includes(day)
                          ? 'bg-teal-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {DAY_NAMES[day].substring(0, 3)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Estimations */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tempi stimati *
                </label>
                <div className="space-y-2">
                  {formData.timeEstimations.map((te, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                        <input
                          type="number"
                          min="1"
                          value={te.workerCount}
                          onChange={(e) =>
                            updateTimeEstimation(
                              index,
                              'workerCount',
                              parseInt(e.target.value) || 1
                            )
                          }
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                        />
                        <span className="text-sm text-gray-500">operaio/i →</span>
                        <input
                          type="number"
                          min="1"
                          value={te.minutes}
                          onChange={(e) =>
                            updateTimeEstimation(
                              index,
                              'minutes',
                              parseInt(e.target.value) || 1
                            )
                          }
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                        />
                        <span className="text-sm text-gray-500">min</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeTimeEstimation(index)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        disabled={formData.timeEstimations.length <= 1}
                        aria-label="Rimuovi"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addTimeEstimation}
                    className="text-teal-600 text-sm font-medium flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Aggiungi tempo stimato
                  </button>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Note
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none resize-none"
                  rows={3}
                  placeholder="Note aggiuntive..."
                />
              </div>

              {/* Submit */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={
                    !formData.name ||
                    formData.scheduledDays.length === 0 ||
                    formData.timeEstimations.length === 0
                  }
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingId ? 'Salva modifiche' : 'Aggiungi edificio'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
