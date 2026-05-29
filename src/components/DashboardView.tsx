import React from "react";
import { UserProfile, Order, Product, ChatSession } from "../types";
import { 
  ShieldCheck, Wallet, ArrowUpRight, ArrowDownLeft, TrendingUp, CheckCircle, 
  Clock, Package, MessageSquare, ToggleLeft, ToggleRight, Sparkles, UserCheck,
  Plus, Search, Bell, Settings, HelpCircle, Activity, Filter, Star, Crown, ChevronRight, LogOut
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface DashboardViewProps {
  currentUser: UserProfile;
  orders: Order[];
  products: Product[];
  chats: ChatSession[];
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onUpdateOrder: (orderId: string, status: "processing" | "shipped" | "delivered" | "flagged") => void;
  onNavigate: (route: string) => void;
}

// Preset systems matching the three HTML mockup designs perfectly!
interface PresetProfile {
  id: string;
  name: string;
  subtitle: string;
  ratingName: string;
  avatar: string;
  totalSales: string;
  salesGrowth: string;
  activeListings: string;
  activeListingsStatus: string;
  storeViews: string;
  storeViewsStatus: string;
  ratingValue: string;
  ratingDesc: string;
  role: "buyer" | "seller";
  onboardingStep: number;
}

export default function DashboardView({
  currentUser,
  orders,
  products,
  chats,
  onUpdateUser,
  onUpdateOrder,
  onNavigate
}: DashboardViewProps) {
  // Preset simulation Profiles mapping the PDF/HTML mockups of Alex, Marcus, and Sarah
  const presets: PresetProfile[] = [
    {
      id: "preset-marcus",
      name: "Marcus Sterling",
      subtitle: "Silver Merchant",
      ratingName: "Chen's Artisanal Goods",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAKVY4sybW6vB4LbZxVOPLptWYryBgOjtRGYf330CMxsRslXujgN5CGAvQ1FfI-2Cb9rLYhQqjtemV9nJVpyhbnfLX3MZ8qcd2O_5iJSRcjd2QcUS_rlC0D0QR4MvIOHQUMHKqa0nPri4te_NAf73w7hlzre-fulRWavKWuUazMOcCvr_bOE9C2pTvzq_vYu2AsB3ZHgY8qHp_E_j6oiutrHunpHXLW0LykqjigNAZ5c-pLyBn6qmqJQxfqkGfhTuVPY26D2eRyE5Q",
      totalSales: "$12,450.00",
      salesGrowth: "+8.4%",
      activeListings: "42",
      activeListingsStatus: "Stable",
      storeViews: "1,205",
      storeViewsStatus: "+12.1%",
      ratingValue: "4.9",
      ratingDesc: "24 reviews",
      role: "seller",
      onboardingStep: 0
    },
    {
      id: "preset-sarah",
      name: "Sarah Higgins",
      subtitle: "Artisan Merchant",
      ratingName: "Sarah's Local Pottery",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAS_BOU9UmRgFP4A_d6EBdExL0GBQJ7SyO62k_1pr4qI2KfSMzikcQ1haHqgbo1JcrK7l65lV2Zy2SURXodF_DuFprA2ccuMFYaxNXRFZH_18nfrdy5KA5oiIeFN7DKvDoBDFmd0BLFUIkt1uu-Q_HSSdEhzjx8MAQbsOXV3EBWvu0l5fwdBSRWLJ1L0H23p61R7hjHl9EKXTr7v-y_1GKLqa1JpUA_YrtgafyT6sygtGGZqdHVYa1KiY0b3SJiaFVLwoYde2BVrWs",
      totalSales: "$4,280.00",
      salesGrowth: "+12% this week",
      activeListings: "86",
      activeListingsStatus: "+5% vs last week",
      storeViews: "1,200",
      storeViewsStatus: "Steady flow",
      ratingValue: "4.9",
      ratingDesc: "24 verified reviews",
      role: "seller",
      onboardingStep: 0
    },
    {
      id: "preset-alex",
      name: "Alex Sterling",
      subtitle: "Premium Merchant",
      ratingName: "Sterling Electronics",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDvF3K9iUJDyHy8kTja0TxaoRmLSIXABsyhvV7nnDPamviWb3o24hxkTy0i6VmqbN3BAygJ7LfbvrJRBciOh5YEj9LwfGYTQY7nX3mhL9eRhr-Azqxys4482W6C5l3jqL_VcM38xWv4OD3vrylX4Fg2LYWpAKUti-xuYsfpbvtOLGDpnU9HK-QbgJmby_5qgpnanSmem33LYwiON85Vl6lsH3lP_9IHcQYrpp_N-8eaKbbzv-sNGKgzV58ZYtgSOoOEenauQH0jFf4",
      totalSales: "$24,190.00",
      salesGrowth: "+15.3%",
      activeListings: "58",
      activeListingsStatus: "Stable",
      storeViews: "3,410",
      storeViewsStatus: "+18.9%",
      ratingValue: "5.0",
      ratingDesc: "48 reviews",
      role: "seller",
      onboardingStep: 0
    }
  ];

  const [selectedPresetId, setSelectedPresetId] = React.useState<string>("custom");
  const [fundingAmount, setFundingAmount] = React.useState("");
  const [fundingMode, setFundingMode] = React.useState(false);
  
  // Interactive chart states
  const [chartInterval, setChartInterval] = React.useState<"30" | "180">("30");
  const [hoveredPointIndex, setHoveredPointIndex] = React.useState<number | null>(null);

  // Recent activity search state
  const [activitySearchQuery, setActivitySearchQuery] = React.useState("");

  // Handler to switch simulated profiles 
  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    if (presetId === "custom") {
      // Revert to initial custom logged-in state details
      onUpdateUser({
        username: "Oladimeji Azeez",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
        role: "buyer"
      });
    } else {
      const match = presets.find(p => p.id === presetId);
      if (match) {
        onUpdateUser({
          username: match.name,
          avatar: match.avatar,
          role: match.role,
          trustScore: 98
        });
      }
    }
  };

  // Toggle mode dynamically
  const toggleRole = () => {
    const newRole = currentUser.role === "buyer" ? "seller" : "buyer";
    onUpdateUser({ role: newRole });
  };

  const handleFundWallet = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(fundingAmount);
    if (!isNaN(amount) && amount > 0) {
      onUpdateUser({ walletBalance: currentUser.walletBalance + amount });
      setFundingAmount("");
      setFundingMode(false);
    }
  };

  // Activity list data
  // Using actual orders supplemented with high fidelity mock transactions matching VD-8921 to VD-8925
  const mockActivities = [
    {
      orderId: "VD-8921",
      buyerName: "Jane Doe",
      initials: "JD",
      amount: 240,
      itemTitle: "Handwoven Jute Carpet",
      status: "completed",
      time: "2 minutes ago"
    },
    {
      orderId: "VD-8922",
      buyerName: "Alex Smith",
      initials: "AS",
      amount: 1150,
      itemTitle: "Sleek Aero watch Pro",
      status: "processing",
      time: "15 minutes ago"
    },
    {
      orderId: "VD-8923",
      buyerName: "Maria Lopez",
      initials: "ML",
      amount: 56,
      itemTitle: "Ceramic Teal Mug",
      status: "completed",
      time: "2 hours ago"
    },
    {
      orderId: "VD-8924",
      buyerName: "Robert White",
      initials: "RW",
      amount: 480,
      itemTitle: "Leather Suede Messenger",
      status: "completed",
      time: "1 day ago"
    },
    {
      orderId: "VD-8925",
      buyerName: "Emma Knight",
      initials: "EK",
      amount: 2100,
      itemTitle: "Vintage Mahogany Table",
      status: "cancelled",
      time: "4 days ago"
    }
  ];

  // Merge actual order list with presets fallback to let dashboard show actual buyer / seller operations
  const mergedOrdersList = orders.map(ord => ({
    orderId: ord.orderId,
    buyerName: ord.buyerId === currentUser.userId ? currentUser.username : "Neighbor Buyer",
    initials: (ord.buyerId === currentUser.userId ? currentUser.username : "Neighbor Buyer").slice(0, 2).toUpperCase(),
    amount: ord.price,
    itemTitle: ord.productTitle,
    status: ord.status === "delivered" ? "completed" : ord.status === "shipped" ? "shipped" : "processing",
    time: "Today"
  }));

  const allActivitiesCombined = [...mergedOrdersList, ...mockActivities];

  // Filtering recent activity
  const filteredActivities = allActivitiesCombined.filter(act => {
    const searchLower = activitySearchQuery.toLowerCase();
    return (
      act.orderId.toLowerCase().includes(searchLower) ||
      act.buyerName.toLowerCase().includes(searchLower) ||
      act.itemTitle.toLowerCase().includes(searchLower)
    );
  });

  // Graph values based on selected interval
  const graphValues30 = [120, 240, 180, 390, 310, 480, 520, 610, 490, 780, 810, 950];
  const graphValues180 = [2100, 3400, 2800, 4900, 4300, 5800, 6200, 8100, 7900, 9800, 10500, 12450];
  const activeGraphValues = chartInterval === "30" ? graphValues30 : graphValues180;
  const graphLabels = chartInterval === "30" 
    ? ["Day 1-2", "Day 3-5", "Day 6-8", "Day 9-11", "Day 12-14", "Day 15-17", "Day 18-20", "Day 21-23", "Day 24-26", "Day 27-28", "Day 29", "Day 30"]
    : ["Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"];

  // SVG dimensions for consistent scale view
  const svgWidth = 500;
  const svgHeight = 160;
  const paddingX = 20;
  const paddingY = 20;

  // Compute SVG point path using relative metrics
  const points = activeGraphValues.map((val, idx) => {
    const x = paddingX + (idx / (activeGraphValues.length - 1)) * (svgWidth - paddingX * 2);
    const maxVal = Math.max(...activeGraphValues);
    const y = svgHeight - paddingY - (val / maxVal) * (svgHeight - paddingY * 2);
    return { x, y, value: val, label: graphLabels[idx] };
  });

  const pathD = points.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, "");

  const areaD = points.length > 0 
    ? `${pathD} L ${points[points.length - 1].x} ${svgHeight - paddingY} L ${points[0].x} ${svgHeight - paddingY} Z` 
    : "";

  // Dynamic state selectors based on active presets
  const activePresetInfo = presets.find(p => p.id === selectedPresetId);
  const displaySales = activePresetInfo ? activePresetInfo.totalSales : `$${(currentUser.walletBalance * 1.5).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const displaySalesGrowth = activePresetInfo ? activePresetInfo.salesGrowth : "+12% this week";
  const displayActiveListings = activePresetInfo ? activePresetInfo.activeListings : `${products.filter(p => p.sellerId === currentUser.userId).length + 3}`;
  const displayActiveListingsStatus = activePresetInfo ? activePresetInfo.activeListingsStatus : "Stable";
  const displayStoreViews = activePresetInfo ? activePresetInfo.storeViews : "1,142";
  const displayStoreViewsStatus = activePresetInfo ? activePresetInfo.storeViewsStatus : "Steady flow";
  const displayRatingValue = activePresetInfo ? activePresetInfo.ratingValue : "4.9";
  const displayRatingDesc = activePresetInfo ? activePresetInfo.ratingDesc : "Excellent rating";

  const currentDayFormatted = "Monday, October 14, 2024";

  return (
    <div className="space-y-8" id="dashboard-outer-root-wrapper">
      
      {/* Simulation Controller Header for the user to try Marcus Chen, Sarah Higgins or Alex Sterling presets */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm border border-slate-800" id="sim-profile-bar">
        <div className="flex items-center gap-2">
          <span className="p-1 px-2.5 rounded bg-blue-500 font-mono text-[10px] font-bold">BATCH 2 PRESENTS</span>
          <span className="text-xs font-semibold text-slate-200">Simulate Preset screens matching specified designs:</span>
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          {presets.map(p => (
            <button
              key={p.id}
              onClick={() => handleSelectPreset(p.id)}
              className={`cursor-pointer px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedPresetId === p.id 
                  ? "bg-blue-600 text-white shadow-sm ring-2 ring-blue-500/20" 
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {p.name} ({p.subtitle})
            </button>
          ))}
          <button
            onClick={() => handleSelectPreset("custom")}
            className={`cursor-pointer px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedPresetId === "custom" 
                ? "bg-blue-600 text-white shadow-sm ring-2 ring-emerald-500/20" 
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            My Custom Data ({currentUser.username})
          </button>
        </div>
      </div>

      {/* Main Core View Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="b2-dashboard-shell">
        
        {/* SIDE BAR LAYOUT FOR DESKTOP */}
        <aside className="hidden lg:col-span-3 bg-white border border-slate-150 rounded-2xl p-5 flex flex-col justify-between h-[680px]" id="dashboard-desktop-sidebar">
          <div className="space-y-6">
            <div className="flex items-start gap-3 p-1">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xl">V</div>
              <div>
                <span className="font-extrabold text-slate-800 text-base leading-none block">Vendoora</span>
                <span className="text-[10px] text-blue-600 font-mono font-bold">Local trade program</span>
              </div>
            </div>

            <nav className="space-y-1 text-xs">
              <button onClick={() => onNavigate("/dashboard")} className="w-full flex items-center gap-3.5 px-4 py-3 bg-blue-600 text-white rounded-xl font-bold transition-all text-left shadow-sm">
                <span className="material-symbols-outlined text-sm">dashboard</span>
                <span>Dashboard</span>
              </button>
              <button onClick={() => onNavigate("/products")} className="w-full flex items-center gap-3.5 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl font-medium transition-all text-left">
                <span className="material-symbols-outlined text-sm">inventory_2</span>
                <span>My Products</span>
              </button>
              <button onClick={() => onNavigate("/messages")} className="w-full flex items-center gap-3.5 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl font-medium transition-all text-left">
                <span className="material-symbols-outlined text-sm">chat</span>
                <span>Messages</span>
                <span className="ml-auto bg-red-500 text-white font-mono text-[9px] px-1.5 py-0.5 rounded-full font-bold">3</span>
              </button>
              <button onClick={() => onNavigate("/analytics")} className="w-full flex items-center gap-3.5 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl font-medium transition-all text-left text-blue-600 font-bold">
                <span className="material-symbols-outlined text-sm">analytics</span>
                <span>Analytics reports</span>
              </button>
              <button onClick={() => onNavigate("/design-system")} className="w-full flex items-center gap-3.5 px-4 py-3 text-slate-400 hover:bg-slate-50 hover:text-slate-700 rounded-xl font-medium transition-all text-left">
                <span className="material-symbols-outlined text-sm">settings</span>
                <span>Preferences</span>
              </button>
            </nav>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs mt-auto space-y-2 text-left">
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-[10px] text-slate-400 uppercase tracking-widest block">Merchant Plan</span>
              <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-sm font-bold">Silver</span>
            </div>
            <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full w-[75%]" />
            </div>
            <button 
              onClick={() => alert("Upgrading is currently managed via custom Vendoora programs. Enjoy Premium features!")}
              className="cursor-pointer w-full py-2 bg-white hover:bg-slate-100 text-blue-600 border border-blue-200 rounded-xl font-bold text-[11px] transition-all"
            >
              Upgrade Plan
            </button>
          </div>
        </aside>

        {/* MAIN INTERACTIVE DASHBOARD SECTION */}
        <div className="lg:col-span-9 space-y-8" id="dashboard-main-flow">
          
          {/* Welcome Screen Greeting Area matching Marcus & Sarah designs */}
          <div className="bg-white border border-slate-150 p-6 md:p-8 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-left" id="kpi-welcome-widget">
            <div className="flex items-center gap-4">
              <img 
                src={currentUser.avatar}
                alt={currentUser.username}
                className="w-14 h-14 rounded-full border-2 border-blue-100 shadow-sm object-cover"
              />
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider block font-mono">{currentDayFormatted}</span>
                <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                  Welcome back, {currentUser.username}!
                </h1>
                <p className="text-xs text-slate-500 max-w-sm font-medium">
                  {selectedPresetId !== "custom" 
                    ? `Your simulated neighborhood empire grew by 12% this week.` 
                    : `Your Vendoora dashboard is active. S8-S11 trust scores validated.`}
                </p>
              </div>
            </div>

            {/* Quick Listing drawer anchor */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => onNavigate("/ai/list")}
                className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 px-5 rounded-xl transition-all shadow-md shadow-blue-500/10 flex items-center justify-center gap-1.5 active:scale-95"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" /> New Listing
              </button>
              <button
                onClick={toggleRole}
                className="cursor-pointer border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-bold text-xs py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                Perspective: {currentUser.role === "buyer" ? "Buyer Mode" : "Seller Mode"}
              </button>
            </div>
          </div>

          {/* KPI Display Grid matching the layout shapes perfectly */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4" id="kpi-quad-indicator">
            
            {/* KPI CARD 1: Revenue / sales */}
            <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-xs flex flex-col justify-between text-left group hover:border-slate-350 transition-colors">
              <div className="flex justify-between items-start">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-105 transition-transform">
                  <Wallet className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{displaySalesGrowth}</span>
              </div>
              <div className="mt-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Sales</span>
                <span className="text-xl md:text-2xl font-black text-slate-900 tracking-tight block font-mono mt-0.5">{displaySales}</span>
              </div>
            </div>

            {/* KPI CARD 2: Current Active orders / Listings */}
            <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-xs flex flex-col justify-between text-left group hover:border-slate-350 transition-colors">
              <div className="flex justify-between items-start">
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-105 transition-transform">
                  <Package className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full">
                  {displayActiveListingsStatus}
                </span>
              </div>
              <div className="mt-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Listings</span>
                <span className="text-xl md:text-2xl font-black text-slate-900 tracking-tight block font-mono mt-0.5">{displayActiveListings}</span>
              </div>
            </div>

            {/* KPI CARD 3: Store Views */}
            <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-xs flex flex-col justify-between text-left group hover:border-slate-350 transition-colors">
              <div className="flex justify-between items-start">
                <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl group-hover:scale-105 transition-transform">
                  <Activity className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full">Steady</span>
              </div>
              <div className="mt-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Store Views</span>
                <span className="text-xl md:text-2xl font-black text-slate-900 tracking-tight block font-mono mt-0.5">{displayStoreViews}</span>
              </div>
            </div>

            {/* KPI CARD 4: Rating stars */}
            <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-xs flex flex-col justify-between text-left group hover:border-slate-350 transition-colors">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-amber-50 text-amber-500 rounded-xl group-hover:scale-105 transition-transform">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-50 px-2,5 py-0.5 rounded-full">Excellent</span>
              </div>
              <div className="mt-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Merchant Score</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-xl md:text-2xl font-black text-slate-900 tracking-tight font-mono">{displayRatingValue}</span>
                  <span className="text-slate-400 text-[9px] block">★ {displayRatingDesc}</span>
                </div>
              </div>
            </div>

          </div>

          {/* DUAL INTERACTIVE CHARTS WRAPPER */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6" id="dashboard-charts-module">
            
            {/* Area Line Chart: Sales performance */}
            <div className="md:col-span-7 bg-white p-6 rounded-3xl border border-slate-150 flex flex-col justify-between h-[360px]" id="sales-area-chart-card">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-extrabold text-slate-800 text-sm tracking-tight flex items-center gap-1.5 text-left">
                  <TrendingUp className="w-4 h-4 text-blue-600" /> Sales Progress Track
                </h3>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setChartInterval("30")}
                    className={`px-3 py-1 text-[10px] font-mono font-bold rounded-lg transition-all ${
                      chartInterval === "30" ? "bg-slate-900 text-white" : "bg-slate-50 hover:bg-slate-100 text-slate-500"
                    }`}
                  >
                    30 Days
                  </button>
                  <button 
                    onClick={() => setChartInterval("180")}
                    className={`px-3 py-1 text-[10px] font-mono font-bold rounded-lg transition-all ${
                      chartInterval === "180" ? "bg-slate-900 text-white" : "bg-slate-50 hover:bg-slate-100 text-slate-500"
                    }`}
                  >
                    6 Months
                  </button>
                </div>
              </div>

              {/* Dynamic SVG with line path on values */}
              <div className="relative flex-1 bg-slate-50/50 rounded-2xl border border-slate-100 overflow-hidden p-2 flex items-center justify-center">
                
                {/* SVG Visual Layout representation */}
                <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="svgGradientFill" x1="0%" x2="0%" y1="0%" y2="100%">
                      <stop offset="0%" stopColor="#2563EB" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal grid guide lines */}
                  <line x1="0" y1="40" x2={svgWidth} y2="40" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3,3" />
                  <line x1="0" y1="80" x2={svgWidth} y2="80" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3,3" />
                  <line x1="0" y1="120" x2={svgWidth} y2="120" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3,3" />

                  {/* Area fill */}
                  <path d={areaD} fill="url(#svgGradientFill)" className="transition-all duration-500 ease-in-out" />
                  
                  {/* Stroke path */}
                  <path 
                    d={pathD} 
                    fill="none" 
                    stroke="#2563EB" 
                    strokeWidth="3.5" 
                    strokeLinecap="round" 
                    className="transition-all duration-500 ease-in-out"
                  />

                  {/* Interactive Dot checkpoints */}
                  {points.map((pt, idx) => (
                    <g 
                      key={idx}
                      onMouseEnter={() => setHoveredPointIndex(idx)}
                      onMouseLeave={() => setHoveredPointIndex(null)}
                      className="cursor-pointer group"
                    >
                      <circle 
                        cx={pt.x} 
                        cy={pt.y} 
                        r={hoveredPointIndex === idx ? "7" : "4"} 
                        fill={hoveredPointIndex === idx ? "#2563EB" : "#FFFFFF"} 
                        stroke="#2563EB" 
                        strokeWidth="2"
                        className="transition-all duration-150"
                      />
                    </g>
                  ))}
                </svg>

                {/* Simulated Tooltip */}
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-xs px-2.5 py-1.5 rounded-lg border border-slate-100 shadow-sm text-[10px] text-left">
                  {hoveredPointIndex !== null ? (
                    <div>
                      <span className="font-bold text-blue-600 block">{points[hoveredPointIndex].label}</span>
                      <span className="font-mono font-black text-slate-800">${points[hoveredPointIndex].value.toLocaleString()}</span>
                    </div>
                  ) : (
                    <div>
                      <span className="text-slate-400 block uppercase font-bold text-[8px]">Scan checkpoint</span>
                      <span className="font-semibold text-slate-700">Hover nodes to view</span>
                    </div>
                  )}
                </div>

              </div>

              <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mt-2">
                <span>Start interval scale</span>
                <span>Authorized trade indicators</span>
                <span>Active indices locked</span>
              </div>
            </div>

            {/* Horizontal Bar Chart: Category share */}
            <div className="md:col-span-5 bg-white p-6 rounded-3xl border border-slate-150 flex flex-col justify-between h-[360px] text-left" id="category-share-card">
              <div className="space-y-1">
                <h3 className="font-extrabold text-slate-800 text-sm tracking-tight">Category Distribution</h3>
                <p className="text-[11px] text-slate-400">Merchant portfolio category inventory index share.</p>
              </div>

              <div className="space-y-4 my-2">
                
                {/* Bar 1 */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-700">Electronics</span>
                    <span className="font-mono font-bold text-blue-600">45%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full transition-all duration-1000" style={{ width: "45%" }} />
                  </div>
                </div>

                {/* Bar 2 */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-700">Fashion</span>
                    <span className="font-mono font-bold text-emerald-600">30%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full rounded-full transition-all duration-1000" style={{ width: "30%" }} />
                  </div>
                </div>

                {/* Bar 3 */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-700">Home Decor & Craft</span>
                    <span className="font-mono font-bold text-amber-500">15%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full transition-all duration-1000" style={{ width: "15%" }} />
                  </div>
                </div>

                {/* Bar 4 */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-700">Vehicles & Parts</span>
                    <span className="font-mono font-bold text-slate-500">10%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-slate-500 h-full rounded-full transition-all duration-1000" style={{ width: "10%" }} />
                  </div>
                </div>

              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-150 text-[10px] text-slate-500 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <p className="leading-snug">Calculated from verified block-trade hand-offs within active neighborhood safe zones.</p>
              </div>
            </div>

          </div>

          {/* ACTIVE ONBOARDING PROGRAM COMPACT CARD */}
          <div className="bg-emerald-900 text-white p-6 rounded-3xl border border-emerald-800 text-left relative overflow-hidden" id="dashboard-onboarding-banner">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle_at_right,rgba(16,185,129,0.3),transparent)] pointer-events-none" />
            <div className="max-w-xl space-y-4 relative z-10">
              <span className="bg-emerald-800 text-emerald-300 text-[10px] font-bold font-mono px-2.5 py-1 rounded-full uppercase tracking-widest inline-block">Security program S8-S11</span>
              <h2 className="text-xl font-bold tracking-tight text-white leading-tight">Elevate your neighborhood trust multiplier cleanly.</h2>
              <p className="text-xs text-emerald-200 leading-normal">
                Lock down your local physical coordinates and secure communication safe-zones. Verifying your escrow index multiplies listing impressions by 3.2x nearby!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <button 
                  onClick={() => {
                    onUpdateUser({ onboardingStep: 1 });
                    onNavigate("/dashboard");
                  }}
                  className="cursor-pointer bg-white hover:bg-slate-100 text-emerald-900 font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md inline-block text-center"
                >
                  Configure Safe Coordinates
                </button>
                <div className="flex items-center gap-2 text-emerald-300 text-[10px] font-mono">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Authorized under Double-Lock protocols
                </div>
              </div>
            </div>
          </div>

          {/* RECENT ACTIVITY TABLE WITH SEARCH & DETAILED INTERCONNECTED FILTERS */}
          <div className="bg-white border border-slate-150 rounded-2xl overflow-hidden shadow-sm" id="recent-activity-card">
            
            <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left">
              <div>
                <h3 className="font-extrabold text-slate-800 text-sm">Recent Activity Ledger</h3>
                <p className="text-xs text-slate-400">Inspect neighborhood transactions, processing coordinates, and active bargains.</p>
              </div>

              {/* Activity search engine layout representation */}
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
                <input
                  type="text"
                  placeholder="Filter by Order # or Buyer..."
                  value={activitySearchQuery}
                  onChange={(e) => setActivitySearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-150">
                    <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Order #</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Buyer</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Item Title</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans text-xs">
                  {filteredActivities.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">
                        No transactions found matching "{activitySearchQuery}". Let's search other criteria!
                      </td>
                    </tr>
                  ) : (
                    filteredActivities.map((act, index) => (
                      <tr key={`${act.orderId}-${index}`} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-800 font-mono">
                          {act.orderId}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center text-[10px] uppercase font-mono">
                              {act.initials}
                            </div>
                            <div>
                              <span className="font-semibold text-slate-800 block">{act.buyerName}</span>
                              <span className="text-[9px] text-slate-400 block">{act.time}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 max-w-[180px] truncate">
                          <span className="text-slate-600 font-medium">{act.itemTitle}</span>
                        </td>
                        <td className="px-6 py-4 font-bold font-mono text-slate-800">
                          ${act.amount}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-extrabold ${
                            act.status === "completed" 
                              ? "bg-emerald-50 text-emerald-800"
                              : act.status === "processing"
                              ? "bg-amber-50 text-amber-800"
                              : act.status === "shipped"
                              ? "bg-blue-50 text-blue-800"
                              : "bg-red-50 text-red-800"
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              act.status === "completed" 
                                ? "bg-emerald-500" 
                                : act.status === "processing"
                                ? "bg-amber-500"
                                : act.status === "shipped"
                                ? "bg-blue-500"
                                : "bg-red-500"
                            }`} />
                            {act.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => {
                              alert(`Order detail coordinate verified. Escrow secure hand-off tracking for product: ${act.itemTitle}`);
                            }}
                            className="cursor-pointer text-blue-600 hover:text-blue-800 font-bold"
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-[10px] font-mono text-slate-400">
              <span>Showing {filteredActivities.length} recent operations registers</span>
              <span>All balances shielded under escrow guarantees S10.</span>
            </div>

          </div>

          {/* ACTIVE DEALS / ORDERS CONTROL ROW */}
          <div className="bg-white p-6 rounded-2xl border border-slate-150 space-y-4" id="deal-ledger-card">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 text-left">
              <div>
                <h3 className="font-extrabold text-slate-800 text-sm">Escrow Orders Tracker</h3>
                <p className="text-xs text-slate-400">Initiate dispatch clearances, download labels, or authorize payments.</p>
              </div>
              <button
                onClick={() => onNavigate("/products")}
                className="cursor-pointer text-xs text-blue-600 hover:text-blue-700 font-bold"
              >
                Browse Marketplace Stores S17 →
              </button>
            </div>

            {orders.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs" id="empty-ledger-view">
                No active trade orders linked on this simulation preset. Try opening catalog items on the Products menu!
              </div>
            ) : (
              <div className="divide-y divide-slate-100" id="orders-list">
                {orders.map((ord) => {
                  const isBuyerPerspective = ord.buyerId === currentUser.userId;

                  return (
                    <div key={ord.orderId} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row justify-between sm:items-center gap-4 text-left" id={`order-${ord.orderId}`}>
                      <div className="flex items-center gap-3">
                        <img
                          src={ord.productImage}
                          className="w-12 h-12 object-cover rounded-lg border border-slate-200"
                          alt={ord.productTitle}
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-800 text-xs">{ord.productTitle}</h4>
                            <span className={`text-[10px] font-mono font-medium tracking-wide px-2 py-0.5 rounded-full ${
                              ord.status === "shipped" ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700"
                            }`}>
                              {ord.status.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                            ORDERID: {ord.orderId} | {isBuyerPerspective ? `Seller: ${ord.sellerName}` : "Buyer Interested Partner"} 
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 self-end sm:self-auto">
                        <div className="text-right font-mono text-xs font-semibold text-slate-700">
                          ${ord.price}
                        </div>

                        {/* Operational triggers */}
                        {ord.status === "processing" && !isBuyerPerspective && (
                          <button
                            onClick={() => onUpdateOrder(ord.orderId, "shipped")}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all"
                          >
                            <Package className="w-3.5 h-3.5" /> Dispatch Item
                          </button>
                        )}
                        {ord.status === "shipped" && isBuyerPerspective && (
                          <button
                            onClick={() => onUpdateOrder(ord.orderId, "delivered")}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all"
                          >
                            Accept Hand-off & Release
                          </button>
                        )}
                        {ord.status === "delivered" && (
                          <span className="text-emerald-600 font-bold text-[10px] flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Settled Deal
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
