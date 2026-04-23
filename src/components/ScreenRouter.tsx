import { type Screen } from "@/hooks/useNavigation";
import { HomeScreen } from "@/components/screens/HomeScreen";
import { AddProduceScreen } from "@/components/screens/AddProduceScreen";
import { EditProduceScreen } from "@/components/screens/EditProduceScreen";
import { MyListingsScreen } from "@/components/screens/MyListingsScreen";
import { ListingDetailScreen } from "@/components/screens/ListingDetailScreen";
import { OrderConfirmationScreen } from "@/components/screens/OrderConfirmationScreen";
import { OrdersScreen } from "@/components/screens/OrdersScreen";
import { PickupStatusScreen } from "@/components/screens/PickupStatusScreen";
import { PaymentTrackingScreen } from "@/components/screens/PaymentTrackingScreen";
import { WeeklySummaryScreen } from "@/components/screens/WeeklySummaryScreen";
import { SupportScreen } from "@/components/screens/SupportScreen";
import { MoreScreen } from "@/components/screens/MoreScreen";
import { LanguageSelectScreen } from "@/components/screens/LanguageSelectScreen";
import { FpoDashboardScreen } from "@/components/screens/FpoDashboardScreen";
import { FpoPipelineScreen, type PipelineStage } from "@/components/screens/FpoPipelineScreen";
import { OnboardingProfileScreen, type ProfileData } from "@/components/screens/OnboardingProfileScreen";
import { FpoOnboardingScreen, type FpoProfileData } from "@/components/screens/FpoOnboardingScreen";
import { FpoNetworkScreen } from "@/components/screens/FpoNetworkScreen";
import { PayoutSetupScreen, type PayoutData } from "@/components/screens/PayoutSetupScreen";
import { OnboardingCompleteScreen } from "@/components/screens/OnboardingCompleteScreen";
import { type Listing, type Order, type Payment, type Farmer } from "@/lib/mock-data";
import { AddFarmerScreen } from "./screens/AddFarmerScreen";

interface ScreenRouterProps {
  screen: Screen;
  profile: ProfileData;
  role: "farmer" | "fpo_coordinator";
  listings: Listing[];
  orders: Order[];
  payments: Payment[];
  farmers: Farmer[];
  payout: PayoutData | null;
  activeListing: Listing | null;
  orderForListing?: Order;
  paymentForListing?: Payment;
  activeOrder?: Order;
  userName?: string;
  setScreen: (s: Screen) => void;
  setTab: (t: any) => void;
  setRole: (r: "farmer" | "fpo_coordinator") => void;
  setProfile: (p: ProfileData) => void;
  setPayout: (d: PayoutData) => void;
  setActiveListingId: (id: string | null) => void;
  goHome: () => void;
  handleAddListing: (l: any) => void;
  handleAddFarmer: (f: any) => void;
  handleAcceptOrder: () => void;
  onEditListing?: (l: Listing) => void;
  onLogout: () => void;
  onAdvanceStage?: (
    id: string,
    from: PipelineStage,
    payload: { buyerName?: string; pricePerUnit?: number; pickupDate?: string }
  ) => void;
}

