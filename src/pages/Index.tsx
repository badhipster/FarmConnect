import { useMemo, useState, useEffect, useCallback } from "react";
import { BottomNav } from "@/components/BottomNav";
import { SignInScreen } from "@/components/screens/SignInScreen";
import { useAuth, useProfile } from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { ScreenRouter } from "@/components/ScreenRouter";
import { useNavigation } from "@/hooks/useNavigation";
import {
  initialListings,
  initialOrders,
  initialPayments,
  initialFarmers,
  type Listing,
  type Order,
  type Payment,
  type Farmer,
} from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import { Home, ClipboardList, Package, CreditCard, MoreHorizontal, Sprout, UserPlus, Users, BarChart2 } from "lucide-react";
import { cn } from "@/lib/utils";

import type { ProfileData } from "@/components/screens/OnboardingProfileScreen";
import type { PayoutData } from "@/components/screens/PayoutSetupScreen";
import type { PipelineStage } from "@/components/screens/FpoPipelineScreen";

// Helper hook for sticking mock state to localStorage
function useStickyState<T>(defaultValue: T, key: string): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const stickyValue = window.localStorage.getItem(key);
      return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue;
    } catch {
      return defaultValue;
    }
  });
  
  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  
  return [value, setValue];
}

const Index = () => {
  const { session, user, signOut } = useAuth();
  // Keep live profile sync for Auth & User settings
  const { data: dbProfile, updateProfile } = useProfile(user);
  const queryClient = useQueryClient();
  
  const { toast } = useToast();

  // Extract the full name from Supabase auth metadata for auto-population
  const userName = user?.user_metadata?.full_name as string | undefined;

  const {
    screen,
    tab,
    activeListingId,
    setScreen,
    setTab,
    setActiveListingId,
    goHome,
    handleTab,
  } = useNavigation();

  const [role, setRole] = useState<"farmer" | "fpo_coordinator">("farmer");
  const [profile, setProfile] = useState<ProfileData>({
    name: "Farmer",
    village: "",
    phone: "",
    crops: [],
  });
  const [payout, setPayout] = useState<PayoutData | null>(null);

  // Sync dbProfile to local profile state once loaded
  useEffect(() => {
    if (user && dbProfile !== undefined) {
      if (dbProfile) {
        setRole(dbProfile.role as "farmer" | "fpo_coordinator" || "farmer");
      }
      if (dbProfile && dbProfile.village) {
        setScreen("home");
        setProfile({
          name: dbProfile.full_name || "Farmer",
          village: dbProfile.village,
          phone: dbProfile.phone || "",
          crops: []
        });
        if (dbProfile.upi_id || dbProfile.bank_account_number) {
          setPayout({
            method: dbProfile.upi_id ? "upi" : "bank",
            upi: dbProfile.upi_id || undefined,
            accountNumber: dbProfile.bank_account_number || undefined,
            ifsc: dbProfile.bank_ifsc || undefined,
            holder: dbProfile.bank_account_holder || undefined,
          });
        }
      } else {
        setScreen("language");
      }
    }
  }, [user, dbProfile, setScreen]);

  // Hybrid Data State: Using rich mock data wrapped in localStorage so changes persist on refresh
  const [listings, setListings] = useStickyState<Listing[]>(initialListings, "farmconnect_listings");
  const [orders, setOrders] = useStickyState<Order[]>(initialOrders, "farmconnect_orders");
  const [payments, setPayments] = useStickyState<Payment[]>(initialPayments, "farmconnect_payments");
  const [farmers, setFarmers] = useStickyState<Farmer[]>(initialFarmers, "farmconnect_farmers");

  const handleAddListing = useCallback(async (l: Omit<Listing, "id" | "submittedDate" | "status">) => {
    if (!user) return;
    
    // Simulate API call locally for UI presentation
    const newListing: Listing = {
      id: `L-${Math.floor(1000 + Math.random() * 9000)}`,
      crop: l.crop,
      emoji: l.emoji,
      quantity: l.quantity,
      unit: l.unit,
      readyDate: l.readyDate || "Next Week",
      submittedDate: "Just now",
      village: l.village,
      status: "Submitted",
      note: l.note,
    };
    
    setListings(prev => [newListing, ...prev]);
    toast({ title: "Listing submitted", description: `${l.crop} sent for review` });
  }, [user, toast, setListings]);

  const handleEditListing = useCallback((l: Listing) => {
    if (!user) return;
    setListings(prev => prev.map(listing => listing.id === l.id ? l : listing));
    toast({ title: "Listing updated", description: `Changes to ${l.crop} saved` });
  }, [user, toast, setListings]);

  const handleAddFarmer = useCallback(async (f: { name: string; phone: string; village: string }) => {
    const newFarmer: Farmer = {
      id: `F-${Math.floor(1000 + Math.random() * 9000)}`,
      name: f.name,
      village: f.village,
      phone: f.phone,
      activeLots: 0,
      totalSold: 0,
      status: "New",
    };
    
    setFarmers(prev => [newFarmer, ...prev]);
    toast({ title: "Farmer Registered", description: `${f.name} added to your network` });
    setScreen("network"); // Navigate back to network screen
  }, [setFarmers, toast, setScreen]);

  const activeOrder = useMemo(() => 
    orders.find((o) => ["Awaiting", "Accepted", "Scheduled", "Collected"].includes(o.status)), 
    [orders]
  );
  
  const activeListing = useMemo(() => 
    listings.find((l) => l.id === activeListingId), 
    [listings, activeListingId]
  );

  const matchedOrderForListing = useMemo(() => 
    activeListing ? orders.find((o) => o.listingId === activeListing.id) : undefined, 
    [orders, activeListing]
  );
  
  const paymentForListing = useMemo(() => 
    matchedOrderForListing ? payments.find((p) => p.orderId === matchedOrderForListing.id) : undefined, 
    [payments, matchedOrderForListing]
  );

  const handleAdvanceStage = useCallback(
    (
      id: string,
      from: PipelineStage,
      payload: { buyerName?: string; pricePerUnit?: number; pickupDate?: string },
    ) => {
      const listing = listings.find((l) => l.id === id);
      if (!listing) return;
      const existingOrder = orders.find((o) => o.listingId === id);

      if (from === "Listed") {
        setListings((prev) =>
          prev.map((l) => (l.id === id ? { ...l, status: "Matched" } : l)),
        );
        toast({
          title: "Buyer matched",
          description: payload.buyerName
            ? `${listing.crop} matched to ${payload.buyerName}`
            : `${listing.crop} moved to Buyer Matched`,
        });
        return;
      }

      if (from === "Matched") {
        if (!existingOrder) {
          const newOrder: Order = {
            id: `O-${Math.floor(1000 + Math.random() * 9000)}`,
            listingId: id,
            crop: listing.crop,
            emoji: listing.emoji,
            acceptedQty: listing.quantity,
            unit: listing.unit,
            pickupDate: payload.pickupDate || "TBD",
            pickupSlot: "Morning",
            collectionPoint: listing.village,
            expectedPayout: listing.quantity * 2000,
            status: "Accepted",
            farmerName: listing.farmerName,
          };
          setOrders((prev) => [newOrder, ...prev]);
        } else {
          setOrders((prev) =>
            prev.map((o) =>
              o.id === existingOrder.id
                ? {
                    ...o,
                    status: "Accepted",
                    pickupDate: payload.pickupDate || o.pickupDate,
                  }
                : o,
            ),
          );
        }
        toast({ title: "Pickup confirmed", description: `${listing.crop} moved to Confirmed` });
        return;
      }

      if (from === "Confirmed" && existingOrder) {
        setOrders((prev) =>
          prev.map((o) => (o.id === existingOrder.id ? { ...o, status: "Collected" } : o)),
        );
        toast({ title: "Pickup complete", description: `${listing.crop} moved to Picked Up` });
        return;
      }

      if (from === "PickedUp" && existingOrder) {
        const existingPayment = payments.find((p) => p.orderId === existingOrder.id);
        if (existingPayment) {
          setPayments((prev) =>
            prev.map((p) =>
              p.id === existingPayment.id ? { ...p, status: "Paid" } : p,
            ),
          );
        } else {
          const newPayment: Payment = {
            id: `P-${Math.floor(9000 + Math.random() * 1000)}`,
            orderId: existingOrder.id,
            crop: existingOrder.crop,
            amount: existingOrder.expectedPayout,
            status: "Paid",
            timestamp: "Just now",
            farmerName: existingOrder.farmerName,
          };
          setPayments((prev) => [newPayment, ...prev]);
        }
        setListings((prev) =>
          prev.map((l) => (l.id === id ? { ...l, status: "Sold" } : l)),
        );
        toast({ title: "Payment recorded", description: `${listing.crop} marked as Paid` });
        return;
      }
    },
    [listings, orders, payments, setListings, setOrders, setPayments, toast],
  );

  const handleAcceptOrder = useCallback(() => {
    if (!activeOrder) return;
    
    // Simulate mutation locally
    setOrders((prev) => prev.map((o) => (o.id === activeOrder.id ? { ...o, status: "Accepted" } : o)));
    toast({ title: "Order accepted ✓", description: "Pickup scheduled" });
    setScreen("pickup");
    
    // Simulate real-time progress
    setTimeout(() => {
      setOrders((prev) => prev.map((o) => (o.id === activeOrder.id ? { ...o, status: "Scheduled" } : o)));
    }, 2500);
    
    setTimeout(() => {
      setOrders((prev) => prev.map((o) => (o.id === activeOrder.id ? { ...o, status: "Collected" } : o)));
      setPayments((prev) => [
        {
          id: `P-${Math.floor(9000 + Math.random() * 1000)}`,
          orderId: activeOrder.id,
          crop: activeOrder.crop,
          amount: activeOrder.expectedPayout,
          status: "Processing",
          timestamp: "Just now",
        },
        ...prev,
      ]);
      toast({ title: "Pickup completed", description: "Payment is processing" });
    }, 5500);
  }, [activeOrder, toast, setScreen]);

  const handleOnboardingProfile = useCallback(async (p: ProfileData) => {
    setProfile(p);
    try {
      await updateProfile({
        full_name: p.name,
        village: p.village,
        phone: p.phone,
      });
      setScreen("payout");
    } catch (e: any) {
      toast({ title: "Error saving profile", description: e.message, variant: "destructive" });
    }
  }, [updateProfile, setScreen, toast]);

  const handleOnboardingPayout = useCallback(async (d: PayoutData) => {
    setPayout(d);
    try {
      await updateProfile({
        upi_id: d.upi || null,
        bank_account_number: d.accountNumber || null,
        bank_ifsc: d.ifsc || null,
        bank_account_holder: d.holder || null,
      });
      setScreen("complete");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e: any) {
      toast({ title: "Error saving payout info", description: e.message, variant: "destructive" });
    }
  }, [updateProfile, setScreen, toast]);

  const handleLogout = useCallback(async () => {
    await signOut();
    // Clear localStorage mock data on logout
    window.localStorage.removeItem("farmconnect_listings");
    window.localStorage.removeItem("farmconnect_orders");
    window.localStorage.removeItem("farmconnect_payments");
    queryClient.clear();
    toast({ title: "Signed out", description: "You have been logged out successfully." });
  }, [signOut, queryClient, toast]);

  if (!session) return <SignInScreen />;

  const isOnboarding = ["role", "language", "profile", "payout", "complete"].includes(screen);

  return (
    <div className="min-h-screen bg-slate-50/50 selection:bg-primary/20">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {!isOnboarding && (
          <aside className="hidden lg:flex w-72 h-screen sticky top-0 flex-col bg-white border-r border-slate-200/60 shrink-0 shadow-[4px_0_24px_rgb(0,0,0,0.02)] z-10">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-8">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/20 ring-1 ring-primary/20">
                  <Sprout className="h-4 w-4" />
                </div>
                <span className="text-xl font-bold tracking-tight text-slate-900">FarmConnect</span>
              </div>

              <nav className="space-y-1">
                {role === "farmer" && (
                  <>
                    <SidebarItem icon={Home} label="Home" active={tab === "home"} onClick={() => handleTab("home")} />
                    <SidebarItem icon={ClipboardList} label="My Listings" active={tab === "listings"} onClick={() => handleTab("listings")} />
                    <SidebarItem icon={Package} label="Orders" active={tab === "orders"} onClick={() => handleTab("orders")} />
                    <SidebarItem icon={CreditCard} label="Payments" active={tab === "payments"} onClick={() => handleTab("payments")} />
                  </>
                )}
                {role === "fpo_coordinator" && (
                  <>
                    <SidebarItem icon={Home}        label="Dashboard" active={tab === "home"}                       onClick={() => handleTab("home")} />
                    <SidebarItem icon={Users}       label="Pipeline"  active={tab === "listings"}                  onClick={() => handleTab("listings")} />
                    <SidebarItem icon={UserPlus}    label="Farmers"   active={tab === "network"}                   onClick={() => handleTab("network")} />
                    <SidebarItem icon={BarChart2}   label="Summary"   active={tab === "summary"}                   onClick={() => handleTab("summary")} />
                  </>
                )}
                <SidebarItem icon={MoreHorizontal} label="More" active={tab === "more"} onClick={() => handleTab("more")} />
              </nav>
            </div>
            
            <div className="mt-auto p-6 border-t border-slate-100">
              <div className="flex items-center gap-3 rounded-2xl p-2 hover:bg-slate-50 transition-colors cursor-pointer">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-primary font-bold shadow-inner border border-primary/10">
                  {profile.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold truncate text-slate-900">{profile.name}</p>
                  <p className="text-xs text-slate-500 truncate">{profile.village}</p>
                </div>
              </div>
            </div>
          </aside>
        )}

        <div className="flex-1 flex flex-col w-full relative h-screen overflow-y-auto">
          <main className={cn(
            "flex-1 animate-fade-in pb-20 lg:pb-0 w-full",
            !isOnboarding && "max-w-[1600px] mx-auto"
          )}>
            <div className={cn(
              "main-container flex flex-col w-full min-h-full",
              !isOnboarding && "lg:pt-0"
            )}>
              <ScreenRouter
                screen={screen}
                profile={profile}
                role={role}
                listings={listings}
                orders={orders}
                payments={payments}
                farmers={farmers}
                payout={payout}
                activeListing={activeListing || null}
                orderForListing={matchedOrderForListing}
                paymentForListing={paymentForListing}
                activeOrder={activeOrder || (orders.length > 0 ? orders[0] : undefined)}
                userName={userName}
                setScreen={setScreen}
                setTab={setTab}
                setRole={setRole}
                setProfile={handleOnboardingProfile}
                setPayout={handleOnboardingPayout}
                setActiveListingId={setActiveListingId}
                goHome={goHome}
                handleAddListing={handleAddListing}
                handleAddFarmer={handleAddFarmer}
                handleAcceptOrder={handleAcceptOrder}
                onEditListing={handleEditListing}
                onLogout={handleLogout}
                onAdvanceStage={handleAdvanceStage}
              />
            </div>
          </main>

          {!isOnboarding && (
            <div className="lg:hidden">
                <BottomNav active={tab} onChange={handleTab} role={role} />
              </div>
          )}
        </div>
      </div>
    </div>
  );
};

function SidebarItem({ icon: Icon, label, active, onClick }: { icon: any; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 group relative overflow-hidden",
        active
          ? "bg-slate-900 text-white shadow-md"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      )}
    >
      <Icon className={cn("h-5 w-5 transition-colors duration-200", active ? "text-white" : "text-slate-400 group-hover:text-slate-900")} />
      {label}
    </button>
  );
}

export default Index;
