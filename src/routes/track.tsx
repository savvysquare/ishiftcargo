import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Search,
  Package,
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Info,
  CheckCircle2,
  Copy,
  Building,
  User,
} from "lucide-react";
import { getBookingByTrackingNumber, type Booking } from "@/lib/bookingStore";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/track")({
  head: () => ({
    meta: [
      { title: "Track Shipment | iShiftCargo" },
      { name: "description", content: "Track your cargo shipment in real-time between Canada and Nigeria using your unique tracking number." },
      { property: "og:title", content: "Track Shipment | iShiftCargo" },
      { property: "og:description", content: "Real-time shipment tracking for iShiftCargo bookings." },
      { property: "og:url", content: "/track" },
    ],
    links: [{ rel: "canonical", href: "/track" }],
  }),
  component: TrackPage,
});

const STATUS_STEPS = [
  { key: "Pending", label: "Booking Placed", desc: "Shipment request received" },
  { key: "Received", label: "At Warehouse", desc: "Dropped off & verified" },
  { key: "In Transit", label: "In Transit", desc: "Departed for destination" },
  { key: "Customs Clearance", label: "Customs", desc: "Clearing customs inspection" },
  { key: "Arrived", label: "Arrived", desc: "At destination hub" },
  { key: "Delivered", label: "Delivered", desc: "Handed over to receiver" },
];

function getStatusIndex(status: string = "Pending"): number {
  const mapping: Record<string, number> = {
    Pending: 0,
    Received: 1,
    "In Transit": 2,
    "Customs Clearance": 3,
    Arrived: 4,
    Delivered: 5,
    Cancelled: -1,
  };
  return mapping[status] ?? 0;
}

