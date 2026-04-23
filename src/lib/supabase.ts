import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Demo mode: when Supabase env vars aren't configured (e.g. portfolio
 * deploy), the app runs on mock data with a fake auth session persisted
 * to localStorage. Any email/password is accepted on sign-in.
 */
export const isDemoMode = !url || !anonKey;

// When in demo mode, we export a stub. Consumers must gate real calls
// behind `isDemoMode` checks — the stub will no-op / throw if used.
export const supabase: SupabaseClient<Database> = isDemoMode
  ? (null as unknown as SupabaseClient<Database>)
  : createClient<Database>(url!, anonKey!, {
      auth: { persistSession: true, autoRefreshToken: true },
    });
