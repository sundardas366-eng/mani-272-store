"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, AlertTriangle, Lock } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ParticleBackground } from "@/components/animations/ParticleBackground";
import { useCartStore } from "@/store/cart";
import { formatPrice, generateOrderId } from "@/lib/utils";
import { PRODUCTS } from "@/data/products";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const total = getTotal();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [processing, setProcessing] = useState(false);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !contact) return;
    setProcessing(true);

    // DEMO CHECKOUT — clearly marked as demo.
    // When a real payment gateway (e.g. Stripe) is configured,
    // replace this with a server-side payment verification flow.
    setTimeout(() => {
      const orderId = generateOrderId();
      // Save order to localStorage (demo only — replace with database in production)
      const orders = JSON.parse(localStorage.getItem("mani-272-orders") || "[]");
      orders.push({
        id: orderId,
        items: items.map((i) => ({
          productId: i.product.id,
          productName: i.product.name,
          price: i.product.price,
          quantity: i.quantity,
        })),
        total,
        status: "pending",
        paymentMethod,
        createdAt: new Date().toISOString(),
        customerName: name,
        customerEmail: email,
      });
      localStorage.setItem("mani-272-orders", JSON.stringify(orders));

      clearCart();
      setProcessing(false);
      router.push(`/order-confirmation?id=${orderId}`);
    }, 1500);
  };

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">🛒</div>
            <p className="text-white/40 mb-4">Your cart is empty</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <ParticleBackground />
      <Navbar />
      <main className="relative z-10 min-h-screen pt-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="mani-brand text-2xl md:text-3xl mb-8">
            <span className="mani-red">Check</span><span className="mani-white">out</span>
          </h1>

          {/* Demo notice */}
          <div className="glass-card rounded-xl p-4 mb-6 border-amber-500/30 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-500 font-bold text-sm">DEMO CHECKOUT</p>
              <p className="text-white/50 text-xs mt-1">
                This is a demo checkout. No real payment is processed. When a payment
                gateway (e.g. Stripe) is configured, this will be replaced with secure
                server-side payment verification.
              </p>
            </div>
          </div>

          <form onSubmit={handleCheckout} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form */}
            <div className="lg:col-span-2 space-y-4">
              <div className="glass-card rounded-2xl p-6">
                <h2 className="font-bold text-white mb-4">Customer Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-white/40 uppercase tracking-wider mb-1.5 block">Full Name</label>
                    <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="input-mani" placeholder="Your name" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-white/40 uppercase tracking-wider mb-1.5 block">Email</label>
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input-mani" placeholder="you@example.com" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-white/40 uppercase tracking-wider mb-1.5 block">Contact (Phone / Discord / Telegram)</label>
                    <input type="text" required value={contact} onChange={(e) => setContact(e.target.value)} className="input-mani" placeholder="Your contact" />
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6">
                <h2 className="font-bold text-white mb-4">Payment Method</h2>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: "upi", label: "UPI" },
                    { id: "bank", label: "Bank Transfer" },
                    { id: "card", label: "Card" },
                    { id: "crypto", label: "Crypto" },
                  ].map((m) => (
                    <label
                      key={m.id}
                      className={`cursor-pointer rounded-xl p-4 text-center text-sm font-bold transition-all border ${
                        paymentMethod === m.id
                          ? "border-mani-red bg-mani-red/10 text-mani-red"
                          : "border-white/5 text-white/40 hover:border-white/20"
                      }`}
                    >
                      <input type="radio" name="payment" value={m.id} checked={paymentMethod === m.id} onChange={(e) => setPaymentMethod(e.target.value)} className="hidden" />
                      {m.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Summary */}
            <div>
              <div className="glass-card rounded-2xl p-6 sticky top-20">
                <h2 className="font-bold text-white mb-4">Order Summary</h2>
                <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex justify-between text-sm">
                      <span className="text-white/50">{item.product.name} × {item.quantity}</span>
                      <span className="text-white">{formatPrice(item.product.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-white/5 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-white">Total</span>
                    <span className="text-2xl font-black mani-red">{formatPrice(total)}</span>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={processing}
                  className="btn-glow w-full inline-flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {processing ? (
                    <>
                      <div className="loader-ring !w-5 !h-5 !border-2" /> Processing...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" /> Place Order
                    </>
                  )}
                </button>
                <p className="text-white/20 text-[10px] text-center mt-3">
                  By placing this order, you agree to our terms of service.
                </p>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
