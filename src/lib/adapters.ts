// Convert DB rows (snake_case) into the camelCase shapes the UI already uses.
// Lets us swap mock-data -> Supabase without touching every screen.

import type { Listing, Order, Payment } from "./mock-data";
import type {
  ListingRow,
  OrderRow,
  PayoutRow,
} from "./database.types";

const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });

export function toListing(row: ListingRow): Listing {
  return {
    id: row.id,
    crop: row.crop,
    emoji: row.emoji ?? "🌱",
    quantity: Number(row.quantity),
    unit: row.unit,
    readyDate: shortDate(row.ready_date),
    submittedDate: shortDate(row.submitted_date),
    village: row.village ?? "",
    status: row.status,
    note: row.note ?? undefined,
  };
}

// OrderRow joined with a listing for crop/emoji display.
export function toOrder(
  row: OrderRow & { listing?: { crop: string; emoji: string | null } | null }
): Order {
  return {
    id: row.id,
    listingId: row.listing_id,
    crop: row.listing?.crop ?? "",
    emoji: row.listing?.emoji ?? "🌱",
    acceptedQty: Number(row.accepted_qty),
    unit: row.unit,
    pickupDate: shortDate(row.pickup_date),
    pickupSlot: row.pickup_slot ?? "",
    collectionPoint: row.collection_point ?? "",
    expectedPayout: Number(row.expected_payout),
    status: row.status,
  };
}

export function toPayment(
  row: PayoutRow & { order?: { listing?: { crop: string } | null } | null }
): Payment {
  return {
    id: row.id,
    orderId: row.order_id,
    crop: row.order?.listing?.crop ?? "",
    amount: Number(row.amount),
    status: row.status,
    upiRef: row.upi_ref ?? undefined,
    timestamp: row.paid_at
      ? shortDate(row.paid_at)
      : shortDate(row.created_at),
  };
}
