# AVA Stamford Demo Handoff

## Tested click path

1. Start the app with `deno task dev --host 0.0.0.0` or serve the production `dist/` build.
2. Open `/`.
3. Select **Load demo client**.
4. Keep the prepared values:
   - Monthly take-home income: `$7,200`
   - Household size: `2`
   - Target ZIP: `06902`
   - Expected rent: `$2,850`
   - Work ZIP: `06901`
   - Commute days per week: `4`
   - Groceries: `$760`
   - Restaurants: `$380`
   - Tolls and parking: `$85`
5. Review the target result and the first ranked alternative.
6. Select **Compare** on the top alternative.
7. Open **Upgrade**, then close it. The result stays on the page.

## Expected prepared-scenario values

- Target ZIP: `06902`, South and Cove Stamford.
- Target monthly basket: `$4,467` (`$4,467.43` before display rounding).
- Target income remaining: `+$2,733` (`$2,732.57` before display rounding).
- Target score: `38/100`, `Comfortable`.
- Breakdown:
  - Rent: `$2,850`
  - Groceries: `$760`
  - Gas: `$12.43`
  - Restaurants: `$380`
  - Tolls: `$85`
  - Heat: `$160`
  - Utilities: `$220`
- Best alternative: `06906`, Glenbrook Stamford.
- Best alternative monthly basket: `$3,953.38`.
- Best alternative income remaining: `$3,246.62`.
- Monthly remaining difference: `+$514.05`.
- Rent difference: `-$500`.
- Commute difference: `-2` minutes one way.
- AVA Insight states that the current fit is Comfortable, rent is the largest cost, and `06906` leaves about `$514` more per month with a shorter commute.

## Supported product claims

- The prototype calculates a client-level monthly basket from take-home income, rent, editable personal costs, local housing assumptions, and commute gas.
- The score is transparent. It is the percent of take-home income left after the displayed basket.
- The app ranks other supported Stamford ZIPs by projected monthly income remaining.
- The side-by-side comparison reconciles rent, commute, score, basket, and remaining income.
- AVA Insight is deterministic text from the current numbers. It is not an LLM call.

## Data and scope limits

- Scope is Stamford, Connecticut, ZIPs `06901`, `06902`, `06903`, `06905`, `06906`, and `06907`.
- Rent baselines use HUD Small Area Fair Market Rent at ZIP level.
- Food and energy assumptions use broad public baselines.
- Commute, restaurants, tolls, and parking are demo estimates and can be edited.
- Commute values are precomputed from OpenStreetMap and Open Source Routing Machine style estimates. They are not live traffic.
- ZIPs are approximate Stamford areas, not exact neighborhood boundaries.
- The score is not financial advice and does not include debt, childcare, health care, savings goals, taxes, ownership, or live listings.

## Future-product boundaries

The Upgrade panel is a preview only. It names concepts for Free, Agent Pro, and Enterprise, but the prototype does not include login, saved clients, current data refresh, buildings, checkout, agency accounts, or integrations.

## No-network fallback

Use the production build in `dist/`. The app has local data only and does not need runtime network access. If the dev server is not available, run `deno task build` on a prepared machine and copy or serve the `dist/` folder with any static file server.
