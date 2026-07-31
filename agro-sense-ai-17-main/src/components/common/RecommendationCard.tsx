import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import { formatCurrency } from "@/utils/format";
import type { Recommendation } from "@/types";

const decisionStyle: Record<string, { chip: string; ring: string; emoji: string }> = {
  HOLD: { chip: "bg-success text-success-foreground", ring: "ring-success/30", emoji: "🟢" },
  SELL_PARTIALLY: {
    chip: "bg-warning text-warning-foreground",
    ring: "ring-warning/30",
    emoji: "🟠",
  },
  SELL: {
    chip: "bg-destructive text-destructive-foreground",
    ring: "ring-destructive/30",
    emoji: "🔴",
  },
};

export function RecommendationCard({
  recommendation,
  compact = false,
}: {
  recommendation: Recommendation;
  compact?: boolean;
}) {
  const { t } = useI18n();
  const s = decisionStyle[recommendation.decision];

  const stats = [
    { label: "Current Price", value: formatCurrency(recommendation.current_price) },
    { label: "Expected Price", value: formatCurrency(recommendation.predicted_price) },
    { label: "Disease Severity", value: recommendation.disease_severity },
    { label: "Weather Risk", value: recommendation.weather_risk },
    { label: "Estimated Yield Loss", value: `${recommendation.yield_loss}%` },
  ];

  return (
    <section
      className={cn(
        "surface-card overflow-hidden",
        "bg-gradient-to-br from-primary to-[oklch(0.36_0.09_155)] text-primary-foreground",
      )}
      aria-label="AI Farm Recommendation"
    >
      <div className="flex items-center gap-2 border-b border-white/15 px-5 py-3.5">
        <Sparkles className="size-4" aria-hidden />
        <h2 className="text-sm font-semibold tracking-wide">🤖 {t("dash.recommendation")}</h2>
      </div>

      <div className="grid gap-6 p-5 md:grid-cols-[minmax(0,260px)_1fr] md:p-6">
        <div
          className={cn(
            "flex flex-col items-center justify-center gap-2 rounded-2xl bg-white/10 p-6 text-center ring-4",
            s.ring,
          )}
        >
          <span className={cn("rounded-full px-4 py-1.5 text-lg font-bold", s.chip)}>
            {s.emoji} {t(`decision.${recommendation.decision}`)}
          </span>
          {recommendation.sell_percentage && (
            <p className="text-sm opacity-90">
              Sell {recommendation.sell_percentage}% · Hold {100 - recommendation.sell_percentage}%
            </p>
          )}
          <p className="text-xs uppercase tracking-widest opacity-75">AI Recommendation</p>
        </div>

        <div className="space-y-4">
          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {stats.map((st) => (
              <div key={st.label} className="rounded-xl bg-white/10 px-3 py-2.5">
                <dt className="text-[11px] uppercase tracking-wide opacity-75">{st.label}</dt>
                <dd className="mt-0.5 text-base font-semibold">{st.value}</dd>
              </div>
            ))}
          </dl>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest opacity-75">{t("common.why")}</p>
            <p className="mt-1 text-sm leading-relaxed opacity-95">{recommendation.reason}</p>
          </div>

          {!compact && (
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="secondary">
                <Link to="/market-weather">
                  View Detailed Recommendation <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-white/40 bg-transparent text-primary-foreground hover:bg-white/15 hover:text-primary-foreground"
              >
                <Link to="/ai-assistant">{t("common.askAi")}</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
