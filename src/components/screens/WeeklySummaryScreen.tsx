import { IndianRupee, Package, Truck, Wallet } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { weeklyStats } from "@/lib/mock-data";

export function WeeklySummaryScreen({ onBack }: { onBack: () => void }) {
  const s = weeklyStats;
  return (
    <div className="flex flex-col pb-6">
      <AppHeader title="Weekly Summary" subtitle="This week's earnings" onBack={onBack} />

      <div className="space-y-4 px-4 py-4">
        <div className="rounded-2xl bg-gradient-to-br from-primary to-primary-glow p-5 text-primary-foreground shadow-md">
          <div className="text-sm opacity-90">Total earnings</div>
          <div className="mt-1 flex items-center text-3xl font-bold">
            <IndianRupee className="h-7 w-7" />
            {s.totalEarnings.toLocaleString("en-IN")}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-white/15 p-3">
              <div className="text-xs opacity-90">Paid</div>
              <div className="font-semibold">₹{s.paid.toLocaleString("en-IN")}</div>
            </div>
            <div className="rounded-xl bg-white/15 p-3">
              <div className="text-xs opacity-90">Pending</div>
              <div className="font-semibold">₹{s.pending.toLocaleString("en-IN")}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Stat icon={Package} label="Quantity sold" value={`${s.totalQty} qtl`} />
          <Stat icon={Truck} label="Pickups done" value={`${s.pickupsCompleted}`} />
          <Stat icon={Wallet} label="Orders paid" value={`${s.breakdown.filter(b => b.amount > 0).length}`} />
          <Stat icon={IndianRupee} label="Avg / pickup" value={`₹${Math.round(s.totalEarnings / s.pickupsCompleted).toLocaleString("en-IN")}`} />
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="text-sm font-semibold">Breakdown by crop</div>
          <div className="mt-3 space-y-3">
            {s.breakdown.map((b) => {
              const pct = (b.amount / s.totalEarnings) * 100;
              return (
                <div key={b.crop}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{b.crop}</span>
                    <span className="text-muted-foreground">
                      {b.qty} qtl · ₹{b.amount.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof Package; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <div className="mt-2 text-xs text-muted-foreground">{label}</div>
      <div className="text-lg font-bold">{value}</div>
    </div>
  );
}
