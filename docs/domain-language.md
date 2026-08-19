# AVA Domain Language

AVA is a Stamford renter affordability demo for real estate agents. It explains a renter's full monthly fit for
supported Stamford areas and shows clearly labeled product preview concepts.

## Language

### Product and Workflow

**AVA**: Agent Value Add. A demo product that helps an agent discuss Stamford renter affordability. _Avoid_: AI advisor,
live underwriting tool

**Stamford Affordability Workflow**: The end-to-end demo flow where an agent enters or loads a renter scenario, reviews
the target result, compares other supported Stamford areas, and uses talking points.

**Calculator**: The primary workspace where an agent enters or loads the renter scenario and calculates affordability.

**Client Basket**: The renter scenario used by the Calculator. It includes monthly take-home income, household size,
target ZIP, expected rent, work ZIP, commute days per week, and additional household expenses.

**Prepared Demo Client**: The default fictional client scenario used to make the demo repeatable.

**Preview**: A clear label for product concepts or bundled records that demonstrate a possible workflow but are not
persisted, live, or connected to external services.

### Places and Records

**Supported Stamford ZIP**: One of the six in-scope Stamford ZIP codes: 06901, 06902, 06903, 06905, 06906, and 06907.

**Target ZIP**: The supported Stamford ZIP currently being evaluated for the renter.

**Work ZIP**: The supported Stamford ZIP used as the commute destination.

**Stamford Area**: The displayed area name for a supported ZIP, such as Downtown Stamford, South and Cove Stamford,
North Stamford, Mid-Ridges Stamford, Glenbrook Stamford, or Springdale Stamford.

**Client**: A fictional preview renter record that can load a complete Client Basket into the Calculator. _Avoid_: saved
user data, real customer

**Property**: A fictional preview rental record that can load target ZIP and expected rent into the Calculator. _Avoid_:
active listing, MLS record, broker inventory

**Clients Preview**: The preview workspace that shows fictional client records.

**Properties Preview**: The preview workspace that shows fictional Stamford property records.

### Affordability Results

**Monthly Basket**: The total monthly cost used for the fit calculation. It currently includes rent, groceries, gas,
restaurants, tolls, heat, utilities, and additional household expenses.

**Income Remaining**: Monthly take-home income minus the Monthly Basket. It can be negative.

**Fit Score**: A 0-to-100 score based on the share of monthly take-home income that remains after the Monthly Basket.

**Fit Label**: The plain-language category for a Fit Score result: Comfortable, Tight, or Reconsider.

**Alternative**: A supported Stamford ZIP other than the Target ZIP, ranked by projected Income Remaining.

**Better-Fit Stamford Area**: An Alternative that leaves more projected Income Remaining than the Target ZIP.

**Target Versus Alternative**: The side-by-side comparison between the Target ZIP and one selected Alternative.

**AVA Insight**: Deterministic talking points based on the current calculation. It is not an LLM result.

### Cost and Data Claims

**Local Average**: A broad cost estimate used in the demo for a Stamford area or for a category when live or
client-specific data is not available.

**ZIP-Level Source Data**: Source data with ZIP-level precision, currently used for rent baselines.

**State/National Baseline Data**: Broad public baseline data used as a local average, currently used for food and energy
assumptions.

**Demo Estimate**: A disclosed estimate used to support the demo story, currently used for commute, dining, tolls,
parking, clients, and properties.

**Source Disclosure**: The user-facing explanation of source, date, precision, and scope limits for values used in the
demo.

### Product Preview Levels

**Single Agent**: A preview product level for one agent's client and property workspace.

**Agency**: A preview product level for shared office workflow, including shared records, team access, manager review,
and agency controls.

## Open Language Questions

- None.
