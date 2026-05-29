import React from "react";
import { UserProfile, Order, Product, ChatSession } from "../types";
import { 
  ShieldCheck, Wallet, ArrowUpRight, ArrowDownLeft, TrendingUp, CheckCircle, 
  Clock, Package, MessageSquare, ToggleLeft, ToggleRight, Sparkles, UserCheck 
} from "lucide-react";
import { motion } from "motion/react";

interface DashboardViewProps {
  currentUser: UserProfile;
  orders: Order[];
  products: Product[];
  chats: ChatSession[];
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onUpdateOrder: (orderId: string, status: "processing" | "shipped" | "delivered" | "flagged") => void;
  onNavigate: (route: string) => void;
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
  const [fundingAmount, setFundingAmount] = React.useState("");
  const [fundingMode, setFundingMode] = React.useState(false);

  // Toggle user role between Buyer and Seller to demonstrate different dashboards S12 & S13!
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

  // Onboarding simulation steps (S8-S11)
  const onboardingSteps = [
    { id: 1, title: "Register Profile Profile Details", desc: "S6/S7 standard sign-up layout constraints." },
    { id: 2, title: "Biometrical Proofing verification", desc: "S9 authentic selfie check for trust multiplier." },
    { id: 3, title: "Double-lock Escrow routing setup", desc: "S10 secure bank account pairing." },
    { id: 4, title: "Final Security PIN encryption", desc: "S11 layout code verification keys." }
  ];

  const handleCompleteOnboardingStep = (stepId: number) => {
    if (currentUser.onboardingStep < stepId) {
      const reward = stepId > currentUser.onboardingStep ? 2 : 0;
      onUpdateUser({ 
        onboardingStep: stepId,
        trustScore: Math.min(100, currentUser.trustScore + reward)
      });
    }
  };

