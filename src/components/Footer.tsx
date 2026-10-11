/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Instagram, Twitter, Facebook } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300 py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div className="space-y-6">
            <div>
              <h3 className="text-white text-2xl font-display font-semibold tracking-tight">
                Debnath
              </h3>
              <p className="text-[11px] text-stone-400 font-medium tracking-wider uppercase mt-1">
                Owner & Founder: <strong className="text-stone-200">Trisha Debnath</strong>
              </p>
            </div>
            <p className="text-sm leading-relaxed max-w-xs text-stone-400">
              Handcrafting botanical elegance under the creative direction of Trisha Debnath since 2026. Bespoke floral arrangements for those who appreciate the finer details of nature.
            </p>
            <div className="space-y-3 pt-2">
              <h4 className="text-white text-xs font-semibold uppercase tracking-widest">
                Follow & Connect
              </h4>
              <div className="flex flex-col gap-2.5">
                <a
                  href="https://www.facebook.com/share/1YFvXyHpju/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook Profile"
                  className="group flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-stone-800/80 border border-stone-800 hover:border-stone-700 hover:bg-stone-800 text-stone-200 hover:text-white transition-all text-xs font-medium"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Facebook size={16} className="text-blue-400 shrink-0" />
                    <span className="truncate">facebook.com/share/1YFvXyHpju/</span>
                  </div>
                  <span className="text-[10px] text-stone-400 group-hover:text-stone-200 uppercase tracking-wider shrink-0 font-semibold">
                    Visit ↗
                  </span>
                </a>

                <a
                  href="https://www.instagram.com/trisha_dbnth?stkn=MTMyZWl2OXVjNmVqdg=="
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram Profile @trisha_dbnth"
                  className="group flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-stone-800/80 border border-stone-800 hover:border-stone-700 hover:bg-stone-800 text-stone-200 hover:text-white transition-all text-xs font-medium"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Instagram size={16} className="text-pink-400 shrink-0" />
                    <span className="truncate">instagram.com/trisha_dbnth</span>
                  </div>
                  <span className="text-[10px] text-stone-400 group-hover:text-stone-200 uppercase tracking-wider shrink-0 font-semibold">
                    Visit ↗
                  </span>
                </a>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-widest mb-6">
              Shop
            </h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Best Sellers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">New Arrivals</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Seasonal Specials</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Gift Cards</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-widest mb-6">
              Assistance
            </h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#collection" className="hover:text-white transition-colors">Browse Catalog</a></li>
              <li><a href="#bespoke" className="hover:text-white transition-colors">Custom Arrangements</a></li>
              <li>
                <a 
                  href="https://www.facebook.com/share/1YFvXyHpju/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span>Contact on Facebook</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://www.instagram.com/trisha_dbnth?stkn=MTMyZWl2OXVjNmVqdg==" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span>DM on Instagram</span>
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-widest mb-6">
              The Bloom Journal
            </h4>
            <p className="text-sm mb-6">
              Join our mailing list for floral inspiration and seasonal updates.
            </p>
            <form className="relative">
              <input 
                type="email" 
                placeholder="email@example.com"
                className="w-full bg-transparent border-b border-stone-700 pb-3 text-sm focus:outline-none focus:border-stone-400 transition-colors"
              />
              <button className="absolute right-0 bottom-3 text-xs font-bold uppercase tracking-widest text-white hover:text-stone-400 transition-colors">
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-10 border-t border-stone-800 text-[10px] uppercase tracking-widest font-medium">
          <p>© 2026 DEBNATH FLOWER BOUTIQUE • FOUNDED & OWNED BY TRISHA DEBNATH. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
