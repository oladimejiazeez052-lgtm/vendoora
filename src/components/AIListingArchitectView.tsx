import React from "react";
import { Product, UserProfile } from "../types";
import { Sparkles, RefreshCw, AlertTriangle, ShieldCheck, Check, Save } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AIListingArchitectViewProps {
  currentUser: UserProfile;
  products: Product[];
  onAddProduct: (newProduct: Product) => void;
  onNavigate: (route: string) => void;
}

interface AIResult {
  title: string;
  description: string;
  suggestedPrice: number;
  priceReasoning: string;
  tags: string[];
  category: string;
  trustRiskRating: "Low" | "Medium" | "High";
  trustAnalytics: string;
  moderationApproved: boolean;
  moderationReasoning: string;
}

export default function AIListingArchitectView({
  currentUser,
  products,
  onAddProduct,
  onNavigate
}: AIListingArchitectViewProps) {
  // Rough inputs
  const [roughTitle, setRoughTitle] = React.useState("");
  const [roughDesc, setRoughDesc] = React.useState("");
  const [roughCategory, setRoughCategory] = React.useState("Electronics");
  const [roughCondition, setRoughCondition] = React.useState<"New" | "Refurbished" | "Like New" | "Good" | "Fair">("Good");
  const [roughPrice, setRoughPrice] = React.useState("");

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [aiDraft, setAiDraft] = React.useState<AIResult | null>(null);
  
  // S27 Draft History
  const [history, setHistory] = React.useState<AIResult[]>([]);

  const handleGenerateDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roughTitle.trim()) {
      alert("Please provide at least a rough title so Vendoora's AI can research matching models.");
      return;
    }

    setLoading(true);
    setError(null);
    setAiDraft(null);

    try {
      const response = await fetch("/api/architect/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: roughTitle,
          description: roughDesc,
          category: roughCategory,
          condition: roughCondition,
          originalPrice: roughPrice ? parseFloat(roughPrice) : undefined
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Server failed to bundle Gemini architectural output.");
      }

      const generatedData: AIResult = await response.json();
      setAiDraft(generatedData);
      
      // Save to S27 history
      setHistory((prev) => [generatedData, ...prev]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during draft optimization.");
    } finally {
      setLoading(false);
    }
  };

  const handlePublishListing = () => {
    if (!aiDraft) return;

    // Create a real new product
    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      title: aiDraft.title,
      description: aiDraft.description,
      price: aiDraft.suggestedPrice,
      originalPrice: roughPrice ? parseFloat(roughPrice) : undefined,
      category: aiDraft.category,
      condition: roughCondition,
      tags: aiDraft.tags,
      image: selectImageByCategory(aiDraft.category),
      sellerId: currentUser.userId,
      sellerName: currentUser.username,
      sellerRating: 5.0,
      sellerTrustScore: currentUser.trustScore,
      trustRiskRating: aiDraft.trustRiskRating,
      status: aiDraft.moderationApproved ? "active" : "moderation_review",
      views: 1,
      offersCount: 0,
      likesCount: 0,
      createdAt: new Date().toISOString(),
      moderationReason: aiDraft.moderationReasoning,
      trustAnalytics: aiDraft.trustAnalytics
    };

    onAddProduct(newProduct);
    alert(
      aiDraft.moderationApproved
        ? "Awesome! Your AI-Optimized Listing is live and discoverable in Vendoora!"
        : "Listing generated but held for manual moderator review. View status in Admin Moderation."
    );
    setAiDraft(null);
    onNavigate("/dashboard");
  };

  const selectImageByCategory = (cat: string): string => {
    switch (cat.toLowerCase()) {
      case "electronics":
        return "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80";
      case "audio & music":
        return "https://images.unsplash.com/photo-1484755560695-a4c7300c5c29?auto=format&fit=crop&w=600&q=80";
      case "computer gear":
        return "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80";
      case "fashion":
        return "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80";
      case "outdoors & sports":
        return "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=600&q=80";
      default:
        return "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=600&q=80";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8"
      id="ai-architect-container"
    >
      {/* Mini Title Jumbotron */}
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200" id="architect-header">
        <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
          <Sparkles className="text-blue-600 animate-pulse" /> S25 AI Listing Architect
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Input rough details of what you're selling. Our Gemini-powered backend will curate titles, optimize markdown descriptors, tag categories, and audit price indices.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="architect-twocol">
        
        {/* Left Side: Draft inputs form */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-150 space-y-5 h-fit shadow-xs" id="inputs-form-container">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Rough Specs Input</h2>
          <form onSubmit={handleGenerateDraft} className="space-y-4" id="ai-specs-form">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500">Ugly Draft Title *</label>
              <input
                type="text"
                placeholder="e.g. cracked yellow iphone 11 64gb lock status unknown..."
                value={roughTitle}
                onChange={(e) => setRoughTitle(e.target.value)}
                className="w-full bg-slate-50 text-slate-800 text-sm border border-slate-200 rounded-xl px-3.5 py-2 px-3 outline-hidden focus:border-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">Condition</label>
                <select
                  value={roughCondition}
                  onChange={(e) => setRoughCondition(e.target.value as any)}
                  className="w-full bg-slate-50 text-slate-700 text-xs border border-slate-200 rounded-xl px-3.5 py-2 outline-hidden focus:border-blue-500"
                >
                  <option value="New">New</option>
                  <option value="Like New">Like New</option>
                  <option value="Good">Good</option>
                  <option value="Fine">Refurbished</option>
                  <option value="Fair">Fair</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">Your Rough Price ($)</label>
                <input
                  type="number"
                  placeholder="e.g. 150"
                  value={roughPrice}
                  onChange={(e) => setRoughPrice(e.target.value)}
                  className="w-full bg-slate-50 text-slate-800 text-xs border border-slate-200 rounded-xl px-3.5 py-2 outline-hidden focus:border-blue-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500">Rough Category Guideline</label>
              <select
                value={roughCategory}
                onChange={(e) => setRoughCategory(e.target.value)}
                className="w-full bg-slate-50 text-slate-700 text-xs border border-slate-200 rounded-xl px-3.5 py-2 outline-hidden focus:border-blue-500"
              >
                <option value="Electronics">Electronics</option>
                <option value="Audio & Music">Audio & Music</option>
                <option value="Computer Gear">Computer Gear</option>
                <option value="Fashion">Fashion</option>
                <option value="Outdoors & Sports">Outdoors & Sports</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500">Rough Description or Short Blurb</label>
              <textarea
                rows={4}
                placeholder="e.g. cracked screen on base right, battery holds charges okay but speaker sounds bit raspy. comes with charger i found in drawer"
                value={roughDesc}
                onChange={(e) => setRoughDesc(e.target.value)}
                className="w-full bg-slate-50 text-slate-800 text-sm border border-slate-200 rounded-xl px-3.5 py-2 outline-hidden focus:border-blue-500 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-600 text-white font-semibold text-xs py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-blue-400" /> Optimizing Listing Layout...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-blue-400" /> Generate Optimized Draft with AI
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Side: AI Generated Preview output and simulation */}
        <div className="lg:col-span-7 space-y-6" id="draft-output-preview">
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-slate-50 p-12 text-center rounded-2xl border border-dashed border-slate-200 flex flex-col items-center justify-center space-y-4 min-h-[300px]"
                id="draft-loading-state"
              >
                <div className="p-4 bg-blue-50 text-blue-600 rounded-full animate-bounce">
                  <Sparkles className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-700">Synthesizing SEO Keywords with Gemini...</h3>
                  <p className="text-xs text-slate-500 max-w-sm mt-1 mx-auto">
                    We are analyzing global pricing trends, drafting Markdown descriptions, indexing search tags, and executing safety moderation sweeps server-side.
                  </p>
                </div>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 bg-red-50 text-red-800 rounded-2xl border border-red-150 text-xs space-y-2"
                id="draft-error-state"
              >
                <div className="flex gap-2 items-center font-bold text-sm">
                  <AlertTriangle className="w-4 h-4 text-red-600" /> Draft Generation Aborted
                </div>
                <p>{error}</p>
              </motion.div>
            )}

            {!loading && !aiDraft && !error && (
              <div className="bg-slate-50 py-16 text-center rounded-2xl border border-dashed border-slate-200 text-slate-400 text-sm flex flex-col items-center justify-center space-y-2 h-full" id="draft-mockup-place">
                <Save className="w-10 h-10 text-slate-300" />
                <p>Generated AI Listing Preview will populate here.</p>
              </div>
            )}

            {!loading && aiDraft && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden"
                id="ai-draft-card"
              >
                {/* Header brand tag */}
                <div className="bg-slate-900 text-white px-5 py-3.5 flex justify-between items-center">
                  <span className="text-xs uppercase font-mono font-bold tracking-wider flex items-center gap-1.5 text-blue-400">
                    <Sparkles className="w-4 h-4 text-blue-400 fill-blue-400" /> Vendoora AI Optimized Draft
                  </span>
                  <span className="bg-white/20 text-[10px] uppercase font-bold px-2 py-0.5 rounded-sm">
                    {aiDraft.category}
                  </span>
                </div>

                <div className="p-6 md:p-8 space-y-6">
                  {/* Optimized Title Output */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Optimized Title</span>
                    <h3 className="text-lg font-extrabold text-blue-600 tracking-tight leading-snug">
                      {aiDraft.title}
                    </h3>
                  </div>

                  {/* Pricing telemetry output */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pb-4 border-b border-rose-50" id="pricing-telemetry-block">
                    <div className="md:col-span-4 bg-emerald-50 border border-emerald-100 p-4 rounded-xl text-center flex flex-col justify-center">
                      <span className="text-[10px] text-emerald-800 uppercase font-bold tracking-wide">Suggested Price</span>
                      <span className="text-3xl font-mono font-black text-emerald-600">${aiDraft.suggestedPrice}</span>
                    </div>
                    <div className="md:col-span-8 bg-slate-50 p-4 rounded-xl justify-center flex flex-col">
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wide mb-1">Price Reasoning & Valuation</span>
                      <p className="text-xs text-slate-600 leading-normal mb-0">
                        {aiDraft.priceReasoning}
                      </p>
                    </div>
                  </div>

                  {/* Description Preview block */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Curated Markdown Description</span>
                    <div className="p-4 bg-slate-50 text-slate-700 text-xs rounded-xl whitespace-pre-wrap leading-relaxed max-h-[140px] overflow-y-auto font-sans" id="markdown-draft-text">
                      {aiDraft.description}
                    </div>
                  </div>

                  {/* Dynamic Tags */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Strategic Indexing keywords</span>
                    <div className="flex flex-wrap gap-1.5" id="draft-tags">
                      {aiDraft.tags.map((tg) => (
                        <span key={tg} className="bg-slate-100 text-slate-600 text-[10px] font-medium font-mono px-2.5 py-1 rounded-md border border-slate-150">
                          #{tg}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Trust Audit rating details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100" id="audits-block">
                    {/* Authenticity and fraud advisory rating */}
                    <div className="bg-slate-50/60 p-3.5 rounded-xl border border-slate-150 text-xs space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Trust Score Audit</span>
                      <div className="flex items-center gap-1">
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-sm ${
                          aiDraft.trustRiskRating === "Low" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                        }`}>
                          {aiDraft.trustRiskRating} Risk Index
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-normal">
                        {aiDraft.trustAnalytics}
                      </p>
                    </div>

                    {/* Trade moderation standards sweep feedback */}
                    <div className="bg-slate-50/60 p-3.5 rounded-xl border border-slate-150 text-xs space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Trade Guidelines Check</span>
                      <div className="flex items-center gap-1">
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-sm ${
                          aiDraft.moderationApproved ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                        }`}>
                          {aiDraft.moderationApproved ? "Sufficient Coverage approved" : "Held for manual review"}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-normal">
                        {aiDraft.moderationReasoning}
                      </p>
                    </div>
                  </div>

                  {/* Deploy/Publish triggers */}
                  <div className="flex gap-4 pt-4 border-t border-slate-100" id="draft-publish-triggers">
                    <button
                      onClick={() => setAiDraft(null)}
                      className="flex-grow bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-bold text-xs transition-colors"
                    >
                      Clear Draft
                    </button>
                    <button
                      onClick={handlePublishListing}
                      className="flex-grow bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-lg shadow-blue-500/10"
                    >
                      <Save className="w-4 h-4" /> Confirm & Publish Listings
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* S27 History panel */}
          {history.length > 0 && (
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-150 space-y-3" id="s27-history-panel">
              <h3 className="font-bold text-slate-700 text-xs uppercase tracking-wide">S27 Suggestions History Log</h3>
              <div className="space-y-2 h-28 overflow-y-auto pr-1" id="draft-history-list">
                {history.map((hist, idx) => (
                  <div
                    key={idx}
                    onClick={() => setAiDraft(hist)}
                    className="p-2.5 bg-white border border-slate-200 hover:border-blue-400 rounded-lg cursor-pointer flex justify-between items-center text-xs transition-all"
                  >
                    <div className="lines-1 font-semibold text-slate-700 text-left w-2/3">
                      {hist.title}
                    </div>
                    <div className="text-right flex items-center gap-2">
                      <span className="font-mono text-emerald-600 font-bold">${hist.suggestedPrice}</span>
                      <span className="text-[10px] text-slate-400 uppercase font-mono">LOAD DRAFT</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
