import { assertEquals, assertThrows } from "@std/assert";
import { compareStamfordScenario, type ProfileMap, type ScenarioInput } from "./affordability.ts";
import {
  childcareProvenance,
  childCostAssumptions,
  childFoodProvenance,
  fuelAssumption,
  preparedScenario,
  stamfordProfiles,
} from "../data/stamford.ts";

const baseInput: ScenarioInput = { ...preparedScenario };

Deno.test("prepared family scenario returns the expected target score and best alternative", () => {
  const result = compareStamfordScenario(baseInput, stamfordProfiles);

  assertEquals(baseInput.adultCount, 2);
  assertEquals(baseInput.children, ["age4to5"]);
  assertEquals(baseInput.usesDaycare, true);
  assertEquals(result.target.breakdown.childFood, 214.1);
  assertEquals(result.target.breakdown.childcare, 1173.43);
  assertEquals(result.target.monthlyBasket, 6234.96);
  assertEquals(result.target.remainingDollars, 965.04);
  assertEquals(result.target.fitScore, 34);
  assertEquals(result.target.fitLabel, "Reconsider");
  assertEquals(result.bestAlternative?.zip, "06906");
  assertEquals(result.bestAlternative?.deltaRemaining, 521.55);
});

Deno.test("local average costs come from each ZIP profile", () => {
  const result = compareStamfordScenario(baseInput, stamfordProfiles);
  const alternative = result.alternatives.find((item) => item.zip === "06906");

  assertEquals(result.target.breakdown.groceries, stamfordProfiles["06902"].groceries);
  assertEquals(result.target.breakdown.restaurants, stamfordProfiles["06902"].restaurants * 1.5);
  assertEquals(result.target.breakdown.tolls, stamfordProfiles["06902"].tolls);
  assertEquals(result.target.breakdown.heat, stamfordProfiles["06902"].heat * 1.5);
  assertEquals(result.target.breakdown.utilities, stamfordProfiles["06902"].utilities * 1.5);
  assertEquals(alternative?.breakdown.heat, 232.5);
  assertEquals(alternative?.breakdown.utilities, 315);
});

Deno.test("adult count and child rows change family-sensitive monthly costs", () => {
  const adultOnly = compareStamfordScenario(
    { ...baseInput, children: [], usesDaycare: false },
    stamfordProfiles,
  );
  const oneAdult = compareStamfordScenario({ ...baseInput, adultCount: 1 }, stamfordProfiles);
  const threePeople = compareStamfordScenario(baseInput, stamfordProfiles);

  assertEquals(oneAdult.target.breakdown.groceries, 380);
  assertEquals(adultOnly.target.breakdown.childFood, 0);
  assertEquals(adultOnly.target.breakdown.childcare, 0);
  assertEquals(threePeople.target.monthlyBasket > adultOnly.target.monthlyBasket, true);
  assertEquals(threePeople.target.remainingDollars < adultOnly.target.remainingDollars, true);
});

Deno.test("child food follows each supported age-band source snapshot", () => {
  const cases: Array<[ScenarioInput["children"], number]> = [
    [["age1"], 180],
    [["age2to3"], 200.5],
    [["age4to5"], 214.1],
    [["age6to8"], 295.3],
    [["age9to11"], 338.2],
    [["age12to13"], 346.05],
    [["age14to17"], 352.3],
    [["age1", "age4to5", "age14to17"], 746.4],
  ];

  for (const [children, expectedFood] of cases) {
    const result = compareStamfordScenario(
      { ...baseInput, children, usesDaycare: false },
      stamfordProfiles,
    );
    assertEquals(result.target.breakdown.childFood, expectedFood);
  }
});

Deno.test("paid daycare uses eligible Connecticut weekly rates and home care adds zero", () => {
  const children: ScenarioInput["children"] = ["age1", "age4to5", "age6to8", "age12to13"];
  const paid = compareStamfordScenario(
    { ...baseInput, children, usesDaycare: true },
    stamfordProfiles,
  );
  const home = compareStamfordScenario(
    { ...baseInput, children, usesDaycare: false },
    stamfordProfiles,
  );
  const expectedPaid = (422 + 271 + 191) * fuelAssumption.weeksPerMonth;

  assertEquals(paid.target.breakdown.childcare, Number(expectedPaid.toFixed(2)));
  assertEquals(home.target.breakdown.childcare, 0);
  assertEquals(
    Number((paid.target.monthlyBasket - home.target.monthlyBasket).toFixed(2)),
    Number(expectedPaid.toFixed(2)),
  );
  assertEquals(childCostAssumptions.age12to13.daycareWeekly, undefined);
});

