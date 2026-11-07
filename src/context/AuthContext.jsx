import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { isConfigured } from "../lib/supabase.js";
import * as auth from "../services/auth.js";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [ready, setReady] = useState(!isConfigured);
  const [isAdmin, setIsAdmin] = useState(false);
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
      setIsAdmin(false);
      setCheckedUid(null);
      return undefined;
    }
    let cancelled = false;
    auth.fetchIsAdmin(uid).then((value) => {
      if (cancelled) return;
      setIsAdmin(value);
      setCheckedUid(uid);
    });
    return () => {
      cancelled = true;
    };
  }, [uid]);

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      isAdmin,
      loading: !ready || (Boolean(uid) && checkedUid !== uid),
      signIn: auth.signIn,
      signOut: auth.signOut,
    }),
    [session, isAdmin, ready, uid, checkedUid]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
