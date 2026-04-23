import { useState } from "react";
import { Smartphone, Landmark } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export interface PayoutData {
  method: "upi" | "bank";
  upi?: string;
  accountNumber?: string;
  ifsc?: string;
  holder?: string;
}

export function PayoutSetupScreen({ onBack, onNext }: { onBack: () => void; onNext: (d: PayoutData) => void }) {
  const { t } = useT();
  const [method, setMethod] = useState<"upi" | "bank">("upi");
  const [upi, setUpi] = useState("");
  const [acc, setAcc] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [holder, setHolder] = useState("");

  const valid = method === "upi" ? upi.includes("@") : acc.length >= 6 && ifsc.length >= 6 && holder.trim();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/50 pb-10">
      <AppHeader title={t("payoutTitle")} subtitle={t("payoutSub")} onBack={onBack} />
      
      <div className="flex-1 space-y-6 px-4 py-8">
        <div className="grid grid-cols-2 gap-4">
          <MethodTile
            icon={Smartphone}
            label={t("upi")}
            active={method === "upi"}
            onClick={() => setMethod("upi")}
          />
          <MethodTile
            icon={Landmark}
            label={t("bank")}
            active={method === "bank"}
            onClick={() => setMethod("bank")}
          />
        </div>

        <div className="rounded-[2rem] border border-white/60 bg-white/70 p-6 shadow-sm backdrop-blur-xl">
          {method === "upi" ? (
            <div className="space-y-6">
              <div>
                <Label className="text-[13px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-3 block">{t("upi")} ID</Label>
                <Input
                  value={upi}
                  onChange={(e) => setUpi(e.target.value)}
                  placeholder="ramesh@upi"
                  className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 text-[15px] font-bold text-slate-900 focus:bg-white transition-all placeholder:text-slate-300"
                />
                <p className="mt-3 text-[11px] text-slate-400 font-bold uppercase tracking-wider ml-1">PhonePe, GPay, Paytm all work.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <Label className="text-[13px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-3 block">{t("accountHolder")}</Label>
                <Input 
                  value={holder} 
                  onChange={(e) => setHolder(e.target.value)} 
                  placeholder="As per bank passbook"
                  className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 text-[15px] font-bold text-slate-900 focus:bg-white transition-all placeholder:text-slate-300"
                />
              </div>
              <div>
                <Label className="text-[13px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-3 block">{t("accountNumber")}</Label>
                <Input
                  value={acc}
                  onChange={(e) => setAcc(e.target.value.replace(/[^0-9]/g, ""))}
                  placeholder="0000 0000 0000"
                  inputMode="numeric"
                  className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 text-[15px] font-bold text-slate-900 focus:bg-white transition-all placeholder:text-slate-300"
                />
              </div>
              <div>
                <Label className="text-[13px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-3 block">{t("ifsc")}</Label>
                <Input
                  value={ifsc}
                  onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                  placeholder="SBIN0001234"
                  className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 text-[15px] font-bold text-slate-900 focus:bg-white transition-all placeholder:text-slate-300"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="px-4 pt-2">
        <Button
          onClick={() => onNext({ method, upi, accountNumber: acc, ifsc, holder })}
          disabled={!valid}
          className="h-16 w-full rounded-2xl text-base font-black uppercase tracking-wider shadow-lg shadow-primary/20 transition-all hover:translate-y-[-2px]"
        >
          {t("continue")}
        </Button>
      </div>
    </div>
  );
}

function MethodTile({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: typeof Smartphone;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-3 rounded-2xl border p-5 transition-all duration-300 active:scale-95 shadow-sm",
        active 
          ? "border-primary bg-primary/10 shadow-inner ring-1 ring-primary/20" 
          : "border-white/60 bg-white/70 backdrop-blur-xl"
      )}
    >
      <div className={cn(
        "flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300",
        active ? "bg-white shadow-inner" : "bg-slate-50"
      )}>
        <Icon className={cn("h-6 w-6 transition-transform", active ? "text-primary scale-110" : "text-slate-400")} />
      </div>
      <span className={cn(
        "text-[11px] font-black uppercase tracking-widest transition-colors",
        active ? "text-primary" : "text-slate-500"
      )}>{label}</span>
    </button>
  );
}
