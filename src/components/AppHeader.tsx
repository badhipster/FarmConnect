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
      <header className="bg-gradient-to-br from-primary via-primary/95 to-green-600 px-6 pb-12 pt-8 text-primary-foreground shadow-lg relative overflow-hidden">
        {/* Decorative background circle */}
        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-2xl"></div>

        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            {avatarInitial && (
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md text-xl font-bold shadow-inner border border-white/10">
                {avatarInitial}
              </div>
            )}
            <div>
              <p className="text-[11px] font-semibold tracking-wider uppercase opacity-80 mb-0.5">{lang === "hi" ? "नमस्ते 🙏" : "Namaste 🙏"}</p>
              <h1 className="text-2xl font-extrabold leading-tight tracking-tight">{title}</h1>
              {subtitle && <p className="mt-1 text-xs font-medium opacity-90">{subtitle}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang(lang === "en" ? "hi" : "en")}
              className="rounded-xl bg-white/15 px-3 py-2 text-[11px] font-extrabold backdrop-blur-md transition-all active:scale-95 border border-white/10 hover:bg-white/25"
              aria-label="Toggle language"
            >
              {lang === "en" ? "हिं" : "EN"}
            </button>
            {onNotifications && (
              <button
                onClick={onNotifications}
                aria-label="Notifications"
                className="relative rounded-xl bg-white/15 p-2.5 backdrop-blur-md transition-all active:scale-95 border border-white/10 hover:bg-white/25"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-orange-400 border-2 border-primary" />
              </button>
            )}
            {onHelp && (
              <button
                onClick={onHelp}
                aria-label="Help"
                className="rounded-xl bg-white/15 p-2.5 backdrop-blur-md transition-all active:scale-95 border border-white/10 hover:bg-white/25"
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
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-white/20 bg-white/70 px-4 py-3 backdrop-blur-xl shadow-sm transition-all">
      <div className="flex items-center gap-3">
        {onBack && (
          <button 
            onClick={onBack} 
            aria-label="Back" 
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-600 transition-all hover:bg-slate-100 hover:text-slate-900 active:scale-95 border border-slate-200/60 shadow-sm"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}
        <div className="flex flex-col">
          <h1 className="text-lg font-extrabold tracking-tight text-slate-900">{title}</h1>
          {subtitle && <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{subtitle}</p>}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => setLang(lang === "en" ? "hi" : "en")}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-[11px] font-extrabold text-slate-700 transition-all hover:bg-slate-100 active:scale-95 border border-slate-200/60 shadow-sm"
          aria-label="Toggle language"
        >
          {lang === "en" ? "हिं" : "EN"}
        </button>
        {onHelp && (
          <button 
            onClick={onHelp} 
            aria-label="Help" 
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-600 transition-all hover:bg-slate-100 hover:text-slate-900 active:scale-95 border border-slate-200/60 shadow-sm"
          >
            <HelpCircle className="h-5 w-5" />
          </button>
        )}
      </div>
    </header>
  );
}
