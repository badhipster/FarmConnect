# FarmConnect
## A mobile-first operator app for India's Farmer Producer Organisations

Turning a WhatsApp-and-notebook workflow into a verified, trackable, bilingual pipeline — from farmgate to payout.

Built with React, TypeScript, Tailwind, shadcn/ui, and Supabase.

---

## The problem

- 15,000+ FPOs in India aggregate produce for 5M+ smallholder farmers, but most coordinators still run operations on paper ledgers, WhatsApp groups, and call logs.
- A single coordinator tracks 150–400 farmers across 20–40 villages — listings, buyer matches, pickups, and payouts — with zero systems support.
- Farmers on the other side don't know where their lot is, whether it was matched, or when money will land.
- The result: delayed payouts, disputed quantities, lost buyer leads, and no data trail for grants, audits, or working-capital loans.

---

## Who it's for

**Farmer (smallholder)**
- Low digital literacy, first-time app user
- Needs: list produce, see status, get paid, speak their language

**FPO coordinator / manager**
- Power user, manages a network of farmers
- Needs: inventory at a glance, pipeline control, farmer directory, audit trail

One codebase. Two role-aware experiences. Shared data model.

---

## The solution

A single operator app with two tightly-scoped modes:

- **Farmer mode** — one-tap listing, pickup tracking, payment visibility, weekly earnings, bilingual (English / हिन्दी).
- **FPO coordinator mode** — market overview, pipeline Kanban, verified farmer directory, network-wide weekly summary, CSV export for every surface.

Every screen answers one question the user actually has — nothing more.

---

## Farmer experience

**Onboarding (bilingual)**
- Language pick → profile → crops → payout setup → done. 4 screens, no dead ends.

**Home**
- One CTA: "Add produce". Status cards for active listings, orders, payments.

**My listings & pickups**
- Timeline view: Listed → Matched → Confirmed → Picked up → Paid.

**Weekly summary**
- Total earnings, paid vs pending, quantity sold, crop breakdown.

**Support**
- Request-callback flow — no dead buttons, no chat-to-nowhere.

---

## FPO coordinator experience

Four operator surfaces, each built to replace a specific spreadsheet or WhatsApp chore.

1. **Market Overview dashboard** — inventory value, buyer leads, pending deliveries, action center.
2. **Pipeline Kanban** — 5-stage board with stage-advance flow, filters, CSV export.
3. **Verified Farmer Directory** — paginated searchable table with profile, call, and export.
4. **Network Summary** — earnings across all farmers, crop breakdown, stat tiles.

---

## Dashboard: Market Overview

- Three KPI cards: **Total inventory value**, **Active buyer leads**, **Pending deliveries** — all computed live from real listings/orders/payments.
- **Inventory Health** — top 4 crops by quantity with status indicator.
- **Action Center** — conditional alerts (matched review, pickups awaiting, payments processing). Renders only when there's a real signal — no fake badges.
- **Recent Marketplace Activity** — filterable table with row-level actions and CSV export.

Every number is derived, not mocked. Every button routes somewhere real.

---

## Pipeline: Operator-grade Kanban

**Stages:** Listed → Matched → Confirmed → Picked up → Paid

- Per-card **"Advance to {NextStage}"** button opens a bottom sheet with stage-specific fields (buyer + price, pickup date, etc.).
- **Filters:** crop, farmer, aged > 3 days, sort (newest / oldest / value).
- **Per-column menu:** collapse, export column as CSV.
- **Empty states** with the right CTA per column ("List a new lot" on Listed).

Built to survive Monday-morning triage for 200 active lots.

---

## Verified Farmer Directory

- Three KPI cards: **Total verified farmers**, **Active cultivators**, **Lifetime yield**.
- **Filter bar:** village, crop (derived from each farmer's listings), status, free-text search, reset, export CSV.
- **Directory table:** avatar identity, location, active-lot badge, yield tier, verification status, **tel: call link**, profile dialog.
- **Pagination:** 10 rows per page with "Showing X–Y of Z" footer.

Zero fake metrics. Zero unactionable buttons. Every row is one tap from a phone call or a profile card.

---

## Design system: Agri-Rural Professional

A scoped token system (`--ar-*`) applied to operator surfaces without disturbing farmer screens.

- **Palette:** forest-green primary, warm earth accents, high-contrast surfaces for outdoor daylight use.
- **Type:** sentence-case headings, no ALL-CAPS except chip labels.
- **Components:** `ar-card`, `ar-btn-primary`, `ar-btn-secondary`, `ar-input` — scoped via `.ar-scope` so the farmer experience stays untouched.
- **Motion:** only where it signals state change — no decorative animation.

Built from a Stitch reference, refined for WCAG AA contrast on low-end Android devices.

---

## Principles that shaped every screen

1. **Show it only if it's real.** No fake "+12%" growth tags, no "8 New" badges unless eight things are actually new.
2. **Every button goes somewhere.** Dead buttons were deleted, not stubbed.
3. **One question per screen.** Home answers "what's next?" Pipeline answers "what's moving?" Directory answers "who do I call?"
4. **Derive, don't duplicate.** Primary crop, status, yield tier are all computed — not a second source of truth.
5. **Bilingual from day one.** Not an afterthought — part of the data model.

---

## Tech stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS
- **UI primitives:** shadcn/ui (Radix under the hood)
- **State:** React hooks, TanStack Query, localStorage-backed sticky state
- **Backend:** Supabase (Postgres + Auth)
- **i18n:** lightweight dictionary-based EN/HI
- **Icons:** Lucide
- **Dates:** date-fns
- **Build:** production bundle 218 KB gzip, builds in under 2s

---

## Engineering highlights

- **Role-aware routing** — single `ScreenRouter` dispatches farmer vs FPO surfaces from one state tree.
- **Stage-advance handler** — declarative state transitions keep listing/order/payment records in lockstep.
- **Shared CSV exporter** — used by Dashboard activity, Pipeline columns, and Farmer directory.
- **`useStickyState`** — persists onboarding, role, and filter state across reloads.
- **Zero runtime TypeScript errors, zero lint warnings** on shipped code.

---

## What I owned

- Product framing: interviewed the workflow, mapped operator vs farmer jobs-to-be-done.
- Information architecture: named screens, defined navigation, eliminated dead ends.
- Design system: adapted Stitch "Agri-Rural Professional" into scoped Tailwind tokens.
- Engineering: every screen, every hook, every state transition.
- QA: built the product to pass its own "would a coordinator actually use this on a Tuesday morning?" test.

---

## Try it

- **Live app:** [insert Vercel / Netlify / Lovable URL]
- **Code:** [insert GitHub URL]
- **Design reference:** Stitch "Agri-Rural Professional"

Demo logins for both roles included on the sign-in screen.

---

## Let's talk

If you're building for Bharat — FPOs, agri-fintech, rural commerce, operator tooling — I'd love to compare notes.

**Abhishek Ranjan**
arjha97@gmail.com · [LinkedIn URL]

---

## Appendix: screens shipped

- Sign in · Language select · Onboarding profile · FPO onboarding · Payout setup · Onboarding complete
- Home (farmer) · Market Overview dashboard (FPO)
- Add produce · Edit produce · My listings · Pipeline Kanban · Listing detail
- Orders · Order confirmation · Pickup status · Payment tracking
- Weekly summary · Network summary · Verified Farmer Directory · Add farmer
- Support · More · Language switcher
