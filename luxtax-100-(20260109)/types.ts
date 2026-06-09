export enum TaxStep {
  WELCOME = 'Accueil / Guide',
  SITUATION_CONTRIBUABLE = 'Identité & Domicile',
  SITUATION_CONJOINT = 'Signalétique Conjoint',
  ENFANTS = 'Enfants à charge',
  OPTIONS = 'Options d\'imposition',
  SELECTION = 'Sélection des rubriques',

  // Revenus
  SALAIRES = 'Salaires (S)',
  PENSIONS = 'Pensions (P)',
  COMMERCIAUX = 'Bénéfice Commercial (C)',
  AGRICOLE = 'Bénéfice Agricole (A)',
  LIBERAL = 'Profession Libérale (I)',
  CAPITAUX = 'Capitaux (CM)',
  LOCATION = 'Location (L)',
  DIVERS = 'Revenus Divers (D)',
  EXTRAORDINAIRES = 'Revenus Extra. (EX)',

  // Dépenses spéciales
  DS_INTERETS = 'Intérêts débiteurs',
  DS_ASSURANCES = 'Primes d\'assurances',
  DS_VIEILLESSE = 'Prévoyance-vieillesse',
  DS_LOGEMENT = 'Epargne Logement',
  DS_LIBERALITES = 'Libéralités (Dons)',
  DS_RENTES = 'Rentes alimentaires',

  // Abattements
  CE_GARDE = 'Garde d\'enfants',
  CE_DOMESTICITE = 'Services domestiques',
  CE_INVALIDITE = 'Frais d\'invalidité',

  // Finalisation
  DIVERSES_DEMANDES = 'Diverses Demandes (DD)',

  RECAP = 'Récapitulatif'
}

export enum CivilStatus {
  SINGLE = 'Célibataire (Case 301)',
  MARRIED = 'Marié(e) (Case 302)',
  PARTNER = 'Partenariat',
  DIVORCED = 'Divorcé(e) (Case 303)',
  WIDOWED = 'Veuf/Veuve (Case 304)',
  SEPARATED = 'Séparé(e)'
}

export enum TaxImpositionType {
  COLLECTIVE = 'collective',
  INDIVIDUAL_PURE = 'individual_pure',
  INDIVIDUAL_REALLOCATED = 'individual_reallocated'
}

export interface Taxpayer {
  lastName: string;
  firstName: string;
  matricule: string;
  birthDate: string;
  birthPlace?: string;
  birthCountry?: string;
  profession?: string;
  email?: string;
  phone?: string;
  // Pour non-résidents
  foreignTaxId?: string;
  foreignTaxCountry?: string;
}

export interface Child {
  id: string;
  lastName: string;
  firstName: string;
  birthDate: string;
  matricule?: string;
  isStudent: boolean;
  disability: boolean;
  sharedCustody?: boolean; // garde alternée
}

export interface IncomeEntry {
  id: string;
  name: string;
  grossAmount: number;
  deductions: number;
  taxWithheld: number;
  expenses: number;
  socialContributions?: number; // Cotisations sociales déduites
  type: 'SALARY' | 'PENSION';
  ownerId: string;
}

export interface IndependentIncomeEntry {
  id: string;
  type: 'COMMERCIAL' | 'AGRICOLE' | 'LIBERAL';
  ownerId: string;
  netResult: number;       // Résultat net (bénéfice positif ou perte négative)
  priorLoss: number;       // Report de pertes antérieures
  description?: string;
}

export interface DiverseIncomeEntry {
  id: string;
  type: 'REAL_ESTATE_GAIN' | 'SPECULATIVE_GAIN' | 'ALIMONY_RECEIVED' | 'OTHER';
  ownerId: string;
  amount: number;
  description?: string;
}

export interface ExtraordinaryIncomeEntry {
  id: string;
  type: 'SEVERANCE' | 'BUSINESS_GAIN' | 'PENSION_CAPITAL' | 'OTHER';
  ownerId: string;
  amount: number;
  description?: string;
}

export enum ExpenseType {
  DEBIT_INTEREST = 'DEBIT_INTEREST',       // Case 1401
  INSURANCE = 'INSURANCE',                  // Case 1436
  PENSION_PLAN = 'PENSION_PLAN',            // Case 1503 (111bis)
  HOME_SAVINGS = 'HOME_SAVINGS',            // Case 1529
  DONATION = 'DONATION',                    // Case 1611
  ALIMONY_PAID = 'ALIMONY_PAID',            // Case 1301 - Pensions alimentaires versées
  ALIMONY_CHILD = 'ALIMONY_CHILD',          // Case 1303 - Pensions alimentaires enfants non à charge
  UNION_FEES = 'UNION_FEES',                // Case 1308 - Cotisations syndicales
  STUDY_LOAN_INTEREST = 'STUDY_LOAN_INTEREST', // Case 1310 - Intérêts prêt étudiant
  CHILDCARE = 'CHILDCARE',                  // Case 1715 (Garde)
  DOMESTIC_HELP = 'DOMESTIC_HELP',          // Case 1715 (Domesticité)
  INVALIDITY = 'INVALIDITY',                // Case 1702 - Frais maladie grave/invalidité
  INVALIDITY_MEDICAL = 'INVALIDITY_MEDICAL' // Cases 1709-1714 - Frais médicaux invalidité
}

