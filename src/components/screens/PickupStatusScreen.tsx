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
    <div className="flex flex-col pb-6">
      <AppHeader title="Pickup Status" subtitle={`Order #${order.id}`} onBack={onBack} />

      <div className="space-y-4 px-4 py-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">{order.crop} · {order.acceptedQty} {order.unit}</div>
              <div className="text-base font-semibold">{order.pickupDate}, {order.pickupSlot}</div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <ol className="space-y-5">
            {STEPS.map((step, idx) => {
              const done = idx <= effectiveIdx;
              const current = idx === effectiveIdx;
              return (
                <li key={step.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    {done ? (
                      <CheckCircle2 className="h-6 w-6 text-status-paid" />
                    ) : (
                      <Circle className={cn("h-6 w-6", current ? "text-primary" : "text-muted-foreground/40")} />
                    )}
                    {idx < STEPS.length - 1 && (
                      <div className={cn("mt-1 h-8 w-0.5", done ? "bg-status-paid" : "bg-border")} />
                    )}
                  </div>
                  <div className="pb-1">
                    <div className={cn("font-semibold", done ? "text-foreground" : "text-muted-foreground")}>
                      {step.label}
                    </div>
                    <div className="text-xs text-muted-foreground">{step.sublabel}</div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-status-processing/30 bg-status-processing-bg p-4">
          <Wallet className="h-5 w-5 text-status-processing" />
          <div className="text-sm font-medium text-foreground">
            Next: Payment will be processed after pickup
          </div>
        </div>
      </div>
    </div>
  );
}
