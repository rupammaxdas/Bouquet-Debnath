/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Camera, ExternalLink } from "lucide-react";

const MOMENTS = [
  {
    image: "./assets/images/hero_floral_bouquet_1790272143558.jpg",
    caption: "Morning studio reflections & fresh ranunculus stems",
  },
  {
    image: "./assets/images/bouquet_romantic_roses_1790272159677.jpg",
    caption: "The Velvet Rose collection hand-tied for an anniversary",
  },
  {
    image: "./assets/images/bouquet_seasonal_wildflowers_1790272175129.jpg",
    caption: "Freshly foraged meadow whispers & organic field blooms",
  },
  {
    image: "./assets/images/bouquet_tropical_blooms_1790272200991.jpg",
    caption: "Architectural birds of paradise & luxury botanical styling",
  },
];

export function SocialShowcase() {
  return (
    <section className="box-panel mb-6 font-sans">
      {/* Box Header */}
      <div className="box-header-gradient flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Camera size={15} className="text-sky-300" />
          <span className="uppercase tracking-wider">
            Daily Studio Visual Showcase
          </span>
        </div>
        <span className="text-[11px] text-sky-200">
          Handcrafted Daily at Gift Hub World
        </span>
      </div>

      {/* Box Body */}
      <div className="p-4 sm:p-5 bg-white">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {MOMENTS.map((item, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-300 rounded overflow-hidden shadow-xs group"
            >
              <div className="relative aspect-square overflow-hidden bg-slate-100">
                <img
                  src={item.image}
                  alt={item.caption}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
              </div>
              <div className="p-2.5 bg-slate-50 border-t border-slate-200">
                <p className="text-[11px] text-slate-700 font-medium line-clamp-1 leading-snug">
                  {item.caption}
                </p>
                <span className="text-[10px] text-blue-700 font-mono block mt-0.5">
                  Studio Edition № {idx + 1}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
