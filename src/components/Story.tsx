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

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-medium text-stone-900 leading-tight">
              Founded by Rupam Max Das
            </h2>

            <div className="border-l-2 border-amber-400 pl-4 py-0.5">
              <h3 className="text-xl sm:text-2xl font-display font-semibold text-stone-900 tracking-tight">
                Gift Hub World Flower Boutique
              </h3>
              <p className="italic text-amber-700 font-serif text-sm sm:text-base mt-0.5">
                Where Nature Meets Elegance
              </p>
            </div>

            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Founded by <strong>Rupam Max Das in 2026</strong>, Gift Hub World Flower Boutique was born from a passion for timeless floral artistry, botanical beauty, and modern luxury. With a refined eye for delicate color palettes, elegant arrangements, and natural textures, Rupam transforms every bouquet into a living expression of beauty, emotion, and creativity.
            </p>

            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Every petal, stem, and ribbon is carefully selected and inspected by Rupam and the dedicated team to uphold our commitment to quality and elegance. We strive to source fresh blooms from responsible growers and present every arrangement with exceptional care, ensuring that each creation brings beauty and meaning to life's most cherished moments.
            </p>

            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              From romantic gestures and birthdays to weddings, anniversaries, celebrations, and thoughtful gifts, <strong>Gift Hub World Flower Boutique</strong> is dedicated to making every occasion unforgettable.
            </p>

            {/* Our Promise Callout */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-sky-50 via-sky-100/40 to-blue-50 border border-sky-200/80 shadow-xs space-y-1.5">
              <div className="text-stone-900 text-sm sm:text-base leading-relaxed">
                <strong className="text-sky-950 font-bold">Our Promise:</strong> Fresh flowers. Thoughtful designs. Timeless elegance.
              </div>
              <p className="italic text-xs sm:text-sm text-sky-800/90 font-serif">
                Gift Hub World Flower Boutique — Every Flower Tells a Story.
              </p>
            </div>

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
