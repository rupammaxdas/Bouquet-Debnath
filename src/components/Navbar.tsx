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
  Instagram,
  Facebook
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
}

export function Navbar({ onOpenOrders, onOpenAuth, searchQuery, setSearchQuery }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const { user, signOutUser } = useAuth();
  const { wishlist } = useWishlist();
  const { cartCount, setIsCartOpen } = useCart();

  return (
    <>
      {/* Top Luxury Announcement Bar */}
      <div className="bg-gradient-to-r from-[#101a4b] via-[#30206c] to-[#101a4b] text-center py-2 px-3 text-[11px] sm:text-xs font-semibold tracking-wider text-[#fff1d1] border-b border-white/10 z-50 relative">
        ✦ A LITTLE LUXURY FOR EVERY MOMENT &nbsp; · &nbsp; MAKE EVERY GIFT FEEL EXTRAORDINARY ✦
      </div>

      {/* Main Sticky Header */}
      <header className="sticky top-0 z-40 bg-[rgba(8,7,19,0.85)] backdrop-blur-xl border-b border-white/10 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
          
          {/* Brand Mark & Title */}
          <a href="#home" className="flex items-center gap-3 group focus:outline-none">
            <span className="w-11 h-11 rounded-2xl border border-[rgba(86,245,255,0.6)] bg-gradient-to-br from-[rgba(86,245,255,0.18)] to-[rgba(164,77,255,0.18)] text-[#38e8ff] flex items-center justify-center text-xl font-bold shadow-[0_0_25px_rgba(86,245,255,0.2)] group-hover:scale-105 transition-transform">
              ✧
            </span>
            <div>
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#f5f7ff] block group-hover:text-[#38e8ff] transition-colors leading-tight">
                Gift Hub World
              </span>
              <span className="text-[10px] font-semibold tracking-[0.22em] text-[#38e8ff] uppercase block -mt-0.5">
                Give beautifully
              </span>
            </div>
          </a>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#aab7d8]" aria-label="Main navigation">
            {[
              { label: "Home", href: "#home" },
              { label: "Categories", href: "#categories" },
              { label: "Shop Gifts", href: "#shop" },
              { label: "Bespoke", href: "#bespoke" },
              { label: "Our Story", href: "#story" },
              { label: "Contact", href: "#contact" }
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="hover:text-[#e4f7ff] transition-colors relative py-1 group tracking-wide text-xs sm:text-sm font-medium"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#38e8ff] to-[#ff39d4] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            
            {/* Live Search Toggle */}
            <div className="relative">
              {isSearchOpen ? (
                <div className="flex items-center bg-[#0d1430]/90 rounded-full px-3 py-1.5 border border-[#38e8ff]/50 w-40 sm:w-56 transition-all shadow-inner">
                  <Search size={14} className="text-[#38e8ff] shrink-0 mr-2" />
                  <input
                    type="text"
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search gifts..."
                    className="bg-transparent text-xs text-[#f5f7ff] placeholder-[#aab7d8]/60 focus:outline-none w-full"
                  />
                  <button 
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery("");
                    }} 
                    className="text-[#aab7d8] hover:text-[#38e8ff] ml-1 p-0.5"
                  >
                    <X size={13} />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setIsSearchOpen(true)}
                  className="w-10 h-10 rounded-xl border border-[rgba(75,142,255,0.28)] bg-white/[0.055] text-[#f5f7ff] hover:text-[#38e8ff] hover:border-[#38e8ff]/50 transition-all flex items-center justify-center"
                  aria-label="Search collection"
                  title="Search gifts"
                >
                  <Search size={17} />
                </button>
              )}
            </div>

            {/* Orders Tracking */}
            <button
              onClick={onOpenOrders}
              className="w-10 h-10 rounded-xl border border-[rgba(75,142,255,0.28)] bg-white/[0.055] text-[#f5f7ff] hover:text-[#38e8ff] hover:border-[#38e8ff]/50 transition-all flex items-center justify-center relative"
              aria-label="Track Orders"
              title="Track Orders"
            >
              <Package size={17} />
            </button>

            {/* Wishlist */}
            <button 
              onClick={() => setIsWishlistOpen(true)}
              className="w-10 h-10 rounded-xl border border-[rgba(75,142,255,0.28)] bg-white/[0.055] text-[#f5f7ff] hover:text-[#ff39d4] hover:border-[#ff39d4]/50 transition-all flex items-center justify-center relative"
              aria-label="Wishlist"
              title="Your Wishlist"
            >
              <Heart size={17} className={wishlist.length > 0 ? "fill-[#ff39d4] text-[#ff39d4]" : ""} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#ff39d4] text-white text-[9px] flex items-center justify-center rounded-full font-bold shadow-sm">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Cart Button */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="w-10 h-10 rounded-xl border border-[rgba(75,142,255,0.28)] bg-white/[0.055] text-[#f5f7ff] hover:text-[#38e8ff] hover:border-[#38e8ff]/50 transition-all flex items-center justify-center relative"
              aria-label="Open Shopping Cart"
              title="Shopping Cart"
            >
              <span className="text-base">♧</span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-[#38e8ff] to-[#745bff] text-[#06091b] text-[10px] font-extrabold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 shadow-[0_0_10px_rgba(56,232,255,0.4)]">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Profile */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="w-10 h-10 rounded-xl border border-[#38e8ff]/40 hover:border-[#38e8ff] transition-all flex items-center justify-center overflow-hidden"
                  title={`Signed in as ${user.displayName || user.email}`}
                >
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-[#38e8ff] to-[#745bff] text-[#06091b] flex items-center justify-center text-xs font-bold uppercase">
                      {(user.displayName || user.email || "U")[0]}
                    </div>
                  )}
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#0d1430] rounded-2xl shadow-2xl border border-[rgba(75,142,255,0.28)] py-2 z-50 text-xs text-[#f5f7ff]">
                    <div className="px-4 py-2 border-b border-white/10">
                      <p className="font-semibold text-[#f5f7ff] truncate">{user.displayName || "Customer"}</p>
                      <p className="text-[10px] text-[#aab7d8] truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onOpenOrders();
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-white/10 flex items-center gap-2"
                    >
                      <Package size={14} className="text-[#38e8ff]" /> My Orders
                    </button>
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        setIsWishlistOpen(true);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-white/10 flex items-center gap-2"
                    >
                      <Heart size={14} className="text-[#ff39d4]" /> My Wishlist
                    </button>
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        signOutUser();
                      }}
                      className="w-full px-4 py-2 text-left text-red-400 hover:bg-white/10 flex items-center gap-2"
                    >
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[rgba(86,245,255,0.45)] text-[#e4f7ff] bg-white/[0.035] hover:bg-white/10 text-xs font-semibold tracking-wide transition-all"
              >
                <UserIcon size={13} className="text-[#38e8ff]" />
                <span>Sign In</span>
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden w-10 h-10 rounded-xl border border-[rgba(75,142,255,0.28)] bg-white/[0.055] text-[#f5f7ff] hover:text-[#38e8ff] flex items-center justify-center"
              aria-label="Toggle navigation"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden px-6 py-5 bg-[#0d1430] border-t border-white/10 space-y-3.5"
            >
              {[
                { label: "Home", href: "#home" },
                { label: "Categories", href: "#categories" },
                { label: "Shop Gifts", href: "#shop" },
                { label: "Bespoke Builder", href: "#bespoke" },
                { label: "Our Story", href: "#story" },
                { label: "Contact", href: "#contact" }
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="block text-sm font-medium text-[#f5f7ff] hover:text-[#38e8ff] py-1 transition-colors"
                >
                  {item.label}
                </a>
              ))}

              <div className="pt-3 border-t border-white/10 flex flex-col gap-2.5">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onOpenOrders();
                  }}
                  className="flex items-center gap-2.5 text-xs text-[#aab7d8] hover:text-white py-1"
                >
                  <Package size={15} className="text-[#38e8ff]" />
                  <span>Track My Orders</span>
                </button>

                {!user ? (
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      onOpenAuth();
                    }}
                    className="flex items-center gap-2.5 text-xs text-[#aab7d8] hover:text-white py-1"
                  >
                    <UserIcon size={15} className="text-[#38e8ff]" />
                    <span>Sign In to Account</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      signOutUser();
                    }}
                    className="flex items-center gap-2.5 text-xs text-red-400 hover:text-red-300 py-1"
                  >
                    <LogOut size={15} />
                    <span>Sign Out</span>
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
      />
    </>
  );
}
