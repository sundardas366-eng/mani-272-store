"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Home, Package } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ParticleBackground } from "@/components/animations/ParticleBackground";

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");

  return (
    <div className="glass-card rounded-3xl p-8 md:p-12 max-w-lg text-center">
      <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 className="w-10 h-10 text-green-500" />
      </div>
      <h1 className="text-2xl font-black text-white mb-2">Order Placed!</h1>
      <p className="text-white/40 mb-6">
        Thank you for your purchase. Your order has been received.
      </p>

      <div className="glass-card rounded-xl p-4 mb-6">
        <p className="text-white/30 text-xs uppercase tracking-wider mb-1">Order ID</p>
        <p className="font-black text-white text-lg">{orderId || "M272-XXXX"}</p>
      </div>

      <div className="glass-card rounded-xl p-4 mb-6 text-left">
        <p className="text-white/40 text-sm leading-relaxed">
          📦 Your order is now <span className="text-amber-500 font-bold">pending</span>.
          Our team will contact you shortly via your provided contact info for payment
          verification and delivery.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/products" className="btn-glow inline-flex items-center gap-2">
          <Package className="w-4 h-4" /> Continue Shopping
        </Link>
        <Link href="/" className="btn-ghost inline-flex items-center gap-2">
          <Home className="w-4 h-4" /> Home
        </Link>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <>
      <ParticleBackground />
      <Navbar />
      <main className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <Suspense fallback={
          <div className="glass-card rounded-3xl p-12 text-center text-white/50">
            Loading order details...
          </div>
        }>
          <OrderConfirmationContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
