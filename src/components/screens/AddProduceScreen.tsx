import { useState } from "react";
import { Camera, CheckCircle2, Calendar, Scale } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cropOptions, type Listing } from "@/lib/mock-data";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function AddProduceScreen({
  farmerVillage,
  onBack,
  onSubmit,
}: {
  farmerVillage: string;
  onBack: () => void;
  onSubmit: (l: Omit<Listing, "id" | "submittedDate" | "status">) => void;
}) {
  const { t, tCrop } = useT();
  const [crop, setCrop] = useState(cropOptions[0]);
  const [qty, setQty] = useState("");
  const [unit, setUnit] = useState("quintal");
  const [readyDate, setReadyDate] = useState("");
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const canSubmit = qty.trim() && readyDate.trim();

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({
      crop: crop.name,
      emoji: crop.emoji,
      quantity: Number(qty),
      unit,
      readyDate,
      village: farmerVillage,
      note: note || undefined,
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex min-h-screen flex-col">
        <AppHeader title={t("listingSubmitted")} onBack={onBack} />
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center animate-fade-in">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-status-paid-bg">
            <CheckCircle2 className="h-10 w-10 text-status-paid" />
          </div>
          <h2 className="mt-5 text-xl font-bold text-foreground">{t("listingActiveTitle")}</h2>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">{t("listingActiveSub")}</p>
          <Button onClick={onBack} className="mt-6 h-12 w-full rounded-xl">
            {t("backToHome")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col pb-8">
      <AppHeader title={t("addProduce")} subtitle={t("addProduceSub")} onBack={onBack} />

      <div className="space-y-6 px-4 py-5">
        <div>
          <Label className="text-sm font-bold">{t("crop")}</Label>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {cropOptions.map((c) => {
              const active = crop.name === c.name;
              return (
                <button
                  key={c.name}
                  onClick={() => setCrop(c)}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-2xl border-2 p-3 transition-colors",
                    active ? "border-primary bg-primary/5" : "border-border bg-card",
                  )}
                >
                  <span className="text-3xl">{c.emoji}</span>
                  <span className="truncate text-[11px] font-semibold text-foreground">{tCrop(c.name)}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <Label htmlFor="qty" className="flex items-center gap-1.5 text-sm font-bold">
              <Scale className="h-4 w-4 text-muted-foreground" />
              {t("quantity")}
            </Label>
            <Input
              id="qty"
              type="number"
              inputMode="numeric"
              placeholder="8"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              className="mt-2 h-14 text-lg font-semibold"
            />
          </div>
          <div>
            <Label className="text-sm font-bold">{t("unit")}</Label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="mt-2 h-14 w-full rounded-md border border-input bg-background px-3 text-base font-semibold"
            >
              <option value="quintal">quintal</option>
              <option value="kg">kg</option>
              <option value="ton">ton</option>
            </select>
          </div>
        </div>

        <div>
          <Label htmlFor="ready" className="flex items-center gap-1.5 text-sm font-bold">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            {t("readyBy")}
          </Label>
          <Input
            id="ready"
            placeholder="25 Apr"
            value={readyDate}
            onChange={(e) => setReadyDate(e.target.value)}
            className="mt-2 h-14 text-base"
          />
        </div>

        <div>
          <Label className="text-sm font-bold">{t("village")}</Label>
          <Input value={farmerVillage} disabled className="mt-2 h-14 text-base" />
        </div>

        <div>
          <Label className="text-sm font-bold">
            {t("photo")} <span className="text-xs font-normal text-muted-foreground">({t("optional")})</span>
          </Label>
          <button className="mt-2 flex h-36 w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 text-primary active:bg-primary/10">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15">
              <Camera className="h-6 w-6" />
            </div>
            <span className="text-sm font-semibold">{t("addPhoto")}</span>
          </button>
        </div>

        <div>
          <Label htmlFor="note" className="text-sm font-bold">
            {t("note")} <span className="text-xs font-normal text-muted-foreground">({t("optional")})</span>
          </Label>
          <Textarea
            id="note"
            placeholder={t("noteHint")}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="mt-2"
          />
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="h-14 w-full rounded-2xl text-base font-semibold"
        >
          {t("submitListing")}
        </Button>
      </div>
    </div>
  );
}
