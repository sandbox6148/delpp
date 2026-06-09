import React from 'react';
import { FormData, CivilStatus } from '../types';
import { Card, SectionTitle } from '../components/ui/Card';
import { Repeat, CheckCircle, AlertCircle } from 'lucide-react';

interface Props { data: FormData; updateData: (d: Partial<FormData>) => void; }

// Données de démonstration simulées (pas de backend)
const DEMO_DATA: Partial<FormData> = {
  contribuable: {
    nom: 'MÜLLER',
    prenom: 'Jean',
    matricule: '1985010112345',
    dateNaissance: '1985-01-01',
    telephone: '+352 661 000 001',
    email: 'jean.muller@example.lu',
    civilStatus: CivilStatus.MARRIED,
    civilStatusDate: '2012-06-15',
    changedStatusInYear: false,
  },
};

export const Preremplissage: React.FC<Props> = ({ data, updateData }) => {
  const [prefilled, setPrefilled] = React.useState(false);

  const handlePrefill = () => {
    updateData(DEMO_DATA);
    setPrefilled(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <SectionTitle icon={<Repeat size={22} />} separator>
          Préremplissage automatique
        </SectionTitle>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex gap-3">
          <AlertCircle size={18} className="text-blue-500 mt-0.5 shrink-0" />
          <div className="text-sm text-blue-700">
            <p className="font-medium mb-1">Simulation (version démo)</p>
            <p>
              En production, ce bouton déclencherait une authentification LuxTrust et récupérerait
              vos données réelles depuis le RNPP, la CCSS et l'ACD. Dans cette version, des données
              d'exemple seront injectées.
            </p>
          </div>
        </div>

        {!prefilled ? (
          <div className="text-center py-6">
            <p className="text-gray-600 mb-6">
              Souhaitez-vous préremplir automatiquement vos informations personnelles
              depuis les sources officielles ?
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handlePrefill}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
              >
                <Repeat size={18} />
                Oui, préremplir mes données
              </button>
              <button
                onClick={() => setPrefilled(true)}
                className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Non, je saisirai manuellement
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle size={20} className="text-green-600" />
            <p className="text-green-700 text-sm font-medium">
              Données préremplies — vous pouvez les vérifier et corriger à l'étape suivante.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};
