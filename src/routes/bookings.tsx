import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import {
  Lock,
  LogOut,
  Trash2,
  Package,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ArrowLeftRight,
  DollarSign,
  FileText,
  Eye,
  EyeOff,
  RefreshCw,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { getBookings, deleteBooking, type Booking } from "@/lib/bookingStore";
import { isSupabaseConfigured as checkSupabase } from "@/lib/supabase";

export const Route = createFileRoute("/bookings")({
  component: BookingsPage,
});

const PASSWORD = "iShiftCargo$$$123";
const SESSION_KEY = "ishiftcargo_admin_auth";

function BookingsPage() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(SESSION_KEY) === "1");
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [selected, setSelected] = useState<Booking | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await getBookings();
      setBookings(data);
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authed) load();
  }, [authed, load]);

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "1");
      setAuthed(true);
      setError("");
    } else {
      setError("Incorrect password. Please try again.");
    }
  };

  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthed(false);
    setPw("");
    setSelected(null);
  };

  const confirmDelete = async (id: string) => {
    setDeleting(true);
    try {
      await deleteBooking(id);
      setBookings((prev) => prev.filter((b) => b.id !== id));
      if (selected?.id === id) setSelected(null);
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "Delete failed.");
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  /* ── Login screen ─────────────────────────────────────────────────────── */
  if (!authed) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--surface)] px-4">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-[var(--navy)] text-white shadow-lift">
              <Lock className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold text-[var(--navy)]">Admin Access</h1>
            <p className="mt-1 text-sm text-muted-foreground">iShiftCargo · Bookings Dashboard</p>
          </div>

          <form onSubmit={login} className="rounded-3xl border border-border bg-card p-8 shadow-soft">
            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Password
              </span>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPw ? "text" : "password"}
                  value={pw}
                  onChange={(e) => { setPw(e.target.value); setError(""); }}
                  autoFocus
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 pr-12 text-sm text-[var(--navy)] outline-none transition-all focus:border-[var(--teal)] focus:ring-2 focus:ring-[var(--teal)]/20"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-[var(--navy)]"
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </label>

            {error && (
              <p className="mt-3 rounded-xl bg-red-50 px-4 py-2.5 text-xs font-medium text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="mt-6 w-full rounded-full bg-[var(--navy)] py-3 text-sm font-semibold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    );
  }

  /* ── Dashboard ────────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-[var(--surface)]">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur">
        <div className="container-x flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-base font-bold text-[var(--navy)]">Bookings Dashboard</span>
            <span className="rounded-full bg-[var(--teal-soft)] px-2.5 py-0.5 text-xs font-semibold text-[var(--teal)]">
              {bookings.length} total
            </span>
            {checkSupabase ? (
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-600">
                ● Supabase
              </span>
            ) : (
              <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-600">
                ● Local storage
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={load}
              disabled={loading}
              className="flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-2 text-xs font-semibold text-[var(--navy)] hover:bg-secondary disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
              Refresh
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 rounded-full bg-[var(--navy)] px-4 py-2 text-xs font-semibold text-white"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="container-x py-8">
        {/* Error banner */}
        {loadError && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{loadError}</span>
            <button onClick={() => setLoadError(null)} className="ml-auto text-xs underline">Dismiss</button>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && bookings.length === 0 && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 animate-pulse rounded-2xl bg-card border border-border" />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && bookings.length === 0 && !loadError && (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card py-24 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[var(--surface-2)] text-muted-foreground">
              <Package className="h-8 w-8" />
            </div>
            <h2 className="mt-5 text-lg font-semibold text-[var(--navy)]">No bookings yet</h2>
            <p className="mt-2 max-w-xs text-sm text-muted-foreground">
              Bookings submitted through the{" "}
              <a href="/book" className="text-[var(--teal)] underline underline-offset-2">Book a Shipment</a>{" "}
              form will appear here.
            </p>
          </div>
        )}

        {/* Bookings list + detail */}
        {bookings.length > 0 && (
          <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
            {/* List */}
            <div className="space-y-3">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  onClick={() => setSelected(b)}
                  className={`group relative cursor-pointer rounded-2xl border bg-card p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift ${
                    selected?.id === b.id ? "border-[var(--teal)] ring-2 ring-[var(--teal)]/20" : "border-border"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold text-[var(--navy)]">{b.name}</span>
                        <Badge label={friendlyDirection(b.direction)} />
                        <Badge label={friendlyService(b.service)} teal />
                      </div>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{b.email}</span>
                        <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{b.phone}</span>
                        {b.estimate && <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" />{b.estimate}</span>}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <time className="text-xs text-muted-foreground">{formatDate(b.submitted_at)}</time>
                      <button
                        onClick={(e) => { e.stopPropagation(); setDeleteId(b.id); }}
                        className="opacity-0 group-hover:opacity-100 rounded-full p-1.5 text-red-400 transition-all hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Detail panel */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              {selected ? (
                <div className="rounded-3xl border border-border bg-card p-7 shadow-soft">
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-base font-bold text-[var(--navy)]">Booking detail</h2>
                    <button
                      onClick={() => setDeleteId(selected.id)}
                      className="flex items-center gap-1.5 rounded-full border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </button>
                  </div>
                  <div className="space-y-4">
                    <DetailRow icon={<User />} label="Name" value={selected.name} />
                    <DetailRow icon={<Mail />} label="Email" value={selected.email} />
                    <DetailRow icon={<Phone />} label="Phone" value={selected.phone} />
                    <hr className="border-border" />
                    <DetailRow icon={<ArrowLeftRight />} label="Direction" value={friendlyDirection(selected.direction)} />
                    <DetailRow icon={<Package />} label="Service" value={friendlyService(selected.service)} />
                    {selected.weight && <DetailRow icon={<Package />} label="Weight" value={`${selected.weight} kg`} />}
                    {selected.boxes && selected.boxes !== "1" && <DetailRow icon={<Package />} label="Boxes" value={selected.boxes} />}
                    {selected.type && <DetailRow icon={<FileText />} label="Contents type" value={selected.type} />}
                    {selected.notes && <DetailRow icon={<FileText />} label="Notes" value={selected.notes} />}
                    <hr className="border-border" />
                    {selected.location && <DetailRow icon={<MapPin />} label="Location" value={selected.location} />}
                    {selected.preferred_date && <DetailRow icon={<Calendar />} label="Preferred date" value={selected.preferred_date} />}
                    {selected.estimate && <DetailRow icon={<DollarSign />} label="Estimate" value={selected.estimate} highlight />}
                    <hr className="border-border" />
                    <p className="text-xs text-muted-foreground">
                      Submitted {new Date(selected.submitted_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card py-20 text-center text-sm text-muted-foreground">
                  <Package className="mb-3 h-8 w-8 opacity-40" />
                  Select a booking to view details
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="w-full max-w-sm rounded-3xl bg-card p-8 shadow-lift">
            <div className="mb-2 grid h-12 w-12 place-items-center rounded-2xl bg-red-100 text-red-500">
              <Trash2 className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-base font-bold text-[var(--navy)]">Delete booking?</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              This action cannot be undone. The booking will be permanently removed{checkSupabase ? " from Supabase" : " from local storage"}.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                disabled={deleting}
                className="flex-1 rounded-full border border-border py-2.5 text-sm font-semibold text-[var(--navy)] hover:bg-secondary disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDelete(deleteId)}
                disabled={deleting}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-red-500 py-2.5 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-60"
              >
                {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Helpers ───────────────────────────────────────────────────────────── */

function Badge({ label, teal }: { label: string; teal?: boolean }) {
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${teal ? "bg-[var(--teal-soft)] text-[var(--teal)]" : "bg-secondary text-muted-foreground"}`}>
      {label}
    </span>
  );
}

function DetailRow({ icon, label, value, highlight }: { icon: React.ReactNode; label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground [&>svg]:h-4 [&>svg]:w-4">{icon}</span>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className={`mt-0.5 break-words text-sm ${highlight ? "font-bold text-[var(--teal)]" : "text-[var(--navy)]"}`}>{value}</p>
      </div>
    </div>
  );
}

function friendlyDirection(d: string) {
  return d === "ca-ng" ? "Canada → Nigeria" : "Nigeria → Canada";
}

function friendlyService(s: string) {
  const map: Record<string, string> = {
    "air-dry": "Air (Dry)",
    "air-frozen": "Air (Frozen)",
    "sea-box": "Sea (Box)",
    "sea-perkg": "Sea (per kg)",
    vehicle: "Vehicle",
  };
  return map[s] ?? s;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" });
}
