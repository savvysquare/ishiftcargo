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
  
  // Calgary -> Lagos detailed fields
  sender_address?: string;
  receiver_name?: string;
  receiver_address?: string;
  receiver_email?: string;
  receiver_phone?: string;
  electronics?: string;
  has_prohibited?: string;
  estimated_value?: string;
  delivery_mode?: string;
  delivery_address?: string;
  landmark?: string;

  // Tracking & Lifecycle management fields
  tracking_number?: string;
  status?: string;
  invoice_amount?: string;
  invoice_status?: string;
  invoice_notes?: string;
  current_location?: string;
  admin_notes?: string;
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

/* ─── Extra Operations for Admin Management & Tracking ───────────────── */

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function updateBookingRemote(id: string, updates: Partial<Booking>): Promise<Booking> {
  const { data, error } = await supabase!
    .from("bookings")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Booking;
}

function updateBookingLocal(id: string, updates: Partial<Booking>): Booking {
  const bookings = getBookingsLocal();
  const idx = bookings.findIndex((b) => b.id === id);
  if (idx === -1) throw new Error("Booking not found");
  const updated = { ...bookings[idx], ...updates };
  bookings[idx] = updated;
  localStorage.setItem(LS_KEY, JSON.stringify(bookings));
  return updated;
}

async function getBookingByTrackingNumberRemote(trackingNum: string): Promise<Booking | null> {
  const cleanNum = trackingNum.trim();
  if (uuidRegex.test(cleanNum)) {
    const { data } = await supabase!
      .from("bookings")
      .select("*")
      .eq("id", cleanNum)
      .maybeSingle();
    if (data) return data as Booking;
  }
  const { data, error } = await supabase!
    .from("bookings")
    .select("*")
    .eq("tracking_number", cleanNum.toUpperCase())
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data as Booking | null;
}

function getBookingByTrackingNumberLocal(trackingNum: string): Booking | null {
  const cleanNum = trackingNum.trim().toUpperCase();
  const bookings = getBookingsLocal();
  return (
    bookings.find(
      (b) => b.tracking_number?.toUpperCase() === cleanNum || b.id.toUpperCase() === cleanNum
    ) || null
  );
}

export async function updateBooking(id: string, updates: Partial<Booking>): Promise<Booking> {
  if (isSupabaseConfigured) return updateBookingRemote(id, updates);
  return updateBookingLocal(id, updates);
}

export async function getBookingByTrackingNumber(trackingNum: string): Promise<Booking | null> {
  if (isSupabaseConfigured) return getBookingByTrackingNumberRemote(trackingNum);
  return getBookingByTrackingNumberLocal(trackingNum);
}

