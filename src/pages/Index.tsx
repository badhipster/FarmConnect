import { useState } from "react";
import { BottomNav, type NavTab } from "@/components/BottomNav";
import { HomeScreen } from "@/components/screens/HomeScreen";
import { AddProduceScreen } from "@/components/screens/AddProduceScreen";
import { MyListingsScreen } from "@/components/screens/MyListingsScreen";
import { ListingDetailScreen } from "@/components/screens/ListingDetailScreen";
import { OrderConfirmationScreen } from "@/components/screens/OrderConfirmationScreen";
import { OrdersScreen } from "@/components/screens/OrdersScreen";
import { PickupStatusScreen } from "@/components/screens/PickupStatusScreen";
import { PaymentTrackingScreen } from "@/components/screens/PaymentTrackingScreen";
import { WeeklySummaryScreen } from "@/components/screens/WeeklySummaryScreen";
import { SupportScreen } from "@/components/screens/SupportScreen";
import { MoreScreen } from "@/components/screens/MoreScreen";
import { RoleSelectScreen, type Role } from "@/components/screens/RoleSelectScreen";
import { LanguageSelectScreen } from "@/components/screens/LanguageSelectScreen";
import { OnboardingProfileScreen, type ProfileData } from "@/components/screens/OnboardingProfileScreen";
import { PayoutSetupScreen, type PayoutData } from "@/components/screens/PayoutSetupScreen";
import { OnboardingCompleteScreen } from "@/components/screens/OnboardingCompleteScreen";
import { FpoGroupScreen } from "@/components/screens/FpoGroupScreen";
import {
  initialListings,
  initialOrders,
  initialPayments,
  type Listing,
  type Order,
  type Payment,
} from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";

type Screen =
  | "role"
  | "language"
  | "profile"
  | "payout"
  | "complete"
  | "home"
  | "add"
  | "listings"
  | "listing-detail"
  | "order"
  | "orders"
  | "pickup"
  | "payments"
  | "summary"
  | "support"
  | "more"
  | "fpo";

