"use client";

import { ParticleBackground } from "@/components/animations/ParticleBackground";
import { Navbar } from "@/components/layout/Navbar";

export default function AdminUsersPage() {
  return (
    <>
      <ParticleBackground />
      <Navbar />
      <main className="relative z-10 min-h-screen pt-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="mani-brand text-2xl mb-8">
            <span className="mani-red">User</span> <span className="mani-white">Management</span>
          </h1>

          <div className="glass-card rounded-2xl p-12 text-center">
            <div className="text-4xl mb-4">👥</div>
            <p className="text-white/40 mb-2">No registered users yet.</p>
            <p className="text-white/30 text-sm">
              When users register, they will appear here. You can manage accounts,
              assign admin permissions, and view activity.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
