import { assertEquals, assertThrows } from "@std/assert";
import { compareStamfordScenario, type ProfileMap, type ScenarioInput } from "./affordability.ts";
import { preparedScenario, stamfordProfiles } from "../data/stamford.ts";

const baseInput: ScenarioInput = { ...preparedScenario };

Deno.test("prepared scenario returns the expected target score and best alternative", () => {
  const result = compareStamfordScenario(baseInput, stamfordProfiles);

  assertEquals(result.target.monthlyBasket, 4467.43);
  assertEquals(result.target.remainingDollars, 2732.57);
  assertEquals(result.target.fitScore, 38);
  assertEquals(result.target.fitLabel, "Comfortable");
  assertEquals(result.bestAlternative?.zip, "06906");
  assertEquals(result.bestAlternative?.deltaRemaining, 499.05);
});

Deno.test("heat and utilities are editable scenario values", () => {
  const result = compareStamfordScenario(
    { ...baseInput, heat: 300, utilities: 400 },
    stamfordProfiles,
  );

  assertEquals(result.target.breakdown.heat, 300);
  assertEquals(result.target.breakdown.utilities, 400);
  assertEquals(
    result.alternatives.find((alternative) => alternative.zip === "06906")?.breakdown.heat,
    300,
  );
  assertEquals(
    result.alternatives.find((alternative) => alternative.zip === "06906")?.breakdown.utilities,
    400,
  );
});

Deno.test("score formula uses take-home income remaining after the basket", () => {
  const result = compareStamfordScenario(
    { ...baseInput, monthlyTakeHomeIncome: 5000 },
    stamfordProfiles,
  );

  assertEquals(result.target.remainingDollars, 532.57);
  assertEquals(result.target.fitScore, 11);
  assertEquals(result.target.fitLabel, "Reconsider");
});

Deno.test("fit thresholds label 15 as Tight and 30 as Comfortable", () => {
  const tight = compareStamfordScenario(
    { ...baseInput, monthlyTakeHomeIncome: 5255.8 },
    stamfordProfiles,
  );
  const comfortable = compareStamfordScenario(
    { ...baseInput, monthlyTakeHomeIncome: 6382.04 },
    stamfordProfiles,
  );

  assertEquals(tight.target.fitScore, 15);
  assertEquals(tight.target.fitLabel, "Tight");
  assertEquals(comfortable.target.fitScore, 30);
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
  assertThrows(() => compareStamfordScenario({ ...baseInput, groceries: -1 }, stamfordProfiles));
  assertThrows(() => compareStamfordScenario({ ...baseInput, heat: -1 }, stamfordProfiles));
  assertThrows(() => compareStamfordScenario({ ...baseInput, utilities: -1 }, stamfordProfiles));
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
