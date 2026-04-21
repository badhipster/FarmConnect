import { ArrowLeft, HelpCircle } from "lucide-react";

export function AppHeader({
  title,
  subtitle,
  onBack,
  onHelp,
  variant = "default",
}: {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  onHelp?: () => void;
  variant?: "default" | "hero";
}) {
  if (variant === "hero") {
    return (
      <header className="bg-gradient-to-br from-primary to-primary-glow px-5 pb-6 pt-7 text-primary-foreground">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm opacity-90">Namaste 🙏</p>
            <h1 className="text-2xl font-bold">{title}</h1>
            {subtitle && <p className="mt-0.5 text-sm opacity-90">{subtitle}</p>}
          </div>
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
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-10 flex items-center gap-2 border-b border-border bg-card px-3 py-3">
      {onBack && (
        <button
          onClick={onBack}
          aria-label="Back"
          className="rounded-full p-2 transition-colors active:bg-muted"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
      )}
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-lg font-bold text-foreground">{title}</h1>
        {subtitle && <p className="truncate text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      {onHelp && (
        <button
          onClick={onHelp}
          aria-label="Help"
          className="rounded-full p-2 transition-colors active:bg-muted"
        >
          <HelpCircle className="h-5 w-5 text-muted-foreground" />
        </button>
      )}
    </header>
  );
}
