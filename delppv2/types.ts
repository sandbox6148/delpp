// ─── Étapes du wizard (parcours contribuable) ────────────────────────────────
export enum TaxStep {
  // 0 · Bienvenue
  WELCOME            = 'WELCOME',
  QUI_REMPLIT        = 'QUI_REMPLIT',
  ELIGIBILITE        = 'ELIGIBILITE',
  PREREMPLISSAGE     = 'PREREMPLISSAGE',   // conditionnel : contribuable authentifié seulement

  // 1 · Ma situation
  SITUATION_CONTRIBUABLE = 'SITUATION_CONTRIBUABLE',
  SITUATION_CONJOINT     = 'SITUATION_CONJOINT',     // si couple
  OPTIONS                = 'OPTIONS',                // si couple
  ENFANTS                = 'ENFANTS',

  // 2 · Mes revenus (MenuRevenus + DonneesImposition…)
  SELECTION     = 'SELECTION',      // « Quels revenus avez-vous eus ? »
  SALAIRES      = 'SALAIRES',       // G4030 Salaires
  PENSIONS      = 'PENSIONS',       // G4060 Pensions & rentes
  LOCATION      = 'LOCATION',       // G4140 Location + habitation propriétaire
  CAPITAUX      = 'CAPITAUX',       // G4130 Capitaux mobiliers
  INDEPENDANT   = 'INDEPENDANT',    // G4000/4010/4020 Commerce / Agri / Libéral (onglets)
  DIVERS        = 'DIVERS',         // G4240 Revenus nets divers

  // 3 · Ce qui réduit mon impôt — 6 thèmes de vie
  // 🛡️ Assurances & prévoyance
  DS_ASSURANCES   = 'DS_ASSURANCES',    // D0870 Primes d'assurances
  DS_VIEILLESSE   = 'DS_VIEILLESSE',    // D1060 Prévoyance-vieillesse 111bis
  DS_REGIME_COMP  = 'DS_REGIME_COMP',   // D1680/D2000 Régime complémentaire pension
  DS_COTIS_PERS   = 'DS_COTIS_PERS',    // DepSpeCotisationsPers
  // 🏠 Mon logement
  DS_INTERETS     = 'DS_INTERETS',      // Intérêts débiteurs
  DS_LOGEMENT     = 'DS_LOGEMENT',      // D1300 Épargne-logement
  // 👨‍👩‍👧 Ma famille
  CE_GARDE        = 'CE_GARDE',         // H1220 Garde d'enfants
  CE_DOMESTICITE  = 'CE_DOMESTICITE',   // Domesticité
  DS_RENTES       = 'DS_RENTES',        // D0020 Rentes/pensions alimentaires versées
  CE_ENFANTS_HM   = 'CE_ENFANTS_HM',   // H2480 Enfants hors ménage
  // ❤️ Ma santé
  CE_INVALIDITE   = 'CE_INVALIDITE',    // H2100 Invalidité / infirmité
  CE_FRAIS_MALADIE = 'CE_FRAIS_MALADIE', // H0040 Frais médicaux
  CE_REGIME_DIET  = 'CE_REGIME_DIET',   // Régime diététique
  CE_PERS_NEC     = 'CE_PERS_NEC',      // H0200 Personne nécessiteuse
  CE_AUTRES       = 'CE_AUTRES',        // Autres charges extraordinaires
  // 🎁 Mes dons & cotisations
  DS_LIBERALITES  = 'DS_LIBERALITES',   // Libéralités / dons
  DS_COTIS_SOC    = 'DS_COTIS_SOC',     // D5980 Cotisations sociales obligatoires
  // 💶 Mes crédits & bonifications
  CREDITS_IMPOT   = 'CREDITS_IMPOT',    // G7010 Crédits d'impôt CIHS
  BONI_CHOMEURS   = 'BONI_CHOMEURS',    // Bonification embauchage chômeurs
  COTIS_INDEP     = 'COTIS_INDEP',      // G5500 Cotisation sociale indépendant
  ABATT_EXTRA     = 'ABATT_EXTRA',      // Abattement extra prof/pensions

  // 4 · Signatures & mandataire
  MANDATAIRE      = 'MANDATAIRE',       // SignatureMandataire (détails)

