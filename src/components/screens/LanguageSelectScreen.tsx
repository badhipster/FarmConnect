import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useT, type Lang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function LanguageSelectScreen({ onContinue }: { onContinue: () => void }) {
  const { t, lang, setLang } = useT();

  const options: { id: Lang; label: string; sub: string }[] = [
    { id: "hi", label: "हिन्दी", sub: "Hindi" },
    { id: "en", label: "English", sub: "अंग्रेज़ी" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="px-5 pt-6">
        <div className="text-sm font-semibold text-primary">FarmConnect</div>
      </div>
      <div className="flex-1 px-5 pt-8">
        <h1 className="text-2xl font-bold text-foreground">{t("langTitle")}</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">{t("langSub")}</p>

        <div className="mt-7 space-y-3">
          {options.map((o) => (
            <button
              key={o.id}
              onClick={() => setLang(o.id)}
              className={cn(
                "flex w-full items-center justify-between rounded-2xl border-2 bg-card p-5 text-left transition-all",
                lang === o.id ? "border-primary bg-primary/5" : "border-border",
              )}
            >
              <div>
                <div className="text-xl font-bold text-foreground">{o.label}</div>
                <div className="text-xs text-muted-foreground">{o.sub}</div>
              </div>
              {lang === o.id && (
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="h-4 w-4" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
      <div className="p-5">
        <Button onClick={onContinue} className="h-14 w-full rounded-2xl text-base font-semibold">
          {t("continue")}
        </Button>
      </div>
    </div>
  );
}
