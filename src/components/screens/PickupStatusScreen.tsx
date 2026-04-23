import { CheckCircle2, Circle, Truck, Wallet } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import type { Order } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const STEPS: { id: Order["status"]; label: string; sublabel: string }[] = [
  { id: "Accepted", label: "Order Accepted", sublabel: "You confirmed the order" },
  { id: "Scheduled", label: "Pickup Scheduled", sublabel: "Vehicle assigned, on the way" },
  { id: "Collected", label: "Produce Collected", sublabel: "Weighed and accepted at collection point" },
];

export function PickupStatusScreen({ order, onBack }: { order: Order; onBack: () => void }) {
  const currentIdx = STEPS.findIndex((s) => s.id === order.status);
  const effectiveIdx = order.status === "Awaiting" ? -1 : currentIdx;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 pb-10">
      <AppHeader title="Pickup Status" subtitle={`Order #${order.id}`} onBack={onBack} />

      <div className="flex-1 space-y-6 px-4 py-6">
        {/* Order Details Card */}
        <div className="rounded-3xl border border-white/60 bg-white/70 p-5 shadow-sm backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary shadow-inner">
              <Truck className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-0.5">
                {order.crop} · {order.acceptedQty} {order.unit}
              </div>
              <div className="text-base font-black text-slate-900 tracking-tight">
                {order.pickupDate} · {order.pickupSlot}
              </div>
            </div>
          </div>
        </div>

        {/* Status Stepper */}
        <div className="rounded-[2.5rem] border border-white/60 bg-white/70 p-8 shadow-sm backdrop-blur-xl">
          <ol className="space-y-10 relative">
            {/* Stepper Vertical Line */}
            <div className="absolute left-[11px] top-4 bottom-4 w-[2px] bg-slate-100" />
            
            {STEPS.map((step, idx) => {
              const done = idx <= effectiveIdx;
              const current = idx === effectiveIdx;
              return (
                <li key={step.id} className="relative flex gap-5 z-10">
                  <div className="flex flex-col items-center shrink-0">
                    <div className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-full transition-all duration-500",
                      done ? "bg-emerald-500 shadow-lg shadow-emerald-500/20" : 
                      current ? "bg-primary shadow-lg shadow-primary/20 scale-110" : "bg-white border-2 border-slate-100"
                    )}>
                      {done ? (
                        <CheckCircle2 className="h-4 w-4 text-white" />
                      ) : (
                        <div className={cn("h-2 w-2 rounded-full", current ? "bg-white" : "bg-slate-200")} />
                      )}
                    </div>
                  </div>
                  <div className="pt-0.5">
                    <div className={cn(
                      "text-[15px] font-black tracking-tight leading-none mb-1.5 transition-colors duration-300", 
                      done ? "text-slate-900" : current ? "text-primary" : "text-slate-400"
                    )}>
                      {step.label}
                    </div>
                    <div className="text-xs font-bold text-slate-400 leading-relaxed uppercase tracking-tight">{step.sublabel}</div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Payout Hint */}
        <div className="group flex items-center gap-4 rounded-3xl border border-amber-200/50 bg-amber-50/50 p-5 shadow-sm backdrop-blur-xl transition-all">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm border border-amber-200/20 text-amber-600">
            <Wallet className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[13px] font-black text-slate-800 leading-snug">
              Next: Payment processed after pickup
            </div>
            <p className="mt-0.5 text-[11px] font-bold text-slate-400 uppercase tracking-tight">Funds reach bank in 4-6 hours</p>
          </div>
        </div>
      </div>
    </div>
  );
}
