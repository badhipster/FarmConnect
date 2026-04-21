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
    <div className="flex min-h-screen flex-col pb-6">
      <AppHeader title={t("payoutTitle")} subtitle={t("payoutSub")} onBack={onBack} />
      <div className="flex-1 space-y-5 px-4 py-5">
        <div className="grid grid-cols-2 gap-3">
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

        {method === "upi" ? (
          <div>
            <Label className="text-sm font-semibold">{t("upi")}</Label>
            <Input
              value={upi}
              onChange={(e) => setUpi(e.target.value)}
              placeholder="ramesh@upi"
              className="mt-2 h-12 text-base"
            />
            <p className="mt-2 text-xs text-muted-foreground">PhonePe, Google Pay, Paytm — all work.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-semibold">{t("accountHolder")}</Label>
              <Input value={holder} onChange={(e) => setHolder(e.target.value)} className="mt-2 h-12 text-base" />
            </div>
            <div>
              <Label className="text-sm font-semibold">{t("accountNumber")}</Label>
              <Input
                value={acc}
                onChange={(e) => setAcc(e.target.value.replace(/[^0-9]/g, ""))}
                inputMode="numeric"
                className="mt-2 h-12 text-base"
              />
            </div>
            <div>
              <Label className="text-sm font-semibold">{t("ifsc")}</Label>
              <Input
                value={ifsc}
                onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                placeholder="SBIN0001234"
                className="mt-2 h-12 text-base"
              />
            </div>
          </div>
        )}
      </div>
      <div className="px-4">
        <Button
          onClick={() => onNext({ method, upi, accountNumber: acc, ifsc, holder })}
          disabled={!valid}
          className="h-14 w-full rounded-2xl text-base font-semibold"
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
        "flex flex-col items-center gap-2 rounded-2xl border-2 bg-card p-4 transition-colors",
        active ? "border-primary bg-primary/5" : "border-border",
      )}
    >
      <Icon className={cn("h-7 w-7", active ? "text-primary" : "text-muted-foreground")} />
      <span className="text-sm font-bold text-foreground">{label}</span>
    </button>
  );
}
