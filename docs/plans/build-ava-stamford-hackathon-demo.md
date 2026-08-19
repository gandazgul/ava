---
classification: "PLANNED_CHANGE"
workKind: "FEATURE"
complexity: "MEDIUM"
summary: "Build a reliable three-hour Astro and Deno prototype that evaluates a Stamford renter's cost basket, ranks alternative ZIP codes, and supports a coherent agent demo story."
affectedPaths:
  - "package.json"
  - "deno.json"
  - "deno.lock"
  - "astro.config.mjs"
  - "tsconfig.json"
  - "src/layouts/AppLayout.astro"
  - "src/pages/index.astro"
  - "src/styles/global.css"
  - "src/data/stamford.ts"
  - "src/lib/affordability.ts"
  - "src/lib/affordability.test.ts"
  - "docs/demo-handoff.md"
objectiveChecks:
  - id: "OC1"
    command: "test -f src/lib/affordability.test.ts && deno test --allow-read src/lib/affordability.test.ts"
    rationale: "The required behavioral suite does not exist on the baseline. It exercises the real affordability module and Stamford fixture for scoring, basket totals, edge cases, and ranked alternatives."
  - id: "OC2"
    command: "deno task build && test -f dist/index.html && grep -q 'Load demo client' dist/index.html && grep -q 'AVA Insight' dist/index.html && grep -q 'Upgrade' dist/index.html"
    rationale: "The baseline has no application or build. This passes only when Astro produces the user-facing golden-path shell with the prepared scenario, result insight, and product preview entry point."
executionAgent: "frontend-engineer"
collaborationRecommendation: "autonomous"
devServerCommand: "deno task dev --host 0.0.0.0"
devServerUrl: "http://localhost:4321"
devServerHmr: true
createdAt: "2026-08-19T15:16:01-04:00"
updatedAt: "2026-08-19T19:18:58.598Z"
status: "ready_for_work"
origin: "internal"
userVerifiedAt: null
routingIntent: "PLANNED_CHANGE"
sessionName: "AVA affordability MVP"
planId: "08670b51-c6c4-4f00-959a-e0050f2db694"
---

# Build the AVA Stamford Hackathon Demo

## Context

AVA (Agent Value Add) helps a real estate agent explain whether a renter can afford the full monthly cost of a neighborhood, not only the advertised rent. The original product vision includes nationwide data, buildings, buyers, accounts, subscriptions, and agency integrations. One builder has about three hours to produce the prototype. The project manager and research team own the final presentation and story. The prototype must give them working evidence for one valuable workflow and preview the wider business without pretending that unfinished features work.

The judged criteria are equally weighted: a real problem, valuable benefit, an advantage over existing products, a confident presentation, and a strong prototype. The developer must make the prototype easy for the presentation team to demonstrate and must document the exact claims that the working behavior supports. Its specific advantage is a client-level agent workflow: AVA combines take-home income, an editable personal cost basket, housing, and commute cost; explains the affordability effect; and ranks better-fit alternatives. Generic city-level cost calculators do not complete that workflow during a showing.

The repository has no application code. This Plan creates a new Astro application run and built with Deno. The approved scope is renters in Stamford, Connecticut, across six residential ZIP Code Tabulation Areas: `06901`, `06902`, `06903`, `06905`, `06906`, and `06907`.

## Objective

Deliver a mobile-friendly, single-page prototype with one reliable golden path:

1. An agent loads or edits a prepared Stamford renter scenario.
2. AVA calculates the renter's monthly basket, remaining income, and transparent 0–100 fit score for the target ZIP.
3. AVA ranks other supported Stamford ZIPs by projected monthly income remaining.
4. The agent opens a target-versus-alternative comparison and gets deterministic talking points from “AVA Insight.”
5. A small product preview shows Free, Agent Pro, and Enterprise possibilities without implementing authentication, payment, persistence, live listings, or an LLM.

