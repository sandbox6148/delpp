import React from 'react';
import { FormData, ExpenseEntry, ExpenseType, CivilStatus } from '../types';
import { Trash2, Plus, Heart } from 'lucide-react';

interface Props {
  data: FormData;
  updateData: (data: Partial<FormData>) => void;
}

const ALIMONY_TYPES = [
  {
    type: ExpenseType.ALIMONY_PAID,
    label: 'Pension alimentaire versée à un ex-conjoint — Case 1301',
    desc: 'Pensions alimentaires versées à un conjoint ou ex-conjoint séparé/divorcé. Déductibles dans la limite de 24 000 €/an.',
    cap: 24000,
  },
  {
    type: ExpenseType.ALIMONY_CHILD,
    label: 'Pension alimentaire versée à un enfant non à charge — Case 1303',
    desc: 'Pensions alimentaires versées à un enfant majeur qui ne fait plus partie du ménage. Déductibles dans la limite de 4 020 €/an/enfant.',
    cap: 4020,
  },
  {
    type: ExpenseType.UNION_FEES,
    label: 'Cotisations syndicales — Case 1308',
    desc: 'Cotisations versées à un syndicat reconnu au Luxembourg. Déductibles dans la limite de 50% du revenu syndical, plafond global.',
    cap: null,
  },
  {
    type: ExpenseType.STUDY_LOAN_INTEREST,
    label: 'Intérêts sur prêt d\'études — Case 1310',
    desc: 'Intérêts débiteurs sur emprunts contractés pour financer des études supérieures du contribuable ou de ses enfants.',
    cap: null,
  },
];

export const AlimonyExpenses: React.FC<Props> = ({ data, updateData }) => {
  const isCouple = [CivilStatus.MARRIED, CivilStatus.PARTNER].includes(data.civilStatus);
  const alimonyTypes = ALIMONY_TYPES.map(t => t.type);
  const relevantExpenses = data.expenses.filter(e => alimonyTypes.includes(e.type));

  const addExpense = (type: ExpenseType) => {
    const newEntry: ExpenseEntry = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      amount: 0,
      ownerId: 'contribuable',
      label: '',
    };
    updateData({ expenses: [...data.expenses, newEntry] });
  };

  const removeExpense = (id: string) => {
    updateData({ expenses: data.expenses.filter(e => e.id !== id) });
  };

  const updateExpense = (id: string, field: keyof ExpenseEntry, value: string | number) => {
    const updated = data.expenses.map(e =>
      e.id === id ? { ...e, [field]: value } : e
    );
    updateData({ expenses: updated });
  };

  const getOwnerOptions = () => {
    const opts = [{ value: 'contribuable', label: `Contribuable (${data.contribuable.firstName || 'Moi'})` }];
    if (isCouple) opts.push({ value: 'conjoint', label: `Conjoint (${data.conjoint.firstName || 'Partenaire'})` });
    return opts;
  };

  const getTypeConfig = (type: ExpenseType) => ALIMONY_TYPES.find(t => t.type === type)!;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="border-b pb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Heart className="text-rose-500" size={24} />
          Page 13 — Dépenses Spéciales : Rentes &amp; Divers (DS)
        </h2>
        <p className="text-gray-500 mt-1 text-sm">
          Pensions alimentaires versées, cotisations syndicales et intérêts sur prêts d'études.
        </p>
      </div>

      {relevantExpenses.length === 0 && (
        <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-300 text-sm italic">
          Aucune dépense déclarée dans cette catégorie.
        </div>
      )}

      {relevantExpenses.map((expense) => {
        const cfg = getTypeConfig(expense.type);
        return (
          <div key={expense.id} className="relative bg-white p-6 rounded-lg border border-rose-200 shadow-sm">
            <button
              onClick={() => removeExpense(expense.id)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 size={20} />
            </button>

            <div className="mb-4">
              <p className="text-xs font-semibold text-rose-600">{cfg.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{cfg.desc}</p>
              {cfg.cap && (
                <p className="text-xs text-amber-600 mt-1">Plafond déductible : {new Intl.NumberFormat('fr-LU', { style: 'currency', currency: 'EUR' }).format(cfg.cap)}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Type de dépense</label>
                <select
                  value={expense.type}
                  onChange={(e) => updateExpense(expense.id, 'type', e.target.value)}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:ring-blue-500"
                >
                  {ALIMONY_TYPES.map(t => (
                    <option key={t.type} value={t.type}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (optionnel)</label>
                <input
                  type="text"
                  value={expense.label || ''}
                  onChange={(e) => updateExpense(expense.id, 'label', e.target.value)}
                  placeholder="ex: Pension à Marie Dupont, Syndicat OGBL..."
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-blue-500"
                />
              </div>

              {isCouple && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payé par</label>
                  <select
                    value={expense.ownerId}
                    onChange={(e) => updateExpense(expense.id, 'ownerId', e.target.value)}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:ring-blue-500"
                  >
                    {getOwnerOptions().map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Montant annuel payé</label>
                <div className="relative max-w-xs">
                  <input
                    type="number"
                    value={expense.amount}
                    onChange={(e) => updateExpense(expense.id, 'amount', parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md text-right pr-8 font-mono text-lg focus:ring-blue-500"
                  />
                  <span className="absolute right-3 top-2.5 text-gray-500">€</span>
                </div>
                {cfg.cap && expense.amount > cfg.cap && (
                  <p className="text-xs text-amber-600 mt-1">Montant saisi dépasse le plafond — seul {new Intl.NumberFormat('fr-LU', { style: 'currency', currency: 'EUR' }).format(cfg.cap)} sera déduit.</p>
                )}
              </div>
            </div>
          </div>
        );
      })}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {ALIMONY_TYPES.map(cfg => (
          <button
            key={cfg.type}
            onClick={() => addExpense(cfg.type)}
            className="py-3 bg-white border-2 border-dashed border-rose-300 text-rose-700 rounded-lg hover:bg-rose-50 transition-colors flex items-center justify-center gap-2 text-sm font-medium text-left px-3"
          >
            <Plus size={16} className="shrink-0" />
            <span>{cfg.label.split('—')[0].trim()}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
