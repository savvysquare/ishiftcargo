-- Run this SQL in your Supabase Dashboard → SQL Editor
-- Project: iShiftCargo Bookings

create table if not exists public.bookings (
  id             uuid primary key default gen_random_uuid(),
  submitted_at   timestamptz not null default now(),
  name           text not null,
  email          text not null,
  phone          text not null,
  direction      text not null,
  service        text not null,
  weight         text,
  boxes          text,
  type           text,
  notes          text,
  location       text,
  preferred_date text,
  estimate       text
);

-- Enable Row Level Security
alter table public.bookings enable row level security;

-- Allow anonymous inserts (public booking form)
create policy "allow_insert"
  on public.bookings for insert
  to anon with check (true);

-- Allow anonymous selects (admin page has its own password gate)
create policy "allow_select"
  on public.bookings for select
  to anon using (true);

-- Allow anonymous deletes (guarded by password in the admin UI)
create policy "allow_delete"
  on public.bookings for delete
  to anon using (true);

-- Add support for detailed Calgary -> Lagos shipping form fields
alter table public.bookings
  add column if not exists sender_address text,
  add column if not exists receiver_name text,
  add column if not exists receiver_address text,
  add column if not exists receiver_email text,
  add column if not exists receiver_phone text,
  add column if not exists electronics text,
  add column if not exists has_prohibited text,
  add column if not exists estimated_value text,
  add column if not exists delivery_mode text,
  add column if not exists delivery_address text,
  add column if not exists landmark text,
  add column if not exists tracking_number text unique,
  add column if not exists status text not null default 'Pending',
  add column if not exists invoice_amount text,
  add column if not exists invoice_status text not null default 'Unpaid',
  add column if not exists invoice_notes text,
  add column if not exists current_location text,
  add column if not exists admin_notes text;

-- Allow anonymous updates (admin page has its own password gate)
create policy "allow_update"
  on public.bookings for update
  to anon using (true) with check (true);