The prototype must work without network access during the demo. It must identify sourced data, broad-area source data, and demo estimates so that the presentation does not imply false precision.

## Approach

Use a static Astro application with framework-free client TypeScript. Deno owns dependency installation, tasks, tests, and the production build. Do not add server-side rendering, a Deno adapter, a database, or an API route because all approved data is local and the demo must tolerate network failure.

Keep the affordability calculation as a pure, deep module. The page supplies one `ScenarioInput` and receives one complete `ComparisonResult`; DOM code does not reproduce scoring or ranking rules.

```text
Demo client or edited form
  -> build ScenarioInput
  -> compareStamfordScenario(input, stamfordProfiles)
       -> evaluate target basket
       -> evaluate each alternative
       -> rank by monthly dollars remaining
       -> build deterministic AVA Insight
  -> render target result, breakdown, and comparison
```

The calculation interface will have this shape or an equivalent equally small interface:

```ts
compareStamfordScenario(input, profiles): ComparisonResult

monthlyBasket = rent + groceries + gas + restaurants
               + tolls + heat + utilities
remainingDollars = monthlyTakeHomeIncome - monthlyBasket
fitScore = clamp(round(100 * remainingDollars / monthlyTakeHomeIncome), 0, 100)
fitLabel = score >= 30 ? "Comfortable" : score >= 15 ? "Tight" : "Reconsider"
```

The score is the percentage of take-home income left after the selected basket, not a statistical cost-of-living index. Keep negative remaining dollars visible even though the score is clamped to zero. Rank alternatives by `remainingDollars` descending, then ZIP code for a stable tie-break. Do not recommend the current ZIP as its own alternative. If no alternative improves the result, state that AVA found no better fit within the six-ZIP demo area.

Use a prepared persona to make the story repeatable. The initial form includes monthly take-home income, household size, target ZIP, expected rent, work ZIP, commute days per week, and editable monthly grocery, restaurant, toll, heat, and utility values. Gas is derived from the local commute matrix and a disclosed fuel-cost assumption. An explicit reset/load-demo action must restore the prepared scenario.

`src/data/stamford.ts` is the single source of truth for ZIP profiles, source metadata, basket defaults, and the commute matrix. Each displayed datum records a label, value, as-of year/date, source URL or “demo estimate,” and geographic precision. Prefer HUD Small Area Fair Market Rent for ZIP-level rent, USDA food-plan data for the broad grocery baseline, U.S. Energy Information Administration Connecticut data for state-level energy assumptions, and precomputed OpenStreetMap/Open Source Routing Machine commute estimates. Do not call public geocoding or routing services at runtime. Display OpenStreetMap/Open Source Routing Machine attribution if their derived values are included.

“AVA Insight” is a deterministic formatter over the real result. It calls out the largest basket cost, current fit, best alternative, monthly difference, and commute trade-off. It must not claim to be generated by artificial intelligence or an LLM. This provides a polished advisory moment without a paid dependency or an unreliable fake integration.

The page uses an agent app shell, a clear input-to-result progression, large touch targets, stacked mobile cards, and one restrained highlight color. The product preview is one modal or inline panel reached from an “Upgrade” action. Future features must be labeled `Preview` or `Coming soon`.

The set-aside option is a multi-page clickable mock with accounts, dashboards, and checkout. It would show more surface area but would reduce the chance that the scored workflow works and can be explained confidently within three hours.

## Files to Modify

