/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Tag, 
  Truck, 
  Sparkles,
  ShieldCheck,
  Check
} from "lucide-react";
import { useCart } from "../lib/CartContext";

export function CartDrawer({ onCheckout }: { onCheckout: () => void }) {
  const { 
    cart, 
    cartCount, 
    subtotal, 
    discount, 
    appliedPromo, 
    deliveryFee, 
    finalTotal, 
    isCartOpen, 
    setIsCartOpen,
    updateQuantity, 
    removeFromCart, 
    applyPromoCode, 
    removePromoCode 
  } = useCart();

  const [promoInput, setPromoInput] = useState("");
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyPromoCode(promoInput);
    setPromoMessage({ text: res.message, isError: !res.success });
    if (res.success) {
      setPromoInput("");
    }
  };

  const freeDeliveryThreshold = 2000;
  const remainingForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const deliveryProgress = Math.min(100, (subtotal / freeDeliveryThreshold) * 100);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-stone-950/50 backdrop-blur-sm z-[110]"
          />

          {/* Drawer Canvas */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 220 }}
            className="fixed inset-y-0 right-0 w-full max-w-lg bg-white shadow-2xl z-[120] flex flex-col justify-between"
          >
            {/* Header */}
            <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-stone-900 text-white flex items-center justify-center">
                  <ShoppingBag size={18} />
                </div>
                <div>
                  <h2 className="text-lg font-display font-semibold text-stone-900">Your Shopping Bag</h2>
                  <p className="text-xs text-stone-500 font-mono">
                    {cartCount} {cartCount === 1 ? 'creation' : 'creations'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-full transition-colors"
                aria-label="Close bag"
              >
                <X size={20} />
              </button>
            </div>

            {/* Free Delivery Bar */}
            <div className="px-6 py-3 bg-amber-50/70 border-b border-amber-100/60 text-xs text-amber-900">
              <div className="flex items-center justify-between mb-1.5 font-medium">
                <span className="flex items-center gap-1.5">
                  <Truck size={14} className="text-amber-700" />
                  {remainingForFreeDelivery === 0 ? (
                    <span className="font-semibold text-emerald-800">Complimentary Hand Delivery unlocked!</span>
                  ) : (
                    <span>Add <strong>₹{remainingForFreeDelivery.toLocaleString()}</strong> more for Free Delivery</span>
                  )}
                </span>
                <span className="text-[10px] font-mono font-semibold">{Math.round(deliveryProgress)}%</span>
              </div>
              <div className="w-full bg-amber-200/50 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-stone-900 h-full transition-all duration-500 rounded-full"
                  style={{ width: `${deliveryProgress}%` }}
                />
              </div>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-6 divide-y divide-stone-100">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6">
                  <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mb-5 text-stone-300">
                    <ShoppingBag size={28} />
                  </div>
                  <h3 className="font-display font-medium text-lg text-stone-900">Your bag is empty</h3>
                  <p className="text-xs text-stone-500 mt-2 max-w-xs leading-relaxed">
                    Explore our curated boutique collections or craft a custom bouquet with the bespoke studio.
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="mt-6 px-6 py-3 rounded-full bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-stone-800 transition-all shadow-sm"
                  >
                    Explore Blooms
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {cart.map((item) => (
                    <div key={item.id} className="pt-4 first:pt-0 flex gap-4 group">
                      {/* Thumbnail */}
                      <div className="w-20 h-24 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200/60 relative">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                        />
                        {item.type === "bespoke" && (
                          <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-stone-900/80 text-white text-[8px] font-semibold tracking-wider uppercase backdrop-blur-xs">
                            Custom
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-sm font-semibold text-stone-900 truncate">
                              {item.name}
                            </h4>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-stone-300 hover:text-red-500 transition-colors p-1"
                              title="Remove item"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>

                          {/* Bespoke stem summary if custom */}
                          {item.details && (
                            <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-1">
                              {item.details.wrap && <span>Wrap: {item.details.wrap} • </span>}
                              {item.details.ribbon && <span>Ribbon: {item.details.ribbon} • </span>}
                              {item.details.totalStems && <span>{item.details.totalStems} Stems</span>}
                            </p>
                          )}

                          <p className="text-xs font-mono font-medium text-stone-900 mt-1">
                            ₹{item.price.toLocaleString()}
                          </p>
                        </div>

                        {/* Stepper */}
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center gap-1.5 border border-stone-200 rounded-lg p-0.5 bg-stone-50">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-6 h-6 rounded flex items-center justify-center hover:bg-white text-stone-600 transition-colors"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-6 text-center text-xs font-mono font-medium text-stone-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-6 h-6 rounded flex items-center justify-center hover:bg-white text-stone-600 transition-colors"
                            >
                              <Plus size={12} />
                            </button>
                          </div>

                          <span className="text-xs font-mono font-semibold text-stone-900">
                            ₹{(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Summary & Checkout */}
            {cart.length > 0 && (
              <div className="p-6 bg-stone-50/80 border-t border-stone-200 space-y-4">
                
                {/* Promo Code Input */}
                <form onSubmit={handleApplyPromo} className="space-y-2">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input 
                        type="text"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        placeholder="Voucher code (BLOOM10)"
                        className="w-full pl-9 pr-3 py-2 bg-white border border-stone-200 rounded-xl text-xs uppercase tracking-wider focus:outline-none focus:border-stone-900 transition-colors font-mono"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-stone-800 text-white rounded-xl text-xs font-semibold hover:bg-stone-900 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  
                  {appliedPromo && (
                    <div className="flex items-center justify-between text-xs text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200/60">
                      <span className="flex items-center gap-1 font-medium">
                        <Check size={12} /> Code <strong>{appliedPromo}</strong> active
                      </span>
                      <button 
                        type="button" 
                        onClick={removePromoCode}
                        className="text-stone-400 hover:text-red-600 font-semibold"
                      >
                        Remove
                      </button>
                    </div>
                  )}

                  {promoMessage && !appliedPromo && (
                    <p className={`text-[11px] ${promoMessage.isError ? 'text-red-500' : 'text-emerald-700'}`}>
                      {promoMessage.text}
                    </p>
                  )}
                </form>

                {/* Price Breakdown */}
                <div className="space-y-2 text-xs text-stone-600 border-t border-stone-200 pt-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-mono text-stone-900 font-medium">₹{subtotal.toLocaleString()}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>Artisan Voucher</span>
                      <span className="font-mono">-₹{discount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Temperature-Controlled Delivery</span>
                    <span className="font-mono">
                      {deliveryFee === 0 ? (
                        <span className="text-emerald-700 font-semibold">FREE</span>
                      ) : (
                        `₹${deliveryFee}`
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between items-baseline pt-2 border-t border-stone-200 text-sm font-semibold text-stone-900">
                    <span className="font-display text-base">Estimated Total</span>
                    <span className="text-xl font-display font-bold">₹{finalTotal.toLocaleString()}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    onCheckout();
                  }}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#38e8ff] via-[#6f7dff] to-[#ff39d4] text-[#26152c] text-xs font-extrabold uppercase tracking-[0.18em] hover:brightness-110 active:scale-95 transition-all shadow-[0_8px_30px_rgba(86,245,255,0.25)] flex items-center justify-center gap-2 group min-h-[48px]"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform text-[#26152c]" />
                </button>

                <div className="flex items-center justify-center gap-4 text-[10px] text-stone-400 pt-1">
                  <span className="flex items-center gap-1">
                    <ShieldCheck size={12} className="text-emerald-600" /> Guaranteed Fresh
                  </span>
                  <span>•</span>
                  <span>7-Day Vase Life</span>
                  <span>•</span>
                  <span>Same-Day Available</span>
                </div>

              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
