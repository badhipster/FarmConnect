import { ArrowLeft, Bell, HelpCircle } from "lucide-react";
import { useT } from "@/lib/i18n";

export function AppHeader({
  title,
  subtitle,
  onBack,
  onHelp,
  onNotifications,
  variant = "default",
  avatarInitial,
}: {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  onHelp?: () => void;
  onNotifications?: () => void;
  variant?: "default" | "hero";
  avatarInitial?: string;
}) {
  const { lang, setLang } = useT();

  if (variant === "hero") {
    return (
      <header className="bg-gradient-to-br from-primary to-primary-glow px-5 pb-8 pt-7 text-primary-foreground">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {avatarInitial && (
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-lg font-bold">
                {avatarInitial}
              </div>
            )}
            <div>
              <p className="text-xs opacity-90">{lang === "hi" ? "नमस्ते 🙏" : "Namaste 🙏"}</p>
              <h1 className="text-xl font-bold leading-tight">{title}</h1>
              {subtitle && <p className="mt-0.5 text-xs opacity-90">{subtitle}</p>}
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setLang(lang === "en" ? "hi" : "en")}
              className="rounded-full bg-white/15 px-2.5 py-1.5 text-[11px] font-bold transition-colors active:bg-white/25"
              aria-label="Toggle language"
            >
              {lang === "en" ? "हिं" : "EN"}
            </button>
            {onNotifications && (
              <button
                onClick={onNotifications}
                aria-label="Notifications"
                className="relative rounded-full bg-white/15 p-2 transition-colors active:bg-white/25"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent" />
              </button>
            )}
            {onHelp && (
              <button
                onClick={onHelp}
                aria-label="Help"
                className="rounded-full bg-white/15 p-2 transition-colors active:bg-white/25"
              >
                <HelpCircle className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-10 flex items-center gap-2 border-b border-border bg-card px-3 py-3">
      {onBack && (
        <button onClick={onBack} aria-label="Back" className="rounded-full p-2 transition-colors active:bg-muted">
          <ArrowLeft className="h-5 w-5" />
        </button>
      )}
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-lg font-bold text-foreground">{title}</h1>
        {subtitle && <p className="truncate text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      <button
        onClick={() => setLang(lang === "en" ? "hi" : "en")}
        className="rounded-full bg-muted px-2.5 py-1.5 text-[11px] font-bold text-foreground"
        aria-label="Toggle language"
      >
        {lang === "en" ? "हिं" : "EN"}
      </button>
      {onHelp && (
        <button onClick={onHelp} aria-label="Help" className="rounded-full p-2 transition-colors active:bg-muted">
          <HelpCircle className="h-5 w-5 text-muted-foreground" />
        </button>
      )}
    </header>
  );
}
