"use client";

import { useState, useEffect } from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

const images = ["/4.jpg", "/2.jpg", "/3.jpg", "/7.jpg", "/8.jpg", "/9.jpg"];

export default function Gallery() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
    api.on("reInit", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  return (
    <section className="relative py-28 md:py-36 px-6 overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 text-center">
          <p className="font-accent italic text-accent text-[14px] tracking-[0.35em] uppercase mb-5">
            The Map's Edge
          </p>
          <h2 className="font-heading text-4xl md:text-6xl uppercase tracking-[0.08em] text-foreground ember-text-glow mb-8">
            The Mongolian <span className="text-accent">plateau</span>
          </h2>
          <div className="ink-divider mb-10 max-w-md mx-auto" />
          <p className="text-foreground/85 text-[18px] max-w-xl mx-auto font-serif italic">
            What the country looks like, when no one is performing for a camera.
          </p>
        </div>

        <div className="relative min-h-[400px]">
          {mounted && (
            <Carousel
              setApi={setApi}
              plugins={[
                Autoplay({ delay: 4500, stopOnInteraction: false }),
              ]}
              opts={{ align: "center", loop: true, skipSnaps: false }}
              className="w-full"
            >
              <CarouselContent className="ml-0">
                {images.map((src, idx) => {
                  const isActive = current === idx;
                  return (
                    <CarouselItem
                      key={idx}
                      className="pl-0 basis-full sm:basis-1/2 lg:basis-1/3"
                    >
                      <div className="px-3 h-full">
                        <div
                          className={cn(
                            "relative aspect-3/4 overflow-hidden border border-highlight/40 vignette",
                            isActive ? "z-10 ember-glow" : "z-0 opacity-75"
                          )}
                        >
                          <img
                            src={src}
                            alt={`Plateau view ${idx + 1}`}
                            className="w-full h-full object-cover grayscale-[15%] sepia-[25%] brightness-[0.92]"
                          />
                        </div>
                      </div>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
              <div className="flex justify-center gap-4 mt-12">
                <CarouselPrevious className="relative inset-0 translate-x-0 translate-y-0 rounded-none h-14 w-14 border border-accent/60 bg-transparent text-foreground hover:bg-accent hover:text-background transition-all duration-500" />
                <CarouselNext className="relative inset-0 translate-x-0 translate-y-0 rounded-none h-14 w-14 border border-accent/60 bg-transparent text-foreground hover:bg-accent hover:text-background transition-all duration-500" />
              </div>
            </Carousel>
          )}
        </div>
      </div>
    </section>
  );
}
