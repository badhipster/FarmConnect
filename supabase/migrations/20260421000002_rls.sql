-- FarmConnect Row Level Security
-- Roles:
--   farmer           - owns their own listings/orders/pickups/payouts
--   fpo_coordinator  - sees all rows scoped to their FPO
--   ops_admin        - full access (operations dashboard)

-- ---------- Helper functions (public schema so they show up in PostgREST) ----------
create or replace function public.current_user_role()
returns user_role language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.current_user_fpo()
returns uuid language sql stable security definer set search_path = public as $$
  select fpo_id from public.profiles where id = auth.uid();
$$;

create or replace function public.is_admin()
returns boolean language sql stable as $$
  select public.current_user_role() = 'ops_admin';
$$;

create or replace function public.is_fpo_coordinator()
returns boolean language sql stable as $$
  select public.current_user_role() = 'fpo_coordinator';
$$;

-- ---------- Enable RLS on every table ----------
alter table profiles           enable row level security;
alter table fpos               enable row level security;
alter table listings           enable row level security;
alter table orders             enable row level security;
alter table pickups            enable row level security;
alter table payouts            enable row level security;
alter table quality_history    enable row level security;
alter table issues             enable row level security;
alter table callback_requests  enable row level security;

-- =====================================================================
-- profiles
-- =====================================================================
create policy "profiles_self_read" on profiles
  for select using (id = auth.uid());

create policy "profiles_fpo_reads_members" on profiles
  for select using (
    public.is_fpo_coordinator() and fpo_id = public.current_user_fpo()
  );

create policy "profiles_admin_read" on profiles
  for select using (public.is_admin());

create policy "profiles_self_update" on profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

create policy "profiles_admin_write" on profiles
  for all using (public.is_admin()) with check (public.is_admin());

-- =====================================================================
-- fpos (read-mostly; directory of FPOs is not sensitive)
-- =====================================================================
create policy "fpos_authenticated_read" on fpos
  for select to authenticated using (true);

create policy "fpos_admin_write" on fpos
  for all using (public.is_admin()) with check (public.is_admin());

-- =====================================================================
-- listings
-- =====================================================================
create policy "listings_farmer_read_own" on listings
  for select using (farmer_id = auth.uid());

create policy "listings_fpo_scope_read" on listings
  for select using (
    public.is_fpo_coordinator() and fpo_id = public.current_user_fpo()
  );

create policy "listings_admin_read" on listings
  for select using (public.is_admin());

create policy "listings_farmer_insert" on listings
  for insert with check (farmer_id = auth.uid());

create policy "listings_fpo_insert" on listings
  for insert with check (
    public.is_fpo_coordinator() and fpo_id = public.current_user_fpo()
  );

-- Farmers can only edit a listing while it is still 'Submitted' (pre-matching).
create policy "listings_farmer_update_submitted" on listings
  for update using (farmer_id = auth.uid() and status = 'Submitted')
  with check (farmer_id = auth.uid());

create policy "listings_admin_write" on listings
  for all using (public.is_admin()) with check (public.is_admin());

-- =====================================================================
-- orders
-- =====================================================================
create policy "orders_farmer_read_via_listing" on orders
  for select using (
    exists (
      select 1 from listings l
      where l.id = orders.listing_id and l.farmer_id = auth.uid()
    )
  );

create policy "orders_fpo_read_via_listing" on orders
  for select using (
    public.is_fpo_coordinator()
    and exists (
      select 1 from listings l
      where l.id = orders.listing_id and l.fpo_id = public.current_user_fpo()
    )
  );

create policy "orders_admin_read" on orders
  for select using (public.is_admin());

-- Farmer can move an order from Awaiting -> Accepted/Awaiting (i.e. accept/reject-pending).
-- Ops still owns Scheduled/Collected transitions via the admin policy.
create policy "orders_farmer_accept" on orders
  for update using (
    exists (
      select 1 from listings l
      where l.id = orders.listing_id and l.farmer_id = auth.uid()
    )
  ) with check (
    status in ('Accepted','Awaiting')
  );

create policy "orders_admin_write" on orders
  for all using (public.is_admin()) with check (public.is_admin());

-- =====================================================================
-- pickups
-- =====================================================================
create policy "pickups_farmer_read" on pickups
  for select using (
    exists (
      select 1 from orders o
      join listings l on l.id = o.listing_id
      where o.id = pickups.order_id and l.farmer_id = auth.uid()
    )
  );

create policy "pickups_fpo_read" on pickups
  for select using (
    public.is_fpo_coordinator()
    and exists (
      select 1 from orders o
      join listings l on l.id = o.listing_id
      where o.id = pickups.order_id and l.fpo_id = public.current_user_fpo()
    )
  );

create policy "pickups_admin_all" on pickups
  for all using (public.is_admin()) with check (public.is_admin());

-- =====================================================================
-- payouts
-- =====================================================================
create policy "payouts_farmer_read_own" on payouts
  for select using (farmer_id = auth.uid());

create policy "payouts_fpo_scope_read" on payouts
  for select using (
    public.is_fpo_coordinator()
    and exists (
      select 1 from profiles p
      where p.id = payouts.farmer_id and p.fpo_id = public.current_user_fpo()
    )
  );

create policy "payouts_admin_all" on payouts
  for all using (public.is_admin()) with check (public.is_admin());

-- =====================================================================
-- quality_history
-- =====================================================================
create policy "quality_farmer_read_via_listing" on quality_history
  for select using (
    exists (
      select 1 from listings l
      where l.id = quality_history.listing_id and l.farmer_id = auth.uid()
    )
  );

create policy "quality_fpo_read" on quality_history
  for select using (
    public.is_fpo_coordinator()
    and exists (
      select 1 from listings l
      where l.id = quality_history.listing_id and l.fpo_id = public.current_user_fpo()
    )
  );

create policy "quality_admin_all" on quality_history
  for all using (public.is_admin()) with check (public.is_admin());

-- =====================================================================
-- issues
-- =====================================================================
create policy "issues_farmer_read_own" on issues
  for select using (raised_by = auth.uid());

create policy "issues_farmer_create" on issues
  for insert with check (raised_by = auth.uid());

create policy "issues_fpo_read_scope" on issues
  for select using (
    public.is_fpo_coordinator() and (
      exists (
        select 1 from listings l
        where l.id = issues.listing_id and l.fpo_id = public.current_user_fpo()
      )
      or exists (
        select 1 from orders o
        join listings l on l.id = o.listing_id
        where o.id = issues.order_id and l.fpo_id = public.current_user_fpo()
      )
    )
  );

create policy "issues_admin_all" on issues
  for all using (public.is_admin()) with check (public.is_admin());

-- =====================================================================
-- callback_requests
-- =====================================================================
create policy "callbacks_farmer_read_own" on callback_requests
  for select using (farmer_id = auth.uid());

create policy "callbacks_farmer_create" on callback_requests
  for insert with check (farmer_id = auth.uid());

create policy "callbacks_admin_all" on callback_requests
  for all using (public.is_admin()) with check (public.is_admin());
