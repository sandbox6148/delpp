import React from 'react';
import { FormData, DiverseIncomeEntry, CivilStatus } from '../types';
import { Trash2, Plus, TrendingUp } from 'lucide-react';

interface Props {
  data: FormData;
  updateData: (data: Partial<FormData>) => void;
}

const TYPE_CONFIG = {
  REAL_ESTATE_GAIN: {
    label: 'Plus-value sur cession d\'immeuble (> 2 ans) — Case 1101',
    desc: 'Gain réalisé sur la vente d\'un bien immobilier détenu depuis plus de 2 ans. Imposé au demi-taux global.',
  },
  SPECULATIVE_GAIN: {
    label: 'Plus-value spéculative (< 2 ans) — Case 1109',
    desc: 'Gain réalisé sur la vente d\'un bien immobilier ou de parts sociales détenu depuis moins de 2 ans. Imposé au taux plein.',
  },
  ALIMONY_RECEIVED: {
    label: 'Pension alimentaire reçue — Case 1121',
    desc: 'Pensions alimentaires reçues d\'un ex-conjoint. Entièrement imposables.',
  },
  OTHER: {
    label: 'Autres revenus divers — Case 1133',
    desc: 'Autres revenus nets divers non classés ailleurs (jetons de présence, droits d\'auteur exceptionnels...).',
  },
};

export const DiversIncomes: React.FC<Props> = ({ data, updateData }) => {
  const isCouple = [CivilStatus.MARRIED, CivilStatus.PARTNER].includes(data.civilStatus);

  const addEntry = (type: DiverseIncomeEntry['type']) => {
    const newEntry: DiverseIncomeEntry = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      ownerId: 'contribuable',
      amount: 0,
      description: '',
    };
    updateData({ diverseIncomes: [...data.diverseIncomes, newEntry] });
  };

  const removeEntry = (id: string) => {
    updateData({ diverseIncomes: data.diverseIncomes.filter(e => e.id !== id) });
  };

  const updateEntry = (id: string, field: keyof DiverseIncomeEntry, value: string | number) => {
    const updated = data.diverseIncomes.map(e =>
      e.id === id ? { ...e, [field]: value } : e
    );
    updateData({ diverseIncomes: updated });
  };

  const getOwnerOptions = () => {
    const opts = [{ value: 'contribuable', label: `Contribuable (${data.contribuable.firstName || 'Moi'})` }];
    if (isCouple) opts.push({ value: 'conjoint', label: `Conjoint (${data.conjoint.firstName || 'Partenaire'})` });
    return opts;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="border-b pb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <TrendingUp className="text-cyan-600" size={24} />
          Page 11 — Revenus Divers (D)
        </h2>
        <p className="text-gray-500 mt-1 text-sm">
          Revenus non classés dans les autres catégories : plus-values immobilières, pensions alimentaires reçues, gains spéculatifs.
        </p>
      </div>

      {data.diverseIncomes.length === 0 && (
        <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-300 text-sm italic">
          Aucun revenu divers ajouté.
        </div>
      )}

      {data.diverseIncomes.map((entry, index) => (
        <div key={entry.id} className="relative bg-white p-6 rounded-lg border border-cyan-200 shadow-sm">
          <button
            onClick={() => removeEntry(entry.id)}
            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 size={20} />
          </button>

          <h4 className="font-semibold text-gray-800 mb-1">Revenu divers {index + 1}</h4>
          <p className="text-xs text-cyan-700 mb-4">{TYPE_CONFIG[entry.type].label}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Type de revenu</label>
              <select
                value={entry.type}
                onChange={(e) => updateEntry(entry.id, 'type', e.target.value)}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:ring-blue-500"
              >
                {Object.entries(TYPE_CONFIG).map(([key, cfg]) => (
                  <option key={key} value={key}>{cfg.label}</option>
                ))}
              </select>
              <p className="text-xs text-gray-400 mt-1">{TYPE_CONFIG[entry.type].desc}</p>
            </div>

            {isCouple && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titulaire</label>
                <select
                  value={entry.ownerId}
                  onChange={(e) => updateEntry(entry.id, 'ownerId', e.target.value)}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:ring-blue-500"
                >
                  {getOwnerOptions().map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Montant net</label>
              <div className="relative max-w-xs">
                <input
                  type="number"
                  value={entry.amount}
                  onChange={(e) => updateEntry(entry.id, 'amount', parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-blue-500 pr-8"
                />
                <span className="absolute right-3 top-2 text-gray-400">€</span>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (optionnel)</label>
              <input
                type="text"
                value={entry.description || ''}
                onChange={(e) => updateEntry(entry.id, 'description', e.target.value)}
                placeholder="ex: Vente appartement rue X, pension de M. Dupont..."
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      ))}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {(Object.keys(TYPE_CONFIG) as DiverseIncomeEntry['type'][]).map((type) => (
          <button
            key={type}
            onClick={() => addEntry(type)}
            className="py-3 bg-white border-2 border-dashed border-cyan-300 text-cyan-700 rounded-lg hover:bg-cyan-50 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
          >
            <Plus size={16} /> {TYPE_CONFIG[type].label.split('—')[0].trim()}
          </button>
        ))}
      </div>
    </div>
  );
};
