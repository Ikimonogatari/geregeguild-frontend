import Navbar from "@/components/Navbar";
import { InteractiveMap } from "@/components/InteractiveMap";

export default function MapPage() {
  return (
    <main className="min-h-screen bg-brand-charcoal overflow-x-hidden pt-24">
      <Navbar />
      <div className="w-full h-[calc(100vh-6rem)]">
        <InteractiveMap />
      </div>
    </main>
  );
}
