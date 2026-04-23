import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { ListingInsert, ListingRow } from "@/lib/database.types";

const KEY = ["listings"] as const;

export function useListings() {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: KEY,
    queryFn: async (): Promise<ListingRow[]> => {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .order("submitted_date", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  // Realtime — push status changes straight into the cache
  useEffect(() => {
    const channel = supabase
      .channel("listings-rt")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "listings" },
        () => qc.invalidateQueries({ queryKey: KEY })
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [qc]);

  return query;
}

export function useListing(id: string | undefined) {
  return useQuery({
    queryKey: ["listings", id],
    enabled: !!id,
    queryFn: async (): Promise<ListingRow | null> => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateListing() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: ListingInsert): Promise<ListingRow> => {
      const { data, error } = await supabase
        .from("listings")
        .insert(input)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}
