import { HeroSection } from "@/components/hero-section"
import { FeatureSection } from "@/components/feature-section"
import { CTASection } from "@/components/cta-section"
import { PublicEventsList } from "@/components/events/public-events-list"

export default function Home() {
  return (
    <div className="container mx-auto px-4">
      <HeroSection />
      <FeatureSection />
      <div className="py-12">
        <h2 className="text-3xl font-bold tracking-tighter mb-6">Upcoming Public Events</h2>
        <PublicEventsList limit={3} />
      </div>
      <CTASection />
    </div>
  )
}

