import React from "react";
import { Search, Shield, ArrowRight, Star, MapPin, Store, MessageSquare, Compass, Play, Sparkles } from "lucide-react";
import { Product } from "../types";
import { motion } from "motion/react";

interface LandingViewProps {
  products: Product[];
  onSearchProduct: (query: string) => void;
  onNavigate: (route: string) => void;
}

export default function LandingView({ products, onSearchProduct, onNavigate }: LandingViewProps) {
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchProduct(searchQuery);
    onNavigate("/products");
  };

  const activeProducts = products.filter((p) => p.status === "active").slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-20 pb-16"
      id="landing-container"
    >
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-6 pb-12" id="hero-section">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Info */}
          <div className="lg:col-span-7 space-y-8 text-left z-10">
            <span className="inline-block bg-emerald-50 border border-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-bold font-sans tracking-wide uppercase">
              Now Available: Neighborhood Escrow Trade
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
              Shop your neighborhood, <span className="text-blue-600">build your empire.</span>
            </h1>
            <p className="text-slate-600 text-base md:text-lg max-w-xl leading-relaxed">
              We connect local artisans, buyers, and independent merchants with blocks are away. Trade peer-to-peer wares securely with quick bargains and zero friction.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={() => onNavigate("/products")}
                className="bg-blue-600 hover:bg-blue-755 text-white font-bold text-sm px-8 py-4 rounded-xl transition-all shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-95"
              >
                Explore Marketplace
              </button>
              <button
                onClick={() => {
                  const element = document.getElementById("how-it-works-section");
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="border border-slate-250 hover:bg-slate-50 text-slate-700 font-bold text-sm px-8 py-4 rounded-xl transition-all"
              >
                How it works
              </button>
            </div>

            <div className="pt-6 flex items-center gap-4">
              <div className="flex -space-x-3">
                <img
                  className="w-10 h-10 rounded-full border-2 border-white object-cover"
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80"
                  alt="Artisan Sarah"
                />
                <img
                  className="w-10 h-10 rounded-full border-2 border-white object-cover"
                  src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80"
                  alt="Merchant Marcus"
                />
                <img
                  className="w-10 h-10 rounded-full border-2 border-white object-cover"
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80"
                  alt="Shopper Elena"
                />
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Sellers are generating reviews and rating scores of excellence in Brooklyn!
              </p>
            </div>
          </div>

          {/* Hero Right Visual Column */}
          <div className="lg:col-span-5 relative" id="hero-visual">
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200 aspect-[4/3] bg-slate-50">
              <img
                className="w-full h-full object-cover"
                src="https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=800&q=80"
                alt="Local active street market"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Bento Grid */}
      <section className="space-y-6 pt-4" id="feature-grid-section">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Built for Neighborhood Commerce</h2>
          <p className="text-slate-500 text-sm">Empowering peers with the fast coordinates and simple transparency of local trading circles.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6" id="features-bento">
          {/* Card 1: Location Discovery */}
          <div className="md:col-span-8 bg-white rounded-3xl border border-slate-150 overflow-hidden flex flex-col md:flex-row shadow-sm hover:shadow-md transition-all h-[360px] md:h-[320px]">
            <div className="p-8 flex-1 flex flex-col justify-center space-y-4 text-left">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-extrabold text-slate-800 tracking-tight">Location-based Wares Discovery</h3>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Avoid shipping delays entirely. Scan available items and physical inventories posted blocks away from your coordinates on our interactive map index.
                </p>
              </div>
            </div>
            <div className="flex-1 bg-slate-100 relative overflow-hidden h-48 md:h-full min-w-[50%]">
              <img
                className="w-full h-full object-cover saturate-[0.8] brightness-105"
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=400&q=80"
                alt="Detailed metropolitan map"
              />
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-full border border-slate-200 shadow-sm flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-[10px] font-bold text-slate-700">Scan Radius: 5 miles active</span>
              </div>
            </div>
          </div>

          {/* Card 2: Product Architect */}
          <div className="md:col-span-4 bg-blue-600 text-white rounded-3xl p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-all h-[360px] md:h-[320px] text-left">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                <Store className="w-6 h-6 text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-extrabold text-white tracking-tight">Smart Product Architect</h3>
                <p className="text-blue-100 text-xs leading-relaxed">
                  Create organized item lists instantly. Our smart editor builds beautiful catalog templates, tags, and item details with zero formatting chore.
                </p>
              </div>
            </div>
            
            {/* Styled mock progress visualizer */}
            <div className="bg-white/10 rounded-xl p-3 border border-white/20 text-xs">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="font-mono font-bold text-[10px]">Catalog Preview generated</span>
              </div>
              <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full w-[105%]" />
              </div>
            </div>
          </div>

          {/* Card 3: Real-time Negotiator */}
          <div className="md:col-span-4 bg-emerald-700 text-white rounded-3xl p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-all h-[360px] md:h-[320px] text-left">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-extrabold text-white tracking-tight">Smart Hand-off Negotiator</h3>
                <p className="text-emerald-100 text-xs leading-relaxed">
                  Finalize trade budgets securely inside our double-lock escrow chat. Propose bids, counter offers, or accept clearances with one tap.
                </p>
              </div>
            </div>

            <div className="space-y-1 bg-white/10 p-3 rounded-xl text-xs border border-white/10 font-mono">
              <div className="flex justify-between text-[10px]">
                <span className="opacity-80">Proposed Bid:</span>
                <span className="font-bold">$145.00</span>
              </div>
            </div>
          </div>

          {/* Card 4: CTA Mini Promo */}
          <div className="md:col-span-8 bg-white rounded-3xl border border-slate-150 p-8 flex flex-col sm:flex-row items-center justify-between shadow-sm hover:shadow-md transition-all gap-6 text-left">
            <div className="space-y-2">
              <h3 className="text-lg font-extrabold text-slate-800 tracking-tight">Ready to open your neighborhood storefront?</h3>
              <p className="text-xs text-slate-500 leading-normal max-w-md">
                Build your peer rating score, list your crafts, and sell to buyers near you cleanly. Registration takes under 2 minutes.
              </p>
            </div>
            <button
              onClick={() => onNavigate("/register")}
              className="bg-blue-600 hover:bg-blue-700 text-white h-12 px-6 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm shrink-0"
            >
              Start Selling <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-8 border-y border-slate-100" id="how-it-works-section">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* For Buyers */}
          <div className="space-y-8 text-left">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              For <span className="text-blue-600">Buyers</span>
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Locate Closest Gems</h4>
                  <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                    Set your neighborhood location to find unique crafts, handiwork, and gear sold within blocks of your home.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Agree on Terms</h4>
                  <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                    Chat directly built-in with double-lock escrow. Ask questions about the wear, propose counter prices, or settle pick-up terms.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Secure Hand-off</h4>
                  <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                    Verify the item condition at the physical hand-off point, trigger the buyer shield release, and take home your awesome find.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* For Sellers */}
          <div className="space-y-8 text-left">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              For <span className="text-emerald-700">Sellers</span>
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Organize Your Listing</h4>
                  <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                    Specify title, category index and expected price. Our clean structural editor generates gorgeous listing templates immediately.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Attract Nearby Shoppers</h4>
                  <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                    Your listing actively highlights to nearby metropolitan coordinates. Skip heavy shipping chores and meet right at a safe-zone.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Scale Your Enterprise</h4>
                  <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                    Complete trades successfully, see your buyer trust score metrics index expand, and build a local business empire.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="space-y-6 text-left" id="curated-listings">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Active Community Listings</h2>
            <p className="text-slate-500 text-xs mt-1">Explore verified local items with high trust scores.</p>
          </div>
          <button
            onClick={() => onNavigate("/products")}
            className="text-blue-600 hover:text-blue-700 font-bold text-xs flex items-center gap-1.5"
          >
            See All Listings <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="products-listing">
          {activeProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => onNavigate("/products")}
              className="bg-white rounded-2xl border border-slate-150 overflow-hidden shadow-xs hover:shadow-md hover:scale-[1.01] transition-all cursor-pointer flex flex-col justify-between"
              id={`product-card-${product.id}`}
            >
              <div className="relative h-44 bg-slate-100">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-[10px] font-bold text-slate-800 px-2.5 py-1 rounded-full border border-slate-100">
                  {product.condition}
                </span>
                <span className="absolute top-3 right-3 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                  ★ {product.sellerRating}
                </span>
              </div>
              <div className="p-5 space-y-4 flex-grow flex flex-col justify-between">
                <div>
                  <span className="text-[9px] uppercase font-bold text-blue-600 tracking-wider font-mono">{product.category}</span>
                  <h3 className="font-bold text-slate-800 text-sm mt-1 lines-2 leading-snug">
                    {product.title}
                  </h3>
                </div>
                <div className="flex justify-between items-end pt-2 border-t border-slate-50">
                  <div>
                    <span className="text-[10px] text-slate-400 block">List Price</span>
                    <span className="text-lg font-black text-slate-900">${product.price}</span>
                  </div>
                  <div className="bg-emerald-50 text-emerald-800 border border-emerald-100 font-mono text-[10px] font-bold px-2.5 py-1 rounded-lg">
                    Trust {product.sellerTrustScore}%
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Hero CTA Box */}
      <section className="bg-slate-900 text-slate-100 rounded-[2rem] p-12 text-center relative overflow-hidden" id="final-cta">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.1),transparent)] pointer-events-none" />
        <div className="max-w-2xl mx-auto space-y-6 relative z-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Join the Neighborhood Revolution</h2>
          <p className="text-slate-300 text-sm max-w-lg mx-auto leading-relaxed">
            Start trade exchanges cleanly, locate hidden gems, and build your own local commerce network safely today.
          </p>
          <button
            onClick={() => onNavigate("/register")}
            className="bg-blue-600 hover:bg-blue-750 text-white text-xs uppercase tracking-wider font-bold py-4 px-10 rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95"
          >
            Get Started for Free
          </button>
        </div>
      </section>
    </motion.div>
  );
}
