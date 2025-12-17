interface CityInfo {
  display: string;
  highlights: string[];
  foodSpots?: string[];
  altKeys?: string[];
}

interface ItineraryPayload {
  destination?: string;
  days?: number;
  interests?: string | string[];
  travelStyle?: string;
  startDate?: string | null;
}

// Example CITY_DB (Bangladesh main places)
const CITY_DB: Record<string, CityInfo> = {
  "dhaka": { display: "Dhaka", highlights: ["Ahsan Manzil","Lalbagh Fort","Dhakeshwari Temple","Star Mosque","Sadarghat Launch Terminal","Bangabandhu Museum"], foodSpots: ["Old Dhaka biryani","Haji Biryani","Fuchka"], altKeys:["dhaka","daka"] },
  "cox's bazar": { display:"Cox's Bazar", highlights:["Inani Beach","Himchari National Park","New Market","Laboni Point"], foodSpots:["Seafood stalls at Laboni"], altKeys:["cox s bazar","cox,s bazar","coxsbazar","coxs bazar"] },
  "sylhet": { display:"Sylhet", highlights:["Ratargul Swamp Forest","Jaflong","Tea Gardens","Shrine of Hazrat Shah Jalal"], foodSpots:["Local tea houses","Sylheti dishes"], altKeys:["sylhet"] }
  // more places can be added
};

function normalizeKey(s: string) {
  if (!s) return "";
  return s.toLowerCase().trim().replace(/[,.'’`]/g, "").replace(/\s+/g," ");
}

export async function generateItinerary(payload: ItineraryPayload = {}) {
  const destinationRaw = payload.destination || "Unknown Destination";
  const destinationKey = normalizeKey(destinationRaw);
  const days = Number(payload.days) || 5;
  const interests = Array.isArray(payload.interests) ? payload.interests : (payload.interests ? [payload.interests] : []);
  const travelStyle = payload.travelStyle || "moderate";

  // Find city
  let cityInfo: CityInfo | null = null;
  for (const key of Object.keys(CITY_DB)) {
    if (key === destinationKey || (CITY_DB[key].altKeys && CITY_DB[key].altKeys.includes(destinationKey))) {
      cityInfo = CITY_DB[key];
      break;
    }
  }

  if (!cityInfo) {
    for (const key of Object.keys(CITY_DB)) {
      if (destinationKey.includes(key)) {
        cityInfo = CITY_DB[key];
        break;
      }
    }
  }

  // Build day templates
  const templates = getTemplatesForCity(cityInfo, interests);

  const itinerary: Record<string, any> = {};
  for (let i = 0; i < days; i++) {
    const t = templates[i % templates.length];
    itinerary[`day${i+1}`] = {
      morning: t.morning,
      afternoon: t.afternoon,
      evening: t.evening,
      estimatedCost: estimateCostLabel(travelStyle)
    };
  }

  return {
    success: true,
    data: {
      destination: cityInfo ? cityInfo.display : destinationRaw,
      days,
      itinerary
    }
  };
}

// Templates generator in English
function getTemplatesForCity(cityInfo: CityInfo | null, interests: string[]) {
  const baseTemplates = [
    { morning:"Check-in at hotel; explore nearby area and grab local snacks", afternoon:"Visit main city attractions", evening:"Dinner at local restaurant and explore the market" },
    { morning:"Visit a famous museum or landmark", afternoon:"Explore local markets and street food", evening:"Relax at sunset spot or riverside" },
    { morning:"Stroll alleys for scenic views, hills or beaches", afternoon:"Photography and coffee shop hopping", evening:"Attend local cultural events or handicraft market" },
    { morning:"Day-trip to a nearby attraction", afternoon:"Try local food and explore historic spots", evening:"Relax at hotel and review plans" },
    { morning:"Last-minute shopping or sightseeing", afternoon:"Check-out and prepare for transfer", evening:"Journey begins" }
  ];

  if (!cityInfo) return baseTemplates;

  const highlights = cityInfo.highlights || [];
  const food = cityInfo.foodSpots || [];
  const cityTemplates = [];

  cityTemplates.push({
    morning:`Arrival & hotel check-in; then visit ${highlights[0] || "main attraction"}`,
    afternoon:`Taste local food (${food[0] || "local cuisine"}) and explore nearby market`,
    evening:`Spend time at sunset/riverside or popular evening spot`
  });

  if (highlights.length >= 2) {
    cityTemplates.push({
      morning:`Visit famous historical/cultural site (${highlights[1]})`,
      afternoon:`Explore local crafts/market and enjoy a coffee break`,
      evening:`Dinner at popular city spots or food stalls`
    });
  }

  for (let i=cityTemplates.length; i<5; i++) {
    cityTemplates.push(baseTemplates[i % baseTemplates.length]);
  }

  return cityTemplates;
}

function estimateCostLabel(style: string) {
  if (!style) return "Moderate";
  const s = style.toLowerCase();
  if (s.includes("budget") || s.includes("low")) return "Low";
  if (s.includes("luxury") || s.includes("high")) return "High";
  return "Moderate";
}
