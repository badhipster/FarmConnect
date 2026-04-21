import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useT } from "@/lib/i18n";
import { cropOptions } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import type { Role } from "./RoleSelectScreen";

export interface ProfileData {
  name: string;
  village: string;
  phone: string;
  crops: string[];
}

export function OnboardingProfileScreen({
  role,
  onBack,
  onNext,
}: {
  role: Role;
  onBack: () => void;
  onNext: (p: ProfileData) => void;
}) {
  const { t, tCrop } = useT();
  const [name, setName] = useState("");
  const [village, setVillage] = useState("");
  const [phone, setPhone] = useState("");
  const [crops, setCrops] = useState<string[]>([]);

  const valid = name.trim() && village.trim() && phone.trim().length >= 10;

  const toggleCrop = (c: string) =>
    setCrops((p) => (p.includes(c) ? p.filter((x) => x !== c) : [...p, c]));

  return (
    <div className="flex min-h-screen flex-col pb-6">
      <AppHeader title={role === "fpo" ? t("onbFpoTitle") : t("onbTitle")} onBack={onBack} />
      <div className="flex-1 space-y-5 px-4 py-5">
        <div>
          <Label className="text-sm font-semibold">{role === "fpo" ? t("fpoName") : t("fullName")}</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={role === "fpo" ? "Bharwari Kisan FPO" : "Ramesh Kumar"}
            className="mt-2 h-12 text-base"
          />
        </div>
        <div>
          <Label className="text-sm font-semibold">{t("village")}</Label>
          <Input
            value={village}
            onChange={(e) => setVillage(e.target.value)}
            placeholder="Bharwari, Prayagraj"
            className="mt-2 h-12 text-base"
          />
        </div>
        <div>
          <Label className="text-sm font-semibold">{t("phone")}</Label>
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, "").slice(0, 10))}
            placeholder="98XXXXXXXX"
            inputMode="numeric"
            className="mt-2 h-12 text-base"
          />
        </div>
        <div>
          <Label className="text-sm font-semibold">{t("primaryCrops")}</Label>
          <p className="mt-1 text-xs text-muted-foreground">{t("cropsHint")}</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {cropOptions.map((c) => {
              const active = crops.includes(c.name);
              return (
                <button
                  key={c.name}
                  onClick={() => toggleCrop(c.name)}
                  className={cn(
                    "flex items-center gap-2 rounded-xl border-2 p-3 text-left text-sm font-medium transition-colors",
                    active ? "border-primary bg-primary/5 text-foreground" : "border-border bg-card text-foreground",
                  )}
                >
                  <span className="text-xl">{c.emoji}</span>
                  <span className="truncate">{tCrop(c.name)}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <div className="px-4">
        <Button
          onClick={() => onNext({ name, village, phone, crops })}
          disabled={!valid}
          className="h-14 w-full rounded-2xl text-base font-semibold"
        >
          {t("continue")}
        </Button>
      </div>
    </div>
  );
}