- `package.json` — declare Astro, Astro check, and TypeScript dependencies compatible with the installed Deno runtime.
- `deno.json` — define `dev`, `build`, `check`, and `test` tasks and the npm package installation mode needed by Astro.
- `deno.lock` — lock all dependencies after the first successful Deno install/build.
- `astro.config.mjs` — configure a static Astro build; do not enable server output.
- `tsconfig.json` — extend Astro's strict TypeScript configuration.
- `src/layouts/AppLayout.astro` — own the document shell, metadata, app header, and global stylesheet import.
- `src/pages/index.astro` — render the demo form, result state, comparison state, AVA Insight, data/source disclosure, and product preview; connect interactions to the pure calculation module.
- `src/styles/global.css` — provide the responsive app shell, form, score, breakdown, comparison, source, and preview styles.
- `src/data/stamford.ts` — own the six ZIP profiles, prepared client scenario, commute matrix, cost assumptions, provenance, and data-quality labels.
- `src/lib/affordability.ts` — own validation, basket calculation, score labels, alternative ranking, comparison deltas, and deterministic insight text.
- `src/lib/affordability.test.ts` — protect the score formula, thresholds, overrides, negative residuals, ranking, ties, no-improvement result, and prepared golden path.
- `docs/demo-handoff.md` — give the project manager and research team the exact demo actions and expected values, supported product claims, data limitations, technical fallback, and future-product boundaries; they own the final script and presentation.

## Reuse Opportunities

The repository contains no reusable application code. Reuse platform features instead of adding libraries:

- Astro `.astro` pages and bundled `<script>` TypeScript for the interactive page.
- Browser form controls, dialog semantics (or an accessible inline preview), number formatting, and native validation.
- Deno's built-in test runner and assertions for domain tests.
- Deno `package.json` compatibility and task runner for Astro dependencies and commands.

## Implementation Steps

- [ ] The project runs through `deno task dev --host 0.0.0.0`, passes `deno task check`, and produces a static `dist/` through `deno task build`; no server adapter, database, environment secret, or runtime network request is required.
- [ ] `src/data/stamford.ts` contains exactly the six approved ZIP profiles, a complete in-scope ZIP-to-ZIP commute lookup, the prepared client scenario, and provenance for each cost assumption. The user interface distinguishes ZIP-level source data, state/national baseline data, and demo estimates.
- [ ] `compareStamfordScenario` validates finite positive take-home income, nonnegative basket values, supported target/work ZIPs, household size, and commute frequency, then returns a complete target result and ranked alternatives without mutating its inputs.
- [ ] The target calculation sums rent, grocery, gas, restaurant, toll, heat, and utility categories; reports the exact signed monthly dollars remaining; clamps only the displayed score to `0..100`; and applies `Comfortable` at 30 or above, `Tight` from 15 through 29, and `Reconsider` below 15.
- [ ] Alternative calculations preserve client-controlled basket choices, substitute each alternative's disclosed housing/area assumptions, recalculate commute cost, exclude the target ZIP, and sort by projected monthly dollars remaining with a stable ZIP tie-break.
- [ ] `src/lib/affordability.test.ts` proves the formula and both threshold boundaries, candidate-rent override, negative residual handling, deterministic ranking, tie behavior, target exclusion, no-improvement message, and expected prepared-scenario winner/delta against the real `stamfordProfiles` dataset.
- [ ] The initial page presents the agent problem and a visible “Load demo client” path; all scenario fields are editable; submit shows the real score, monthly remainder, seven-category breakdown, fit explanation, and data-quality/source disclosure; reset restores the prepared scenario.
- [ ] The result view shows up to three ranked Stamford alternatives and allows one to be compared with the target side by side, including monthly basket, monthly remainder, score, rent difference, and commute difference.
- [ ] AVA Insight derives its text only from the current calculation and names the current fit, largest cost, best alternative, monthly savings or loss, and commute trade-off. It contains no random text, network call, artificial-intelligence claim, or canned recommendation that conflicts with the displayed numbers.
- [ ] The app shell and result flow remain usable at a 390-by-844 viewport without horizontal scrolling, clipped values, or pointer-only controls; score meaning is conveyed with text as well as color; keyboard focus remains visible.
- [ ] The Upgrade product preview distinguishes Free, Agent Pro, and Enterprise concepts and marks unimplemented accounts, saved clients, current data, buildings, checkout, and agency integration as `Preview` or `Coming soon`; it does not block the working workflow.
- [ ] `docs/demo-handoff.md` gives the presentation team a tested click path, exact prepared-scenario results, claims supported by working behavior, data and scope limitations, future-product boundaries, and a no-network fallback. It does not prescribe the final presentation script.
- [ ] The implementation order enforces the three-hour stop rule: first 20 minutes scaffold and shell, next 45 minutes data/calculation/tests, next 55 minutes working form/results/comparison, next 30 minutes AVA Insight and product preview, and final 30 minutes mobile verification, bug buffer, production build, and team handoff. New scope stops when its time box ends.

