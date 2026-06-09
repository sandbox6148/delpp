import React from 'react';
import { FormData, DiversesDemandes as DDType } from '../types';
import { CreditCard, Leaf, Accessibility, Clock, Info } from 'lucide-react';

interface Props {
  data: FormData;
  updateData: (data: Partial<FormData>) => void;
}

export const DiversesDemandes: React.FC<Props> = ({ data, updateData }) => {
  const dd = data.diversesDemandes;

  const updateDD = (field: keyof DDType, value: string | number | boolean) => {
    updateData({ diversesDemandes: { ...dd, [field]: value } });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="border-b pb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <CreditCard className="text-gray-600" size={24} />
          Page 18 — Diverses Demandes (DD)
        </h2>
        <p className="text-gray-500 mt-1 text-sm">
          Remboursements, crédits d'impôt spécifiques, demandes particulières.
        </p>
      </div>

      {/* 1. Remboursement */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <CreditCard size={18} className="text-blue-600" />
          Remboursement d'un excédent d'impôt (Case 1801)
        </h3>

        <label className="flex items-start gap-3 p-4 rounded border border-gray-200 hover:bg-gray-50 cursor-pointer mb-4">
          <input
            type="checkbox"
            checked={dd.requestRefund}
            onChange={(e) => updateDD('requestRefund', e.target.checked)}
            className="mt-1 w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">
            <strong>Je demande le remboursement de tout excédent d'impôt sur un compte bancaire</strong><br />
            <span className="text-gray-500 text-xs">Si non coché, l'excédent sera imputé sur les acomptes provisionnels futurs.</span>
          </span>
        </label>

        {dd.requestRefund && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 pl-4 border-l-2 border-blue-200">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">IBAN du compte à créditer</label>
              <input
                type="text"
                value={dd.refundIban}
                onChange={(e) => updateDD('refundIban', e.target.value.toUpperCase())}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-blue-500 font-mono"
                placeholder="LU12 3456 7890 1234 5678"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Titulaire du compte</label>
              <input
                type="text"
                value={dd.refundHolder}
                onChange={(e) => updateDD('refundHolder', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-blue-500"
                placeholder="Nom du titulaire"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Banque</label>
              <input
                type="text"
                value={dd.refundBankName}
                onChange={(e) => updateDD('refundBankName', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-blue-500"
                placeholder="ex: BGL, ING, POST Luxembourg..."
              />
            </div>
          </div>
        )}
      </div>

      {/* 2. Crédit Eco-Bonus */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Leaf size={18} className="text-green-600" />
          Crédit d'impôt investissements économiseurs d'énergie (Case 1821)
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Crédit d'impôt pour investissements dans des mesures d'économie d'énergie (isolation, pompe à chaleur, panneaux solaires...) dans votre résidence principale au Luxembourg.
        </p>

        <label className="flex items-start gap-3 p-4 rounded border border-gray-200 hover:bg-gray-50 cursor-pointer mb-4">
          <input
            type="checkbox"
            checked={dd.hasEcoBonus}
            onChange={(e) => updateDD('hasEcoBonus', e.target.checked)}
            className="mt-1 w-4 h-4 rounded text-green-600 focus:ring-green-500"
          />
          <span className="text-sm text-gray-700">
            <strong>J'ai réalisé des investissements économiseurs d'énergie en 2024</strong>
          </span>
        </label>

        {dd.hasEcoBonus && (
          <div className="pl-4 border-l-2 border-green-200">
            <label className="block text-sm font-medium text-gray-700 mb-1">Montant total des investissements éligibles</label>
            <div className="relative max-w-xs">
              <input
                type="number"
                value={dd.ecoBonusAmount}
                onChange={(e) => updateDD('ecoBonusAmount', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-green-500 pr-8"
              />
              <span className="absolute right-3 top-2 text-gray-400">€</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">Le crédit d'impôt est de 50% des investissements, plafonné à 10 000 €/an.</p>
          </div>
        )}
      </div>

      {/* 3. Abattements invalidité */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Accessibility size={18} className="text-purple-600" />
          Abattement pour invalidité (Cases 1803–1806)
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Un abattement forfaitaire est accordé aux personnes présentant un taux d'invalidité ou d'incapacité de travail reconnu (doit être certifié par une autorité compétente).
        </p>

        <div className="space-y-4">
          <label className="flex items-start gap-3 p-4 rounded border border-gray-200 hover:bg-gray-50 cursor-pointer">
            <input
              type="checkbox"
              checked={dd.hasHandicap}
              onChange={(e) => updateDD('hasHandicap', e.target.checked)}
              className="mt-1 w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
            />
            <span className="text-sm text-gray-700">
              <strong>Le contribuable présente une invalidité / incapacité de travail reconnue</strong>
            </span>
          </label>

          {dd.hasHandicap && (
            <div className="pl-4 border-l-2 border-purple-200">
              <label className="block text-sm font-medium text-gray-700 mb-1">Taux d'invalidité (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={dd.handicapRate}
                onChange={(e) => updateDD('handicapRate', parseFloat(e.target.value) || 0)}
                className="w-32 px-4 py-2 border border-gray-300 rounded focus:ring-purple-500"
              />
            </div>
          )}

          <label className="flex items-start gap-3 p-4 rounded border border-gray-200 hover:bg-gray-50 cursor-pointer">
            <input
              type="checkbox"
              checked={dd.hasHandicapConjoint}
              onChange={(e) => updateDD('hasHandicapConjoint', e.target.checked)}
              className="mt-1 w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
            />
            <span className="text-sm text-gray-700">
              <strong>Le conjoint / partenaire présente une invalidité / incapacité de travail reconnue</strong>
            </span>
          </label>

          {dd.hasHandicapConjoint && (
            <div className="pl-4 border-l-2 border-purple-200">
              <label className="block text-sm font-medium text-gray-700 mb-1">Taux d'invalidité conjoint (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={dd.handicapRateConjoint}
                onChange={(e) => updateDD('handicapRateConjoint', parseFloat(e.target.value) || 0)}
                className="w-32 px-4 py-2 border border-gray-300 rounded focus:ring-purple-500"
              />
            </div>
          )}
        </div>
      </div>

      {/* 4. Autres demandes */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Info size={18} className="text-gray-500" />
          Autres demandes
        </h3>

        <div className="space-y-3">
          <label className="flex items-start gap-3 p-4 rounded border border-gray-200 hover:bg-gray-50 cursor-pointer">
            <input
              type="checkbox"
              checked={dd.hasSeniorCredit}
              onChange={(e) => updateDD('hasSeniorCredit', e.target.checked)}
              className="mt-1 w-4 h-4 rounded text-gray-600"
            />
            <span className="text-sm text-gray-700">
              <strong>Crédit d'impôt personnes âgées — Case 1818</strong><br />
              <span className="text-gray-500 text-xs">Pour les contribuables âgés de 65 ans ou plus au 1er janvier 2024.</span>
            </span>
          </label>

          <label className="flex items-start gap-3 p-4 rounded border border-gray-200 hover:bg-gray-50 cursor-pointer">
            <input
              type="checkbox"
              checked={dd.hasWorkerCredit}
              onChange={(e) => updateDD('hasWorkerCredit', e.target.checked)}
              className="mt-1 w-4 h-4 rounded text-gray-600"
            />
            <span className="text-sm text-gray-700">
              <strong>Crédit d'impôt salarié (CIS) — Case 1801</strong><br />
              <span className="text-gray-500 text-xs">Crédit accordé automatiquement aux salariés ; à cocher si vous souhaitez une vérification spécifique par l'ACD.</span>
            </span>
          </label>

          <label className="flex items-start gap-3 p-4 rounded border border-gray-200 hover:bg-gray-50 cursor-pointer">
            <input
              type="checkbox"
              checked={dd.requestExtension}
              onChange={(e) => updateDD('requestExtension', e.target.checked)}
              className="mt-1 w-4 h-4 rounded text-gray-600"
            />
            <span className="text-sm text-gray-700 flex items-start gap-2">
              <Clock size={16} className="text-amber-500 shrink-0 mt-0.5" />
              <span>
                <strong>Demande de prorogation du délai de dépôt — Case 213</strong><br />
                <span className="text-gray-500 text-xs">Si vous ne pouvez pas respecter la date limite du 31 décembre 2025, vous pouvez demander une extension de délai (à justifier).</span>
              </span>
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};
