-- FarmConnect storage buckets
-- crop-photos:   public-read (so farmers can share photos in WhatsApp/UI without signed URLs)
-- payout-proofs: private (only owner farmer + ops_admin can read)

insert into storage.buckets (id, name, public)
values ('crop-photos', 'crop-photos', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('payout-proofs', 'payout-proofs', false)
on conflict (id) do nothing;

-- Convention: object path starts with the farmer's uid, e.g. "<uid>/listing-123.jpg"
-- This lets us scope writes to the owning user without extra metadata.

-- ---------- crop-photos ----------
create policy "crop_photos_public_read" on storage.objects
  for select using (bucket_id = 'crop-photos');

create policy "crop_photos_owner_insert" on storage.objects
  for insert to authenticated with check (
    bucket_id = 'crop-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "crop_photos_owner_update" on storage.objects
  for update to authenticated using (
    bucket_id = 'crop-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "crop_photos_owner_delete" on storage.objects
  for delete to authenticated using (
    bucket_id = 'crop-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- ---------- payout-proofs ----------
create policy "payout_proofs_admin_write" on storage.objects
  for insert to authenticated with check (
    bucket_id = 'payout-proofs' and public.is_admin()
  );

create policy "payout_proofs_admin_update" on storage.objects
  for update to authenticated using (
    bucket_id = 'payout-proofs' and public.is_admin()
  );

create policy "payout_proofs_owner_or_admin_read" on storage.objects
  for select to authenticated using (
    bucket_id = 'payout-proofs'
    and (
      public.is_admin()
      or (storage.foldername(name))[1] = auth.uid()::text
    )
  );
