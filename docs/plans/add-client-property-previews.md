---
planId: "bf5b45b8-024c-43f0-9f6e-da22cccd9631"
classification: "PLANNED_CHANGE"
workKind: "FEATURE"
complexity: "MEDIUM"
summary: "Add offline preview screens for saved clients and Stamford properties, revise pricing to Single Agent and Agency, and keep the affordability calculator as the primary workspace."
affectedPaths:
  - "src/layouts/AppLayout.astro"
  - "src/pages/index.astro"
  - "src/styles/global.css"
  - "src/data/demo-workspace.ts"
  - "public/demo-properties/"
  - "docs/demo-handoff.md"
  - "package.json"
  - "deno.lock"
objectiveChecks:
  - id: "OC1"
    command: "set -e; deno task build >/dev/null; deno eval 'const h=await Deno.readTextFile(\"dist/index.html\"); for (const s of [\"Calculator\",\"Clients\",\"Properties\",\"Single Agent\",\"Agency\",\"Use in calculator\"]) if (!h.includes(s)) throw new Error(`missing ${s}`); for (const s of [\"Free\",\"Agent Pro\",\"Enterprise\"]) if (h.includes(s)) throw new Error(`obsolete tier ${s}`); if ((h.match(/data-view=/g)||[]).length < 3) throw new Error(\"missing workspace views\")'"
    rationale: "The baseline build still contains the obsolete Free/Agent Pro/Enterprise preview and has no Clients/Properties workspace labels or load action. This requires the revised two-plan copy and real workspace view markup to be present in the built app."
  - id: "OC2"
    command: "set -e; p=4331; deno task dev --host 127.0.0.1 --port $p >/tmp/ava-oc.log 2>&1 & q=$!; trap 'kill $q' EXIT; for i in $(seq 30); do curl -fsS localhost:$p >/dev/null && break; sleep 1; done; s=rw-oc; agent-browser --session $s open http://localhost:$p >/dev/null; agent-browser --session $s find text Clients click >/dev/null; agent-browser --session $s snapshot -i -c | grep -q 'Saved clients'; agent-browser --session $s find text Properties click >/dev/null; agent-browser --session $s snapshot -i -c | grep -q 'Demo property'; agent-browser --session $s find text 'Demo property' click >/dev/null; agent-browser --session $s find role button click --name 'Use in calculator' >/dev/null; agent-browser --session $s snapshot -i -c | grep -q 'Client basket'"
    rationale: "The baseline has no Clients or Properties views, no property detail action, and no record-to-calculator flow. This check fails until the user-visible navigation and retrieval workflow work in a browser, not only in source text."
