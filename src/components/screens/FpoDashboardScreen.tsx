import { useMemo, useState } from "react";
import { Listing, Order, Payment } from "@/lib/mock-data";
import {
  AlertTriangle,
  ArrowRight,
  ShoppingBag,
  Truck,
  Sparkles,
  CheckCircle2,
  Filter as FilterIcon,
  Download,
  MoreVertical,
} from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Props {
  fpoName: string;
  fpoRegion: string;
  listings: Listing[];
  orders: Order[];
  payments: Payment[];
  onOpenListing: (id: string) => void;
  onNavigateToTab?: (tab: string) => void;
}

// Used only when a lot has no matched order yet — keeps inventory value meaningful.
const DEFAULT_PRICE_PER_UNIT = 2000;

type EnrichedRow = {
  listing: Listing;
  order?: Order;
  payment?: Payment;
  value: number;
};

export function FpoDashboardScreen({
  fpoRegion,
  listings,
  orders,
  payments,
  onOpenListing,
  onNavigateToTab,
}: Props) {
  const [cropFilter, setCropFilter] = useState<string>("all");

  const fmtINR = (n: number) => `₹ ${n.toLocaleString("en-IN")}`;

  const rows = useMemo<EnrichedRow[]>(
    () =>
      listings.map((l) => {
        const order = orders.find((o) => o.listingId === l.id);
        const payment = order ? payments.find((p) => p.orderId === order.id) : undefined;
        const value = order ? order.expectedPayout : l.quantity * DEFAULT_PRICE_PER_UNIT;
        return { listing: l, order, payment, value };
      }),
    [listings, orders, payments],
  );

  // ─── KPIs ───────────────────────────────────────────────────────────────
  const totalInventoryValue = useMemo(
    () => rows.reduce((s, r) => s + (r.payment?.status === "Paid" ? 0 : r.value), 0),
    [rows],
  );
  const activeLotCount = useMemo(
    () => listings.filter((l) => ["Submitted", "Active", "Matched"].includes(l.status)).length,
    [listings],
  );
  const activeBuyerLeads = useMemo(
    () =>
      listings.filter((l) => l.status === "Matched").length +
      orders.filter((o) => o.status === "Awaiting").length,
    [listings, orders],
  );
  const matchingPending = useMemo(
    () => listings.filter((l) => l.status === "Submitted" || l.status === "Active").length,
    [listings],
  );
  const pendingDeliveries = useMemo(
    () => orders.filter((o) => ["Accepted", "Scheduled"].includes(o.status)).length,
    [orders],
  );

  // ─── Inventory Health: group by crop, show top 4 by total quantity ─────
  const inventoryHealth = useMemo(() => {
    const map = new Map<
      string,
      {
        crop: string;
        emoji: string;
        totalQty: number;
        unit: string;
        matched: number;
        total: number;
      }
    >();
    listings.forEach((l) => {
      const entry =
        map.get(l.crop) ??
        { crop: l.crop, emoji: l.emoji, totalQty: 0, unit: l.unit, matched: 0, total: 0 };
      entry.totalQty += l.quantity;
      entry.total += 1;
      if (l.status === "Matched" || l.status === "Sold") entry.matched += 1;
      map.set(l.crop, entry);
    });
    return Array.from(map.values())
      .sort((a, b) => b.totalQty - a.totalQty)
      .slice(0, 4)
      .map((g) => ({
        ...g,
        matchPct: g.total > 0 ? Math.round((g.matched / g.total) * 100) : 0,
      }));
  }, [listings]);

  // ─── Action Center: only show alerts with a real destination & data ─────
  const alerts = useMemo(() => {
    type Alert = {
      id: string;
      severity: "danger" | "warning" | "success";
      title: string;
      body: string;
      ctaLabel: string;
      onCta: () => void;
    };
    const out: Alert[] = [];

    const matchedCount = listings.filter((l) => l.status === "Matched").length;
    if (matchedCount > 0) {
      out.push({
        id: "matched-review",
        severity: "danger",
        title: "Buyers waiting",
        body: `${matchedCount} ${
          matchedCount === 1 ? "lot has" : "lots have"
        } a matched buyer awaiting your approval.`,
        ctaLabel: "Review in Pipeline",
        onCta: () => onNavigateToTab?.("listings"),
      });
    }

    const awaitingPickups = orders.filter((o) => o.status === "Awaiting").length;
    if (awaitingPickups > 0) {
      out.push({
        id: "pickups-awaiting",
        severity: "warning",
        title: "Confirm pickups",
        body: `${awaitingPickups} buyer ${
          awaitingPickups === 1 ? "order is" : "orders are"
        } waiting for you to confirm pickup.`,
        ctaLabel: "Open Orders",
        onCta: () => onNavigateToTab?.("orders"),
      });
    }

    const processingPayments = payments.filter((p) => p.status === "Processing").length;
    if (processingPayments > 0) {
      out.push({
        id: "payments-processing",
        severity: "success",
        title: "Payments in flight",
        body: `${processingPayments} ${
          processingPayments === 1 ? "payment is" : "payments are"
        } in transit and will settle soon.`,
        ctaLabel: "View Summary",
        onCta: () => onNavigateToTab?.("summary"),
      });
    }

    return out;
  }, [listings, orders, payments, onNavigateToTab]);

  // ─── Recent Marketplace Activity ────────────────────────────────────────
  const crops = useMemo(
    () => Array.from(new Set(rows.map((r) => r.listing.crop))).sort(),
    [rows],
  );
  const activityRows = useMemo(
    () =>
      rows
        .filter((r) => cropFilter === "all" || r.listing.crop === cropFilter)
        .slice(0, 8),
    [rows, cropFilter],
  );

  const exportCsv = () => {
    const header = ["lot_id", "crop", "farmer", "quantity", "unit", "value", "status"];
    const body = activityRows.map((r) =>
      [
        r.listing.id,
        r.listing.crop,
        r.listing.farmerName ?? "",
        String(r.listing.quantity),
        r.listing.unit,
        String(r.value),
        r.payment?.status ?? r.order?.status ?? r.listing.status,
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(","),
    );
    const csv = [header.join(","), ...body].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `marketplace-activity-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const todayStr = format(new Date(), "EEE, d MMM");
  const updatedLabel = format(new Date(), "h:mm a");

  return (
    <div className="ar-scope flex min-h-screen flex-col pb-20 lg:pb-8">
      <AppHeader title="Dashboard" subtitle={`${todayStr} · ${fpoRegion}`} />

      <div className="mx-auto w-full max-w-[1200px] flex-1 space-y-6 px-4 py-6 lg:px-8 lg:py-8">
        {/* Page title */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2
            className="text-2xl font-bold tracking-tight"
            style={{ color: "var(--ar-on-surface)" }}
          >
            Market Overview
          </h2>
          <span
            className="inline-flex items-center rounded-full border px-3 py-1 text-xs"
            style={{
              borderColor: "var(--ar-outline-variant)",
              color: "var(--ar-on-surface-variant)",
              background: "#fff",
            }}
          >
            Updated {updatedLabel}
          </span>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <KpiCard
            icon={ShoppingBag}
            label="Total Inventory Value"
            value={fmtINR(totalInventoryValue)}
            subline={`Across ${activeLotCount} active commodity lot${
              activeLotCount === 1 ? "" : "s"
            }`}
          />
          <KpiCard
            icon={Sparkles}
            label="Active Buyer Leads"
            value={String(activeBuyerLeads)}
            subline={`Matching pending for ${matchingPending} lot${
              matchingPending === 1 ? "" : "s"
            }`}
          />
          <KpiCard
            icon={Truck}
            label="Pending Deliveries"
            value={String(pendingDeliveries)}
            subline={
              pendingDeliveries > 0 ? "Accepted or in transit" : "Nothing scheduled"
            }
          />
        </div>

        {/* Inventory Health + Action Center */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <section className="lg:col-span-2" aria-labelledby="inv-health">
            <div className="mb-3 flex items-center justify-between">
              <h3
                id="inv-health"
                className="text-lg font-semibold"
                style={{ color: "var(--ar-on-surface)" }}
              >
                Inventory Health
              </h3>
              <button
                onClick={() => onNavigateToTab?.("listings")}
                className="inline-flex items-center gap-1 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{
                  color: "var(--ar-primary)",
                  outlineColor: "var(--ar-primary)",
                }}
                aria-label="View all lots in Pipeline"
              >
                View Pipeline
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            {inventoryHealth.length === 0 ? (
              <div className="ar-card p-5">
                <p
                  className="text-sm"
                  style={{ color: "var(--ar-on-surface-variant)" }}
                >
                  No lots yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {inventoryHealth.map((g) => (
                  <InventoryCard key={g.crop} group={g} />
                ))}
              </div>
            )}
          </section>

          <section aria-labelledby="action-center">
            <h3
              id="action-center"
              className="mb-3 text-lg font-semibold"
              style={{ color: "var(--ar-on-surface)" }}
            >
              Action Center
            </h3>
            {alerts.length === 0 ? (
              <div className="ar-card p-5">
                <div className="flex items-start gap-3">
                  <CheckCircle2
                    className="h-5 w-5 shrink-0"
                    style={{ color: "var(--ar-primary)" }}
                    aria-hidden="true"
                  />
                  <div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: "var(--ar-on-surface)" }}
                    >
                      All clear
                    </p>
                    <p
                      className="mt-0.5 text-xs"
                      style={{ color: "var(--ar-on-surface-variant)" }}
                    >
                      Nothing requires your action right now.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {alerts.map((a) => (
                  <ActionCard key={a.id} alert={a} />
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Recent Marketplace Activity */}
        <section className="ar-card p-0" aria-labelledby="recent-activity">
          <div
            className="flex flex-wrap items-center justify-between gap-3 border-b p-5"
            style={{ borderColor: "var(--ar-outline-variant)" }}
          >
            <h3
              id="recent-activity"
              className="text-lg font-semibold"
              style={{ color: "var(--ar-on-surface)" }}
            >
              Recent Marketplace Activity
            </h3>
            <div className="flex items-center gap-2">
              <Select value={cropFilter} onValueChange={setCropFilter}>
                <SelectTrigger
                  className="h-9 w-auto min-w-[130px] gap-1 text-xs"
                  aria-label="Filter by crop"
                >
                  <FilterIcon
                    className="mr-1 h-3.5 w-3.5"
                    aria-hidden="true"
                  />
                  <SelectValue placeholder="Filter" />
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
              <button
                onClick={exportCsv}
                disabled={activityRows.length === 0}
                className="ar-btn-secondary inline-flex h-9 items-center gap-1.5 px-3 text-xs font-medium disabled:opacity-50"
                aria-label="Export recent activity as CSV"
              >
                <Download className="h-3.5 w-3.5" aria-hidden="true" />
                Export
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr
                  className="border-b text-left"
                  style={{ borderColor: "var(--ar-outline-variant)" }}
                >
                  <TH>Lot ID</TH>
                  <TH>Commodity</TH>
                  <TH>Farmer</TH>
                  <TH>Value</TH>
                  <TH>Status</TH>
                  <TH className="text-right">Action</TH>
                </tr>
              </thead>
              <tbody>
                {activityRows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-8 text-center text-sm"
                      style={{ color: "var(--ar-on-surface-variant)" }}
                    >
                      No activity matches this filter.
                    </td>
                  </tr>
                ) : (
                  activityRows.map((r) => (
                    <ActivityRow
                      key={r.listing.id}
                      row={r}
                      onOpen={() => onOpenListing(r.listing.id)}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
          {activityRows.length > 0 && (
            <div
              className="border-t px-5 py-3 text-xs"
              style={{
                borderColor: "var(--ar-outline-variant)",
                color: "var(--ar-on-surface-variant)",
              }}
            >
              Showing {activityRows.length} of {rows.length} transactions
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

// ─── Subcomponents ────────────────────────────────────────────────────────

function KpiCard({
  icon: Icon,
  label,
  value,
  subline,
}: {
  icon: typeof ShoppingBag;
  label: string;
  value: string;
  subline: string;
}) {
  return (
    <div className="ar-card p-5">
      <div
        className="flex h-11 w-11 items-center justify-center rounded-[12px]"
        style={{ background: "var(--ar-success-bg)", color: "var(--ar-primary)" }}
        aria-hidden="true"
      >
        <Icon className="h-5 w-5" />
      </div>
      <p
        className="mt-4 text-sm font-medium"
        style={{ color: "var(--ar-on-surface-variant)" }}
      >
        {label}
      </p>
      <p
        className="mt-1 text-[26px] font-bold tracking-tight"
        style={{ color: "var(--ar-on-surface)" }}
      >
        {value}
      </p>
      <p className="mt-1 text-xs" style={{ color: "var(--ar-on-surface-variant)" }}>
        {subline}
      </p>
    </div>
  );
}

type Group = {
  crop: string;
  emoji: string;
  totalQty: number;
  unit: string;
  total: number;
  matchPct: number;
};

function InventoryCard({ group }: { group: Group }) {
  const status = statusFromPct(group.matchPct);
  return (
    <div className="ar-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-[10px] text-xl"
            style={{ background: "var(--ar-surface-container-low)" }}
            aria-hidden="true"
          >
            {group.emoji}
          </span>
          <div>
            <p
              className="text-sm font-semibold"
              style={{ color: "var(--ar-on-surface)" }}
            >
              {group.crop}
            </p>
            <p
              className="text-xs"
              style={{ color: "var(--ar-on-surface-variant)" }}
            >
              {group.total} lot{group.total === 1 ? "" : "s"} · {group.totalQty}{" "}
              {group.unit}
            </p>
          </div>
        </div>
        <span
          className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
          style={{ background: status.bg, color: status.fg }}
        >
          {status.label}
        </span>
      </div>
      <div className="mt-4">
        <div className="mb-1 flex items-center justify-between text-xs">
          <span style={{ color: "var(--ar-on-surface-variant)" }}>
            Matching Status
          </span>
          <span
            className="font-semibold"
            style={{ color: "var(--ar-on-surface)" }}
          >
            {group.matchPct}%
          </span>
        </div>
        <div
          className="h-2 overflow-hidden rounded-full"
          style={{ background: "var(--ar-surface-container)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${group.matchPct}%`,
              background: status.bar,
            }}
          />
        </div>
      </div>
    </div>
  );
}

