import React from 'react';
import { FormData, TaxWithheldEntry, CivilStatus } from '../types';
import { Trash2, Plus, Receipt } from 'lucide-react';

interface Props {
  data: FormData;
  updateData: (data: Partial<FormData>) => void;
}

const TYPE_CONFIG = {
  SALARY_NOT_CREDITED: {
    label: 'Retenues sur salaires non imputées (Case 1901 / 1903)',
    desc: 'Retenues d\'impôt sur salaires qui n\'ont pas été créditées sur la fiche de retenue annuelle (ex: retenues mensuelles non consolidées).',
  },
  PENSION_NOT_CREDITED: {
    label: 'Retenues sur pensions non imputées (Case 1905 / 1907)',
    desc: 'Retenues d\'impôt sur pensions ou rentes qui n\'apparaissent pas sur le récapitulatif annuel de la caisse de pension.',
  },
  OTHER: {
    label: 'Autres retenues à la source (Case 1909+)',
    desc: 'Toute autre retenue d\'impôt à la source non déclarée ailleurs (retenues sur revenus de capitaux, retenues étrangères imputables...).',
  },
};

export const Retenues: React.FC<Props> = ({ data, updateData }) => {
  const isCouple = [CivilStatus.MARRIED, CivilStatus.PARTNER].includes(data.civilStatus);

  const addEntry = (type: TaxWithheldEntry['type']) => {
    const newEntry: TaxWithheldEntry = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      ownerId: 'contribuable',
      amount: 0,
      source: '',
    };
    updateData({ additionalWithholdings: [...data.additionalWithholdings, newEntry] });
  };

  const removeEntry = (id: string) => {
    updateData({ additionalWithholdings: data.additionalWithholdings.filter(e => e.id !== id) });
  };

  const updateEntry = (id: string, field: keyof TaxWithheldEntry, value: string | number) => {
    const updated = data.additionalWithholdings.map(e =>
      e.id === id ? { ...e, [field]: value } : e
    );
    updateData({ additionalWithholdings: updated });
  };

  const getOwnerOptions = () => {
    const opts = [{ value: 'contribuable', label: `Contribuable (${data.contribuable.firstName || 'Moi'})` }];
    if (isCouple) opts.push({ value: 'conjoint', label: `Conjoint (${data.conjoint.firstName || 'Partenaire'})` });
    return opts;
  };

  const totalWithheld = data.additionalWithholdings.reduce((sum, e) => sum + e.amount, 0);
  const salaryWithheld = data.incomes.reduce((sum, i) => sum + i.taxWithheld, 0);
  const totalAllWithheld = totalWithheld + salaryWithheld;
  const fmt = (v: number) => new Intl.NumberFormat('fr-LU', { style: 'currency', currency: 'EUR' }).format(v);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="border-b pb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Receipt className="text-gray-600" size={24} />
          Page 19 — Retenues à la Source (RD)
        </h2>
        <p className="text-gray-500 mt-1 text-sm">
          Retenues d'impôt à la source non encore créditées dans vos fiches de salaire ou de pension.
          Les retenues déjà saisies dans les pages Salaires et Pensions sont automatiquement prises en compte.
        </p>
      </div>

      {salaryWithheld > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
          <strong>Retenues déjà déclarées :</strong> {fmt(salaryWithheld)} (depuis les pages Salaires/Pensions).
          Cette page sert à déclarer des retenues supplémentaires non capturées sur les fiches.
        </div>
      )}

      {data.additionalWithholdings.length === 0 && (
        <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-300 text-sm italic">
          Aucune retenue supplémentaire à déclarer.
        </div>
      )}

      {data.additionalWithholdings.map((entry, index) => (
        <div key={entry.id} className="relative bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <button
            onClick={() => removeEntry(entry.id)}
            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 size={20} />
          </button>

          <h4 className="font-semibold text-gray-800 mb-4">Retenue {index + 1}</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Type de retenue</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Contribuable concerné</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Source (employeur, caisse...)</label>
              <input
                type="text"
                value={entry.source || ''}
                onChange={(e) => updateEntry(entry.id, 'source', e.target.value)}
                placeholder="ex: Société ABC, CNAP..."
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Montant retenu</label>
              <div className="relative max-w-xs">
                <input
                  type="number"
                  value={entry.amount}
                  onChange={(e) => updateEntry(entry.id, 'amount', parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md text-right pr-8 font-mono text-lg focus:ring-blue-500"
                />
                <span className="absolute right-3 top-2.5 text-gray-500">€</span>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="flex flex-col sm:flex-row gap-3">
        {(Object.keys(TYPE_CONFIG) as TaxWithheldEntry['type'][]).map(type => (
          <button
            key={type}
            onClick={() => addEntry(type)}
            className="flex-1 py-3 bg-white border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
          >
            <Plus size={16} /> {TYPE_CONFIG[type].label.split('(')[0].trim()}
          </button>
        ))}
      </div>

      {totalAllWithheld > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">Total retenues déclarées (tous sources)</span>
            <span className="font-bold text-gray-900 text-lg">{fmt(totalAllWithheld)}</span>
          </div>
          {salaryWithheld > 0 && totalWithheld > 0 && (
            <div className="mt-2 text-xs text-gray-400 space-y-1">
              <div className="flex justify-between"><span>Depuis salaires/pensions :</span><span>{fmt(salaryWithheld)}</span></div>
              <div className="flex justify-between"><span>Retenues supplémentaires :</span><span>{fmt(totalWithheld)}</span></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
