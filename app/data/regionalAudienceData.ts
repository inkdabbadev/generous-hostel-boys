export type AudienceHotspot = {
  city: string;
  reach: "Major" | "Secondary" | "Emerging";
};

export type AudienceMarket = {
  id: string;
  title: string;
  shortTitle: string;
  accent: string;
  accentSoft: string;
  icon: string;
  image: string;
  primaryCity: string;
  majorHotspots: string[];
  audienceProfile: string;
  marketInsight: string;
  ageDistribution: {
    label: string;
    value: number;
    color: string;
  }[];
  hotspots: AudienceHotspot[];
};

export const audienceMarkets: AudienceMarket[] = [
  {
    id: "karnataka",
    title: "Karnataka Audience Map",
    shortTitle: "Karnataka",
    accent: "#2d7cff",
    accentSoft: "rgba(45, 124, 255, 0.16)",
    icon: "KA",
    image: "karnataka.svg",
    primaryCity: "Bengaluru",
    majorHotspots: ["Bengaluru", "Mysuru", "Mangaluru", "Hubballi-Dharwad"],
    audienceProfile:
      "Urban youth-heavy audience with strong weekend conversion from Bengaluru and Mysuru.",
    marketInsight:
      "Tech-campus clusters and tier-2 multiplex belts respond strongly to meme-led youth campaigns.",
    ageDistribution: [
      { label: "13-17", value: 8, color: "#9ec5ff" },
      { label: "18-24", value: 28, color: "#5fa0ff" },
      { label: "25-34", value: 34, color: "#1f62dd" },
      { label: "35-44", value: 18, color: "#83b4ff" },
      { label: "45+", value: 12, color: "#d6e7ff" },
    ],
    hotspots: [
      { city: "Bengaluru", reach: "Major" },
      { city: "Mysuru", reach: "Secondary" },
      { city: "Mangaluru", reach: "Secondary" },
      { city: "Hubballi", reach: "Emerging" },
      { city: "Belagavi", reach: "Emerging" },
    ],
  },
  {
    id: "telugu",
    title: "Telugu Audience Map",
    shortTitle: "Telugu Market",
    accent: "#34b653",
    accentSoft: "rgba(52, 182, 83, 0.16)",
    icon: "TG",
    image: "telugu.svg",
    primaryCity: "Hyderabad",
    majorHotspots: ["Hyderabad", "Vijayawada", "Visakhapatnam", "Warangal", "Tirupati"],
    audienceProfile:
      "Strong metro and tier-2 audience across Telugu-speaking markets with high theatrical energy.",
    marketInsight:
      "The region rewards loud positioning, star-adjacent hooks, and youth comedy with repeat group viewing.",
    ageDistribution: [
      { label: "13-17", value: 10, color: "#bee7a8" },
      { label: "18-24", value: 30, color: "#84d366" },
      { label: "25-34", value: 32, color: "#238f3d" },
      { label: "35-44", value: 16, color: "#61bd5e" },
      { label: "45+", value: 12, color: "#e0f4d7" },
    ],
    hotspots: [
      { city: "Hyderabad", reach: "Major" },
      { city: "Vijayawada", reach: "Secondary" },
      { city: "Vizag", reach: "Secondary" },
      { city: "Warangal", reach: "Emerging" },
      { city: "Tirupati", reach: "Emerging" },
      { city: "Guntur", reach: "Emerging" },
    ],
  },
  {
    id: "tamil",
    title: "Tamil Nadu Audience Map",
    shortTitle: "Tamil Nadu",
    accent: "#9b4ee6",
    accentSoft: "rgba(155, 78, 230, 0.16)",
    icon: "TN",
    image: "tamil.svg",
    primaryCity: "Chennai",
    majorHotspots: ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"],
    audienceProfile:
      "Wide statewide reach with strong concentration in Chennai and the western belt.",
    marketInsight:
      "College towns, creator-led chatter, and Tamil comedy timing can convert quickly into opening buzz.",
    ageDistribution: [
      { label: "13-17", value: 9, color: "#dcc3ff" },
      { label: "18-24", value: 29, color: "#b985ff" },
      { label: "25-34", value: 33, color: "#6d27a9" },
      { label: "35-44", value: 17, color: "#9954d6" },
      { label: "45+", value: 12, color: "#efe3ff" },
    ],
    hotspots: [
      { city: "Chennai", reach: "Major" },
      { city: "Coimbatore", reach: "Secondary" },
      { city: "Madurai", reach: "Secondary" },
      { city: "Trichy", reach: "Emerging" },
      { city: "Salem", reach: "Emerging" },
      { city: "Tirunelveli", reach: "Emerging" },
    ],
  },
  {
    id: "kerala",
    title: "Kerala Audience Map",
    shortTitle: "Kerala",
    accent: "#00b7a8",
    accentSoft: "rgba(0, 183, 168, 0.16)",
    icon: "KL",
    image: "kerala.svg",
    primaryCity: "Kochi",
    majorHotspots: ["Kochi", "Thiruvananthapuram", "Kozhikode", "Thrissur"],
    audienceProfile:
      "Dense, review-sensitive market with digitally aware youth audiences and strong family pockets.",
    marketInsight:
      "Smart comedy, campus recall, and strong word-of-mouth can scale fast across compact city clusters.",
    ageDistribution: [
      { label: "13-17", value: 11, color: "#b2fff5" },
      { label: "18-24", value: 31, color: "#5df0df" },
      { label: "25-34", value: 30, color: "#008b82" },
      { label: "35-44", value: 16, color: "#31c6bb" },
      { label: "45+", value: 12, color: "#e1fffb" },
    ],
    hotspots: [
      { city: "Kochi", reach: "Major" },
      { city: "TVM", reach: "Secondary" },
      { city: "Kozhikode", reach: "Secondary" },
      { city: "Thrissur", reach: "Emerging" },
      { city: "Kollam", reach: "Emerging" },
    ],
  },
];
