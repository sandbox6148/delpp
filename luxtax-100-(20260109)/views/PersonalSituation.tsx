import React from 'react';
import { FormData, CivilStatus, Taxpayer, TaxStep } from '../types';
import { User, Users, MapPin, Globe } from 'lucide-react';
import { Tooltip } from '../components/Tooltip';

interface Props {
  data: FormData;
  updateData: (data: Partial<FormData>) => void;
  step: TaxStep;
}

export const PersonalSituation: React.FC<Props> = ({ data, updateData, step }) => {
  const handleContribuableChange = (field: keyof Taxpayer, value: string) => {
    updateData({ contribuable: { ...data.contribuable, [field]: value } });
  };

  const handleConjointChange = (field: keyof Taxpayer, value: string) => {
    updateData({ conjoint: { ...data.conjoint, [field]: value } });
  };

  const handleAddressChange = (field: string, value: string) => {
    updateData({ address: { ...data.address, [field]: value } });
  };

  const isNonResident = data.address.country !== 'Luxembourg';
  const isCouple = [CivilStatus.MARRIED, CivilStatus.PARTNER].includes(data.civilStatus);
  const showCivilStatusDate = [CivilStatus.MARRIED, CivilStatus.PARTNER, CivilStatus.DIVORCED, CivilStatus.WIDOWED].includes(data.civilStatus);

  // --- RENDER CONTRIBUABLE ---
  if (step === TaxStep.SITUATION_CONTRIBUABLE) {
    return (
      <div className="space-y-8 animate-fade-in">

        {/* 1. IDENTITE CONTRIBUABLE */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2 flex items-center gap-2">
            <User size={20} className="text-blue-600" />
            1. Identité du Contribuable
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom (101)</label>
              <input
                type="text"
                value={data.contribuable.lastName}
                onChange={(e) => handleContribuableChange('lastName', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 uppercase"
                placeholder="ex: WEBER"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prénom (103)</label>
              <input
                type="text"
                value={data.contribuable.firstName}
                onChange={(e) => handleContribuableChange('firstName', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                placeholder="ex: Marc"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Matricule national (105)
                <Tooltip content="Numéro d'identification national luxembourgeois à 13 chiffres (format : AAAAMMJJXXXXX)." />
              </label>
              <input
                type="text"
                value={data.contribuable.matricule}
                onChange={(e) => handleContribuableChange('matricule', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 font-mono"
                placeholder="YYYYMMDD XXXXX"
              />
              <p className="text-xs text-gray-400 mt-1">Numéro national à 13 chiffres</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance (105)</label>
              <input
                type="date"
                value={data.contribuable.birthDate}
                onChange={(e) => handleContribuableChange('birthDate', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lieu de naissance (107)</label>
              <input
                type="text"
                value={data.contribuable.birthPlace || ''}
                onChange={(e) => handleContribuableChange('birthPlace', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                placeholder="ex: Luxembourg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pays de naissance (108)</label>
              <input
                type="text"
                value={data.contribuable.birthCountry || ''}
                onChange={(e) => handleContribuableChange('birthCountry', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                placeholder="ex: Luxembourg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Profession (110)</label>
              <input
                type="text"
                value={data.contribuable.profession || ''}
                onChange={(e) => handleContribuableChange('profession', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone (112)</label>
              <input
                type="tel"
                value={data.contribuable.phone || ''}
                onChange={(e) => handleContribuableChange('phone', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Courriel (114)</label>
              <input
                type="email"
                value={data.contribuable.email || ''}
                onChange={(e) => handleContribuableChange('email', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* 2. ETAT CIVIL */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2 flex items-center gap-2">
            <Users size={20} className="text-blue-600" />
            2. État Civil (Page 3)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            {Object.values(CivilStatus).map((status) => (
              <label key={status} className={`
                cursor-pointer border rounded-md p-4 flex items-center gap-3 hover:bg-blue-50 transition-all
                ${data.civilStatus === status ? 'bg-blue-50 border-blue-500 text-blue-700 font-semibold shadow-sm' : 'border-gray-200 text-gray-600'}
              `}>
                <input
                  type="radio"
                  name="civilStatus"
                  value={status}
                  checked={data.civilStatus === status}
                  onChange={() => updateData({ civilStatus: status })}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                {status}
              </label>
            ))}
          </div>

          {showCivilStatusDate && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date du changement d'état civil (Case 305)
                <Tooltip content="Date du mariage, du partenariat, du divorce ou du décès du conjoint." />
              </label>
              <input
                type="date"
                value={data.civilStatusDate || ''}
                onChange={(e) => updateData({ civilStatusDate: e.target.value })}
                className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
          )}
        </div>

        {/* 3. ADRESSE */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2 flex items-center gap-2">
            <MapPin size={20} className="text-blue-600" />
            3. Adresse du domicile
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">N° (117)</label>
              <input
                type="text"
                value={data.address.number}
                onChange={(e) => handleAddressChange('number', e.target.value)}
                className="w-full px-4 py-2 border rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                placeholder="12A"
              />
            </div>
            <div className="md:col-span-5">
              <label className="block text-sm font-medium text-gray-700 mb-1">Rue (116)</label>
              <input
                type="text"
                value={data.address.street}
                onChange={(e) => handleAddressChange('street', e.target.value)}
                className="w-full px-4 py-2 border rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Grand-Rue"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Code Postal (120)</label>
              <input
                type="text"
                value={data.address.postalCode}
                onChange={(e) => handleAddressChange('postalCode', e.target.value)}
                className="w-full px-4 py-2 border rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                placeholder="L-1234"
              />
            </div>
            <div className="md:col-span-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Localité (121)</label>
              <input
                type="text"
                value={data.address.city}
                onChange={(e) => handleAddressChange('city', e.target.value)}
                className="w-full px-4 py-2 border rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Luxembourg"
              />
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Pays (124)</label>
              <select
                value={data.address.country}
                onChange={(e) => handleAddressChange('country', e.target.value)}
                className="w-full px-4 py-2 border rounded border-gray-300 bg-white focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Luxembourg">Luxembourg</option>
                <option value="France">France</option>
                <option value="Belgique">Belgique</option>
                <option value="Allemagne">Allemagne</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
          </div>

          {/* ASSIMILATION BLOCK FOR NON-RESIDENTS */}
          {isNonResident && (
            <div className="mt-6 bg-orange-50 border border-orange-200 rounded-lg p-4 animate-fade-in">
              <div className="flex items-start gap-3">
                <Globe className="text-orange-600 mt-1" size={20} />
                <div className="flex-1">
                  <h4 className="font-semibold text-orange-900 mb-1">Imposition des non-résidents</h4>
                  <p className="text-sm text-orange-800 mb-4">
                    En tant que non-résident, vous êtes par défaut imposé uniquement sur vos revenus luxembourgeois.
                    Si au moins 90% de vos revenus mondiaux proviennent du Luxembourg (ou &lt; 13 000€ net hors-Luxembourg),
                    vous pouvez demander à être <strong>assimilé à un résident</strong>.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-orange-900 mb-1">N° identification fiscale étranger (138)</label>
                      <input
                        type="text"
                        value={data.contribuable.foreignTaxId || ''}
                        onChange={(e) => handleContribuableChange('foreignTaxId', e.target.value)}
                        placeholder="Numéro fiscal du pays de résidence"
                        className="w-full px-4 py-2 border border-orange-200 rounded bg-white focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-orange-900 mb-1">Pays émetteur (140)</label>
                      <input
                        type="text"
                        value={data.contribuable.foreignTaxCountry || ''}
                        onChange={(e) => handleContribuableChange('foreignTaxCountry', e.target.value)}
                        placeholder="ex: France, Belgique..."
                        className="w-full px-4 py-2 border border-orange-200 rounded bg-white focus:ring-orange-500"
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-3 p-3 bg-white border border-orange-200 rounded cursor-pointer hover:bg-orange-50/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={data.requestAssimilation}
                      onChange={(e) => updateData({ requestAssimilation: e.target.checked })}
                      className="w-5 h-5 text-orange-600 focus:ring-orange-500 rounded border-gray-300"
                    />
                    <span className="text-gray-800 font-medium text-sm">
                      Demander l'assimilation fiscale (Article 157ter L.I.R.)
                      <span className="block text-xs text-gray-500 font-normal mt-0.5">Permet de bénéficier des mêmes déductions et classes d'impôt que les résidents.</span>
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- RENDER CONJOINT ---
  if (step === TaxStep.SITUATION_CONJOINT) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2 flex items-center gap-2">
            <Users size={20} className="text-purple-600" />
            Identité du Conjoint / Partenaire
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom (102)</label>
              <input
                type="text"
                value={data.conjoint.lastName}
                onChange={(e) => handleConjointChange('lastName', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 uppercase"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prénom (104)</label>
              <input
                type="text"
                value={data.conjoint.firstName}
                onChange={(e) => handleConjointChange('firstName', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Matricule (106)</label>
              <input
                type="text"
                value={data.conjoint.matricule}
                onChange={(e) => handleConjointChange('matricule', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 font-mono"
                placeholder="13 chiffres"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance (106)</label>
              <input
                type="date"
                value={data.conjoint.birthDate}
                onChange={(e) => handleConjointChange('birthDate', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Profession (111)</label>
              <input
                type="text"
                value={data.conjoint.profession || ''}
                onChange={(e) => handleConjointChange('profession', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone (113)</label>
              <input
                type="tel"
                value={data.conjoint.phone || ''}
                onChange={(e) => handleConjointChange('phone', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Courriel (115)</label>
              <input
                type="email"
                value={data.conjoint.email || ''}
                onChange={(e) => handleConjointChange('email', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            {isNonResident && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">N° fiscal étranger conjoint (139)</label>
                <input
                  type="text"
                  value={data.conjoint.foreignTaxId || ''}
                  onChange={(e) => handleConjointChange('foreignTaxId', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
};
