"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Menu, X, User } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/verify-payment", label: "Verify UTR" },
  { href: "/team", label: "Our Team" },
  { href: "/#discord", label: "Discord" },
  { href: "/#youtube", label: "YouTube" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const itemCount = useCartStore((s) => s.getItemCount());

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-mani-red text-center py-2 text-sm font-semibold text-white">
        🎉 Welcome to MANI 272 STORE — Use code MANI10 for 10% off!
      </div>

      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-mani-black/90 backdrop-blur-xl border-b border-white/5"
            : "bg-transparent"
        )}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <ManiLogo />
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-6">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm font-semibold transition-colors hover:text-mani-red",
                    pathname === link.href ? "text-mani-red" : "text-white/70"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right icons */}
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="text-white/70 hover:text-mani-red transition-colors"
              >
                <User className="w-5 h-5" />
              </Link>
              <Link
                href="/cart"
                className="relative text-white/70 hover:text-mani-red transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-mani-red text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>
              <button
                className="md:hidden text-white"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden bg-mani-black/95 backdrop-blur-xl border-b border-white/5">
            <div className="px-4 py-4 space-y-3">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block text-white/70 hover:text-mani-red font-semibold py-2"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="block text-white/70 hover:text-mani-red font-semibold py-2"
              >
                Dashboard
              </Link>
              <Link
                href="/admin"
                onClick={() => setMobileOpen(false)}
                className="block text-white/70 hover:text-mani-red font-semibold py-2"
              >
                Admin
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

function ManiLogo() {
  return (
    <div className="flex items-center gap-2">
      {/* Official MANI 272 Logo */}
      <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center shadow-glow-red animate-glow-pulse">
        <img
          src="/images/logo/mani-272-logo.gif"
          alt="MANI 272 Logo"
          className="w-full h-full object-cover"
        />
      </div>
      <span className="mani-brand text-lg">
        <span className="mani-red">MANI</span>{" "}
        <span className="mani-white">272</span>{" "}
        <span className="mani-white text-sm hidden sm:inline">STORE</span>
      </span>
    </div>
  );
}