const Index = () => {
  const [screen, setScreen] = useState<Screen>("role");
  const [tab, setTab] = useState<NavTab>("home");
  const [role, setRole] = useState<Role>("farmer");
  const [profile, setProfile] = useState<ProfileData>({
    name: "Ramesh",
    village: "Bharwari, Prayagraj",
    phone: "98XXX12345",
    crops: [],
  });
  const [payout, setPayout] = useState<PayoutData | null>(null);
  const [listings, setListings] = useState<Listing[]>(initialListings);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [activeListingId, setActiveListingId] = useState<string | null>(null);
  const { toast } = useToast();

  const activeOrder = orders.find((o) => ["Awaiting", "Accepted", "Scheduled", "Collected"].includes(o.status))!;

  const goHome = () => {
    setScreen(role === "fpo" ? "fpo" : "home");
    setTab("home");
  };

  const handleTab = (t: NavTab) => {
    setTab(t);
    if (t === "home") setScreen(role === "fpo" ? "fpo" : "home");
    if (t === "listings") setScreen("listings");
    if (t === "orders") setScreen("orders");
    if (t === "payments") setScreen("payments");
    if (t === "more") setScreen("more");
  };

  const handleAddListing = (l: Omit<Listing, "id" | "submittedDate" | "status">) => {
    const id = `L-${1100 + listings.length}`;
    const newListing: Listing = { ...l, id, submittedDate: "Today", status: "Submitted" };
    setListings((prev) => [newListing, ...prev]);
    setTimeout(() => {
      setListings((prev) => prev.map((x) => (x.id === id ? { ...x, status: "Active" } : x)));
      toast({ title: "Listing is now active", description: `${l.crop} visible to buyers` });
    }, 3500);
  };

  const handleAcceptOrder = () => {
    setOrders((prev) => prev.map((o) => (o.id === activeOrder.id ? { ...o, status: "Accepted" } : o)));
    toast({ title: "Order accepted ✓", description: "Pickup scheduled" });
    setScreen("pickup");
    setTimeout(() => {
      setOrders((prev) => prev.map((o) => (o.id === activeOrder.id ? { ...o, status: "Scheduled" } : o)));
    }, 2500);
    setTimeout(() => {
      setOrders((prev) => prev.map((o) => (o.id === activeOrder.id ? { ...o, status: "Collected" } : o)));
      setPayments((prev) => [
        {
          id: `P-${9930 + prev.length}`,
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
  };

  const activeListing = listings.find((l) => l.id === activeListingId);

  // Onboarding flow (no bottom nav)
  const isOnboarding = ["role", "language", "profile", "payout", "complete"].includes(screen);

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mobile-frame flex flex-col">
        <main className="flex-1 animate-fade-in">
          {screen === "role" && (
            <RoleSelectScreen
              onSelect={(r) => {
                setRole(r);
                setScreen("language");
              }}
            />
          )}
          {screen === "language" && <LanguageSelectScreen onContinue={() => setScreen("profile")} />}
          {screen === "profile" && (
            <OnboardingProfileScreen
              role={role}
              onBack={() => setScreen("language")}
              onNext={(p) => {
                setProfile(p);
                setScreen("payout");
              }}
            />
          )}
          {screen === "payout" && (
            <PayoutSetupScreen
              onBack={() => setScreen("profile")}
              onNext={(d) => {
                setPayout(d);
                setScreen("complete");
              }}
            />
          )}
          {screen === "complete" && <OnboardingCompleteScreen onFinish={goHome} />}

          {screen === "home" && (
            <HomeScreen
              farmerName={profile.name}
              farmerVillage={profile.village}
              listings={listings}
              orders={orders}
              payments={payments}
              onAddProduce={() => setScreen("add")}
              onOpenListings={() => {
                setScreen("listings");
                setTab("listings");
              }}
              onOpenOrder={() => {
                setScreen("orders");
                setTab("orders");
              }}
              onOpenPayments={() => {
                setScreen("payments");
                setTab("payments");
              }}
              onOpenSummary={() => setScreen("summary")}
              onOpenSupport={() => setScreen("support")}
            />
          )}

          {screen === "add" && (
            <AddProduceScreen farmerVillage={profile.village} onBack={goHome} onSubmit={handleAddListing} />
          )}

          {screen === "listings" && (
            <MyListingsScreen
              listings={listings}
              onBack={goHome}
              onOpen={(id) => {
                setActiveListingId(id);
                setScreen("listing-detail");
              }}
              onAdd={() => setScreen("add")}
            />
          )}

          {screen === "listing-detail" && activeListing && (
            <ListingDetailScreen
              listing={activeListing}
              onBack={() => setScreen("listings")}
              onSupport={() => setScreen("support")}
              onViewOrder={() => setScreen("order")}
            />
          )}

          {screen === "orders" && (
            <OrdersScreen
              orders={orders}
              onBack={goHome}
              onOpen={(id) => {
                const o = orders.find((x) => x.id === id);
                if (o?.status === "Awaiting") setScreen("order");
                else setScreen("pickup");
              }}
            />
          )}

          {screen === "order" && (
            <OrderConfirmationScreen
              order={activeOrder}
              onBack={goHome}
              onAccept={handleAcceptOrder}
              onSupport={() => setScreen("support")}
            />
          )}

          {screen === "pickup" && <PickupStatusScreen order={activeOrder} onBack={goHome} />}

          {screen === "payments" && (
            <PaymentTrackingScreen
              payments={payments}
              payout={payout}
              onBack={goHome}
              onSupport={() => setScreen("support")}
            />
          )}

          {screen === "summary" && <WeeklySummaryScreen onBack={goHome} />}
          {screen === "support" && <SupportScreen onBack={goHome} />}

          {screen === "fpo" && (
            <FpoGroupScreen onBack={() => setScreen("home")} onAddSupply={() => setScreen("add")} />
          )}

          {screen === "more" && (
            <MoreScreen
              name={profile.name}
              village={profile.village}
              phone={profile.phone}
              showFpo={role === "fpo"}
              onSummary={() => setScreen("summary")}
              onSupport={() => setScreen("support")}
              onFpoGroup={() => setScreen("fpo")}
            />
          )}
        </main>

        {!isOnboarding && <BottomNav active={tab} onChange={handleTab} />}
      </div>
    </div>
  );
};

export default Index;
