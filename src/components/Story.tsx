/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function Story() {
  return (
    <section id="ourstory" className="py-24 bg-gradient-to-b from-white/90 via-sky-50/50 to-sky-100/40 border-t border-sky-100/70 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          
          {/* Visual Showcase */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl bg-stone-200"
              >
                <img 
                  src="./assets/images/hero_floral_bouquet_1790272143558.jpg" 
                  alt="Rupam Max Das Studio Artistry" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 70 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="aspect-[3/4] rounded-3xl overflow-hidden mt-10 shadow-2xl bg-stone-200"
              >
                <img 
                  src="./assets/images/bouquet_romantic_roses_1790272159677.jpg" 
                  alt="Gift Hub World Bespoke Floral Craftsmanship" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            </div>
            
            {/* Background Sky Accent Glow */}
            <div className="absolute -top-12 -left-12 w-56 h-56 bg-sky-200/50 rounded-full -z-10 blur-3xl opacity-70" />
          </div>

          {/* Editorial Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-900/10 border border-purple-900/20 text-purple-950 text-xs font-semibold tracking-wider uppercase">
              <Sparkles size={13} className="text-amber-500" />
              <span>Founder's Atelier</span>
            </div>

            <h2 className="text-4xl lg:text-5xl font-display font-medium text-stone-900 leading-tight">
              A Symphony of Petals, <br />
              <span className="italic font-normal">Founded by Rupam Max Das.</span>
            </h2>

            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Founded by <strong>Rupam Max Das</strong> in 2026, Gift Hub World Flower Boutique emerged from an intimate love for classical botanical design and modern aesthetic luxury. With a keen eye for delicate color palettes and architectural foliage, Rupam curates each arrangement as living poetry for life's most momentous occasions.
            </p>

            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Every petal, stem, and ribbon that graces our studio is personally hand-inspected by Rupam and the team. We partner with ethical growers to bring you resilient, farm-fresh blooms delivered in temperature-preserved elegance.
            </p>

            {/* Founder Quote Card */}
            <div className="p-6 rounded-2xl bg-white border border-stone-200/80 shadow-sm relative">
              <p className="font-display italic text-stone-800 text-base leading-relaxed">
                "Flowers are nature's most sincere language. When words fall short, an artfully composed bouquet speaks directly to the soul."
              </p>
              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider text-purple-900/70 font-semibold">Founder & Creative Director</span>
                <span className="text-xs font-display font-semibold text-stone-900">Rupam Max Das</span>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="#bespoke"
                className="inline-flex items-center gap-2 text-purple-950 font-semibold border-b-2 border-purple-900 pb-1.5 hover:text-amber-600 hover:border-amber-500 transition-all text-sm tracking-wide"
              >
                <span>Design a Bespoke Bouquet with Rupam Palette</span>
                <span className="text-amber-500 font-bold">↗</span>
              </a>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
