import { createFileRoute, Link } from "@tanstack/react-router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ | iShiftCargo" },
      { name: "description", content: "Answers about weights, food packing rules, timelines, hidden fees, vehicle shipping, frozen handling and delivery costs." },
      { property: "og:title", content: "FAQ | iShiftCargo" },
      { property: "og:description", content: "Common questions about shipping with iShiftCargo." },
      { property: "og:url", content: "/faq" },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
  }),
  component: FaqPage,
});

const faqs = [
  {
    q: "Are there really no hidden clearance fees in Nigeria?",
    a: "Correct. For shipments arriving in Nigeria, the price we quote is the price you pay. We do not add Nigerian clearance fees on top.",
  },
  {
    q: "What's the difference between physical weight and volumetric weight?",
    a: "Volumetric weight measures how much space your package takes up. For air cargo, we charge whichever is higher — the actual weight on the scale, or the volumetric weight. This is standard practice across the industry and we'll always explain it before you ship.",
  },
  {
    q: "How should I pack food items?",
    a: "Food items must be packed according to Canadian Customs rules — properly sealed, labeled and approved categories only. If items arrive improperly packed, our team will repack them and a ₦5,000 handling fee will apply. When in doubt, call us first.",
  },
  {
    q: "Are your timelines guaranteed?",
    a: "Our schedules (weekly air from Lagos, bi-weekly air from Canada, monthly sea) are consistent, but transit times are estimates and not guaranteed. Customs and weather can affect arrival dates.",
  },
  {
    q: "Why do I need to call ahead before dropping off?",
    a: "Calling ahead lets us confirm the next departure, allocate space and make sure someone is at the location to receive your package — especially for frozen and Seton / Evanston drop-offs.",
  },
  {
    q: "Can you collect my package from a park or dispatch?",
    a: "Yes — we arrange pickups from major Lagos parks including Ojota, Iddo, Jibowu, Ikotun and Iyana Ipaja. Please label your package clearly with your full name, phone number and full Lagos address.",
  },
  {
    q: "When do I complete the detailed shipping form?",
    a: "Please complete the detailed form only after you've dropped off your shipment. This ensures all weights, dimensions and item details on the form match what we actually received.",
  },
  {
    q: "What vehicles can you ship and how does it work?",
    a: "We ship sedans and SUVs from $1,650 USD (customs separate). Each vehicle is professionally loaded and secured, and we provide inspection reports. Insurance options are available, and we offer full container options for 4+ vehicles.",
  },
  {
    q: "How do you handle frozen cargo?",
    a: "Our frozen air cargo runs bi-weekly with temperature-controlled handling from drop-off to collection. Items like Udara and Agbalumo carry a small surcharge due to their specific care requirements.",
  },
  {
    q: "Do you deliver in Nigeria after the shipment lands?",
    a: "Yes. Within Lagos / Ogun: $1/kg (min $30). Outside Lagos / Ogun: $1.50/kg (min $50). Free pickup is always available at our Lagos office.",
  },
  {
    q: "Can you ship to Canadian cities outside Calgary?",
    a: "Absolutely. We serve Alberta, British Columbia, Saskatchewan and Manitoba. Doorstep delivery and shipping to other Canadian cities is available at additional cost.",
  },
  {
    q: "Sea cargo from Nigeria — when does it arrive at my city?",
    a: "Our monthly sea container arrives in Calgary first and is then distributed to other Western Canadian destinations. Plan for a 3–4 month estimate end-to-end.",
  },
];

function FaqPage() {
  return (
    <>
      <section className="bg-[var(--surface)]">
        <div className="container-x py-20 md:py-28">
          <span className="eyebrow">FAQ</span>
          <h1 className="mt-5 max-w-3xl text-4xl font-bold tracking-tight text-[var(--navy)] md:text-6xl">
            Questions, clearly answered.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            Everything most new customers want to know — written in plain language.
          </p>
        </div>
      </section>

      <section className="section-y">
        <div className="container-x mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="rounded-2xl border border-border bg-card px-6 shadow-soft">
                <AccordionTrigger className="py-5 text-left text-base font-semibold text-[var(--navy)] hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-sm leading-relaxed text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-14 rounded-3xl border border-border bg-[var(--navy)] p-8 text-center text-white shadow-lift md:p-12">
            <h2 className="text-2xl font-bold md:text-3xl">Still have questions?</h2>
            <p className="mt-2 text-sm text-white/75 md:text-base">Our team is happy to walk you through your first shipment.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a href="tel:+14034316456" className="inline-flex items-center justify-center rounded-full bg-[var(--teal)] px-6 py-3 text-sm font-semibold text-white">Call +1 (403) 431-6456</a>
              <Link to="/book" className="inline-flex items-center justify-center rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10">Book a shipment</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
