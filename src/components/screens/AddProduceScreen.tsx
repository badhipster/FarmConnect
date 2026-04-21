import { useState } from "react";
import { Camera, CheckCircle2 } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cropOptions, farmer, type Listing } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function AddProduceScreen({
  onBack,
  onSubmit,
}: {
  onBack: () => void;
  onSubmit: (l: Omit<Listing, "id" | "submittedDate" | "status">) => void;
}) {
  const [crop, setCrop] = useState(cropOptions[0]);
  const [qty, setQty] = useState("");
  const [unit, setUnit] = useState("quintal");
  const [readyDate, setReadyDate] = useState("");
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const canSubmit = qty.trim() && readyDate.trim();

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({
      crop: crop.name,
      emoji: crop.emoji,
      quantity: Number(qty),
      unit,
      readyDate,
      village: farmer.village,
      note: note || undefined,
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex min-h-screen flex-col">
        <AppHeader title="Listing Submitted" onBack={onBack} />
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center animate-fade-in">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-status-paid-bg">
            <CheckCircle2 className="h-10 w-10 text-status-paid" />
          </div>
          <h2 className="mt-5 text-xl font-bold text-foreground">Your produce listing is active</h2>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">
            We'll notify you on this number when a buyer is matched. Usually within 24 hours.
          </p>
          <div className="mt-6 w-full space-y-3">
            <Button onClick={onBack} className="h-12 w-full rounded-xl">Back to Home</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col pb-8">
      <AppHeader title="Add Produce" subtitle="Takes under a minute" onBack={onBack} />

      <div className="space-y-5 px-4 py-5">
        <div>
          <Label className="text-sm font-semibold">Crop</Label>
          <div className="mt-2 flex flex-wrap gap-2">
            {cropOptions.map((c) => (
              <button
                key={c.name}
                onClick={() => setCrop(c)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium transition-colors",
                  crop.name === c.name
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground",
                )}
              >
                <span>{c.emoji}</span>
                {c.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <Label htmlFor="qty" className="text-sm font-semibold">Quantity</Label>
            <Input
              id="qty"
              type="number"
              inputMode="numeric"
              placeholder="e.g. 8"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              className="mt-2 h-12 text-base"
            />
          </div>
          <div>
            <Label className="text-sm font-semibold">Unit</Label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="mt-2 h-12 w-full rounded-md border border-input bg-background px-3 text-base"
            >
              <option value="quintal">quintal</option>
              <option value="kg">kg</option>
              <option value="ton">ton</option>
            </select>
          </div>
        </div>

        <div>
          <Label htmlFor="ready" className="text-sm font-semibold">Ready by</Label>
          <Input
            id="ready"
            placeholder="e.g. 25 Apr"
            value={readyDate}
            onChange={(e) => setReadyDate(e.target.value)}
            className="mt-2 h-12 text-base"
          />
        </div>

        <div>
          <Label className="text-sm font-semibold">Village</Label>
          <Input value={farmer.village} disabled className="mt-2 h-12 text-base" />
        </div>

        <div>
          <Label className="text-sm font-semibold">Photo (optional)</Label>
          <button className="mt-2 flex h-28 w-full flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-border bg-muted/40 text-muted-foreground active:bg-muted">
            <Camera className="h-6 w-6" />
            <span className="text-sm">Add a photo of your produce</span>
          </button>
        </div>

        <div>
          <Label htmlFor="note" className="text-sm font-semibold">Note (optional)</Label>
          <Textarea
            id="note"
            placeholder="Anything buyer should know"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="mt-2"
          />
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="h-14 w-full rounded-2xl text-base font-semibold"
        >
          Submit Listing
        </Button>
      </div>
    </div>
  );
}
