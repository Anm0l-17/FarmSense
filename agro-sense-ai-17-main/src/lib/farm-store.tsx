import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { mockDiagnosis, mockHistory, mockMarket, mockUser, mockWeather } from "@/data/mock";
import { computeDecision, getMarketPrices, getWeather } from "@/services/api";
import type {
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

  useEffect(() => {
    let active = true;
    setLoadingConditions(true);
    Promise.all([getWeather(location), getMarketPrices(crop, location)])
      .then(([w, m]) => {
        if (!active) return;
        setWeather(w);
        setMarket(m);
      })
      .catch(() => {
        /* demo-safe: keep existing mock values */
      })
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
  };

  return <FarmCtx.Provider value={value}>{children}</FarmCtx.Provider>;
}

export function useFarm() {
  const ctx = useContext(FarmCtx);
  if (!ctx) throw new Error("useFarm must be used within FarmProvider");
  return ctx;
}
