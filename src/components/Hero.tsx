/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "framer-motion";
import { Sparkles, ArrowRight, ShieldCheck, HeartHandshake, Truck, Award, Cake } from "lucide-react";

interface HeroProps {
  onNavigate?: (page: "bouquets" | "cakes") => void;
}

export function Hero({ onNavigate }: HeroProps) {
  return (
    <section className="box-panel mb-6 font-sans">
      {/* Box Header */}
      <div className="box-header-gradient flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Award size={15} className="text-amber-300" />
          <span className="uppercase tracking-wider">Featured Atelier Collection • Season 2026</span>
        </div>
        <span className="hidden sm:inline text-[11px] text-sky-200 font-mono">
          Handcrafted in Guwahati & Delivered Across India
        </span>
      </div>

      {/* Box Content Body */}
      <div className="p-5 sm:p-7 bg-gradient-to-b from-white via-slate-50/50 to-blue-50/20">
        <div className="grid md:grid-cols-12 gap-6 sm:gap-8 items-center">
          
          {/* Left Column: Text & Glossy CTAs */}
          <div className="md:col-span-7 space-y-4">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-blue-100 border border-blue-300 text-blue-900 text-xs font-bold tracking-wide">
              <span>💐 Artisanal Floral Boutique & 🎂 Gourmet Bakery</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-slate-900 leading-[1.15] tracking-tight">
              Artisanal Blooms & <br />
              <span className="text-blue-800">
                Gourmet Celebration Cakes
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl">
              Welcome to <strong>Gift Hub World</strong>, where nature meets elegance. Handcrafted by <strong>Rupam Max Das</strong> since 2026, offering 19 signature floral curations, money bouquets, everlasting paper crafts, and an authentic 30-flavour Indian bakery cake patisserie.
            </p>

            {/* Glossy Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#collection"
                className="glossy-btn-blue px-5 py-2.5 rounded text-xs sm:text-sm inline-flex items-center gap-2"
              >
                <span>Shop Bouquets</span>
                <ArrowRight size={15} />
              </a>

              <button
                type="button"
                onClick={() => {
                  if (onNavigate) {
                    onNavigate("cakes");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
                className="glossy-btn-gold px-5 py-2.5 rounded text-xs sm:text-sm inline-flex items-center gap-2"
              >
                <Cake size={16} />
                <span>Explore 30 Cakes</span>
              </button>

              <a
                href="#bespoke"
                className="glossy-btn-grey px-4 py-2.5 rounded text-xs sm:text-sm inline-flex items-center gap-1.5"
              >
                <Sparkles size={14} className="text-blue-600" />
                <span>Atelier 3D Builder</span>
              </a>
            </div>

            {/* Trust Highlights */}
            <div className="grid grid-cols-3 gap-2.5 pt-4 border-t border-slate-200 text-slate-700">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded glossy-icon-box flex items-center justify-center shrink-0">
                  <Truck size={14} />
                </div>
                <div>
                  <strong className="block text-[11px] text-slate-900">Same-Day</strong>
                  <span className="text-[10px] text-slate-500">Fast Dispatch</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded glossy-icon-box flex items-center justify-center shrink-0">
                  <ShieldCheck size={14} />
                </div>
                <div>
                  <strong className="block text-[11px] text-slate-900">100% Fresh</strong>
                  <span className="text-[10px] text-slate-500">Direct From Farms</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded glossy-icon-box flex items-center justify-center shrink-0">
                  <HeartHandshake size={14} />
                </div>
                <div>
                  <strong className="block text-[11px] text-slate-900">Guaranteed</strong>
                  <span className="text-[10px] text-slate-500">Secure Packaging</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual in Classical Frame */}
          <div className="md:col-span-5">
            <div className="relative aspect-[4/3] sm:aspect-[1/1] rounded border-2 border-slate-300 shadow-md overflow-hidden bg-slate-100 group">
              <img
                src="./assets/images/hero_floral_bouquet_1790272143558.jpg"
                alt="Gift Hub World Luxury Floral Arrangement"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-3 left-3 right-3 text-white">
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-300 font-mono">
                  Curated Creation № 01
                </span>
                <p className="font-display text-lg sm:text-xl font-bold leading-tight text-white mt-0.5">
                  Signature Peony & Dutch Damask Roses
                </p>
                <span className="text-[11px] text-slate-200">
                  Hand-tied with satin ribbon and gold debossed presentation
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
