import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { WeeklySummaryRow } from "@/lib/database.types";

const EMPTY: WeeklySummaryRow = {
  farmer_id: "",
  paid_amount: 0,
  pending_amount: 0,
  pickups_completed: 0,
  total_qty_collected: 0,
  total_earnings: 0,
};

export function useWeeklySummary(farmerId: string | undefined) {
  return useQuery({
    queryKey: ["weekly_summary", farmerId],
    enabled: !!farmerId,
    queryFn: async (): Promise<WeeklySummaryRow> => {
      if (!farmerId) return EMPTY;
      const { data, error } = await supabase
        .from("weekly_summary")
        .select("*")
        .eq("farmer_id", farmerId)
        .maybeSingle();
      if (error) throw error;
      return data ?? { ...EMPTY, farmer_id: farmerId };
    },
  });
}
