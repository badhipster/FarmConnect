import { Sprout, Users } from "lucide-react";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export type Role = "farmer" | "fpo";

export function RoleSelectScreen({ onSelect }: { onSelect: (r: Role) => void }) {
  const { t, lang, setLang } = useT();
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex items-center justify-between px-5 pt-6">
        <div className="text-2xl font-bold text-primary">FarmConnect</div>
        <button
          onClick={() => setLang(lang === "en" ? "hi" : "en")}
          className="rounded-full bg-muted px-3 py-1.5 text-xs font-bold text-foreground"
        >
          {lang === "en" ? "हिं" : "EN"}
        </button>
      </div>
      <div className="flex-1 px-5 pt-10">
        <h1 className="text-3xl font-bold text-foreground">{t("rolePickTitle")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("rolePickSub")}</p>

        <div className="mt-8 space-y-4">
          <RoleCard
            icon={Sprout}
            title={t("roleFarmer")}
            desc={t("roleFarmerDesc")}
            onClick={() => onSelect("farmer")}
          />
          <RoleCard icon={Users} title={t("roleFpo")} desc={t("roleFpoDesc")} onClick={() => onSelect("fpo")} />
        </div>
      </div>
    </div>
  );
}

function RoleCard({
  icon: Icon,
  title,
  desc,
  onClick,
}: {
  icon: typeof Sprout;
  title: string;
  desc: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-4 rounded-2xl border-2 border-border bg-card p-5 text-left shadow-sm transition-all",
        "active:border-primary active:bg-primary/5",
      )}
    >
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Icon className="h-7 w-7" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-lg font-bold text-foreground">{title}</div>
        <div className="mt-0.5 text-sm text-muted-foreground">{desc}</div>
      </div>
    </button>
  );
}
