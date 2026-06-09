import React from 'react';
import { FormData, SectionSelection } from '../types';
import {
  Briefcase, Landmark, Coins, Building, Shield, PiggyBank, Heart,
  Baby, Home, Percent, UserCheck, Store, Wheat, Stethoscope,
  TrendingUp, Zap, Receipt, Activity
} from 'lucide-react';

interface Props {
  data: FormData;
  updateData: (data: Partial<FormData>) => void;
}

export const Selection: React.FC<Props> = ({ data, updateData }) => {
  const toggleSection = (key: keyof SectionSelection) => {
    updateData({
      selectedSections: {
        ...data.selectedSections,
        [key]: !data.selectedSections[key]
      }
    });
  };

  const renderOption = (
    key: keyof SectionSelection,
    label: string,
    description: string,
    Icon: React.ElementType,
    colorClass: string
  ) => {
    const isSelected = data.selectedSections[key];
    return (
      <button
        onClick={() => toggleSection(key)}
        className={`w-full flex items-start gap-4 p-4 rounded-lg border-2 transition-all text-left ${
          isSelected
            ? 'border-blue-500 bg-blue-50 shadow-sm'
            : 'border-gray-200 hover:border-gray-300 bg-white'
        }`}
      >
        <div className={`p-3 rounded-full ${isSelected ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
          <Icon size={24} className={isSelected ? colorClass : ''} />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <h3 className={`font-semibold ${isSelected ? 'text-gray-900' : 'text-gray-500'}`}>{label}</h3>
            {isSelected && <span className="text-blue-600 text-xs font-bold px-2 py-1 bg-blue-100 rounded-full">Actif</span>}
          </div>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </button>
    );
  };

  const SectionTitle = ({ label }: { label: string }) => (
    <div className="md:col-span-2 text-sm font-semibold text-gray-500 uppercase tracking-wider mt-6 mb-2 border-b pb-1">
      {label}
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Que souhaitez-vous déclarer ?</h2>
        <p className="text-gray-600 mb-8">
          Sélectionnez les catégories qui correspondent à votre situation pour personnaliser votre formulaire.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Revenus salariés */}
          <SectionTitle label="Revenus salariés et de remplacement" />
          {renderOption('hasSalaries', 'Salaires (S)', 'Revenus d\'emploi salarié (fiche de retenue).', Briefcase, 'text-blue-600')}
          {renderOption('hasPensions', 'Pensions / Rentes (P)', 'Pensions de retraite, rentes d\'invalidité.', Landmark, 'text-blue-600')}

          {/* Revenus indépendants */}
          <SectionTitle label="Revenus d'activité indépendante" />
          {renderOption('hasCommercial', 'Bénéfice Commercial (C)', 'Commerce, artisanat, industrie exercés à titre indépendant.', Store, 'text-orange-600')}
          {renderOption('hasAgricole', 'Bénéfice Agricole / Forestier (A)', 'Exploitation agricole, sylvicole ou viticole.', Wheat, 'text-green-700')}
          {renderOption('hasLiberal', 'Profession Libérale (I)', 'Médecin, avocat, architecte, consultant indépendant...', Stethoscope, 'text-teal-600')}

          {/* Revenus patrimoniaux */}
          <SectionTitle label="Revenus patrimoniaux" />
          {renderOption('hasCapitals', 'Capitaux Mobiliers (CM)', 'Dividendes, intérêts non soumis à RELIBI.', Coins, 'text-yellow-600')}
          {renderOption('hasRentals', 'Biens Immobiliers (L)', 'Revenus locatifs, intérêts résidence principale.', Building, 'text-indigo-600')}

          {/* Revenus divers et extraordinaires */}
          <SectionTitle label="Revenus divers et exceptionnels" />
          {renderOption('hasDiversIncomes', 'Revenus Divers (D)', 'Plus-values immobilières, pensions alimentaires reçues, gains spéculatifs.', TrendingUp, 'text-cyan-600')}
          {renderOption('hasExtraordinaryIncomes', 'Revenus Extraordinaires (EX)', 'Indemnités de licenciement, plus-value cession d\'entreprise, capital 111bis.', Zap, 'text-yellow-500')}

          {/* Dépenses spéciales */}
          <SectionTitle label="Dépenses Spéciales (DS)" />
          {renderOption('hasDebitInterests', 'Intérêts Débiteurs', 'Prêts personnels, cartes de crédit (hors immobilier).', Percent, 'text-green-600')}
          {renderOption('hasInsurances', 'Primes d\'Assurances', 'RC Auto, RC Vie Privée, Mutuelle complémentaire.', Shield, 'text-green-600')}
          {renderOption('hasPensionPlans', 'Prévoyance-Vieillesse (111bis)', 'Contrat de prévoyance (Art 111bis).', PiggyBank, 'text-purple-600')}
          {renderOption('hasHomeSavings', 'Épargne Logement (111)', 'Cotisations Bausparkasse (Art 111).', Home, 'text-purple-600')}
          {renderOption('hasDonations', 'Libéralités (Dons)', 'Dons aux organismes reconnus d\'utilité publique.', Heart, 'text-red-500')}
          {renderOption('hasAlimony', 'Rentes alimentaires / Syndicat', 'Pensions alimentaires versées, cotisations syndicales, intérêts prêt d\'études.', Receipt, 'text-rose-500')}

          {/* Abattements */}
          <SectionTitle label="Abattements — Charges Extraordinaires (CE)" />
          {renderOption('hasChildcare', 'Garde d\'enfants', 'Crèches, foyers de jour, nourrices.', Baby, 'text-pink-600')}
          {renderOption('hasDomesticHelp', 'Services Domestiques', 'Femme de ménage, aides à domicile déclarées au CCSS.', UserCheck, 'text-pink-600')}
          {renderOption('hasInvalidity', 'Frais d\'invalidité / Maladie grave', 'Frais extraordinaires liés à une invalidité ou maladie grave reconnue.', Activity, 'text-red-500')}

        </div>
      </div>
    </div>
  );
};
