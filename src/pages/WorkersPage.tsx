import { useState } from 'react';
import { useApp } from '../hooks/useApp';
import type { Worker } from '../types';
import { Plus, Pencil, Trash2, X, Users, User } from 'lucide-react';

interface WorkerFormData {
  name: string;
}

const defaultFormData: WorkerFormData = {
  name: '',
};

export default function WorkersPage() {
  const { workers, addWorker, updateWorker, deleteWorker, assignments } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<WorkerFormData>(defaultFormData);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const openModal = (worker?: Worker) => {
    if (worker) {
      setEditingId(worker.id);
      setFormData({
        name: worker.name,
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
      updateWorker(editingId, formData);
    } else {
      addWorker(formData);
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    deleteWorker(id);
    setDeleteConfirmId(null);
  };

  // Count assignments per worker
  const getWorkerAssignmentCount = (workerId: string) => {
    return assignments.filter((a) => a.workerIds.includes(workerId)).length;
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm lg:sticky lg:top-0 z-10 px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">Gestione Operai</h1>
          <button
            onClick={() => openModal()}
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors min-h-[44px]"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Aggiungi</span>
          </button>
        </div>
      </div>

      {/* Worker List */}
      <div className="p-4 space-y-3">
        {workers.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center shadow-sm">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Nessun operaio configurato</p>
            <button
              onClick={() => openModal()}
              className="mt-4 text-teal-600 font-medium"
            >
              Aggiungi il primo operaio
            </button>
          </div>
        ) : (
          workers.map((worker) => {
            const assignmentCount = getWorkerAssignmentCount(worker.id);
            return (
              <div
                key={worker.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-teal-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {worker.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {assignmentCount} incarichi assegnati
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openModal(worker)}
                        className="p-2 text-gray-500 hover:text-teal-600 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="Modifica"
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(worker.id)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="Elimina"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Delete Confirmation */}
                {deleteConfirmId === worker.id && (
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
                        onClick={() => handleDelete(worker.id)}
                        className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Elimina
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
          <div className="bg-white w-full sm:max-w-lg sm:rounded-xl h-full sm:h-auto sm:max-h-[90vh] overflow-y-auto rounded-t-xl sm:rounded-t-xl">
            <div className="sticky top-0 bg-white border-b px-4 py-3 flex items-center justify-between z-10">
              <h2 className="text-lg font-semibold text-gray-800">
                {editingId ? 'Modifica Operaio' : 'Nuovo Operaio'}
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
                  Nome e Cognome *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                  placeholder="Es. Mario Rossi"
                  required
                />
              </div>

              {/* Submit */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={!formData.name}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingId ? 'Salva modifiche' : 'Aggiungi operaio'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