export interface ExpenseEntry {
  id: string;
  type: ExpenseType;
  amount: number;
  ownerId: string;
  label?: string;
}

export interface TaxWithheldEntry {
  id: string;
  ownerId: string;
  amount: number;
  source?: string;
  type: 'SALARY_NOT_CREDITED' | 'PENSION_NOT_CREDITED' | 'OTHER';
}

export interface DiversesDemandes {
  requestRefund: boolean;
  refundIban: string;
  refundBankName: string;
  refundHolder: string;
  hasEcoBonus: boolean;           // Case 1821 - Crédit investissements économiseurs énergie
  ecoBonusAmount: number;
  hasHandicap: boolean;           // Abattement invalidité contribuable
  handicapRate: number;           // Taux d'invalidité (%)
  hasHandicapConjoint: boolean;
  handicapRateConjoint: number;
  hasSeniorCredit: boolean;       // Case 1818 - Crédit personnes âgées
  hasWorkerCredit: boolean;       // Case 1801 - Crédit d'impôt salarié (CIS) - demande spéciale
  requestExtension: boolean;      // Case 213 - Demande de prorogation délai
  additionalNotes?: string;
}

export interface TaxOptionsData {
  impositionType: TaxImpositionType;
  optionYear?: string;            // Année à partir de laquelle l'option est exercée
}

export interface SectionSelection {
  // Revenus salariés
  hasSalaries: boolean;
  hasPensions: boolean;
  // Revenus indépendants
  hasCommercial: boolean;
  hasAgricole: boolean;
  hasLiberal: boolean;
  // Revenus patrimoniaux
  hasCapitals: boolean;
  hasRentals: boolean;
  // Revenus divers et extraordinaires
  hasDiversIncomes: boolean;
  hasExtraordinaryIncomes: boolean;
  // Dépenses spéciales
  hasDebitInterests: boolean;
  hasInsurances: boolean;
  hasPensionPlans: boolean;
  hasHomeSavings: boolean;
  hasDonations: boolean;
  hasAlimony: boolean;
  // Abattements
  hasChildcare: boolean;
  hasDomesticHelp: boolean;
  hasInvalidity: boolean;
}

export interface FormData {
  civilStatus: CivilStatus;
  civilStatusDate?: string;
  contribuable: Taxpayer;
  conjoint: Taxpayer;
  address: {
    street: string;
    number: string;
    postalCode: string;
    city: string;
    country: string;
  };
  previousAddress?: {
    fromDate: string;
    toDate: string;
    street: string;
    number: string;
    postalCode: string;
    city: string;
    country: string;
  };
  requestAssimilation: boolean;

  taxOptions: TaxOptionsData;

  bankAccount: {
    iban: string;
    holder: string;
    bankName: string;
  };

  children: Child[];
  applyForCIM: boolean;
  applyForBonification: boolean;

  selectedSections: SectionSelection;

  incomes: IncomeEntry[];
  independentIncomes: IndependentIncomeEntry[];
  diverseIncomes: DiverseIncomeEntry[];
  extraordinaryIncomes: ExtraordinaryIncomeEntry[];
  additionalWithholdings: TaxWithheldEntry[];

  realEstate: {
    rentalNet: number;
    mainResidenceInterest: number;
  };

  capital: {
    exempt: number;
    withholding: number;
    notSubject: number;
  };

  expenses: ExpenseEntry[];
  diversesDemandes: DiversesDemandes;
}

export const INITIAL_DATA: FormData = {
  civilStatus: CivilStatus.SINGLE,
  contribuable: { lastName: '', firstName: '', matricule: '', birthDate: '', birthPlace: '', birthCountry: '' },
  conjoint: { lastName: '', firstName: '', matricule: '', birthDate: '' },
  address: { street: '', number: '', postalCode: '', city: '', country: 'Luxembourg' },
  requestAssimilation: false,

  taxOptions: {
    impositionType: TaxImpositionType.COLLECTIVE,
  },

  bankAccount: { iban: '', holder: '', bankName: '' },
  children: [],
  applyForCIM: false,
  applyForBonification: false,

  selectedSections: {
    hasSalaries: true,
    hasPensions: false,
    hasCommercial: false,
    hasAgricole: false,
    hasLiberal: false,
    hasCapitals: false,
    hasRentals: false,
    hasDiversIncomes: false,
    hasExtraordinaryIncomes: false,
    hasDebitInterests: false,
    hasInsurances: true,
    hasPensionPlans: false,
    hasHomeSavings: false,
    hasDonations: false,
    hasAlimony: false,
    hasChildcare: false,
    hasDomesticHelp: false,
    hasInvalidity: false,
  },

  incomes: [],
  independentIncomes: [],
  diverseIncomes: [],
  extraordinaryIncomes: [],
  additionalWithholdings: [],
  realEstate: { rentalNet: 0, mainResidenceInterest: 0 },
  capital: { exempt: 0, withholding: 0, notSubject: 0 },
  expenses: [],
  diversesDemandes: {
    requestRefund: false,
    refundIban: '',
    refundBankName: '',
    refundHolder: '',
    hasEcoBonus: false,
    ecoBonusAmount: 0,
    hasHandicap: false,
    handicapRate: 0,
    hasHandicapConjoint: false,
    handicapRateConjoint: 0,
    hasSeniorCredit: false,
    hasWorkerCredit: false,
    requestExtension: false,
  },
};
