import React from 'react';
import { TaxStep, CivilStatus, SectionSelection } from '../types';
import {
  User, Briefcase, Landmark, Coins, Building, Shield, PiggyBank, Heart,
  Baby, CheckCircle, Users, Settings, Home, Percent, UserCheck, LayoutDashboard,
  Store, Wheat, Stethoscope, TrendingUp, Zap, Receipt, Activity, Scale,
  CreditCard
} from 'lucide-react';

interface SidebarProps {
  currentStep: TaxStep;
  onStepClick: (step: TaxStep) => void;
  civilStatus: CivilStatus;
  selection: SectionSelection;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentStep, onStepClick, civilStatus, selection }) => {
  const isCouple = [CivilStatus.MARRIED, CivilStatus.PARTNER].includes(civilStatus);

  const signaletiqueSteps = [
    { id: TaxStep.SITUATION_CONTRIBUABLE, label: 'Contribuable', icon: User },
    ...(isCouple ? [
      { id: TaxStep.SITUATION_CONJOINT, label: 'Conjoint', icon: Users },
      { id: TaxStep.OPTIONS, label: 'Options imposition', icon: Scale },
    ] : []),
    { id: TaxStep.ENFANTS, label: 'Enfants', icon: Baby },
    { id: TaxStep.SELECTION, label: 'Sélection', icon: Settings },
  ];

  const incomeSteps = [
    ...(selection.hasSalaries ? [{ id: TaxStep.SALAIRES, label: 'Salaires (S)', icon: Briefcase }] : []),
    ...(selection.hasPensions ? [{ id: TaxStep.PENSIONS, label: 'Pensions (P)', icon: Landmark }] : []),
    ...(selection.hasCommercial ? [{ id: TaxStep.COMMERCIAUX, label: 'Bénéfice Comm. (C)', icon: Store }] : []),
    ...(selection.hasAgricole ? [{ id: TaxStep.AGRICOLE, label: 'Bénéfice Agric. (A)', icon: Wheat }] : []),
    ...(selection.hasLiberal ? [{ id: TaxStep.LIBERAL, label: 'Prof. Libérale (I)', icon: Stethoscope }] : []),
    ...(selection.hasCapitals ? [{ id: TaxStep.CAPITAUX, label: 'Capitaux (CM)', icon: Coins }] : []),
    ...(selection.hasRentals ? [{ id: TaxStep.LOCATION, label: 'Location (L)', icon: Building }] : []),
    ...(selection.hasDiversIncomes ? [{ id: TaxStep.DIVERS, label: 'Revenus Divers (D)', icon: TrendingUp }] : []),
    ...(selection.hasExtraordinaryIncomes ? [{ id: TaxStep.EXTRAORDINAIRES, label: 'Revenus Extra. (EX)', icon: Zap }] : []),
  ];

  const expenseSteps = [
    ...(selection.hasDebitInterests ? [{ id: TaxStep.DS_INTERETS, label: 'Intérêts débiteurs', icon: Percent }] : []),
    ...(selection.hasInsurances ? [{ id: TaxStep.DS_ASSURANCES, label: 'Assurances', icon: Shield }] : []),
    ...(selection.hasPensionPlans ? [{ id: TaxStep.DS_VIEILLESSE, label: 'Prévoyance (111bis)', icon: PiggyBank }] : []),
    ...(selection.hasHomeSavings ? [{ id: TaxStep.DS_LOGEMENT, label: 'Épargne Logement', icon: Home }] : []),
    ...(selection.hasDonations ? [{ id: TaxStep.DS_LIBERALITES, label: 'Libéralités', icon: Heart }] : []),
    ...(selection.hasAlimony ? [{ id: TaxStep.DS_RENTES, label: 'Rentes aliment.', icon: Receipt }] : []),
  ];

  const abattementSteps = [
    ...(selection.hasChildcare ? [{ id: TaxStep.CE_GARDE, label: 'Garde d\'enfants', icon: Baby }] : []),
    ...(selection.hasDomesticHelp ? [{ id: TaxStep.CE_DOMESTICITE, label: 'Services domestiques', icon: UserCheck }] : []),
    ...(selection.hasInvalidity ? [{ id: TaxStep.CE_INVALIDITE, label: 'Frais invalidité', icon: Activity }] : []),
  ];

  const finalisationSteps = [
    { id: TaxStep.DIVERSES_DEMANDES, label: 'Diverses Demandes', icon: CreditCard },
    { id: TaxStep.RECAP, label: 'Revenu imposable', icon: CheckCircle },
  ];

  const groups = [
    { title: 'Introduction', steps: [{ id: TaxStep.WELCOME, label: 'Accueil / Guide', icon: LayoutDashboard }] },
    { title: 'Signalétique', steps: signaletiqueSteps },
    { title: 'Revenus', steps: incomeSteps },
    { title: 'Dépenses Spéciales', steps: expenseSteps },
    { title: 'Abattements (CE)', steps: abattementSteps },
    { title: 'Finalisation', steps: finalisationSteps },
  ];

  return (
    <nav className="w-64 bg-white border-r border-gray-200 h-[calc(100vh-64px)] overflow-y-auto flex-shrink-0 hidden md:block">
      <div className="p-4 space-y-6">
        {groups.map((group, groupIdx) => (
          group.steps.length > 0 && (
            <div key={groupIdx}>
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                {group.title}
              </h3>
              <div className="space-y-1">
                {group.steps.map((step) => {
                  const isActive = currentStep === step.id;
                  const Icon = step.icon;
                  return (
                    <button
                      key={step.id}
                      onClick={() => onStepClick(step.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon size={18} className={isActive ? 'text-blue-600' : 'text-gray-400'} />
                      {step.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )
        ))}
      </div>
    </nav>
  );
};
