"use client";

import { ParticleBackground } from "@/components/animations/ParticleBackground";
import { Navbar } from "@/components/layout/Navbar";
import { LampLoginForm } from "@/components/auth/LampLoginForm";

export default function LoginPage() {
  return (
    <>
      <ParticleBackground />
      <Navbar />
      <main className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <LampLoginForm redirectUrl="/dashboard" />
      </main>
    </>
  );
}
