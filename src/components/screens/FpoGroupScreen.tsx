import { Users, Truck, Wallet, Plus, ChevronRight } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { StatusPill } from "@/components/StatusPill";
import { Button } from "@/components/ui/button";
import { useT } from "@/lib/i18n";

interface FarmerSupply {
  id: string;
  name: string;
  village: string;
  crop: string;
  emoji: string;
  qty: number;
  unit: string;
  pickupStatus: "Awaiting" | "Scheduled" | "Collected";
  payoutStatus: "Pending" | "Processing" | "Paid";
  amount: number;
}

const groupSupply: FarmerSupply[] = [
  { id: "F1", name: "Ramesh Kumar", village: "Bharwari", crop: "Wheat", emoji: "🌾", qty: 8, unit: "quintal", pickupStatus: "Scheduled", payoutStatus: "Pending", amount: 18400 },
  { id: "F2", name: "Sita Devi", village: "Bharwari", crop: "Mustard", emoji: "🌼", qty: 4, unit: "quintal", pickupStatus: "Collected", payoutStatus: "Paid", amount: 21600 },
  { id: "F3", name: "Mohan Lal", village: "Karchhana", crop: "Tomato", emoji: "🍅", qty: 220, unit: "kg", pickupStatus: "Awaiting", payoutStatus: "Pending", amount: 6600 },
  { id: "F4", name: "Geeta Singh", village: "Bharwari", crop: "Paddy", emoji: "🌾", qty: 6, unit: "quintal", pickupStatus: "Collected", payoutStatus: "Processing", amount: 13800 },
];

export function FpoGroupScreen({ onBack, onAddSupply }: { onBack: () => void; onAddSupply: () => void }) {
  const { t, tCrop, lang } = useT();
  const totalQty = groupSupply.length;
  const scheduledPickups = groupSupply.filter((g) => g.pickupStatus !== "Collected").length;
  const totalPaid = groupSupply.filter((g) => g.payoutStatus === "Paid").reduce((s, g) => s + g.amount, 0);
  const totalPending = groupSupply.filter((g) => g.payoutStatus !== "Paid").reduce((s, g) => s + g.amount, 0);

  return (
    <div className="flex flex-col pb-24">
      <AppHeader title={t("fpoGroup")} subtitle={`${totalQty} ${t("farmers")}`} onBack={onBack} />

      {/* Group totals */}
      <div className="grid grid-cols-3 gap-2 px-4 py-4">
        <Tile icon={Users} value={`${totalQty}`} label={t("groupSupply")} />
        <Tile icon={Truck} value={`${scheduledPickups}`} label={t("groupPickup")} />
        <Tile icon={Wallet} value={`₹${(totalPending / 1000).toFixed(1)}k`} label={t("pending")} />
      </div>

      {/* Paid summary */}
      <div className="mx-4 rounded-2xl border border-status-paid/20 bg-status-paid-bg p-4">
        <div className="text-xs font-bold uppercase text-status-paid">{t("groupPayout")} · {t("paid")}</div>
        <div className="mt-1 text-2xl font-bold text-foreground">₹{totalPaid.toLocaleString("en-IN")}</div>
      </div>

      {/* Farmer-wise list */}
      <div className="px-4 py-5">
        <h2 className="mb-3 px-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">
          {t("groupSupply")}
        </h2>
        <div className="space-y-3">
          {groupSupply.map((f) => (
            <div key={f.id} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-base font-bold text-primary">
                  {f.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="truncate text-sm font-bold text-foreground">{f.name}</div>
                      <div className="text-[11px] text-muted-foreground">{f.village}</div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-sm">
                    <span className="text-xl">{f.emoji}</span>
                    <span className="font-semibold text-foreground">{tCrop(f.crop)}</span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-foreground">{f.qty} {f.unit}</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between gap-2 border-t border-border pt-3">
                <div className="flex items-center gap-1.5">
                  <StatusPill status={f.pickupStatus} />
                  <StatusPill status={f.payoutStatus} />
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-muted-foreground">{lang === "hi" ? "राशि" : "Amount"}</div>
                  <div className="text-sm font-bold text-foreground">₹{f.amount.toLocaleString("en-IN")}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-16 left-1/2 z-20 w-full max-w-md -translate-x-1/2 px-4 pb-3">
        <Button onClick={onAddSupply} className="h-14 w-full rounded-2xl text-base font-semibold shadow-lg">
          <Plus className="h-5 w-5" />
          {t("addFarmerSupply")}
        </Button>
      </div>
    </div>
  );
}

function Tile({ icon: Icon, value, label }: { icon: typeof Users; value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3 shadow-sm">
      <Icon className="h-4 w-4 text-primary" />
      <div className="mt-1 text-lg font-bold leading-tight text-foreground">{value}</div>
      <div className="text-[10px] leading-tight text-muted-foreground">{label}</div>
    </div>
  );
}
