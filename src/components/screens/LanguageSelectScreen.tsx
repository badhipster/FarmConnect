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
    <div className="flex min-h-screen flex-col bg-slate-50/50 pb-10">
      <div className="px-6 pt-12 pb-8 text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-primary to-primary-glow shadow-lg shadow-primary/20 mb-4 ring-4 ring-white">
          <span className="text-3xl font-black text-white">FC</span>
        </div>
        <div className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">FarmConnect</div>
      </div>

      <div className="flex-1 px-6 pt-4">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight text-center">{t("langTitle")}</h1>
        <p className="mt-2 text-[15px] font-medium text-slate-500 text-center leading-relaxed max-w-[280px] mx-auto">{t("langSub")}</p>

        <div className="mt-12 space-y-4">
          {options.map((o) => {
            const active = lang === o.id;
            return (
              <button
                key={o.id}
                onClick={() => setLang(o.id)}
                className={cn(
                  "group flex w-full items-center justify-between rounded-3xl border p-6 text-left transition-all duration-300 active:scale-[0.98] shadow-sm",
                  active 
                    ? "border-primary bg-primary/10 shadow-inner ring-1 ring-primary/20" 
                    : "border-white/60 bg-white/70 backdrop-blur-xl hover:bg-white"
                )}
              >
                <div>
                  <div className={cn(
                    "text-2xl font-black tracking-tight mb-0.5 transition-colors",
                    active ? "text-primary" : "text-slate-800"
                  )}>{o.label}</div>
                  <div className="text-[11px] font-black uppercase tracking-widest text-slate-400">{o.sub}</div>
                </div>
                {active ? (
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/20 animate-in zoom-in-50 duration-300">
                    <Check className="h-5 w-5" strokeWidth={3} />
                  </div>
                ) : (
                  <div className="h-10 w-10 rounded-2xl border-2 border-slate-100 group-hover:border-slate-200 transition-colors" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-6">
        <Button onClick={onContinue} className="h-16 w-full rounded-2xl text-base font-black uppercase tracking-wider shadow-lg shadow-primary/20 transition-all hover:translate-y-[-2px]">
          {t("continue")}
        </Button>
      </div>
    </div>
  );
}
