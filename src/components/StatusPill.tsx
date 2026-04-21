import { cn } from "@/lib/utils";

type Status =
  | "Submitted"
  | "Active"
  | "Matched"
  | "Sold"
  | "Expired"
  | "Pending"
  | "Processing"
  | "Paid"
  | "Awaiting"
  | "Accepted"
  | "Scheduled"
  | "Collected";

const styles: Record<Status, string> = {
  Submitted: "bg-status-submitted-bg text-status-submitted",
  Active: "bg-status-active-bg text-status-active",
  Matched: "bg-status-matched-bg text-status-matched",
  Sold: "bg-status-paid-bg text-status-paid",
  Expired: "bg-status-expired-bg text-status-expired",
  Pending: "bg-status-pending-bg text-status-pending",
  Processing: "bg-status-processing-bg text-status-processing",
  Paid: "bg-status-paid-bg text-status-paid",
  Awaiting: "bg-status-pending-bg text-status-pending",
  Accepted: "bg-status-matched-bg text-status-matched",
  Scheduled: "bg-status-processing-bg text-status-processing",
  Collected: "bg-status-paid-bg text-status-paid",
};

export function StatusPill({ status, className }: { status: Status; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
        styles[status],
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
