import React from 'react';
import { User, Home, Users, Briefcase, TrendingUp, PiggyBank, CheckSquare, FileSignature, ArrowRight, Settings } from 'lucide-react';

interface Props {
  onStart: () => void;
}

export const Welcome: React.FC<Props> = ({ onStart }) => {
  return (
    <div className="animate-fade-in space-y-10 pb-10">
      <div className="text-center space-y-4 mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Votre Parcours Fiscal 2024
        </h1>
        <p className="text-xl text-blue-600 font-medium">
          Le Guide de la Déclaration d'Impôts au Luxembourg
        </p>
        <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Cette infographie décompose le formulaire officiel de déclaration d'impôts luxembourgeois (modèle 100F) en un parcours clair en quatre étapes. Elle met en lumière les informations essentielles à fournir à chaque grande phase du processus.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Etape 1 */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md hover:border-blue-200 transition-all">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform scale-150">
            <User size={100} className="text-blue-600" />
          </div>
          <div className="relative">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xl font-bold shadow-sm">1</div>
                <h3 className="text-xl font-bold text-gray-800">Identification & Situation Personnelle</h3>
            </div>
            
            <ul className="space-y-4">
              <li className="flex gap-4">
                <div className="shrink-0 mt-1"><User className="text-blue-500" size={20} /></div>
                <div>
                  <span className="font-bold text-gray-800 block">Identifiez-vous</span>
                  <span className="text-gray-600 text-sm">Renseignez vos informations personnelles, numéro d'identification national et adresse.</span>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="shrink-0 mt-1"><Home className="text-blue-500" size={20} /></div>
                <div>
                  <span className="font-bold text-gray-800 block">Précisez votre situation familiale</span>
                  <span className="text-gray-600 text-sm">Déclarez votre état civil et la présence d'enfants dans votre ménage.</span>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="shrink-0 mt-1"><Users className="text-blue-500" size={20} /></div>
                <div>
                  <span className="font-bold text-gray-800 block">Choisissez votre mode d'imposition</span>
                  <span className="text-gray-600 text-sm">Optez pour une imposition collective ou individuelle si vous êtes marié(e) ou pacsé(e).</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Etape 2 */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md hover:border-green-200 transition-all">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform scale-150">
             <Briefcase size={100} className="text-green-600" />
          </div>
          <div className="relative">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-xl font-bold shadow-sm">2</div>
                <h3 className="text-xl font-bold text-gray-800">Déclaration des Revenus</h3>
            </div>
            <ul className="space-y-4">
              <li className="flex gap-4">
                <div className="shrink-0 mt-1"><Briefcase className="text-green-500" size={20} /></div>
                <div>
                  <span className="font-bold text-gray-800 block">Revenus d'occupation salariée (S) ou Pensions (P)</span>
                  <span className="text-gray-600 text-sm">Reportez les montants indiqués sur vos certificats de salaire et de pension.</span>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="shrink-0 mt-1"><TrendingUp className="text-green-500" size={20} /></div>
                <div>
                  <span className="font-bold text-gray-800 block">Revenus de votre patrimoine (L, V, CM)</span>
                  <span className="text-gray-600 text-sm">Déclarez les revenus de location et les revenus de capitaux mobiliers.</span>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="shrink-0 mt-1"><Settings className="text-green-500" size={20} /></div>
                <div>
                  <span className="font-bold text-gray-800 block">Autres revenus</span>
                  <span className="text-gray-600 text-sm">Indiquez les bénéfices commerciaux, agricoles ou issus d'une profession libérale.</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Etape 3 */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md hover:border-purple-200 transition-all">
           <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform scale-150">
             <PiggyBank size={100} className="text-purple-600" />
          </div>
          <div className="relative">
             <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 text-xl font-bold shadow-sm">3</div>
                <h3 className="text-xl font-bold text-gray-800">Optimisation : Dépenses et Charges</h3>
            </div>
             <ul className="space-y-4">
              <li className="flex gap-4">
                <div className="shrink-0 mt-1"><PiggyBank className="text-purple-500" size={20} /></div>
                <div>
                  <span className="font-bold text-gray-800 block">Déduisez vos dépenses spéciales</span>
                  <span className="text-gray-600 text-sm">Incluez les intérêts débiteurs, primes d'assurances et cotisations de prévoyance-vieillesse.</span>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="shrink-0 mt-1"><Users className="text-purple-500" size={20} /></div>
                <div>
                  <span className="font-bold text-gray-800 block">Valorisez vos charges extraordinaires</span>
                  <span className="text-gray-600 text-sm">Déclarez les frais de domesticité, de garde d'enfant ou liés à une invalidité.</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Etape 4 */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md hover:border-gray-300 transition-all">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform scale-150">
             <CheckSquare size={100} className="text-gray-600" />
          </div>
          <div className="relative">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 text-xl font-bold shadow-sm">4</div>
                <h3 className="text-xl font-bold text-gray-800">Finalisation et Envoi</h3>
            </div>
            <ul className="space-y-4">
              <li className="flex gap-4">
                <div className="shrink-0 mt-1"><CheckSquare className="text-gray-500" size={20} /></div>
                <div>
                  <span className="font-bold text-gray-800 block">Récapitulez vos données</span>
                  <span className="text-gray-600 text-sm">La dernière page calcule le total des revenus et votre revenu imposable final.</span>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="shrink-0 mt-1"><FileSignature className="text-gray-500" size={20} /></div>
                <div>
                  <span className="font-bold text-gray-800 block">Signez et soumettez avant la date limite</span>
                  <span className="text-gray-600 text-sm">À remettre avant le 31 décembre 2025 ; une déclaration non signée est non avenue.</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

      </div>

      <div className="flex justify-center pt-8">
        <button 
          onClick={onStart}
          className="group bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold px-10 py-5 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-3 transform hover:-translate-y-1"
        >
          Commencer ma déclaration
          <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};