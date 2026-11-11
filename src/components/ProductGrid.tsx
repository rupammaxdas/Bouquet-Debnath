/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from "react";
import { Heart, ShoppingBag, Eye, SlidersHorizontal, Check, Sparkles, Filter } from "lucide-react";
import { useWishlist } from "../lib/WishlistContext";
import { useCart } from "../lib/CartContext";
import { db } from "../lib/firebase";
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
    description: "Exquisite signature design of velvety Dutch Red Naomi roses layered with silver dollar eucalyptus in Gift Hub World gold-embossed wrapping.",
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
      composition: "Sunflowers, yellow ranunculus, spray roses & greenery"
    }
  },
  {
    id: 4,
    itemNumber: "04",
    name: "Anniversary Bouquets",
    category: "Romantic & Roses",
    price: "1,699",
    image: "./assets/images/bouquet_sympathy_lilies_1790272187494.jpg",
    description: "Opulent anniversary gathering of imperial white Oriental lilies, powdery blush garden roses, and double-faced satin ribbon.",
    tag: "Milestone Romance",
    specs: {
      lifespan: "9 to 14 Days Fresh",
      fragrance: "Imperial Oriental Lily Nectar",
      height: "Approx. 50 cm",
      composition: "White Casablanca lilies, pastel roses & Italian ruscus"
    }
  },
  {
    id: 5,
    itemNumber: "05",
    name: "Bridal Flower Bouquets",
    category: "Weddings & Bridal",
    price: "1,899",
    image: "./assets/images/bouquet_bridal_1791794787656.jpg",
    description: "Graceful cascading bridal handheld with ivory garden roses, fragrant white sweet peas, and French trailing silk ribbon.",
    tag: "Bridal Heirloom",
    specs: {
      lifespan: "Special Event Preservation",
      fragrance: "Delicate White Peony & Orange Blossom",
      height: "Approx. 38 cm Compact",
      composition: "Ivory garden roses, white sweet peas & pure silk ribbon"
    }
  },
  {
    id: 6,
    itemNumber: "06",
    name: "Wedding Bouquet Arrangements",
    category: "Weddings & Bridal",
    price: "1,999",
    image: "./assets/images/bouquet_bridal_1791794787656.jpg",
    description: "Grand editorial wedding stage and sweetheart table arrangement designed with rare white hydrangeas and premium Dutch imports.",
    tag: "Grand Ceremony",
    specs: {
      lifespan: "Full Ceremony Freshness",
      fragrance: "Subtle Floral Sweetness",
      height: "Approx. 55 cm Deluxe",
      composition: "White hydrangea globes, peonies & trailing ivy"
    }
  },
  {
    id: 7,
    itemNumber: "07",
    name: "Money Bouquet Ideas",
    category: "Everlasting & Crafts",
    price: "1,799",
    image: "./assets/images/bouquet_money_1791794732308.jpg",
    description: "Clever artistic arrangement blending fresh red roses with ornamental currency folds, gold wire accents, and royal presentation wrap.",
    tag: "Artistic Keepsake",
    specs: {
      lifespan: "Fresh Blooms + Keepsake Accents",
      fragrance: "Sweet Rose Petal Aroma",
      height: "Approx. 40 cm",
      composition: "Roses, decorative currency folds, gold mesh wrap"
    }
  },
  {
    id: 8,
    itemNumber: "08",
    name: "Chocolate Bouquet Designs",
    category: "Celebrations & Gifts",
    price: "1,499",
    image: "./assets/images/bouquet_chocolate_1791794714326.jpg",
    description: "Indulgent gourmet gift bouquet pairing artisan Ferrero Rocher pralines and Swiss truffles with deep burgundy spray carnations.",
    tag: "Sweet Gourmet",
    specs: {
      lifespan: "Gourmet Confections & Long-Lasting Blooms",
      fragrance: "Rich Cocoa & Delicate Floral Accent",
      height: "Approx. 35 cm",
      composition: "16 Ferrero pralines, burgundy blooms & luxury paper wrap"
    }
  },
  {
    id: 9,
    itemNumber: "09",
    name: "Paper Flower Bouquets",
    category: "Everlasting & Crafts",
    price: "1,299",
    image: "./assets/images/bouquet_paper_1791794757056.jpg",
    description: "Handcrafted eternal botanical art created with Italian crepe paper, individually sculpted petals, and preserved eucalyptus stems.",
    tag: "Everlasting Craft",
    specs: {
      lifespan: "Forever Keepsake (Years)",
      fragrance: "Scent-Free / Hypoallergenic",
      height: "Approx. 38 cm",
      composition: "100% handcrafted Italian crepe paper florals"
    }
  },
  {
    id: 10,
    itemNumber: "10",
    name: "Artificial Flower Arrangements",
    category: "Everlasting & Crafts",
    price: "1,399",
    image: "./assets/images/bouquet_paper_1791794757056.jpg",
    description: "Botanically accurate real-touch silk peonies and hydrangeas arranged in a matte ceramic vase for timeless interior elegance.",
    tag: "Real-Touch Silk",
    specs: {
      lifespan: "Permanent Home Decor",
      fragrance: "Optional Botanical Mist",
      height: "Approx. 42 cm",
      composition: "Real-touch silk peonies, faux seeded eucalyptus"
    }
  },
  {
    id: 11,
    itemNumber: "11",
    name: "Dried Flower Bouquets",
    category: "Everlasting & Crafts",
    price: "1,199",
    image: "./assets/images/bouquet_seasonal_wildflowers_1790272175129.jpg",
    description: "Earthy bohemian curation of naturally air-dried lavender, bunny tails, wheat stems, and golden starflowers tied with hemp cord.",
    tag: "Boho Chic",
    specs: {
      lifespan: "1 to 2 Years Preserved",
      fragrance: "Natural Provence Dried Lavender",
      height: "Approx. 45 cm",
      composition: "Dried lavender, lagurus ovatus, bleached ruscus"
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
    name: "Flower Wrapping Techniques",
    category: "DIY & Workshops",
    price: "999",
    image: "./assets/images/wrap_kraft_paper_1790273651373.jpg",
    description: "Interactive masterclass bundle featuring 5 premium wrapping paper sheets, ribbons, and master video guide by Rupam Max Das.",
    tag: "Florist Masterclass",
    specs: {
      lifespan: "Lifetime Video Access + Paper Bundle",
      fragrance: "Subtle Studio Cedar & Paper",
      height: "Comprehensive Studio Pack",
      composition: "Korean frosted wraps, Italian kraft paper & satin ribbons"
    }
  },
  {
    id: 16,
    itemNumber: "16",
    name: "How to Make a Flower Bouquet",
    category: "DIY & Workshops",
    price: "999",
    image: "./assets/images/bouquet_bridal_1791794787656.jpg",
    description: "Step-by-step digital atelier video guide covering stem conditioning, the European spiral technique, and presentation finishing.",
    tag: "Video Course",
    specs: {
      lifespan: "Digital HD Video Access",
      fragrance: "Digital Masterclass",
      height: "Instant Digital Enrollment",
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
  }
];

const CATEGORIES = [
  "All",
  "Romantic & Roses",
  "Celebrations & Gifts",
  "Handcrafted & Bespoke",
  "Weddings & Bridal",
  "Everlasting & Crafts",
  "DIY & Workshops",
  "Luxury & Editorial",
];

interface ProductGridProps {
  searchQuery?: string;
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
  priceFilter?: string;
}

export function ProductGrid({ 
  searchQuery = "", 
  selectedCategory: propCategory, 
  onSelectCategory: propSetCategory,
  priceFilter = "all"
}: ProductGridProps) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  
  const [products, setProducts] = useState<ProductType[]>(DEFAULT_PRODUCTS);
  const [internalCategory, setInternalCategory] = useState("All");
  const selectedCategory = propCategory !== undefined ? propCategory : internalCategory;
  const setSelectedCategory = propSetCategory || setInternalCategory;

  const [sortBy, setSortBy] = useState<"number-asc" | "price-asc" | "price-desc">("number-asc");
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
      : parseInt(product.price.toString().replace(/,/g, ""), 10) || 1299;

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

      // Price Filter
      const priceNum = typeof p.price === "number" ? p.price : parseInt(p.price.toString().replace(/,/g, ""), 10) || 0;
      let matchesPrice = true;
      if (priceFilter === "under-1200") matchesPrice = priceNum < 1200;
      else if (priceFilter === "1200-1500") matchesPrice = priceNum >= 1200 && priceNum <= 1500;
      else if (priceFilter === "above-1500") matchesPrice = priceNum > 1500;

      return matchesCategory && matchesSearch && matchesPrice;
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
  }, [products, selectedCategory, searchQuery, sortBy, priceFilter]);

  return (
    <section id="collection" className="box-panel mb-6 font-sans">
      
      {/* Box Header: Gradient Title Bar */}
      <div className="box-header-gradient flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <ShoppingBag size={15} className="text-sky-300" />
          <span className="uppercase tracking-wider">
            Curated Flower Bouquet Catalog (19 Designs)
          </span>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-slate-300 hidden sm:inline">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-blue-950 text-white border border-blue-800 text-xs rounded px-2.5 py-1 focus:outline-none cursor-pointer"
          >
            <option value="number-asc">Catalog № 01 to 19</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Sub-toolbar: Category Tabs */}
      <div className="bg-slate-100 border-b border-slate-300 p-2.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 text-xs rounded font-medium transition-all ${
                selectedCategory === cat
                  ? "bg-blue-700 text-white font-bold shadow-xs"
                  : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-200"
              }`}
            >
              {cat === "All" ? `All (${products.length})` : cat}
            </button>
          ))}
        </div>

        <span className="text-[11px] font-mono text-slate-600 ml-auto">
          Showing <strong>{filteredProducts.length}</strong> items
        </span>
      </div>

      {/* Box Body: Products Grid */}
      <div className="p-4 sm:p-5 bg-white">
        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center space-y-2 bg-slate-50 border border-slate-200 rounded p-6">
            <p className="text-slate-500 font-semibold text-sm">No floral arrangements match your filter</p>
            <p className="text-slate-400 text-xs">Try selecting 'All' categories or resetting the budget filter.</p>
            <button
              onClick={() => setSelectedCategory("All")}
              className="mt-3 px-4 py-1.5 rounded glossy-btn-blue text-xs"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((product, index) => {
              const isFav = isInWishlist(product.id.toString());
              const isAdded = quickAddedId === product.id;
              const displayNum = product.itemNumber || (index + 1).toString().padStart(2, "0");

              return (
                <div
                  key={product.id}
                  className="bg-white border border-slate-300 rounded p-3 flex flex-col justify-between hover:border-blue-500 hover:shadow-md transition-all group"
                >
                  <div>
                    {/* Image Container with Framing */}
                    <div 
                      onClick={() => setSelectedProduct(product)}
                      className="relative aspect-[4/3] rounded overflow-hidden bg-slate-100 border border-slate-200 mb-3 cursor-pointer"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                      />

                      {/* Number Tag */}
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-900/85 text-white text-[10px] font-mono font-bold">
                        № {displayNum}
                      </span>

                      {/* Wishlist Button */}
                      <button
                        type="button"
                        onClick={(e) => handleWishlistClick(e, product)}
                        className="absolute top-2 right-2 w-7 h-7 rounded bg-white/95 border border-slate-300 flex items-center justify-center shadow-xs hover:scale-110 transition-transform"
                        title="Wishlist"
                      >
                        <Heart
                          size={13}
                          className={isFav ? "fill-rose-500 text-rose-500" : "text-slate-400"}
                        />
                      </button>

                      {/* Hover Inspect Prompt */}
                      <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="px-2 py-0.5 rounded bg-blue-900/90 text-white text-[10px] font-bold flex items-center gap-1 shadow-xs">
                          <Eye size={11} /> Quick View
                        </span>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-500">
                        <span className="truncate">{product.category}</span>
                        <span className="text-emerald-700 font-mono">● Fresh</span>
                      </div>

                      <h3
                        onClick={() => setSelectedProduct(product)}
                        className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-blue-800 transition-colors line-clamp-1 cursor-pointer"
                      >
                        {product.name}
                      </h3>

                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                    </div>
                  </div>

                  {/* Price & Action Button */}
                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-slate-400 block -mb-0.5">Price</span>
                      <strong className="text-base sm:text-lg font-bold text-slate-900 font-mono">
                        ₹{typeof product.price === "number" ? product.price.toLocaleString() : product.price}
                      </strong>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleQuickAdd(e, product)}
                      disabled={isAdded}
                      className={`px-3 py-1.5 rounded text-xs flex items-center gap-1.5 ${
                        isAdded
                          ? "bg-emerald-600 text-white font-bold"
                          : "glossy-btn-blue"
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check size={13} />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={13} />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>
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
