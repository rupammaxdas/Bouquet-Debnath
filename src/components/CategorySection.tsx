/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "framer-motion";
import { FolderTree, ArrowRight, ChevronRight } from "lucide-react";

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
    count: 4,
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
    count: 2,
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
    <section id="categories" className="box-panel mb-6 font-sans">
      {/* Box Header */}
      <div className="box-header-gradient flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <FolderTree size={15} className="text-sky-300" />
          <span className="uppercase tracking-wider">Featured Floral Departments</span>
        </div>
        <button
          type="button"
          onClick={() => handleClick("All")}
          className="text-sky-200 hover:text-white flex items-center gap-1 font-semibold underline text-[11px]"
        >
          <span>View All 19 Designs</span>
          <ArrowRight size={12} />
        </button>
      </div>

      {/* Box Body */}
      <div className="p-4 sm:p-5 bg-white">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.categoryFilter;

            return (
              <div
                key={cat.id}
                onClick={() => handleClick(cat.categoryFilter)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleClick(cat.categoryFilter);
                  }
                }}
                className={`border rounded p-3 bg-white transition-all cursor-pointer flex flex-col justify-between group ${
                  isSelected 
                    ? "border-blue-600 bg-blue-50/40 shadow-xs" 
                    : "border-slate-200 hover:border-blue-400 hover:shadow-xs"
                }`}
              >
                {/* Photo */}
                <div className="relative aspect-[16/10] overflow-hidden rounded bg-slate-100 mb-2.5 border border-slate-200">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-slate-900/80 text-white text-[10px] font-mono font-bold">
                    {cat.count} Items
                  </span>
                </div>

                {/* Details */}
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-blue-700 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 line-clamp-1">
                      {cat.tagline}
                    </p>
                  </div>
                  <div className="w-6 h-6 rounded glossy-icon-box flex items-center justify-center shrink-0">
                    <ChevronRight size={13} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
