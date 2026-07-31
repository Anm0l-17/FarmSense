import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Camera, CheckCircle2, Circle, Loader2, Upload, X, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

const CROP_OPTIONS = [
  { id: "Tomato", emoji: "🍅", en: "Tomato", hi: "टमाटर", kn: "ಟೊಮೆಟೊ" },
  { id: "Potato", emoji: "🥔", en: "Potato", hi: "आलू", kn: "ಆಲೂಗಡ್ಡೆ" },
  { id: "Corn", emoji: "🌽", en: "Corn / Maize", hi: "मक्का", kn: "ಮೆಕ್ಕೆಜೋಳ" },
  { id: "Wheat", emoji: "🌾", en: "Wheat", hi: "गेहूं", kn: "ಗೋಧಿ" },
  { id: "Onion", emoji: "🧅", en: "Onion", hi: "प्याज", kn: "ಈರುಳ್ಳಿ" },
  { id: "Rice", emoji: "🌾", en: "Rice / Paddy", hi: "चावल (धान)", kn: "ಅಕ್ಕಿ" },
];

const STAGES = [
  "Image uploaded",
  "Verifying crop type",
  "Deep AI visual feature analysis",
  "Evaluating plant health status",
  "Generating recommendations",
];

function CropDiagnosisPage() {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const { saveDiagnosis } = useFarm();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [selectedCrop, setSelectedCrop] = useState<string>("Tomato");
  const [customCrop, setCustomCrop] = useState<string>("");
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
    setProgress(15);

    const cropHintToSend = customCrop.trim() || selectedCrop;

    const timer = setInterval(() => {
      setProgress((p) => Math.min(p + 8, 95));
      setStage((s) => Math.min(s + (Math.random() > 0.5 ? 1 : 0), STAGES.length - 1));
    }, 300);

    try {
      const result = await diagnoseCrop(file, cropHintToSend);
      clearInterval(timer);
      setProgress(100);
      setStage(STAGES.length);
      saveDiagnosis({ ...result, image_url: preview || result.image_url });
      toast.success("AI Crop Diagnosis Complete!");
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
        <section className="space-y-5">
          {/* Step 1: Select Crop Type in Multilingual format */}
          <div className="surface-card space-y-3 p-5">
            <label className="block text-sm font-bold flex items-center gap-2">
              <HelpCircle className="size-4 text-primary" /> Which crop are you diagnosing? / किस फसल की जांच कर रहे हैं? / ಇದು ಯಾವ ಬೆಳೆ?
            </label>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {CROP_OPTIONS.map((c) => {
                const active = selectedCrop === c.id && !customCrop;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setSelectedCrop(c.id);
                      setCustomCrop("");
                    }}
                    className={cn(
                      "flex flex-col items-start gap-1 p-3 rounded-xl border text-left transition-all",
                      active
                        ? "border-primary bg-primary/10 ring-2 ring-primary/30"
                        : "border-border bg-card hover:bg-accent"
                    )}
                  >
                    <span className="text-xl">{c.emoji}</span>
                    <span className="font-bold text-sm leading-tight">{c.en}</span>
                    <span className="text-xs text-muted-foreground">{c.hi} · {c.kn}</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-1">
              <span className="text-xs text-muted-foreground block mb-1">
                Or type custom crop name in English, Hindi (हिन्दी), or Kannada (ಕನ್ನಡ):
              </span>
              <Input
                placeholder="e.g. Tomato / टमाटर / ಟೊಮೆಟೊ"
                value={customCrop}
                onChange={(e) => setCustomCrop(e.target.value)}
                className="bg-card"
              />
            </div>
          </div>

          {/* Step 2: Upload Photo */}
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
                "flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-10 text-center transition-colors",
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
              <img src={preview} alt="Uploaded crop preview" className="max-h-80 w-full object-cover" />
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
                      <Camera className="size-4" /> Analyze {customCrop || selectedCrop} Leaf
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

        <aside className="surface-card h-fit p-5 space-y-4">
          <h2 className="font-semibold">Tips for Accurate Diagnosis</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {[
              "Select your exact crop from the list above",
              "Take photo in good natural daylight",
              "Focus clearly on the affected leaf or fruit",
              "Avoid extreme shadows or blurriness",
              "Keep the leaf surface fully visible",
            ].map((tip) => (
              <li key={tip} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
                {tip}
              </li>
            ))}
          </ul>
          <div className="rounded-xl bg-accent p-3.5 text-xs text-accent-foreground space-y-1">
            <p className="font-semibold">✨ Intelligent AI Reasoning:</p>
            <p>
              AgriSense evaluates plant health leniently. Healthy leaves are classified positively as healthy with 0% yield loss!
            </p>
          </div>
        </aside>
      </div>
    </AppLayout>
  );
}
