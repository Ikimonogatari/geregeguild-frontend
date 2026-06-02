import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import LayOfTheGuild from "@/components/LayOfTheGuild";
import About from "@/components/About";
import QuestPreview from "@/components/QuestPreview";
import GuildSection from "@/components/GuildSection";
import Reviews from "@/components/Reviews";
import Gallery from "@/components/Gallery";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

export default function Home() {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <Hero />
      <LayOfTheGuild />
      <About />
      <QuestPreview />
      <GuildSection />
      <Reviews />
      <Gallery />
      <Footer />
      <ScrollToTop />
    </main>
  );
}
