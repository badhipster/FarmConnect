import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { PayoutRow } from "@/lib/database.types";

export type PayoutWithOrder = PayoutRow & {
  order: {
    id: string;
    listing: { crop: string; emoji: string | null } | null;
  } | null;
};

export function usePayouts() {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["payouts"],
    queryFn: async (): Promise<PayoutWithOrder[]> => {
      const { data, error } = await supabase
        .from("payouts")
        .select(
          `*,
           order:orders(id, listing:listings(crop, emoji))`
        )
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as PayoutWithOrder[];
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel("payouts-rt")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "payouts" },
        () => qc.invalidateQueries({ queryKey: ["payouts"] })
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [qc]);

  return query;
}
