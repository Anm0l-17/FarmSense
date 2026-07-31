import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Camera,
  CloudRain,
  Droplets,
  IndianRupee,
  Sprout,
  Thermometer,
  TrendingUp,
  Wind,
  Bot,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppLayout } from "@/components/layout/AppLayout";
import { RecommendationCard } from "@/components/common/RecommendationCard";
import { SeverityBadge, SeverityScale } from "@/components/common/severity";
import { MiniPriceChart } from "@/components/market/PriceChart";
import { CardSkeleton } from "@/components/common/states";
import { useFarm } from "@/lib/farm-store";
import { useI18n } from "@/lib/i18n";
import { CROP_EMOJI } from "@/data/mock";
import { formatCurrency } from "@/utils/format";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Farm Dashboard — AI Farm Companion" },
      {
        name: "description",
        content:
          "See your crop health, weather risk, market price and AI sell/hold recommendation in one farm dashboard.",
      },
      { property: "og:title", content: "Farm Dashboard — AI Farm Companion" },
      {
        property: "og:description",
        content: "Crop health, weather risk, market prices and AI recommendations for farmers.",
      },
    ],
  }),
  component: Dashboard,
});

function MetricCard({
  label,
  children,
  action,
}: {
  label: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="surface-card flex flex-col gap-2 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="flex-1">{children}</div>
      {action}
    </div>
  );
}

