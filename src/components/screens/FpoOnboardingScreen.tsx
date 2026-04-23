import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, MapPin, Building2, Phone } from "lucide-react";

export interface FpoProfileData {
  managerName: string;
  fpoName: string;
  district: string;
  block: string;
  phone: string;
  networkSize: string;
}

export function FpoOnboardingScreen({
  initialName,
  initialPhone,
  onBack,
  onNext,
}: {
  initialName?: string;
  initialPhone?: string;
  onBack: () => void;
  onNext: (p: FpoProfileData) => void;
}) {
  const [managerName, setManagerName] = useState(initialName || "");
  const [fpoName, setFpoName] = useState("");
  const [district, setDistrict] = useState("");
  const [block, setBlock] = useState("");
  const [phone, setPhone] = useState(initialPhone || "");
  const [networkSize, setNetworkSize] = useState("");

  const valid = 
    managerName.trim() && 
    fpoName.trim() && 
    district.trim() && 
    block.trim() && 
    phone.trim().length >= 10;

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/50 pb-10">
      <AppHeader title="FPO Setup" subtitle="Set up your organization" onBack={onBack} />
      
      <div className="flex-1 space-y-6 px-4 py-8">
        {/* Organization Details Group */}
        <div className="rounded-[2rem] border border-white/60 bg-white/70 p-6 shadow-sm backdrop-blur-xl">
          <div className="space-y-6">
            <div>
              <Label className="text-[13px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-3 block flex items-center gap-2">
                <Building2 className="h-3.5 w-3.5 text-primary" />
                Organization Details
              </Label>
              <Input
                value={fpoName}
                onChange={(e) => setFpoName(e.target.value)}
                placeholder="e.g., Krishi Kalyan FPO"
                className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 text-[15px] font-bold text-slate-900 focus:bg-white transition-all placeholder:text-slate-300"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-[13px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-3 block flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  District
                </Label>
                <Input
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="Prayagraj"
                  className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 text-[15px] font-bold text-slate-900 focus:bg-white transition-all placeholder:text-slate-300"
                />
              </div>
              <div>
                <Label className="text-[13px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-3 block flex items-center gap-2">
                  Block
                </Label>
                <Input
                  value={block}
                  onChange={(e) => setBlock(e.target.value)}
                  placeholder="Phulpur"
                  className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 text-[15px] font-bold text-slate-900 focus:bg-white transition-all placeholder:text-slate-300"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Management & Scale Group */}
        <div className="rounded-[2rem] border border-white/60 bg-white/70 p-6 shadow-sm backdrop-blur-xl">
          <div className="space-y-6">
            <div>
              <Label className="text-[13px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-3 block">Manager Name</Label>
              <Input
                value={managerName}
                onChange={(e) => setManagerName(e.target.value)}
                placeholder="Full Name"
                className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 text-[15px] font-bold text-slate-900 focus:bg-white transition-all placeholder:text-slate-300"
              />
            </div>

            <div>
              <Label className="text-[13px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-3 block flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-primary" />
                Contact Info
              </Label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, "").slice(0, 10))}
                placeholder="98XXXXXXXX"
                inputMode="numeric"
                className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 text-[15px] font-bold text-slate-900 focus:bg-white transition-all placeholder:text-slate-300"
              />
            </div>

            <div>
              <Label className="text-[13px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-3 block flex items-center gap-2">
                <Users className="h-3.5 w-3.5 text-primary" />
                Network Size (Farmers)
              </Label>
              <Input
                value={networkSize}
                onChange={(e) => setNetworkSize(e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="e.g., 250"
                inputMode="numeric"
                className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 text-[15px] font-bold text-slate-900 focus:bg-white transition-all placeholder:text-slate-300"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 pt-2">
        <Button
          onClick={() => onNext({ managerName, fpoName, district, block, phone, networkSize })}
          disabled={!valid}
          className="h-16 w-full rounded-2xl text-base font-black uppercase tracking-wider shadow-lg shadow-primary/20 transition-all hover:translate-y-[-2px]"
        >
          Complete Setup
        </Button>
      </div>
    </div>
  );
}
