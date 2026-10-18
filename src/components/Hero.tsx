/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "framer-motion";
import { Sparkles, ArrowRight, ShieldCheck, HeartHandshake, Truck } from "lucide-react";

export function Hero() {
  return (
    <section className="relative pt-28 pb-16 sm:pt-36 sm:pb-24 lg:pt-40 lg:pb-28 overflow-hidden bg-gradient-to-b from-sky-100/70 via-sky-50/50 to-white/90 border-b border-sky-100/60">
      {/* Sky atmospheric ambient glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-sky-200/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-100/50 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Elegant Typography & Gold Shop Now Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-6 sm:space-y-8"
          >
            {/* Elegant Provenance Kicker (Hidden as requested) */}
            <div className="hidden" aria-hidden="true">
              <Sparkles size={13} className="text-amber-500" />
              <span>FOUNDED & CURATED BY RUPAM MAX DAS • EST. 2026</span>
            </div>

            {/* Bouquet Tab Identifier */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-600/10 border border-sky-600/20 text-sky-950 text-xs font-semibold tracking-wider uppercase font-mono">
              <span className="text-sm">💐</span>
              <span>Bouquet Tab • Artisanal Floral Boutique</span>
            </div>

            {/* Headline with Elegant Typography */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-medium text-stone-900 leading-[1.08] tracking-tight">
              Artisanal Blooms & <br className="hidden sm:inline" />
              <span className="italic font-normal bg-gradient-to-r from-sky-950 via-sky-900 to-amber-700 bg-clip-text text-transparent">
                Luxury Gifts.
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-stone-600 max-w-xl leading-relaxed">
              From velvety Dutch Naomi roses to bespoke money bouquets, artisanal celebration cakes, gourmet chocolates, and eternal paper sculptures — crafted with signature gold packaging for life's most momentous occasions.
            </p>

            {/* CTAs: Gold Shop Now Button & Bespoke Button */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a 
                href="#collection" 
                className="px-8 py-4 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 text-purple-950 font-bold text-sm sm:text-base tracking-wide shadow-lg shadow-amber-400/25 hover:from-amber-300 hover:to-yellow-400 active:scale-95 transition-all inline-flex items-center gap-2 group min-h-[48px]"
              >
                <span>Shop Now</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform text-purple-950" />
              </a>

              <a 
                href="#bespoke" 
                className="px-7 py-4 rounded-full border border-stone-300 hover:border-purple-900 text-stone-900 hover:text-purple-900 text-sm sm:text-base font-semibold tracking-wide transition-all inline-flex items-center gap-2 hover:bg-purple-50/50 min-h-[48px]"
              >
                <span>Request Bespoke</span>
              </a>
            </div>

            {/* Trust Pillars */}
            <div className="grid grid-cols-3 gap-3 pt-4 sm:pt-6 border-t border-stone-200/80">
              <div className="flex items-center gap-2">
                <Truck size={17} className="text-amber-500 shrink-0" />
                <span className="text-[11px] sm:text-xs text-stone-600 font-medium">Same-Day Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={17} className="text-amber-500 shrink-0" />
                <span className="text-[11px] sm:text-xs text-stone-600 font-medium">Fresh Stems Seal</span>
              </div>
              <div className="flex items-center gap-2">
                <HeartHandshake size={17} className="text-amber-500 shrink-0" />
                <span className="text-[11px] sm:text-xs text-stone-600 font-medium">Gold Foil Packaging</span>
              </div>
            </div>

          </motion.div>

          {/* Right Column: Premium Gift Photography Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="lg:col-span-5 relative"
          >
            {/* Main Premium Gift Photography Card */}
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white ring-1 ring-purple-900/10 bg-stone-100 group">
              <img
                src="./assets/images/hero_floral_bouquet_1790272143558.jpg"
                alt="Gift Hub World Signature Floral Arrangement"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent pointer-events-none" />

              {/* Founder Signature Badge (Hidden as requested) */}
              <div className="hidden" aria-hidden="true">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Founder Curation • Rupam Max Das</span>
              </div>

              {/* Bottom Caption on Photo */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[10px] uppercase tracking-widest text-amber-300 font-bold font-mono">
                  SIGNATURE CREATION № 01
                </span>
                <p className="font-display text-xl sm:text-2xl font-semibold leading-tight text-white mt-0.5">
                  The Heritage Peony & Damask Rose
                </p>
              </div>
            </div>

            {/* Overlapping Floating Gift Accent Card (Hidden as requested) */}
            <div className="hidden" aria-hidden="true">
              <img
                src="./assets/images/bouquet_surprise_gift_1791795336071.jpg"
                alt="Curated Gift Hamper"
                className="w-14 h-14 rounded-xl object-cover shrink-0"
              />
              <div>
                <span className="inline-block px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[9px] font-bold uppercase tracking-wider">
                  Gold Seal Gift
                </span>
                <p className="text-xs font-semibold text-stone-900 mt-0.5 leading-snug">
                  Surprise Gift Hampers
                </p>
                <p className="text-[11px] text-stone-500 font-mono">
                  From ₹1,499
                </p>
              </div>
            </div>

            {/* Ambient Gold Glow Behind Photo */}
            <div className="absolute -top-6 -right-6 w-48 h-48 bg-amber-200/40 rounded-full blur-3xl -z-10" />
            <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-purple-300/30 rounded-full blur-3xl -z-10" />

          </motion.div>

        </div>
      </div>
    </section>
  );
}
