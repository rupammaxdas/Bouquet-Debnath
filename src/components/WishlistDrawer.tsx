/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Trash2, ShoppingBag } from "lucide-react";
import { useWishlist } from "../lib/WishlistContext";

export function WishlistDrawer({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { wishlist, toggleWishlist } = useWishlist();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-[110]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-[120] flex flex-col"
          >
            <div className="p-8 border-b border-stone-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Heart className="text-stone-900 fill-stone-900" size={20} />
                <h2 className="text-xl font-display font-semibold">Your Wishlist</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8">
              {wishlist.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mb-6">
                    <Heart className="text-stone-200" size={32} />
                  </div>
                  <p className="text-stone-900 font-display italic text-lg">Your wishlist is empty.</p>
                  <p className="text-stone-400 text-sm mt-2 max-w-[200px]">Save your favorite bouquets to see them here later.</p>
                  <button 
                    onClick={onClose}
                    className="mt-8 px-6 py-2 border border-stone-900 text-stone-900 text-xs font-bold rounded-full hover:bg-stone-900 hover:text-white transition-all"
                  >
                    CONTINUE BROWSING
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  {wishlist.map((item) => (
                    <div key={item.productId} className="flex gap-4 group">
                      <div className="w-24 h-32 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <h3 className="text-sm font-semibold text-stone-900">{item.name}</h3>
                          <p className="text-xs text-stone-500 mt-1 uppercase tracking-widest">₹{item.price}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-stone-900 hover:text-stone-600 transition-colors">
                            <ShoppingBag size={14} /> Add to Bag
                          </button>
                          <button 
                            onClick={() => toggleWishlist({ id: item.productId })}
                            className="p-1.5 text-stone-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {wishlist.length > 0 && (
              <div className="p-8 bg-stone-50 border-t border-stone-100">
                <button className="w-full py-4 bg-stone-900 text-white text-xs font-bold uppercase tracking-[0.2em] rounded-full hover:bg-stone-800 transition-all">
                  Add All to Bag
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
