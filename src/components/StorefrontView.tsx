import React from "react";
import { Product, UserProfile, Order, ChatSession } from "../types";
import { 
  Star, Share2, MapPin, Sparkles, MessageSquare, 
  Check, Heart, ShoppingCart, ArrowLeft, ShieldCheck, Award, Info, Users, MessageCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface StorefrontViewProps {
  products: Product[];
  currentUser: UserProfile;
  onNavigate: (route: string) => void;
  onAddOrder: (order: Order) => void;
  onAddChat: (chat: ChatSession) => void;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
}

export default function StorefrontView({
  products,
  currentUser,
  onNavigate,
  onAddOrder,
  onAddChat,
  onUpdateUser
}: StorefrontViewProps) {
  const [isFollowing, setIsFollowing] = React.useState(false);
  const [copiedShare, setCopiedShare] = React.useState(false);
  const [likedListings, setLikedListings] = React.useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);

  // Filter products by seller id 'sell-mcc' (Modern Craft Co.)
  const shopListings = products.filter(
    (p) => p.sellerId === "sell-mcc" && p.status === "active"
  );

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
  };

  const handleShareClick = () => {
    setCopiedShare(true);
    setTimeout(() => {
      setCopiedShare(false);
    }, 2000);
  };

  const handleToggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (likedListings.includes(id)) {
      setLikedListings(likedListings.filter((lId) => lId !== id));
    } else {
      setLikedListings([...likedListings, id]);
    }
  };

  const handleMessageMerchant = (product?: Product) => {
    // Settle product placeholder
    const targetProduct = product || shopListings[0];
    if (!targetProduct) return;

    const newChat: ChatSession = {
      chatId: `chat-${targetProduct.id}-${currentUser.userId}`,
      productId: targetProduct.id,
      buyerId: currentUser.userId,
      buyerName: currentUser.username,
      currentOffer: targetProduct.price,
      sellerMinPrice: Math.round(targetProduct.price * 0.85),
      lastOfferSender: "buyer",
      status: "bargaining",
      lastUpdated: new Date().toISOString(),
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: "system",
          text: `Automated Escrow Trade Chat open with Modern Craft Co. regarding: "${targetProduct.title}". Settle pick-up parameters.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        {
          id: `msg-mcc-init-${Date.now()}`,
          sender: "buyer",
          text: `Hello Marcus! I saw the beautiful ${targetProduct.title} on your shop profile. What's the optimal window to take a look?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    };

    onAddChat(newChat);
    onNavigate("/messages"); // Instantly transition to the Messaging workspace
  };

  const handlePurchase = (product: Product) => {
    if (currentUser.walletBalance < product.price) {
      alert(`Insufficient funds! Please fund your wallet in the Dashboard. Your balance: $${currentUser.walletBalance}, Product cost: $${product.price}`);
      return;
    }

    // Deduct user wallet
    onUpdateUser({ walletBalance: currentUser.walletBalance - product.price });

    // Settle product status as finished
    product.status = "sold";

    const newOrder: Order = {
      orderId: `ord-mcc-${Math.floor(100 + Math.random() * 900)}`,
      productId: product.id,
      productTitle: product.title,
      productImage: product.image,
      price: product.price,
      buyerId: currentUser.userId,
      sellerId: "sell-mcc",
      sellerName: "Modern Craft Co.",
      status: "processing",
      createdAt: new Date().toISOString()
    };

    onAddOrder(newOrder);
    setSelectedProduct(null);
    alert(`Success! $${product.price} has been committed to secure Double-Lock Escrow. Marcus and team are preparing your custom furniture item.`);
    onNavigate("/dashboard");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-6 pb-12"
      id="storefront-page-container"
    >
      {/* Return Navigation */}
      <div className="flex justify-between items-center bg-white px-5 py-3 rounded-2xl border border-slate-150 shadow-2xs">
        <button
          onClick={() => onNavigate("/products")}
          className="text-xs text-slate-600 hover:text-slate-900 font-bold flex items-center gap-2 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-blue-600" /> Back to Local Market
        </button>
        <div className="text-[10px] uppercase font-mono font-bold text-slate-400">
          Viewing Merchant: MC-9029
        </div>
      </div>

      {/* Main Cover Banner & Avatar Card Grid */}
      <div className="bg-white rounded-[2rem] overflow-hidden border border-slate-150 shadow-xs relative" id="shop-banner-panel">
        
        {/* Cover Hero Photo Woodworking Studio from Mock */}
        <div className="h-56 md:h-72 w-full bg-slate-100 relative">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAH6b5YYXEXKHVzWW5crkxb2O9_N83ofw15bsN34utdejnlJrokbq2Kd3UAOMEZ4ykxczd7DFNyvuo4GfMuhrvZfgkXeCj9WMzWAYl-Ctw_XTaFauj5hTORYOvSxewPM2TM3a4ppDOPBM3BCay4-TN_crjykQ7Z2SEFJ8sUK7xooPM259NwP9F9OMUh8qs94w-YB5oxbMH8lLltWqwGuWg2YRnbsxNmEvXLdxP0OGiekyPLtRX1zDwpAeLmYxsUSXf5iP2Ct312EC4"
            className="w-full h-full object-cover brightness-95"
            alt="Woodworking Studio Cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>

        {/* Brand Details Bar (Slightly overlapping cover) */}
        <div className="p-6 md:p-8 pt-16 md:pt-20 relative flex flex-col md:flex-row justify-between items-start md:items-end gap-6" id="shop-brand-details">
          
          {/* Overlapping Brand Logo Woodgrain from Mock */}
          <div className="absolute -top-16 left-6 md:left-8 w-28 h-28 bg-white border border-slate-200 shadow-lg rounded-2xl overflow-hidden p-1 p-2">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAskbR2I5XPaV8F13s42XChuTIONROAioAf8IjkCa2TR1ilcsaIbbOl_RvDM0nyTW6Qn4XfrgGzUBBkufni8s97EmVbbOR9f-Br7FHFGPp8vU9y5QdUVG9m3Y7vv_KA3cvHhipR4J52aZ06baJ0kVlZzwH29yPQ3-lq5w2Xs8FxCtrdmrnzKXhAPAkj7G62AeickuVlGBKgdlNWQaW-WBTavk6AhFGI8weUBqL4Hf94-RIabXgMeyIGOAAYkncbIM6qxs8_LQHD048"
              className="w-full h-full object-contain rounded-xl"
              alt="Modern Craft Co. Logo"
            />
          </div>

          <div className="space-y-2 text-left">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Modern Craft Co.</h1>
              <span className="bg-blue-100 text-blue-800 font-mono text-[9px] font-bold px-2 py-0.5 rounded-md border border-blue-200 shrink-0 flex items-center gap-0.5">
                <Check className="w-3 h-3" /> VERIFIED MERCHANT
              </span>
            </div>
            
            <p className="text-slate-500 text-xs font-mono font-semibold flex items-center gap-3">
              <span className="flex items-center gap-1"><Star className="w-4 h-4 text-amber-400 fill-amber-400" /> 4.9 Rating (120 completions)</span>
              <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-slate-450" /> 1.2k Followers</span>
            </p>
          </div>

          {/* S20 Custom Actions - Follower, Share, and Message Options */}
          <div className="flex gap-2.5 shrink-0 w-full md:w-auto" id="shop-action-buttons">
            <button
              onClick={handleFollowToggle}
              className={`flex-grow md:flex-grow-0 text-xs font-extrabold px-6 py-2.5 rounded-xl transition-all shadow-2xs cursor-pointer ${
                isFollowing 
                  ? "bg-emerald-600 text-white hover:bg-emerald-700" 
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {isFollowing ? "✓ Following" : "Follow"}
            </button>
            <button
              onClick={handleShareClick}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer relative"
              title="Copy Storefront coordinates link"
            >
              <Share2 className="w-4.5 h-4.5" />
              {copiedShare && (
                <span className="absolute -top-10 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-bold px-2 py-1 rounded shadow-md whitespace-nowrap">
                  Link copied!
                </span>
              )}
            </button>
            <button
              onClick={() => handleMessageMerchant()}
              className="flex-grow md:flex-grow-0 text-xs font-extrabold bg-slate-900 text-white hover:bg-slate-800 px-6 py-2.5 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" /> Message Merchant
            </button>
          </div>

        </div>
      </div>

      {/* Profile Sidebar Info and Listings Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="storefront-body-grid">
        
        {/* Sidebar Info - About the shop (4 columns) */}
        <div className="lg:col-span-4 space-y-6" id="storefield-sidebar">
          
          <div className="bg-white rounded-3xl border border-slate-150 p-6 space-y-5 text-left shadow-2xs">
            <h3 className="font-extrabold text-slate-950 font-sans text-sm pb-2 border-b border-slate-100 flex items-center gap-1.5">
              <Award className="w-4.5 h-4.5 text-blue-600" /> About the Shop
            </h3>
            
            <p className="text-slate-600 text-xs leading-relaxed font-normal">
              Curating bespoke timber furniture and contemporary home accents. Every piece is handcrafted in our Seattle studio with a focus on sustainable sourcing and architectural integrity.
            </p>

            {/* Profile Owner Detail */}
            <div className="pt-2 flex items-center gap-3.5" id="storefront-craftsman">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBhQQEcJyeF60DTGjRaWzRHZrfMaaM77GaS4A9AwUIHM8g6WIg2fQqnhdeAYQU7uk3-st4MukG5LacVYRb_TrOvlw6XDgXJZS02eDiJfHFEaYzAosZpbLNZYUfgh-m8cP4l_-3YzEPIRtn9_xjZ9Q95XSc3vx0G9eS_dWYWPZ4B2IYANbbM5ymSjmdCjPWuvP3jy7XjeVlwExu-Xmrw2QyI922uxkpad1PYtBw2cAVCqCCp5I1yfo5LbPKV1Kqf13CCMylNe048nX0"
                className="w-12 h-12 object-cover rounded-full border border-slate-100 shadow-sm"
                alt="Marcus Chen Woodworker"
              />
              <div className="text-xs">
                <span className="block font-bold text-slate-800">Marcus Chen</span>
                <span className="text-[10px] text-slate-400 uppercase font-mono font-bold tracking-wider">Master Craftsperson</span>
              </div>
            </div>

            {/* General Escrow statistics */}
            <div className="space-y-3.5 pt-3.5 border-t border-slate-100 text-xs font-semibold text-slate-700" id="storefront-metas">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400 font-medium flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> Location:</span>
                <span className="text-slate-900 font-bold">Seattle, WA, USA</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400 font-medium flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5 text-slate-400" /> Response:</span>
                <span className="text-slate-900 font-bold">Typically responds in 2 hrs</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400 font-medium flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Escrow Sales:</span>
                <span className="text-slate-900 font-bold">450+ completed</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400 font-medium flex items-center gap-1"><Info className="w-3.5 h-3.5 text-blue-600" /> On-Time Rate:</span>
                <span className="text-slate-900 font-bold text-emerald-700">99% excellence rating</span>
              </div>
            </div>
          </div>

          {/* Secure Double-Lock escrow banner */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-3xl p-5 text-left space-y-4 shadow-sm" id="storefront-escrow-promo">
            <Award className="w-8 h-8 text-white/90" />
            <div className="space-y-1">
              <h4 className="font-extrabold text-white text-sm tracking-tight">Double-Lock Escrow Protected</h4>
              <p className="text-[11px] text-blue-100 leading-relaxed font-sans">
                Vendoora guarantees absolute safety. Funds are held securely until the handcrafted products are physically inspected at verification locations.
              </p>
            </div>
            <div className="text-[9px] font-mono font-bold uppercase tracking-wider text-white/50 pt-2 border-t border-white/10">
              Licence Coordinate: VEN-CRAFT-ESC
            </div>
          </div>
        </div>

        {/* Listings display (8 columns) */}
        <div className="lg:col-span-8 space-y-5" id="storefield-listings-feed">
          <div className="flex justify-between items-baseline text-left p-1" id="feed-header">
            <h2 className="text-lg font-black tracking-tight text-slate-900">Active Handcrafted Listings <span className="text-xs text-slate-400 font-mono font-semibold">({shopListings.length})</span></h2>
            <span className="text-xs text-slate-400 font-semibold font-mono">Sorted: Modern Studio Crafts</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5" id="storefront-listings-grid">
            {shopListings.map((p) => {
              const isLiked = likedListings.includes(p.id);
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedProduct(p)}
                  className="bg-white rounded-2xl border border-slate-150 overflow-hidden hover:shadow-md hover:scale-[1.01] transition-all cursor-pointer relative flex flex-col justify-between"
                  id={`mcc-product-card-${p.id}`}
                >
                  <div className="relative">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-full h-44 object-cover"
                    />
                    
                    {/* Like button floating */}
                    <button
                      onClick={(e) => handleToggleLike(p.id, e)}
                      className="absolute top-2.5 right-2.5 bg-white/90 hover:bg-white p-2 rounded-full border border-slate-100 shadow-sm transition-colors text-slate-600 hover:text-red-500"
                    >
                      <Heart className={`w-4.5 h-4.5 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
                    </button>
                    
                    <span className="absolute bottom-2.5 left-2.5 bg-slate-950/75 backdrop-blur-xs text-white text-[9px] font-bold px-2.5 py-0.5 rounded-sm">
                      {p.condition}
                    </span>
                  </div>

                  <div className="p-4 flex-grow flex flex-col justify-between space-y-4 text-left">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-blue-600 tracking-wider font-mono block mb-0.5">{p.category}</span>
                      <h3 className="font-extrabold text-slate-900 tracking-tight group-hover:text-blue-600 leading-snug lines-2 text-sm">
                        {p.title}
                      </h3>
                    </div>

                    <div className="flex justify-between items-center pt-2.5 border-t border-slate-50">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400">List Price</span>
                        <span className="font-mono text-lg font-black text-slate-950">${p.price}.00</span>
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMessageMerchant(p);
                        }}
                        className="text-[10px] bg-slate-100 hover:bg-slate-200 border border-slate-150 text-slate-700 font-extrabold px-3 py-2 rounded-xl transition-colors flex items-center gap-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-blue-600" /> S17 Message
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Single Product Context Detail Dialog */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-150 shadow-2xl"
              id="details-mcc-modal"
            >
              <div className="relative">
                <img
                  src={selectedProduct.image}
                  className="w-full h-64 object-cover"
                  alt={selectedProduct.title}
                />
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-4 right-4 bg-slate-900/70 text-white rounded-full p-2 hover:bg-slate-900 font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 md:p-8 space-y-6 text-left">
                <div>
                  <div className="flex gap-2 items-center">
                    <span className="text-xs uppercase font-bold text-blue-600 font-mono tracking-wider">
                      {selectedProduct.category}
                    </span>
                    <span className="bg-slate-100 text-slate-600 font-bold text-[10px] px-2 py-0.5 rounded-sm">
                      {selectedProduct.condition}
                    </span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-extrabold text-slate-800 tracking-tight mt-1">
                    {selectedProduct.title}
                  </h2>
                </div>

                <div className="p-4 rounded-xl border bg-emerald-50 border-emerald-150 text-emerald-800 flex gap-3" id="trust-modal-alert">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <h4 className="font-bold text-xs uppercase tracking-wide">
                      Vendoora Escrow Protected Wares
                    </h4>
                    <p className="text-xs text-slate-600 leading-normal mt-1">
                      {selectedProduct.trustAnalytics || "Eco-sourced timber logs coordinates validated. Physical structural check certified."}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Handcrafting & Materials</h4>
                  <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
                    {selectedProduct.description}
                  </p>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-slate-105">
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-400 font-mono">Asking Price</span>
                    <span className="text-2xl font-mono font-black text-slate-800">${selectedProduct.price}.00</span>
                  </div>

                  <div className="flex gap-2.5">
                    <button
                      onClick={() => handleMessageMerchant(selectedProduct)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 px-5 rounded-xl font-bold text-xs transition-colors flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-4 h-4 text-blue-600" /> S17 Message Settle
                    </button>

                    <button
                      onClick={() => handlePurchase(selectedProduct)}
                      className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-5 rounded-xl font-black text-xs shadow-md flex items-center gap-1.5 transition-all"
                    >
                      <ShoppingCart className="w-4 h-4" /> Secure Escrow Buy
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
