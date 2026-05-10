import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Reviews from "@/components/Reviews";
import Gallery from "@/components/Gallery";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

export default function Home() {
  return (
    <main className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />
      <Hero />
      <About />
      <Experience />
      <Reviews />
      <Gallery />
      <Footer />
      <ScrollToTop />
    </main>
  );
}
