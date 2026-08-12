import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import LayOfTheGuild from "@/components/LayOfTheGuild";
import PullQuoteBreather from "@/components/PullQuoteBreather";
import JourneysSection from "@/components/JourneysSection";
import About from "@/components/About";
import TheLongRide from "@/components/TheLongRide";
import ChooseByInterest from "@/components/ChooseByInterest";
import GuildSection from "@/components/GuildSection";
import Reviews from "@/components/Reviews";
import CharterRibbon from "@/components/CharterRibbon";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

/* ────────────────────────────────────────────────────────────
   Homepage flow — editorial rhythm, one signature cinematic
   moment, a woven conversion thread.

     I.    Hero            — the opening card
     II.   Prologue        — LayOfTheGuild (chapter card + stanzas)
                             folds HeroEpigraph's MMXIV role in
     III.  Breather        — quiet pull-quote (page turn)
     IV.   The Roads       — JourneysSection: the product surface
                             moved above the fold-line of intent
     V.    The Hall        — About (guildmaster portrait)
     VI.   The Long Ride   — TheLongRide: the ONE cinematic reward,
                             now earned after roads + lore, not before
     VII.  By Interest     — ChooseByInterest (matcher)
     VIII. The Charter     — GuildSection (four tenets → CTA)
     IX.   Chronicles      — Reviews (voices, with CTA tail)
     X.    Send a Raven    — CharterRibbon (final quiet push)

   Sections cut from the old flow:
     — HeroEpigraph: redundant with LayOfTheGuild's TitleBeat
     — QuestPreview: guides tease folded into GuildSection's tail
     — Gallery: its atmospheric role covered by TheLongRide
   ──────────────────────────────────────────────────────────── */

export default function Home() {
  return (
    // overflow-x-clip (not -hidden): hidden forces overflow-y:auto, turning
    // <main> into a scroll container that breaks descendant position:sticky.
    // Sections are rendered naked — each one orchestrates its own beat-by-beat
    // reveal (eyebrow → headline blur → divider → body → cards). An outer
    // section-wide Reveal would double-animate and fight that choreography.
    <main className="min-h-screen bg-background overflow-x-clip">
      <Navbar />

      {/* I. Opening card */}
      <Hero />

      {/* II. Prologue — the film's opening scroll (LayOfTheGuild pins for
             ~6 screens). This is the ONE long cinematic beat up front. */}
      <LayOfTheGuild />

      {/* III. Breather — a page turn between prologue and product.
              Quiet, short, gives the eye somewhere to rest. */}
      <PullQuoteBreather
        eyebrow="· Chapter I ·"
        quote="Then begins the road."
        attribution="— The Guild —"
      />

      {/* IV. The Roads — the product surface. Placed here so a
             first-time visitor sees the actual thing they can act on
             before more lore, not after eleven scrolls of atmosphere. */}
      <JourneysSection />

      {/* V. The Hall — quiet lore beat with the Guildmaster portrait. */}
      <About />

      {/* VI. The Long Ride — the ONE signature cinematic moment.
              Positioned as the reward for reading, not a barrier before it. */}
      <TheLongRide />

      {/* VII. Choose by Interest — the intent matcher. */}
      <ChooseByInterest />

      {/* VIII. The Charter — how it's made. Ends with the primary CTA
               so the conversion thread is unmistakable. */}
      <GuildSection />

      {/* IX. Chronicles — voices from patrons, with a subtle CTA tail. */}
      <Reviews />

      {/* X. Send a Raven — the final, quiet call. */}
      <CharterRibbon />

      <Footer />
      <ScrollToTop />
    </main>
  );
}
