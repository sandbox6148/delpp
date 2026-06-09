# LuxTax 100 — Déclaration IR Luxembourg 2024

**Répertoire:** `/Users/ceciledoussine/Documents/Antigravity/luxtax-100-(20260109)`

## Stack technique
- React + TypeScript + Vite
- Tailwind CSS
- Lucide React (icônes)
- Pas de backend — tout en local/state

## Architecture
- `types.ts` — types centraux + `INITIAL_DATA`
- `App.tsx` — wizard multi-étapes avec sidebar dynamique
- `views/` — une vue par étape du formulaire
- `components/` — Sidebar, Tooltip, StepWizard

## Vues existantes (views/)

| Fichier | Page(s) 100F | Contenu |
|---------|-------------|---------|
| `Welcome.tsx` | — | Écran d'accueil |
| `PersonalSituation.tsx` | 1, 3 | Identité (101-141), état civil (301-304), conjoint |
| `Children.tsx` | 2 | Enfants (201-228, 237) |
| `OptionsImposition.tsx` | 4 | Imposition collective/individuelle (401-403) |
| `Selection.tsx` | — | Choix des rubriques actives |
| `Incomes.tsx` (section S) | 7 | Salaires (701-704, 743, impôt retenu) |
| `Incomes.tsx` (section P) | 8 | Pensions (801-804, impôt retenu) |
| `Incomes.tsx` (section CM) | 9 | Capitaux mobiliers (901, 903, RELIBI) |
| `Incomes.tsx` (section L) | 10 | Location (1029, 1044) |
| `IndependentIncomes.tsx` (COMMERCIAL) | 5 | Bénéfice commercial (501/505, priorLoss) |
| `IndependentIncomes.tsx` (AGRICOLE) | 5 | Bénéfice agricole (509/513, priorLoss) |
| `IndependentIncomes.tsx` (LIBERAL) | 6 | Profession libérale (601/605, priorLoss) |
| `DiversIncomes.tsx` | 11 | Plus-values immo, spéculatif, pension alimentaire reçue, divers (1101-1133) |
| `ExtraordinaryIncomes.tsx` | 12 | Indemnité départ, cession entreprise, capital 111bis, divers (1201-1221) |
| `AlimonyExpenses.tsx` | 13 | Pension alimentaire versée (1301, 1303), syndicat (1308), prêt études (1310) |
| `Expenses.tsx` (DEBIT_INTEREST) | 14 | Intérêts débiteurs (1401) |
| `Expenses.tsx` (INSURANCE) | 14 | Assurances (1436) |
| `Expenses.tsx` (PENSION_PLAN) | 15 | Prévoyance-vieillesse 111bis (1503) |
| `Expenses.tsx` (HOME_SAVINGS) | 15 | Épargne logement (1529) |
| `Expenses.tsx` (DONATION) | 16 | Libéralités/dons (1611) |
| `Expenses.tsx` (CHILDCARE) | 17 | Garde d'enfants (1715) |
| `Expenses.tsx` (DOMESTIC_HELP) | 17 | Services domestiques (1715) |
| `InvalidityExpenses.tsx` | 17 | Invalidité/maladie grave (1702, 1709-1714) |
| `DiversesDemandes.tsx` | 18 | Remboursement (1801+IBAN), éco-bonus (1821), invalidité (1803-1806), crédit senior (1818), CIS, prorogation |
| `Summary.tsx` | récap | Calcul complet : revenus nets, DS, abattements, revenu imposable |

**Note:** `Retenues.tsx` (page 19) a été supprimée du wizard — le fichier existe encore mais n'est plus référencé.

## Sidebar — étapes wizard actuelles
- Introduction : Accueil
- Signalétique : Contribuable, (Conjoint), (Options imposition), Enfants, Sélection
- Revenus : selon sélection (Salaires, Pensions, Commercial, Agricole, Libéral, Capitaux, Location, Divers, Extraordinaires)
- Dépenses Spéciales : selon sélection
- Abattements (CE) : selon sélection
- Finalisation : **Diverses Demandes**, **Revenu imposable** (ex-Récapitulatif, renommé en sidebar)

## Summary.tsx — section Revenus Nets (état actuel)
Chaque type de revenu a son propre bloc uniforme (`pt-2 border-t border-gray-50` + `flex justify-between` + `CoupleBreakdown` si applicable). Blocs affichés si > 0 :

1. **Salaires nets** — brut par owner, CoupleBreakdown
2. **Pensions nettes** — CoupleBreakdown
3. **Bénéfices commerciaux nets** — CoupleBreakdown (séparé des autres indépendants)
4. **Bénéfices agricoles nets** — CoupleBreakdown
5. **Revenus profession libérale nets** — CoupleBreakdown
6. **Revenus locatifs nets** — montant net (après déduction intérêts résidence principale)
7. **Capitaux mobiliers** — après exemption 1 500€/pers
8. **Revenus divers** — montant brut
9. **Revenus extraordinaires** — avec note demi-taux

Calcul interne : `netIndepContrib/Conjoint` = somme des 3 types (commercial + agricole + libéral), toujours utilisé dans `totalRevenuNet`.

## Logique de calcul (Summary.tsx)
- Forfait frais obtention salaires : 540€ min
- Forfait frais obtention pensions : 300€ min
- Plafond assurances + intérêts : 672€ × nb membres ménage
- Forfait DS min : 480€ (célibataire) / 960€ (couple)
- 111bis (prévoyance-vieillesse) : plafond 3 200€/pers
- Épargne logement : plafond 1 344€ × nb membres ménage
- Libéralités : déductibles si ≥ 120€/an, max 20% du revenu net
- Abattement conjoint (AC) : 4 500€ si les deux travaillent
- Garde/domesticité : plafond 5 400€ par enfant / 5 400€ global domesticité
- Exemption capitaux mobiliers : 1 500€ (× 2 si couple)
- Intérêts résidence principale : plafond 2 000€ × nb membres ménage
- Rentes alimentaires : plafond 24 000€ ex-conjoint, 4 020€/enfant
- Revenus indépendants : résultat net - report pertes antérieures (min 0), par type et par owner

## Ce qui reste absent / incomplet
- Calcul réel de l'impôt au barème (tranches) — seul le revenu imposable est calculé
- Demi-taux effectif pour revenus extraordinaires non implémenté dans le calcul
- Cases 1716-1723, 1725, 1734 (page 17 invalidité détail) non couvertes
- DAC6 (page 19) non couvert
- Page 20 officielle (cases 2001-2037) absente

## Formulaire PDF de référence
URL: https://impotsdirects.public.lu/dam-assets/fr/formulaires/pers_physiques/2024/100f-24-101.pdf
Modèle 100F, Année d'imposition 2024, 20 pages.
