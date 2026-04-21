import { useState } from "react";
import { Phone, CheckCircle2, MessageCircle } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { farmer } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const ISSUES = ["Listing help", "Pickup issue", "Payment delay", "Other"];

export function SupportScreen({ onBack }: { onBack: () => void }) {
  const [issue, setIssue] = useState(ISSUES[0]);
  const [phone, setPhone] = useState(farmer.phone);
  const [note, setNote] = useState("");
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="flex min-h-screen flex-col">
        <AppHeader title="Callback Requested" onBack={onBack} />
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center animate-fade-in">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-status-paid-bg">
            <CheckCircle2 className="h-10 w-10 text-status-paid" />
          </div>
          <h2 className="mt-5 text-xl font-bold">We'll call you back soon</h2>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">
            Our team will call <span className="font-semibold text-foreground">{phone}</span> within 30 minutes.
          </p>
          <Button onClick={onBack} className="mt-6 h-12 w-full rounded-xl">
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col pb-6">
      <AppHeader title="Support" subtitle="We're here to help" onBack={onBack} />

      <div className="space-y-5 px-4 py-4">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold">Need quick help?</div>
              <div className="text-xs text-muted-foreground">Average callback time: 15 min</div>
            </div>
          </div>
        </div>

        <div>
          <Label className="text-sm font-semibold">What do you need help with?</Label>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {ISSUES.map((i) => (
              <button
                key={i}
                onClick={() => setIssue(i)}
                className={cn(
                  "rounded-xl border px-3 py-3 text-sm font-medium transition-colors",
                  issue === i
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground",
                )}
              >
                {i}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="phone" className="text-sm font-semibold">Phone number</Label>
          <Input
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-2 h-12 text-base"
          />
        </div>

        <div>
          <Label htmlFor="snote" className="text-sm font-semibold">Tell us briefly (optional)</Label>
          <Textarea
            id="snote"
            placeholder="e.g. Pickup did not arrive yesterday"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="mt-2 min-h-[100px]"
          />
        </div>

        <Button onClick={() => setDone(true)} className="h-14 w-full rounded-2xl text-base font-semibold">
          <Phone className="h-5 w-5" />
          Request Callback
        </Button>
      </div>
    </div>
  );
}
