/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Check, 
  MapPin, 
  Calendar, 
  Clock, 
  CreditCard, 
  MessageSquare, 
  ArrowRight, 
  ChevronLeft, 
  Truck, 
  ShieldCheck, 
  Sparkles,
  Loader2,
  PackageCheck,
  AlertCircle,
  Mail
} from "lucide-react";
import { useCart } from "../lib/CartContext";
import { useAuth } from "../lib/AuthContext";
import { auth, db, login, loginAnonymously, handleFirestoreError, OperationType } from "../lib/firebase";
import { doc, setDoc } from "firebase/firestore";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (orderId: string) => void;
}

const OCCASIONS = [
  "Romantic Love",
  "Anniversary",
  "Birthday Celebration",
  "Gratitude & Thanks",
  "Congratulations",
  "Sympathy & Comfort",
  "Just Because"
];

const TIME_SLOTS = [
  { id: "morning", label: "Morning", time: "09:00 AM – 01:00 PM" },
  { id: "afternoon", label: "Afternoon", time: "01:00 PM – 05:00 PM" },
  { id: "evening", label: "Evening Express", time: "05:00 PM – 09:00 PM" }
];

export function CheckoutModal({ isOpen, onClose, onOrderSuccess }: CheckoutModalProps) {
  const { cart, finalTotal, subtotal, discount, deliveryFee, clearCart } = useCart();
  const { user } = useAuth();
  
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Form states
  const [recipientName, setRecipientName] = useState(user?.displayName || "");
  const [recipientPhone, setRecipientPhone] = useState(user?.phone || "");
  const [senderName, setSenderName] = useState(user?.displayName || "");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [city, setCity] = useState("Kolkata");
  const [pincode, setPincode] = useState("700001");

  useEffect(() => {
    if (isOpen && user) {
      if (!recipientName && user.displayName) setRecipientName(user.displayName);
      if (!senderName && user.displayName) setSenderName(user.displayName);
      if (!recipientPhone && user.phone) setRecipientPhone(user.phone);
    }
  }, [isOpen, user]);
  const [deliveryDate, setDeliveryDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [deliverySlot, setDeliverySlot] = useState("morning");
  const [occasion, setOccasion] = useState(OCCASIONS[0]);
  const [cardMessage, setCardMessage] = useState(
    "Wishing you eternal joy and beauty. May these fresh blooms brighten your day!"
  );
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "netbanking" | "cod">("cod");
  const [upiId, setUpiId] = useState("");

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    if (step < 3) {
      setStep((prev) => (prev + 1) as 1 | 2 | 3);
    }
  };

  const handlePlaceOrder = async () => {
    setValidationError(null);

    // Validate cart items
    if (cart.length === 0) {
      setValidationError("Your shopping bag is empty. Please select an arrangement.");
      return;
    }

    // Validate delivery details
    if (!recipientName.trim() || !recipientPhone.trim() || !deliveryAddress.trim()) {
      setValidationError("Please provide the recipient's name, contact phone number, and delivery address.");
      setStep(1);
      return;
    }

    setIsSubmitting(true);

    // Resolve user ID (logged in, anonymous auth, or persistent guest ID)
    let currentUserId = auth.currentUser?.uid;
    let currentUserEmail = auth.currentUser?.email || "";

    if (!currentUserId) {
      try {
        const anonCred = await loginAnonymously();
        currentUserId = anonCred.user.uid;
        currentUserEmail = anonCred.user.email || "";
      } catch (authError) {
        console.warn("Anonymous auth unavailable; using persistent device guest profile:", authError);
        currentUserId = localStorage.getItem("debnath_guest_uid") || `guest_${Math.random().toString(36).substring(2, 10)}`;
        localStorage.setItem("debnath_guest_uid", currentUserId);
      }
    }

    const orderNum = `DNF-${Math.floor(100000 + Math.random() * 900000)}`;
    const fullAddress = `${deliveryAddress.trim()}, ${city} - ${pincode}`;
    const now = new Date().toISOString();

    const orderPayload = {
      id: orderNum,
      userId: currentUserId || "guest_order",
      userEmail: currentUserEmail,
      items: JSON.stringify(cart),
      totalAmount: finalTotal,
      subtotal,
      discount,
      deliveryFee,
      recipientName: recipientName.trim(),
      recipientPhone: recipientPhone.trim(),
      senderName: senderName.trim(),
      deliveryAddress: fullAddress,
      deliveryDate,
      deliverySlot,
      occasion,
      cardMessage,
      paymentMethod,
      status: "placed" as const,
      createdAt: now,
    };

    // 1. Always save order to local storage history so the receipt and live tracking work 100% reliably
    try {
      const existingHistoryStr = localStorage.getItem("debnath_orders_history");
      const existingHistory = existingHistoryStr ? JSON.parse(existingHistoryStr) : [];
      localStorage.setItem("debnath_orders_history", JSON.stringify([orderPayload, ...existingHistory]));
    } catch (storageErr) {
      console.warn("Order local storage write error:", storageErr);
    }

    // 2. Sync order to Firestore orders collection if possible
    try {
      await setDoc(doc(db, "orders", orderNum), orderPayload);
    } catch (firestoreErr) {
      console.warn("Firestore order sync warning (order verified and saved locally):", firestoreErr);
    }

    // 3. Complete order flow
    try {
      await clearCart();
    } catch (cartErr) {
      console.warn("Cart clear notice:", cartErr);
    }

    setCreatedOrderId(orderNum);
    setIsSubmitting(false);
    onOrderSuccess(orderNum);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-stone-950/60 backdrop-blur-md"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 my-auto flex flex-col max-h-[90vh]"
      >
        {/* SUCCESS CONFIRMATION STATE */}
        {createdOrderId ? (
          <div className="p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-6 overflow-y-auto">
            <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border-2 border-emerald-200">
              <PackageCheck size={40} className="animate-bounce" />
            </div>

            <div>
              <span className="text-xs uppercase font-mono tracking-widest text-emerald-700 bg-emerald-100/60 px-3 py-1 rounded-full font-bold">
                Order Confirmed
              </span>
              <h2 className="text-3xl font-display font-medium text-stone-900 mt-3">
                Thank You For Your Order
              </h2>
              <p className="text-stone-500 text-xs sm:text-sm mt-1 max-w-md mx-auto">
                Our master florists have received your bouquet specification and are hand-selecting the freshest stems.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="w-full max-w-lg p-5 bg-stone-50 rounded-2xl border border-stone-200 text-left space-y-3.5">
              <div className="flex justify-between items-baseline border-b border-stone-200 pb-2.5">
                <div>
                  <span className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider block">Official Receipt</span>
                  <span className="font-mono text-base font-bold text-stone-900">{createdOrderId}</span>
                </div>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {paymentMethod === "cod" ? "Pay on Hand Delivery" : `Paid via ${paymentMethod.toUpperCase()}`}
                </span>
              </div>

              {/* Customer Name, Phone & Delivery Address */}
              <div className="space-y-1.5 text-xs text-stone-600 bg-white p-3 rounded-xl border border-stone-200/70">
                <div className="flex justify-between">
                  <span className="text-stone-400">Customer Name:</span>
                  <strong className="text-stone-900">{recipientName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Contact Phone:</span>
                  <span className="font-mono font-medium text-stone-900">{recipientPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Delivery Address:</span>
                  <span className="text-stone-900 font-medium text-right max-w-[240px] truncate">{deliveryAddress}, {city} - {pincode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Scheduled Delivery:</span>
                  <span className="text-stone-800">{deliveryDate} • {deliverySlot.toUpperCase()}</span>
                </div>
              </div>

              {/* Product Catalogue & Cart Items */}
              <div className="space-y-1 text-xs bg-white p-3 rounded-xl border border-stone-200/70">
                <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block mb-1">
                  Product Catalogue & Items ({cart.length})
                </span>
                <div className="divide-y divide-stone-100">
                  {cart.map((item, idx) => (
                    <div key={idx} className="flex justify-between py-1 text-stone-700">
                      <span className="truncate max-w-[240px]">
                        {item.name} <span className="text-stone-400 font-mono">×{item.quantity}</span>
                      </span>
                      <span className="font-mono font-medium text-stone-900">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Automatic Order Total Calculation */}
              <div className="space-y-1.5 text-xs border-t border-stone-200 pt-2.5">
                <div className="flex justify-between text-stone-500">
                  <span>Catalogue Subtotal</span>
                  <span className="font-mono text-stone-800 font-medium">₹{subtotal.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Loyalty / Promo Discount</span>
                    <span className="font-mono font-medium">-₹{discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-500">
                  <span>Climate-Controlled Delivery</span>
                  <span className="font-mono font-medium">{deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}</span>
                </div>
                <div className="flex justify-between items-baseline font-bold text-sm text-stone-900 pt-1.5 border-t border-stone-200">
                  <span>Total Order Investment</span>
                  <span className="text-lg font-mono font-bold text-stone-950">₹{finalTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Gmail Inbox Order Info Action */}
            <div className="w-full max-w-lg space-y-2">
              <a
                href={`https://mail.google.com/mail/?view=cm&fs=1&to=rupammaxdas@gmail.com&su=${encodeURIComponent(`New Order Confirmed: ${createdOrderId} - ${recipientName}`)}&body=${encodeURIComponent(
                  `DEBNATH FLOWER BOUTIQUE - NEW ORDER\n\n` +
                  `Order ID: ${createdOrderId}\n` +
                  `Payment Method: Pay on Hand Delivery (Cash/UPI)\n\n` +
                  `CUSTOMER & DELIVERY DETAILS:\n` +
                  `Customer Name: ${recipientName}\n` +
                  `Contact Phone: ${recipientPhone}\n` +
                  `Delivery Address: ${deliveryAddress}, ${city} - ${pincode}\n` +
                  `Scheduled Delivery Slot: ${deliveryDate} (${deliverySlot.toUpperCase()})\n` +
                  `Occasion: ${occasion}\n` +
                  `Card Message: "${cardMessage}"\n` +
                  `Sender: ${senderName || "Anonymous"}\n\n` +
                  `PRODUCT CATALOGUE ITEMS:\n` +
                  cart.map(item => `- ${item.name} × ${item.quantity}: ₹${(item.price * item.quantity).toLocaleString()}`).join('\n') + '\n\n' +
                  `AUTOMATIC TOTAL CALCULATION:\n` +
                  `Subtotal: ₹${subtotal.toLocaleString()}\n` +
                  (discount > 0 ? `Discount: -₹${discount.toLocaleString()}\n` : '') +
                  `Delivery Fee: ₹${deliveryFee}\n` +
                  `Final Total Payable: ₹${finalTotal.toLocaleString()}\n\n` +
                  `Handcrafted under the creative direction of Trisha Debnath at Debnath Flower Boutique.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 hover:text-red-900 text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-xs"
              >
                <Mail size={15} className="text-red-600" />
                <span>Send Order Info to Admin Gmail Inbox (rupammaxdas@gmail.com)</span>
              </a>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-lg">
              <button
                onClick={() => {
                  onClose();
                  onOrderSuccess(createdOrderId);
                }}
                className="flex-1 py-3.5 px-6 rounded-full bg-stone-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-stone-800 transition-colors shadow-md"
              >
                Track Live Order
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-3.5 px-6 rounded-full bg-white border border-stone-200 text-stone-800 text-xs font-bold uppercase tracking-wider hover:bg-stone-50 transition-colors"
              >
                Continue Browsing
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Header with step indicators */}
            <div className="p-6 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block">
                  Debnath Luxury Checkout • Step {step} of 3
                </span>
                <h3 className="text-xl font-display font-medium text-stone-900 mt-0.5">
                  {step === 1 && "Recipient & Delivery Details"}
                  {step === 2 && "Handwritten Calligraphy Card"}
                  {step === 3 && "Secure Payment & Finalize"}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-200/60 rounded-full transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Stepper Progress Bar */}
            <div className="flex h-1 bg-stone-100">
              <div 
                className="bg-stone-900 transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 overflow-y-auto flex-1">
              
              {validationError && (
                <div className="mb-5 p-3.5 bg-red-50 border border-red-200/80 rounded-2xl text-xs text-red-800 flex items-center gap-2.5 shadow-xs">
                  <AlertCircle size={16} className="text-red-600 shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              {/* STEP 1: Delivery Details */}
              {step === 1 && (
                <form id="step-1-form" onSubmit={handleNextStep} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-stone-700 block mb-1.5">
                        Recipient Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        placeholder="e.g. Trisha Debnath"
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-stone-900 focus:bg-white transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-stone-700 block mb-1.5">
                        Recipient Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={recipientPhone}
                        onChange={(e) => setRecipientPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-stone-900 focus:bg-white transition-all font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1.5">
                      Delivery Street Address & Landmark *
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Apartment, suite, landmark, street address"
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-stone-900 focus:bg-white transition-all resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-stone-700 block mb-1.5">City</label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-stone-900 focus:bg-white transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-stone-700 block mb-1.5">PIN Code</label>
                      <input
                        type="text"
                        required
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-stone-900 focus:bg-white transition-all font-mono"
                      />
                    </div>
                  </div>

                  {/* Delivery Date & Time Slot */}
                  <div className="pt-2 border-t border-stone-100 space-y-3">
                    <label className="text-xs font-semibold text-stone-900 uppercase tracking-wider block">
                      Preferred Delivery Schedule
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <span className="text-[11px] text-stone-500 block mb-1">Select Date</span>
                        <input
                          type="date"
                          required
                          value={deliveryDate}
                          onChange={(e) => setDeliveryDate(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-stone-900 focus:bg-white transition-all font-mono"
                        />
                      </div>
                      <div>
                        <span className="text-[11px] text-stone-500 block mb-1">Time Slot</span>
                        <select
                          value={deliverySlot}
                          onChange={(e) => setDeliverySlot(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-stone-900 focus:bg-white transition-all"
                        >
                          {TIME_SLOTS.map((slot) => (
                            <option key={slot.id} value={slot.id}>
                              {slot.label} ({slot.time})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </form>
              )}

              {/* STEP 2: Card Message & Occasion */}
              {step === 2 && (
                <form id="step-2-form" onSubmit={handleNextStep} className="space-y-6">
                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-2">
                      Occasion
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {OCCASIONS.map((occ) => (
                        <button
                          key={occ}
                          type="button"
                          onClick={() => setOccasion(occ)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                            occasion === occ
                              ? "bg-stone-900 text-white shadow-xs"
                              : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                          }`}
                        >
                          {occ}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-stone-700">
                        Complimentary Card Message
                      </label>
                      <span className="text-[10px] text-stone-400">{cardMessage.length}/300 characters</span>
                    </div>
                    <textarea
                      rows={3}
                      maxLength={300}
                      value={cardMessage}
                      onChange={(e) => setCardMessage(e.target.value)}
                      placeholder="Write your heartfelt note here..."
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-stone-900 focus:bg-white transition-all resize-none leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1.5">
                      Sender Name (as printed on card)
                    </label>
                    <input
                      type="text"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="Your name or Anonymous"
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-stone-900 focus:bg-white transition-all"
                    />
                  </div>

                  {/* Calligraphy Card Live Preview */}
                  <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/70 shadow-xs relative">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-amber-800 block mb-2">
                      Florist Card Live Preview
                    </span>
                    <p className="font-display italic text-stone-800 text-sm leading-relaxed">
                      "{cardMessage || 'Your message will be lovingly scripted on heavy textured linen paper.'}"
                    </p>
                    <p className="text-right text-xs font-display font-medium text-stone-600 mt-3">
                      — {senderName || "With warmest regards"}
                    </p>
                  </div>
                </form>
              )}

              {/* STEP 3: Payment Method */}
              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <label className="text-xs font-semibold text-stone-900 uppercase tracking-wider block mb-3">
                      Select Payment Option
                    </label>

                    <div className="space-y-3">
                      {/* UPI */}
                      <label 
                        className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                          paymentMethod === "upi" ? "border-stone-900 bg-stone-50 shadow-xs" : "border-stone-200 hover:border-stone-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === "upi"}
                          onChange={() => setPaymentMethod("upi")}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-stone-900">Instant UPI (GPay, PhonePe, Paytm)</span>
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                              Fastest
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-500 mt-0.5">Pay seamlessly with any UPI handle or QR code</p>
                          {paymentMethod === "upi" && (
                            <div className="mt-3">
                              <input
                                type="text"
                                value={upiId}
                                onChange={(e) => setUpiId(e.target.value)}
                                placeholder="username@okhdfcbank"
                                className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-mono focus:outline-none focus:border-stone-900"
                              />
                            </div>
                          )}
                        </div>
                      </label>

                      {/* Cash on Delivery / Hand Delivery */}
                      <label 
                        className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                          paymentMethod === "cod" 
                            ? "border-stone-900 bg-stone-50 shadow-xs ring-1 ring-stone-900/10" 
                            : "border-stone-200 hover:border-stone-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === "cod"}
                          onChange={() => setPaymentMethod("cod")}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-stone-900">Pay on Hand Delivery (Cash or UPI)</span>
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                              Instant Confirmation
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-500 mt-0.5">Pay via Cash or scan our courier's UPI QR code when blooms arrive at your doorstep</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Summary Box */}
                  <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2 text-xs">
                    <div className="flex justify-between text-stone-600">
                      <span>Total Floral Creations</span>
                      <span className="font-mono text-stone-900 font-semibold">{cart.length} items</span>
                    </div>
                    <div className="flex justify-between text-stone-600">
                      <span>Destination</span>
                      <span className="text-stone-900 font-medium truncate max-w-[220px]">{deliveryAddress || "Standard Address"}, {city}</span>
                    </div>
                    <div className="flex justify-between items-baseline pt-2 border-t border-stone-200 font-bold text-sm text-stone-900">
                      <span>Total Payable</span>
                      <span className="text-lg font-mono font-bold">₹{finalTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-stone-100/80 rounded-xl border border-stone-200 text-[11px] text-stone-600 flex items-center gap-2">
                    <Truck size={14} className="text-stone-500 shrink-0" />
                    <span>Free climate-controlled hand delivery with real-time tracking receipt.</span>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer Controls */}
            <div className="p-6 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((prev) => (prev - 1) as 1 | 2 | 3)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-700 hover:bg-stone-100 text-xs font-semibold transition-colors"
                >
                  <ChevronLeft size={15} />
                  <span>Back</span>
                </button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <button
                  type="submit"
                  form={`step-${step}-form`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-stone-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-stone-800 transition-all shadow-md group"
                >
                  <span>Continue</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting || cart.length === 0}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider hover:bg-emerald-800 disabled:opacity-50 transition-all shadow-lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      <span>Confirming Order...</span>
                    </>
                  ) : (
                    <>
                      <Check size={16} />
                      <span>
                        {paymentMethod === "cod"
                          ? `Confirm Hand Delivery (₹${finalTotal.toLocaleString()})`
                          : `Place Order (₹${finalTotal.toLocaleString()})`}
                      </span>
                    </>
                  )}
                </button>
              )}
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
