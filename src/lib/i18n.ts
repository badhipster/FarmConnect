import { createContext, useContext } from "react";

export type Lang = "en" | "hi";

type Dict = Record<string, { en: string; hi: string }>;

export const dict: Dict = {
  // Common
  next: { en: "Next", hi: "आगे" },
  back: { en: "Back", hi: "वापस" },
  continue: { en: "Continue", hi: "जारी रखें" },
  submit: { en: "Submit", hi: "जमा करें" },
  save: { en: "Save", hi: "सहेजें" },
  cancel: { en: "Cancel", hi: "रद्द करें" },
  done: { en: "Done", hi: "पूरा हुआ" },
  optional: { en: "Optional", hi: "वैकल्पिक" },
  needHelp: { en: "Need help?", hi: "मदद चाहिए?" },
  callback: { en: "Request callback", hi: "कॉलबैक मांगें" },

  // Role
  rolePickTitle: { en: "Who are you?", hi: "आप कौन हैं?" },
  rolePickSub: { en: "Choose how you want to use FarmConnect", hi: "FarmConnect का उपयोग कैसे करना है चुनें" },
  roleFarmer: { en: "Farmer", hi: "किसान" },
  roleFarmerDesc: { en: "Sell your produce directly", hi: "अपनी उपज सीधे बेचें" },
  roleFpo: { en: "FPO Coordinator", hi: "FPO समन्वयक" },
  roleFpoDesc: { en: "Manage many farmers together", hi: "कई किसानों का प्रबंधन करें" },

  // Language
  langTitle: { en: "Choose language", hi: "भाषा चुनें" },
  langSub: { en: "You can change this anytime", hi: "आप इसे कभी भी बदल सकते हैं" },

  // Onboarding
  onbTitle: { en: "Tell us about you", hi: "अपने बारे में बताएं" },
  onbFpoTitle: { en: "About your FPO", hi: "अपने FPO के बारे में" },
  fullName: { en: "Full name", hi: "पूरा नाम" },
  fpoName: { en: "FPO name", hi: "FPO का नाम" },
  village: { en: "Village", hi: "गाँव" },
  phone: { en: "Mobile number", hi: "मोबाइल नंबर" },
  primaryCrops: { en: "Primary crops", hi: "मुख्य फसलें" },
  cropsHint: { en: "Tap crops you grow", hi: "जो फसलें आप उगाते हैं चुनें" },

  // Payout
  payoutTitle: { en: "Where to get paid?", hi: "भुगतान कहाँ लें?" },
  payoutSub: { en: "Money goes here after pickup", hi: "पिकअप के बाद पैसा यहाँ आएगा" },
  upi: { en: "UPI ID", hi: "UPI आईडी" },
  bank: { en: "Bank account", hi: "बैंक खाता" },
  accountNumber: { en: "Account number", hi: "खाता संख्या" },
  ifsc: { en: "IFSC code", hi: "IFSC कोड" },
  accountHolder: { en: "Account holder name", hi: "खाताधारक का नाम" },

  // Done
  allSetTitle: { en: "All set!", hi: "सब तैयार है!" },
  allSetSub: { en: "Start by adding your first produce", hi: "अपनी पहली उपज जोड़कर शुरू करें" },
  goToHome: { en: "Go to Home", hi: "होम पर जाएँ" },

  // Home
  activeListings: { en: "Active listings", hi: "सक्रिय सूचियाँ" },
  upcomingPickup: { en: "Upcoming pickup", hi: "आने वाला पिकअप" },
  pendingPayout: { en: "Pending payout", hi: "लंबित भुगतान" },
  addProduce: { en: "Add Produce", hi: "उपज जोड़ें" },
  addProduceHint: { en: "Tell us what you have. We'll find a buyer.", hi: "बताइए क्या है आपके पास। हम खरीदार ढूँढेंगे।" },
  newOrder: { en: "New order — action needed", hi: "नया ऑर्डर — कार्रवाई जरूरी" },
  payoutOnTheWay: { en: "Payout on the way", hi: "भुगतान आ रहा है" },
  quickAccess: { en: "Quick access", hi: "त्वरित पहुँच" },
  myListings: { en: "My Listings", hi: "मेरी सूचियाँ" },
  pickupUpdates: { en: "Pickup Updates", hi: "पिकअप अपडेट" },
  payments: { en: "Payments", hi: "भुगतान" },
  weeklySummary: { en: "Weekly Summary", hi: "साप्ताहिक सारांश" },
  tapToSeeStatus: { en: "Tap to see status", hi: "स्थिति देखने के लिए टैप करें" },
  noPickups: { en: "No pickups", hi: "कोई पिकअप नहीं" },
  allClear: { en: "All clear", hi: "सब ठीक है" },
  viewProof: { en: "View payout proof", hi: "भुगतान प्रमाण देखें" },
  earningsPickups: { en: "Earnings & pickups", hi: "कमाई और पिकअप" },
  thisWeek: { en: "This week", hi: "इस हफ्ते" },

  // Add Produce
  addProduceSub: { en: "Takes under a minute", hi: "एक मिनट से कम का काम" },
  crop: { en: "Crop", hi: "फसल" },
  quantity: { en: "Quantity", hi: "मात्रा" },
  unit: { en: "Unit", hi: "इकाई" },
  readyBy: { en: "Ready by", hi: "कब तक तैयार" },
  photo: { en: "Photo", hi: "फोटो" },
  addPhoto: { en: "Add a photo of your produce", hi: "अपनी उपज की फोटो जोड़ें" },
  note: { en: "Note", hi: "टिप्पणी" },
  noteHint: { en: "Anything buyer should know", hi: "खरीदार को कुछ बताना है?" },
  submitListing: { en: "Submit Listing", hi: "सूची जमा करें" },
  listingSubmitted: { en: "Listing Submitted", hi: "सूची जमा हो गई" },
  listingActiveTitle: { en: "Your produce listing is active", hi: "आपकी सूची सक्रिय है" },
  listingActiveSub: { en: "We'll notify you when a buyer is matched. Usually within 24 hours.", hi: "खरीदार मिलते ही हम सूचित करेंगे। आमतौर पर 24 घंटे में।" },
  backToHome: { en: "Back to Home", hi: "होम पर वापस" },

  // Listings
  total: { en: "total", hi: "कुल" },
  noListings: { en: "No listings yet. Tap below to add your first.", hi: "अभी कोई सूची नहीं। नीचे टैप कर जोड़ें।" },
  addNew: { en: "Add new produce", hi: "नई उपज जोड़ें" },
  ready: { en: "Ready", hi: "तैयार" },
  submitted: { en: "Submitted", hi: "जमा" },

  // Orders / Pickup
  orders: { en: "Orders", hi: "ऑर्डर" },
  ordersAndPickup: { en: "Orders & Pickup", hi: "ऑर्डर और पिकअप" },
  noOrders: { en: "No orders yet", hi: "अभी कोई ऑर्डर नहीं" },
  noOrdersSub: { en: "When a buyer matches, you'll see it here.", hi: "खरीदार मिलने पर यहाँ दिखेगा।" },
  pickupAt: { en: "Pickup at", hi: "पिकअप स्थान" },
  expectedPayout: { en: "Expected payout", hi: "अनुमानित भुगतान" },

  // Payments
  paid: { en: "Paid", hi: "भुगतान हुआ" },
  pending: { en: "Pending", hi: "लंबित" },
  bankAccount: { en: "Bank account", hi: "बैंक खाता" },
  recentActivity: { en: "Recent activity", hi: "हाल की गतिविधि" },
  paymentIssue: { en: "Payment issue?", hi: "भुगतान में दिक्कत?" },
  callUs: { en: "Call us — we'll fix it", hi: "हमें कॉल करें — हम ठीक करेंगे" },

  // Status (bilingual chip text)
  st_Submitted: { en: "Submitted", hi: "जमा" },
  st_Active: { en: "Active", hi: "सक्रिय" },
  st_Matched: { en: "Matched", hi: "मिलान" },
  st_Sold: { en: "Sold", hi: "बिक गया" },
  st_Expired: { en: "Expired", hi: "समाप्त" },
  st_Pending: { en: "Pending", hi: "लंबित" },
  st_Processing: { en: "Processing", hi: "प्रक्रिया में" },
  st_Paid: { en: "Paid", hi: "हुआ" },
  st_Awaiting: { en: "Awaiting", hi: "प्रतीक्षा" },
  st_Accepted: { en: "Accepted", hi: "स्वीकार" },
  st_Scheduled: { en: "Scheduled", hi: "तय" },
  st_Collected: { en: "Collected", hi: "उठाया" },

  // FPO
  fpoGroup: { en: "FPO Group", hi: "FPO समूह" },
  groupSupply: { en: "Group supply", hi: "समूह आपूर्ति" },
  groupPickup: { en: "Group pickups", hi: "समूह पिकअप" },
  groupPayout: { en: "Group payout", hi: "समूह भुगतान" },
  farmers: { en: "farmers", hi: "किसान" },
  addFarmerSupply: { en: "Add farmer supply", hi: "किसान आपूर्ति जोड़ें" },
};

export const cropI18n: Record<string, { hi: string }> = {
  Wheat: { hi: "गेहूं" },
  Paddy: { hi: "धान" },
  Tomato: { hi: "टमाटर" },
  Onion: { hi: "प्याज" },
  Potato: { hi: "आलू" },
  Mustard: { hi: "सरसों" },
  Maize: { hi: "मक्का" },
};

export const I18nContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: "en",
  setLang: () => {},
});

export function useT() {
  const { lang, setLang } = useContext(I18nContext);
  const t = (key: keyof typeof dict) => dict[key]?.[lang] ?? String(key);
  const tCrop = (name: string) => (lang === "hi" && cropI18n[name] ? `${name} / ${cropI18n[name].hi}` : name);
  return { t, tCrop, lang, setLang };
}
