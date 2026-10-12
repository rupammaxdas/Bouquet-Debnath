/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  ExternalLink, 
  AlertTriangle, 
  CheckCircle2, 
  Copy, 
  Check, 
  LogOut, 
  Loader2, 
  Sparkles,
  ShieldCheck,
  Flower2,
  Lock
} from "lucide-react";
import { useAuth } from "../lib/AuthContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialMessage?: string;
}

export function AuthModal({ isOpen, onClose, onSuccess, initialMessage }: AuthModalProps) {
  const { 
    user, 
    isLoading, 
    authError, 
    signInWithGoogle, 
    signInAsCustomer, 
    signOutUser,
    clearAuthError 
  } = useAuth();

  const [activeTab, setActiveTab] = useState<"google" | "customer">("google");
  const [copiedDomain, setCopiedDomain] = useState(false);

  // Customer Form State
  const [custName, setCustName] = useState("");
  const [custEmail, setCustEmail] = useState("");
  const [custPhone, setCustPhone] = useState("");
  const [isSubmittingCust, setIsSubmittingCust] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  // Quick Google Email fallback form if popup is blocked or domain is unauthorized
  const [quickGoogleEmail, setQuickGoogleEmail] = useState("");
  const [quickGoogleName, setQuickGoogleName] = useState("");
  const [isQuickGoogleSubmitting, setIsQuickGoogleSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      clearAuthError();
      setFormSuccess(false);
      if (user) {
        setCustName(user.displayName || "");
        setCustEmail(user.email || "");
        setCustPhone(user.phone || "");
      } else {
        try {
          const saved = JSON.parse(localStorage.getItem("debnath_customer_profile") || "{}");
          if (saved.name) setCustName(saved.name);
          if (saved.email) {
            setCustEmail(saved.email);
            setQuickGoogleEmail(saved.email);
          }
          if (saved.phone) setCustPhone(saved.phone);
        } catch {}
      }
    }
  }, [isOpen, user, clearAuthError]);

  const handleGoogleClick = async () => {
    const res = await signInWithGoogle();
    if (res.success) {
      onSuccess?.();
      onClose();
    }
  };

  const handleCopyDomain = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.hostname);
      setCopiedDomain(true);
      setTimeout(() => setCopiedDomain(false), 2500);
    }
  };

  const handleCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName.trim() || !custEmail.trim()) return;

    setIsSubmittingCust(true);
    try {
      await signInAsCustomer(custName, custEmail, custPhone);
      setFormSuccess(true);
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 900);
    } finally {
      setIsSubmittingCust(false);
    }
  };

  const handleQuickGoogleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickGoogleEmail.trim()) return;

    setIsQuickGoogleSubmitting(true);
    try {
      const displayName = quickGoogleName.trim() || quickGoogleEmail.split("@")[0];
      await signInAsCustomer(displayName, quickGoogleEmail.trim(), "");
      setFormSuccess(true);
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 900);
    } finally {
      setIsQuickGoogleSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 bg-stone-900/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-stone-900 text-white flex items-center justify-center">
                <Flower2 size={18} />
              </div>
              <div>
                <h3 className="font-display font-medium text-lg text-stone-900 leading-tight">
                  Debnath Boutique
                </h3>
                <p className="text-[11px] text-stone-500">
                  Customer Sign In & Account Management
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-200/50 rounded-full transition-colors"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6 sm:p-7 overflow-y-auto space-y-6">
            {initialMessage && (
              <div className="p-3 bg-stone-100 rounded-2xl text-xs text-stone-700 flex items-center gap-2">
                <Sparkles size={16} className="text-stone-500 shrink-0" />
                <span>{initialMessage}</span>
              </div>
            )}

            {/* If Already Signed In */}
            {user ? (
              <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-4">
                <div className="flex items-center gap-3.5">
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt="" 
                      className="w-12 h-12 rounded-full border border-stone-200 object-cover" 
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-stone-900 text-white flex items-center justify-center font-bold text-sm">
                      {user.displayName ? user.displayName[0].toUpperCase() : "C"}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-semibold text-stone-900 truncate">
                        {user.displayName || "Valued Customer"}
                      </h4>
                      <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                      {user.isAdmin && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-stone-900 text-white font-semibold">
                          Admin
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-500 truncate">{user.email}</p>
                    <span className="inline-block mt-1 text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                      {user.isGoogleUser ? "Google Account Active" : "Customer Profile Active"}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-200/60 flex items-center justify-between">
                  <button
                    onClick={signOutUser}
                    disabled={isLoading}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-1.5 transition-colors"
                  >
                    <LogOut size={14} />
                    <span>Sign Out</span>
                  </button>
                  <button
                    onClick={onClose}
                    className="px-5 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors"
                  >
                    Continue to Boutique
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Mode Selector Tabs */}
                <div className="grid grid-cols-2 p-1 bg-stone-100 rounded-2xl gap-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab("google")}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                      activeTab === "google"
                        ? "bg-white text-stone-900 shadow-xs"
                        : "text-stone-500 hover:text-stone-900"
                    }`}
                  >
                    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                    </svg>
                    <span>Google Sign In</span>
                    <span className="text-[9px] uppercase px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                      Recommended
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("customer")}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                      activeTab === "customer"
                        ? "bg-white text-stone-900 shadow-xs"
                        : "text-stone-500 hover:text-stone-900"
                    }`}
                  >
                    <User size={13} />
                    <span>Customer Sign In</span>
                  </button>
                </div>

                {/* TAB 1: Recommended Google Account */}
                {activeTab === "google" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <button
                        onClick={handleGoogleClick}
                        disabled={isLoading}
                        className="w-full py-3.5 px-4 rounded-2xl border-2 border-stone-900 bg-stone-900 text-white font-medium text-xs hover:bg-stone-800 transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow active:scale-[0.99] disabled:opacity-50"
                      >
                        {isLoading ? (
                          <Loader2 size={16} className="animate-spin text-white" />
                        ) : (
                          <svg className="w-4 h-4 shrink-0 fill-current" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                          </svg>
                        )}
                        <span>{isLoading ? "Connecting to Google..." : "Continue with Google Account"}</span>
                      </button>
                      <p className="text-[11px] text-stone-500 text-center">
                        Syncs live orders, receipts, and bespoke preferences instantly.
                      </p>
                    </div>

                    {/* Error Resolution Callout if OAuth encounters domain or popup restrictions */}
                    {authError && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-3"
                      >
                        <div className="flex items-start gap-2">
                          <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                          <div className="text-xs">
                            <span className="font-semibold block">
                              {authError.code === "auth/unauthorized-domain"
                                ? "Firebase Domain Authorization Notice"
                                : authError.code === "auth/popup-blocked"
                                ? "Popup Blocked by Browser"
                                : "Google Sign-In Alert"}
                            </span>
                            <span className="text-[11px] text-amber-800 leading-relaxed block mt-1">
                              {authError.message}
                            </span>
                          </div>
                        </div>

                        {/* Direct Domain Authorization Helper */}
                        {authError.code === "auth/unauthorized-domain" && authError.domain && (
                          <div className="p-3 bg-white rounded-xl border border-amber-200 text-xs space-y-2">
                            <p className="text-[11px] font-medium text-stone-700">
                              Domain to add to Firebase Console:
                            </p>
                            <div className="flex items-center gap-1.5">
                              <code className="flex-1 p-2 bg-stone-100 rounded-lg text-[10px] font-mono break-all text-stone-800">
                                {authError.domain}
                              </code>
                              <button
                                type="button"
                                onClick={handleCopyDomain}
                                className="px-2.5 py-1.5 rounded-lg bg-stone-900 text-white text-[10px] font-semibold hover:bg-stone-800 shrink-0 flex items-center gap-1"
                              >
                                {copiedDomain ? <Check size={11} /> : <Copy size={11} />}
                                <span>{copiedDomain ? "Copied" : "Copy"}</span>
                              </button>
                            </div>
                            {authError.consoleUrl && (
                              <a
                                href={authError.consoleUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-900 hover:underline pt-0.5"
                              >
                                <span>Open Firebase Settings ➔ Authorized Domains</span>
                                <ExternalLink size={11} />
                              </a>
                            )}
                          </div>
                        )}

                        {/* Fallback Direct Sign-In with Google Email */}
                        <div className="p-3 bg-amber-100/70 rounded-xl space-y-2 border border-amber-200">
                          <p className="text-[11px] font-bold text-amber-950">
                            Immediate Sign-In Solution (Bypass Popup Restrictions):
                          </p>
                          <form onSubmit={handleQuickGoogleSubmit} className="space-y-2">
                            <input
                              type="email"
                              required
                              value={quickGoogleEmail}
                              onChange={(e) => setQuickGoogleEmail(e.target.value)}
                              placeholder="Enter your Google email (e.g. name@gmail.com)"
                              className="w-full px-3 py-2 bg-white border border-amber-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:border-stone-900"
                            />
                            <input
                              type="text"
                              value={quickGoogleName}
                              onChange={(e) => setQuickGoogleName(e.target.value)}
                              placeholder="Your Name (Optional)"
                              className="w-full px-3 py-2 bg-white border border-amber-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:border-stone-900"
                            />
                            <button
                              type="submit"
                              disabled={isQuickGoogleSubmitting}
                              className="w-full py-2 bg-amber-900 text-white rounded-lg text-xs font-semibold hover:bg-amber-800 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                            >
                              {isQuickGoogleSubmitting ? (
                                <Loader2 size={13} className="animate-spin" />
                              ) : (
                                <Lock size={13} />
                              )}
                              <span>Sign In with this Google Email Now</span>
                            </button>
                          </form>
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}

                {/* TAB 2: Customer Sign In */}
                {activeTab === "customer" && (
                  <form onSubmit={handleCustomerSubmit} className="space-y-3.5">
                    <p className="text-[11px] text-stone-500">
                      Sign in directly as a Debnath customer to manage orders, arrange hand-delivery, and access your profile:
                    </p>

                    <div className="space-y-2.5">
                      <div className="relative">
                        <User size={14} className="absolute left-3.5 top-3.5 text-stone-400" />
                        <input
                          type="text"
                          required
                          value={custName}
                          onChange={(e) => setCustName(e.target.value)}
                          placeholder="Full Name *"
                          className="w-full pl-9 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-stone-900"
                        />
                      </div>

                      <div className="relative">
                        <Mail size={14} className="absolute left-3.5 top-3.5 text-stone-400" />
                        <input
                          type="email"
                          required
                          value={custEmail}
                          onChange={(e) => setCustEmail(e.target.value)}
                          placeholder="Email Address *"
                          className="w-full pl-9 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-stone-900"
                        />
                      </div>

                      <div className="relative">
                        <Phone size={14} className="absolute left-3.5 top-3.5 text-stone-400" />
                        <input
                          type="tel"
                          value={custPhone}
                          onChange={(e) => setCustPhone(e.target.value)}
                          placeholder="Contact Phone (For Hand Delivery)"
                          className="w-full pl-9 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-stone-900"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingCust}
                      className="w-full py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
                    >
                      {isSubmittingCust ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : formSuccess ? (
                        <>
                          <CheckCircle2 size={14} className="text-emerald-400" />
                          <span>Customer Signed In!</span>
                        </>
                      ) : (
                        <span>Sign In as Customer</span>
                      )}
                    </button>
                  </form>
                )}

                {/* Footer notes */}
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
                  <span className="flex items-center gap-1">
                    <ShieldCheck size={12} />
                    <span>Admin: rupammaxdas@gmail.com</span>
                  </span>
                  <span>Zero-Password Guest & Google Auth</span>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
