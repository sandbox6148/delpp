import React, { useState, useEffect } from 'react';
import { TaxStep, FormData, INITIAL_DATA, CivilStatus, ExpenseType } from './types';
import { Sidebar } from './components/Sidebar';
import { PersonalSituation } from './views/PersonalSituation';
import { Children } from './views/Children';
import { Selection } from './views/Selection';
import { Incomes } from './views/Incomes';
import { Expenses } from './views/Expenses';
import { Summary } from './views/Summary';
import { Welcome } from './views/Welcome';
import { OptionsImposition } from './views/OptionsImposition';
import { IndependentIncomes } from './views/IndependentIncomes';
import { DiversIncomes } from './views/DiversIncomes';
import { ExtraordinaryIncomes } from './views/ExtraordinaryIncomes';
import { AlimonyExpenses } from './views/AlimonyExpenses';
import { InvalidityExpenses } from './views/InvalidityExpenses';
import { DiversesDemandes } from './views/DiversesDemandes';
import { FileText, Lock, Menu, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';

const FULL_STEPS_ORDER = [
  TaxStep.WELCOME,
  TaxStep.SITUATION_CONTRIBUABLE,
  TaxStep.SITUATION_CONJOINT,
  TaxStep.ENFANTS,
  TaxStep.OPTIONS,
  TaxStep.SELECTION,

  // Revenus
  TaxStep.SALAIRES,
  TaxStep.PENSIONS,
  TaxStep.COMMERCIAUX,
  TaxStep.AGRICOLE,
  TaxStep.LIBERAL,
  TaxStep.CAPITAUX,
  TaxStep.LOCATION,
  TaxStep.DIVERS,
  TaxStep.EXTRAORDINAIRES,

  // Dépenses spéciales
  TaxStep.DS_INTERETS,
  TaxStep.DS_ASSURANCES,
  TaxStep.DS_VIEILLESSE,
  TaxStep.DS_LOGEMENT,
  TaxStep.DS_LIBERALITES,
  TaxStep.DS_RENTES,

  // Abattements
  TaxStep.CE_GARDE,
  TaxStep.CE_DOMESTICITE,
  TaxStep.CE_INVALIDITE,

  // Finalisation
  TaxStep.DIVERSES_DEMANDES,

  TaxStep.RECAP
];

function App() {
  const [currentStep, setCurrentStep] = useState<TaxStep>(TaxStep.WELCOME);
  const [formData, setFormData] = useState<FormData>(INITIAL_DATA);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getStepsOrder = () => {
    let steps = [...FULL_STEPS_ORDER];
    const isCouple = [CivilStatus.MARRIED, CivilStatus.PARTNER].includes(formData.civilStatus);
    const sel = formData.selectedSections;

    if (!isCouple) steps = steps.filter(s => s !== TaxStep.SITUATION_CONJOINT);
    if (!isCouple) steps = steps.filter(s => s !== TaxStep.OPTIONS);

    // Revenus
    if (!sel.hasSalaries) steps = steps.filter(s => s !== TaxStep.SALAIRES);
    if (!sel.hasPensions) steps = steps.filter(s => s !== TaxStep.PENSIONS);
    if (!sel.hasCommercial) steps = steps.filter(s => s !== TaxStep.COMMERCIAUX);
    if (!sel.hasAgricole) steps = steps.filter(s => s !== TaxStep.AGRICOLE);
    if (!sel.hasLiberal) steps = steps.filter(s => s !== TaxStep.LIBERAL);
    if (!sel.hasCapitals) steps = steps.filter(s => s !== TaxStep.CAPITAUX);
    if (!sel.hasRentals) steps = steps.filter(s => s !== TaxStep.LOCATION);
    if (!sel.hasDiversIncomes) steps = steps.filter(s => s !== TaxStep.DIVERS);
    if (!sel.hasExtraordinaryIncomes) steps = steps.filter(s => s !== TaxStep.EXTRAORDINAIRES);

    // Dépenses
    if (!sel.hasDebitInterests) steps = steps.filter(s => s !== TaxStep.DS_INTERETS);
    if (!sel.hasInsurances) steps = steps.filter(s => s !== TaxStep.DS_ASSURANCES);
    if (!sel.hasPensionPlans) steps = steps.filter(s => s !== TaxStep.DS_VIEILLESSE);
    if (!sel.hasHomeSavings) steps = steps.filter(s => s !== TaxStep.DS_LOGEMENT);
    if (!sel.hasDonations) steps = steps.filter(s => s !== TaxStep.DS_LIBERALITES);
    if (!sel.hasAlimony) steps = steps.filter(s => s !== TaxStep.DS_RENTES);

    // Abattements
    if (!sel.hasChildcare) steps = steps.filter(s => s !== TaxStep.CE_GARDE);
    if (!sel.hasDomesticHelp) steps = steps.filter(s => s !== TaxStep.CE_DOMESTICITE);
    if (!sel.hasInvalidity) steps = steps.filter(s => s !== TaxStep.CE_INVALIDITE);

    return steps;
  };

  const currentStepsOrder = getStepsOrder();

  useEffect(() => {
    if (!currentStepsOrder.includes(currentStep)) {
      const fullIndex = FULL_STEPS_ORDER.indexOf(currentStep);
      for (let i = fullIndex - 1; i >= 0; i--) {
        const step = FULL_STEPS_ORDER[i];
        if (currentStepsOrder.includes(step)) {
          setCurrentStep(step);
          return;
        }
      }
      setCurrentStep(TaxStep.WELCOME);
    }
  }, [formData.selectedSections, formData.civilStatus]);

  const updateData = (newData: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const handleStepChange = (step: TaxStep) => {
    setCurrentStep(step);
    setIsMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const currentStepIndex = currentStepsOrder.indexOf(currentStep);
  const isLastStep = currentStepIndex === currentStepsOrder.length - 1;

  const handleNext = () => {
    if (!isLastStep) handleStepChange(currentStepsOrder[currentStepIndex + 1]);
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) handleStepChange(currentStepsOrder[currentStepIndex - 1]);
  };

  const renderStep = () => {
    switch (currentStep) {
      case TaxStep.WELCOME:
        return <Welcome onStart={handleNext} />;

      case TaxStep.SITUATION_CONTRIBUABLE:
        return <PersonalSituation data={formData} updateData={updateData} step={TaxStep.SITUATION_CONTRIBUABLE} />;
      case TaxStep.SITUATION_CONJOINT:
        return <PersonalSituation data={formData} updateData={updateData} step={TaxStep.SITUATION_CONJOINT} />;

      case TaxStep.ENFANTS:
        return <Children data={formData} updateData={updateData} />;

      case TaxStep.OPTIONS:
        return <OptionsImposition data={formData} updateData={updateData} />;

      case TaxStep.SELECTION:
        return <Selection data={formData} updateData={updateData} />;

      // Revenus salariés
      case TaxStep.SALAIRES:
        return <Incomes data={formData} updateData={updateData} section="S" />;
      case TaxStep.PENSIONS:
        return <Incomes data={formData} updateData={updateData} section="P" />;

      // Revenus indépendants
      case TaxStep.COMMERCIAUX:
        return <IndependentIncomes data={formData} updateData={updateData} section="COMMERCIAL" />;
      case TaxStep.AGRICOLE:
        return <IndependentIncomes data={formData} updateData={updateData} section="AGRICOLE" />;
      case TaxStep.LIBERAL:
        return <IndependentIncomes data={formData} updateData={updateData} section="LIBERAL" />;

      // Revenus patrimoniaux
      case TaxStep.CAPITAUX:
        return <Incomes data={formData} updateData={updateData} section="CM" />;
      case TaxStep.LOCATION:
        return <Incomes data={formData} updateData={updateData} section="L" />;

      // Revenus divers / extraordinaires
      case TaxStep.DIVERS:
        return <DiversIncomes data={formData} updateData={updateData} />;
      case TaxStep.EXTRAORDINAIRES:
        return <ExtraordinaryIncomes data={formData} updateData={updateData} />;

      // Dépenses spéciales
      case TaxStep.DS_INTERETS:
        return <Expenses data={formData} updateData={updateData} type={ExpenseType.DEBIT_INTEREST} />;
      case TaxStep.DS_ASSURANCES:
        return <Expenses data={formData} updateData={updateData} type={ExpenseType.INSURANCE} />;
      case TaxStep.DS_VIEILLESSE:
        return <Expenses data={formData} updateData={updateData} type={ExpenseType.PENSION_PLAN} />;
      case TaxStep.DS_LOGEMENT:
        return <Expenses data={formData} updateData={updateData} type={ExpenseType.HOME_SAVINGS} />;
      case TaxStep.DS_LIBERALITES:
        return <Expenses data={formData} updateData={updateData} type={ExpenseType.DONATION} />;
      case TaxStep.DS_RENTES:
        return <AlimonyExpenses data={formData} updateData={updateData} />;

      // Abattements
      case TaxStep.CE_GARDE:
        return <Expenses data={formData} updateData={updateData} type={ExpenseType.CHILDCARE} />;
      case TaxStep.CE_DOMESTICITE:
        return <Expenses data={formData} updateData={updateData} type={ExpenseType.DOMESTIC_HELP} />;
      case TaxStep.CE_INVALIDITE:
        return <InvalidityExpenses data={formData} updateData={updateData} />;

      // Finalisation
      case TaxStep.DIVERSES_DEMANDES:
        return <DiversesDemandes data={formData} updateData={updateData} />;
      case TaxStep.RECAP:
        return <Summary data={formData} />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20 h-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden text-gray-500 hover:text-gray-700"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu size={24} />
            </button>
            <div className="bg-red-600 text-white p-1.5 rounded shadow-sm">
              <span className="font-bold text-lg tracking-tighter">CTIE</span>
            </div>
            <div className="h-8 w-px bg-gray-300 mx-1 hidden sm:block"></div>
            <h1 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <FileText className="text-blue-600" size={20} />
              <span className="hidden sm:inline">LuxTax 100</span>
            </h1>
          </div>
          <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 px-3 py-1.5 rounded-full border border-green-200 font-medium">
            <Lock size={12} />
            <span>Données sécurisées</span>
          </div>
        </div>
      </header>

      {/* Layout */}
      <div className="flex flex-1 max-w-7xl mx-auto w-full">

        {/* Desktop Sidebar */}
        <Sidebar
          currentStep={currentStep}
          onStepClick={handleStepChange}
          civilStatus={formData.civilStatus}
          selection={formData.selectedSections}
        />

        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <div className="relative flex-1 bg-white w-64 max-w-xs h-full shadow-xl" onClick={(e) => e.stopPropagation()}>
              <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                <span className="font-semibold text-gray-700">Menu</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-500">Fermer</button>
              </div>
              <div className="h-full overflow-y-auto pb-20">
                <Sidebar
                  currentStep={currentStep}
                  onStepClick={handleStepChange}
                  civilStatus={formData.civilStatus}
                  selection={formData.selectedSections}
                />
              </div>
            </div>
            <div className="flex-1 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)}></div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto flex flex-col">
          <div className="max-w-5xl mx-auto w-full flex-grow">
            {renderStep()}
          </div>

          {/* Navigation Buttons */}
          {currentStep !== TaxStep.WELCOME && (
            <div className="max-w-3xl mx-auto w-full mt-8 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <button
                  onClick={handlePrev}
                  disabled={currentStep === TaxStep.SITUATION_CONTRIBUABLE}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-lg border font-medium transition-colors ${
                    currentStep === TaxStep.SITUATION_CONTRIBUABLE
                      ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                  }`}
                >
                  <ArrowLeft size={18} />
                  Précédent
                </button>

                {!isLastStep ? (
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-sm hover:shadow"
                  >
                    Suivant
                    <ArrowRight size={18} />
                  </button>
                ) : (
                  <button
                    disabled
                    className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-green-600 text-white font-medium opacity-90 cursor-default"
                  >
                    Terminé
                    <CheckCircle size={18} />
                  </button>
                )}
              </div>

              <div className="mt-8 text-center text-xs text-gray-400">
                <p>Modèle 100 — Année d'imposition 2024</p>
                <p>Administration des contributions directes</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
