import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { isDemoMode } from "@/lib/supabase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Sprout, Users, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function SignInScreen() {
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"farmer" | "fpo_coordinator">("farmer");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) setErr(error.message);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (!fullName.trim()) {
      setErr("Full name is required");
      return;
    }
    setLoading(true);
    const { error } = await signUp(email, password, { full_name: fullName, role: role });
    setLoading(false);
    if (error) {
      setErr(error.message);
    } else {
      toast({
        title: "Account created!",
        description: "Please check your email for the confirmation link.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-8 animate-fade-in">

        {/* Brand Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-[2rem] bg-gradient-to-br from-primary to-primary-glow shadow-xl shadow-primary/20 ring-4 ring-white relative overflow-hidden">
            <div className="absolute inset-0 bg-white opacity-20 blur-xl scale-50 group-hover:scale-100 transition-transform" />
            <Sprout className="h-10 w-10 text-white relative z-10" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">FarmConnect</h1>
            <p className="mt-1 text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Rural Marketplace</p>
          </div>
        </div>

        {isDemoMode && (
          <div className="rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 text-center text-[12px] font-semibold text-primary">
            Demo mode — any email and password will sign you in. Try both
            <span className="font-black"> Farmer </span>and
            <span className="font-black"> FPO </span>roles via Sign Up.
          </div>
        )}

        {/* Auth Card */}
        <div className="rounded-[2.5rem] border border-white/60 bg-white/70 shadow-2xl shadow-slate-200/50 backdrop-blur-xl overflow-hidden ring-1 ring-slate-100">
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 p-1 bg-slate-100/50 h-14">
              <TabsTrigger
                value="signin"
                className="rounded-[1.25rem] text-[13px] font-black uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary transition-all"
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="rounded-[1.25rem] text-[13px] font-black uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary transition-all"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="p-8 space-y-6 mt-0">
              <form onSubmit={handleSignIn} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email" className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 text-[15px] font-bold text-slate-900 focus:bg-white transition-all placeholder:text-slate-300"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signin-password" className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Password</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 text-[15px] font-bold text-slate-900 focus:bg-white transition-all"
                      required
                    />
                  </div>
                </div>

                {err && (
                  <div className="rounded-2xl bg-red-50 border border-red-100 p-4 text-[13px] font-bold text-red-600 flex items-center gap-3 animate-shake">
                    <div className="h-1.5 w-1.5 rounded-full bg-red-600 shrink-0" />
                    {err}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-16 rounded-2xl text-base font-black uppercase tracking-wider bg-primary text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:translate-y-[-2px] transition-all disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? "Signing in…" : "Sign In"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="p-8 space-y-6 mt-0">
              <form onSubmit={handleSignUp} className="space-y-6">
                {/* Role Switcher */}
                <div className="space-y-3">
                  <Label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">I am a…</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRole("farmer")}
                      className={cn(
                        "flex flex-col items-center gap-2 rounded-2xl border p-4 transition-all duration-300 active:scale-95",
                        role === "farmer"
                          ? "border-primary bg-primary/10 shadow-inner ring-1 ring-primary/20"
                          : "border-slate-100 bg-slate-50/50 hover:bg-slate-50"
                      )}
                    >
                      <User className={cn("h-5 w-5", role === "farmer" ? "text-primary" : "text-slate-400")} />
                      <span className={cn("text-[11px] font-black uppercase tracking-tight", role === "farmer" ? "text-primary" : "text-slate-500")}>Farmer</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole("fpo_coordinator")}
                      className={cn(
                        "flex flex-col items-center gap-2 rounded-2xl border p-4 transition-all duration-300 active:scale-95",
                        role === "fpo_coordinator"
                          ? "border-primary bg-primary/10 shadow-inner ring-1 ring-primary/20"
                          : "border-slate-100 bg-slate-50/50 hover:bg-slate-50"
                      )}
                    >
                      <Users className={cn("h-5 w-5", role === "fpo_coordinator" ? "text-primary" : "text-slate-400")} />
                      <span className={cn("text-[11px] font-black uppercase tracking-tight", role === "fpo_coordinator" ? "text-primary" : "text-slate-500")}>FPO / Aggregator</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder={role === "farmer" ? "e.g., Ramesh Kumar" : "e.g., FPO Manager"}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 text-[15px] font-bold text-slate-900 focus:bg-white transition-all placeholder:text-slate-300"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 text-[15px] font-bold text-slate-900 focus:bg-white transition-all placeholder:text-slate-300"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 text-[15px] font-bold text-slate-900 focus:bg-white transition-all"
                      required
                    />
                  </div>
                </div>

                {err && (
                  <div className="rounded-2xl bg-red-50 border border-red-100 p-4 text-[13px] font-bold text-red-600 flex items-center gap-3 animate-shake">
                    <div className="h-1.5 w-1.5 rounded-full bg-red-600 shrink-0" />
                    {err}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-16 rounded-2xl text-base font-black uppercase tracking-wider bg-primary text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:translate-y-[-2px] transition-all disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? "Creating…" : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>

        <p className="text-center text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
          Powered by FarmConnect Global
        </p>
      </div>
    </div>
  );
}
