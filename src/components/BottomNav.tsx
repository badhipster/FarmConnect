import { Home, Leaf, Wallet, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export type NavTab = "home" | "listings" | "payments" | "more";

const tabs: { id: NavTab; label: string; icon: typeof Home }[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "listings", label: "Listings", icon: Leaf },
  { id: "payments", label: "Payments", icon: Wallet },
  { id: "more", label: "More", icon: MoreHorizontal },
];

export function BottomNav({ active, onChange }: { active: NavTab; onChange: (t: NavTab) => void }) {
  return (
    <nav className="sticky bottom-0 z-10 grid grid-cols-4 border-t border-border bg-card/95 backdrop-blur">
      {tabs.map((t) => {
        const Icon = t.icon;
        const isActive = active === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={cn(
              "flex flex-col items-center gap-1 py-2.5 text-xs font-medium transition-colors",
              isActive ? "text-primary" : "text-muted-foreground",
            )}
          >
            <Icon className={cn("h-5 w-5", isActive && "fill-primary/10")} strokeWidth={isActive ? 2.5 : 2} />
            {t.label}
          </button>
        );
      })}
    </nav>
  );
}
