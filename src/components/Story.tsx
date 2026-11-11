/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Sparkles, Award, Heart, CheckCircle2 } from "lucide-react";

export function Story() {
  return (
    <section id="ourstory" className="box-panel mb-6 font-sans">
      {/* Box Header */}
      <div className="box-header-gradient flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Award size={15} className="text-amber-300" />
          <span className="uppercase tracking-wider">
            Founder's Atelier & Brand Heritage
          </span>
        </div>
        <span className="text-[11px] text-sky-200">
          Est. 2026 • Guwahati, India
        </span>
      </div>

      {/* Box Body */}
      <div className="p-5 sm:p-7 bg-white">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          
          {/* Visual Showcase (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="aspect-[4/3] rounded border border-slate-300 overflow-hidden shadow-xs bg-slate-100">
              <img 
                src="./assets/images/hero_floral_bouquet_1790272143558.jpg" 
                alt="Rupam Max Das Studio Artistry" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            
            <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs text-slate-600">
              <strong className="text-slate-900 block font-bold text-xs">
                Rupam Max Das
              </strong>
              <span className="text-[11px] text-slate-500">
                Founder & Creative Director • Gift Hub World
              </span>
            </div>
          </div>

          {/* Editorial Content (7 cols) */}
          <div className="lg:col-span-7 space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
            
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-blue-100 text-blue-900 font-bold text-[10px] uppercase tracking-wider mb-2 font-mono">
                <Sparkles size={11} className="text-blue-700" />
                <span>Founded by Rupam Max Das</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tracking-tight">
                Gift Hub World Flower Boutique
              </h2>
              <p className="italic text-blue-800 font-serif text-sm mt-0.5">
                Where Nature Meets Elegance
              </p>
            </div>

            <p>
              Founded by <strong>Rupam Max Das in 2026</strong>, Gift Hub World Flower Boutique was born from a passion for timeless floral artistry, botanical beauty, and modern luxury. With a refined eye for delicate color palettes, elegant arrangements, and natural textures, Rupam transforms every bouquet into a living expression of beauty, emotion, and creativity.
            </p>

            <p>
              Every petal, stem, and ribbon is carefully selected and inspected by Rupam and the dedicated team to uphold our commitment to quality and elegance. We strive to source fresh blooms from responsible growers and present every arrangement with exceptional care, ensuring that each creation brings beauty and meaning to life's most cherished moments.
            </p>

            <p>
              From romantic gestures and birthdays to weddings, anniversaries, celebrations, and thoughtful gifts, <strong>Gift Hub World Flower Boutique</strong> is dedicated to making every occasion unforgettable.
            </p>

            {/* Our Promise Callout */}
            <div className="p-3.5 rounded bg-slate-50 border-l-4 border-blue-700 border-y border-r border-slate-200 space-y-1">
              <div className="text-slate-900 text-xs sm:text-sm">
                <strong className="text-blue-900 font-bold">Our Promise:</strong> Fresh flowers. Thoughtful designs. Timeless elegance.
              </div>
              <p className="italic text-[11px] text-slate-500 font-serif">
                Gift Hub World Flower Boutique — Every Flower Tells a Story.
              </p>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
