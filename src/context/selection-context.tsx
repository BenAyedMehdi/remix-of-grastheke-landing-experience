import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { products, type Product } from "@/lib/data";

const STORAGE_KEY = "grastheke.selection";

type SelectionContextValue = {
  selectedProduct: Product | null;
  selectProduct: (slug: string | null) => void;
};

const SelectionContext = createContext<SelectionContextValue | null>(null);

export function SelectionProvider({ children }: { children: ReactNode }) {
  const [slug, setSlug] = useState<string | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && products.some((p) => p.slug === stored)) setSlug(stored);
  }, []);

  const selectProduct = useCallback((next: string | null) => {
    setSlug(next);
    if (next) window.localStorage.setItem(STORAGE_KEY, next);
    else window.localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo(
    () => ({
      selectedProduct: products.find((p) => p.slug === slug) ?? null,
      selectProduct,
    }),
    [slug, selectProduct],
  );

  return <SelectionContext.Provider value={value}>{children}</SelectionContext.Provider>;
}

export function useProductSelection() {
  const ctx = useContext(SelectionContext);
  if (!ctx) throw new Error("useProductSelection must be used within SelectionProvider");
  return ctx;
}
