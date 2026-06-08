import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Check, Phone, Loader2, Info, AlertTriangle, ShieldAlert } from "lucide-react";
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

  // Detailed Calgary -> Lagos Form Fields State
  const [senderAddress, setSenderAddress] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [receiverAddress, setReceiverAddress] = useState("");
  const [receiverEmail, setReceiverEmail] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");
  const [selectedElectronics, setSelectedElectronics] = useState<string[]>([]);
  const [hasProhibited, setHasProhibited] = useState<"Yes" | "No">("No");
  const [goodsType, setGoodsType] = useState("Personal Items");
  const [estimatedValue, setEstimatedValue] = useState("");
  const [deliveryMode, setDeliveryMode] = useState("Warehouse Pickup");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [agreedToDeclaration, setAgreedToDeclaration] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const services = SERVICE_OPTIONS[direction];
  const est = useMemo(() => estimate(direction, service, weight, boxes), [direction, service, weight, boxes]);

  const isDetailedFlow = direction === "ca-ng" && (service === "air-dry" || service === "sea-box");
  const maxSteps = isDetailedFlow ? 5 : 4;

  useEffect(() => {
    if (step > maxSteps) {
      setStep(maxSteps);
    }
  }, [maxSteps, step]);

  const next = () => setStep((s) => Math.min(maxSteps, s + 1));
  const prev = () => setStep((s) => Math.max(1, s - 1));

  const handleCheckboxChange = (val: string) => {
    setSelectedElectronics(prev => 
      prev.includes(val) ? prev.filter(item => item !== val) : [...prev, val]
    );
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isDetailedFlow) {
      if (!name || !email || !phone || !senderAddress || !date) {
        toast.error("Please fill in all sender details.");
        return;
      }
      if (!receiverName || !receiverPhone || !receiverAddress) {
        toast.error("Please fill in receiver contact details.");
        return;
      }
      if (!notes) {
        toast.error("Please provide a detailed list of shipping items.");
        return;
      }
      if (!estimatedValue) {
        toast.error("Please state the estimated value of the items.");
        return;
      }
      if (hasProhibited === "Yes") {
        toast.error("We cannot accept packages containing prohibited items. Please remove them before booking.");
        return;
      }
      if (!agreedToDeclaration || !agreedToTerms) {
        toast.error("You must agree to all declarations, terms & conditions to submit.");
        return;
      }
    } else {
      if (!name || !email || !phone) {
        toast.error("Please fill in your contact details.");
        return;
      }
    }

    setSubmitting(true);
    try {
      await saveBooking({
        name,
        email,
        phone,
        direction,
        service,
        weight: service === "sea-box" ? "" : weight,
        boxes: service === "sea-box" ? boxes : "",
        type: isDetailedFlow ? goodsType : type,
        notes: isDetailedFlow ? `Items list: ${notes}` : notes,
        location: isDetailedFlow ? `${deliveryMode} - Lagos` : location,
        preferred_date: date,
        estimate: est?.value ?? "",

        // Calgary -> Lagos detailed inputs
        sender_address: isDetailedFlow ? senderAddress : undefined,
        receiver_name: isDetailedFlow ? receiverName : undefined,
        receiver_address: isDetailedFlow ? receiverAddress : undefined,
        receiver_email: isDetailedFlow ? receiverEmail : undefined,
        receiver_phone: isDetailedFlow ? receiverPhone : undefined,
        electronics: isDetailedFlow && service === "air-dry" ? selectedElectronics.join(", ") : undefined,
        has_prohibited: isDetailedFlow ? hasProhibited : undefined,
        estimated_value: isDetailedFlow ? estimatedValue : undefined,
        delivery_mode: isDetailedFlow ? deliveryMode : undefined,
        delivery_address: isDetailedFlow && deliveryMode !== "Warehouse Pickup" ? deliveryAddress : undefined,
        landmark: isDetailedFlow && deliveryMode !== "Warehouse Pickup" ? landmark : undefined,
      });

      setDone(true);
      toast.success("Shipment request successfully received!");
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
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[var(--teal)] text-white shadow-lift">
            <Check className="h-7 w-7" />
          </div>
          <h1 className="mt-6 text-3xl font-bold text-[var(--navy)] md:text-4xl">Booking Completed, {name.split(" ")[0]}!</h1>
          <p className="mt-3 text-lg text-muted-foreground leading-relaxed">
            Your booking request has been successfully recorded. You will receive a pick-up notification and an invoice containing detailed payment instructions once drop-off is processed.
          </p>
          <div className="mt-6 p-5 rounded-2xl border border-border bg-[var(--surface-2)] text-left text-sm max-w-lg mx-auto">
            <p className="font-semibold text-[var(--navy)] flex items-center gap-1.5"><Info className="h-4 w-4 text-[var(--teal)]" /> What to do next:</p>
            <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground list-disc list-inside">
              <li>Drop off your package at the designated Calgary drop-off point.</li>
              <li>Ensure items are heavy-duty packaged and shrink-wrapped.</li>
              <li>Have your declared list ready at drop-off for inspection.</li>
            </ul>
          </div>
          <a href="tel:+14034316456" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--navy)] px-6 py-3 text-sm font-semibold text-white shadow-soft">
            <Phone className="h-4 w-4" /> Call Calgary: +1 (403) 431-6456
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
            {isDetailedFlow ? "Calgary to Lagos Booking Form" : "Get a transparent estimate in minutes."}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            {isDetailedFlow 
              ? "Complete the booking form below ONLY after package drop-off. You will receive an invoice after."
              : "Four short steps. No payment now — we'll confirm everything before your shipment moves."}
          </p>
        </div>
      </section>

      <section className="section-y">
        <div className="container-x grid gap-10 lg:grid-cols-[2fr_1fr]">
          <form onSubmit={submit} className="rounded-3xl border border-border bg-card p-8 shadow-soft md:p-10">
            {/* steps */}
            <ol className="mb-10 flex items-center justify-between gap-2">
              {Array.from({ length: maxSteps }, (_, idx) => idx + 1).map((n) => (
                <li key={n} className="flex flex-1 items-center gap-3">
                  <span className={`grid h-9 w-9 place-items-center rounded-full text-sm font-bold ${step >= n ? "bg-[var(--teal)] text-white" : "bg-secondary text-muted-foreground"}`}>{n}</span>
                  {n < maxSteps && <span className={`h-px flex-1 ${step > n ? "bg-[var(--teal)]" : "bg-border"}`} />}
                </li>
              ))}
            </ol>

            {/* STEP 1: ROUTE & SERVICE (BOTH FLOWS) */}
            {step === 1 && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-semibold text-[var(--navy)]">Direction</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Where is your shipment going?</p>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {[
                      { key: "ca-ng", label: "Canada → Nigeria (Calgary to Lagos)", helper: "From Calgary / Cranston to Lagos" },
                      { key: "ng-ca", label: "Nigeria → Canada (Lagos to Canada)", helper: "From Lagos to Calgary / Canada" },
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

            {/* FLOW A: SIMPLE NIGERIA -> CANADA & VEHICLE ROUTE */}
            {!isDetailedFlow && (
              <>
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
              </>
            )}

            {/* FLOW B: DETAILED CALGARY -> LAGOS FORMS */}
            {isDetailedFlow && (
              <>
                {/* STEP 2: SENDER DETAILS */}
                {step === 2 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-[var(--navy)]">Sender Information (Calgary / Canada)</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Sender's Full Name *">
                        <input required value={name} onChange={(e) => setName(e.target.value)} className={inputCls} placeholder="John Doe" />
                      </Field>
                      <Field label="Sender's Email Address *">
                        <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} placeholder="john@example.com" />
                      </Field>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Sender's Phone Number *">
                        <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} placeholder="e.g. +1 (403) 555-0199" />
                      </Field>
                      <Field label="Date of Package Drop-off *">
                        <input required type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} />
                      </Field>
                    </div>
                    <Field label="Sender's Residential/Office Address *">
                      <input required value={senderAddress} onChange={(e) => setSenderAddress(e.target.value)} className={inputCls} placeholder="Full address in Calgary / Canada" />
                    </Field>
                  </div>
                )}

                {/* STEP 3: RECEIVER DETAILS */}
                {step === 3 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-[var(--navy)]">Receiver Information (Nigeria)</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Receiver's Full Name *">
                        <input required value={receiverName} onChange={(e) => setReceiverName(e.target.value)} className={inputCls} placeholder="Bisi Adebayo" />
                      </Field>
                      <Field label="Receiver's Email Address">
                        <input type="email" value={receiverEmail} onChange={(e) => setReceiverEmail(e.target.value)} className={inputCls} placeholder="bisi@example.com" />
                      </Field>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Receiver's Phone Number *">
                        <input required type="tel" value={receiverPhone} onChange={(e) => setReceiverPhone(e.target.value)} className={inputCls} placeholder="e.g. +234 803 555 0199" />
                      </Field>
                      <Field label="Receiver's Full Delivery/Pickup Address *">
                        <input required value={receiverAddress} onChange={(e) => setReceiverAddress(e.target.value)} className={inputCls} placeholder="Full address in Nigeria" />
                      </Field>
                    </div>
                  </div>
                )}

                {/* STEP 4: CARGO DETAILS & ITEMIZATION */}
                {step === 4 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-[var(--navy)]">Shipment Contents & Details</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Type of Goods *">
                        <select value={goodsType} onChange={(e) => setGoodsType(e.target.value)} className={inputCls}>
                          <option value="Personal Items">Personal Items</option>
                          <option value="Commercial Goods">Commercial Goods</option>
                          <option value="Gifts">Gifts</option>
                        </select>
                      </Field>
                      <Field label="Total Estimated Value of Items (CAD) *">
                        <input required type="number" min={0} value={estimatedValue} onChange={(e) => setEstimatedValue(e.target.value)} className={inputCls} placeholder="For customs and optional insurance" />
                      </Field>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      {service === "air-dry" ? (
                        <Field label="Total Estimated Weight (kg) *">
                          <input required type="number" min={0.1} step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} className={inputCls} placeholder="e.g. 10.5" />
                        </Field>
                      ) : (
                        <Field label="Total Number of Boxes/Bags *">
                          <input required type="number" min={1} value={boxes} onChange={(e) => setBoxes(e.target.value)} className={inputCls} />
                        </Field>
                      )}

                      <Field label="Contains Prohibited Items? (Perfumes/Aerosols/Drugs) *">
                        <select value={hasProhibited} onChange={(e) => setHasProhibited(e.target.value as any)} className={`${inputCls} ${hasProhibited === "Yes" ? "border-red-500 bg-red-50 text-red-700" : ""}`}>
                          <option value="No">No, does not contain prohibited items</option>
                          <option value="Yes">Yes, contains prohibited items</option>
                        </select>
                      </Field>
                    </div>

                    {service === "air-dry" && (
                      <div>
                        <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Are you shipping any electronics?</span>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {["Phone", "Laptops", "Games (Xbox, Playstation, etc)", "N/A"].map((el) => (
                            <label key={el} className="flex items-center gap-2 rounded-xl border border-border p-3 cursor-pointer hover:bg-secondary">
                              <input
                                type="checkbox"
                                checked={selectedElectronics.includes(el)}
                                onChange={() => handleCheckboxChange(el)}
                                className="accent-[var(--teal)]"
                              />
                              <span className="text-xs text-[var(--navy)]">{el}</span>
                            </label>
                          ))}
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-2">
                          ⚠️ Required: Laptops, phones, vitamins, prescriptions, and car parts must be declared at drop-off. Please provide receipts for new electronics.
                        </p>
                      </div>
                    )}

                    <Field label="Detailed list of items (List ALL items in package) *">
                      <textarea required rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. 3 native attires, 2 shoes, 5 bags of milk powder, 4 soaps..." className={inputCls} />
                    </Field>
                  </div>
                )}

                {/* STEP 5: DELIVERY DETAILS & AGREEMENTS */}
                {step === 5 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-[var(--navy)]">Delivery & Legal Declarations</h2>
                    
                    <Field label="Mode of Delivery (Lagos/Nigeria) *">
                      <select value={deliveryMode} onChange={(e) => setDeliveryMode(e.target.value)} className={inputCls}>
                        <option value="Warehouse Pickup">Self-Pickup at Lagos Warehouse (Oregun, Ikeja) — FREE</option>
                        <option value="Within Lagos/Ogun Delivery">Door-to-door: Within Lagos / Ogun (Min $30 for Air, $50 for Sea)</option>
                        <option value="Outside Lagos/Ogun Delivery">Door-to-door: Outside Lagos / Ogun (Min $50 for Air, $70 for Sea)</option>
                      </select>
                    </Field>

                    {deliveryMode !== "Warehouse Pickup" && (
                      <div className="grid gap-4 md:grid-cols-2">
                        <Field label="Delivery Street Address *">
                          <input required value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} className={inputCls} placeholder="Street address in Nigeria" />
                        </Field>
                        <Field label="Nearest Landmark / Instructions">
                          <input value={landmark} onChange={(e) => setLandmark(e.target.value)} className={inputCls} placeholder="e.g., Opp. Polaris Bank" />
                        </Field>
                      </div>
                    )}

                    {/* SENDER LEGAL DECLARATION */}
                    <div className="rounded-2xl border border-border bg-[var(--surface-2)] p-5">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          required
                          checked={agreedToDeclaration}
                          onChange={(e) => setAgreedToDeclaration(e.target.checked)}
                          className="mt-1 accent-[var(--teal)] shrink-0"
                        />
                        <span className="text-xs leading-relaxed text-[var(--navy)]">
                          I, the shipper, hereby confirm that the packages or shipments I am providing to <strong>iSHIFT SERVICES INC</strong> or its agent(s) do not contain any contraband, dangerous goods, or narcotics. I understand that any false declaration may result in legal consequences, and I accept full responsibility for the contents of my shipment.
                        </span>
                      </label>
                    </div>

                    {/* TERMS AND CONDITIONS SCROLL BOX */}
                    <div>
                      <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Terms & Conditions Agreement</span>
                      <div className="h-32 overflow-y-auto border border-border rounded-xl p-4 text-[10px] leading-relaxed text-muted-foreground space-y-3 bg-background">
                        <p><strong>Limitation of Liability:</strong> iSHIFT SERVICES INC maximum liability for any loss or damage to shipments, if no value is declared, is limited to $2 (Or Naira equivalent) per kilogram of the shipment's weight. This applies whether loss or damage is partial or total. For high-value items, you may declare the value of your shipment and choose to purchase additional insurance. If no additional insurance is purchased, the maximum liability of $2 per kg applies regardless of actual value.</p>
                        <p><strong>Customs Inspection:</strong> All shipments are subject to inspection by the Nigerian Customs Service. This may include opening, searching, or seizure. iSHIFT Services Inc. is not liable for actions taken by customs authorities.</p>
                        <p><strong>Timelines:</strong> We are not liable for delays caused by airlines, shipping lines, customs, or other regulatory authorities. The stated delivery timeline (7-10 business days for air, 2-3 months for sea) is based on standard operational flows and not guaranteed.</p>
                        <p><strong>Optional Delivery:</strong> Courier and delivery services are optional convenience services used at the customer's own risk. iSHIFT disclaims liability for transit issues once handed over to third parties.</p>
                      </div>
                      <label className="flex items-center gap-3 mt-3 cursor-pointer">
                        <input
                          type="checkbox"
                          required
                          checked={agreedToTerms}
                          onChange={(e) => setAgreedToTerms(e.target.checked)}
                          className="accent-[var(--teal)] shrink-0"
                        />
                        <span className="text-xs font-semibold text-[var(--navy)]">Agree to Terms & Conditions and Privacy Policy *</span>
                      </label>
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="mt-10 flex items-center justify-between">
              <button type="button" onClick={prev} disabled={step === 1} className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-semibold text-[var(--navy)] disabled:opacity-40">
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              {step < maxSteps ? (
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
                    <>Submit Booking <Check className="h-4 w-4" /></>
                  )}
                </button>
              )}
            </div>
          </form>

          {/* SIDEBAR */}
          <aside className="space-y-6">
            <div className="rounded-3xl border border-border bg-[var(--navy)] p-7 text-white shadow-lift">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/60">Estimated Cost</p>
              <p className="mt-3 text-3xl font-bold">{est?.value ?? "—"}</p>
              <p className="mt-2 text-sm text-white/70">{est?.note ?? "Enter package details to see estimate."}</p>
              {service === "air-dry" && direction === "ca-ng" && (
                <p className="mt-6 text-[10px] leading-relaxed text-white/60">
                  Rate: $14.00/kg + GST (5kg+), or Flat $70.00 (under 5kg). Volumetric/physical whichever is higher.
                </p>
              )}
              {service === "sea-box" && direction === "ca-ng" && (
                <p className="mt-6 text-[10px] leading-relaxed text-white/60">
                  Rate: $120.00 CAD per box. (Limit 32kg/70lbs, medium/large U-haul size).
                </p>
              )}
            </div>

            {/* Calgary Dropoff points instructions */}
            {direction === "ca-ng" && (
              <div className="rounded-3xl border border-border bg-card p-7 shadow-soft space-y-4">
                <p className="text-sm font-semibold text-[var(--navy)] flex items-center gap-1.5"><AlertTriangle className="h-4 w-4 text-amber-500" /> Drop-off Cutoff & Rules</p>
                <div className="text-xs text-muted-foreground space-y-2 leading-relaxed">
                  <p><strong>Weekly Air Cargo:</strong> Departs every other Thursday. Drop off by Monday of the shipment week.</p>
                  <p><strong>Drop-off Locations:</strong></p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Marlborough NE: Mon-Fri (Call ahead)</li>
                    <li>Cranston SE: Mon-Sun (Call ahead)</li>
                  </ul>
                  <p><strong>Lagos Pickup:</strong> #4 Alh. Omotayo Close, off Ola Adeshega street, Oregun, Ikeja.</p>
                </div>
              </div>
            )}

            <div className="rounded-3xl border border-border bg-card p-7 shadow-soft">
              <p className="text-sm font-semibold text-[var(--navy)]">Need assistance booking?</p>
              <a href="tel:+14034316456" className="mt-3 inline-flex items-center gap-2 text-base font-semibold text-[var(--teal)] hover:text-[var(--navy)]">
                <Phone className="h-4 w-4" /> +1 (403) 431-6456
              </a>
              <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                Lagos Support: Dunsin +234 906 032 5802 · Debbie +234 806 350 6603
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
