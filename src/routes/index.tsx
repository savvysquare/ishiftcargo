import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Box, CheckCircle2, Clock, Plane, Quote, Shield, Ship, Snowflake, Car, MapPin } from "lucide-react";
import heroImg from "@/assets/hero-warehouse.jpg";
import airImg from "@/assets/air-cargo.jpg";
import seaImg from "@/assets/sea-cargo.jpg";
import frozenImg from "@/assets/frozen-cargo.jpg";
import vehicleImg from "@/assets/vehicle-cargo.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "iShiftCargo | Premium Cargo Shipping | Nigeria ↔ Canada" },
      { name: "description", content: "Reliable air, sea and vehicle shipping between Nigeria and Canada. Transparent pricing, no hidden clearance fees, convenient drop-off & pickup." },
      { property: "og:title", content: "iShiftCargo | Premium Cargo Shipping | Nigeria ↔ Canada" },
      { property: "og:description", content: "Reliable cargo shipping between Nigeria and Canada. Transparent pricing. Bi-weekly air, sea and vehicle freight." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

const trustItems = [
  "No Hidden Clearance Fees in Nigeria",
  "Free Pickup at Our Lagos Office",
  "7–10 Day Air Transit",
  "Serving Alberta, British Columbia, Saskatchewan & Manitoba",
];

const services = [
  {
    icon: Plane,
    title: "Bi-Weekly Air Cargo (Dry)",
    blurb: "Fast, dependable air freight on a consistent schedule.",
    highlight: "7–10 day transit",
    image: airImg,
  },
  {
    icon: Snowflake,
    title: "Bi-Weekly Frozen Air Cargo",
    blurb: "Temperature-controlled handling for perishables and Nigerian frozen specialties.",
    highlight: "3–5 day transit",
    image: frozenImg,
  },
  {
    icon: Ship,
    title: "Sea Cargo",
    blurb: "Box shipping and per-kg sea freight for larger, less time-sensitive shipments.",
    highlight: "From $120 CAD / box",
    image: seaImg,
  },
  {
    icon: Car,
    title: "Premium Vehicle Shipping",
    blurb: "Sedans and SUVs, professionally loaded, secured and tracked.",
    highlight: "From $1,650 USD",
    image: vehicleImg,
  },
];

const steps = [
  { title: "Get a Quote & Book", text: "Use our simple form or call our team." },
  { title: "Drop Off or Pickup", text: "Free at our Lagos office, or major Lagos parks. Convenient Calgary locations." },
  { title: "We Handle Everything", text: "Inspection, weighing, documentation, secure packing and customs prep." },
  { title: "Departs on Schedule", text: "Bi-weekly or weekly air, monthly sea — consistent departures." },
  { title: "Track & Collect", text: "Free pickup at destination, or arrange delivery to your door." },
];

const testimonials = [
  { quote: "Everything arrived in perfect condition and on time. The pricing was exactly what they quoted — no surprises.", name: "Adaeze O.", role: "Calgary, Alberta" },
  { quote: "Shipped my mother's frozen food to Calgary and it arrived beautifully. Their team kept me updated the whole way.", name: "Ifeoma E.", role: "Lagos, Nigeria" },
  { quote: "Sent a vehicle from Calgary to Lagos. Professional from pickup to port. I'll use them again.", name: "Tunde A.", role: "Calgary, Alberta" },
];

function Index() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-[var(--surface)]">
        <div className="absolute inset-0 -z-10">
          <img src={heroImg} alt="" width={1920} height={1080} className="h-full w-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-white/40" />
        </div>
        <div className="container-x grid items-center gap-12 py-20 md:py-32 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <span className="eyebrow"><span className="h-1.5 w-1.5 rounded-full bg-[var(--teal)]" /> Nigeria ↔ Canada</span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-[var(--navy)] md:text-6xl lg:text-7xl">
              Reliable cargo shipping between Nigeria and Canada.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              Premium air, sea and vehicle transport with transparent pricing, no hidden clearance fees, and convenient drop-off & pickup in Canada and Nigeria.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link to="/book" className="group inline-flex items-center gap-2 rounded-full bg-[var(--teal)] px-7 py-4 text-base font-semibold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift">
                Book Your Shipment <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link to="/rates" className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-7 py-4 text-base font-semibold text-[var(--navy)] transition-colors hover:bg-secondary">
                View Current Rates & Schedules
              </Link>
            </div>
          </div>
          <div className="hidden lg:col-span-5 lg:block">
            <div className="rounded-3xl border border-border bg-background/80 p-6 shadow-lift backdrop-blur">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Next departures</span>
                <span className="rounded-full bg-[var(--teal-soft)] px-3 py-1 text-xs font-semibold text-[var(--navy)]">Live</span>
              </div>
              <ul className="mt-5 space-y-4">
                {[
                  { lane: "Lagos → Calgary", mode: "Weekly Air (Dry)", when: "Departs every Friday" },
                  { lane: "Calgary → Lagos", mode: "Bi-Weekly Air (Dry)", when: "7–10 day transit" },
                  { lane: "Lagos → Calgary", mode: "Bi-Weekly Frozen Air", when: "3–5 day transit" },
                  { lane: "Calgary → Lagos", mode: "Sea Cargo (Box)", when: "~2–3 months" },
                ].map((d) => (
                  <li key={d.mode} className="flex items-start justify-between gap-4 border-b border-border pb-4 last:border-0 last:pb-0">
                    <div>
                      <p className="text-sm font-semibold text-[var(--navy)]">{d.lane}</p>
                      <p className="text-xs text-muted-foreground">{d.mode}</p>
                    </div>
                    <span className="text-xs font-medium text-[var(--teal)]">{d.when}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="border-y border-border bg-background/70 backdrop-blur">
          <div className="container-x grid grid-cols-2 gap-3 py-5 text-sm text-muted-foreground md:grid-cols-4 md:items-center">
            {trustItems.map((t) => (
              <div key={t} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--teal)]" />
                <span className="font-medium text-[var(--navy)] leading-tight">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="section-y">
        <div className="container-x">
          <div className="mx-auto max-w-3xl text-center">
            <span className="eyebrow">Our services</span>
            <h2 className="mt-5 text-3xl font-bold text-[var(--navy)] md:text-5xl">
              Four ways to move your cargo with confidence.
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Whether you're sending a small package home or shipping a vehicle across the world, we have a clear, transparent option for you.
            </p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => (
              <article key={s.title} className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={s.image} alt={s.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute left-4 top-4 grid h-11 w-11 place-items-center rounded-xl bg-white/95 text-[var(--teal)] shadow-soft">
                    <s.icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-lg font-semibold text-[var(--navy)]">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.blurb}</p>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-[var(--teal)]">{s.highlight}</p>
                  <Link to="/rates" className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-[var(--navy)] hover:text-[var(--teal)]">
                    View details & rates <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-[var(--surface)] section-y">
        <div className="container-x">
          <div className="mx-auto max-w-3xl text-center">
            <span className="eyebrow">How it works</span>
            <h2 className="mt-5 text-3xl font-bold text-[var(--navy)] md:text-5xl">A simple, five-step shipping process.</h2>
            <p className="mt-4 text-lg text-muted-foreground">From booking to collection, we make every step easy to understand and stress-free.</p>
          </div>

          <ol className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            {steps.map((s, i) => (
              <li key={s.title} className="relative rounded-3xl border border-border bg-background p-6 shadow-soft">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--navy)] text-sm font-bold text-white">0{i + 1}</span>
                <h3 className="mt-4 text-base font-semibold text-[var(--navy)]">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
              </li>
            ))}
          </ol>

          <div className="mt-12 text-center">
            <Link to="/how-it-works" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--navy)] hover:text-[var(--teal)]">
              Learn more about the full process <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* TRUST / FEATURES */}
      <section className="section-y">
        <div className="container-x grid gap-16 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="eyebrow">Why iShiftCargo</span>
            <h2 className="mt-5 text-3xl font-bold text-[var(--navy)] md:text-5xl">Built on trust, transparency, and care.</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              We treat every package — whether it's a single box to family or a vehicle for your new life abroad — with the same professional standards.
            </p>
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {[
                { icon: Shield, title: "Transparent pricing", text: "No hidden clearance fees in Nigeria. Every cost is explained upfront." },
                { icon: Clock, title: "Consistent schedules", text: "Weekly and bi-weekly air departures you can plan around." },
                { icon: Box, title: "Specialized handling", text: "Frozen, electronics, vehicles — each with the right care." },
                { icon: MapPin, title: "Reach across Canada", text: "Calgary, Alberta, British Columbia, Saskatchewan and Manitoba." },
              ].map((f) => (
                <div key={f.title} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--teal-soft)] text-[var(--navy)]">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h4 className="mt-4 text-sm font-semibold text-[var(--navy)]">{f.title}</h4>
                  <p className="mt-1 text-sm text-muted-foreground">{f.text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="overflow-hidden rounded-3xl border border-border shadow-lift">
              <img src={seaImg} alt="Container ship at sea" loading="lazy" className="h-full w-full object-cover" />
            </div>
            <div className="absolute -bottom-6 -left-6 hidden rounded-2xl border border-border bg-background p-5 shadow-lift md:block">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Shipments delivered</p>
              <p className="mt-1 text-3xl font-bold text-[var(--navy)]">10,000+</p>
              <p className="text-sm text-muted-foreground">between Nigeria and Canada</p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-[var(--surface)] section-y">
        <div className="container-x">
          <div className="mx-auto max-w-3xl text-center">
            <span className="eyebrow">Testimonials</span>
            <h2 className="mt-5 text-3xl font-bold text-[var(--navy)] md:text-5xl">Trusted by families and businesses on both sides.</h2>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <figure key={t.name} className="rounded-3xl border border-border bg-card p-8 shadow-soft">
                <Quote className="h-7 w-7 text-[var(--teal)]" />
                <blockquote className="mt-5 text-base leading-relaxed text-[var(--navy)]">"{t.quote}"</blockquote>
                <figcaption className="mt-6 text-sm">
                  <span className="font-semibold text-[var(--navy)]">{t.name}</span>
                  <span className="text-muted-foreground"> · {t.role}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="section-y">
        <div className="container-x">
          <div className="overflow-hidden rounded-[2.5rem] bg-[var(--navy)] px-8 py-16 text-center text-white md:px-16 md:py-24">
            <h2 className="mx-auto max-w-3xl text-3xl font-bold md:text-5xl">Ready to ship with confidence?</h2>
            <p className="mx-auto mt-5 max-w-2xl text-base text-white/75 md:text-lg">
              Book your shipment online in minutes, or speak directly to our team. Transparent pricing, no surprises.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link to="/book" className="inline-flex items-center gap-2 rounded-full bg-[var(--teal)] px-7 py-4 text-base font-semibold text-white shadow-soft transition-all hover:-translate-y-0.5">
                Book Your Shipment Now <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="tel:+14034316456" className="inline-flex items-center gap-2 rounded-full border border-white/30 px-7 py-4 text-base font-semibold text-white hover:bg-white/10">
                Call +1 (403) 431-6456
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
