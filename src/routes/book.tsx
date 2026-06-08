import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Phone, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { saveBooking } from "@/lib/bookingStore";

export const Route = createFileRoute("/book")({
  head: () => ({
    meta: [
      { title: "Book a Shipment | iShiftCargo" },
      { name: "description", content: "Get an instant estimate and book your air, sea or vehicle shipment between Nigeria and Canada." },
      { property: "og:title", content: "Book a Shipment | iShiftCargo" },
      { property: "og:description", content: "Book your shipment with iShiftCargo in minutes." },
      { property: "og:url", content: "/book" },
    ],
    links: [{ rel: "canonical", href: "/book" }],
  }),
  component: BookPage,
});

type Direction = "ca-ng" | "ng-ca";
type ServiceKey = "air-dry" | "air-frozen" | "sea-box" | "sea-perkg" | "vehicle";

const SERVICE_OPTIONS: Record<Direction, { key: ServiceKey; label: string; helper: string }[]> = {
  "ca-ng": [
    { key: "air-dry", label: "Air Cargo (Dry)", helper: "Bi-weekly · 7–10 days" },
    { key: "sea-box", label: "Sea Cargo (Box)", helper: "$120 CAD per box · 2–3 months" },
    { key: "vehicle", label: "Vehicle Shipping", helper: "From $1,650 USD" },
  ],
  "ng-ca": [
    { key: "air-dry", label: "Weekly Air Cargo (Dry)", helper: "~3 weeks estimate" },
    { key: "air-frozen", label: "Bi-Weekly Frozen Air", helper: "3–5 days estimate" },
    { key: "sea-perkg", label: "Monthly Sea Cargo", helper: "3–4 months estimate" },
  ],
};

function estimate(direction: Direction, service: ServiceKey, weightStr: string, boxes: string) {
  const weight = parseFloat(weightStr) || 0;
  const b = parseInt(boxes || "0", 10) || 0;
  if (direction === "ca-ng") {
    if (service === "air-dry") {
      if (weight === 0) return null;
      if (weight < 5) return { value: "Flat CAD $70.00", note: "Under 5 kg flat rate." };
      return { value: `CAD $${(weight * 14).toFixed(2)}`, note: "$14.00/kg · physical or volumetric, whichever higher." };
    }
    if (service === "sea-box") {
      if (!b) return null;
      return { value: `CAD $${(b * 120).toFixed(2)}`, note: `${b} box(es) × $120 CAD. Max 32 kg / 70 lbs each.` };
    }
    if (service === "vehicle") return { value: "From USD $1,650", note: "Customs separate. Confirm with our team." };
  } else {
    if (service === "air-dry") {
      const w = Math.max(weight, 10);
      const ngn = w * 6300;
      const cad = w * 2;
      return { value: `₦${ngn.toLocaleString()} + CAD $${cad.toFixed(2)}`, note: "10 kg min · departs every Friday." };
    }
    if (service === "air-frozen") {
      const w = Math.max(weight, 10);
      const ngn = w * 8800;
      const cad = w * 3;
      return { value: `₦${ngn.toLocaleString()} + CAD $${cad.toFixed(2)}`, note: "10 kg min · Udara/Agbalumo +₦1,000/kg." };
    }
    if (service === "sea-perkg") {
      const w = Math.max(weight, 50);
      const ngn = w * 400;
      const cad = w * 1.5;
      return { value: `₦${ngn.toLocaleString()} + CAD $${cad.toFixed(2)}`, note: "50 kg min · 3–4 months estimate." };
    }
  }
  return null;
}

