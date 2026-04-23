export type ListingStatus = "Submitted" | "Active" | "Matched" | "Sold" | "Expired";
export type OrderStatus = "Awaiting" | "Accepted" | "Scheduled" | "Collected";
export type PaymentStatus = "Pending" | "Processing" | "Paid";
export type FarmerStatus = "Active" | "Inactive" | "New";

export interface Farmer {
  id: string;
  name: string;
  village: string;
  phone: string;
  activeLots: number;
  totalSold: number;
  status: FarmerStatus;
}

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
  farmerName?: string;
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
  farmerName?: string;
}

export interface Payment {
  id: string;
  orderId: string;
  crop: string;
  amount: number;
  status: PaymentStatus;
  upiRef?: string;
  timestamp: string;
  farmerName?: string;
}

export interface WeeklyStats {
  totalQty: number;
  totalEarnings: number;
  paid: number;
  pending: number;
  pickupsCompleted: number;
  breakdown: { crop: string; qty: number; amount: number }[];
}


export const initialListings: Listing[] = [
  {
    id: "L-1042",
    crop: "Wheat",
    emoji: "🌾",
    quantity: 8,
    unit: "quintal",
    readyDate: "24 Apr",
    submittedDate: "19 Apr",
    village: "Bharwari, Prayagraj",
    status: "Matched",
    farmerName: "Ramesh Kumar",
  },
  {
    id: "L-1041",
    crop: "Tomato",
    emoji: "🍅",
    quantity: 120,
    unit: "kg",
    readyDate: "22 Apr",
    submittedDate: "18 Apr",
    village: "Bharwari, Prayagraj",
    status: "Active",
    farmerName: "Kamala Devi",
  },
  {
    id: "L-1038",
    crop: "Mustard",
    emoji: "🌼",
    quantity: 4,
    unit: "quintal",
    readyDate: "12 Apr",
    submittedDate: "08 Apr",
    village: "Bharwari, Prayagraj",
    status: "Sold",
    farmerName: "Anil Patel",
  },
  {
    id: "L-1031",
    crop: "Paddy",
    emoji: "🌾",
    quantity: 8,
    unit: "quintal",
    readyDate: "18 Apr",
    submittedDate: "14 Apr",
    village: "Bharwari, Prayagraj",
    status: "Sold",
    farmerName: "Suresh Singh",
  },
  {
    id: "L-1025",
    crop: "Onion",
    emoji: "🧅",
    quantity: 500,
    unit: "kg",
    readyDate: "25 Apr",
    submittedDate: "20 Apr",
    village: "Saidabad, Prayagraj",
    status: "Active",
    farmerName: "Preeti Devi",
  },
  {
    id: "L-1024",
    crop: "Potato",
    emoji: "🥔",
    quantity: 20,
    unit: "quintal",
    readyDate: "26 Apr",
    submittedDate: "21 Apr",
    village: "Bharwari, Prayagraj",
    status: "Submitted",
    farmerName: "Ramesh Kumar",
  },
  {
    id: "L-1022",
    crop: "Maize",
    emoji: "🌽",
    quantity: 15,
    unit: "quintal",
    readyDate: "28 Apr",
    submittedDate: "22 Apr",
    village: "Anupganj, Prayagraj",
    status: "Active",
    farmerName: "Vikram Shah",
  },
  {
    id: "L-1020",
    crop: "Sugarcane",
    emoji: "🎋",
    quantity: 100,
    unit: "quintal",
    readyDate: "30 Apr",
    submittedDate: "22 Apr",
    village: "Saidabad, Prayagraj",
    status: "Submitted",
    farmerName: "Kamala Devi",
  },
  {
    id: "L-1018",
    crop: "Wheat",
    emoji: "🌾",
    quantity: 12,
    unit: "quintal",
    readyDate: "15 Apr",
    submittedDate: "10 Apr",
    village: "Bharwari, Prayagraj",
    status: "Sold",
    farmerName: "Suresh Singh",
  },
  {
    id: "L-1015",
    crop: "Tomato",
    emoji: "🍅",
    quantity: 80,
    unit: "kg",
    readyDate: "18 Apr",
    submittedDate: "12 Apr",
    village: "Bharwari, Prayagraj",
    status: "Sold",
    farmerName: "Anil Patel",
  },
  {
    id: "L-1012",
    crop: "Mustard",
    emoji: "🌼",
    quantity: 6,
    unit: "quintal",
    readyDate: "10 Apr",
    submittedDate: "05 Apr",
    village: "Saidabad, Prayagraj",
    status: "Sold",
    farmerName: "Preeti Devi",
  },
  {
    id: "L-1010",
    crop: "Paddy",
    emoji: "🌾",
    quantity: 10,
    unit: "quintal",
    readyDate: "28 Apr",
    submittedDate: "20 Apr",
    village: "Bharwari, Prayagraj",
    status: "Matched",
    farmerName: "Ramesh Kumar",
  },
  {
    id: "L-1043",
    crop: "Onion",
    emoji: "🧅",
    quantity: 300,
    unit: "kg",
    readyDate: "05 May",
    submittedDate: "20 Apr",
    village: "Bharwari, Prayagraj",
    status: "Active",
    farmerName: "Ramesh Kumar",
  },
  {
    id: "L-1044",
    crop: "Tomato",
    emoji: "🍅",
    quantity: 150,
    unit: "kg",
    readyDate: "08 May",
    submittedDate: "21 Apr",
    village: "Bharwari, Prayagraj",
    status: "Submitted",
    farmerName: "Ramesh Kumar",
  },
  {
    id: "L-1045",
    crop: "Potato",
    emoji: "🥔",
    quantity: 50,
    unit: "quintal",
    readyDate: "10 Apr",
    submittedDate: "05 Apr",
    village: "Bharwari, Prayagraj",
    status: "Sold",
    farmerName: "Ramesh Kumar",
  },
  {
    id: "L-1046",
    crop: "Wheat",
    emoji: "🌾",
    quantity: 25,
    unit: "quintal",
    readyDate: "29 Apr",
    submittedDate: "23 Apr",
    village: "Anupganj, Prayagraj",
    status: "Matched",
    farmerName: "Vikram Shah",
  },
  {
    id: "L-1047",
    crop: "Maize",
    emoji: "🌽",
    quantity: 10,
    unit: "quintal",
    readyDate: "02 May",
    submittedDate: "24 Apr",
    village: "Anupganj, Prayagraj",
    status: "Active",
    farmerName: "Vikram Shah",
  },
  {
    id: "L-1048",
    crop: "Paddy",
    emoji: "🌾",
    quantity: 15,
    unit: "quintal",
    readyDate: "15 Apr",
    submittedDate: "10 Apr",
    village: "Anupganj, Prayagraj",
    status: "Sold",
    farmerName: "Vikram Shah",
  },
  {
    id: "L-1049",
    crop: "Sugarcane",
    emoji: "🎋",
    quantity: 200,
    unit: "quintal",
    readyDate: "10 May",
    submittedDate: "25 Apr",
    village: "Bharwari, Prayagraj",
    status: "Submitted",
    farmerName: "Anil Patel",
  },
  {
    id: "L-1050",
    crop: "Mustard",
    emoji: "🌼",
    quantity: 8,
    unit: "quintal",
    readyDate: "05 May",
    submittedDate: "26 Apr",
    village: "Bharwari, Prayagraj",
    status: "Active",
    farmerName: "Anil Patel",
  },
  {
    id: "L-1051",
    crop: "Tomato",
    emoji: "🍅",
    quantity: 100,
    unit: "kg",
    readyDate: "12 Apr",
    submittedDate: "08 Apr",
    village: "Bharwari, Prayagraj",
    status: "Sold",
    farmerName: "Anil Patel",
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
    farmerName: "Ramesh Kumar",
  },
  {
    id: "O-5570",
    listingId: "L-1010",
    crop: "Paddy",
    emoji: "🌾",
    acceptedQty: 10,
    unit: "quintal",
    pickupDate: "28 Apr",
    pickupSlot: "2:00 PM – 4:00 PM",
    collectionPoint: "Bharwari Mandi Gate 2",
    expectedPayout: 16500,
    status: "Accepted",
    farmerName: "Ramesh Kumar",
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
    farmerName: "Anil Patel",
  },
  {
    id: "O-5555",
    listingId: "L-1031",
    crop: "Paddy",
    emoji: "🌾",
    acceptedQty: 8,
    unit: "quintal",
    pickupDate: "18 Apr",
    pickupSlot: "11:00 AM – 1:00 PM",
    collectionPoint: "Bharwari Mandi Gate 2",
    expectedPayout: 13200,
    status: "Collected",
    farmerName: "Suresh Singh",
  },
  {
    id: "O-5572",
    listingId: "L-1045",
    crop: "Potato",
    emoji: "🥔",
    acceptedQty: 50,
    unit: "quintal",
    pickupDate: "12 Apr",
    pickupSlot: "10:00 AM – 12:00 PM",
    collectionPoint: "Bharwari Mandi Gate 1",
    expectedPayout: 85000,
    status: "Collected",
    farmerName: "Ramesh Kumar",
  },
  {
    id: "O-5573",
    listingId: "L-1046",
    crop: "Wheat",
    emoji: "🌾",
    acceptedQty: 25,
    unit: "quintal",
    pickupDate: "Tomorrow, 30 Apr",
    pickupSlot: "1:00 PM – 3:00 PM",
    collectionPoint: "Anupganj Center",
    expectedPayout: 57500,
    status: "Awaiting",
    farmerName: "Vikram Shah",
  },
  {
    id: "O-5574",
    listingId: "L-1048",
    crop: "Paddy",
    emoji: "🌾",
    acceptedQty: 15,
    unit: "quintal",
    pickupDate: "17 Apr",
    pickupSlot: "9:00 AM – 11:00 AM",
    collectionPoint: "Anupganj Center",
    expectedPayout: 24750,
    status: "Collected",
    farmerName: "Vikram Shah",
  },
  {
    id: "O-5575",
    listingId: "L-1051",
    crop: "Tomato",
    emoji: "🍅",
    acceptedQty: 100,
    unit: "kg",
    pickupDate: "14 Apr",
    pickupSlot: "11:00 AM – 1:00 PM",
    collectionPoint: "Bharwari Mandi Gate 1",
    expectedPayout: 2500,
    status: "Collected",
    farmerName: "Anil Patel",
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
    farmerName: "Anil Patel",
  },
  {
    id: "P-9918",
    orderId: "O-5555",
    crop: "Paddy",
    amount: 13200,
    status: "Paid",
    timestamp: "19 Apr, 11:05 AM",
    farmerName: "Suresh Singh",
  },
  {
    id: "P-9915",
    orderId: "O-5540",
    crop: "Wheat",
    amount: 27600,
    status: "Paid",
    timestamp: "12 Apr, 2:30 PM",
    farmerName: "Suresh Singh",
  },
  {
    id: "P-9912",
    orderId: "O-5535",
    crop: "Mustard",
    amount: 32400,
    status: "Processing",
    timestamp: "Just now",
    farmerName: "Preeti Devi",
  },
  {
    id: "P-9922",
    orderId: "O-5572",
    crop: "Potato",
    amount: 85000,
    status: "Paid",
    upiRef: "UPI/412847295",
    timestamp: "13 Apr, 2:30 PM",
    farmerName: "Ramesh Kumar",
  },
  {
    id: "P-9923",
    orderId: "O-5574",
    crop: "Paddy",
    amount: 24750,
    status: "Paid",
    upiRef: "UPI/412847296",
    timestamp: "18 Apr, 10:15 AM",
    farmerName: "Vikram Shah",
  },
  {
    id: "P-9924",
    orderId: "O-5575",
    crop: "Tomato",
    amount: 2500,
    status: "Paid",
    upiRef: "UPI/412847297",
    timestamp: "15 Apr, 11:45 AM",
    farmerName: "Anil Patel",
  },
];