objectiveChecksBaseline:
  recordedAt: "2026-08-19T22:46:11.916Z"
  head: "7a8f9ea6b68217a76532b54db8e5c1bd3310db01"
  results:
    - id: "OC1"
      command: "set -e; deno task build >/dev/null; deno eval 'const h=await Deno.readTextFile(\"dist/index.html\"); for (const s of [\"Calculator\",\"Clients\",\"Properties\",\"Single Agent\",\"Agency\",\"Use in calculator\"]) if (!h.includes(s)) throw new Error(`missing ${s}`); for (const s of [\"Free\",\"Agent Pro\",\"Enterprise\"]) if (h.includes(s)) throw new Error(`obsolete tier ${s}`); if ((h.match(/data-view=/g)||[]).length < 3) throw new Error(\"missing workspace views\")'"
      rationale: "The baseline build still contains the obsolete Free/Agent Pro/Enterprise preview and has no Clients/Properties workspace labels or load action. This requires the revised two-plan copy and real workspace view markup to be present in the built app."
      status: "unmet"
      stdout: ""
      stderr: "\u001b[0m\u001b[1m\u001b[31merror\u001b[0m: deno task couldn't find deno.json(c) or package.json. See https://docs.deno.com/go/config\n"
      exitCode: 1
      durationMs: 26
      output: "\n\u001b[0m\u001b[1m\u001b[31merror\u001b[0m: deno task couldn't find deno.json(c) or package.json. See https://docs.deno.com/go/config\n"
    - id: "OC2"
      command: "set -e; p=4331; deno task dev --host 127.0.0.1 --port $p >/tmp/ava-oc.log 2>&1 & q=$!; trap 'kill $q' EXIT; for i in $(seq 30); do curl -fsS localhost:$p >/dev/null && break; sleep 1; done; s=rw-oc; agent-browser --session $s open http://localhost:$p >/dev/null; agent-browser --session $s find text Clients click >/dev/null; agent-browser --session $s snapshot -i -c | grep -q 'Saved clients'; agent-browser --session $s find text Properties click >/dev/null; agent-browser --session $s snapshot -i -c | grep -q 'Demo property'; agent-browser --session $s find text 'Demo property' click >/dev/null; agent-browser --session $s find role button click --name 'Use in calculator' >/dev/null; agent-browser --session $s snapshot -i -c | grep -q 'Client basket'"
      rationale: "The baseline has no Clients or Properties views, no property detail action, and no record-to-calculator flow. This check fails until the user-visible navigation and retrieval workflow work in a browser, not only in source text."
      status: "unmet"
      stdout: ""
      stderr: "curl: (7) Failed to connect to localhost port 4331 after 0 ms: Couldn't connect to server\ncurl: (7) Failed to connect to localhost port 4331 after 1 ms: Couldn't connect to server\ncurl: (7) Failed to connect to localhost port 4331 after 1 ms: Couldn't connect to server\ncurl: (7) Failed to connect to localhost port 4331 after 1 ms: Couldn't connect to server\ncurl: (7) Failed to connect to localhost port 4331 after 1 ms: Couldn't connect to server\ncurl: (7) Failed to connect to localhost port 4331 after 1 ms: Couldn't connect to server\ncurl: (7) Failed to connect to localhost port 4331 after 1 ms: Couldn't connect to server\ncurl: (7) Failed to connect to localhost port 4331 after 1 ms: Couldn't connect to server\ncurl: (7) Failed to connect to localhost port 4331 after 0 ms: Couldn't connect to server\ncurl: (7) Failed to connect to localhost port 4331 after 1 ms: Couldn't connect to server\ncurl: (7) Failed to connect to localhost port 4331 after 1 ms: Couldn't connect to server\ncurl: (7) Failed to connect to localhost port 4331 after 1 ms: Couldn't connect to server\ncurl: (7) Failed to connect to localhost port 4331 after 1 ms: Couldn't connect to server\ncurl: (7) Failed to connect to localhost port 4331 after 1 ms: Couldn't connect to server\ncurl: (7) Failed to connect to localhost port 4331 after 1 ms: Couldn't connect to server\ncurl: (7) Failed to connect to localhost port 4331 after 1 ms: Couldn't connect to server\ncurl: (7) Failed to connect to localhost port 4331 after 1 ms: Couldn't connect to server\ncurl: (7) Failed to connect to localhost port 4331 after 1 ms: Couldn't connect to server\ncurl: (7) Failed to connect to localhost port 4331 after 1 ms: Couldn't connect to server\ncurl: (7) Failed to connect to localhost port 4331 after 1 ms: Couldn't connect to server\ncurl: (7) Failed to connect to localhost port 4331 after 1 ms: Couldn't connect to server\ncurl: (7) Failed to connect to localhost port 4331 after 1 ms: Couldn't connect to server\ncurl: (7) Failed to connect to localhost port 4331 after 1 ms: Couldn't connect to server\ncurl: (7) Failed to connect to localhost port 4331 after 1 ms: Couldn't connect to server\ncurl: (7) Failed to connect to localhost port 4331 after 1 ms: Couldn't connect to server\ncurl: (7) Failed to connect to localhost port 4331 after 1 ms: Couldn't connect to server\ncurl: (7) Failed to connect to localhost port 4331 after 0 ms: Couldn't connect to server\ncurl: (7) Failed to connect to localhost port 4331 after 1 ms: Couldn't connect to server\ncurl: (7) Failed to connect to localhost port 4331 after 1 ms: Couldn't connect to server\ncurl: (7) Failed to connect to localhost port 4331 after 1 ms: Couldn't connect to server\n✗ Navigation failed: net::ERR_CONNECTION_REFUSED\n/bin/sh: line 0: kill: (26942) - No such process\n"
      exitCode: 1
      durationMs: 31390
      output: "\ncurl: (7) Failed to connect to localhost port 4331 after 0 ms: Couldn't connect to server\ncurl: (7) Failed to connect to localhost port 4331 after 1 ms: Couldn't connect to server\ncurl: (7) Failed to connect to localhost port 4331 after 1 ms: Couldn't connect to server\ncurl: (7) Failed to connect to localhost port 4331 after 1 ms: Couldn't connect to server\ncurl: (7) Failed to connect to localhost port 4331 after 1 ms: Couldn't connect to server\ncurl: (7) Failed to connect to localhost port 4331 after 1 ms: Couldn't connect to server\ncurl: (7) Failed to connect to localhost port 4331 after 1 ms: Couldn't connect to server\ncurl: (7) Failed to connect to localhost port 4331 after 1 ms: Couldn't connect to server\ncurl: (7) Failed to connect to localhost port 4331 after 0 ms: Couldn't connect to server\ncurl: (7) Failed to connect to localhost port 4331 after 1 ms: Couldn't connect to server\ncurl: (7) Failed to connect to localhost port 4331 after 1 ms: Couldn't connect to server\ncurl: (7) Failed to connect to localhost port 4331 after 1 ms: Couldn't connect to server\ncurl: (7) Failed to connect to localhost port 4331 after 1 ms: Couldn't connect to server\ncurl: (7) Failed to connect to localhost port 4331 after 1 ms: Couldn't connect to server\ncurl: (7) Failed to connect to localhost port 4331 after 1 ms: Couldn't connect to server\ncurl: (7) Failed to connect to localhost port 4331 after 1 ms: Couldn't connect to server\ncurl: (7) Failed to connect to localhost port 4331 after 1 ms: Couldn't connect to server\ncurl: (7) Failed to connect to localhost port 4331 after 1 ms: Couldn't connect to server\ncurl: (7) Failed to connect to localhost port 4331 after 1 ms: Couldn't connect to server\ncurl: (7) Failed to connect to localhost port 4331 after 1 ms: Couldn't connect to server\ncurl: (7) Failed to connect to localhost port 4331 after 1 ms: Couldn't connect to server\ncurl: (7) Failed to connect to localhost port 4331 after 1 ms: Couldn't connect to server\ncurl: (7) Failed to connect to localhost port 4331 after 1 ms: Couldn't connect to server\ncurl: (7) Failed to connect to localhost port 4331 after 1 ms: Couldn't connect to server\ncurl: (7) Failed to connect to localhost port 4331 after 1 ms: Couldn't connect to server\ncurl: (7) Failed to connect to localhost port 4331 after 1 ms: Couldn't connect to server\ncurl: (7) Failed to connect to localhost port 4331 after 0 ms: Couldn't connect to server\ncurl: (7) Failed to connect to localhost port 4331 after 1 ms: Couldn't connect to server\ncurl: (7) Failed to connect to localhost port 4331 after 1 ms: Couldn't connect to server\ncurl: (7) Failed to connect to localhost port 4331 after 1 ms: Couldn't connect to server\n✗ Navigation failed: net::ERR_CONNECTION_REFUSED\n/bin/sh: line 0: kill: (26942) - No such process\n"
