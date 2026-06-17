import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import LayOfTheGuild from "@/components/LayOfTheGuild";
import About from "@/components/About";
import JourneysSection from "@/components/JourneysSection";
import ChooseByInterest from "@/components/ChooseByInterest";
import QuestPreview from "@/components/QuestPreview";
import GuildSection from "@/components/GuildSection";
import Reviews from "@/components/Reviews";
import Gallery from "@/components/Gallery";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

export default function Home() {
  return (
    // overflow-x-clip (not -hidden): hidden forces overflow-y:auto, turning
    // <main> into a scroll container that breaks descendant position:sticky.
    // Sections are rendered naked — each one orchestrates its own beat-by-beat
    // reveal (eyebrow → headline blur → divider → body → cards). An outer
    // section-wide Reveal would double-animate and fight that choreography.
    <main className="min-h-screen bg-background overflow-x-clip">
      <Navbar />
      <Hero />
      <LayOfTheGuild />
      <About />
      <JourneysSection />
      <ChooseByInterest />
      <GuildSection />
      <QuestPreview />
      <Reviews />
      <Gallery />
      <Footer />
      <ScrollToTop />
    </main>
  );
}
