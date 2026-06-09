import React from 'react';
import { FormData } from '../types';
import { Card, SectionTitle } from '../components/ui/Card';
import { CheckboxField, Field, inputClass } from '../components/ui/Field';
import { HelpCircle } from 'lucide-react';

interface Props { data: FormData; updateData: (d: Partial<FormData>) => void; }

export const Eligibilite: React.FC<Props> = ({ data, updateData }) => (
  <div className="space-y-6 animate-fade-in">
    <Card>
      <SectionTitle icon={<HelpCircle size={22} />} separator>
        Quelques questions pour démarrer
      </SectionTitle>
      <p className="text-gray-500 text-sm mb-6">
        Ces informations permettent de vérifier que cet assistant est adapté à votre situation
        et de préparer votre dossier.
      </p>

      <div className="space-y-3">
        <CheckboxField
          label="Je déclare pour mon ménage (pas pour une entreprise)"
          checked={data.declarePourMenage}
          onChange={v => updateData({ declarePourMenage: v })}
        />
        <CheckboxField
          label="J'ai été marié(e) au cours de l'année 2025"
          checked={data.marieDansAnnee}
          onChange={v => updateData({ marieDansAnnee: v })}
        />
        <CheckboxField
          label="J'ai été en partenariat enregistré au cours de l'année 2025"
          checked={data.partenariatDansAnnee}
          onChange={v => updateData({ partenariatDansAnnee: v })}
        />
        <CheckboxField
          label="Je demande une imposition individuelle"
          hint="À cocher si vous souhaitez être imposé séparément de votre conjoint/partenaire."
          checked={data.demandeImpositionIndividuelle}
          onChange={v => updateData({ demandeImpositionIndividuelle: v })}
        />
      </div>
    </Card>

    <Card>
      <h3 className="text-base font-semibold text-gray-700 mb-4">Informations de dossier</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Numéro de dossier" hint="Si vous avez déjà soumis une déclaration précédemment.">
          <input
            type="text"
            value={data.noDossier}
            onChange={e => updateData({ noDossier: e.target.value })}
            className={inputClass}
            placeholder="Ex : 2025-XXXXX"
          />
        </Field>
        <Field label="Bureau d'imposition">
          <select
            value={data.bureauImposition}
            onChange={e => updateData({ bureauImposition: e.target.value })}
            className="block w-full px-4 py-2 border border-gray-300 rounded bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="">— Sélectionner —</option>
            <option>Luxembourg 1</option>
            <option>Luxembourg 2</option>
            <option>Esch-sur-Alzette</option>
            <option>Diekirch</option>
            <option>Grevenmacher</option>
            <option>Non-résidents</option>
          </select>
        </Field>
      </div>
    </Card>
  </div>
);