  // 5 · Mon résultat
  ANNEXES         = 'ANNEXES',          // Modele190/195
  RECAP           = 'RECAP',            // Estimation de l'impôt
}

// ─── État civil ──────────────────────────────────────────────────────────────
export enum CivilStatus {
  SINGLE    = 'SINGLE',
  MARRIED   = 'MARRIED',
  PARTNER   = 'PARTNER',
  DIVORCED  = 'DIVORCED',
  WIDOWED   = 'WIDOWED',
  SEPARATED = 'SEPARATED',
}

export const CIVIL_STATUS_LABELS: Record<CivilStatus, string> = {
  [CivilStatus.SINGLE]:    'Célibataire (301)',
  [CivilStatus.MARRIED]:   'Marié(e) (302)',
  [CivilStatus.PARTNER]:   'Partenariat enregistré (302)',
  [CivilStatus.DIVORCED]:  'Divorcé(e) (303)',
  [CivilStatus.WIDOWED]:   'Veuf / Veuve (304)',
  [CivilStatus.SEPARATED]: 'Séparé(e) de corps',
};

// ─── Qui remplit la déclaration ───────────────────────────────────────────────
export type FilledBy = 'CONTRIBUABLE' | 'MANDATAIRE';

// ─── Identité d'une personne ──────────────────────────────────────────────────
export interface Personne {
  nom: string;            // 101/251
  prenom: string;         // 102/252
  matricule: string;      // 105/255 — NIN 13 chiffres
  dateNaissance: string;
  telephone: string;
  email: string;
  civilStatus: CivilStatus;
  civilStatusDate: string;
  changedStatusInYear: boolean;
  newCivilStatus?: CivilStatus;
  newStatusDate?: string;
}

export interface Adresse {
  rue: string;
  numero: string;
  codePostal: string;
  ville: string;
  pays: string;
}

// ─── Enfant ──────────────────────────────────────────────────────────────────
export interface Enfant {
  id: string;
  nom: string;
  prenom: string;
  matricule: string;
  matriculeNonAttribue: boolean;
  dateNaissance: string;
  estMarie: boolean;
  aDesEnfants: boolean;
  chargeParent: 'CONTRIBUABLE' | 'CONJOINT' | 'COMMUN';
  accordAutreParent: boolean;
  allocationsPercues: boolean;
  moderationAnneePrec: boolean;
  habiteSousToit: boolean;
  formationUniversitaire: boolean;
  designationFormationUniv: string;
  autreFormationPro: boolean;
  designationFormationPro: string;
  allocationFamilialeContContinuee: boolean;
  allocationsPayees: boolean;
  allocationCAE: number;
  aideCEDIES: number;
  aideVolontaires: number;
  demandeDegrevement: boolean;
  autreParentMemeToit: boolean;
  demandeCIM: boolean;
  montantMensuelAllocationAutreParent: number;
  demandeBonification: boolean;
  montantAnnuelFraisEntretien: number;
}

// ─── Sélection des rubriques de revenus ──────────────────────────────────────
export interface SectionSelection {
  // Revenus
  hasSalaries: boolean;          // G4030
  hasPensions: boolean;          // G4060
  hasLocation: boolean;          // G4140
  hasCapitaux: boolean;          // G4130
  hasIndependant: boolean;       // G4000/4010/4020
  hasDiversIncomes: boolean;     // G4240
  // Ce qui réduit mon impôt — Assurances & prévoyance
  hasAssurances: boolean;
  hasVieillesse: boolean;
  hasRegimeComp: boolean;
  hasCotisPers: boolean;
  // — Mon logement
  hasInterets: boolean;
  hasLogement: boolean;
  // — Ma famille
  hasGarde: boolean;
  hasDomesticite: boolean;
  hasRentes: boolean;
  hasEnfantsHM: boolean;
  // — Ma santé
  hasInvalidite: boolean;
  hasFraisMaladie: boolean;
  hasRegimeDiet: boolean;
  hasPersNec: boolean;
  hasAutresCharges: boolean;
  // — Mes dons & cotisations
  hasLiberalites: boolean;
  hasCotisSoc: boolean;
  // — Mes crédits & bonifications
  hasCreditsImpot: boolean;
  hasBoniChomeurs: boolean;
  hasCotisIndep: boolean;
  hasAbattExtra: boolean;
}