## Approval Confirmation

No prior Work Record is superseded by this Plan.

## Verification Plan

- Automated: run `deno task test`; all affordability and recommendation behaviors pass against the real Stamford fixture.
- Automated: run `deno task check`; Astro and TypeScript report no errors.
- Automated: run `deno task build`; the static production build completes without environment variables or remote data.
- Manual, prepared golden path: at `http://localhost:4321`, select “Load demo client,” submit without edits, and confirm that the score, signed remainder, category sum, best alternative, comparison deltas, and AVA Insight match the exact expected values in `docs/demo-handoff.md` and the unit test.
- Manual, editability: change income, target rent, one discretionary category, target ZIP, and work ZIP. Submit and confirm that displayed totals and advice change together. Restore the demo client and confirm that all values and results return to the prepared state.
- Manual, adverse case: set basket costs above take-home income. Confirm that monthly remainder is negative, score is `0`, label is `Reconsider`, and no currency value becomes `NaN` or disappears.
- Manual, alternatives: compare the top recommendation. Confirm target and alternative are different ZIPs, all seven categories reconcile to each total, monthly and commute deltas use clear signs/labels, and any no-improvement state does not invent a recommendation.
- Manual, product honesty: open Upgrade. Confirm future capabilities are visibly marked as preview/coming soon and no login, checkout, save, listing, or enterprise control implies that it is functional.
- Headed browser: run the full golden path at 390-by-844 and at a desktop viewport. Verify no horizontal scrolling, no overlap, readable source labels, touch-sized controls, keyboard operation, visible focus, text labels for score state, and a product preview that opens and closes without losing the calculated result.
- Team handoff: the project manager or presenter follows `docs/demo-handoff.md` once against the production build without developer guidance and confirms that each action, expected value, supported claim, and fallback is clear. Presentation writing and rehearsal remain team-owned.

## Edge Cases & Considerations

- Public cost data does not provide all requested categories at neighborhood precision. The prototype shows provenance and precision and permits client overrides instead of presenting estimates as facts.
- ZIP codes are delivery areas, and Census ZIP Code Tabulation Areas are approximations rather than neighborhoods. User-facing copy says `ZIP` or `Stamford area`, not a precise neighborhood boundary.
- A fit score is not financial advice or a market-wide cost-of-living index. The interface defines it as the percentage of take-home income remaining after the selected basket and uses “based on this basket” in the `Reconsider` explanation.
- Take-home income avoids a rushed and potentially misleading tax model. Home ownership, debt, childcare, health care, and savings goals are outside the score unless a future version adds them explicitly.
- The local commute matrix is a demo estimate and cannot represent live traffic. Show its basis and avoid “real-time” language.
- The current ZIP may already be the best supported option. Return a clear no-better-fit state rather than forcing an alternative.
- Equal scores and remainders must produce stable ordering so the team sees the same result on each run.
- The prepared scenario and exact expected result are demo fixtures, not hidden special cases in the calculation.
- No authentication or storage means client values stay only in the current browser page. Do not put real client personal information into the prepared scenario or documentation.
- If styling time runs short, preserve input clarity, result hierarchy, mobile fit, the comparison, and the team handoff. Remove decorative polish before calculation, source disclosure, verification, or handoff time.
