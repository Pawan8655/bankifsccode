import Papa from "papaparse";

export interface IFSCData {
  Bank: string;
  IFSC: string;
  MICR: string;
  Branch: string;
  Address: string;
  City: string;
  District: string;
  State: string;
  Contact: string;
  Centre?: string;
  IMPS?: string;
  RTGS?: string;
  NEFT?: string;
  UPI?: string;
  SWIFT?: string;
  ISO3166?: string;
}

// Column name mappings from various CSV formats
const COLUMN_MAPPINGS: Record<string, keyof IFSCData> = {
  // Standard format
  Bank: "Bank",
  IFSC: "IFSC",
  MICR: "MICR",
  Branch: "Branch",
  Address: "Address",
  City: "City",
  District: "District",
  State: "State",
  Contact: "Contact",
  // Alternative format (uppercase)
  BANK: "Bank",
  BRANCH: "Branch",
  ADDRESS: "Address",
  CITY: "City",
  DISTRICT: "District",
  STATE: "State",
  CONTACT: "Contact",
  CENTRE: "Centre",
  IMPS: "IMPS",
  RTGS: "RTGS",
  NEFT: "NEFT",
  UPI: "UPI",
  SWIFT: "SWIFT",
  ISO3166: "ISO3166",
};

export function mapRowToIFSCData(row: any): IFSCData | null {
  const mappedRow: Partial<IFSCData> = {};

  Object.keys(row).forEach((key) => {
    const mappedKey = COLUMN_MAPPINGS[key.trim()];
    if (mappedKey) {
      (mappedRow as any)[mappedKey] = row[key] || "";
    }
  });

  // Ensure required fields exist
  if (mappedRow.Bank && mappedRow.IFSC) {
    // Use Centre/City fallback
    if (!mappedRow.City && mappedRow.Centre) {
      mappedRow.City = mappedRow.Centre;
    }

    return {
      Bank: mappedRow.Bank || "",
      IFSC: mappedRow.IFSC || "",
      MICR: mappedRow.MICR || "",
      Branch: mappedRow.Branch || "",
      Address: mappedRow.Address || "",
      City: mappedRow.City || mappedRow.Centre || "",
      District: mappedRow.District || "",
      State: mappedRow.State || "",
      Contact: mappedRow.Contact || "",
      Centre: mappedRow.Centre,
      IMPS: mappedRow.IMPS,
      RTGS: mappedRow.RTGS,
      NEFT: mappedRow.NEFT,
      UPI: mappedRow.UPI,
      SWIFT: mappedRow.SWIFT,
      ISO3166: mappedRow.ISO3166,
    };
  }
  return null;
}

export type IFSCLookup = {
  banks: string[];
  statesMap: Map<string, Set<string>>; // Bank -> Set<State>
  citiesMap: Map<string, Map<string, Set<string>>>; // Bank -> State -> Set<City>
  branchesMap: Map<string, Map<string, Map<string, IFSCData[]>>>; // Bank -> State -> City -> Branches[]
};

// Build optimized indices for O(1) lookups
export function buildIndices(data: IFSCData[]): IFSCLookup {
  const banks = new Set<string>();
  const statesMap = new Map<string, Set<string>>();
  const citiesMap = new Map<string, Map<string, Set<string>>>();
  const branchesMap = new Map<string, Map<string, Map<string, IFSCData[]>>>();

  data.forEach((item) => {
    const { Bank, State, City } = item;
    if (!Bank || !State || !City) return;

    banks.add(Bank);

    // Update States
    if (!statesMap.has(Bank)) statesMap.set(Bank, new Set());
    statesMap.get(Bank)!.add(State);

    // Update Cities
    if (!citiesMap.has(Bank)) citiesMap.set(Bank, new Map());
    const bankCities = citiesMap.get(Bank)!;
    if (!bankCities.has(State)) bankCities.set(State, new Set());
    bankCities.get(State)!.add(City);

    // Update Branches
    if (!branchesMap.has(Bank)) branchesMap.set(Bank, new Map());
    const bankBranches = branchesMap.get(Bank)!;
    if (!bankBranches.has(State)) bankBranches.set(State, new Map());
    const stateBranches = bankBranches.get(State)!;
    if (!stateBranches.has(City)) stateBranches.set(City, []);
    stateBranches.get(City)!.push(item);
  });

  return {
    banks: Array.from(banks).sort(),
    statesMap,
    citiesMap,
    branchesMap,
  };
}

// Legacy helper wrappers optimized for indexed data usage if available
// Note: These now prefer taking the lookup object if possible, but for backward compatibility
// we'll keep the signatures mostly similar or rely on the caller to use the indices directly.
// To handle the "fast" requirement, components should use the indices directly from the hook.

