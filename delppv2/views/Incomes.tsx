import React from 'react';
import { FormData, IncomeEntry } from '../types';
import { Card, SectionTitle } from '../components/ui/Card';
import { Field, AmountField, inputClass, selectClass } from '../components/ui/Field';
import { AddButton, EmptyState } from '../components/ui/AddButton';
import { Briefcase, Landmark, Trash2 } from 'lucide-react';

interface Props {
  data: FormData;
  updateData: (d: Partial<FormData>) => void;
  section: 'SALARY' | 'PENSION';
}

const LABELS = {
  SALARY:      { title: 'Mon salaire',           icon: Briefcase, addLabel: '+ Ajouter un employeur',           emploLabel: 'Employeur', forfait: 540 },
  PENSION:     { title: 'Ma pension / retraite',  icon: Landmark,  addLabel: '+ Ajouter une caisse de retraite', emploLabel: 'Caisse de retraite / payeur', forfait: 300 },
};

const isCouple = (data: FormData) => ['MARRIED', 'PARTNER'].includes(data.contribuable.civilStatus);

export const Incomes: React.FC<Props> = ({ data, updateData, section }) => {
  const cfg = LABELS[section];
  const Icon = cfg.icon;
  const entries = data.incomes.filter(i => i.type === section);

  const add = () => {
    const e: IncomeEntry = {
      id: Math.random().toString(36).slice(2),
      type: section,
      ownerId: 'contribuable',
      employeur: '',
      montantBrut: 0,
      fraisObtention: 0,
      impotRetenu: 0,
      cotisationsSociales: 0,
    };
    updateData({ incomes: [...data.incomes, e] });
  };

  const update = (id: string, fields: Partial<IncomeEntry>) =>
    updateData({ incomes: data.incomes.map(i => i.id === id ? { ...i, ...fields } : i) });

  const remove = (id: string) =>
    updateData({ incomes: data.incomes.filter(i => i.id !== id) });

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <SectionTitle icon={<Icon size={22} />} separator>{cfg.title}</SectionTitle>
        <p className="text-gray-500 text-sm mb-5">
          Ajoutez une entrée par {section === 'SALARY' ? 'employeur' : 'caisse de retraite'}.
          Le forfait minimum de frais d'obtention est de <strong>{cfg.forfait} €</strong>.
        </p>

        {entries.length === 0 && (
          <EmptyState message={`Aucun ${section === 'SALARY' ? 'employeur' : 'source de pension'} ajouté.`} />
        )}

        <div className="space-y-4">
          {entries.map(entry => (
            <div key={entry.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-4">
              <div className="flex items-center justify-between">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 mr-4">
                  <Field label={cfg.emploLabel}>
                    <input type="text" value={entry.employeur}
                      onChange={e => update(entry.id, { employeur: e.target.value })}
                      className={inputClass} placeholder="Nom de l'employeur / caisse" />
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
                </div>
                <button onClick={() => remove(entry.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1">
                  <Trash2 size={18} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AmountField label="Montant brut annuel" value={entry.montantBrut}
                  onChange={v => update(entry.id, { montantBrut: v })} />
                <AmountField
                  label={`Frais d'obtention (min ${cfg.forfait} €)`}
                  hint={`Si vous laissez 0, le forfait de ${cfg.forfait} € sera appliqué automatiquement.`}
                  value={entry.fraisObtention}
                  onChange={v => update(entry.id, { fraisObtention: v })} />
                <AmountField label="Impôt retenu à la source" value={entry.impotRetenu}
                  onChange={v => update(entry.id, { impotRetenu: v })} />
                <AmountField label="Cotisations sociales (employé)" value={entry.cotisationsSociales}
                  onChange={v => update(entry.id, { cotisationsSociales: v })} />
              </div>
              <div className="text-sm text-blue-700 bg-blue-50 px-3 py-2 rounded">
                Revenu net estimé :{' '}
                <strong>
                  {Math.max(0, entry.montantBrut - Math.max(entry.fraisObtention, cfg.forfait) - entry.cotisationsSociales).toLocaleString('fr-LU', { style: 'currency', currency: 'EUR' })}
                </strong>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <AddButton label={cfg.addLabel} onClick={add} />
        </div>
      </Card>
    </div>
  );
};
