"use client";

import { useState, useEffect } from "react";
import { ParticleBackground } from "@/components/animations/ParticleBackground";
import { Navbar } from "@/components/layout/Navbar";
import { formatPrice, formatDate } from "@/lib/utils";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("mani-272-orders") || "[]");
    setOrders(stored.reverse());
  }, []);

  const updateStatus = (orderId: string, status: string) => {
    const updated = orders.map((o) => o.id === orderId ? { ...o, status } : o);
    setOrders(updated);
    localStorage.setItem("mani-272-orders", JSON.stringify(updated));
  };

  return (
    <>
      <ParticleBackground />
      <Navbar />
      <main className="relative z-10 min-h-screen pt-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="mani-brand text-2xl mb-8">
            <span className="mani-red">Order</span> <span className="mani-white">Management</span>
          </h1>

          {orders.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center">
              <div className="text-4xl mb-4">📦</div>
              <p className="text-white/40">No orders yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((o) => (
                <div key={o.id} className="glass-card rounded-xl p-4">
                  <div className="flex flex-col sm:flex-row justify-between gap-2 mb-3">
                    <div>
                      <span className="font-bold text-white">{o.id}</span>
                      <span className="text-white/30 text-xs ml-2">{formatDate(o.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={o.status}
                        onChange={(e) => updateStatus(o.id, e.target.value)}
                        className="bg-mani-grey border border-white/10 rounded-lg px-3 py-1 text-sm text-white"
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3 text-sm">
                    <div>
                      <span className="text-white/30 text-xs">Customer:</span>
                      <span className="text-white/70 ml-1">{o.customerName || "N/A"}</span>
                    </div>
                    <div>
                      <span className="text-white/30 text-xs">Email:</span>
                      <span className="text-white/70 ml-1">{o.customerEmail || "N/A"}</span>
                    </div>
                    <div>
                      <span className="text-white/30 text-xs">Payment:</span>
                      <span className="text-white/70 ml-1 uppercase">{o.paymentMethod}</span>
                    </div>
                  </div>

                  <div className="space-y-1 border-t border-white/5 pt-2">
                    {o.items?.map((item: any, i: number) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-white/50">{item.productName} × {item.quantity}</span>
                        <span className="text-white">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-white/5 mt-2 pt-2 flex justify-between">
                    <span className="text-white/40 text-sm">Total</span>
                    <span className="font-black mani-red">{formatPrice(o.total)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