function BookPage() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<Direction>("ca-ng");
  const [service, setService] = useState<ServiceKey>("air-dry");
  const [weight, setWeight] = useState("");
  const [boxes, setBoxes] = useState("1");
  const [type, setType] = useState("Dry goods");
  const [notes, setNotes] = useState("");
  const [location, setLocation] = useState("Marlborough NE — Calgary");
  const [date, setDate] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const services = SERVICE_OPTIONS[direction];
  const est = useMemo(() => estimate(direction, service, weight, boxes), [direction, service, weight, boxes]);

  const next = () => setStep((s) => Math.min(4, s + 1));
  const prev = () => setStep((s) => Math.max(1, s - 1));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      toast.error("Please fill in your contact details.");
      return;
    }
    setSubmitting(true);
    try {
      await saveBooking({
        name,
        email,
        phone,
        direction,
        service,
        weight,
        boxes,
        type,
        notes,
        location,
        preferred_date: date,
        estimate: est?.value ?? "",
      });
      setDone(true);
      toast.success("Request received — we'll be in touch within one business day.");
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      toast.error(`Failed to submit: ${errorMessage}. Please try again or call us directly.`);
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <section className="section-y">
        <div className="container-x mx-auto max-w-2xl text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[var(--teal)] text-white shadow-lift"><Check className="h-7 w-7" /></div>
          <h1 className="mt-6 text-3xl font-bold text-[var(--navy)] md:text-4xl">Thank you, {name.split(" ")[0]}.</h1>
          <p className="mt-3 text-lg text-muted-foreground">
            We've received your request and will email or call you within one business day. For anything urgent, call us anytime.
          </p>
          <a href="tel:+14034316456" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--navy)] px-6 py-3 text-sm font-semibold text-white">
            <Phone className="h-4 w-4" /> +1 (403) 431-6456
          </a>
        </div>
        <Toaster />
      </section>
    );
  }

  return (
    <>
      <section className="bg-[var(--surface)]">
        <div className="container-x py-16 md:py-24">
          <span className="eyebrow">Book a shipment</span>
          <h1 className="mt-5 max-w-3xl text-4xl font-bold tracking-tight text-[var(--navy)] md:text-5xl">
            Get a transparent estimate in minutes.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Four short steps. No payment now — we'll confirm everything before your shipment moves.
          </p>
        </div>
      </section>

      <section className="section-y">
        <div className="container-x grid gap-10 lg:grid-cols-[2fr_1fr]">
          <form onSubmit={submit} className="rounded-3xl border border-border bg-card p-8 shadow-soft md:p-10">
            {/* steps */}
            <ol className="mb-10 flex items-center justify-between gap-2">
              {[1, 2, 3, 4].map((n) => (
                <li key={n} className="flex flex-1 items-center gap-3">
                  <span className={`grid h-9 w-9 place-items-center rounded-full text-sm font-bold ${step >= n ? "bg-[var(--teal)] text-white" : "bg-secondary text-muted-foreground"}`}>{n}</span>
                  {n < 4 && <span className={`h-px flex-1 ${step > n ? "bg-[var(--teal)]" : "bg-border"}`} />}
                </li>
              ))}
            </ol>

            {step === 1 && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-semibold text-[var(--navy)]">Direction</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Where is your shipment going?</p>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {[
                      { key: "ca-ng", label: "Canada → Nigeria", helper: "From Canada to Nigeria" },
                      { key: "ng-ca", label: "Nigeria → Canada", helper: "From Nigeria to Canada" },
                    ].map((d) => (
                      <button
                        key={d.key}
                        type="button"
                        onClick={() => { setDirection(d.key as Direction); setService(SERVICE_OPTIONS[d.key as Direction][0].key); }}
                        className={`rounded-2xl border p-5 text-left transition-all ${direction === d.key ? "border-[var(--teal)] bg-[var(--teal-soft)]/40 shadow-soft" : "border-border hover:border-[var(--navy-soft)]"}`}
                      >
                        <p className="text-sm font-semibold text-[var(--navy)]">{d.label}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{d.helper}</p>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-[var(--navy)]">Service</h2>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {services.map((s) => (
                      <button
                        key={s.key}
                        type="button"
                        onClick={() => setService(s.key)}
                        className={`rounded-2xl border p-5 text-left transition-all ${service === s.key ? "border-[var(--teal)] bg-[var(--teal-soft)]/40 shadow-soft" : "border-border hover:border-[var(--navy-soft)]"}`}
                      >
                        <p className="text-sm font-semibold text-[var(--navy)]">{s.label}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{s.helper}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-[var(--navy)]">Package details</h2>
                {service === "sea-box" ? (
                  <Field label="Number of boxes">
                    <input type="number" min={1} value={boxes} onChange={(e) => setBoxes(e.target.value)} className={inputCls} />
                  </Field>
                ) : service === "vehicle" ? (
                  <Field label="Vehicle type">
                    <input type="text" value={type} onChange={(e) => setType(e.target.value)} placeholder="e.g. Toyota Camry sedan" className={inputCls} />
                  </Field>
                ) : (
                  <>
                    <Field label="Estimated weight (kg)">
                      <input type="number" min={0} step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="e.g. 12" className={inputCls} />
                    </Field>
                    <Field label="Contents type">
                      <select value={type} onChange={(e) => setType(e.target.value)} className={inputCls}>
                        <option>Dry goods</option><option>Electronics</option><option>Frozen / perishables</option><option>Documents</option><option>Other</option>
                      </select>
                    </Field>
                  </>
                )}
                <Field label="Notes (optional)">
                  <textarea rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Dimensions, fragile items, special handling..." className={inputCls} />
                </Field>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-[var(--navy)]">Drop-off / Pickup</h2>
                <Field label="Preferred location">
                  <select value={location} onChange={(e) => setLocation(e.target.value)} className={inputCls}>
                    {direction === "ca-ng" ? (
                      <>
                        <option>Marlborough NE — Calgary</option>
                        <option>Cranston SE — Calgary</option>
                        <option>Seton SE — Calgary (frozen, call ahead)</option>
                        <option>Evanston NW — Calgary (frozen, call ahead)</option>
                        <option>Other Western Canadian city</option>
                      </>
                    ) : (
                      <>
                        <option>Lagos office (Oregun, Ikeja) — free pickup</option>
                        <option>Ojota park pickup</option>
                        <option>Iddo park pickup</option>
                        <option>Jibowu park pickup</option>
                        <option>Ikotun park pickup</option>
                        <option>Iyana Ipaja park pickup</option>
                      </>
                    )}
                  </select>
                </Field>
                <Field label="Preferred date">
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} />
                </Field>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-[var(--navy)]">Your contact details</h2>
                <Field label="Full name"><input required value={name} onChange={(e) => setName(e.target.value)} className={inputCls} /></Field>
                <Field label="Email"><input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} /></Field>
                <Field label="Phone"><input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} /></Field>
              </div>
            )}

            <div className="mt-10 flex items-center justify-between">
              <button type="button" onClick={prev} disabled={step === 1} className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-semibold text-[var(--navy)] disabled:opacity-40">
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              {step < 4 ? (
                <button type="button" onClick={next} className="inline-flex items-center gap-2 rounded-full bg-[var(--teal)] px-6 py-3 text-sm font-semibold text-white shadow-soft hover:-translate-y-0.5 transition-all">
                  Continue <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--navy)] px-6 py-3 text-sm font-semibold text-white shadow-soft hover:bg-[var(--navy-soft)] disabled:opacity-60"
                >
                  {submitting ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Submitting…</>
                  ) : (
                    <>Submit request <Check className="h-4 w-4" /></>
                  )}
                </button>
              )}
            </div>
          </form>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-border bg-[var(--navy)] p-7 text-white shadow-lift">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/60">Instant estimate</p>
              <p className="mt-3 text-3xl font-bold">{est?.value ?? "—"}</p>
              <p className="mt-2 text-sm text-white/70">{est?.note ?? "Enter package details to see your estimate."}</p>
              <p className="mt-6 text-xs leading-relaxed text-white/60">Estimate only. Final pricing confirmed after inspection. Volumetric weight applies for air services.</p>
            </div>
            <div className="rounded-3xl border border-border bg-card p-7 shadow-soft">
              <p className="text-sm font-semibold text-[var(--navy)]">Prefer to speak to our team?</p>
              <a href="tel:+14034316456" className="mt-3 inline-flex items-center gap-2 text-base font-semibold text-[var(--teal)] hover:text-[var(--navy)]">
                <Phone className="h-4 w-4" /> +1 (403) 431-6456
              </a>
              <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                Lagos: Dunsin +234 906 032 5802 · Debbie +234 806 350 6603
              </p>
            </div>
            <div className="rounded-3xl border border-border bg-[var(--surface-2)] p-7">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--teal)]">Please note</p>
              <p className="mt-3 text-xs leading-relaxed text-[var(--navy)]">
                Complete the detailed shipping form only after drop-off, so weights and details match exactly. Always call ahead to confirm drop-off times.
              </p>
            </div>
          </aside>
        </div>
        <Toaster />
      </section>
    </>
  );
}

const inputCls =
  "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-[var(--navy)] outline-none transition-all focus:border-[var(--teal)] focus:ring-2 focus:ring-[var(--teal)]/20";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
