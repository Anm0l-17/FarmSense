export type Severity = "Low" | "Moderate" | "High";
export type RiskLevel = "Low" | "Moderate" | "High";
export type Decision = "SELL" | "HOLD" | "SELL_PARTIALLY";
export type LanguageCode = "en" | "kn" | "hi";

export interface User {
  user_id: string;
  name: string;
  location: string;
  preferred_language: LanguageCode;
}

export interface Diagnosis {
  diagnosis_id: string;
  user_id: string;
  crop: string;
  disease: string;
  confidence: number;
  severity: Severity;
  image_url: string;
  yield_loss: number;
  description: string;
  symptoms: string[];
  actions: string[];
  revenue_impact: [number, number];
  created_at: string;
}

export interface Weather {
  location: string;
  temperature: number;
  humidity: number;
  rain_probability: number;
  rainfall: number;
  wind_speed: number;
  risk: RiskLevel;
  risk_reason: string;
  risk_factors: string[];
  timestamp: string;
}

export interface PricePoint {
  label: string;
  price: number | null;
  predicted: number | null;
}

export interface MarketData {
  crop: string;
  market: string;
  location: string;
  current_price: number;
  predicted_price: number;
  change_percentage: number;
  trend: "Bullish" | "Bearish" | "Stable";
  series: PricePoint[];
  timestamp: string;
}

export interface Recommendation {
  recommendation_id: string;
  diagnosis_id: string;
  decision: Decision;
  current_price: number;
  predicted_price: number;
  disease_severity: Severity;
  weather_risk: RiskLevel;
  yield_loss: number;
  reason: string;
  sell_percentage?: number;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export interface CommunityAnswer {
  answer_id: string;
  post_id: string;
  author: string;
  answer: string;
  is_ai_generated: boolean;
  created_at: string;
  like_count: number;
}

export interface CommunityPost {
  post_id: string;
  author: string;
  crop: string;
  category: "Disease" | "Weather" | "Market" | "Crops";
  question: string;
  image_url?: string;
  created_at: string;
  answer_count: number;
  like_count: number;
  answers: CommunityAnswer[];
}

export interface AppNotification {
  id: string;
  icon: string;
  title: string;
  body: string;
  time: string;
}

export interface FarmContextPayload {
  crop?: string;
  disease?: string;
  severity?: Severity;
  confidence?: number;
  yield_loss?: number;
  weather?: Weather;
  weather_risk?: RiskLevel;
  current_price?: number;
  predicted_price?: number;
  recommendation?: Decision;
}
