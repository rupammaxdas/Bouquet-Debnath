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
    itemNumber: "01",
    name: "Handmade Flower Bouquets",
    category: "Handcrafted & Bespoke",
    price: "1,299",
    image: "./assets/images/bouquet_seasonal_wildflowers_1790272175129.jpg",
    description: "Artisanally assembled bouquet of garden-fresh seasonal blooms, carefully hand-tied with natural organic twine and rustic kraft wrap.",
    tag: "Artisan Classic",
    specs: {
      lifespan: "7 to 10 Days Fresh",
      fragrance: "Gentle Meadow Herb & Sweet Jasmine",
      height: "Approx. 40 cm",
      composition: "Wild garden daisies, asters, spray eucalyptus & chamomile"
    }
  },
  {
    id: 2,
    itemNumber: "02",
    name: "Rose Bouquet Designs",
    category: "Romantic & Roses",
    price: "1,499",
    image: "./assets/images/bouquet_romantic_roses_1790272159677.jpg",
    description: "Exquisite signature design of velvety Dutch Red Naomi roses layered with silver dollar eucalyptus in Debnath gold-embossed wrapping.",
    tag: "Bestseller",
    specs: {
      lifespan: "8 to 12 Days Fresh",
      fragrance: "Velvety Damask Rose Petals",
      height: "Approx. 45 cm",
      composition: "16 Dutch Red Naomi roses & spiral eucalyptus"
    }
  },
  {
    id: 3,
    itemNumber: "03",
    name: "Birthday Bouquets",
    category: "Celebrations & Gifts",
    price: "1,199",
    image: "./assets/images/bouquet_tropical_blooms_1790272200991.jpg",
    description: "Vibrant, cheerful birthday celebration bouquet featuring golden blooms, pastel lilies, and celebratory ribbons with custom message card.",
    tag: "Celebration Pick",
    specs: {
      lifespan: "7 to 9 Days Fresh",
      fragrance: "Sunny Citrus & Honeysuckle",
      height: "Approx. 42 cm",
      composition: "Asiatic lilies, marigold gerberas & baby's breath"
    }
  },
  {
    id: 4,
    itemNumber: "04",
    name: "Anniversary Bouquets",
    category: "Romantic & Roses",
    price: "1,899",
    image: "./assets/images/hero_floral_bouquet_1790272143558.jpg",
    description: "Symbolizing everlasting love and devotion with lush Sarah Bernhardt peonies, romantic garden roses, and cascading silk ribbon.",
    tag: "Romantic Luxe",
    specs: {
      lifespan: "8 to 11 Days Fresh",
      fragrance: "Sweet Spring Floral Powder",
      height: "Approx. 45 cm",
      composition: "Heritage garden peonies, blush roses & Italian ruscus"
    }
  },
  {
    id: 5,
    itemNumber: "05",
    name: "Wedding Bouquets",
    category: "Weddings & Bridal",
    price: "2,499",
    image: "./assets/images/bouquet_bridal_1791794787656.jpg",
    description: "Breathtaking bridal ceremony creation with pristine white Casablanca lilies, David Austin ivory roses, and delicate trailing greenery.",
    tag: "Bridal Couture",
    specs: {
      lifespan: "Ceremony Ready (7+ Days Fresh)",
      fragrance: "Pure White Lily & Garden Jasmine",
      height: "Approx. 48 cm",
      composition: "Casablanca lilies, garden gardenias & seeded eucalyptus"
    }
  },
  {
    id: 6,
    itemNumber: "06",
    name: "Valentine’s Day Special Bouquets",
    category: "Romantic & Roses",
    price: "1,999",
    image: "./assets/images/bouquet_romantic_roses_1790272159677.jpg",
    description: "The quintessential expression of passion. Two dozen velvety crimson roses in signature Debnath gold-stamped luxury packaging.",
    tag: "Valentine Exclusive",
    specs: {
      lifespan: "8 to 12 Days Fresh",
      fragrance: "Deep Crimson Rose & Musk",
      height: "Approx. 50 cm",
      composition: "24 Long-stem crimson roses & Gypsophila"
    }
  },
  {
    id: 7,
    itemNumber: "07",
    name: "Artificial Flower Bouquets",
    category: "Everlasting & Crafts",
    price: "1,399",
    image: "./assets/images/bouquet_sympathy_lilies_1790272187494.jpg",
    description: "High-grade everlasting faux silk botanicals that retain eternal fresh vibrancy for home decor, executive desks, and timeless keepsakes.",
    tag: "Everlasting Life",
    specs: {
      lifespan: "Perpetual / Years of Beauty",
      fragrance: "Subtle Linen Floral Mist (Infused)",
      height: "Approx. 40 cm",
      composition: "Fine botanical silk hydrangeas, roses & eucalyptus"
    }
  },
  {
    id: 8,
    itemNumber: "08",
    name: "Paper Flower Bouquets",
    category: "Everlasting & Crafts",
    price: "1,299",
    image: "./assets/images/bouquet_paper_1791794757056.jpg",
    description: "Intricately sculpted Italian crepe paper peonies and origami blooms, handmade with archival fine art papers for a sculptural statement.",
    tag: "Hand-Folded Art",
    specs: {
      lifespan: "Permanent Archival Sculpture",
      fragrance: "Delicate Paper & Cotton Scent",
      height: "Approx. 38 cm",
      composition: "180gsm Italian heavy crepe paper & floral brass wire"
    }
  },
  {
    id: 9,
    itemNumber: "09",
    name: "Money Bouquets",
    category: "Celebrations & Gifts",
    price: "2,999",
    image: "./assets/images/bouquet_money_1791794732308.jpg",
    description: "Opulent bespoke celebration bouquet featuring artistically folded currency notes interwoven with fresh blush roses and baby's breath.",
    tag: "Luxury Gift",
    specs: {
      lifespan: "Fresh Blooms 7 Days + Preserved Notes",
      fragrance: "Fresh Rosewater & Baby's Breath",
      height: "Approx. 44 cm",
      composition: "Crisp artfully folded currency cones, blush roses & foliage"
    }
  },
  {
    id: 10,
    itemNumber: "10",
    name: "Chocolate Bouquets",
    category: "Celebrations & Gifts",
    price: "1,799",
    image: "./assets/images/bouquet_chocolate_1791794714326.jpg",
    description: "Indulgent gourmet gift arrangement combining imported Ferrero Rocher hazelnut chocolates with fragrant pink garden roses.",
    tag: "Gourmet Delight",
    specs: {
      lifespan: "Fresh Blooms 7 Days + Chocolates Freshness Seal",
      fragrance: "Sweet Rose & Hazelnut Cocoa",
      height: "Approx. 40 cm",
      composition: "16 Ferrero Rocher chocolates, baby pink roses & silk wrap"
    }
  },
  {
    id: 11,
    itemNumber: "11",
    name: "Bridal Hand Bouquets",
    category: "Weddings & Bridal",
    price: "2,799",
    image: "./assets/images/bouquet_bridal_1791794787656.jpg",
    description: "Opulent cascade hand-tied bridal bouquet featuring David Austin ivory roses, sweet peas, and cascading champagne silk ribbons.",
    tag: "Handcrafted Bridal",
    specs: {
      lifespan: "Ceremony Day Prime (7+ Days Fresh)",
      fragrance: "Sweet Pea & David Austin Roses",
      height: "Approx. 42 cm cascade",
      composition: "Ivory garden roses, white sweet peas & pure silk ribbon"
    }
  },
  {
    id: 12,
    itemNumber: "12",
    name: "Customized Gift Bouquets",
    category: "Handcrafted & Bespoke",
    price: "1,699",
    image: "./assets/images/hero_floral_bouquet_1790272143558.jpg",
    description: "Tailor-made arrangement crafted to your exact recipient preferences, favorite stems, luxury wrapping style, and handwritten note.",
    tag: "Personalized",
    specs: {
      lifespan: "7 to 10 Days Fresh",
      fragrance: "Custom Florist Blend",
      height: "Bespoke (40-50 cm)",
      composition: "Custom seasonal stem curation of your choice"
    }
  },
  {
    id: 13,
    itemNumber: "13",
    name: "Newborn Baby Gift Bouquets",
    category: "Celebrations & Gifts",
    price: "1,499",
    image: "./assets/images/bouquet_newborn_baby_1791795252415.jpg",
    description: "Sweet pastel arrangement of tender blush and sky blue blossoms celebrating precious new arrivals and joyful nursery beginnings.",
    tag: "Nursery Safe",
    specs: {
      lifespan: "7 to 9 Days Fresh",
      fragrance: "Hypoallergenic Mild Bloom Essence",
      height: "Approx. 38 cm",
      composition: "Sky blue hydrangeas, blush spray roses & welcome baby charm"
    }
  },
  {
    id: 14,
    itemNumber: "14",
    name: "Festival Special Bouquets",
    category: "Celebrations & Gifts",
    price: "1,399",
    image: "./assets/images/bouquet_festival_special_1791795274318.jpg",
    description: "Festive auspicious floral bouquet featuring radiant marigold tones, golden ranunculus, and sacred accents for joyous celebrations.",
    tag: "Festive Exclusive",
    specs: {
      lifespan: "8 to 12 Days Auspicious Freshness",
      fragrance: "Sacred Sandalwood & Marigold Spiced Aroma",
      height: "Approx. 42 cm",
      composition: "Golden marigolds, orange ranunculus, brass trinket accents"
    }
  },
  {
    id: 15,
    itemNumber: "15",
    name: "Premium Luxury Bouquets",
    category: "Luxury & Editorial",
    price: "3,499",
    image: "./assets/images/hero_floral_bouquet_1790272143558.jpg",
    description: "The pinnacle of floral couture. Rare seasonal imports, Dutch garden roses, exotic orchids, and heavyweight emerald velvet wrapping.",
    tag: "Haute Couture",
    specs: {
      lifespan: "10 to 14 Days Fresh",
      fragrance: "Exotic Night Orchid & Gardenia",
      height: "Approx. 52 cm",
      composition: "Imported Cymbidium orchids, Dutch roses & velvet wrap"
    }
  },
  {
    id: 16,
    itemNumber: "16",
    name: "Bouquet Making Tutorials",
    category: "DIY & Workshops",
    price: "899",
    image: "./assets/images/bouquet_diy_1791794818629.jpg",
    description: "Comprehensive masterclass video guide and recipe booklet teaching spiral hand-tied bouquet techniques by master florist Trisha Debnath.",
    tag: "Masterclass Video",
    specs: {
      lifespan: "Lifetime On-Demand Video Access",
      fragrance: "Learn floral aroma theory",
      height: "Digital 4K Video Course + PDF Manual",
      composition: "6 Modules: Spiral tie, stem cut, hydration & wrapping"
    }
  },
  {
    id: 17,
    itemNumber: "17",
    name: "Creative DIY Bouquet Ideas",
    category: "DIY & Workshops",
    price: "1,199",
    image: "./assets/images/bouquet_diy_1791794818629.jpg",
    description: "Complete florist starter workshop kit with fresh stem selections, floral snips, binding tape, rustic twine, and step-by-step design cards.",
    tag: "Complete Craft Kit",
    specs: {
      lifespan: "Includes Tools & Fresh Stems Kit",
      fragrance: "Fresh Eucalyptus & Botanical Greens",
      height: "Full Florist Tool & Stem Box",
      composition: "Professional snips, floral tape, kraft wraps & fresh stem pack"
    }
  },
  {
    id: 18,
    itemNumber: "18",
    name: "Surprise Gift Bouquets",
    category: "Celebrations & Gifts",
    price: "1,599",
    image: "./assets/images/bouquet_surprise_gift_1791795336071.jpg",
    description: "Curated mystery seasonal bouquet handcrafted fresh on delivery morning with surprise bespoke elements, midnight navy wrapping and gold wax seal.",
    tag: "Mystery Reveal",
    specs: {
      lifespan: "8 to 11 Days Fresh",
      fragrance: "Surprise Florist Exotic Blend",
      height: "Approx. 45 cm",
      composition: "Secret harvest of daily farm-fresh premium imports"
    }
  },
  {
    id: 19,
    itemNumber: "19",
    name: "Best Friend Gift Bouquets",
    category: "Celebrations & Gifts",
    price: "1,249",
    image: "./assets/images/bouquet_best_friend_1791795298768.jpg",
    description: "A delightful, warm gathering of yellow roses, sunny sunflowers, pink lisianthus, and chamomile daisies celebrating unshakeable companionship.",
    tag: "Friendship Glow",
    specs: {
      lifespan: "8 to 12 Days Fresh",
      fragrance: "Warm Sunny Meadow & Sweet Chamomile",
      height: "Approx. 42 cm",
      composition: "Sunflowers, yellow spray roses, chamomile & keepsake ribbon"
    }
  },
];

