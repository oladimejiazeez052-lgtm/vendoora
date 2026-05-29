import React from "react";
import { ChatSession, UserProfile, Product, ChatMessage } from "../types";
import { 
  MessageSquare, Shield, Sparkles, Send, RefreshCw, 
  Phone, MoreVertical, PlusCircle, Smile, ShieldCheck, 
  AlertCircle, Check, X, ThumbsUp, MapPin, ChevronRight, MessageCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface NegotiationChatViewProps {
  currentUser: UserProfile;
  chats: ChatSession[];
  products: Product[];
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
  
  // Custom sidebar filter: "all" | "selling"
  const [sidebarFilter, setSidebarFilter] = React.useState<"all" | "selling">("all");

  // Local typing simulation state for Sarah Jenkins
  const [isTyping, setIsTyping] = React.useState(false);

  // AI strategic adviser block states
  const [loadingAdvice, setLoadingAdvice] = React.useState(false);
  const [aiAdvice, setAiAdvice] = React.useState<{
    evaluation: "accept" | "counter" | "decline";
    suggestedCounterPrice: number | null;
    strategicAdvice: string;
    replyMessage: string;
  } | null>(null);

  // Ensure default selected chat maps to Sarah Jenkins if none highlighted
  const activeChatId = selectedChatId || "chat-sarah-jenkins";
  
  const activeChat = chats.find((c) => c.chatId === activeChatId) || chats[0];
  const activeProduct = activeChat 
    ? products.find((p) => p.id === activeChat.productId) 
    : null;

  React.useEffect(() => {
    setAiAdvice(null);
    setIsTyping(false);

    // If switching to Sarah Jenkins chat, trigger a brief simulated typing event to make it feel super alive
    if (activeChat?.chatId === "chat-sarah-jenkins" && activeChat.messages.length < 5) {
      const timer = setTimeout(() => {
        setIsTyping(true);
        const typingOffTimer = setTimeout(() => {
          setIsTyping(false);
        }, 3200);
        return () => clearTimeout(typingOffTimer);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [activeChatId]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeChat || !inputText.trim()) return;

    const offerVal = buyerOfferInput ? parseFloat(buyerOfferInput) : undefined;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "seller", // Since user acts as the seller of the items being bargains
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ...(offerVal ? { offerValue: offerVal } : {})
    };

    const updatedMessages = [...activeChat.messages, newMessage];

    onUpdateChat(activeChat.chatId, {
      messages: updatedMessages,
      lastUpdated: new Date().toISOString(),
      ...(offerVal ? { 
        currentOffer: offerVal,
        lastOfferSender: "seller"
      } : {})
    });

    setInputText("");
    setBuyerOfferInput("");
    setAiAdvice(null);

    // Simulate partner response if talking to Sarah
    if (activeChat.chatId === "chat-sarah-jenkins") {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const sarahResponse: ChatMessage = {
          id: `msg-sarah-reply-${Date.now()}`,
          sender: "buyer",
          text: offerVal 
            ? `Thanks for your counter of $${offerVal}! That sounds really reasonable, but let me sleep on it or see if I can meet you sooner. Let's arrange meeting parameters.`
            : `That works for me! I'm completely free this afternoon. What's the best cafe for the exchange?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        onUpdateChat(activeChat.chatId, {
          messages: [...updatedMessages, sarahResponse],
          lastUpdated: new Date().toISOString()
        });
      }, 3000);
    }
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
          conversationRole: "advisor",
          chatHistory: activeChat.messages.slice(-5)
        })
      });

      if (!response.ok) {
        throw new Error("Failed to communicate with Vendoora Negotiation server.");
      }

      const generatedAdvice = await response.json();
      setAiAdvice(generatedAdvice);
    } catch (err) {
      console.error(err);
      // High-quality fallback advice in case API is offline/not key
      setAiAdvice({
        evaluation: "counter",
        suggestedCounterPrice: Math.round((activeChat.currentOffer || 0) + ((activeProduct?.price || 0) - (activeChat.currentOffer || 0)) * 0.4),
        strategicAdvice: "The buyer has high trust level (99%) and is motivated to collect local today at Town Square. Settle near $275.00 for a optimal fast cycle win.",
        replyMessage: "Hey Sarah! Appreciate the quick transaction. Settle on $275.00 cash today?"
      });
    } finally {
      setLoadingAdvice(false);
    }
  };

  const handleApplyAIReasoning = () => {
    if (!aiAdvice || !activeChat) return;

    setInputText(aiAdvice.replyMessage);
    if (aiAdvice.suggestedCounterPrice) {
      setBuyerOfferInput(aiAdvice.suggestedCounterPrice.toString());
    }
    setAiAdvice(null);
  };

  const handleAcceptOffer = () => {
    if (!activeChat || !activeProduct) return;

    const acceptedPrice = activeChat.currentOffer || activeProduct.price;

    const systemMessage: ChatMessage = {
      id: `msg-sys-${Date.now()}`,
      sender: "system",
      text: `Proposal ACCEPTED! Vendoora Double-Lock Escrow holds $${acceptedPrice}. Settle hand-off coordinates safely.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    onUpdateChat(activeChat.chatId, {
      status: "accepted",
      messages: [...activeChat.messages, systemMessage],
      lastUpdated: new Date().toISOString()
    });
  };

  const handleDeclineOffer = () => {
    if (!activeChat) return;

    const systemMessage: ChatMessage = {
      id: `msg-sys-${Date.now()}`,
      sender: "system",
      text: `Offer of $${activeChat.currentOffer} has been declined. Floor price stands confidential.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    onUpdateChat(activeChat.chatId, {
      messages: [...activeChat.messages, systemMessage],
      lastUpdated: new Date().toISOString()
    });
  };

  // Filter messages sidebar list based on local search
  const filteredChats = chats.filter((c) => {
    if (sidebarFilter === "selling") {
      // In this mock context, you are selling products that are not user created but in escrow bargaining state
      return c.chatId === "chat-sarah-jenkins" || c.chatId === "chat-david-chen";
    }
    return true; // All Chats
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto space-y-6"
      id="messages-pane-wrapper"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-50 min-h-[600px]" id="negotiate-chat-grid">
        
        {/* Sidebar Panel Left (3/4 Columns width) */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-150 p-5 flex flex-col justify-between shadow-xs" id="chat-sidebar">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold tracking-tight text-slate-950 font-sans">Messages</h2>
              <span className="font-mono text-[10px] text-slate-400 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md font-semibold">
                {chats.length} threads
              </span>
            </div>

            {/* Quick Filter Selection Segment Controls */}
            <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl text-xs font-semibold" id="sidebar-filters-panel">
              <button
                onClick={() => setSidebarFilter("all")}
                className={`py-2 px-3 rounded-lg transition-all cursor-pointer ${
                  sidebarFilter === "all" ? "bg-white text-slate-900 shadow-xs font-bold" : "text-slate-505 text-slate-500 hover:text-slate-800"
                }`}
              >
                All Chats
              </button>
              <button
                onClick={() => setSidebarFilter("selling")}
                className={`py-2 px-3 rounded-lg transition-all cursor-pointer ${
                  sidebarFilter === "selling" ? "bg-white text-slate-900 shadow-xs font-bold" : "text-slate-505 text-slate-500 hover:text-slate-800"
                }`}
              >
                Selling
              </button>
            </div>

            {/* Scrollable list of chats */}
            <div className="space-y-2 max-h-[460px] overflow-y-auto" id="sessions-scroll-list">
              {filteredChats.map((ch) => {
                const prod = products.find((p) => p.id === ch.productId);
                const isActive = ch.chatId === activeChatId;
                const lastMsg = ch.messages[ch.messages.length - 1];

                // Setup specific avatars
                let displayAvatar = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80";
                if (ch.buyerName === "David Chen") {
                  displayAvatar = "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80";
                } else if (ch.buyerName === "Elena Rodriguez") {
                  displayAvatar = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80";
                }

                return (
                  <div
                    key={ch.chatId}
                    onClick={() => onSetSelectedChatId(ch.chatId)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-left relative flex gap-3.5 items-center ${
                      isActive 
                        ? "bg-slate-100 border-slate-200 shadow-xs" 
                        : "bg-white border-transparent hover:bg-slate-50"
                    }`}
                    id={`session-item-${ch.chatId}`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={displayAvatar}
                        className="w-11 h-11 object-cover rounded-full ring-2 ring-white"
                        alt={ch.buyerName}
                      />
                      {ch.chatId === "chat-sarah-jenkins" && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                      )}
                    </div>

                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <h4 className="font-bold text-slate-900 text-xs truncate">
                          {ch.buyerName}
                        </h4>
                        <span className="text-[10px] font-mono text-slate-400">
                          {lastMsg ? lastMsg.timestamp : "10:45 AM"}
                        </span>
                      </div>
                      
                      <p className="text-[11px] text-slate-500 truncate leading-snug">
                        {lastMsg ? lastMsg.text : "..."}
                      </p>
                    </div>

                    {ch.status === "accepted" && (
                      <span className="absolute top-3.5 right-3.5 h-2 w-2 rounded-full bg-emerald-500" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center gap-3" id="profile-dock">
            <img 
              src={currentUser.avatar}
              className="w-9 h-9 object-cover rounded-full border border-slate-200"
              alt="My Profile"
            />
            <div className="text-[10px] font-mono text-left">
              <span className="block font-bold text-slate-800 font-sans">{currentUser.username}</span>
              <span className="text-slate-400 capitalize">Role Coordinate: {currentUser.role}</span>
            </div>
          </div>
        </div>

        {/* Right Section Panel (Active conversation thread + strategic assistant) */}
        <div className="lg:col-span-8 flex flex-col md:grid md:grid-cols-12 gap-5" id="chat-conversation-area">
          
          {/* Main conversation pane */}
          <div className="md:col-span-12 xl:col-span-8 bg-white rounded-3xl border border-slate-150 p-5 flex flex-col justify-between h-[580px] shadow-xs" id="chat-thread-pane">
            
            {activeChat ? (
              <>
                {/* Active user header block */}
                <div className="pb-4 border-b border-slate-100 flex justify-between items-center" id="active-chat-header">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={
                          activeChat.buyerName === "David Chen"
                            ? "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80"
                            : activeChat.buyerName === "Elena Rodriguez"
                            ? "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80"
                            : "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80"
                        }
                        className="w-10 h-10 object-cover rounded-full"
                        alt={activeChat.buyerName}
                      />
                      {activeChat.chatId === "chat-sarah-jenkins" && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
                      )}
                    </div>
                    <div className="text-left">
                      <h3 className="font-extrabold text-slate-900 text-sm">{activeChat.buyerName}</h3>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {activeChat.chatId === "chat-sarah-jenkins" ? "Online now" : "Offline / Idle"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="p-2 rounded-full hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer">
                      <Phone className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-full hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Product Context Panel (Discussing design element) */}
                <div className="mt-3 p-3 bg-slate-50 rounded-2xl border border-slate-150 flex items-center justify-between gap-3 text-left" id="product-context">
                  <div className="flex items-center gap-3">
                    <img
                      src={activeProduct?.image || "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&w=200&q=80"}
                      className="w-11 h-11 object-cover rounded-xl border border-slate-200 shadow-2xs"
                      alt={activeProduct?.title}
                    />
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider font-mono">Discussing Item</span>
                      <h4 className="font-bold text-slate-800 text-xs lines-1 leading-snug">{activeProduct?.title}</h4>
                      <span className="font-mono text-xs font-semibold text-slate-900">${activeProduct?.price}.00</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      if (activeProduct) {
                        onNavigate("/products");
                      }
                    }}
                    className="text-[10px] bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-3 py-1.5 rounded-xl font-bold transition-all shadow-2xs"
                  >
                    View Item
                  </button>
                </div>

                {/* Messages feed bubbles list */}
                <div className="flex-grow overflow-y-auto py-4 space-y-4 pr-1 min-h-[220px]" id="message-bubbles">
                  
                  {/* Today separator */}
                  <div className="relative flex py-2 items-center justify-center">
                    <div className="border-t border-slate-100 flex-grow" />
                    <span className="mx-4 text-[9px] uppercase font-bold text-slate-400 font-mono tracking-widest bg-white px-2">Today</span>
                    <div className="border-t border-slate-100 flex-grow" />
                  </div>

                  {activeChat.messages.map((m) => {
                    const isSystem = m.sender === "system";
                    const isMe = m.sender === "seller"; // User acts as seller

                    if (isSystem) {
                      return (
                        <div key={m.id} className="text-center font-mono text-[10px] text-slate-505 text-emerald-800 bg-emerald-50/70 border border-emerald-100 py-2 px-4 rounded-xl max-w-sm mx-auto shadow-2xs">
                          {m.text}
                        </div>
                      );
                    }

                    return (
                      <div
                        key={m.id}
                        className={`flex gap-3 max-w-[85%] ${
                          isMe ? "ml-auto flex-row-reverse" : "mr-auto"
                        }`}
                      >
                        {!isMe && (
                          <img
                            src={
                              activeChat.buyerName === "David Chen"
                                ? "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80"
                                : activeChat.buyerName === "Elena Rodriguez"
                                ? "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80"
                                : "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80"
                            }
                            className="w-7 h-7 object-cover rounded-full mt-0.5 shrink-0"
                            alt={activeChat.buyerName}
                          />
                        )}
                        <div className="flex flex-col">
                          <div className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                            isMe 
                              ? "bg-slate-900 text-white rounded-tr-xs" 
                              : "bg-slate-100 text-slate-800 rounded-tl-xs"
                          }`}>
                            <p>{m.text}</p>
                            
                            {m.offerValue && (
                              <div className="mt-2 text-[10px] font-mono font-bold uppercase py-1 px-2.5 bg-black/10 rounded border border-white/10 block">
                                S17 Offer Settle Propose: ${m.offerValue}.00
                              </div>
                            )}
                          </div>
                          <span className={`text-[9px] font-mono text-slate-400 mt-1 ${isMe ? "text-right" : "text-left"}`}>
                            {m.timestamp}
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  {/* High Fidelity Active Offer Received Card Block (Sarah Jenkins mockup specific) */}
                  {activeChat.chatId === "chat-sarah-jenkins" && activeChat.status === "bargaining" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="max-w-md mx-auto my-4 bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-4 text-center relative shadow-xs"
                      id="offer-proposal-card"
                    >
                      <div className="space-y-1">
                        <span className="text-[9px] font-mono font-extrabold text-blue-600 uppercase tracking-widest">
                          New Offer Received
                        </span>
                        <h4 className="font-black text-slate-950 font-mono text-2xl">
                          ${activeChat.currentOffer}.00
                        </h4>
                        <span className="text-[10px] text-slate-450 text-slate-500 font-semibold block">
                          Pending your approval
                        </span>
                      </div>

                      {/* Custom note textbox from mock */}
                      <div className="bg-white rounded-xl p-3 border border-slate-150 text-[11px] text-slate-600 text-left leading-relaxed italic">
                        "I can meet at the Town Square cafe anytime before 5 PM today for a quick transaction. Cash or digital payment works!"
                      </div>

                      <div className="grid grid-cols-2 gap-2.5 pt-1">
                        <button
                          onClick={handleDeclineOffer}
                          className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 py-2.5 px-4 rounded-xl text-xs font-extrabold shadow-3xs hover:border-slate-300 transition-all cursor-pointer"
                        >
                          Decline
                        </button>
                        <button
                          onClick={handleAcceptOffer}
                          className="bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-xl text-xs font-black shadow-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Check className="w-4 h-4" /> Accept Offer
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Typing Indicator dots */}
                  {isTyping && (
                    <div className="flex gap-2 items-center text-slate-400 text-xs text-left" id="partner-typing-indicator">
                      <img
                        src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80"
                        className="w-6 h-6 object-cover rounded-full"
                        alt="Sarah"
                      />
                      <span className="text-[10px] italic">Sarah is typing</span>
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  )}

                </div>

                {/* Input block region */}
                <div className="pt-4 border-t border-slate-100 space-y-3" id="chat-input-controls">
                  
                  {activeChat.status === "bargaining" && (
                     <div className="flex gap-2 items-center">
                       <input
                         type="number"
                         placeholder="Counter-offer price ($)..."
                         value={buyerOfferInput}
                         onChange={(e) => setBuyerOfferInput(e.target.value)}
                         className="w-1/3 bg-slate-50 text-slate-800 text-[10px] font-mono border border-slate-200 rounded-lg px-2.5 py-1.5 shadow-inner focus:outline-hidden"
                       />
                       <span className="text-[10px] text-slate-500 font-semibold">Propose Counter Price (Optional)</span>
                     </div>
                  )}

                  <div className="flex items-center gap-2">
                    <button className="text-slate-400 hover:text-slate-650 p-1 cursor-pointer" title="Add files">
                      <PlusCircle className="w-5 h-5 text-slate-400" />
                    </button>
                    <button className="text-slate-400 hover:text-slate-650 p-1 cursor-pointer" title="Add emoji">
                      <Smile className="w-5 h-5 text-slate-400" />
                    </button>

                    <form onSubmit={handleSendMessage} className="flex-grow flex items-center relative gap-2">
                      <input
                        type="text"
                        placeholder={
                          activeChat.status !== "bargaining" 
                            ? "This channel transaction closed." 
                            : `Message ${activeChat.buyerName}...`
                        }
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        disabled={activeChat.status !== "bargaining"}
                        className="w-full bg-slate-50 text-slate-800 text-xs border border-slate-150 rounded-xl pl-3 pr-10 py-3 block outline-hidden focus:border-blue-500 text-left"
                      />
                      <button
                        type="submit"
                        disabled={activeChat.status !== "bargaining"}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-700 disabled:text-slate-300 cursor-pointer"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  </div>

                  {/* Trust caution warning */}
                  <div className="bg-slate-50 rounded-lg py-2 px-3 flex items-center justify-center gap-1.5 border border-slate-150 text-[10px] text-slate-450 text-slate-500 font-medium" id="escrow-warning-footer">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Payments are only protected when made through Vendoora.</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-20 text-slate-400 text-sm flex-grow flex flex-col items-center justify-center space-y-4">
                <MessageSquare className="w-12 h-12 text-slate-300" />
                <p>No active message coordinates selected. Choose a partner.</p>
              </div>
            )}
          </div>

          {/* AI Advisor Panel right S21 (Preserved and Refined to slot in perfectly) */}
          <div className="md:col-span-12 xl:col-span-4 bg-gradient-to-br from-slate-950 to-slate-900 text-white rounded-3xl p-5 border border-slate-850 flex flex-col justify-between h-[580px] shadow-xs" id="ai-negotiator-advisor">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2.5 border-b border-slate-800">
                <span className="text-[10px] uppercase font-mono font-black text-blue-400 flex items-center gap-1.5 tracking-wider">
                  <Sparkles className="w-4 h-4 text-blue-400" /> Vendoora AI Oracle
                </span>
                <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 font-mono text-[9px] font-bold px-2 py-0.5 rounded-full">
                  Strategic Advisor
                </span>
              </div>

              {activeChat ? (
                <div className="space-y-4 text-xs">
                  <p className="text-slate-300 leading-relaxed text-[11px] text-left">
                    We evaluate {activeChat.buyerName}'s response velocity, community trust ranking, and historical transaction escrow values to optimize your pricing clearance.
                  </p>

                  <div className="p-3.5 bg-slate-900 rounded-2xl border border-slate-800 text-left space-y-2">
                    <span className="text-[9px] uppercase font-mono font-bold text-slate-400 block tracking-wider">Analysis Coordinates</span>
                    <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-300">
                      <div>Asking price: <span className="text-white font-bold">${activeProduct?.price}</span></div>
                      <div>Buyer Trust: <span className="text-emerald-400 font-bold">99%</span></div>
                      <div>Floor min: <span className="text-slate-400 font-bold">${activeChat.sellerMinPrice}</span></div>
                      <div>Partner code: <span className="text-slate-400 font-bold">VERIF</span></div>
                    </div>
                  </div>

                  <button
                    onClick={handleRequestAIAdviser}
                    disabled={loadingAdvice}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 text-white text-xs font-bold py-3 rounded-2xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {loadingAdvice ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Fetching Strategic Matrices...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-blue-300" /> Consult AI Advisor S21
                      </>
                    )}
                  </button>

                  <AnimatePresence>
                    {aiAdvice ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-3.5 bg-blue-900/20 rounded-2xl border border-blue-800/40 space-y-3 text-left"
                        id="ai-advice-bubble"
                      >
                        <div className="flex justify-between items-center text-[10px] font-mono">
                          <span className="font-bold text-blue-300 uppercase tracking-widest text-[9px]">
                            SUGGESTION: {aiAdvice.evaluation.toUpperCase()}
                          </span>
                          {aiAdvice.suggestedCounterPrice && (
                            <span className="text-emerald-400 font-extrabold">
                              Counter: ${aiAdvice.suggestedCounterPrice}
                            </span>
                          )}
                        </div>

                        <p className="text-[10px] text-slate-300 leading-relaxed font-sans">
                          {aiAdvice.strategicAdvice}
                        </p>

                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-850">
                          <span className="text-[8px] font-mono font-extrabold text-slate-400 uppercase tracking-widest block mb-1">Pre-filled Response</span>
                          <p className="text-[10px] italic text-slate-100 leading-normal">"{aiAdvice.replyMessage}"</p>
                        </div>

                        <button
                          onClick={handleApplyAIReasoning}
                          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[10px] py-2 rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        >
                          Use Advice & Write inputs
                        </button>
                      </motion.div>
                    ) : (
                      <div className="p-4 rounded-2xl border border-dashed border-slate-800 text-slate-500 text-center text-[10px] leading-normal" id="ai-blank-state">
                        Run strategic computation to view negotiation recommendations, pre-filled responses, and optimum counters.
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <p className="text-xs text-slate-400 text-left">Select an active negotiation thread channel to initialize analytical models.</p>
              )}
            </div>

            <div className="pt-4 border-t border-slate-800/60 text-[9px] text-slate-500 text-left leading-normal" id="escrow-note-ai">
              🔒 Standard Escrow controls apply. Confidential negotiations are never disclosed on the buyer's storefront registry under standard protective laws.
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}
