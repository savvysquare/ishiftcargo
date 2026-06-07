// Booking store — persists submissions in localStorage so the
// /bookings admin dashboard can display them without a backend.

export interface Booking {
  id: string;
  submittedAt: string; // ISO string
  name: string;
  email: string;
  phone: string;
  direction: string;
  service: string;
  weight: string;
  boxes: string;
  type: string;
  notes: string;
  location: string;
  date: string;
  estimate: string;
}

const KEY = "ishiftcargo_bookings";

export function saveBooking(b: Omit<Booking, "id" | "submittedAt">): Booking {
  const entry: Booking = {
    ...b,
    id: crypto.randomUUID(),
    submittedAt: new Date().toISOString(),
  };
  const existing = getBookings();
  localStorage.setItem(KEY, JSON.stringify([entry, ...existing]));
  return entry;
}

export function getBookings(): Booking[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]") as Booking[];
  } catch {
    return [];
  }
}

export function deleteBooking(id: string): void {
  const updated = getBookings().filter((b) => b.id !== id);
  localStorage.setItem(KEY, JSON.stringify(updated));
}