const CATEGORIES = [
  "All",
  "Celebrations & Gifts",
  "Romantic & Roses",
  "Weddings & Bridal",
  "Handcrafted & Bespoke",
  "Everlasting & Crafts",
  "DIY & Workshops",
  "Luxury & Editorial",
];

interface ProductGridProps {
  searchQuery?: string;
}

export function ProductGrid({ searchQuery = "" }: ProductGridProps) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  
  const [products, setProducts] = useState<ProductType[]>(DEFAULT_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"featured" | "number-asc" | "price-asc" | "price-desc">("number-asc");
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);
  const [quickAddedId, setQuickAddedId] = useState<string | number | null>(null);

  // Sync with Firestore products if present, preserving default 19 items
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "products"), (snapshot) => {
      if (!snapshot.empty) {
        const firestoreList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as ProductType[];

        // Merge: keep all 19 default catalog items and integrate Firestore updates
        const catalogMap = new Map<string, ProductType>();
        DEFAULT_PRODUCTS.forEach(p => catalogMap.set(p.name.toLowerCase(), p));
        firestoreList.forEach(fp => {
          const key = fp.name.toLowerCase();
          if (catalogMap.has(key)) {
            catalogMap.set(key, { ...catalogMap.get(key)!, ...fp });
          } else {
            catalogMap.set(key, fp);
          }
        });
        setProducts(Array.from(catalogMap.values()));
      }
    }, (err) => {
      console.warn("Using default catalog:", err);
    });

    return unsub;
  }, []);

  const handleWishlistClick = (e: React.MouseEvent, product: ProductType) => {
    e.stopPropagation();
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
      const q = searchQuery.trim().toLowerCase();
      
      const matchesSearch = !q || 
        p.name.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q) ||
        (p.itemNumber && (
          p.itemNumber.toLowerCase().includes(q) || 
          `№ ${p.itemNumber}`.toLowerCase().includes(q) ||
          `item ${p.itemNumber}`.toLowerCase().includes(q) ||
          parseInt(p.itemNumber, 10).toString() === q
        )) ||
        (p.tag && p.tag.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === "number-asc") {
        const numA = parseInt(a.itemNumber || a.id.toString(), 10) || 0;
        const numB = parseInt(b.itemNumber || b.id.toString(), 10) || 0;
        return numA - numB;
      }

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
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-semibold tracking-widest text-stone-400 uppercase">
                Curated Catalog
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-stone-200/80 text-stone-700 text-[10px] font-mono font-bold tracking-wider">
                19 Handcrafted Creations
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-medium text-stone-900 tracking-tight">
              Featured Arrangements
            </h2>
            <p className="text-stone-500 text-xs sm:text-sm mt-2 max-w-xl">
              From fresh rose and bridal creations to paper, money, chocolate artistry, and florist masterclasses — each handcrafted with signature perfection.
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
                <option value="number-asc">Catalog Order: № 01 to 19</option>
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
              {cat === "All" ? "All 19 Bouquets" : cat}
            </button>
          ))}
          <span className="text-xs text-stone-500 ml-auto font-mono font-semibold">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'bouquet' : 'bouquets'} listed
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
              const displayNum = product.itemNumber || (index + 1).toString().padStart(2, "0");

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.04 }}
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

                    {/* Item Number & Tag Badges */}
                    <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 z-10 flex-wrap">
                      <span className="px-2.5 py-1 rounded-full bg-stone-900/90 text-white backdrop-blur-md text-[10px] font-mono font-bold tracking-wider shadow-sm border border-white/20">
                        № {displayNum}
                      </span>
                      {product.tag && (
                        <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-white/95 text-stone-800 backdrop-blur-md text-[9px] font-semibold tracking-wide shadow-sm">
                          {product.tag}
                        </span>
                      )}
                    </div>
                    
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
                    <div className="absolute bottom-16 left-3.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
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
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="font-mono text-stone-900 font-bold">#{displayNum}</span>
                        <span>•</span>
                        <span className="truncate">{product.category}</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-700 shrink-0">● In Studio</span>
                    </div>
                    <h3 className="text-base font-display font-medium text-stone-900 group-hover:text-stone-600 transition-colors truncate">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between pt-0.5">
                      <p className="text-stone-900 font-mono text-sm font-semibold tabular-nums">
                        ₹{typeof product.price === "number" ? product.price.toLocaleString() : product.price}
                      </p>
                      <span className="text-[10px] text-stone-400">Handcrafted</span>
                    </div>
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
