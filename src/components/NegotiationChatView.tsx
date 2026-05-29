import React from "react";
import { ChatSession, AppState, UserProfile } from "../types";
import { MessageSquare, Shield, Sparkles, Send, RefreshCw, Layers, AlertCircle, RefreshCcw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface NegotiationChatViewProps {
  currentUser: UserProfile;
  chats: ChatSession[];
  products: any[];
  onUpdateChat: (chatId: string, updated: Partial<ChatSession>) => void;
  onNavigate: (route: string) => void;
  selectedChatId?: string;
  onSetSelectedChatId: (chatId: string | undefined) => void;
}

export default function NegotiationChatView({
  currentUser,
  chats,
  products,
  onUpdateChat,
  onNavigate,
  selectedChatId,
  onSetSelectedChatId
}: NegotiationChatViewProps) {
  const [inputText, setInputText] = React.useState("");
  const [buyerOfferInput, setBuyerOfferInput] = React.useState("");

  // AI strategic adviser block states
  const [loadingAdvice, setLoadingAdvice] = React.useState(false);
  const [aiAdvice, setAiAdvice] = React.useState<{
    evaluation: "accept" | "counter" | "decline";
    suggestedCounterPrice: number | null;
    strategicAdvice: string;
    replyMessage: string;
  } | null>(null);

  const activeChat = chats.find((c) => c.chatId === selectedChatId) || chats[0];
  const activeProduct = activeChat 
    ? products.find((p) => p.id === activeChat.productId) 
    : null;

  React.useEffect(() => {
    setAiAdvice(null);
  }, [selectedChatId]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeChat || !inputText.trim()) return;

    const offerVal = buyerOfferInput ? parseFloat(buyerOfferInput) : undefined;

    const newMessage = {
      id: `msg-${Date.now()}`,
      sender: currentUser.role === "buyer" ? ("buyer" as const) : ("seller" as const),
      text: inputText,
      timestamp: new Date().toISOString(),
      ...(offerVal ? { offerValue: offerVal } : {})
    };

    const updatedMessages = [...activeChat.messages, newMessage];

    onUpdateChat(activeChat.chatId, {
      messages: updatedMessages,
      lastUpdated: new Date().toISOString(),
      ...(offerVal ? { 
        currentOffer: offerVal,
        lastOfferSender: currentUser.role === "buyer" ? "buyer" : "seller"
      } : {})
    });

    setInputText("");
    setBuyerOfferInput("");
    setAiAdvice(null);

    // Dynamic roleplay counterpart trigger: after 2.5 seconds, generate automated reply if user is playing
    setTimeout(async () => {
      // Simulate partner reaction or let them call AI if they wish.
    }, 2000);
  };

  const handleRequestAIAdviser = async () => {
    if (!activeChat) return;
    setLoadingAdvice(true);
    setAiAdvice(null);

    try {
      const response = await fetch("/api/negotiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyerOffer: activeChat.currentOffer || activeProduct?.price,
          sellerMinPrice: activeChat.sellerMinPrice,
          currentPrice: activeProduct?.price,
          itemTitle: activeProduct?.title,
          conversationRole: currentUser.role === "buyer" ? "buyer_bot" : "advisor", // role advice
          chatHistory: activeChat.messages.slice(-5) // Send last 5 chats
        })
      });

      if (!response.ok) {
        throw new Error("Failed to communicate with Vendoora Negotiation server.");
      }

      const generatedAdvice = await response.json();
      setAiAdvice(generatedAdvice);
    } catch (err) {
      console.error(err);
      alert("Negotiation system cannot fetch adviser vectors. Verify GEMINI_API_KEY is configured in Secrets.");
    } finally {
      setLoadingAdvice(false);
    }
  };

  const handleApplyAIReasoning = () => {
    if (!aiAdvice || !activeChat) return;

    // Prefill the text inputs with Gemini suggestion
    setInputText(aiAdvice.replyMessage);
    if (aiAdvice.suggestedCounterPrice) {
      setBuyerOfferInput(aiAdvice.suggestedCounterPrice.toString());
    }
    setAiAdvice(null);
  };

  const handleAcceptTradeImmediately = () => {
    if (!activeChat || !activeProduct) return;

    const acceptedPrice = activeChat.currentOffer || activeProduct.price;

    const newMessage = {
      id: `msg-${Date.now()}`,
      sender: "system" as const,
      text: `Deal LOCKED IN successfully! Counter price settled at $${acceptedPrice}. Standard shipment Escrow coordinates have been loaded.`,
      timestamp: new Date().toISOString()
    };

    onUpdateChat(activeChat.chatId, {
      status: "accepted",
      messages: [...activeChat.messages, newMessage],
      lastUpdated: new Date().toISOString()
    });

    alert(`Trade Closed! $${acceptedPrice} committed via Vendoora double-lock Escrow. Shipments will start processing.`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
      id="messages-pane-wrapper"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6" id="negotiate-chat-grid">
        
        {/* Chats sidebar left */}
        <div className="md:col-span-4 bg-white rounded-2xl border border-slate-150 p-4 space-y-4" id="negotiation-sessions">
          <div className="pb-3 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 text-sm">Active Channels</h3>
            <span className="bg-slate-100 text-slate-600 text-xs px-2.5 py-0.5 rounded-full font-mono">
              {chats.length} Opened
            </span>
          </div>

          <div className="space-y-2" id="sessions-list">
            {chats.map((ch) => {
              const prod = products.find((p) => p.id === ch.productId);
              const isActive = ch.chatId === (activeChat?.chatId);
              
              return (
                <div
                  key={ch.chatId}
                  onClick={() => onSetSelectedChatId(ch.chatId)}
                  className={`p-3 rounded-xl border cursor-pointer text-left transition-all relative flex gap-3 ${
                    isActive 
                      ? "bg-blue-50 border-blue-200" 
                      : "bg-slate-50/50 border-slate-100 hover:bg-slate-50"
                  }`}
                  id={`session-item-${ch.chatId}`}
                >
                  <img
                    src={prod?.image}
                     className="w-10 h-10 object-cover rounded-lg border border-slate-200 mt-0.5"
                    alt={prod?.title}
                  />
                  <div className="flex-grow min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-xs text-slate-800 lines-1">{prod?.title || "Universal Draft"}</h4>
                    </div>
                    <p className="text-[10px] text-slate-400 font-mono flex justify-between items-center mt-1">
                      <span>Involved: {ch.buyerName}</span>
                      <span className="font-bold text-slate-600">${ch.currentOffer || prod?.price}</span>
                    </p>
                    {ch.status === "accepted" && (
                      <span className="absolute bottom-1 right-2 bg-emerald-100 text-emerald-800 font-bold text-[8px] px-1.5 py-0.2 rounded">
                        ACCEPTED
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chat detail & AI bargaining agent right */}
        <div className="md:col-span-8 flex flex-col md:grid md:grid-cols-12 gap-4" id="chat-workspace">
          
          {/* Messages block */}
          <div className="md:col-span-7 bg-white rounded-2xl border border-slate-150 p-4 h-[500px] flex flex-col justify-between" id="chat-messenger-area">
            {!activeChat ? (
              <div className="text-center py-20 text-slate-400 text-sm flex-grow flex flex-col items-center justify-center space-y-4">
                <MessageSquare className="w-12 h-12 text-slate-300" />
                <p>No negotiations initiated. Choose an item in the Product Discovery lists to bargain.</p>
              </div>
            ) : (
              <>
                {/* Header panel details */}
                <div className="pb-3 border-b border-indigo-50 flex justify-between items-center text-xs">
                  <div>
                    <h4 className="font-bold text-slate-700 lines-1">{activeProduct?.title}</h4>
                    <span className="text-[10px] text-slate-400 font-mono block">
                      Asking Range: ${activeProduct?.price} | Conf. Floor Limit: ${currentUser.role === "seller" ? `$${activeChat.sellerMinPrice}` : "🔒 SECURE_FLOOR"}
                    </span>
                  </div>
                  <div>
                    {activeChat.status === "bargaining" ? (
                      <button
                        onClick={handleAcceptTradeImmediately}
                        className="bg-emerald-500 hover:bg-emerald-700 text-white font-bold text-[10px] px-2.5 py-1.5 rounded-lg transition-colors scale-95"
                      >
                        Accept Offer ${activeChat.currentOffer || activeProduct?.price}
                      </button>
                    ) : (
                      <span className="text-emerald-700 font-extrabold bg-emerald-50 px-2.5 py-1 rounded-sm border border-emerald-100 uppercase tracking-widest text-[9px]">
                        DEAL CLOSED
                      </span>
                    )}
                  </div>
                </div>

                {/* Msg feed bubble list */}
                <div className="flex-grow overflow-y-auto py-4 space-y-3 pr-1" id="message-bubbles">
                  {activeChat.messages.map((m) => {
                    const isSystem = m.sender === "system";
                    const isAdvisor = m.sender === "advisor";
                    const isMe = m.sender === (currentUser.role === "buyer" ? "buyer" : "seller");

                    if (isSystem) {
                      return (
                        <div key={m.id} className="text-center text-[10px] font-mono text-slate-500 bg-slate-50 py-1.5 px-3 rounded-lg border border-slate-100 max-w-sm mx-auto">
                          {m.text}
                        </div>
                      );
                    }

                    return (
                      <div
                        key={m.id}
                        className={`flex flex-col max-w-[80%] ${
                          isMe ? "ml-auto items-end" : "mr-auto items-start"
                        }`}
                      >
                        <span className="text-[9px] text-slate-400 font-mono mb-0.5 capitalize">{m.sender}</span>
                        <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                          isMe 
                            ? "bg-slate-900 text-white rounded-tr-sm" 
                            : "bg-slate-100 text-slate-800 rounded-tl-sm"
                        }`}>
                          {m.text}
                          {m.offerValue && (
                            <div className="mt-2 text-[10px] font-mono font-bold uppercase py-0.5 px-2 bg-black/10 rounded-sm inline-block">
                              Offer proposal: ${m.offerValue}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Submit triggers form wrapper */}
                <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-100 space-y-2" id="send-input-form text-xs">
                  {activeChat.status === "bargaining" && (
                     <div className="flex gap-2">
                       <input
                         type="number"
                         placeholder="Include price counter proposal ($) Optional"
                         value={buyerOfferInput}
                         onChange={(e) => setBuyerOfferInput(e.target.value)}
                         className="w-1/2 bg-slate-50 text-slate-800 border border-slate-200 rounded-lg px-2 text-[10px] py-1 shadow-inner focus:outline-hidden"
                       />
                       <span className="text-[10px] text-slate-400 font-semibold flex items-center pr-1">Toggle counter offer</span>
                     </div>
                  )}

                  <div className="relative flex items-center">
                    <input
                      type="text"
                      placeholder={activeChat.status === "accepted" ? "Chat closed. Escrow active." : "Write your trade terms or negotiate message..."}
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      disabled={activeChat.status !== "bargaining"}
                      className="w-full bg-slate-50 text-slate-800 text-xs border border-slate-150 rounded-xl pl-3 pr-10 py-3 outline-hidden focus:border-blue-500"
                    />
                    <button
                      type="submit"
                      disabled={activeChat.status !== "bargaining"}
                      className="absolute right-2 text-blue-600 hover:text-blue-700 disabled:text-slate-300"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>

          {/* AI Advisor Panel right S21 */}
          <div className="md:col-span-5 bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-5 border border-slate-800 flex flex-col justify-between" id="ai-negotiator-advisor">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-indigo-900">
                <span className="text-xs uppercase font-mono font-bold text-blue-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> S21 AI Chat Advisor
                </span>
                <span className="bg-emerald-500 text-white font-mono text-[9px] font-bold px-1.5 rounded-sm">
                  Active Oracle
                </span>
              </div>

              {!activeChat ? (
                <p className="text-xs text-slate-400">Negotiation sessions advice will compile once a specific active trade chat session is selected.</p>
              ) : (
                <div className="space-y-4 text-xs">
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    We analyze your conversational tone, current list index offsets, and floor margins dynamically.
                  </p>

                  <button
                    onClick={handleRequestAIAdviser}
                    disabled={loadingAdvice}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {loadingAdvice ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Querying Pricing Matrix...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-blue-300" /> Consult Smart Adviser Strategy
                      </>
                    )}
                  </button>

                  <AnimatePresence>
                    {aiAdvice && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-3.5 bg-indigo-900/40 rounded-xl border border-indigo-800 space-y-3 text-left"
                        id="ai-advice-bubble"
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-mono font-bold text-blue-300 uppercase tracking-wide">
                            Evaluation: {aiAdvice.evaluation.toUpperCase()}
                          </span>
                          {aiAdvice.suggestedCounterPrice && (
                            <span className="font-mono text-emerald-400 font-extrabold text-[11px]">
                              Counter sugerido: ${aiAdvice.suggestedCounterPrice}
                            </span>
                          )}
                        </div>

                        <p className="text-[10px] text-slate-300 leading-snug">
                          {aiAdvice.strategicAdvice}
                        </p>

                        <div className="bg-slate-900 p-2.5 rounded-lg">
                          <span className="text-[8px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">Suggested Output Reply</span>
                          <p className="text-[10px] italic text-slate-200">"{aiAdvice.replyMessage}"</p>
                        </div>

                        <button
                          onClick={handleApplyAIReasoning}
                          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[10px] py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1"
                        >
                          Use Advice & Write Message
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-indigo-950 text-[10px] text-slate-400 mt-4">
              🔒 Floor price protection is 100% confidential. Buyers can never read your set floor coordinates.
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}
