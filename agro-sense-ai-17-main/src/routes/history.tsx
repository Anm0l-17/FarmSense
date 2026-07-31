import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Camera } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { SeverityBadge } from "@/components/common/severity";
import { CardSkeleton, EmptyState } from "@/components/common/states";
import { getDiagnosisHistory } from "@/services/api";
import { useFarm } from "@/lib/farm-store";
import { useI18n } from "@/lib/i18n";
import { CROP_EMOJI } from "@/data/mock";
import { formatDate } from "@/utils/format";
import type { Diagnosis } from "@/types";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "My Diagnosis History — AI Farm Companion" },
      {
        name: "description",
        content: "Review every past crop diagnosis with disease, severity and AI confidence.",
      },
      { property: "og:title", content: "My Diagnosis History — AI Farm Companion" },
      {
        property: "og:description",
        content: "A record of all your crop diagnoses and their severity.",
      },
    ],
  }),
  component: History,
});

function History() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { history, setDiagnosis } = useFarm();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Diagnosis[]>(history);

  useEffect(() => {
    getDiagnosisHistory()
      .then((data) => setItems(data && data.length > 0 ? data : history))
      .catch(() => setItems(history))
      .finally(() => setLoading(false));
  }, [history]);

  function open(d: Diagnosis) {
    setDiagnosis(d);
    navigate({ to: "/crop-diagnosis/result" });
  }

  return (
    <AppLayout title={t("history.title")} subtitle={t("history.sub")}>
      <div className="mx-auto max-w-3xl space-y-3">
        {loading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : items.length === 0 ? (
          <EmptyState
            title="No diagnoses yet."
            message="Upload your first crop image to get started."
            action={
              <Button onClick={() => navigate({ to: "/crop-diagnosis" })}>
                <Camera className="size-4" /> Diagnose a Crop
              </Button>
            }
          />
        ) : (
          items.map((d) => (
            <button
              key={d.diagnosis_id}
              onClick={() => open(d)}
              className="surface-card flex w-full items-center gap-4 p-4 text-left transition-shadow hover:shadow-lg"
            >
              <span className="flex size-12 items-center justify-center rounded-xl bg-accent text-2xl" aria-hidden>
                {CROP_EMOJI[d.crop] ?? "🌱"}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold">
                  {d.crop} · {d.disease}
                </p>
                <p className="text-xs text-muted-foreground">{formatDate(d.created_at)}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-primary">{d.confidence}%</span>
                <SeverityBadge level={d.severity} />
              </div>
            </button>
          ))
        )}
      </div>
    </AppLayout>
  );
}
