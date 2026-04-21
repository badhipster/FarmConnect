import { Phone, Landmark, CheckCircle2, Clock, ChevronRight } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { StatusPill } from "@/components/StatusPill";
import { Button } from "@/components/ui/button";
import { useT } from "@/lib/i18n";
import type { Payment } from "@/lib/mock-data";
import type { PayoutData } from "./PayoutSetupScreen";

export function PaymentTrackingScreen({
  payments,
  payout,
  onBack,
  onSupport,
}: {
  payments: Payment[];
  payout: PayoutData | null;
  onBack: () => void;
  onSupport: () => void;
}) {
  const { t, tCrop, lang } = useT();
  const paid = payments.filter((p) => p.status === "Paid").reduce((s, p) => s + p.amount, 0);
  const pending = payments.filter((p) => p.status !== "Paid").reduce((s, p) => s + p.amount, 0);

  return (
    <div className="flex flex-col pb-6">
      <AppHeader title={t("payments")} onBack={onBack} onHelp={onSupport} />

      <div className="grid grid-cols-2 gap-3 px-4 py-4">
        <div className="rounded-2xl border border-status-paid/20 bg-status-paid-bg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-status-paid" />
            <span className="text-xs font-bold uppercase text-status-paid">{t("paid")}</span>
          </div>
          <div className="mt-2 text-2xl font-bold text-foreground">₹{paid.toLocaleString("en-IN")}</div>
        </div>
        <div className="rounded-2xl border border-status-pending/20 bg-status-pending-bg p-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-status-pending" />
            <span className="text-xs font-bold uppercase text-status-pending">{t("pending")}</span>
          </div>
          <div className="mt-2 text-2xl font-bold text-foreground">₹{pending.toLocaleString("en-IN")}</div>
        </div>
      </div>

      {payout && (
        <div className="mx-4 flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Landmark className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-medium text-muted-foreground">{t("bankAccount")}</div>
            <div className="truncate text-sm font-bold text-foreground">
              {payout.method === "upi"
                ? payout.upi
                : `${payout.holder} · ••${payout.accountNumber?.slice(-4)}`}
            </div>
          </div>
          <span className="rounded-full bg-status-paid-bg px-2 py-1 text-[10px] font-bold uppercase text-status-paid">
            {lang === "hi" ? "सक्रिय" : "Active"}
          </span>
        </div>
      )}

      <div className="px-4 py-5">
        <h2 className="mb-3 px-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">
          {t("recentActivity")}
        </h2>
        <div className="space-y-3">
          {payments.map((p) => (
            <div key={p.id} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-base font-bold text-foreground">{tCrop(p.crop)}</div>
                  <div className="text-xs text-muted-foreground">#{p.orderId} · {p.timestamp}</div>
                </div>
                <StatusPill status={p.status} />
              </div>
              <div className="mt-3 flex items-end justify-between">
                <div className="text-2xl font-bold text-foreground">₹{p.amount.toLocaleString("en-IN")}</div>
                {p.upiRef && (
                  <div className="text-right text-[11px] text-muted-foreground">
                    <div className="font-semibold">UPI</div>
                    <div className="font-mono">{p.upiRef}</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-4 rounded-2xl border-2 border-accent/30 bg-accent/10 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <Phone className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-bold text-foreground">{t("paymentIssue")}</div>
            <div className="text-xs text-muted-foreground">{t("callUs")}</div>
          </div>
        </div>
        <Button onClick={onSupport} className="mt-3 h-12 w-full rounded-xl bg-accent text-accent-foreground hover:bg-accent/90">
          {t("callback")}
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
