import React from "react";
import { Search, Shield, Cpu, RefreshCw, Layers, ArrowRight, Zap, Star, Sparkles } from "lucide-react";
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-16"
      id="landing-container"
    >
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-slate-900 text-white rounded-3xl py-16 px-8 md:px-12 lg:px-16 shadow-xl" id="landing-hero">
        <div className="absolute inset-0 bg-radial-gradient from-blue-900/50 via-slate-900 to-slate-900 opacity-60 pointer-events-none" />
        
        {/* Dynamic mesh lines */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 px-3 py-1 rounded-full text-xs font-semibold font-mono tracking-wide">
            <Zap className="w-3.5 h-3.5" /> AI-Powered Negotiation Engine Live
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none text-white">
            Trade with total confidence, backed by <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Gemini Intelligence</span>
          </h1>
          <p className="text-slate-300 text-base md:text-lg max-w-2xl leading-relaxed">
            Welcome to Vendoora, the world's first decentralized peer-to-peer marketplace that builds listing architectures, recommends pricing trends, and facilitates direct automated bargains.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg pt-4" id="hero-search-form">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="What coordinates or quality listings are you seeking today?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white/10 hover:bg-white/15 focus:bg-white text-slate-800 focus:text-slate-900 placeholder-slate-400 rounded-xl outline-hidden border border-white/20 focus:border-white text-sm transition-all focus:ring-4 focus:ring-blue-500/20"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
            >
              Discover Listings <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Feature Pillar Badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8" id="landing-pillars">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex gap-4" id="pillar-negotiator">
          <div className="bg-blue-50 p-3 rounded-xl h-fit text-blue-600">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">AI Smart Negotiator</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Bargain directly with friendly automated buyer or seller personas, or use active AI tips to seal optimal trade deals quickly.
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex gap-4" id="pillar-escrow">
          <div className="bg-emerald-50 p-3 rounded-xl h-fit text-emerald-600">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">Double-Lock Escrow</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Funds reside securely under secure escrow lockers until physical handover or delivery is verified. Scamming is algorithmically neutralized.
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex gap-4" id="pillar-architect">
          <div className="bg-sky-50 p-3 rounded-xl h-fit text-sky-600">
            <RefreshCw className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">Listing Architect</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Type short phrases and let Gemini produce structured categorizations, SEO titles, pricing statistics, and comprehensive safety tags.
            </p>
          </div>
        </div>
      </div>

      {/* Recommended/Featured Products */}
      <div className="space-y-6" id="featured-section">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Active Verified Listings</h2>
            <p className="text-slate-500 text-sm">Explore hot organic listings checked for safety and premium value.</p>
          </div>
          <button
            onClick={() => onNavigate("/products")}
            className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1 group"
          >
            All Products <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="landing-products-grid">
          {activeProducts.map((p) => (
            <div
              key={p.id}
              onClick={() => {
                onNavigate("/products");
                // Select product inside navigation can be simulated by triggering filters
              }}
              className="group bg-white rounded-2xl border border-slate-150 overflow-hidden shadow-xs hover:shadow-md hover:scale-[1.01] transition-all cursor-pointer flex flex-col justify-between"
              id={`featured-${p.id}`}
            >
              <div className="relative">
                <img
                  src={p.image}
                  className="w-full h-48 object-cover group-hover:brightness-95 transition-all"
                  alt={p.title}
                />
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-xs font-bold text-slate-800 px-2.5 py-1 rounded-full border border-slate-100 shadow-inner">
                  {p.condition}
                </span>
                <span className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full text-white bg-blue-600 shadow-sm flex items-center gap-1`}>
                  ★ {p.sellerRating}
                </span>
              </div>
              <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-blue-600 font-mono tracking-wider">{p.category}</span>
                  <h3 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors mt-1 lines-2 text-sm md:text-base leading-snug">
                    {p.title}
                  </h3>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-400">Fixed/Counter Price</span>
                    <span className="text-xl font-mono font-black text-slate-800">${p.price}</span>
                  </div>
                  <div className="bg-emerald-50 text-emerald-700 font-mono text-[10px] font-bold px-2.5 py-1 rounded-lg border border-emerald-100 flex items-center gap-0.5">
                    Trust {p.sellerTrustScore}%
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Secondary Call to Action Box */}
      <div className="bg-slate-50 border border-slate-150 p-8 rounded-3xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center" id="landing-onboarding-promo">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-800">Ready to Cash Out on Unused Gear?</h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Ditch complicated formats and draft-writing. Head to our AI Listing Architect, jot down 2 lines, and get pricing index maps, descriptive summaries, and categorization instantly.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate("/ai/list")}
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition-colors flex items-center gap-1.5"
            >
              List with AI Architect <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            </button>
            <button
              onClick={() => onNavigate("/register")}
              className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-semibold text-xs px-5 py-2.5 rounded-xl transition-colors"
            >
              Onboard Account
            </button>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm space-y-4" id="mini-analytics-demo">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Predictive Pricing index</span>
            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-mono px-2 py-0.5 rounded-sm">+18% Confidence</span>
          </div>
          <div className="flex gap-4 items-center">
            <div className="h-12 w-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              $
            </div>
            <div>
              <p className="text-xs text-slate-400">Fair Liquidity Value</p>
              <p className="text-xl font-bold font-mono text-slate-800">$185 - $198</p>
            </div>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full w-[78%]" />
          </div>
          <p className="text-[11px] text-slate-500 italic">"Suggested list range aligns perfectly with local metropolitan demand vectors." — Vendoora Oracle</p>
        </div>
      </div>
    </motion.div>
  );
}
