import React from "react";
import { UserProfile } from "../types";
import { 
  MapPin, Search, Compass, MessageSquare, Store, CheckCircle, 
  ArrowRight, Sparkles, ChevronRight, ChevronLeft, Sliders, X, Laptop, Navigation, Check 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface OnboardingViewProps {
  currentUser: UserProfile;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onNavigate: (route: string) => void;
}

export default function OnboardingView({ currentUser, onUpdateUser, onNavigate }: OnboardingViewProps) {
  const [step, setStep] = React.useState<number>(1);
  
  // Step 2 state variables
  const [locationInput, setLocationInput] = React.useState("");
  const [precisionEnabled, setPrecisionEnabled] = React.useState(false);
  const [selectedInterests, setSelectedInterests] = React.useState<string[]>([]);
  
  // Step 3 animation counters
  const [chatAccepted, setChatAccepted] = React.useState(false);

  const interestCategories = [
    {
      id: "electronics",
      title: "Electronics",
      icon: "devices",
      image: "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "fashion",
      title: "Fashion",
      icon: "apparel",
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "home",
      title: "Home & Craft",
      icon: "home",
      image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "vehicles",
      title: "Vehicles",
      icon: "directions_car",
      image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=400&q=80",
    }
  ];

  const handleNextStep = () => {
    if (step < 4) {
      setStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  const handleBypassOnboarding = () => {
    onUpdateUser({ onboardingStep: 0 });
    onNavigate("/dashboard");
  };

  const toggleInterest = (id: string) => {
    if (selectedInterests.includes(id)) {
      setSelectedInterests(prev => prev.filter(item => item !== id));
    } else {
      setSelectedInterests(prev => [...prev, id]);
    }
  };

  const handleUseLocation = () => {
    setLocationInput("Brooklyn, NY (11201)");
    setPrecisionEnabled(true);
  };

  const handleCompleteOnboarding = () => {
    onUpdateUser({ 
      onboardingStep: 0,
      trustScore: currentUser.trustScore + 10 // Reward for finishing the setup program
    });
    onNavigate("/dashboard");
  };

  // Render the views dynamically matching visual aesthetics of user JSONs/HTMLs
  return (
    <div className="max-w-[700px] mx-auto my-6" id="onboarding-flow-wrapper">
      
      {/* Top Banner step info */}
      <div className="bg-white border border-slate-150 rounded-2xl p-6 md:p-8 shadow-md relative overflow-hidden" id="onboarding-canvas">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-blue-600 tracking-tight text-lg">Vendoora</span>
            <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-bold">Onboarding Program</span>
          </div>
          <button 
            onClick={handleBypassOnboarding}
            className="text-xs text-slate-400 hover:text-slate-600 font-semibold uppercase tracking-wider"
          >
            Exit
          </button>
        </div>

        {/* Dynamic step bar visualizer */}
        <div className="space-y-2 mb-8">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-blue-600 font-mono">Step {step} of 4</span>
            <span className="font-semibold text-slate-500 font-mono">{step * 25}% Complete</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-500 ease-out"
              style={{ width: `${step * 25}%` }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: -10, x: -10 }}
              className="space-y-6 text-center flex flex-col items-center"
              id="onboarding-step-1"
            >
              {/* Step 1 Visual card */}
              <div className="w-full aspect-[16/10] rounded-xl overflow-hidden shadow-md relative bg-blue-50" id="s1-illustration">
                <img 
                  alt="Neighborhood commerce" 
                  src="https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=800&q=80"
                  className="w-full h-full object-cover grayscale-[0.05] brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent flex items-end p-6">
                  <span className="text-white text-sm font-semibold max-w-sm text-left">
                    "Shop your neighborhood, build your empire."
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Welcome to Vendoora, {currentUser.username}!
                </h1>
                <p className="text-slate-500 text-sm max-w-lg leading-relaxed">
                  Your journey to buying and listing trade assets starts here. Join an integrated peer-to-peer ecosystem designed for safety, precision, and quick bargains.
                </p>
              </div>

              <div className="w-full pt-4 space-y-3">
                <button
                  onClick={handleNextStep}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-blue-500/10 flex items-center justify-center gap-2"
                >
                  Start Setup Program <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={handleBypassOnboarding}
                  className="w-full py-2.5 hover:bg-slate-50 text-slate-500 font-semibold rounded-xl text-xs transition-colors"
                >
                  Skip walk-through and explore first
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: -10, x: -10 }}
              className="space-y-8"
              id="onboarding-step-2"
            >
              {/* Geolocation search parameters */}
              <div className="space-y-4 text-left">
                <div className="space-y-1">
                  <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Where are you trading from?</h2>
                  <p className="text-xs text-slate-400">Set your physical coordinates to find local neighborhood wares and speed up hand-offs.</p>
                </div>

                <div className="space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      type="text"
                      value={locationInput}
                      onChange={(e) => setLocationInput(e.target.value)}
                      placeholder="Enter city, borough, or postal ZIP code"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-250 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all text-slate-800"
                    />
                  </div>

                  <button
                    onClick={handleUseLocation}
                    type="button"
                    className="w-full py-3 border border-dashed border-blue-300 text-blue-600 hover:bg-blue-50/50 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
                  >
                    <Navigation className="w-4 h-4" /> Use Current Geolocation
                  </button>
                </div>

                {/* Satellite map outline wrapper */}
                <div className="h-32 bg-slate-100 rounded-xl border border-slate-200 overflow-hidden relative shadow-inner">
                  <img 
                    alt="Grid Map"
                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80"
                    className="w-full h-full object-cover opacity-80 hue-rotate-[200deg] brightness-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                  <div className="absolute bottom-3 left-4 flex items-center gap-2 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full border border-slate-200 shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-mono font-bold text-slate-700">
                      {precisionEnabled ? "Brooklyn Escrow Safe-Zone active" : "Escrow coordinate lock disabled"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Interest Selector */}
              <div className="space-y-4 text-left">
                <div className="space-y-1">
                  <h3 className="text-sm font-extrabold text-slate-800">What items are you seeking to discover?</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Select your default interests to calibrate active trade recommendation indexes.</p>
                </div>

                <div className="grid grid-cols-2 gap-3" id="interests-grid">
                  {interestCategories.map((cat) => {
                    const active = selectedInterests.includes(cat.id);
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => toggleInterest(cat.id)}
                        className={`group relative h-24 rounded-xl overflow-hidden border transition-all text-left shadow-xs ${
                          active ? "border-blue-600 ring-2 ring-blue-500/20" : "border-slate-200 hover:border-slate-300"
                        }`}
                        id={`interest-card-${cat.id}`}
                      >
                        <img 
                          alt={cat.title} 
                          src={cat.image} 
                          className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-500" 
                        />
                        <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/20 transition-colors" />
                        <div className="absolute inset-x-3 bottom-3 flex justify-between items-center z-10 text-white">
                          <span className="font-bold text-xs truncate leading-snug">{cat.title}</span>
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center border text-[9px] ${
                            active ? "bg-white border-white text-blue-600 font-bold" : "border-white/50 text-transparent"
                          }`}>
                            ✓
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Navigation keys */}
              <div className="flex gap-3 pt-4 justify-between items-center" id="onboarding-controls">
                <button
                  onClick={handlePrevStep}
                  className="px-5 py-2.5 text-slate-500 hover:bg-slate-50 font-semibold rounded-xl text-xs flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={handleNextStep}
                  disabled={!locationInput && selectedInterests.length === 0}
                  className={`px-8 py-2.5 text-white font-bold rounded-xl text-xs flex items-center gap-1 transition-all ${
                    locationInput || selectedInterests.length > 0 
                      ? "bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/10 hover:scale-[1.01]" 
                      : "bg-slate-200 cursor-not-allowed"
                  }`}
                >
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: -10, x: -10 }}
              className="space-y-6"
              id="onboarding-step-3"
            >
              <div className="space-y-1 text-left">
                <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Unlock the power of local trade.</h2>
                <p className="text-xs text-slate-500">Take a quick walkthrough of Vendoora's core platform tools.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                {/* Cartography grid local tool */}
                <div className="border border-slate-150 rounded-xl p-4 bg-slate-50 space-y-3 flex flex-col justify-between" id="walkthrough-discover animate-pulse">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono text-blue-600 font-bold tracking-widest uppercase block">Hyper-Local map Discovery</span>
                    <h3 className="font-bold text-xs text-slate-700">Scan Wares Blocks away</h3>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      Your interest indexes display directly on a live interactive street map, so coordinate pick-ups are safe and require zero delivery wait cycles.
                    </p>
                  </div>
                  <div className="h-20 rounded-lg overflow-hidden relative border border-slate-200">
                    <img 
                      alt="Grid Map snippet"
                      src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=400&q=80"
                      className="w-full h-full object-cover saturate-[0.8]"
                    />
                    <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md border border-slate-100 text-[9px] font-bold text-slate-600">
                      Searching nearby... 24 items
                    </div>
                  </div>
                </div>

                {/* Smart Escrow Negotiate tool */}
                <div className="border border-slate-150 rounded-xl p-4 bg-slate-50 space-y-3 flex flex-col justify-between" id="walkthrough-negotiator">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono text-emerald-600 font-bold tracking-widest uppercase block">AI Escrow Bargaining Engine</span>
                    <h3 className="font-bold text-xs text-slate-700">Direct Smart negotiations</h3>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      Lock trades under Double-Lock Escrow conditions. Bargain with AI advisors, make counters, or authorize instant balance clearances cleanly.
                    </p>
                  </div>
                  
                  {/* Interactive micro-bargain card */}
                  <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-semibold">
                      <span className="text-slate-500">Offer Value Receipt</span>
                      <span className="text-emerald-600 font-mono font-bold">$145.00</span>
                    </div>
                    <button 
                      onClick={() => setChatAccepted(!chatAccepted)}
                      className={`w-full py-1 rounded text-[10px] font-bold transition-all ${
                        chatAccepted ? "bg-emerald-100 text-emerald-800" : "bg-emerald-500 hover:bg-emerald-600 text-white"
                      }`}
                    >
                      {chatAccepted ? "✓ Offer Accepted!" : "Mock Accept Offer"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Single row: Digital Shopfront */}
              <div className="border border-slate-150 rounded-xl p-5 bg-slate-50 flex flex-col md:flex-row items-center gap-5 text-left" id="walkthrough-shopfront">
                <div className="md:w-1/2 space-y-1.5">
                  <span className="text-[10px] font-mono text-sky-600 font-bold tracking-widest uppercase block">Pro digital Storefronts</span>
                  <h3 className="font-bold text-xs text-slate-700">Build Your P2P Boutique</h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Verify list tags and launch beautiful catalogs, complete with rating stars of excellence and guaranteed buyer shields.
                  </p>
                </div>
                <div className="flex-1 w-full bg-white rounded-xl border border-slate-200 p-3 flex gap-3 shadow-xs">
                  <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                    <img 
                      alt="Sony watch icon"
                      src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=150&q=80"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-grow">
                    <span className="text-[9px] uppercase font-mono font-bold text-blue-500 block">Electronics</span>
                    <h4 className="font-bold text-xs text-slate-800 truncate">Sleek Aero watch Pro</h4>
                    <p className="font-mono text-xs font-bold text-slate-800 leading-none mt-1">$199.00</p>
                  </div>
                </div>
              </div>

              {/* Navigation keys */}
              <div className="flex gap-3 pt-4 justify-between items-center" id="onboarding-controls">
                <button
                  onClick={handlePrevStep}
                  className="px-5 py-2.5 text-slate-500 hover:bg-slate-50 font-semibold rounded-xl text-xs flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={handleNextStep}
                  className="px-8 ... py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-1 shadow-md shadow-blue-500/10 hover:scale-[1.01] transition-transform"
                >
                  Continue to Final Step <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8 text-center flex flex-col items-center py-6"
              id="onboarding-step-4"
            >
              {/* Confetti animation background wrapper */}
              <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2 animate-bounce">
                <Check className="w-10 h-10 stroke-[3px]" />
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                  You're all set!
                </h1>
                <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
                  Your local shipping tags are adjusted and your verified escrow credentials are fully certified. Welcome to the modern P2P commerce empire.
                </p>
              </div>

              {/* Double choices card section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full text-left pt-2">
                <button
                  onClick={() => {
                    onUpdateUser({ onboardingStep: 0 });
                    onNavigate("/products");
                  }}
                  className="p-5 border border-slate-200 bg-white hover:border-blue-600 hover:bg-blue-50/25 rounded-xl transition-all flex flex-col gap-2 group shadow-sm text-left"
                  id="action-explore"
                >
                  <div className="p-2 bg-blue-100 text-blue-700 rounded-lg w-fit group-hover:scale-105 transition-transform">
                    <Compass className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-xs text-slate-800 leading-tight">Explore Brooklyn Wares</h3>
                  <p className="text-[10px] text-slate-500 leading-snug">
                    Browse active local products listed in your current neighborhood safely.
                  </p>
                </button>

                <button
                  onClick={() => {
                    onUpdateUser({ onboardingStep: 0 });
                    onNavigate("/ai/list");
                  }}
                  className="p-5 border border-slate-200 bg-white hover:border-emerald-600 hover:bg-emerald-50/25 rounded-xl transition-all flex flex-col gap-2 group shadow-sm text-left"
                  id="action-list"
                >
                  <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg w-fit group-hover:scale-105 transition-transform">
                    <Store className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-xs text-slate-800 leading-tight">Setup Local Storefront</h3>
                  <p className="text-[10px] text-slate-500 leading-snug">
                    List your very first item using our Gemini AI Listing Architect.
                  </p>
                </button>
              </div>

              <div className="w-full pt-4">
                <button
                  onClick={handleCompleteOnboarding}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors shadow-md shadow-blue-500/10 uppercase tracking-wider"
                >
                  Open Core Dashboard S12
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Decorative footer snippet */}
      <div className="py-6 text-center text-[10px] text-slate-400 font-mono">
        Integrated with double-lock escrow protocols. Authorized and vetted by Vendoora.
      </div>
    </div>
  );
}
