/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Settings } from "lucide-react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { ProductGrid } from "./components/ProductGrid";
import { BouquetBuilder } from "./components/BouquetBuilder";
import { Story } from "./components/Story";
import { SocialShowcase } from "./components/SocialShowcase";
import { Footer } from "./components/Footer";
import { AdminPanel } from "./components/AdminPanel";
import { CartDrawer } from "./components/CartDrawer";
import { CheckoutModal } from "./components/CheckoutModal";
import { OrdersModal } from "./components/OrdersModal";
import { AuthModal } from "./components/AuthModal";
import { AuthProvider } from "./lib/AuthContext";
import { WishlistProvider } from "./lib/WishlistContext";
import { CartProvider } from "./lib/CartContext";

export default function App() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [highlightOrderId, setHighlightOrderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleOrderSuccess = (orderId: string) => {
    setHighlightOrderId(orderId);
    setIsOrdersOpen(true);
  };

  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <div className="min-h-screen bg-white font-sans text-stone-900 selection:bg-stone-200">
          <Navbar 
            onOpenOrders={() => setIsOrdersOpen(true)}
            onOpenAuth={() => setIsAuthOpen(true)}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <main>
            <Hero />
            <ProductGrid searchQuery={searchQuery} />
            <BouquetBuilder />
            <Story />
            <SocialShowcase />
          </main>
          <Footer />

          {/* E-Commerce Drawers & Modals */}
          <CartDrawer onCheckout={() => setIsCheckoutOpen(true)} />
          
          <CheckoutModal
            isOpen={isCheckoutOpen}
            onClose={() => setIsCheckoutOpen(false)}
            onOrderSuccess={handleOrderSuccess}
          />

          <OrdersModal
            isOpen={isOrdersOpen}
            onClose={() => setIsOrdersOpen(false)}
            highlightOrderId={highlightOrderId}
            onOpenAuth={() => setIsAuthOpen(true)}
          />

          <AuthModal
            isOpen={isAuthOpen}
            onClose={() => setIsAuthOpen(false)}
          />

          {/* Admin Toggle (Hidden per user focus request) */}
          <button 
            onClick={() => setIsAdminOpen(true)}
            className="hidden"
            title="Admin Panel"
            aria-label="Admin Studio Panel"
          >
            <Settings size={20} className="text-stone-400 group-hover:text-stone-900 transition-colors" />
          </button>

          {isAdminOpen && <AdminPanel onClose={() => setIsAdminOpen(false)} />}
        </div>
      </CartProvider>
    </WishlistProvider>
    </AuthProvider>
  );
}
