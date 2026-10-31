"use client";

import { ParticleBackground } from "@/components/animations/ParticleBackground";
import { Navbar } from "@/components/layout/Navbar";
import toast from "react-hot-toast";

export default function AdminSettingsPage() {
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo — save to localStorage. In production, save to Supabase.
    toast.success("Settings saved successfully (demo)");
  };

  return (
    <>
      <ParticleBackground />
      <Navbar />
      <main className="relative z-10 min-h-screen pt-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="mani-brand text-2xl mb-8">
            <span className="mani-red">Website</span> <span className="mani-white">Settings</span>
          </h1>

          <form onSubmit={handleSave} className="space-y-6">
            {/* Branding */}
            <div className="glass-card rounded-2xl p-6 space-y-4">
              <h2 className="font-bold text-white">Branding</h2>
              <div>
                <label className="text-xs font-bold text-white/40 uppercase tracking-wider mb-1.5 block">Website Name</label>
                <input type="text" defaultValue="MANI 272 STORE" className="input-mani" />
              </div>
              <div>
                <label className="text-xs font-bold text-white/40 uppercase tracking-wider mb-1.5 block">Announcement Text</label>
                <input type="text" defaultValue="🎉 Welcome to MANI 272 STORE — Use code MANI10 for 10% off!" className="input-mani" />
              </div>
              <div>
                <label className="text-xs font-bold text-white/40 uppercase tracking-wider mb-1.5 block">Logo Upload</label>
                <div className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center hover:border-mani-red/40 transition-all">
                  <p className="text-white/40 text-sm">Upload logo (PNG/SVG)</p>
                  <button type="button" className="btn-ghost mt-2">Choose File</button>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-white/40 uppercase tracking-wider mb-1.5 block">Banner Image</label>
                <div className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center hover:border-mani-red/40 transition-all">
                  <p className="text-white/40 text-sm">Upload homepage banner</p>
                  <button type="button" className="btn-ghost mt-2">Choose File</button>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-white/40 uppercase tracking-wider mb-1.5 block">Primary Color</label>
                <div className="flex items-center gap-3">
                  <input type="color" defaultValue="#F50B00" className="w-12 h-12 rounded-lg cursor-pointer bg-transparent border border-white/10" />
                  <input type="text" defaultValue="#F50B00" className="input-mani flex-1" />
                </div>
              </div>
            </div>

            {/* Discord settings */}
            <div className="glass-card rounded-2xl p-6 space-y-4">
              <h2 className="font-bold text-white">Discord Settings</h2>
              <div>
                <label className="text-xs font-bold text-white/40 uppercase tracking-wider mb-1.5 block">Server Name</label>
                <input type="text" defaultValue="MANI 272 Official" className="input-mani" />
              </div>
              <div>
                <label className="text-xs font-bold text-white/40 uppercase tracking-wider mb-1.5 block">Invite URL</label>
                <input type="url" defaultValue="https://discord.gg/mani272" className="input-mani" />
              </div>
              <div>
                <label className="text-xs font-bold text-white/40 uppercase tracking-wider mb-1.5 block">Description</label>
                <textarea className="input-mani" rows={2} defaultValue="Join our community for support, updates and exclusive offers." />
              </div>
              <div>
                <label className="text-xs font-bold text-white/40 uppercase tracking-wider mb-1.5 block">Server Logo</label>
                <div className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center">
                  <p className="text-white/40 text-sm">Upload Discord server logo</p>
                  <button type="button" className="btn-ghost mt-2">Choose File</button>
                </div>
              </div>
            </div>

            {/* YouTube settings */}
            <div className="glass-card rounded-2xl p-6 space-y-4">
              <h2 className="font-bold text-white">YouTube Settings</h2>
              <div>
                <label className="text-xs font-bold text-white/40 uppercase tracking-wider mb-1.5 block">Channel Name</label>
                <input type="text" defaultValue="MANI 272" className="input-mani" />
              </div>
              <div>
                <label className="text-xs font-bold text-white/40 uppercase tracking-wider mb-1.5 block">Channel Description</label>
                <textarea className="input-mani" rows={2} defaultValue="Tutorials, demos and product showcases." />
              </div>
              <div>
                <label className="text-xs font-bold text-white/40 uppercase tracking-wider mb-1.5 block">Channel Logo</label>
                <div className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center">
                  <p className="text-white/40 text-sm">Upload YouTube channel logo</p>
                  <button type="button" className="btn-ghost mt-2">Choose File</button>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-white/40 uppercase tracking-wider mb-1.5 block">Embedded Video URL</label>
                <input type="url" className="input-mani" placeholder="https://youtube.com/watch?v=..." />
              </div>
            </div>

            <button type="submit" className="btn-glow">Save All Settings</button>
          </form>
        </div>
      </main>
    </>
  );
}
