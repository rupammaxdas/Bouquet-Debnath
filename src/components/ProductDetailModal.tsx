/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  X, 
  Heart, 
  ShoppingBag, 
  Plus, 
  Minus, 
  Truck, 
  ShieldCheck, 
  Sparkles, 
  Droplets,
  Sun,
  Check
} from "lucide-react";
import { useCart } from "../lib/CartContext";
import { useWishlist } from "../lib/WishlistContext";
import { auth, login } from "../lib/firebase";

export interface ProductType {
  id: number | string;
  itemNumber?: string;
  name: string;
  category: string;
  price: string | number;
  image: string;
  description?: string;
  tag?: string;
  specs?: {
    lifespan?: string;
    fragrance?: string;
    height?: string;
    composition?: string;
    careTips?: string;
    inclusions?: string;
  };
}

interface ProductDetailModalProps {
  product: ProductType | null;
  onClose: () => void;
}

export function ProductDetailModal({ product, onClose }: ProductDetailModalProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);

  if (!product) return null;

  const numericPrice = typeof product.price === "number" 
    ? product.price 
    : parseInt(product.price.toString().replace(/,/g, ""), 10) || 1999;

  const isFavorited = isInWishlist(product.id.toString());

  const handleAddToCart = async () => {
    await addToCart({
      productId: product.id.toString(),
      name: product.name,
      price: numericPrice,
      quantity,
      image: product.image,
      type: "curated",
    });
    setAddedNotice(true);
    setTimeout(() => {
      setAddedNotice(false);
      onClose();
    }, 1200);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div className="fixed inset-0 z-[125] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-stone-950/60 backdrop-blur-md"
      />

      {/* Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col md:flex-row max-h-[90vh]"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-white text-stone-700 hover:text-stone-950 shadow-md backdrop-blur-xs transition-colors"
        >
          <X size={18} />
        </button>

        {/* Product Visual Side */}
        <div className="md:w-1/2 relative bg-stone-100 aspect-square md:aspect-auto">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <button
            onClick={handleWishlistToggle}
            className="absolute top-4 left-4 p-2.5 rounded-full bg-white/80 hover:bg-white backdrop-blur-md shadow-md transition-all hover:scale-110"
            title={isFavorited ? "Saved in wishlist" : "Add to wishlist"}
          >
            <Heart 
              size={18} 
              className={isFavorited ? "fill-red-500 text-red-500" : "text-stone-400"} 
            />
          </button>
          <div className="absolute bottom-4 left-4 right-4 bg-stone-900/60 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-[10px] uppercase tracking-wider flex items-center justify-between">
            <span>Hand-tied within 2 hours of delivery</span>
            <span className="font-bold">Fresh Guarantee</span>
          </div>
        </div>

        {/* Product Details Side */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                {product.itemNumber && (
                  <span className="px-2 py-0.5 rounded-md bg-stone-900 text-white font-mono text-[10px] font-bold tracking-wider">
                    № {product.itemNumber}
                  </span>
                )}
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">
                  {product.category}
                </span>
                {product.tag && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-semibold">
                    {product.tag}
                  </span>
                )}
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-medium text-stone-900">
                {product.name}
              </h2>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-xl font-display font-bold text-stone-900">
                  ₹{numericPrice.toLocaleString()}
                </span>
                <span className="text-xs text-stone-500">Includes decorative wrapping & personalized greeting card</span>
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              {product.description || 
                "Artfully composed by our master florists with sustainably harvested botanicals, designed to unfold and radiate grace over 7+ days in your sanctuary."
              }
            </p>

            {/* Botanist Specifications & Craft Details */}
            <div className="grid grid-cols-2 gap-2.5 p-3 rounded-2xl bg-stone-50 text-[11px] text-stone-600 border border-stone-200/60">
              <div>
                <span className="text-stone-400 block text-[9px] uppercase tracking-wider">Lifespan / Durability</span>
                <strong className="text-stone-900">{product.specs?.lifespan || "7 to 10 Days Fresh"}</strong>
              </div>
              <div>
                <span className="text-stone-400 block text-[9px] uppercase tracking-wider">Aroma Profile</span>
                <strong className="text-stone-900">{product.specs?.fragrance || "Subtle Floral Perfume"}</strong>
              </div>
              <div>
                <span className="text-stone-400 block text-[9px] uppercase tracking-wider">Scale & Height</span>
                <strong className="text-stone-900">{product.specs?.height || "Approx. 40–45 cm"}</strong>
              </div>
              <div>
                <span className="text-stone-400 block text-[9px] uppercase tracking-wider">Craft Composition</span>
                <strong className="text-stone-900">{product.specs?.composition || "Hand-tied Artisan Selection"}</strong>
              </div>
            </div>

            {/* Care Guidance */}
            <div className="flex items-center gap-3 text-[11px] text-stone-500 pt-1">
              <span className="flex items-center gap-1">
                <Droplets size={13} className="text-blue-500" /> Cold water daily
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Sun size={13} className="text-amber-500" /> Filtered sunlight
              </span>
            </div>
          </div>

          {/* Quantity & Add to Cart Controls */}
          <div className="pt-6 border-t border-stone-100 space-y-3 mt-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-700">Quantity</span>
              <div className="flex items-center gap-2 border border-stone-200 rounded-xl p-1 bg-stone-50">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-stone-600 hover:bg-stone-200"
                >
                  <Minus size={13} />
                </button>
                <span className="w-8 text-center text-xs font-mono font-semibold text-stone-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-stone-600 hover:bg-stone-200"
                >
                  <Plus size={13} />
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={addedNotice}
              className={`w-full py-4 rounded-xl text-xs font-extrabold uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 min-h-[46px] ${
                addedNotice 
                  ? "bg-emerald-700 text-white" 
                  : "bg-gradient-to-r from-[#38e8ff] via-[#6f7dff] to-[#ff39d4] text-[#26152c] hover:brightness-110 active:scale-95"
              }`}
            >
              {addedNotice ? (
                <>
                  <Check size={16} />
                  <span>Added to Your Bag</span>
                </>
              ) : (
                <>
                  <ShoppingBag size={16} />
                  <span>Add to Bag • ₹{(numericPrice * quantity).toLocaleString()}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
