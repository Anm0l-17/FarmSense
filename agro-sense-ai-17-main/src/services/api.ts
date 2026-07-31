/**
 * Single source of truth for ALL external data calls connecting React frontend to FastAPI backend.
 */
import {
  buildMarket,
  mockCommunityPosts,
  mockDiagnosis,
  mockHistory,
  mockNotifications,
  mockUser,
  mockWeather,
} from "@/data/mock";
import type {
  ChatMessage,
  CommunityAnswer,
  CommunityPost,
  Decision,
  Diagnosis,
  FarmContextPayload,
  LanguageCode,
  MarketData,
  Recommendation,
  RiskLevel,
  Severity,
  User,
  Weather,
} from "@/types";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";
export const DEMO_MODE = false;

const TOKEN_KEY = "agrisense_jwt_token";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
const uid = (p: string) => `${p}_${Math.random().toString(36).slice(2, 9)}`;

// Helper to get or acquire auth token
async function getAuthToken(): Promise<string> {
  let token = localStorage.getItem(TOKEN_KEY);
  if (token) return token;

  try {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Raju Patil",
        phone: `99${Math.floor(10000000 + Math.random() * 90000000)}`,
        password: "agrisense_demo_pass",
        location: "Bangalore",
        preferred_language: "en",
      }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.token) {
        localStorage.setItem(TOKEN_KEY, data.token);
        return data.token;
      }
    }
  } catch (e) {
    console.warn("Auto-registration failed, falling back to mock auth.", e);
  }
  return "";
}

async function authHeaders(): Promise<HeadersInit> {
  const token = await getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ---------------------------------------------------------------- auth & profile
export async function loginUser(phone: string, password: str): Promise<User> {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Login failed" }));
    throw new Error(err.detail || "Invalid credentials");
  }
  const data = await res.json();
  localStorage.setItem(TOKEN_KEY, data.token);
  return {
    user_id: data.user_id,
    name: data.name,
    location: data.location ?? "Bangalore",
    preferred_language: data.preferred_language ?? "en",
  };
}

export async function registerUser(payload: {
  name: string;
  phone: string;
  password: string;
  location?: string;
  preferred_language?: LanguageCode;
}): Promise<User> {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Registration failed" }));
    throw new Error(err.detail || "Registration failed");
  }
  const data = await res.json();
  localStorage.setItem(TOKEN_KEY, data.token);
  return {
    user_id: data.user_id,
    name: data.name,
    location: data.location ?? "Bangalore",
    preferred_language: data.preferred_language ?? "en",
  };
}

export async function getUserProfile(): Promise<User> {
  try {
    const headers = await authHeaders();
    const res = await fetch(`${API_BASE_URL}/auth/me`, { headers });
    if (res.ok) {
      const data = await res.json();
      return {
        user_id: data.user_id,
        name: data.name,
        location: data.location,
        preferred_language: data.preferred_language,
      };
    }
  } catch (e) {
    console.warn("Fetch profile failed.", e);
  }
  return mockUser;
}

export async function updateUserProfile(payload: {
  name?: string;
  phone?: string;
  location?: string;
  preferred_language?: LanguageCode;
  password?: string;
}): Promise<User> {
  try {
    const headers = await authHeaders();
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      method: "PUT",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const data = await res.json();
      return {
        user_id: data.user_id,
        name: data.name,
        location: data.location,
        preferred_language: data.preferred_language,
      };
    }
  } catch (e) {
    console.warn("Update profile failed.", e);
  }
  return {
    user_id: "u_demo",
    name: payload.name ?? "Raju Patil",
    location: payload.location ?? "Bangalore",
    preferred_language: payload.preferred_language ?? "en",
  };
}

// ---------------------------------------------------------------- health
export async function getHealth(): Promise<{ status: string; demo: boolean }> {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    if (res.ok) {
      const data = await res.json();
      return { status: data.status, demo: false };
    }
  } catch (e) {
    console.warn("Backend offline, using fallback mode.");
  }
  return { status: "ok", demo: true };
}

