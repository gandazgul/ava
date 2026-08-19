import {
  commuteMatrix,
  fuelAssumption,
  type StamfordProfile,
  type StamfordZip,
  supportedZips,
} from "../data/stamford.ts";

export interface ScenarioInput {
  monthlyTakeHomeIncome: number;
  householdSize: number;
  targetZip: string;
  targetRent: number;
  workZip: string;
  commuteDaysPerWeek: number;
  groceries: number;
  restaurants: number;
  tolls: number;
  heat: number;
  utilities: number;
}

export interface BasketBreakdown {
  rent: number;
  groceries: number;
  gas: number;
  restaurants: number;
  tolls: number;
  heat: number;
  utilities: number;
}

export type FitLabel = "Comfortable" | "Tight" | "Reconsider";

export interface ZipEvaluation {
  zip: StamfordZip;
  areaName: string;
  breakdown: BasketBreakdown;
  monthlyBasket: number;
  remainingDollars: number;
  fitScore: number;
  fitLabel: FitLabel;
  commuteMinutesOneWay: number;
  commuteMilesOneWay: number;
}

export interface AlternativeResult extends ZipEvaluation {
  deltaRemaining: number;
  deltaRent: number;
  deltaCommuteMinutes: number;
}

export interface ComparisonResult {
  target: ZipEvaluation;
  alternatives: AlternativeResult[];
  bestAlternative?: AlternativeResult;
  noImprovementMessage?: string;
  insight: string[];
}

export type ProfileMap = Record<StamfordZip, StamfordProfile>;

const zipSet = new Set<string>(supportedZips);

export function isSupportedZip(zip: string): zip is StamfordZip {
  return zipSet.has(zip);
}

export function compareStamfordScenario(
  input: ScenarioInput,
  profiles: ProfileMap,
): ComparisonResult {
  const scenario = validateInput(input);
  const targetProfile = profiles[scenario.targetZip];
  const target = evaluateZip(scenario, targetProfile, scenario.targetRent);
  const alternatives = supportedZips
    .filter((zip) => zip !== scenario.targetZip)
    .map((zip) =>
      buildAlternative(target, evaluateZip(scenario, profiles[zip], profiles[zip].rent))
    )
    .sort((a, b) => b.remainingDollars - a.remainingDollars || a.zip.localeCompare(b.zip));
  const bestAlternative = alternatives.find((alternative) =>
    alternative.remainingDollars > target.remainingDollars
  );
  const noImprovementMessage = bestAlternative
    ? undefined
    : "AVA found no better fit within the six-ZIP Stamford demo area.";

  return {
    target,
    alternatives,
    bestAlternative,
    noImprovementMessage,
    insight: buildInsight(target, alternatives[0], bestAlternative),
  };
}

function validateInput(
  input: ScenarioInput,
): Required<Omit<ScenarioInput, "targetZip" | "workZip">> & {
  targetZip: StamfordZip;
  workZip: StamfordZip;
} {
  assertPositive(input.monthlyTakeHomeIncome, "Monthly take-home income");
  assertPositive(input.householdSize, "Household size");
  assertNonnegative(input.targetRent, "Expected rent");
  assertNonnegative(input.groceries, "Groceries");
  assertNonnegative(input.restaurants, "Restaurants");
  assertNonnegative(input.tolls, "Tolls");
  assertNonnegative(input.heat, "Heat");
  assertNonnegative(input.utilities, "Utilities");
  assertNonnegative(input.commuteDaysPerWeek, "Commute days per week");
  if (input.commuteDaysPerWeek > 7) throw new Error("Commute days per week must be 7 or less.");
  if (!Number.isInteger(input.householdSize)) {
    throw new Error("Household size must be a whole number.");
  }
  if (!isSupportedZip(input.targetZip)) {
    throw new Error("Target ZIP must be a supported Stamford ZIP.");
  }
  if (!isSupportedZip(input.workZip)) throw new Error("Work ZIP must be a supported Stamford ZIP.");
  return { ...input, targetZip: input.targetZip, workZip: input.workZip };
}

