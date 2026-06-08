import { Link } from "@tanstack/react-router";
import { Instagram, Menu, Phone, X } from "lucide-react";
import { useState } from "react";
import { SITE } from "@/lib/site";

const links = [
  { to: "/services", label: "Services" },
  { to: "/how-it-works", label: "How it Works" },
  { to: "/rates", label: "Rates & Schedules" },
  { to: "/locations", label: "Locations" },
  { to: "/faq", label: "FAQ" },
  { to: "/track", label: "Track Shipment" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="container-x flex h-18 items-center justify-between py-4">
        <Link to="/" className="group flex items-center gap-2.5">
          <img
            src="/logo.png"
            alt="iShiftCargo logo"
            className="h-9 w-9 object-contain transition-transform group-hover:scale-105"
          />
          <span className="text-lg font-semibold tracking-tight text-[var(--navy)]">
            iShift<span className="text-[var(--teal)]">Cargo</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-[var(--navy)]"
              activeProps={{ className: "text-[var(--navy)]" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <a href={SITE.phoneHref} className="flex items-center gap-2 text-sm font-medium text-[var(--navy)] hover:text-[var(--teal)]">
            <Phone className="h-4 w-4" /> {SITE.phone}
          </a>
          <a href={SITE.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="text-muted-foreground hover:text-[var(--teal)]">
            <Instagram className="h-5 w-5" />
          </a>
          <Link
            to="/book"
            className="inline-flex items-center rounded-full bg-[var(--teal)] px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
          >
            Book Shipment
          </Link>
        </div>

        <button
          className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border text-[var(--navy)]"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-background">
          <div className="container-x flex flex-col gap-1 py-4">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-medium text-foreground hover:bg-secondary"
              >
                {l.label}
              </Link>
            ))}
            <a href={SITE.phoneHref} className="rounded-lg px-3 py-3 text-sm font-medium text-foreground hover:bg-secondary">
              {SITE.phone}
            </a>
            <Link
              to="/book"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center rounded-full bg-[var(--teal)] px-5 py-3 text-sm font-semibold text-white"
            >
              Book Shipment
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
