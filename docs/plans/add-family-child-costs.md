---
planId: "c4303ca1-93c4-4281-8f6d-c2c3a06190c6"
classification: "PLANNED_CHANGE"
workKind: "FEATURE"
complexity: "MEDIUM"
summary: "Replace flat household size with adult and child age-band inputs, add sourced child food and daycare costs, and make the prepared AVA demo a family scenario."
affectedPaths:
  - "src/data/stamford.ts"
  - "src/data/demo-workspace.ts"
  - "src/lib/affordability.ts"
  - "src/lib/affordability.test.ts"
  - "src/pages/index.astro"
  - "src/styles/global.css"
  - "docs/demo-handoff.md"
objectiveChecks:
  - id: "OC1"
    command: "deno eval 'import {compareStamfordScenario} from \"./src/lib/affordability.ts\"; import {preparedScenario,stamfordProfiles} from \"./src/data/stamford.ts\"; const p=preparedScenario as any; if(p.adultCount!==2||p.children?.join()!==\"age4to5\"||p.usesDaycare!==true) throw new Error(\"prepared family absent\"); const paid=compareStamfordScenario(p,stamfordProfiles), home=compareStamfordScenario({...p,usesDaycare:false},stamfordProfiles); const b=paid.target.breakdown as any, h=home.target.breakdown as any; if(b.childFood!==214.1||b.childcare!==1173.43||h.childFood!==214.1||h.childcare!==0||Number((paid.target.monthlyBasket-home.target.monthlyBasket).toFixed(2))!==1173.43) throw new Error(\"family costs incorrect\");'"
    rationale: "The current model has only householdSize and no child food or childcare categories. This check exercises the real prepared scenario and calculator and passes only when the chosen family composition, sourced preschool food cost, and daycare-versus-home-care behavior affect the basket correctly."
objectiveChecksBaseline:
  recordedAt: "2026-08-19T23:23:42.328Z"
  head: "e4bf6cac5a3ddd806d05e4d10d789966870652ad"
  results:
    - id: "OC1"
      command: "deno eval 'import {compareStamfordScenario} from \"./src/lib/affordability.ts\"; import {preparedScenario,stamfordProfiles} from \"./src/data/stamford.ts\"; const p=preparedScenario as any; if(p.adultCount!==2||p.children?.join()!==\"age4to5\"||p.usesDaycare!==true) throw new Error(\"prepared family absent\"); const paid=compareStamfordScenario(p,stamfordProfiles), home=compareStamfordScenario({...p,usesDaycare:false},stamfordProfiles); const b=paid.target.breakdown as any, h=home.target.breakdown as any; if(b.childFood!==214.1||b.childcare!==1173.43||h.childFood!==214.1||h.childcare!==0||Number((paid.target.monthlyBasket-home.target.monthlyBasket).toFixed(2))!==1173.43) throw new Error(\"family costs incorrect\");'"
      rationale: "The current model has only householdSize and no child food or childcare categories. This check exercises the real prepared scenario and calculator and passes only when the chosen family composition, sourced preschool food cost, and daycare-versus-home-care behavior affect the basket correctly."
      status: "unmet"
      stdout: ""
      stderr: "\u001b[0m\u001b[1m\u001b[31merror\u001b[0m: Uncaught (in promise) Error: prepared family absent\n    at \u001b[0m\u001b[2m\u001b[38;5;245mfile:///Users/gandazgul/.wld/worktrees/--Users-gandazgul-Documents-web-ava--/ava-add-family-child-costs-b0829478/\u001b[0m\u001b[0m\u001b[36m$deno$eval.mts\u001b[0m:\u001b[0m\u001b[33m1\u001b[0m:\u001b[0m\u001b[33m257\u001b[0m\n"
      exitCode: 1
      durationMs: 28
      output: "\n\u001b[0m\u001b[1m\u001b[31merror\u001b[0m: Uncaught (in promise) Error: prepared family absent\n    at \u001b[0m\u001b[2m\u001b[38;5;245mfile:///Users/gandazgul/.wld/worktrees/--Users-gandazgul-Documents-web-ava--/ava-add-family-child-costs-b0829478/\u001b[0m\u001b[0m\u001b[36m$deno$eval.mts\u001b[0m:\u001b[0m\u001b[33m1\u001b[0m:\u001b[0m\u001b[33m257\u001b[0m\n"
