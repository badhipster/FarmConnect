import { ChevronRight } from "lucide-react";
import { StatusPill } from "./StatusPill";
import type { Listing } from "@/lib/mock-data";

export function ProduceCard({ listing, onClick }: { listing: Listing; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left shadow-sm transition-colors active:bg-muted"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary text-2xl">
        {listing.emoji}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <h3 className="truncate text-base font-semibold text-foreground">{listing.crop}</h3>
          <StatusPill status={listing.status} />
        </div>
        <div className="mt-1 text-sm text-muted-foreground">
          {listing.quantity} {listing.unit} • Ready {listing.readyDate}
        </div>
        <div className="mt-0.5 text-xs text-muted-foreground">Submitted {listing.submittedDate} · #{listing.id}</div>
      </div>
      <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
    </button>
  );
}
