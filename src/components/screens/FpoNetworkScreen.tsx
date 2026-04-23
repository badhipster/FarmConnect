import { useMemo, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import {
  Search,
  UserPlus,
  Phone,
  MapPin,
  Download,
  ShieldCheck,
  Leaf,
  BarChart3,
  X,
} from "lucide-react";
import { Farmer, FarmerStatus, Listing } from "@/lib/mock-data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type VerificationStatus = "Verified" | "Pending Audit" | "Inactive";

const verificationFromFarmer = (f: Farmer): VerificationStatus => {
  if (f.status === "Active") return "Verified";
  if (f.status === "New") return "Pending Audit";
  return "Inactive";
};

type YieldTier = { label: string; fg: string };
const yieldTier = (qty: number): YieldTier => {
  if (qty >= 1000) return { label: "Top 5% performer", fg: "var(--ar-primary)" };
  if (qty >= 400) return { label: "Standard yield", fg: "var(--ar-on-surface-variant)" };
  if (qty >= 100) return { label: "Developing", fg: "var(--ar-on-surface-variant)" };
  return { label: "New cultivator", fg: "var(--ar-on-surface-variant)" };
};

const ROWS_PER_PAGE = 10;

interface Props {
  farmers: Farmer[];
  listings?: Listing[];
  onAddFarmer: () => void;
}

export function FpoNetworkScreen({ farmers, listings = [], onAddFarmer }: Props) {
  const [search, setSearch] = useState("");
  const [villageFilter, setVillageFilter] = useState("all");
  const [cropFilter, setCropFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | VerificationStatus>("all");
  const [page, setPage] = useState(1);
  const [profileFarmer, setProfileFarmer] = useState<Farmer | null>(null);

  // Derive primary crop per farmer from their listings (most recent wins).
  const primaryCropByFarmer = useMemo(() => {
    const map = new Map<string, { crop: string; emoji: string }>();
    listings.forEach((l) => {
      if (l.farmerName && !map.has(l.farmerName)) {
        map.set(l.farmerName, { crop: l.crop, emoji: l.emoji });
      }
    });
    return map;
  }, [listings]);

  const villages = useMemo(
    () => Array.from(new Set(farmers.map((f) => f.village))).sort(),
    [farmers],
  );
  const crops = useMemo(
    () =>
      Array.from(
        new Set(
          Array.from(primaryCropByFarmer.values()).map((v) => v.crop),
        ),
      ).sort(),
    [primaryCropByFarmer],
  );

  const activeCount = farmers.filter((f) => f.status === "Active").length;
  const newCount = farmers.filter((f) => f.status === "New").length;
  const totalYield = farmers.reduce((s, f) => s + f.totalSold, 0);
  const villageCount = villages.length;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return farmers.filter((f) => {
      if (q) {
        const hay = `${f.name} ${f.village} ${f.id}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (villageFilter !== "all" && f.village !== villageFilter) return false;
      if (statusFilter !== "all" && verificationFromFarmer(f) !== statusFilter) return false;
      if (cropFilter !== "all") {
        const pc = primaryCropByFarmer.get(f.name);
        if (!pc || pc.crop !== cropFilter) return false;
      }
      return true;
    });
  }, [farmers, search, villageFilter, cropFilter, statusFilter, primaryCropByFarmer]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * ROWS_PER_PAGE;
  const pageRows = filtered.slice(start, start + ROWS_PER_PAGE);

  const resetFilters = () => {
    setSearch("");
    setVillageFilter("all");
    setCropFilter("all");
    setStatusFilter("all");
    setPage(1);
  };
  const filtersActive =
    search.trim().length > 0 ||
    villageFilter !== "all" ||
    cropFilter !== "all" ||
    statusFilter !== "all";

  const exportCsv = () => {
    const header = [
      "uid",
      "name",
      "village",
      "phone",
      "active_lots",
      "lifetime_yield_qtl",
      "verification_status",
    ];
    const body = filtered.map((f) =>
      [
        f.id,
        f.name,
        f.village,
        f.phone,
        String(f.activeLots),
        String(f.totalSold),
        verificationFromFarmer(f),
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(","),
    );
    const csv = [header.join(","), ...body].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `farmer-directory-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="ar-scope flex min-h-screen flex-col pb-24 lg:pb-8">
      <AppHeader title="Farmers" subtitle={`${farmers.length} registered`} />

      <div className="mx-auto w-full max-w-[1200px] flex-1 space-y-6 px-4 py-6 lg:px-8 lg:py-8">
        {/* Page heading */}
        <div>
          <h2
            className="text-2xl font-bold tracking-tight"
            style={{ color: "var(--ar-on-surface)" }}
          >
            Verified Farmer Directory
          </h2>
          <p
            className="mt-2 max-w-2xl text-sm leading-relaxed"
            style={{ color: "var(--ar-on-surface-variant)" }}
          >
            Manage and monitor {farmers.length.toLocaleString("en-IN")} registered
            cultivator{farmers.length === 1 ? "" : "s"} across {villageCount} village
            {villageCount === 1 ? "" : "s"}. Track active lots and verification status in
            real time.
          </p>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <KpiCard
            icon={ShieldCheck}
            label="Total Verified Farmers"
            value={farmers.length.toLocaleString("en-IN")}
            subline={
              newCount > 0
                ? `+${newCount} pending audit this month`
                : "All onboarded cultivators verified"
            }
            tone="success"
          />
          <KpiCard
            icon={Leaf}
            label="Active Cultivators"
            value={activeCount.toLocaleString("en-IN")}
            subline={
              activeCount > 0 ? "Currently trading on the network" : "No active cultivators"
            }
            tone="warning"
          />
          <KpiCard
            icon={BarChart3}
            label="Lifetime Yield"
            value={`${totalYield.toLocaleString("en-IN")} qtl`}
            subline={`Across ${farmers.length} cultivator${
              farmers.length === 1 ? "" : "s"
            }`}
            tone="neutral"
          />
        </div>

        {/* Filter + Export bar */}
        <div
          className="ar-card flex flex-col gap-3 p-4 md:flex-row md:items-center"
        >
          {/* Search */}
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
              style={{ color: "var(--ar-on-surface-variant)" }}
              aria-hidden="true"
            />
            <input
              type="search"
              placeholder="Search farmers by name, UID or village…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              aria-label="Search farmers"
              className="ar-input h-10 w-full pl-9 text-sm placeholder:text-[color:var(--ar-on-surface-variant)] focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={villageFilter}
              onValueChange={(v) => {
                setVillageFilter(v);
                setPage(1);
              }}
            >
              <SelectTrigger
                className="h-10 w-auto min-w-[140px] gap-1 text-xs"
                aria-label="Filter by village"
              >
                <MapPin className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                <SelectValue placeholder="All villages" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All villages</SelectItem>
                {villages.map((v) => (
                  <SelectItem key={v} value={v}>
                    {v}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {crops.length > 0 && (
              <Select
                value={cropFilter}
                onValueChange={(v) => {
                  setCropFilter(v);
                  setPage(1);
                }}
              >
                <SelectTrigger
                  className="h-10 w-auto min-w-[140px] gap-1 text-xs"
                  aria-label="Filter by primary crop"
                >
                  <Leaf className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                  <SelectValue placeholder="Primary crop" />
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
            )}

            <Select
              value={statusFilter}
              onValueChange={(v) => {
                setStatusFilter(v as "all" | VerificationStatus);
                setPage(1);
              }}
            >
              <SelectTrigger
                className="h-10 w-auto min-w-[140px] gap-1 text-xs"
                aria-label="Filter by verification status"
              >
                <ShieldCheck className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="Verified">Verified</SelectItem>
                <SelectItem value="Pending Audit">Pending Audit</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            {filtersActive && (
              <button
                onClick={resetFilters}
                className="inline-flex h-10 items-center gap-1 rounded-[10px] px-3 text-xs font-medium"
                style={{ color: "var(--ar-primary)" }}
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
                Reset
              </button>
            )}

            <button
              onClick={exportCsv}
              disabled={filtered.length === 0}
              className="ar-btn-secondary inline-flex h-10 items-center gap-1.5 px-3 text-xs font-medium disabled:opacity-50"
              aria-label="Export directory as CSV"
            >
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Directory table */}
        <section className="ar-card p-0" aria-label="Farmer directory">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr
                  className="border-b text-left"
                  style={{ borderColor: "var(--ar-outline-variant)" }}
                >
                  <TH>Farmer Identity</TH>
                  <TH>Location / Village</TH>
                  <TH>Active Lots</TH>
                  <TH>Lifetime Yield</TH>
                  <TH>Status</TH>
                  <TH className="text-right">Actions</TH>
                </tr>
              </thead>
              <tbody>
                {pageRows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-10 text-center text-sm"
                      style={{ color: "var(--ar-on-surface-variant)" }}
                    >
                      No farmers match the current filters.
                    </td>
                  </tr>
                ) : (
                  pageRows.map((f) => (
                    <FarmerRow
                      key={f.id}
                      farmer={f}
                      crop={primaryCropByFarmer.get(f.name)}
                      onViewProfile={() => setProfileFarmer(f)}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div
            className="flex flex-wrap items-center justify-between gap-3 border-t px-5 py-3 text-xs"
            style={{ borderColor: "var(--ar-outline-variant)" }}
          >
            <span style={{ color: "var(--ar-on-surface-variant)" }}>
              Showing {filtered.length === 0 ? 0 : start + 1}–
              {Math.min(start + ROWS_PER_PAGE, filtered.length)} of{" "}
              {filtered.length.toLocaleString("en-IN")} farmers
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="ar-btn-secondary h-9 px-3 text-xs font-medium disabled:opacity-40"
                aria-label="Previous page"
              >
                Previous
              </button>
              <span
                className="min-w-[70px] text-center"
                style={{ color: "var(--ar-on-surface-variant)" }}
              >
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="ar-btn-secondary h-9 px-3 text-xs font-medium disabled:opacity-40"
                aria-label="Next page"
              >
                Next
              </button>
            </div>
          </div>
        </section>

        {/* Register new farmer CTA */}
        <div className="flex justify-end">
          <button
            onClick={onAddFarmer}
            className="ar-btn-primary inline-flex items-center gap-2 px-5 text-sm font-semibold"
            aria-label="Register a new farmer"
          >
            <UserPlus className="h-4 w-4" aria-hidden="true" />
            Register new farmer
          </button>
        </div>
      </div>

      {/* Profile dialog */}
      <Dialog
        open={!!profileFarmer}
        onOpenChange={(open) => !open && setProfileFarmer(null)}
      >
        <DialogContent className="max-w-md">
          {profileFarmer && (
            <>
              <DialogHeader>
                <DialogTitle>{profileFarmer.name}</DialogTitle>
                <DialogDescription>
                  UID {profileFarmer.id} · {verificationFromFarmer(profileFarmer)}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                <DialogRow label="Village" value={profileFarmer.village} />
                <DialogRow label="Phone" value={profileFarmer.phone} />
                <DialogRow label="Active lots" value={String(profileFarmer.activeLots)} />
                <DialogRow
                  label="Lifetime yield"
                  value={`${profileFarmer.totalSold.toLocaleString("en-IN")} qtl`}
                />
                <DialogRow
                  label="Primary crop"
                  value={primaryCropByFarmer.get(profileFarmer.name)?.crop ?? "—"}
                />
              </div>
              <div className="mt-4 flex gap-2">
                <a
                  href={`tel:${profileFarmer.phone}`}
                  className="ar-btn-primary inline-flex flex-1 items-center justify-center gap-2 px-4 text-sm font-medium"
                  aria-label={`Call ${profileFarmer.name}`}
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  Call
                </a>
                <button
                  onClick={() => setProfileFarmer(null)}
                  className="ar-btn-secondary flex-1 px-4 text-sm font-medium"
                >
                  Close
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Subcomponents ────────────────────────────────────────────────────────

function KpiCard({
  icon: Icon,
  label,
  value,
  subline,
  tone,
}: {
  icon: typeof ShieldCheck;
  label: string;
  value: string;
  subline: string;
  tone: "success" | "warning" | "neutral";
}) {
  const toneMap = {
    success: { bg: "var(--ar-success-bg)", fg: "var(--ar-primary)" },
    warning: { bg: "var(--ar-warning-bg)", fg: "var(--ar-secondary)" },
    neutral: { bg: "var(--ar-surface-container)", fg: "var(--ar-on-surface)" },
  } as const;
  const t = toneMap[tone];
  return (
    <div className="ar-card p-5">
      <div className="flex items-start justify-between">
        <p
          className="text-xs font-semibold uppercase tracking-wide"
          style={{ color: "var(--ar-on-surface-variant)" }}
        >
          {label}
        </p>
        <div
          className="flex h-9 w-9 items-center justify-center rounded-[10px]"
          style={{ background: t.bg, color: t.fg }}
          aria-hidden="true"
        >
          <Icon className="h-4.5 w-4.5" />
        </div>
      </div>
      <p
        className="mt-3 text-[28px] font-bold leading-tight tracking-tight"
        style={{ color: "var(--ar-on-surface)" }}
      >
        {value}
      </p>
      <p
        className="mt-1 text-xs"
        style={{ color: "var(--ar-on-surface-variant)" }}
      >
        {subline}
      </p>
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

function FarmerRow({
  farmer,
  crop,
  onViewProfile,
}: {
  farmer: Farmer;
  crop?: { crop: string; emoji: string };
  onViewProfile: () => void;
}) {
  const verification = verificationFromFarmer(farmer);
  const tier = yieldTier(farmer.totalSold);

  return (
    <tr
      className="border-b transition-colors hover:bg-[color:var(--ar-surface-container-low)]"
      style={{ borderColor: "var(--ar-outline-variant)" }}
    >
      <td className="px-5 py-3">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold"
            style={{
              background: "var(--ar-surface-container)",
              color: "var(--ar-on-surface)",
            }}
            aria-hidden="true"
          >
            {farmer.name.charAt(0)}
          </div>
          <div>
            <p
              className="text-sm font-semibold"
              style={{ color: "var(--ar-on-surface)" }}
            >
              {farmer.name}
            </p>
            <p
              className="text-xs"
              style={{ color: "var(--ar-on-surface-variant)" }}
            >
              UID: {farmer.id}
            </p>
          </div>
        </div>
      </td>
      <td className="px-5 py-3">
        <div
          className="flex items-center gap-1.5 text-sm"
          style={{ color: "var(--ar-on-surface)" }}
        >
          <MapPin
            className="h-3.5 w-3.5"
            style={{ color: "var(--ar-on-surface-variant)" }}
            aria-hidden="true"
          />
          {farmer.village}
        </div>
      </td>
      <td className="px-5 py-3">
        <div className="flex items-center gap-2">
          <span
            className="inline-flex h-7 min-w-[36px] items-center justify-center rounded-full px-2 text-xs font-semibold"
            style={{
              background:
                farmer.activeLots > 0
                  ? "var(--ar-success-bg)"
                  : "var(--ar-surface-container)",
              color:
                farmer.activeLots > 0
                  ? "var(--ar-primary)"
                  : "var(--ar-on-surface-variant)",
            }}
          >
            {String(farmer.activeLots).padStart(2, "0")}
          </span>
          <span
            className="text-xs"
            style={{ color: "var(--ar-on-surface-variant)" }}
          >
            {crop ? (
              <>
                <span className="mr-0.5" aria-hidden="true">
                  {crop.emoji}
                </span>
                {crop.crop}
              </>
            ) : farmer.activeLots === 0 ? (
              "Inactive"
            ) : (
              "—"
            )}
          </span>
        </div>
      </td>
      <td className="px-5 py-3">
        <div>
          <p
            className="text-sm font-semibold"
            style={{ color: "var(--ar-on-surface)" }}
          >
            {farmer.totalSold.toLocaleString("en-IN")} qtl
          </p>
          <p className="text-[11px]" style={{ color: tier.fg }}>
            {tier.label}
          </p>
        </div>
      </td>
      <td className="px-5 py-3">
        <VerificationPill status={verification} />
      </td>
      <td className="px-5 py-3">
        <div className="flex items-center justify-end gap-2">
          <a
            href={`tel:${farmer.phone}`}
            aria-label={`Call ${farmer.name} at ${farmer.phone}`}
            className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{
              background: "var(--ar-surface-container)",
              color: "var(--ar-on-surface)",
              outlineColor: "var(--ar-primary)",
            }}
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
          </a>
          <button
            onClick={onViewProfile}
            className="ar-btn-secondary h-9 px-3 text-xs font-semibold"
            aria-label={`View profile of ${farmer.name}`}
          >
            Profile
          </button>
        </div>
      </td>
    </tr>
  );
}

function VerificationPill({ status }: { status: VerificationStatus }) {
  const map = {
    Verified: {
      bg: "var(--ar-success-bg)",
      fg: "var(--ar-primary)",
    },
    "Pending Audit": {
      bg: "var(--ar-warning-bg)",
      fg: "var(--ar-secondary)",
    },
    Inactive: {
      bg: "var(--ar-surface-container)",
      fg: "var(--ar-on-surface-variant)",
    },
  } as const;
  const t = map[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
      style={{ background: t.bg, color: t.fg }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: t.fg }}
        aria-hidden="true"
      />
      {status}
    </span>
  );
}

function DialogRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="flex items-center justify-between gap-3 border-b pb-2"
      style={{ borderColor: "var(--ar-outline-variant)" }}
    >
      <span style={{ color: "var(--ar-on-surface-variant)" }}>{label}</span>
      <span
        className="font-medium"
        style={{ color: "var(--ar-on-surface)" }}
      >
        {value}
      </span>
    </div>
  );
}
