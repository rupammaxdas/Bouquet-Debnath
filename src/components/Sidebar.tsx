/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  FolderTree, 
  Sparkles, 
  Cake, 
  Mail, 
  ShieldCheck, 
  Truck, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  Filter,
  DollarSign,
  HeartHandshake
} from "lucide-react";

interface SidebarProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  activePage: "bouquets" | "cakes";
  onNavigate: (page: "bouquets" | "cakes") => void;
  onOpenContact?: () => void;
  priceFilter?: string;
  onSelectPriceFilter?: (filter: string) => void;
}

const CATEGORIES_LIST = [
  { name: "All", label: "All Floral Arrangements", count: 19 },
  { name: "Romantic & Roses", label: "Romantic & Roses", count: 4 },
  { name: "Celebrations & Gifts", label: "Celebrations & Gifts", count: 5 },
  { name: "Handcrafted & Bespoke", label: "Handcrafted & Bespoke", count: 3 },
  { name: "Weddings & Bridal", label: "Weddings & Bridal", count: 2 },
  { name: "Everlasting & Crafts", label: "Everlasting & Crafts", count: 2 },
  { name: "DIY & Workshops", label: "DIY & Workshops", count: 2 },
  { name: "Luxury & Editorial", label: "Luxury & Editorial", count: 1 },
];

const PRICE_RANGES = [
  { id: "all", label: "All Prices" },
  { id: "under-1200", label: "Under ₹1,200" },
  { id: "1200-1500", label: "₹1,200 – ₹1,500" },
  { id: "above-1500", label: "Above ₹1,500" },
];

