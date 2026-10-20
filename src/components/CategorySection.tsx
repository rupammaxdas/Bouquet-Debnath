/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export interface CategoryItem {
  id: string;
  name: string;
  tagline: string;
  count: number;
  image: string;
  categoryFilter: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    id: "roses",
    name: "Romantic & Roses",
    tagline: "Velvety Red Naomi & Damask Petals",
    count: 3,
    image: "./assets/images/bouquet_romantic_roses_1790272159677.jpg",
    categoryFilter: "Romantic & Roses"
  },
  {
    id: "celebrations",
    name: "Celebrations & Gifts",
    tagline: "Birthdays, Chocolates & Joyful Hampers",
    count: 5,
    image: "./assets/images/bouquet_surprise_gift_1791795336071.jpg",
    categoryFilter: "Celebrations & Gifts"
  },
  {
    id: "bespoke",
    name: "Handcrafted & Bespoke",
    tagline: "Custom Curations & Wild Garden Stems",
    count: 3,
    image: "./assets/images/bouquet_seasonal_wildflowers_1790272175129.jpg",
    categoryFilter: "Handcrafted & Bespoke"
  },
  {
    id: "bridal",
    name: "Weddings & Bridal",
    tagline: "David Austin Stems & Cascade Silk Ribbons",
    count: 2,
    image: "./assets/images/bouquet_bridal_1791794787656.jpg",
    categoryFilter: "Weddings & Bridal"
  },
  {
    id: "everlasting",
    name: "Everlasting & Crafts",
    tagline: "Archival Crepe Paper & Botanical Silk",
    count: 3,
    image: "./assets/images/bouquet_paper_1791794757056.jpg",
    categoryFilter: "Everlasting & Crafts"
  },
  {
    id: "luxury",
    name: "Luxury & Editorial",
    tagline: "Velvet Wraps & Rare Imported Blooms",
    count: 3,
    image: "./assets/images/hero_floral_bouquet_1790272143558.jpg",
    categoryFilter: "Luxury & Editorial"
  }
];

interface CategorySectionProps {
  onSelectCategory: (category: string) => void;
  selectedCategory?: string;
}

export function CategorySection({ onSelectCategory, selectedCategory }: CategorySectionProps) {
  const handleClick = (catFilter: string) => {
    onSelectCategory(catFilter);
    const collectionElem = document.getElementById("collection");
    if (collectionElem) {
      collectionElem.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="categories" className="py-16 sm:py-20 bg-gradient-to-b from-white/80 via-sky-50/50 to-sky-100/30 border-b border-sky-100/70">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 sm:mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-px bg-sky-600" />
              <span className="text-xs font-semibold tracking-widest text-sky-800 uppercase">
                Curated Departments
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-medium text-stone-900 tracking-tight">
              Explore by Category
            </h2>
            <p className="text-stone-500 text-xs sm:text-sm mt-2 max-w-xl">
              Clean, artisan collections tailored for romantic expressions, life celebrations, bespoke surprises, and timeless botanical memories.
            </p>
          </div>

          <button
            onClick={() => handleClick("All")}
            className="self-start md:self-auto text-xs font-semibold tracking-wider uppercase text-sky-700 hover:text-sky-900 flex items-center gap-1.5 transition-colors py-2"
          >
            <span>View All Arrangements</span>
            <ArrowUpRight size={15} />
          </button>
        </div>

        {/* Clean White Cards with Rounded Corners & Subtle Shadows */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {CATEGORIES.map((cat, index) => {
            const isSelected = selectedCategory === cat.categoryFilter;

            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleClick(cat.categoryFilter)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleClick(cat.categoryFilter);
                  }
                }}
                className={`bg-white/95 backdrop-blur-xs rounded-2xl sm:rounded-3xl p-4 sm:p-5 border transition-all duration-300 cursor-pointer group flex flex-col justify-between ${
                  isSelected 
                    ? "border-sky-600 shadow-md ring-2 ring-sky-500/20" 
                    : "border-sky-100/80 shadow-sm hover:shadow-md hover:border-sky-300"
                }`}
              >
                {/* Image Frame */}
                <div className="relative aspect-[16/10] overflow-hidden rounded-xl sm:rounded-2xl bg-stone-100 mb-4">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-stone-900/5 group-hover:bg-stone-900/0 transition-colors" />
                  
                  {/* Item Count Chip */}
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-stone-800 text-[10px] font-mono font-bold tracking-wider shadow-xs">
                    {cat.count} Designs
                  </span>
                </div>

                {/* Card Content */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  <div>
                    <h3 className="font-display text-lg sm:text-xl font-semibold text-stone-900 group-hover:text-purple-900 transition-colors leading-snug">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-stone-500 mt-1 line-clamp-1">
                      {cat.tagline}
                    </p>
                  </div>

                  <div className="w-9 h-9 shrink-0 rounded-full bg-stone-50 border border-stone-200 flex items-center justify-center text-stone-600 group-hover:bg-purple-900 group-hover:text-white group-hover:border-purple-900 transition-all duration-300">
                    <ArrowUpRight size={16} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