executionAgent: "frontend-engineer"
collaborationRecommendation: "pair"
devServerCommand: "deno task dev --host 0.0.0.0"
devServerUrl: "http://localhost:4321"
devServerHmr: true
createdAt: "2026-08-19T18:42:00-04:00"
updatedAt: "2026-08-19T23:06:03.815Z"
status: "validated_reviewer"
origin: "internal"
implementedAt: "2026-08-19T23:02:13.744Z"
userVerifiedAt: null
executionReport: "- Implemented offline Clients and Properties preview workspaces, local fictional property SVGs, detail dialogs, and Use in calculator flows while preserving the existing affordability calculation path.\n- Revised Upgrade to exactly Single Agent and Agency; removed Free, Agent Pro, and Enterprise from the built UI.\n- Merged `main` into the worktree without committing; used a temporary targeted stash to protect local work, restored the preview changes, and dropped the stash after verification.\n- Updated `docs/demo-handoff.md` with the new click path, preview boundaries, and fictional/no-live-listing disclaimer.\n- Verification passed: `deno task test` (11 passed), `deno task check` (0 errors), `deno task build`, OC1, and OC2.\n- Headed browser verified at `http://localhost:4331/`: desktop 1440×1000 home, Clients detail load, Properties detail load, Upgrade tiers, and mobile 390×844 Clients/Properties layout.\n- Visible evidence saved: `artifacts/final-property-loaded-desktop.png`, `artifacts/final-properties-mobile.png`, plus earlier `artifacts/clients-preview.png`, `artifacts/properties-preview.png`, `artifacts/property-loaded-calculator.png`.\n- Browser diagnostics: no page errors, no console output, and network requests were only local property SVGs with 200 responses."
humanReviewMode: "ask"
humanReviewDecision: "skipped"
validationCheckpoint: null
executionMode: "worktree"
executionBaselineTree: "5b518ae076e59752c78f916d81f7a422a4d03452"
worktreeId: "3a7c3386"
worktreePath: "/Users/gandazgul/.wld/worktrees/--Users-gandazgul-Documents-web-ava--/ava-add-client-property-previews-3a7c3386"
worktreeBranch: "worktree/add-client-property-previews-3a7c3386"
worktreeBaseBranch: "main"
worktreeStatus: "completed"
validationCiAttempts: 0
validationObjectiveCheckAttempts: 0
validationSemanticRounds: 1
---

