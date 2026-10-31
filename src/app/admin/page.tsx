"use client";

import Link from "next/link";
import { Package, Users, ShoppingBag, DollarSign, Plus, Settings, BarChart3 } from "lucide-react";
import { ParticleBackground } from "@/components/animations/ParticleBackground";
import { Navbar } from "@/components/layout/Navbar";
import { PRODUCTS } from "@/data/products";
import { formatPrice } from "@/lib/utils";

export default function AdminPage() {
  // Demo admin — in production, verify admin role server-side.
  // const { data: { user } } = await supabase.auth.getUser()
  // if (!user || !ADMIN_EMAILS.includes(user.email!)) redirect("/login")

  const orders = JSON.parse(typeof window !== "undefined" ? localStorage.getItem("mani-272-orders") || "[]" : "[]");
  const totalRevenue = orders.reduce((s: number, o: any) => s + (o.total || 0), 0);

  const cards = [
    { icon: <Package className="w-5 h-5" />, label: "Products", value: String(PRODUCTS.length), href: "/admin/products", color: "text-blue-400" },
    { icon: <ShoppingBag className="w-5 h-5" />, label: "Orders", value: String(orders.length), href: "/admin/orders", color: "text-amber-400" },
    { icon: <Users className="w-5 h-5" />, label: "Users", value: "0", href: "/admin/users", color: "text-green-400" },
    { icon: <DollarSign className="w-5 h-5" />, label: "Revenue", value: formatPrice(totalRevenue), href: "/admin/orders", color: "text-mani-red" },
  ];

  const recentOrders = orders.slice(-5).reverse();

  return (
    <>
      <ParticleBackground />
      <Navbar />
      <main className="relative z-10 min-h-screen pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="mani-brand text-2xl md:text-3xl">
              <span className="mani-red">Admin</span> <span className="mani-white">Dashboard</span>
            </h1>
            <Link href="/admin/products/new" className="btn-glow inline-flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Product
            </Link>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {cards.map((c) => (
              <Link key={c.label} href={c.href}>
                <div className="glass-card rounded-xl p-6 hover:border-mani-red/40 transition-all">
                  <div className={`flex items-center gap-2 mb-2 ${c.color}`}>{c.icon}<span className="text-xs text-white/40 uppercase tracking-wider">{c.label}</span></div>
                  <div className="text-xl font-black text-white">{c.value}</div>
                </div>
              </Link>
            ))}
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Link href="/admin/products" className="glass-card rounded-xl p-6 hover:border-mani-red/40 transition-all">
              <Package className="w-6 h-6 text-blue-400 mb-3" />
              <h3 className="font-bold text-white mb-1">Product Management</h3>
              <p className="text-white/30 text-xs">Add, edit, delete products. Upload images. Manage links.</p>
            </Link>
            <Link href="/admin/orders" className="glass-card rounded-xl p-6 hover:border-mani-red/40 transition-all">
              <ShoppingBag className="w-6 h-6 text-amber-400 mb-3" />
              <h3 className="font-bold text-white mb-1">Order Management</h3>
              <p className="text-white/30 text-xs">View and update orders. Manage customer details.</p>
            </Link>
            <Link href="/admin/settings" className="glass-card rounded-xl p-6 hover:border-mani-red/40 transition-all">
              <Settings className="w-6 h-6 text-green-400 mb-3" />
              <h3 className="font-bold text-white mb-1">Website Settings</h3>
              <p className="text-white/30 text-xs">Logo, banner, colors, announcement, Discord, YouTube.</p>
            </Link>
          </div>

          {/* Recent orders */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 mani-red" />
              <h2 className="font-bold text-white">Recent Orders</h2>
            </div>
            {recentOrders.length === 0 ? (
              <p className="text-white/30 text-sm text-center py-8">No orders yet.</p>
            ) : (
              <div className="space-y-2">
                {recentOrders.map((o: any) => (
                  <div key={o.id} className="flex justify-between items-center py-2 border-b border-white/5">
                    <div>
                      <span className="font-bold text-white text-sm">{o.id}</span>
                      <span className="text-white/30 text-xs ml-2">{o.customerName || "Customer"}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-white/40 text-sm">{formatPrice(o.total)}</span>
                      <span className="text-xs font-bold px-2 py-1 rounded-md bg-amber-500/15 text-amber-500 uppercase">{o.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
