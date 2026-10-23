/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  MapPin, 
  Phone, 
  Mail, 
  MessageCircle, 
  Clock, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  ExternalLink,
  ShieldCheck
} from "lucide-react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [name, setName] = useState("");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setIsSubmitted(true);
    setTimeout(() => {
      setName("");
      setEmailOrPhone("");
      setMessage("");
      setIsSubmitted(false);
      onClose();
    }, 2500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-stone-950/70 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-sky-100 overflow-hidden z-10 my-8"
          >
            {/* Header with Luxury Gradient */}
            <div className="relative bg-gradient-to-r from-[#0c2340] via-[#0f2e52] to-[#1a365d] text-white p-6 sm:p-8">
              <button
                onClick={onClose}
                className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
                aria-label="Close Contact Modal"
              >
                <X size={18} />
              </button>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-mono font-bold uppercase tracking-widest border border-amber-400/30 mb-2">
                <Sparkles size={11} />
                <span>Atelier Concierge & Support</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-display font-medium text-white tracking-tight">
                Contact Us
              </h2>
              <p className="text-sky-100/80 text-xs sm:text-sm mt-1 max-w-md">
                We are here to assist with custom bouquet commissions, artisan celebration cake inquiries, same-day delivery, and event curation.
              </p>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              
              {/* Address & Atelier Location */}
              <div className="bg-sky-50/60 rounded-2xl p-4 sm:p-5 border border-sky-100/80">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-sky-700 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <MapPin size={20} />
                  </div>
                  <div className="space-y-1 text-xs">
                    <span className="font-mono uppercase font-bold text-[11px] text-sky-900 tracking-wider block">
                      Address
                    </span>
                    <strong className="text-stone-900 text-sm font-semibold block">
                      Gift Hub World Luxury Boutique
                    </strong>
                    <p className="hidden text-stone-600 leading-relaxed">
                      G.S. Road, Central Commercial District, Guwahati, Assam 781005, India
                    </p>
                    <div className="hidden items-center gap-2 pt-1 text-[11px] text-stone-500 font-medium">
                      <Clock size={13} className="text-amber-600" />
                      <span className="hidden">Open Daily: 9:00 AM – 10:00 PM IST (Same-Day Delivery & Studio Pickups)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Digital Contact Channels Grid */}
              <div>
                <span className="font-mono uppercase font-bold text-[11px] text-stone-700 tracking-wider block mb-3">
                  Digital Contact: Your email address, phone number, or website contact details.
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  {/* Phone Number */}
                  <a
                    href="tel:+919876543249"
                    className="hidden"
                    aria-hidden="true"
                  >
                    <div>
                      <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                        <Phone size={16} />
                      </div>
                      <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block font-mono">
                        Phone Number
                      </span>
                      <strong className="text-xs sm:text-sm font-bold text-stone-900 block mt-0.5">
                        +91 XXXXX XXX49
                      </strong>
                    </div>
                    <span className="text-[11px] font-semibold text-sky-700 mt-2 flex items-center gap-1">
                      <span>Call Concierge</span>
                      <ExternalLink size={11} />
                    </span>
                  </a>

                  {/* Email Address */}
                  <a
                    href="mailto:rupammaxdas@gmail.com"
                    className="p-4 rounded-2xl bg-white border border-stone-200/80 hover:border-sky-400 hover:shadow-md transition-all group flex flex-col justify-between col-span-full"
                  >
                    <div>
                      <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                        <Mail size={16} />
                      </div>
                      <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block font-mono">
                        Email Address
                      </span>
                      <strong className="text-xs sm:text-sm font-bold text-stone-900 block mt-0.5 break-all">
                        rupammaxdas@gmail.com
                      </strong>
                    </div>
                    <span className="text-[11px] font-semibold text-purple-700 mt-2 flex items-center gap-1">
                      <span>Send Email</span>
                      <ExternalLink size={11} />
                    </span>
                  </a>

                  {/* WhatsApp Direct Chat (Hidden as requested) */}
                  <a
                    href="https://wa.me/919876543249?text=Hello%20Gift%20Hub%20World!%20I%20would%20like%20to%20inquire%20about%20a%20bouquet%20or%20cake."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden"
                    aria-hidden="true"
                  >
                    <div>
                      <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                        <MessageCircle size={16} />
                      </div>
                      <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider block font-mono">
                        WhatsApp
                      </span>
                      <strong className="text-xs sm:text-sm font-bold text-emerald-950 block mt-0.5">
                        Chat with us directly
                      </strong>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-700 mt-2 flex items-center gap-1">
                      <span>Instant Chat</span>
                      <ExternalLink size={11} />
                    </span>
                  </a>

                </div>
              </div>

              {/* Quick Message Form */}
              <div className="pt-2">
                <span className="font-mono uppercase font-bold text-[10px] text-stone-500 tracking-wider block mb-2">
                  Send a Direct Message to the Atelier
                </span>
                
                {isSubmitted ? (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-1">
                    <CheckCircle2 size={24} className="text-emerald-600 mx-auto" />
                    <strong className="text-xs font-bold text-emerald-900 block">Thank you, message received!</strong>
                    <p className="text-[11px] text-emerald-700">Our concierge will respond to your contact details promptly.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        required
                        placeholder="Your Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="px-3.5 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                      />
                      <input
                        type="text"
                        placeholder="Your Email or Phone Number"
                        value={emailOrPhone}
                        onChange={(e) => setEmailOrPhone(e.target.value)}
                        className="px-3.5 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                      />
                    </div>
                    <textarea
                      required
                      rows={3}
                      placeholder="How can we assist you with bouquets, celebration cakes, or bespoke delivery?"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white resize-none"
                    />
                    <button
                      type="submit"
                      className="w-full py-2.5 px-5 rounded-xl bg-sky-700 hover:bg-sky-600 text-white font-semibold text-xs tracking-wide transition-all shadow-md flex items-center justify-center gap-2 active:scale-98"
                    >
                      <Send size={13} />
                      <span>Send Inquiry to Concierge</span>
                    </button>
                  </form>
                )}
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