function Dashboard() {
  const { t } = useI18n();
  const { diagnosis, weather, market, recommendation, loadingConditions } = useFarm();
  const changePct = (
    ((market.predicted_price - market.current_price) / market.current_price) *
    100
  ).toFixed(1);

  return (
    <AppLayout title={t("nav.dashboard")} subtitle={t("app.tagline")}>
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">{t("dash.greeting")}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{t("dash.sub")}</p>
          </div>
          <Button asChild size="lg">
            <Link to="/crop-diagnosis">
              <Camera className="size-4" /> + {t("dash.cta")}
            </Link>
          </Button>
        </div>

        {/* Summary metrics */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label={t("dash.latestDiagnosis")}
            action={
              <Button asChild variant="ghost" size="sm" className="justify-start px-0 text-primary">
                <Link to="/crop-diagnosis/result">
                  {t("common.viewDiagnosis")} <ArrowRight className="size-3.5" />
                </Link>
              </Button>
            }
          >
            <p className="text-lg font-bold">
              {CROP_EMOJI[diagnosis.crop] ?? "🌱"} {diagnosis.crop}
            </p>
            <p className="text-sm text-muted-foreground">{diagnosis.disease}</p>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs font-semibold text-primary">
                {diagnosis.confidence}% confidence
              </span>
              <SeverityBadge level={diagnosis.severity} />
            </div>
          </MetricCard>

          {loadingConditions ? (
            <CardSkeleton />
          ) : (
            <MetricCard
              label={t("dash.weatherRisk")}
              action={
                <Button asChild variant="ghost" size="sm" className="justify-start px-0 text-primary">
                  <Link to="/market-weather">
                    {t("common.viewWeather")} <ArrowRight className="size-3.5" />
                  </Link>
                </Button>
              }
            >
              <p className="text-2xl font-bold">{weather.temperature}°C</p>
              <p className="text-sm text-muted-foreground">
                {weather.humidity}% humidity · {weather.rain_probability}% rain
              </p>
              <div className="mt-2">
                <SeverityBadge level={weather.risk} label={`${weather.risk.toUpperCase()} RISK`} />
              </div>
            </MetricCard>
          )}

          {loadingConditions ? (
            <CardSkeleton />
          ) : (
            <MetricCard
              label={t("dash.marketPrice")}
              action={
                <Button asChild variant="ghost" size="sm" className="justify-start px-0 text-primary">
                  <Link to="/market-weather">
                    {t("common.viewMarket")} <ArrowRight className="size-3.5" />
                  </Link>
                </Button>
              }
            >
              <p className="text-sm text-muted-foreground">{market.crop}</p>
              <p className="text-2xl font-bold">{formatCurrency(market.current_price)}</p>
              <p className="mt-1 text-sm font-medium text-success">
                <TrendingUp className="mr-1 inline size-3.5" aria-hidden />
                Predicted {formatCurrency(market.predicted_price)} (+{changePct}%)
              </p>
            </MetricCard>
          )}

          <MetricCard
            label={t("dash.cropHealth")}
            action={
              <Button asChild variant="ghost" size="sm" className="justify-start px-0 text-primary">
                <Link to="/history">
                  {t("nav.history")} <ArrowRight className="size-3.5" />
                </Link>
              </Button>
            }
          >
            <p className="text-2xl font-bold">Good</p>
            <p className="text-sm text-muted-foreground">1 active issue</p>
            <p className="mt-1 text-xs font-medium text-warning">Monitor closely</p>
          </MetricCard>
        </div>

        {/* Hero recommendation */}
        <RecommendationCard recommendation={recommendation} />

        <div className="grid gap-4 lg:grid-cols-3">
          {/* Crop health */}
          <section className="surface-card p-5">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {t("dash.glance")}
            </h3>
            <div className="mt-3 flex items-center gap-4">
              <div className="flex size-16 items-center justify-center rounded-xl bg-accent text-3xl">
                {diagnosis.image_url ? (
                  <img
                    src={diagnosis.image_url}
                    alt={`${diagnosis.crop} leaf`}
                    className="size-16 rounded-xl object-cover"
                  />
                ) : (
                  <span aria-hidden>{CROP_EMOJI[diagnosis.crop] ?? "🌱"}</span>
                )}
              </div>
              <div>
                <p className="text-lg font-bold">{diagnosis.crop}</p>
                <p className="text-sm text-muted-foreground">{diagnosis.disease}</p>
                <p className="text-xs font-medium text-primary">
                  {diagnosis.confidence}% AI Confidence
                </p>
              </div>
            </div>
            <div className="mt-4">
              <SeverityScale level={diagnosis.severity} />
            </div>
            <Button asChild variant="outline" className="mt-4 w-full">
              <Link to="/crop-diagnosis/result">{t("common.viewDiagnosis")}</Link>
            </Button>
          </section>

          {/* Weather snapshot */}
          <section className="surface-card p-5">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Weather Snapshot
            </h3>
            <dl className="mt-3 grid grid-cols-2 gap-3">
              {[
                { icon: Thermometer, label: "Temperature", value: `${weather.temperature}°C` },
                { icon: Droplets, label: "Humidity", value: `${weather.humidity}%` },
                { icon: CloudRain, label: "Rain", value: `${weather.rain_probability}%` },
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
            <div className="mt-4">
              <SeverityBadge level={weather.risk} label={`${weather.risk.toUpperCase()} WEATHER RISK`} />
            </div>
            <Button asChild variant="outline" className="mt-4 w-full">
              <Link to="/market-weather">{t("common.viewWeather")}</Link>
            </Button>
          </section>

          {/* Market snapshot */}
          <section className="surface-card p-5">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Market Snapshot
            </h3>
            <MiniPriceChart data={market.series} />
            <div className="mt-2 flex items-end justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Current</p>
                <p className="text-xl font-bold">{formatCurrency(market.current_price)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Expected</p>
                <p className="text-xl font-bold text-success">
                  ↑ {formatCurrency(market.predicted_price)}
                </p>
              </div>
            </div>
            <Button asChild variant="outline" className="mt-4 w-full">
              <Link to="/market-weather">{t("common.viewMarket")}</Link>
            </Button>
          </section>
        </div>

        {/* Quick actions */}
        <section>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {t("dash.quickActions")}
          </h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { to: "/crop-diagnosis", icon: Camera, label: "📸 Diagnose Crop" },
              { to: "/market-weather", icon: IndianRupee, label: "💰 Check Market" },
              { to: "/market-weather", icon: CloudRain, label: "🌦️ Check Weather" },
              { to: "/ai-assistant", icon: Bot, label: "🤖 Ask AI" },
            ].map((a) => (
              <Button
                key={a.label}
                asChild
                variant="outline"
                size="lg"
                className="h-auto justify-start gap-3 py-4"
              >
                <Link to={a.to}>
                  <Sprout className="size-4 text-primary" aria-hidden />
                  <span className="font-semibold">{a.label}</span>
                </Link>
              </Button>
            ))}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
