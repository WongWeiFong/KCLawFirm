import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { isConfigured } from "../lib/supabase.js";
import * as auth from "../services/auth.js";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [ready, setReady] = useState(!isConfigured);
  const [profile, setProfile] = useState(null);
  const [checkedUid, setCheckedUid] = useState(null);

  useEffect(() => {
    if (!isConfigured) return undefined;
    auth.getSession().then((s) => {
      setSession(s);
      setReady(true);
    });
    const { data } = auth.onAuthChange(setSession);
    return () => data.subscription.unsubscribe();
  }, []);

  const uid = session?.user?.id ?? null;

  useEffect(() => {
    if (!uid) {
      setProfile(null);
      setCheckedUid(null);
      return undefined;
    }
    let cancelled = false;
    auth.fetchProfile(uid).then((p) => {
      if (cancelled) return;
      setProfile(p);
      setCheckedUid(uid);
    });
    return () => {
      cancelled = true;
    };
  }, [uid]);

  const refreshProfile = useCallback(async () => {
    if (uid) setProfile(await auth.fetchProfile(uid));
  }, [uid]);

  const value = useMemo(() => {
    const active = profile?.is_active !== false;
    const isAdmin = profile?.role === "admin" && active;
    const isStaff = profile?.role === "staff" && active;
    return {
      session,
      user: session?.user ?? null,
      profile,
      role: profile?.role ?? null,
      isAdmin,
      isStaff,
      canAccess: isAdmin || isStaff,
      deactivated: Boolean(profile) && !active,
      loading: !ready || (Boolean(uid) && checkedUid !== uid),
      refreshProfile,
      signIn: auth.signIn,
      signOut: auth.signOut,
    };
  }, [session, profile, ready, uid, checkedUid, refreshProfile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
