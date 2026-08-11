import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Menu, X, MapPin } from "lucide-react";
import { useActiveLocation } from "@/context/location-context";
import { useHeaderScroll } from "@/context/header-scroll-context";
import logoAsset from "@/assets/grastheke-logo.png.asset.json";

const nav = [
  { to: "/standorte", label: "Standorte", matchSubpaths: false },
  { to: "/sortiment", label: "Sortiment", matchSubpaths: true },
  { to: "/chargen", label: "Chargen", matchSubpaths: true },
  { to: "/news", label: "News & Drops", matchSubpaths: true },
  { to: "/apothekenkooperation", label: "Kooperation", matchSubpaths: true },
  { to: "/ueber-uns", label: "Über uns", matchSubpaths: false },
  { to: "/kontakt", label: "Kontakt", matchSubpaths: false },
] as const;

const CLOSE_DURATION = 220;

export function Header() {
  const [open, setOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const { activeLocation } = useActiveLocation();
  const { isScrolled } = useHeaderScroll();
  const location = useLocation();
  const activeRef = useRef<HTMLAnchorElement | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLElement | null>(null);

  const activeIndex = nav.findIndex((item) => {
    const exact = location.pathname === item.to;
    const subpath = item.matchSubpaths && location.pathname.startsWith(`${item.to}/`);
    return exact || subpath;
  });

  useEffect(() => {
    if (open && activeRef.current) {
      activeRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [open, activeIndex]);

  useEffect(() => {
    const original = document.body.style.overflow;
    if (open) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  const requestClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setOpen(false);
    }, CLOSE_DURATION);
  };

  // Escape schließt das Menü und gibt den Fokus an den Toggle-Button zurück
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        requestClose();
        toggleRef.current?.focus();
      }
      if (event.key === "Tab" && panelRef.current) {
        const focusables = [
          toggleRef.current,
          ...Array.from(panelRef.current.querySelectorAll<HTMLElement>("a[href]")),
        ].filter(Boolean) as HTMLElement[];
        if (focusables.length === 0) return;
        const first = focusables[0]!;
        const last = focusables[focusables.length - 1]!;
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, isClosing]);

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
        isScrolled || visible
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
          className="flex items-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-background"
          aria-label="Grastheke – zur Startseite"
        >
          <img
            src={logoAsset.url}
            alt="Grastheke"
            className="h-7 w-auto md:h-8"
            width="160"
            height="40"
          />
        </Link>

        <nav aria-label="Hauptnavigation" className="hidden items-center gap-8 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-sm text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-background"
              activeProps={{
                className: "text-foreground font-medium",
                "aria-current": "page",
              }}
              activeOptions={{ exact: !item.matchSubpaths }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/standorte"
            className="hidden items-center gap-2 rounded-full border border-border px-4 py-2 text-xs transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:inline-flex"
            aria-label={
              activeLocation
                ? `Aktiver Standort: ${activeLocation.city}. Standort ändern`
                : "Standort wählen"
            }
          >
            <MapPin className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
            {activeLocation ? activeLocation.city : "Standort wählen"}
          </Link>
          <button
            type="button"
            ref={toggleRef}
            aria-label={visible ? "Menü schließen" : "Menü öffnen"}
            aria-expanded={visible}
            aria-controls="mobile-navigation"
            aria-haspopup="menu"
            onClick={toggleMenu}
            className="inline-flex size-11 items-center justify-center rounded-full border border-border transition-colors hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background lg:hidden"
          >
            {visible ? (
              <X className="size-4" aria-hidden="true" />
            ) : (
              <Menu className="size-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {visible && (
        <nav
          id="mobile-navigation"
          ref={panelRef}
          aria-label="Mobile Hauptnavigation"
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
                  className={`block rounded-sm border-b border-border py-3.5 text-lg tracking-tight transition-colors last:border-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset ${
                    isActive
                      ? "font-medium text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  activeProps={{
                    className:
                      "block rounded-sm border-b border-border py-3.5 text-lg tracking-tight text-foreground font-medium last:border-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset",
                    "aria-current": "page",
                  }}
                  activeOptions={{ exact: !item.matchSubpaths }}
                >
                  <span className="flex items-center justify-between">
                    {item.label}
                    {isActive && (
                      <span className="ml-3 text-xs font-normal text-accent">
                        Aktuelle Seite
                      </span>
                    )}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}