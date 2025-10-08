import Image from "next/image";
import { landingData } from "@/data/landing";

export function Hero() {
  return (
    <section className="min-h-[80vh] flex items-center justify-center bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Small icon/logo */}
        <div className="mb-8">
          <div className="w-12 h-12 mx-auto bg-muted rounded-lg flex items-center justify-center">
            <span className="text-2xl">📅</span>
          </div>
          <p className="text-sm text-muted-foreground mt-2 tracking-wide">
            {landingData.brand.name.toLowerCase()}
          </p>
        </div>

        {/* Main heading */}
        <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-normal text-foreground mb-4 italic leading-tight">
          {landingData.brand.tagline}
          <br />
          <span className="font-bold">{landingData.brand.subtitle}</span>
        </h1>

        {/* CTA Button */}
        <div className="mt-12">
          <button className="text-foreground border border-border px-8 py-3 rounded-full text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors">
            tune in
          </button>
        </div>

        {/* Hero Image */}
        <div className="mt-16 relative">
          <div className="w-80 h-80 mx-auto relative">
            {/* Classical statue silhouette - we'll use a placeholder for now */}
            <div className="w-full h-full bg-gradient-to-b from-muted-foreground/20 to-muted-foreground/40 rounded-full flex items-center justify-center">
              <div className="text-6xl opacity-50">👤</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}