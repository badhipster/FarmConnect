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
    <div className="flex flex-col min-h-screen bg-slate-50/50 pb-10">
      <AppHeader title={t("payments")} onBack={onBack} onHelp={onSupport} />

      <div className="flex-1 space-y-6 px-4 py-6">
        {/* Payment Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-[2rem] border border-white/60 bg-white/70 p-5 shadow-sm backdrop-blur-xl">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100/50">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t("paid")}</span>
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">₹{paid.toLocaleString("en-IN")}</div>
          </div>
          <div className="rounded-[2rem] border border-white/60 bg-white/70 p-5 shadow-sm backdrop-blur-xl">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100/50">
                <Clock className="h-4 w-4 text-amber-600" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t("pending")}</span>
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">₹{pending.toLocaleString("en-IN")}</div>
          </div>
        </div>

        {/* Bank Account / Payout Info */}
        {payout && (
          <div className="group flex items-center gap-4 rounded-3xl border border-white/60 bg-white/70 p-5 shadow-sm backdrop-blur-xl transition-all hover:bg-white">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary shadow-inner">
              <Landmark className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{t("bankAccount")}</div>
              <div className="truncate text-[15px] font-black text-slate-900">
                {payout.method === "upi"
                  ? payout.upi
                  : `${payout.holder} · ••${payout.accountNumber?.slice(-4)}`}
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-700 shadow-sm border border-emerald-200/20">
                {lang === "hi" ? "सक्रिय" : "Active"}
              </span>
            </div>
          </div>
        )}

        {/* Recent Activity List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-400">{t("recentActivity")}</h2>
            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{payments.length} items</span>
          </div>
          
          <div className="space-y-4">
            {payments.map((p) => (
              <div 
                key={p.id} 
                className="group relative rounded-3xl border border-white/60 bg-white/70 p-5 shadow-sm backdrop-blur-xl transition-all duration-300 hover:bg-white active:scale-[0.98]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-[17px] font-black text-slate-900 tracking-tight group-hover:text-primary transition-colors">{tCrop(p.crop)}</h3>
                    <div className="mt-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                      <span className="bg-slate-100 px-1.5 py-0.5 rounded">#{p.orderId}</span>
                      <span>{p.timestamp}</span>
                    </div>
                  </div>
                  <StatusPill status={p.status} />
                </div>
                
                <div className="mt-5 flex items-end justify-between border-t border-slate-100/60 pt-4">
                  <div className="text-2xl font-black text-slate-900 tracking-tight">₹{p.amount.toLocaleString("en-IN")}</div>
                  {p.upiRef && (
                    <div className="text-right">
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">UPI REF</div>
                      <div className="font-mono text-[11px] font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                        {p.upiRef}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Support Section */}
        <div className="rounded-[2.5rem] border border-primary/20 bg-primary/5 p-6 shadow-inner relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Phone className="h-24 w-24 -rotate-12" />
          </div>
          <div className="relative z-10">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm border border-primary/10">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-lg font-black text-slate-900 tracking-tight">{t("paymentIssue")}</div>
                <p className="mt-1 text-sm font-medium text-slate-500 leading-snug">{t("callUs")}</p>
              </div>
            </div>
            <Button 
              onClick={onSupport} 
              className="mt-6 h-14 w-full rounded-2xl bg-primary text-white font-black uppercase tracking-wider shadow-lg shadow-primary/20 hover:shadow-xl hover:translate-y-[-2px] transition-all flex items-center justify-center gap-3"
            >
              {t("callback")}
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