// ─── Revenus salariés / pensions ─────────────────────────────────────────────
export interface IncomeEntry {
  id: string;
  type: 'SALARY' | 'PENSION' | 'PENSION_RVI' | 'PENSION_ARR';
  ownerId: 'contribuable' | 'conjoint';
  employeur: string;
  montantBrut: number;
  fraisObtention: number;   // min 540€ salaire, 300€ pension
  impotRetenu: number;
  cotisationsSociales: number;
}

// ─── Revenus de location ──────────────────────────────────────────────────────
export interface LocationEntry {
  id: string;
  ownerId: 'contribuable' | 'conjoint' | 'commun';
  type: 'BATI' | 'NON_BATI' | 'HAB_PROPRIETAIRE';
  description: string;
  revenusNets: number;
  interetsDebiteurs: number;
}

// ─── Revenus indépendants (commerce / agri / libéral) ────────────────────────
export interface IndependantEntry {
  id: string;
  type: 'COMMERCIAL' | 'AGRICOLE' | 'LIBERAL';
  ownerId: 'contribuable' | 'conjoint';
  description: string;
  resultatNet: number;
  reportPertes: number;
}

// ─── Revenus capitaux mobiliers ───────────────────────────────────────────────
export interface CapitauxEntry {
  id: string;
  ownerId: 'contribuable' | 'conjoint';
  type: 'EXONERE_50' | 'RETENUE_100' | 'NON_SOUMIS';
  montant: number;
}

// ─── Revenus divers ───────────────────────────────────────────────────────────
export interface DiversEntry {
  id: string;
  ownerId: 'contribuable' | 'conjoint';
  type: 'PLUS_VALUE_BAT' | 'PLUS_VALUE_TIT' | 'AUTRE';
  description: string;
  montant: number;
}

// ─── Dépenses (générique) ─────────────────────────────────────────────────────
export type DepenseType =
  | 'ASSURANCE'           // D0870
  | 'VIEILLESSE_111BIS'   // D1060
  | 'REGIME_COMP_SAL'     // D1680
  | 'REGIME_COMP_IND'     // D2000
  | 'COTIS_PERS'
  | 'INTERETS'
  | 'EPARGNE_LOGEMENT'    // D1300
  | 'RENTE_ALIM'          // D0020
  | 'LIBERALITE'
  | 'COTIS_SOC_OBL';      // D5980

export interface DepenseEntry {
  id: string;
  type: DepenseType;
  ownerId: 'contribuable' | 'conjoint' | 'commun';
  organisme: string;
  montant: number;
}

// ─── Charges extraordinaires ─────────────────────────────────────────────────
export type ChargeExtraType =
  | 'GARDE'           // H1220
  | 'DOMESTICITE'
  | 'INVALIDITE'      // H2100
  | 'FRAIS_MALADIE'   // H0040
  | 'REGIME_DIET'
  | 'PERS_NEC'        // H0200
  | 'ENFANTS_HM'      // H2480
  | 'AUTRE';

export interface ChargeExtraEntry {
  id: string;
  type: ChargeExtraType;
  ownerId: 'contribuable' | 'conjoint' | 'commun' | string; // enfant possible
  description: string;
  montant: number;
  montantRembourse: number;
}

// ─── Crédits & bonifications ──────────────────────────────────────────────────
export interface CreditsData {
  // CIHS — G7010/G7510
  demandeCI_CIHS_cont: boolean;
  demandeCI_CIHS_conj: boolean;
  // Cotisation indépendant — G5500
  indAffSSC_cont: boolean;
  indAffSSC_conj: boolean;
  // Bonification embauchage chômeurs
  demandeBoniEmbauch: boolean;
  reportsBoniEmbauch: number[]; // 10 dernières années
}

// ─── Annexes Modele 190 ───────────────────────────────────────────────────────
export interface Modele190Entry {
  id: string;
  idPersonne: string;
  adresseImmeuble: string;
  revenusLocatifs: number;
  chargesDeductibles: number;
  amortissements: number;
}

// ─── Mandataire ───────────────────────────────────────────────────────────────
export type MandataireType = 'PP' | 'PM'; // Personne physique / morale
export interface MandataireData {
  type: MandataireType;
  societe?: string;
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  signePour: 'CONTRIBUABLE' | 'CONJOINT' | 'LES_DEUX';
  signatureConjointObtenue: boolean;
}

