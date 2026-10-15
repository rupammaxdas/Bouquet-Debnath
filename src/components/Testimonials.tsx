/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "framer-motion";

export function Testimonials() {
  const reviews = [
    {
      initial: "A",
      role: "A happy gift-giver",
      quote: "The presentation felt so premium. It turned a simple surprise into a memory we’ll talk about for a long time."
    },
    {
      initial: "M",
      role: "A thoughtful shopper",
      quote: "I found something thoughtful without spending hours searching. The collection feels personal and special."
    },
    {
      initial: "S",
      role: "A returning visitor",
      quote: "Beautiful ideas for every occasion. I love that the little details are part of the experience."
    }
  ];

  return (
    <section className="py-20 border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Head */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2.5 text-[#38e8ff] text-xs font-extrabold tracking-[0.18em] uppercase mb-2">
            <span className="w-6 h-[1px] bg-[#38e8ff]" />
            <span>Kind words, warm hearts</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#f5f7ff] tracking-tight">
            Love is in the <span className="gradient-text">details.</span>
          </h2>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {reviews.map((rev, i) => (
            <motion.article
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-[20px] border border-[rgba(75,142,255,0.28)] bg-white/[0.055] flex flex-col justify-between hover:border-[rgba(86,245,255,0.4)] transition-all"
            >
              <div>
                <div className="text-[#38e8ff] tracking-[0.15em] text-sm mb-3">
                  ★★★★★
                </div>
                <p className="text-[#aab7d8] text-sm sm:text-base leading-relaxed italic">
                  “{rev.quote}”
                </p>
              </div>

              <div className="flex items-center gap-3 pt-5 mt-4 border-t border-white/5">
                <span className="w-9 h-9 rounded-full bg-gradient-to-br from-[#e7c477] to-[#8d4ea8] text-[#25132e] font-bold text-sm flex items-center justify-center">
                  {rev.initial}
                </span>
                <span className="text-xs font-semibold text-[#f5f7ff]">
                  {rev.role}
                </span>
              </div>
            </motion.article>
          ))}
        </div>

      </div>
    </section>
  );
}
