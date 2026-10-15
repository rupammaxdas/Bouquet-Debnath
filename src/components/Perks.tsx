/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Sparkles, Gift, Heart, Mail } from "lucide-react";

export function Perks() {
  const perks = [
    {
      icon: Sparkles,
      symbol: "✧",
      title: "Thoughtfully Curated",
      desc: "Unique finds, chosen with care"
    },
    {
      icon: Gift,
      symbol: "♧",
      title: "Beautiful Presentation",
      desc: "Every detail matters"
    },
    {
      icon: Heart,
      symbol: "♡",
      title: "Made for Every Moment",
      desc: "Big milestones, little joys"
    },
    {
      icon: Mail,
      symbol: "✉",
      title: "Personal Touches",
      desc: "Make your gift feel yours"
    }
  ];

  return (
    <div className="border-y border-white/10 bg-white/[0.025] backdrop-blur-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {perks.map((perk, i) => {
            const Icon = perk.icon;
            return (
              <div key={i} className="flex items-center gap-3.5 text-[#aab7d8] text-xs sm:text-sm">
                <div className="w-11 h-11 shrink-0 rounded-2xl bg-[rgba(86,245,255,0.09)] border border-[rgba(86,245,255,0.25)] flex items-center justify-center text-[#38e8ff] text-base font-bold shadow-[0_0_15px_rgba(56,232,255,0.15)]">
                  {perk.symbol}
                </div>
                <div>
                  <strong className="block text-[#f5f7ff] font-semibold text-sm">
                    {perk.title}
                  </strong>
                  <span className="text-[#aab7d8] text-xs">
                    {perk.desc}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
