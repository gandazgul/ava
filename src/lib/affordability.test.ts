import { assertEquals, assertThrows } from "@std/assert";
import { compareStamfordScenario, type ProfileMap, type ScenarioInput } from "./affordability.ts";
import { preparedScenario, stamfordProfiles } from "../data/stamford.ts";

const baseInput: ScenarioInput = { ...preparedScenario };

Deno.test("prepared scenario returns the expected target score and best alternative", () => {
  const result = compareStamfordScenario(baseInput, stamfordProfiles);

  assertEquals(result.target.monthlyBasket, 4467.43);
  assertEquals(result.target.remainingDollars, 2732.57);
  assertEquals(result.target.fitScore, 95);
  assertEquals(result.target.fitLabel, "Comfortable");
  assertEquals(result.bestAlternative?.zip, "06906");
  assertEquals(result.bestAlternative?.deltaRemaining, 514.05);
});

Deno.test("local average costs come from each ZIP profile", () => {
  const result = compareStamfordScenario(baseInput, stamfordProfiles);
  const alternative = result.alternatives.find((item) => item.zip === "06906");

  assertEquals(result.target.breakdown.groceries, stamfordProfiles["06902"].groceries);
  assertEquals(result.target.breakdown.restaurants, stamfordProfiles["06902"].restaurants);
  assertEquals(result.target.breakdown.tolls, stamfordProfiles["06902"].tolls);
  assertEquals(result.target.breakdown.heat, stamfordProfiles["06902"].heat);
  assertEquals(result.target.breakdown.utilities, stamfordProfiles["06902"].utilities);
  assertEquals(alternative?.breakdown.heat, stamfordProfiles["06906"].heat);
  assertEquals(alternative?.breakdown.utilities, stamfordProfiles["06906"].utilities);
});

Deno.test("household size changes household-sensitive monthly costs", () => {
  const onePerson = compareStamfordScenario({ ...baseInput, householdSize: 1 }, stamfordProfiles);
  const threePeople = compareStamfordScenario({ ...baseInput, householdSize: 3 }, stamfordProfiles);

  assertEquals(onePerson.target.monthlyBasket < baseInput.monthlyTakeHomeIncome, true);
  assertEquals(threePeople.target.monthlyBasket > onePerson.target.monthlyBasket, true);
  assertEquals(threePeople.target.remainingDollars < onePerson.target.remainingDollars, true);
  assertEquals(threePeople.target.fitScore < onePerson.target.fitScore, true);
});

Deno.test("each scenario input changes the target calculation", () => {
  const baseline = compareStamfordScenario(baseInput, stamfordProfiles).target;

  const cases: Array<[string, ScenarioInput, unknown]> = [
    [
      "monthlyTakeHomeIncome",
      { ...baseInput, monthlyTakeHomeIncome: baseInput.monthlyTakeHomeIncome + 100 },
      baseline.remainingDollars,
    ],
    [
      "householdSize",
      { ...baseInput, householdSize: baseInput.householdSize + 1 },
      baseline.monthlyBasket,
    ],
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
    { ...baseInput, monthlyTakeHomeIncome: 5000 },
    stamfordProfiles,
  );
  const maxScore = compareStamfordScenario(
    { ...baseInput, monthlyTakeHomeIncome: 7445.72 },
    stamfordProfiles,
  );

  assertEquals(reconsider.target.remainingDollars, 532.57);
  assertEquals(reconsider.target.fitScore, 27);
  assertEquals(reconsider.target.fitLabel, "Reconsider");
  assertEquals(maxScore.target.fitScore, 100);
  assertEquals(maxScore.target.fitLabel, "Comfortable");
});

Deno.test("fit grades still use 15 and 30 percent remaining thresholds", () => {
  const tight = compareStamfordScenario(
    { ...baseInput, monthlyTakeHomeIncome: 5255.8 },
    stamfordProfiles,
  );
  const comfortable = compareStamfordScenario(
    { ...baseInput, monthlyTakeHomeIncome: 6383 },
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

  assertEquals(result.target.remainingDollars, -1467.43);
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
  assertThrows(() =>
    compareStamfordScenario({ ...baseInput, householdSize: 1.5 }, stamfordProfiles)
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
