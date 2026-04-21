import { Plus, Leaf, Truck, Wallet, TrendingUp, ChevronRight, BellRing, CheckCircle2 } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { useT } from "@/lib/i18n";
import type { Listing, Order, Payment } from "@/lib/mock-data";

interface Props {
  farmerName: string;
  farmerVillage: string;
  listings: Listing[];
  orders: Order[];
  payments: Payment[];
  onAddProduce: () => void;
  onOpenListings: () => void;
  onOpenOrder: () => void;
  onOpenPayments: () => void;
  onOpenSummary: () => void;
  onOpenSupport: () => void;
}

export function HomeScreen({
  farmerName,
  farmerVillage,
  listings,
  orders,
  payments,
  onAddProduce,
  onOpenListings,
  onOpenOrder,
  onOpenPayments,
  onOpenSummary,
  onOpenSupport,
}: Props) {
  const { t, tCrop, lang } = useT();
  const activeCount = listings.filter((l) => ["Active", "Submitted", "Matched"].includes(l.status)).length;
  const upcomingPickup = orders.find((o) => ["Awaiting", "Accepted", "Scheduled"].includes(o.status));
  const pendingPayout = payments.filter((p) => p.status !== "Paid").reduce((s, p) => s + p.amount, 0);
  const paidThisWeek = payments.filter((p) => p.status === "Paid").reduce((s, p) => s + p.amount, 0);

  return (
    <div className="flex flex-col">
      <AppHeader
        title={farmerName}
        subtitle={farmerVillage}
        variant="hero"
        avatarInitial={farmerName.charAt(0)}
        onHelp={onOpenSupport}
        onNotifications={onOpenListings}
      />

      {/* Stat strip */}
      <div className="-mt-5 grid grid-cols-3 gap-2 px-4">
        <StatTile value={activeCount} label={t("activeListings")} />
        <StatTile value={upcomingPickup ? 1 : 0} label={t("upcomingPickup")} />
        <StatTile value={`₹${(pendingPayout / 1000).toFixed(1)}k`} label={t("pendingPayout")} />
      </div>

      <div className="px-4 pt-5">
        <Button onClick={onAddProduce} className="h-14 w-full rounded-2xl text-base font-semibold shadow-md" size="lg">
          <Plus className="h-5 w-5" />
          {t("addProduce")}
        </Button>
        <p className="mt-2 text-center text-xs text-muted-foreground">{t("addProduceHint")}</p>
      </div>

      {/* Action-needed banner */}
      {upcomingPickup && upcomingPickup.status === "Awaiting" && (
        <button
          onClick={onOpenOrder}
          className="mx-4 mt-5 flex items-center gap-3 rounded-2xl border-2 border-status-matched/40 bg-status-matched-bg p-4 text-left animate-fade-in"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white">
            <BellRing className="h-5 w-5 text-status-matched" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-bold text-foreground">{t("newOrder")}</div>
            <div className="truncate text-xs text-muted-foreground">
              {tCrop(upcomingPickup.crop)} · {upcomingPickup.pickupDate}
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </button>
      )}

      {/* Pending payout card */}
      {pendingPayout > 0 && (
        <button
          onClick={onOpenPayments}
          className="mx-4 mt-3 flex items-center gap-3 rounded-2xl border-2 border-status-processing/30 bg-status-processing-bg p-4 text-left"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white">
            <Wallet className="h-5 w-5 text-status-processing" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-bold text-foreground">{t("payoutOnTheWay")}</div>
            <div className="text-xs text-muted-foreground">
              ₹{pendingPayout.toLocaleString("en-IN")} · {t("pending")}
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </button>
      )}

      {paidThisWeek > 0 && (
        <div className="mx-4 mt-3 flex items-center gap-3 rounded-2xl border border-status-paid/20 bg-status-paid-bg p-3">
          <CheckCircle2 className="h-5 w-5 text-status-paid" />
          <div className="text-xs">
            <span className="font-bold text-status-paid">₹{paidThisWeek.toLocaleString("en-IN")} {lang === "hi" ? "मिले" : "received"}</span>
            <span className="text-muted-foreground"> · {t("thisWeek")}</span>
          </div>
        </div>
      )}

      <div className="px-4 py-5">
        <h2 className="mb-3 px-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">{t("quickAccess")}</h2>
        <div className="grid grid-cols-2 gap-3">
          <QuickTile icon={Leaf} label={t("myListings")} value={`${listings.length}`} sub={t("tapToSeeStatus")} onClick={onOpenListings} />
          <QuickTile
            icon={Truck}
            label={t("pickupUpdates")}
            value={upcomingPickup ? tCrop(upcomingPickup.crop) : t("noPickups")}
            sub={upcomingPickup ? upcomingPickup.pickupDate : t("allClear")}
            onClick={onOpenOrder}
          />
          <QuickTile
            icon={Wallet}
            label={t("payments")}
            value={`₹${pendingPayout.toLocaleString("en-IN")}`}
            sub={t("viewProof")}
            onClick={onOpenPayments}
          />
          <QuickTile icon={TrendingUp} label={t("weeklySummary")} value={t("thisWeek")} sub={t("earningsPickups")} onClick={onOpenSummary} />
        </div>
      </div>
    </div>
  );
}

function StatTile({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3 shadow-sm">
      <div className="text-lg font-bold leading-tight text-foreground">{value}</div>
      <div className="mt-0.5 text-[11px] leading-tight text-muted-foreground">{label}</div>
    </div>
  );
}

function QuickTile({
  icon: Icon,
  label,
  value,
  sub,
  onClick,
}: {
  icon: typeof Leaf;
  label: string;
  value: string;
  sub: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-start gap-2 rounded-2xl border border-border bg-card p-4 text-left shadow-sm transition-colors active:bg-muted"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div className="w-full">
        <div className="text-xs font-medium text-muted-foreground">{label}</div>
        <div className="mt-0.5 truncate text-base font-bold text-foreground">{value}</div>
        <div className="mt-0.5 truncate text-[11px] text-muted-foreground">{sub}</div>
      </div>
    </button>
  );
}