export const weeklyStats: WeeklyStats = {
  totalQty: 30,
  totalEarnings: 94800,
  paid: 62400,
  pending: 32400,
  pickupsCompleted: 4,
  breakdown: [
    { crop: "Mustard", qty: 10, amount: 54000 },
    { crop: "Paddy", qty: 8, amount: 13200 },
    { crop: "Wheat", qty: 12, amount: 27600 },
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

export const initialFarmers: Farmer[] = [
  { id: "F-1", name: "Ramesh Kumar", village: "Bharwari, Prayagraj", phone: "9876543210", activeLots: 3, totalSold: 120, status: "Active" },
  { id: "F-2", name: "Kamala Devi", village: "Bharwari, Prayagraj", phone: "9876543211", activeLots: 2, totalSold: 85, status: "Active" },
  { id: "F-3", name: "Anil Patel", village: "Bharwari, Prayagraj", phone: "9876543212", activeLots: 0, totalSold: 210, status: "Inactive" },
  { id: "F-4", name: "Suresh Singh", village: "Saidabad, Prayagraj", phone: "9876543213", activeLots: 1, totalSold: 150, status: "Active" },
  { id: "F-5", name: "Preeti Devi", village: "Saidabad, Prayagraj", phone: "9876543214", activeLots: 2, totalSold: 45, status: "Active" },
  { id: "F-6", name: "Vikram Shah", village: "Anupganj, Prayagraj", phone: "9876543215", activeLots: 1, totalSold: 22, status: "New" },
];
