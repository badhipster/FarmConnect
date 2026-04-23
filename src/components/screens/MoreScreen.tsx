import { ChevronRight, TrendingUp, HelpCircle, FileText, LogOut, Languages } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function MoreScreen({
  name,
  village,
  phone,
  onSummary,
  onSupport,
  onLogout,
}: {
  name: string;
  village: string;
  phone: string;
  onSummary: () => void;
  onSupport: () => void;
  onLogout: () => void;
}) {
  const { t, lang, setLang } = useT();
  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 pb-10">
      <AppHeader title={lang === "hi" ? "अधिक" : "More"} />

      <div className="flex-1 px-4 py-6 space-y-6">
        {/* Profile Hero Card */}
        <div className="flex items-center gap-5 rounded-[2.5rem] bg-gradient-to-br from-primary via-primary-glow to-primary p-7 text-white shadow-xl shadow-primary/20 relative overflow-hidden group">
          <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/20 blur-3xl transition-transform group-hover:scale-150 duration-700" />
          <div className="absolute -left-12 -bottom-12 h-32 w-32 rounded-full bg-black/10 blur-3xl" />
          
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.25rem] bg-white/20 backdrop-blur-xl text-2xl font-black shadow-inner border border-white/20 ring-4 ring-white/10 uppercase transition-transform group-hover:rotate-6">
            {name.charAt(0)}
          </div>
          
          <div className="relative z-10 min-w-0">
            <h2 className="text-xl font-black tracking-tight truncate">{name}</h2>
            <div className="flex flex-col mt-0.5 opacity-90">
              <span className="text-[11px] font-black uppercase tracking-widest leading-none">{village}</span>
              {phone && <span className="text-[13px] font-bold mt-1 text-white/80">{phone}</span>}
            </div>
          </div>
        </div>

        {/* Menu Section */}
        <div className="rounded-[2rem] border border-white/60 bg-white/70 shadow-2xl shadow-slate-200/50 backdrop-blur-xl overflow-hidden divide-y divide-slate-100/50">
          <Item 
            icon={TrendingUp} 
            label={t("weeklySummary")} 
            onClick={onSummary} 
            sub="Your activity report"
          />
          <Item
            icon={Languages}
            label={lang === "hi" ? "Switch to English" : "हिन्दी में बदलें"}
            onClick={() => setLang(lang === "en" ? "hi" : "en")}
            sub={lang === "hi" ? "Change app language" : "ऐप की भाषा बदलें"}
          />
          <Item 
            icon={HelpCircle} 
            label={t("callback")} 
            onClick={onSupport} 
            sub="Get expert assistance"
          />
          <Item 
            icon={FileText} 
            label={lang === "hi" ? "नियम और गोपनीयता" : "Terms & Privacy"} 
            onClick={() => { }} 
          />
          <Item 
            icon={LogOut} 
            label={lang === "hi" ? "लॉगआउट" : "Logout"} 
            onClick={onLogout} 
            danger 
          />
        </div>

        <p className="pt-4 text-center text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">
          FarmConnect · Build 0.2.1
        </p>
      </div>
    </div>
  );
}

function Item({
  icon: Icon,
  label,
  sub,
  onClick,
  danger,
}: {
  icon: typeof TrendingUp;
  label: string;
  sub?: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button 
      onClick={onClick} 
      className="group flex w-full items-center gap-4 px-6 py-5 text-left transition-all hover:bg-slate-50/50 active:scale-[0.99]"
    >
      <div className={cn(
        "flex h-11 w-11 items-center justify-center rounded-2xl transition-all",
        danger ? "bg-red-50 text-red-500" : "bg-slate-50 text-slate-400 group-hover:bg-white group-hover:text-primary group-hover:shadow-sm"
      )}>
        <Icon className={cn("h-5 w-5 transition-transform", !danger && "group-hover:scale-110")} />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className={cn(
          "text-[15px] font-black tracking-tight transition-colors",
          danger ? "text-red-600" : "text-slate-800"
        )}>
          {label}
        </div>
        {sub && (
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight mt-0.5 leading-none">{sub}</p>
        )}
      </div>

      {!danger && (
        <ChevronRight className="h-4 w-4 text-slate-200 group-hover:text-primary transition-colors" />
      )}
    </button>
  );
}
