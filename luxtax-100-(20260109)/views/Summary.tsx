import React from 'react';
import { FormData, CivilStatus, ExpenseType } from '../types';
import { Calculator, AlertCircle } from 'lucide-react';

interface Props {
  data: FormData;
}

export const Summary: React.FC<Props> = ({ data }) => {
  const isCouple = [CivilStatus.MARRIED, CivilStatus.PARTNER].includes(data.civilStatus);
  const numberOfChildren = data.children.length;
  const householdUnits = 1 + (isCouple ? 1 : 0) + numberOfChildren;

  const fmt = (value: number) =>
    new Intl.NumberFormat('fr-LU', { style: 'currency', currency: 'EUR' }).format(value);

  // ─── 1. REVENUS NETS ────────────────────────────────────────────────────────

  // Salaires
  const getSalaryNet = (ownerId: string) => {
    const entries = data.incomes.filter(i => i.type === 'SALARY' && i.ownerId === ownerId);
    if (!entries.length) return 0;
    const gross = entries.reduce((a, c) => a + c.grossAmount, 0);
    const declaredExpenses = entries.reduce((a, c) => a + c.expenses, 0);
    return Math.max(0, gross - Math.max(declaredExpenses, 540));
  };
  const netSalaryContrib = getSalaryNet('contribuable');
  const netSalaryConjoint = getSalaryNet('conjoint');


  // Pensions
  const getPensionNet = (ownerId: string) => {
    const entries = data.incomes.filter(i => i.type === 'PENSION' && i.ownerId === ownerId);
    if (!entries.length) return 0;
    const gross = entries.reduce((a, c) => a + c.grossAmount, 0);
    return Math.max(0, gross - 300);
  };
  const netPensionContrib = getPensionNet('contribuable');
  const netPensionConjoint = getPensionNet('conjoint');

  // Revenus indépendants (commercial, agricole, libéral)
  const getIndependentNetByType = (ownerId: string, type: 'COMMERCIAL' | 'AGRICOLE' | 'LIBERAL') =>
    data.independentIncomes
      .filter(e => e.ownerId === ownerId && e.type === type)
      .reduce((a, c) => a + Math.max(c.netResult - c.priorLoss, 0), 0);
  const netCommercialContrib = getIndependentNetByType('contribuable', 'COMMERCIAL');
  const netCommercialConjoint = getIndependentNetByType('conjoint', 'COMMERCIAL');
  const netAgricoleContrib = getIndependentNetByType('contribuable', 'AGRICOLE');
  const netAgricoleConjoint = getIndependentNetByType('conjoint', 'AGRICOLE');
  const netLiberalContrib = getIndependentNetByType('contribuable', 'LIBERAL');
  const netLiberalConjoint = getIndependentNetByType('conjoint', 'LIBERAL');
  const netIndepContrib = netCommercialContrib + netAgricoleContrib + netLiberalContrib;
  const netIndepConjoint = netCommercialConjoint + netAgricoleConjoint + netLiberalConjoint;

  // Location
  const maxMainResInterest = 2000 * householdUnits;
  const deductibleMainResInterest = Math.min(data.realEstate.mainResidenceInterest, maxMainResInterest);
  const netRental = data.realEstate.rentalNet - deductibleMainResInterest;

  // Capitaux
  const grossCapital = data.capital.withholding + data.capital.notSubject;
  const exemptionCapital = 1500 * (isCouple ? 2 : 1);
  const netCapital = Math.max(0, grossCapital - exemptionCapital);

  // Revenus divers (déclarés au taux plein, sauf plus-values long terme à demi-taux — simplification)
  const netDivers = data.diverseIncomes.reduce((a, c) => a + c.amount, 0);

  // Revenus extraordinaires (imposés au demi-taux — on les inclut ici à leur valeur brute pour le calcul du revenu global)
  const netExtraordinary = data.extraordinaryIncomes.reduce((a, c) => a + c.amount, 0);

  const totalRevenuNet =
    netSalaryContrib + netSalaryConjoint +
    netPensionContrib + netPensionConjoint +
    netIndepContrib + netIndepConjoint +
    netRental + netCapital + netDivers + netExtraordinary;

  // ─── 2. DÉPENSES SPÉCIALES ──────────────────────────────────────────────────

  const minForfaitDS = isCouple ? 960 : 480;
  const sumExpenses = (type: ExpenseType) =>
    data.expenses.filter(e => e.type === type).reduce((s, e) => s + e.amount, 0);
  const sumExpensesByOwner = (types: ExpenseType[], ownerId: string) =>
    data.expenses.filter(e => types.includes(e.type) && e.ownerId === ownerId).reduce((s, e) => s + e.amount, 0);

  // Assurances + intérêts débiteurs
  const actualInsInt = sumExpenses(ExpenseType.DEBIT_INTEREST) + sumExpenses(ExpenseType.INSURANCE);
  const capInsInt = 672 * householdUnits;
  const deductibleInsInt = Math.min(actualInsInt, capInsInt);
  const insIntContrib = sumExpensesByOwner([ExpenseType.DEBIT_INTEREST, ExpenseType.INSURANCE], 'contribuable');
  const insIntConjoint = sumExpensesByOwner([ExpenseType.DEBIT_INTEREST, ExpenseType.INSURANCE], 'conjoint');
  const baseDSDeduction = Math.max(minForfaitDS, deductibleInsInt);

  // 111bis prévoyance-vieillesse
  const getPensionPlanDeduction = (ownerId: string) =>
    Math.min(data.expenses.filter(e => e.type === ExpenseType.PENSION_PLAN && e.ownerId === ownerId).reduce((s, e) => s + e.amount, 0), 3200);
  const deductiblePensionContrib = getPensionPlanDeduction('contribuable');
  const deductiblePensionConjoint = getPensionPlanDeduction('conjoint');
  const deductiblePensionPlan = deductiblePensionContrib + deductiblePensionConjoint;

  // Épargne logement
  const homeSavingsTotal = sumExpenses(ExpenseType.HOME_SAVINGS);
  const capHomeSavings = 1344 * householdUnits;
  const deductibleHomeSavings = Math.min(homeSavingsTotal, capHomeSavings);
  const homeSavingsContrib = sumExpensesByOwner([ExpenseType.HOME_SAVINGS], 'contribuable');
  const homeSavingsConjoint = sumExpensesByOwner([ExpenseType.HOME_SAVINGS], 'conjoint');

  // Libéralités
  const donationsTotal = sumExpenses(ExpenseType.DONATION);
  const deductibleDonations = donationsTotal >= 120
    ? Math.min(donationsTotal, Math.max(0, totalRevenuNet * 0.20), 1000000)
    : 0;
  const donationsContrib = sumExpensesByOwner([ExpenseType.DONATION], 'contribuable');
  const donationsConjoint = sumExpensesByOwner([ExpenseType.DONATION], 'conjoint');

  // Rentes alimentaires (plafond 24 000€ ex-conjoint, 4 020€/enfant)
  const alimonyPaidTotal = Math.min(sumExpenses(ExpenseType.ALIMONY_PAID), 24000);
  const alimonyChildTotal = sumExpenses(ExpenseType.ALIMONY_CHILD); // déjà cappé par enfant dans la saisie
  const unionFees = sumExpenses(ExpenseType.UNION_FEES);
  const studyLoanInterest = sumExpenses(ExpenseType.STUDY_LOAN_INTEREST);
  const deductibleAlimony = alimonyPaidTotal + alimonyChildTotal + unionFees + studyLoanInterest;

  const totalDS = baseDSDeduction + deductiblePensionPlan + deductibleHomeSavings + deductibleDonations + deductibleAlimony;

  // ─── 3. ABATTEMENTS ─────────────────────────────────────────────────────────

  // Abattement extra-professionnel conjoint
  const abattementConjoint =
    isCouple && netSalaryContrib > 0 && netSalaryConjoint > 0 ? 4500 : 0;

  // Domesticité
  const deductibleDomestic = Math.min(sumExpenses(ExpenseType.DOMESTIC_HELP), 5400);

  // Garde d'enfants (par bénéficiaire, plafond 5 400€)
  const childcareExpenses = data.expenses.filter(e => e.type === ExpenseType.CHILDCARE);
  const childcareOwners = Array.from(new Set(childcareExpenses.map(e => e.ownerId)));
  let deductibleChildcare = 0;
  childcareOwners.forEach(ownerId => {
    const total = childcareExpenses.filter(e => e.ownerId === ownerId).reduce((s, e) => s + e.amount, 0);
    deductibleChildcare += Math.min(total, 5400);
  });

  // Frais invalidité (déductibles dans la limite de la charge extraordinaire nette)
  const invalidityTotal = sumExpenses(ExpenseType.INVALIDITY) + sumExpenses(ExpenseType.INVALIDITY_MEDICAL);

  const totalAbattements = abattementConjoint + deductibleDomestic + deductibleChildcare + invalidityTotal;

  // ─── 4. RÉSULTAT ────────────────────────────────────────────────────────────
  const revenuImposable = Math.max(0, totalRevenuNet - totalDS - totalAbattements);

  const CoupleBreakdown = ({ label1, val1, label2, val2 }: { label1: string; val1: number; label2: string; val2: number }) => {
    if (!isCouple) return null;
    return (
      <div className="mt-1 pl-3 border-l-2 border-gray-100 text-xs text-gray-500 space-y-0.5">
        <div className="flex justify-between w-full max-w-xs">
          <span>{label1} :</span><span>{fmt(val1)}</span>
        </div>
        <div className="flex justify-between w-full max-w-xs">
          <span>{label2} :</span><span>{fmt(val2)}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <Calculator className="text-blue-600 mt-1" size={24} />
        <div>
          <h3 className="font-semibold text-blue-900 text-lg">Estimation Fiscale</h3>
          <p className="text-sm text-blue-800">
            Calcul détaillé de votre revenu imposable selon les règles 2024.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left: Details */}
        <div className="lg:col-span-2 space-y-6">

          {/* 1. Revenus nets */}
          <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4 border-b pb-2 flex justify-between items-center">
              <span>1. Revenus Nets</span>
              <span className="text-blue-600">{fmt(totalRevenuNet)}</span>
            </h3>
            <div className="space-y-4 text-sm text-gray-600">

              {(netSalaryContrib + netSalaryConjoint) > 0 && (
                <div className="pt-2 border-t border-gray-50">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">Salaires nets</span>
                    <span className="font-semibold text-gray-900">{fmt(netSalaryContrib + netSalaryConjoint)}</span>
                  </div>
                  <CoupleBreakdown label1="Contribuable" val1={netSalaryContrib} label2="Conjoint" val2={netSalaryConjoint} />
                </div>
              )}

              {(netPensionContrib + netPensionConjoint) > 0 && (
                <div className="pt-2 border-t border-gray-50">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">Pensions nettes</span>
                    <span className="font-semibold text-gray-900">{fmt(netPensionContrib + netPensionConjoint)}</span>
                  </div>
                  <CoupleBreakdown label1="Contribuable" val1={netPensionContrib} label2="Conjoint" val2={netPensionConjoint} />
                </div>
              )}

              {(netCommercialContrib + netCommercialConjoint) > 0 && (
                <div className="pt-2 border-t border-gray-50">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">Bénéfices commerciaux nets</span>
                    <span className="font-semibold text-gray-900">{fmt(netCommercialContrib + netCommercialConjoint)}</span>
                  </div>
                  <CoupleBreakdown label1="Contribuable" val1={netCommercialContrib} label2="Conjoint" val2={netCommercialConjoint} />
                </div>
              )}

              {(netAgricoleContrib + netAgricoleConjoint) > 0 && (
                <div className="pt-2 border-t border-gray-50">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">Bénéfices agricoles nets</span>
                    <span className="font-semibold text-gray-900">{fmt(netAgricoleContrib + netAgricoleConjoint)}</span>
                  </div>
                  <CoupleBreakdown label1="Contribuable" val1={netAgricoleContrib} label2="Conjoint" val2={netAgricoleConjoint} />
                </div>
              )}

              {(netLiberalContrib + netLiberalConjoint) > 0 && (
                <div className="pt-2 border-t border-gray-50">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">Revenus profession libérale nets</span>
                    <span className="font-semibold text-gray-900">{fmt(netLiberalContrib + netLiberalConjoint)}</span>
                  </div>
                  <CoupleBreakdown label1="Contribuable" val1={netLiberalContrib} label2="Conjoint" val2={netLiberalConjoint} />
                </div>
              )}

              {netRental !== 0 && (
                <div className="pt-2 border-t border-gray-50">
                  <div className="flex justify-between items-center">
                    <span className={`font-medium ${netRental < 0 ? 'text-red-600' : 'text-gray-700'}`}>Revenus locatifs nets</span>
                    <span className={`font-semibold ${netRental < 0 ? 'text-red-500' : 'text-gray-900'}`}>{fmt(netRental)}</span>
                  </div>
                </div>
              )}

              {netCapital > 0 && (
                <div className="pt-2 border-t border-gray-50">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">Capitaux mobiliers (après exemption)</span>
                    <span className="font-semibold text-gray-900">{fmt(netCapital)}</span>
                  </div>
                </div>
              )}

              {netDivers > 0 && (
                <div className="pt-2 border-t border-gray-50">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">Revenus divers</span>
                    <span className="font-semibold text-gray-900">{fmt(netDivers)}</span>
                  </div>
                </div>
              )}

              {netExtraordinary > 0 && (
                <div className="pt-2 border-t border-gray-50">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">Revenus extraordinaires</span>
                    <span className="font-semibold text-gray-900">{fmt(netExtraordinary)}</span>
                  </div>
                  <span className="block text-xs text-amber-600 mt-0.5">Régime demi-taux global (estimation simplifiée)</span>
                </div>
              )}
            </div>
          </section>

          {/* 2. Dépenses spéciales */}
          <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4 border-b pb-2 flex justify-between items-center">
              <span>2. Dépenses Spéciales (DS)</span>
              <span className="text-red-600">-{fmt(totalDS)}</span>
            </h3>
            <div className="space-y-4 text-sm text-gray-600">

              <div>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium text-gray-700">Assurances &amp; Intérêts</span>
                    <span className="block text-xs text-gray-400">Plafond : {fmt(capInsInt)}</span>
                  </div>
                  <span className="font-semibold text-gray-900">{fmt(baseDSDeduction)}</span>
                </div>
                <CoupleBreakdown label1="Contribuable" val1={insIntContrib} label2="Conjoint" val2={insIntConjoint} />
                <div className="text-xs text-gray-400 text-right mt-1">
                  {deductibleInsInt > minForfaitDS ? '(Déduction réelle)' : `(Minimum forfaitaire : ${fmt(minForfaitDS)})`}
                </div>
              </div>

              {deductiblePensionPlan > 0 && (
                <div className="border-t border-gray-50 pt-2">
                  <div className="flex justify-between font-medium text-gray-700">
                    <span>Prévoyance-vieillesse (111bis)</span>
                    <span className="font-semibold text-gray-900">{fmt(deductiblePensionPlan)}</span>
                  </div>
                  <CoupleBreakdown label1="Contribuable" val1={deductiblePensionContrib} label2="Conjoint" val2={deductiblePensionConjoint} />
                </div>
              )}

              {deductibleHomeSavings > 0 && (
                <div className="pt-2 border-t border-gray-50 flex justify-between">
                  <span>Épargne Logement</span>
                  <span className="font-semibold text-gray-900">{fmt(deductibleHomeSavings)}</span>
                </div>
              )}

              {deductibleDonations > 0 && (
                <div className="pt-2 border-t border-gray-50 flex justify-between">
                  <span>Libéralités (Dons)</span>
                  <span className="font-semibold text-gray-900">{fmt(deductibleDonations)}</span>
                </div>
              )}

              {deductibleAlimony > 0 && (
                <div className="pt-2 border-t border-gray-50 flex justify-between">
                  <span>Rentes alimentaires &amp; syndicat</span>
                  <span className="font-semibold text-gray-900">{fmt(deductibleAlimony)}</span>
                </div>
              )}
            </div>
          </section>

          {/* 3. Abattements */}
          <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4 border-b pb-2 flex justify-between items-center">
              <span>3. Abattements (CE &amp; AC)</span>
              <span className="text-red-600">-{fmt(totalAbattements)}</span>
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              {abattementConjoint > 0 && (
                <div className="flex justify-between bg-green-50 p-2 rounded border border-green-100">
                  <span className="font-medium text-green-800">Abattement extra-professionnel (AC)</span>
                  <span className="font-bold text-green-700">{fmt(abattementConjoint)}</span>
                </div>
              )}
              {deductibleChildcare > 0 && (
                <div className="flex justify-between">
                  <span>Frais de garde d'enfants</span>
                  <span className="font-medium text-gray-900">{fmt(deductibleChildcare)}</span>
                </div>
              )}
              {deductibleDomestic > 0 && (
                <div className="flex justify-between">
                  <span>Frais de domesticité</span>
                  <span className="font-medium text-gray-900">{fmt(deductibleDomestic)}</span>
                </div>
              )}
              {invalidityTotal > 0 && (
                <div className="flex justify-between">
                  <span>Frais d'invalidité / maladie grave</span>
                  <span className="font-medium text-gray-900">{fmt(invalidityTotal)}</span>
                </div>
              )}
              {totalAbattements === 0 && (
                <span className="text-gray-400 italic">Aucun abattement applicable</span>
              )}
            </div>
          </section>
        </div>

        {/* Right: Total */}
        <div className="lg:col-span-1">
          <div className="bg-gray-900 text-white p-6 rounded-xl shadow-lg sticky top-6">
            <h2 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">
              Revenu Imposable
            </h2>
            <div className="text-4xl font-bold mb-6">
              {fmt(revenuImposable)}
            </div>

            <div className="space-y-4 border-t border-gray-700 pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Total Revenus</span>
                <span className="font-medium text-green-400">+{fmt(totalRevenuNet)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Déductions (DS)</span>
                <span className="font-medium text-red-400">-{fmt(totalDS)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Abattements (CE)</span>
                <span className="font-medium text-red-400">-{fmt(totalAbattements)}</span>
              </div>
            </div>

            {data.additionalWithholdings.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Retenues supplémentaires</span>
                  <span className="font-medium text-blue-400">
                    {fmt(data.additionalWithholdings.reduce((s, e) => s + e.amount, 0))}
                  </span>
                </div>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-gray-700">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-yellow-500 shrink-0" size={20} />
                <p className="text-xs text-gray-400 leading-relaxed">
                  Estimation selon les règles standards 2024. L'impôt final dépendra du barème exact et de la classe d'imposition appliqués par l'ACD.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
