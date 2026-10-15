/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { useAuth } from "../lib/AuthContext";
import { auth, db, login, logout, parseAuthError, AuthErrorInfo, handleFirestoreError, OperationType } from "../lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, setDoc, collection, onSnapshot, query } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, Plus, Trash2, LogOut, Loader2, ShieldCheck, X, Mail, Inbox, Package, AlertTriangle, Copy, Check, ExternalLink } from "lucide-react";

export function AdminPanel({ onClose }: { onClose: () => void }) {
  const { user: appUser, signInWithGoogle, signInAsCustomer, signOutUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(appUser?.isAdmin || false);
  const [loading, setLoading] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authError, setAuthError] = useState<AuthErrorInfo | null>(null);
  const [copiedDomain, setCopiedDomain] = useState(false);
  const [activeTab, setActiveTab] = useState<"orders" | "products">("orders");
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (appUser?.isAdmin) {
      setIsAdmin(true);
      setLoading(false);
      return;
    }

    return onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        try {
          const adminDoc = await getDoc(doc(db, "admins", u.uid));
          if (adminDoc.exists()) {
            setIsAdmin(true);
          } else if (u.email === "rupammaxdas@gmail.com") {
            await setDoc(doc(db, "admins", u.uid), {
              email: u.email,
              role: "admin"
            });
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        } catch (e) {
          if (u.email === "rupammaxdas@gmail.com") {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        }
      } else if (appUser?.isAdmin) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });
  }, [appUser]);

  // Fetch orders from Firestore and local backup
  useEffect(() => {
    const getLocalOrders = () => {
      try {
        const saved = localStorage.getItem("gifthubworld_orders_history") || localStorage.getItem("debnath_orders_history");
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    };

    const localList = getLocalOrders();

    try {
      const q = query(collection(db, "orders"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const remoteList = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        const map = new Map();
        [...remoteList, ...localList].forEach(ord => {
          if (!map.has(ord.id)) map.set(ord.id, ord);
        });
        const combined = Array.from(map.values()).sort(
          (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        );
        setOrders(combined);
      }, (err) => {
        console.warn("Admin orders Firestore listener notice:", err);
        setOrders(localList);
      });

      return unsubscribe;
    } catch {
      setOrders(localList);
    }
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-[100] flex items-center justify-center">
        <Loader2 className="animate-spin text-stone-400" size={32} />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-[100] flex items-center justify-end">
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        className="w-full max-w-2xl h-full bg-white shadow-2xl overflow-y-auto"
      >
        <div className="p-8">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-3">
              <LayoutDashboard className="text-stone-900" />
              <h2 className="text-2xl font-display font-semibold">Admin Dashboard</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>

          {!user ? (
            <div className="text-center py-16 px-6 bg-stone-50 rounded-3xl border border-dashed border-stone-200 max-w-md mx-auto space-y-6">
              <ShieldCheck className="mx-auto text-stone-300" size={48} />
              <div>
                <h3 className="font-display font-semibold text-lg text-stone-900">Gift Hub World Studio Admin</h3>
                <p className="text-stone-500 text-xs mt-1">Authorized access for studio administration.</p>
                <p className="text-[11px] text-stone-400 mt-0.5">Admin Account: rupammaxdas@gmail.com</p>
              </div>

              <button
                onClick={async () => {
                  setIsSigningIn(true);
                  setAuthError(null);
                  try {
                    await login();
                  } catch (err) {
                    const parsed = parseAuthError(err);
                    setAuthError(parsed);
                  } finally {
                    setIsSigningIn(false);
                  }
                }}
                disabled={isSigningIn}
                className="w-full px-8 py-3.5 bg-stone-900 text-white rounded-full font-medium text-xs hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
              >
                {isSigningIn ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Connecting to Google...</span>
                  </>
                ) : (
                  <span>Sign in with Google</span>
                )}
              </button>

              {authError && (
                <div className="text-left p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2.5">
                  <div className="flex items-start gap-2">
                    <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <span className="font-semibold block">
                        {authError.code === "auth/unauthorized-domain"
                          ? "Domain Authorization Required"
                          : "Sign-In Alert"}
                      </span>
                      <span className="text-[11px] text-amber-800 leading-relaxed block mt-1">
                        {authError.message}
                      </span>
                    </div>
                  </div>

                  {authError.code === "auth/unauthorized-domain" && authError.domain && (
                    <div className="space-y-2 pt-2 border-t border-amber-200/60">
                      <div className="flex items-center gap-1.5">
                        <code className="text-[10px] bg-white p-1.5 rounded flex-1 font-mono break-all text-stone-800 border border-amber-200">
                          {authError.domain}
                        </code>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(authError.domain || "");
                            setCopiedDomain(true);
                            setTimeout(() => setCopiedDomain(false), 2000);
                          }}
                          className="px-2.5 py-1.5 rounded bg-stone-900 text-white text-[10px] font-semibold hover:bg-stone-800 shrink-0 flex items-center gap-1"
                        >
                          {copiedDomain ? <Check size={11} /> : <Copy size={11} />}
                          <span>{copiedDomain ? "Copied" : "Copy"}</span>
                        </button>
                      </div>
                      {authError.consoleUrl && (
                        <a
                          href={authError.consoleUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-900 hover:underline"
                        >
                          <span>Open Firebase Authorized Domains</span>
                          <ExternalLink size={11} />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              )}

              <div className="pt-2 border-t border-stone-200/80 space-y-2">
                <button
                  type="button"
                  onClick={async () => {
                    setIsSigningIn(true);
                    setAuthError(null);
                    try {
                      await signInAsCustomer("Rupam Max Das", "rupammaxdas@gmail.com");
                      setIsAdmin(true);
                    } finally {
                      setIsSigningIn(false);
                    }
                  }}
                  className="w-full py-2.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck size={14} className="text-stone-700" />
                  <span>Direct Admin Sign In (rupammaxdas@gmail.com)</span>
                </button>
                <p className="text-[10px] text-stone-400">
                  Instant administrative access for Rupam Max Das Studio.
                </p>
              </div>
            </div>
          ) : !isAdmin ? (
            <div className="text-center py-20">
              <p className="text-stone-900 font-medium mb-2">Access Denied</p>
              <p className="text-stone-500 text-sm mb-8">Your account ({user.email}) does not have admin privileges. Only rupammaxdas@gmail.com is authorized.</p>
              <button onClick={logout} className="text-stone-900 font-semibold border-b border-stone-900 pb-1">
                Sign out
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex items-center justify-between p-4 bg-stone-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center overflow-hidden">
                    {user.photoURL ? <img src={user.photoURL} alt="" /> : <ShieldCheck size={20} />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{user.displayName}</p>
                    <p className="text-xs text-stone-500">{user.email}</p>
                  </div>
                </div>
                <button onClick={logout} className="text-stone-400 hover:text-red-500 transition-colors">
                  <LogOut size={20} />
                </button>
              </div>

              {/* Navigation Tabs */}
              <div className="flex gap-2 border-b border-stone-200 pb-2">
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                    activeTab === "orders"
                      ? "bg-stone-900 text-white shadow-xs"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  <Inbox size={15} />
                  <span>Orders Inbox ({orders.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab("products")}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                    activeTab === "products"
                      ? "bg-stone-900 text-white shadow-xs"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  <LayoutDashboard size={15} />
                  <span>Product Catalogue</span>
                </button>
              </div>

              {/* TAB 1: ORDERS INBOX */}
              {activeTab === "orders" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-stone-900 uppercase tracking-widest text-xs">Customer Orders Inbox</h3>
                      <p className="text-[11px] text-stone-500">Live incoming customer orders with automatic totals & Gmail forward</p>
                    </div>
                    <span className="text-xs font-mono px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg font-semibold">
                      {orders.length} Total Orders
                    </span>
                  </div>

                  {orders.length === 0 ? (
                    <div className="text-center py-16 bg-stone-50 rounded-2xl border border-dashed border-stone-200">
                      <Inbox className="mx-auto mb-3 text-stone-300" size={36} />
                      <p className="text-sm font-medium text-stone-700">No Orders in Inbox Yet</p>
                      <p className="text-xs text-stone-400 mt-1 max-w-xs mx-auto">
                        New orders placed via Pay on Hand Delivery or UPI will appear here in real-time.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((ord: any) => {
                        let parsedItems: any[] = [];
                        try {
                          parsedItems = typeof ord.items === "string" ? JSON.parse(ord.items) : (ord.items || []);
                        } catch {
                          parsedItems = [];
                        }

                        const mailtoBody = encodeURIComponent(
                          `GIFT HUB WORLD FLOWER BOUTIQUE - ORDER DETAILS\n\n` +
                          `Order ID: ${ord.id}\n` +
                          `Placed: ${new Date(ord.createdAt || Date.now()).toLocaleString()}\n` +
                          `Payment: ${ord.paymentMethod === "cod" ? "Pay on Hand Delivery" : ord.paymentMethod}\n\n` +
                          `CUSTOMER DETAILS:\n` +
                          `Name: ${ord.recipientName || "N/A"}\n` +
                          `Phone: ${ord.recipientPhone || "N/A"}\n` +
                          `Delivery Address: ${ord.deliveryAddress || "N/A"}\n` +
                          `Delivery Slot: ${ord.deliveryDate || ""} (${ord.deliverySlot || ""})\n` +
                          (ord.cardMessage ? `Card Message: "${ord.cardMessage}"\n` : '') +
                          (ord.senderName ? `Sender: ${ord.senderName}\n\n` : '\n') +
                          `PRODUCT CATALOGUE ITEMS:\n` +
                          parsedItems.map((it: any) => `- ${it.name} × ${it.quantity}: ₹${((it.price || 0) * (it.quantity || 1)).toLocaleString()}`).join('\n') + '\n\n' +
                          `AUTOMATIC TOTAL CALCULATION:\n` +
                          `Subtotal: ₹${(ord.subtotal || ord.totalAmount).toLocaleString()}\n` +
                          (ord.discount ? `Discount: -₹${ord.discount.toLocaleString()}\n` : '') +
                          `Delivery Fee: ₹${ord.deliveryFee || 0}\n` +
                          `Final Total: ₹${(ord.totalAmount || 0).toLocaleString()}\n\n` +
                          `Owner & Founder: Rupam Max Das • Gift Hub World Flower Boutique`
                        );

                        const gmailHref = `https://mail.google.com/mail/?view=cm&fs=1&to=rupammaxdas@gmail.com&su=${encodeURIComponent(`Order Info: ${ord.id} - ${ord.recipientName || 'Customer'}`)}&body=${mailtoBody}`;

                        return (
                          <div key={ord.id} className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-sm space-y-4">
                            {/* Order Header */}
                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
                              <div className="flex items-center gap-2.5">
                                <span className="font-mono font-bold text-sm text-stone-900">{ord.id}</span>
                                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                                  {ord.paymentMethod === "cod" ? "Pay on Hand Delivery" : ord.paymentMethod}
                                </span>
                              </div>
                              <span className="text-[11px] text-stone-400">
                                {new Date(ord.createdAt || Date.now()).toLocaleDateString('en-IN', {
                                  month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                })}
                              </span>
                            </div>

                            {/* Customer, Phone & Address */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-stone-50 p-3.5 rounded-xl border border-stone-200/60">
                              <div>
                                <span className="text-[10px] uppercase font-semibold text-stone-400 block">Customer / Recipient</span>
                                <p className="font-semibold text-stone-900 mt-0.5">{ord.recipientName || "Guest Customer"}</p>
                                <p className="font-mono text-stone-600 mt-0.5">{ord.recipientPhone || "No Phone"}</p>
                              </div>
                              <div>
                                <span className="text-[10px] uppercase font-semibold text-stone-400 block">Hand Delivery Destination</span>
                                <p className="text-stone-800 mt-0.5 leading-relaxed">{ord.deliveryAddress || "N/A"}</p>
                                <p className="text-stone-500 text-[11px] mt-0.5 font-medium">Slot: {ord.deliveryDate} • {ord.deliverySlot?.toUpperCase()}</p>
                              </div>
                            </div>

                            {/* Catalogue Items */}
                            <div className="text-xs space-y-1.5">
                              <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block">
                                Product Catalogue & Stems ({parsedItems.length})
                              </span>
                              <div className="divide-y divide-stone-100 bg-stone-50/50 p-3 rounded-xl border border-stone-100">
                                {parsedItems.map((item: any, idx: number) => (
                                  <div key={idx} className="flex justify-between py-1 text-stone-700">
                                    <span className="truncate max-w-[260px]">
                                      {item.name} <span className="text-stone-400 font-mono">×{item.quantity}</span>
                                    </span>
                                    <span className="font-mono font-medium text-stone-900">
                                      ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Automatic Order Total Calculation */}
                            <div className="flex items-center justify-between text-xs pt-2 border-t border-stone-100">
                              <div className="text-stone-500">
                                <span>Subtotal: ₹{(ord.subtotal || ord.totalAmount).toLocaleString()}</span>
                                {ord.deliveryFee !== undefined && (
                                  <span className="ml-2">• Delivery: {ord.deliveryFee === 0 ? "Free" : `₹${ord.deliveryFee}`}</span>
                                )}
                              </div>
                              <div className="text-right">
                                <span className="text-[10px] uppercase font-semibold text-stone-400 block">Total Payable</span>
                                <span className="font-mono font-bold text-base text-stone-900">
                                  ₹{(ord.totalAmount || 0).toLocaleString()}
                                </span>
                              </div>
                            </div>

                            {/* Forward / Open in Gmail Button */}
                            <div className="pt-1">
                              <a
                                href={gmailHref}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 hover:text-red-900 text-xs font-semibold border border-red-200 transition-colors shadow-xs w-full justify-center"
                              >
                                <Mail size={14} className="text-red-600" />
                                <span>Forward Order to Admin Gmail Inbox (rupammaxdas@gmail.com)</span>
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: MANAGE PRODUCTS */}
              {activeTab === "products" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-stone-900 uppercase tracking-widest text-xs">Manage Products</h3>
                    <button className="flex items-center gap-2 px-4 py-2 bg-stone-100 text-stone-900 rounded-lg text-sm font-medium hover:bg-stone-200 transition-colors">
                      <Plus size={16} /> Add Product
                    </button>
                  </div>

                  <div className="border border-stone-100 rounded-xl overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-stone-50 text-[10px] uppercase tracking-widest font-bold text-stone-400 border-b border-stone-100">
                        <tr>
                          <th className="px-6 py-4">Product</th>
                          <th className="px-6 py-4">Price</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-50">
                        {[
                          { id: 1, name: "01. Handmade Flower Bouquets", price: "₹1,299", cat: "Handcrafted & Bespoke" },
                          { id: 2, name: "02. Rose Bouquet Designs", price: "₹1,499", cat: "Romantic & Roses" },
                          { id: 3, name: "03. Birthday Bouquets", price: "₹1,199", cat: "Celebrations & Gifts" },
                          { id: 4, name: "04. Anniversary Bouquets", price: "₹1,899", cat: "Romantic & Roses" },
                          { id: 5, name: "05. Wedding Bouquets", price: "₹2,499", cat: "Weddings & Bridal" },
                          { id: 6, name: "06. Valentine’s Day Special Bouquets", price: "₹1,999", cat: "Romantic & Roses" },
                          { id: 7, name: "07. Artificial Flower Bouquets", price: "₹1,399", cat: "Everlasting & Crafts" },
                          { id: 8, name: "08. Paper Flower Bouquets", price: "₹1,299", cat: "Everlasting & Crafts" },
                          { id: 9, name: "09. Money Bouquets", price: "₹2,999", cat: "Celebrations & Gifts" },
                          { id: 10, name: "10. Chocolate Bouquets", price: "₹1,799", cat: "Celebrations & Gifts" },
                          { id: 11, name: "11. Bridal Hand Bouquets", price: "₹2,799", cat: "Weddings & Bridal" },
                          { id: 12, name: "12. Customized Gift Bouquets", price: "₹1,699", cat: "Handcrafted & Bespoke" },
                          { id: 13, name: "13. Newborn Baby Gift Bouquets", price: "₹1,499", cat: "Celebrations & Gifts" },
                          { id: 14, name: "14. Festival Special Bouquets", price: "₹1,399", cat: "Celebrations & Gifts" },
                          { id: 15, name: "15. Premium Luxury Bouquets", price: "₹3,499", cat: "Luxury & Editorial" },
                          { id: 16, name: "16. Bouquet Making Tutorials", price: "₹899", cat: "DIY & Workshops" },
                          { id: 17, name: "17. Creative DIY Bouquet Ideas", price: "₹1,199", cat: "DIY & Workshops" },
                          { id: 18, name: "18. Surprise Gift Bouquets", price: "₹1,599", cat: "Celebrations & Gifts" },
                          { id: 19, name: "19. Best Friend Gift Bouquets", price: "₹1,249", cat: "Celebrations & Gifts" },
                        ].map((p) => (
                          <tr key={p.id} className="text-sm">
                            <td className="px-6 py-3.5">
                              <span className="font-medium text-stone-900 block">{p.name}</span>
                              <span className="text-[10px] text-stone-400 uppercase tracking-wider">{p.cat}</span>
                            </td>
                            <td className="px-6 py-3.5 font-mono text-stone-600 font-medium">{p.price}</td>
                            <td className="px-6 py-3.5 text-right">
                              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-semibold">Active</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
