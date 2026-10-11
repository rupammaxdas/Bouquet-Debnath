/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "framer-motion";
import { Instagram, Facebook, Sparkles, Award } from "lucide-react";

export function Story() {
  return (
    <section id="ourstory" className="py-24 bg-stone-50/50 border-t border-stone-100 overflow-hidden">
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
                  alt="Trisha Debnath Studio Artistry" 
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
                  alt="Debnath Bespoke Floral Craftsmanship" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            </div>
            
            {/* Background Accent Glow */}
            <div className="absolute -top-12 -left-12 w-56 h-56 bg-amber-100/60 rounded-full -z-10 blur-3xl opacity-60" />
            
            {/* Floating Badge */}
            <div className="absolute -bottom-6 -right-2 sm:right-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-stone-200/80 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-stone-900 text-white flex items-center justify-center">
                <Award size={18} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Founder & Owner</p>
                <p className="text-sm font-display font-bold text-stone-900">Trisha Debnath</p>
              </div>
            </div>
          </div>

          {/* Editorial Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-200/70 text-stone-700 text-xs font-semibold tracking-wider uppercase">
              <Sparkles size={13} className="text-amber-600" />
              <span>Founder's Atelier</span>
            </div>

            <h2 className="text-4xl lg:text-5xl font-display font-medium text-stone-900 leading-tight">
              A Symphony of Petals, <br />
              <span className="italic font-normal">Founded by Trisha Debnath.</span>
            </h2>

            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Founded by <strong>Trisha Debnath</strong> in 2026, Debnath Flower Boutique emerged from an intimate love for classical botanical design and modern aesthetic luxury. With a keen eye for delicate color palettes and architectural foliage, Trisha curates each arrangement as living poetry for life's most momentous occasions.
            </p>

            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Every petal, stem, and ribbon that graces our studio is personally hand-inspected by Trisha and her team. We partner with ethical growers to bring you resilient, farm-fresh blooms delivered in temperature-preserved elegance.
            </p>

            {/* Founder Quote Card */}
            <div className="p-6 rounded-2xl bg-white border border-stone-200/80 shadow-sm relative">
              <p className="font-display italic text-stone-800 text-base leading-relaxed">
                "Flowers are nature's most sincere language. When words fall short, an artfully composed bouquet speaks directly to the soul."
              </p>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-stone-100">
                <div>
                  <span className="text-xs font-display font-bold text-stone-900 block">Trisha Debnath</span>
                  <span className="text-[10px] uppercase tracking-wider text-stone-400">Owner & Creative Director</span>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href="https://www.instagram.com/trisha_dbnth?stkn=MTMyZWl2OXVjNmVqdg=="
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-stone-100 text-stone-600 hover:text-stone-950 hover:bg-stone-200 transition-colors"
                    aria-label="Instagram @trisha_dbnth"
                    title="Instagram @trisha_dbnth"
                  >
                    <Instagram size={15} />
                  </a>
                  <a
                    href="https://www.facebook.com/share/1YFvXyHpju/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-stone-100 text-stone-600 hover:text-stone-950 hover:bg-stone-200 transition-colors"
                    aria-label="Facebook Profile"
                    title="Facebook Profile"
                  >
                    <Facebook size={15} />
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="#bespoke"
                className="inline-flex items-center gap-2 text-stone-900 font-semibold border-b-2 border-stone-900 pb-1.5 hover:text-stone-600 hover:border-stone-600 transition-all text-sm tracking-wide"
              >
                <span>Design a Bespoke Bouquet with Trisha's Palette</span>
                <span>↗</span>
              </a>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
