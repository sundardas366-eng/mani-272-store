"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Eye, CheckCircle2, Image as ImageIcon, Sparkles } from "lucide-react";
import { ParticleBackground } from "@/components/animations/ParticleBackground";
import { Navbar } from "@/components/layout/Navbar";
import { PRODUCTS, CATEGORIES } from "@/data/products";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";
import type { Product } from "@/types";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState("panel");
  const [price, setPrice] = useState<number>(0);
  const [description, setDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [status, setStatus] = useState<"available" | "unavailable">("available");
  const [featured, setFeatured] = useState(false);
  const [bestSeller, setBestSeller] = useState(false);
  const [specialOffer, setSpecialOffer] = useState(false);

  useEffect(() => {
    // 1. First populate from static products
    const initial = PRODUCTS.find((p) => p.id === id || p.slug === id);
    if (initial) {
      setProduct(initial);
      setName(initial.name);
      setImageUrl(initial.image || "");
      setCategory(initial.category);
      setPrice(initial.price);
      setDescription(initial.description);
      setFullDescription(initial.fullDescription);
      setStatus(initial.status);
      setFeatured(initial.featured);
      setBestSeller(initial.bestSeller);
      setSpecialOffer(initial.specialOffer);
    }

    // 2. Fetch latest from API
    fetch(`/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.product) {
          const p = data.product;
          setProduct(p);
          setName(p.name);
          setImageUrl(p.image || "");
          setCategory(p.category);
          setPrice(p.price);
          setDescription(p.description);
          setFullDescription(p.fullDescription);
          setStatus(p.status);
          setFeatured(p.featured);
          setBestSeller(p.bestSeller);
          setSpecialOffer(p.specialOffer);
        }
      })
      .catch((err) => console.warn("Could not fetch product:", err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    setSaving(true);

    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          image: imageUrl.trim(),
          category,
          price: Number(price),
          description: description.trim(),
          fullDescription: fullDescription.trim(),
          status,
          featured,
          bestSeller,
          specialOffer,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(`Image URL & details saved for ${name}!`);
        router.push("/admin/products");
      } else {
        toast.error(data.error || "Failed to update product");
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Network error saving product");
    } finally {
      setSaving(false);
    }
  };

  if (loading && !product) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center">
          <div className="loader-ring" />
        </main>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center glass-card rounded-2xl p-8 max-w-md mx-auto">
            <p className="text-white/40 mb-4">Product not found</p>
            <Link href="/admin/products" className="btn-glow">
              Back to Products
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <ParticleBackground />
      <Navbar />
      <main className="relative z-10 min-h-screen pt-8 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 text-white/40 hover:text-mani-red text-sm mb-6 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Product List
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="mani-brand text-2xl md:text-3xl">
                <span className="mani-red">Edit</span> <span className="mani-white">{product.name}</span>
              </h1>
              <p className="text-white/40 text-xs sm:text-sm mt-1">
                Update product image URL, pricing, description, and store availability.
              </p>
            </div>
            <Link
              href={`/products/${product.slug}`}
              target="_blank"
              className="btn-ghost inline-flex items-center gap-2 text-xs self-start sm:self-auto"
            >
              <Eye className="w-3.5 h-3.5" /> View on Store
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 1. PRODUCT IMAGE URL & LIVE PREVIEW BOX */}
            <div className="glass-card rounded-2xl p-6 border-mani-red/30">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-white text-base flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-mani-red" /> Product Image URL & Live Preview
                </h2>
                <span className="text-xs text-mani-red font-medium">Automatic Instant Replacement</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* Input Column */}
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 block">
                      Product Image URL
                    </label>
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://cdn.discordapp.com/attachments/... or https://..."
                      className="input-mani w-full text-xs font-mono"
                    />
                    <p className="text-white/30 text-[11px] mt-1.5">
                      Paste any Discord CDN image URL, web image URL, or local path.
                    </p>
                  </div>

                  {imageUrl && (
                    <button
                      type="button"
                      onClick={() => setImageUrl("")}
                      className="text-xs text-red-400 hover:text-red-300 transition"
                    >
                      Clear image URL (revert to clean default placeholder)
                    </button>
                  )}
                </div>

                {/* Live Preview Box */}
                <div className="flex flex-col items-center justify-center">
                  <span className="text-[11px] font-bold text-white/40 uppercase tracking-wider mb-2">
                    Card Preview
                  </span>
                  <div className="w-full max-w-[260px] aspect-[16/10] rounded-xl overflow-hidden bg-black/70 border-2 border-mani-red/40 relative shadow-lg shadow-mani-red/10 flex items-center justify-center group">
                    {imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={imageUrl}
                        alt="Product Live Preview"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = "/images/products/aimkill.svg";
                        }}
                      />
                    ) : (
                      <div className="text-center p-4">
                        <ImageIcon className="w-8 h-8 text-white/20 mx-auto mb-2" />
                        <span className="text-[11px] text-white/40 block">Default Placeholder</span>
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-emerald-400 mt-2 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Adapts cleanly without distortion
                  </span>
                </div>
              </div>
            </div>

            {/* 2. BASIC PRODUCT INFORMATION */}
            <div className="glass-card rounded-2xl p-6 space-y-4">
              <h2 className="font-bold text-white text-base">Product Details</h2>

              <div>
                <label className="text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 block">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-mani w-full"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 block">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="input-mani w-full capitalize"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id} className="bg-mani-black">
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 block">
                    Product Price (INR) *
                  </label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="input-mani w-full"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 block">
                  Short Description *
                </label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input-mani w-full"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 block">
                  Full Description
                </label>
                <textarea
                  rows={4}
                  value={fullDescription}
                  onChange={(e) => setFullDescription(e.target.value)}
                  className="input-mani w-full leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 block">
                    Product Availability (Status) *
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="input-mani w-full"
                  >
                    <option value="available" className="bg-mani-black">
                      Available (Active in Store)
                    </option>
                    <option value="unavailable" className="bg-mani-black">
                      Unavailable (Out of Stock)
                    </option>
                  </select>
                </div>

                <div className="flex flex-col gap-2 pt-2 sm:pt-6">
                  <label className="flex items-center gap-2 text-white/70 text-xs font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="accent-mani-red w-4 h-4 rounded"
                    />{" "}
                    Featured Product Badge
                  </label>
                  <label className="flex items-center gap-2 text-white/70 text-xs font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={bestSeller}
                      onChange={(e) => setBestSeller(e.target.checked)}
                      className="accent-mani-red w-4 h-4 rounded"
                    />{" "}
                    Best Seller Badge
                  </label>
                  <label className="flex items-center gap-2 text-white/70 text-xs font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={specialOffer}
                      onChange={(e) => setSpecialOffer(e.target.checked)}
                      className="accent-mani-red w-4 h-4 rounded"
                    />{" "}
                    Special Offer Badge
                  </label>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="btn-glow inline-flex items-center gap-2 py-3 px-6 text-sm font-bold disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <div className="loader-ring !w-4 !h-4 !border-2" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Save Changes & Update Image URL
                  </>
                )}
              </button>
              <Link href="/admin/products" className="btn-ghost py-3 px-6 text-sm">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