  const myProducts = products.filter(p => p.sellerId === currentUser.userId);
  const activeChatCount = chats.filter(c => c.status === "bargaining").length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-10"
      id="dashboard-container"
    >
      {/* Top Welcome Panel with Role Switcher */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6" id="welcome-bar">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar}
            className="w-16 h-16 rounded-full border-2 border-blue-100 shadow-inner"
            alt={currentUser.username}
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-800">Welcome, {currentUser.username}</h1>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm">
                <ShieldCheck className="w-3 h-3" /> Level 1 Partner
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono mt-0.5">MEMBER_ID: VEND-00101 | {currentUser.email}</p>
          </div>
        </div>

        {/* Interactive Role Switcher toggle */}
        <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center justify-between gap-4" id="role-toggle-box">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Trading perspective</span>
            <span className="text-sm font-semibold text-slate-700 capitalize">{currentUser.role} mode</span>
          </div>
          <button
            onClick={toggleRole}
            className="text-blue-600 hover:text-blue-700 focus:outline-hidden transition-transform active:scale-95"
            title="Toggle between Buyer and Seller perspectives to view contextual stats"
            id="role-switch-button"
          >
            {currentUser.role === "buyer" ? (
              <ToggleLeft className="w-12 h-8 text-blue-500 cursor-pointer" />
            ) : (
              <ToggleRight className="w-12 h-8 text-emerald-500 cursor-pointer" />
            )}
          </button>
        </div>
      </div>

      {/* Bento Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="dashboard-bento-grid">
        {/* Wallet Balance Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4 flex flex-col justify-between" id="bento-wallet">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Double-Lock Wallet</span>
              <span className="text-3xl font-mono font-black text-slate-800">${currentUser.walletBalance.toLocaleString()}</span>
            </div>
            <div className="bg-blue-50 text-blue-600 p-3 rounded-xl">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          
          {fundingMode ? (
            <form onSubmit={handleFundWallet} className="flex gap-2" id="wallet-fund-form">
              <input
                type="number"
                placeholder="Amount ($)"
                value={fundingAmount}
                onChange={(e) => setFundingAmount(e.target.value)}
                className="w-full bg-slate-50 text-slate-800 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs outline-hidden focus:border-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg"
              >
                Go
              </button>
              <button
                type="button"
                onClick={() => setFundingMode(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-500 text-xs px-2 py-1.5 rounded-lg"
              >
                X
              </button>
            </form>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setFundingMode(true)}
                className="flex-grow bg-blue-600 hover:bg-blue-700 text-white text-xs py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-1 shadow-sm"
              >
                <ArrowDownLeft className="w-3.5 h-3.5" /> Fund Balance
              </button>
              <button
                onClick={() => alert("Payout will arrive at your linked bank account S10 within 1 business day.")}
                className="flex-grow bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-1"
              >
                <ArrowUpRight className="w-3.5 h-3.5" /> Withdraw
              </button>
            </div>
          )}
        </div>

        {/* Dynamic Vendoora Trust Score */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between space-y-4" id="bento-trust-score">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Trust-Score Index</span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-mono font-black text-slate-800">{currentUser.trustScore}</span>
                <span className="text-slate-400 text-sm">/ 100</span>
              </div>
            </div>
            <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-500 h-full transition-all duration-500" 
                style={{ width: `${currentUser.trustScore}%` }} 
              />
            </div>
            <p className="text-[10px] text-slate-500 flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-emerald-500" /> Complete onboarding steps below to elevate transaction visibility (+2 per step)
            </p>
          </div>
        </div>

        {/* Contextual Transaction Stats */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between space-y-4" id="bento-stats">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Market Activity</span>
              <span className="text-2xl font-bold font-mono text-slate-700">
                {currentUser.role === "buyer" 
                  ? `${currentUser.purchasedCount} Purchases` 
                  : `${myProducts.length} Listings Drafted`}
              </span>
            </div>
            <div className="bg-slate-50 text-slate-600 p-3 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="flex gap-4 text-xs text-slate-500 pt-2 border-t border-slate-50">
            <div className="flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5 text-blue-500" /> <span>{activeChatCount} Ongoing negotiations</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Onboarding Progress Tracker S8-S11 */}
      <div className="bg-gradient-to-r from-slate-50 to-blue-50/50 p-6 rounded-2xl border border-slate-150" id="onboarding-tracker">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wide text-blue-800">S8-S11 Onboarding and Trust Program</h3>
            <p className="text-xs text-slate-500 mt-0.5">Secure your P2P trade channels and increase limit capacities.</p>
          </div>
          <span className="text-xs font-mono font-bold text-blue-700 bg-blue-100/50 px-2.5 py-1 rounded-sm">
            {Math.round((currentUser.onboardingStep / 4) * 100)}% Complete
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="onboarding-cards-grid">
          {onboardingSteps.map((step) => {
            const isCompleted = currentUser.onboardingStep >= step.id;
            const isCurrent = currentUser.onboardingStep + 1 === step.id;

            return (
              <div
                key={step.id}
                onClick={() => handleCompleteOnboardingStep(step.id)}
                className={`relative p-4 border rounded-xl transition-all cursor-pointer select-none ${
                  isCompleted 
                    ? "bg-white border-blue-200 shadow-xs hover:border-blue-300" 
                    : isCurrent 
                    ? "bg-blue-600 text-white border-blue-600 shadow-md scale-[1.01]" 
                    : "bg-slate-50/60 text-slate-400 border-slate-200 hover:bg-slate-50"
                }`}
                id={`onboarding-step-${step.id}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                    isCompleted ? "bg-emerald-50 text-emerald-700" : isCurrent ? "bg-white/20 text-white" : "bg-slate-200 text-slate-500"
                  }`}>
                    STEP 0{step.id}
                  </span>
                  {isCompleted && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                </div>
                <h4 className="font-bold text-xs max-w-[90%] leading-tight text-inherit">{step.title}</h4>
                <p className={`text-[10px] mt-1 ${isCurrent ? "text-blue-100" : "text-slate-500"}`}>
                  {step.desc}
                </p>
                {isCurrent && (
                  <div className="absolute right-3 bottom-3 animate-ping w-2 h-2 rounded-full bg-blue-200" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Orders ledger / Active Shipments tracking */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4" id="recent-orders-card">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-800 text-base">Active Orders Tracker</h3>
            <p className="text-xs text-slate-500">Track shipments, download double-lock labels, or release payments.</p>
          </div>
          <button
            onClick={() => onNavigate("/orders")}
            className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
          >
            Manage All Orders S23
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-sm" id="empty-orders-ledger">
            No active trades listed or items ordered yet. Try buying a headphone or bike!
          </div>
        ) : (
          <div className="divide-y divide-slate-100" id="orders-list">
            {orders.map((ord) => {
              const isBuyerPerspective = ord.buyerId === currentUser.userId;

              return (
                <div key={ord.orderId} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row justify-between sm:items-center gap-4" id={`order-${ord.orderId}`}>
                  <div className="flex items-center gap-3">
                    <img
                      src={ord.productImage}
                      className="w-12 h-12 object-cover rounded-lg border border-slate-100"
                      alt={ord.productTitle}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-800 text-sm">{ord.productTitle}</h4>
                        <span className={`text-[10px] font-mono font-medium tracking-wide px-2 py-0.5 rounded-full ${
                          ord.status === "shipped" ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700"
                        }`}>
                          {ord.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">
                        ORDER_ID: {ord.orderId} | {isBuyerPerspective ? `Seller: ${ord.sellerName}` : "Buyer Interested Partner"} 
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-auto">
                    <div className="text-right font-mono text-sm font-semibold text-slate-700">
                      ${ord.price}
                    </div>

                    {/* Operational triggers */}
                    {ord.status === "processing" && !isBuyerPerspective && (
                      <button
                        onClick={() => onUpdateOrder(ord.orderId, "shipped")}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all"
                      >
                        <Package className="w-3.5 h-3.5" /> Dispatch Item
                      </button>
                    )}
                    {ord.status === "shipped" && isBuyerPerspective && (
                      <button
                        onClick={() => onUpdateOrder(ord.orderId, "delivered")}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
                      >
                        Release Funds (Deliver)
                      </button>
                    )}
                    {ord.status === "delivered" && (
                      <span className="text-emerald-600 font-bold text-xs flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-lg">
                        <CheckCircle className="w-3.5 h-3.5" /> Closed Deal
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}
