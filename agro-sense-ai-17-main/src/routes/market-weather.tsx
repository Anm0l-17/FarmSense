import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CloudRain, Droplets, Info, Thermometer, TrendingUp, Wind, CloudDrizzle } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PriceChart } from "@/components/market/PriceChart";
import { RiskIndicator } from "@/components/common/severity";
import { RecommendationCard } from "@/components/common/RecommendationCard";
import { CardSkeleton } from "@/components/common/states";
import { CROPS, CROP_EMOJI, LOCATIONS } from "@/data/mock";
import { getMarketPrices } from "@/services/api";
import { useFarm } from "@/lib/farm-store";
import { useI18n } from "@/lib/i18n";
import { formatCurrency } from "@/utils/format";
import type { MarketData } from "@/types";

export const Route = createFileRoute("/market-weather")({
  head: () => ({
    meta: [
      { title: "Market Prices & Weather Risk — AI Farm Companion" },
      {
        name: "description",
        content:
          "Track crop market prices, 3-day price predictions, weather conditions and fungal disease risk.",
      },
      { property: "og:title", content: "Market Prices & Weather Risk — AI Farm Companion" },
      {
        property: "og:description",
        content: "Crop price history, predictions and weather risk in one view.",
      },
    ],
  }),
  component: MarketWeather,
});

function MarketWeather() {
  const { t } = useI18n();
  const { crop, setCrop, location, setLocation, weather, market, recommendation, loadingConditions } =
    useFarm();
  const [range, setRange] = useState<7 | 30 | 90>(7);
  const [rangeData, setRangeData] = useState<MarketData>(market);
  const [rangeLoading, setRangeLoading] = useState(false);

  useEffect(() => {
    let active = true;
    setRangeLoading(true);
    getMarketPrices(crop, location, range)
      .then((m) => active && setRangeData(m))
      .catch(() => active && setRangeData(market))
      .finally(() => active && setRangeLoading(false));
    return () => {
      active = false;
    };
  }, [crop, location, range, market]);

  const changePct = (
    ((market.predicted_price - market.current_price) / market.current_price) *
    100
  ).toFixed(1);

  return (
    <AppLayout title={t("market.title")} subtitle={t("market.sub")}>
      <div className="space-y-5">
        <div className="flex flex-wrap gap-3">
          <Select value={crop} onValueChange={setCrop}>
            <SelectTrigger className="w-44" aria-label="Select crop">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CROPS.map((c) => (
                <SelectItem key={c} value={c}>
                  {CROP_EMOJI[c]} {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="w-44" aria-label="Select location">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LOCATIONS.map((l) => (
                <SelectItem key={l} value={l}>
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-5">
            {loadingConditions ? (
              <CardSkeleton rows={4} />
            ) : (
              <section className="surface-card p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {CROP_EMOJI[market.crop]} {market.crop} · {market.market}
                    </p>
                    <p className="text-4xl font-bold">{formatCurrency(market.current_price)}</p>
                    <p className="mt-1 text-sm font-medium text-success">
                      <TrendingUp className="mr-1 inline size-4" aria-hidden />↑{" "}
                      {market.change_percentage}% this week
                    </p>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    <p>{market.location}</p>
                    <p>Last updated: Today</p>
                    <span className="mt-2 inline-block rounded-full bg-accent px-2 py-0.5 text-[11px] font-medium text-accent-foreground">
                      {t("common.demoData")}
                    </span>
                  </div>
                </div>

                <div className="mt-5">
                  <Tabs value={String(range)} onValueChange={(v) => setRange(Number(v) as 7 | 30 | 90)}>
                    <TabsList>
                      <TabsTrigger value="7">7 Days</TabsTrigger>
                      <TabsTrigger value="30">30 Days</TabsTrigger>
                      <TabsTrigger value="90">3 Months</TabsTrigger>
                    </TabsList>
                  </Tabs>
                  <div className="mt-3">
                    {rangeLoading ? (
                      <CardSkeleton rows={5} />
                    ) : (
                      <PriceChart data={rangeData.series} />
                    )}
                  </div>
                  <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <span className="h-0.5 w-5 bg-primary" aria-hidden /> Historical price
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span
                        className="h-0.5 w-5 border-t-2 border-dashed border-secondary"
                        aria-hidden
                      />{" "}
                      Predicted price
                    </span>
                  </div>
                </div>
              </section>
            )}

            <section className="surface-card p-5">
              <h2 className="font-semibold">Price Outlook</h2>
              <dl className="mt-3 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl bg-muted/60 p-3">
                  <dt className="text-xs text-muted-foreground">Current</dt>
                  <dd className="text-xl font-bold">{formatCurrency(market.current_price)}</dd>
                </div>
                <div className="rounded-xl bg-muted/60 p-3">
                  <dt className="text-xs text-muted-foreground">Expected in 3 days</dt>
                  <dd className="text-xl font-bold">{formatCurrency(market.predicted_price)}</dd>
                </div>
                <div className="rounded-xl bg-success/10 p-3">
                  <dt className="text-xs text-muted-foreground">Expected change</dt>
                  <dd className="text-xl font-bold text-success">+{changePct}%</dd>
                </div>
              </dl>
              <p className="mt-3 text-sm text-muted-foreground">
                Trend: <span className="font-semibold text-foreground">{market.trend}</span> — recent
                market trends indicate a possible short-term increase.
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Info className="size-3.5" aria-hidden /> Prediction is an estimate and may change.
              </p>
            </section>
          </div>

          <div className="space-y-5">
            <section className="surface-card p-5">
              <h2 className="font-semibold">Weather · {weather.location}</h2>
              <dl className="mt-3 grid grid-cols-2 gap-3">
                {[
                  { icon: Thermometer, label: "Temperature", value: `${weather.temperature}°C` },
                  { icon: Droplets, label: "Humidity", value: `${weather.humidity}%` },
                  { icon: CloudRain, label: "Rain Probability", value: `${weather.rain_probability}%` },
                  { icon: CloudDrizzle, label: "Rainfall", value: `${weather.rainfall} mm` },
                  { icon: Wind, label: "Wind", value: `${weather.wind_speed} km/h` },
                ].map((w) => (
                  <div key={w.label} className="rounded-xl bg-muted/60 p-3">
                    <dt className="flex items-center gap-1.5 text-[11px] uppercase text-muted-foreground">
                      <w.icon className="size-3.5" aria-hidden /> {w.label}
                    </dt>
                    <dd className="mt-1 text-lg font-bold">{w.value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className="surface-card p-5">
              <h2 className="mb-3 font-semibold">Weather Risk</h2>
              <RiskIndicator
                level={weather.risk}
                reason={weather.risk_reason}
                factors={weather.risk_factors}
              />
            </section>

            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline" className="flex-1">
                <Link to="/ai-assistant">{t("common.askAi")}</Link>
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link to="/crop-diagnosis/result">{t("common.viewDiagnosis")}</Link>
              </Button>
            </div>
          </div>
        </div>

        <RecommendationCard recommendation={recommendation} />
      </div>
    </AppLayout>
  );
}
