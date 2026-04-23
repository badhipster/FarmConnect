import { useState } from "react";
import { Phone, CheckCircle2, MessageCircle } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const ISSUES = ["Listing help", "Pickup issue", "Payment delay", "Other"];

export function SupportScreen({ onBack }: { onBack: () => void }) {
  const [issue, setIssue] = useState(ISSUES[0]);
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50/50">
        <AppHeader title="Callback Requested" onBack={onBack} />
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center animate-fade-in">
          <div className="flex h-24 w-24 items-center justify-center rounded-[2.5rem] bg-gradient-to-br from-status-paid-bg to-emerald-100 shadow-sm border border-emerald-200/50 relative">
            <div className="absolute inset-0 bg-emerald-400 opacity-20 blur-2xl rounded-full scale-75 animate-pulse" />
            <CheckCircle2 className="h-12 w-12 text-status-paid relative z-10" />
          </div>
          <h2 className="mt-8 text-2xl font-black tracking-tight text-slate-900">We'll call you back soon</h2>
          <p className="mt-3 max-w-xs text-[15px] font-medium text-slate-500 leading-relaxed">
            Our team will call <span className="font-black text-primary">{phone}</span> within 15-30 minutes.
          </p>
          <div className="mt-10 w-full max-w-sm">
            <Button onClick={onBack} className="h-14 w-full rounded-2xl font-bold text-[15px] shadow-lg shadow-primary/20">
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 pb-10">
      <AppHeader title="Support" subtitle="We're here to help" onBack={onBack} />

      <div className="flex-1 space-y-6 px-4 py-6">
        <div className="rounded-3xl border border-white/60 bg-white/70 p-5 shadow-sm backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary shadow-inner">
              <MessageCircle className="h-6 w-6" />
            </div>
            <div>
              <div className="text-[15px] font-black text-slate-900">Need quick help?</div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Average callback: 15 min</div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-sm backdrop-blur-xl space-y-5">
          <div>
            <Label className="text-[13px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-4 block">What do you need help with?</Label>
            <div className="grid grid-cols-2 gap-3">
              {ISSUES.map((i) => (
                <button
                  key={i}
                  onClick={() => setIssue(i)}
                  className={cn(
                    "rounded-2xl border px-4 py-4 text-sm font-black transition-all duration-300 active:scale-95",
                    issue === i
                      ? "border-primary bg-primary text-white shadow-lg shadow-primary/20"
                      : "border-slate-100 bg-slate-50/50 text-slate-600 hover:bg-slate-50",
                  )}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="phone" className="text-[13px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-3 block">Phone number</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 text-[15px] font-bold text-slate-900 focus:bg-white transition-all placeholder:text-slate-300"
            />
          </div>

          <div>
            <Label htmlFor="snote" className="text-[13px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-3 block">Tell us briefly (optional)</Label>
            <Textarea
              id="snote"
              placeholder="e.g. Pickup did not arrive yesterday"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="rounded-2xl border-slate-100 bg-slate-50/50 min-h-[120px] text-[15px] font-medium text-slate-900 focus:bg-white transition-all placeholder:text-slate-300 p-4"
            />
          </div>
        </div>

        <div className="pt-2">
          <Button onClick={() => setDone(true)} className="h-16 w-full rounded-2xl text-base font-black uppercase tracking-wider shadow-lg shadow-primary/20 transition-all hover:translate-y-[-2px] flex items-center justify-center gap-3">
            <Phone className="h-5 w-5" />
            Request Callback
          </Button>
        </div>
      </div>
    </div>
  );
}

