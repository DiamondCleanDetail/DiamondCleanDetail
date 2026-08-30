-- Gift-card redemption storage. Run this once in the Supabase SQL editor
-- (Dashboard → SQL Editor → New query → paste → Run). Until it exists, gift
-- redemption is simply unavailable and bookings work exactly as before —
-- nothing else breaks.
--
-- The service-role key the app uses bypasses RLS, and this table is only ever
-- touched server-side, so no RLS policies are needed.

create table if not exists public.gift_cards (
  code               text primary key,
  initial_cents      integer not null,
  balance_cents      integer not null check (balance_cents >= 0),
  currency           text    not null default 'usd',
  status             text    not null default 'active',   -- active | depleted | void
  stripe_session_id  text,                                -- the shop purchase that created it
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

-- Atomic redeem: subtract the amount only if the card is active and has enough
-- balance. Returns the new balance, or NULL when it couldn't be applied (which
-- the app treats as "the balance changed — don't give the discount"). Doing it
-- in one statement is what stops two requests double-spending the same card.
create or replace function public.redeem_gift_card(p_code text, p_amount integer)
returns integer
language plpgsql
as $$
declare
  new_balance integer;
begin
  update public.gift_cards
     set balance_cents = balance_cents - p_amount,
         status        = case when balance_cents - p_amount <= 0 then 'depleted' else 'active' end,
         updated_at    = now()
   where code = p_code
     and status = 'active'
     and balance_cents >= p_amount
  returning balance_cents into new_balance;

  return new_balance; -- NULL when no row matched
end;
$$;
