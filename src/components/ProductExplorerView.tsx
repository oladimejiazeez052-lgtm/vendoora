import React from "react";
import { Product, UserProfile, Order, ChatSession } from "../types";
import { CATEGORIES } from "../data";
import { 
  Search, ShieldCheck, Heart, AlertTriangle, ArrowLeft, Star, 
  MessageSquare, ShoppingCart, HelpCircle, User, MapPin 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ProductExplorerViewProps {
  products: Product[];
  currentUser: UserProfile;
  selectedSellerId?: string;
  onSetSelectedSellerId: (sellerId: string | undefined) => void;
  onNavigate: (route: string) => void;
  onAddOrder: (order: Order) => void;
  onAddChat: (chat: ChatSession) => void;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function ProductExplorerView({
  products,
  currentUser,
  selectedSellerId,
  onSetSelectedSellerId,
  onNavigate,
  onAddOrder,
  onAddChat,
  onUpdateUser,
  searchQuery,
  setSearchQuery
}: ProductExplorerViewProps) {
  const [selectedCategory, setSelectedCategory] = React.useState("All Categories");
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [likedProducts, setLikedProducts] = React.useState<string[]>([]);

  // Filter products based on search query, category, and status (only active, except in review for mod demonstration)
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === "All Categories" || p.category === selectedCategory;
    
    // If exploring normal storefront, show active items. If exploring specific seller's store, show their active items too.
    const isSellerMatch = !selectedSellerId || p.sellerId === selectedSellerId;

    return matchesSearch && matchesCategory && isSellerMatch && p.status === "active";
  });

  // Seller storefront details
  const activeSeller = selectedSellerId 
    ? products.find((p) => p.sellerId === selectedSellerId) 
    : null;

  const handleToggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (likedProducts.includes(id)) {
      setLikedProducts(likedProducts.filter((pId) => pId !== id));
    } else {
      setLikedProducts([...likedProducts, id]);
    }
  };

  const handlePurchase = (product: Product) => {
    if (currentUser.walletBalance < product.price) {
      alert(`Insufficient funds! Please fund your wallet in the Dashboard. Your balance: $${currentUser.walletBalance}, Product cost: $${product.price}`);
      return;
    }

    // Deduct user wallet
    onUpdateUser({ walletBalance: currentUser.walletBalance - product.price });

    // Mark product as sold in some mock way (or keep list updated)
    product.status = "sold";

    // Create an order
    const newOrder: Order = {
      orderId: `ord-${Math.floor(100 + Math.random() * 900)}`,
      productId: product.id,
      productTitle: product.title,
      productImage: product.image,
      price: product.price,
      buyerId: currentUser.userId,
      sellerId: product.sellerId,
      sellerName: product.sellerName,
      status: "processing",
      createdAt: new Date().toISOString()
    };

    onAddOrder(newOrder);
    setSelectedProduct(null);
    alert(`Success! $${product.price} has been committed to a secure Double-Lock Escrow. The seller is preparing shipment.`);
    onNavigate("/dashboard");
  };

  const handleStartNegotiate = (product: Product) => {
    // Navigate straight to active message (or spawn message)
    const newChat: ChatSession = {
      chatId: `chat-${product.id}-${currentUser.userId}`,
      productId: product.id,
      buyerId: currentUser.userId,
      buyerName: currentUser.username,
      currentOffer: product.price - Math.floor(product.price * 0.1), // Buyer offers 10% less initially
      sellerMinPrice: product.price - Math.floor(product.price * 0.15), // Hide secret minimum (e.g. 15% discount limit)
      lastOfferSender: "buyer",
      status: "bargaining",
      lastUpdated: new Date().toISOString(),
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: "system",
          text: `Automated Negotiator initialized for item: "${product.title}". Pre-listed asking price: $${product.price}.`,
          timestamp: new Date().toISOString()
        }
      ]
    };

    onAddChat(newChat);
    setSelectedProduct(null);
    onNavigate("/messages"); // Jump to chats
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
      id="product-explorer-container"
    >
      {/* Seller Storefront View (S19/S20) Header */}
      {selectedSellerId && activeSeller && (
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4" id="storefront-header">
          <div className="flex gap-4 items-center">
            <div className="bg-blue-100 text-blue-800 p-4 rounded-full font-bold text-xl uppercase h-14 w-14 flex items-center justify-center shadow-inner">
              {activeSeller.sellerName.substring(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-800">{activeSeller.sellerName}'s Storefront</h1>
                <span className="bg-emerald-50 text-emerald-700 font-mono text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-0.5">
                  Trust {activeSeller.sellerTrustScore}%
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> {activeSeller.sellerRating} / 5.0 Rating • 24 items completed
              </p>
            </div>
          </div>
          <button
            onClick={() => onSetSelectedSellerId(undefined)}
            className="text-xs bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 py-2 px-4 rounded-xl flex items-center gap-1.5 font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Marketplace
          </button>
        </div>
      )}

      {/* Main product search and filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between" id="filter-wrapper">
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4.5 h-4.5" />
          <input
            type="text"
            placeholder="Search items, keywords, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white text-slate-800 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm outline-hidden focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Category Horizontal Filter Chips */}
        <div className="flex gap-2 w-full overflow-x-auto pb-1 max-w-full" id="chips-scroll">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-4 py-1.5 rounded-full border transition-all shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm font-semibold"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Discovery grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-sm" id="empty-product-state">
          No matching listings found. Try selecting another category or typing another keyword.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="products-grid-feed">
          {filteredProducts.map((product) => {
            const hasLiked = likedProducts.includes(product.id);
            return (
              <div
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className="group cursor-pointer bg-white border border-slate-150 rounded-2xl overflow-hidden hover:shadow-lg hover:scale-[1.01] transition-all relative flex flex-col justify-between"
                id={`product-card-${product.id}`}
              >
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-44 object-cover group-hover:brightness-95 transition-all"
                  />
                  
                  {/* Floating Action heart */}
                  <button
                    onClick={(e) => handleToggleLike(product.id, e)}
                    className="absolute top-2.5 right-2.5 bg-white/80 hover:bg-white p-2 rounded-full border border-slate-100 shadow-sm transition-colors text-slate-600 hover:text-red-500"
                  >
                    <Heart className={`w-4 h-4 ${hasLiked ? "fill-red-500 text-red-500" : ""}`} />
                  </button>

                  <span className="absolute bottom-2 left-2 bg-slate-900/75 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-sm">
                    {product.condition}
                  </span>
                </div>

                <div className="p-4 flex-grow flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-blue-600 font-mono block tracking-wider">{product.category}</span>
                    <h3 className="font-bold text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors mt-0.5 leading-snug lines-2 text-sm">
                      {product.title}
                    </h3>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="font-mono text-lg font-black text-slate-800">${product.price}</span>
                    
                    {/* Secure badge */}
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-sm flex items-center gap-0.5 border ${
                      product.trustRiskRating === "Low" 
                        ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                        : "bg-amber-50 text-amber-700 border-amber-100"
                    }`}>
                      Trust {product.sellerTrustScore}%
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50/55 p-3 border-t border-slate-150 flex justify-between items-center text-[10px] text-slate-400">
                  <span 
                    onClick={(e) => {
                      e.stopPropagation();
                      onSetSelectedSellerId(product.sellerId);
                    }}
                    className="hover:text-blue-600 transition-colors font-medium hover:underline cursor-pointer"
                  >
                    Seller: {product.sellerName}
                  </span>
                  <span>{new Date(product.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Product Detail Context Modal Dialog */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-150 shadow-2xl"
              id="details-modal"
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

              <div className="p-6 md:p-8 space-y-6">
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

                {/* Secure Trust Risk Advisory Panel */}
                <div className={`p-4 rounded-xl border flex gap-3 ${
                  selectedProduct.trustRiskRating === "Low" 
                    ? "bg-emerald-50 border-emerald-150 text-emerald-800"
                    : "bg-amber-50 border-amber-150 text-amber-800"
                }`} id="trust-modal-alert">
                  <div className="mt-0.5">
                    {selectedProduct.trustRiskRating === "Low" ? (
                      <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs uppercase tracking-wide">
                      Vendoora Trust Score Advisory: {selectedProduct.trustRiskRating === "Low" ? "Low Risk Verified" : "Verification Pending"}
                    </h4>
                    <p className="text-xs text-slate-600 leading-normal mt-1">
                      {selectedProduct.trustAnalytics || "Seller account matches positive historical trading vectors. Standard Double-Lock escrow applies safely."}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Item Description</h4>
                  <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
                    {selectedProduct.description}
                  </p>
                </div>

                {/* Seller stats */}
                <div className="flex justify-between items-center p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                  <div className="flex gap-2 items-center">
                    <User className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="font-bold text-slate-700">{selectedProduct.sellerName}</p>
                      <p className="text-[10px] text-slate-400 font-mono">SELLER_ID: {selectedProduct.sellerId}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      onSetSelectedSellerId(selectedProduct.sellerId);
                      setSelectedProduct(null);
                    }}
                    className="text-blue-600 hover:underline hover:text-blue-700 font-semibold"
                  >
                    Visit Seller Store S19
                  </button>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-400">Asking Price</span>
                    <span className="text-2xl font-mono font-black text-slate-800">${selectedProduct.price}</span>
                  </div>

                  <div className="flex gap-3">
                    {/* Direct Bargaining Trigger */}
                    <button
                      onClick={() => handleStartNegotiate(selectedProduct)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 px-5 rounded-xl font-semibold text-xs transition-colors flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-4 h-4 text-blue-600" /> Bargain / Negotiate S21
                    </button>

                    {/* Instant Secure escow buy */}
                    <button
                      onClick={() => handlePurchase(selectedProduct)}
                      className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-5 rounded-xl font-semibold text-xs shadow-lg shadow-blue-500/10 flex items-center gap-1.5 transition-all"
                    >
                      <ShoppingCart className="w-4 h-4" /> Secure Escrow Purchase
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