executionAgent: "frontend-engineer"
collaborationRecommendation: "pair"
devServerCommand: "deno task dev --host 0.0.0.0"
devServerUrl: "http://localhost:4321"
devServerHmr: true
createdAt: "2026-08-19T19:20:59-04:00"
updatedAt: "2026-08-19T23:35:57.195Z"
status: "implemented"
origin: "internal"
implementedAt: "2026-08-19T23:35:57.195Z"
userVerifiedAt: null
executionReport: "- Implemented family composition in the AVA demo: `adultCount`, repeatable child age-band rows, and `usesDaycare` replaced flat `householdSize` across data, calculator input, demo clients, tests, and handoff docs.\n- Added offline sourced child-cost snapshot data: USDA December 2025 child food by age band and Connecticut Care 4 Kids Southwest July 2023 full-time center daycare rates; home/family care adds `$0` paid childcare.\n- Updated the prepared Jordan M. demo to 2 adults + one age 4–5 child + paid daycare; target result is basket `$6,234.96`, remaining `+$965.04`, score `34/100 Reconsider`, best alternative `06906` with `+$521.55` remaining.\n- Preserved existing local-average scoring, ZIP ranking, property-load behavior, Clients/Properties preview, Upgrade preview, and no-runtime-network design.\n- Tests changed: `src/lib/affordability.test.ts` went from 13 to 15 Deno tests; the old uniform `householdSize` scaling coverage was rewritten for adult/child/care behavior, and child food, daycare/home-care, multiple-child, teen eligibility, validation, ranking, scoring, and immutability behaviors are covered.\n- Automated verification passed: `deno task test` (15 passed), `deno task check` (0 errors/warnings/hints), `deno task build`, and OC1 family-cost eval.\n- Headed browser dev URL: `http://127.0.0.1:4332/` in session `runwield-add-family-child-costs-b082`; separate port used because port 4321 was already owned by a server from another worktree.\n- Browser checks passed on desktop 1440×1000: prepared calculation, daycare off/on, add/remove child, top alternative compare, client load, property load, and visible keyboard focus; evidence screenshots include `artifacts/family-daycare-off-desktop.png`, `artifacts/family-comparison-desktop.png`, `artifacts/family-client-property-flow-desktop.png`, and `artifacts/family-keyboard-focus-desktop.png`.\n- Browser checks passed on mobile 390×844: prepared family calculation, child food/paid childcare visible, and no horizontal overflow; evidence screenshot `artifacts/family-costs-mobile.png`.\n- Browser diagnostics: no page errors, no failed XHR/fetch requests, and console output was Vite dev/HMR debug messages only.\n- No unresolved blockers."
humanReviewMode: null
humanReviewDecision: null
validationCheckpoint: null
executionMode: "worktree"
executionBaselineTree: "6093889f893a03a0daa1f4a5a9c0b21cc150a26b"
worktreeId: "b0829478"
worktreePath: "/Users/gandazgul/.wld/worktrees/--Users-gandazgul-Documents-web-ava--/ava-add-family-child-costs-b0829478"
worktreeBranch: "worktree/add-family-child-costs-b0829478"
worktreeBaseBranch: "main"
worktreeStatus: "completed"
routingIntent: "PLANNED_CHANGE"
sessionName: "family kids cost model"
validationCiAttempts: 0
validationObjectiveCheckAttempts: 0
validationSemanticRounds: 0
---

# Add Family and Child Costs to the AVA Demo

## Context

The current AVA calculator accepts one `householdSize` value. It treats each household member as the same type of person when it scales groceries, restaurants, heat, and utilities. It has no child model or childcare category. As a result, an agent cannot show the material affordability difference between a child-free household and a family that pays for daycare.

