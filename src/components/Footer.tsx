/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Sparkles, Send, Mail, ShieldCheck, Truck, CreditCard, ChevronRight, Check } from "lucide-react";
import { useState } from "react";

interface FooterProps {
  onOpenContact?: () => void;
}

export function Footer({ onOpenContact }: FooterProps) {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setTimeout(() => {
        setEmail("");
      }, 2500);
    }
  };

  return (
    <footer 
      className="bg-gradient-to-b from-slate-900 via-blue-950 to-slate-950 text-slate-300 border-t-4 border-blue-600 font-sans"
    >
      <div className="max-w-[1240px] mx-auto px-6 py-12 sm:py-16">
        
        {/* Main 4-Column Traditional Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mb-12">
          
          {/* Column 1: Brand & Founder Heritage */}
          <div className="space-y-3.5">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-white text-2xl font-display font-bold tracking-tight">
                  Gift Hub World
                </span>
                <span className="text-amber-400 text-xl font-serif">.</span>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-sky-300 block font-mono">
                Luxury Flower Boutique & Cake Patisserie
              </span>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed">
              Founded by <strong>Rupam Max Das in 2026</strong>. Dedicated to timeless floral artistry, handcrafted bespoke bouquets, and authentic gourmet cakes crafted for life's most cherished milestones.
            </p>

            <div className="pt-1 text-xs text-slate-400 space-y-1">
              <p>📍 Guwahati Atelier & Nationwide Deliveries</p>
              <p className="font-mono text-sky-300 flex items-center gap-1.5">
                <Mail size={12} />
                <span>rupammaxdas@gmail.com</span>
              </p>
            </div>
          </div>

          {/* Column 2: Floral & Cake Collections */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4 pb-2 border-b border-slate-800 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span>Catalog Sitemap</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#collection" className="text-slate-300 hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight size={12} className="text-blue-400" />
                  <span>Romantic & Rose Bouquets</span>
                </a>
              </li>
              <li>
                <a href="#collection" className="text-slate-300 hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight size={12} className="text-blue-400" />
                  <span>Handmade Seasonal Wildflowers</span>
                </a>
              </li>
              <li>
                <a href="#collection" className="text-slate-300 hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight size={12} className="text-blue-400" />
                  <span>Celebration & Birthday Stems</span>
                </a>
              </li>
              <li>
                <a href="#collection" className="text-slate-300 hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight size={12} className="text-blue-400" />
                  <span>Everlasting Paper & Silk Crafts</span>
                </a>
              </li>
              <li>
                <a href="#collection" className="text-slate-300 hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight size={12} className="text-blue-400" />
                  <span>Money & Chocolate Arrangements</span>
                </a>
              </li>
              <li>
                <a href="#cakes" className="text-amber-300 hover:text-amber-200 transition-colors font-bold flex items-center gap-1.5">
                  <ChevronRight size={12} className="text-amber-400" />
                  <span>🎂 Gourmet Cakes (30 Flavours)</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care & Services */}
          <div id="contact">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4 pb-2 border-b border-slate-800 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span>Customer Care</span>
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a 
                  href="mailto:rupammaxdas@gmail.com" 
                  className="text-slate-300 hover:text-white transition-colors flex items-center gap-2"
                >
                  <Mail size={13} className="text-blue-400 shrink-0" />
                  <span>Email: rupammaxdas@gmail.com</span>
                </a>
              </li>
              <li>
                <span className="text-slate-400 flex items-center gap-2">
                  <Truck size={13} className="text-blue-400 shrink-0" />
                  <span>Dispatch: Same-Day Delivery Daily</span>
                </span>
              </li>
              <li>
                <span className="text-slate-400 flex items-center gap-2">
                  <ShieldCheck size={13} className="text-blue-400 shrink-0" />
                  <span>100% Farm Fresh Bloom Guarantee</span>
                </span>
              </li>
              <li className="pt-2">
                {onOpenContact && (
                  <button
                    type="button"
                    onClick={onOpenContact}
                    className="w-full py-2 px-3 rounded glossy-btn-blue text-xs flex items-center justify-center gap-1.5"
                  >
                    <Mail size={13} />
                    <span>Open Concierge Modal</span>
                  </button>
                )}
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter / The Bloom Journal */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4 pb-2 border-b border-slate-800 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span>The Bloom Journal</span>
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Receive seasonal bouquet releases, masterclasses, and floral care guides directly from Rupam Max Das.
            </p>
            
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <button 
                type="submit"
                className="w-full py-2 px-3 rounded glossy-btn-gold text-xs flex items-center justify-center gap-1.5"
              >
                {isSubscribed ? (
                  <>
                    <Check size={13} />
                    <span>Subscribed to Journal</span>
                  </>
                ) : (
                  <>
                    <span>Join Atelier List</span>
                    <Send size={12} />
                  </>
                )}
              </button>
            </form>
          </div>

        </div>

        {/* Traditional Payment & Trust Badges Strip */}
        <div className="py-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <CreditCard size={15} className="text-blue-400" />
            <span className="font-semibold text-slate-300">Accepted Payment Methods:</span>
            <span className="text-[11px] text-slate-400">Visa · MasterCard · RuPay · UPI · NetBanking</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-mono">
            <span>🔒 256-Bit SSL Encrypted Checkout</span>
          </div>
        </div>

        {/* Traditional Bottom Bar: Legal & Copyright */}
        <div className="pt-6 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-3 text-[10px] uppercase tracking-wider text-slate-400">
          <p>© 2026 GIFT HUB WORLD FLOWER BOUTIQUE • FOUNDED & OWNED BY RUPAM MAX DAS. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-4 sm:gap-6 font-medium">
            <a href="#collection" className="text-slate-300 hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#collection" className="text-slate-300 hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="#collection" className="text-slate-300 hover:text-white transition-colors">
              Security & Guarantees
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
