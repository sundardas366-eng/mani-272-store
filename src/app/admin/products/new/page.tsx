"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Image as ImageIcon } from "lucide-react";
import { ParticleBackground } from "@/components/animations/ParticleBackground";
import { Navbar } from "@/components/layout/Navbar";
import { CATEGORIES } from "@/data/products";
import toast from "react-hot-toast";

export default function NewProductPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState("panel");
  const [price, setPrice] = useState<number>(1500);
  const [description, setDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [status, setStatus] = useState<"available" | "unavailable">("available");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    toast.success(`Product "${name}" registered successfully!`);
    router.push("/admin/products");
  };

  return (
    <>
      <ParticleBackground />
      <Navbar />
      <main className="relative z-10 min-h-screen pt-8 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 text-white/40 hover:text-mani-red text-sm mb-6 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Products
          </Link>

          <h1 className="mani-brand text-2xl md:text-3xl mb-8">
            <span className="mani-red">Add</span> <span className="mani-white">Product</span>
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image URL with live preview */}
            <div className="glass-card rounded-2xl p-6 border-mani-red/30">
              <h2 className="font-bold text-white text-base mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-mani-red" /> Product Image URL & Preview
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
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
                    Paste image URL (Discord CDN or direct web link).
                  </p>
                </div>

                <div className="flex flex-col items-center justify-center">
                  <div className="w-full max-w-[240px] aspect-[16/10] rounded-xl overflow-hidden bg-black/70 border-2 border-mani-red/30 flex items-center justify-center">
                    {imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = "/images/products/aimkill.svg";
                        }}
                      />
                    ) : (
                      <div className="text-center p-4">
                        <ImageIcon className="w-8 h-8 text-white/20 mx-auto mb-2" />
                        <span className="text-[11px] text-white/40">Default Placeholder</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Basic Info */}
            <div className="glass-card rounded-2xl p-6 space-y-4">
              <h2 className="font-bold text-white text-base">Basic Information</h2>
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
                  placeholder="e.g. BASIC"
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
                    Price (INR) *
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
                  placeholder="One-line summary"
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
                  className="input-mani w-full"
                  placeholder="Detailed product features"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 block">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="input-mani w-full"
                >
                  <option value="available" className="bg-mani-black">
                    Available
                  </option>
                  <option value="unavailable" className="bg-mani-black">
                    Unavailable
                  </option>
                </select>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={saving}
                className="btn-glow inline-flex items-center gap-2 py-3 px-6 text-sm font-bold"
              >
                <Save className="w-4 h-4" /> Save Product
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
