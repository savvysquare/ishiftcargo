/**
 * Booking store — persists bookings to Supabase when configured,
 * falling back to localStorage for local development without credentials.
 */

import { supabase, isSupabaseConfigured } from "./supabase";

export interface Booking {
  id: string;
  submitted_at: string; // ISO string (Supabase column name)
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
  preferred_date: string;
  estimate: string;
}

export type BookingInput = Omit<Booking, "id" | "submitted_at">;

/* ─── Supabase implementation ──────────────────────────────────────────── */

async function saveBookingRemote(input: BookingInput): Promise<Booking> {
  const { data, error } = await supabase!
    .from("bookings")
    .insert([input])
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Booking;
}

async function getBookingsRemote(): Promise<Booking[]> {
  const { data, error } = await supabase!
    .from("bookings")
    .select("*")
    .order("submitted_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Booking[];
}

async function deleteBookingRemote(id: string): Promise<void> {
  const { error } = await supabase!.from("bookings").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

/* ─── localStorage fallback ────────────────────────────────────────────── */

const LS_KEY = "ishiftcargo_bookings";

function saveBookingLocal(input: BookingInput): Booking {
  const entry: Booking = {
    ...input,
    id: crypto.randomUUID(),
    submitted_at: new Date().toISOString(),
  };
  const existing = getBookingsLocal();
  localStorage.setItem(LS_KEY, JSON.stringify([entry, ...existing]));
  return entry;
}

function getBookingsLocal(): Booking[] {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) ?? "[]") as Booking[];
  } catch {
    return [];
  }
}

function deleteBookingLocal(id: string): void {
  const updated = getBookingsLocal().filter((b) => b.id !== id);
  localStorage.setItem(LS_KEY, JSON.stringify(updated));
}

/* ─── Public API (auto-selects Supabase or localStorage) ───────────────── */

export async function saveBooking(input: BookingInput): Promise<Booking> {
  if (isSupabaseConfigured) return saveBookingRemote(input);
  return saveBookingLocal(input);
}

export async function getBookings(): Promise<Booking[]> {
  if (isSupabaseConfigured) return getBookingsRemote();
  return getBookingsLocal();
}

export async function deleteBooking(id: string): Promise<void> {
  if (isSupabaseConfigured) return deleteBookingRemote(id);
  deleteBookingLocal(id);
}
