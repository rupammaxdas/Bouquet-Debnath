/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, 
  Search, 
  Menu, 
  X, 
  Heart, 
  Package, 
  User as UserIcon,
  LogOut,
  Sparkles,
  Phone,
  Mail,
  ShieldCheck,
  ChevronDown
} from "lucide-react";
import { useState } from "react";
import { useWishlist } from "../lib/WishlistContext";
import { useCart } from "../lib/CartContext";
import { useAuth } from "../lib/AuthContext";
import { WishlistDrawer } from "./WishlistDrawer";

interface NavbarProps {
  onOpenOrders: () => void;
  onOpenAuth: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onSelectCategory?: (category: string) => void;
  activePage?: "bouquets" | "cakes";
  onNavigate?: (page: "bouquets" | "cakes") => void;
  onOpenContact?: () => void;
}

export function Navbar({ 
  onOpenOrders, 
  onOpenAuth, 
  searchQuery, 
  setSearchQuery, 
  onSelectCategory,
  activePage = "bouquets",
  onNavigate,
  onOpenContact
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const { user, signOutUser } = useAuth();
  const { wishlist } = useWishlist();
  const { cartCount, setIsCartOpen, subtotal } = useCart();

  const handleNavClick = (e: React.MouseEvent, item: { label: string; href: string; page?: "bouquets" | "cakes" }) => {
    if (item.label === "Contact Us" || item.href === "#contact") {
      e.preventDefault();
      if (onOpenContact) {
        onOpenContact();
        setIsMobileMenuOpen(false);
        return;
      }
    }

    if (item.page) {
      e.preventDefault();
      if (onNavigate) {
        onNavigate(item.page);
        setIsMobileMenuOpen(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    if (activePage === "cakes" && onNavigate) {
      onNavigate("bouquets");
    }
    setIsMobileMenuOpen(false);
  };

  const navTabs = [
    { label: "Home", href: "#home", page: "bouquets" as const, icon: "🏠" },
    { label: "Flower Bouquets", href: "#collection", page: "bouquets" as const, icon: "💐" },
    { label: "Gourmet Cakes (30 Flavours)", href: "#cakes", page: "cakes" as const, icon: "🎂" },
    { label: "Bespoke Atelier Builder", href: "#bespoke", icon: "✨" },
    { label: "Special Offers", href: "#offers", icon: "⭐" },
    { label: "Founder's Story", href: "#ourstory", icon: "📖" },
    { label: "Contact Us", href: "#contact", icon: "📞" },
  ];

  return (
    <>
      {/* 1. Top Utility Bar (White/Grey Strip) */}
      <div className="bg-slate-100 border-b border-slate-300 text-slate-600 text-[11px] px-4 py-1.5 font-sans">
        <div className="max-w-[1240px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-blue-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Official Boutique & Patisserie Portal</span>
            </span>
            <span className="hidden sm:inline text-slate-300">|</span>
            <span className="hidden sm:inline">
              Curated under the creative direction of <strong>Rupam Max Das</strong> • Est. 2026
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden md:flex items-center gap-1 text-slate-500">
              <Mail size={12} className="text-blue-600" />
              <span className="font-mono">rupammaxdas@gmail.com</span>
            </span>
            <span className="text-slate-300 hidden md:inline">|</span>
            {user ? (
              <span className="text-slate-700 font-semibold truncate max-w-[140px]">
                Hello, {user.displayName || "Member"}
              </span>
            ) : (
              <button 
                onClick={onOpenAuth}
                className="text-blue-700 hover:text-blue-900 font-bold hover:underline"
              >
                Sign In / Register
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Gradient Header (Deep Royal Navy Blue) */}
      <header className="bg-gradient-to-r from-slate-950 via-blue-900 to-indigo-950 text-white border-b-2 border-blue-600 shadow-md">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Brand Logo & Title */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              if (onNavigate) onNavigate("bouquets");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center gap-3.5 group cursor-pointer text-left self-start md:self-auto"
          >
            <div className="w-11 h-11 rounded bg-gradient-to-b from-sky-400 to-blue-700 border border-sky-300 text-white flex items-center justify-center text-xl font-bold shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_2px_4px_rgba(0,0,0,0.3)] group-hover:scale-105 transition-transform">
              GHW
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-white group-hover:text-sky-300 transition-colors">
                  Gift Hub World
                </span>
                <span className="text-amber-400 text-xl font-serif">.</span>
              </div>
              <span className="text-[10px] sm:text-[11px] font-sans uppercase tracking-widest text-sky-200/90 block -mt-1 font-medium">
                Luxury Flower Boutique & Cake Patisserie
              </span>
            </div>
          </a>

          {/* Center: Search Box */}
          <div className="w-full md:w-auto md:flex-1 md:max-w-md mx-auto">
            <div className="flex items-center rounded overflow-hidden shadow-inner border border-blue-950 bg-white">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search 19 bouquets or 30 cake flavours..."
                  className="w-full px-3.5 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
              <button
                type="button"
                className="glossy-btn-blue px-4 py-2 text-xs rounded-none border-l border-blue-800 flex items-center gap-1.5"
                title="Search"
              >
                <Search size={14} />
                <span className="hidden sm:inline">Search</span>
              </button>
            </div>
          </div>

          {/* Right: Quick Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3 self-end md:self-auto">
            
            {/* Track Orders Button */}
            <button
              type="button"
              onClick={onOpenOrders}
              className="glossy-btn-grey px-2.5 sm:px-3 py-1.5 rounded text-xs flex items-center gap-1.5"
              title="Track Orders"
            >
              <Package size={14} className="text-blue-700" />
              <span className="hidden sm:inline">Track Orders</span>
            </button>

            {/* Wishlist Button */}
            <button
              type="button"
              onClick={() => setIsWishlistOpen(true)}
              className="glossy-btn-grey px-2.5 sm:px-3 py-1.5 rounded text-xs flex items-center gap-1.5 relative"
              title="Wishlist"
            >
              <Heart size={14} className={wishlist.length > 0 ? "fill-rose-500 text-rose-500" : "text-slate-600"} />
              <span className="hidden sm:inline">Wishlist</span>
              {wishlist.length > 0 && (
                <span className="bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full font-mono">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Cart Button (Glossy Gold Accent) */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="glossy-btn-gold px-3.5 py-1.5 rounded text-xs flex items-center gap-2"
              title="Shopping Cart"
            >
              <ShoppingBag size={15} />
              <div className="flex items-center gap-1">
                <span>Cart</span>
                <span className="bg-slate-900 text-amber-300 text-[10px] font-extrabold px-1.5 py-0.2 rounded font-mono">
                  {cartCount}
                </span>
              </div>
            </button>

            {/* User Account / Auth Button */}
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="w-8 h-8 rounded border border-blue-400 bg-white/10 text-white flex items-center justify-center font-bold text-xs uppercase"
                  title={user.displayName || user.email || "Account"}
                >
                  {(user.displayName || user.email || "U")[0]}
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-1.5 w-52 bg-white rounded-md shadow-xl border border-slate-300 py-1.5 z-50 text-xs text-slate-800">
                    <div className="px-3.5 py-2 border-b border-slate-200 bg-slate-50">
                      <p className="font-bold text-slate-900 truncate">{user.displayName || "Valued Client"}</p>
                      <p className="text-[10px] text-slate-500 truncate font-mono">{user.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onOpenOrders();
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-100 flex items-center gap-2 text-slate-700"
                    >
                      <Package size={13} className="text-blue-700" />
                      <span>My Past Orders</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        signOutUser();
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-rose-50 text-rose-600 flex items-center gap-2 border-t border-slate-100"
                    >
                      <LogOut size={13} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenAuth}
                className="glossy-btn-blue px-3 py-1.5 rounded text-xs hidden sm:flex items-center gap-1"
                title="Account"
              >
                <UserIcon size={13} />
                <span>Login</span>
              </button>
            )}

            {/* Mobile Menu Trigger */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-1.5 rounded border border-blue-400/50 text-white hover:bg-blue-800"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>
      </header>

      {/* 3. Gradient Navigation Bar (Classic Tabbed Bar) */}
      <nav 
        className="bg-gradient-to-b from-blue-700 via-blue-800 to-blue-900 text-white border-y border-blue-950 shadow-inner sticky top-0 z-40"
        aria-label="Main Navigation Tabs"
      >
        <div className="max-w-[1240px] mx-auto flex items-center justify-between">
          
          {/* Desktop Navigation Tabs */}
          <div className="hidden lg:flex items-center divide-x divide-blue-900/80 border-l border-blue-900/80">
            {navTabs.map((tab) => {
              const isPageActive = tab.page ? activePage === tab.page : false;

              return (
                <a
                  key={tab.label}
                  href={tab.href}
                  onClick={(e) => handleNavClick(e, tab)}
                  className={`px-4 py-2.5 text-xs font-bold tracking-wide transition-all flex items-center gap-1.5 border-r border-blue-900/80 ${
                    isPageActive
                      ? "bg-gradient-to-b from-sky-400 via-blue-600 to-blue-700 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]"
                      : "text-blue-100 hover:text-white hover:bg-blue-600/60"
                  }`}
                >
                  <span className="text-sm">{tab.icon}</span>
                  <span>{tab.label}</span>
                </a>
              );
            })}
          </div>

          {/* Quick Hotline Pill on the Right */}
          <div className="hidden lg:flex items-center gap-3 pr-4 text-xs">
            <span className="text-[11px] text-sky-200 flex items-center gap-1">
              <ShieldCheck size={14} className="text-sky-300" />
              <span>100% Guaranteed Fresh Deliveries</span>
            </span>
          </div>

          {/* Mobile Tab Indicator */}
          <div className="lg:hidden flex items-center justify-between w-full px-4 py-2 text-xs">
            <span className="font-bold text-sky-200">
              Active: {activePage === "cakes" ? "🎂 Cake Patisserie" : "💐 Flower Bouquets"}
            </span>
            <button
              onClick={() => {
                if (onNavigate) onNavigate(activePage === "cakes" ? "bouquets" : "cakes");
              }}
              className="text-[11px] text-amber-300 font-bold underline"
            >
              Switch to {activePage === "cakes" ? "Bouquets" : "Cakes"}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden bg-blue-950 border-t border-blue-900 overflow-hidden"
            >
              <div className="px-4 py-3 space-y-1">
                {navTabs.map((tab) => (
                  <a
                    key={tab.label}
                    href={tab.href}
                    onClick={(e) => handleNavClick(e, tab)}
                    className="block px-3 py-2 text-xs font-semibold text-blue-100 hover:bg-blue-900 rounded flex items-center gap-2"
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </a>
                ))}
                
                <div className="pt-2 border-t border-blue-900 mt-2 flex flex-col gap-2">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenOrders();
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-blue-200 hover:bg-blue-900 rounded flex items-center gap-2"
                  >
                    <Package size={14} />
                    <span>Track Your Orders</span>
                  </button>
                  {onOpenContact && (
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        onOpenContact();
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-amber-300 font-bold hover:bg-blue-900 rounded flex items-center gap-2"
                    >
                      <Mail size={14} />
                      <span>Contact Concierge Desk</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Wishlist Drawer */}
      <WishlistDrawer 
        isOpen={isWishlistOpen} 
        onClose={() => setIsWishlistOpen(false)} 
      />
    </>
  );
}
