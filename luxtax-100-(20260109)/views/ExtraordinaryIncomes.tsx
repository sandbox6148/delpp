import React from 'react';
import { FormData, ExtraordinaryIncomeEntry, CivilStatus } from '../types';
import { Trash2, Plus, Zap } from 'lucide-react';

interface Props {
  data: FormData;
  updateData: (data: Partial<FormData>) => void;
}

const TYPE_CONFIG = {
  SEVERANCE: {
    label: 'Indemnité de départ / licenciement — Case 1201',
    desc: 'Indemnités de licenciement, indemnités de rupture conventionnelle. Imposées au demi-taux global (Art. 132 LIR).',
  },
  BUSINESS_GAIN: {
    label: 'Plus-value sur cession d\'entreprise — Case 1215',
    desc: 'Bénéfice réalisé lors de la vente d\'un fonds de commerce ou d\'une entreprise individuelle. Demi-taux global.',
  },
  PENSION_CAPITAL: {
    label: 'Capital de prévoyance-vieillesse — Case 1219',
    desc: 'Versement en capital d\'un contrat de prévoyance vieillesse (Art. 111bis). Imposition spéciale au demi-taux.',
  },
  OTHER: {
    label: 'Autres revenus extraordinaires — Case 1221',
    desc: 'Tout autre revenu à caractère exceptionnel, non périodique, non classé ci-dessus.',
  },
};

export const ExtraordinaryIncomes: React.FC<Props> = ({ data, updateData }) => {
  const isCouple = [CivilStatus.MARRIED, CivilStatus.PARTNER].includes(data.civilStatus);

  const addEntry = (type: ExtraordinaryIncomeEntry['type']) => {
    const newEntry: ExtraordinaryIncomeEntry = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      ownerId: 'contribuable',
      amount: 0,
      description: '',
    };
    updateData({ extraordinaryIncomes: [...data.extraordinaryIncomes, newEntry] });
  };

  const removeEntry = (id: string) => {
    updateData({ extraordinaryIncomes: data.extraordinaryIncomes.filter(e => e.id !== id) });
  };

  const updateEntry = (id: string, field: keyof ExtraordinaryIncomeEntry, value: string | number) => {
    const updated = data.extraordinaryIncomes.map(e =>
      e.id === id ? { ...e, [field]: value } : e
    );
    updateData({ extraordinaryIncomes: updated });
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
          <Zap className="text-yellow-500" size={24} />
          Page 12 — Revenus Extraordinaires (EX)
        </h2>
        <p className="text-gray-500 mt-1 text-sm">
          Revenus exceptionnels à caractère non périodique : indemnités de départ, plus-values sur cession d'entreprise,
          capitaux de prévoyance. Ces revenus bénéficient généralement d'un régime fiscal allégé (demi-taux global).
        </p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-900">
        <strong>Régime fiscal avantageux :</strong> La plupart des revenus extraordinaires sont imposés au demi-taux global
        (la moitié du taux d'imposition moyen), ce qui les rend fiscalement plus favorables que les revenus ordinaires.
      </div>

      {data.extraordinaryIncomes.length === 0 && (
        <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-300 text-sm italic">
          Aucun revenu extraordinaire déclaré.
        </div>
      )}

      {data.extraordinaryIncomes.map((entry, index) => (
        <div key={entry.id} className="relative bg-white p-6 rounded-lg border border-yellow-200 shadow-sm">
          <button
            onClick={() => removeEntry(entry.id)}
            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 size={20} />
          </button>

          <h4 className="font-semibold text-gray-800 mb-4">Revenu extraordinaire {index + 1}</h4>

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
                <label className="block text-sm font-medium text-gray-700 mb-1">Bénéficiaire</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Montant brut</label>
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
                placeholder="ex: Licenciement société X en mars 2024..."
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      ))}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {(Object.keys(TYPE_CONFIG) as ExtraordinaryIncomeEntry['type'][]).map((type) => (
          <button
            key={type}
            onClick={() => addEntry(type)}
            className="py-3 bg-white border-2 border-dashed border-yellow-300 text-yellow-700 rounded-lg hover:bg-yellow-50 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
          >
            <Plus size={16} /> {TYPE_CONFIG[type].label.split('—')[0].trim()}
          </button>
        ))}
      </div>
    </div>
  );
};
