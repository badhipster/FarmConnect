import { ChevronRight, TrendingUp, HelpCircle, FileText, LogOut } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { farmer } from "@/lib/mock-data";

export function MoreScreen({
  onSummary,
  onSupport,
}: {
  onSummary: () => void;
  onSupport: () => void;
}) {
  return (
    <div className="flex flex-col pb-6">
      <AppHeader title="More" />

      <div className="px-4 py-4">
        <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-br from-primary to-primary-glow p-5 text-primary-foreground shadow-md">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-2xl font-bold">
            R
          </div>
          <div>
            <div className="text-lg font-bold">{farmer.name}</div>
            <div className="text-sm opacity-90">{farmer.village}</div>
            <div className="text-xs opacity-80">{farmer.phone}</div>
          </div>
        </div>

        <div className="mt-4 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <Item icon={TrendingUp} label="Weekly Summary" onClick={onSummary} />
          <Item icon={HelpCircle} label="Support / Request Callback" onClick={onSupport} />
          <Item icon={FileText} label="Terms & Privacy" onClick={() => {}} />
          <Item icon={LogOut} label="Logout" onClick={() => {}} danger />
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">FarmConnect · v0.1 prototype</p>
      </div>
    </div>
  );
}

function Item({
  icon: Icon,
  label,
  onClick,
  danger,
}: {
  icon: typeof TrendingUp;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button onClick={onClick} className="flex w-full items-center gap-3 px-4 py-4 text-left active:bg-muted">
      <Icon className={`h-5 w-5 ${danger ? "text-destructive" : "text-muted-foreground"}`} />
      <span className={`flex-1 text-sm font-medium ${danger ? "text-destructive" : "text-foreground"}`}>{label}</span>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </button>
  );
}
