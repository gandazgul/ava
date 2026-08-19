# AVA Stamford Demo Handoff

## Tested click path

1. Start the app with `deno task dev --host 0.0.0.0` or serve the production `dist/` build.
2. Open `/`. The **Calculator** workspace is active first.
3. Select **Reset demo client** if the form has been edited.
4. Keep the prepared family values:
   - Monthly take-home income: `$7,200`
   - Adults: `2`
   - Children: one child, `Child age 4–5`
   - Paid daycare: checked
   - Target ZIP: `06902`
   - Expected rent: `$2,850`
   - Work ZIP: `06901`
   - Commute days per week: `4`
   - Additional household expenses: `$0`
5. Select **Calculate fit** and review the target result and first ranked alternative.
6. Clear **Paid daycare**. Confirm childcare becomes `$0` and the basket falls by `$1,173.43`. Recheck **Paid daycare** before continuing the main demo.
7. Select **Compare** on the top alternative.
8. Open **Clients Preview**, open a saved client, select **Use in calculator**, and confirm the calculator recalculates from that client record, including adults, children, and care choice.
9. Open **Properties Preview**, open a demo property, select **Use in calculator**, and confirm only target ZIP and rent change.
10. Open **Upgrade**, then close it. The result stays on the page unless a preview record is deliberately loaded.

## Expected prepared-scenario values

- Target ZIP: `06902`, South and Cove Stamford.
- Family: two adults, one child age `4–5`, paid daycare selected.
- Target monthly basket: `$6,235` (`$6,234.96` before display rounding).
- Target income remaining: `+$965` (`$965.04` before display rounding).
- Target score: `34/100`, `Reconsider`.
- Breakdown:
  - Rent: `$2,850`
  - Adult groceries: `$760`
  - Child food: `$214.10`
  - Paid childcare: `$1,173.43`
  - Gas: `$12.43`
  - Restaurants: `$570`
  - Tolls and parking: `$85`
  - Heat: `$240`
  - Utilities: `$330`
  - Additional household expenses: `$0`
- Best alternative: `06906`, Glenbrook Stamford.
- Best alternative monthly basket: `$5,713.41`.
- Best alternative income remaining: `$1,486.59`.
- Monthly remaining difference: `+$521.55`.
- Rent difference: `-$500`.
- Commute difference: `-2` minutes one way.
- AVA Insight states that the current fit is Reconsider, rent is the largest cost, paid childcare adds about `$1,173`, and `06906` leaves about `$522` more per month with a shorter commute.

## Daycare-off check

- Clear **Paid daycare** for the prepared family.
- Child food stays `$214.10`.
- Paid childcare becomes `$0`.
- Target monthly basket becomes `$5,061.53`.
- Income remaining becomes `$2,138.47`.
- The basket difference from paid daycare is exactly `$1,173.43`.
- Recheck **Paid daycare** to restore the golden path.

## Preview records

- **Clients Preview** shows fictional saved clients. The records load complete calculator scenarios.
- Client records include a family summary and care choice so the agent can compare family and child-free scenarios.
- **Properties Preview** shows fictional Stamford-area homes and buildings with bundled local illustrations. These are not active listings.
- Loading a property changes only the target ZIP and expected rent. Income, adults, children, care choice, work ZIP, commute days, and additional expenses stay unchanged.
- Preview records live only in the static demo bundle. They are not persisted after refresh.

## Supported product claims

- The prototype calculates a client-level monthly basket from take-home income, rent, family composition, sourced child food, paid childcare when selected, local housing assumptions, and commute gas.
- The score is transparent. It maps the percent of take-home income left after the displayed basket to a 0–100 score, where 40 percent remaining income maps to 100.
- The app ranks other supported Stamford ZIPs by projected monthly income remaining.
- The side-by-side comparison reconciles rent, commute, score, basket, child food, childcare, and remaining income.
- AVA Insight is deterministic text from the current numbers. It is not an LLM call.
- The Clients and Properties screens demonstrate the intended save-and-retrieve workflow with bundled preview data.

## Data and scope limits

- Scope is Stamford, Connecticut, ZIPs `06901`, `06902`, `06903`, `06905`, `06906`, and `06907`.
- Rent baselines use HUD Small Area Fair Market Rent at ZIP level.
- Adult food and child food assumptions use broad USDA public baselines.
- Child food uses the USDA Moderate-Cost Food Plan monthly table for December 2025, issued January 2026.
- Paid childcare uses Connecticut Care 4 Kids Southwest full-time center rates effective July 2023 and a `4.33` weeks-per-month conversion.
- Home/family care means no added paid childcare cost in this demo.
- Teen child-food values are derived female/male averages because the form asks for age band, not sex.
- Child food and childcare are broad averages. They are not live provider quotes and do not estimate every cost of raising a child.
- Commute, restaurants, tolls, and parking are demo estimates.
- Commute values are precomputed from OpenStreetMap and Open Source Routing Machine style estimates. They are not live traffic.
- ZIPs are approximate Stamford areas, not exact neighborhood boundaries.
- The score is not financial advice and does not include debt, health care, savings goals, taxes, ownership, or live listings.
- Demo clients and demo properties are fictional preview records. Do not describe them as saved user data, live listings, MLS records, or broker inventory.

## Future-product boundaries

The Upgrade panel is a preview only. It names two levels:

- **Single Agent**: saved clients, saved properties, calculator retrieval, and reports.
- **Agency**: shared records, team access, manager review, and agency controls.

The prototype does not include login, persistence, checkout, team permissions, live listing feeds, or agency integrations.

## No-network fallback

Use the production build in `dist/`. The app has local data and local property illustrations only. It does not need runtime network access. If the dev server is not available, run `deno task build` on a prepared machine and copy or serve the `dist/` folder with any static file server.
