import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { Mission } from "@/components/landing/Mission";
import { Features } from "@/components/landing/Features";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Mission />
      <Features />
      <Footer />
    </div>
  );
}
