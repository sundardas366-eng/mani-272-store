"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShoppingCart, MessageCircle, Youtube, ExternalLink, BookOpen, CheckCircle2, XCircle, Star, Zap, Crown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ParticleBackground } from "@/components/animations/ParticleBackground";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductImage } from "@/components/products/ProductCard";
import { getProductBySlug, getRelatedProducts } from "@/data/products";
import { DEFAULT_PRICING } from "@/data/settings";
import { formatPrice, cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import type { DurationPrice, ProductLinks } from "@/types";
import toast from "react-hot-toast";

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const initialProduct = getProductBySlug(slug);
  const [product, setProduct] = useState(initialProduct);
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const [selectedTier, setSelectedTier] = useState<DurationPrice>(DEFAULT_PRICING[3]); // default 30 days

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/products/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.product) {
          setProduct(data.product);
        }
      })
      .catch((err) => console.warn("Failed to fetch product:", err));
  }, [slug]);

  if (!product) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">😕</div>
            <h1 className="text-2xl font-bold text-white mb-2">Product Not Found</h1>
            <p className="text-white/40 mb-6">The product you're looking for doesn't exist.</p>
            <Link href="/products" className="btn-glow">Back to Products</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const related = getRelatedProducts(product);

  const handleSelectTier = (tier: DurationPrice) => {
    setSelectedTier(tier);
    toast.success(`Selected: ${tier.label} — $${tier.usd} / ₹${tier.inr}`);
  };

  const handleAddToCart = () => {
    if (product.status === "unavailable") {
      toast.error("This product is currently unavailable");
      return;
    }
    addItem(product, 1, selectedTier);
    toast.success(`${product.name} (${selectedTier.label}) added to cart`);
  };

  const handleBuyNow = () => {
    if (product.status === "unavailable") {
      toast.error("This product is currently unavailable");
      return;
    }
    addItem(product, 1, selectedTier);
    router.push("/checkout");
  };

  return (
    <>
      <ParticleBackground />
      <Navbar />
      <main className="relative z-10 min-h-screen pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <Link href="/products" className="inline-flex items-center gap-2 text-white/40 hover:text-mani-red text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Products
          </Link>

          {/* Product header */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Image */}
            <div className="glass-card rounded-3xl p-8 relative overflow-hidden group">
              <div className="absolute inset-0 bg-mani-red/5 group-hover:bg-mani-red/10 transition-all duration-500" />
              <div className="aspect-[16/10] sm:aspect-video relative z-10 rounded-2xl overflow-hidden">
                <ProductImage product={product} />
              </div>
              {/* Glowing border on hover */}
              <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-mani-red/30 transition-all duration-500" />
              {product.specialOffer && (
                <span className="absolute top-4 left-4 badge-offer text-xs font-bold px-3 py-1 rounded-lg z-20">
                  SPECIAL OFFER
                </span>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col gap-4">
              <div>
                <span className="text-white/40 text-sm uppercase tracking-wider">
                  {product.category.replace("-", " ")}
                </span>
                <h1 className="text-2xl md:text-3xl font-black text-white mt-1">{product.name}</h1>
              </div>

              {/* Status */}
              <div>
                <span className={cn(
                  "inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider",
                  product.status === "available" ? "badge-available" : "badge-unavailable"
                )}>
                  {product.status === "available" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  {product.status === "available" ? "Available" : "Unavailable"}
                </span>
              </div>

              {/* Description */}
              <p className="text-white/50 text-sm leading-relaxed">{product.description}</p>

              {/* Full description */}
              <div className="glass-card rounded-xl p-4">
                <h3 className="text-sm font-bold text-white/80 mb-2 uppercase tracking-wider">Product Information</h3>
                <p className="text-white/50 text-sm leading-relaxed">{product.fullDescription}</p>
              </div>

              {/* External links */}
              {hasLinks(product.links) && (
                <div className="mt-2">
                  <h3 className="text-sm font-bold text-white/80 mb-3 uppercase tracking-wider">Links</h3>
                  <div className="flex flex-wrap gap-3">
                    {product.links.youtube && <ExtLink href={product.links.youtube} icon={<Youtube className="w-4 h-4" />} label="YouTube" />}
                    {product.links.discord && <ExtLink href={product.links.discord} icon={<MessageCircle className="w-4 h-4" />} label="Discord" />}
                    {product.links.demo && <ExtLink href={product.links.demo} icon={<ExternalLink className="w-4 h-4" />} label="Demo" />}
                    {product.links.documentation && <ExtLink href={product.links.documentation} icon={<BookOpen className="w-4 h-4" />} label="Documentation" />}
                    {product.links.custom && <ExtLink href={product.links.custom} icon={<ExternalLink className="w-4 h-4" />} label="Visit" />}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ===== PRICING SECTION ===== */}
          <div className="mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-black text-white mb-2">CHOOSE YOUR PLAN</h2>
                <p className="text-white/40">Select a duration that fits your needs</p>
                <div className="w-20 h-1 bg-mani-red rounded-full mx-auto mt-4" />
              </div>
            </motion.div>

            {/* Pricing cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {DEFAULT_PRICING.map((tier, i) => (
                <motion.div
                  key={tier.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <PricingCard
                    tier={tier}
                    selected={selectedTier.id === tier.id}
                    onSelect={() => handleSelectTier(tier)}
                    onBuy={() => {
                      handleSelectTier(tier);
                      handleBuyNow();
                    }}
                  />
                </motion.div>
              ))}
            </div>

            {/* Selected plan summary */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedTier.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="glass-card rounded-2xl p-6 mt-8 max-w-2xl mx-auto"
              >
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <p className="text-white/30 text-xs uppercase tracking-wider mb-1">Selected Plan</p>
                    <p className="font-bold text-white text-lg">{product.name}</p>
                    <p className="text-white/50 text-sm">{selectedTier.label}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black mani-red">${selectedTier.usd}</p>
                    <p className="text-white/50 text-sm">₹{selectedTier.inr.toLocaleString("en-IN")}</p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleAddToCart}
                      disabled={product.status === "unavailable"}
                      className="btn-ghost inline-flex items-center gap-2 disabled:opacity-30"
                    >
                      <ShoppingCart className="w-4 h-4" /> Add to Cart
                    </button>
                    <button
                      onClick={handleBuyNow}
                      disabled={product.status === "unavailable"}
                      className="btn-glow inline-flex items-center gap-2 disabled:opacity-30"
                    >
                      <Zap className="w-4 h-4" /> Buy Now
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Related products */}
          {related.length > 0 && (
            <div className="mb-16">
              <h2 className="text-xl font-black text-white mb-6">Related Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {related.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

function PricingCard({ tier, selected, onSelect, onBuy }: {
  tier: DurationPrice;
  selected: boolean;
  onSelect: () => void;
  onBuy: () => void;
}) {
  const isLifetime = tier.id === "lifetime";

  return (
    <div
      onClick={onSelect}
      className={cn(
        "glass-card rounded-2xl p-6 cursor-pointer transition-all duration-300 relative overflow-hidden group",
        selected && "border-mani-red shadow-glow-red-lg",
        isLifetime && "ring-1 ring-amber-500/30"
      )}
    >
      {/* Glow effect */}
      <div className={cn(
        "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
        isLifetime ? "bg-amber-500/5" : "bg-mani-red/5"
      )} />

      <div className="relative z-10">
        {/* Badge */}
        {tier.badge && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider whitespace-nowrap shadow-lg">
              {tier.badge}
            </span>
          </div>
        )}

        {/* Icon */}
        <div className="flex justify-center mb-4 mt-2">
          {isLifetime ? (
            <Crown className="w-8 h-8 text-amber-500" />
          ) : (
            <Zap className={cn("w-8 h-8", selected ? "text-mani-red" : "text-white/30")} />
          )}
        </div>

        {/* Duration */}
        <h3 className={cn(
          "text-center font-black text-sm mb-3 uppercase tracking-wider",
          isLifetime ? "text-amber-400" : selected ? "text-mani-red" : "text-white"
        )}>
          {tier.label}
        </h3>

        {/* USD Price */}
        <div className="text-center mb-1">
          <span className={cn("text-2xl font-black", isLifetime ? "text-amber-400" : "mani-red")}>
            ${tier.usd}
          </span>
        </div>

        {/* INR Price */}
        <div className="text-center mb-4">
          <span className="text-white/40 text-sm">
            ₹{tier.inr.toLocaleString("en-IN")}
          </span>
        </div>

        {/* Select button */}
        <button
          onClick={(e) => { e.stopPropagation(); onSelect(); }}
          className={cn(
            "w-full py-2 rounded-lg text-xs font-bold transition-all mb-2",
            selected
              ? "bg-mani-red text-white shadow-glow-red"
              : "glass text-white/60 hover:text-white hover:border-mani-red/40"
          )}
        >
          {selected ? "✓ Selected" : "Select Plan"}
        </button>

        {/* Buy button */}
        <button
          onClick={(e) => { e.stopPropagation(); onBuy(); }}
          className={cn(
            "w-full py-2 rounded-lg text-xs font-bold transition-all",
            isLifetime
              ? "bg-gradient-to-r from-amber-500 to-amber-600 text-black hover:shadow-lg hover:shadow-amber-500/30"
              : "bg-mani-red/20 border border-mani-red/30 text-mani-red hover:bg-mani-red hover:text-white"
          )}
        >
          Purchase
        </button>
      </div>
    </div>
  );
}

function hasLinks(links?: ProductLinks): boolean {
  if (!links) return false;
  return !!(links.youtube || links.discord || links.demo || links.documentation || links.custom);
}

function ExtLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 glass px-4 py-2 rounded-lg text-sm text-white/70 hover:text-mani-red hover:border-mani-red/40 transition-all"
    >
      {icon} {label}
    </a>
  );
}
