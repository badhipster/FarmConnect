import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useT } from "@/lib/i18n";
import { cropOptions } from "@/lib/mock-data";
import { cn } from "@/lib/utils";


export interface ProfileData {
  name: string;
  village: string;
  phone: string;
  crops: string[];
}

export function OnboardingProfileScreen({
  role,
  initialName,
  initialPhone,
  onBack,
  onNext,
}: {
  role: "farmer" | "fpo_coordinator";
  initialName?: string;
  initialPhone?: string;
  onBack: () => void;
  onNext: (p: ProfileData) => void;
}) {
  const { t, tCrop } = useT();
  const [name, setName] = useState(initialName || "");
  const [village, setVillage] = useState("");
  const [phone, setPhone] = useState(initialPhone || "");
  const [crops, setCrops] = useState<string[]>([]);

  const valid = name.trim() && village.trim() && phone.trim().length >= 10;

  const toggleCrop = (c: string) =>
    setCrops((p) => (p.includes(c) ? p.filter((x) => x !== c) : [...p, c]));

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/50 pb-10">
      <AppHeader title={t("onbTitle")} subtitle="Complete your profile" onBack={onBack} />
      
      <div className="flex-1 space-y-6 px-4 py-8">
        <div className="rounded-[2rem] border border-white/60 bg-white/70 p-6 shadow-sm backdrop-blur-xl">
          <div className="space-y-6">
            <div>
              <Label className="text-[13px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-3 block">{t("fullName")}</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ramesh Kumar"
                className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 text-[15px] font-bold text-slate-900 focus:bg-white transition-all placeholder:text-slate-300"
              />
              {initialName && name === initialName && (
                <p className="mt-2 text-[10px] text-primary font-black uppercase tracking-widest ml-1">✓ Auto-filled</p>
              )}
            </div>

            <div>
              <Label className="text-[13px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-3 block">{t("village")}</Label>
              <Input
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                placeholder="Village, District"
                className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 text-[15px] font-bold text-slate-900 focus:bg-white transition-all placeholder:text-slate-300"
              />
            </div>

            <div>
              <Label className="text-[13px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-3 block">{t("phone")}</Label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, "").slice(0, 10))}
                placeholder="98XXXXXXXX"
                inputMode="numeric"
                className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 text-[15px] font-bold text-slate-900 focus:bg-white transition-all placeholder:text-slate-300"
              />
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/60 bg-white/70 p-6 shadow-sm backdrop-blur-xl">
          <Label className="text-[13px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-1 block">{t("primaryCrops")}</Label>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight ml-1 mb-4">{t("cropsHint")}</p>
          
          <div className="grid grid-cols-2 gap-3">
            {cropOptions.map((c) => {
              const active = crops.includes(c.name);
              return (
                <button
                  key={c.name}
                  onClick={() => toggleCrop(c.name)}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl border p-4 text-left transition-all duration-300 active:scale-95 shadow-sm",
                    active
                      ? "border-primary bg-primary/10 shadow-inner ring-1 ring-primary/20"
                      : "border-slate-100 bg-slate-50/50 hover:bg-slate-50",
                  )}
                >
                  <span className="text-2xl drop-shadow-sm">{c.emoji}</span>
                  <span className={cn(
                    "truncate text-[13px] font-black tracking-tight transition-colors",
                    active ? "text-primary" : "text-slate-600"
                  )}>{tCrop(c.name)}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="px-4 pt-2">
        <Button
          onClick={() => onNext({ name, village, phone, crops })}
          disabled={!valid}
          className="h-16 w-full rounded-2xl text-base font-black uppercase tracking-wider shadow-lg shadow-primary/20 transition-all hover:translate-y-[-2px]"
        >
          {t("continue")}
        </Button>
      </div>
    </div>
  );
}
