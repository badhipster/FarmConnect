import { IndianRupee, Phone, Copy, CheckCircle2 } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { StatusPill } from "@/components/StatusPill";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { Payment } from "@/lib/mock-data";

export function PaymentTrackingScreen({
  payments,
  onBack,
  onSupport,
}: {
  payments: Payment[];
  onBack: () => void;
  onSupport: () => void;
}) {
  const { toast } = useToast();
  const totalPending = payments.filter((p) => p.status !== "Paid").reduce((s, p) => s + p.amount, 0);
  const totalPaid = payments.filter((p) => p.status === "Paid").reduce((s, p) => s + p.amount, 0);

  return (
    <div className="flex flex-col pb-6">
      <AppHeader title="Payments" subtitle="Your payouts and proof" onBack={onBack} />

      <div className="space-y-4 px-4 py-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="text-xs font-medium text-muted-foreground">Paid this month</div>
            <div className="mt-1 flex items-center text-xl font-bold text-status-paid">
              <IndianRupee className="h-4 w-4" />
              {totalPaid.toLocaleString("en-IN")}
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="text-xs font-medium text-muted-foreground">Pending</div>
            <div className="mt-1 flex items-center text-xl font-bold text-status-pending">
              <IndianRupee className="h-4 w-4" />
              {totalPending.toLocaleString("en-IN")}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {payments.map((p) => (
            <div key={p.id} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-sm text-muted-foreground">Order #{p.orderId} · {p.crop}</div>
                  <div className="mt-1 flex items-center text-2xl font-bold">
                    <IndianRupee className="h-5 w-5" />
                    {p.amount.toLocaleString("en-IN")}
                  </div>
                </div>
                <StatusPill status={p.status} />
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-sm">
                <div className="text-muted-foreground">{p.timestamp}</div>
                {p.upiRef ? (
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(p.upiRef!);
                      toast({ title: "Reference copied", description: p.upiRef });
                    }}
                    className="flex items-center gap-1.5 font-mono text-xs font-medium text-primary"
                  >
                    {p.upiRef}
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <span className="text-xs text-muted-foreground">Reference soon</span>
                )}
              </div>

              {p.status === "Paid" && (
                <div className="mt-3 flex items-center gap-2 rounded-lg bg-status-paid-bg px-3 py-2 text-xs font-medium text-status-paid">
                  <CheckCircle2 className="h-4 w-4" />
                  Credited to your UPI account
                </div>
              )}
            </div>
          ))}
        </div>

        <Button onClick={onSupport} variant="outline" className="h-12 w-full rounded-xl">
          <Phone className="h-4 w-4" />
          Payment issue? Request Callback
        </Button>
      </div>
    </div>
  );
}
