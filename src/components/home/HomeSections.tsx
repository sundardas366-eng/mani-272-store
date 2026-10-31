"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ShoppingBag, Package, Eye } from "lucide-react";
import { ProductCard } from "@/components/products/ProductCard";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { getFeaturedProducts, getBestSellers, getSpecialOffers, getLatestProducts, PRODUCTS } from "@/data/products";

export function HeroSection() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Glow background */}
      <div className="absolute inset-0 bg-mani-radial" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-mani-red/10 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-4xl mx-auto text-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm text-white/60">Premium Gaming Digital Store</span>
          </div>

          <h1 className="mani-brand text-4xl sm:text-5xl lg:text-6xl mb-4">
            <span className="block text-white/40 text-lg sm:text-xl font-normal mb-2">
              WELCOME TO
            </span>
            <span className="mani-red">MANI</span>{" "}
            <span className="mani-white">272</span>{" "}
            <span className="mani-white">STORE</span>
          </h1>

          <p className="text-white/50 text-lg mb-8 max-w-2xl mx-auto">
            Your Premium Digital Products Destination
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products" className="btn-glow inline-flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" /> Shop Now
            </Link>
            <Link href="/products" className="btn-ghost inline-flex items-center gap-2">
              <Eye className="w-5 h-5" /> Explore Products
            </Link>
          </div>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16"
        >
          <StatCard icon={<Package className="w-5 h-5" />} value="24" label="Products" />
          <StatCard icon={<ShoppingBag className="w-5 h-5" />} value="5" label="Categories" />
          <StatCard icon={<span className="text-lg">⚡</span>} value="24/7" label="Support" />
          <StatCard icon={<span className="text-lg">🔒</span>} value="100%" label="Secure" />
        </motion.div>
      </div>
    </section>
  );
}

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="glass-card rounded-xl p-4 text-center">
      <div className="flex justify-center mb-2 text-mani-red">{icon}</div>
      <div className="font-black text-xl text-white">{value}</div>
      <div className="text-xs text-white/40 uppercase tracking-wider">{label}</div>
    </div>
  );
}

