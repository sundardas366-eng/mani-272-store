"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ParticleBackground } from "@/components/animations/ParticleBackground";
import { Navbar } from "@/components/layout/Navbar";
import { PRODUCTS, CATEGORIES } from "@/data/products";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const product = PRODUCTS.find((p) => p.id === id);

  if (!product) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-white/40 mb-4">Product not found</p>
            <Link href="/admin/products" className="btn-glow">Back to Products</Link>
          </div>
        </main>
      </>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo — save changes. In production, update Supabase database.
    toast.success("Product updated successfully (demo)");
    window.location.href = "/admin/products";
  };

  return (
    <>
      <ParticleBackground />
      <Navbar />
      <main className="relative z-10 min-h-screen pt-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/admin/products" className="inline-flex items-center gap-2 text-white/40 hover:text-mani-red text-sm mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Products
          </Link>

          <h1 className="mani-brand text-2xl mb-2">
            <span className="mani-red">Edit</span> <span className="mani-white">{product.name}</span>
          </h1>
          <p className="text-white/30 text-sm mb-8">Current price: {formatPrice(product.price)}</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic info */}
            <div className="glass-card rounded-2xl p-6 space-y-4">
              <h2 className="font-bold text-white">Basic Information</h2>
              <div>
                <label className="text-xs font-bold text-white/40 uppercase tracking-wider mb-1.5 block">Product Name</label>
                <input type="text" required defaultValue={product.name} className="input-mani" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-white/40 uppercase tracking-wider mb-1.5 block">Category</label>
                  <select defaultValue={product.category} className="input-mani">
                    {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-white/40 uppercase tracking-wider mb-1.5 block">Price (INR)</label>
                  <input type="number" required defaultValue={product.price} className="input-mani" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-white/40 uppercase tracking-wider mb-1.5 block">Short Description</label>
                <input type="text" defaultValue={product.description} className="input-mani" />
              </div>
              <div>
                <label className="text-xs font-bold text-white/40 uppercase tracking-wider mb-1.5 block">Full Description</label>
                <textarea className="input-mani" rows={4} defaultValue={product.fullDescription} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-white/40 uppercase tracking-wider mb-1.5 block">Status</label>
                  <select defaultValue={product.status} className="input-mani">
                    <option value="available">Available</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2 pt-6">
                  <label className="flex items-center gap-2 text-white/60 text-sm cursor-pointer">
                    <input type="checkbox" defaultChecked={product.featured} /> Featured
                  </label>
                  <label className="flex items-center gap-2 text-white/60 text-sm cursor-pointer">
                    <input type="checkbox" defaultChecked={product.bestSeller} /> Best Seller
                  </label>
                  <label className="flex items-center gap-2 text-white/60 text-sm cursor-pointer">
                    <input type="checkbox" defaultChecked={product.specialOffer} /> Special Offer
                  </label>
                </div>
              </div>
            </div>

            {/* Image upload */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="font-bold text-white mb-4">Product Image</h2>
              <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-mani-red/40 transition-all">
                <div className="text-3xl mb-2">📷</div>
                <p className="text-white/40 text-sm">Current: {product.image} — upload to replace</p>
                <input type="file" accept="image/*" className="hidden" />
                <button type="button" className="btn-ghost mt-3">Choose New Image</button>
                <p className="text-white/20 text-xs mt-2">PNG, JPG, SVG — max 2MB</p>
              </div>
            </div>

            {/* External links */}
            <div className="glass-card rounded-2xl p-6 space-y-4">
              <h2 className="font-bold text-white">External Links</h2>
              <div>
                <label className="text-xs font-bold text-white/40 uppercase tracking-wider mb-1.5 block">YouTube Video URL</label>
                <input type="url" defaultValue={product.links.youtube || ""} className="input-mani" placeholder="https://youtube.com/watch?v=..." />
              </div>
              <div>
                <label className="text-xs font-bold text-white/40 uppercase tracking-wider mb-1.5 block">Discord Invite URL</label>
                <input type="url" defaultValue={product.links.discord || ""} className="input-mani" placeholder="https://discord.gg/..." />
              </div>
              <div>
                <label className="text-xs font-bold text-white/40 uppercase tracking-wider mb-1.5 block">Demo URL</label>
                <input type="url" defaultValue={product.links.demo || ""} className="input-mani" placeholder="https://..." />
              </div>
              <div>
                <label className="text-xs font-bold text-white/40 uppercase tracking-wider mb-1.5 block">Documentation URL</label>
                <input type="url" defaultValue={product.links.documentation || ""} className="input-mani" placeholder="https://..." />
              </div>
              <div>
                <label className="text-xs font-bold text-white/40 uppercase tracking-wider mb-1.5 block">Custom URL</label>
                <input type="url" defaultValue={product.links.custom || ""} className="input-mani" placeholder="https://..." />
              </div>
            </div>

            <div className="flex gap-3">
              <button type="submit" className="btn-glow">Save Changes</button>
              <Link href="/admin/products" className="btn-ghost">Cancel</Link>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