function assertPositive(value: number, label: string): void {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${label} must be a finite positive number.`);
  }
}

function assertNonnegative(value: number, label: string): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`${label} must be a finite nonnegative number.`);
  }
}

function evaluateZip(
  input: ReturnType<typeof validateInput>,
  profile: StamfordProfile,
  rent: number,
): ZipEvaluation {
  const commute = commuteMatrix[profile.zip][input.workZip];
  const gas = roundMoney(
    commute.milesOneWay * 2 * input.commuteDaysPerWeek * fuelAssumption.weeksPerMonth /
      fuelAssumption.milesPerGallon * fuelAssumption.dollarsPerGallon,
  );
  const breakdown: BasketBreakdown = {
    rent,
    groceries: input.groceries,
    gas,
    restaurants: input.restaurants,
    tolls: input.tolls,
    heat: input.heat,
    utilities: input.utilities,
  };
  const monthlyBasket = roundMoney(Object.values(breakdown).reduce((sum, value) => sum + value, 0));
  const remainingDollars = roundMoney(input.monthlyTakeHomeIncome - monthlyBasket);
  const fitScore = clamp(Math.round(100 * remainingDollars / input.monthlyTakeHomeIncome), 0, 100);
  return {
    zip: profile.zip,
    areaName: profile.areaName,
    breakdown,
    monthlyBasket,
    remainingDollars,
    fitScore,
    fitLabel: fitScore >= 30 ? "Comfortable" : fitScore >= 15 ? "Tight" : "Reconsider",
    commuteMinutesOneWay: commute.minutesOneWay,
    commuteMilesOneWay: commute.milesOneWay,
  };
}

function buildAlternative(target: ZipEvaluation, alternative: ZipEvaluation): AlternativeResult {
  return {
    ...alternative,
    deltaRemaining: roundMoney(alternative.remainingDollars - target.remainingDollars),
    deltaRent: roundMoney(alternative.breakdown.rent - target.breakdown.rent),
    deltaCommuteMinutes: alternative.commuteMinutesOneWay - target.commuteMinutesOneWay,
  };
}

function buildInsight(
  target: ZipEvaluation,
  topAlternative: AlternativeResult | undefined,
  bestAlternative: AlternativeResult | undefined,
): string[] {
  const largestEntry = Object.entries(target.breakdown).sort((a, b) => b[1] - a[1])[0] as [
    keyof BasketBreakdown,
    number,
  ];
  const lines = [
    `Current fit is ${target.fitLabel}: ${target.fitScore}% of take-home income remains after this basket.`,
    `The largest monthly cost is ${labelForCategory(largestEntry[0])} at ${
      formatDollars(largestEntry[1])
    }.`,
  ];

  if (bestAlternative) {
    const minutes = bestAlternative.deltaCommuteMinutes;
    const commuteText = minutes === 0
      ? "with the same one-way commute time"
      : minutes > 0
      ? `with a ${minutes}-minute longer one-way commute`
      : `with a ${Math.abs(minutes)}-minute shorter one-way commute`;
    lines.push(
      `${bestAlternative.zip} ${bestAlternative.areaName} leaves ${
        formatSignedDollars(bestAlternative.deltaRemaining)
      } more per month ${commuteText}.`,
    );
  } else if (topAlternative) {
    lines.push(
      `No supported Stamford alternative improves monthly remaining income; the closest option is ${topAlternative.zip}.`,
    );
  }

  return lines;
}

function labelForCategory(category: keyof BasketBreakdown): string {
  return category === "rent" ? "rent" : category;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function formatDollars(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatSignedDollars(value: number): string {
  const formatted = formatDollars(Math.abs(value));
  return value >= 0 ? `+${formatted}` : `-${formatted}`;
}
