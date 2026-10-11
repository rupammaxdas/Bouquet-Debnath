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
  Flower2
} from "lucide-react";
import { auth, login, logout, parseAuthError, AuthErrorInfo } from "../lib/firebase";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialMessage?: string;
}

export function AuthModal({ isOpen, onClose, onSuccess, initialMessage }: AuthModalProps) {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<AuthErrorInfo | null>(null);
  const [copiedDomain, setCopiedDomain] = useState(false);

  // Customer Profile State
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setCurrentUser(u);
      if (u) {
        setCustomerName(u.displayName || "");
        setCustomerEmail(u.email || "");
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (isOpen) {
      setAuthError(null);
      setSavedSuccess(false);
      try {
        const savedProfile = localStorage.getItem("debnath_customer_profile");
        if (savedProfile) {
          const parsed = JSON.parse(savedProfile);
          if (parsed.name) setCustomerName(parsed.name);
          if (parsed.email) setCustomerEmail(parsed.email);
          if (parsed.phone) setCustomerPhone(parsed.phone);
        }
      } catch {}
    }
  }, [isOpen]);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setAuthError(null);
    try {
      await login();
      onSuccess?.();
      onClose();
    } catch (err: unknown) {
      const parsed = parseAuthError(err);
      setAuthError(parsed);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyDomain = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.hostname);
      setCopiedDomain(true);
      setTimeout(() => setCopiedDomain(false), 2500);
    }
  };

  const handleSaveCustomerProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerEmail.trim()) return;

    const profile = {
      name: customerName.trim(),
      email: customerEmail.trim(),
      phone: customerPhone.trim(),
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem("debnath_customer_profile", JSON.stringify(profile));
    setSavedSuccess(true);
    setTimeout(() => {
      onSuccess?.();
      onClose();
    }, 1200);
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await logout();
      setAuthError(null);
    } finally {
      setIsLoading(false);
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

            {/* Currently Logged In View */}
            {currentUser ? (
              <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-4">
                <div className="flex items-center gap-3.5">
                  {currentUser.photoURL ? (
                    <img 
                      src={currentUser.photoURL} 
                      alt="" 
                      className="w-12 h-12 rounded-full border border-stone-200 object-cover" 
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-stone-200 flex items-center justify-center text-stone-600 font-bold">
                      {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : "U"}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-semibold text-stone-900 truncate">
                        {currentUser.displayName || "Customer"}
                      </h4>
                      <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                    </div>
                    <p className="text-xs text-stone-500 truncate">{currentUser.email}</p>
                    <span className="inline-block mt-1 text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                      Signed In
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-200/60 flex items-center justify-between">
                  <button
                    onClick={handleSignOut}
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
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Method 1: Google Sign In */}
                <div className="space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                    Recommended Sign In
                  </span>
                  
                  <button
                    onClick={handleGoogleSignIn}
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
                    <span>{isLoading ? "Connecting to Google..." : "Continue with Google"}</span>
                  </button>
                  <p className="text-[11px] text-stone-500 text-center">
                    Instant access to live order tracking, doorstep status & wishlist sync.
                  </p>
                </div>

                {/* Error Banner with Direct Solution */}
                {authError && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-2xl bg-amber-50 border border-amber-200/90 text-amber-900 space-y-3"
                  >
                    <div className="flex items-start gap-2.5">
                      <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <h5 className="text-xs font-semibold">
                          {authError.code === "auth/unauthorized-domain" 
                            ? "Firebase Domain Authorization Required"
                            : authError.code === "auth/popup-blocked"
                            ? "Browser Blocked Google Popup"
                            : "Sign-In Notification"}
                        </h5>
                        <p className="text-[11px] text-amber-800 leading-relaxed">
                          {authError.message}
                        </p>
                      </div>
                    </div>

                    {/* Actionable Solution if Domain is Unauthorized */}
                    {authError.code === "auth/unauthorized-domain" && authError.domain && (
                      <div className="p-3 bg-white rounded-xl border border-amber-200 text-xs space-y-2">
                        <p className="text-[11px] font-medium text-stone-700">
                          Domain to authorize in Firebase Console:
                        </p>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 p-2 bg-stone-100 rounded-lg text-[11px] font-mono break-all text-stone-800">
                            {authError.domain}
                          </code>
                          <button
                            type="button"
                            onClick={handleCopyDomain}
                            className="px-3 py-2 rounded-lg bg-stone-900 text-white text-[11px] font-semibold hover:bg-stone-800 transition-colors shrink-0 flex items-center gap-1"
                          >
                            {copiedDomain ? <Check size={12} /> : <Copy size={12} />}
                            <span>{copiedDomain ? "Copied" : "Copy"}</span>
                          </button>
                        </div>
                        {authError.consoleUrl && (
                          <a
                            href={authError.consoleUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-amber-900 hover:underline pt-1"
                          >
                            <span>Open Firebase Settings ➔ Authorized Domains</span>
                            <ExternalLink size={12} />
                          </a>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Divider */}
                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-stone-200"></div>
                  <span className="flex-shrink mx-4 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                    Or Continue as Customer
                  </span>
                  <div className="flex-grow border-t border-stone-200"></div>
                </div>

                {/* Method 2: Customer Guest Profile Form */}
                <form onSubmit={handleSaveCustomerProfile} className="space-y-3.5">
                  <p className="text-[11px] text-stone-500">
                    Save your customer contact details on this device for seamless checkout & order lookup without popups:
                  </p>

                  <div className="space-y-2.5">
                    <div className="relative">
                      <User size={14} className="absolute left-3.5 top-3.5 text-stone-400" />
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Your Full Name *"
                        className="w-full pl-9 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-stone-900"
                      />
                    </div>

                    <div className="relative">
                      <Mail size={14} className="absolute left-3.5 top-3.5 text-stone-400" />
                      <input
                        type="email"
                        required
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="Your Email Address *"
                        className="w-full pl-9 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-stone-900"
                      />
                    </div>

                    <div className="relative">
                      <Phone size={14} className="absolute left-3.5 top-3.5 text-stone-400" />
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="Contact Phone (Optional)"
                        className="w-full pl-9 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-stone-900"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                  >
                    {savedSuccess ? (
                      <>
                        <CheckCircle2 size={14} className="text-emerald-600" />
                        <span>Profile Saved!</span>
                      </>
                    ) : (
                      <span>Save Customer Details</span>
                    )}
                  </button>
                </form>

                {/* Admin Note */}
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
                  <span className="flex items-center gap-1">
                    <ShieldCheck size={12} />
                    <span>Store Admin: rupammaxdas@gmail.com</span>
                  </span>
                  <span>Debnath Flower Studio</span>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
