import React from 'react';
import { TaxStep, CivilStatus, SectionSelection, FilledBy } from '../types';
import {
  LayoutDashboard, UserCheck, Users, Scale, Baby, Settings,
  Briefcase, Landmark, Building2, Coins, Store, TrendingUp,
  Shield, PiggyBank, Home, Repeat, Heart, Baby as BabyIcon,
  Receipt, Users2, Activity, Thermometer, Stethoscope, HelpCircle,
  Gift, Handshake, CreditCard, Award, UserCog,
  BarChart3, Paperclip, CheckCircle, ChevronDown, ChevronRight,
  Menu
} from 'lucide-react';

interface SidebarProps {
  currentStep: TaxStep;
  onStepClick: (step: TaxStep) => void;
  civilStatus: CivilStatus;
  selection: SectionSelection;
  filledBy: FilledBy;
  canPrefill: boolean;
}

interface StepItem {
  id: TaxStep;
  label: string;
  icon: React.ElementType;
}

interface StepGroup {
  title: string;
  emoji?: string;
  steps?: StepItem[];
  subGroups?: { title: string; emoji: string; steps: StepItem[] }[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentStep, onStepClick, civilStatus, selection, filledBy, canPrefill
}) => {
  const isCouple = [CivilStatus.MARRIED, CivilStatus.PARTNER].includes(civilStatus);
  const sel = selection;

  const groups: StepGroup[] = [
    {
      title: 'Bienvenue',
      steps: [
        { id: TaxStep.WELCOME,        label: 'Accueil',                    icon: LayoutDashboard },
        { id: TaxStep.QUI_REMPLIT,    label: 'Qui remplit ?',              icon: UserCog },
        { id: TaxStep.ELIGIBILITE,    label: 'Quelques questions',         icon: HelpCircle },
        ...(canPrefill ? [{ id: TaxStep.PREREMPLISSAGE, label: 'Préremplissage', icon: Repeat } as StepItem] : []),
      ],
    },
    {
      title: 'Ma situation',
      steps: [
        { id: TaxStep.SITUATION_CONTRIBUABLE, label: 'Moi',                icon: UserCheck },
        ...(isCouple ? [
          { id: TaxStep.SITUATION_CONJOINT, label: 'Mon conjoint',         icon: Users } as StepItem,
          { id: TaxStep.OPTIONS,            label: 'Notre imposition',     icon: Scale } as StepItem,
        ] : []),
        { id: TaxStep.ENFANTS,              label: 'Mes enfants',          icon: Baby },
      ],
    },
    {
      title: 'Mes revenus',
      steps: [
        { id: TaxStep.SELECTION,    label: 'Ce que j\'ai eu',              icon: Settings },
        ...(sel.hasSalaries      ? [{ id: TaxStep.SALAIRES,    label: 'Mon salaire',               icon: Briefcase }   as StepItem] : []),
        ...(sel.hasPensions      ? [{ id: TaxStep.PENSIONS,    label: 'Ma pension / retraite',     icon: Landmark }    as StepItem] : []),
        ...(sel.hasLocation      ? [{ id: TaxStep.LOCATION,    label: 'Mes loyers',                icon: Building2 }   as StepItem] : []),
        ...(sel.hasCapitaux      ? [{ id: TaxStep.CAPITAUX,    label: 'Mes placements',            icon: Coins }       as StepItem] : []),
        ...(sel.hasIndependant   ? [{ id: TaxStep.INDEPENDANT, label: 'Mon activité indépendante', icon: Store }       as StepItem] : []),
        ...(sel.hasDiversIncomes ? [{ id: TaxStep.DIVERS,      label: 'Autres revenus',            icon: TrendingUp }  as StepItem] : []),
      ],
    },
    {
      title: 'Ce qui réduit mon impôt',
      subGroups: [
        {
          title: 'Assurances & prévoyance', emoji: '🛡️',
          steps: [
            ...(sel.hasAssurances  ? [{ id: TaxStep.DS_ASSURANCES,  label: 'Mes assurances',          icon: Shield }     as StepItem] : []),
            ...(sel.hasVieillesse  ? [{ id: TaxStep.DS_VIEILLESSE,  label: 'Prévoyance-vieillesse',   icon: PiggyBank }  as StepItem] : []),
            ...(sel.hasRegimeComp  ? [{ id: TaxStep.DS_REGIME_COMP, label: 'Retraite complémentaire', icon: Award }      as StepItem] : []),
            ...(sel.hasCotisPers   ? [{ id: TaxStep.DS_COTIS_PERS,  label: 'Cotisations perso.',      icon: Handshake }  as StepItem] : []),
          ],
        },
        {
          title: 'Mon logement', emoji: '🏠',
          steps: [
            ...(sel.hasInterets  ? [{ id: TaxStep.DS_INTERETS, label: 'Intérêts d\'emprunt', icon: Home }    as StepItem] : []),
            ...(sel.hasLogement  ? [{ id: TaxStep.DS_LOGEMENT, label: 'Épargne-logement',    icon: Building2 } as StepItem] : []),
          ],
        },
        {
          title: 'Ma famille', emoji: '👨‍👩‍👧',
          steps: [
            ...(sel.hasGarde       ? [{ id: TaxStep.CE_GARDE,       label: 'Garde d\'enfants',    icon: BabyIcon }   as StepItem] : []),
            ...(sel.hasDomesticite ? [{ id: TaxStep.CE_DOMESTICITE, label: 'Aide à domicile',     icon: Users2 }     as StepItem] : []),
            ...(sel.hasRentes      ? [{ id: TaxStep.DS_RENTES,      label: 'Pensions versées',    icon: Receipt }    as StepItem] : []),
            ...(sel.hasEnfantsHM   ? [{ id: TaxStep.CE_ENFANTS_HM,  label: 'Enfants hors ménage', icon: UserCheck }  as StepItem] : []),
          ],
        },
        {
          title: 'Ma santé', emoji: '❤️',
          steps: [
            ...(sel.hasInvalidite    ? [{ id: TaxStep.CE_INVALIDITE,    label: 'Invalidité / infirmité',     icon: Activity }     as StepItem] : []),
            ...(sel.hasFraisMaladie  ? [{ id: TaxStep.CE_FRAIS_MALADIE, label: 'Frais médicaux',             icon: Stethoscope }  as StepItem] : []),
            ...(sel.hasRegimeDiet    ? [{ id: TaxStep.CE_REGIME_DIET,   label: 'Régime diététique',          icon: Thermometer }  as StepItem] : []),
            ...(sel.hasPersNec       ? [{ id: TaxStep.CE_PERS_NEC,      label: 'Personne nécessiteuse',      icon: Heart }        as StepItem] : []),
            ...(sel.hasAutresCharges ? [{ id: TaxStep.CE_AUTRES,        label: 'Autres charges',             icon: HelpCircle }   as StepItem] : []),
          ],
        },
        {
          title: 'Mes dons & cotisations', emoji: '🎁',
          steps: [
            ...(sel.hasLiberalites ? [{ id: TaxStep.DS_LIBERALITES, label: 'Dons / libéralités',     icon: Gift }      as StepItem] : []),
            ...(sel.hasCotisSoc    ? [{ id: TaxStep.DS_COTIS_SOC,   label: 'Cotisations sociales',   icon: Handshake } as StepItem] : []),
          ],
        },
        {
          title: 'Mes crédits & bonifications', emoji: '💶',
          steps: [
            ...(sel.hasCreditsImpot  ? [{ id: TaxStep.CREDITS_IMPOT,  label: 'Crédits d\'impôt',      icon: CreditCard }  as StepItem] : []),
            ...(sel.hasBoniChomeurs  ? [{ id: TaxStep.BONI_CHOMEURS,  label: 'Boni embauchage',       icon: Award }       as StepItem] : []),
            ...(sel.hasCotisIndep    ? [{ id: TaxStep.COTIS_INDEP,    label: 'Cotis. indépendant',    icon: UserCog }     as StepItem] : []),
            ...(sel.hasAbattExtra    ? [{ id: TaxStep.ABATT_EXTRA,    label: 'Abattement extra',      icon: BarChart3 }   as StepItem] : []),
          ],
        },
      ],
    },
    {
      title: 'Signatures',
      steps: [
        ...(filledBy === 'MANDATAIRE' ? [{ id: TaxStep.MANDATAIRE, label: 'Mandataire & signatures', icon: UserCog } as StepItem] : []),
      ],
    },
    {
      title: 'Mon résultat',
      steps: [
        ...(sel.hasLocation ? [{ id: TaxStep.ANNEXES, label: 'Détail de mes locations', icon: Paperclip } as StepItem] : []),
        { id: TaxStep.RECAP, label: 'Estimation de mon impôt', icon: CheckCircle },
      ],
    },
  ];

  const renderStep = (step: StepItem) => {
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
        <Icon size={16} className={isActive ? 'text-blue-600' : 'text-gray-400'} />
        <span className="text-left leading-tight">{step.label}</span>
      </button>
    );
  };

  return (
    <nav className="w-64 bg-white border-r border-gray-200 h-[calc(100vh-64px)] overflow-y-auto flex-shrink-0 hidden md:block">
      <div className="p-4 space-y-5">
        {groups.map((group, gi) => {
          if (group.subGroups) {
            const allSteps = group.subGroups.flatMap(sg => sg.steps);
            if (allSteps.length === 0) return null;
            return (
              <div key={gi}>
                <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  {group.title}
                </h3>
                <div className="space-y-3">
                  {group.subGroups.map((sg, sgi) => {
                    if (sg.steps.length === 0) return null;
                    return (
                      <div key={sgi}>
                        <p className="px-3 text-xs text-gray-400 font-medium mb-1">
                          {sg.emoji} {sg.title}
                        </p>
                        <div className="space-y-0.5">{sg.steps.map(renderStep)}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          }

          const steps = group.steps ?? [];
          const visibleSteps = steps.filter(Boolean);
          if (visibleSteps.length === 0) return null;
          return (
            <div key={gi}>
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                {group.title}
              </h3>
              <div className="space-y-0.5">{visibleSteps.map(renderStep)}</div>
            </div>
          );
        })}
      </div>
    </nav>
  );
};
