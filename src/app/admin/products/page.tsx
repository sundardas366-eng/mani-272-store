"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Search, Edit, Eye, Image as ImageIcon } from "lucide-react";
import { ParticleBackground } from "@/components/animations/ParticleBackground";
import { Navbar } from "@/components/layout/Navbar";
import { PRODUCTS } from "@/data/products";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

export default function AdminProductsPage() {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>(PRODUCTS);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.products)) {
          setProducts(data.products);
        }
      })
      .catch((err) => console.warn("Could not fetch updated products:", err));
  }, []);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <ParticleBackground />
      <Navbar />
      <main className="relative z-10 min-h-screen pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="mani-brand text-2xl md:text-3xl">
                <span className="mani-red">Product</span> <span className="mani-white">Management</span>
              </h1>
              <p className="text-white/40 text-xs sm:text-sm mt-1">
                Showing all {products.length} official store products with editable Image URLs
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Search 13 official products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-mani pl-10 w-full"
            />
          </div>

          {/* Products Table */}
          <div className="glass-card rounded-2xl overflow-hidden border border-white/10">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.02]">
                    <th className="text-left p-4 text-white/40 font-bold uppercase text-xs tracking-wider">Preview</th>
                    <th className="text-left p-4 text-white/40 font-bold uppercase text-xs tracking-wider">Product Name</th>
                    <th className="text-left p-4 text-white/40 font-bold uppercase text-xs tracking-wider">Category</th>
                    <th className="text-right p-4 text-white/40 font-bold uppercase text-xs tracking-wider">Price (INR)</th>
                    <th className="text-center p-4 text-white/40 font-bold uppercase text-xs tracking-wider">Availability</th>
                    <th className="text-right p-4 text-white/40 font-bold uppercase text-xs tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filtered.map((p) => (
                    <tr key={p.id} className="hover:bg-white/[0.03] transition-colors">
                      {/* Image Thumbnail */}
                      <td className="p-4 w-20">
                        <div className="w-14 h-10 rounded-lg overflow-hidden bg-black/60 border border-white/10 relative flex items-center justify-center">
                          {p.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = "/images/products/aimkill.svg";
                              }}
                            />
                          ) : (
                            <ImageIcon className="w-4 h-4 text-white/30" />
                          )}
                        </div>
                      </td>

                      <td className="p-4">
                        <Link
                          href={`/products/${p.slug}`}
                          className="font-bold text-white hover:text-mani-red transition-colors block"
                        >
                          {p.name}
                        </Link>
                        <span className="text-[11px] text-white/40 font-mono">/{p.slug}</span>
                      </td>

                      <td className="p-4 text-white/60 capitalize text-xs">
                        {p.category.replace("-", " ")}
                      </td>

                      <td className="p-4 text-right font-black text-mani-red">
                        {formatPrice(p.price)}
                      </td>

                      <td className="p-4 text-center">
                        <span
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${
                            p.status === "available" ? "badge-available" : "badge-unavailable"
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/products/${p.slug}`}
                            target="_blank"
                            className="w-8 h-8 rounded-lg glass flex items-center justify-center text-white/60 hover:text-blue-400 hover:border-blue-400/40 transition-all"
                            title="View on Store"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/admin/products/${p.id}`}
                            className="w-8 h-8 rounded-lg glass flex items-center justify-center text-white/60 hover:text-mani-red hover:border-mani-red/40 transition-all"
                            title="Edit Product & Image URL"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
