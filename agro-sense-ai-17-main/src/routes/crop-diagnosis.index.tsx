import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Camera, CheckCircle2, Circle, Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ErrorState } from "@/components/common/states";
import { diagnoseCrop } from "@/services/api";
import { useFarm } from "@/lib/farm-store";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/crop-diagnosis/")({
  head: () => ({
    meta: [
      { title: "Crop Disease Diagnosis — AI Farm Companion" },
      {
        name: "description",
        content:
          "Upload a crop photo to detect possible diseases, severity and estimated yield loss with AI.",
      },
      { property: "og:title", content: "Crop Disease Diagnosis — AI Farm Companion" },
      {
        property: "og:description",
        content: "AI crop disease detection with severity and yield-loss estimates for farmers.",
      },
    ],
  }),
  component: CropDiagnosisPage,
});

const STAGES = [
  "Image uploaded",
  "Identifying crop",
  "Detecting possible disease",
  "Estimating severity",
  "Preparing recommendations",
];

function CropDiagnosisPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { saveDiagnosis } = useFarm();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [dragging, setDragging] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [stage, setStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  function pick(f: File | undefined | null) {
    if (!f) return;
    if (!/image\/(jpeg|jpg|png)/.test(f.type)) {
      toast.error("Please upload a JPG, JPEG or PNG image.");
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      toast.error("Image is larger than 10 MB.");
      return;
    }
    setError(null);
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  function reset() {
    setFile(null);
    setPreview("");
    setProgress(0);
    setStage(0);
  }

  async function analyze() {
    setAnalyzing(true);
    setError(null);
    setStage(1);
    setProgress(12);
    const timer = setInterval(() => {
      setProgress((p) => Math.min(p + 6, 95));
      setStage((s) => Math.min(s + (Math.random() > 0.55 ? 1 : 0), STAGES.length - 1));
    }, 350);
    try {
      const result = await diagnoseCrop(file);
      clearInterval(timer);
      setProgress(100);
      setStage(STAGES.length);
      saveDiagnosis({ ...result, image_url: preview || result.image_url });
      toast.success("Analysis complete");
      setTimeout(() => navigate({ to: "/crop-diagnosis/result" }), 400);
    } catch {
      clearInterval(timer);
      setAnalyzing(false);
      setError("We couldn't analyze this image. Please try uploading a clearer photo.");
    }
  }

  return (
    <AppLayout title={t("diag.title")} subtitle={t("diag.sub")}>
      <div className="mx-auto grid max-w-5xl gap-5 lg:grid-cols-[1.4fr_1fr]">
        <section className="space-y-4">
          {!preview && (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                pick(e.dataTransfer.files?.[0]);
              }}
              className={cn(
                "flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-12 text-center transition-colors",
                dragging ? "border-primary bg-accent" : "border-border bg-card",
              )}
            >
              <span className="text-4xl" aria-hidden>
                📸
              </span>
              <p className="text-lg font-semibold">{t("diag.upload")}</p>
              <p className="text-sm text-muted-foreground">{t("diag.dragDrop")}</p>
              <Button onClick={() => inputRef.current?.click()}>
                <Upload className="size-4" /> {t("diag.browse")}
              </Button>
              <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                className="sr-only"
                aria-label="Crop image"
                onChange={(e) => pick(e.target.files?.[0])}
              />
              <p className="text-xs text-muted-foreground">Supported: JPG, JPEG, PNG · Max 10 MB</p>
            </div>
          )}

          {preview && (
            <div className="surface-card overflow-hidden">
              <img src={preview} alt="Uploaded crop preview" className="max-h-96 w-full object-cover" />
              <div className="flex flex-wrap gap-2 p-4">
                <Button variant="outline" onClick={reset} disabled={analyzing}>
                  <X className="size-4" /> {t("diag.remove")}
                </Button>
                <Button onClick={analyze} disabled={analyzing}>
                  {analyzing ? (
                    <>
                      <Loader2 className="size-4 animate-spin" /> {t("diag.analyzing")}
                    </>
                  ) : (
                    <>
                      <Camera className="size-4" /> {t("diag.analyze")}
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {analyzing && (
            <div className="surface-card space-y-4 p-5">
              <div>
                <p className="font-semibold">{t("diag.analyzing")}</p>
                <Progress value={progress} className="mt-2" />
              </div>
              <ul className="space-y-2">
                {STAGES.map((s, i) => (
                  <li key={s} className="flex items-center gap-2 text-sm">
                    {i < stage ? (
                      <CheckCircle2 className="size-4 text-success" aria-hidden />
                    ) : i === stage ? (
                      <Loader2 className="size-4 animate-spin text-primary" aria-hidden />
                    ) : (
                      <Circle className="size-4 text-muted-foreground/50" aria-hidden />
                    )}
                    <span className={i <= stage ? "font-medium" : "text-muted-foreground"}>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {error && <ErrorState message={error} onRetry={analyze} />}
        </section>

        <aside className="surface-card h-fit p-5">
          <h2 className="font-semibold">For better results</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {[
              "Good lighting",
              "Focus on affected leaves",
              "Avoid blurry images",
              "Keep the affected area visible",
              "Avoid excessive shadows",
            ].map((tip) => (
              <li key={tip} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
                {tip}
              </li>
            ))}
          </ul>
          <p className="mt-4 rounded-xl bg-accent p-3 text-xs text-accent-foreground">
            Results are advisory and based on available information. For serious cases, consider
            consulting a local agricultural expert.
          </p>
        </aside>
      </div>
    </AppLayout>
  );
}