The user chose an explicit family model: the form collects an adult count and an age band for each child. One daycare checkbox applies to all eligible children. When the checkbox is clear, AVA treats care at home by family as having no added paid childcare cost. The child-cost scope is child food plus childcare; AVA must not present this as the total cost of raising a child.

The staged working tree already changes the calculator to use local average costs and a 0–100 score where 40 percent remaining income maps to 100. This Plan builds on those current changes. Execution must preserve them and must not restore the older editable-cost or score behavior.

## Objective

Make the prepared AVA scenario a family of two adults and one preschool-age child. The calculator must:

- replace flat household size with adult count and repeatable child age-band controls;
- use a dated local snapshot of USDA moderate-cost monthly food data for each child age band;
- add the Connecticut Care 4 Kids Southwest full-time center rate for each daycare-eligible child when daycare is selected;
- add no childcare amount when home/family care is selected;
- show child food and childcare as separate, sourced monthly basket categories in the target result, comparisons, and AVA Insight;
- preserve the offline demo, existing Stamford ZIP comparison, score rules, client/property preview flows, and source-quality disclosures.

The prepared family is two adults, one child aged 4–5, and daycare selected. With the planned source snapshot and the current basket values, child food is `$214.10` per month and childcare is `$1,173.43` per month (`$271` per week × `4.33`).

## Approach

Keep `compareStamfordScenario` as the source of truth for family-cost calculations. Replace `householdSize` in its interface with explicit family composition:

```ts
type ChildAgeBand = "age1" | "age2to3" | "age4to5" | "age6to8" |
  "age9to11" | "age12to13" | "age14to17";

interface ScenarioInput {
  adultCount: number;
  children: ChildAgeBand[];
  usesDaycare: boolean;
  // existing income, ZIP, rent, commute, and additional-expense fields
}
```

Store the source snapshot and provenance in `src/data/stamford.ts`, beside the other local assumptions. Use the December 2025 USDA Moderate-Cost Food Plan monthly values. For the sex-specific `12–13` and `14–17` rows, store the arithmetic mean of the female and male monthly amounts and label it as a derived broad average. Use Connecticut Care 4 Kids Southwest full-time center rates effective July 2023: infant/toddler `$422` weekly, preschool `$271`, and school-age `$191`. Convert weekly rates with the existing `4.33` weeks-per-month convention. Children aged 12–17 have child food but add no daycare cost because the selected childcare schedule has no matching teen rate.

Primary source URLs:

- USDA: `https://fns.usda.gov/sites/default/files/resource-files/cnpp-costfood-3levels-dec2025.pdf`
- Connecticut Care 4 Kids: `https://www.ctcare4kids.com/wp-content/uploads/2023/06/Care-4-Kids-Weekly-Rates-Effective-July-2023.pdf`

```text
adultCount + child age bands + usesDaycare
  -> validate family composition
  -> adult groceries from the existing two-adult baseline
  -> childFood = sum(USDA monthly cost for each age band)
  -> childcare = usesDaycare ? sum(eligible CT weekly rate × 4.33) : 0
  -> shared categories scale by adultCount + children.length
  -> existing basket, score, ranking, comparison, and insight
```

Preserve the existing two-adult grocery baseline: adult groceries equal the ZIP profile grocery amount multiplied by `adultCount / 2`. Add child food separately. Continue to scale restaurants, heat, and utilities by total people against the current two-person baseline. Keep tolls, rent, gas, and additional household expenses under their current rules. Child food and childcare do not vary by Stamford ZIP, so alternatives use the same family costs as the target.

In the page, render one child row per `children` item, with an age-band select and a remove action. An `Add child` action appends a row. Show the native checkbox as `Paid daycare`; its helper text states that a clear checkbox means home/family care and adds `$0` paid childcare. Loading or resetting a demo client must rebuild the child rows before recalculation. Loading a property must continue to change only ZIP and rent.

The set-aside option is one blended cost per child. It would make the form shorter, but it would hide the large age-based differences in both USDA food costs and Connecticut daycare rates.

## Files to Modify

