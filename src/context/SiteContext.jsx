import { createContext, useContext } from "react";
import useAsync from "../hooks/useAsync.js";
import { getSettings, listActiveOffices } from "../services/office.js";

const DEFAULTS = {
  firm_name: "Tan & Rahman Advocates & Solicitors",
  whatsapp: "",
  business_hours: "",
  social_links: {},
};

const SiteContext = createContext({ settings: DEFAULTS, offices: [], loading: true, error: null });
export const useSite = () => useContext(SiteContext);

// Loads firm settings and offices once for the whole public website.
export function SiteProvider({ children }) {
  const { data, loading, error } = useAsync(async () => {
    const [settings, offices] = await Promise.all([getSettings(), listActiveOffices()]);
    return { settings, offices };
  });

  const value = {
    settings: { ...DEFAULTS, ...(data?.settings || {}) },
    offices: data?.offices || [],
    loading,
    error,
  };
  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}