Deno.test("insight shows child food and paid childcare as separate sourced monthly categories", () => {
  const result = compareStamfordScenario(baseInput, stamfordProfiles);

  assertEquals(
    result.insight.includes(
      `Child food adds $214 per month based on ${childFoodProvenance.label}.`,
    ),
    true,
  );
  assertEquals(
    result.insight.includes(
      `Paid childcare adds $1,173 per month based on ${childcareProvenance.label}.`,
    ),
    true,
  );
});

Deno.test("each scenario input changes the target calculation", () => {
  const baseline = compareStamfordScenario(baseInput, stamfordProfiles).target;

  const cases: Array<[string, ScenarioInput, unknown]> = [
    [
      "monthlyTakeHomeIncome",
      { ...baseInput, monthlyTakeHomeIncome: baseInput.monthlyTakeHomeIncome + 100 },
      baseline.remainingDollars,
    ],
    ["adultCount", { ...baseInput, adultCount: baseInput.adultCount + 1 }, baseline.monthlyBasket],
    ["children", { ...baseInput, children: ["age1", "age4to5"] }, baseline.monthlyBasket],
    ["usesDaycare", { ...baseInput, usesDaycare: false }, baseline.monthlyBasket],
    ["targetZip", { ...baseInput, targetZip: "06906" }, baseline.zip],
    [
      "targetRent",
      { ...baseInput, targetRent: baseInput.targetRent + 100 },
      baseline.monthlyBasket,
    ],
    ["workZip", { ...baseInput, workZip: "06907" }, baseline.breakdown.gas],
    [
      "commuteDaysPerWeek",
      { ...baseInput, commuteDaysPerWeek: baseInput.commuteDaysPerWeek + 1 },
      baseline.breakdown.gas,
    ],
    [
      "additionalHouseholdExpenses",
      {
        ...baseInput,
        additionalHouseholdExpenses: baseInput.additionalHouseholdExpenses + 100,
      },
      baseline.monthlyBasket,
    ],
  ];

  for (const [label, input, original] of cases) {
    const target = compareStamfordScenario(input, stamfordProfiles).target;
    const changed = label === "monthlyTakeHomeIncome"
      ? target.remainingDollars
      : label === "targetZip"
      ? target.zip
      : label === "workZip" || label === "commuteDaysPerWeek"
      ? target.breakdown.gas
      : target.monthlyBasket;

    assertEquals(changed === original, false, `${label} should affect the target calculation.`);
  }
});

Deno.test("score formula maps 40 percent remaining income to 100", () => {
  const reconsider = compareStamfordScenario(
    { ...baseInput, monthlyTakeHomeIncome: 7000 },
    stamfordProfiles,
  );
  const maxScore = compareStamfordScenario(
    { ...baseInput, monthlyTakeHomeIncome: 10391.6 },
    stamfordProfiles,
  );

  assertEquals(reconsider.target.remainingDollars, 765.04);
  assertEquals(reconsider.target.fitScore, 27);
  assertEquals(reconsider.target.fitLabel, "Reconsider");
  assertEquals(maxScore.target.fitScore, 100);
  assertEquals(maxScore.target.fitLabel, "Comfortable");
});

Deno.test("fit grades still use 15 and 30 percent remaining thresholds", () => {
  const tight = compareStamfordScenario(
    { ...baseInput, monthlyTakeHomeIncome: 7335.25 },
    stamfordProfiles,
  );
  const comfortable = compareStamfordScenario(
    { ...baseInput, monthlyTakeHomeIncome: 8907.09 },
    stamfordProfiles,
  );

  assertEquals(tight.target.fitScore, 38);
  assertEquals(tight.target.fitLabel, "Tight");
  assertEquals(comfortable.target.fitScore, 75);
  assertEquals(comfortable.target.fitLabel, "Comfortable");
});