- `src/data/stamford.ts` — define `ChildAgeBand`, age-band labels, USDA monthly child-food values, Connecticut daycare values, source provenance, and the new prepared family fields; retain all data as an offline snapshot.
- `src/data/demo-workspace.ts` — migrate each demo client from `householdSize` to `adultCount`, `children`, and `usesDaycare`; make Jordan M. the prepared two-adult, one-preschool-child daycare scenario and keep other records useful for child-free/home-care comparisons.
- `src/lib/affordability.ts` — replace the flat household interface and scaling rule with validated family composition; add `childFood` and `childcare` basket categories; preserve score, ranking, commute, rent override, and insight ownership.
- `src/lib/affordability.test.ts` — replace flat-household tests with behavior tests for age-based food, daycare/home-care switching, multiple children, teen eligibility, source conversion, family validation, the revised prepared result, and all preserved affordability behavior.
- `src/pages/index.astro` — add adult count, dynamic child rows, and the paid-daycare checkbox; serialize and restore family composition; show it in client cards/details; render child food and childcare in target and comparison breakdowns; disclose source dates and limits.
- `src/styles/global.css` — fit dynamic child rows, add/remove controls, checkbox/help text, and the larger breakdown into the current responsive and accessible design.
- `docs/demo-handoff.md` — replace obsolete household-size and golden-path values; document the family controls, exact prepared child costs and result, data provenance, daycare/home-care meaning, and the fact that AVA does not estimate every cost of raising a child.

## Reuse Opportunities

- `src/lib/affordability.ts` — retain `validateInput`, `evaluateZip`, `roundMoney`, score thresholds, stable ranking, and deterministic insight flow.
- `src/data/stamford.ts` — follow the existing `Provenance` model and local-data pattern instead of adding a runtime fetch or API.
- `src/pages/index.astro` — extend `fillFields`, `readScenario`, `render`, client loading, property loading, and automatic recalculation rather than adding a frontend framework or route.
- `src/styles/global.css` — reuse current form, button, card, focus, and mobile layout tokens.

## Implementation Steps

- [ ] `src/data/stamford.ts` exports a closed `ChildAgeBand` set with display labels, December 2025 USDA moderate-cost monthly child-food values, July 2023 Connecticut Southwest full-time center weekly rates, the `4.33` monthly conversion, and provenance for both sources; no runtime request is required.
- [ ] `PreparedScenario` and `ScenarioInput` use `adultCount`, `children`, and `usesDaycare`; `householdSize` no longer exists in the calculator, prepared scenario, demo clients, form controls, tests, or handoff instructions.
- [ ] The prepared Jordan M. scenario contains two adults, one `age4to5` child, and paid daycare. Its target breakdown reports `$214.10` child food and `$1,173.43` childcare before display rounding.
- [ ] `compareStamfordScenario` rejects a non-integer or non-positive adult count, a non-array child value, and any unknown child age band without mutating the scenario or profile data.
- [ ] Adult groceries use the existing two-adult ZIP baseline; child food is the sum of age-band USDA values; restaurants, heat, and utilities scale by total family members; rent, gas, tolls, and additional expenses retain their current rules.
- [ ] Paid daycare sums the applicable infant/toddler, preschool, or school-age monthly values for all children aged 1–11. Home/family care always returns `$0` childcare, and children aged 12–17 never receive a daycare amount from this dataset.
- [ ] `BasketBreakdown`, largest-cost selection, target rendering, selected-alternative rendering, and AVA Insight all include separate `childFood` and `childcare` categories, including a visible `$0` childcare row for home/family care.
- [ ] The calculator form has an adult-count input, repeatable labeled child age-band rows, keyboard-operable add/remove controls, and one native paid-daycare checkbox with clear home/family-care help text. Removing all child rows leaves a valid adult-only scenario and makes the checkbox have no cost effect.
- [ ] Resetting the demo or loading a client replaces all prior family controls with that record's adult count, child rows, and care choice before one recalculation. Loading a property still changes only target ZIP and rent and leaves family composition unchanged.
- [ ] Client cards/details expose a concise family summary and care choice so an agent can tell which record will load. At least one bundled client is child-free or uses home/family care to support a contrast with the prepared family.
- [ ] The existing fit-score mapping, fit-label thresholds, signed negative remainder, target-rent override, commute calculation, alternative exclusion/ranking/ties, no-improvement state, automatic recalculation, and input immutability remain covered and unchanged. The old behavior expected to stop is uniform `householdSize / 2` scaling for groceries and the omission of childcare.
- [ ] Source disclosure states the source, geography, rate schedule, and as-of date for child food and daycare. It calls these broad averages, explains that home/family care means no added paid care, and does not claim a complete cost-of-raising-a-child estimate or current provider quote.
- [ ] The family controls and expanded breakdown work at 390×844 and desktop widths without horizontal overflow, clipped child controls, pointer-only actions, hidden focus, or a color-only distinction.
- [ ] `docs/demo-handoff.md` contains the revised family click path, exact prepared result and category sum, expected daycare-off difference, supported claims, and offline/data-limit language that matches the interface and tests.

