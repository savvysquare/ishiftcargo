import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Building2, Clock, MapPin, Phone, Tag } from "lucide-react";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/locations")({
  head: () => ({
    meta: [
      { title: "Locations & Drop-Off Points | iShiftCargo" },
      { name: "description", content: "Convenient drop-off locations in Calgary and free pickup at our Lagos office. Major Lagos parks supported." },
      { property: "og:title", content: "Locations | iShiftCargo" },
      { property: "og:description", content: "Drop-off and pickup locations in Calgary and Lagos." },
      { property: "og:url", content: "/locations" },
    ],
    links: [{ rel: "canonical", href: "/locations" }],
  }),
  component: LocationsPage,
});

const parks = ["Ojota", "Iddo", "Jibowu", "Ikotun", "Iyana Ipaja"];

function LocationsPage() {
  return (
    <>
      <section className="bg-[var(--surface)]">
        <div className="container-x py-20 md:py-28">
          <span className="eyebrow">Locations</span>
          <h1 className="mt-5 max-w-3xl text-4xl font-bold tracking-tight text-[var(--navy)] md:text-6xl">
            Convenient drop-off and pickup, both sides.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            Free pickup at our Lagos office, multiple Calgary drop-off points, and major Lagos park pickups arranged on request.
          </p>
        </div>
      </section>

      <section className="section-y">
        <div className="container-x grid gap-10 lg:grid-cols-2">
          {/* Calgary */}
          <div className="rounded-3xl border border-border bg-card p-8 shadow-soft md:p-10">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--teal-soft)] text-[var(--navy)]"><Building2 className="h-5 w-5" /></span>
              <h2 className="text-2xl font-semibold text-[var(--navy)]">Calgary, Canada</h2>
            </div>
            <p className="mt-4 text-base text-muted-foreground">
              Drop off in person at any of our Calgary-area locations. We also serve customers across Alberta, British Columbia, Saskatchewan and Manitoba with additional pickup or delivery arrangements.
            </p>
            <ul className="mt-8 space-y-4">
              {SITE.calgary.map((loc) => (
                <li key={loc.area} className="rounded-2xl border border-border p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-[var(--navy)]">{loc.area}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{loc.details}</p>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-[var(--surface-2)] px-3 py-1 text-xs font-semibold text-[var(--navy)]">
                      <Clock className="h-3 w-3" /> {loc.hours}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-6 rounded-2xl bg-[var(--surface-2)] p-4 text-xs leading-relaxed text-[var(--navy)]">
              Shipments to other Western Canadian cities (BC, AB, SK, MB) are available with extra delivery or pickup arrangements. Always call ahead.
            </p>
            <a href={SITE.phoneHref} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--navy)] hover:text-[var(--teal)]">
              <Phone className="h-4 w-4" /> Call ahead: {SITE.phone}
            </a>
          </div>

          {/* Lagos */}
          <div className="rounded-3xl border border-border bg-card p-8 shadow-soft md:p-10">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--teal-soft)] text-[var(--navy)]"><MapPin className="h-5 w-5" /></span>
              <h2 className="text-2xl font-semibold text-[var(--navy)]">Lagos, Nigeria</h2>
            </div>
            <p className="mt-4 text-base text-muted-foreground">Free pickup at our Lagos office. Delivery available within Lagos and Ogun, and beyond.</p>

            <div className="mt-6 rounded-2xl border border-border p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--teal)]">Lagos Office</p>
              <p className="mt-2 text-sm font-medium leading-relaxed text-[var(--navy)]">{SITE.lagos.address}</p>
              <div className="mt-4 space-y-2">
                {SITE.lagos.contacts.map((c) => (
                  <a key={c.name} href={c.href} className="flex items-center gap-2 text-sm text-[var(--navy)] hover:text-[var(--teal)]">
                    <Phone className="h-4 w-4 text-[var(--teal)]" /> {c.name} — {c.phone}
                  </a>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-[var(--surface-2)] p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--teal)]">Park pickups arranged</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {parks.map((p) => (
                  <li key={p} className="inline-flex items-center gap-1 rounded-full bg-background px-3 py-1.5 text-xs font-medium text-[var(--navy)] shadow-soft">
                    <Tag className="h-3 w-3 text-[var(--teal)]" /> {p}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                If using a dispatch, courier or park drop-off, clearly label with your full name, phone number and full Lagos address.
              </p>
            </div>

            <div className="mt-6 rounded-2xl border border-border p-5 text-xs leading-relaxed text-[var(--navy)]">
              <p className="font-semibold">Delivery rates within Nigeria</p>
              <p className="mt-2">Lagos / Ogun: $1/kg (min $30). Outside Lagos / Ogun: $1.50/kg (min $50).</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="container-x text-center">
          <Link to="/book" className="inline-flex items-center gap-2 rounded-full bg-[var(--teal)] px-7 py-4 text-base font-semibold text-white shadow-soft hover:-translate-y-0.5 transition-all">
            Book a shipment <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
