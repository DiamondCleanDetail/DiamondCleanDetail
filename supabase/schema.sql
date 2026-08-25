-- Run this in the Supabase dashboard: SQL Editor > New query > paste > Run.

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  service_slug text not null,
  package_slug text not null,
  vehicle_size text not null,
  vehicle_info text not null,

  customer_name text not null,
  customer_phone text not null,
  customer_email text,

  booking_date date not null,
  booking_time text not null,

  price_cents integer not null,
  deposit_cents integer not null default 0,

  status text not null default 'pending'
    check (status in ('pending', 'paid', 'cancelled')),

  stripe_session_id text unique
);

create index if not exists bookings_date_idx on bookings (booking_date);
create index if not exists bookings_status_idx on bookings (status);

-- RLS is enabled with no public policies — all reads/writes go through
-- server-side API routes using the service_role key, which bypasses RLS.
-- This keeps customer data (name/phone/email) inaccessible to the public
-- anon key entirely.
alter table bookings enable row level security;
