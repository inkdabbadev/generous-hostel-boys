// ============================================================================
// CAMPAIGN DATA — the single source of truth for the microsite.
// Edit any number, label, or copy here and the whole site updates.
// ============================================================================

export const campaignData = {
  statewide: {
    screens: 196,
    districts: 35,
    playsPerDay: 150,
    duration: "15 Days",
    reach: 7000000,
    impressions: 31500000,
    avgFrequency: 4.5,
    title: "196 Bus Stand LED Screens",
    subtitle: "Across 35 Districts",
    copy: "From daily commuters to waiting passengers, the campaign remains visible across Tamil Nadu.",
    majorCities: ["chennai", "coimbatore", "madurai", "trichy", "salem", "tirunelveli"],
  },
  chennai: {
    premiumHoardings: 8,
    cityHoardings: 22,
    busShelters: 40,
    trafficSignalLEDs: 35,
    metroTrains: 1,
    reach: 9900000,
    impressions: 42800000,
    avgFrequency: 4.3,
    title: "Chennai Takeover",
    subtitle: "Every stage of the daily commute",
    copy: "Chennai sees the campaign at every stage of the commute—from arterial roads and junctions to shelters and metro travel.",
  },
  restOfTamilNadu: {
    premiumHoardings: 26,
    hoardings: 40,
    busShelters: 80,
    reach: 10800000,
    impressions: 41500000,
    avgFrequency: 3.8,
    title: "146 Roadside & Transit Assets",
    subtitle: "Tamil Nadu's largest urban centres & corridors",
    copy: "High-frequency visibility across Tamil Nadu's largest urban centres and commuter corridors.",
    cities: ["Coimbatore", "Madurai", "Trichy", "Salem", "Tiruppur", "Erode"],
  },
  airports: {
    screens: 150,
    duration: "10 Days",
    reach: 1500000,
    impressions: 4700000,
    avgFrequency: 3.1,
    title: "150 Airport Screens",
    subtitle: "Across 3 Major Airports",
    copy: "The campaign reaches high-intent travellers across Tamil Nadu's key aviation gateways.",
    hoverCopy: "Departing, arriving and waiting passengers",
    cities: ["Chennai", "Coimbatore", "Trichy"],
  },
  totals: {
    touchpoints: 597,
    districts: 35,
    airports: 3,
    metroTrains: 1,
    // Blended across all four categories (sums are indicative, not
    // de-duplicated for cross-format audience overlap).
    reach: 29200000,
    impressions: 120500000,
    avgFrequency: 4.1,
  },
};

// ============================================================================
// MAP GEOGRAPHY — approximate, presentation-style placements on a
// 400 x 520 viewBox. Not surveyed / not geographically exact.
// ============================================================================

export const cities = {
  chennai:     { x: 322, y: 96,  label: "Chennai",     audience: "Metro riders, commuters & business traffic" },
  vellore:     { x: 250, y: 70,  label: "Vellore",     audience: "Highway commuters" },
  coimbatore:  { x: 92,  y: 224, label: "Coimbatore",  audience: "Industrial & commuter corridor" },
  tiruppur:    { x: 118, y: 246, label: "Tiruppur",    audience: "Textile-belt daily workforce" },
  erode:       { x: 138, y: 214, label: "Erode",       audience: "Highway & market-town traffic" },
  salem:       { x: 178, y: 188, label: "Salem",       audience: "Cross-state highway commuters" },
  trichy:      { x: 224, y: 268, label: "Trichy",      audience: "Central Tamil Nadu transit hub" },
  thanjavur:   { x: 268, y: 288, label: "Thanjavur",   audience: "Delta-region commuters" },
  madurai:     { x: 200, y: 344, label: "Madurai",     audience: "Southern Tamil Nadu's commercial hub" },
  tirunelveli: { x: 188, y: 420, label: "Tirunelveli",  audience: "Southern-belt daily commuters" },
};

// Small representative "statewide digital" dots — deliberately not tied to
// literal per-district counts. Purely illustrative of statewide spread.
export const statewideDots = [
  { x: 300, y: 130 }, { x: 270, y: 150 }, { x: 240, y: 110 }, { x: 210, y: 150 },
  { x: 160, y: 130 }, { x: 130, y: 170 }, { x: 105, y: 260 }, { x: 140, y: 290 },
  { x: 170, y: 250 }, { x: 200, y: 220 }, { x: 245, y: 210 }, { x: 260, y: 240 },
  { x: 290, y: 200 }, { x: 250, y: 320 }, { x: 220, y: 360 }, { x: 180, y: 380 },
  { x: 150, y: 350 }, { x: 205, y: 400 }, { x: 175, y: 440 }, { x: 195, y: 460 },
  { x: 240, y: 340 }, { x: 130, y: 320 }, { x: 110, y: 200 }, { x: 280, y: 170 },
];

export const airportCoords = {
  chennai: cities.chennai,
  coimbatore: cities.coimbatore,
  trichy: cities.trichy,
};
