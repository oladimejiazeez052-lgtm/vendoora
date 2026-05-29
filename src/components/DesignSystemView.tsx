import React from "react";
import { DESIGN_SYSTEM_COLORS } from "../data";
import { Copy, Sparkles, Check, AlertTriangle, ShieldCheck, HelpCircle } from "lucide-react";
import { motion } from "motion/react";

export default function DesignSystemView() {
  const [copiedColor, setCopiedColor] = React.useState<string | null>(null);

  const copyColor = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-12"
      id="design-system-container"
    >
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-emerald-600 text-white p-8 rounded-xl shadow-sm relative overflow-hidden" id="ds-hero">
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-y-1/4 translate-x-12">
          <Sparkles className="w-96 h-96" />
        </div>
        <div className="max-w-2xl relative z-10">
          <span className="bg-white/20 text-xs px-3 py-1 rounded-full font-mono tracking-wider uppercase font-medium">Vendoora v1.0</span>
          <h1 className="text-4xl font-bold tracking-tight mt-4 mb-2">Design System & Reference</h1>
          <p className="text-blue-100 text-lg leading-relaxed">
            A secure foundation optimized for high-yield transactions, trust engineering, and AI-assisted bargaining interfaces.
          </p>
        </div>
      </div>

      {/* Grid 1: Philosophy & Colors */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="colors-and-philosophy">
        {/* Core Philosophy */}
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-xs flex flex-col justify-between" id="philosophy-card">
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <ShieldCheck className="text-blue-600 w-5 h-5" /> Architectural Goals
            </h2>
            <ul className="space-y-4 text-slate-600 text-sm">
              <li className="flex gap-3">
                <span className="text-blue-600 font-mono font-bold">12px</span>
                <span>All structural boundaries, cards, and primary buttons use the cohesive 12px border radius (<code className="bg-slate-100 px-1 rounded text-pink-600 font-mono text-xs">rounded-xl</code>).</span>
              </li>
              <li className="flex gap-3">
                <span className="text-emerald-500 font-mono font-bold">Trust</span>
                <span>Active color accents convey safety state immediately: Trust Blue indicates platform guarantee; Growth Emerald highlights yield completion; Amber warns on unverified elements.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-slate-800 font-mono font-bold">No Slop</span>
                <span>Interface maintains high functional negative space over cluttered telemetry dashboard components. No mock logs.</span>
              </li>
            </ul>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-400">
            Design Standards aligned to Gemini 3.5 AI telemetry specs.
          </div>
        </div>

        {/* Brand Colors Grid */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-100 shadow-xs" id="colors-card">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Color Palette Reference</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="colors-subgrid">
            {DESIGN_SYSTEM_COLORS.map((color) => (
              <div
                key={color.hex}
                onClick={() => copyColor(color.hex)}
                className="group cursor-pointer border border-slate-100 rounded-xl p-4 hover:shadow-md transition-all flex flex-col justify-between h-40 bg-slate-50 relative"
                id={`color-${color.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-lg shadow-inner" style={{ backgroundColor: color.hex }} />
                  <button className="text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    {copiedColor === color.hex ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">{color.name}</h3>
                  <p className="font-mono text-xs text-slate-400 mt-0.5">{color.hex}</p>
                  <p className="text-[11px] text-slate-500 leading-tight mt-1 lines-2">{color.use}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Typography Elements */}
      <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-xs" id="typography-reference">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Typography Alignment Rules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8" id="typo-grid">
          <div className="space-y-6" id="headings-demo">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Heading Hierarchy</h3>
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-mono text-slate-400">h1 (Display, tracking-tight, text-slate-900)</span>
                <p className="text-3xl font-extrabold text-slate-900 tracking-tight">Vendoora High-Trust Trade</p>
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-400">h2 (Sectional header, text-slate-800)</span>
                <p className="text-xl font-bold text-slate-800">Automated Smart Negotiation</p>
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-400">h3 (Card labels, font-semibold, text-slate-700)</span>
                <p className="text-base font-semibold text-slate-700">Recommended Price: $850.00</p>
              </div>
            </div>
          </div>

          <div className="space-y-6" id="monospacing-demo">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Body & Technical Mono</h3>
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-mono text-slate-400">Body Copy (text-slate-600, leading-relaxed)</span>
                <p className="text-slate-600 text-sm leading-relaxed">
                  The P2P marketplace utilizes advanced server-side Gemini intelligence to verify items, analyze seller background parameters, and automatically guide conversations to positive escrow closures.
                </p>
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-400">Mono Accents (Fira Code/JetBrains pairing, text-slate-500)</span>
                <p className="font-mono text-xs text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100">
                  SECURE_HASH: $2a$12$6K/kMIn9O1V2jB8f8N9eF9z9
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Core Component Samples */}
      <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-xs" id="components-reference">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Standard Component Blueprinting</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="comp-grid">
          {/* Action Button Set */}
          <div className="space-y-4 p-4 border border-slate-150 rounded-xl" id="buttons-group">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Primary Triggers</h4>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Secure Checkout (Blue)
            </button>
            <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 px-4 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2">
              Accept Offer $810 (Emerald)
            </button>
            <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 px-4 rounded-xl text-sm font-semibold transition-colors">
              Browse Storefront (Slate)
            </button>
          </div>

          {/* Verification Badges */}
          <div className="space-y-4 p-4 border border-slate-150 rounded-xl" id="telemetry-group">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Trust Tags & Telemetry</h4>
            
            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-100 text-xs font-medium" id="ds-badge-high">
              <ShieldCheck className="w-4 h-4" /> Verified Authenticated: High Trust Score
            </div>

            <div className="flex items-center gap-2 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg border border-amber-100 text-xs font-medium" id="ds-badge-mid">
              <AlertTriangle className="w-4 h-4" /> Unverified Seller: Moderate Care Suggested
            </div>

            <div className="flex items-center gap-2 bg-red-50 text-red-700 px-3 py-1.5 rounded-lg border border-red-100 text-xs font-medium" id="ds-badge-low">
              <AlertTriangle className="w-4 h-4" /> Moderation Alert: Item flagged for scam
            </div>
          </div>

          {/* Visual card showcase */}
          <div className="border border-slate-150 rounded-xl overflow-hidden hover:shadow-lg transition-shadow bg-slate-50 relative flex flex-col justify-between" id="ds-listing-demo">
            <img 
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80" 
              className="w-full h-24 object-cover" 
              alt="Headphones demo"
            />
            <div className="p-3">
              <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Audio</span>
              <h4 className="font-bold text-xs text-slate-800 mt-1 lines-1">Sony WH-1000XM4 Noise Headsets</h4>
              <p className="text-xs font-mono font-bold text-emerald-600 mt-1">$180.00</p>
            </div>
            <div className="p-2 border-t border-slate-200 bg-white flex justify-between items-center text-[10px] text-slate-400">
              <span>Seller: Marcus Brody</span>
              <span className="font-medium text-emerald-600">Trust 91%</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
