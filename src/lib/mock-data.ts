export type ListingStatus = "Submitted" | "Active" | "Matched" | "Sold" | "Expired";
export type OrderStatus = "Awaiting" | "Accepted" | "Scheduled" | "Collected";
export type PaymentStatus = "Pending" | "Processing" | "Paid";

export interface Listing {
  id: string;
  crop: string;
  emoji: string;
  quantity: number;
  unit: string;
  readyDate: string;
  submittedDate: string;
  village: string;
  status: ListingStatus;
  note?: string;
}

export interface Order {
  id: string;
  listingId: string;
  crop: string;
  emoji: string;
  acceptedQty: number;
  unit: string;
  pickupDate: string;
  pickupSlot: string;
  collectionPoint: string;
  expectedPayout: number;
  status: OrderStatus;
}

export interface Payment {
  id: string;
  orderId: string;
  crop: string;
  amount: number;
  status: PaymentStatus;
  upiRef?: string;
  timestamp: string;
}

export interface WeeklyStats {
  totalQty: number;
  totalEarnings: number;
  paid: number;
  pending: number;
  pickupsCompleted: number;
  breakdown: { crop: string; qty: number; amount: number }[];
}

export const farmer = {
  name: "Ramesh",
  village: "Bharwari, Prayagraj",
  phone: "+91 98XXX 12345",
};

export const initialListings: Listing[] = [
  {
    id: "L-1042",
    crop: "Wheat",
    emoji: "🌾",
    quantity: 8,
    unit: "quintal",
    readyDate: "24 Apr",
    submittedDate: "19 Apr",
    village: farmer.village,
    status: "Matched",
  },
  {
    id: "L-1041",
    crop: "Tomato",
    emoji: "🍅",
    quantity: 120,
    unit: "kg",
    readyDate: "22 Apr",
    submittedDate: "18 Apr",
    village: farmer.village,
    status: "Active",
  },
  {
    id: "L-1038",
    crop: "Mustard",
    emoji: "🌼",
    quantity: 4,
    unit: "quintal",
    readyDate: "12 Apr",
    submittedDate: "08 Apr",
    village: farmer.village,
    status: "Sold",
  },
];

export const initialOrders: Order[] = [
  {
    id: "O-5571",
    listingId: "L-1042",
    crop: "Wheat",
    emoji: "🌾",
    acceptedQty: 8,
    unit: "quintal",
    pickupDate: "Tomorrow, 24 Apr",
    pickupSlot: "10:00 AM – 12:00 PM",
    collectionPoint: "Bharwari Mandi Gate 2",
    expectedPayout: 18400,
    status: "Awaiting",
  },
  {
    id: "O-5562",
    listingId: "L-1038",
    crop: "Mustard",
    emoji: "🌼",
    acceptedQty: 4,
    unit: "quintal",
    pickupDate: "14 Apr",
    pickupSlot: "9:00 AM – 11:00 AM",
    collectionPoint: "Bharwari Mandi Gate 2",
    expectedPayout: 21600,
    status: "Collected",
  },
];

export const initialPayments: Payment[] = [
  {
    id: "P-9921",
    orderId: "O-5562",
    crop: "Mustard",
    amount: 21600,
    status: "Paid",
    upiRef: "UPI/412847291",
    timestamp: "15 Apr, 4:12 PM",
  },
  {
    id: "P-9918",
    orderId: "O-5548",
    crop: "Paddy",
    amount: 12750,
    status: "Processing",
    timestamp: "19 Apr, 11:05 AM",
  },
];

export const weeklyStats: WeeklyStats = {
  totalQty: 12,
  totalEarnings: 34350,
  paid: 21600,
  pending: 12750,
  pickupsCompleted: 2,
  breakdown: [
    { crop: "Mustard", qty: 4, amount: 21600 },
    { crop: "Paddy", qty: 8, amount: 12750 },
  ],
};

export const cropOptions = [
  { name: "Wheat", emoji: "🌾" },
  { name: "Paddy", emoji: "🌾" },
  { name: "Tomato", emoji: "🍅" },
  { name: "Onion", emoji: "🧅" },
  { name: "Potato", emoji: "🥔" },
  { name: "Mustard", emoji: "🌼" },
  { name: "Maize", emoji: "🌽" },
];
