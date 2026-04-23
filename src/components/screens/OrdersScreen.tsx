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
    <div className="flex flex-col min-h-screen bg-slate-50/50 pb-10">
      <AppHeader title={t("ordersAndPickup")} onBack={onBack} />

      <div className="flex-1 space-y-8 px-4 py-6">
        {orders.length === 0 ? (
          <div className="rounded-[2.5rem] border border-dashed border-slate-200 bg-white/50 p-12 text-center backdrop-blur-sm shadow-inner flex flex-col items-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-gradient-to-br from-slate-100 to-slate-200 shadow-sm border border-white">
              <Truck className="h-10 w-10 text-slate-400" />
            </div>
            <div className="text-xl font-black text-slate-900 tracking-tight">{t("noOrders")}</div>
            <p className="mt-3 text-sm font-medium text-slate-500 leading-relaxed max-w-[200px]">{t("noOrdersSub")}</p>
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
    <div className="space-y-4">
      <h2 className="px-1 text-[11px] font-black uppercase tracking-[0.15em] text-slate-400">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function OrderCard({ order, onClick }: { order: Order; onClick: () => void }) {
  const { t, tCrop } = useT();
  return (
    <button
      onClick={onClick}
      className="group w-full rounded-3xl border border-white/60 bg-white/70 p-5 text-left shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:bg-white active:scale-[0.98]"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-secondary/80 to-secondary border border-secondary/20 shadow-inner group-hover:scale-105 transition-transform">
          {order.status === "Collected" ? (
            <PackageCheck className="h-7 w-7 text-status-paid" />
          ) : (
            <span className="text-3xl drop-shadow-sm">{order.emoji}</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-[17px] font-black text-slate-900 tracking-tight group-hover:text-primary transition-colors">{tCrop(order.crop)}</h3>
              <div className="mt-0.5 text-sm font-black text-primary">
                {order.acceptedQty} {order.unit}
              </div>
            </div>
            <StatusPill status={order.status} />
          </div>
        </div>
      </div>
      
      <div className="mt-4 space-y-2 border-t border-slate-100/60 pt-4">
        <Row icon={Truck} label={`${order.pickupDate} · ${order.pickupSlot}`} />
        <Row icon={MapPin} label={order.collectionPoint} />
      </div>
      
      <div className="mt-5 flex items-center justify-between bg-slate-50/50 rounded-2xl p-3 ring-1 ring-slate-100">
        <div>
          <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">{t("expectedPayout")}</div>
          <div className="text-lg font-black text-slate-900 tracking-tight">₹{order.expectedPayout.toLocaleString("en-IN")}</div>
        </div>
        <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-slate-100 shadow-sm transition-transform group-hover:translate-x-1">
          <ChevronRight className="h-5 w-5 text-slate-300" />
        </div>
      </div>
    </button>
  );
}

function Row({ icon: Icon, label }: { icon: typeof Truck; label: string }) {
  return (
    <div className="flex items-center gap-2.5 text-[12px] font-bold text-slate-500">
      <Icon className="h-3.5 w-3.5 shrink-0 text-slate-400" />
      <span className="truncate">{label}</span>
    </div>
  );
}
