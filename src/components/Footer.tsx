/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Instagram, Facebook, Sparkles, Send, Palette, MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import { useState } from "react";
import { useTheme } from "../lib/ThemeContext";

interface FooterProps {
  onOpenContact?: () => void;
}

export function Footer({ onOpenContact }: FooterProps) {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { currentTheme, setIsThemeModalOpen } = useTheme();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setTimeout(() => {
        setEmail("");
      }, 2000);
    }
  };

  return (
    <footer 
      className="text-white py-16 sm:py-20 border-t border-purple-950 transition-colors"
      style={{ backgroundColor: currentTheme.footerBg }}
    >
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-16">
          
          {/* Column 1: Brand & Founder */}
          <div className="space-y-5">
            <div>
              <div className="flex items-baseline gap-1.5">
                <h3 className="text-white text-2xl sm:text-3xl font-display font-semibold tracking-tight">
                  Gift Hub World
                </h3>
                <span className="text-amber-400 text-2xl font-serif">.</span>
              </div>
              <p className="hidden" aria-hidden="true">
                FOUNDER & CREATIVE DIRECTOR: <strong className="text-amber-300 font-bold">RUPAM MAX DAS</strong>
              </p>
            </div>
            
            <p className="text-xs sm:text-sm leading-relaxed max-w-xs text-purple-100/85">
              Handcrafting botanical elegance under the creative direction of Rupam Max Das since 2026. Bespoke floral arrangements and luxury gifts for those who appreciate the finer details of nature.
            </p>

            <div className="hidden" aria-hidden="true">
              <a 
                href="https://www.instagram.com/rupammaxdas" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hidden"
                aria-hidden="true"
                title="Instagram @rupammaxdas"
              >
                <Instagram size={17} />
              </a>
              <a 
                href="https://www.facebook.com/share/1YFvXyHpju/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hidden"
                aria-hidden="true"
                title="Facebook Profile"
              >
                <Facebook size={17} />
              </a>
            </div>
          </div>

          {/* Column 2: Curated Collections (Gold Links) */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Catalog Collections</span>
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm">
              <li>
                <a href="#cakes" className="text-amber-400 hover:text-amber-300 transition-colors font-medium flex items-center gap-1.5">
                  <span>🎂 Gourmet Celebration Cakes</span>
                  <span className="text-[9px] uppercase px-1.5 py-0.2 rounded-full bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30">
                    New
                  </span>
                </a>
              </li>
              <li>
                <a href="#collection" className="text-amber-400 hover:text-amber-300 transition-colors font-medium">
                  Romantic & Rose Bouquets
                </a>
              </li>
              <li>
                <a href="#collection" className="text-amber-400 hover:text-amber-300 transition-colors font-medium">
                  Handmade Seasonal Wildflowers
                </a>
              </li>
              <li>
                <a href="#collection" className="text-amber-400 hover:text-amber-300 transition-colors font-medium">
                  Celebration & Birthday Stems
                </a>
              </li>
              <li>
                <a href="#collection" className="text-amber-400 hover:text-amber-300 transition-colors font-medium">
                  Everlasting Paper & Silk Crafts
                </a>
              </li>
              <li>
                <a href="#collection" className="text-amber-400 hover:text-amber-300 transition-colors font-medium">
                  Money & Chocolate Arrangements
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Atelier Concierge (Gold Links) */}
          <div id="contact">
            <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Contact Us</span>
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm">
              <li className="hidden">
                <button 
                  onClick={onOpenContact}
                  className="hidden"
                  aria-hidden="true"
                >
                  <MapPin size={14} className="text-amber-400 shrink-0" />
                  <span>Address: G.S. Road, Guwahati</span>
                </button>
              </li>
              <li>
                <a 
                  href="tel:+919876543249" 
                  className="text-amber-400 hover:text-amber-300 transition-colors font-medium flex items-center gap-2"
                >
                  <Phone size={14} className="text-amber-400 shrink-0" />
                  <span>Phone: +91 XXXXX XXX49</span>
                </a>
              </li>
              <li>
                <a 
                  href="mailto:rupammaxdas@gmail.com" 
                  className="text-amber-400 hover:text-amber-300 transition-colors font-medium flex items-center gap-2"
                >
                  <Mail size={14} className="text-amber-400 shrink-0" />
                  <span>Email: rupammaxdas@gmail.com</span>
                </a>
              </li>
              <li className="hidden">
                <a 
                  href="https://wa.me/919876543249?text=Hello%20Gift%20Hub%20World!%20I%20would%20like%20to%20inquire%20about%20a%20bouquet%20or%20cake."
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hidden"
                  aria-hidden="true"
                >
                  <MessageCircle size={14} className="text-emerald-400 shrink-0" />
                  <span>WhatsApp: Chat with us directly</span>
                </a>
              </li>
              <li>
                <a href="#offers" className="text-amber-400 hover:text-amber-300 transition-colors font-medium">
                  Promotions & Privileges
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: The Bloom Journal */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>The Bloom Journal</span>
            </h4>
            <p className="text-xs sm:text-sm mb-5 text-purple-100/85 leading-relaxed">
              Receive secret seasonal bouquet releases, masterclasses, and floral care guides directly from Rupam's desk.
            </p>
            
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative">
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email..."
                  className="w-full bg-purple-950/70 border border-purple-800/80 rounded-xl px-4 py-3 text-xs text-white placeholder-purple-300/60 focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>
              <button 
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 text-purple-950 font-bold text-xs uppercase tracking-wider hover:from-amber-300 hover:to-yellow-400 transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-95"
              >
                {isSubscribed ? (
                  <span>✓ Subscribed to Journal</span>
                ) : (
                  <>
                    <span>Join Atelier List</span>
                    <Send size={13} />
                  </>
                )}
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Legal (White text & Gold Links) */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-purple-900/60 text-[10px] uppercase tracking-widest text-purple-200/90 font-medium">
          <p>© 2026 GIFT HUB WORLD FLOWER BOUTIQUE • FOUNDED & OWNED BY RUPAM MAX DAS. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-6 sm:gap-8">
            <a href="#collection" className="text-amber-400 hover:text-amber-300 transition-colors">
              Privacy Policy
            </a>
            <a href="#collection" className="text-amber-400 hover:text-amber-300 transition-colors">
              Terms of Service
            </a>
            <a href="#collection" className="text-amber-400 hover:text-amber-300 transition-colors">
              Security & Guarantees
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
