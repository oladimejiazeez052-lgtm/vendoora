/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { AppState, Product, ChatSession, UserProfile, Order, AppNotification } from "./types";
import { 
  INITIAL_PRODUCTS, INITIAL_USER, INITIAL_NOTIFICATIONS, 
  INITIAL_ORDERS, INITIAL_CHATS, CATEGORIES 
} from "./data";

// Extracted Sub-Views
import LandingView from "./components/LandingView";
import DashboardView from "./components/DashboardView";
import ProductExplorerView from "./components/ProductExplorerView";
import AIListingArchitectView from "./components/AIListingArchitectView";
import NegotiationChatView from "./components/NegotiationChatView";
import AnalyticsView from "./components/AnalyticsView";
import AdminModerationView from "./components/AdminModerationView";
import DesignSystemView from "./components/DesignSystemView";
import AuthView from "./components/AuthView";
import OnboardingView from "./components/OnboardingView";
import StorefrontView from "./components/StorefrontView";

import { 
  ShieldCheck, Layout, MessageSquare, Sparkles, Sliders, BarChart2, 
  HelpCircle, LogIn, Bell, Menu, Smartphone, Monitor, ChevronRight, Check, X, ShieldAlert 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  // Global React States
  const [products, setProducts] = React.useState<Product[]>(INITIAL_PRODUCTS);
  const [chats, setChats] = React.useState<ChatSession[]>(INITIAL_CHATS);
  const [currentUser, setCurrentUser] = React.useState<UserProfile>(INITIAL_USER);
  const [orders, setOrders] = React.useState<Order[]>(INITIAL_ORDERS);
  const [notifications, setNotifications] = React.useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  
  // Navigation coordinates
  const [selectedRoute, setSelectedRoute] = React.useState<string>("/");
  const [selectedSellerId, setSelectedSellerId] = React.useState<string | undefined>(undefined);
  const [selectedChatId, setSelectedChatId] = React.useState<string | undefined>(undefined);
  
  // General search query
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  // Responsive layout viewport simulation (Desktop vs Mock Mobile Frame 375px!)
  const [isMobileSimulation, setIsMobileSimulation] = React.useState<boolean>(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = React.useState<boolean>(false);
  
  // Notification popover overlay state
  const [showNotificationPopover, setShowNotificationPopover] = React.useState<boolean>(false);

  // Redirection handler for Modern Craft Co. S20 Storefront
  React.useEffect(() => {
    if (selectedSellerId === "sell-mcc") {
      setSelectedRoute("/shop/modern-craft-co");
      setSelectedSellerId(undefined);
    }
  }, [selectedSellerId]);

  // Core state dispatchers
  const handleUpdateUser = (updated: Partial<UserProfile>) => {
    setCurrentUser((prev) => ({ ...prev, ...updated }));
  };

  const handleAddProduct = (newProduct: Product) => {
    // Add new product, automatically incrementing listings indicators
    setProducts((prev) => [newProduct, ...prev]);
    handleUpdateUser({ listingsCreated: currentUser.listingsCreated + 1 });
  };

  const handleAddOrder = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    handleUpdateUser({ purchasedCount: currentUser.purchasedCount + 1 });
  };

  const handleAddChat = (newChat: ChatSession) => {
    // Avoid double creation of chat for the same product + buyer
    const exists = chats.find((c) => c.chatId === newChat.chatId);
    if (!exists) {
      setChats((prev) => [newChat, ...prev]);
      setSelectedChatId(newChat.chatId);
    } else {
      setSelectedChatId(exists.chatId);
    }
  };

  const handleUpdateChat = (chatId: string, updated: Partial<ChatSession>) => {
    setChats((prev) =>
      prev.map((c) => (c.chatId === chatId ? { ...c, ...updated } : c))
    );
  };

  const handleUpdateOrder = (orderId: string, status: "processing" | "shipped" | "delivered" | "flagged") => {
    setOrders((prev) =>
      prev.map((o) => (o.orderId === orderId ? { ...o, status } : o))
    );

    // If order was delivered, reward seller sales count
    if (status === "delivered") {
      const targetOrd = orders.find((o) => o.orderId === orderId);
      if (targetOrd && targetOrd.sellerId === currentUser.userId) {
        handleUpdateUser({ salesCount: currentUser.salesCount + 1 });
      }
    }
  };

  const handleUpdateProductStatus = (
    productId: string, 
    status: "active" | "sold" | "moderation_review" | "flagged",
    reason?: string
  ) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, status, moderationReason: reason } : p))
    );
  };

  const handleNotificationRead = (notifId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, read: true } : n))
    );
  };

  const handleNavigate = (route: string) => {
    setSelectedRoute(route);
    setIsMobileNavOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  // View routing switcher
  const renderCoreView = () => {
    if (currentUser.onboardingStep > 0 && selectedRoute !== "/login" && selectedRoute !== "/register") {
      return (
        <OnboardingView
          currentUser={currentUser}
          onUpdateUser={handleUpdateUser}
          onNavigate={handleNavigate}
        />
      );
    }

    switch (selectedRoute) {
      case "/":
        return (
          <LandingView
            products={products}
            onSearchProduct={(q) => setSearchQuery(q)}
            onNavigate={handleNavigate}
          />
        );
      case "/login":
        return (
          <AuthView
            mode="login"
            onNavigate={handleNavigate}
            onUpdateUser={handleUpdateUser}
          />
        );
      case "/register":
        return (
          <AuthView
            mode="register"
            onNavigate={handleNavigate}
            onUpdateUser={handleUpdateUser}
          />
        );
      case "/dashboard":
        return (
          <DashboardView
            currentUser={currentUser}
            orders={orders}
            products={products}
            chats={chats}
            onUpdateUser={handleUpdateUser}
            onUpdateOrder={handleUpdateOrder}
            onNavigate={handleNavigate}
          />
        );
      case "/products":
        return (
          <ProductExplorerView
            products={products}
            currentUser={currentUser}
            selectedSellerId={selectedSellerId}
            onSetSelectedSellerId={setSelectedSellerId}
            onNavigate={handleNavigate}
            onAddOrder={handleAddOrder}
            onAddChat={handleAddChat}
            onUpdateUser={handleUpdateUser}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        );
      case "/shop/modern-craft-co":
        return (
          <StorefrontView
            products={products}
            currentUser={currentUser}
            onNavigate={handleNavigate}
            onAddOrder={handleAddOrder}
            onAddChat={handleAddChat}
            onUpdateUser={handleUpdateUser}
          />
        );
      case "/messages":
        return (
          <NegotiationChatView
            currentUser={currentUser}
            chats={chats}
            products={products}
            onUpdateChat={handleUpdateChat}
            onNavigate={handleNavigate}
            selectedChatId={selectedChatId}
            onSetSelectedChatId={setSelectedChatId}
          />
        );
      case "/ai/list":
        return (
          <AIListingArchitectView
            currentUser={currentUser}
            products={products}
            onAddProduct={handleAddProduct}
            onNavigate={handleNavigate}
          />
        );
      case "/analytics":
        return (
          <AnalyticsView 
            products={products} 
            orders={orders} 
          />
        );
      case "/admin":
        return (
          <AdminModerationView
            products={products}
            onUpdateProductStatus={handleUpdateProductStatus}
          />
        );
      case "/design-system":
        return <DesignSystemView />;
      default:
        return (
          <div className="py-20 text-center space-y-4" id="view-404">
            <h2 className="text-3xl font-extrabold text-slate-800">S39 Route Coordinate Unresolved</h2>
            <p className="text-slate-500 text-sm">Our geographical escrow indexes cannot place this destination view.</p>
            <button
              onClick={() => handleNavigate("/")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-xl text-xs"
            >
              Back to safe landing harbor
            </button>
          </div>
        );
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans antialiased text-slate-800" id="vendoora-app-root">
      
      {/* Viewport Simulation Header Switcher */}
      <div className="bg-slate-900 text-white py-2 px-4 flex justify-between items-center text-xs border-b border-slate-800 shadow-sm relative z-50">
        <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-slate-400 flex items-center gap-1.5">
          <Smartphone className="w-3.5 h-3.5" /> Viewport Simulator Center
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setIsMobileSimulation(false)}
            className={`cursor-pointer px-3 py-1 rounded-md font-semibold transition-all flex items-center gap-1.5 ${
              !isMobileSimulation ? "bg-blue-600 text-white" : "hover:bg-slate-800 text-slate-300"
            }`}
          >
            <Monitor className="w-3.5 h-3.5" /> Desktop view
          </button>
          <button
            onClick={() => setIsMobileSimulation(true)}
            className={`cursor-pointer px-3 py-1 rounded-md font-semibold transition-all flex items-center gap-1.5 ${
              isMobileSimulation ? "bg-blue-600 text-white" : "hover:bg-slate-800 text-slate-300"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" /> Mobile S3/S13 Layout (375px)
          </button>
        </div>
      </div>

      {/* Main outer simulation framing */}
      <div className={`transition-all duration-300 ${
        isMobileSimulation ? "max-w-[375px] mx-auto border-x-4 border-t-8 border-b-8 border-slate-800 rounded-[30px] my-6 bg-slate-50 shadow-2xl h-[812px] overflow-hidden flex flex-col justify-between" : "w-full"
      }`}>
        
        {/* Core shell container */}
        <div className={`${isMobileSimulation ? "h-full overflow-y-auto flex flex-col" : "min-h-screen flex flex-col justify-between"}`}>
          
          {/* Header Layout Shell */}
          <header className="bg-white border-b border-slate-150 sticky top-0 z-30" id="main-header">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
              
              {/* Logo / Home trigger */}
              <button
                onClick={() => handleNavigate("/")}
                className="flex items-center gap-2 cursor-pointer outline-hidden group"
                id="main-logo-anchor"
              >
                <div className="w-9 h-9 bg-blue-600 text-white rounded-xl flex items-center justify-center font-extrabold text-lg shadow-md transition-transform group-hover:scale-105">
                  V
                </div>
                <span className="font-extrabold tracking-tight text-slate-800 text-lg group-hover:text-blue-600 transition-colors">
                  Vendoora
                </span>
              </button>

              {/* Navigation list */}
              <nav className="hidden md:flex gap-1 text-xs" id="nav-desktop-tabs">
                <button
                  onClick={() => handleNavigate("/")}
                  className={`px-3 py-2 rounded-xl font-semibold transition-colors cursor-pointer ${
                    selectedRoute === "/" ? "bg-slate-100 text-blue-600 font-bold" : "text-slate-600 hover:text-slate-950"
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => handleNavigate("/products")}
                  className={`px-3 py-2 rounded-xl font-semibold transition-colors cursor-pointer ${
                    selectedRoute === "/products" ? "bg-slate-100 text-blue-600 font-bold" : "text-slate-600 hover:text-slate-950"
                  }`}
                >
                  Products S17
                </button>
                <button
                  onClick={() => handleNavigate("/dashboard")}
                  className={`px-3 py-2 rounded-xl font-semibold transition-colors cursor-pointer ${
                    selectedRoute === "/dashboard" ? "bg-slate-100 text-blue-600 font-bold" : "text-slate-600 hover:text-slate-950"
                  }`}
                >
                  Dashboard S12
                </button>
                <button
                  onClick={() => handleNavigate("/ai/list")}
                  className={`px-3 py-2 rounded-xl font-semibold transition-colors text-blue-700 bg-blue-50 hover:bg-blue-100 cursor-pointer flex items-center gap-1`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Architect S25
                </button>
                <button
                  onClick={() => handleNavigate("/messages")}
                  className={`px-3 py-2 rounded-xl font-semibold transition-colors cursor-pointer ${
                    selectedRoute === "/messages" ? "bg-slate-100 text-blue-600 font-bold" : "text-slate-600 hover:text-slate-950"
                  }`}
                >
                  Bargains S21
                </button>
                <button
                  onClick={() => handleNavigate("/shop/modern-craft-co")}
                  className={`px-3 py-2 rounded-xl font-semibold transition-colors cursor-pointer ${
                    selectedRoute === "/shop/modern-craft-co" ? "bg-slate-100 text-blue-600 font-bold" : "text-slate-600 hover:text-slate-950"
                  }`}
                >
                  Store S20
                </button>
                <button
                  onClick={() => handleNavigate("/analytics")}
                  className={`px-3 py-2 rounded-xl font-semibold transition-colors cursor-pointer ${
                    selectedRoute === "/analytics" ? "bg-slate-100 text-blue-600 font-bold" : "text-slate-600 hover:text-slate-950"
                  }`}
                >
                  Stats S28
                </button>
                <button
                  onClick={() => handleNavigate("/admin")}
                  className={`px-3 py-2 rounded-xl font-semibold transition-colors cursor-pointer ${
                    selectedRoute === "/admin" ? "bg-slate-100 text-blue-600 font-bold" : "text-slate-600 hover:text-slate-950"
                  }`}
                >
                  Mod S34
                </button>
                <button
                  onClick={() => handleNavigate("/design-system")}
                  className={`px-3 py-2 rounded-xl font-semibold transition-colors cursor-pointer ${
                    selectedRoute === "/design-system" ? "bg-slate-100 text-blue-600 font-bold" : "text-slate-600 hover:text-slate-950"
                  }`}
                >
                  S1 Guidelines
                </button>
              </nav>

              {/* Utility actions side */}
              <div className="flex items-center gap-3" id="header-utilities">
                
                {/* Notifications trigger bell */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotificationPopover(!showNotificationPopover)}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 relative cursor-pointer"
                    title="Open notifications register"
                  >
                    <Bell className="w-4 h-4" />
                    {unreadNotifCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white font-mono text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center animate-pulse">
                        {unreadNotifCount}
                      </span>
                    )}
                  </button>

                  {/* Popover overlay dropdown */}
                  <AnimatePresence>
                    {showNotificationPopover && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-72 bg-white rounded-xl border border-slate-200 shadow-xl z-50 p-3 space-y-2 text-xs"
                        id="notifications-popover"
                      >
                        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                          <span className="font-bold text-slate-800">Notifications Desk</span>
                          <button 
                            onClick={() => setShowNotificationPopover(false)} 
                            className="text-slate-400 hover:text-slate-600 font-bold"
                          >
                            ✕
                          </button>
                        </div>
                        <div className="space-y-2 max-h-48 overflow-y-auto" id="popover-notifs-feed">
                          {notifications.map((notif) => (
                            <div
                              key={notif.id}
                              onClick={() => handleNotificationRead(notif.id)}
                              className={`p-2 rounded-lg border cursor-pointer text-left ${
                                notif.read ? "bg-slate-50/50 border-slate-100" : "bg-blue-50/40 border-blue-100"
                              }`}
                            >
                              <div className="flex justify-between items-center font-bold text-slate-800">
                                <span>{notif.title}</span>
                                {!notif.read && <span className="h-1.5 w-1.5 bg-blue-500 rounded-full" />}
                              </div>
                              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{notif.description}</p>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Mobile Drawer menu list button */}
                <button
                  onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
                  className="md:hidden p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
                >
                  <Menu className="w-4.5 h-4.5" />
                </button>

                {/* Secure Auth profile shortcut */}
                <button
                  onClick={() => handleNavigate("/login")}
                  className="hidden sm:flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2 px-3.5 rounded-xl cursor-pointer shadow-sm shadow-slate-900/10"
                >
                  <LogIn className="w-3.5 h-3.5" /> Account S4
                </button>
              </div>

            </div>

            {/* Mobile Nav Drawer overlay list (S15/S16 representation) */}
            <AnimatePresence>
              {isMobileNavOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="md:hidden border-t border-slate-150 bg-white shadow-inner flex flex-col p-4 space-y-2 text-xs text-left"
                  id="mobile-drawer-overlay"
                >
                  <button onClick={() => handleNavigate("/")} className="py-2.5 px-3 rounded-lg hover:bg-slate-50 font-bold block">
                    Home
                  </button>
                  <button onClick={() => handleNavigate("/products")} className="py-2.5 px-3 rounded-lg hover:bg-slate-50 font-bold block text-blue-600">
                    Discover Listings S17
                  </button>
                  <button onClick={() => handleNavigate("/dashboard")} className="py-2.5 px-3 rounded-lg hover:bg-slate-50 font-bold block">
                    Dashboard S12
                  </button>
                  <button onClick={() => handleNavigate("/ai/list")} className="py-2.5 px-3 rounded-lg bg-blue-50 hover:bg-blue-100 font-bold block text-blue-700">
                    AI Listing Architect S25
                  </button>
                  <button onClick={() => handleNavigate("/messages")} className="py-2.5 px-3 rounded-lg hover:bg-slate-50 font-bold block">
                    Continuous Negotiate S21
                  </button>
                  <button onClick={() => handleNavigate("/shop/modern-craft-co")} className="py-2.5 px-3 rounded-lg hover:bg-slate-50 font-bold block text-blue-600">
                    Artisan Store S20
                  </button>
                  <button onClick={() => handleNavigate("/analytics")} className="py-2.5 px-3 rounded-lg hover:bg-slate-50 font-bold block">
                    Metrics Reports S28
                  </button>
                  <button onClick={() => handleNavigate("/admin")} className="py-2.5 px-3 rounded-lg hover:bg-slate-50 font-bold block">
                    Moderator Center S34
                  </button>
                  <button onClick={() => handleNavigate("/design-system")} className="py-2.5 px-3 rounded-lg hover:bg-slate-50 font-bold block text-slate-500">
                    S1 Brand Coordinates
                  </button>
                  <button onClick={() => handleNavigate("/login")} className="w-full mt-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer">
                    <LogIn className="w-4 h-4" /> Account Login S4
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </header>

          {/* Active Main View Area */}
          <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full" id="core-content-frame">
            {renderCoreView()}
          </main>

          {/* Global platform footer */}
          <footer className="bg-white border-t border-slate-150 py-6 text-center text-[10px] text-slate-400 font-mono mt-auto" id="main-footer">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
              <span>© {new Date().getFullYear()} Vendoora. Integrated with Double-Lock Escrow Protection and Gemini 3.5.</span>
              <div className="flex gap-4">
                <button onClick={() => handleNavigate("/design-system")} className="hover:underline">S1 DESIGN SYSTEM</button>
                <button onClick={() => handleNavigate("/admin")} className="hover:underline">S34 MODERATION</button>
              </div>
            </div>
          </footer>

        </div>

      </div>

    </div>
  );
}
