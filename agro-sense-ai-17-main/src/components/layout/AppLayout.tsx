import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  Home,
  Camera,
  LineChart,
  Bot,
  Users,
  ClipboardList,
  Settings,
  Leaf,
  Menu,
  MoreHorizontal,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { LANGUAGES, useI18n } from "@/lib/i18n";
import { useFarm } from "@/lib/farm-store";
import { mockNotifications } from "@/data/mock";
import { DEMO_MODE } from "@/services/api";
import type { LanguageCode } from "@/types";

const NAV = [
  { to: "/dashboard", key: "nav.dashboard", icon: Home, emoji: "🏠" },
  { to: "/crop-diagnosis", key: "nav.diagnosis", icon: Camera, emoji: "📸" },
  { to: "/market-weather", key: "nav.market", icon: LineChart, emoji: "📊" },
  { to: "/ai-assistant", key: "nav.assistant", icon: Bot, emoji: "🤖" },
  { to: "/community", key: "nav.community", icon: Users, emoji: "👨‍🌾" },
  { to: "/history", key: "nav.history", icon: ClipboardList, emoji: "📋" },
] as const;

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const { t } = useI18n();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="flex flex-1 flex-col gap-1 px-3" aria-label="Main">
      {NAV.map((item) => {
        const active = pathname === item.to || pathname.startsWith(item.to + "/");
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
            )}
          >
            <item.icon className="size-4.5 shrink-0" aria-hidden />
            <span>{t(item.key)}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarInner({ onNavigate }: { onNavigate?: () => void }) {
  const { t } = useI18n();
  const { user } = useFarm();
  return (
    <div className="flex h-full flex-col gap-4 py-5">
      <Link to="/dashboard" onClick={onNavigate} className="flex items-center gap-2.5 px-5">
        <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Leaf className="size-5" aria-hidden />
        </span>
        <span>
          <span className="block text-sm font-bold leading-tight">{t("app.name")}</span>
          <span className="block text-[11px] text-muted-foreground">
            {DEMO_MODE ? t("common.demoMode") : "Connected"}
          </span>
        </span>
      </Link>

      <NavList onNavigate={onNavigate} />

      <div className="space-y-2 px-3">
        <Link
          to="/settings"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent/60 hover:text-foreground"
        >
          <Settings className="size-4.5" aria-hidden />
          {t("nav.settings")}
        </Link>
        <div className="flex items-center gap-3 rounded-xl border border-sidebar-border bg-accent/50 px-3 py-2.5">
          <Avatar className="size-8">
            <AvatarFallback className="bg-primary text-xs text-primary-foreground">RK</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">{user.location}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function LanguageSelect() {
  const { lang, setLang } = useI18n();
  const current = LANGUAGES.find((l) => l.code === lang)!;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          🌐 <span className="hidden sm:inline">{current.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LANGUAGES.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onSelect={() => setLang(l.code as LanguageCode)}
            className={cn(lang === l.code && "font-semibold text-primary")}
          >
            {l.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function NotificationDropdown() {
  const { t } = useI18n();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" aria-label={t("common.notifications")} className="relative">
          <Bell className="size-4" />
          <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
            {mockNotifications.length}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>{t("common.notifications")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {mockNotifications.map((n) => (
          <DropdownMenuItem key={n.id} className="flex-col items-start gap-0.5 py-2.5">
            <span className="text-sm font-semibold">
              {n.icon} {n.title}
            </span>
            <span className="text-xs text-muted-foreground">{n.body}</span>
            <span className="text-[11px] text-muted-foreground/70">{n.time}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MobileBottomNav() {
  const { t } = useI18n();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const items = [
    { to: "/dashboard", label: t("nav.home"), icon: Home },
    { to: "/crop-diagnosis", label: t("nav.diagnose"), icon: Camera },
    { to: "/ai-assistant", label: "AI", icon: Bot },
    { to: "/community", label: t("nav.community"), icon: Users },
  ] as const;
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 flex items-stretch border-t border-border bg-card/95 backdrop-blur md:hidden"
      aria-label="Mobile"
    >
      {items.map((i) => {
        const active = pathname.startsWith(i.to);
        return (
          <Link
            key={i.to}
            to={i.to}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium",
              active ? "text-primary" : "text-muted-foreground",
            )}
          >
            <i.icon className="size-5" aria-hidden />
            {i.label}
          </Link>
        );
      })}
      <DropdownMenu>
        <DropdownMenuTrigger className="flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-muted-foreground">
          <MoreHorizontal className="size-5" aria-hidden />
          {t("nav.more")}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="top">
          <DropdownMenuItem asChild>
            <Link to="/market-weather">{t("nav.market")}</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/history">{t("nav.history")}</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/settings">{t("nav.settings")}</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}

export function AppLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const { t } = useI18n();

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-sidebar-border bg-sidebar md:block">
        <SidebarInner />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/85 px-4 py-3 backdrop-blur md:px-8">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden" aria-label="Open menu">
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <SheetTitle className="sr-only">{t("app.name")}</SheetTitle>
              <SidebarInner onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>

          <div className="min-w-0 flex-1">
            <h1 className="truncate text-base font-bold md:text-lg">{title}</h1>
            {subtitle && (
              <p className="hidden truncate text-xs text-muted-foreground sm:block">{subtitle}</p>
            )}
          </div>

          {DEMO_MODE && (
            <span className="hidden rounded-full border border-border bg-accent px-2.5 py-1 text-[11px] font-semibold text-accent-foreground lg:inline">
              {t("common.demoMode")}
            </span>
          )}
          <LanguageSelect />
          <NotificationDropdown />
          <Avatar className="size-9">
            <AvatarFallback className="bg-primary text-xs text-primary-foreground">RK</AvatarFallback>
          </Avatar>
        </header>

        <main className="flex-1 px-4 pb-24 pt-5 md:px-8 md:pb-10">{children}</main>
      </div>

      <MobileBottomNav />
    </div>
  );
}
