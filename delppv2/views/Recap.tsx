import React from 'react';
import { FormData } from '../types';
import { Card, SectionTitle } from '../components/ui/Card';
import { BarChart3 } from 'lucide-react';

interface Props { data: FormData; }

const fmt = (n: number) => n.toLocaleString('fr-LU', { style: 'currency', currency: 'EUR' });

export const Recap: React.FC<Props> = ({ data }) => {
  const isCouple = ['MARRIED', 'PARTNER'].includes(data.contribuable.civilStatus);

  // Revenus salariés
  const salNetContrib = data.incomes
    .filter(i => i.type === 'SALARY' && i.ownerId === 'contribuable')
    .reduce((acc, i) => acc + Math.max(0, i.montantBrut - Math.max(i.fraisObtention, 540) - i.cotisationsSociales), 0);

  const salNetConjoint = data.incomes
    .filter(i => i.type === 'SALARY' && i.ownerId === 'conjoint')
    .reduce((acc, i) => acc + Math.max(0, i.montantBrut - Math.max(i.fraisObtention, 540) - i.cotisationsSociales), 0);

  const pensNetContrib = data.incomes
    .filter(i => i.type === 'PENSION' && i.ownerId === 'contribuable')
    .reduce((acc, i) => acc + Math.max(0, i.montantBrut - Math.max(i.fraisObtention, 300) - i.cotisationsSociales), 0);

  const pensNetConjoint = data.incomes
    .filter(i => i.type === 'PENSION' && i.ownerId === 'conjoint')
    .reduce((acc, i) => acc + Math.max(0, i.montantBrut - Math.max(i.fraisObtention, 300) - i.cotisationsSociales), 0);

  const indepNet = data.independants
    .reduce((acc, i) => acc + Math.max(0, i.resultatNet - i.reportPertes), 0);

  const totalRevenus = salNetContrib + salNetConjoint + pensNetContrib + pensNetConjoint + indepNet;

  // Dépenses
  const totalDepenses = data.depenses.reduce((acc, d) => acc + d.montant, 0);
  const totalCharges  = data.chargesExtra.reduce((acc, c) => acc + Math.max(0, c.montant - c.montantRembourse), 0);

  // Forfait DS minimum
  const forfaitDS = isCouple ? 960 : 480;
  const deductionDS = Math.max(forfaitDS, totalDepenses);

  const revenuImposable = Math.max(0, totalRevenus - deductionDS - totalCharges);

  const Row = ({ label, value, bold }: { label: string; value: number; bold?: boolean }) => (
    <div className={`flex justify-between py-2 border-b border-gray-100 last:border-0 ${bold ? 'font-semibold text-gray-800' : 'text-gray-600'}`}>
      <span className="text-sm">{label}</span>
      <span className={`text-sm font-mono ${bold ? 'text-blue-700 text-base' : ''}`}>{fmt(value)}</span>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <SectionTitle icon={<BarChart3 size={22} />} separator>
          Estimation de mon impôt
        </SectionTitle>
        <p className="text-gray-500 text-sm mb-6">
          Récapitulatif de votre situation fiscale pour l'année 2025.
          Cette estimation est indicative — le calcul exact sera effectué par l'ACD.
        </p>

        <div className="space-y-1">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Revenus</p>
          {salNetContrib > 0    && <Row label="Salaire net — Contribuable"    value={salNetContrib} />}
          {salNetConjoint > 0   && <Row label="Salaire net — Conjoint"        value={salNetConjoint} />}
          {pensNetContrib > 0   && <Row label="Pension nette — Contribuable"  value={pensNetContrib} />}
          {pensNetConjoint > 0  && <Row label="Pension nette — Conjoint"      value={pensNetConjoint} />}
          {indepNet > 0         && <Row label="Activité indépendante"          value={indepNet} />}
          <Row label="Total revenus nets" value={totalRevenus} bold />
        </div>

        <div className="mt-4 space-y-1">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Déductions</p>
          <Row label={`Dépenses spéciales (min forfait ${fmt(forfaitDS)})`} value={deductionDS} />
          {totalCharges > 0 && <Row label="Charges extraordinaires" value={totalCharges} />}
        </div>

        <div className="mt-6 pt-4 border-t-2 border-blue-200 bg-blue-50 rounded-lg p-4">
          <Row label="Revenu imposable estimé" value={revenuImposable} bold />
        </div>

        <p className="mt-4 text-xs text-gray-400 text-center">
          Le calcul de l'impôt au barème (tranches 2025) sera intégré dans une prochaine version.
        </p>
      </Card>
    </div>
  );
};
