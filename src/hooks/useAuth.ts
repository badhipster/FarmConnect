import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase, isDemoMode } from "@/lib/supabase";
import type { ProfileRow, UserRole } from "@/lib/database.types";

const DEMO_SESSION_KEY = "farmconnect_demo_session";

function loadDemoSession(): Session | null {
  try {
    const raw = window.localStorage.getItem(DEMO_SESSION_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

function buildDemoSession(
  email: string,
  meta?: { full_name?: string; role?: UserRole },
): Session {
  const now = Math.floor(Date.now() / 1000);
  const user = {
    id: `demo-${email}`,
    aud: "authenticated",
    email,
    app_metadata: { provider: "demo" },
    user_metadata: {
      full_name: meta?.full_name ?? email.split("@")[0],
      role: meta?.role ?? "farmer",
    },
    created_at: new Date().toISOString(),
  } as unknown as User;

  return {
    access_token: "demo-access-token",
    refresh_token: "demo-refresh-token",
    token_type: "bearer",
    expires_in: 3600,
    expires_at: now + 3600,
    user,
  } as Session;
}

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    if (isDemoMode) {
      setSession(loadDemoSession());
      return;
    }
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  return {
    session,
    user: session?.user ?? null,
    signIn: async (email: string, password: string) => {
      if (isDemoMode) {
        const s = buildDemoSession(email);
        window.localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(s));
        setSession(s);
        return { data: { session: s, user: s.user }, error: null };
      }
      return supabase.auth.signInWithPassword({ email, password });
    },
    signUp: async (
      email: string,
      password: string,
      meta: { full_name: string; role: UserRole },
    ) => {
      if (isDemoMode) {
        const s = buildDemoSession(email, meta);
        window.localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(s));
        setSession(s);
        return { data: { session: s, user: s.user }, error: null };
      }
      return supabase.auth.signUp({
        email,
        password,
        options: { data: meta },
      });
    },
    signOut: async () => {
      if (isDemoMode) {
        window.localStorage.removeItem(DEMO_SESSION_KEY);
        setSession(null);
        return { error: null };
      }
      return supabase.auth.signOut();
    },
  };
}

export function useProfile(user: User | null) {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user && !isDemoMode,
    // In demo mode, synthesize a null profile so onboarding kicks off.
    initialData: isDemoMode ? (null as ProfileRow | null) : undefined,
    queryFn: async (): Promise<ProfileRow | null> => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      if (error) throw error;
      return data;
    },
  });

  const updateProfile = async (patch: Partial<ProfileRow>) => {
    if (!user) throw new Error("not signed in");
    if (isDemoMode) {
      // Persist onboarding edits in the query cache; data is not hydrated
      // from a backend so this is purely a local no-throw.
      const existing = (qc.getQueryData(["profile", user.id]) as ProfileRow | null) ?? null;
      const merged = { ...(existing || { id: user.id }), ...patch } as ProfileRow;
      qc.setQueryData(["profile", user.id], merged);
      return merged;
    }
    const { data, error } = await supabase
      .from("profiles")
      .update(patch)
      .eq("id", user.id)
      .select()
      .single();
    if (error) throw error;
    qc.setQueryData(["profile", user.id], data);
    return data;
  };

  return { ...query, updateProfile };
}
