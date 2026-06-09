import React from 'react';
import { FormData, IndependentIncomeEntry, CivilStatus } from '../types';
import { Trash2, Plus, Store, Wheat, Stethoscope } from 'lucide-react';

interface Props {
  data: FormData;
  updateData: (data: Partial<FormData>) => void;
  section: 'COMMERCIAL' | 'AGRICOLE' | 'LIBERAL';
}

const SECTION_CONFIG = {
  COMMERCIAL: {
    title: 'Page 5 — Bénéfice Commercial (C)',
    icon: Store,
    color: 'text-orange-600',
    borderColor: 'border-orange-200',
    bgColor: 'bg-orange-50',
    desc: 'Résultat net provenant d\'une activité commerciale ou artisanale exercée à titre indépendant.',
    caseRef: 'Cases 501 / 505',
    addLabel: 'Ajouter une activité commerciale',
    placeholder: 'ex: Commerce de détail, artisanat...',
  },
  AGRICOLE: {
    title: 'Page 5 — Bénéfice Agricole et Forestier (A)',
    icon: Wheat,
    color: 'text-green-700',
    borderColor: 'border-green-200',
    bgColor: 'bg-green-50',
    desc: 'Résultat net provenant d\'une exploitation agricole, sylvicole ou viticole.',
    caseRef: 'Cases 509 / 513',
    addLabel: 'Ajouter une activité agricole',
    placeholder: 'ex: Exploitation agricole, viticulture...',
  },
  LIBERAL: {
    title: 'Page 6 — Profession Libérale (I)',
    icon: Stethoscope,
    color: 'text-teal-600',
    borderColor: 'border-teal-200',
    bgColor: 'bg-teal-50',
    desc: 'Résultat net provenant de l\'exercice d\'une profession libérale (médecin, avocat, architecte, consultant...).',
    caseRef: 'Cases 601 / 605',
    addLabel: 'Ajouter une activité libérale',
    placeholder: 'ex: Médecin, Avocat, Architecte...',
  },
};

export const IndependentIncomes: React.FC<Props> = ({ data, updateData, section }) => {
  const isCouple = [CivilStatus.MARRIED, CivilStatus.PARTNER].includes(data.civilStatus);
  const config = SECTION_CONFIG[section];
  const Icon = config.icon;

  const entries = data.independentIncomes.filter(e => e.type === section);

  const addEntry = () => {
    const newEntry: IndependentIncomeEntry = {
      id: Math.random().toString(36).substr(2, 9),
      type: section,
      ownerId: 'contribuable',
      netResult: 0,
      priorLoss: 0,
      description: '',
    };
    updateData({ independentIncomes: [...data.independentIncomes, newEntry] });
  };

  const removeEntry = (id: string) => {
    updateData({ independentIncomes: data.independentIncomes.filter(e => e.id !== id) });
  };

  const updateEntry = (id: string, field: keyof IndependentIncomeEntry, value: string | number) => {
    const updated = data.independentIncomes.map(e =>
      e.id === id ? { ...e, [field]: value } : e
    );
    updateData({ independentIncomes: updated });
  };

  const getOwnerOptions = () => {
    const options = [{ value: 'contribuable', label: `Contribuable (${data.contribuable.firstName || 'Moi'})` }];
    if (isCouple) {
      options.push({ value: 'conjoint', label: `Conjoint (${data.conjoint.firstName || 'Partenaire'})` });
    }
    return options;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="border-b pb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Icon className={config.color} size={24} />
          {config.title}
        </h2>
        <p className="text-gray-500 mt-1 text-sm">{config.desc}</p>
      </div>

      {entries.length === 0 && (
        <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-300 text-sm italic">
          Aucune activité déclarée pour cette catégorie.
        </div>
      )}

      {entries.map((entry, index) => (
        <div key={entry.id} className={`relative bg-white p-6 rounded-lg border ${config.borderColor} shadow-sm`}>
          <button
            onClick={() => removeEntry(entry.id)}
            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 size={20} />
          </button>

          <h4 className="font-semibold text-gray-800 mb-4">Activité {index + 1}</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {isCouple && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Titulaire</label>
                <select
                  value={entry.ownerId}
                  onChange={(e) => updateEntry(entry.id, 'ownerId', e.target.value)}
                  className="block w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-md bg-white focus:ring-blue-500"
                >
                  {getOwnerOptions().map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description de l'activité</label>
              <input
                type="text"
                value={entry.description || ''}
                onChange={(e) => updateEntry(entry.id, 'description', e.target.value)}
                placeholder={config.placeholder}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Résultat net {entry.netResult < 0 ? '(Perte)' : '(Bénéfice)'} — {config.caseRef}
              </label>
              <p className="text-xs text-gray-400 mb-1">Saisir un montant négatif en cas de perte</p>
              <div className="relative max-w-xs">
                <input
                  type="number"
                  value={entry.netResult}
                  onChange={(e) => updateEntry(entry.id, 'netResult', parseFloat(e.target.value) || 0)}
                  className={`w-full px-4 py-2 border rounded focus:ring-blue-500 pr-8 ${entry.netResult < 0 ? 'border-red-300 bg-red-50 text-red-700' : 'border-gray-300'}`}
                />
                <span className="absolute right-3 top-2 text-gray-400">€</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Report de pertes antérieures
              </label>
              <p className="text-xs text-gray-400 mb-1">Pertes des années précédentes imputables</p>
              <div className="relative max-w-xs">
                <input
                  type="number"
                  min="0"
                  value={entry.priorLoss}
                  onChange={(e) => updateEntry(entry.id, 'priorLoss', parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-blue-500 pr-8"
                />
                <span className="absolute right-3 top-2 text-gray-400">€</span>
              </div>
            </div>

            {entry.netResult !== 0 && (
              <div className={`md:col-span-2 p-3 rounded-md text-sm font-medium ${entry.netResult - entry.priorLoss >= 0 ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                Résultat imposable : {new Intl.NumberFormat('fr-LU', { style: 'currency', currency: 'EUR' }).format(entry.netResult - entry.priorLoss)}
              </div>
            )}
          </div>
        </div>
      ))}

      <button
        onClick={addEntry}
        className="w-full py-4 bg-white border-2 border-dashed border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 font-medium"
      >
        <Plus size={20} /> {config.addLabel}
      </button>
    </div>
  );
};
