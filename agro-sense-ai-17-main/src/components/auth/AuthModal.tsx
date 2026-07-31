import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { loginUser, registerUser } from "@/services/api";
import { useFarm } from "@/lib/farm-store";
import { LOCATIONS } from "@/data/mock";
import { LANGUAGES, useI18n } from "@/lib/i18n";
import type { LanguageCode } from "@/types";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialMode?: "login" | "register";
}

export function AuthModal({ open, onOpenChange, initialMode = "login" }: AuthModalProps) {
  const { setUser } = useFarm();
  const { lang, setLang } = useI18n();
  const [mode, setMode] = useState<"login" | "register">(initialMode);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState("Bangalore");
  const [preferredLang, setPreferredLang] = useState<LanguageCode>(lang as LanguageCode);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!phone || !password) {
      toast.error("Please enter phone and password.");
      return;
    }

    setLoading(true);
    try {
      if (mode === "login") {
        const u = await loginUser(phone, password);
        setUser(u);
        setLang(u.preferred_language);
        toast.success(`Welcome back, ${u.name}!`);
        onOpenChange(false);
      } else {
        if (!name) {
          toast.error("Please enter your name.");
          setLoading(false);
          return;
        }
        const u = await registerUser({
          name,
          phone,
          password,
          location,
          preferred_language: preferredLang,
        });
        setUser(u);
        setLang(u.preferred_language);
        toast.success(`Account registered successfully! Welcome, ${u.name}`);
        onOpenChange(false);
      }
    } catch (err: any) {
      toast.error(err?.message || "Authentication failed. Please check credentials.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {mode === "login" ? "Farmer Login" : "Register New Farm Account"}
          </DialogTitle>
          <DialogDescription>
            {mode === "login"
              ? "Access your saved crop diagnoses, market forecasts and AI farm companion history."
              : "Create a free AgriSense account to track crop health, weather risk, and personalized market recommendations."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {mode === "register" && (
            <div className="space-y-1.5">
              <Label htmlFor="auth-name">Full Name</Label>
              <Input
                id="auth-name"
                placeholder="e.g. Raju Patil"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="auth-phone">Phone Number</Label>
            <Input
              id="auth-phone"
              type="tel"
              placeholder="e.g. 9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="auth-pass">Password</Label>
            <Input
              id="auth-pass"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {mode === "register" && (
            <>
              <div className="space-y-1.5">
                <Label htmlFor="auth-location">Farm Location</Label>
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger id="auth-location">
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
                <Label htmlFor="auth-lang">Preferred Language</Label>
                <Select
                  value={preferredLang}
                  onValueChange={(v) => setPreferredLang(v as LanguageCode)}
                >
                  <SelectTrigger id="auth-lang">
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
            </>
          )}

          <div className="pt-2">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading
                ? mode === "login"
                  ? "Logging in..."
                  : "Creating account..."
                : mode === "login"
                ? "Sign In"
                : "Create Account"}
            </Button>
          </div>

          <div className="text-center text-xs text-muted-foreground">
            {mode === "login" ? (
              <p>
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("register")}
                  className="font-semibold text-primary underline"
                >
                  Register now
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="font-semibold text-primary underline"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
