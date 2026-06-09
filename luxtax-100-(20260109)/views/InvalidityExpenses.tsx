import React from 'react';
import { FormData, ExpenseEntry, ExpenseType, CivilStatus } from '../types';
import { Trash2, Plus, Activity } from 'lucide-react';

interface Props {
  data: FormData;
  updateData: (data: Partial<FormData>) => void;
}

export const InvalidityExpenses: React.FC<Props> = ({ data, updateData }) => {
  const isCouple = [CivilStatus.MARRIED, CivilStatus.PARTNER].includes(data.civilStatus);

  const invalidityTypes = [ExpenseType.INVALIDITY, ExpenseType.INVALIDITY_MEDICAL];
  const relevantExpenses = data.expenses.filter(e => invalidityTypes.includes(e.type));

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
    data.children.forEach((child, idx) => {
      opts.push({ value: child.id, label: `Enfant : ${child.firstName || `Enfant ${idx + 1}`}` });
    });
    return opts;
  };

  const typeConfig = {
    [ExpenseType.INVALIDITY]: {
      label: 'Frais pour maladie grave ou invalidité — Case 1702',
      desc: 'Frais extraordinaires engagés en raison d\'une maladie grave, d\'une infirmité ou d\'une invalidité (frais non couverts par la caisse de maladie ou une assurance). Déductibles sous conditions de taux d\'invalidité.',
    },
    [ExpenseType.INVALIDITY_MEDICAL]: {
      label: 'Frais médicaux pour personne invalide — Cases 1709–1714',
      desc: 'Frais spécifiques engagés pour une personne invalide du ménage (kinésithérapie, appareillages, aides techniques, aménagement domicile...). Déductibles dans la limite fixée par la loi.',
    },
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="border-b pb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Activity className="text-red-500" size={24} />
          Page 17 — Charges Extraordinaires : Invalidité (CE)
        </h2>
        <p className="text-gray-500 mt-1 text-sm">
          Frais extraordinaires liés à une maladie grave, une invalidité ou un handicap, non couverts par les assurances sociales.
        </p>
      </div>

      <div className="bg-red-50 border border-red-100 rounded-lg p-4 text-sm text-red-900">
        <strong>Conditions :</strong> Ces frais sont déductibles uniquement si le taux d'invalidité est reconnu et si les dépenses dépassent le seuil de charge normale (calculé en fonction du revenu et de la composition du ménage).
        Joindre les justificatifs médicaux et les décomptes de remboursement.
      </div>

      {relevantExpenses.length === 0 && (
        <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-300 text-sm italic">
          Aucun frais d'invalidité déclaré.
        </div>
      )}

      {relevantExpenses.map((expense) => (
        <div key={expense.id} className="relative bg-white p-6 rounded-lg border border-red-200 shadow-sm">
          <button
            onClick={() => removeExpense(expense.id)}
            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 size={20} />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Type de frais</label>
              <select
                value={expense.type}
                onChange={(e) => updateExpense(expense.id, 'type', e.target.value)}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:ring-blue-500"
              >
                {invalidityTypes.map(t => (
                  <option key={t} value={t}>{typeConfig[t].label}</option>
                ))}
              </select>
              <p className="text-xs text-gray-400 mt-1">{typeConfig[expense.type as ExpenseType.INVALIDITY | ExpenseType.INVALIDITY_MEDICAL].desc}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Personne concernée</label>
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Montant total des frais engagés</label>
              <div className="relative max-w-xs">
                <input
                  type="number"
                  value={expense.amount}
                  onChange={(e) => updateExpense(expense.id, 'amount', parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md text-right pr-8 font-mono text-lg focus:ring-blue-500"
                />
                <span className="absolute right-3 top-2.5 text-gray-500">€</span>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (nature des frais)</label>
              <input
                type="text"
                value={expense.label || ''}
                onChange={(e) => updateExpense(expense.id, 'label', e.target.value)}
                placeholder="ex: Kinésithérapie, fauteuil roulant, aménagement salle de bain..."
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      ))}

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => addExpense(ExpenseType.INVALIDITY)}
          className="flex-1 py-4 bg-white border-2 border-dashed border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-2 font-medium"
        >
          <Plus size={20} /> Frais maladie grave / invalidité
        </button>
        <button
          onClick={() => addExpense(ExpenseType.INVALIDITY_MEDICAL)}
          className="flex-1 py-4 bg-white border-2 border-dashed border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-2 font-medium"
        >
          <Plus size={20} /> Frais médicaux spécifiques
        </button>
      </div>
    </div>
  );
};