function statusFromPct(pct: number): {
  label: string;
  bg: string;
  fg: string;
  bar: string;
} {
  if (pct >= 100)
    return {
      label: "Fully Sold",
      bg: "var(--ar-success-bg)",
      fg: "var(--ar-primary)",
      bar: "var(--ar-primary)",
    };
  if (pct >= 70)
    return {
      label: "Matched",
      bg: "var(--ar-success-bg)",
      fg: "var(--ar-primary)",
      bar: "var(--ar-primary)",
    };
  if (pct >= 30)
    return {
      label: "Searching",
      bg: "var(--ar-warning-bg)",
      fg: "var(--ar-secondary)",
      bar: "var(--ar-secondary-container)",
    };
  return {
    label: "Staging",
    bg: "var(--ar-surface-container)",
    fg: "var(--ar-on-surface-variant)",
    bar: "var(--ar-outline)",
  };
}

function ActionCard({
  alert,
}: {
  alert: {
    severity: "danger" | "warning" | "success";
    title: string;
    body: string;
    ctaLabel: string;
    onCta: () => void;
  };
}) {
  const tone = {
    danger: {
      bg: "var(--ar-error-container)",
      fg: "var(--ar-on-error-container)",
      Icon: AlertTriangle,
    },
    warning: {
      bg: "var(--ar-warning-bg)",
      fg: "var(--ar-secondary)",
      Icon: AlertTriangle,
    },
    success: {
      bg: "var(--ar-success-bg)",
      fg: "var(--ar-primary)",
      Icon: CheckCircle2,
    },
  }[alert.severity];
  const IconCmp = tone.Icon;
  return (
    <div
      className="rounded-[14px] border p-4"
      style={{ background: tone.bg, borderColor: "var(--ar-outline-variant)" }}
    >
      <div className="flex items-start gap-3">
        <IconCmp
          className="h-5 w-5 shrink-0"
          style={{ color: tone.fg }}
          aria-hidden="true"
        />
        <div className="flex-1">
          <p className="text-sm font-semibold" style={{ color: tone.fg }}>
            {alert.title}
          </p>
          <p
            className="mt-1 text-xs"
            style={{ color: "var(--ar-on-surface-variant)" }}
          >
            {alert.body}
          </p>
          <button
            onClick={alert.onCta}
            className="mt-2 inline-flex items-center gap-1 text-xs font-semibold underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ color: tone.fg, outlineColor: "var(--ar-primary)" }}
          >
            {alert.ctaLabel}
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

function TH({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={`px-5 py-3 text-xs font-medium ${className ?? ""}`}
      style={{ color: "var(--ar-on-surface-variant)" }}
    >
      {children}
    </th>
  );
}

function ActivityRow({
  row,
  onOpen,
}: {
  row: EnrichedRow;
  onOpen: () => void;
}) {
  const { listing, order, payment, value } = row;
  const status = paymentStatusMeta(payment, order);

  return (
    <tr
      className="border-b"
      style={{ borderColor: "var(--ar-outline-variant)" }}
    >
      <td
        className="px-5 py-3 text-sm font-semibold"
        style={{ color: "var(--ar-primary)" }}
      >
        #{listing.id}
      </td>
      <td
        className="px-5 py-3 text-sm"
        style={{ color: "var(--ar-on-surface)" }}
      >
        <span className="mr-1.5" aria-hidden="true">
          {listing.emoji}
        </span>
        {listing.crop}
      </td>
      <td
        className="px-5 py-3 text-sm"
        style={{ color: "var(--ar-on-surface)" }}
      >
        {listing.farmerName ?? "—"}
      </td>
      <td
        className="px-5 py-3 text-sm font-medium"
        style={{ color: "var(--ar-on-surface)" }}
      >
        ₹{value.toLocaleString("en-IN")}
      </td>
      <td className="px-5 py-3">
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium"
          style={{ background: status.bg, color: status.fg }}
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: status.fg }}
            aria-hidden="true"
          />
          {status.label}
        </span>
      </td>
      <td className="px-5 py-3 text-right">
        <DropdownMenu>
          <DropdownMenuTrigger
            className="inline-flex h-8 w-8 items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            aria-label={`Actions for lot ${listing.id}`}
            style={{ outlineColor: "var(--ar-primary)" }}
          >
            <MoreVertical
              className="h-4 w-4"
              style={{ color: "var(--ar-on-surface-variant)" }}
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onOpen}>View details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}

function paymentStatusMeta(
  payment: Payment | undefined,
  order: Order | undefined,
): { label: string; bg: string; fg: string } {
  if (payment?.status === "Paid")
    return {
      label: "Received",
      bg: "var(--ar-success-bg)",
      fg: "var(--ar-primary)",
    };
  if (payment?.status === "Processing")
    return {
      label: "Escrowed",
      bg: "var(--ar-warning-bg)",
      fg: "var(--ar-secondary)",
    };
  if (payment?.status === "Pending")
    return {
      label: "Pending",
      bg: "var(--ar-info-bg)",
      fg: "var(--ar-on-surface-variant)",
    };
  if (order?.status === "Awaiting" || order?.status === "Accepted" || order?.status === "Scheduled")
    return {
      label: order.status,
      bg: "var(--ar-info-bg)",
      fg: "var(--ar-on-surface-variant)",
    };
  if (order?.status === "Collected")
    return {
      label: "Collected",
      bg: "var(--ar-info-bg)",
      fg: "var(--ar-on-surface-variant)",
    };
  return {
    label: "Listed",
    bg: "var(--ar-info-bg)",
    fg: "var(--ar-on-surface-variant)",
  };
}
