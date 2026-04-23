// Hand-curated to mirror supabase/migrations/*_schema.sql.
// Regenerate any time with:
//   bunx supabase gen types typescript --linked > src/lib/database.types.ts

export type UserRole = "farmer" | "fpo_coordinator" | "ops_admin";
export type ListingStatus = "Submitted" | "Active" | "Matched" | "Sold" | "Expired";
export type OrderStatus = "Awaiting" | "Accepted" | "Scheduled" | "Collected";
export type PaymentStatus = "Pending" | "Processing" | "Paid";
export type PickupStatusValue = "Scheduled" | "Completed" | "Missed";
export type QualityResult = "Accepted" | "Rejected" | "Downgraded";
export type IssueStatus = "Open" | "Resolved";
export type CallbackStatusValue = "Open" | "Contacted" | "Resolved";

export interface ProfileRow {
  id: string;
  role: UserRole;
  full_name: string;
  phone: string | null;
  village: string | null;
  upi_id: string | null;
  fpo_id: string | null;
  preferred_lang: string | null;
  bank_account_number: string | null;
  bank_ifsc: string | null;
  bank_account_holder: string | null;
  created_at: string;
  updated_at: string;
}

export interface FpoRow {
  id: string;
  name: string;
  region: string;
  coordinator_id: string | null;
  created_at: string;
}

export interface ListingRow {
  id: string;
  farmer_id: string;
  fpo_id: string | null;
  crop: string;
  emoji: string | null;
  quantity: number;
  unit: string;
  ready_date: string;
  submitted_date: string;
  village: string | null;
  photo_url: string | null;
  note: string | null;
  status: ListingStatus;
  created_at: string;
  updated_at: string;
}

export type ListingInsert = {
  farmer_id: string;
  crop: string;
  quantity: number;
  ready_date: string;
  fpo_id?: string | null;
  emoji?: string | null;
  unit?: string;
  village?: string | null;
  photo_url?: string | null;
  note?: string | null;
  status?: ListingStatus;
};

export interface OrderRow {
  id: string;
  listing_id: string;
  buyer_name: string | null;
  accepted_qty: number;
  unit: string;
  price_per_unit: number;
  expected_payout: number;
  pickup_date: string;
  pickup_slot: string | null;
  collection_point: string | null;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
}

export type OrderInsert = Omit<OrderRow, "id" | "expected_payout" | "created_at" | "updated_at">;

export interface PickupRow {
  id: string;
  order_id: string;
  scheduled_date: string;
  collected_qty: number | null;
  driver_note: string | null;
  status: PickupStatusValue;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PayoutRow {
  id: string;
  order_id: string;
  farmer_id: string;
  amount: number;
  status: PaymentStatus;
  upi_ref: string | null;
  proof_url: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface WeeklySummaryRow {
  farmer_id: string;
  paid_amount: number;
  pending_amount: number;
  pickups_completed: number;
  total_qty_collected: number;
  total_earnings: number;
}

export interface CallbackRequestRow {
  id: string;
  farmer_id: string;
  context: string | null;
  status: CallbackStatusValue;
  created_at: string;
}

export type CallbackInsert = {
  farmer_id: string;
  context?: string | null;
};

export interface IssueRow {
  id: string;
  listing_id: string | null;
  order_id: string | null;
  raised_by: string | null;
  reason: string;
  note: string | null;
  status: IssueStatus;
  created_at: string;
  resolved_at: string | null;
}

export interface Database {
  public: {
    Tables: {
      profiles: { Row: ProfileRow; Insert: Partial<ProfileRow> & { id: string; full_name: string }; Update: Partial<ProfileRow> };
      fpos: { Row: FpoRow; Insert: Omit<FpoRow, "id" | "created_at">; Update: Partial<FpoRow> };
      listings: { Row: ListingRow; Insert: ListingInsert; Update: Partial<ListingRow> };
      orders: { Row: OrderRow; Insert: OrderInsert; Update: Partial<OrderRow> };
      pickups: { Row: PickupRow; Insert: Omit<PickupRow, "id" | "created_at" | "updated_at">; Update: Partial<PickupRow> };
      payouts: { Row: PayoutRow; Insert: Omit<PayoutRow, "id" | "created_at" | "updated_at">; Update: Partial<PayoutRow> };
      callback_requests: { Row: CallbackRequestRow; Insert: CallbackInsert; Update: Partial<CallbackRequestRow> };
      issues: { Row: IssueRow; Insert: Omit<IssueRow, "id" | "created_at" | "resolved_at">; Update: Partial<IssueRow> };
    };
    Views: {
      weekly_summary: { Row: WeeklySummaryRow };
    };
  };
}
