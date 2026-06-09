import React, { useState, useEffect } from 'react';
import { TaxStep, FormData, INITIAL_DATA, CivilStatus, DepenseType } from './types';
import { Sidebar } from './components/Sidebar';
import { Welcome }           from './views/Welcome';
import { QuiRemplit }        from './views/QuiRemplit';
import { Eligibilite }       from './views/Eligibilite';
import { Preremplissage }    from './views/Preremplissage';
import { PersonalSituation } from './views/PersonalSituation';
import { Selection }         from './views/Selection';
import { Incomes }           from './views/Incomes';
import { IndependantIncomes }from './views/IndependantIncomes';
import { Depenses }          from './views/Depenses';
import { Recap }             from './views/Recap';
import { Stub }              from './views/Stub';
import { FileText, Lock, Menu, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';

// ─── Ordre complet des étapes ─────────────────────────────────────────────────
const FULL_STEPS_ORDER: TaxStep[] = [
  // 0 · Bienvenue
  TaxStep.WELCOME,
  TaxStep.QUI_REMPLIT,
  TaxStep.ELIGIBILITE,
  TaxStep.PREREMPLISSAGE,   // conditionnel

  // 1 · Ma situation
  TaxStep.SITUATION_CONTRIBUABLE,
  TaxStep.SITUATION_CONJOINT,  // conditionnel (couple)
  TaxStep.OPTIONS,             // conditionnel (couple)
  TaxStep.ENFANTS,

  // 2 · Mes revenus
  TaxStep.SELECTION,
  TaxStep.SALAIRES,
  TaxStep.PENSIONS,
  TaxStep.LOCATION,
  TaxStep.CAPITAUX,
  TaxStep.INDEPENDANT,
  TaxStep.DIVERS,

  // 3 · Ce qui réduit mon impôt — Assurances & prévoyance
  TaxStep.DS_ASSURANCES,
  TaxStep.DS_VIEILLESSE,
  TaxStep.DS_REGIME_COMP,
  TaxStep.DS_COTIS_PERS,
  // — Mon logement
  TaxStep.DS_INTERETS,
  TaxStep.DS_LOGEMENT,
  // — Ma famille
  TaxStep.CE_GARDE,
  TaxStep.CE_DOMESTICITE,
  TaxStep.DS_RENTES,
  TaxStep.CE_ENFANTS_HM,
  // — Ma santé
  TaxStep.CE_INVALIDITE,
  TaxStep.CE_FRAIS_MALADIE,
  TaxStep.CE_REGIME_DIET,
  TaxStep.CE_PERS_NEC,
  TaxStep.CE_AUTRES,
  // — Mes dons & cotisations
  TaxStep.DS_LIBERALITES,
  TaxStep.DS_COTIS_SOC,
  // — Mes crédits & bonifications
  TaxStep.CREDITS_IMPOT,
  TaxStep.BONI_CHOMEURS,
  TaxStep.COTIS_INDEP,
  TaxStep.ABATT_EXTRA,

  // 4 · Signatures
  TaxStep.MANDATAIRE,   // conditionnel (mandataire)

  // 5 · Mon résultat
  TaxStep.ANNEXES,      // conditionnel (location)
  TaxStep.RECAP,
];

function App() {
  const [currentStep, setCurrentStep] = useState<TaxStep>(TaxStep.WELCOME);
  const [formData, setFormData]       = useState<FormData>(INITIAL_DATA);
  const [mobileOpen, setMobileOpen]   = useState(false);

  const updateData = (newData: Partial<FormData>) =>
    setFormData(prev => ({ ...prev, ...newData }));

  const isCouple = [CivilStatus.MARRIED, CivilStatus.PARTNER].includes(formData.contribuable.civilStatus);
  const sel = formData.selectedSections;

  const getStepsOrder = (): TaxStep[] => {
    let steps = [...FULL_STEPS_ORDER];

    // Bienvenue
    if (!formData.canPrefill)        steps = steps.filter(s => s !== TaxStep.PREREMPLISSAGE);

    // Situation
    if (!isCouple) {
      steps = steps.filter(s => s !== TaxStep.SITUATION_CONJOINT);
      steps = steps.filter(s => s !== TaxStep.OPTIONS);
    }

    // Revenus
    if (!sel.hasSalaries)      steps = steps.filter(s => s !== TaxStep.SALAIRES);
    if (!sel.hasPensions)      steps = steps.filter(s => s !== TaxStep.PENSIONS);
    if (!sel.hasLocation)      steps = steps.filter(s => s !== TaxStep.LOCATION);
    if (!sel.hasCapitaux)      steps = steps.filter(s => s !== TaxStep.CAPITAUX);
    if (!sel.hasIndependant)   steps = steps.filter(s => s !== TaxStep.INDEPENDANT);
    if (!sel.hasDiversIncomes) steps = steps.filter(s => s !== TaxStep.DIVERS);

    // Ce qui réduit mon impôt
    if (!sel.hasAssurances)    steps = steps.filter(s => s !== TaxStep.DS_ASSURANCES);
    if (!sel.hasVieillesse)    steps = steps.filter(s => s !== TaxStep.DS_VIEILLESSE);
    if (!sel.hasRegimeComp)    steps = steps.filter(s => s !== TaxStep.DS_REGIME_COMP);
    if (!sel.hasCotisPers)     steps = steps.filter(s => s !== TaxStep.DS_COTIS_PERS);
    if (!sel.hasInterets)      steps = steps.filter(s => s !== TaxStep.DS_INTERETS);
    if (!sel.hasLogement)      steps = steps.filter(s => s !== TaxStep.DS_LOGEMENT);
    if (!sel.hasGarde)         steps = steps.filter(s => s !== TaxStep.CE_GARDE);
    if (!sel.hasDomesticite)   steps = steps.filter(s => s !== TaxStep.CE_DOMESTICITE);
    if (!sel.hasRentes)        steps = steps.filter(s => s !== TaxStep.DS_RENTES);
    if (!sel.hasEnfantsHM)     steps = steps.filter(s => s !== TaxStep.CE_ENFANTS_HM);
    if (!sel.hasInvalidite)    steps = steps.filter(s => s !== TaxStep.CE_INVALIDITE);
    if (!sel.hasFraisMaladie)  steps = steps.filter(s => s !== TaxStep.CE_FRAIS_MALADIE);
    if (!sel.hasRegimeDiet)    steps = steps.filter(s => s !== TaxStep.CE_REGIME_DIET);
    if (!sel.hasPersNec)       steps = steps.filter(s => s !== TaxStep.CE_PERS_NEC);
    if (!sel.hasAutresCharges) steps = steps.filter(s => s !== TaxStep.CE_AUTRES);
    if (!sel.hasLiberalites)   steps = steps.filter(s => s !== TaxStep.DS_LIBERALITES);
    if (!sel.hasCotisSoc)      steps = steps.filter(s => s !== TaxStep.DS_COTIS_SOC);
    if (!sel.hasCreditsImpot)  steps = steps.filter(s => s !== TaxStep.CREDITS_IMPOT);
    if (!sel.hasBoniChomeurs)  steps = steps.filter(s => s !== TaxStep.BONI_CHOMEURS);
    if (!sel.hasCotisIndep)    steps = steps.filter(s => s !== TaxStep.COTIS_INDEP);
    if (!sel.hasAbattExtra)    steps = steps.filter(s => s !== TaxStep.ABATT_EXTRA);

    // Signatures
    if (formData.filledBy !== 'MANDATAIRE') steps = steps.filter(s => s !== TaxStep.MANDATAIRE);

    // Résultat
    if (!sel.hasLocation) steps = steps.filter(s => s !== TaxStep.ANNEXES);

    return steps;
  };

  const stepsOrder = getStepsOrder();

  // Recentre si l'étape active disparaît
  useEffect(() => {
    if (!stepsOrder.includes(currentStep)) {
      const idx = FULL_STEPS_ORDER.indexOf(currentStep);
      for (let i = idx - 1; i >= 0; i--) {
        if (stepsOrder.includes(FULL_STEPS_ORDER[i])) {
          setCurrentStep(FULL_STEPS_ORDER[i]);
          return;
        }
      }
      setCurrentStep(TaxStep.WELCOME);
    }
  }, [formData.selectedSections, formData.contribuable.civilStatus, formData.canPrefill, formData.filledBy]);

  const handleStepChange = (step: TaxStep) => {
    setCurrentStep(step);
    setMobileOpen(false);
    window.scrollTo(0, 0);
  };

  const idx      = stepsOrder.indexOf(currentStep);
  const isLast   = idx === stepsOrder.length - 1;
  const isFirst  = currentStep === TaxStep.SITUATION_CONTRIBUABLE;

  const handleNext = () => { if (!isLast) handleStepChange(stepsOrder[idx + 1]); };
  const handlePrev = () => { if (idx > 0) handleStepChange(stepsOrder[idx - 1]); };

  const renderStep = () => {
    switch (currentStep) {
      case TaxStep.WELCOME:               return <Welcome onStart={handleNext} />;
      case TaxStep.QUI_REMPLIT:           return <QuiRemplit data={formData} updateData={updateData} />;
      case TaxStep.ELIGIBILITE:           return <Eligibilite data={formData} updateData={updateData} />;
      case TaxStep.PREREMPLISSAGE:        return <Preremplissage data={formData} updateData={updateData} />;

      case TaxStep.SITUATION_CONTRIBUABLE: return <PersonalSituation data={formData} updateData={updateData} step={TaxStep.SITUATION_CONTRIBUABLE} />;
      case TaxStep.SITUATION_CONJOINT:     return <PersonalSituation data={formData} updateData={updateData} step={TaxStep.SITUATION_CONJOINT} />;
      case TaxStep.OPTIONS:               return <Stub title="Notre mode d'imposition" xsdRef="ModeImposition" />;
      case TaxStep.ENFANTS:               return <Stub title="Mes enfants" xsdRef="Enfants" />;

      case TaxStep.SELECTION:             return <Selection data={formData} updateData={updateData} />;
      case TaxStep.SALAIRES:              return <Incomes data={formData} updateData={updateData} section="SALARY" />;
      case TaxStep.PENSIONS:              return <Incomes data={formData} updateData={updateData} section="PENSION" />;
      case TaxStep.LOCATION:              return <Stub title="Mes loyers" xsdRef="LocationBiens + G4140" />;
      case TaxStep.CAPITAUX:              return <Stub title="Mes placements" xsdRef="CapitauxMobiliers + G4130" />;
      case TaxStep.INDEPENDANT:           return <IndependantIncomes data={formData} updateData={updateData} />;
      case TaxStep.DIVERS:                return <Stub title="Autres revenus" xsdRef="RevenusNetsDivers + G4240" />;

      // Ce qui réduit mon impôt
      case TaxStep.DS_ASSURANCES:   return <Depenses data={formData} updateData={updateData} type="ASSURANCE" />;
      case TaxStep.DS_VIEILLESSE:   return <Depenses data={formData} updateData={updateData} type="VIEILLESSE_111BIS" />;
      case TaxStep.DS_REGIME_COMP:  return <Depenses data={formData} updateData={updateData} type="REGIME_COMP_SAL" />;
      case TaxStep.DS_COTIS_PERS:   return <Depenses data={formData} updateData={updateData} type="COTIS_PERS" />;
      case TaxStep.DS_INTERETS:     return <Depenses data={formData} updateData={updateData} type="INTERETS" />;
      case TaxStep.DS_LOGEMENT:     return <Depenses data={formData} updateData={updateData} type="EPARGNE_LOGEMENT" />;
      case TaxStep.CE_GARDE:        return <Stub title="Garde d'enfants" xsdRef="CharExtraFraisDomGarde + H1220" />;
      case TaxStep.CE_DOMESTICITE:  return <Stub title="Aide à domicile" xsdRef="CharExtraFraisDomGarde (domesticité)" />;
      case TaxStep.DS_RENTES:       return <Depenses data={formData} updateData={updateData} type="RENTE_ALIM" />;
      case TaxStep.CE_ENFANTS_HM:   return <Stub title="Enfants hors ménage" xsdRef="CharExtraEnfantsHorsMenage + H2480" />;
      case TaxStep.CE_INVALIDITE:   return <Stub title="Invalidité / infirmité" xsdRef="CharExtraInvaInfirm + H2100" />;
      case TaxStep.CE_FRAIS_MALADIE:return <Stub title="Frais médicaux" xsdRef="CharExtraFraisMaladie + H0040" />;
      case TaxStep.CE_REGIME_DIET:  return <Stub title="Régime diététique" xsdRef="CharExtraRegimeDiet" />;
      case TaxStep.CE_PERS_NEC:     return <Stub title="Personne nécessiteuse" xsdRef="CharExtraPersNec + H0200" />;
      case TaxStep.CE_AUTRES:       return <Stub title="Autres charges extraordinaires" xsdRef="CharExtraAutresCharges" />;
      case TaxStep.DS_LIBERALITES:  return <Depenses data={formData} updateData={updateData} type="LIBERALITE" />;
      case TaxStep.DS_COTIS_SOC:    return <Depenses data={formData} updateData={updateData} type="COTIS_SOC_OBL" />;
      case TaxStep.CREDITS_IMPOT:   return <Stub title="Crédits d'impôt (CIHS)" xsdRef="Divers/CreditsImpot + G7010" />;
      case TaxStep.BONI_CHOMEURS:   return <Stub title="Bonification embauchage chômeurs" xsdRef="Divers/BoniEmbauchChom" />;
      case TaxStep.COTIS_INDEP:     return <Stub title="Cotisation sociale indépendant" xsdRef="Divers/CotisationSocialeIndep + G5500" />;
      case TaxStep.ABATT_EXTRA:     return <Stub title="Abattement extra-professionnel" xsdRef="Divers/AbattExtraProfPensions" />;

      case TaxStep.MANDATAIRE:      return <Stub title="Mandataire & signatures" xsdRef="SignatureMandataire" />;
      case TaxStep.ANNEXES:         return <Stub title="Détail de mes locations" xsdRef="Annexes/Modele190" />;
      case TaxStep.RECAP:           return <Recap data={formData} />;

      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20 h-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="md:hidden text-gray-500 hover:text-gray-700"
              onClick={() => setMobileOpen(!mobileOpen)}>
              <Menu size={24} />
            </button>
            <div className="bg-red-600 text-white p-1.5 rounded shadow-sm">
              <span className="font-bold text-lg tracking-tighter">ACD</span>
            </div>
            <div className="h-8 w-px bg-gray-300 mx-1 hidden sm:block" />
            <h1 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <FileText className="text-blue-600" size={20} />
              <span className="hidden sm:inline">LuxTax 100</span>
            </h1>
          </div>
          <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 px-3 py-1.5 rounded-full border border-green-200 font-medium">
            <Lock size={12} />
            <span>Données locales</span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 max-w-7xl mx-auto w-full">
        {/* Sidebar desktop */}
        <Sidebar
          currentStep={currentStep}
          onStepClick={handleStepChange}
          civilStatus={formData.contribuable.civilStatus}
          selection={formData.selectedSections}
          filledBy={formData.filledBy}
          canPrefill={formData.canPrefill}
        />

        {/* Sidebar mobile overlay */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <div className="relative bg-white w-72 max-w-xs h-full shadow-xl overflow-y-auto"
              onClick={e => e.stopPropagation()}>
              <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                <span className="font-semibold text-gray-700">Navigation</span>
                <button onClick={() => setMobileOpen(false)} className="text-gray-500 hover:text-gray-700">
                  Fermer ✕
                </button>
              </div>
              <Sidebar
                currentStep={currentStep}
                onStepClick={handleStepChange}
                civilStatus={formData.contribuable.civilStatus}
                selection={formData.selectedSections}
                filledBy={formData.filledBy}
                canPrefill={formData.canPrefill}
              />
            </div>
            <div className="flex-1 bg-black bg-opacity-40" onClick={() => setMobileOpen(false)} />
          </div>
        )}

        {/* Contenu principal */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto flex flex-col">
          <div className="max-w-5xl mx-auto w-full flex-grow">
            {renderStep()}
          </div>

          {/* Navigation Précédent / Suivant */}
          {currentStep !== TaxStep.WELCOME && (
            <div className="max-w-3xl mx-auto w-full mt-8 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <button onClick={handlePrev} disabled={isFirst}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-lg border font-medium transition-colors ${
                    isFirst
                      ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                  }`}>
                  <ArrowLeft size={18} /> Précédent
                </button>

                {!isLast ? (
                  <button onClick={handleNext}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-sm hover:shadow">
                    Suivant <ArrowRight size={18} />
                  </button>
                ) : (
                  <button disabled
                    className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-green-600 text-white font-medium opacity-90 cursor-default">
                    Terminé <CheckCircle size={18} />
                  </button>
                )}
              </div>

              <div className="mt-6 text-center text-xs text-gray-400">
                <p>Modèle 100 — Année d'imposition 2025</p>
                <p>Administration des Contributions Directes</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
