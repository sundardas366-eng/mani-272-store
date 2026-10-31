"use client";

import Link from "next/link";
import { useState } from "react";
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import { ParticleBackground } from "@/components/animations/ParticleBackground";
import { Navbar } from "@/components/layout/Navbar";
import { PRODUCTS } from "@/data/products";
import { formatPrice } from "@/lib/utils";

export default function AdminProductsPage() {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState(PRODUCTS);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  return (
    <>
      <ParticleBackground />
      <Navbar />
      <main className="relative z-10 min-h-screen pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="mani-brand text-2xl">
              <span className="mani-red">Product</span> <span className="mani-white">Management</span>
            </h1>
            <Link href="/admin/products/new" className="btn-glow inline-flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Product
            </Link>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-mani pl-10" />
          </div>

          {/* Table */}
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left p-4 text-white/40 font-bold uppercase text-xs tracking-wider">Name</th>
                    <th className="text-left p-4 text-white/40 font-bold uppercase text-xs tracking-wider">Category</th>
                    <th className="text-right p-4 text-white/40 font-bold uppercase text-xs tracking-wider">Price</th>
                    <th className="text-center p-4 text-white/40 font-bold uppercase text-xs tracking-wider">Status</th>
                    <th className="text-right p-4 text-white/40 font-bold uppercase text-xs tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <tr key={p.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="p-4">
                        <Link href={`/products/${p.slug}`} className="font-bold text-white hover:text-mani-red">{p.name}</Link>
                      </td>
                      <td className="p-4 text-white/50 capitalize">{p.category.replace("-", " ")}</td>
                      <td className="p-4 text-right font-bold mani-red">{formatPrice(p.price)}</td>
                      <td className="p-4 text-center">
                        <span className={`text-xs font-bold px-2 py-1 rounded-md uppercase ${p.status === "available" ? "badge-available" : "badge-unavailable"}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-end gap-2">
                          <Link href={`/products/${p.slug}`} className="w-8 h-8 rounded-lg glass flex items-center justify-center text-white/60 hover:text-blue-400">
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                          <Link href={`/admin/products/${p.id}`} className="w-8 h-8 rounded-lg glass flex items-center justify-center text-white/60 hover:text-amber-400">
                            <Edit className="w-3.5 h-3.5" />
                          </Link>
                          <button onClick={() => handleDelete(p.id)} className="w-8 h-8 rounded-lg glass flex items-center justify-center text-white/60 hover:text-red-500">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
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
