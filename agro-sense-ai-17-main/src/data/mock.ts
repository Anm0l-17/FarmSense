import type {
  AppNotification,
  CommunityPost,
  Diagnosis,
  MarketData,
  PricePoint,
  User,
  Weather,
} from "@/types";

export const CROPS = ["Tomato", "Potato", "Onion", "Paddy", "Maize", "Cotton"];

export const CROP_EMOJI: Record<string, string> = {
  Tomato: "🍅",
  Potato: "🥔",
  Onion: "🧅",
  Paddy: "🌾",
  Maize: "🌽",
  Cotton: "☁️",
  Wheat: "🌾",
  Rice: "🌾",
  Corn: "🌽",
};

export const LOCATIONS = [
  "Bangalore",
  "Mysore",
  "Kolar",
  "Mandya",
  "Belgaum",
  "Dharwad",
  "Hubli",
];

export const mockUser: User = {
  user_id: "u_demo",
  name: "Raju Patil",
  location: "Bangalore",
  preferred_language: "en",
};

export const mockDiagnosis: Diagnosis = {
  diagnosis_id: "d_1001",
  user_id: "u_1",
  crop: "Tomato",
  disease: "Healthy & Flourishing",
  confidence: 96,
  severity: "Low",
  image_url: "",
  yield_loss: 0,
  description:
    "Great news! Your tomato crop is healthy with clean green foliage and robust growth.",
  symptoms: [
    "Clean green leaves",
    "Sturdy main stem",
    "Normal leaf expansion",
  ],
  actions: [
    "Maintain regular drip irrigation.",
    "Apply balanced N-P-K nutrient doses.",
    "Inspect lower leaves weekly.",
  ],
  revenue_impact: [0, 0],
  created_at: new Date().toISOString(),
};

export const mockHistory: Diagnosis[] = [
  mockDiagnosis,
  {
    ...mockDiagnosis,
    diagnosis_id: "d_1000",
    crop: "Potato",
    disease: "Late Blight",
    confidence: 93,
    severity: "High",
    yield_loss: 28,
    description:
      "Late Blight is a fast-spreading fungal disease that may damage potato foliage and tubers.",
    symptoms: ["Dark water-soaked patches", "White mould on leaf underside"],
    revenue_impact: [11000, 16000],
    created_at: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
  },
  {
    ...mockDiagnosis,
    diagnosis_id: "d_0999",
    crop: "Onion",
    disease: "Healthy & Flourishing",
    confidence: 96,
    severity: "Low",
    yield_loss: 0,
    description:
      "Clean upright green onion leaves with healthy neck development.",
    symptoms: ["Upright green leaves", "No purple blotches"],
    revenue_impact: [0, 0],
    created_at: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
  },
];

export const mockWeather: Weather = {
  location: "Bangalore",
  temperature: 28,
  humidity: 82,
  rain_probability: 70,
  rainfall: 6,
  wind_speed: 12,
  risk: "Moderate",
  risk_reason:
    "High humidity and expected rainfall may increase the risk of fungal disease spread.",
  risk_factors: ["High humidity", "Rainfall", "Leaf wetness"],
  timestamp: new Date().toISOString(),
};

const baseSeries: PricePoint[] = [
  { label: "Day 1", price: 20, predicted: null },
  { label: "Day 2", price: 21, predicted: null },
  { label: "Day 3", price: 22, predicted: null },
  { label: "Day 4", price: 21, predicted: null },
  { label: "Day 5", price: 23, predicted: null },
  { label: "Day 6", price: 24, predicted: null },
  { label: "Day 7", price: 24, predicted: 24 },
  { label: "Day 8", price: null, predicted: 25 },
  { label: "Day 9", price: null, predicted: 27 },
  { label: "Day 10", price: null, predicted: 28 },
];

const cropPriceFactor: Record<string, number> = {
  Tomato: 1,
  Potato: 0.85,
  Onion: 1.3,
  Paddy: 0.95,
  Maize: 0.75,
  Cotton: 2.6,
};

