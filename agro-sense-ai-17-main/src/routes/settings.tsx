import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LANGUAGES, useI18n } from "@/lib/i18n";
import { useFarm } from "@/lib/farm-store";
import { LOCATIONS } from "@/data/mock";
import { DEMO_MODE } from "@/services/api";
import { formatDate } from "@/utils/format";
import type { LanguageCode } from "@/types";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings & Profile — AI Farm Companion" },
      {
        name: "description",
        content: "Set your preferred language, location, units and notification preferences.",
      },
      { property: "og:title", content: "Settings & Profile — AI Farm Companion" },
      {
        property: "og:description",
        content: "Manage language, location and notification preferences.",
      },
    ],
  }),
  component: Settings,
});

function Settings() {
  const { t, lang, setLang } = useI18n();
  const { user, location, setLocation, history } = useFarm();

  return (
    <AppLayout title={t("settings.title")} subtitle={t("settings.sub")}>
      <div className="mx-auto max-w-2xl space-y-5">
        <section className="surface-card flex items-center gap-4 p-5">
          <Avatar className="size-14">
            <AvatarFallback className="bg-primary text-primary-foreground">RK</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-lg font-bold">{user.name}</p>
            <p className="text-sm text-muted-foreground">
              {user.location} · {LANGUAGES.find((l) => l.code === lang)?.label}
            </p>
            {DEMO_MODE && (
              <span className="mt-1 inline-block rounded-full bg-accent px-2 py-0.5 text-[11px] font-medium text-accent-foreground">
                {t("common.demoMode")}
              </span>
            )}
          </div>
        </section>

        <section className="surface-card space-y-5 p-5">
          <div className="space-y-1.5">
            <Label htmlFor="lang">Language</Label>
            <Select value={lang} onValueChange={(v) => setLang(v as LanguageCode)}>
              <SelectTrigger id="lang">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((l) => (
                  <SelectItem key={l.code} value={l.code}>
                    {l.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="loc">Location</Label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger id="loc">
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

          <div className="space-y-1.5">
            <Label htmlFor="units">Units</Label>
            <Select defaultValue="metric">
              <SelectTrigger id="units">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="metric">Metric (°C, kg, mm)</SelectItem>
                <SelectItem value="imperial">Imperial (°F, lb, in)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="notif">Notifications</Label>
            <Switch id="notif" defaultChecked />
          </div>
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="alerts">Weather & market alerts</Label>
            <Switch id="alerts" defaultChecked />
          </div>
        </section>

        <section className="surface-card p-5">
          <h2 className="font-semibold">Recent Activity</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {history.slice(0, 3).map((d) => (
              <li key={d.diagnosis_id} className="flex justify-between gap-3">
                <span>
                  {d.crop} · {d.disease}
                </span>
                <span className="text-muted-foreground">{formatDate(d.created_at)}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </AppLayout>
  );
}
