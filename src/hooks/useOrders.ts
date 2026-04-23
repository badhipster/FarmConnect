import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { OrderRow, PickupRow } from "@/lib/database.types";

export type OrderWithPickup = OrderRow & {
  listing: { crop: string; emoji: string | null; farmer_id: string } | null;
  pickup: PickupRow | null;
};

const KEY = ["orders"] as const;

export function useOrders() {
  return useQuery({
    queryKey: KEY,
    queryFn: async (): Promise<OrderWithPickup[]> => {
      const { data, error } = await supabase
        .from("orders")
        .select(
          `*,
           listing:listings(crop, emoji, farmer_id),
           pickup:pickups(*)`
        )
        .order("pickup_date", { ascending: true });
      if (error) throw error;
      // Supabase returns pickup as an array for a 1:1 — flatten.
      return (data ?? []).map((r: any) => ({
        ...r,
        pickup: Array.isArray(r.pickup) ? r.pickup[0] ?? null : r.pickup,
      }));
    },
  });
}

export function useOrder(id: string | undefined) {
  return useQuery({
    queryKey: ["orders", id],
    enabled: !!id,
    queryFn: async (): Promise<OrderWithPickup | null> => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("orders")
        .select(
          `*,
           listing:listings(crop, emoji, farmer_id),
           pickup:pickups(*)`
        )
        .eq("id", id)
        .single();
      if (error) throw error;
      return {
        ...(data as any),
        pickup: Array.isArray((data as any).pickup)
          ? (data as any).pickup[0] ?? null
          : (data as any).pickup,
      };
    },
  });
}

export function useAcceptOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (orderId: string) => {
      const { data, error } = await supabase
        .from("orders")
        .update({ status: "Accepted" })
        .eq("id", orderId)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      qc.invalidateQueries({ queryKey: ["listings"] });
    },
  });
}