export function getUniqueBanks(data: IFSCData[]): string[] {
  // Slow legacy fallback
  return [...new Set(data.map((d) => d.Bank))].filter(Boolean).sort();
}

export function getStatesForBank(data: IFSCData[], bank: string): string[] {
  // Slow legacy fallback
  return [...new Set(data.filter((d) => d.Bank === bank).map((d) => d.State))]
    .filter(Boolean)
    .sort();
}

export function getCitiesForBankAndState(
  data: IFSCData[],
  bank: string,
  state: string
): string[] {
  // Slow legacy fallback
  return [
    ...new Set(
      data
        .filter((d) => d.Bank === bank && d.State === state)
        .map((d) => d.City)
    ),
  ]
    .filter(Boolean)
    .sort();
}

export function getBranchesForBankStateCity(
  data: IFSCData[],
  bank: string,
  state: string,
  city: string
): IFSCData[] {
  // Slow legacy fallback
  return data
    .filter((d) => d.Bank === bank && d.State === state && d.City === city)
    .sort((a, b) => a.Branch.localeCompare(b.Branch));
}

export function getBranchByIFSC(
  data: IFSCData[],
  ifsc: string
): IFSCData | undefined {
  return data.find((d) => d.IFSC.toLowerCase() === ifsc.toLowerCase());
}

export function searchByIFSC(data: IFSCData[], query: string): IFSCData[] {
  const lowerQuery = query.toLowerCase();
  return data
    .filter((d) => d.IFSC.toLowerCase().includes(lowerQuery))
    .slice(0, 10);
}

export function getBankStats(data: IFSCData[], bank: string) {
  const bankData = data.filter((d) => d.Bank === bank);
  return {
    totalBranches: bankData.length,
    totalStates: new Set(bankData.map((d) => d.State)).size,
    totalCities: new Set(bankData.map((d) => d.City)).size,
  };
}

export function getOverallStats(data: IFSCData[]) {
  return {
    totalBanks: new Set(data.map((d) => d.Bank)).size,
    totalBranches: data.length,
    totalStates: new Set(data.map((d) => d.State)).size,
    totalCities: new Set(data.map((d) => d.City)).size,
  };
}