export function FeaturedSection() {
  const products = getFeaturedProducts();
  return (
    <section id="featured" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <ScrollReveal>
        <SectionHeader title="Featured Products" subtitle="Hand-picked premium tools" />
      </ScrollReveal>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
        {products.map((p, i) => (
          <ScrollReveal key={p.id}>
            <div style={{ transitionDelay: `${i * 50}ms` }}>
              <ProductCard product={p} />
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

export function BestSellersSection() {
  const products = getBestSellers();
  return (
    <section id="best-sellers" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <ScrollReveal>
        <SectionHeader title="Best Sellers" subtitle="Most popular among our customers" />
      </ScrollReveal>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
        {products.map((p) => (
          <ScrollReveal key={p.id}>
            <ProductCard product={p} />
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

export function SpecialOffersSection() {
  const products = getSpecialOffers();
  return (
    <section id="offers" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <ScrollReveal>
        <SectionHeader title="Special Offers" subtitle="Limited-time deals on premium products" />
      </ScrollReveal>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
        {products.map((p) => (
          <ScrollReveal key={p.id}>
            <ProductCard product={p} />
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

export function LatestProductsSection() {
  const products = getLatestProducts().slice(0, 8);
  return (
    <section id="latest" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <ScrollReveal>
        <SectionHeader title="Latest Products" subtitle="Newest additions to our catalog" />
      </ScrollReveal>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
        {products.map((p) => (
          <ScrollReveal key={p.id}>
            <ProductCard product={p} />
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

export function ReviewsSection() {
  return (
    <section id="reviews" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <ScrollReveal>
        <SectionHeader title="Customer Reviews" subtitle="What our customers say" />
      </ScrollReveal>
      <ScrollReveal>
        <div className="glass-card rounded-2xl p-12 text-center mt-8">
          <div className="text-4xl mb-4">⭐⭐⭐⭐⭐</div>
          <p className="text-white/40 text-lg">
            Reviews will appear here once customers share their experience.
          </p>
          <p className="text-white/30 text-sm mt-2">
            We do not display fabricated reviews. All reviews are verified.
          </p>
        </div>
      </ScrollReveal>
    </section>
  );
}

export function DiscordSection() {
  const discordUrl = process.env.NEXT_PUBLIC_DISCORD_INVITE_URL || "https://discord.gg/4DMtsmZX6k";
  const discordName = process.env.NEXT_PUBLIC_DISCORD_SERVER_NAME || "MANI 272 STORE";
  const discordDesc =
    process.env.NEXT_PUBLIC_DISCORD_SERVER_DESCRIPTION ||
    "Join the official MANI 272 STORE community for instant support, product updates, custom configs and exclusive offers.";

  return (
    <section id="discord" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <ScrollReveal>
        <div className="glass-card rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#5865F2]/10 rounded-full blur-[80px]" />
          <div className="relative flex flex-col md:flex-row items-center gap-8">
            <div className="w-24 h-24 rounded-2xl bg-[#5865F2] flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 24 24" className="w-14 h-14 fill-white">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.872-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-black text-white mb-2">{discordName}</h3>
              <p className="text-white/50 mb-6">{discordDesc}</p>
              <a
                href={discordUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold px-6 py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-[#5865F2]/30"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.872-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
                Join Discord
              </a>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}

export function YouTubeSection() {
  // Official YouTube channel — provided by user
  const ytUrl = "https://www.youtube.com/@eagle272-v4p";
  const ytName = "EAGLE 272";
  const ytDesc = "Official YouTube channel for MANI 272 STORE. Tutorials, demos, product showcases and more.";

  return (
    <section id="youtube" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <ScrollReveal>
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-black text-white mb-2">OFFICIAL YOUTUBE CHANNEL</h2>
          <p className="text-white/40">{ytDesc}</p>
          <div className="w-20 h-1 bg-mani-red rounded-full mx-auto mt-4" />
        </div>
      </ScrollReveal>
      <ScrollReveal>
        <div className="glass-card rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-[#FF0000]/10 rounded-full blur-[80px]" />
          <div className="relative flex flex-col md:flex-row items-center gap-8">
            {/* Channel logo */}
            <div className="w-24 h-24 rounded-2xl bg-[#FF0000] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#FF0000]/30">
              <svg viewBox="0 0 24 24" className="w-14 h-14 fill-white">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-black text-white mb-2">{ytName}</h3>
              <p className="text-white/50 mb-6">{ytDesc}</p>
              <a
                href={ytUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#FF0000] hover:bg-[#CC0000] text-white font-bold px-6 py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-[#FF0000]/30"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                Subscribe
              </a>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}

// ---- TEAM SECTION ----
export function TeamSection() {
  const owner = {
    name: "Mani 272",
    position: "SERVER OWNER",
    description: "Founder and owner of MANI 272 STORE. Dedicated to delivering premium digital products with top-tier quality and support.",
    discordUrl: "https://discord.com/users/1457931837769908467",
    discordId: "1457931837769908467",
    photoUrl: "/images/team/mani-272-avatar.jpg",
  };
  const cofounder = {
    name: "Eagle 272",
    position: "CO-FOUNDER",
    description: "Co-founder of MANI 272 STORE. Leading development, YouTube channel production and technical support.",
    discordUrl: "https://discord.com/users/1508220374033109190",
    discordId: "1508220374033109190",
    photoUrl: "/images/team/eagle-272-avatar.jpg",
  };

  return (
    <section id="team" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <ScrollReveal>
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-black text-white mb-2">MEET OUR TEAM</h2>
          <p className="text-white/40">The people behind MANI 272 STORE</p>
          <div className="w-20 h-1 bg-mani-red rounded-full mx-auto mt-4" />
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Owner */}
        <ScrollReveal>
          <TeamCard member={owner} />
        </ScrollReveal>
        {/* Co-Founder */}
        <ScrollReveal>
          <TeamCard member={cofounder} />
        </ScrollReveal>
      </div>

      <div className="text-center mt-8">
        <Link href="/team" className="btn-glow inline-flex items-center gap-2 text-sm font-bold">
          View Complete Team Page &rarr;
        </Link>
      </div>
    </section>
  );
}

function TeamCard({ member }: { member: { name: string; position: string; description: string; discordUrl: string; discordId: string; photoUrl?: string } }) {
  return (
    <div className="glass-card rounded-2xl p-8 text-center hover:border-mani-red/40 transition-all group">
      {/* Avatar */}
      <div className="relative w-24 h-24 mx-auto mb-4">
        <div className="absolute inset-0 bg-mani-red/20 rounded-full blur-xl animate-glow-pulse" />
        <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-[#1c0808] to-mani-black border-2 border-mani-red/50 flex items-center justify-center shadow-glow-red overflow-hidden">
          {member.photoUrl ? (
            <img
              src={member.photoUrl}
              alt={member.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <span className="text-white font-black text-2xl mani-brand">
              {member.name.charAt(0)}
            </span>
          )}
        </div>
      </div>

      <h3 className="text-xl font-black text-white mb-1">{member.name}</h3>
      <p className="text-mani-red text-sm font-bold uppercase tracking-wider mb-3">{member.position}</p>
      <p className="text-white/40 text-sm leading-relaxed mb-4">{member.description}</p>

      {/* Discord profile link */}
      <a
        href={member.discordUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 glass px-4 py-2 rounded-lg text-sm text-white/70 hover:text-[#5865F2] hover:border-[#5865F2]/40 transition-all"
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.872-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
        </svg>
        Discord Profile
      </a>
      <p className="text-white/20 text-xs mt-2">ID: {member.discordId}</p>
    </div>
  );
}

export function StatsSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <ScrollReveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <BigStat value="24" label="Total Products" />
          <BigStat value="5" label="Categories" />
          <BigStat value="0" label="Happy Customers" />
          <BigStat value="0" label="Orders Delivered" />
        </div>
      </ScrollReveal>
    </section>
  );
}

function BigStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="glass-card rounded-2xl p-6 text-center">
      <div className="text-3xl font-black mani-red mb-1">{value}</div>
      <div className="text-sm text-white/40 uppercase tracking-wider">{label}</div>
    </div>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="text-center mb-8">
      <h2 className="text-2xl md:text-3xl font-black text-white mb-2">{title}</h2>
      <p className="text-white/40">{subtitle}</p>
      <div className="w-20 h-1 bg-mani-red rounded-full mx-auto mt-4" />
    </div>
  );
}