export function Sidebar({
  selectedCategory,
  onSelectCategory,
  activePage,
  onNavigate,
  onOpenContact,
  priceFilter = "all",
  onSelectPriceFilter
}: SidebarProps) {
  return (
    <aside className="w-full lg:w-72 shrink-0 space-y-5 font-sans">
      
      {/* Box 1: Departments & Categories */}
      <div className="box-panel">
        <div className="box-header-gradient flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <FolderTree size={15} className="text-sky-300" />
            <span className="uppercase tracking-wider">Floral Categories</span>
          </div>
          <span className="text-[10px] bg-blue-950/80 text-sky-200 px-1.5 py-0.5 rounded border border-blue-800 font-mono">
            {CATEGORIES_LIST.length}
          </span>
        </div>

        <nav className="p-2 divide-y divide-slate-100 bg-white">
          {CATEGORIES_LIST.map((cat) => {
            const isActive = activePage === "bouquets" && selectedCategory === cat.name;
            return (
              <button
                key={cat.name}
                type="button"
                onClick={() => {
                  if (activePage !== "bouquets") {
                    onNavigate("bouquets");
                  }
                  onSelectCategory(cat.name);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded transition-all text-left ${
                  isActive
                    ? "bg-gradient-to-r from-blue-700 to-blue-800 text-white font-bold shadow-xs"
                    : "text-slate-700 hover:bg-slate-100 hover:text-blue-900"
                }`}
              >
                <span className="flex items-center gap-2 truncate">
                  <ChevronRight size={13} className={isActive ? "text-sky-300" : "text-slate-400"} />
                  <span className="truncate">{cat.label}</span>
                </span>
                <span 
                  className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                    isActive ? "bg-blue-900 text-sky-200" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Box 2: Cake Patisserie Fast Link */}
      <div className="box-panel border-blue-300">
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 text-white p-3 border-b border-blue-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cake size={16} className="text-amber-400" />
            <span className="font-bold text-xs uppercase tracking-wide">Cake Patisserie</span>
          </div>
          <span className="text-[10px] bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded font-extrabold uppercase">
            30 Flavours
          </span>
        </div>

        <div className="p-3.5 bg-gradient-to-b from-blue-50/50 to-white space-y-3">
          <p className="text-xs text-slate-600 leading-relaxed">
            Authentic Indian bakery flavours including Rasmalai, Black Forest, Butterscotch, Kesar Pista, and 100% Eggless options.
          </p>
          
          <button
            type="button"
            onClick={() => onNavigate("cakes")}
            className="w-full py-2 px-3 rounded glossy-btn-gold text-xs flex items-center justify-center gap-2"
          >
            <span>Explore 30 Cake Flavours</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Box 3: Price Filter */}
      {onSelectPriceFilter && (
        <div className="box-panel">
          <div className="box-header-gradient flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-sky-300" />
              <span className="uppercase tracking-wider">Quick Price Filter</span>
            </div>
          </div>

          <div className="p-2 space-y-1 bg-white">
            {PRICE_RANGES.map((range) => {
              const isSelected = priceFilter === range.id;
              return (
                <button
                  key={range.id}
                  type="button"
                  onClick={() => onSelectPriceFilter(range.id)}
                  className={`w-full flex items-center justify-between px-3 py-1.5 text-xs rounded transition-all text-left ${
                    isSelected
                      ? "bg-slate-200 text-blue-900 font-bold border border-slate-300"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${isSelected ? "bg-blue-600" : "bg-slate-300"}`} />
                    <span>{range.label}</span>
                  </span>
                  {isSelected && <CheckCircle2 size={12} className="text-blue-700" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Box 4: Atelier Founder & Assistance */}
      <div className="box-panel">
        <div className="box-header-gradient flex items-center gap-2 text-xs">
          <Sparkles size={14} className="text-amber-400" />
          <span className="uppercase tracking-wider">Boutique Concierge</span>
        </div>

        <div className="p-3.5 space-y-3 bg-white text-xs">
          <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-500 block font-mono">
              Creative Director
            </span>
            <strong className="text-slate-900 text-xs sm:text-sm block">
              Rupam Max Das
            </strong>
            <span className="text-[11px] text-slate-500">
              Gift Hub World • Est. 2026
            </span>
          </div>

          <div className="space-y-1.5 text-[11px] text-slate-600">
            <div className="flex items-center gap-2">
              <Mail size={13} className="text-blue-600 shrink-0" />
              <span className="truncate font-mono">rupammaxdas@gmail.com</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={13} className="text-blue-600 shrink-0" />
              <span>9:00 AM – 10:00 PM IST</span>
            </div>
          </div>

          {onOpenContact && (
            <button
              type="button"
              onClick={onOpenContact}
              className="w-full py-2 px-3 rounded glossy-btn-blue text-xs flex items-center justify-center gap-1.5"
            >
              <span>Contact Concierge Desk</span>
            </button>
          )}
        </div>
      </div>

      {/* Box 5: Traditional Guarantees */}
      <div className="box-panel">
        <div className="bg-slate-100 border-b border-slate-300 px-3.5 py-2 text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
          <ShieldCheck size={15} className="text-blue-700" />
          <span>Shopping Guarantees</span>
        </div>

        <div className="p-3 space-y-2.5 text-xs text-slate-600 bg-white">
          <div className="flex items-start gap-2">
            <Truck size={14} className="text-blue-600 mt-0.5 shrink-0" />
            <div>
              <strong className="text-slate-800 block text-[11px]">Same-Day Express Dispatch</strong>
              <span className="text-[10px] text-slate-500">Orders placed before 4 PM delivered same day</span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Sparkles size={14} className="text-amber-500 mt-0.5 shrink-0" />
            <div>
              <strong className="text-slate-800 block text-[11px]">100% Farm-Fresh Blooms</strong>
              <span className="text-[10px] text-slate-500">Cold-chain transported & hand-tied</span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <HeartHandshake size={14} className="text-emerald-600 mt-0.5 shrink-0" />
            <div>
              <strong className="text-slate-800 block text-[11px]">Secure Checkout Protection</strong>
              <span className="text-[10px] text-slate-500">Encrypted transactions & order tracking</span>
            </div>
          </div>
        </div>
      </div>

    </aside>
  );
}
