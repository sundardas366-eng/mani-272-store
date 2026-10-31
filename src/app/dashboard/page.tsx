"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Package, ShoppingBag, Settings, LogOut, LayoutDashboard } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ParticleBackground } from "@/components/animations/ParticleBackground";
import { formatPrice, formatDate } from "@/lib/utils";

interface MockUser {
  email: string;
  name: string;
  role: string;
}

interface MockOrder {
  id: string;
  items: { productId: string; productName: string; price: number; quantity: number }[];
  total: number;
  status: string;
  createdAt: string;
  customerEmail?: string;
  customerName?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<MockUser | null>(null);
  const [orders, setOrders] = useState<MockOrder[]>([]);
  const [tab, setTab] = useState<"overview" | "orders" | "settings">("overview");

  useEffect(() => {
    // Demo — replace with Supabase auth.getUser() in production
    const stored = localStorage.getItem("mani-272-user");
    if (!stored) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(stored));

    const storedOrders = JSON.parse(localStorage.getItem("mani-272-orders") || "[]");
    const userOrders = storedOrders.filter((o: MockOrder) => o.customerEmail === JSON.parse(stored).email);
    setOrders(userOrders);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("mani-272-user");
    router.push("/");
  };

  if (!user) return null;

  return (
    <>
      <ParticleBackground />
      <Navbar />
      <main className="relative z-10 min-h-screen pt-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="mani-brand text-2xl md:text-3xl mb-8">
            <span className="mani-white">Welcome, </span><span className="mani-red">{user.name}</span>
          </h1>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto">
            <TabBtn active={tab === "overview"} onClick={() => setTab("overview")} icon={<LayoutDashboard className="w-4 h-4" />} label="Overview" />
            <TabBtn active={tab === "orders"} onClick={() => setTab("orders")} icon={<ShoppingBag className="w-4 h-4" />} label="Orders" />
            <TabBtn active={tab === "settings"} onClick={() => setTab("settings")} icon={<Settings className="w-4 h-4" />} label="Settings" />
          </div>

          {/* Overview */}
          {tab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatBox icon={<User className="w-5 h-5" />} label="Account" value={user.name} />
              <StatBox icon={<Package className="w-5 h-5" />} label="Total Orders" value={String(orders.length)} />
              <StatBox icon={<ShoppingBag className="w-5 h-5" />} label="Total Spent" value={formatPrice(orders.reduce((s, o) => s + o.total, 0))} />
            </div>
          )}

          {/* Orders */}
          {tab === "orders" && (
            <div className="space-y-3">
              {orders.length === 0 ? (
                <div className="glass-card rounded-2xl p-12 text-center">
                  <div className="text-4xl mb-4">📦</div>
                  <p className="text-white/40">No orders yet.</p>
                  <Link href="/products" className="btn-glow inline-block mt-4">Browse Products</Link>
                </div>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="glass-card rounded-xl p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="font-bold text-white text-sm">{order.id}</span>
                        <span className="text-white/30 text-xs ml-2">{formatDate(order.createdAt)}</span>
                      </div>
                      <span className="text-xs font-bold px-2 py-1 rounded-md bg-amber-500/15 text-amber-500 border border-amber-500/30 uppercase">
                        {order.status}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-white/50">{item.productName} × {item.quantity}</span>
                          <span className="text-white">{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-white/5 mt-2 pt-2 flex justify-between">
                      <span className="text-white/40 text-sm">Total</span>
                      <span className="font-black mani-red">{formatPrice(order.total)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Settings */}
          {tab === "settings" && (
            <div className="glass-card rounded-2xl p-6">
              <h2 className="font-bold text-white mb-4">Account Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-white/40 uppercase tracking-wider mb-1.5 block">Name</label>
                  <input type="text" defaultValue={user.name} className="input-mani" />
                </div>
                <div>
                  <label className="text-xs font-bold text-white/40 uppercase tracking-wider mb-1.5 block">Email</label>
                  <input type="email" defaultValue={user.email} className="input-mani" disabled />
                </div>
                <div>
                  <label className="text-xs font-bold text-white/40 uppercase tracking-wider mb-1.5 block">New Password</label>
                  <input type="password" className="input-mani" placeholder="Leave empty to keep current" />
                </div>
                <button className="btn-glow">Save Changes</button>
              </div>
            </div>
          )}

          {/* Logout */}
          <div className="mt-8">
            <button onClick={handleLogout} className="btn-ghost inline-flex items-center gap-2 text-red-500">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function TabBtn({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
        active ? "bg-mani-red text-white shadow-glow-red" : "glass text-white/60 hover:text-white"
      }`}
    >
      {icon} {label}
    </button>
  );
}

function StatBox({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center gap-2 mb-2 text-mani-red">{icon}<span className="text-xs text-white/40 uppercase tracking-wider">{label}</span></div>
      <div className="text-lg font-bold text-white truncate">{value}</div>
    </div>
  );
}
