import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export function useRequestCallback() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { farmer_id: string; context?: string }) => {
      const { data, error } = await supabase
        .from("callback_requests")
        .insert(input)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["callback_requests"] }),
  });
}
