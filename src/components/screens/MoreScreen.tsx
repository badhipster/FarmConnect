import { ChevronRight, TrendingUp, HelpCircle, FileText, LogOut, Users, Languages } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { useT } from "@/lib/i18n";

export function MoreScreen({
  name,
  village,
  phone,
  onSummary,
  onSupport,
  onFpoGroup,
  showFpo,
}: {
  name: string;
  village: string;
  phone: string;
  onSummary: () => void;
  onSupport: () => void;
  onFpoGroup: () => void;
  showFpo: boolean;
}) {
  const { t, lang, setLang } = useT();
  return (
    <div className="flex flex-col pb-6">
      <AppHeader title={lang === "hi" ? "अधिक" : "More"} />

      <div className="px-4 py-4">
        <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-br from-primary to-primary-glow p-5 text-primary-foreground shadow-md">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-2xl font-bold">
            {name.charAt(0)}
          </div>
          <div>
            <div className="text-lg font-bold">{name}</div>
            <div className="text-sm opacity-90">{village}</div>
            <div className="text-xs opacity-80">{phone}</div>
          </div>
        </div>

        <div className="mt-4 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          {showFpo && <Item icon={Users} label={t("fpoGroup")} onClick={onFpoGroup} />}
          <Item icon={TrendingUp} label={t("weeklySummary")} onClick={onSummary} />
          <Item
            icon={Languages}
            label={lang === "hi" ? "Switch to English" : "हिन्दी में बदलें"}
            onClick={() => setLang(lang === "en" ? "hi" : "en")}
          />
          <Item icon={HelpCircle} label={t("callback")} onClick={onSupport} />
          <Item icon={FileText} label={lang === "hi" ? "नियम और गोपनीयता" : "Terms & Privacy"} onClick={() => {}} />
          <Item icon={LogOut} label={lang === "hi" ? "लॉगआउट" : "Logout"} onClick={() => {}} danger />
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">FarmConnect · v0.2 prototype</p>
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
