import type { PreparedScenario, StamfordZip } from "./stamford.ts";

export interface DemoClientRecord {
  id: string;
  name: string;
  label: string;
  status: string;
  goal: string;
  notes: string;
  scenario: PreparedScenario;
}

export interface DemoPropertyRecord {
  id: string;
  title: string;
  label: string;
  areaName: string;
  zip: StamfordZip;
  rent: number;
  price: string;
  beds: number;
  baths: number;
  image: string;
  imageAlt: string;
  description: string;
  highlights: string[];
}

export const demoClients: DemoClientRecord[] = [
  {
    id: "client-jordan",
    name: "Jordan M.",
    label: "Saved client · Preview data",
    status: "Family touring South Stamford rentals",
    goal: "Two adults and one preschool-age child need a clear daycare cost story near $2,850 rent.",
    notes:
      "Prepared demo client. Values reload into the calculator but are not persisted after refresh.",
    scenario: {
      clientName: "Jordan M.",
      monthlyTakeHomeIncome: 7200,
      adultCount: 2,
      children: ["age4to5"],
      usesDaycare: true,
      targetZip: "06902",
      targetRent: 2850,
      workZip: "06901",
      commuteDaysPerWeek: 4,
      additionalHouseholdExpenses: 0,
    },
  },
  {
    id: "client-lee",
    name: "Sam and Priya L.",
    label: "Saved client · Preview data",
    status: "Comparing Glenbrook and Springdale",
    goal: "Two-adult household wants more monthly room for transit and savings.",
    notes: "Useful for contrasting a child-free household with the family demo client.",
    scenario: {
      clientName: "Sam and Priya L.",
      monthlyTakeHomeIncome: 8400,
      adultCount: 2,
      children: [],
      usesDaycare: false,
      targetZip: "06906",
      targetRent: 2600,
      workZip: "06901",
      commuteDaysPerWeek: 3,
      additionalHouseholdExpenses: 0,
    },
  },
  {
    id: "client-rivera",
    name: "Maya R.",
    label: "Saved client · Preview data",
    status: "Needs North Stamford space trade-off",
    goal: "One adult with two school-age children is testing lower rent against a longer commute.",
    notes: "Shows how home or family care keeps paid childcare out of the basket.",
    scenario: {
      clientName: "Maya R.",
      monthlyTakeHomeIncome: 6900,
      adultCount: 1,
      children: ["age6to8", "age9to11"],
      usesDaycare: false,
      targetZip: "06903",
      targetRent: 2450,
      workZip: "06902",
      commuteDaysPerWeek: 5,
      additionalHouseholdExpenses: 0,
    },
  },
];

export const demoProperties: DemoPropertyRecord[] = [
  {
    id: "property-cove-townhome",
    title: "Cove Road townhome",
    label: "Demo property · Preview data",
    areaName: "South and Cove Stamford",
    zip: "06902",
    rent: 2950,
    price: "$2,950/mo",
    beds: 2,
    baths: 2,
    image: "/demo-properties/cove-townhome.svg",
    imageAlt: "Illustration of a two-story townhome near the Cove area of Stamford",
    description:
      "A fictional townhome-style rental used to show how an agent can pull a property into the calculator.",
    highlights: ["Near Cove parks", "Two bedrooms", "Quick drive to downtown"],
  },
  {
    id: "property-glenbrook-condo",
    title: "Glenbrook station condo",
    label: "Demo property · Preview data",
    areaName: "Glenbrook Stamford",
    zip: "06906",
    rent: 2550,
    price: "$2,550/mo",
    beds: 2,
    baths: 1,
    image: "/demo-properties/glenbrook-condo.svg",
    imageAlt: "Illustration of a mid-rise condo building in Glenbrook Stamford",
    description:
      "A fictional condo record for previewing saved property retrieval and ZIP comparison.",
    highlights: ["Close to rail", "Lower rent target", "Short downtown commute"],
  },
  {
    id: "property-springdale-house",
    title: "Springdale duplex home",
    label: "Demo property · Preview data",
    areaName: "Springdale Stamford",
    zip: "06907",
    rent: 2725,
    price: "$2,725/mo",
    beds: 3,
    baths: 2,
    image: "/demo-properties/springdale-duplex.svg",
    imageAlt: "Illustration of a duplex home in Springdale Stamford",
    description:
      "A fictional home-style rental that helps show saved houses and building records in one Properties view.",
    highlights: ["Three bedrooms", "Residential street", "Works for family tours"],
  },
];
