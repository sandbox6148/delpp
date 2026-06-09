import React from 'react';
import { FormData, SectionSelection } from '../types';
import { Card, SectionTitle } from '../components/ui/Card';
import { CheckboxField } from '../components/ui/Field';
import { Settings } from 'lucide-react';

interface Props { data: FormData; updateData: (d: Partial<FormData>) => void; }

type Section = { key: keyof SectionSelection; label: string; hint?: string };

const REVENUS: Section[] = [
  { key: 'hasSalaries',     label: 'J\'ai touché un salaire (emploi salarié)',                         hint: 'Inclut les indemnités de chômage, maladie, maternité.' },
  { key: 'hasPensions',     label: 'Je perçois une pension ou une rente',                              hint: 'Pension de retraite, rente viagère, arrérages.' },
  { key: 'hasLocation',     label: 'Je possède un bien immobilier (loué ou occupé)',                   hint: 'Maison, appartement, terrain loué ou habitation propre.' },
  { key: 'hasCapitaux',     label: 'J\'ai des revenus de placements (intérêts, dividendes)',           hint: 'Revenus de comptes d\'épargne, actions, obligations.' },
  { key: 'hasIndependant',  label: 'J\'exerce une activité indépendante',                              hint: 'Commerce, agriculture, profession libérale (médecin, avocat…).' },
  { key: 'hasDiversIncomes',label: 'J\'ai des revenus divers (plus-values, etc.)',                     hint: 'Gains sur vente de biens, pensions alimentaires reçues.' },
];

const REDUCTIONS: { group: string; emoji: string; items: Section[] }[] = [
  {
    group: 'Assurances & prévoyance', emoji: '🛡️',
    items: [
      { key: 'hasAssurances',  label: 'Je paie des primes d\'assurance-vie, maladie, RC…' },
      { key: 'hasVieillesse',  label: 'Je cotise à un plan prévoyance-vieillesse (111bis)' },
      { key: 'hasRegimeComp',  label: 'J\'ai un régime complémentaire de pension (salarié ou indép.)' },
      { key: 'hasCotisPers',   label: 'J\'ai d\'autres cotisations personnelles déductibles' },
    ],
  },
  {
    group: 'Mon logement', emoji: '🏠',
    items: [
      { key: 'hasInterets',  label: 'Je paie des intérêts sur un emprunt immobilier' },
      { key: 'hasLogement',  label: 'J\'ai un contrat d\'épargne-logement' },
    ],
  },
  {
    group: 'Ma famille', emoji: '👨‍👩‍👧',
    items: [
      { key: 'hasGarde',       label: 'Je paie des frais de garde d\'enfants' },
      { key: 'hasDomesticite', label: 'J\'emploie une aide à domicile' },
      { key: 'hasRentes',      label: 'Je verse des pensions ou rentes alimentaires' },
      { key: 'hasEnfantsHM',   label: 'J\'ai des enfants qui ne vivent pas sous mon toit' },
    ],
  },
  {
    group: 'Ma santé', emoji: '❤️',
    items: [
      { key: 'hasInvalidite',    label: 'Moi ou un membre du ménage est en situation d\'invalidité' },
      { key: 'hasFraisMaladie',  label: 'J\'ai des frais médicaux importants non remboursés' },
      { key: 'hasRegimeDiet',    label: 'Je suis un régime diététique prescrit médicalement' },
      { key: 'hasPersNec',       label: 'J\'entretiens une personne nécessiteuse (hors ménage)' },
      { key: 'hasAutresCharges', label: 'J\'ai d\'autres charges extraordinaires' },
    ],
  },
  {
    group: 'Mes dons & cotisations', emoji: '🎁',
    items: [
      { key: 'hasLiberalites', label: 'J\'ai fait des dons à des organismes reconnus' },
      { key: 'hasCotisSoc',    label: 'Je paie des cotisations sociales obligatoires (indép., fonct.)' },
    ],
  },
  {
    group: 'Mes crédits & bonifications', emoji: '💶',
    items: [
      { key: 'hasCreditsImpot', label: 'Je demande un crédit d\'impôt (salarié / pensionné)' },
      { key: 'hasBoniChomeurs', label: 'J\'ai une bonification pour embauchage de chômeurs' },
      { key: 'hasCotisIndep',   label: 'Je suis indépendant affilié à la sécurité sociale' },
      { key: 'hasAbattExtra',   label: 'Je demande un abattement extra-professionnel' },
    ],
  },
];

export const Selection: React.FC<Props> = ({ data, updateData }) => {
  const toggle = (key: keyof SectionSelection, val: boolean) => {
    updateData({ selectedSections: { ...data.selectedSections, [key]: val } });
  };
  const sel = data.selectedSections;

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <SectionTitle icon={<Settings size={22} />} separator>
          Ce que j'ai eu en 2025
        </SectionTitle>
        <p className="text-gray-500 text-sm mb-5">
          Cochez tout ce qui s'applique à votre situation. Seules les rubriques cochées
          apparaîtront dans votre déclaration.
        </p>
        <div className="space-y-2">
          {REVENUS.map(({ key, label, hint }) => (
            <CheckboxField key={key} label={label} hint={hint}
              checked={sel[key]}
              onChange={v => toggle(key, v)} />
          ))}
        </div>
      </Card>

      <Card>
        <SectionTitle separator>Ce qui peut réduire mon impôt</SectionTitle>
        <p className="text-gray-500 text-sm mb-5">
          Cochez tout ce que vous avez payé ou dont vous bénéficiez.
        </p>
        <div className="space-y-6">
          {REDUCTIONS.map(({ group, emoji, items }) => (
            <div key={group}>
              <p className="text-sm font-semibold text-gray-600 mb-2">{emoji} {group}</p>
              <div className="space-y-2">
                {items.map(({ key, label, hint }) => (
                  <CheckboxField key={key} label={label} hint={hint}
                    checked={sel[key]}
                    onChange={v => toggle(key, v)} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
