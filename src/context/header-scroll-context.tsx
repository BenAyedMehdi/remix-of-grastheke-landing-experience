import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type HeaderScrollContextValue = {
  isScrolled: boolean;
  sentinelRef: (node: HTMLElement | null) => void;
};

const HeaderScrollContext = createContext<HeaderScrollContextValue | null>(null);

export function HeaderScrollProvider({ children }: { children: ReactNode }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const sentinelNodeRef = useRef<HTMLElement | null>(null);

  const sentinelRef = (node: HTMLElement | null) => {
    sentinelNodeRef.current = node;
  };

  useEffect(() => {
    const sentinel = sentinelNodeRef.current;
    if (!sentinel || typeof IntersectionObserver === "undefined") {
      // Fallback for environments without IntersectionObserver
      const onScroll = () => setIsScrolled(window.scrollY > 0);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsScrolled(!entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0,
        rootMargin: "0px 0px 0px 0px",
      }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <HeaderScrollContext.Provider value={{ isScrolled, sentinelRef }}>
      {children}
    </HeaderScrollContext.Provider>
  );
}

export function useHeaderScroll() {
  const ctx = useContext(HeaderScrollContext);
  if (!ctx) {
    throw new Error(
      "useHeaderScroll must be used within a HeaderScrollProvider"
    );
  }
  return ctx;
}
