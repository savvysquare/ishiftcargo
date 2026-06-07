import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AlertCircle, ArrowRight, ArrowRightLeft, Plane, Ship, Snowflake, Car } from "lucide-react";

export const Route = createFileRoute("/rates")({
  head: () => ({
    meta: [
      { title: "Rates & Schedules | iShiftCargo" },
      { name: "description", content: "Transparent rates and schedules for air, frozen, sea and vehicle shipping between Lagos and Calgary. No hidden clearance fees." },
      { property: "og:title", content: "Rates & Schedules | iShiftCargo" },
      { property: "og:description", content: "Transparent rates and schedules for shipping between Lagos and Western Canada." },
      { property: "og:url", content: "/rates" },
    ],
    links: [{ rel: "canonical", href: "/rates" }],
  }),
  component: RatesPage,
});

type Service = {
  icon: typeof Plane;
  title: string;
  schedule: string;
  rows: { label: string; value: string }[];
  notes?: string[];
};

const canadaToNigeria: Service[] = [
  {
    icon: Plane, title: "Bi-Weekly Air Cargo (Dry)", schedule: "7–10 business days",
    rows: [
      { label: "5 kg and above", value: "$14.00 / kg CAD" },
      { label: "4.99 kg or less", value: "Flat $70 CAD" },
      { label: "Personal / smart electronics", value: "$70 CAD per device (negotiable for multiples)" },
      { label: "Weight basis", value: "Higher of physical or volumetric" },
    ],
    notes: ["No hidden clearance fees in Nigeria."],
  },
  {
    icon: Ship, title: "Sea Cargo — Box Shipping", schedule: "Approx. 2–3 months",
    rows: [
      { label: "Medium / large U-Haul box (max 32 kg / 70 lbs)", value: "$120 CAD" },
      { label: "Extra-large or overweight boxes", value: "Not accepted" },
    ],
    notes: ["No hidden charges. No clearance fees in Nigeria."],
  },
  {
    icon: Car, title: "Vehicle Shipping", schedule: "On-demand · varies",
    rows: [
      { label: "Sedans and SUVs from", value: "$1,650 USD (customs separate)" },
      { label: "Loading & securing", value: "Professional, included" },
      { label: "Mode", value: "Port-to-port or door-to-door" },
      { label: "Full container", value: "Available for 4+ vehicles" },
    ],
    notes: ["Vehicle inspection reports provided. Insurance options available."],
  },
];

const nigeriaToCanada: Service[] = [
  {
    icon: Plane, title: "Weekly Air Cargo (Dry)", schedule: "~3 weeks (estimate only)",
    rows: [
      { label: "Shipping", value: "₦6,300 / kg" },
      { label: "Calgary clearance", value: "$2 / kg CAD" },
      { label: "Minimum chargeable weight", value: "10 kg" },
      { label: "Departures", value: "Every Friday — drop off before 10:00am" },
    ],
  },
  {
    icon: Ship, title: "Monthly Sea Cargo (Dry)", schedule: "3–4 months estimate",
    rows: [
      { label: "Shipping", value: "₦400 / kg" },
      { label: "Calgary clearance", value: "$1.50 / kg CAD" },
      { label: "Minimum chargeable weight", value: "50 kg" },
      { label: "Distribution", value: "Container arrives Calgary, then distributed" },
    ],
  },
  {
    icon: Snowflake, title: "Bi-Weekly Frozen Air Cargo", schedule: "3–5 days estimate",
    rows: [
      { label: "Shipping", value: "₦8,800 / kg" },
      { label: "Udara / Agbalumo surcharge", value: "+ ₦1,000 / kg" },
      { label: "Calgary clearance", value: "$3 / kg CAD" },
      { label: "Minimum chargeable weight", value: "10 kg" },
    ],
    notes: ["Temperature-controlled handling throughout."],
  },
];

