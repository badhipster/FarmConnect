import { ChevronRight, Calendar } from "lucide-react";
import { StatusPill } from "./StatusPill";
import { useT } from "@/lib/i18n";
import type { Listing } from "@/lib/mock-data";

export function ProduceCard({ listing, onClick }: { listing: Listing; onClick?: () => void }) {
  const { t, tCrop } = useT();
  return (
    <button
      onClick={onClick}
      className="group flex w-full flex-col gap-4 rounded-3xl border border-white/60 bg-white/70 p-5 text-left shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:bg-white active:scale-95"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-secondary/80 to-secondary border border-secondary/20 shadow-inner text-4xl group-hover:scale-105 transition-transform duration-300">
          <span className="drop-shadow-sm">{listing.emoji}</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="truncate text-[17px] font-black tracking-tight text-slate-900 group-hover:text-primary transition-colors">{tCrop(listing.crop)}</h3>
            <ChevronRight className="h-5 w-5 shrink-0 text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-xl font-black text-primary">{listing.quantity}</span>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{listing.unit}</span>
          </div>
          <div className="mt-1.5 flex items-center gap-1.5 text-[11px] font-bold text-slate-500 bg-slate-100 rounded-md px-2 py-0.5 inline-flex">
            <Calendar className="h-3 w-3" />
            {t("ready")}: {listing.readyDate}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-slate-200/60 pt-3">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">#{listing.id.substring(0, 5)} · {listing.submittedDate}</span>
        <StatusPill status={listing.status} />
      </div>
    </button>
  );
}
