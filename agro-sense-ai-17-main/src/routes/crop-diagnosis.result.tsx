import { createFileRoute, Link } from "@tanstack/react-router";
import { Bot, CalendarClock, Save, TrendingDown } from "lucide-react";
import { toast } from "sonner";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { SeverityBadge, SeverityScale } from "@/components/common/severity";
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
          "Detected disease, AI confidence, severity scale, treatment steps and estimated yield loss for your crop.",
      },
      { property: "og:title", content: "Diagnosis Result — AI Farm Companion" },
      {
        property: "og:description",
        content: "AI crop diagnosis with severity, treatment steps and yield impact.",
      },
    ],
  }),
  component: DiagnosisResult,
});

function DiagnosisResult() {
  const { t } = useI18n();
  const { diagnosis, recommendation, saveDiagnosis } = useFarm();

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
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Crop</p>
                <p className="text-2xl font-bold">{diagnosis.crop}</p>
                <p className="text-sm text-muted-foreground">
                  Possible Disease: <span className="font-semibold text-foreground">{diagnosis.disease}</span>
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">AI Confidence</p>
              <p className="text-3xl font-bold text-primary">{diagnosis.confidence}%</p>
              <SeverityBadge level={diagnosis.severity} className="mt-1" />
            </div>
          </div>

          <div className="mt-6">
            <SeverityScale level={diagnosis.severity} />
            <p className="mt-3 text-sm text-muted-foreground">
              {diagnosis.severity} severity detected. Action and regular monitoring are recommended.
            </p>
          </div>
        </section>

        <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
          <div className="space-y-5">
            <section className="surface-card p-5">
              <h2 className="font-semibold">What does this mean?</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {diagnosis.description}
              </p>

              <h3 className="mt-5 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Symptoms
              </h3>
              <ul className="mt-2 space-y-1.5 text-sm">
                {diagnosis.symptoms.map((s) => (
                  <li key={s} className="flex gap-2">
                    <span aria-hidden className="text-warning">
                      •
                    </span>
                    {s}
                  </li>
                ))}
              </ul>
            </section>

            <section className="surface-card p-5">
              <h2 className="font-semibold">What should I do?</h2>
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
            <section className="surface-card border-warning/40 bg-warning/10 p-5">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <TrendingDown className="size-4 text-warning" aria-hidden />
                Estimated Potential Yield Loss
              </div>
              <p className="mt-2 text-4xl font-bold">{diagnosis.yield_loss}%</p>
              <p className="mt-2 text-sm">
                Potential Revenue Impact:{" "}
                <span className="font-semibold">{formatRange(diagnosis.revenue_impact)}</span>
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Estimate based on available crop and disease information.
              </p>
            </section>

            <section className="surface-card p-5">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <CalendarClock className="size-4 text-primary" aria-hidden /> Diagnosis details
              </div>
              <dl className="mt-3 space-y-2 text-sm">
                {[
                  ["Analyzed", formatDate(diagnosis.created_at)],
                  ["Crop", diagnosis.crop],
                  ["Confidence", `${diagnosis.confidence}%`],
                  ["Severity", diagnosis.severity],
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
