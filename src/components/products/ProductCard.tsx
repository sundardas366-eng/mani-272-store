"use client";

import { useRef } from "react";
import Link from "next/link";
import { ShoppingCart, Eye, Star, Zap, Clock } from "lucide-react";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { DEFAULT_PRICING } from "@/data/settings";
import toast from "react-hot-toast";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.status === "unavailable") {
      toast.error("This product is currently unavailable");
      return;
    }
    // Default to 1 day tier or first tier
    addItem(product, 1, DEFAULT_PRICING[0]);
    toast.success(`${product.name} (1 Day) added to cart`);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -7;
    const rotateY = ((x - centerX) / centerX) * 7;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    card.style.setProperty("--glare-x", `${(x / rect.width) * 100}%`);
    card.style.setProperty("--glare-y", `${(y / rect.height) * 100}%`);
  };

  const handleMouseEnter = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transition = "transform 0.12s ease-out, border-color 0.3s ease, box-shadow 0.3s ease";
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transition = "transform 0.5s cubic-bezier(0.23, 1, 0.32, 1), border-color 0.3s ease, box-shadow 0.3s ease";
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)";
  };

  return (
    <Link href={`/products/${product.slug}`} className="block h-full">
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ transformStyle: "preserve-3d" }}
        className="glass-card rounded-2xl overflow-hidden group cursor-pointer h-full flex flex-col will-change-transform hover:border-mani-red/70 hover:shadow-[0_0_35px_rgba(245,11,0,0.35)] relative"
      >
        {/* Animated Glow Border Highlight */}
        <div className="absolute inset-0 bg-gradient-to-b from-mani-red/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

        {/* Dynamic 3D Glare Reflection */}
        <div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"
          style={{
            background:
              "radial-gradient(circle 240px at var(--glare-x, 50%) var(--glare-y, 50%), rgba(255, 255, 255, 0.08), transparent 70%)",
          }}
        />

        {/* Product Image */}
        <div className="relative aspect-[16/10] bg-mani-grey/70 overflow-hidden">
          <ProductImage product={product} />

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
            {product.specialOffer && (
              <span className="badge-offer text-[10px] font-black px-2.5 py-1 rounded-md shadow-md backdrop-blur-md">
                SPECIAL OFFER
              </span>
            )}
            {product.featured && (
              <span className="bg-mani-red/90 text-white text-[10px] font-black px-2.5 py-1 rounded-md shadow-md backdrop-blur-md flex items-center gap-1">
                <Zap className="w-3 h-3 fill-white" /> FEATURED
              </span>
            )}
          </div>

          {product.bestSeller && (
            <span className="absolute top-2.5 right-2.5 bg-amber-500/90 text-black text-[10px] font-black px-2.5 py-1 rounded-md shadow-md backdrop-blur-md flex items-center gap-1 z-10">
              <Star className="w-3 h-3 fill-black" /> BEST SELLER
            </span>
          )}

          {/* Quick overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-mani-black via-transparent to-transparent opacity-60" />
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1 relative z-10">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[10px] font-bold text-mani-red uppercase tracking-wider">
              {product.category.replace("-", " ")}
            </span>
            <span
              className={cn(
                "text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider",
                product.status === "available"
                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                  : "bg-red-500/20 text-red-400 border border-red-500/30"
              )}
            >
              {product.status === "available" ? "Active" : "Out of Stock"}
            </span>
          </div>

          <h3 className="font-black text-white text-base mb-1.5 group-hover:text-mani-red transition-colors line-clamp-1">
            {product.name}
          </h3>

          <p className="text-white/50 text-xs mb-3 line-clamp-2 leading-relaxed flex-1">
            {product.description}
          </p>

          {/* Duration Options Pill Bar */}
          <div className="mb-3.5 bg-white/[0.03] border border-white/5 rounded-lg p-1.5 flex items-center justify-between text-[10px]">
            <span className="text-white/40 flex items-center gap-1 pl-1">
              <Clock className="w-3 h-3 text-mani-red" /> Plans:
            </span>
            <div className="flex items-center gap-1 font-semibold text-white/70">
              <span className="bg-white/10 px-1.5 py-0.5 rounded text-[9px]">1D</span>
              <span className="bg-white/10 px-1.5 py-0.5 rounded text-[9px]">3D</span>
              <span className="bg-white/10 px-1.5 py-0.5 rounded text-[9px]">7D</span>
              <span className="bg-white/10 px-1.5 py-0.5 rounded text-[9px]">30D</span>
              <span className="bg-mani-red/20 text-mani-red px-1.5 py-0.5 rounded text-[9px]">LT</span>
            </div>
          </div>

          {/* Price + Action Buttons */}
          <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
            <div>
              <span className="text-white/40 text-[10px] block leading-none">Starting from</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-mani-red font-black text-base">$2</span>
                <span className="text-white/30 text-[11px]">/ ₹119</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="btn-glow !py-1.5 !px-3 !text-xs inline-flex items-center gap-1 font-bold">
                <Eye className="w-3.5 h-3.5" /> Details
              </span>
              <button
                onClick={handleAddToCart}
                disabled={product.status === "unavailable"}
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/80 hover:bg-mani-red hover:text-white hover:border-mani-red transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                title="Add to Cart"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function ProductImage({ product }: { product: Product }) {
  const fallback = `/images/products/${product.slug}.svg`;
  return (
    <div className="w-full h-full relative overflow-hidden flex items-center justify-center bg-mani-black">
      <img
        src={product.image || fallback}
        alt={product.name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
        onError={(e) => {
          // Fallback if image fails to load
          const target = e.currentTarget;
          target.onerror = null;
          target.src = "/images/products/silent-aim.png";
        }}
      />
    </div>
  );
}