export function buildMarket(crop: string, location = "Bangalore", range: 7 | 30 | 90 = 7): MarketData {
  const f = cropPriceFactor[crop] ?? 1;
  const points = range === 7 ? baseSeries.length : range === 30 ? 30 : 90;
  const series: PricePoint[] =
    range === 7
      ? baseSeries.map((p) => ({
          label: p.label,
          price: p.price === null ? null : Math.round(p.price * f),
          predicted: p.predicted === null ? null : Math.round(p.predicted * f),
        }))
      : Array.from({ length: points }, (_, i) => {
          const isFuture = i >= points - 3;
          const wave = Math.sin(i / 3) * 2 + i * (4 / points);
          const value = Math.round((20 + wave) * f);
          return {
            label: range === 30 ? `D${i + 1}` : `W${Math.floor(i / 7) + 1}.${(i % 7) + 1}`,
            price: isFuture ? null : value,
            predicted: i >= points - 4 ? value + (i - (points - 4)) : null,
          };
        });

  const current = Math.round(24 * f);
  const predicted = Math.round(28 * f);
  return {
    crop,
    market: "Local Market",
    location,
    current_price: current,
    predicted_price: predicted,
    change_percentage: 8.2,
    trend: "Bullish",
    series,
    timestamp: new Date().toISOString(),
  };
}

export const mockMarket = buildMarket("Tomato");

export const mockNotifications: AppNotification[] = [
  {
    id: "n1",
    icon: "🦠",
    title: "Disease Alert",
    body: "Your latest tomato diagnosis shows moderate disease severity.",
    time: "10 min ago",
  },
  {
    id: "n2",
    icon: "💰",
    title: "Market Alert",
    body: "Tomato prices increased by 8%.",
    time: "1 hour ago",
  },
  {
    id: "n3",
    icon: "🌧️",
    title: "Weather Alert",
    body: "Rainfall is expected tomorrow.",
    time: "3 hours ago",
  },
  {
    id: "n4",
    icon: "🤖",
    title: "Recommendation",
    body: "Your latest AI recommendation is ready.",
    time: "Today",
  },
];

export const mockCommunityPosts: CommunityPost[] = [
  {
    post_id: "p1",
    author: "Ramesh",
    crop: "Tomato",
    category: "Disease",
    question: "Why are my tomato leaves developing black spots?",
    created_at: new Date(Date.now() - 2 * 36e5).toISOString(),
    answer_count: 6,
    like_count: 14,
    answers: [
      {
        answer_id: "a1",
        post_id: "p1",
        author: "AI Farm Assistant",
        answer:
          "Based on available information, black or brown spots on tomato leaves may indicate Early Blight, a common fungal disease. Consider removing heavily infected leaves, avoiding overhead watering and improving airflow.",
        is_ai_generated: true,
        created_at: new Date(Date.now() - 1.8 * 36e5).toISOString(),
        like_count: 9,
      },
      {
        answer_id: "a2",
        post_id: "p1",
        author: "Lakshmi",
        answer:
          "I had the same issue last season. Removing the lower leaves and spacing the plants helped a lot.",
        is_ai_generated: false,
        created_at: new Date(Date.now() - 1.2 * 36e5).toISOString(),
        like_count: 5,
      },
    ],
  },
  {
    post_id: "p2",
    author: "Suresh",
    crop: "Onion",
    category: "Market",
    question: "Onion prices dropped this week. Should I hold my stock?",
    created_at: new Date(Date.now() - 7 * 36e5).toISOString(),
    answer_count: 3,
    like_count: 8,
    answers: [
      {
        answer_id: "a3",
        post_id: "p2",
        author: "AI Farm Assistant",
        answer:
          "Based on available market information, short-term price recovery is possible. If your storage conditions are good, holding part of the stock may be worth considering.",
        is_ai_generated: true,
        created_at: new Date(Date.now() - 6.5 * 36e5).toISOString(),
        like_count: 4,
      },
    ],
  },
  {
    post_id: "p3",
    author: "Anitha",
    crop: "Paddy",
    category: "Weather",
    question: "Heavy rain expected next week. How do I protect my paddy field?",
    created_at: new Date(Date.now() - 26 * 36e5).toISOString(),
    answer_count: 4,
    like_count: 21,
    answers: [
      {
        answer_id: "a4",
        post_id: "p3",
        author: "Mahesh",
        answer: "Clear your drainage channels early. Waterlogging causes the most damage.",
        is_ai_generated: false,
        created_at: new Date(Date.now() - 24 * 36e5).toISOString(),
        like_count: 11,
      },
    ],
  },
  {
    post_id: "p4",
    author: "Kiran",
    crop: "Maize",
    category: "Crops",
    question: "Which maize variety works best for light soil in this region?",
    created_at: new Date(Date.now() - 50 * 36e5).toISOString(),
    answer_count: 2,
    like_count: 6,
    answers: [],
  },
];
