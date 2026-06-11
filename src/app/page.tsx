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
import Reveal from "@/components/Reveal";
import { DUR } from "@/lib/motion";

export default function Home() {
  return (
    // overflow-x-clip (not -hidden): hidden forces overflow-y:auto, turning
    // <main> into a scroll container that breaks descendant position:sticky.
    <main className="min-h-screen bg-background overflow-x-clip">
      <Navbar />
      <Hero />
      {/* Each section enters like a film cut — alternating rise / iris / slide-left. */}
      <Reveal kind="rise" duration={DUR.slow}>
        <LayOfTheGuild />
      </Reveal>
      {/* About self-animates (portrait blur + column stagger) and contains a
          sticky portrait — a Reveal wrapper's clip-path would break the sticky,
          so it is intentionally not wrapped. */}
      <About />
      <Reveal kind="slideLeft" duration={DUR.slow}>
        <JourneysSection />
      </Reveal>
      <Reveal kind="rise" duration={DUR.slow}>
        <ChooseByInterest />
      </Reveal>
      <Reveal kind="iris" duration={DUR.slow}>
        <GuildSection />
      </Reveal>
      <Reveal kind="slideLeft" duration={DUR.slow}>
        <QuestPreview />
      </Reveal>
      <Reveal kind="rise" duration={DUR.slow}>
        <Reviews />
      </Reveal>
      <Reveal kind="iris" duration={DUR.slow}>
        <Gallery />
      </Reveal>
      <Footer />
      <ScrollToTop />
    </main>
  );
}
