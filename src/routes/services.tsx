import { createFileRoute, Link } from "@tanstack/react-router";
import { Plane, Ship, Snowflake, Car, ArrowRight, CheckCircle2 } from "lucide-react";
import airImg from "@/assets/air-cargo.jpg";
import seaImg from "@/assets/sea-cargo.jpg";
import frozenImg from "@/assets/frozen-cargo.jpg";
import vehicleImg from "@/assets/vehicle-cargo.jpg";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services | iShiftCargo — Air, Sea & Vehicle Shipping" },
      { name: "description", content: "Air, frozen air, sea and vehicle cargo shipping between Nigeria and Canada. Specialized handling, transparent pricing." },
      { property: "og:title", content: "Services | iShiftCargo" },
      { property: "og:description", content: "Air, frozen, sea and vehicle cargo shipping between Nigeria and Canada." },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: ServicesPage,
});

const services = [
  {
    icon: Plane, image: airImg, title: "Weekly & Bi-Weekly Air Cargo (Dry)",
    desc: "Our most popular option. Consistent departures with 7–10 day transit between Lagos and Calgary, perfect for personal effects, electronics and time-sensitive shipments.",
    points: ["Lagos → Calgary departs every Friday", "Bi-weekly Calgary → Lagos departures", "Volumetric weight applies", "No hidden clearance fees in Nigeria"],
  },
  {
    icon: Snowflake, image: frozenImg, title: "Bi-Weekly Frozen Air Cargo",
    desc: "Temperature-controlled handling for perishables, Nigerian frozen foods, Udara, Agbalumo and more — kept cold from drop-off to collection.",
    points: ["3–5 day estimated transit", "10 kg minimum chargeable weight", "Special handling for Udara / Agbalumo", "Calgary clearance: $3/kg CAD"],
  },
  {
    icon: Ship, image: seaImg, title: "Sea Cargo (Box & Per-Kg)",
    desc: "Affordable option for larger, less time-sensitive shipments. Choose flat-rate box shipping from Canada or per-kg sea freight from Nigeria.",
    points: ["$120 CAD per medium / large U-Haul box (max 32 kg / 70 lbs)", "Per-kg sea cargo from Lagos: ₦400/kg + $1.50/kg clearance", "Approx. 2–3 months (CA→NG) · 3–4 months (NG→CA)", "Container distributed from Calgary"],
  },
  {
    icon: Car, image: vehicleImg, title: "Premium Vehicle Shipping",
    desc: "Sedans and SUVs shipped professionally with proper securing, inspection reports and insurance options. Full container available for 4+ vehicles.",
    points: ["From $1,650 USD (customs separate)", "Port-to-port or door-to-door", "Vehicle inspection reports provided", "Insurance options available"],
  },
];

function ServicesPage() {
  return (
    <>
      <section className="bg-[var(--surface)]">
        <div className="container-x py-20 md:py-28">
          <span className="eyebrow">Services</span>
          <h1 className="mt-5 max-w-3xl text-4xl font-bold tracking-tight text-[var(--navy)] md:text-6xl">
            Premium shipping options for every need.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            Four professionally managed services covering air, frozen, sea and vehicle freight between Nigeria and Canada.
          </p>
        </div>
      </section>

      <section className="section-y">
        <div className="container-x space-y-20">
          {services.map((s, i) => (
            <div key={s.title} className={`grid gap-12 lg:grid-cols-2 lg:items-center ${i % 2 === 1 ? "lg:[&>div:first-child]:order-2" : ""}`}>
              <div className="overflow-hidden rounded-3xl border border-border shadow-lift">
                <img src={s.image} alt={s.title} loading="lazy" className="h-full w-full object-cover" />
              </div>
              <div>
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-[var(--teal-soft)] text-[var(--navy)]">
                  <s.icon className="h-6 w-6" />
                </div>
                <h2 className="mt-5 text-3xl font-bold text-[var(--navy)] md:text-4xl">{s.title}</h2>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">{s.desc}</p>
                <ul className="mt-6 space-y-3">
                  {s.points.map((p) => (
                    <li key={p} className="flex items-start gap-3 text-sm text-[var(--navy)]">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--teal)]" /> <span>{p}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link to="/rates" className="inline-flex items-center gap-2 rounded-full bg-[var(--navy)] px-6 py-3 text-sm font-semibold text-white hover:bg-[var(--navy-soft)]">
                    View rates <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link to="/book" className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold text-[var(--navy)] hover:bg-secondary">
                    Book this service
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
