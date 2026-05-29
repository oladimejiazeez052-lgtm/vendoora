import React from "react";
import { Product, Order } from "../types";
import { TrendingUp, BarChart2, Eye, ShieldCheck, DollarSign, Award, Target, Zap } from "lucide-react";
import { motion } from "motion/react";

interface AnalyticsViewProps {
  products: Product[];
  orders: Order[];
}

export default function AnalyticsView({ products, orders }: AnalyticsViewProps) {
  // Mock performance metrics
  const totalViews = products.reduce((acc, p) => acc + p.views, 0);
  const completedVolume = orders.filter((o) => o.status === "delivered").length;
  const pendingVolume = orders.filter((o) => o.status === "processing" || o.status === "shipped").length;
  const escrowSum = orders.reduce((acc, o) => acc + o.price, 0);

  // SVG Chart data
  const viewsData = [
    { label: "Mon", value: 120 },
    { label: "Tue", value: 240 },
    { label: "Wed", value: 180 },
    { label: "Thu", value: 390 },
    { label: "Fri", value: 310 },
    { label: "Sat", value: 450 },
    { label: "Sun", value: 520 }
  ];

  const maxVal = Math.max(...viewsData.map((d) => d.value));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-10"
      id="analytics-view-container"
    >
      {/* Analytics Jumbotron Jumbotron */}
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200" id="analytics-header">
        <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
          <BarChart2 className="text-blue-600" /> S28 Analytics & Reports Dashboard
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          A real-time metrics command center mapping item liquidity scores, active escrow liabilities, view velocities, and negotiation delta ratios.
        </p>
      </div>

      {/* Bento numbers block */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6" id="analytics-numbers-bento">
        
        {/* Total Views */}
        <div className="bg-white p-5 border border-slate-150 rounded-2xl space-y-2 flex justify-between items-center" id="metric-views">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide block">Listing Impressions</span>
            <span className="text-2xl font-mono font-bold text-slate-800">{totalViews}</span>
          </div>
          <div className="bg-blue-50 text-blue-600 p-2.5 rounded-xl">
            <Eye className="w-5 h-5" />
          </div>
        </div>

        {/* Total revenue */}
        <div className="bg-white p-5 border border-slate-150 rounded-2xl space-y-2 flex justify-between items-center" id="metric-payouts">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide block">Escrow Liabilities</span>
            <span className="text-2xl font-mono font-bold text-slate-800">${escrowSum}</span>
          </div>
          <div className="bg-emerald-50 text-emerald-600 p-2.5 rounded-xl">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        {/* Active Negotiations */}
        <div className="bg-white p-5 border border-slate-150 rounded-2xl space-y-2 flex justify-between items-center" id="metric-completion">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide block">Sales Completion Rate</span>
            <span className="text-2xl font-mono font-bold text-slate-800">100%</span>
          </div>
          <div className="bg-sky-50 text-sky-600 p-2.5 rounded-xl">
            <Award className="w-5 h-5" />
          </div>
        </div>

        {/* Pending Escrow contracts */}
        <div className="bg-white p-5 border border-slate-150 rounded-2xl space-y-2 flex justify-between items-center" id="metric-contracts">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide block">Pending Escrow Contracts</span>
            <span className="text-2xl font-mono font-bold text-slate-800">{pendingVolume} Contracts</span>
          </div>
          <div className="bg-amber-50 text-amber-600 p-2.5 rounded-xl">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Grid 2: Impression charts & Bargain strategies list */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="analytics-charts-grid">
        
        {/* SVG Imp chart panel */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-150 space-y-4" id="graph-panel-views">
          <div className="flex justify-between items-center pb-2 border-b border-slate-50">
            <div>
              <h3 className="font-bold text-sm text-slate-800">Weekly View Velocities</h3>
              <p className="text-[11px] text-slate-400">Impressions index across Vendoora organic search queries.</p>
            </div>
            <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> High Velocity
            </span>
          </div>

          {/* SVG Bar Chart Canvas */}
          <div className="relative pt-6 h-64" id="svg-chart-container">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[10px] text-slate-400 font-mono pb-8">
              <div className="border-b border-dashed border-slate-100 flex justify-between"><span>{maxVal}</span></div>
              <div className="border-b border-dashed border-slate-100 flex justify-between"><span>{Math.round(maxVal/2)}</span></div>
              <div className="border-b border-dashed border-slate-100 flex justify-between"><span>0</span></div>
            </div>

            <div className="relative z-10 h-full flex items-end justify-between px-6 pb-6" id="svg-chart-grid">
              {viewsData.map((d, index) => {
                const heightPercent = `${(d.value / maxVal) * 100}%`;
                return (
                  <div key={index} className="flex flex-col items-center gap-2 group cursor-pointer w-[10%]">
                    {/* Tooltip trigger bubble */}
                    <div className="bg-slate-900 text-white font-mono text-[9px] px-1.5 py-0.5 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity translate-y-1">
                      {d.value}
                    </div>
                    {/* Bar */}
                    <div 
                      className="w-full bg-gradient-to-t from-blue-700 to-blue-500 rounded-lg group-hover:to-blue-400 transition-all shadow-inner"
                      style={{ height: heightPercent }}
                    />
                    <span className="text-[10px] font-semibold text-slate-600 font-mono">{d.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Rigth Side: Gemini Predictive Analytics */}
        <div className="lg:col-span-4 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 border border-slate-700 flex flex-col justify-between" id="predictive-analytics-sidebar">
          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-1.5 pb-2 border-b border-slate-700">
              <Zap className="text-blue-400 w-4.5 h-4.5" />
              <h3 className="font-bold uppercase font-mono tracking-wider text-xs">Predictive Yield Advisor</h3>
            </div>
            
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Our Gemini server audits active transaction deltas to model future yields based on bargaining patterns.
            </p>

            <div className="space-y-3.5 pt-2" id="prediction-points">
              <div className="flex gap-3">
                <div className="p-1 px-2.5 h-fit bg-emerald-500/10 text-emerald-400 rounded-lg font-mono text-[10px] font-bold">
                  92%
                </div>
                <div>
                  <h4 className="font-bold text-slate-200">Liquidity Score Rank</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Your list categorizations align to maximum metropolitan buyer densities.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="p-1 px-2.5 h-fit bg-blue-500/10 text-blue-400 rounded-lg font-mono text-[10px] font-bold">
                  -$12
                </div>
                <div>
                  <h4 className="font-bold text-slate-200">Avg Bargain Delta Offset</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Average seller discount accepted aligns to high safety and fast escrow release.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-700 text-[10px] text-slate-400 mt-6 font-mono leading-relaxed">
            SYSTEM_INTEGRATION: ACTIVE<br />
            GEMINI ENGINE COMPILATION: COMPLETE
          </div>
        </div>

      </div>
    </motion.div>
  );
}
