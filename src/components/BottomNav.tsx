import { Home, Leaf, Truck, Wallet, MoreHorizontal, Users, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n";

export type NavTab = "home" | "listings" | "orders" | "payments" | "more" | "network" | "summary";

export function BottomNav({
  active,
  onChange,
  role = "farmer",
}: {
  active: NavTab;
  onChange: (t: NavTab) => void;
  role?: "farmer" | "fpo_coordinator";
}) {
  const { t } = useT();

  const farmerTabs: { id: NavTab; label: string; icon: typeof Home }[] = [
    { id: "home", label: "Home", icon: Home },
    { id: "listings", label: t("myListings"), icon: Leaf },
    { id: "orders", label: t("orders"), icon: Truck },
    { id: "payments", label: t("payments"), icon: Wallet },
    { id: "more", label: "More", icon: MoreHorizontal },
  ];

  const fpoTabs: { id: NavTab; label: string; icon: typeof Home }[] = [
    { id: "home",     label: "Dashboard",  icon: Home },
    { id: "listings", label: "Pipeline",   icon: Users },
    { id: "network",  label: "Farmers",    icon: UserPlus },
    { id: "summary",  label: "Summary",    icon: Wallet },
    { id: "more",     label: "More",       icon: MoreHorizontal },
  ];

  const tabs = role === "fpo_coordinator" ? fpoTabs : farmerTabs;
  const colCount = tabs.length;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-2xl border-t border-slate-200/60 pb-safe shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
      <nav
        className="w-full max-w-md mx-auto"
        style={{ display: "grid", gridTemplateColumns: `repeat(${colCount}, 1fr)` }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cn(
                "flex flex-col items-center gap-1.5 py-3 transition-all duration-200 active:scale-95",
                isActive ? "text-primary" : "text-slate-500 hover:text-slate-800",
              )}
            >
              <div className={cn(
                "relative flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-300",
                isActive && "bg-primary/10 shadow-sm"
              )}>
                <Icon className={cn("h-5 w-5", isActive ? "text-primary flex-shrink-0" : "text-slate-500")} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={cn(
                "text-[10px] tracking-wide truncate transition-all duration-300",
                isActive ? "font-black" : "font-semibold"
              )}>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
