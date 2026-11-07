"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ParticleBackground } from "@/components/animations/ParticleBackground";
import { Navbar } from "@/components/layout/Navbar";
import {
  ShieldCheck,
  Search,
  Copy,
  Check,
  RefreshCw,
  Zap,
  KeyRound,
  ExternalLink,
  Clock,
} from "lucide-react";
import toast from "react-hot-toast";

interface StoredPayment {
  utr: string;
  amount: number;
  plan_days: number;
  status: string;
  customer_email?: string;
  customer_discord?: string;
  order_id?: string;
  bank_name?: string;
  created_at: string;
}

interface StoredKey {
  key: string;
  utr: string;
  expires_at: string;
  plan_days: number;
  created_at: string;
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<StoredPayment[]>([]);
  const [keys, setKeys] = useState<StoredKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/payments");
      const data = await res.json();
      if (data.success) {
        setPayments(data.payments || []);
        setKeys(data.keys || []);
      }
    } catch (err) {
      console.error("Failed to fetch admin payments:", err);
      toast.error("Failed to load records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const copyKeyText = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    toast.success("License key copied!");
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Build merged map of UTR to Key
  const keyMap = new Map<string, StoredKey>();
  keys.forEach((k) => keyMap.set(k.utr, k));

  const filteredPayments = payments.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const linkedKey = keyMap.get(p.utr)?.key?.toLowerCase() || "";
    return (
      p.utr.toLowerCase().includes(q) ||
      (p.customer_email || "").toLowerCase().includes(q) ||
      (p.order_id || "").toLowerCase().includes(q) ||
      linkedKey.includes(q)
    );
  });

  return (
    <>
      <ParticleBackground />
      <Navbar />

      <main className="relative z-10 min-h-screen pt-8 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mani-red/10 border border-mani-red/30 text-mani-red text-xs font-bold uppercase tracking-wider mb-2">
                <ShieldCheck className="w-3.5 h-3.5" /> Security & UTR Logs
              </div>
              <h1 className="text-3xl font-black text-white">
                Verified Payments & Access Keys
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={fetchRecords}
                disabled={loading}
                className="btn-ghost inline-flex items-center gap-2 text-xs py-2.5 px-4"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
              </button>
              <Link href="/verify-payment" className="btn-glow inline-flex items-center gap-2 text-xs py-2.5 px-4 font-bold">
                <Zap className="w-3.5 h-3.5" /> Manual Verify
              </Link>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="glass-card rounded-2xl p-4 border-white/10">
              <span className="text-white/40 text-xs font-bold uppercase tracking-wider">Total Verified Payments</span>
              <p className="text-2xl font-black text-white mt-1">{payments.length}</p>
            </div>
            <div className="glass-card rounded-2xl p-4 border-white/10">
              <span className="text-white/40 text-xs font-bold uppercase tracking-wider">Active License Keys</span>
              <p className="text-2xl font-black text-emerald-400 mt-1">{keys.length}</p>
            </div>
            <div className="glass-card rounded-2xl p-4 border-white/10">
              <span className="text-white/40 text-xs font-bold uppercase tracking-wider">Total Revenue Tracked</span>
              <p className="text-2xl font-black text-mani-red mt-1">
                ₹{payments.reduce((acc, p) => acc + (p.amount || 0), 0).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Search Input */}
          <div className="mb-6 relative">
            <Search className="w-4 h-4 text-white/40 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by 12-digit UTR, customer email, order ID, or license key..."
              className="w-full bg-black/60 border border-white/10 focus:border-mani-red rounded-xl pl-11 pr-4 py-3 text-white text-sm placeholder:text-white/30 focus:outline-none transition"
            />
          </div>

          {/* Payments & Keys Table */}
          <div className="glass-card rounded-2xl border-white/10 overflow-hidden shadow-xl">
            {loading ? (
              <div className="p-12 text-center">
                <div className="loader-ring mx-auto mb-3" />
                <p className="text-white/60 text-sm">Loading records from database...</p>
              </div>
            ) : filteredPayments.length === 0 ? (
              <div className="p-12 text-center text-white/40">
                <KeyRound className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No verified payments found matching your query.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-white/70">
                  <thead className="bg-black/60 text-xs font-bold uppercase tracking-wider text-white/40 border-b border-white/10">
                    <tr>
                      <th className="py-3.5 px-4">12-Digit UTR</th>
                      <th className="py-3.5 px-4">Amount</th>
                      <th className="py-3.5 px-4">Plan (Days)</th>
                      <th className="py-3.5 px-4">Generated License Key</th>
                      <th className="py-3.5 px-4">Customer</th>
                      <th className="py-3.5 px-4">Key Expiration</th>
                      <th className="py-3.5 px-4">Verified At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-mono text-xs">
                    {filteredPayments.map((p) => {
                      const linkedKey = keyMap.get(p.utr);
                      return (
                        <tr key={p.utr} className="hover:bg-white/5 transition">
                          <td className="py-3.5 px-4">
                            <span className="font-bold text-white bg-white/10 px-2 py-0.5 rounded select-all">
                              {p.utr}
                            </span>
                            {p.bank_name && (
                              <span className="block text-[10px] text-white/40 font-sans mt-0.5">
                                {p.bank_name}
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-emerald-400 font-bold">
                            ₹{p.amount}
                          </td>
                          <td className="py-3.5 px-4 font-sans font-semibold text-white">
                            {p.plan_days} {p.plan_days === 1 ? "Day" : "Days"}
                          </td>
                          <td className="py-3.5 px-4">
                            {linkedKey ? (
                              <div className="flex items-center gap-1.5">
                                <span className="text-mani-red font-bold select-all bg-mani-red/10 border border-mani-red/30 px-2 py-0.5 rounded">
                                  {linkedKey.key}
                                </span>
                                <button
                                  onClick={() => copyKeyText(linkedKey.key)}
                                  className="p-1 rounded bg-white/10 hover:bg-white/20 text-white transition"
                                  title="Copy Key"
                                >
                                  {copiedKey === linkedKey.key ? (
                                    <Check className="w-3 h-3 text-emerald-400" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                </button>
                              </div>
                            ) : (
                              <span className="text-white/30 italic">No key linked</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 font-sans text-white/80">
                            <div>{p.customer_email || "N/A"}</div>
                            {p.customer_discord && (
                              <div className="text-[10px] text-white/40 font-mono">
                                {p.customer_discord}
                              </div>
                            )}
                          </td>
                          <td className="py-3.5 px-4 font-sans text-white/50">
                            {linkedKey ? (
                              new Date(linkedKey.expires_at).toLocaleDateString()
                            ) : (
                              "—"
                            )}
                          </td>
                          <td className="py-3.5 px-4 font-sans text-white/40">
                            {new Date(p.created_at).toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
