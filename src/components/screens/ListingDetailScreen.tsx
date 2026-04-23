import { Phone, MapPin, Calendar, Package, IndianRupee, Truck, CheckCircle2, User, Pencil } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { StatusPill } from "@/components/StatusPill";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Listing, Order, Payment } from "@/lib/mock-data";

const nextStep: Record<Listing["status"], string> = {
  Submitted: "We're sharing your listing with buyers",
  Active: "Buyers are reviewing. Match expected within 24 hours.",
  Matched: "A buyer is interested. Confirm the order to proceed.",
  Sold: "Pickup and payment in progress",
  Expired: "Listing expired. Add a fresh listing to try again.",
};

const fpoNextStep: Record<Listing["status"], string> = {
  Submitted: "Market review in progress. We'll find a buyer soon.",
  Active: "Lot is live. Multiple buyers are currently negotiating.",
  Matched: "Buyer found! Coordinate with the farmer for collection.",
  Sold: "Lot resolved. Payout initiated to farmer's account.",
  Expired: "No matches found. Consider updating price or quantity.",
};

export function ListingDetailScreen({
  listing,
  role = "farmer",
  order,
  payment,
  onBack,
  onSupport,
  onViewOrder,
  onEdit,
}: {
  listing: Listing;
  role?: "farmer" | "fpo_coordinator";
  order?: Order;
  payment?: Payment;
  onBack: () => void;
  onSupport: () => void;
  onViewOrder?: () => void;
  onEdit?: () => void;
}) {
  const isFpo = role === "fpo_coordinator";

  return (
    <div className="flex flex-col pb-6 bg-slate-50/20 min-h-screen">
      <AppHeader title={listing.crop} subtitle={`#${listing.id}`} onBack={onBack} />

      <div className="space-y-4 px-4 py-4">
        {/* FPO Specific Header: Farmer Context */}
        {isFpo && (
          <div className="flex items-center gap-3 rounded-2xl border border-primary/10 bg-primary/[0.03] p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <User className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-primary/60">Managed Farmer</p>
              <p className="text-sm font-bold text-slate-800">{listing.farmerName || "Individual Farmer"}</p>
            </div>
            <Button variant="ghost" size="sm" className="ml-auto h-8 text-xs font-bold text-primary hover:bg-primary/5">
              Contact
            </Button>
          </div>
        )}

        <div className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-sm backdrop-blur-xl transition-all duration-300 hover:shadow-md">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-secondary to-secondary/50 text-4xl shadow-inner border border-secondary/20">
                <span className="drop-shadow-sm">{listing.emoji}</span>
              </div>
              <div className="flex flex-col justify-center">
                <h2 className="text-2xl font-black tracking-tight text-slate-900">{listing.crop}</h2>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="flex h-5 items-center rounded-md bg-slate-100 px-2 text-[11px] font-bold text-slate-600">
                    {listing.quantity} {listing.unit}
                  </span>
                </div>
              </div>
            </div>
            <StatusPill status={listing.status} />
          </div>

          <div className="mt-6 flex flex-col gap-4 text-sm bg-slate-50/50 rounded-2xl p-4 border border-slate-100/50 shadow-inner">
            {listing.status === "Sold" ? (
              <>
                <Row icon={IndianRupee} label="Final Payout" value={`₹${payment?.amount?.toLocaleString() || "..."}`} highlight />
                <Row icon={CheckCircle2} label="Payment Status" value={payment?.status || "Processing"} />
                <Row icon={Calendar} label="Date Resolved" value={payment?.timestamp || listing.submittedDate} />
              </>
            ) : listing.status === "Matched" ? (
              <>
                <Row icon={IndianRupee} label="Expected Payout" value={`₹${order?.expectedPayout?.toLocaleString() || "..."}`} highlight />
                <Row icon={Truck} label="Pickup Time" value={order?.pickupDate || "Pending"} />
                <Row icon={MapPin} label="Village" value={listing.village} />
              </>
            ) : (
              <>
                <Row icon={Calendar} label="Ready by" value={listing.readyDate} />
                <Row icon={Package} label="Submitted" value={listing.submittedDate} />
                <Row icon={MapPin} label="Village" value={listing.village} />
              </>
            )}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-status-active-bg via-white to-status-active-bg/50 p-5 shadow-sm">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary" />
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            </div>
            <div className="text-[11px] font-black uppercase tracking-widest text-primary">Status Outlook</div>
          </div>
          <p className="mt-2 text-[15px] font-semibold text-slate-800 leading-snug">{isFpo ? fpoNextStep[listing.status] : nextStep[listing.status]}</p>
        </div>

        <div className="pt-4 space-y-3">
          {listing.status === "Matched" && onViewOrder && (
            <Button onClick={onViewOrder} className="h-14 w-full rounded-2xl font-bold text-[15px] shadow-lg shadow-primary/20">
              View Order Details
            </Button>
          )}

          {isFpo && (
            <Button onClick={onEdit} variant="outline" className="h-14 w-full rounded-2xl border-slate-200 bg-white font-bold flex items-center gap-2 text-[15px] shadow-sm hover:bg-slate-50">
              <Pencil className="h-4 w-4" />
              Edit Listing
            </Button>
          )}

          <Button onClick={onSupport} variant="ghost" className="h-14 w-full rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center gap-2 text-[15px] transition-colors">
            <Phone className="h-4 w-4" />
            {isFpo ? "Get Coordinator Support" : "Request Callback"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function Row({ icon: Icon, label, value, highlight }: { icon: any; label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className={cn("flex h-7 w-7 items-center justify-center rounded-lg", highlight ? "bg-primary/10 text-primary" : "bg-white border border-slate-200 shadow-sm text-slate-400")}>
          <Icon className="h-3.5 w-3.5" />
        </div>
        <span className="text-slate-500 font-semibold">{label}</span>
      </div>
      <span className={cn("font-black", highlight ? "text-primary text-xl" : "text-slate-900")}>{value}</span>
    </div>
  );
}