Deno.test("target rent override changes only the target housing calculation", () => {
  const result = compareStamfordScenario({ ...baseInput, targetRent: 3000 }, stamfordProfiles);

  assertEquals(result.target.breakdown.rent, 3000);
  assertEquals(
    result.alternatives.find((alternative) => alternative.zip === "06906")?.breakdown.rent,
    2350,
  );
});

Deno.test("negative remaining dollars stay signed while the score is clamped to zero", () => {
  const result = compareStamfordScenario(
    { ...baseInput, monthlyTakeHomeIncome: 3000 },
    stamfordProfiles,
  );

  assertEquals(result.target.remainingDollars, -3234.96);
  assertEquals(result.target.fitScore, 0);
  assertEquals(result.target.fitLabel, "Reconsider");
});

Deno.test("alternatives are ranked by remaining dollars and exclude the target ZIP", () => {
  const result = compareStamfordScenario(baseInput, stamfordProfiles);

  assertEquals(result.alternatives.map((alternative) => alternative.zip), [
    "06906",
    "06907",
    "06905",
    "06903",
    "06901",
  ]);
  assertEquals(
    result.alternatives.some((alternative) => alternative.zip === result.target.zip),
    false,
  );
});

Deno.test("ties are sorted by ZIP for deterministic recommendation order", () => {
  const profiles: ProfileMap = structuredClone(stamfordProfiles);
  profiles["06905"].rent = 2200;
  profiles["06905"].heat = 160;
  profiles["06905"].utilities = 215;
  profiles["06906"].rent = 2600;
  profiles["06907"].rent = 2200;
  profiles["06907"].heat = 160;
  profiles["06907"].utilities = 215;
  const input = { ...baseInput, workZip: "06905", commuteDaysPerWeek: 0 };

  const result = compareStamfordScenario(input, profiles);

  assertEquals(result.alternatives.slice(0, 2).map((alternative) => alternative.zip), [
    "06905",
    "06907",
  ]);
  assertEquals(result.alternatives[0].remainingDollars, result.alternatives[1].remainingDollars);
});

Deno.test("no-improvement state is returned when the current ZIP is already best", () => {
  const result = compareStamfordScenario({
    ...baseInput,
    targetRent: 2000,
    targetZip: "06906",
    workZip: "06906",
    commuteDaysPerWeek: 0,
  }, stamfordProfiles);

  assertEquals(result.bestAlternative, undefined);
  assertEquals(
    result.noImprovementMessage,
    "AVA found no better fit within the six-ZIP Stamford demo area.",
  );
});

Deno.test("validation rejects invalid inputs", () => {
  assertThrows(() =>
    compareStamfordScenario({ ...baseInput, monthlyTakeHomeIncome: 0 }, stamfordProfiles)
  );
  assertThrows(() =>
    compareStamfordScenario({ ...baseInput, additionalHouseholdExpenses: -1 }, stamfordProfiles)
  );
  assertThrows(() =>
    compareStamfordScenario({ ...baseInput, targetZip: "10001" }, stamfordProfiles)
  );
  assertThrows(() => compareStamfordScenario({ ...baseInput, adultCount: 1.5 }, stamfordProfiles));
  assertThrows(() => compareStamfordScenario({ ...baseInput, adultCount: 0 }, stamfordProfiles));
  assertThrows(() =>
    compareStamfordScenario(
      { ...baseInput, children: "age4to5" as unknown as [] },
      stamfordProfiles,
    )
  );
  assertThrows(() =>
    compareStamfordScenario(
      { ...baseInput, children: ["infant"] as unknown as [] },
      stamfordProfiles,
    )
  );
  assertThrows(() =>
    compareStamfordScenario(
      { ...baseInput, usesDaycare: "yes" as unknown as boolean },
      stamfordProfiles,
    )
  );
  assertThrows(() =>
    compareStamfordScenario({ ...baseInput, commuteDaysPerWeek: 8 }, stamfordProfiles)
  );
});

Deno.test("comparison does not mutate input objects", () => {
  const input = structuredClone(baseInput);
  const profiles = structuredClone(stamfordProfiles);
  const originalInput = structuredClone(input);
  const originalProfiles = structuredClone(profiles);

  compareStamfordScenario(input, profiles);

  assertEquals(input, originalInput);
  assertEquals(profiles, originalProfiles);
});
