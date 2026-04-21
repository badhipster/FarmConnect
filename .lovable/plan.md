

# FarmConnect — Farmer-First Mobile Prototype

## Summary
Build a mobile-first, WhatsApp-like React prototype with 9 screens for a smallholder farmer (Ramesh) to submit produce, track pickups, and see payment proof. All data is mocked in-memory. No backend, no admin, no buyer views.

## Design System

**Palette** (added to CSS variables):
- Primary: earthy green (`142 52% 36%`) — trust, agri
- Background: warm cream (`40 33% 97%`)
- Status colors: Amber (pending), Blue (processing), Green (paid/active), Red (expired/rejected)
- Cards: white with subtle shadow, rounded-xl

**Typography**: System sans-serif, large (16-18px body), bold status labels. Hindi-flavored English copy ("Namaste, Ramesh").

**Layout**: Mobile frame (max-w-md, centered) on desktop. Bottom tab navigation (Home, Listings, Payments, More). Top header with greeting. Large touch targets (min 48px).

## Files to Create/Edit

### 1. Design tokens
- **`src/index.css`** — Add FarmConnect color variables (farm-green, farm-cream, status colors)
- **`tailwind.config.ts`** — Extend with farm-* color tokens

### 2. Data & Types
- **`src/lib/mock-data.ts`** — Sample listings, orders, payments, weekly summary. Typed interfaces for Listing, Order, Payment, WeeklyStats.

### 3. Navigation Shell
- **`src/components/BottomNav.tsx`** — 4-tab bottom bar (Home, Listings, Payments, More)
- **`src/components/AppHeader.tsx`** — Top bar with greeting or screen title + back button

### 4. Screens (all in `src/components/screens/`)

| Screen | File | Purpose |
|--------|------|---------|
| Home | `HomeScreen.tsx` | Greeting, 3-stat strip, "+ Add Produce" CTA, quick-access cards |
| Add Produce | `AddProduceScreen.tsx` | Simple form: crop chips, qty, unit, ready date, village (prefilled), photo placeholder, note, submit button, success state |
| My Listings | `MyListingsScreen.tsx` | Stack of listing cards with crop, qty, date, status pill |
| Listing Detail | `ListingDetailScreen.tsx` | Single listing expanded: full info, status timeline, "Request Callback" link |
| Order Confirmation | `OrderConfirmationScreen.tsx` | Matched order card: crop, accepted qty, pickup date/slot/location, expected payout, Accept / Need Help buttons |
| Pickup Status | `PickupStatusScreen.tsx` | Order timeline: Accepted → Scheduled → Collected, next step message |
| Payment Tracking | `PaymentTrackingScreen.tsx` | Payout cards per order: amount, status pill, UPI ref, timestamp, help link |
| Weekly Summary | `WeeklySummaryScreen.tsx` | This week: total qty, earnings, paid, pending, pickups count |
| Support | `SupportScreen.tsx` | Request callback form: issue type, phone (prefilled), note, submit |

### 5. Shared Components (`src/components/`)
- **`StatusPill.tsx`** — Colored pill for Submitted/Active/Matched/Sold/Expired/Pending/Processing/Paid
- **`SummaryCard.tsx`** — Reusable stat card (icon, label, value)
- **`ProduceCard.tsx`** — Listing card used in My Listings

### 6. Main Page
- **`src/pages/Index.tsx`** — Replace placeholder. Renders mobile shell with state-driven screen navigation (useState for current screen). No router changes needed.

### 7. Cleanup
- **`src/App.css`** — Clear default Vite styles

## Prototype Behavior
- All mock data seeded on mount
- Adding produce creates a new "Submitted" listing; auto-advances to "Active" after 2s, then "Matched" after 4s (demo timer)
- Accepting an order advances pickup and payment states on timers
- No persistent storage — refresh resets

## Not Included
No auth, no real API, no FPO group view, no AI pricing, no complex dashboards, no buyer/admin screens.

