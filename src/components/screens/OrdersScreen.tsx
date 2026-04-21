import { Truck, MapPin, ChevronRight, PackageCheck } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { StatusPill } from "@/components/StatusPill";
import { useT } from "@/lib/i18n";
import type { Order } from "@/lib/mock-data";

export function OrdersScreen({
  orders,
  onBack,
  onOpen,
}: {
  orders: Order[];
  onBack: () => void;
  onOpen: (orderId: string) => void;
}) {
  const { t, tCrop } = useT();
  const active = orders.filter((o) => o.status !== "Collected");
  const past = orders.filter((o) => o.status === "Collected");

  return (
    <div className="flex flex-col pb-6">
      <AppHeader title={t("ordersAndPickup")} onBack={onBack} />

      <div className="space-y-5 px-4 py-4">
        {orders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
              <Truck className="h-7 w-7 text-muted-foreground" />
            </div>
            <div className="text-base font-bold text-foreground">{t("noOrders")}</div>
            <p className="mt-1 text-sm text-muted-foreground">{t("noOrdersSub")}</p>
          </div>
        ) : (
          <>
            {active.length > 0 && (
              <Section title={t("upcomingPickup")}>
                {active.map((o) => (
                  <OrderCard key={o.id} order={o} onClick={() => onOpen(o.id)} />
                ))}
              </Section>
            )}
            {past.length > 0 && (
              <Section title={t("recentActivity")}>
                {past.map((o) => (
                  <OrderCard key={o.id} order={o} onClick={() => onOpen(o.id)} />
                ))}
              </Section>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-2 px-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">{title}</h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function OrderCard({ order, onClick }: { order: Order; onClick: () => void }) {
  const { t, tCrop } = useT();
  return (
    <button
      onClick={onClick}
      className="w-full rounded-2xl border border-border bg-card p-4 text-left shadow-sm transition-colors active:bg-muted"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary text-2xl">
          {order.status === "Collected" ? <PackageCheck className="h-6 w-6 text-status-paid" /> : order.emoji}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="text-base font-bold text-foreground">{tCrop(order.crop)}</div>
              <div className="text-sm font-semibold text-primary">
                {order.acceptedQty} {order.unit}
              </div>
            </div>
            <StatusPill status={order.status} />
          </div>
        </div>
      </div>
      <div className="mt-3 space-y-1.5 border-t border-border pt-3">
        <Row icon={Truck} label={`${order.pickupDate} · ${order.pickupSlot}`} />
        <Row icon={MapPin} label={order.collectionPoint} />
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div>
          <div className="text-[11px] text-muted-foreground">{t("expectedPayout")}</div>
          <div className="text-lg font-bold text-foreground">₹{order.expectedPayout.toLocaleString("en-IN")}</div>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      </div>
    </button>
  );
}

function Row({ icon: Icon, label }: { icon: typeof Truck; label: string }) {
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <Icon className="h-3.5 w-3.5 shrink-0" />
      <span className="truncate">{label}</span>
    </div>
  );
}
