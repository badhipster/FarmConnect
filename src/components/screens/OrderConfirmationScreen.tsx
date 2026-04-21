import { Calendar, Clock, MapPin, IndianRupee, Phone } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/StatusPill";
import type { Order } from "@/lib/mock-data";

export function OrderConfirmationScreen({
  order,
  onBack,
  onAccept,
  onSupport,
}: {
  order: Order;
  onBack: () => void;
  onAccept: () => void;
  onSupport: () => void;
}) {
  const isAwaiting = order.status === "Awaiting";

  return (
    <div className="flex flex-col pb-6">
      <AppHeader title="Order Details" subtitle={`#${order.id}`} onBack={onBack} />

      <div className="space-y-4 px-4 py-4">
        <div className="rounded-2xl border-2 border-primary/30 bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-3xl">
                {order.emoji}
              </div>
              <div>
                <h2 className="text-xl font-bold">{order.crop}</h2>
                <p className="text-sm text-muted-foreground">
                  Buyer accepted {order.acceptedQty} {order.unit}
                </p>
              </div>
            </div>
            <StatusPill status={order.status} />
          </div>

          <div className="mt-5 grid gap-3 rounded-xl bg-muted/50 p-4 text-sm">
            <Row icon={Calendar} label="Pickup date" value={order.pickupDate} />
            <Row icon={Clock} label="Time slot" value={order.pickupSlot} />
            <Row icon={MapPin} label="Collection point" value={order.collectionPoint} />
          </div>

          <div className="mt-4 flex items-center justify-between rounded-xl bg-status-paid-bg p-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-status-paid">Expected payout</div>
              <div className="text-xs text-muted-foreground">Paid within 24 hours of pickup</div>
            </div>
            <div className="flex items-center text-2xl font-bold text-status-paid">
              <IndianRupee className="h-5 w-5" />
              {order.expectedPayout.toLocaleString("en-IN")}
            </div>
          </div>
        </div>

        {isAwaiting ? (
          <>
            <Button onClick={onAccept} className="h-14 w-full rounded-2xl text-base font-semibold">
              Accept Order
            </Button>
            <Button onClick={onSupport} variant="outline" className="h-12 w-full rounded-xl">
              <Phone className="h-4 w-4" />
              Need Help
            </Button>
          </>
        ) : (
          <div className="rounded-2xl border border-status-paid/30 bg-status-paid-bg p-4 text-center text-sm font-medium text-status-paid">
            ✓ Order accepted. Track pickup status from your home screen.
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ icon: Icon, label, value }: { icon: typeof Calendar; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
      <div className="flex-1">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="font-medium text-foreground">{value}</div>
      </div>
    </div>
  );
}
