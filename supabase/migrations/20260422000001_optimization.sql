-- =====================================================================
-- FarmConnect: Agency Optimization (Backend)
-- Goal: Strip FPO logic and optimize indexes for Farmer Marketplace
-- =====================================================================

-- 1. Drop FPO-related tables and columns
BEGIN;

-- Drop dependent policies first (from schema.sql and rls.sql)
DROP POLICY IF EXISTS "profiles_fpo_reads_members" ON profiles;
DROP POLICY IF EXISTS "listings_fpo_scope_read" ON listings;
DROP POLICY IF EXISTS "listings_fpo_insert" ON listings;
DROP POLICY IF EXISTS "orders_fpo_read_via_listing" ON orders;
DROP POLICY IF EXISTS "pickups_fpo_read" ON pickups;
DROP POLICY IF EXISTS "payouts_fpo_scope_read" ON payouts;
DROP POLICY IF EXISTS "quality_fpo_read" ON quality_history;
DROP POLICY IF EXISTS "issues_fpo_read_scope" ON issues;

-- Drop FPO-related columns
ALTER TABLE profiles DROP COLUMN IF EXISTS fpo_id;
ALTER TABLE listings DROP COLUMN IF EXISTS fpo_id;

-- Drop FPOs table
DROP TABLE IF EXISTS fpos CASCADE;

-- Drop helper functions
DROP FUNCTION IF EXISTS current_user_fpo();
DROP FUNCTION IF EXISTS is_fpo_coordinator();

-- 2. Performance Indexing
CREATE INDEX IF NOT EXISTS idx_listings_farmer_status ON listings(farmer_id, status);
CREATE INDEX IF NOT EXISTS idx_orders_listing ON orders(listing_id);
CREATE INDEX IF NOT EXISTS idx_payouts_farmer ON payouts(farmer_id);
CREATE INDEX IF NOT EXISTS idx_profiles_village ON profiles(village);

-- 3. Simplify Payouts RLS (Farmer only)
DROP POLICY IF EXISTS "payouts_farmer_read_own" ON payouts;
CREATE POLICY "payouts_farmer_read_own" ON payouts
    FOR SELECT USING (farmer_id = auth.uid());

COMMIT;
