/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingBag, Eye, SlidersHorizontal, Check } from "lucide-react";
import { useWishlist } from "../lib/WishlistContext";
import { useCart } from "../lib/CartContext";
import { auth, login, db } from "../lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { ProductDetailModal, ProductType } from "./ProductDetailModal";

const DEFAULT_PRODUCTS: ProductType[] = [
  {
    id: 1,
    name: "The Velvet Rose",
    category: "Romantic",
    price: "2,499",
    image: "./assets/images/bouquet_romantic_roses_1790272159677.jpg",
    description: "An opulent gathering of rich velvety red Dutch Naomi roses hand-bound with silver dollar eucalyptus and artisanal wraps.",
  },
  {
    id: 2,
    name: "Meadow Whisper",
    category: "Seasonal",
    price: "1,599",
    image: "./assets/images/bouquet_seasonal_wildflowers_1790272175129.jpg",
    description: "Delicate seasonal wildflowers, foraged chamomile, and organic field greenery for a light, joyful ambiance.",
  },
  {
    id: 3,
    name: "Eternal Grace",
    category: "Sympathy",
    price: "4,999",
    image: "./assets/images/bouquet_sympathy_lilies_1790272187494.jpg",
    description: "Serene Casablanca lilies and snow-white blooms exuding peaceful solace, purity, and quiet reverence.",
  },
  {
    id: 4,
    name: "Tropical Sunrise",
    category: "Exotic",
    price: "3,299",
    image: "./assets/images/bouquet_tropical_blooms_1790272200991.jpg",
    description: "Vibrant architectural birds of paradise, golden ranunculus, and lush emerald monstera leaves from tropical sanctuaries.",
  },
];

const CATEGORIES = ["All", "Romantic", "Seasonal", "Sympathy", "Exotic"];

interface ProductGridProps {
  searchQuery?: string;
}