## Approval Confirmation

No completed Work Record is superseded. This Plan extends the verified affordability calculator and client/property previews. It does not replace their completed outcomes.

## Verification Plan

- Automated: run `deno task test`; the real Stamford fixture must prove the prepared family result, each child-food age mapping, daycare eligibility and monthly conversion, home-care zero cost, multiple-child summation, adult-only behavior, validation, and all preserved score/ranking behaviors.
- Automated: run `deno task check` and `deno task build`; Astro and TypeScript must pass, and the static build must require no environment value or network service.
- Existing-test migration: rewrite tests that construct `householdSize` scenarios against `adultCount`, `children`, and `usesDaycare`. Preserve score, fit label, rent override, negative remainder, ranking, tie, no-improvement, and immutability coverage. Remove only the assertion that all household members scale groceries uniformly because that behavior is intentionally replaced.
- Manual prepared path: load/reset Jordan M.; confirm two adults, one age 4–5 child, and paid daycare; calculate and reconcile `$214.10` child food, `$1,173.43` childcare, every category, monthly basket, remainder, score, best alternative, and insight with the automated golden test and `docs/demo-handoff.md`.
- Manual care switch: clear paid daycare and confirm childcare becomes `$0`, the basket falls by exactly `$1,173.43`, child food stays `$214.10`, the result and insight update, and reselecting daycare restores the exact values.
- Manual family editing: add children in two different bands, remove one, remove all, and change adult count. Confirm child rows, category values, score, alternatives, and client state update together without stale costs.
- Manual record flows: load a family client and an adult-only/home-care client from Clients Preview and confirm family controls are replaced. Then load a property and confirm only ZIP and rent change.
- Headed browser: run `deno task dev --host 0.0.0.0` at `http://localhost:4321`; at desktop and 390×844, exercise add/remove child, checkbox, reset, client load, property load, calculate, alternative compare, and keyboard focus. Confirm no horizontal overflow, inaccessible unlabeled controls, console errors, failed fetch/XHR requests, or result loss during view/dialog changes.
- Product honesty: confirm source links and dates are visible and that no copy says the values are live, provider quotes, financial advice, or the complete cost of raising a child.

## Edge Cases & Considerations

- USDA has no under-one food row. The youngest supported band is age 1; the interface must not silently map an infant under one to an unsupported food value.
- USDA teen food rows differ by sex. Because the chosen form asks only for age bands, the 12–13 and 14–17 values are explicit female/male arithmetic means and must be labeled as derived averages.
- The Connecticut table has no teen childcare row. A checked daycare box must not invent a cost for ages 12–17.
- One checkbox applies the same paid-daycare choice to all eligible children. Mixed paid/home arrangements and part-time schedules are outside this demo scope.
- Source rates are dated snapshots, not current provider quotes. Keep the source date visible and keep the existing no-runtime-network invariant.
- Child food and childcare remain the same across Stamford ZIP alternatives. They affect affordability scores but must not create false neighborhood-level variation.
- The working tree has staged changes in all main calculator files. Execution must modify the current contents in place and must not reset or replace those staged local-average, score, comparison, client/property, or styling changes.
