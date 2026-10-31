import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ParticleBackground } from "@/components/animations/ParticleBackground";
import { LoadingScreen } from "@/components/animations/LoadingScreen";
import {
  HeroSection,
  FeaturedSection,
  LatestProductsSection,
  BestSellersSection,
  SpecialOffersSection,
  ReviewsSection,
  StatsSection,
  DiscordSection,
  YouTubeSection,
  TeamSection,
} from "@/components/home/HomeSections";

export default function HomePage() {
  return (
    <>
      <LoadingScreen />
      <ParticleBackground />
      <Navbar />
      <main className="relative z-10">
        <HeroSection />
        <FeaturedSection />
        <BestSellersSection />
        <SpecialOffersSection />
        <LatestProductsSection />
        <StatsSection />
        <TeamSection />
        <ReviewsSection />
        <DiscordSection />
        <YouTubeSection />
      </main>
      <Footer />
    </>
  );
}
