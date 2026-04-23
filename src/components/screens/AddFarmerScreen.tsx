import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Phone, MapPin } from "lucide-react";

export function AddFarmerScreen({
  onBack,
  onSubmit,
}: {
  onBack: () => void;
  onSubmit: (f: { name: string; phone: string; village: string }) => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [village, setVillage] = useState("");

  const valid = name.trim() && phone.trim().length >= 10 && village.trim();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/50 pb-10">
      <AppHeader title="Register Farmer" subtitle="Add a farmer to your network" onBack={onBack} />

      <div className="flex-1 space-y-6 px-4 py-8">
        <div className="rounded-[2rem] border border-white/60 bg-white/70 p-6 shadow-sm backdrop-blur-xl space-y-8">
          
          <div className="space-y-6">
            <div>
              <Label className="text-[13px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-3 flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Farmer's Full Name
              </Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Ramesh Kumar"
                className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 text-[15px] font-bold text-slate-900 focus:bg-white transition-all placeholder:text-slate-300"
              />
            </div>

            <div>
              <Label className="text-[13px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-3 flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                Mobile Number
              </Label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, "").slice(0, 10))}
                placeholder="98XXXXXXXX"
                inputMode="numeric"
                className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 text-[15px] font-bold text-slate-900 focus:bg-white transition-all placeholder:text-slate-300"
              />
              <p className="mt-2.5 text-[11px] text-slate-400 font-bold uppercase tracking-wider ml-1">Used for SMS updates and verification.</p>
            </div>

            <div>
              <Label className="text-[13px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                Village & District
              </Label>
              <Input
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                placeholder="e.g., Bharwari, Prayagraj"
                className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 text-[15px] font-bold text-slate-900 focus:bg-white transition-all placeholder:text-slate-300"
              />
            </div>
          </div>

        </div>
      </div>

      <div className="px-4 pt-2">
        <Button
          onClick={() => onSubmit({ name, phone, village })}
          disabled={!valid}
          className="h-16 w-full rounded-2xl text-base font-black uppercase tracking-wider shadow-lg shadow-primary/20 transition-all hover:translate-y-[-2px]"
        >
          Register Farmer
        </Button>
      </div>
    </div>
  );
} 