// ------------------------------------------------------------- diagnosis
export async function diagnoseCrop(file?: File | null, cropHint = "Tomato"): Promise<Diagnosis> {
  if (file) {
    try {
      const headers = await authHeaders();
      const formData = new FormData();
      formData.append("image", file);
      formData.append("crop_hint", cropHint);

      const res = await fetch(`${API_BASE_URL}/crop/diagnose`, {
        method: "POST",
        headers,
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        return {
          diagnosis_id: data.diagnosis_id,
          user_id: data.user_id ?? "u_demo",
          crop: data.crop,
          disease: data.disease,
          confidence: Math.round(data.confidence * 100),
          severity: (data.severity.charAt(0).toUpperCase() + data.severity.slice(1).toLowerCase()) as Severity,
          image_url: data.image_url ? `${API_BASE_URL}${data.image_url}` : URL.createObjectURL(file),
          yield_loss: data.yield_loss ?? 0,
          description: data.description ?? "Clean leaf foliage in healthy condition.",
          symptoms: data.symptoms ?? ["Vibrant green foliage"],
          actions: data.actions ?? ["Maintain scheduled irrigation"],
          revenue_impact: data.revenue_impact ?? [0, 0],
          created_at: data.created_at ?? new Date().toISOString(),
        };
      }
    } catch (e) {
      console.warn("Live diagnosis failed, using fallback mock diagnosis.", e);
    }
  }

  await delay(1500);
  return {
    ...mockDiagnosis,
    crop: cropHint,
    disease: "Healthy & Flourishing",
    severity: "Low",
    confidence: 96,
    yield_loss: 0,
    diagnosis_id: uid("d"),
    image_url: file ? URL.createObjectURL(file) : mockDiagnosis.image_url,
    created_at: new Date().toISOString(),
  };
}

export async function getDiagnosisHistory(): Promise<Diagnosis[]> {
  try {
    const headers = await authHeaders();
    const res = await fetch(`${API_BASE_URL}/crop/history`, { headers });
    if (res.ok) {
      const data = await res.json();
      if (data.diagnoses && data.diagnoses.length > 0) {
        return data.diagnoses.map((d: any) => ({
          diagnosis_id: d.diagnosis_id,
          user_id: d.user_id ?? "u_demo",
          crop: d.crop,
          disease: d.disease,
          confidence: Math.round(d.confidence * 100),
          severity: (d.severity.charAt(0).toUpperCase() + d.severity.slice(1).toLowerCase()) as Severity,
          image_url: d.image_url ? `${API_BASE_URL}${d.image_url}` : "",
          yield_loss: d.yield_loss ?? 0,
          description: d.description ?? "Clean leaf foliage",
          symptoms: d.symptoms ?? ["Clean foliage"],
          actions: d.actions ?? ["Maintain watering"],
          revenue_impact: d.revenue_impact ?? [0, 0],
          created_at: d.created_at,
        }));
      }
    }
  } catch (e) {
    console.warn("History fetch failed, using mock history.", e);
  }
  return mockHistory;
}

export async function getDiagnosis(id: string): Promise<Diagnosis | undefined> {
  try {
    const headers = await authHeaders();
    const res = await fetch(`${API_BASE_URL}/crop/${id}`, { headers });
    if (res.ok) {
      const d = await res.json();
      return {
        diagnosis_id: d.diagnosis_id,
        user_id: d.user_id ?? "u_demo",
        crop: d.crop,
        disease: d.disease,
        confidence: Math.round(d.confidence * 100),
        severity: (d.severity.charAt(0).toUpperCase() + d.severity.slice(1).toLowerCase()) as Severity,
        image_url: d.image_url ? `${API_BASE_URL}${d.image_url}` : "",
        yield_loss: d.yield_loss ?? 0,
        description: d.description ?? "Clean leaf foliage",
        symptoms: d.symptoms ?? ["Clean foliage"],
        actions: d.actions ?? ["Maintain watering"],
        revenue_impact: d.revenue_impact ?? [0, 0],
        created_at: d.created_at,
      };
    }
  } catch (e) {
    console.warn("Get diagnosis failed.", e);
  }
  return mockHistory.find((d) => d.diagnosis_id === id) ?? mockDiagnosis;
}

// --------------------------------------------------------------- weather
export async function getWeather(location = "Bangalore"): Promise<Weather> {
  try {
    const headers = await authHeaders();
    const res = await fetch(`${API_BASE_URL}/weather?location=${encodeURIComponent(location)}`, { headers });
    if (res.ok) {
      const data = await res.json();
      const current = data.current || {};
      const riskCap = (data.weather_risk ? data.weather_risk.charAt(0).toUpperCase() + data.weather_risk.slice(1).toLowerCase() : "Moderate") as RiskLevel;

      return {
        location: data.location ?? location,
        temperature: current.temperature ?? 28,
        humidity: current.humidity ?? 72,
        rain_probability: Math.round((current.rain_probability ?? 0.35) * 100),
        rainfall: 12,
        wind_speed: current.wind_speed ?? 12,
        risk: riskCap,
        risk_reason: `Rain probability is around ${Math.round((current.rain_probability ?? 0.35) * 100)}% with ${current.humidity ?? 72}% humidity.`,
        risk_factors: ["High humidity", "Moderate rain probability"],
        timestamp: data.fetched_at ?? new Date().toISOString(),
      };
    }
  } catch (e) {
    console.warn("Weather fetch failed, using mock weather.", e);
  }
  return { ...mockWeather, location, timestamp: new Date().toISOString() };
}

// ---------------------------------------------------------------- market
export async function getMarketPrices(
  crop = "Tomato",
  location = "Bangalore",
  range: 7 | 30 | 90 = 7,
): Promise<MarketData> {
  try {
    const headers = await authHeaders();
    const res = await fetch(`${API_BASE_URL}/market/${crop.toLowerCase()}?days=${range}`, { headers });
    if (res.ok) {
      const data = await res.json();
      const predRes = await fetch(`${API_BASE_URL}/market/${crop.toLowerCase()}/prediction`, { headers });
      let predPrice = data.current_price * 1.1;
      let trend: "Bullish" | "Bearish" | "Stable" = "Bullish";

      if (predRes.ok) {
        const predData = await predRes.json();
        predPrice = predData.predicted_price_7d;
        trend = predData.trend === "rising" ? "Bullish" : predData.trend === "falling" ? "Bearish" : "Stable";
      }

      const series = (data.historical_prices || []).map((h: any) => ({
        label: h.date,
        price: h.price,
        predicted: null,
      }));

      return {
        crop: data.crop ?? crop,
        market: "Local Mandi",
        location: location,
        current_price: data.current_price ?? 28.5,
        predicted_price: predPrice,
        change_percentage: data.price_change_pct ?? 6.5,
        trend,
        series,
        timestamp: new Date().toISOString(),
      };
    }
  } catch (e) {
    console.warn("Market fetch failed, using mock market.", e);
  }
  return buildMarket(crop, location, range);
}

export async function getPricePrediction(crop = "Tomato") {
  try {
    const headers = await authHeaders();
    const res = await fetch(`${API_BASE_URL}/market/${crop.toLowerCase()}/prediction`, { headers });
    if (res.ok) {
      const data = await res.json();
      return {
        crop: data.crop,
        current_price: data.current_price,
        predicted_price: data.predicted_price_7d,
        change_percentage: data.price_change_pct,
        trend: data.trend === "rising" ? "Bullish" : data.trend === "falling" ? "Bearish" : "Stable",
        explanation: `Ridge Regression prediction trained on market history indicates a ${data.trend} price trend.`,
      };
    }
  } catch (e) {
    console.warn("Prediction fetch failed.", e);
  }
  const m = buildMarket(crop);
  return {
    crop,
    current_price: m.current_price,
    predicted_price: m.predicted_price,
    change_percentage: Number(
      (((m.predicted_price - m.current_price) / m.current_price) * 100).toFixed(1),
    ),
    trend: m.trend,
    explanation: "Recent market trends indicate a possible short-term increase.",
  };
}

// -------------------------------------------------------- decision engine
const severityScore: Record<Severity, number> = { Low: 1, Moderate: 2, High: 3 };
const riskScore: Record<RiskLevel, number> = { Low: 1, Moderate: 2, High: 3 };

export function computeDecision(input: {
  severity: Severity;
  weather_risk: RiskLevel;
  current_price: number;
  predicted_price: number;
  yield_loss: number;
}): { decision: Decision; reason: string; sell_percentage?: number } {
  const upside = ((input.predicted_price - input.current_price) / input.current_price) * 100;
  const risk = severityScore[input.severity] + riskScore[input.weather_risk] + input.yield_loss / 10;

  if (risk >= 5.5 || input.yield_loss >= 25) {
    return {
      decision: "SELL",
      reason:
        "High crop risk and potential yield loss may outweigh the expected market increase. Selling soon may help protect current value.",
    };
  }
  if (upside >= 10 && risk <= 4.5) {
    return {
      decision: "HOLD",
      reason:
        "Market prices are expected to increase over the next few days while the current crop risk remains manageable.",
    };
  }
  return {
    decision: "SELL_PARTIALLY",
    reason:
      "Lock in part of the current value while keeping some crop available for a possible price increase.",
    sell_percentage: 40,
  };
}

export async function getRecommendation(payload: {
  diagnosis_id: string;
  severity: Severity;
  weather_risk: RiskLevel;
  current_price: number;
  predicted_price: number;
  yield_loss: number;
}): Promise<Recommendation> {
  try {
    const headers = await authHeaders();
    const res = await fetch(`${API_BASE_URL}/recommendation`, {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({
        diagnosis_id: payload.diagnosis_id || "d_demo",
        crop: "tomato",
        location: "Bangalore",
        affected_area_pct: payload.yield_loss * 1.5,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      return {
        recommendation_id: data.recommendation_id,
        diagnosis_id: payload.diagnosis_id,
        decision: data.decision as Decision,
        current_price: data.current_price,
        predicted_price: data.predicted_price,
        disease_severity: payload.severity,
        weather_risk: payload.weather_risk,
        yield_loss: data.yield_loss,
        reason: data.reason,
        sell_percentage: data.decision === "SELL_PARTIALLY" ? 40 : undefined,
        created_at: data.created_at ?? new Date().toISOString(),
      };
    }
  } catch (e) {
    console.warn("Recommendation API failed, using client decision engine.", e);
  }

  const { decision, reason, sell_percentage } = computeDecision(payload);
  return {
    recommendation_id: uid("r"),
    diagnosis_id: payload.diagnosis_id,
    decision,
    current_price: payload.current_price,
    predicted_price: payload.predicted_price,
    disease_severity: payload.severity,
    weather_risk: payload.weather_risk,
    yield_loss: payload.yield_loss,
    reason,
    sell_percentage,
    created_at: new Date().toISOString(),
  };
}

// ------------------------------------------------------------------ chat
export async function askChatbot(
  question: string,
  context: FarmContextPayload = {},
  language: LanguageCode = "en",
): Promise<ChatMessage> {
  try {
    const headers = await authHeaders();
    const res = await fetch(`${API_BASE_URL}/chat`, {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({
        message: question,
        diagnosis_id: (context as any)?.diagnosis_id,
        language: language,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      return {
        id: uid("m"),
        role: "assistant",
        content: data.reply,
        created_at: new Date().toISOString(),
      };
    }
  } catch (e) {
    console.warn("Chatbot API failed, using offline response.", e);
  }

  const q = question.toLowerCase();
  const crop = context.crop || "Onion";
  const disease = context.disease || "Purple Blotch";
  const severity = context.severity || "MODERATE";
  const currPrice = context.current_price || 2400;
  const predPrice = context.predicted_price || 2750;
  const yieldLoss = context.yield_loss || "15-25%";
  const decision = context.recommendation || "HOLD";

  let dynamicReply = "";

  if (q.includes("price") || q.includes("market") || q.includes("cost") || q.includes("sell") || q.includes("rate") || q.includes("mandi") || q.includes("दाम") || q.includes("कीमत") || q.includes("ಬೆಲೆ") || q.includes("ಮಾರಾಟ")) {
    if (language === "hi") {
      dynamicReply = `वर्तमान में ${crop} का मंडी भाव ₹${currPrice}/क्विंटल है। हमारे मॉडल का अनुमान है कि अगले 7 दिनों में भाव बढ़कर ₹${predPrice}/क्विंटल हो जाएगा। वर्तमान सलाह: ${decision === "SELL_IMMEDIATELY" ? "तुरंत बेचें" : decision === "HOLD" ? "रुकें और 7 दिन बाद बेचें" : "मौसम और मांग देखकर निर्णय लें"}।`;
    } else if (language === "kn") {
      dynamicReply = `ಪ್ರಸ್ತುತ ${crop} ಮಾರುಕಟ್ಟೆ ದರ ₹${currPrice}/ಕ್ವಿಂಟಾಲ್ ಆಗಿದೆ. ಮುಂದಿನ 7 ದಿನಗಳಲ್ಲಿ ದರ ₹${predPrice}/ಕ್ವಿಂಟಾಲ್ ತಲುಪುವ ನಿರೀಕ್ಷೆಯಿದೆ. ಸಲಹೆ: ${decision}।`;
    } else {
      dynamicReply = `The current market price for ${crop} is ₹${currPrice}/quintal. Our 7-day predictive model estimates the price will reach ₹${predPrice}/quintal. Recommended strategy: ${decision} to maximize profit.`;
    }
  } else if (q.includes("today") || q.includes("do") || q.includes("action") || q.includes("should") || q.includes("आज") || q.includes("काम") || q.includes("ಇಂದು") || q.includes("ಮಾಡಬೇಕು")) {
    if (language === "hi") {
      dynamicReply = `आज आपकी ${crop} फसल के लिए मुख्य कार्य:\n1. ${disease} से प्रभावित पत्तियों की छंटाई करें।\n2. खेत में अतिरिक्त पानी न रुकने दें और कॉपर फफूंदनाशक का छिड़काव करें।\n3. मंडी के बदलते दामों पर नजर रखें।`;
    } else if (language === "kn") {
      dynamicReply = `ಇಂದು ನಿಮ್ಮ ${crop} ಬೆಳೆಗೆ ಮಾಡಬೇಕಾದ ಪ್ರಮುಖ ಕೆಲಸಗಳು:\n1. ${disease} ರೋಗಪೀಡಿತ ಭಾಗಗಳನ್ನು ತೆಗೆದುಹಾಕಿ.\n2. ಸೂಕ್ತ ಶಿಲೀಂಧ್ರನಾಶಕವನ್ನು ಸಿಂಪಡಿಸಿ.\n3. ಮಾರುಕಟ್ಟೆ ದರಗಳನ್ನು ಗಮನಿಸಿ.`;
    } else {
      dynamicReply = `Key action items for your ${crop} today:\n1. Inspect field and prune leaves showing ${disease} symptoms.\n2. Apply recommended fungicide during dry morning hours.\n3. Ensure proper field drainage to prevent fungal spore buildup.`;
    }
  } else if (q.includes("yield") || q.includes("loss") || q.includes("damage") || q.includes("risk") || q.includes("नुकसान") || q.includes("पैदावार") || q.includes("ನಷ್ಟ") || q.includes("ಇಳುವರಿ")) {
    if (language === "hi") {
      dynamicReply = `${disease} के कारण वर्तमान ${severity} गंभीरता पर अनुमानित फसल नुकसान ${yieldLoss} हो सकता है। समय पर उपचार करने से इस नुकसान को रोका जा सकता है।`;
    } else if (language === "kn") {
      dynamicReply = `${disease} ರೋಗದ ಪರಿಣಾಮವಾಗಿ ನಿಮ್ಮ ${crop} ಇಳುವರಿಯಲ್ಲಿ ಅಂದಾಜು ${yieldLoss} ನಷ್ಟವಾಗುವ ಸಾಧ್ಯತೆಯಿದೆ. ತಕ್ಷಣದ ಚಿಕಿತ್ಸೆ ಅಗತ್ಯ.`;
    } else {
      dynamicReply = `With a ${severity} severity diagnosis of ${disease} on your ${crop}, the projected yield loss is estimated at ${yieldLoss} if left untreated. Timely fungicide application can reduce this risk significantly.`;
    }
  } else if (q.includes("spray") || q.includes("treatment") || q.includes("fungicide") || q.includes("medicine") || q.includes("disease") || q.includes("दवा") || q.includes("छिड़काव") || q.includes("ಔಷಧಿ") || q.includes("ರೋಗ")) {
    if (language === "hi") {
      dynamicReply = `${crop} की ${disease} बीमारी के लिए:\n1. मैनकोज़ेब (Mancozeb 75% WP) या कॉपर ऑक्सीक्लोराइड 2 ग्राम प्रति लीटर पानी में मिलाकर छिड़काव करें।\n2. 10-12 दिनों के बाद पुनः छिड़काव करें।`;
    } else if (language === "kn") {
      dynamicReply = `${crop} ಬೆಳೆಗೆ ಬಂದಿರುವ ${disease} ರೋಗಕ್ಕೆ ಕಾಪರ್ ಆಕ್ಸಿಕ್ಲೋರೈಡ್ ಅಥವಾ ಮ್ಯಾಂಕೋಜೆಬ್ 2 ಗ್ರಾಂ/ಲೀಟರ್ ನೀರಿಗೆ ಬೆರೆಸಿ ಸಿಂಪಡಿಸಿ.`;
    } else {
      dynamicReply = `For treating ${disease} in ${crop}:\n1. Spray Mancozeb 75% WP or Copper Oxychloride at 2g/L of water.\n2. Repeat application after 10-12 days if damp weather persists.`;
    }
  } else {
    if (language === "hi") {
      dynamicReply = `${crop} स्थिति: ${disease} (${severity} प्रभाव)। बाजार मूल्य ₹${currPrice}/क्विंटल है और सलाह: ${decision}। क्या आप उपचार, नुकसान बचाव या मंडी पूर्वानुमान के बारे में कुछ और पूछना चाहते हैं?`;
    } else if (language === "kn") {
      dynamicReply = `${crop} ಬೆಳೆಯ ಸ್ಥಿತಿ: ${disease} (${severity}). ಪ್ರಸ್ತುತ ಮಾರುಕಟ್ಟೆ ದರ ₹${currPrice}/ಕ್ವಿಂಟಾಲ್. ಸಲಹೆ: ${decision}.`;
    } else {
      dynamicReply = `Regarding your ${crop} (${disease}, ${severity} severity): The current market price is ₹${currPrice}/quintal with a recommendation to ${decision}. Let me know if you need specific details on chemical sprays, yield loss prevention, or market timing.`;
    }
  }

  return {
    id: uid("m"),
    role: "assistant",
    content: dynamicReply,
    created_at: new Date().toISOString(),
  };
}

// ------------------------------------------------------------- community
export async function getCommunityPosts(): Promise<CommunityPost[]> {
  try {
    const headers = await authHeaders();
    const res = await fetch(`${API_BASE_URL}/community/posts`, { headers });
    if (res.ok) {
      const data = await res.json();
      if (data.posts && data.posts.length > 0) {
        return data.posts.map((p: any) => ({
          post_id: p.post_id,
          author: p.user_name ?? "Farmer",
          crop: p.crop,
          category: "Disease",
          question: p.question,
          created_at: p.created_at,
          answer_count: p.answer_count,
          like_count: 5,
          answers: [],
        }));
      }
    }
  } catch (e) {
    console.warn("Community posts fetch failed.", e);
  }
  return mockCommunityPosts;
}

export async function getCommunityPost(id: string): Promise<CommunityPost | undefined> {
  try {
    const headers = await authHeaders();
    const res = await fetch(`${API_BASE_URL}/community/posts/${id}`, { headers });
    if (res.ok) {
      const p = await res.json();
      return {
        post_id: p.post_id,
        author: p.user_name ?? "Farmer",
        crop: p.crop,
        category: "Disease",
        question: p.question,
        created_at: p.created_at,
        answer_count: p.answers?.length ?? 0,
        like_count: 5,
        answers: (p.answers || []).map((a: any) => ({
          answer_id: a.answer_id,
          post_id: p.post_id,
          author: a.user_name ?? (a.is_ai_generated ? "AgriSense AI" : "Farmer"),
          answer: a.answer,
          is_ai_generated: a.is_ai_generated,
          created_at: a.created_at,
          like_count: a.is_ai_generated ? 12 : 3,
        })),
      };
    }
  } catch (e) {
    console.warn("Community post detail fetch failed.", e);
  }
  return mockCommunityPosts.find((p) => p.post_id === id);
}

export async function createCommunityPost(input: {
  crop: string;
  category: CommunityPost["category"];
  question: string;
  image_url?: string;
}): Promise<CommunityPost> {
  try {
    const headers = await authHeaders();
    const res = await fetch(`${API_BASE_URL}/community/posts`, {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({
        crop: input.crop,
        question: input.question,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      return {
        post_id: data.post_id,
        author: "Farmer",
        crop: data.crop,
        category: input.category,
        question: data.question,
        created_at: data.created_at,
        answer_count: 1,
        like_count: 0,
        answers: [
          {
            answer_id: data.ai_answer?.answer_id ?? uid("a"),
            post_id: data.post_id,
            author: "AgriSense AI",
            answer: data.ai_answer?.answer ?? "AI advice generated.",
            is_ai_generated: true,
            created_at: data.created_at,
            like_count: 1,
          },
        ],
      };
    }
  } catch (e) {
    console.warn("Post creation failed.", e);
  }

  const post: CommunityPost = {
    post_id: uid("p"),
    author: "Ramesh Kumar",
    created_at: new Date().toISOString(),
    answer_count: 1,
    like_count: 0,
    answers: [
      {
        answer_id: uid("a"),
        post_id: "",
        author: "AI Farm Assistant",
        answer: `Based on available information about ${input.crop.toLowerCase()}, this may be related to local weather and crop conditions.`,
        is_ai_generated: true,
        created_at: new Date().toISOString(),
        like_count: 0,
      },
    ],
    ...input,
  };
  post.answers[0].post_id = post.post_id;
  return post;
}

export async function addCommunityAnswer(
  postId: string,
  answer: string,
): Promise<CommunityAnswer> {
  try {
    const headers = await authHeaders();
    const res = await fetch(`${API_BASE_URL}/community/posts/${postId}/answers`, {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ answer }),
    });

    if (res.ok) {
      const data = await res.json();
      return {
        answer_id: data.answer_id,
        post_id: postId,
        author: data.user_name ?? "Farmer",
        answer: data.answer,
        is_ai_generated: false,
        created_at: data.created_at,
        like_count: 0,
      };
    }
  } catch (e) {
    console.warn("Add answer failed.", e);
  }

  return {
    answer_id: uid("a"),
    post_id: postId,
    author: "Ramesh Kumar",
    answer,
    is_ai_generated: false,
    created_at: new Date().toISOString(),
    like_count: 0,
  };
}

// --------------------------------------------------------- notifications
export async function getNotifications() {
  await delay(300);
  return mockNotifications;
}
