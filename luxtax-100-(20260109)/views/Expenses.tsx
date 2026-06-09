import React from 'react';
import { FormData, CivilStatus, ExpenseType, ExpenseEntry } from '../types';
import { Plus, Trash2, Shield, PiggyBank, Heart, Baby, Home, Percent, UserCheck } from 'lucide-react';

interface Props {
  data: FormData;
  updateData: (data: Partial<FormData>) => void;
  type: ExpenseType;
}

export const Expenses: React.FC<Props> = ({ data, updateData, type }) => {
  const isCouple = [CivilStatus.MARRIED, CivilStatus.PARTNER].includes(data.civilStatus);

  const addExpense = () => {
    const newEntry: ExpenseEntry = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      amount: 0,
      ownerId: 'contribuable', // Default
      label: ''
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
      const options = [
          { value: 'contribuable', label: `Contribuable (${data.contribuable.firstName || 'Moi'})` }
      ];
      if (isCouple) {
          options.push({ value: 'conjoint', label: `Conjoint (${data.conjoint.firstName || 'Partenaire'})` });
      }
      
      // For some types, children or household is relevant
      if ([ExpenseType.CHILDCARE, ExpenseType.INSURANCE, ExpenseType.HOME_SAVINGS].includes(type)) {
         data.children.forEach((child, idx) => {
            options.push({ 
                value: child.id, 
                label: `Enfant: ${child.firstName || `Enfant ${idx + 1}`}` 
            });
        });
      }

      // Household option
      if ([ExpenseType.DOMESTIC_HELP, ExpenseType.HOME_SAVINGS].includes(type)) {
         options.push({ value: 'common', label: 'Ménage (Commun)' });
      }
      
      return options;
  };

  const getConfig = (t: ExpenseType) => {
      switch(t) {
          case ExpenseType.DEBIT_INTEREST:
              return { title: "Intérêts Débiteurs (Page 14)", icon: Percent, color: "text-green-600", desc: "Intérêts de prêts personnels, cartes de crédit, ouvertures de crédit. (Case 1401)", labelBtn: "Ajouter des intérêts" };
          case ExpenseType.INSURANCE:
              return { title: "Primes d'Assurances (Page 14)", icon: Shield, color: "text-green-600", desc: "Assurance Vie, Décès, RC Auto, RC Vie Privée, Mutuelle. (Case 1436)", labelBtn: "Ajouter une assurance" };
          case ExpenseType.PENSION_PLAN:
              return { title: "Prévoyance-Vieillesse (Page 15)", icon: PiggyBank, color: "text-purple-600", desc: "Contrats de prévoyance-vieillesse (Art. 111bis). Durée min 10 ans. (Case 1503)", labelBtn: "Ajouter un contrat 111bis" };
          case ExpenseType.HOME_SAVINGS:
              return { title: "Épargne Logement (Page 15)", icon: Home, color: "text-purple-600", desc: "Cotisations versées à une caisse d'épargne logement (Bausparkasse). (Case 1529)", labelBtn: "Ajouter un contrat" };
          case ExpenseType.DONATION:
              return { title: "Libéralités / Dons (Page 16)", icon: Heart, color: "text-red-500", desc: "Dons à des organismes reconnus d'utilité publique. Min 120€/an. (Case 1611)", labelBtn: "Ajouter un don" };
          case ExpenseType.CHILDCARE:
              return { title: "Frais de Garde d'enfants (Page 17)", icon: Baby, color: "text-pink-600", desc: "Crèches, maisons relais, foyers de jour, garderie. (Case 1715)", labelBtn: "Ajouter des frais de garde" };
          case ExpenseType.DOMESTIC_HELP:
              return { title: "Services Domestiques (Page 17)", icon: UserCheck, color: "text-pink-600", desc: "Aides de ménage, gens de maison déclarés au CCSS. (Case 1715)", labelBtn: "Ajouter des frais domestiques" };
          default:
              return { title: "Dépense", icon: Shield, color: "text-gray-600", desc: "", labelBtn: "Ajouter" };
      }
  };

  const config = getConfig(type);
  const Icon = config.icon;
  const relevantExpenses = data.expenses.filter(e => e.type === type);

  return (
    <div className="animate-fade-in space-y-6">
       
       <div className="border-b pb-4">
           <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
               <Icon className={config.color} size={24}/>
               {config.title}
           </h2>
           <p className="text-gray-500 mt-1">{config.desc}</p>
       </div>

       <div className="space-y-6">
          {relevantExpenses.length === 0 && (
              <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-300 text-sm italic">
                  Aucune entrée pour cette catégorie.
              </div>
          )}
          
          {relevantExpenses.map((expense) => (
              <div key={expense.id} className="relative bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <button onClick={() => removeExpense(expense.id)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 size={20} />
                  </button>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Optional: Add a custom description field for clearer management */}
                      <div className="md:col-span-2">
                           <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optionnel)</label>
                           <input
                              type="text"
                              value={expense.label || ''}
                              onChange={(e) => updateExpense(expense.id, 'label', e.target.value)}
                              placeholder="ex: AXA, Foyer, Crèche..."
                              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-blue-500"
                           />
                      </div>

                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Titulaire / Personne concernée</label>
                          <select
                              value={expense.ownerId}
                              onChange={(e) => updateExpense(expense.id, 'ownerId', e.target.value)}
                              className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
                          >
                              {getOwnerOptions().map(opt => (
                                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                              ))}
                          </select>
                      </div>

                      <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">Montant annuel payé</label>
                           <div className="relative max-w-xs">
                              <input
                                  type="number"
                                  value={expense.amount}
                                  onChange={(e) => updateExpense(expense.id, 'amount', parseFloat(e.target.value) || 0)}
                                  className="w-full px-4 py-2 border border-gray-300 rounded-md text-right pr-8 font-mono text-lg"
                              />
                              <span className="absolute right-3 top-2.5 text-gray-500">€</span>
                          </div>
                      </div>
                  </div>
              </div>
          ))}
       </div>

       {/* Add Button */}
       <button 
           onClick={addExpense} 
           className="w-full py-4 bg-white border-2 border-dashed border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 font-medium shadow-sm hover:shadow"
       >
           <Plus size={20}/> {config.labelBtn}
       </button>
    </div>
  );
};