export function ScreenRouter({
  screen,
  profile,
  role,
  listings,
  orders,
  payments,
  farmers,
  payout,
  activeListing,
  orderForListing,
  paymentForListing,
  activeOrder,
  userName,
  setScreen,
  setTab,
  setRole,
  setProfile,
  setPayout,
  setActiveListingId,
  goHome,
  handleAddListing,
  handleAddFarmer,
  handleAcceptOrder,
  onEditListing,
  onLogout,
  onAdvanceStage,
}: ScreenRouterProps) {
  switch (screen) {
    case "language":
      // FPO coordinators skip language selection — go straight to profile setup
      if (role === "fpo_coordinator") {
        return (
          <FpoOnboardingScreen
            initialName={userName}
            onBack={() => setScreen("language")}
            onNext={(p) => {
              // Map FPO profile to compatible profile data or handle specially
              setProfile({ name: p.managerName, village: p.district, phone: p.phone, crops: [] });
              setScreen("payout");
            }}
          />
        );
      }
      return <LanguageSelectScreen onContinue={() => setScreen("profile")} />;
    case "profile":
      if (role === "fpo_coordinator") {
        return (
          <FpoOnboardingScreen
            initialName={userName}
            onBack={() => setScreen("language")}
            onNext={(p) => {
              setProfile({ name: p.managerName, village: p.district, phone: p.phone, crops: [] });
              setScreen("payout");
            }}
          />
        );
      }
      return (
        <OnboardingProfileScreen
          role={role}
          initialName={userName}
          onBack={() => setScreen("language")}
          onNext={(p) => {
            setProfile(p);
            setScreen("payout");
          }}
        />
      );
    case "payout":
      return (
        <PayoutSetupScreen
          onBack={() => setScreen("profile")}
          onNext={(d) => {
            setPayout(d);
            setScreen("complete");
          }}
        />
      );
    case "complete":
      return <OnboardingCompleteScreen onFinish={goHome} />;
    case "home":
      if (role === "fpo_coordinator") {
        return (
          <FpoDashboardScreen
            fpoName={profile.name}
            fpoRegion={profile.village}
            listings={listings}
            orders={orders}
            payments={payments}
            onOpenListing={(id) => {
              setActiveListingId(id);
              setScreen("listing-detail");
            }}
            onNavigateToTab={(t) => {
              setTab(t as any);
              setScreen(t as any);
            }}
          />
        );
      }
      return (
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
      );
    case "add":
      return <AddProduceScreen farmerVillage={profile.village} onBack={goHome} onSubmit={handleAddListing} />;
    case "add-farmer":
      return <AddFarmerScreen onBack={() => setScreen("network")} onSubmit={handleAddFarmer} />;
    case "listings":
      if (role === "fpo_coordinator") {
        return (
          <FpoPipelineScreen
            listings={listings}
            orders={orders}
            payments={payments}
            onOpenListing={(id) => {
              setActiveListingId(id);
              setScreen("listing-detail");
            }}
            onAdvanceStage={onAdvanceStage}
            onAddListing={() => setScreen("add")}
          />
        );
      }
      return (
        <MyListingsScreen
          listings={listings}
          onBack={goHome}
          onOpen={(id) => {
            setActiveListingId(id);
            setScreen("listing-detail");
          }}
          onAdd={() => setScreen("add")}
        />
      );
    case "listing-detail":
      return activeListing ? (
        <ListingDetailScreen
          listing={activeListing}
          role={role}
          order={orderForListing}
          payment={paymentForListing}
          onBack={() => setScreen("listings")}
          onSupport={() => setScreen("support")}
          onEdit={() => setScreen("edit-listing")}
          onViewOrder={
            activeListing.status === "Matched"
              ? () => {
                setScreen("order");
              }
              : undefined
          }
        />
      ) : null;
    case "edit-listing":
      return activeListing ? (
        <EditProduceScreen
          listing={activeListing}
          onBack={() => setScreen("listing-detail")}
          onSubmit={(updated) => {
            if (onEditListing) onEditListing(updated);
          }}
        />
      ) : null;
    case "orders":
      return (
        <OrdersScreen
          orders={orders}
          onBack={goHome}
          onOpen={(id) => {
            const o = orders.find((x) => x.id === id);
            if (o?.status === "Awaiting") setScreen("order");
            else setScreen("pickup");
          }}
        />
      );
    case "order":
      return activeOrder ? (
        <OrderConfirmationScreen
          order={activeOrder}
          onBack={goHome}
          onAccept={handleAcceptOrder}
          onSupport={() => setScreen("support")}
        />
      ) : null;
    case "pickup":
      return activeOrder ? <PickupStatusScreen order={activeOrder} onBack={goHome} /> : null;
    case "payments":
      return (
        <PaymentTrackingScreen
          payments={payments}
          payout={payout}
          onBack={goHome}
          onSupport={() => setScreen("support")}
        />
      );
    case "summary":
      return (
        <WeeklySummaryScreen 
          onBack={goHome} 
          orders={orders} 
          payments={payments} 
          role={role} 
          profileName={profile.name} 
        />
      );
    case "network":
      return <FpoNetworkScreen farmers={farmers} listings={listings} onAddFarmer={() => setScreen("add-farmer")} />;
    case "support":
      return <SupportScreen onBack={goHome} />;
    case "more":
      return (
        <MoreScreen
          name={profile.name}
          village={profile.village}
          phone={profile.phone}
          onSummary={() => setScreen("summary")}
          onSupport={() => setScreen("support")}
          onLogout={onLogout}
        />
      );
    default:
      return null;
  }
}
