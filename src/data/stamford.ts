export const supportedZips = ["06901", "06902", "06903", "06905", "06906", "06907"] as const;
export type StamfordZip = typeof supportedZips[number];

export type ProvenancePrecision = "ZIP-level source data" | "state/national baseline data" | "demo estimate";

export interface Provenance {
  label: string;
  asOf: string;
  source: string;
  precision: ProvenancePrecision;
}

export interface StamfordProfile {
  zip: StamfordZip;
  areaName: string;
  rent: number;
  heat: number;
  utilities: number;
  provenance: {
    rent: Provenance;
    heat: Provenance;
    utilities: Provenance;
  };
}

export interface CommuteEstimate {
  milesOneWay: number;
  minutesOneWay: number;
  provenance: Provenance;
}

export interface PreparedScenario {
  clientName: string;
  monthlyTakeHomeIncome: number;
  householdSize: number;
  targetZip: StamfordZip;
  targetRent: number;
  workZip: StamfordZip;
  commuteDaysPerWeek: number;
  groceries: number;
  restaurants: number;
  tolls: number;
}

const hudRent = (zip: StamfordZip): Provenance => ({
  label: `HUD Small Area Fair Market Rent baseline for ${zip}`,
  asOf: "FY2025",
  source: "https://www.huduser.gov/portal/datasets/fmr/smallarea/index.html",
  precision: "ZIP-level source data"
});

const energy = (label: string): Provenance => ({
  label,
  asOf: "2024",
  source: "https://www.eia.gov/state/data.php?sid=CT",
  precision: "state/national baseline data"
});

export const foodProvenance: Provenance = {
  label: "USDA moderate food plan broad baseline, editable for client basket",
  asOf: "2025",
  source: "https://www.fns.usda.gov/cnpp/usda-food-plans-cost-food-monthly-reports",
  precision: "state/national baseline data"
};

export const restaurantProvenance: Provenance = {
  label: "Local dining allowance set for demo persona, editable by agent",
  asOf: "2026-08-19",
  source: "demo estimate",
  precision: "demo estimate"
};

export const tollProvenance: Provenance = {
  label: "Expected monthly toll/parking allowance for prepared commute, editable by agent",
  asOf: "2026-08-19",
  source: "demo estimate",
  precision: "demo estimate"
};

export const commuteProvenance: Provenance = {
  label: "Precomputed OpenStreetMap / Open Source Routing Machine commute estimate",
  asOf: "2026-08-19",
  source: "https://www.openstreetmap.org/copyright and https://project-osrm.org/",
  precision: "demo estimate"
};

export const fuelAssumption = {
  dollarsPerGallon: 3.45,
  milesPerGallon: 25,
  weeksPerMonth: 4.33,
  provenance: energy("Connecticut regular gasoline assumption used with fixed mileage estimate")
};

export const preparedScenario: PreparedScenario = {
  clientName: "Jordan M.",
  monthlyTakeHomeIncome: 7200,
  householdSize: 2,
  targetZip: "06902",
  targetRent: 2850,
  workZip: "06901",
  commuteDaysPerWeek: 4,
  groceries: 760,
  restaurants: 380,
  tolls: 85
};

export const stamfordProfiles: Record<StamfordZip, StamfordProfile> = {
  "06901": { zip: "06901", areaName: "Downtown Stamford", rent: 2750, heat: 145, utilities: 215, provenance: { rent: hudRent("06901"), heat: energy("Connecticut residential heat estimate"), utilities: energy("Connecticut residential electricity and utility estimate") } },
  "06902": { zip: "06902", areaName: "South and Cove Stamford", rent: 2825, heat: 160, utilities: 220, provenance: { rent: hudRent("06902"), heat: energy("Connecticut residential heat estimate"), utilities: energy("Connecticut residential electricity and utility estimate") } },
  "06903": { zip: "06903", areaName: "North Stamford", rent: 2550, heat: 185, utilities: 240, provenance: { rent: hudRent("06903"), heat: energy("Connecticut residential heat estimate"), utilities: energy("Connecticut residential electricity and utility estimate") } },
  "06905": { zip: "06905", areaName: "Mid-Ridges Stamford", rent: 2475, heat: 170, utilities: 225, provenance: { rent: hudRent("06905"), heat: energy("Connecticut residential heat estimate"), utilities: energy("Connecticut residential electricity and utility estimate") } },
  "06906": { zip: "06906", areaName: "Glenbrook Stamford", rent: 2350, heat: 155, utilities: 210, provenance: { rent: hudRent("06906"), heat: energy("Connecticut residential heat estimate"), utilities: energy("Connecticut residential electricity and utility estimate") } },
  "06907": { zip: "06907", areaName: "Springdale Stamford", rent: 2425, heat: 165, utilities: 215, provenance: { rent: hudRent("06907"), heat: energy("Connecticut residential heat estimate"), utilities: energy("Connecticut residential electricity and utility estimate") } }
};

const row = (values: Record<StamfordZip, [number, number]>): Record<StamfordZip, CommuteEstimate> =>
  Object.fromEntries(Object.entries(values).map(([zip, [milesOneWay, minutesOneWay]]) => [zip, { milesOneWay, minutesOneWay, provenance: commuteProvenance }])) as Record<StamfordZip, CommuteEstimate>;

export const commuteMatrix: Record<StamfordZip, Record<StamfordZip, CommuteEstimate>> = {
  "06901": row({ "06901": [0.8, 6], "06902": [2.4, 13], "06903": [6.8, 20], "06905": [3.1, 14], "06906": [2.7, 12], "06907": [4.4, 16] }),
  "06902": row({ "06901": [2.6, 14], "06902": [1.0, 7], "06903": [8.0, 24], "06905": [4.4, 17], "06906": [4.0, 16], "06907": [5.5, 19] }),
  "06903": row({ "06901": [6.9, 21], "06902": [8.0, 24], "06903": [1.5, 8], "06905": [4.5, 15], "06906": [6.0, 19], "06907": [4.2, 16] }),
  "06905": row({ "06901": [3.2, 14], "06902": [4.4, 17], "06903": [4.6, 16], "06905": [1.1, 7], "06906": [2.7, 12], "06907": [2.4, 11] }),
  "06906": row({ "06901": [2.8, 12], "06902": [4.0, 16], "06903": [6.0, 19], "06905": [2.7, 12], "06906": [0.9, 6], "06907": [2.0, 10] }),
  "06907": row({ "06901": [4.5, 16], "06902": [5.6, 20], "06903": [4.2, 16], "06905": [2.4, 11], "06906": [2.0, 10], "06907": [0.8, 6] })
};
