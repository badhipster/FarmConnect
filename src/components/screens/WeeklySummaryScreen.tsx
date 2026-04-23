import { IndianRupee, Package, Truck, Wallet } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { Order, Payment } from "@/lib/mock-data";

interface WeeklySummaryScreenProps {
  onBack: () => void;
  orders: Order[];
  payments: Payment[];
  role: "farmer" | "fpo_coordinator";
  profileName: string;
}

export function WeeklySummaryScreen({
  onBack,
  orders,
  payments,
  role,
  profileName,
}: WeeklySummaryScreenProps) {
  const relevantOrders =
    role === "farmer" ? orders.filter((o) => o.farmerName === profileName) : orders;
  const relevantPayments =
    role === "farmer" ? payments.filter((p) => p.farmerName === profileName) : payments;

  const pickupsCompleted = relevantOrders.filter((o) => o.status === "Collected").length;
  const paid = relevantPayments
    .filter((p) => p.status === "Paid")
    .reduce((s, p) => s + p.amount, 0);
  const totalEarnings = relevantOrders.reduce((s, o) => s + o.expectedPayout, 0);
  const pending = Math.max(0, totalEarnings - paid);
  const totalQty = relevantOrders.reduce((s, o) => s + o.acceptedQty, 0);
  const ordersPaid = relevantPayments.filter((p) => p.status === "Paid").length;
  const avgPerPickup = pickupsCompleted > 0 ? Math.round(totalEarnings / pickupsCompleted) : 0;

  const breakdownMap: Record<string, { qty: number; amount: number; unit: string }> = {};
  relevantOrders.forEach((o) => {
    if (!breakdownMap[o.crop]) breakdownMap[o.crop] = { qty: 0, amount: 0, unit: o.unit };
    breakdownMap[o.crop].qty += o.acceptedQty;
    breakdownMap[o.crop].amount += o.expectedPayout;
  });
  const breakdown = Object.entries(breakdownMap)
    .map(([crop, d]) => ({ crop, ...d }))
    .sort((a, b) => b.amount - a.amount);

  const fmtINR = (n: number) => `₹ ${n.toLocaleString("en-IN")}`;

  const isFpo = role === "fpo_coordinator";

  // Farmer variant keeps its existing look — do not restyle.
  if (!isFpo) {
    return (
      <div className="flex flex-col pb-6">
        <AppHeader
          title="Weekly summary"
          subtitle="This week's earnings"
          onBack={onBack}
        />
        <div className="mx-auto w-full max-w-[1120px] space-y-4 px-4 py-4 lg:px-8 lg:py-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-green-600 to-green-800 p-6 text-white shadow-[0_8px_30px_rgb(22,163,74,0.3)]">
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/20 blur-3xl" />
            <div className="absolute -left-5 bottom-0 h-20 w-20 rounded-full bg-white/10 blur-2xl" />
            <div className="relative z-10">
              <p className="text-[11px] font-semibold uppercase tracking-widest opacity-90">Total earnings</p>
              <p className="mt-1 flex items-center text-4xl font-bold tracking-tight">
                <IndianRupee className="mr-0.5 h-7 w-7 opacity-80" />
                {totalEarnings.toLocaleString("en-IN")}
              </p>
              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
                  <p className="text-[10px] font-semibold uppercase tracking-wider opacity-80">Paid</p>
                  <p className="mt-0.5 text-lg font-bold">{fmtINR(paid)}</p>
                </div>
                <div className="rounded-2xl border border-black/5 bg-black/10 p-4 backdrop-blur-sm">
                  <p className="text-[10px] font-semibold uppercase tracking-wider opacity-80">Pending</p>
                  <p className="mt-0.5 text-lg font-bold">{fmtINR(pending)}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FarmerStatCard icon={Package} label="Quantity sold" value={`${totalQty} qtl`} />
            <FarmerStatCard icon={Truck} label="Pickups done" value={String(pickupsCompleted)} />
            <FarmerStatCard icon={Wallet} label="Orders paid" value={String(ordersPaid)} />
            <FarmerStatCard icon={IndianRupee} label="Avg per pickup" value={fmtINR(avgPerPickup)} />
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-6">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
              Breakdown by crop
            </p>
            {breakdown.length === 0 ? (
              <p className="mt-4 text-sm font-medium text-slate-400">No activity recorded yet.</p>
            ) : (
              <div className="mt-5 space-y-4">
                {breakdown.map((b) => {
                  const pct = totalEarnings > 0 ? (b.amount / totalEarnings) * 100 : 0;
                  return (
                    <div key={b.crop}>
                      <div className="mb-1.5 flex items-center justify-between text-sm">
                        <span className="font-semibold text-slate-800">{b.crop}</span>
                        <span className="text-xs text-slate-500">
                          {b.qty} {b.unit} ·{" "}
                          <span className="font-semibold text-primary">{fmtINR(b.amount)}</span>
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-primary transition-all duration-700"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // FPO variant — Agri-Rural Professional tokens, sentence-case headings, no dead UI.
  return (
    <div className="ar-scope flex flex-col pb-20 lg:pb-8">
      <AppHeader
        title="Network summary"
        subtitle="Earnings across all farmers"
        onBack={onBack}
      />

      <div className="mx-auto w-full max-w-[1120px] space-y-5 px-4 py-6 lg:px-8 lg:py-8">
        {/* Hero stat card */}
        <section className="ar-card p-6">
          <p
            className="text-sm font-medium"
            style={{ color: "var(--ar-on-surface-variant)" }}
          >
            Total earnings
          </p>
          <p
            className="mt-1 text-[32px] font-bold tracking-tight"
            style={{ color: "var(--ar-on-surface)" }}
          >
            {fmtINR(totalEarnings)}
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div
              className="rounded-[12px] p-4"
              style={{ background: "var(--ar-success-bg)" }}
            >
              <p className="text-xs font-medium" style={{ color: "var(--ar-on-surface-variant)" }}>
                Paid
              </p>
              <p className="mt-0.5 text-lg font-bold" style={{ color: "var(--ar-primary)" }}>
                {fmtINR(paid)}
              </p>
            </div>
            <div
              className="rounded-[12px] p-4"
              style={{ background: "var(--ar-warning-bg)" }}
            >
              <p className="text-xs font-medium" style={{ color: "var(--ar-on-surface-variant)" }}>
                Pending
              </p>
              <p className="mt-0.5 text-lg font-bold" style={{ color: "var(--ar-secondary)" }}>
                {fmtINR(pending)}
              </p>
            </div>
          </div>
        </section>

        {/* Stat grid — plain stat tiles (no chevrons, no implied drill-down) */}
        <section className="grid grid-cols-2 gap-3">
          <StatTile icon={Package} label="Quantity sold" value={`${totalQty} qtl`} />
          <StatTile icon={Truck} label="Pickups done" value={String(pickupsCompleted)} />
          <StatTile icon={Wallet} label="Orders paid" value={String(ordersPaid)} />
          <StatTile icon={IndianRupee} label="Avg per pickup" value={fmtINR(avgPerPickup)} />
        </section>

        {/* Crop breakdown */}
        <section className="ar-card p-6">
          <h2
            className="text-base font-semibold"
            style={{ color: "var(--ar-on-surface)" }}
          >
            Breakdown by crop
          </h2>
          {breakdown.length === 0 ? (
            <p
              className="mt-4 text-sm"
              style={{ color: "var(--ar-on-surface-variant)" }}
            >
              No activity recorded yet.
            </p>
          ) : (
            <div className="mt-4 space-y-4">
              {breakdown.map((b) => {
                const pct = totalEarnings > 0 ? (b.amount / totalEarnings) * 100 : 0;
                return (
                  <div key={b.crop}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="font-medium" style={{ color: "var(--ar-on-surface)" }}>
                        {b.crop}
                      </span>
                      <span className="text-xs" style={{ color: "var(--ar-on-surface-variant)" }}>
                        {b.qty} {b.unit} ·{" "}
                        <span className="font-semibold" style={{ color: "var(--ar-primary)" }}>
                          {fmtINR(b.amount)}
                        </span>
                      </span>
                    </div>
                    <div
                      className="h-2 overflow-hidden rounded-full"
                      style={{ background: "var(--ar-surface-container)" }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${pct}%`,
                          background: "var(--ar-primary)",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function StatTile({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Package;
  label: string;
  value: string;
}) {
  return (
    <div className="ar-card p-5">
      <div
        className="flex h-10 w-10 items-center justify-center rounded-[10px]"
        style={{ background: "var(--ar-success-bg)", color: "var(--ar-primary)" }}
        aria-hidden="true"
      >
        <Icon className="h-5 w-5" />
      </div>
      <p
        className="mt-3 text-xl font-bold"
        style={{ color: "var(--ar-on-surface)" }}
      >
        {value}
      </p>
      <p
        className="mt-0.5 text-xs font-medium"
        style={{ color: "var(--ar-on-surface-variant)" }}
      >
        {label}
      </p>
    </div>
  );
}

function FarmerStatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Package;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-3 text-xl font-bold text-slate-800">{value}</p>
      <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-widest text-slate-400">{label}</p>
    </div>
  );
}
