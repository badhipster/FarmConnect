import { useState, useCallback } from "react";

export type NavTab = "home" | "listings" | "orders" | "payments" | "more" | "network" | "summary";

export type Screen =
  | "role"
  | "language"
  | "profile"
  | "payout"
  | "complete"
  | "home"
  | "add"
  | "add-farmer"
  | "listings"
  | "listing-detail"
  | "edit-listing"
  | "order"
  | "orders"
  | "pickup"
  | "payments"
  | "summary"
  | "support"
  | "more"
  | "network";

export function useNavigation() {
  const [screen, setScreen] = useState<Screen>("home");
  const [tab, setTab] = useState<NavTab>("home");
  const [activeListingId, setActiveListingId] = useState<string | null>(null);

  const goHome = useCallback(() => {
    setScreen("home");
    setTab("home");
  }, []);

  const handleTab = useCallback((t: NavTab) => {
    setTab(t);
    // Map tabs to corresponding primary screens
    const tabMap: Record<NavTab, Screen> = {
      home: "home",
      listings: "listings",
      orders: "orders",
      payments: "payments",
      more: "more",
      network: "network",
      summary: "summary",
    };
    setScreen(tabMap[t]);
  }, []);

  const openListingDetail = useCallback((id: string) => {
    setActiveListingId(id);
    setScreen("listing-detail");
  }, []);

  const openAddProduce = useCallback(() => setScreen("add"), []);
  
  const navigateTo = useCallback((s: Screen) => setScreen(s), []);

  return {
    screen,
    tab,
    activeListingId,
    setScreen,
    setTab,
    setActiveListingId,
    goHome,
    handleTab,
    openListingDetail,
    openAddProduce,
    navigateTo,
  };
}
