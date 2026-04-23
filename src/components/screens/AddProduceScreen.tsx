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
      <div className="flex min-h-screen flex-col bg-slate-50/50">
        <AppHeader title={t("listingSubmitted")} onBack={onBack} />
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center animate-fade-in">
          <div className="flex h-24 w-24 items-center justify-center rounded-[2.5rem] bg-gradient-to-br from-status-paid-bg to-emerald-100 shadow-sm border border-emerald-200/50 relative">
            <div className="absolute inset-0 bg-emerald-400 opacity-20 blur-2xl rounded-full scale-75 animate-pulse" />
            <CheckCircle2 className="h-12 w-12 text-status-paid relative z-10" />
          </div>
          <h2 className="mt-8 text-2xl font-black tracking-tight text-slate-900">{t("listingActiveTitle")}</h2>
          <p className="mt-3 max-w-xs text-[15px] font-medium text-slate-500 leading-relaxed">{t("listingActiveSub")}</p>
          <div className="mt-10 w-full max-w-sm">
            <Button onClick={onBack} className="h-14 w-full rounded-2xl font-bold text-[15px] shadow-lg shadow-primary/20">
              {t("backToHome")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 pb-10">
      <AppHeader title={t("addProduce")} subtitle={t("addProduceSub")} onBack={onBack} />

      <div className="flex-1 space-y-6 px-4 py-6">
        {/* Crop Selection Container */}
        <div className="rounded-3xl border border-white/60 bg-white/70 p-5 shadow-sm backdrop-blur-xl">
          <Label className="text-[13px] font-black uppercase tracking-widest text-slate-400 ml-1">{t("crop")}</Label>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {cropOptions.map((c) => {
              const active = crop.name === c.name;
              return (
                <button
                  key={c.name}
                  onClick={() => setCrop(c)}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-2xl border p-4 transition-all duration-300 active:scale-95",
                    active 
                      ? "border-primary bg-primary/10 shadow-sm ring-1 ring-primary/20" 
                      : "border-slate-100 bg-slate-50/50 hover:bg-slate-50"
                  )}
                >
                  <div className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300",
                    active ? "bg-white shadow-inner" : "bg-white/50"
                  )}>
                    <span className="text-2xl drop-shadow-sm">{c.emoji}</span>
                  </div>
                  <span className={cn(
                    "truncate text-[11px] font-black uppercase tracking-tight transition-colors",
                    active ? "text-primary" : "text-slate-500"
                  )}>
                    {tCrop(c.name)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quantity & Unit Container */}
        <div className="rounded-3xl border border-white/60 bg-white/70 p-5 shadow-sm backdrop-blur-xl">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <Label htmlFor="qty" className="flex items-center gap-2 text-[13px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-3">
                <Scale className="h-3.5 w-3.5" />
                {t("quantity")}
              </Label>
              <Input
                id="qty"
                type="number"
                inputMode="numeric"
                placeholder="0"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 text-xl font-black text-slate-900 focus:bg-white focus:ring-primary/20 transition-all placeholder:text-slate-300"
              />
            </div>
            <div>
              <Label className="text-[13px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-3">{t("unit")}</Label>
              <div className="relative">
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="h-14 w-full rounded-2xl border border-slate-100 bg-slate-50/50 px-3 text-[15px] font-black text-slate-900 appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                >
                  <option value="quintal">quintal</option>
                  <option value="kg">kg</option>
                  <option value="ton">ton</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <div className="h-1 w-1 rounded-full bg-slate-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Date & Location Container */}
        <div className="rounded-3xl border border-white/60 bg-white/70 p-5 shadow-sm backdrop-blur-xl space-y-5">
          <div>
            <Label htmlFor="ready" className="flex items-center gap-2 text-[13px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-3">
              <Calendar className="h-3.5 w-3.5" />
              {t("readyBy")}
            </Label>
            <Input
              id="ready"
              type="date"
              value={readyDate}
              onChange={(e) => setReadyDate(e.target.value)}
              className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 text-[15px] font-bold text-slate-900 block w-full focus:bg-white transition-all"
            />
          </div>

          <div>
            <Label className="text-[13px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-3">{t("village")}</Label>
            <div className="h-14 flex items-center px-4 rounded-2xl border border-slate-100 bg-slate-100/50 text-[15px] font-bold text-slate-400">
              {farmerVillage}
            </div>
          </div>
        </div>

        {/* Photo Container */}
        <div className="rounded-3xl border border-white/60 bg-white/70 p-5 shadow-sm backdrop-blur-xl">
          <Label className="text-[13px] font-black uppercase tracking-widest text-slate-400 ml-1">
            {t("photo")} <span className="text-[10px] lowercase font-bold opacity-60">({t("optional")})</span>
          </Label>
          <button className="group mt-4 relative flex h-36 w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary/20 bg-gradient-to-br from-primary/5 to-transparent text-primary transition-all active:scale-[0.98] overflow-hidden">
            <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-[0.02] transition-opacity" />
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-primary/5 transition-transform group-hover:scale-110">
              <Camera className="h-6 w-6" />
            </div>
            <span className="text-sm font-black tracking-tight">{t("addPhoto")}</span>
          </button>
        </div>

        {/* Note Container */}
        <div className="rounded-3xl border border-white/60 bg-white/70 p-5 shadow-sm backdrop-blur-xl">
          <Label htmlFor="note" className="text-[13px] font-black uppercase tracking-widest text-slate-400 ml-1">
            {t("note")} <span className="text-[10px] lowercase font-bold opacity-60">({t("optional")})</span>
          </Label>
          <Textarea
            id="note"
            placeholder={t("noteHint")}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="mt-4 rounded-2xl border-slate-100 bg-slate-50/50 min-h-[100px] text-[15px] font-medium text-slate-900 focus:bg-white transition-all placeholder:text-slate-300"
          />
        </div>

        <div className="pt-2">
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="h-16 w-full rounded-2xl text-base font-black uppercase tracking-wider shadow-lg shadow-primary/20 transition-all hover:translate-y-[-2px]"
          >
            {t("submitListing")}
          </Button>
        </div>
      </div>
    </div>
  );
}

