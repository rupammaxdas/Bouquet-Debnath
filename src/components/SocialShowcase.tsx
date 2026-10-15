/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "framer-motion";
import { Instagram, Facebook } from "lucide-react";

const MOMENTS = [
  {
    image: "./assets/images/hero_floral_bouquet_1790272143558.jpg",
    caption: "Morning studio reflections & fresh ranunculus stems",
    platform: "instagram",
  },
  {
    image: "./assets/images/bouquet_romantic_roses_1790272159677.jpg",
    caption: "The Velvet Rose collection hand-tied for an anniversary",
    platform: "facebook",
  },
  {
    image: "./assets/images/bouquet_seasonal_wildflowers_1790272175129.jpg",
    caption: "Freshly foraged meadow whispers & organic field blooms",
    platform: "instagram",
  },
  {
    image: "./assets/images/bouquet_tropical_blooms_1790272200991.jpg",
    caption: "Architectural birds of paradise & luxury botanical styling",
    platform: "facebook",
  },
];

export function SocialShowcase() {
  return (
    <section className="py-24 bg-gradient-to-b from-sky-50/60 via-sky-100/40 to-blue-50/60 border-t border-sky-100/70 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-px bg-sky-600" />
              <span className="text-xs font-semibold tracking-widest text-sky-800 uppercase">
                Follow & Connect
              </span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-display font-medium text-stone-900">
              Join Our Floral Community
            </h2>
            <p className="text-xs text-stone-500 mt-2">
              Follow Founder Rupam Max Das / Team (@rupammaxdas) for seasonal bouquet arrivals, custom designs, and daily studio updates.
            </p>
          </div>


        </div>

        {/* Visual moments grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {MOMENTS.map((item, idx) => {
            const isInsta = item.platform === "instagram";
            const targetUrl = isInsta
              ? "https://www.instagram.com/rupammaxdas"
              : "https://www.facebook.com/share/1YFvXyHpju/";

            return (
              <motion.a
                key={idx}
                href={targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="group relative aspect-square rounded-2xl overflow-hidden bg-stone-200 shadow-md block"
              >
                <img
                  src={item.image}
                  alt={item.caption}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-5 text-white">
                  <div className="self-end p-2 rounded-full bg-white/20 backdrop-blur-md">
                    {isInsta ? <Instagram size={16} /> : <Facebook size={16} />}
                  </div>
                  <div>
                    <p className="text-xs font-light text-stone-200 line-clamp-2 leading-relaxed">
                      {item.caption}
                    </p>
                    <span className="text-[10px] font-semibold tracking-wider uppercase text-white/80 mt-2 block">
                      {isInsta ? "@rupammaxdas" : "Gift Hub World"} ↗
                    </span>
                  </div>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
