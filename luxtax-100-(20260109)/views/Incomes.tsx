import React from 'react';
import { FormData, IncomeEntry, CivilStatus } from '../types';
import { Tooltip } from '../components/Tooltip';
import { Trash2, Briefcase, Landmark, Building, Coins, User, Plus } from 'lucide-react';

interface Props {
  data: FormData;
  updateData: (data: Partial<FormData>) => void;
  section: 'S' | 'P' | 'CM' | 'L';
}

export const Incomes: React.FC<Props> = ({ data, updateData, section }) => {
  const isCouple = [CivilStatus.MARRIED, CivilStatus.PARTNER].includes(data.civilStatus);

  const addEntry = (type: 'SALARY' | 'PENSION') => {
    const newEntry: IncomeEntry = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      grossAmount: 0,
      deductions: 0,
      taxWithheld: 0,
      expenses: 0,
      type,
      ownerId: 'contribuable'
    };
    updateData({ incomes: [...data.incomes, newEntry] });
  };

  const removeEntry = (id: string) => {
    updateData({ incomes: data.incomes.filter(s => s.id !== id) });
  };

  const updateEntry = (id: string, field: keyof IncomeEntry, value: string | number) => {
    const updated = data.incomes.map(s => 
      s.id === id ? { ...s, [field]: value } : s
    );
    updateData({ incomes: updated });
  };

  const updateRealEstate = (field: keyof FormData['realEstate'], value: number) => {
     updateData({ realEstate: { ...data.realEstate, [field]: value }});
  }

  const updateCapital = (field: keyof FormData['capital'], value: number) => {
    updateData({ capital: { ...data.capital, [field]: value }});
  }

  const getOwnerOptions = () => {
      const options = [
          { value: 'contribuable', label: `Contribuable (${data.contribuable.firstName || 'Moi'})` }
      ];
      if (isCouple) {
          options.push({ value: 'conjoint', label: `Conjoint (${data.conjoint.firstName || 'Partenaire'})` });
      }
      return options;
  };

  const renderEntryForm = (entry: IncomeEntry, index: number) => {
      const isSalary = entry.type === 'SALARY';
      const isConjoint = entry.ownerId === 'conjoint';

      return (
        <div 
            key={entry.id} 
            className={`
                bg-white border rounded-lg p-6 mb-6 shadow-sm relative animate-fade-in
                ${isConjoint ? 'border-purple-200' : 'border-blue-200'}
            `}
        >
            <div className={`absolute top-0 left-0 w-1 h-full rounded-l-lg ${isConjoint ? 'bg-purple-400' : 'bg-blue-400'}`}></div>
            
            <button onClick={() => removeEntry(entry.id)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors">
                <Trash2 size={20} />
            </button>
            
            <h4 className={`font-semibold text-lg mb-6 flex items-center gap-2 ${isConjoint ? 'text-purple-900' : 'text-blue-900'}`}>
                {isSalary ? 'Occupation Salariée' : 'Pension / Rente'} 
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 1. Selection Propriétaire */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Qui est le bénéficiaire ?
                    </label>
                    <select
                        value={entry.ownerId}
                        onChange={(e) => updateEntry(entry.id, 'ownerId', e.target.value)}
                        className={`block w-full md:w-1/2 px-4 py-2 border rounded-md focus:ring-2 focus:ring-opacity-50 ${isConjoint ? 'border-purple-300 focus:ring-purple-500 bg-purple-50' : 'border-blue-300 focus:ring-blue-500 bg-blue-50'}`}
                    >
                        {getOwnerOptions().map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {isSalary ? 'Nom de l\'Employeur (Page 7)' : 'Nom de la Caisse de Pension (Page 8)'}
                    </label>
                    <input
                        type="text"
                        value={entry.name}
                        onChange={(e) => updateEntry(entry.id, 'name', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-blue-500"
                        placeholder={isSalary ? "Ex: Société SA" : "Ex: CNAP"}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Montant Brut Annuel {isSalary ? '(Case 701-704)' : '(Case 801-804)'}
                    </label>
                    <div className="relative max-w-xs">
                        <input
                            type="number"
                            value={entry.grossAmount}
                            onChange={(e) => updateEntry(entry.id, 'grossAmount', parseFloat(e.target.value) || 0)}
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-blue-500 pr-8"
                        />
                         <span className="absolute right-3 top-2 text-gray-400">€</span>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Impôt retenu à la source (Page 19)
                    </label>
                    <div className="relative max-w-xs">
                        <input
                            type="number"
                            value={entry.taxWithheld}
                            onChange={(e) => updateEntry(entry.id, 'taxWithheld', parseFloat(e.target.value) || 0)}
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-blue-500 pr-8"
                        />
                         <span className="absolute right-3 top-2 text-gray-400">€</span>
                    </div>
                </div>

                {isSalary && (
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Frais d'obtention réels (Case 743)
                            <Tooltip content="Laissez vide si vous n'avez pas de frais réels supérieurs à 540€. Le minimum forfaitaire sera appliqué automatiquement." />
                        </label>
                         <div className="relative max-w-xs">
                            <input
                                type="number"
                                value={entry.expenses}
                                onChange={(e) => updateEntry(entry.id, 'expenses', parseFloat(e.target.value) || 0)}
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-blue-500 pr-8"
                            />
                            <span className="absolute right-3 top-2 text-gray-400">€</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
      );
  };

  return (
    <div className="space-y-6">
        
        {section === 'S' && (
            <div className="animate-fade-in">
                 <div className="mb-6 border-b pb-4">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Briefcase className="text-blue-600"/>
                        Page 7 - Occupation Salariée
                    </h2>
                </div>
                {data.incomes.filter(s => s.type === 'SALARY').map((s, i) => renderEntryForm(s, i))}
                
                <button 
                    onClick={() => addEntry('SALARY')} 
                    className="w-full py-4 bg-white border-2 border-dashed border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors flex flex-col items-center justify-center gap-2 font-medium"
                >
                    <Plus size={24}/>
                    <span>Ajouter un salaire / revenu</span>
                </button>
            </div>
        )}

        {section === 'P' && (
             <div className="animate-fade-in">
                 <div className="mb-6 border-b pb-4">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Landmark className="text-blue-600"/>
                        Page 8 - Pensions ou Rentes
                    </h2>
                </div>
                {data.incomes.filter(s => s.type === 'PENSION').map((s, i) => renderEntryForm(s, i))}
                 
                 <button 
                    onClick={() => addEntry('PENSION')} 
                    className="w-full py-4 bg-white border-2 border-dashed border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors flex flex-col items-center justify-center gap-2 font-medium"
                >
                    <Plus size={24}/>
                    <span>Ajouter une pension</span>
                </button>
            </div>
        )}

        {section === 'CM' && (
            <div className="space-y-6 animate-fade-in">
                <div className="flex items-center gap-2 mb-6 border-b pb-4">
                    <Coins className="text-yellow-600" size={24}/>
                    <h2 className="text-xl font-bold text-gray-800">Page 9 - Capitaux Mobiliers</h2>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2 bg-yellow-50 p-4 rounded-md text-sm text-yellow-800 border border-yellow-200 flex items-start gap-3">
                            <span className="text-xl">💡</span>
                            <div>
                                <strong>Bon à savoir:</strong> Les intérêts sur comptes d'épargne luxembourgeois subissent généralement une retenue libératoire de 20% (RELIBI). Ces revenus ne doivent pas être déclarés sauf si vous optez pour l'imposition globale (rarement avantageux).
                            </div>
                        </div>

                        <div>
                             <label className="block text-sm font-medium text-gray-700 mb-1">
                                Revenus soumis à retenue libératoire (RELIBI) - Case A
                            </label>
                            <div className="relative max-w-xs">
                                <input
                                    type="number"
                                    value={data.capital.exempt}
                                    onChange={(e) => updateCapital('exempt', parseFloat(e.target.value) || 0)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-blue-500 pr-8"
                                />
                                <span className="absolute right-3 top-2 text-gray-400">€</span>
                            </div>
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-gray-700 mb-1">
                                Revenus passibles de retenue d'impôt (Dividendes) - Case 901
                            </label>
                            <div className="relative max-w-xs">
                                <input
                                    type="number"
                                    value={data.capital.withholding}
                                    onChange={(e) => updateCapital('withholding', parseFloat(e.target.value) || 0)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-blue-500 pr-8"
                                />
                                <span className="absolute right-3 top-2 text-gray-400">€</span>
                            </div>
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-gray-700 mb-1">
                                Revenus non soumis à retenue (Intérêts étrangers) - Case 903
                            </label>
                            <div className="relative max-w-xs">
                                <input
                                    type="number"
                                    value={data.capital.notSubject}
                                    onChange={(e) => updateCapital('notSubject', parseFloat(e.target.value) || 0)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-blue-500 pr-8"
                                />
                                <span className="absolute right-3 top-2 text-gray-400">€</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {section === 'L' && (
             <div className="space-y-6 animate-fade-in">
                 <div className="flex items-center gap-2 mb-6 border-b pb-4">
                    <Building className="text-indigo-600" size={24}/>
                    <h2 className="text-xl font-bold text-gray-800">Page 10 - Location de Biens</h2>
                </div>
                
                 <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <div className="space-y-8">
                        {/* Section Résidence Principale */}
                        <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-100">
                             <h3 className="font-semibold text-indigo-900 mb-4 flex items-center gap-2">
                                Résidence Principale (L2)
                             </h3>
                             <label className="block text-sm font-medium text-indigo-900 mb-2">
                                Intérêts débiteurs Habitation Principale (Case 1044)
                                <Tooltip content="Intérêts en rapport avec l'habitation librement disponible (résidence principale). Le plafond déductible dépend de la date d'occupation et de la composition du ménage." />
                            </label>
                            <div className="relative max-w-xs">
                                <input
                                    type="number"
                                    value={data.realEstate.mainResidenceInterest}
                                    onChange={(e) => updateRealEstate('mainResidenceInterest', parseFloat(e.target.value) || 0)}
                                    className="w-full px-4 py-2 border border-indigo-200 rounded focus:ring-indigo-500 bg-white pl-8"
                                />
                                <span className="absolute left-3 top-2 text-indigo-400">€</span>
                            </div>
                        </div>
                        
                        {/* Section Location */}
                        <div>
                             <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                Biens donnés en location (L1)
                             </h3>
                             <label className="block text-sm font-medium text-gray-700 mb-2">
                                Revenu net de location (Case 1029)
                                <Tooltip content="Total des loyers encaissés moins les frais (intérêts, amortissements, réparations) pour les biens mis en location." />
                            </label>
                            <div className="relative max-w-xs">
                                <input
                                    type="number"
                                    value={data.realEstate.rentalNet}
                                    onChange={(e) => updateRealEstate('rentalNet', parseFloat(e.target.value) || 0)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-blue-500 pl-8"
                                />
                                <span className="absolute left-3 top-2 text-gray-400">€</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};