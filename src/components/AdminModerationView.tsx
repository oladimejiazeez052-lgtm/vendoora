import React from "react";
import { Product } from "../types";
import { Shield, Check, Trash2, ShieldAlert, AlertOctagon, RefreshCw, Zap, Cpu } from "lucide-react";
import { motion } from "motion/react";

interface AdminModerationViewProps {
  products: Product[];
  onUpdateProductStatus: (
    productId: string, 
    status: "active" | "sold" | "moderation_review" | "flagged",
    reason?: string
  ) => void;
}

export default function AdminModerationView({ products, onUpdateProductStatus }: AdminModerationViewProps) {
  const [selectedProductId, setSelectedProductId] = React.useState<string | null>(null);

  // Filter listings held in moderation review
  const flaggedProducts = products.filter(
    (p) => p.status === "moderation_review" || p.status === "flagged"
  );

  const activeItem = flaggedProducts.find((p) => p.id === selectedProductId) || flaggedProducts[0];

  const handleApprove = (id: string) => {
    onUpdateProductStatus(id, "active");
    alert("Approved! Listing is now active and discoverable in Vendoora search index feeds.");
  };

  const handleBan = (id: string, reason: string) => {
    onUpdateProductStatus(id, "flagged", reason);
    alert("Listing BANNED! Flagged safety indicators remain persisted to block re-upload vectors.");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
      id="moderation-workspace"
    >
      {/* Moderation header */}
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200" id="mod-header">
        <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
          <Shield className="text-red-500 animate-pulse" /> S34 Vendoora Admin Moderation Panel
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Review items flagged by system heuristics or flagged of fraud profiles. Verify scan compliance before approving active trade.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8" id="moderation-grid">
        
        {/* Held Queue left */}
        <div className="md:col-span-5 bg-white rounded-2xl border border-slate-150 p-4 space-y-4 shadow-xs h-fit" id="moderation-queue">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 text-sm flex justify-between items-center">
              <span>Security Review Queue</span>
              <span className="bg-red-50 text-red-700 font-mono text-xs px-2 py-0.5 rounded-full">
                {flaggedProducts.length} held
              </span>
            </h3>
          </div>

          {flaggedProducts.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs" id="empty-moderation-queue">
              No pending flags. Security compliance at 100%. Nice job!
            </div>
          ) : (
            <div className="space-y-2.5" id="flagged-queue-items">
              {flaggedProducts.map((p) => {
                const isSelected = p.id === activeItem?.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedProductId(p.id)}
                    className={`p-3 rounded-xl border cursor-pointer text-left transition-all ${
                      isSelected 
                        ? "bg-red-50/50 border-red-300 shadow-xs" 
                        : "bg-slate-50/55 border-slate-100 hover:bg-slate-50"
                    }`}
                    id={`mod-queue-item-${p.id}`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] uppercase font-mono font-bold text-red-600">
                        {p.status.toUpperCase()}
                      </span>
                      <span className="text-[9px] font-mono text-slate-400">Risk: {p.trustRiskRating}</span>
                    </div>
                    <h4 className="font-bold text-xs text-slate-800 lines-1 mt-1">{p.title}</h4>
                    <p className="text-[10px] text-slate-500 mt-1">Seller: {p.sellerName} | Rating {p.sellerRating}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Audit Details right */}
        <div className="md:col-span-7 bg-white rounded-2xl border border-slate-150 p-6 h-fit" id="moderation-inspector">
          {!activeItem ? (
            <div className="text-center py-24 text-slate-400 text-xs flex flex-col items-center justify-center space-y-2">
              <ShieldAlert className="w-10 h-10 text-slate-300" />
              <p>Select a flagged listing session in the queue to inspect audit parameters.</p>
            </div>
          ) : (
            <div className="space-y-6" id="moderation-detail-card">
              <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3 pb-3 border-b border-slate-100">
                <div className="text-left">
                  <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full uppercase font-mono tracking-wide">
                    {activeItem.status.replace("_", " ")}
                  </span>
                  <h3 className="font-bold text-slate-800 text-base mt-2 tracking-tight">{activeItem.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">Listed Price: <span className="font-mono font-bold">${activeItem.price}</span></p>
                </div>
                
                <img 
                  src={activeItem.image} 
                  className="w-16 h-16 object-cover rounded-xl border border-slate-200"
                  alt="Audit thumbnail"
                />
              </div>

              {/* Specific failure explanation */}
              <div className="p-4 bg-red-50/50 border border-red-150 text-red-900 rounded-xl space-y-2" id="mod-security-alerts">
                <div className="flex gap-2 items-center font-bold text-xs uppercase tracking-wide">
                  <AlertOctagon className="w-4 h-4 text-red-600" /> Compliance Check Failure Coordinates
                </div>
                <p className="text-xs text-slate-600 leading-normal">
                  {activeItem.moderationReason || "Generic safety warning: Extreme anomalies detected in description parameters, catalog match indices, or request payment methods."}
                </p>
              </div>

              {/* Heuristical background metrics */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs space-y-3" id="risk-score-telemetry">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Core Trust Risk Audit Matrix</span>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-slate-400 text-[10px]">Seller Account Trust</p>
                    <p className="font-semibold text-slate-700">{activeItem.sellerTrustScore} / 100 Score</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px]">Risk rating assessment</p>
                    <p className={`font-semibold ${activeItem.trustRiskRating === "High" ? "text-red-600" : "text-amber-600"}`}>
                      {activeItem.trustRiskRating} Priority Audit
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-150">
                  <p className="text-slate-400 text-[10px] mb-1">Image Indexing Match</p>
                  <p className="text-[11px] text-slate-600 leading-relaxed italic">
                    {activeItem.trustAnalytics || "Image checks mismatch residential lighting levels. Index match indicates catalogue spam directories."}
                  </p>
                </div>
              </div>

              {/* Actions panel */}
              <div className="flex gap-4 pt-4 border-t border-slate-100" id="mod-actions">
                <button
                  onClick={() => handleBan(activeItem.id, "Violation: Blatant scam vectors and fraudulent Escrow evasion attempts.")}
                  disabled={activeItem.status === "flagged"}
                  className="flex-grow bg-red-600 hover:bg-red-700 disabled:bg-slate-300 text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" /> Hard Ban Listing
                </button>
  
                <button
                  onClick={() => handleApprove(activeItem.id)}
                  disabled={activeItem.status === "active"}
                  className="flex-grow bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Check className="w-4 h-4" /> Overwrite & Approve
                </button>
              </div>

            </div>
          )}
        </div>

      </div>
    </motion.div>
  );
}
