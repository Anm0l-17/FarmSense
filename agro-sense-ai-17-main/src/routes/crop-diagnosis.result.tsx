import { createFileRoute, Link } from "@tanstack/react-router";
import { Bot, CalendarClock, Save, TrendingDown, CheckCircle, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { SeverityBadge } from "@/components/common/severity";
import { RecommendationCard } from "@/components/common/RecommendationCard";
import { useFarm } from "@/lib/farm-store";
import { useI18n } from "@/lib/i18n";
import { CROP_EMOJI } from "@/data/mock";
import { formatDate, formatRange } from "@/utils/format";

export const Route = createFileRoute("/crop-diagnosis/result")({
  head: () => ({
    meta: [
      { title: "Diagnosis Result — AI Farm Companion" },
      {
        name: "description",
        content:
          "Detected disease, AI confidence, treatment steps and estimated yield loss for your crop.",
      },
      { property: "og:title", content: "Diagnosis Result — AI Farm Companion" },
      {
        property: "og:description",
        content: "AI crop diagnosis with treatment steps and yield impact.",
      },
    ],
  }),
  component: DiagnosisResult,
});

function DiagnosisResult() {
  const { t } = useI18n();
  const { diagnosis, recommendation, saveDiagnosis } = useFarm();

  const isHealthy = diagnosis.severity === "Low" || diagnosis.disease.toLowerCase().includes("healthy");

  return (
    <AppLayout title="Diagnosis Result" subtitle="AI analysis of your uploaded crop image.">
      <div className="mx-auto max-w-5xl space-y-5">
        <section className="surface-card p-5 md:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex size-20 items-center justify-center overflow-hidden rounded-2xl bg-accent text-4xl">
                {diagnosis.image_url ? (
                  <img
                    src={diagnosis.image_url}
                    alt={`${diagnosis.crop} leaf analysed by AI`}
                    className="size-20 object-cover"
                  />
                ) : (
                  <span aria-hidden>{CROP_EMOJI[diagnosis.crop] ?? "🌱"}</span>
                )}
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Crop Specimen</p>
                <p className="text-2xl font-bold">{diagnosis.crop}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                  AI Assessment:{" "}
                  <span className={isHealthy ? "font-bold text-success" : "font-semibold text-foreground"}>
                    {diagnosis.disease}
                  </span>
                </p>
              </div>
            </div>

            {/* AI Confidence - Green Positive Meter */}
            <div className="w-full sm:w-48 text-right space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-muted-foreground uppercase tracking-wide">AI Confidence</span>
                <span className="text-success font-bold">{diagnosis.confidence}%</span>
              </div>
              <Progress value={diagnosis.confidence} className="h-2.5 bg-muted [&>div]:bg-success" />
              <div className="pt-1">
                <SeverityBadge level={diagnosis.severity} />
              </div>
            </div>
          </div>

          <div className="mt-4 border-t border-border/60 pt-4">
            <p className="text-sm font-medium text-foreground flex items-center gap-2">
              {isHealthy
                ? "✨ Healthy crop condition detected! Continue regular maintenance and monitoring."
                : `⚠️ ${diagnosis.severity} severity detected. Immediate preventive treatment is recommended.`}
            </p>
          </div>
        </section>

        <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
          <div className="space-y-5">
            <section className={isHealthy ? "surface-card border-success/30 bg-success/5 p-5" : "surface-card p-5"}>
              <h2 className="font-semibold flex items-center gap-2">
                {isHealthy ? <CheckCircle className="size-5 text-success" /> : <Sparkles className="size-5 text-primary" />}
                What does this mean?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {diagnosis.description}
              </p>

              <h3 className="mt-5 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Observed Indicators
              </h3>
              <ul className="mt-2 space-y-1.5 text-sm">
                {diagnosis.symptoms.map((s) => (
                  <li key={s} className="flex gap-2 items-center">
                    <span aria-hidden className={isHealthy ? "text-success" : "text-warning"}>
                      •
                    </span>
                    {s}
                  </li>
                ))}
              </ul>
            </section>

            <section className="surface-card p-5">
              <h2 className="font-semibold">Recommended Farm Actions</h2>
              <ol className="mt-3 space-y-2 text-sm">
                {diagnosis.actions.map((a, i) => (
                  <li key={a} className="flex gap-3">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                      {i + 1}
                    </span>
                    {a}
                  </li>
                ))}
              </ol>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button asChild>
                  <Link to="/ai-assistant">
                    <Bot className="size-4" /> Ask AI About This Diagnosis
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/market-weather">{t("common.viewMarket")}</Link>
                </Button>
              </div>
            </section>
          </div>

          <div className="space-y-5">
            {/* Impact Box - Lenient for Healthy */}
            <section
              className={
                isHealthy
                  ? "surface-card border-success/40 bg-success/10 p-5"
                  : "surface-card border-warning/40 bg-warning/10 p-5"
              }
            >
              <div className="flex items-center gap-2 text-sm font-semibold">
                {isHealthy ? (
                  <CheckCircle className="size-4 text-success" aria-hidden />
                ) : (
                  <TrendingDown className="size-4 text-warning" aria-hidden />
                )}
                {isHealthy ? "Protected Yield Status" : "Estimated Potential Yield Loss"}
              </div>
              <p className={isHealthy ? "mt-2 text-4xl font-bold text-success" : "mt-2 text-4xl font-bold"}>
                {diagnosis.yield_loss}%
              </p>
              <p className="mt-2 text-sm">
                Potential Revenue Impact:{" "}
                <span className="font-semibold">
                  {isHealthy ? "₹0 (Full Yield Retained)" : formatRange(diagnosis.revenue_impact)}
                </span>
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                {isHealthy
                  ? "Your crop is healthy! No financial loss expected from this crop area."
                  : "Estimate based on disease severity and crop area."}
              </p>
            </section>

            <section className="surface-card p-5">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <CalendarClock className="size-4 text-primary" aria-hidden /> Diagnosis details
              </div>
              <dl className="mt-3 space-y-2 text-sm">
                {[
                  ["Analyzed", formatDate(diagnosis.created_at)],
                  ["Crop Specimen", diagnosis.crop],
                  ["AI Confidence", `${diagnosis.confidence}%`],
                  ["Health Status", isHealthy ? "Healthy" : diagnosis.severity],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-3">
                    <dt className="text-muted-foreground">{k}</dt>
                    <dd className="font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
              <Button
                variant="outline"
                className="mt-4 w-full"
                onClick={() => {
                  saveDiagnosis(diagnosis);
                  toast.success("Diagnosis saved to your history");
                }}
              >
                <Save className="size-4" /> Save to History
              </Button>
            </section>
          </div>
        </div>

        <RecommendationCard recommendation={recommendation} />
      </div>
    </AppLayout>
  );
}