const commonNotes = [
  "Food items must be packed according to Canadian Customs rules. Improperly packed items will be repacked and a ₦5,000 handling fee will be charged.",
  "Timelines are estimates only and not guaranteed.",
  "Always call ahead to confirm drop-off and pickup times: +1 (403) 431-6456.",
  "For 3rd-party dispatch, courier or park drop-offs: clearly label with full name, phone and full Lagos address.",
  "Volumetric weight vs physical weight rule applies where stated.",
  "Delivery in Lagos / Ogun: $1/kg (min $30). Outside Lagos / Ogun: $1.50/kg (min $50).",
  "Doorstep delivery and shipping to other Canadian cities available at additional cost.",
];

function RatesPage() {
  const [tab, setTab] = useState<"ca-ng" | "ng-ca">("ca-ng");
  const active = tab === "ca-ng" ? canadaToNigeria : nigeriaToCanada;

  return (
    <>
      <section className="bg-[var(--surface)]">
        <div className="container-x py-20 md:py-28">
          <span className="eyebrow">Rates & Schedules</span>
          <h1 className="mt-5 max-w-3xl text-4xl font-bold tracking-tight text-[var(--navy)] md:text-6xl">
            Transparent pricing, both directions.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            Every rate is published clearly — no hidden fees, no surprises. Switch direction below to view your route.
          </p>
        </div>
      </section>

      <section className="section-y">
        <div className="container-x">
          <div className="mx-auto inline-flex w-full max-w-xl items-center rounded-full border border-border bg-background p-1 shadow-soft md:flex">
            {[
              { key: "ca-ng", label: "Canada → Nigeria" },
              { key: "ng-ca", label: "Nigeria → Canada" },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key as typeof tab)}
                className={`flex-1 rounded-full px-5 py-3 text-sm font-semibold transition-all ${
                  tab === t.key ? "bg-[var(--navy)] text-white shadow-soft" : "text-muted-foreground hover:text-[var(--navy)]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {active.map((s) => (
              <article key={s.title} className="rounded-3xl border border-border bg-card p-8 shadow-soft">
                <div className="flex items-center gap-4">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-[var(--teal-soft)] text-[var(--navy)]">
                    <s.icon className="h-6 w-6" />
                  </span>
                  <div>
                    <h2 className="text-xl font-semibold text-[var(--navy)]">{s.title}</h2>
                    <p className="text-xs font-medium uppercase tracking-wider text-[var(--teal)]">{s.schedule}</p>
                  </div>
                </div>
                <dl className="mt-6 divide-y divide-border">
                  {s.rows.map((r) => (
                    <div key={r.label} className="grid grid-cols-3 gap-4 py-3 text-sm">
                      <dt className="col-span-2 text-muted-foreground">{r.label}</dt>
                      <dd className="text-right font-semibold text-[var(--navy)]">{r.value}</dd>
                    </div>
                  ))}
                </dl>
                {s.notes && (
                  <ul className="mt-5 space-y-2">
                    {s.notes.map((n) => (
                      <li key={n} className="rounded-xl bg-[var(--surface-2)] px-4 py-3 text-xs font-medium text-[var(--navy)]">
                        {n}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--surface)] section-y">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_2fr]">
          <div>
            <span className="eyebrow"><AlertCircle className="h-3.5 w-3.5" /> Important</span>
            <h2 className="mt-5 text-3xl font-bold text-[var(--navy)] md:text-4xl">Notes that apply to all services.</h2>
            <p className="mt-4 text-base text-muted-foreground">
              We keep these in plain sight so your first shipment goes smoothly. If anything is unclear, just call us.
            </p>
            <Link to="/book" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--teal)] px-6 py-3 text-sm font-semibold text-white shadow-soft hover:-translate-y-0.5 transition-all">
              Book your shipment <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <ul className="space-y-3">
            {commonNotes.map((n) => (
              <li key={n} className="flex items-start gap-3 rounded-2xl border border-border bg-background p-5 text-sm leading-relaxed text-[var(--navy)] shadow-soft">
                <ArrowRightLeft className="mt-0.5 h-4 w-4 shrink-0 text-[var(--teal)]" /> {n}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