# Add Client and Property Preview Screens

## Context

The current AVA prototype has one working calculator and an Upgrade dialog. The dialog still presents `Free`, `Agent Pro`, and `Enterprise`, while the intended product has only `Single Agent` and `Agency` levels. The current page also mentions saved clients and buildings only as future concepts, so the product does not yet make the broader agent workflow easy to understand.

The user wants a fake but believable workspace for clients and properties. The screen must show that an agent can save records and pull them back into the affordability workflow, while preserving the calculator as the main job. The user chose fictional Stamford-area demo properties with bundled images and a detail preview before loading a record into the calculator. No live listing feed, authentication, persistence, checkout, or runtime network request is in scope.

The working tree already contains unrelated edits in the calculator/data files. This Plan does not overwrite those files wholesale; execution must preserve their current behavior and make only the UI/data changes required here.

## Objective

Deliver an offline-capable AVA app shell with three clear destinations:

- `Calculator` remains the active primary workspace and continues to run the existing affordability calculation.
- `Clients · Preview` opens a fake saved-client screen with several Stamford renter records and a detail preview. A selected client can load its scenario values into the existing calculator form.
- `Properties · Preview` opens a fake saved-property screen with several fictional Stamford-area homes, bundled pictures, price, beds, baths, area, and a short description. A selected property can open its detail preview and load its rent/ZIP into the calculator.

The Upgrade dialog contains exactly two plan levels: `Single Agent` and `Agency`. Both explain saved clients and properties; Agency additionally explains shared records and team access. All non-working actions remain visibly marked `Preview` or `Coming soon`.

## Approach

Keep the existing single Astro route and use client-side view state rather than adding a router or backend. The app shell owns navigation; `index.astro` owns the calculator and preview surfaces; a new local data module owns demo records and the mapping from a record to the existing `ScenarioInput` shape.

```text
Header navigation
  -> Calculator view: existing form -> compareStamfordScenario -> results
  -> Clients view: demo records -> client detail -> load scenario -> Calculator view
  -> Properties view: demo cards -> property detail -> load ZIP/rent -> Calculator view
  -> Upgrade: Single Agent / Agency plan preview
```

Use a small, explicit state model so navigation does not erase a calculated result unless the user chooses to load a record:

```ts
activeView = "calculator" | "clients" | "properties"
selectedRecord = undefined | client | property

openRecord(record) -> selectedRecord = record; show detail dialog
useRecord(record) -> fill supported calculator fields; activeView = "calculator"; submit/recalculate
```

