import { Phone, MapPin, Calendar, Package } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { StatusPill } from "@/components/StatusPill";
import { Button } from "@/components/ui/button";
import type { Listing } from "@/lib/mock-data";

const nextStep: Record<Listing["status"], string> = {
  Submitted: "We're sharing your listing with buyers",
  Active: "Buyers are reviewing. Match expected within 24 hours.",
  Matched: "A buyer is interested. Confirm the order to proceed.",
  Sold: "Pickup and payment in progress",
  Expired: "Listing expired. Add a fresh listing to try again.",
};

export function ListingDetailScreen({
  listing,
  onBack,
  onSupport,
  onViewOrder,
}: {
  listing: Listing;
  onBack: () => void;
  onSupport: () => void;
  onViewOrder?: () => void;
}) {
  return (
    <div className="flex flex-col pb-6">
      <AppHeader title={listing.crop} subtitle={`#${listing.id}`} onBack={onBack} />

      <div className="space-y-4 px-4 py-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-3xl">
                {listing.emoji}
              </div>
              <div>
                <h2 className="text-xl font-bold">{listing.crop}</h2>
                <p className="text-sm text-muted-foreground">
                  {listing.quantity} {listing.unit}
                </p>
              </div>
            </div>
            <StatusPill status={listing.status} />
          </div>

          <div className="mt-5 space-y-3 text-sm">
            <Row icon={Calendar} label="Ready by" value={listing.readyDate} />
            <Row icon={Package} label="Submitted" value={listing.submittedDate} />
            <Row icon={MapPin} label="Village" value={listing.village} />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-status-active-bg p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-status-active">What happens next</div>
          <p className="mt-1 text-sm font-medium text-foreground">{nextStep[listing.status]}</p>
        </div>

        {listing.status === "Matched" && onViewOrder && (
          <Button onClick={onViewOrder} className="h-12 w-full rounded-xl">
            View Order Details
          </Button>
        )}

        <Button onClick={onSupport} variant="outline" className="h-12 w-full rounded-xl">
          <Phone className="h-4 w-4" />
          Request Callback
        </Button>
      </div>
    </div>
  );
}

function Row({ icon: Icon, label, value }: { icon: typeof Phone; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <span className="text-muted-foreground">{label}</span>
      <span className="ml-auto font-medium text-foreground">{value}</span>
    </div>
  );
}
