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

-- Migration: multi-service booking support.
-- Run this in the Supabase dashboard: SQL Editor > New query > paste > Run.
--
-- group_id links multiple bookings created from one booking-wizard
-- checkout together (one row per selected service, all sharing one
-- vehicle/date/time/contact and one Stripe Checkout Session).
-- stripe_session_id was previously unique per booking, but a multi-service
-- checkout shares one session id across all of its rows, so that
-- constraint is relaxed to a plain (non-unique) index.
alter table bookings add column if not exists group_id uuid;
create index if not exists bookings_group_id_idx on bookings (group_id);

alter table bookings drop constraint if exists bookings_stripe_session_id_key;
create index if not exists bookings_stripe_session_id_idx on bookings (stripe_session_id);
