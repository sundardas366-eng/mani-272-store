"use client";

import { useState } from "react";
import Link from "next/link";
import { Crown, Shield, Copy, Check, MessageSquare, Youtube, ExternalLink, ArrowRight, Sparkles, Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ParticleBackground } from "@/components/animations/ParticleBackground";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import toast from "react-hot-toast";

interface TeamMember {
  name: string;
  role: "SERVER OWNER" | "CO-FOUNDER";
  discordId: string;
  discordTag?: string;
  discordUrl: string;
  photoUrl?: string;
  profileCardUrl?: string;
  statusText?: string;
  youtubeUrl?: string;
  description: string;
  responsibilities: string[];
  gradient: string;
  accentColor: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "Mani 272",
    role: "SERVER OWNER",
    discordId: "1457931837769908467",
    discordTag: "_mani272",
    discordUrl: "https://discord.com/users/1457931837769908467",
    photoUrl: "/images/team/mani-272-avatar.jpg",
    profileCardUrl: "/images/team/mani-272-profile.jpg",
    statusText: "Server Owner | Tech Services",
    description:
      "Server Owner and Founder of MANI 272 STORE. Overseeing store infrastructure, security policies, client support, and product authenticity.",
    responsibilities: [
      "Official Server Ownership & Administration",
      "Store Policies & Customer Relations",
      "Product Quality Verification & Safety",
      "Executive Community Decisions"
    ],
    gradient: "from-mani-red to-rose-700",
    accentColor: "#F50B00",
  },
  {
    name: "Eagle 272",
    role: "CO-FOUNDER",
    discordId: "1508220374033109190",
    discordTag: "eagle272",
    discordUrl: "https://discord.com/users/1508220374033109190",
    youtubeUrl: "https://www.youtube.com/@eagle272-v4p",
    statusText: "Co-Founder | Media & Development",
    description:
      "Co-Founder of MANI 272 STORE and creator of the official EAGLE 272 YouTube channel. Directing product development, video guides, and technical tutorials.",
    responsibilities: [
      "Co-Founding Executive & Operations",
      "Official YouTube Channel (@eagle272-v4p)",
      "Product Demonstration & Video Tutorials",
      "Technical Support & Feature Development"
    ],
    gradient: "from-amber-500 to-mani-red",
    accentColor: "#F59E0B",
  },
];

