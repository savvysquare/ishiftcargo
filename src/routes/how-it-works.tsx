import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Calendar, ClipboardCheck, MapPin, PackageCheck, PhoneCall, Truck } from "lucide-react";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How it Works | iShiftCargo" },
      { name: "description", content: "A simple 5-step shipping process: quote, drop-off or pickup, professional handling, scheduled departure, and easy collection." },
      { property: "og:title", content: "How it Works | iShiftCargo" },
      { property: "og:description", content: "A simple 5-step shipping process between Nigeria and Canada." },
      { property: "og:url", content: "/how-it-works" },
    ],
    links: [{ rel: "canonical", href: "/how-it-works" }],
  }),
  component: HowItWorks,
});

const steps = [
  { icon: PhoneCall, title: "Get a Quote & Book", text: "Use our simple online form or call our team to confirm details, pricing and the next departure date." },
  { icon: MapPin, title: "Drop Off or Arrange Pickup", text: "Drop off at our convenient Calgary locations or free at our Lagos office. We can also collect from major Lagos parks: Ojota, Iddo, Jibowu, Ikotun and Iyana Ipaja." },
  { icon: ClipboardCheck, title: "We Handle Everything", text: "Professional inspection, weighing, documentation, secure packing and customs preparation. We'll let you know if anything needs adjustment before departure." },
  { icon: Calendar, title: "Your Shipment Departs on Schedule", text: "Bi-weekly or weekly air departures, and monthly sea departures. Consistent schedules you can plan around." },
  { icon: PackageCheck, title: "Track & Collect", text: "Free pickup at our destination office or arrange delivery to your door. Real-time updates from our team throughout transit." },
];

const notes = [
  "Always call ahead to confirm drop-off and pickup times.",
  "Timelines are estimates only and not guaranteed.",
  "For 3rd-party dispatch, courier or park drop-offs: label clearly with full name, phone, and full Lagos address.",
  "Food items must be packed according to Canadian Customs rules. Improperly packed items will be repacked at a ₦5,000 handling fee.",
  "Volumetric weight vs physical weight applies where stated.",
  "Doorstep delivery and shipping to other Canadian cities available at additional cost.",
];

function HowItWorks() {
  return (
    <>
      <section className="bg-[var(--surface)]">
        <div className="container-x py-20 md:py-28">
          <span className="eyebrow">How it works</span>
          <h1 className="mt-5 max-w-3xl text-4xl font-bold tracking-tight text-[var(--navy)] md:text-6xl">
            From booking to collection — five simple steps.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            We make international cargo shipping feel effortless. Here's exactly what happens after you book with us.
          </p>
        </div>
      </section>

      <section className="section-y">
        <div className="container-x">
          <ol className="relative grid gap-8 md:grid-cols-2 lg:grid-cols-1">
            {steps.map((s, i) => (
              <li key={s.title} className="relative grid gap-6 rounded-3xl border border-border bg-card p-8 shadow-soft md:grid-cols-[auto_1fr] md:items-start lg:p-10">
                <div className="flex items-center gap-5">
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[var(--navy)] text-lg font-bold text-white">0{i + 1}</span>
                  <s.icon className="hidden h-7 w-7 text-[var(--teal)] md:block" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-[var(--navy)]">{s.title}</h2>
                  <p className="mt-2 text-base leading-relaxed text-muted-foreground">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-[var(--surface)] section-y">
        <div className="container-x grid gap-12 lg:grid-cols-2">
          <div>
            <span className="eyebrow">Important notes</span>
            <h2 className="mt-5 text-3xl font-bold text-[var(--navy)] md:text-4xl">A few things worth knowing.</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Reading these once will make your first shipment with us even smoother.
            </p>
          </div>
          <ul className="space-y-4">
            {notes.map((n) => (
              <li key={n} className="flex items-start gap-3 rounded-2xl border border-border bg-background p-5 shadow-soft">
                <Truck className="mt-0.5 h-5 w-5 shrink-0 text-[var(--teal)]" />
                <p className="text-sm leading-relaxed text-[var(--navy)]">{n}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-y">
        <div className="container-x text-center">
          <h2 className="text-3xl font-bold text-[var(--navy)] md:text-4xl">Ready to start?</h2>
          <p className="mt-3 text-lg text-muted-foreground">Get your transparent quote in under two minutes.</p>
          <Link to="/book" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--teal)] px-7 py-4 text-base font-semibold text-white shadow-soft hover:-translate-y-0.5 transition-all">
            Book Your Shipment <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
