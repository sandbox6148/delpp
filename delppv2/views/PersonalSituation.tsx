import React from 'react';
import { FormData, Personne, Adresse, CivilStatus, CIVIL_STATUS_LABELS, TaxStep } from '../types';
import { Card, SectionTitle } from '../components/ui/Card';
import { Field, inputClass, selectClass, CheckboxField } from '../components/ui/Field';
import { User, Users, MapPin } from 'lucide-react';

interface Props {
  data: FormData;
  updateData: (d: Partial<FormData>) => void;
  step: TaxStep.SITUATION_CONTRIBUABLE | TaxStep.SITUATION_CONJOINT;
}

export const PersonalSituation: React.FC<Props> = ({ data, updateData, step }) => {
  const isConjoint = step === TaxStep.SITUATION_CONJOINT;
  const personne: Personne = isConjoint ? data.conjoint : data.contribuable;
  const adresse: Adresse = isConjoint ? data.adresseConjoint : data.adresseContribuable;
  const color = isConjoint ? 'purple' : 'blue';

  const updatePersonne = (fields: Partial<Personne>) => {
    if (isConjoint) updateData({ conjoint: { ...data.conjoint, ...fields } });
    else            updateData({ contribuable: { ...data.contribuable, ...fields } });
  };

  const updateAdresse = (fields: Partial<Adresse>) => {
    if (isConjoint) updateData({ adresseConjoint: { ...data.adresseConjoint, ...fields } });
    else            updateData({ adresseContribuable: { ...data.adresseContribuable, ...fields } });
  };

  const accent = isConjoint
    ? 'border-purple-200 bg-purple-50'
    : 'border-blue-200 bg-blue-50';
  const iconColor = isConjoint ? 'text-purple-600' : 'text-blue-600';

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <SectionTitle icon={isConjoint ? <Users size={22} className={iconColor} /> : <User size={22} className={iconColor} />} separator>
          {isConjoint ? 'Mon conjoint / partenaire' : 'Mes informations personnelles'}
        </SectionTitle>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Nom" required>
            <input type="text" value={personne.nom}
              onChange={e => updatePersonne({ nom: e.target.value })}
              className={inputClass} placeholder="NOM (majuscules)" />
          </Field>
          <Field label="Prénom" required>
            <input type="text" value={personne.prenom}
              onChange={e => updatePersonne({ prenom: e.target.value })}
              className={inputClass} placeholder="Prénom" />
          </Field>
          <Field label="Matricule national (NIN)" required hint="13 chiffres — AAAAMMJJXXXXX">
            <input type="text" value={personne.matricule}
              onChange={e => updatePersonne({ matricule: e.target.value })}
              className={inputClass} placeholder="0000000000000" maxLength={13} />
          </Field>
          <Field label="Date de naissance">
            <input type="date" value={personne.dateNaissance}
              onChange={e => updatePersonne({ dateNaissance: e.target.value })}
              className={inputClass} />
          </Field>
          <Field label="Téléphone">
            <input type="tel" value={personne.telephone}
              onChange={e => updatePersonne({ telephone: e.target.value })}
              className={inputClass} placeholder="+352 000 000" />
          </Field>
          <Field label="Courriel">
            <input type="email" value={personne.email}
              onChange={e => updatePersonne({ email: e.target.value })}
              className={inputClass} placeholder="exemple@email.lu" />
          </Field>
        </div>
      </Card>

      {/* État civil */}
      <Card>
        <h3 className="text-base font-semibold text-gray-700 mb-4">État civil au 1er janvier 2025</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Situation familiale" required>
            <select value={personne.civilStatus}
              onChange={e => updatePersonne({ civilStatus: e.target.value as CivilStatus })}
              className={selectClass}>
              {Object.entries(CIVIL_STATUS_LABELS).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </Field>
          <Field label="Depuis le">
            <input type="date" value={personne.civilStatusDate}
              onChange={e => updatePersonne({ civilStatusDate: e.target.value })}
              className={inputClass} />
          </Field>
        </div>

        <div className="mt-4">
          <CheckboxField
            label="Ma situation familiale a changé en 2025"
            checked={personne.changedStatusInYear}
            onChange={v => updatePersonne({ changedStatusInYear: v })}
          />
          {personne.changedStatusInYear && (
            <div className={`mt-3 p-4 rounded-lg border ${accent}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Nouveau statut">
                  <select value={personne.newCivilStatus ?? ''}
                    onChange={e => updatePersonne({ newCivilStatus: e.target.value as CivilStatus })}
                    className={selectClass}>
                    <option value="">— Sélectionner —</option>
                    {Object.entries(CIVIL_STATUS_LABELS).map(([val, label]) => (
                      <option key={val} value={val}>{label}</option>
                    ))}
                  </select>
                </Field>
                <Field label="À partir du">
                  <input type="date" value={personne.newStatusDate ?? ''}
                    onChange={e => updatePersonne({ newStatusDate: e.target.value })}
                    className={inputClass} />
                </Field>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Adresse */}
      <Card>
        <h3 className="text-base font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <MapPin size={18} className={iconColor} />
          Adresse {isConjoint ? 'du conjoint' : 'du domicile'}
        </h3>

        {isConjoint && (
          <div className="mb-4">
            <CheckboxField
              label="Même adresse que la mienne"
              checked={data.memeAdresseQueConjoint}
              onChange={v => updateData({ memeAdresseQueConjoint: v })}
            />
          </div>
        )}

        {(!isConjoint || !data.memeAdresseQueConjoint) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Rue" className="md:col-span-2">
              <input type="text" value={adresse.rue}
                onChange={e => updateAdresse({ rue: e.target.value })}
                className={inputClass} placeholder="Nom de la rue" />
            </Field>
            <Field label="Numéro">
              <input type="text" value={adresse.numero}
                onChange={e => updateAdresse({ numero: e.target.value })}
                className={inputClass} />
            </Field>
            <Field label="Code postal">
              <input type="text" value={adresse.codePostal}
                onChange={e => updateAdresse({ codePostal: e.target.value })}
                className={inputClass} placeholder="L-0000" />
            </Field>
            <Field label="Ville">
              <input type="text" value={adresse.ville}
                onChange={e => updateAdresse({ ville: e.target.value })}
                className={inputClass} />
            </Field>
            <Field label="Pays">
              <input type="text" value={adresse.pays}
                onChange={e => updateAdresse({ pays: e.target.value })}
                className={inputClass} />
            </Field>
          </div>
        )}
      </Card>
    </div>
  );
};
