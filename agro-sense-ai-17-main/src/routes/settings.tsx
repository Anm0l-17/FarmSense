import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AuthModal } from "@/components/auth/AuthModal";
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
import { formatDate } from "@/utils/format";
import { toast } from "sonner";
import type { LanguageCode } from "@/types";
import { UserCheck, LogIn, UserPlus, Save } from "lucide-react";

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
  const { user, updateUser, location, setLocation, history } = useFarm();

  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  const [name, setName] = useState(user.name);
  const [saving, setSaving] = useState(false);

  function openAuth(mode: "login" | "register") {
    setAuthMode(mode);
    setAuthOpen(true);
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await updateUser({
        name,
        location,
        preferred_language: lang as LanguageCode,
      });
      toast.success("Profile updated successfully!");
    } catch (err: any) {
      toast.error("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  }

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "AP";

  return (
    <AppLayout title={t("settings.title")} subtitle={t("settings.sub")}>
      <div className="mx-auto max-w-2xl space-y-5">
        {/* User Card */}
        <section className="surface-card flex flex-wrap items-center justify-between gap-4 p-5">
          <div className="flex items-center gap-4">
            <Avatar className="size-14">
              <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-lg font-bold flex items-center gap-2">
                {user.name} <UserCheck className="size-4 text-success" />
              </p>
              <p className="text-sm text-muted-foreground">
                {user.location} · {LANGUAGES.find((l) => l.code === lang)?.label}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => openAuth("login")}>
              <LogIn className="size-4 mr-1.5" /> Sign In
            </Button>
            <Button size="sm" onClick={() => openAuth("register")}>
              <UserPlus className="size-4 mr-1.5" /> Register
            </Button>
          </div>
        </section>

        {/* Profile Settings Form */}
        <form onSubmit={handleSaveProfile} className="surface-card space-y-5 p-5">
          <h2 className="font-bold text-base">Edit Farm Profile</h2>
          
          <div className="space-y-1.5">
            <Label htmlFor="user-name">Full Name</Label>
            <Input
              id="user-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
            />
          </div>

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

          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={saving}>
              <Save className="size-4 mr-1.5" /> {saving ? "Saving..." : "Save Profile Changes"}
            </Button>
          </div>

          <hr className="border-border" />

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
        </form>

        <section className="surface-card p-5">
          <h2 className="font-semibold">Recent Diagnosis Activity</h2>
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

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} initialMode={authMode} />
    </AppLayout>
  );
}
