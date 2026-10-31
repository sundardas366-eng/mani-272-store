import type { Metadata } from "next";
import { Inter, Orbitron } from "next/font/google";
import { CustomCursor } from "@/components/animations/CustomCursor";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
});

export const metadata: Metadata = {
  title: "MANI 272 STORE — Premium Gaming Digital Products",
  description:
    "Your premium destination for gaming panels, aim tools, bypass modules and more. MANI 272 STORE — quality you can trust.",
  keywords: ["MANI 272", "gaming store", "digital products", "panels", "aim tools"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${orbitron.variable}`}>
      <body className="bg-mani-black text-mani-white antialiased">
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
