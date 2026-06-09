import React from 'react';
import { FormData, Child } from '../types';
import { Plus, Trash2, Users } from 'lucide-react';

interface Props {
  data: FormData;
  updateData: (data: Partial<FormData>) => void;
}

export const Children: React.FC<Props> = ({ data, updateData }) => {
  const addChild = () => {
    const newChild: Child = {
      id: Math.random().toString(36).substr(2, 9),
      firstName: '',
      lastName: data.contribuable.lastName || '',
      birthDate: '',
      matricule: '',
      isStudent: false,
      disability: false,
      sharedCustody: false,
    };
    updateData({ children: [...data.children, newChild] });
  };

  const removeChild = (id: string) => {
    updateData({ children: data.children.filter(c => c.id !== id) });
  };

  const updateChild = (id: string, field: keyof Child, value: any) => {
    const updatedChildren = data.children.map(child =>
      child.id === id ? { ...child, [field]: value } : child
    );
    updateData({ children: updatedChildren });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2 flex items-center gap-2">
          <Users size={20} className="text-pink-500" />
          Enfants à charge (Page 2)
        </h2>

        {data.children.length > 0 ? (
          <div className="space-y-6 mb-6">
            {data.children.map((child, index) => (
              <div key={child.id} className="relative bg-gray-50 p-6 rounded-lg border border-gray-200">
                <button onClick={() => removeChild(child.id)} className="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition-colors">
                  <Trash2 size={20} />
                </button>
                <h4 className="text-md font-bold text-gray-800 mb-4">Enfant {index + 1}</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom (201)</label>
                    <input
                      value={child.lastName}
                      onChange={(e) => updateChild(child.id, 'lastName', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded uppercase"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                    <input
                      value={child.firstName}
                      onChange={(e) => updateChild(child.id, 'firstName', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance (202)</label>
                    <input
                      type="date"
                      value={child.birthDate}
                      onChange={(e) => updateChild(child.id, 'birthDate', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Matricule national (203)</label>
                    <input
                      type="text"
                      value={child.matricule || ''}
                      onChange={(e) => updateChild(child.id, 'matricule', e.target.value)}
                      placeholder="13 chiffres"
                      className="w-full px-4 py-2 border border-gray-300 rounded font-mono"
                    />
                  </div>

                  <div className="md:col-span-2 pt-2 border-t border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-3">Situation particulière</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <label className="flex items-center gap-3 p-3 rounded border border-gray-200 hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={child.isStudent}
                          onChange={(e) => updateChild(child.id, 'isStudent', e.target.checked)}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="text-sm text-gray-700">
                          <strong className="block">Étudiant(e) (Case 204)</strong>
                          <span className="text-xs text-gray-400">Enfant majeur poursuivant des études</span>
                        </span>
                      </label>

                      <label className="flex items-center gap-3 p-3 rounded border border-gray-200 hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={child.disability}
                          onChange={(e) => updateChild(child.id, 'disability', e.target.checked)}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="text-sm text-gray-700">
                          <strong className="block">Handicap / Invalidité (Case 206)</strong>
                          <span className="text-xs text-gray-400">Enfant avec invalidité reconnue</span>
                        </span>
                      </label>

                      <label className="flex items-center gap-3 p-3 rounded border border-gray-200 hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={child.sharedCustody || false}
                          onChange={(e) => updateChild(child.id, 'sharedCustody', e.target.checked)}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="text-sm text-gray-700">
                          <strong className="block">Garde alternée (Case 207)</strong>
                          <span className="text-xs text-gray-400">Résidence alternée chez les deux parents</span>
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded border border-dashed border-gray-300 text-gray-500 mb-6">
            Aucun enfant ajouté.
          </div>
        )}

        <button
          onClick={addChild}
          className="w-full py-4 bg-white border-2 border-dashed border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors font-medium flex items-center justify-center gap-2"
        >
          <Plus size={18} /> Ajouter un enfant
        </button>

        <div className="space-y-4 pt-6 mt-6 border-t border-gray-100">
          <h3 className="text-sm font-semibold text-gray-800">Demandes spécifiques</h3>

          <label className="flex items-start gap-3 p-4 rounded hover:bg-gray-50 cursor-pointer border border-gray-200">
            <input
              type="checkbox"
              checked={data.applyForCIM}
              onChange={(e) => updateData({ applyForCIM: e.target.checked })}
              className="mt-1 w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">
              <strong>Demande de crédit d'impôt monoparental (CIM) — Case 228</strong><br />
              <span className="text-gray-500 text-xs">Je vis seul(e) avec mes enfants sans former de ménage commun avec une autre personne.</span>
            </span>
          </label>

          <label className="flex items-start gap-3 p-4 rounded hover:bg-gray-50 cursor-pointer border border-gray-200">
            <input
              type="checkbox"
              checked={data.applyForBonification}
              onChange={(e) => updateData({ applyForBonification: e.target.checked })}
              className="mt-1 w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">
              <strong>Demande de bonification d'impôt pour enfant — Case 237</strong><br />
              <span className="text-gray-500 text-xs">Si la modération d'impôt ne s'applique pas pleinement (revenus faibles).</span>
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};
