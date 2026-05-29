import React from "react";
import { UserProfile } from "../types";
import { ShieldCheck, LogIn, UserPlus, Lock, Mail, Users } from "lucide-react";
import { motion } from "motion/react";

interface AuthViewProps {
  mode: "login" | "register";
  onNavigate: (route: string) => void;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
}

export default function AuthView({ mode, onNavigate, onUpdateUser }: AuthViewProps) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [username, setUsername] = React.useState("");

  const handleBypassAuth = () => {
    // Elevate user session to normal state
    onUpdateUser({ onboardingStep: 0 });
    onNavigate("/dashboard");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "login") {
      onUpdateUser({ onboardingStep: 0 });
      alert("Authenticated! Opening Vendoora core dashboard.");
      onNavigate("/dashboard");
    } else {
      onUpdateUser({ username: username || "Oladimeji Azeez", email: email || "oladimejiazeez052@gmail.com", onboardingStep: 1 });
      alert("Account Created! Directing to step 1 of your Vendoora setup program.");
      onNavigate("/dashboard");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="max-w-md mx-auto my-12"
      id="auth-view"
    >
      <div className="bg-white border border-slate-150 rounded-2xl overflow-hidden shadow-lg p-6 md:p-8 space-y-6" id="auth-box">
        {/* Brand visual header */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-extrabold text-xl shadow-inner">
            V
          </div>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">
            {mode === "login" ? "S4 Login Verification" : "S6 Create P2P Account"}
          </h2>
          <p className="text-xs text-slate-500 max-w-[90%] mx-auto">
            {mode === "login" ? "Enter your coordinates to access secure trading channels." : "Establish high-trust keys to buy or list trade assets."}
          </p>
        </div>

        {/* Auth form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs" id="auth-core-form">
          {mode === "register" && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500">Desired Username / Profile handles</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="e.g. Oladimeji Azeez"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 outline-hidden focus:border-blue-500 text-slate-800"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500">Security Email address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="email"
                placeholder="oladimejiazeez052@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 outline-hidden focus:border-blue-500 text-slate-800"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500">Access Key / Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 outline-hidden focus:border-blue-500 text-slate-800"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            {mode === "login" ? (
              <>
                <LogIn className="w-4 h-4" /> Verify Credentials
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" /> Initiate Account Keys
              </>
            )}
          </button>
        </form>

        {/* Separator and Bypass */}
        <div className="relative flex py-2 items-center text-[10px] text-slate-400 font-mono uppercase" id="or-bypass-block">
          <div className="flex-grow border-t border-slate-250"></div>
          <span className="flex-shrink mx-3">Simulation tool</span>
          <div className="flex-grow border-t border-slate-250"></div>
        </div>

        <button
          onClick={handleBypassAuth}
          className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 rounded-xl text-xs font-bold transition-all border border-blue-100 flex items-center justify-center gap-1 cursor-pointer"
        >
          <ShieldCheck className="w-4 h-4 text-blue-600" /> Fast-Track Simulated Login
        </button>

        {/* Toggle link */}
        <p className="text-[10px] text-center text-slate-500 pt-2 font-medium">
          {mode === "login" ? (
            <>
              New to high-trust trading?{" "}
              <button onClick={() => onNavigate("/register")} className="text-blue-600 font-bold hover:underline">
                Register Keys S6
              </button>
            </>
          ) : (
            <>
              Already verified?{" "}
              <button onClick={() => onNavigate("/login")} className="text-blue-600 font-bold hover:underline">
                Login S4
              </button>
            </>
          )}
        </p>

      </div>
    </motion.div>
  );
}
