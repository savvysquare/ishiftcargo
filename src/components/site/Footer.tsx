import { Link } from "@tanstack/react-router";
import { Instagram, MapPin, Phone } from "lucide-react";
import { SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-[var(--navy)] text-white/85">
      <div className="container-x grid gap-12 py-16 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2.5 text-xl font-semibold tracking-tight text-white">
            <img src="/logo.png" alt="iShiftCargo logo" className="h-9 w-9 object-contain" />
            iShift<span className="text-[var(--teal)]">Cargo</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/65">
            Premium, transparent cargo shipping between Nigeria and Canada.
          </p>
          <a href={SITE.instagram} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm text-white/75 hover:text-[var(--teal)]">
            <Instagram className="h-4 w-4" /> @ishiftservices
          </a>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white">Explore</h4>
          <ul className="mt-4 space-y-2 text-sm">
            {[
              ["/services", "Services"],
              ["/how-it-works", "How it Works"],
              ["/rates", "Rates & Schedules"],
              ["/locations", "Locations"],
              ["/faq", "FAQ"],
              ["/book", "Book a Shipment"],
            ].map(([to, label]) => (
              <li key={to}>
                <Link to={to} className="text-white/70 transition-colors hover:text-white">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white">Calgary, Canada</h4>
          <ul className="mt-4 space-y-3 text-sm text-white/70">
            <li className="flex gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--teal)]" /> 495 36th Street NE, Marlborough</li>
            <li className="flex gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--teal)]" /> Cranston SE drop-off</li>
            <li className="flex gap-2"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-[var(--teal)]" /><a href={SITE.phoneHref} className="hover:text-white">{SITE.phone}</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white">Lagos, Nigeria</h4>
          <ul className="mt-4 space-y-3 text-sm text-white/70">
            <li className="flex gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--teal)]" /> {SITE.lagos.address}</li>
            {SITE.lagos.contacts.map((c) => (
              <li key={c.name} className="flex gap-2">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[var(--teal)]" />
                <a href={c.href} className="hover:text-white">{c.name} — {c.phone}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-6 text-xs text-white/55 md:flex-row">
          <p>© 2026 iShiftCargo. Professional Cargo Shipping Between Nigeria and Canada.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">Privacy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