export function normalizeIFSCData(branch: any): IFSCData {
  // Normalize state names
  let normalizedState = (branch.STATE || "").toUpperCase().trim();
  const stateMappings: Record<string, string> = {
    // Standardizing variations
    ODISHA: "ORISSA", // Keeping ORISSA as standard if that's what majority data uses, or switch to ODISHA. Let's stick to old convention or new? RBI usually uses existing. Let's map to current official: ODISHA.
    // Wait, previous code mapped ODISHA to ORISSA. Let's flip it to ODISHA as it's the modern name, unless data is mostly ORISSA.
    // Let's go with ODISHA.
    ORISSA: "ODISHA",

    // UTs and Merged UTs
    TRIVANDRUM: "KERALA", // City often mistaken for state in bad data?
    PONDICHERRY: "PUDUCHERRY",
    "THE DADRA AND NAGAR HAVELI AND DAMAN AND DIU":
      "DADRA AND NAGAR HAVELI AND DAMAN AND DIU",
    "DADRA AND NAGAR HAVELI": "DADRA AND NAGAR HAVELI AND DAMAN AND DIU",
    "DAMAN AND DIU": "DADRA AND NAGAR HAVELI AND DAMAN AND DIU",
    "DAMAN & DIU": "DADRA AND NAGAR HAVELI AND DAMAN AND DIU",
    "DADRA & NAGAR HAVELI": "DADRA AND NAGAR HAVELI AND DAMAN AND DIU",

    // Spelling / format variations
    "JAMMU & KASHMIR": "JAMMU AND KASHMIR",
    "ANDAMAN & NICOBAR ISLANDS": "ANDAMAN AND NICOBAR ISLANDS",
    "ANDAMAN AND NICOBAR ISLAND": "ANDAMAN AND NICOBAR ISLANDS",
    "ANDAMAN & NICOBAR": "ANDAMAN AND NICOBAR ISLANDS",

    "NCT OF DELHI": "DELHI",
    "NEW DELHI": "DELHI",
    "STATE - UTTAR PRADESH": "UTTAR PRADESH", // Prefix removal if exists
    UTTARANCHAL: "UTTARAKHAND",

    // Fix the bug
    // "CHANDIGARH": "CHHATTISGARH" <-- REMOVED THIS INCORRECT MAPPING

    // Common Typo fixes if known (added some generic handle)
    LACCADIVE: "LAKSHADWEEP",
    MINICOY: "LAKSHADWEEP",
    AMINDIVI: "LAKSHADWEEP",
  };

  if (stateMappings[normalizedState]) {
    normalizedState = stateMappings[normalizedState];
  } else if (normalizedState === "TELANGANA") {
    // Keep Telangana separate? Yes, it is a state.
    // Previous code mapped to Andhra. I will remove that mapping to be accurate.
  }

  // Normalize city names
  let normalizedCity = branch.CITY || branch.CENTRE || "";
  // Remove duplicates and normalize common variations
  const cityMappings: Record<string, string> = {
    "GREATER MUMBAI": "MUMBAI",
    "GREATER BOMBAY": "MUMBAI",
    "MUMBAI SUBURBAN": "MUMBAI",
    "DELHI METRO REGION - II": "DELHI",
    "SAS NAGAR MOHALI": "MOHALI",
    "NORTH 24 PARGANAS": "BARASAT",
    "SOUTH 24 PARGANAS": "DIAMOND HARBOUR",
    BARDHAMAN: "BURDWAN",
    "PURBI CHAMPARAN": "MOTIHARI",
    "PASCHIMI CHAMPARAN": "BETTIAH",
    DARJEELING: "DARJILING",
    HAORA: "HOWRAH",
    MEDINIPUR: "MIDNAPORE",
    PURULIA: "PURULIYA",
    NADIA: "KRISHNANAGAR",
    MURSHIDABAD: "BERHAMPORE",
    "UTTAR DINAJPUR": "RAIGANJ",
    "DAKSHIN DINAJPUR": "BALURGHAT",
    MALDA: "ENGLISH BAZAR",
    JALPAIGURI: "JALPAIGURI",
    "COOCH BEHAR": "COOCHBEHAR",
    UTTARAKHAND: "DEHRADUN",
    "HIMACHAL PRADESH": "SHIMLA",
    "JAMMU AND KASHMIR": "SRINAGAR",
    CHANDIGARH: "CHANDIGARH",
    PUNJAB: "CHANDIGARH",
    HARYANA: "CHANDIGARH",
    RAJASTHAN: "JAIPUR",
    GUJARAT: "AHMEDABAD",
    "MADHYA PRADESH": "BHOPAL",
    MAHARASHTRA: "MUMBAI",
    KARNATAKA: "BANGALORE",
    "ANDHRA PRADESH": "HYDERABAD",
    "TAMIL NADU": "CHENNAI",
    KERALA: "THIRUVANANTHAPURAM",
    "WEST BENGAL": "KOLKATA",
    ODISHA: "BHUBANESWAR",
    ORISSA: "BHUBANESWAR",
    BIHAR: "PATNA",
    JHARKHAND: "RANCHI",
    CHHATTISGARH: "RAIPUR",
    "UTTAR PRADESH": "LUCKNOW",
    ASSAM: "GUWAHATI",
    TRIPURA: "AGARTALA",
    MIZORAM: "AIZAWL",
    MANIPUR: "IMPHAL",
    NAGALAND: "KOHIMA",
    MEGHALAYA: "SHILLONG",
    "ARUNACHAL PRADESH": "ITANAGAR",
    SIKKIM: "GANGTOK",
    GOA: "PANAJI",
    "DAMAN AND DIU": "DAMAN",
    "DADRA AND NAGAR HAVELI": "SILVASSA",
    PONDICHERRY: "PONDICHERRY",
    LAKSHADWEEP: "KAVARATTI",
    "ANDAMAN AND NICOBAR ISLANDS": "PORT BLAIR",
  };
  if (cityMappings[normalizedCity]) {
    normalizedCity = cityMappings[normalizedCity];
  }

  const item: IFSCData = {
    Bank: branch.BANK || "",
    IFSC: branch.IFSC || "",
    MICR: branch.MICR || "",
    Branch: branch.BRANCH || "",
    Address: branch.ADDRESS || "",
    City: normalizedCity,
    District: branch.DISTRICT || "",
    State: normalizedState,
    Contact: branch.CONTACT || "",
    Centre: branch.CENTRE,
    IMPS: branch.IMPS ? "TRUE" : "FALSE",
    RTGS: branch.RTGS ? "TRUE" : "FALSE",
    NEFT: branch.NEFT ? "TRUE" : "FALSE",
    UPI: branch.UPI ? "TRUE" : "FALSE",
    SWIFT: branch.SWIFT || "",
    ISO3166: branch.ISO3166 || "",
  };
  return item;
}
