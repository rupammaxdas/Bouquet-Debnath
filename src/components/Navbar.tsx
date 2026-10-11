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
  Instagram, 
  Facebook, 
  Package, 
  User as UserIcon,
  LogOut
} from "lucide-react";
import { useState, useEffect } from "react";
import { useWishlist } from "../lib/WishlistContext";
import { useCart } from "../lib/CartContext";
import { auth, login, logout } from "../lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { WishlistDrawer } from "./WishlistDrawer";

interface NavbarProps {
  onOpenOrders: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export function Navbar({ onOpenOrders, searchQuery, setSearchQuery }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const { wishlist } = useWishlist();
  const { cartCount, setIsCartOpen } = useCart();

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-100 transition-all">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-4">
        
        {/* Zone 1: Brand */}
        <div className="flex items-center gap-6">
          <a href="/" className="text-2xl font-display font-semibold tracking-tight text-stone-900">
            Debnath
          </a>

          {/* Social Profiles Quick Icons */}
          <div className="hidden xl:flex items-center gap-2 pl-4 border-l border-stone-200">
            <a
              href="https://www.instagram.com/trisha_dbnth?stkn=MTMyZWl2OXVjNmVqdg=="
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram Profile @trisha_dbnth"
              title="Instagram @trisha_dbnth"
              className="text-stone-400 hover:text-stone-900 transition-colors p-1"
            >
              <Instagram size={17} />
            </a>
            <a
              href="https://www.facebook.com/share/1YFvXyHpju/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook Profile"
              title="Facebook Profile"
              className="text-stone-400 hover:text-stone-900 transition-colors p-1"
            >
              <Facebook size={17} />
            </a>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
          {["Collection", "Bespoke", "Our Story"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(' ', '')}`}
              className="hover:text-stone-900 transition-colors relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-stone-900 transition-all group-hover:w-full" />
            </a>
          ))}
        </div>

        {/* Zone 3: Actions (Search, Wishlist, Orders, Cart, Auth) */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Live Search Bar Toggle */}
          <div className="relative">
            {isSearchOpen ? (
              <div className="flex items-center bg-stone-100 rounded-full px-3 py-1.5 border border-stone-200 w-44 sm:w-56 transition-all">
                <Search size={15} className="text-stone-400 shrink-0 mr-2" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search bouquets..."
                  className="bg-transparent text-xs text-stone-800 focus:outline-none w-full"
                />
                <button 
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery("");
                  }} 
                  className="text-stone-400 hover:text-stone-700 ml-1"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="text-stone-600 hover:text-stone-900 transition-colors p-2 rounded-full hover:bg-stone-100"
                aria-label="Search collection"
                title="Search collection"
              >
                <Search size={19} />
              </button>
            )}
          </div>

          {/* Orders Tracking Button */}
          <button
            onClick={onOpenOrders}
            className="text-stone-600 hover:text-stone-900 transition-colors p-2 rounded-full hover:bg-stone-100 relative"
            aria-label="My Orders"
            title="Track My Orders"
          >
            <Package size={20} />
          </button>

          {/* Wishlist Button */}
          <button 
            onClick={() => setIsWishlistOpen(true)}
            className="text-stone-600 hover:text-stone-900 transition-colors relative p-2 rounded-full hover:bg-stone-100"
            aria-label="Wishlist"
            title="Your Wishlist"
          >
            <Heart size={20} className={wishlist.length > 0 ? "fill-stone-900 text-stone-900" : ""} />
            {wishlist.length > 0 && (
              <span className="absolute 1 top-1 right-1 w-4 h-4 bg-stone-900 text-white text-[9px] flex items-center justify-center rounded-full font-bold">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Shopping Bag Button */}
          <button 
            onClick={() => setIsCartOpen(true)}
            className="text-stone-600 hover:text-stone-900 transition-colors relative p-2 rounded-full hover:bg-stone-100"
            aria-label="Shopping Bag"
            title="Open Shopping Bag"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute 1 top-1 right-1 w-4 h-4 bg-emerald-700 text-white text-[9px] flex items-center justify-center rounded-full font-bold font-mono">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Account / Sign In */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-1.5 p-1 rounded-full border border-stone-200 hover:border-stone-400 transition-all"
                title={`Signed in as ${user.displayName || user.email}`}
              >
                {user.photoURL ? (
                  <img src={user.photoURL} alt="" className="w-7 h-7 rounded-full object-cover" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs font-bold uppercase">
                    {(user.displayName || user.email || "U")[0]}
                  </div>
                )}
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-stone-100 py-2 z-50 text-xs">
                  <div className="px-4 py-2 border-b border-stone-100">
                    <p className="font-semibold text-stone-900 truncate">{user.displayName || "Customer"}</p>
                    <p className="text-[10px] text-stone-400 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onOpenOrders();
                    }}
                    className="w-full px-4 py-2 text-left text-stone-700 hover:bg-stone-50 flex items-center gap-2"
                  >
                    <Package size={14} /> My Orders
                  </button>
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      setIsWishlistOpen(true);
                    }}
                    className="w-full px-4 py-2 text-left text-stone-700 hover:bg-stone-50 flex items-center gap-2"
                  >
                    <Heart size={14} /> My Wishlist
                  </button>
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      logout();
                    }}
                    className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-stone-100"
                  >
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={login}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-stone-300 text-stone-800 text-xs font-medium hover:border-stone-900 transition-colors"
            >
              <UserIcon size={14} />
              <span>Sign In</span>
            </button>
          )}

          {/* Mobile Menu Hamburger */}
          <button 
            className="md:hidden text-stone-900 p-1"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Navigation"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <WishlistDrawer isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white border-b border-stone-100 px-6 py-8 flex flex-col gap-6"
        >
          {["Collection", "Bespoke", "Our Story"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-lg font-medium text-stone-900"
              onClick={() => setIsOpen(false)}
            >
              {item}
            </a>
          ))}

          <div className="pt-4 border-t border-stone-100 flex flex-col gap-3">
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenOrders();
              }}
              className="flex items-center gap-2 text-sm font-medium text-stone-800"
            >
              <Package size={18} />
              <span>Track My Orders</span>
            </button>

            {!user ? (
              <button
                onClick={() => {
                  setIsOpen(false);
                  login();
                }}
                className="flex items-center gap-2 text-sm font-medium text-stone-800"
              >
                <UserIcon size={18} />
                <span>Sign In with Google</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsOpen(false);
                  logout();
                }}
                className="flex items-center gap-2 text-sm font-medium text-red-600"
              >
                <LogOut size={18} />
                <span>Sign Out ({user.displayName || user.email})</span>
              </button>
            )}
          </div>

          <div className="pt-4 border-t border-stone-100 flex flex-col gap-3">
            <span className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold">Follow & Connect</span>
            <div className="flex flex-col gap-2.5">
              <a
                href="https://www.facebook.com/share/1YFvXyHpju/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-sm font-medium text-stone-700 hover:text-stone-900"
              >
                <Facebook size={18} className="text-blue-600" />
                <span>Facebook Profile</span>
              </a>
              <a
                href="https://www.instagram.com/trisha_dbnth?stkn=MTMyZWl2OXVjNmVqdg=="
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-sm font-medium text-stone-700 hover:text-stone-900"
              >
                <Instagram size={18} className="text-pink-600" />
                <span>@trisha_dbnth</span>
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
}