Use fictional, clearly labeled data such as `Demo property` and `Preview data`. Bundle lightweight local SVG/WEBP images under `public/demo-properties/` so the screen remains usable in the existing no-network demo. Do not scrape, hotlink, or imply that the cards are active MLS/listing inventory.

The set-aside option is a separate multi-page dashboard with a database-backed save flow. It would make the preview feel more complete but would add routing and persistence that the user did not request and that the current static prototype cannot support.

## Files to Modify

- `src/layouts/AppLayout.astro` — replace the single Upgrade control with accessible Calculator, Clients, and Properties navigation plus the Upgrade action; expose active view state without claiming that preview records are persisted.
- `src/pages/index.astro` — add client and property preview sections, record/detail dialogs, navigation state, load-to-calculator behavior, and the revised two-level Upgrade content; preserve the existing calculation, comparison, insight, reset, and dialog behavior.
- `src/styles/global.css` — style the app navigation, active state, preview workspace, property image cards, client records, detail dialogs, plan cards, badges, and responsive/mobile layouts using the existing visual tokens and focus treatment.
- `src/data/demo-workspace.ts` — define typed fictional client records, property records, local image paths, display metadata, and conversion helpers that produce valid existing calculator inputs without changing affordability ownership.
- `public/demo-properties/` — add a small set of local, optimized demo property images or SVG illustrations with no remote dependencies; filenames must map directly to property records.
- `docs/demo-handoff.md` — update the tested click path, future-product boundaries, pricing names, and explicit disclaimer that clients/properties are fictional preview records and are not saved or live listings.
- `package.json` — only if the implementation adds a focused image or UI verification task; do not add a runtime listing or image-fetch dependency.
- `deno.lock` — update only if `package.json` changes require it.

## Reuse Opportunities

- `src/layouts/AppLayout.astro` — reuse the existing sticky header, brand, Upgrade trigger, and document shell.
- `src/pages/index.astro` — reuse `fillDemo`, `readScenario`, `render`, `form.requestSubmit()`, the native `dialog` pattern, and the existing `stamfordProfiles` ZIP labels.
- `src/lib/affordability.ts` — keep `compareStamfordScenario` as the owner of calculation rules; preview records only provide inputs.
- `src/data/stamford.ts` — use `supportedZips`, `stamfordProfiles`, and `preparedScenario` for valid property ZIPs and client scenarios.
- `src/styles/global.css` — extend existing `.card`, `.badge`, `.primary-button`, `.ghost-button`, responsive grid, and focus-visible patterns rather than introducing a new design system.

## Implementation Steps

- [ ] `src/data/demo-workspace.ts` exports typed fictional client and property collections, each with stable IDs, display names, Stamford-area ZIPs, preview labels, and complete fields needed by its card/detail view; no record is described as live or persisted.
- [ ] Every demo property image is served from `public/demo-properties/` through a local path, has meaningful alternative text, and loads when the app is built without network access.
- [ ] The app header exposes Calculator, Clients, and Properties as semantic buttons/links with a visible active state; preview destinations are labeled `Preview` without hiding the primary Calculator destination.
- [ ] The Clients view renders multiple demo saved-client records with enough summary information to distinguish them, an empty-state-safe collection path, and a detail dialog with a `Use in calculator` action.
- [ ] The Properties view renders multiple fictional Stamford-area property cards with local image, price, beds/baths, area or ZIP, description, and `Preview` labeling; a card opens a detail dialog without navigating away from the app.
- [ ] Selecting `Use in calculator` for a client fills only supported scenario fields, returns to Calculator, preserves the calculator as the active view, and recalculates through `compareStamfordScenario` rather than duplicating affordability logic.
- [ ] Selecting `Use in calculator` for a property fills the supported target ZIP and expected rent fields, returns to Calculator, and leaves unrelated client/commute inputs intact; the interface states that this is a demo load, not a saved mutation.
- [ ] Opening Clients, Properties, or Upgrade after a calculation does not clear the current result; closing a detail or Upgrade dialog returns focus to the triggering control when the browser supports native dialog focus behavior.
- [ ] The Upgrade dialog contains no `Free`, `Agent Pro`, or `Enterprise` tier and presents exactly `Single Agent` and `Agency`; Single Agent describes saved clients and properties, while Agency describes shared client/property records and team access.
- [ ] All unimplemented save, retrieval, account, team, and listing capabilities are labeled `Preview` or `Coming soon`; copy does not imply live listings, authentication, persistence, payment, or a working agency backend.
- [ ] The existing calculator behavior remains protected: prepared demo scoring, alternative ranking/comparison, reset, adverse negative-remainder handling, and AVA Insight still use the current affordability module and remain unchanged except for supported record loading.
- [ ] The responsive layout works at 390×844 and desktop widths with no horizontal overflow, readable property imagery, touch-sized controls, visible keyboard focus, semantic dialog labels, and score meaning conveyed by text as well as color.
- [ ] `docs/demo-handoff.md` documents the new navigation path, sample record interaction, exact disclaimer language, and the revised Single Agent/Agency preview boundary.