function TrackPage() {
  const [query, setQuery] = useState("");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // Load code from query parameter on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code") || params.get("id");
    if (code) {
      setQuery(code);
      handleTrack(code);
    }
  }, []);

  const handleTrack = async (searchCode: string) => {
    const code = (searchCode || query).trim();
    if (!code) {
      toast.error("Please enter a tracking number.");
      return;
    }
    setLoading(true);
    setSearched(true);
    try {
      const data = await getBookingByTrackingNumber(code);
      setBooking(data);
      if (data) {
        // Update URL query param silently
        const url = new URL(window.location.href);
        url.searchParams.set("code", data.tracking_number || data.id);
        window.history.replaceState({}, "", url.toString());
      } else {
        toast.error("No shipment found with that tracking number.");
      }
    } catch (e) {
      console.error(e);
      toast.error("An error occurred while fetching tracking info.");
    } finally {
      setLoading(false);
    }
  };

  const currentStepIndex = booking ? getStatusIndex(booking.status) : -1;
  const isCancelled = booking?.status === "Cancelled";

  return (
    <div className="min-h-screen bg-[var(--surface)] py-12 md:py-20">
      <div className="container-x max-w-4xl">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="eyebrow">Tracking</span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-[var(--navy)] md:text-5xl">
            Track Your Shipment
          </h1>
          <p className="mt-3 text-sm text-muted-foreground max-w-md mx-auto">
            Enter your iShiftCargo tracking number (e.g. ISC-A1B2C3) or booking ID to check status.
          </p>
        </div>

        {/* Search Input Box */}
        <div className="mx-auto max-w-xl mb-12">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleTrack(query);
            }}
            className="flex gap-2 rounded-2xl border border-border bg-card p-2 shadow-soft"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter tracking number..."
                className="w-full rounded-xl bg-transparent py-3 pl-10 pr-4 text-sm text-[var(--navy)] outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-[var(--navy)] px-6 py-2 text-xs font-semibold text-white shadow-soft transition-all hover:bg-[var(--navy-soft)] disabled:opacity-60"
            >
              {loading ? "Searching..." : "Track"}
            </button>
          </form>
        </div>

        {/* Results Section */}
        {loading && (
          <div className="space-y-6 animate-pulse">
            <div className="h-40 rounded-3xl bg-card border border-border" />
            <div className="h-60 rounded-3xl bg-card border border-border" />
          </div>
        )}

        {!loading && searched && !booking && (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card py-16 text-center shadow-soft">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-red-50 text-red-500">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <h2 className="mt-5 text-lg font-semibold text-[var(--navy)]">No shipment found</h2>
            <p className="mt-2 max-w-xs text-xs text-muted-foreground">
              We couldn't find a booking matching <strong>"{query}"</strong>. Double check the spelling or contact support if you believe this is an error.
            </p>
          </div>
        )}

        {!loading && booking && (
          <div className="space-y-6">
            {/* Status Summary Banner */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-soft md:p-8">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Tracking Code</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xl font-mono font-bold text-[var(--navy)]">
                      {booking.tracking_number || booking.id}
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(booking.tracking_number || booking.id);
                        toast.success("Tracking code copied!");
                      }}
                      className="rounded-md p-1.5 hover:bg-secondary text-muted-foreground"
                      title="Copy code"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--teal-soft)] text-[var(--teal)]">
                    <Clock className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Current Location</p>
                    <p className="text-sm font-semibold text-[var(--navy)]">
                      {booking.current_location || "Processing at Calgary hub"}
                    </p>
                  </div>
                </div>

                <div className="md:text-right">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                      isCancelled
                        ? "bg-red-50 text-red-600 border border-red-200"
                        : booking.status === "Delivered"
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                        : "bg-[var(--teal-soft)] text-[var(--teal)] border border-[var(--teal)]/20 animate-pulse"
                    }`}
                  >
                    ● {booking.status || "Pending"}
                  </span>
                  <p className="text-[10px] text-muted-foreground mt-1 font-medium">
                    Updated {new Date(booking.submitted_at).toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
              </div>

              {/* Cancelled State Banner */}
              {isCancelled && (
                <div className="mt-6 flex items-start gap-3 rounded-2xl bg-red-50 p-4 text-xs text-red-800 border border-red-100">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
                  <div>
                    <p className="font-bold">Shipment Cancelled</p>
                    <p className="mt-0.5">This booking has been marked as cancelled. Please reach out to customer support at +1 (403) 431-6456 for further details.</p>
                  </div>
                </div>
              )}

              {/* Shipment Timeline */}
              {!isCancelled && (
                <div className="mt-12">
                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-6">Journey Progression</p>
                  <div className="grid gap-6 md:grid-cols-6 md:gap-2 relative">
                    {STATUS_STEPS.map((step, idx) => {
                      const isCompleted = currentStepIndex >= idx;
                      const isCurrent = currentStepIndex === idx;

                      return (
                        <div key={step.key} className="flex md:flex-col items-start gap-4 md:gap-2 relative">
                          {/* Dot and Line wrapper */}
                          <div className="flex flex-col md:flex-row items-center relative shrink-0">
                            {/* Connecting Line (Desktop) */}
                            {idx < STATUS_STEPS.length - 1 && (
                              <div
                                className={`hidden md:block absolute left-6 top-3 h-0.5 w-[calc(100%_-_1.5rem)] lg:w-[calc(100%_-_1.2rem)] ${
                                  currentStepIndex > idx ? "bg-[var(--teal)]" : "bg-border"
                                }`}
                              />
                            )}
                            
                            {/* Connecting Line (Mobile) */}
                            {idx < STATUS_STEPS.length - 1 && (
                              <div
                                className={`md:hidden absolute left-[11px] top-6 w-0.5 h-10 ${
                                  currentStepIndex > idx ? "bg-[var(--teal)]" : "bg-border"
                                }`}
                              />
                            )}

                            {/* Node Icon */}
                            <div
                              className={`grid h-6 w-6 place-items-center rounded-full border text-[10px] font-bold z-10 transition-all ${
                                isCompleted
                                  ? "bg-[var(--teal)] border-[var(--teal)] text-white"
                                  : "bg-background border-border text-muted-foreground"
                              } ${isCurrent ? "ring-4 ring-[var(--teal-soft)] shadow-soft scale-110" : ""}`}
                            >
                              {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
                            </div>
                          </div>

                          {/* Text info */}
                          <div className="min-w-0">
                            <p
                              className={`text-xs font-bold leading-tight ${
                                isCurrent
                                  ? "text-[var(--teal)]"
                                  : isCompleted
                                  ? "text-[var(--navy)]"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {step.label}
                            </p>
                            <p className="text-[10px] text-muted-foreground mt-0.5 max-w-[120px] leading-tight">
                              {step.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Invoices & Support Box */}
            <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
              {/* Left Column: Shipment Details */}
              <div className="rounded-3xl border border-border bg-card p-6 shadow-soft space-y-6 md:p-8">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--teal)] mb-4">Shipment Details</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <MetaRow label="Origin" value={booking.direction === "ca-ng" ? "Calgary, Canada" : "Lagos, Nigeria"} />
                    <MetaRow label="Destination" value={booking.direction === "ca-ng" ? "Lagos, Nigeria" : "Calgary, Canada"} />
                    <MetaRow label="Service Type" value={booking.service.startsWith("air") ? "Air Cargo Express" : booking.service.startsWith("sea") ? "Sea Cargo Container" : "Vehicle Logistics"} />
                    <MetaRow label="Delivery Mode" value={booking.delivery_mode || "Warehouse Pickup"} />
                    <MetaRow
                      label="Packages / Cargo Size"
                      value={
                        booking.service === "sea-box"
                          ? `${booking.boxes || 1} Box(es)`
                          : booking.service === "vehicle"
                          ? `${booking.type || "Vehicle"}`
                          : `${booking.weight || 0} kg`
                      }
                    />
                    <MetaRow label="Preferred Date" value={booking.preferred_date || "Not set"} />
                  </div>
                </div>

                <hr className="border-border" />

                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--teal)] mb-4">Consignment Info</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <MetaRow label="Sender Name" value={booking.name} />
                    <MetaRow label="Receiver Name" value={booking.receiver_name || "Not specified"} />
                    <MetaRow label="Delivery Address" value={booking.delivery_address || booking.receiver_address || "Warehouse Pickup"} />
                    {booking.landmark && <MetaRow label="Nearest Landmark" value={booking.landmark} />}
                  </div>
                  {booking.notes && (
                    <div className="mt-4 p-4 rounded-2xl bg-secondary/40 border border-border">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Detailed Cargo List</p>
                      <p className="text-xs text-[var(--navy)] mt-1 whitespace-pre-wrap leading-relaxed">
                        {booking.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Invoice & Payments */}
              <div className="space-y-6">
                {/* Invoice Box */}
                <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--teal)] mb-3">Invoice & Cost</h3>
                  
                  <div className="mt-2 space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-border">
                      <span className="text-xs text-muted-foreground">Amount Due</span>
                      <span className="text-base font-bold text-[var(--navy)]">
                        {booking.invoice_amount || booking.estimate || "Calculating..."}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pb-2 border-b border-border">
                      <span className="text-xs text-muted-foreground">Payment Status</span>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          booking.invoice_status === "Paid"
                            ? "bg-emerald-50 text-emerald-600"
                            : booking.invoice_status === "N/A"
                            ? "bg-gray-100 text-gray-500"
                            : "bg-amber-50 text-amber-600"
                        }`}
                      >
                        {booking.invoice_status || "Unpaid"}
                      </span>
                    </div>

                    {booking.invoice_status !== "Paid" && booking.invoice_notes && (
                      <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-100 text-xs text-amber-900">
                        <p className="font-bold flex items-center gap-1.5">
                          <Info className="h-3.5 w-3.5 text-amber-500" /> Payment Instructions
                        </p>
                        <p className="mt-1 leading-relaxed whitespace-pre-wrap font-sans">
                          {booking.invoice_notes}
                        </p>
                      </div>
                    )}

                    {booking.invoice_status === "Paid" && (
                      <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100 text-xs text-emerald-900 flex items-start gap-2">
                        <ShieldCheck className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                        <div>
                          <p className="font-bold">Payment Verified</p>
                          <p className="mt-0.5">Thank you! Payment for this invoice has been cleared and processed.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Need Help Box */}
                <div className="rounded-3xl border border-border bg-[var(--navy)] p-6 text-white shadow-soft">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white/60">Need Assistance?</h4>
                  <p className="mt-2 text-xs leading-relaxed text-white/80">
                    If you have questions about your package status, customs delay, or payment, contact our customer support desk:
                  </p>
                  <a
                    href="tel:+14034316456"
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 px-4 py-2.5 text-xs font-semibold text-white transition-all"
                  >
                    <Building className="h-3.5 w-3.5 text-[var(--teal)]" /> Calgary: +1 (403) 431-6456
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Toaster />
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-xs font-bold text-[var(--navy)] truncate" title={value}>
        {value}
      </p>
    </div>
  );
}
