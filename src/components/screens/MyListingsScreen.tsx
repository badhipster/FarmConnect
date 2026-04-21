import { Plus } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { ProduceCard } from "@/components/ProduceCard";
import { Button } from "@/components/ui/button";
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
  return (
    <div className="flex flex-col pb-6">
      <AppHeader title="My Listings" subtitle={`${listings.length} total`} onBack={onBack} />

      <div className="space-y-3 px-4 py-4">
        {listings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
            No listings yet. Tap below to add your first.
          </div>
        ) : (
          listings.map((l) => <ProduceCard key={l.id} listing={l} onClick={() => onOpen(l.id)} />)
        )}

        <Button onClick={onAdd} variant="outline" className="h-12 w-full rounded-xl">
          <Plus className="h-4 w-4" />
          Add new produce
        </Button>
      </div>
    </div>
  );
}
