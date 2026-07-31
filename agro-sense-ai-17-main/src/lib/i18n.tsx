import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { LanguageCode } from "@/types";

type Dict = Record<string, string>;

const en: Dict = {
  "app.name": "AI Farm Companion",
  "app.tagline": "Smarter insights. Better decisions. Healthier farms.",
  "nav.dashboard": "Dashboard",
  "nav.diagnosis": "Crop Diagnosis",
  "nav.market": "Market & Weather",
  "nav.assistant": "AI Farm Assistant",
  "nav.community": "Community",
  "nav.history": "My History",
  "nav.settings": "Settings",
  "nav.home": "Home",
  "nav.diagnose": "Diagnose",
  "nav.more": "More",
  "common.demoMode": "Demo Mode",
  "common.demoData": "Demo data",
  "common.viewDiagnosis": "View Diagnosis",
  "common.viewMarket": "View Market",
  "common.viewWeather": "View Weather",
  "common.askAi": "Ask AI",
  "common.tryAgain": "Try Again",
  "common.why": "Why?",
  "common.notifications": "Notifications",
  "dash.greeting": "Good morning, Farmer 👋",
  "dash.sub": "Here's what's happening with your farm today.",
  "dash.cta": "Diagnose a Crop",
  "dash.latestDiagnosis": "Latest Diagnosis",
  "dash.weatherRisk": "Weather Risk",
  "dash.marketPrice": "Market Price",
  "dash.cropHealth": "Crop Health",
  "dash.recommendation": "AI Farm Recommendation",
  "dash.glance": "Your farm at a glance",
  "dash.quickActions": "Quick Actions",
  "diag.title": "Crop Diagnosis",
  "diag.sub":
    "Upload a clear photo of your crop to identify possible diseases and understand their severity.",
  "diag.upload": "Upload your crop image",
  "diag.dragDrop": "Drag & drop or browse from your device",
  "diag.browse": "Browse Image",
  "diag.analyze": "Analyze Crop",
  "diag.remove": "Remove",
  "diag.analyzing": "Analyzing your crop...",
  "market.title": "Market & Weather",
  "market.sub": "Understand the conditions affecting your crop.",
  "assistant.title": "AI Farm Assistant",
  "assistant.sub": "Ask questions about your crop, disease, weather and market.",
  "assistant.placeholder": "Ask about your farm...",
  "assistant.send": "Send",
  "assistant.thinking": "AI is thinking...",
  "assistant.welcome":
    "Hello! I'm your AI Farm Assistant. I can help you understand your crop diagnosis, weather, market prices and farming decisions.",
  "community.title": "Community Q&A",
  "community.sub": "Ask questions, share experiences and learn from other farmers.",
  "history.title": "My History",
  "history.sub": "All your previous crop diagnoses in one place.",
  "settings.title": "Settings",
  "settings.sub": "Manage your preferences.",
  "decision.SELL": "SELL",
  "decision.HOLD": "HOLD",
  "decision.SELL_PARTIALLY": "SELL PARTIALLY",
  "severity.Low": "Low",
  "severity.Moderate": "Moderate",
  "severity.High": "High",
};

const kn: Dict = {
  ...en,
  "app.tagline": "ಚುರುಕಾದ ಒಳನೋಟ. ಉತ್ತಮ ನಿರ್ಧಾರ. ಆರೋಗ್ಯಕರ ಕೃಷಿ.",
  "nav.dashboard": "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
  "nav.diagnosis": "ಬೆಳೆ ರೋಗನಿರ್ಣಯ",
  "nav.market": "ಮಾರುಕಟ್ಟೆ ಮತ್ತು ಹವಾಮಾನ",
  "nav.assistant": "ಎಐ ಕೃಷಿ ಸಹಾಯಕ",
  "nav.community": "ಸಮುದಾಯ",
  "nav.history": "ನನ್ನ ಇತಿಹಾಸ",
  "nav.settings": "ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
  "nav.home": "ಮುಖಪುಟ",
  "nav.diagnose": "ರೋಗನಿರ್ಣಯ",
  "nav.more": "ಇನ್ನಷ್ಟು",
  "dash.greeting": "ಶುಭೋದಯ, ರೈತರೇ 👋",
  "dash.sub": "ಇಂದು ನಿಮ್ಮ ಕೃಷಿಯಲ್ಲಿ ಏನಾಗುತ್ತಿದೆ ಎಂಬುದು ಇಲ್ಲಿದೆ.",
  "dash.cta": "ಬೆಳೆ ರೋಗನಿರ್ಣಯ ಮಾಡಿ",
  "dash.latestDiagnosis": "ಇತ್ತೀಚಿನ ರೋಗನಿರ್ಣಯ",
  "dash.weatherRisk": "ಹವಾಮಾನ ಅಪಾಯ",
  "dash.marketPrice": "ಮಾರುಕಟ್ಟೆ ಬೆಲೆ",
  "dash.cropHealth": "ಬೆಳೆ ಆರೋಗ್ಯ",
  "dash.recommendation": "ಎಐ ಕೃಷಿ ಶಿಫಾರಸು",
  "dash.glance": "ನಿಮ್ಮ ಕೃಷಿಯ ಒಂದು ನೋಟ",
  "dash.quickActions": "ತ್ವರಿತ ಕ್ರಮಗಳು",
  "assistant.title": "ಎಐ ಕೃಷಿ ಸಹಾಯಕ",
  "assistant.sub": "ನಿಮ್ಮ ಬೆಳೆ, ರೋಗ, ಹವಾಮಾನ ಮತ್ತು ಮಾರುಕಟ್ಟೆ ಬಗ್ಗೆ ಪ್ರಶ್ನಿಸಿ.",
  "assistant.placeholder": "ನಿಮ್ಮ ಕೃಷಿಯ ಬಗ್ಗೆ ಕೇಳಿ...",
  "assistant.send": "ಕಳುಹಿಸಿ",
  "assistant.thinking": "ಎಐ ಯೋಚಿಸುತ್ತಿದೆ...",
  "assistant.welcome":
    "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಎಐ ಕೃಷಿ ಸಹಾಯಕ. ರೋಗನಿರ್ಣಯ, ಹವಾಮಾನ, ಮಾರುಕಟ್ಟೆ ಬೆಲೆ ಮತ್ತು ನಿರ್ಧಾರಗಳಲ್ಲಿ ಸಹಾಯ ಮಾಡಬಲ್ಲೆ.",
  "common.askAi": "ಎಐ ಕೇಳಿ",
  "common.why": "ಏಕೆ?",
  "decision.HOLD": "ಕಾಯ್ದಿರಿಸಿ",
  "decision.SELL": "ಮಾರಾಟ ಮಾಡಿ",
  "decision.SELL_PARTIALLY": "ಭಾಗಶಃ ಮಾರಾಟ",
  "severity.Moderate": "ಮಧ್ಯಮ",
  "severity.Low": "ಕಡಿಮೆ",
  "severity.High": "ಹೆಚ್ಚು",
};

