import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { locations, type Location } from "@/lib/data";

const STORAGE_KEY = "grastheke.location";

type LocationContextValue = {
  activeLocation: Location | null;
  setActiveLocation: (id: string | null) => void;
};

const LocationContext = createContext<LocationContextValue | null>(null);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && locations.some((l) => l.id === stored)) setActiveId(stored);
  }, []);

  const setActiveLocation = useCallback((id: string | null) => {
    setActiveId(id);
    if (id) window.localStorage.setItem(STORAGE_KEY, id);
    else window.localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo(
    () => ({
      activeLocation: locations.find((l) => l.id === activeId) ?? null,
      setActiveLocation,
    }),
    [activeId, setActiveLocation],
  );

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
}

export function useActiveLocation() {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error("useActiveLocation must be used within LocationProvider");
  return ctx;
}