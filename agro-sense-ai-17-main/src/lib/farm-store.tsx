import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { mockDiagnosis, mockHistory, mockMarket, mockNotifications, mockUser, mockWeather } from "@/data/mock";
import { computeDecision, getDiagnosisHistory, getMarketPrices, getUserProfile, getWeather, updateUserProfile } from "@/services/api";
import type {
  AppNotification,
  Diagnosis,
  FarmContextPayload,
  MarketData,
  Recommendation,
  User,
  Weather,
} from "@/types";

interface FarmStore {
  user: User;
  setUser: (u: User) => void;
  updateUser: (u: Partial<User>) => Promise<void>;
  diagnosis: Diagnosis;
  setDiagnosis: (d: Diagnosis) => void;
  history: Diagnosis[];
  saveDiagnosis: (d: Diagnosis) => void;
  weather: Weather;
  market: MarketData;
  crop: string;
  setCrop: (c: string) => void;
  location: string;
  setLocation: (l: string) => void;
  loadingConditions: boolean;
  recommendation: Recommendation;
  aiContext: FarmContextPayload;
  notifications: AppNotification[];
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
}

const FarmCtx = createContext<FarmStore | null>(null);

export function FarmProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(mockUser);
  const [diagnosis, setDiagnosis] = useState<Diagnosis>(mockDiagnosis);
  const [history, setHistory] = useState<Diagnosis[]>(mockHistory);
  const [weather, setWeather] = useState<Weather>(mockWeather);
  const [market, setMarket] = useState<MarketData>(mockMarket);
  const [crop, setCrop] = useState("Tomato");
  const [location, setLocation] = useState("Bangalore");
  const [loadingConditions, setLoadingConditions] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>(mockNotifications);

  // Sync profile & diagnosis history from API
  useEffect(() => {
    getUserProfile().then((u) => {
      if (u && u.name) {
        setUser(u);
        if (u.location) setLocation(u.location);
      }
    }).catch(() => {});

    getDiagnosisHistory().then((h) => {
      if (h && h.length > 0) {
        setHistory(h);
        setDiagnosis(h[0]);
      }
    }).catch(() => {});
  }, []);

  const updateUser = useCallback(async (partial: Partial<User>) => {
    const updated = await updateUserProfile(partial);
    setUser(updated);
    if (updated.location) setLocation(updated.location);
  }, []);

  useEffect(() => {
    let active = true;
    setLoadingConditions(true);
    Promise.all([getWeather(location), getMarketPrices(crop, location)])
      .then(([w, m]) => {
        if (!active) return;
        setWeather(w);
        setMarket(m);
      })
      .catch(() => {})
      .finally(() => active && setLoadingConditions(false));
    return () => {
      active = false;
    };
  }, [crop, location]);

  const saveDiagnosis = useCallback((d: Diagnosis) => {
    setDiagnosis(d);
    setHistory((prev) =>
      prev.some((p) => p.diagnosis_id === d.diagnosis_id) ? prev : [d, ...prev],
    );
  }, []);

  const markNotificationAsRead = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const recommendation = useMemo<Recommendation>(() => {
    const { decision, reason, sell_percentage } = computeDecision({
      severity: diagnosis.severity,
      weather_risk: weather.risk,
      current_price: market.current_price,
      predicted_price: market.predicted_price,
      yield_loss: diagnosis.yield_loss,
    });
    return {
      recommendation_id: `r_${diagnosis.diagnosis_id}`,
      diagnosis_id: diagnosis.diagnosis_id,
      decision,
      current_price: market.current_price,
      predicted_price: market.predicted_price,
      disease_severity: diagnosis.severity,
      weather_risk: weather.risk,
      yield_loss: diagnosis.yield_loss,
      reason,
      sell_percentage,
      created_at: new Date().toISOString(),
    };
  }, [diagnosis, weather, market]);

  const aiContext = useMemo<FarmContextPayload>(
    () => ({
      crop: diagnosis.crop,
      disease: diagnosis.disease,
      severity: diagnosis.severity,
      confidence: diagnosis.confidence,
      yield_loss: diagnosis.yield_loss,
      weather,
      weather_risk: weather.risk,
      current_price: market.current_price,
      predicted_price: market.predicted_price,
      recommendation: recommendation.decision,
    }),
    [diagnosis, weather, market, recommendation],
  );

  const value: FarmStore = {
    user,
    setUser,
    updateUser,
    diagnosis,
    setDiagnosis,
    history,
    saveDiagnosis,
    weather,
    market,
    crop,
    setCrop,
    location,
    setLocation,
    loadingConditions,
    recommendation,
    aiContext,
    notifications,
    markNotificationAsRead,
    clearNotifications,
  };

  return <FarmCtx.Provider value={value}>{children}</FarmCtx.Provider>;
}

export function useFarm() {
  const ctx = useContext(FarmCtx);
  if (!ctx) throw new Error("useFarm must be used within FarmProvider");
  return ctx;
}
