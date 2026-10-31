"use client";

import { useState, useMemo } from "react";
import { Search, Filter } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ParticleBackground } from "@/components/animations/ParticleBackground";
import { ProductCard } from "@/components/products/ProductCard";
import { PRODUCTS, CATEGORIES } from "@/data/products";
import type { ProductCategory } from "@/types";

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState<string>("all");

  const filtered = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchCat = activeCat === "all" || p.category === activeCat;
      const matchSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [search, activeCat]);

  return (
    <>
      <ParticleBackground />
      <Navbar />
      <main className="relative z-10 min-h-screen">
        {/* Header */}
        <div className="bg-mani-radial pt-12 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="mani-brand text-3xl md:text-4xl mb-2">
              <span className="mani-red">All</span> <span className="mani-white">Products</span>
            </h1>
            <p className="text-white/40">Browse our complete catalog of premium digital products</p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="sticky top-16 z-40 bg-mani-black/80 backdrop-blur-xl border-y border-white/5 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              {/* Search */}
              <div className="relative flex-1 w-full md:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input-mani pl-10"
                />
              </div>

              {/* Categories */}
              <div className="flex gap-2 overflow-x-auto pb-1">
                <CatButton
                  active={activeCat === "all"}
                  onClick={() => setActiveCat("all")}
                >
                  All
                </CatButton>
                {CATEGORIES.map((cat) => (
                  <CatButton
                    key={cat.id}
                    active={activeCat === cat.id}
                    onClick={() => setActiveCat(cat.id)}
                  >
                    {cat.name}
                  </CatButton>
                ))}
              </div>

              {/* Result count */}
              <div className="text-white/30 text-sm whitespace-nowrap">
                <Filter className="w-4 h-4 inline mr-1" />
                {filtered.length} products
              </div>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-4xl mb-4">🔍</div>
              <p className="text-white/40 text-lg">No products found</p>
              <p className="text-white/30 text-sm mt-1">Try a different search or category</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

function CatButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
        active
          ? "bg-mani-red text-white shadow-glow-red"
          : "glass text-white/60 hover:text-white hover:border-mani-red/40"
      }`}
    >
      {children}
    </button>
  );
}
