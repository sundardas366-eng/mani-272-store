"use client";

import Link from "next/link";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ParticleBackground } from "@/components/animations/ParticleBackground";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();
  const total = getTotal();

  return (
    <>
      <ParticleBackground />
      <Navbar />
      <main className="relative z-10 min-h-screen pt-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="mani-brand text-2xl md:text-3xl mb-8">
            <span className="mani-red">Shopping</span> <span className="mani-white">Cart</span>
          </h1>

          {items.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center">
              <div className="text-5xl mb-4">🛒</div>
              <h2 className="text-xl font-bold text-white mb-2">Your cart is empty</h2>
              <p className="text-white/40 mb-6">Browse our products and add items to your cart.</p>
              <Link href="/products" className="btn-glow inline-flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" /> Browse Products
              </Link>
            </div>
          ) : (
            <>
              {/* Cart items */}
              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="glass-card rounded-xl p-4 flex items-center gap-4"
                  >
                    {/* Image placeholder */}
                    <div className="w-16 h-16 rounded-lg bg-mani-grey flex items-center justify-center flex-shrink-0">
                      <span className="text-mani-red font-black text-xs">
                        {item.product.name.slice(0, 4)}
                      </span>
                    </div>

                    {/* Name */}
                    <div className="flex-1 min-w-0">
                      <Link href={`/products/${item.product.slug}`} className="font-bold text-white hover:text-mani-red text-sm">
                        {item.product.name}
                      </Link>
                      <p className="text-white/30 text-xs">{item.product.category}</p>
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-lg glass flex items-center justify-center text-white/60 hover:text-mani-red"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center font-bold text-white">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-lg glass flex items-center justify-center text-white/60 hover:text-mani-red"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Price */}
                    <span className="font-black mani-red w-24 text-right">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>

                    {/* Remove */}
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-red-500 hover:bg-red-500/10 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="glass-card rounded-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-white/60">Subtotal</span>
                  <span className="text-white font-bold">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-white/60">Delivery</span>
                  <span className="text-green-500 font-bold">Instant</span>
                </div>
                <div className="border-t border-white/5 pt-4 flex justify-between items-center mb-6">
                  <span className="text-lg font-bold text-white">Total</span>
                  <span className="text-2xl font-black mani-red">{formatPrice(total)}</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/checkout" className="btn-glow flex-1 inline-flex items-center justify-center gap-2">
                    Proceed to Checkout <ArrowRight className="w-5 h-5" />
                  </Link>
                  <button onClick={clearCart} className="btn-ghost">
                    Clear Cart
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
