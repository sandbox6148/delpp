import React from 'react';
import { FormData, FilledBy } from '../types';
import { Card, SectionTitle } from '../components/ui/Card';
import { UserCheck, UserCog } from 'lucide-react';

interface Props { data: FormData; updateData: (d: Partial<FormData>) => void; }

export const QuiRemplit: React.FC<Props> = ({ data, updateData }) => {
  const select = (filledBy: FilledBy) => {
    const isAuthenticated = filledBy === 'CONTRIBUABLE' ? data.isAuthenticated : false;
    updateData({ filledBy, isAuthenticated, canPrefill: filledBy === 'CONTRIBUABLE' && isAuthenticated });
  };

  const options: { value: FilledBy; label: string; desc: string; icon: React.ElementType }[] = [
    {
      value: 'CONTRIBUABLE',
      label: 'Je remplis moi-même',
      desc: 'Vous êtes le contribuable ou votre conjoint. Vous pouvez utiliser votre LuxTrust pour préremplir certaines données.',
      icon: UserCheck,
    },
    {
      value: 'MANDATAIRE',
      label: 'Je suis mandataire',
      desc: 'Vous remplissez la déclaration pour le compte d\'un contribuable (fiduciaire, expert-comptable, proche…).',
      icon: UserCog,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <SectionTitle icon={<UserCog size={22} />} separator>
          Qui remplit cette déclaration ?
        </SectionTitle>
        <p className="text-gray-500 text-sm mb-6">
          Cette information conditionne la suite du parcours, notamment la possibilité de
          préremplir automatiquement vos données depuis les sources officielles.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {options.map(({ value, label, desc, icon: Icon }) => {
            const isActive = data.filledBy === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => select(value)}
                className={`flex flex-col items-start gap-3 p-5 rounded-lg border-2 text-left transition-all ${
                  isActive
                    ? 'border-blue-500 bg-blue-50 shadow-sm'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }`}
              >
                <div className={`p-2 rounded-lg ${isActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                  <Icon size={24} />
                </div>
                <div>
                  <p className={`font-semibold ${isActive ? 'text-blue-700' : 'text-gray-800'}`}>{label}</p>
                  <p className="text-sm text-gray-500 mt-1">{desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        {data.filledBy === 'CONTRIBUABLE' && (
          <div className="mt-6 border-t pt-5">
            <p className="text-sm font-medium text-gray-700 mb-3">
              Disposez-vous d'un moyen d'authentification LuxTrust ou eID ?
            </p>
            <div className="flex gap-4">
              {[true, false].map(val => (
                <label key={String(val)} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="isAuthenticated"
                    checked={data.isAuthenticated === val}
                    onChange={() => updateData({
                      isAuthenticated: val,
                      canPrefill: val,
                    })}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{val ? 'Oui' : 'Non'}</span>
                </label>
              ))}
            </div>
            {data.isAuthenticated && (
              <p className="mt-3 text-xs text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2">
                Vous pourrez préremplir certaines données à l'étape suivante.
              </p>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};