export default function TeamPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showProfileCard, setShowProfileCard] = useState(false);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    toast.success(`Copied Discord ID for ${label}: ${text}`);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <>
      <ParticleBackground />
      <Navbar />
      <main className="relative z-10 min-h-screen pt-8 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 pt-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-4 border-mani-red/30">
                <Sparkles className="w-4 h-4 text-mani-red" />
                <span className="text-xs font-bold uppercase tracking-wider text-white/80">
                  Leadership &amp; Staff
                </span>
              </div>

              <h1 className="mani-brand text-4xl sm:text-5xl lg:text-6xl text-white mb-4">
                OUR <span className="mani-red">TEAM</span>
              </h1>

              <p className="text-white/50 text-base sm:text-lg leading-relaxed">
                Meet the leadership behind MANI 272 STORE. Dedicated to delivering verified gaming digital products, high-grade security, and round-the-clock support.
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-mani-red to-transparent rounded-full mx-auto mt-6" />
            </motion.div>
          </div>

          {/* Team Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20">
            {TEAM_MEMBERS.map((member, index) => {
              const isOwner = member.role === "SERVER OWNER";
              const isCopied = copiedId === member.discordId;

              return (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className="relative group"
                >
                  {/* Subtle red glow on hover */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-mani-red to-rose-600 rounded-3xl blur opacity-20 group-hover:opacity-60 transition duration-500" />

                  <div className="relative glass-card rounded-3xl p-8 sm:p-10 h-full flex flex-col justify-between border-white/10 group-hover:border-mani-red/50 transition-all duration-300">
                    <div>
                      {/* Top Header of Card */}
                      <div className="flex items-start justify-between gap-4 mb-6">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#1c0808] to-mani-black border-2 border-mani-red/40 flex items-center justify-center shadow-glow-red overflow-hidden">
                              {member.photoUrl ? (
                                <img
                                  src={member.photoUrl}
                                  alt={member.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              ) : (
                                <span className="mani-brand text-3xl font-black text-white">
                                  {member.name.slice(0, 1)}
                                </span>
                              )}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-green-500 border-2 border-mani-black flex items-center justify-center">
                              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                className={`text-[11px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 ${
                                  isOwner
                                    ? "bg-mani-red/20 text-mani-red border border-mani-red/40"
                                    : "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                                }`}
                              >
                                {isOwner ? (
                                  <Crown className="w-3.5 h-3.5 fill-current" />
                                ) : (
                                  <Shield className="w-3.5 h-3.5" />
                                )}
                                {member.role}
                              </span>
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-black text-white group-hover:text-mani-red transition-colors">
                              {member.name}
                            </h2>
                            {member.discordTag && (
                              <p className="text-xs text-white/40 font-mono mt-0.5">
                                @{member.discordTag}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Discord ID Badge Bar */}
                      <div className="bg-[#5865F2]/10 border border-[#5865F2]/20 rounded-xl p-3 mb-6 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-[#5865F2] flex items-center justify-center flex-shrink-0">
                            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.872-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                            </svg>
                          </div>
                          <div className="truncate">
                            <div className="text-[10px] text-white/50 uppercase font-bold tracking-wider">Discord ID</div>
                            <div className="text-xs font-mono font-bold text-white tracking-wide truncate">
                              {member.discordId}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => copyToClipboard(member.discordId, member.name)}
                          className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-bold flex items-center gap-1 transition-all flex-shrink-0"
                          title="Copy Discord ID"
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{isCopied ? "Copied" : "Copy"}</span>
                        </button>
                      </div>

                      {/* Official Discord Profile Preview for Server Owner */}
                      {member.profileCardUrl && (
                        <div className="mb-6 bg-mani-black/60 border border-white/10 rounded-2xl p-3 overflow-hidden">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider flex items-center gap-1.5">
                              <ImageIcon className="w-3.5 h-3.5 text-mani-red" />
                              Official Discord Profile Card
                            </span>
                            <button
                              onClick={() => setShowProfileCard(!showProfileCard)}
                              className="text-[10px] text-mani-red hover:underline font-bold"
                            >
                              {showProfileCard ? "Collapse" : "View Full Card"}
                            </button>
                          </div>
                          <div className={`overflow-hidden rounded-xl border border-white/10 transition-all duration-300 ${showProfileCard ? "max-h-[500px]" : "max-h-36"}`}>
                            <img
                              src={member.profileCardUrl}
                              alt={`${member.name} Discord Profile`}
                              className="w-full object-cover object-top cursor-pointer hover:opacity-95"
                              onClick={() => setShowProfileCard(!showProfileCard)}
                            />
                          </div>
                        </div>
                      )}

                      {/* Bio */}
                      <p className="text-white/60 text-sm leading-relaxed mb-6">
                        {member.description}
                      </p>

                      {/* Responsibilities */}
                      <div className="mb-6">
                        <h4 className="text-[11px] font-bold text-white/40 uppercase tracking-wider mb-2.5">
                          Key Roles &amp; Responsibilities
                        </h4>
                        <ul className="space-y-1.5">
                          {member.responsibilities.map((r, i) => (
                            <li key={i} className="text-xs text-white/70 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-mani-red" />
                              <span>{r}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 border-t border-white/5 flex flex-wrap items-center gap-3">
                      <a
                        href={member.discordUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all shadow-md shadow-[#5865F2]/20"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Discord Profile</span>
                        <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                      </a>

                      {member.youtubeUrl && (
                        <a
                          href={member.youtubeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 bg-[#FF0000] hover:bg-[#CC0000] text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all shadow-md shadow-[#FF0000]/20"
                        >
                          <Youtube className="w-4 h-4" />
                          <span>YouTube Channel</span>
                          <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Community & Social Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Discord Community Card */}
            <ScrollReveal>
              <div className="glass-card rounded-2xl p-6 sm:p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#5865F2]/10 rounded-full blur-3xl pointer-events-none" />
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#5865F2] flex items-center justify-center flex-shrink-0">
                    <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.872-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Join MANI 272 STORE Discord</h3>
                    <p className="text-white/40 text-xs">Direct access to staff &amp; announcements</p>
                  </div>
                </div>
                <p className="text-white/50 text-sm mb-6">
                  Need direct assistance or want to talk to Mani 272 or Eagle 272? Join our official Discord server.
                </p>
                <a
                  href="https://discord.gg/4DMtsmZX6k"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-glow !bg-[#5865F2] hover:!bg-[#4752C4] inline-flex items-center gap-2 text-xs font-bold !py-2.5 !px-5"
                >
                  Join Server (4DMtsmZX6k) <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </ScrollReveal>

            {/* YouTube Card */}
            <ScrollReveal>
              <div className="glass-card rounded-2xl p-6 sm:p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#FF0000]/10 rounded-full blur-3xl pointer-events-none" />
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#FF0000] flex items-center justify-center flex-shrink-0">
                    <Youtube className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Official YouTube Channel</h3>
                    <p className="text-white/40 text-xs">@eagle272-v4p</p>
                  </div>
                </div>
                <p className="text-white/50 text-sm mb-6">
                  Watch official product showcases, tutorials, and setup instructions hosted by Co-Founder Eagle 272.
                </p>
                <a
                  href="https://www.youtube.com/@eagle272-v4p"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-glow !bg-[#FF0000] hover:!bg-[#CC0000] inline-flex items-center gap-2 text-xs font-bold !py-2.5 !px-5"
                >
                  Subscribe to Channel <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
