/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Sparkles, Gift, Tag, Check, Clock, Truck, Percent } from "lucide-react";

interface OfferCard {
  id: string;
  badge: string;
  title: string;
  description: string;
  code: string;
  icon: typeof Gift;
  expiry: string;
}

const OFFERS: OfferCard[] = [
  {
    id: "offer-1",
    badge: "15% FESTIVE DISCOUNT",
    title: "Seasonal Celebration Privilege",
    description: "Enjoy 15% off across all handcrafted bouquets, rose designs, and luxury atelier curations.",
    code: "GOLDBLOOM15",
    icon: Tag,
    expiry: "Valid this week"
  },
  {
    id: "offer-2",
    badge: "COMPLIMENTARY GIFT",
    title: "Gold Card & Luxury Wax Seal",
    description: "Every order above ₹1,499 receives our signature gold-embossed message card and custom ribbon finish.",
    code: "GOLDLUXE",
    icon: Gift,
    expiry: "Auto-applied at checkout"
  },
  {
    id: "offer-3",
    badge: "EXPRESS DISPATCH",
    title: "Priority Hand Delivery",
    description: "Guaranteed priority hand-delivery with cold stem water hydration seal across the city.",
    code: "FASTBLOOM",
    icon: Truck,
    expiry: "Available daily"
  }
];

export function OffersSection() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => {
      setCopiedCode(null);
    }, 2500);
  };

  return (
    <section id="offers" className="box-panel mb-6 font-sans">
      {/* Box Header */}
      <div className="box-header-gradient flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Percent size={15} className="text-amber-300" />
          <span className="uppercase tracking-wider">Promotional Coupons & Privileges</span>
        </div>
        <span className="text-[11px] text-sky-200">
          Curated by Rupam Max Das
        </span>
      </div>

      {/* Box Body */}
      <div className="p-4 sm:p-5 bg-gradient-to-b from-slate-50 to-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {OFFERS.map((offer) => {
            const Icon = offer.icon;
            const isCopied = copiedCode === offer.code;

            return (
              <div
                key={offer.id}
                className="bg-white border border-slate-300 rounded p-4 flex flex-col justify-between shadow-xs hover:border-blue-400 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-200 font-bold text-[10px] tracking-wider uppercase font-mono">
                      {offer.badge}
                    </span>
                    <div className="w-6 h-6 rounded glossy-icon-box flex items-center justify-center shrink-0">
                      <Icon size={13} />
                    </div>
                  </div>

                  <h3 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug mb-1">
                    {offer.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {offer.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                    <Clock size={12} className="text-blue-600" />
                    <span>{offer.expiry}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopy(offer.code)}
                    className={`px-3 py-1.5 rounded text-xs font-mono font-bold tracking-wider transition-all flex items-center gap-1.5 ${
                      isCopied
                        ? "bg-emerald-600 text-white border border-emerald-700"
                        : "glossy-btn-gold text-slate-950"
                    }`}
                    title="Click to copy coupon code"
                  >
                    {isCopied ? (
                      <>
                        <Check size={12} />
                        <span>COPIED</span>
                      </>
                    ) : (
                      <span>{offer.code}</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
