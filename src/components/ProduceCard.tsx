import { ChevronRight, Calendar } from "lucide-react";
import { StatusPill } from "./StatusPill";
import { useT } from "@/lib/i18n";
import type { Listing } from "@/lib/mock-data";

export function ProduceCard({ listing, onClick }: { listing: Listing; onClick?: () => void }) {
  const { t, tCrop } = useT();
  return (
    <button
      onClick={onClick}
      className="flex w-full flex-col gap-3 rounded-2xl border border-border bg-card p-4 text-left shadow-sm transition-colors active:bg-muted"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-secondary text-3xl">
          {listing.emoji}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="truncate text-base font-bold text-foreground">{tCrop(listing.crop)}</h3>
            <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
          </div>
          <div className="mt-0.5 text-lg font-bold text-primary">
            {listing.quantity} <span className="text-sm font-medium text-muted-foreground">{listing.unit}</span>
          </div>
          <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {t("ready")}: {listing.readyDate}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-border pt-2.5">
        <span className="text-[11px] text-muted-foreground">#{listing.id} · {t("submitted")} {listing.submittedDate}</span>
        <StatusPill status={listing.status} />
      </div>
    </button>
  );
}
