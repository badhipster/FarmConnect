import { Home, Leaf, Truck, Wallet, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n";

export type NavTab = "home" | "listings" | "orders" | "payments" | "more";

export function BottomNav({ active, onChange }: { active: NavTab; onChange: (t: NavTab) => void }) {
  const { t } = useT();
  const tabs: { id: NavTab; label: string; icon: typeof Home }[] = [
    { id: "home", label: t("myListings").split(" ")[0] === "मेरी" ? "होम" : "Home", icon: Home },
    { id: "listings", label: t("myListings"), icon: Leaf },
    { id: "orders", label: t("orders"), icon: Truck },
    { id: "payments", label: t("payments"), icon: Wallet },
    { id: "more", label: "More", icon: MoreHorizontal },
  ];
  return (
    <nav className="sticky bottom-0 z-10 grid grid-cols-5 border-t border-border bg-card/95 backdrop-blur">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors",
              isActive ? "text-primary" : "text-muted-foreground",
            )}
          >
            <Icon className={cn("h-5 w-5", isActive && "fill-primary/10")} strokeWidth={isActive ? 2.5 : 2} />
            <span className="truncate">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
