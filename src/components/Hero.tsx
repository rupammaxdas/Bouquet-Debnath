/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center gap-2 text-stone-500 text-xs sm:text-sm font-medium mb-6">
            <span className="w-8 h-px bg-stone-300" />
            <span className="tracking-wider uppercase font-semibold">ESTABLISHED 2026 • BY TRISHA DEBNATH</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-display font-medium text-stone-900 leading-[1.1] mb-8 text-wrap-balance">
            Artisanal Blooms <br /> 
            <span className="italic font-normal">for Every Moment.</span>
          </h1>
          <p className="text-lg text-stone-600 max-w-md mb-10 leading-relaxed">
            From rare seasonal petals to bespoke arrangements, we bring the artistry of nature to your doorstep with timeless elegance.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="px-8 py-4 bg-stone-900 text-white text-sm font-medium rounded-full hover:bg-stone-800 transition-colors shadow-lg shadow-stone-900/10">
              Shop the Collection
            </button>
            <button className="px-8 py-4 border border-stone-200 text-stone-900 text-sm font-medium rounded-full hover:border-stone-400 transition-colors">
              Request Bespoke
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative aspect-[16/10] lg:aspect-[4/5] overflow-hidden rounded-2xl shadow-2xl"
        >
          <img
            src="./assets/images/hero_floral_bouquet_1790272143558.jpg"
            alt="Artisanal flower arrangement"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-stone-900/5" />
        </motion.div>
      </div>
    </section>
  );
}
