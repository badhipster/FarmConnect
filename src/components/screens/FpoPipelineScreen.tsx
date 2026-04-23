import { useMemo, useState } from "react";
import { Listing, Order, Payment } from "@/lib/mock-data";
import { AppHeader } from "@/components/AppHeader";
import {
  MoreVertical,
  ArrowRight,
  ChevronDown,
  SlidersHorizontal,
  Plus,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type PipelineStage = "Listed" | "Matched" | "Confirmed" | "PickedUp" | "Paid";

interface PipelineData {
  listing: Listing;
  order?: Order;
  payment?: Payment;
}

function getStage(data: PipelineData): PipelineStage {
  const { listing, order, payment } = data;
  if (payment?.status === "Paid" || listing.status === "Sold") return "Paid";
  if (order?.status === "Collected") return "PickedUp";
  if (
    order?.status === "Accepted" ||
    order?.status === "Scheduled" ||
    order?.status === "Awaiting"
  )
    return "Confirmed";
  if (listing.status === "Matched") return "Matched";
  return "Listed";
}

const stageTitle: Record<PipelineStage, string> = {
  Listed: "Listed",
  Matched: "Buyer Matched",
  Confirmed: "Confirmed",
  PickedUp: "Picked Up",
  Paid: "Paid",
};

const nextStageMap: Record<PipelineStage, PipelineStage | null> = {
  Listed: "Matched",
  Matched: "Confirmed",
  Confirmed: "PickedUp",
  PickedUp: "Paid",
  Paid: null,
};

type SortOption = "newest" | "oldest" | "value-desc";

// Parses "19 Apr" or "Just now" into a rough day-ago number for sorting/age.
function daysAgo(dateStr: string): number {
  if (!dateStr || /just/i.test(dateStr)) return 0;
  const parsed = new Date(`${dateStr} ${new Date().getFullYear()}`);
  if (Number.isNaN(parsed.getTime())) return 0;
  const diff = Date.now() - parsed.getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

function LotCard({
  data,
  onClick,
  onAdvance,
  nextStage,
}: {
  data: PipelineData;
  onClick: () => void;
  onAdvance?: () => void;
  nextStage: PipelineStage | null;
}) {
  const { listing, order } = data;
  const price = order ? Math.round(order.expectedPayout / Math.max(1, order.acceptedQty)) : null;
  const age = daysAgo(listing.submittedDate);
  const aged = age >= 3;

  return (
    <div
      className="ar-card flex flex-col gap-2 p-3 transition-shadow hover:shadow-sm"
      style={{ background: "#fff" }}
    >
      <button
        onClick={onClick}
        aria-label={`Open lot ${listing.id} — ${listing.crop} from ${listing.farmerName ?? "Farmer"}`}
        className="flex w-full items-start justify-between gap-2 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        style={{ outlineColor: "var(--ar-primary)" }}
      >
        <div className="flex min-w-0 items-start gap-2">
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] text-base"
            style={{ background: "var(--ar-surface-container-low)" }}
            aria-hidden="true"
          >
            {listing.emoji}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold" style={{ color: "var(--ar-on-surface)" }}>
              {listing.crop} · {listing.id}
            </p>
            <p className="truncate text-xs" style={{ color: "var(--ar-on-surface-variant)" }}>
              {listing.farmerName ?? "Farmer"}
            </p>
          </div>
        </div>
      </button>

      <div className="flex items-center justify-between text-xs" style={{ color: "var(--ar-on-surface-variant)" }}>
        <span>
          <span className="font-medium" style={{ color: "var(--ar-on-surface)" }}>
            {listing.quantity} {listing.unit}
          </span>
          {price !== null && (
            <>
              {" · "}
              <span className="font-medium" style={{ color: "var(--ar-on-surface)" }}>
                ₹{price.toLocaleString("en-IN")}/{listing.unit}
              </span>
            </>
          )}
        </span>
        <span
          className={aged ? "rounded-full px-2 py-0.5 text-[11px] font-medium" : "text-[11px]"}
          style={
            aged
              ? { background: "var(--ar-warning-bg)", color: "var(--ar-secondary)" }
              : undefined
          }
        >
          {age === 0 ? "today" : `${age}d in stage`}
        </span>
      </div>

      {onAdvance && nextStage && (
        <button
          onClick={onAdvance}
          className="ar-btn-primary mt-1 inline-flex items-center justify-center gap-1 px-3 text-sm font-medium"
          aria-label={`Advance ${listing.id} to ${stageTitle[nextStage]}`}
        >
          Advance to {stageTitle[nextStage]}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

interface Props {
  listings: Listing[];
  orders: Order[];
  payments: Payment[];
  onOpenListing: (id: string) => void;
  onAdvanceStage?: (
    id: string,
    currentStage: PipelineStage,
    payload: { buyerName?: string; pricePerUnit?: number; pickupDate?: string },
  ) => void;
  onAddListing?: () => void;
}

export function FpoPipelineScreen({
  listings,
  orders,
  payments,
  onOpenListing,
  onAdvanceStage,
  onAddListing,
}: Props) {
  const [cropFilter, setCropFilter] = useState<string>("all");
  const [farmerFilter, setFarmerFilter] = useState<string>("all");
  const [agedOnly, setAgedOnly] = useState<boolean>(false);
  const [sort, setSort] = useState<SortOption>("newest");
  const [collapsed, setCollapsed] = useState<Record<PipelineStage, boolean>>({
    Listed: false,
    Matched: false,
    Confirmed: false,
    PickedUp: false,
    Paid: false,
  });

  // Advance sheet state
  const [advancing, setAdvancing] = useState<{
    id: string;
    from: PipelineStage;
  } | null>(null);
  const [buyerName, setBuyerName] = useState("");
  const [pricePerUnit, setPricePerUnit] = useState("");
  const [pickupDate, setPickupDate] = useState("");

  const crops = useMemo(
    () => Array.from(new Set(listings.map((l) => l.crop))).sort(),
    [listings],
  );
  const farmerNames = useMemo(
    () => Array.from(new Set(listings.map((l) => l.farmerName).filter(Boolean) as string[])).sort(),
    [listings],
  );

  const pipeline = useMemo(() => {
    const data: PipelineData[] = listings.map((listing) => {
      const order = orders.find((o) => o.listingId === listing.id);
      const payment = order ? payments.find((p) => p.orderId === order.id) : undefined;
      return { listing, order, payment };
    });

    const filtered = data.filter((d) => {
      if (cropFilter !== "all" && d.listing.crop !== cropFilter) return false;
      if (farmerFilter !== "all" && d.listing.farmerName !== farmerFilter) return false;
      if (agedOnly && daysAgo(d.listing.submittedDate) < 3) return false;
      return true;
    });

    const sortFn = (a: PipelineData, b: PipelineData) => {
      if (sort === "value-desc") {
        const va = a.order?.expectedPayout ?? 0;
        const vb = b.order?.expectedPayout ?? 0;
        return vb - va;
      }
      const da = daysAgo(a.listing.submittedDate);
      const db = daysAgo(b.listing.submittedDate);
      return sort === "oldest" ? db - da : da - db;
    };

    const stages: Record<PipelineStage, PipelineData[]> = {
      Listed: [],
      Matched: [],
      Confirmed: [],
      PickedUp: [],
      Paid: [],
    };
    filtered.forEach((d) => stages[getStage(d)].push(d));
    (Object.keys(stages) as PipelineStage[]).forEach((k) => stages[k].sort(sortFn));
    return stages;
  }, [listings, orders, payments, cropFilter, farmerFilter, agedOnly, sort]);

  const columns: PipelineStage[] = ["Listed", "Matched", "Confirmed", "PickedUp", "Paid"];

  const resetFilters = () => {
    setCropFilter("all");
    setFarmerFilter("all");
    setAgedOnly(false);
    setSort("newest");
  };

  const openAdvanceSheet = (id: string, from: PipelineStage) => {
    setAdvancing({ id, from });
    setBuyerName("");
    setPricePerUnit("");
    setPickupDate("");
  };

  const submitAdvance = () => {
    if (!advancing || !onAdvanceStage) return;
    const payload: { buyerName?: string; pricePerUnit?: number; pickupDate?: string } = {};
    if (advancing.from === "Listed") {
      payload.buyerName = buyerName || undefined;
      payload.pricePerUnit = pricePerUnit ? Number(pricePerUnit) : undefined;
    } else if (advancing.from === "Matched") {
      payload.pickupDate = pickupDate || undefined;
    }
    onAdvanceStage(advancing.id, advancing.from, payload);
    setAdvancing(null);
  };

  const exportStageCSV = (stage: PipelineStage) => {
    const rows = pipeline[stage];
    if (rows.length === 0) return;
    const header = ["lot_id", "crop", "farmer", "quantity", "unit", "village", "submitted"];
    const body = rows.map((r) =>
      [
        r.listing.id,
        r.listing.crop,
        r.listing.farmerName ?? "",
        String(r.listing.quantity),
        r.listing.unit,
        r.listing.village,
        r.listing.submittedDate,
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(","),
    );
    const csv = [header.join(","), ...body].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pipeline-${stage.toLowerCase()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filtersActive =
    cropFilter !== "all" || farmerFilter !== "all" || agedOnly || sort !== "newest";

  return (
    <div className="ar-scope flex h-screen flex-col">
      <AppHeader title="Pipeline" subtitle="Kanban of lots by stage" />

      {/* Filter / sort bar */}
      <div
        className="flex flex-wrap items-center gap-2 border-b px-4 py-3 lg:px-8"
        style={{ borderColor: "var(--ar-outline-variant)", background: "var(--ar-surface)" }}
      >
        <SlidersHorizontal
          className="h-4 w-4"
          style={{ color: "var(--ar-on-surface-variant)" }}
          aria-hidden="true"
        />

        <Select value={cropFilter} onValueChange={setCropFilter}>
          <SelectTrigger className="h-9 w-auto min-w-[120px] gap-1 border text-xs" aria-label="Filter by crop">
            <SelectValue placeholder="Crop" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All crops</SelectItem>
            {crops.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={farmerFilter} onValueChange={setFarmerFilter}>
          <SelectTrigger className="h-9 w-auto min-w-[140px] gap-1 border text-xs" aria-label="Filter by farmer">
            <SelectValue placeholder="Farmer" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All farmers</SelectItem>
            {farmerNames.map((n) => (
              <SelectItem key={n} value={n}>
                {n}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <button
          onClick={() => setAgedOnly((v) => !v)}
          className="inline-flex h-9 items-center rounded-full border px-3 text-xs font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{
            borderColor: agedOnly ? "var(--ar-primary)" : "var(--ar-outline-variant)",
            background: agedOnly ? "var(--ar-success-bg)" : "#fff",
            color: agedOnly ? "var(--ar-primary)" : "var(--ar-on-surface)",
            outlineColor: "var(--ar-primary)",
          }}
          aria-pressed={agedOnly}
        >
          Aged &gt; 3 days
        </button>

        <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
          <SelectTrigger className="h-9 w-auto min-w-[130px] gap-1 border text-xs" aria-label="Sort order">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="value-desc">Highest value</SelectItem>
          </SelectContent>
        </Select>

        {filtersActive && (
          <button
            onClick={resetFilters}
            className="ml-1 text-xs font-medium underline-offset-2 hover:underline"
            style={{ color: "var(--ar-primary)" }}
          >
            Reset
          </button>
        )}
      </div>

      {/* Kanban */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-20 lg:pb-0">
        <div className="flex h-full min-w-max gap-4 p-4 lg:p-8">
          {columns.map((stage) => {
            const items = pipeline[stage];
            const isCollapsed = collapsed[stage];

            return (
              <div
                key={stage}
                className="flex h-full flex-col rounded-2xl p-3"
                style={{
                  width: isCollapsed ? 72 : 300,
                  background: "var(--ar-surface-container-low)",
                  transition: "width 150ms ease",
                }}
              >
                {/* Column header */}
                <div className="mb-3 flex items-center justify-between gap-2 px-1">
                  <button
                    onClick={() =>
                      setCollapsed((c) => ({ ...c, [stage]: !c[stage] }))
                    }
                    className="flex min-w-0 items-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                    style={{ outlineColor: "var(--ar-primary)" }}
                    aria-label={`${isCollapsed ? "Expand" : "Collapse"} ${stageTitle[stage]} column`}
                    aria-expanded={!isCollapsed}
                  >
                    <h3
                      className="truncate text-sm font-semibold"
                      style={{ color: "var(--ar-on-surface)" }}
                    >
                      {isCollapsed ? stageTitle[stage].charAt(0) : stageTitle[stage]}
                    </h3>
                    <span
                      className="flex h-5 min-w-[22px] items-center justify-center rounded-full px-1.5 text-[11px] font-medium"
                      style={{
                        background: "var(--ar-surface-container-high)",
                        color: "var(--ar-on-surface-variant)",
                      }}
                    >
                      {items.length}
                    </span>
                  </button>

                  {!isCollapsed && (
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        className="flex h-8 w-8 items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                        aria-label={`${stageTitle[stage]} column options`}
                        style={{ outlineColor: "var(--ar-primary)" }}
                      >
                        <MoreVertical className="h-4 w-4" style={{ color: "var(--ar-on-surface-variant)" }} />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem
                          onClick={() =>
                            setCollapsed((c) => ({ ...c, [stage]: true }))
                          }
                        >
                          Collapse column
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => exportStageCSV(stage)}
                          disabled={items.length === 0}
                        >
                          Export CSV
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>

                {/* Card list */}
                {!isCollapsed && (
                  <div className="flex-1 space-y-3 overflow-y-auto pb-4">
                    {items.map((item) => {
                      const ns = nextStageMap[stage];
                      return (
                        <LotCard
                          key={item.listing.id}
                          data={item}
                          nextStage={ns}
                          onClick={() => onOpenListing(item.listing.id)}
                          onAdvance={
                            onAdvanceStage && ns
                              ? () => openAdvanceSheet(item.listing.id, stage)
                              : undefined
                          }
                        />
                      );
                    })}

                    {items.length === 0 && (
                      <EmptyStageState
                        stage={stage}
                        onAddListing={onAddListing}
                      />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Advance-stage bottom sheet */}
      <Sheet open={!!advancing} onOpenChange={(o) => !o && setAdvancing(null)}>
        <SheetContent side="bottom" className="rounded-t-2xl">
          <SheetHeader className="text-left">
            <SheetTitle>
              Advance to{" "}
              {advancing ? stageTitle[nextStageMap[advancing.from] ?? "Listed"] : ""}
            </SheetTitle>
            <SheetDescription>
              {advancing?.from === "Listed" &&
                "Record the buyer and agreed price before moving this lot."}
              {advancing?.from === "Matched" && "Schedule the pickup date."}
              {advancing?.from === "Confirmed" && "Confirm the pickup is complete."}
              {advancing?.from === "PickedUp" && "Mark payment as received."}
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-4 py-4">
            {advancing?.from === "Listed" && (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="adv-buyer">Buyer name</Label>
                  <Input
                    id="adv-buyer"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    placeholder="e.g. AgriTrade Pvt Ltd"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="adv-price">Agreed price per unit (₹)</Label>
                  <Input
                    id="adv-price"
                    type="number"
                    inputMode="numeric"
                    value={pricePerUnit}
                    onChange={(e) => setPricePerUnit(e.target.value)}
                    placeholder="2200"
                  />
                </div>
              </>
            )}
            {advancing?.from === "Matched" && (
              <div className="space-y-1.5">
                <Label htmlFor="adv-pickup">Pickup date</Label>
                <Input
                  id="adv-pickup"
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                />
              </div>
            )}
          </div>

          <SheetFooter className="flex-row gap-2">
            <button
              onClick={() => setAdvancing(null)}
              className="ar-btn-secondary flex-1 px-4 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={submitAdvance}
              className="ar-btn-primary flex-1 px-4 text-sm font-medium"
            >
              Confirm
            </button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function EmptyStageState({
  stage,
  onAddListing,
}: {
  stage: PipelineStage;
  onAddListing?: () => void;
}) {
  const copy: Record<PipelineStage, string> = {
    Listed: "No new lots waiting. Add one to get started.",
    Matched: "No buyer matches yet. Check back after listings are reviewed.",
    Confirmed: "No confirmed orders right now.",
    PickedUp: "No pickups in progress.",
    Paid: "No payments completed yet this period.",
  };

  return (
    <div
      className="flex flex-col items-start gap-2 rounded-xl border border-dashed p-4"
      style={{ borderColor: "var(--ar-outline-variant)" }}
    >
      <p className="text-xs" style={{ color: "var(--ar-on-surface-variant)" }}>
        {copy[stage]}
      </p>
      {stage === "Listed" && onAddListing && (
        <button
          onClick={onAddListing}
          className="inline-flex items-center gap-1 text-xs font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{ color: "var(--ar-primary)", outlineColor: "var(--ar-primary)" }}
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          List a new lot
        </button>
      )}
    </div>
  );
}

// Re-export for legacy imports.
export type Stage = PipelineStage;