export function ProductGrid({ searchQuery = "" }: ProductGridProps) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  
  const [products, setProducts] = useState<ProductType[]>(DEFAULT_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc">("featured");
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);
  const [quickAddedId, setQuickAddedId] = useState<string | number | null>(null);

  // Sync with Firestore products if present
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "products"), (snapshot) => {
      if (!snapshot.empty) {
        const firestoreList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as ProductType[];
        setProducts(firestoreList);
      }
    }, (err) => {
      console.warn("Using default catalog:", err);
    });

    return unsub;
  }, []);

  const handleWishlistClick = (e: React.MouseEvent, product: ProductType) => {
    e.stopPropagation();
    if (!auth.currentUser) {
      login();
      return;
    }
    toggleWishlist(product);
  };

  const handleQuickAdd = async (e: React.MouseEvent, product: ProductType) => {
    e.stopPropagation();
    const priceNum = typeof product.price === "number"
      ? product.price
      : parseInt(product.price.toString().replace(/,/g, ""), 10) || 1999;

    await addToCart({
      productId: product.id.toString(),
      name: product.name,
      price: priceNum,
      quantity: 1,
      image: product.image,
      type: "curated",
    });

    setQuickAddedId(product.id);
    setTimeout(() => setQuickAddedId(null), 1500);
  };

  // Filter & Sort
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = selectedCategory === "All" || p.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch = !searchQuery.trim() || 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      const priceA = typeof a.price === "number" ? a.price : parseInt(a.price.toString().replace(/,/g, ""), 10) || 0;
      const priceB = typeof b.price === "number" ? b.price : parseInt(b.price.toString().replace(/,/g, ""), 10) || 0;

      if (sortBy === "price-asc") return priceA - priceB;
      if (sortBy === "price-desc") return priceB - priceA;
      return 0;
    });
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <section id="collection" className="py-24 bg-stone-50 border-t border-stone-100">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-semibold tracking-widest text-stone-400 uppercase mb-3 block">
              Curated Catalog
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-medium text-stone-900 tracking-tight">
              Featured Arrangements
            </h2>
            <p className="text-stone-500 text-xs sm:text-sm mt-2 max-w-md">
              Each boutique arrangement is harvested at peak maturity and wrapped in protective climate packaging.
            </p>
          </div>

          {/* Sort & Filter controls */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-600 shadow-xs">
              <SlidersHorizontal size={14} className="text-stone-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent focus:outline-none text-xs font-semibold text-stone-800 cursor-pointer"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex flex-wrap items-center gap-2 mb-12 border-b border-stone-200/70 pb-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
                selectedCategory === cat
                  ? "bg-stone-900 text-white shadow-sm"
                  : "bg-white text-stone-600 border border-stone-200 hover:border-stone-400 hover:text-stone-950"
              }`}
            >
              {cat === "All" ? "All Collections" : cat}
            </button>
          ))}
          <span className="text-xs text-stone-400 ml-auto font-mono">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'bouquet' : 'bouquets'}
          </span>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center space-y-3 bg-white rounded-3xl border border-stone-200/60 p-8">
            <p className="text-stone-400 font-display italic text-lg">No arrangements found</p>
            <p className="text-stone-500 text-xs">Try selecting another category or clear your search query.</p>
            <button
              onClick={() => { setSelectedCategory("All"); }}
              className="mt-4 px-5 py-2 rounded-full bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product, index) => {
              const isFav = isInWishlist(product.id.toString());
              const isAdded = quickAddedId === product.id;

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  onClick={() => setSelectedProduct(product)}
                  className="group cursor-pointer flex flex-col justify-between"
                >
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-stone-200 mb-5 shadow-sm border border-stone-200/60">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                      referrerPolicy="no-referrer"
                    />
                    
                    <div className="absolute inset-0 bg-stone-950/0 group-hover:bg-stone-950/20 transition-colors duration-300" />
                    
                    {/* Wishlist Toggle */}
                    <button 
                      onClick={(e) => handleWishlistClick(e, product)}
                      className="absolute top-3.5 right-3.5 p-2.5 bg-white/90 backdrop-blur-md rounded-full shadow-md transition-all hover:scale-110 z-10"
                      title={isFav ? "Saved in Wishlist" : "Save to Wishlist"}
                    >
                      <Heart 
                        size={16} 
                        className={`transition-colors ${isFav ? "fill-red-500 text-red-500" : "text-stone-400"}`} 
                      />
                    </button>

                    {/* Quick View Pill */}
                    <div className="absolute top-3.5 left-3.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-semibold tracking-wider uppercase text-stone-800 shadow-sm">
                        <Eye size={12} /> Inspect
                      </span>
                    </div>

                    {/* Quick Add Button */}
                    <button 
                      onClick={(e) => handleQuickAdd(e, product)}
                      disabled={isAdded}
                      className={`absolute bottom-3 left-3 right-3 py-3 rounded-xl text-xs font-semibold tracking-wider uppercase shadow-md backdrop-blur-md transition-all duration-300 flex items-center justify-center gap-1.5 ${
                        isAdded 
                          ? "bg-emerald-700 text-white opacity-100 translate-y-0"
                          : "bg-white/95 text-stone-900 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-stone-900 hover:text-white"
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check size={14} />
                          <span>Added to Bag</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={14} />
                          <span>Quick Add</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-stone-400 text-[11px] uppercase tracking-wider font-semibold">
                      <span>{product.category}</span>
                      <span className="text-[10px] font-mono text-emerald-700">● In Studio</span>
                    </div>
                    <h3 className="text-base font-display font-medium text-stone-900 group-hover:text-stone-600 transition-colors truncate">
                      {product.name}
                    </h3>
                    <p className="text-stone-900 font-mono text-sm font-semibold tabular-nums">
                      ₹{typeof product.price === "number" ? product.price.toLocaleString() : product.price}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

      </div>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </section>
  );
}
