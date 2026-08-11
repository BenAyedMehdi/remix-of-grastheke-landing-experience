import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
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

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { activeLocation } = useActiveLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled || open
          ? "bg-background/90 backdrop-blur-md border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 md:h-20 md:px-10">
        <Link
          to="/"
          onClick={() => setOpen(false)}
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
            aria-label="Menü"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex size-9 items-center justify-center rounded-full border border-border lg:hidden"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border bg-background px-5 pb-6 pt-2 lg:hidden">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="block border-b border-border py-3.5 text-lg tracking-tight last:border-0"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}