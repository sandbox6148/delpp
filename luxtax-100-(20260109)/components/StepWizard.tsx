import React from 'react';
import { TaxStep } from '../types';
import { User, DollarSign, FileText, CheckCircle } from 'lucide-react';

interface StepWizardProps {
  currentStep: TaxStep;
  onStepClick: (step: TaxStep) => void;
}

export const StepWizard: React.FC<StepWizardProps> = ({ currentStep, onStepClick }) => {
  // Do not render on Welcome screen
  if (currentStep === TaxStep.WELCOME) return null;

  const steps = [
    { 
      id: TaxStep.SITUATION_CONTRIBUABLE, 
      label: 'Signalétique', 
      icon: User,
      includes: [
        TaxStep.SITUATION_CONTRIBUABLE, 
        TaxStep.SITUATION_CONJOINT, 
        TaxStep.ENFANTS,
        TaxStep.SELECTION
      ]
    },
    { 
      id: TaxStep.SALAIRES, 
      label: 'Revenus', 
      icon: DollarSign,
      includes: [
        TaxStep.SALAIRES, 
        TaxStep.PENSIONS, 
        TaxStep.CAPITAUX, 
        TaxStep.LOCATION
      ]
    },
    { 
      id: TaxStep.DS_INTERETS, 
      label: 'Dépenses', 
      icon: FileText,
      includes: [
        TaxStep.DS_INTERETS, 
        TaxStep.DS_ASSURANCES, 
        TaxStep.DS_VIEILLESSE, 
        TaxStep.DS_LOGEMENT, 
        TaxStep.DS_LIBERALITES, 
        TaxStep.CE_GARDE, 
        TaxStep.CE_DOMESTICITE
      ]
    },
    { 
      id: TaxStep.RECAP, 
      label: 'Récapitulatif', 
      icon: CheckCircle,
      includes: [TaxStep.RECAP]
    },
  ];

  const getStepStatus = (step: typeof steps[0]) => {
    if (step.includes.includes(currentStep)) return 'current';

    const stepOrder = Object.values(TaxStep);
    const currentIndex = stepOrder.indexOf(currentStep);
    
    // Check if we are past this group
    // A simple heuristic: find the last step of this group. If currentStep is after it, it's completed.
    const lastStepInGroup = step.includes[step.includes.length - 1];
    const lastStepIndex = stepOrder.indexOf(lastStepInGroup);
    
    if (currentIndex > lastStepIndex) return 'completed';
    return 'upcoming';
  };

  return (
    <nav aria-label="Progress" className="mb-8 hidden lg:block">
      <ol role="list" className="overflow-hidden rounded-md flex border border-gray-200">
        {steps.map((step, stepIdx) => {
          const status = getStepStatus(step);
          const Icon = step.icon;
          
          return (
            <li key={step.id} className="relative flex-1">
              <div 
                className={`border-b border-gray-200 lg:border-b-0 ${stepIdx !== 0 ? 'border-l' : ''}`}
              >
                <button 
                  onClick={() => onStepClick(step.id)}
                  className="group w-full h-full"
                  disabled={status === 'upcoming'}
                >
                  <span
                    className={`absolute top-0 left-0 h-1 w-full ${
                      status === 'current' ? 'bg-blue-600' : 
                      status === 'completed' ? 'bg-green-500' : 'bg-transparent'
                    }`}
                    aria-hidden="true"
                  />
                  <span className="flex items-start px-6 py-5 text-sm font-medium">
                    <span className="flex-shrink-0">
                      <span
                        className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                          status === 'current' ? 'border-blue-600 text-blue-600' :
                          status === 'completed' ? 'border-green-500 bg-green-500 text-white' :
                          'border-gray-300 text-gray-400'
                        }`}
                      >
                         <Icon className="w-5 h-5" />
                      </span>
                    </span>
                    <span className="ml-4 mt-1 flex min-w-0 flex-col text-left">
                      <span className={`text-sm font-bold ${
                         status === 'current' ? 'text-blue-600' : 
                         status === 'completed' ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {step.label}
                      </span>
                    </span>
                  </span>
                </button>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};