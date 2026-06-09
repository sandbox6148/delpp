import React from 'react';
import { FormData, TaxImpositionType, CivilStatus } from '../types';
import { Scale, Users, User, Info } from 'lucide-react';

interface Props {
  data: FormData;
  updateData: (data: Partial<FormData>) => void;
}

export const OptionsImposition: React.FC<Props> = ({ data, updateData }) => {
  const isCouple = [CivilStatus.MARRIED, CivilStatus.PARTNER].includes(data.civilStatus);

  const updateOption = (impositionType: TaxImpositionType) => {
    updateData({ taxOptions: { ...data.taxOptions, impositionType } });
  };

  const options = [
    {
      value: TaxImpositionType.COLLECTIVE,
      label: 'Imposition collective (Case 401)',
      icon: Users,
      color: 'text-blue-600',
      description: 'Les revenus des deux conjoints sont regroupés et imposés ensemble en classe 2. Généralement avantageuse lorsque les revenus des époux sont inégaux.',
    },
    {
      value: TaxImpositionType.INDIVIDUAL_PURE,
      label: 'Imposition individuelle pure (Case 402)',
      icon: User,
      color: 'text-purple-600',
      description: 'Chaque conjoint est imposé séparément sur ses propres revenus, en classe 1 ou 1a. Avantageuse lorsque les deux époux ont des revenus similaires.',
    },
    {
      value: TaxImpositionType.INDIVIDUAL_REALLOCATED,
      label: 'Imposition individuelle avec réallocation (Case 403)',
      icon: Scale,
      color: 'text-indigo-600',
      description: 'Chaque conjoint est imposé séparément, mais avec la possibilité de réallouer certains revenus ou déductions entre eux. Option intermédiaire.',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {!isCouple && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
          <Info className="text-amber-600 mt-0.5" size={20} />
          <p className="text-sm text-amber-800">
            Cette page concerne uniquement les personnes mariées ou en partenariat. Pour les célibataires, divorcés ou veufs, l'imposition est individuelle par défaut.
          </p>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-2 border-b pb-2 flex items-center gap-2">
          <Scale size={20} className="text-blue-600" />
          Page 4 — Options en matière d'imposition
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Si vous êtes marié(e) ou en partenariat, vous pouvez choisir votre mode d'imposition. L'option s'applique à l'ensemble de l'année fiscale 2024.
        </p>

        <div className="space-y-4">
          {options.map((opt) => {
            const Icon = opt.icon;
            const isSelected = data.taxOptions.impositionType === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => updateOption(opt.value)}
                disabled={!isCouple}
                className={`w-full flex items-start gap-4 p-4 rounded-lg border-2 transition-all text-left
                  ${isSelected ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-gray-200 hover:border-gray-300 bg-white'}
                  ${!isCouple ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                <div className={`p-3 rounded-full ${isSelected ? 'bg-blue-100' : 'bg-gray-100'}`}>
                  <Icon size={22} className={isSelected ? opt.color : 'text-gray-400'} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className={`font-semibold ${isSelected ? 'text-gray-900' : 'text-gray-500'}`}>{opt.label}</h3>
                    {isSelected && <span className="text-blue-600 text-xs font-bold px-2 py-1 bg-blue-100 rounded-full">Sélectionné</span>}
                  </div>
                  <p className="text-sm text-gray-500">{opt.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-900">
        <strong>Note :</strong> En l'absence d'option expresse, l'imposition collective est appliquée par défaut pour les couples mariés ou en partenariat.
        L'option pour l'imposition individuelle doit être exercée chaque année.
      </div>
    </div>
  );
};
