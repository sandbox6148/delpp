import React from 'react';
import { FormData, IndependantEntry } from '../types';
import { Card, SectionTitle } from '../components/ui/Card';
import { Field, AmountField, inputClass, selectClass } from '../components/ui/Field';
import { AddButton, EmptyState } from '../components/ui/AddButton';
import { Store, Trash2 } from 'lucide-react';

interface Props { data: FormData; updateData: (d: Partial<FormData>) => void; }

type TabType = 'COMMERCIAL' | 'AGRICOLE' | 'LIBERAL';

const TABS: { key: TabType; label: string; hint: string }[] = [
  { key: 'COMMERCIAL', label: 'Commerce',            hint: 'Bénéfice commercial individuel ou en société — G4000' },
  { key: 'AGRICOLE',   label: 'Agriculture / forêt', hint: 'Bénéfice agricole et forestier — G4010' },
  { key: 'LIBERAL',    label: 'Profession libérale', hint: 'Médecin, avocat, architecte, etc. — G4020' },
];

const isCouple = (data: FormData) => ['MARRIED', 'PARTNER'].includes(data.contribuable.civilStatus);

export const IndependantIncomes: React.FC<Props> = ({ data, updateData }) => {
  const [activeTab, setActiveTab] = React.useState<TabType>('COMMERCIAL');
  const entries = data.independants.filter(e => e.type === activeTab);

  const add = () => {
    const e: IndependantEntry = {
      id: Math.random().toString(36).slice(2),
      type: activeTab,
      ownerId: 'contribuable',
      description: '',
      resultatNet: 0,
      reportPertes: 0,
    };
    updateData({ independants: [...data.independants, e] });
  };

  const update = (id: string, fields: Partial<IndependantEntry>) =>
    updateData({ independants: data.independants.map(e => e.id === id ? { ...e, ...fields } : e) });

  const remove = (id: string) =>
    updateData({ independants: data.independants.filter(e => e.id !== id) });

  const tab = TABS.find(t => t.key === activeTab)!;

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <SectionTitle icon={<Store size={22} className="text-orange-600" />} separator>
          Mon activité indépendante
        </SectionTitle>

        {/* Onglets */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg mb-6">
          {TABS.map(t => (
            <button key={t.key} type="button"
              onClick={() => setActiveTab(t.key)}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                activeTab === t.key
                  ? 'bg-white text-orange-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        <p className="text-gray-500 text-sm mb-4">{tab.hint}</p>

        {entries.length === 0 && (
          <EmptyState message={`Aucune activité ${tab.label.toLowerCase()} ajoutée.`} />
        )}

        <div className="space-y-4">
          {entries.map(entry => (
            <div key={entry.id} className="p-4 border border-orange-200 rounded-lg bg-orange-50 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Description / raison sociale">
                    <input type="text" value={entry.description}
                      onChange={e => update(entry.id, { description: e.target.value })}
                      className={inputClass} placeholder="Nom ou description" />
                  </Field>
                  {isCouple(data) && (
                    <Field label="Pour qui ?">
                      <select value={entry.ownerId}
                        onChange={e => update(entry.id, { ownerId: e.target.value as 'contribuable' | 'conjoint' })}
                        className={selectClass}>
                        <option value="contribuable">Moi</option>
                        <option value="conjoint">Mon conjoint</option>
                      </select>
                    </Field>
                  )}
                  <AmountField label="Résultat net (bénéfice ou perte)"
                    hint="Mettre une valeur négative en cas de perte."
                    value={entry.resultatNet}
                    onChange={v => update(entry.id, { resultatNet: v })} />
                  <AmountField label="Report de pertes des années précédentes"
                    value={entry.reportPertes}
                    onChange={v => update(entry.id, { reportPertes: v })} />
                </div>
                <button onClick={() => remove(entry.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors pt-6">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <AddButton label={`+ Ajouter une activité ${tab.label.toLowerCase()}`} onClick={add} color="orange" />
        </div>
      </Card>
    </div>
  );
};
