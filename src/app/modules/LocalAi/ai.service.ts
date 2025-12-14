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
  // আরও places add করতে পারো
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

// Templates generator
function getTemplatesForCity(cityInfo: CityInfo | null, interests: string[]) {
  const baseTemplates = [
    { morning:"হোটেলে চেক-ইন; নিকটস্থ এলাকা ঘুরে স্থানীয় নাস্তা গ্রহণ", afternoon:"শহরের প্রধান আকর্ষণ পরিদর্শন", evening:"লোকাল রেস্টুরেন্টে ডিনার ও বাজার ঘোরাঘুরি" },
    { morning:"প্রতিষ্ঠিত কোনো দর্শনীয় স্থান বা মিউজিয়াম দেখুন", afternoon:"লোকাল মার্কেট/স্ট্রিট ফুড অন্বেষণ", evening:"সানসেট স্পট বা রিভারসাইডে সময় কাটান" },
    { morning:"অলিতে-ঘুরে নেবেন: প্রাকৃতিক দৃশ্য/পাহার/সমুদ্র সৈকত", afternoon:"ফটোগ্রাফি ও কফি শপ হপিং", evening:"স্থানীয় সাংস্কৃতিক অনুষ্ঠান বা হ্যান্ডিক্রাফট মার্কেট" },
    { morning:"ডে-ট্রিপ: কাছাকাছি কোনো আকর্ষণীয় স্থানে ভ্রমণ", afternoon:"লোকাল খাবার ও ঐতিহাসিক স্থান", evening:"হোটেলে বিশ্রাম ও পরিকল্পনা পর্যালোচনা" },
    { morning:"শেষ মুহূর্ত শপিং বা দর্শন", afternoon:"চেক-আউট এবং ট্রান্সফার প্রস্তুতি", evening:"যাত্রা শুরু" }
  ];

  if (!cityInfo) return baseTemplates;

  const highlights = cityInfo.highlights || [];
  const food = cityInfo.foodSpots || [];
  const cityTemplates = [];

  cityTemplates.push({
    morning:`আগমন ও হোটেলে চেক-ইন; তারপর ${highlights[0] || "প্রধান স্পট"} ঘোরা`,
    afternoon:`স্থানীয় খাবার চেখে দেখা (${food[0]||"লোকাল খাবার"}) ও নিকটস্থ মার্কেট ঘোরা`,
    evening:`সানসেট/রiverside বা বিখ্যাত evening spot এ সময় কাটান`
  });

  if (highlights.length >= 2) {
    cityTemplates.push({
      morning:`বিখ্যাত ঐতিহাসিক/সাংস্কৃতিক স্থান পরিদর্শন (${highlights[1]})`,
      afternoon:`লোকাল হস্তশিল্প/বাজার ঘোরা ও কফি-ব্রেক`,
      evening:`শহরের জনপ্রিয় ডিনার স্পট বা ফুড স্টল ট্যুর`
    });
  }

  for (let i=cityTemplates.length; i<5; i++) {
    cityTemplates.push(baseTemplates[i%baseTemplates.length]);
  }

  return cityTemplates;
}

function estimateCostLabel(style: string) {
  if (!style) return "মধ্যম";
  const s = style.toLowerCase();
  if (s.includes("budget") || s.includes("low")) return "কম";
  if (s.includes("luxury") || s.includes("high")) return "উচ্চ";
  return "মধ্যম";
}
