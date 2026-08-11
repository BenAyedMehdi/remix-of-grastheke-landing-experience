import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Menu, X, MapPin } from "lucide-react";
import { useActiveLocation } from "@/context/location-context";
import logoAsset from "@/assets/grastheke-logo.png.asset.json";

const nav = [
  { to: "/standorte", label: "Standorte" },
  { to: "/sortiment", label: "Sortiment" },
  { to: "/chargen", label: "Chargen" },
  { to: "/news", label: "News & Drops" },
  { to: "/apothekenkooperation", label: "Kooperation" },
  { to: "/ueber-uns", label: "Über uns" },
  { to: "/kontakt", label: "Kontakt" },
] as const;

const CLOSE_DURATION = 220;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const { activeLocation } = useActiveLocation();
  const location = useLocation();
  const activeRef = useRef<HTMLAnchorElement | null>(null);

  const activeIndex = nav.findIndex((item) =>
    item.to === "/"
      ? location.pathname === "/"
      : location.pathname === item.to || location.pathname.startsWith(`${item.to}/`)
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (open && activeRef.current) {
      activeRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [open, activeIndex]);

  useEffect(() => {
    if (open) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [open]);

  const requestClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setOpen(false);
    }, CLOSE_DURATION);
  };

  const toggleMenu = () => {
    if (open) {
      requestClose();
    } else {
      setOpen(true);
    }
  };

  const visible = open || isClosing;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled || visible
          ? "bg-background/90 backdrop-blur-md border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 md:h-20 md:px-10">
        <Link
          to="/"
          onClick={() => {
            if (visible) requestClose();
          }}
          className="flex items-center"
          aria-label="Grastheke Startseite"
        >
          <img
            src={logoAsset.url}
            alt="Grastheke"
            className="h-7 w-auto md:h-8"
            width="160"
            height="40"
          />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground font-medium" }}
              activeOptions={{ exact: true }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/standorte"
            className="hidden items-center gap-2 rounded-full border border-border px-4 py-2 text-xs transition-colors hover:border-accent hover:text-accent sm:inline-flex"
          >
            <MapPin className="size-3.5" strokeWidth={1.5} />
            {activeLocation ? activeLocation.city : "Standort wählen"}
          </Link>
          <button
            type="button"
            aria-label={visible ? "Menü schließen" : "Menü öffnen"}
            aria-expanded={visible}
            aria-controls="mobile-navigation"
            onClick={toggleMenu}
            className="inline-flex size-9 items-center justify-center rounded-full border border-border transition-colors hover:bg-accent/10 lg:hidden"
          >
            {visible ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {visible && (
        <nav
          id="mobile-navigation"
          className={`overflow-hidden border-t border-border bg-background px-5 pb-6 pt-2 transition-all duration-[${CLOSE_DURATION}ms] ease-out lg:hidden ${
            isClosing ? "max-h-0 opacity-0" : "max-h-[calc(100dvh-4rem)] opacity-100"
          }`}
          style={{ contain: "content" }}
        >
          <div className="max-h-[calc(100dvh-7rem)] overflow-y-auto">
            {nav.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <Link
                  key={item.to}
                  ref={isActive ? activeRef : undefined}
                  to={item.to}
                  onClick={requestClose}
                  className={`block border-b border-border py-3.5 text-lg tracking-tight transition-colors last:border-0 ${
                    isActive
                      ? "font-medium text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  activeProps={{ className: "block border-b border-border py-3.5 text-lg tracking-tight text-foreground font-medium last:border-0" }}
                  activeOptions={{ exact: true }}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}