const hi: Dict = {
  ...en,
  "app.tagline": "बेहतर जानकारी. बेहतर निर्णय. स्वस्थ खेती.",
  "nav.dashboard": "डैशबोर्ड",
  "nav.diagnosis": "फसल निदान",
  "nav.market": "बाजार और मौसम",
  "nav.assistant": "एआई कृषि सहायक",
  "nav.community": "समुदाय",
  "nav.history": "मेरा इतिहास",
  "nav.settings": "सेटिंग्स",
  "nav.home": "होम",
  "nav.diagnose": "निदान",
  "nav.more": "और",
  "dash.greeting": "सुप्रभात, किसान जी 👋",
  "dash.sub": "आज आपके खेत में क्या हो रहा है।",
  "dash.cta": "फसल का निदान करें",
  "dash.latestDiagnosis": "नवीनतम निदान",
  "dash.weatherRisk": "मौसम जोखिम",
  "dash.marketPrice": "बाजार मूल्य",
  "dash.cropHealth": "फसल स्वास्थ्य",
  "dash.recommendation": "एआई कृषि सुझाव",
  "dash.glance": "आपका खेत एक नजर में",
  "dash.quickActions": "त्वरित कार्य",
  "assistant.title": "एआई कृषि सहायक",
  "assistant.sub": "अपनी फसल, रोग, मौसम और बाजार के बारे में पूछें।",
  "assistant.placeholder": "अपने खेत के बारे में पूछें...",
  "assistant.send": "भेजें",
  "assistant.thinking": "एआई सोच रहा है...",
  "assistant.welcome":
    "नमस्ते! मैं आपका एआई कृषि सहायक हूँ। मैं फसल निदान, मौसम, बाजार मूल्य और निर्णयों में मदद कर सकता हूँ।",
  "common.askAi": "एआई से पूछें",
  "common.why": "क्यों?",
  "decision.HOLD": "रोकें",
  "decision.SELL": "बेचें",
  "decision.SELL_PARTIALLY": "आंशिक बेचें",
  "severity.Moderate": "मध्यम",
  "severity.Low": "कम",
  "severity.High": "अधिक",
};

const dicts: Record<LanguageCode, Dict> = { en, kn, hi };

export const LANGUAGES: { code: LanguageCode; label: string }[] = [
  { code: "en", label: "English" },
  { code: "kn", label: "ಕನ್ನಡ" },
  { code: "hi", label: "हिन्दी" },
];

export const QUICK_PROMPTS: Record<LanguageCode, string[]> = {
  en: [
    "Why should I hold?",
    "How do I treat this disease?",
    "Will rain affect my crop?",
    "What is the expected price?",
    "How much yield could I lose?",
    "What should I do today?",
  ],
  kn: [
    "ನಾನು ಬೆಳೆ ಕಾಯ್ದಿರಿಸಬೇಕೆ?",
    "ಈ ರೋಗಕ್ಕೆ ಏನು ಮಾಡಬೇಕು?",
    "ಮಳೆ ನನ್ನ ಬೆಳೆಗೆ ಪರಿಣಾಮ ಬೀರುತ್ತದೆಯೇ?",
    "ನಿರೀಕ್ಷಿತ ಬೆಲೆ ಎಷ್ಟು?",
    "ಎಷ್ಟು ಇಳುವರಿ ನಷ್ಟವಾಗಬಹುದು?",
    "ಇಂದು ನಾನು ಏನು ಮಾಡಬೇಕು?",
  ],
  hi: [
    "मुझे फसल अभी क्यों नहीं बेचनी चाहिए?",
    "इस रोग का इलाज कैसे करें?",
    "क्या बारिश फसल को प्रभावित करेगी?",
    "अपेक्षित कीमत क्या है?",
    "कितनी उपज हानि हो सकती है?",
    "आज मुझे क्या करना चाहिए?",
  ],
};

interface I18nValue {
  lang: LanguageCode;
  setLang: (l: LanguageCode) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<LanguageCode>("en");
  const value = useMemo<I18nValue>(
    () => ({ lang, setLang, t: (key) => dicts[lang][key] ?? en[key] ?? key }),
    [lang],
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
