import { Plus } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { ProduceCard } from "@/components/ProduceCard";
import { Button } from "@/components/ui/button";
import { useT } from "@/lib/i18n";
import type { Listing } from "@/lib/mock-data";

export function MyListingsScreen({
  listings,
  onBack,
  onOpen,
  onAdd,
}: {
  listings: Listing[];
  onBack: () => void;
  onOpen: (id: string) => void;
  onAdd: () => void;
}) {
  const { t } = useT();
  return (
    <div className="flex flex-col pb-24">
      <AppHeader title={t("myListings")} subtitle={`${listings.length} ${t("total")}`} onBack={onBack} />

      <div className="space-y-3 px-4 py-4">
        {listings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
            {t("noListings")}
          </div>
        ) : (
          listings.map((l) => <ProduceCard key={l.id} listing={l} onClick={() => onOpen(l.id)} />)
        )}
      </div>

      {/* Sticky Add CTA */}
      <div className="fixed bottom-16 left-1/2 z-20 w-full max-w-md -translate-x-1/2 px-4 pb-3">
        <Button onClick={onAdd} className="h-14 w-full rounded-2xl text-base font-semibold shadow-lg">
          <Plus className="h-5 w-5" />
          {t("addNew")}
        </Button>
      </div>
    </div>
  );
}
