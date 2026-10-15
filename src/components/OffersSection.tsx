/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Gift, Tag, Check, Clock, Truck } from "lucide-react";
import { useTheme } from "../lib/ThemeContext";

interface OfferCard {
  id: string;
  badge: string;
  title: string;
  description: string;
  code: string;
  icon: typeof Gift;
  expiry: string;
}

const OFFERS: OfferCard[] = [
  {
    id: "offer-1",
    badge: "15% FESTIVE DISCOUNT",
    title: "Seasonal & Wedding Celebration Offer",
    description: "Enjoy 15% off across all handcrafted bouquets, rose designs, and luxury atelier curations.",
    code: "GOLDBLOOM15",
    icon: Tag,
    expiry: "Valid this week"
  },
  {
    id: "offer-2",
    badge: "COMPLIMENTARY ATELIER GIFT",
    title: "Gold-Embossed Card & Silk Wrapping",
    description: "Every order above ₹1,499 receives our signature luxury gold foil gift card with custom wax seal.",
    code: "GOLDLUXE",
    icon: Gift,
    expiry: "Auto-applied at checkout"
  },
  {
    id: "offer-3",
    badge: "SAME-DAY HAND DELIVERY",
    title: "Express Boutique Hand Delivery",
    description: "Guaranteed priority hand-delivery with freshness water seal for all anniversary & celebration orders.",
    code: "FASTBLOOM",
    icon: Truck,
    expiry: "Available daily"
  }
];

export function OffersSection() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { currentTheme } = useTheme();

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => {
      setCopiedCode(null);
    }, 2500);
  };

  return (
    <section id="offers" className="py-16 sm:py-20 bg-gradient-to-b from-sky-50/50 via-sky-100/30 to-blue-50/40 border-b border-sky-100/70 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Main Sky & Twilight Container */}
        <div 
          className="relative rounded-3xl text-white p-6 sm:p-10 lg:p-12 shadow-2xl border overflow-hidden transition-all duration-500"
          style={{
            background: `linear-gradient(135deg, ${currentTheme.headerBg} 0%, #0f2e52 50%, #081729 100%)`,
            borderColor: `${currentTheme.primaryPurple}60`
          }}
        >
          
          {/* Subtle Background Glows */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="relative z-10 max-w-2xl mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-semibold tracking-wider uppercase mb-3">
              <Sparkles size={13} className="text-amber-400" />
              <span>Exclusive Boutique Privileges</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-medium tracking-tight text-white">
              Limited-Time Offers & Privileges
            </h2>
            <p className="text-purple-200/80 text-xs sm:text-sm mt-3 leading-relaxed">
              Celebrate your special moments with handcrafted botanical perfection, bespoke gift additions, and seasonal courtesies curated by Founder Rupam Max Das.
            </p>
          </div>

          {/* Cards Grid: Gold promotional badges against purple elements */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {OFFERS.map((offer, index) => {
              const Icon = offer.icon;
              const isCopied = copiedCode === offer.code;

              return (
                <motion.div
                  key={offer.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-purple-900/40 backdrop-blur-md rounded-2xl p-6 border border-purple-700/50 flex flex-col justify-between hover:border-amber-400/50 hover:bg-purple-900/60 transition-all duration-300 group shadow-lg"
                >
                  <div>
                    {/* Gold Promotional Badge Against Purple Element */}
                    <div className="mb-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 text-purple-950 font-bold text-[11px] tracking-wider uppercase shadow-md font-mono">
                        <Sparkles size={11} className="text-purple-950" />
                        {offer.badge}
                      </span>
                    </div>

                    <div className="flex items-start gap-3 mb-2">
                      <div className="w-8 h-8 shrink-0 rounded-lg bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-300">
                        <Icon size={16} />
                      </div>
                      <h3 className="font-display text-lg sm:text-xl font-semibold text-white leading-snug">
                        {offer.title}
                      </h3>
                    </div>

                    <p className="text-xs text-purple-200/80 leading-relaxed mt-2 mb-6">
                      {offer.description}
                    </p>
                  </div>

                  {/* Promo Code & Action */}
                  <div className="pt-4 border-t border-purple-800/60 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5 text-stone-300 text-[11px]">
                      <Clock size={12} className="text-amber-400" />
                      <span className="font-medium text-purple-200">{offer.expiry}</span>
                    </div>

                    <button
                      onClick={() => handleCopy(offer.code)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold tracking-wider transition-all flex items-center gap-1.5 ${
                        isCopied
                          ? "bg-emerald-500 text-white"
                          : "bg-amber-400/20 border border-amber-400/40 text-amber-300 hover:bg-amber-400 hover:text-purple-950"
                      }`}
                      title="Click to copy coupon code"
                    >
                      {isCopied ? (
                        <>
                          <Check size={12} />
                          <span>COPIED</span>
                        </>
                      ) : (
                        <>
                          <span>{offer.code}</span>
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
