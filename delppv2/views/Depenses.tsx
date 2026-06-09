import React from 'react';
import { FormData, DepenseEntry, DepenseType } from '../types';
import { Card, SectionTitle } from '../components/ui/Card';
import { Field, AmountField, inputClass, selectClass } from '../components/ui/Field';
import { AddButton, EmptyState } from '../components/ui/AddButton';
import { Trash2 } from 'lucide-react';
import { Shield, Home, PiggyBank, Building2, Receipt, Award, Handshake } from 'lucide-react';

interface Config {
  title: string;
  icon: React.ElementType;
  iconColor: string;
  addLabel: string;
  hint: string;
  color: 'blue' | 'green' | 'purple';
}

const CONFIGS: Record<DepenseType, Config> = {
  ASSURANCE:          { title: 'Mes assurances',             icon: Shield,    iconColor: 'text-blue-600',   addLabel: '+ Ajouter une assurance',              hint: 'Assurance-vie, RC, maladie complémentaire… — D0870', color: 'blue' },
  VIEILLESSE_111BIS:  { title: 'Prévoyance-vieillesse (111bis)', icon: PiggyBank, iconColor: 'text-purple-600', addLabel: '+ Ajouter un plan prévoyance',         hint: 'Cotisations à un contrat de prévoyance-vieillesse agréé — D1060. Plafond 3 200 €/pers.', color: 'purple' },
  REGIME_COMP_SAL:    { title: 'Retraite complémentaire (salarié)', icon: Award, iconColor: 'text-blue-600', addLabel: '+ Ajouter',                             hint: 'Cotisations à un régime complémentaire pension salarié — D1680', color: 'blue' },
  REGIME_COMP_IND:    { title: 'Retraite complémentaire (indép.)',  icon: Award, iconColor: 'text-orange-600', addLabel: '+ Ajouter',                           hint: 'Régime complémentaire pension indépendant — D2000', color: 'blue' },
  COTIS_PERS:         { title: 'Cotisations personnelles',   icon: Handshake, iconColor: 'text-blue-600',   addLabel: '+ Ajouter',                              hint: 'Cotisations personnelles déductibles', color: 'blue' },
  INTERETS:           { title: 'Intérêts d\'emprunt',         icon: Home,      iconColor: 'text-green-600',  addLabel: '+ Ajouter un crédit',                  hint: 'Intérêts débiteurs sur emprunt immobilier', color: 'green' },
  EPARGNE_LOGEMENT:   { title: 'Épargne-logement',           icon: Building2, iconColor: 'text-green-600',  addLabel: '+ Ajouter un contrat épargne-logement', hint: 'Contrats d\'épargne-logement agréés — D1300. Plafond 1 344 € × membres du ménage.', color: 'green' },
  RENTE_ALIM:         { title: 'Pensions / rentes alimentaires versées', icon: Receipt, iconColor: 'text-pink-600', addLabel: '+ Ajouter une rente versée', hint: 'Arrérages de rentes et pensions alimentaires versées — D0020', color: 'blue' },
  LIBERALITE:         { title: 'Dons / libéralités',         icon: Shield,    iconColor: 'text-green-600',  addLabel: '+ Ajouter un don',                      hint: 'Dons à des organismes agréés. Minimum 120 €, plafond 20 % du revenu net.', color: 'green' },
  COTIS_SOC_OBL:      { title: 'Cotisations sociales obligatoires', icon: Handshake, iconColor: 'text-blue-600', addLabel: '+ Ajouter', hint: 'Cotisations sociales obligatoires indépendants, fonctionnaires… — D5980', color: 'blue' },
};

interface Props {
  data: FormData;
  updateData: (d: Partial<FormData>) => void;
  type: DepenseType;
}

const isCouple = (data: FormData) => ['MARRIED', 'PARTNER'].includes(data.contribuable.civilStatus);

export const Depenses: React.FC<Props> = ({ data, updateData, type }) => {
  const cfg = CONFIGS[type];
  const Icon = cfg.icon;
  const entries = data.depenses.filter(d => d.type === type);

  const add = () => {
    const e: DepenseEntry = {
      id: Math.random().toString(36).slice(2),
      type,
      ownerId: 'contribuable',
      organisme: '',
      montant: 0,
    };
    updateData({ depenses: [...data.depenses, e] });
  };

  const update = (id: string, fields: Partial<DepenseEntry>) =>
    updateData({ depenses: data.depenses.map(e => e.id === id ? { ...e, ...fields } : e) });

  const remove = (id: string) =>
    updateData({ depenses: data.depenses.filter(e => e.id !== id) });

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <SectionTitle icon={<Icon size={22} className={cfg.iconColor} />} separator>
          {cfg.title}
        </SectionTitle>
        <p className="text-gray-500 text-sm mb-5">{cfg.hint}</p>

        {entries.length === 0 && <EmptyState message="Aucune entrée ajoutée." />}

        <div className="space-y-4">
          {entries.map(entry => (
            <div key={entry.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <div className="flex items-start gap-4">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Organisme / bénéficiaire">
                    <input type="text" value={entry.organisme}
                      onChange={e => update(entry.id, { organisme: e.target.value })}
                      className={inputClass} placeholder="Nom" />
                  </Field>
                  {isCouple(data) && (
                    <Field label="Pour qui ?">
                      <select value={entry.ownerId}
                        onChange={e => update(entry.id, { ownerId: e.target.value as any })}
                        className={selectClass}>
                        <option value="contribuable">Moi</option>
                        <option value="conjoint">Mon conjoint</option>
                        <option value="commun">Commun</option>
                      </select>
                    </Field>
                  )}
                  <AmountField label="Montant annuel" value={entry.montant}
                    onChange={v => update(entry.id, { montant: v })} />
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
          <AddButton label={cfg.addLabel} onClick={add} color={cfg.color} />
        </div>
      </Card>
    </div>
  );
};
