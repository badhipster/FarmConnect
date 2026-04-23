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
    <div className="flex flex-col pb-6">
      <AppHeader
        title={farmerName}
        subtitle={farmerVillage}
        variant="hero"
        avatarInitial={farmerName.charAt(0)}
        onHelp={onOpenSupport}
        onNotifications={onOpenListings}
      />

      {/* Stat strip - Elevated via positioning and glassmorphism */}
      <div className="-mt-8 lg:-mt-10 grid grid-cols-3 gap-3 lg:gap-6 px-4 lg:px-8 relative z-10">
        <StatTile value={activeCount} label={t("activeListings")} />
        <StatTile value={upcomingPickup ? 1 : 0} label={t("upcomingPickup")} />
        <StatTile value={`₹${(pendingPayout / 1000).toFixed(1)}k`} label={t("pendingPayout")} />
      </div>

      <div className="px-4 lg:px-8 pt-6 lg:pt-8 w-full max-w-2xl mx-auto">
        <Button 
          onClick={onAddProduce} 
          className="h-14 w-full rounded-2xl text-base font-bold shadow-[0_8px_30px_rgb(22,163,74,0.25)] transition-all duration-300 hover:shadow-[0_8px_30px_rgb(22,163,74,0.4)] hover:-translate-y-0.5 active:scale-95 bg-gradient-to-r from-primary to-green-500" 
          size="lg"
        >
          <Plus className="h-6 w-6 mr-1" />
          {t("addProduce")}
        </Button>
        <p className="mt-2.5 text-center text-xs font-medium text-slate-500">{t("addProduceHint")}</p>
      </div>

      {/* Action-needed banner */}
      {upcomingPickup && upcomingPickup.status === "Awaiting" && (
        <button
          onClick={onOpenOrder}
          className="group mx-4 lg:mx-8 mt-6 lg:mt-8 flex items-center gap-4 rounded-3xl border border-orange-300/40 bg-gradient-to-r from-orange-50/90 to-amber-50/80 p-5 lg:p-6 text-left shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-orange-400/50 animate-fade-in relative overflow-hidden"
        >
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-orange-400" />
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm border border-orange-200 transition-transform duration-300 group-hover:scale-110 ml-1">
            <BellRing className="h-5 w-5 text-orange-500 animate-[wiggle_1s_ease-in-out_infinite]" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[15px] font-black text-slate-900 tracking-tight">{t("newOrder")}</div>
            <div className="mt-1 truncate text-[11px] font-bold text-orange-600 bg-orange-500/10 inline-flex px-2 py-0.5 rounded-md">
              {tCrop(upcomingPickup.crop)} · {upcomingPickup.pickupDate}
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-slate-300 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-orange-500" />
        </button>
      )}

      {/* Pending payout card */}
      {pendingPayout > 0 && (
        <button
          onClick={onOpenPayments}
          className="group mx-4 lg:mx-8 mt-4 lg:mt-6 flex items-center gap-4 rounded-3xl border border-blue-300/40 bg-gradient-to-r from-blue-50/90 to-indigo-50/80 p-5 lg:p-6 text-left shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-blue-400/50 relative overflow-hidden"
        >
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500" />
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm border border-blue-200 transition-transform duration-300 group-hover:scale-110 ml-1">
            <Wallet className="h-5 w-5 text-blue-600" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[15px] font-black text-slate-900 tracking-tight">{t("payoutOnTheWay")}</div>
            <div className="mt-1 text-[11px] font-bold text-blue-700 bg-blue-500/10 inline-flex px-2 py-0.5 rounded-md">
              ₹{pendingPayout.toLocaleString("en-IN")} · {t("pending")}
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-slate-300 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-blue-500" />
        </button>
      )}

      {paidThisWeek > 0 && (
        <div className="mx-4 lg:mx-8 mt-4 lg:mt-6 flex items-center gap-3 rounded-2xl border border-green-300/40 bg-gradient-to-r from-green-50/90 to-emerald-50/80 p-5 lg:p-6 backdrop-blur-xl shadow-sm hover:-translate-y-1 transition-all duration-300">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm border border-green-200">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          </div>
          <div className="text-[13px] font-semibold flex flex-col">
            <span className="font-black text-green-800 text-[15px]">₹{paidThisWeek.toLocaleString("en-IN")} {lang === "hi" ? "मिले" : "received"}</span>
            <span className="text-green-600 font-bold">{t("thisWeek")}</span>
          </div>
        </div>
      )}

      <div className="px-4 lg:px-8 py-6 lg:py-10 mt-2">
        <h2 className="mb-4 lg:mb-6 px-1 text-[11px] lg:text-sm font-extrabold uppercase tracking-wider text-slate-400">{t("quickAccess")}</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 lg:gap-6">
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
    <div className="flex flex-col items-center justify-center rounded-3xl border border-white/60 bg-white/70 p-4 shadow-sm backdrop-blur-xl transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:bg-white/90 group">
      <div className="text-[22px] font-black leading-tight text-slate-800 transition-colors group-hover:text-primary">{value}</div>
      <div className="mt-1 text-center text-[10px] font-extrabold uppercase tracking-widest text-slate-500">{label}</div>
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
      className="group flex flex-col items-start gap-4 rounded-3xl border border-white/60 bg-white/70 p-5 text-left shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-md active:scale-95 relative overflow-hidden"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary transition-all duration-300 group-hover:scale-110 group-hover:from-primary/20 group-hover:to-primary/10 shadow-inner">
        <Icon className="h-5 w-5" />
      </div>
      <div className="w-full mt-1">
        <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">{label}</div>
        <div className="mt-1 truncate text-xl font-black text-slate-900 group-hover:text-primary transition-colors">{value}</div>
        <div className="mt-1 truncate text-[11px] font-bold text-primary/60 bg-primary/5 rounded-md px-2 py-0.5 inline-flex">{sub}</div>
      </div>
    </button>
  );
}
