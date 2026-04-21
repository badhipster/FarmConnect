import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useT } from "@/lib/i18n";

export function OnboardingCompleteScreen({ onFinish }: { onFinish: () => void }) {
  const { t } = useT();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-10 text-center animate-fade-in">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-status-paid-bg">
        <CheckCircle2 className="h-12 w-12 text-status-paid" />
      </div>
      <h1 className="mt-6 text-3xl font-bold text-foreground">{t("allSetTitle")}</h1>
      <p className="mt-2 max-w-xs text-sm text-muted-foreground">{t("allSetSub")}</p>
      <Button onClick={onFinish} className="mt-8 h-14 w-full rounded-2xl text-base font-semibold">
        {t("goToHome")}
      </Button>
    </div>
  );
}
