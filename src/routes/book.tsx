import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Check, Phone, Loader2, Info, AlertTriangle } from "lucide-react";
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
      return { value: `₦${(w * 6300).toLocaleString()} + CAD $${(w * 2).toFixed(2)}`, note: "10 kg min · departs every Friday." };
    }
    if (service === "air-frozen") {
      const w = Math.max(weight, 10);
      return { value: `₦${(w * 8800).toLocaleString()} + CAD $${(w * 3).toFixed(2)}`, note: "10 kg min · Udara/Agbalumo +₦1,000/kg." };
    }
    if (service === "sea-perkg") {
      const w = Math.max(weight, 50);
      return { value: `₦${(w * 400).toLocaleString()} + CAD $${(w * 1.5).toFixed(2)}`, note: "50 kg min · 3–4 months estimate." };
    }
  }
  return null;
}

function generateTrackingNumber() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
  return `ISC-${result}`;
}

function BookPage() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<Direction>("ca-ng");
  const [service, setService] = useState<ServiceKey>("air-dry");
  const [weight, setWeight] = useState("");
  const [boxes, setBoxes] = useState("1");
  const [type, setType] = useState("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [generatedTrackNum, setGeneratedTrackNum] = useState("");

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

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const services = SERVICE_OPTIONS[direction];
  const est = useMemo(() => estimate(direction, service, weight, boxes), [direction, service, weight, boxes]);

  const maxSteps = 5;

  useEffect(() => {
    if (step > maxSteps) setStep(maxSteps);
  }, [maxSteps, step]);

  // Clear a single error as user fixes it
  const clearErr = (key: string) => setErrors((p) => { const n = { ...p }; delete n[key]; return n; });

  const validateStep = (s: number): Record<string, string> => {
    const errs: Record<string, string> = {};
    if (s === 2) {
      if (!name.trim()) errs.name = "Full name is required.";
      if (!email.trim()) errs.email = "Email address is required.";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Please enter a valid email address.";
      if (!phone.trim()) errs.phone = "Phone number is required.";
      if (!date) errs.date = "Drop-off date is required.";
      if (!senderAddress.trim()) errs.senderAddress = "Sender address is required.";
    }
    if (s === 3) {
      if (!receiverName.trim()) errs.receiverName = "Receiver's full name is required.";
      if (!receiverPhone.trim()) errs.receiverPhone = "Receiver's phone number is required.";
      if (!receiverAddress.trim()) errs.receiverAddress = "Receiver's full address is required.";
    }
    if (s === 4) {
      if (!estimatedValue || Number(estimatedValue) < 0) errs.estimatedValue = "Please enter the estimated value.";
      if (service === "sea-box" && (!boxes || Number(boxes) < 1)) errs.boxes = "Please enter the number of boxes.";
      if (service === "vehicle" && !type.trim()) errs.type = "Vehicle details are required.";
      if (service !== "sea-box" && service !== "vehicle" && (!weight || Number(weight) <= 0)) errs.weight = "Please enter the package weight.";
      if (!notes.trim()) errs.notes = "Please list all items in the package.";
    }
    if (s === 5) {
      if (deliveryMode !== "Warehouse Pickup" && !deliveryAddress.trim()) errs.deliveryAddress = "Delivery address is required.";
      if (!agreedToDeclaration) errs.agreedToDeclaration = "You must agree to the sender declaration.";
      if (!agreedToTerms) errs.agreedToTerms = "You must agree to the terms & conditions.";
    }
    return errs;
  };

  const next = () => {
    const errs = validateStep(step);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setTimeout(() => {
        document.querySelector("[data-has-error='true']")?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 50);
      return;
    }
    setErrors({});
    setStep((s) => Math.min(maxSteps, s + 1));
  };

  const prev = () => { setErrors({}); setStep((s) => Math.max(1, s - 1)); };

  const handleCheckboxChange = (val: string) => {
    setSelectedElectronics((prev) =>
      prev.includes(val) ? prev.filter((item) => item !== val) : [...prev, val]
    );
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateStep(5);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    if (hasProhibited === "Yes") {
      toast.error("We cannot accept packages containing prohibited items. Please remove them before booking.");
      return;
    }
    setSubmitting(true);
    try {
      const trackingNumber = generateTrackingNumber();
      setGeneratedTrackNum(trackingNumber);
      await saveBooking({
        name, email, phone, direction, service,
        weight: service === "sea-box" || service === "vehicle" ? "" : weight,
        boxes: service === "sea-box" ? boxes : "",
        type: service === "vehicle" ? type : goodsType,
        notes: `Items list: ${notes}`,
        location: `${deliveryMode} - ${direction === "ca-ng" ? "Lagos" : "Calgary"}`,
        preferred_date: date,
        estimate: est?.value ?? "",
        sender_address: senderAddress,
        receiver_name: receiverName,
        receiver_address: receiverAddress,
        receiver_email: receiverEmail,
        receiver_phone: receiverPhone,
        electronics: service.startsWith("air-") ? selectedElectronics.join(", ") : undefined,
        has_prohibited: hasProhibited,
        estimated_value: estimatedValue,
        delivery_mode: deliveryMode,
        delivery_address: deliveryMode !== "Warehouse Pickup" ? deliveryAddress : undefined,
        landmark: deliveryMode !== "Warehouse Pickup" ? landmark : undefined,
        tracking_number: trackingNumber,
        status: "Pending",
        invoice_amount: est?.value ?? "",
        invoice_status: "Unpaid",
        current_location: direction === "ca-ng" ? "Calgary Warehouse" : "Lagos Office",
      });
      setDone(true);
      toast.success("Shipment request successfully received!");
    } catch (err) {
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
            Your booking request has been successfully recorded. You can now track your shipment using the tracking number below.
          </p>
          <div className="mt-6 border border-dashed border-[var(--teal)] bg-[var(--teal-soft)]/20 rounded-2xl p-6 text-center max-w-lg mx-auto">
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Your Tracking Number</p>
            <p className="mt-2 text-3xl font-mono font-bold tracking-widest text-[var(--navy)]">{generatedTrackNum}</p>
            <button
              type="button"
              onClick={() => { navigator.clipboard.writeText(generatedTrackNum); toast.success("Copied!"); }}
              className="mt-3 text-xs text-[var(--teal)] hover:text-[var(--navy)] hover:underline font-semibold"
            >
              Copy tracking number
            </button>
          </div>
          <div className="mt-4">
            <a href={`/track?code=${generatedTrackNum}`} className="text-sm font-semibold text-[var(--teal)] hover:text-[var(--navy)] hover:underline">
              View Tracking Details &rarr;
            </a>
          </div>
          <div className="mt-6 p-5 rounded-2xl border border-border bg-[var(--surface-2)] text-left text-sm max-w-lg mx-auto">
            <p className="font-semibold text-[var(--navy)] flex items-center gap-1.5">
              <Info className="h-4 w-4 text-[var(--teal)]" /> What to do next:
            </p>
            <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground list-disc list-inside">
              <li>Drop off your package at the designated Calgary or Lagos drop-off point.</li>
              <li>Ensure items are heavy-duty packaged and shrink-wrapped.</li>
              <li>Have your declared list ready at drop-off for inspection.</li>
            </ul>
          </div>
          <a href="tel:+14034316456" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--navy)] px-6 py-3 text-sm font-semibold text-white shadow-soft">
            <Phone className="h-4 w-4" /> Call Support: +1 (403) 431-6456
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
            Calgary to Lagos Booking Form
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Complete the booking form below <strong>ONLY after package drop-off</strong>. You will receive an invoice after.
          </p>
        </div>
      </section>

      <section className="section-y">
        <div className="container-x grid gap-10 lg:grid-cols-[2fr_1fr]">
          <form onSubmit={submit} className="rounded-3xl border border-border bg-card p-8 shadow-soft md:p-10" noValidate>

            {/* Step indicator */}
            <ol className="mb-10 flex items-center justify-between gap-2">
              {Array.from({ length: maxSteps }, (_, idx) => idx + 1).map((n) => (
                <li key={n} className="flex flex-1 items-center gap-2">
                  <span
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-bold transition-all duration-200 ${
                      step > n ? "bg-[var(--teal)] text-white" :
                      step === n ? "bg-[var(--navy)] text-white ring-4 ring-[var(--navy)]/20" :
                      "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {step > n ? <Check className="h-4 w-4" /> : n}
                  </span>
                  {n < maxSteps && <span className={`h-0.5 flex-1 transition-colors duration-300 ${step > n ? "bg-[var(--teal)]" : "bg-border"}`} />}
                </li>
              ))}
            </ol>

            {/* ─── STEP 1: ROUTE & SERVICE ─── */}
            {step === 1 && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-semibold text-[var(--navy)]">Direction</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Where is your shipment going?</p>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {[
                      { key: "ca-ng", label: "Canada → Nigeria", helper: "Calgary / Cranston to Lagos" },
                      { key: "ng-ca", label: "Nigeria → Canada", helper: "Lagos to Calgary / Canada" },
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

            {/* ─── STEP 2: SENDER DETAILS ─── */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-xl font-semibold text-[var(--navy)]">
                    Sender Information ({direction === "ca-ng" ? "Calgary / Canada" : "Lagos / Nigeria"})
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">Your personal details as the shipper.</p>
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  <Field label="Sender's Full Name *" error={errors.name}>
                    <input
                      value={name}
                      onChange={(e) => { setName(e.target.value); clearErr("name"); }}
                      className={ic(!!errors.name)}
                      placeholder="John Doe"
                    />
                  </Field>
                  <Field label="Sender's Email Address *" error={errors.email}>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); clearErr("email"); }}
                      className={ic(!!errors.email)}
                      placeholder="john@example.com"
                    />
                  </Field>
                </div>
                <div className="grid gap-5 md:grid-cols-2 overflow-hidden">
                  <Field label="Sender's Phone Number *" error={errors.phone}>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => { setPhone(e.target.value); clearErr("phone"); }}
                      className={ic(!!errors.phone)}
                      placeholder="e.g. +1 (403) 555-0199"
                    />
                  </Field>
                  <Field label="Date of Package Drop-off *" error={errors.date}>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => { setDate(e.target.value); clearErr("date"); }}
                      className={`${ic(!!errors.date)} min-w-0`}
                    />
                  </Field>
                </div>
                <Field label="Sender's Residential / Office Address *" error={errors.senderAddress}>
                  <input
                    value={senderAddress}
                    onChange={(e) => { setSenderAddress(e.target.value); clearErr("senderAddress"); }}
                    className={ic(!!errors.senderAddress)}
                    placeholder={`Full address in ${direction === "ca-ng" ? "Calgary / Canada" : "Lagos / Nigeria"}`}
                  />
                </Field>
              </div>
            )}

            {/* ─── STEP 3: RECEIVER DETAILS ─── */}
            {step === 3 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-xl font-semibold text-[var(--navy)]">
                    Receiver Information ({direction === "ca-ng" ? "Nigeria" : "Calgary / Canada"})
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">Who is receiving the shipment?</p>
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  <Field label="Receiver's Full Name *" error={errors.receiverName}>
                    <input
                      value={receiverName}
                      onChange={(e) => { setReceiverName(e.target.value); clearErr("receiverName"); }}
                      className={ic(!!errors.receiverName)}
                      placeholder="Bisi Adebayo"
                    />
                  </Field>
                  <Field label="Receiver's Email Address">
                    <input
                      type="email"
                      value={receiverEmail}
                      onChange={(e) => setReceiverEmail(e.target.value)}
                      className={ic(false)}
                      placeholder="bisi@example.com"
                    />
                  </Field>
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  <Field label="Receiver's Phone Number *" error={errors.receiverPhone}>
                    <input
                      type="tel"
                      value={receiverPhone}
                      onChange={(e) => { setReceiverPhone(e.target.value); clearErr("receiverPhone"); }}
                      className={ic(!!errors.receiverPhone)}
                      placeholder={direction === "ca-ng" ? "e.g. +234 803 555 0199" : "e.g. +1 (403) 555-0199"}
                    />
                  </Field>
                  <Field label="Receiver's Full Delivery Address *" error={errors.receiverAddress}>
                    <input
                      value={receiverAddress}
                      onChange={(e) => { setReceiverAddress(e.target.value); clearErr("receiverAddress"); }}
                      className={ic(!!errors.receiverAddress)}
                      placeholder={`Full address in ${direction === "ca-ng" ? "Nigeria" : "Calgary / Canada"}`}
                    />
                  </Field>
                </div>
              </div>
            )}

            {/* ─── STEP 4: CARGO DETAILS ─── */}
            {step === 4 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-xl font-semibold text-[var(--navy)]">Shipment Contents & Details</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Describe your package contents for customs and invoicing.</p>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <Field label="Type of Goods *">
                    <SelectWrapper>
                      <select value={goodsType} onChange={(e) => setGoodsType(e.target.value)} className={sc(false)}>
                        <option value="Personal Items">Personal Items</option>
                        <option value="Commercial Goods">Commercial Goods</option>
                        <option value="Gifts">Gifts</option>
                      </select>
                    </SelectWrapper>
                  </Field>
                  <Field label="Total Estimated Value of Items (CAD) *" error={errors.estimatedValue}>
                    <input
                      type="number"
                      min={0}
                      value={estimatedValue}
                      onChange={(e) => { setEstimatedValue(e.target.value); clearErr("estimatedValue"); }}
                      className={ic(!!errors.estimatedValue)}
                      placeholder="e.g. 500 — for customs & insurance"
                    />
                  </Field>
                </div>

                <div className="grid gap-5 md:grid-cols-2 items-end">
                  {service === "sea-box" ? (
                    <Field label="Total Number of Boxes *" error={errors.boxes}>
                      <input
                        type="number"
                        min={1}
                        value={boxes}
                        onChange={(e) => { setBoxes(e.target.value); clearErr("boxes"); }}
                        className={ic(!!errors.boxes)}
                        placeholder="e.g. 2"
                      />
                    </Field>
                  ) : service === "vehicle" ? (
                    <Field label="Vehicle Make, Model & Year *" error={errors.type}>
                      <input
                        type="text"
                        value={type}
                        onChange={(e) => { setType(e.target.value); clearErr("type"); }}
                        className={ic(!!errors.type)}
                        placeholder="e.g. 2018 Toyota Camry Sedan"
                      />
                    </Field>
                  ) : (
                    <Field label="Total Estimated Weight (kg) *" error={errors.weight}>
                      <input
                        type="number"
                        min={0.1}
                        step="0.1"
                        value={weight}
                        onChange={(e) => { setWeight(e.target.value); clearErr("weight"); }}
                        className={ic(!!errors.weight)}
                        placeholder="e.g. 10.5"
                      />
                    </Field>
                  )}

                  <Field label="Contains Prohibited Items? *">
                    <SelectWrapper>
                      <select
                        value={hasProhibited}
                        onChange={(e) => setHasProhibited(e.target.value as "Yes" | "No")}
                        className={`${sc(false)} ${hasProhibited === "Yes" ? "!border-red-500 !bg-red-50 !text-red-700" : ""}`}
                      >
                        <option value="No">No — does not contain prohibited items</option>
                        <option value="Yes">Yes — contains prohibited items</option>
                      </select>
                    </SelectWrapper>
                    {hasProhibited === "Yes" && (
                      <p className="mt-2 flex items-start gap-1.5 rounded-lg bg-red-50 border border-red-200 p-2.5 text-xs text-red-600">
                        <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                        We cannot accept shipments with prohibited items (perfumes, aerosols, drugs, weapons). Please remove them before booking.
                      </p>
                    )}
                  </Field>
                </div>

                {service.startsWith("air-") && (
                  <div>
                    <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Are you shipping any electronics?</span>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {["Phone", "Laptops", "Games (Xbox, Playstation, etc)", "N/A"].map((el) => (
                        <label key={el} className="flex items-center gap-2 rounded-xl border border-border p-3 cursor-pointer hover:bg-secondary transition-colors">
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
                      ⚠️ Laptops, phones, vitamins, prescriptions, and car parts must be declared at drop-off. Please provide receipts for new electronics.
                    </p>
                  </div>
                )}

                <Field label="Detailed list of items (List ALL items in package) *" error={errors.notes}>
                  <textarea
                    rows={4}
                    value={notes}
                    onChange={(e) => { setNotes(e.target.value); clearErr("notes"); }}
                    placeholder={
                      service === "vehicle"
                        ? "List any items loaded inside the vehicle, or write 'None'..."
                        : "e.g. 3 native attires, 2 pairs of shoes, 5 bags of milk powder, 4 soaps..."
                    }
                    className={ic(!!errors.notes)}
                  />
                </Field>
              </div>
            )}

            {/* ─── STEP 5: DELIVERY & AGREEMENTS ─── */}
            {step === 5 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-xl font-semibold text-[var(--navy)]">Delivery & Legal Declarations</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Select delivery preference and agree to our terms.</p>
                </div>

                <Field label={`Mode of Delivery (${direction === "ca-ng" ? "Lagos / Nigeria" : "Calgary / Canada"}) *`}>
                  <SelectWrapper>
                    <select value={deliveryMode} onChange={(e) => setDeliveryMode(e.target.value)} className={sc(false)}>
                      {direction === "ca-ng" ? (
                        <>
                          <option value="Warehouse Pickup">Self-Pickup at Lagos Warehouse (Oregun, Ikeja) — FREE</option>
                          <option value="Within Lagos/Ogun Delivery">Door-to-door: Within Lagos / Ogun (Min $30 Air · $50 Sea)</option>
                          <option value="Outside Lagos/Ogun Delivery">Door-to-door: Outside Lagos / Ogun (Min $50 Air · $70 Sea)</option>
                        </>
                      ) : (
                        <>
                          <option value="Warehouse Pickup">Self-Pickup at Calgary Warehouse (Marlborough NE) — FREE</option>
                          <option value="Within Calgary Delivery">Door-to-door: Within Calgary (Min $30 CAD)</option>
                          <option value="Outside Calgary Delivery">Door-to-door: Outside Calgary / Western Canada (Min $50 CAD)</option>
                        </>
                      )}
                    </select>
                  </SelectWrapper>
                </Field>

                {deliveryMode !== "Warehouse Pickup" && (
                  <div className="grid gap-5 md:grid-cols-2">
                    <Field label="Delivery Street Address *" error={errors.deliveryAddress}>
                      <input
                        value={deliveryAddress}
                        onChange={(e) => { setDeliveryAddress(e.target.value); clearErr("deliveryAddress"); }}
                        className={ic(!!errors.deliveryAddress)}
                        placeholder={`Street address in ${direction === "ca-ng" ? "Nigeria" : "Canada"}`}
                      />
                    </Field>
                    <Field label="Nearest Landmark / Instructions">
                      <input
                        value={landmark}
                        onChange={(e) => setLandmark(e.target.value)}
                        className={ic(false)}
                        placeholder="e.g., Opp. Polaris Bank"
                      />
                    </Field>
                  </div>
                )}

                {/* Legal Declaration */}
                <div
                  data-has-error={!!errors.agreedToDeclaration}
                  className={`rounded-2xl border p-5 transition-colors ${errors.agreedToDeclaration ? "border-red-400 bg-red-50/40" : "border-border bg-[var(--surface-2)]"}`}
                >
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreedToDeclaration}
                      onChange={(e) => { setAgreedToDeclaration(e.target.checked); clearErr("agreedToDeclaration"); }}
                      className="mt-1 h-4 w-4 accent-[var(--teal)] shrink-0 cursor-pointer"
                    />
                    <span className="text-xs leading-relaxed text-[var(--navy)]">
                      I, the shipper, hereby confirm that the packages or shipments I am providing to{" "}
                      <strong>iSHIFT SERVICES INC</strong> or its agent(s) do not contain any contraband, dangerous goods,
                      or narcotics. I understand that any false declaration may result in legal consequences, and I accept
                      full responsibility for the contents of my shipment.
                    </span>
                  </label>
                  {errors.agreedToDeclaration && (
                    <p className="mt-2 flex items-center gap-1.5 text-xs text-red-500">
                      <AlertTriangle className="h-3 w-3 shrink-0" /> {errors.agreedToDeclaration}
                    </p>
                  )}
                </div>

                {/* Terms & Conditions */}
                <div>
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Terms & Conditions Agreement
                  </span>
                  <div className="h-36 overflow-y-auto border border-border rounded-xl p-4 text-[10px] leading-relaxed text-muted-foreground space-y-3 bg-background">
                    <p>
                      <strong>Limitation of Liability:</strong> iSHIFT SERVICES INC maximum liability for any loss or damage
                      to shipments, if no value is declared, is limited to $2 (or Naira equivalent) per kilogram of the
                      shipment's weight. This applies whether loss or damage is partial or total. For high-value items, you
                      may declare the value and purchase additional insurance.
                    </p>
                    <p>
                      <strong>Customs Inspection:</strong> All shipments are subject to inspection by the Nigerian Customs
                      Service. This may include opening, searching, or seizure. iSHIFT Services Inc. is not liable for
                      actions taken by customs authorities.
                    </p>
                    <p>
                      <strong>Timelines:</strong> We are not liable for delays caused by airlines, shipping lines, customs,
                      or other regulatory authorities. The stated delivery timeline is based on standard operational flows
                      and is not guaranteed.
                    </p>
                    <p>
                      <strong>Optional Delivery:</strong> Courier and delivery services are optional convenience services
                      used at the customer's own risk. iSHIFT disclaims liability for transit issues once handed over to
                      third parties.
                    </p>
                  </div>
                  <div
                    data-has-error={!!errors.agreedToTerms}
                    className={`mt-3 flex items-center gap-3 rounded-xl border p-3 transition-colors cursor-pointer ${errors.agreedToTerms ? "border-red-400 bg-red-50/40" : "border-border hover:bg-secondary/50"}`}
                  >
                    <input
                      id="agreeTerms"
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => { setAgreedToTerms(e.target.checked); clearErr("agreedToTerms"); }}
                      className="h-4 w-4 accent-[var(--teal)] shrink-0 cursor-pointer"
                    />
                    <label htmlFor="agreeTerms" className="text-xs font-semibold text-[var(--navy)] cursor-pointer select-none">
                      I agree to the Terms & Conditions and Privacy Policy *
                    </label>
                  </div>
                  {errors.agreedToTerms && (
                    <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-500">
                      <AlertTriangle className="h-3 w-3 shrink-0" /> {errors.agreedToTerms}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-10 flex items-center justify-between">
              <button
                type="button"
                onClick={prev}
                disabled={step === 1}
                className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-semibold text-[var(--navy)] transition-all hover:bg-secondary disabled:opacity-40"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              {step < maxSteps ? (
                <button
                  type="button"
                  onClick={next}
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--teal)] px-6 py-3 text-sm font-semibold text-white shadow-soft hover:-translate-y-0.5 transition-all"
                >
                  Continue <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--navy)] px-6 py-3 text-sm font-semibold text-white shadow-soft hover:bg-[var(--navy-soft)] disabled:opacity-60 transition-all"
                >
                  {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting…</> : <>Submit Booking <Check className="h-4 w-4" /></>}
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

            {direction === "ca-ng" && (
              <div className="rounded-3xl border border-border bg-card p-7 shadow-soft space-y-4">
                <p className="text-sm font-semibold text-[var(--navy)] flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 text-amber-500" /> Drop-off Cutoff & Rules
                </p>
                <div className="text-xs text-muted-foreground space-y-2 leading-relaxed">
                  <p><strong>Weekly Air Cargo:</strong> Departs every other Thursday. Drop off by Monday of the shipment week.</p>
                  <p><strong>Drop-off Locations:</strong></p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Marlborough NE: Mon–Fri (Call ahead)</li>
                    <li>Cranston SE: Mon–Sun (Call ahead)</li>
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
              <p className="mt-4 text-xs leading-relaxed text-muted-foreground">Lagos Support: +1 (403) 431-6456</p>
            </div>
          </aside>
        </div>
        <Toaster />
      </section>
    </>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Base input class, with optional error state */
function ic(hasError: boolean) {
  return [
    "w-full min-w-0 rounded-xl border bg-background px-4 py-3 text-sm text-[var(--navy)] outline-none",
    "transition-all duration-150 placeholder:text-muted-foreground/50",
    hasError
      ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-400/20 bg-red-50/20"
      : "border-border focus:border-[var(--teal)] focus:ring-2 focus:ring-[var(--teal)]/20",
  ].join(" ");
}

/** Select class — uses appearance-none so custom arrow shows */
function sc(hasError: boolean) {
  return [
    "w-full min-w-0 rounded-xl border bg-background px-4 py-3 pr-10 text-sm text-[var(--navy)] outline-none",
    "appearance-none cursor-pointer transition-all duration-150",
    hasError
      ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-400/20"
      : "border-border focus:border-[var(--teal)] focus:ring-2 focus:ring-[var(--teal)]/20",
  ].join(" ");
}

/** Wrapper that adds a well-positioned chevron arrow to any <select> */
function SelectWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {children}
      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
        <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}

/** Field label + children + optional error message */
function Field({
  label,
  children,
  error,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <div data-has-error={!!error || undefined}>
      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        {children}
      </label>
      {error && (
        <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-500">
          <AlertTriangle className="h-3 w-3 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
