# AVA

AVA (Agent Value Add) is a static Astro and TypeScript demo for Stamford renter affordability. It helps a real
estate agent enter a renter's Client Basket, review a Fit Score, compare supported Stamford areas, and use clearly
labeled preview workspaces.

## Scope

The current demo supports Stamford ZIPs `06901`, `06902`, `06903`, `06905`, `06906`, and `06907`.

The main workflow is:

1. Open the **Calculator** workspace.
2. Use the Prepared Demo Client or enter a Client Basket.
3. Select **Calculate fit** to review the Monthly Basket, Income Remaining, Fit Score, and Fit Label.
4. Review ranked Alternatives and AVA Insight.
5. Use **Clients Preview** or **Properties Preview** to load fictional bundled records into the calculator.

Clients and properties are preview concepts. They are not saved user data, active listings, MLS records, or broker
inventory. Preview records are not persisted after refresh.

## Prerequisites

- [Deno](https://deno.com/) with permission to run the repository tasks.

No separate package installation or backend service is required.

## Develop

Start the Astro development server:

```sh
deno task dev
```

Open the local URL shown by Astro, normally <http://localhost:4321>.

Run the repository checks:

```sh
deno task check
deno task test
deno task build
```

The production build is written to `dist/`. You can serve that static directory with any static file server. The app
uses local data and local property illustrations, so it does not need runtime network access.

## Data and product limits

- Rent baselines use ZIP-level HUD Small Area Fair Market Rent data.
- Food and energy values use broad public baselines. Commute, restaurants, tolls, and parking use disclosed demo
  estimates.
- ZIPs represent approximate Stamford areas, not exact neighborhood boundaries. Commute values are precomputed and
  are not live traffic.
- AVA Insight is deterministic text from the current calculation. It is not an LLM result.
- The Fit Score is a demo measure, not financial advice. The demo does not include debt, health care, savings goals,
  taxes, ownership, or live listings.
- The Single Agent and Agency panels are future-product previews. The demo does not include login, persistence,
  checkout, team permissions, live listing feeds, or agency integrations.

## Project references

- [Demo handoff](docs/demo-handoff.md) — tested click path, prepared values, data disclosures, and no-network fallback.
- [Domain language](docs/domain-language.md) — canonical AVA terms and product boundaries.
- [MIT License](LICENSE)

## License

AVA is available under the MIT License. Copyright Stamford Micro-Hackathon Team 4 - AVA.
