export type Fairness = "fair" | "review" | "underpaid";

export type Job = {
  id: string;
  platform: Platform;
  fare: number;
  distance: number;
  minutes: number;
  date: string;
  status: Fairness;
  expected: number;
};

export type Platform = "Swiggy" | "Zomato" | "Uber" | "Rapido" | "Blinkit";

export const platformMeta: Record<Platform, { color: string; initials: string }> = {
  Swiggy: { color: "#F59E0B", initials: "SW" },
  Zomato: { color: "#EF4444", initials: "ZO" },
  Uber: { color: "#22C55E", initials: "UB" },
  Rapido: { color: "#8B5CF6", initials: "RA" },
  Blinkit: { color: "#06B6D4", initials: "BL" },
};

export const stats = [
  { key: "earnings", label: "Total Earnings", value: 7430, prefix: "₹", trend: "+12.4%" },
  { key: "hours", label: "Hours Worked", value: 46, suffix: "h", trend: "+3.1%" },
  { key: "platforms", label: "Platforms Used", value: 4, trend: "stable" },
  { key: "flagged", label: "Flagged Jobs", value: 6, trend: "-2 vs last week" },
];

export const weekly = [
  { day: "Mon", earnings: 820, fair: 780 },
  { day: "Tue", earnings: 640, fair: 900 },
  { day: "Wed", earnings: 1120, fair: 1080 },
  { day: "Thu", earnings: 980, fair: 1010 },
  { day: "Fri", earnings: 1580, fair: 1490 },
  { day: "Sat", earnings: 1340, fair: 1300 },
  { day: "Sun", earnings: 950, fair: 1000 },
];

export const platformEarnings: {
  platform: Platform;
  amount: number;
  change: number;
  progress: number;
}[] = [
  { platform: "Swiggy", amount: 2480, change: 8.2, progress: 82 },
  { platform: "Uber", amount: 2140, change: 18.4, progress: 71 },
  { platform: "Rapido", amount: 1610, change: -4.1, progress: 54 },
  { platform: "Blinkit", amount: 1200, change: 2.6, progress: 40 },
];

export const jobs: Job[] = [
  { id: "GS-1042", platform: "Uber", fare: 312, distance: 11.4, minutes: 38, date: "Today · 7:42 PM", status: "fair", expected: 305 },
  { id: "GS-1041", platform: "Swiggy", fare: 96, distance: 6.2, minutes: 24, date: "Today · 5:10 PM", status: "underpaid", expected: 148 },
  { id: "GS-1040", platform: "Blinkit", fare: 74, distance: 3.1, minutes: 16, date: "Today · 2:36 PM", status: "fair", expected: 70 },
  { id: "GS-1039", platform: "Rapido", fare: 58, distance: 4.8, minutes: 19, date: "Yesterday · 9:02 PM", status: "review", expected: 72 },
  { id: "GS-1038", platform: "Swiggy", fare: 132, distance: 7.7, minutes: 29, date: "Yesterday · 8:15 PM", status: "fair", expected: 128 },
  { id: "GS-1037", platform: "Zomato", fare: 61, distance: 5.4, minutes: 22, date: "Yesterday · 1:48 PM", status: "underpaid", expected: 105 },
  { id: "GS-1036", platform: "Uber", fare: 268, distance: 9.6, minutes: 31, date: "Wed · 10:20 PM", status: "fair", expected: 254 },
  { id: "GS-1035", platform: "Rapido", fare: 44, distance: 3.9, minutes: 15, date: "Wed · 6:05 PM", status: "review", expected: 55 },
];

export const insights = [
  { title: "Set a floor of ₹20/km", body: "You accepted 9 deliveries below ₹14/km this week. Declining them would have raised net pay by ₹512.", tone: "primary" as const },
  { title: "Uber paid 18% higher", body: "Uber outperformed every other platform on ₹/hour between 6 PM and 10 PM.", tone: "cyan" as const },
  { title: "Friday evenings peak", body: "Friday 6–11 PM produced ₹1,580 — your single most profitable window this month.", tone: "purple" as const },
  { title: "Tuesday afternoons leak money", body: "4 of your 6 flagged gigs happened Tuesday between 1 PM and 4 PM.", tone: "warning" as const },
];

export const badges = [
  { name: "Fair Play", desc: "50 fair-paid gigs in a row", color: "#22C55E" },
  { name: "Night Owl", desc: "100 gigs after 9 PM", color: "#8B5CF6" },
  { name: "Multi-Platform", desc: "Active on 4+ platforms", color: "#06B6D4" },
  { name: "Dispute Winner", desc: "Recovered ₹2,100 in payouts", color: "#3B82F6" },
  { name: "Marathon", desc: "12 hours in a single day", color: "#F59E0B" },
];

export const statusMeta: Record<Fairness, { label: string; color: string }> = {
  fair: { label: "Fair", color: "#22C55E" },
  review: { label: "Review", color: "#F59E0B" },
  underpaid: { label: "Underpaid", color: "#EF4444" },
};