// ─── FormData global ──────────────────────────────────────────────────────────
export interface FormData {
  // Qui remplit + éligibilité
  filledBy: FilledBy;
  isAuthenticated: boolean;   // LuxTrust / eID simulé
  canPrefill: boolean;        // dérivé : filledBy=CONTRIBUABLE && isAuthenticated
  anneeImposition: number;    // 2025
  noDossier: string;
  bureauImposition: string;

  // Éligibilité
  aLuxTrust: boolean;
  aRNPP: boolean;
  declarePourMenage: boolean;
  marieDansAnnee: boolean;
  partenariatDansAnnee: boolean;
  demandeImpositionIndividuelle: boolean;

  // Contribuable & conjoint
  contribuable: Personne;
  adresseContribuable: Adresse;
  conjoint: Personne;
  memeAdresseQueConjoint: boolean;
  adresseConjoint: Adresse;

  // Mode d'imposition
  impositionCollective: boolean;
  demandeAssimilation: boolean;
  confirmationAssimilation: boolean;

  // Enfants
  aDesEnfants: boolean;
  enfants: Enfant[];

  // Sélection des rubriques
  selectedSections: SectionSelection;

  // Revenus
  incomes: IncomeEntry[];
  locations: LocationEntry[];
  independants: IndependantEntry[];
  capitaux: CapitauxEntry[];
  divers: DiversEntry[];

  // Ce qui réduit mon impôt
  depenses: DepenseEntry[];
  chargesExtra: ChargeExtraEntry[];
  credits: CreditsData;

  // Mandataire
  mandataire?: MandataireData;

  // Annexes
  modele190: Modele190Entry[];
}

// ─── Valeur initiale ──────────────────────────────────────────────────────────
const PERSONNE_VIDE: Personne = {
  nom: '', prenom: '', matricule: '', dateNaissance: '',
  telephone: '', email: '',
  civilStatus: CivilStatus.SINGLE, civilStatusDate: '',
  changedStatusInYear: false,
};

const ADRESSE_VIDE: Adresse = {
  rue: '', numero: '', codePostal: '', ville: '', pays: 'Luxembourg',
};

const SECTIONS_VIDES: SectionSelection = {
  hasSalaries: false, hasPensions: false, hasLocation: false, hasCapitaux: false,
  hasIndependant: false, hasDiversIncomes: false,
  hasAssurances: false, hasVieillesse: false, hasRegimeComp: false, hasCotisPers: false,
  hasInterets: false, hasLogement: false,
  hasGarde: false, hasDomesticite: false, hasRentes: false, hasEnfantsHM: false,
  hasInvalidite: false, hasFraisMaladie: false, hasRegimeDiet: false,
  hasPersNec: false, hasAutresCharges: false,
  hasLiberalites: false, hasCotisSoc: false,
  hasCreditsImpot: false, hasBoniChomeurs: false, hasCotisIndep: false, hasAbattExtra: false,
};

export const INITIAL_DATA: FormData = {
  filledBy: 'CONTRIBUABLE',
  isAuthenticated: false,
  canPrefill: false,
  anneeImposition: 2025,
  noDossier: '',
  bureauImposition: '',
  aLuxTrust: false,
  aRNPP: false,
  declarePourMenage: true,
  marieDansAnnee: false,
  partenariatDansAnnee: false,
  demandeImpositionIndividuelle: false,
  contribuable: { ...PERSONNE_VIDE },
  adresseContribuable: { ...ADRESSE_VIDE },
  conjoint: { ...PERSONNE_VIDE },
  memeAdresseQueConjoint: true,
  adresseConjoint: { ...ADRESSE_VIDE },
  impositionCollective: true,
  demandeAssimilation: false,
  confirmationAssimilation: false,
  aDesEnfants: false,
  enfants: [],
  selectedSections: { ...SECTIONS_VIDES },
  incomes: [],
  locations: [],
  independants: [],
  capitaux: [],
  divers: [],
  depenses: [],
  chargesExtra: [],
  credits: {
    demandeCI_CIHS_cont: false,
    demandeCI_CIHS_conj: false,
    indAffSSC_cont: false,
    indAffSSC_conj: false,
    demandeBoniEmbauch: false,
    reportsBoniEmbauch: Array(10).fill(0),
  },
  modele190: [],
};