## Approval Confirmation

No existing Work Record is superseded. This Plan extends the previously verified calculator prototype; it does not replace the completed affordability behavior.

## Verification Plan

- Automated: run `deno task test` and confirm all existing affordability tests pass; add focused tests for demo-record-to-scenario conversion if the helper is kept outside the page script.
- Automated: run `deno task check` and `deno task build`; confirm the build contains the Calculator, Clients, Properties, Single Agent, and Agency labels and local property image paths.
- Objective structural check: baseline must fail the submitted checks because the current source still contains the Free/Agent Pro/Enterprise tiers and has no Clients/Properties preview data or local property assets.
- Manual desktop browser at `http://localhost:4321` using `deno task dev --host 0.0.0.0`: confirm Calculator is the initial active view, open Clients, open a client detail, load it into the calculator, and confirm the result changes through the existing calculation path.
- Manual desktop browser: open Properties, verify multiple fictional Stamford property cards with pictures and readable metadata, open a property detail, load it into the calculator, and confirm target ZIP/rent update while client inputs remain intact.
- Manual desktop browser: calculate first, then open Clients, Properties, and Upgrade; close each and confirm the result remains visible and unchanged until a record is deliberately loaded.
- Manual Upgrade check: confirm only Single Agent and Agency appear, Free/Agent Pro/Enterprise do not appear, and plan copy distinguishes individual saved work from agency sharing.
- Manual mobile browser at 390×844: verify navigation does not clip, cards stack, images preserve their aspect ratio, dialogs fit the viewport, controls remain reachable, and there is no horizontal scrolling.
- Browser diagnostics: inspect accessibility snapshots, verify keyboard activation and visible focus for navigation/cards/dialog buttons, capture desktop and mobile screenshots, and confirm no console errors or failed XHR/fetch requests.

## Edge Cases & Considerations

- The word `saved` describes the product concept only. The current static prototype must say that preview records are not actually persisted after refresh.
- Fictional property cards must not use real listing addresses, broker marks, MLS identifiers, or language such as `for sale now`; use approximate Stamford-area labels and a `Demo property · Preview data` badge.
- A property can provide only ZIP and rent to the calculator. It must not silently overwrite income, household size, work ZIP, or commute days.
- A client may contain a target property/rent in its scenario. Loading a client should restore its full supported scenario; loading a property afterward should change only property-compatible fields.
- Dialog close, Escape, and navigation must not lose the current calculator state. Avoid nested dialogs; use one detail dialog with dynamic labeled content or separate clearly labeled dialogs.
- Local images increase repository size. Prefer a few small SVG/WEBP assets with fixed aspect-ratio containers and lazy loading below the first viewport.
- Existing uncommitted edits in `src/pages/index.astro` and `src/styles/global.css` overlap the implementation area. Execution must inspect and preserve those edits rather than resetting the files.
- No domain-language file exists in this repository, so use existing terms: `client`, `property`, `ZIP`, `calculator`, `Single Agent`, `Agency`, and `Preview`.
