-- FarmConnect core schema
-- Enum values match src/lib/mock-data.ts exactly so the UI does not need type changes.

create extension if not exists "pgcrypto";

-- ---------- Enums ----------
create type user_role       as enum ('farmer', 'fpo_coordinator', 'ops_admin');
create type listing_status  as enum ('Submitted', 'Active', 'Matched', 'Sold', 'Expired');
create type order_status    as enum ('Awaiting', 'Accepted', 'Scheduled', 'Collected');
create type payment_status  as enum ('Pending', 'Processing', 'Paid');
create type pickup_status   as enum ('Scheduled', 'Completed', 'Missed');
create type quality_result  as enum ('Accepted', 'Rejected', 'Downgraded');
create type issue_status    as enum ('Open', 'Resolved');
create type callback_status as enum ('Open', 'Contacted', 'Resolved');

-- ---------- FPOs ----------
create table fpos (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  region      text not null,
  created_at  timestamptz not null default now()
);

-- ---------- Profiles (1:1 with auth.users) ----------
create table profiles (
  id             uuid primary key references auth.users(id) on delete cascade,
  role           user_role not null default 'farmer',
  full_name      text not null,
  phone          text unique,
  village        text,
  upi_id         text,
  fpo_id         uuid references fpos(id) on delete set null,
  preferred_lang text default 'en',
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index idx_profiles_role  on profiles(role);
create index idx_profiles_fpo   on profiles(fpo_id);

alter table fpos
  add column coordinator_id uuid references profiles(id) on delete set null;

-- ---------- Listings (supply declarations) ----------
create table listings (
  id             uuid primary key default gen_random_uuid(),
  farmer_id      uuid not null references profiles(id) on delete cascade,
  fpo_id         uuid references fpos(id) on delete set null,
  crop           text not null,
  emoji          text,
  quantity       numeric(10,2) not null check (quantity > 0),
  unit           text not null default 'quintal',
  ready_date     date not null,
  submitted_date timestamptz not null default now(),
  village        text,
  photo_url      text,
  note           text,
  status         listing_status not null default 'Submitted',
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index idx_listings_farmer on listings(farmer_id);
create index idx_listings_fpo    on listings(fpo_id);
create index idx_listings_status on listings(status);

-- ---------- Orders (buyer commitments on a listing) ----------
create table orders (
  id               uuid primary key default gen_random_uuid(),
  listing_id       uuid not null references listings(id) on delete cascade,
  buyer_name       text,
  accepted_qty     numeric(10,2) not null check (accepted_qty > 0),
  unit             text not null default 'quintal',
  price_per_unit   numeric(10,2) not null check (price_per_unit > 0),
  expected_payout  numeric(12,2) generated always as (accepted_qty * price_per_unit) stored,
  pickup_date      date not null,
  pickup_slot      text,
  collection_point text,
  status           order_status not null default 'Awaiting',
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index idx_orders_listing on orders(listing_id);
create index idx_orders_status  on orders(status);

-- ---------- Pickups (dispatch + collection) ----------
create table pickups (
  id             uuid primary key default gen_random_uuid(),
  order_id       uuid not null unique references orders(id) on delete cascade,
  scheduled_date date not null,
  collected_qty  numeric(10,2),
  driver_note    text,
  status         pickup_status not null default 'Scheduled',
  completed_at   timestamptz,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- ---------- Payouts (money to farmer) ----------
create table payouts (
  id         uuid primary key default gen_random_uuid(),
  order_id   uuid not null unique references orders(id) on delete cascade,
  farmer_id  uuid not null references profiles(id) on delete cascade,
  amount     numeric(12,2) not null check (amount >= 0),
  status     payment_status not null default 'Pending',
  upi_ref    text,
  proof_url  text,
  paid_at    timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_payouts_farmer on payouts(farmer_id);
create index idx_payouts_status on payouts(status);

-- ---------- Quality history ----------
create table quality_history (
  id         uuid primary key default gen_random_uuid(),
  listing_id uuid not null references listings(id) on delete cascade,
  result     quality_result not null,
  reason     text,
  created_at timestamptz not null default now()
);
create index idx_quality_listing on quality_history(listing_id);

-- ---------- Issues (pickup/payout/quality problems) ----------
create table issues (
  id          uuid primary key default gen_random_uuid(),
  listing_id  uuid references listings(id) on delete set null,
  order_id    uuid references orders(id) on delete set null,
  raised_by   uuid references profiles(id) on delete set null,
  reason      text not null,
  note        text,
  status      issue_status not null default 'Open',
  created_at  timestamptz not null default now(),
  resolved_at timestamptz,
  constraint issue_scope_required check (listing_id is not null or order_id is not null)
);

-- ---------- Callback requests (farmer asks ops to call) ----------
create table callback_requests (
  id         uuid primary key default gen_random_uuid(),
  farmer_id  uuid not null references profiles(id) on delete cascade,
  context    text,
  status     callback_status not null default 'Open',
  created_at timestamptz not null default now()
);

-- ---------- updated_at trigger ----------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_profiles_ua before update on profiles
  for each row execute function public.set_updated_at();
create trigger trg_listings_ua before update on listings
  for each row execute function public.set_updated_at();
create trigger trg_orders_ua   before update on orders
  for each row execute function public.set_updated_at();
create trigger trg_pickups_ua  before update on pickups
  for each row execute function public.set_updated_at();
create trigger trg_payouts_ua  before update on payouts
  for each row execute function public.set_updated_at();

-- ---------- Auto-create profile on new auth user ----------
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, phone, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'New User'),
    new.phone,
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'farmer')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- Listing status auto-sync from order status ----------
create or replace function public.sync_listing_status()
returns trigger language plpgsql as $$
begin
  if new.status = 'Accepted' then
    update listings set status = 'Matched'
      where id = new.listing_id and status in ('Submitted','Active');
  elsif new.status = 'Collected' then
    update listings set status = 'Sold' where id = new.listing_id;
  end if;
  return new;
end;
$$;

create trigger trg_order_sync
  after insert or update of status on orders
  for each row execute function public.sync_listing_status();

-- ---------- Weekly summary view (per farmer, last 7 days) ----------
-- security_invoker makes the view respect the caller's RLS on underlying tables.
create view public.weekly_summary
with (security_invoker = true) as
select
  p.farmer_id,
  coalesce(sum(p.amount) filter (where p.status = 'Paid'), 0)                                   as paid_amount,
  coalesce(sum(p.amount) filter (where p.status in ('Pending','Processing')), 0)                as pending_amount,
  count(distinct pk.id) filter (where pk.status = 'Completed')                                   as pickups_completed,
  coalesce(sum(pk.collected_qty) filter (where pk.status = 'Completed'), 0)                      as total_qty_collected,
  coalesce(sum(p.amount), 0)                                                                     as total_earnings
from payouts p
left join orders o  on o.id  = p.order_id
left join pickups pk on pk.order_id = o.id
where p.created_at >= now() - interval '7 days'
group by p.farmer_id;

grant select on public.weekly_summary to authenticated;
