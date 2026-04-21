import { Plus, Leaf, Truck, Wallet, TrendingUp, ChevronRight, BellRing } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { SummaryCard } from "@/components/SummaryCard";
import { Button } from "@/components/ui/button";
import { farmer, type Listing, type Order, type Payment } from "@/lib/mock-data";

interface Props {
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
  const activeCount = listings.filter((l) => l.status === "Active" || l.status === "Submitted" || l.status === "Matched").length;
  const upcomingPickup = orders.find((o) => o.status === "Awaiting" || o.status === "Accepted" || o.status === "Scheduled");
  const pendingPayout = payments
    .filter((p) => p.status !== "Paid")
    .reduce((s, p) => s + p.amount, 0);

  return (
    <div className="flex flex-col">
      <AppHeader title={farmer.name} subtitle={farmer.village} variant="hero" onHelp={onOpenSupport} />

      {/* Stat strip */}
      <div className="-mt-4 grid grid-cols-3 gap-2 px-4">
        <div className="rounded-xl border border-border bg-card p-3 shadow-sm">
          <div className="text-xl font-bold text-foreground">{activeCount}</div>
          <div className="text-[11px] leading-tight text-muted-foreground">Active listings</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-3 shadow-sm">
          <div className="text-xl font-bold text-foreground">{upcomingPickup ? 1 : 0}</div>
          <div className="text-[11px] leading-tight text-muted-foreground">Upcoming pickup</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-3 shadow-sm">
          <div className="text-xl font-bold text-foreground">₹{pendingPayout.toLocaleString("en-IN")}</div>
          <div className="text-[11px] leading-tight text-muted-foreground">Pending payout</div>
        </div>
      </div>

      <div className="px-4 pt-5">
        <Button
          onClick={onAddProduce}
          className="h-14 w-full rounded-2xl text-base font-semibold shadow-md"
          size="lg"
        >
          <Plus className="h-5 w-5" />
          Add Produce
        </Button>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Tell us what you have. We'll find a buyer.
        </p>
      </div>

      {/* Action banner */}
      {upcomingPickup && upcomingPickup.status === "Awaiting" && (
        <button
          onClick={onOpenOrder}
          className="mx-4 mt-5 flex items-center gap-3 rounded-2xl border border-status-matched/30 bg-status-matched-bg p-4 text-left animate-fade-in"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
            <BellRing className="h-5 w-5 text-status-matched" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-foreground">New order — action needed</div>
            <div className="text-xs text-muted-foreground">
              {upcomingPickup.crop} · Pickup {upcomingPickup.pickupDate}
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </button>
      )}

      <div className="space-y-3 px-4 py-5">
        <h2 className="px-1 text-sm font-semibold text-muted-foreground">Quick access</h2>
        <SummaryCard icon={Leaf} label="My Listings" value={`${listings.length} items`} sublabel="Tap to see status" onClick={onOpenListings} />
        <SummaryCard
          icon={Truck}
          label="Pickup Updates"
          value={upcomingPickup ? upcomingPickup.crop : "No pickups"}
          sublabel={upcomingPickup ? upcomingPickup.pickupDate : "All clear"}
          onClick={onOpenOrder}
        />
        <SummaryCard
          icon={Wallet}
          label="Payments"
          value={`₹${pendingPayout.toLocaleString("en-IN")} pending`}
          sublabel="View payout proof"
          onClick={onOpenPayments}
        />
        <SummaryCard icon={TrendingUp} label="Weekly Summary" value="This week" sublabel="Earnings & pickups" onClick={onOpenSummary} />
      </div>
    </div>
  );
}
