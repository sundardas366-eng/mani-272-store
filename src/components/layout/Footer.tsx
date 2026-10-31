import Link from "next/link";
import { Github, Youtube, MessageCircle, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-mani-black-2 border-t border-white/5 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center shadow-glow-red">
                <img
                  src="/images/logo/mani-272-logo.gif"
                  alt="MANI 272 Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="mani-brand text-lg">
                <span className="mani-red">MANI</span> <span className="mani-white">272</span>{" "}
                <span className="mani-white text-sm">STORE</span>
              </span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed">
              Your premium destination for gaming digital products. Quality panels,
              aim tools, bypass modules and more.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-white/50 hover:text-mani-red text-sm">Home</Link></li>
              <li><Link href="/products" className="text-white/50 hover:text-mani-red text-sm">Products</Link></li>
              <li><Link href="/team" className="text-white/50 hover:text-mani-red text-sm">Our Team</Link></li>
              <li><Link href="/cart" className="text-white/50 hover:text-mani-red text-sm">Cart</Link></li>
              <li><Link href="/dashboard" className="text-white/50 hover:text-mani-red text-sm">Dashboard</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">
              Categories
            </h4>
            <ul className="space-y-2">
              <li><Link href="/products?cat=silent-aim" className="text-white/50 hover:text-mani-red text-sm">Silent Aim</Link></li>
              <li><Link href="/products?cat=aim" className="text-white/50 hover:text-mani-red text-sm">Aim</Link></li>
              <li><Link href="/products?cat=panel" className="text-white/50 hover:text-mani-red text-sm">Panels</Link></li>
              <li><Link href="/products?cat=bypass" className="text-white/50 hover:text-mani-red text-sm">Bypass</Link></li>
            </ul>
          </div>

          {/* Contact + social */}
          <div>
            <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">
              Connect
            </h4>
            <div className="flex gap-3">
              <SocialLink href="https://discord.gg/4DMtsmZX6k" icon={<MessageCircle className="w-5 h-5" />} />
              <SocialLink href="https://www.youtube.com/@eagle272-v4p" icon={<Youtube className="w-5 h-5" />} />
              <SocialLink href="mailto:contact@mani272store.com" icon={<Mail className="w-5 h-5" />} />
            </div>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/30 text-sm">
            &copy; {new Date().getFullYear()} MANI 272 STORE. All rights reserved.
          </p>
          <p className="text-white/30 text-sm">
            Built with Next.js &amp; Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      className="w-10 h-10 rounded-lg glass flex items-center justify-center text-white/60 hover:text-mani-red hover:border-mani-red/40 transition-all"
    >
      {icon}
    </a>
  );
}
