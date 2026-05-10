'use client';

import { useState, useEffect } from 'react';
import Autoplay from 'embla-carousel-autoplay';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

const images = [
  "/4.jpg",
  "/2.jpg",
  "/3.jpg",
  "/7.jpg",
  "/8.jpg",
  "/9.jpg"
];

export default function Gallery() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });

    api.on("reInit", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <section className="py-24 md:py-32 bg-white text-brand-charcoal overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="mb-20 text-center">
          <span className="text-brand-gold font-bold tracking-[0.4em] uppercase text-[9px] mb-4 block">Gallery</span>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold tracking-tighter leading-[0.8] mb-10 text-brand-charcoal">
            The Mongolian <span className="text-brand-gold">Plateau</span>
          </h2>
          <p className="text-lg md:text-xl text-neutral-800 max-w-xl mx-auto font-medium">
            The raw beauty of the Mongolian plateau captured in its most authentic moments.
          </p>
        </div>

        <div className="relative">
          <Carousel
            setApi={setApi}
            plugins={[
              Autoplay({
                delay: 4000,
                stopOnInteraction: false,
              }),
            ]}
            opts={{
              align: "center",
              loop: true,
              skipSnaps: false,
            }}
            className="w-full"
          >
            <CarouselContent className="ml-0">
              {images.map((src, idx) => {
                const isActive = current === idx;
                return (
                  <CarouselItem key={idx} className="pl-0 basis-full sm:basis-1/2 lg:basis-1/3">
                    <div className="px-2 h-full">
                      <div
                        className={cn(
                          "relative aspect-3/4 overflow-hidden border border-black/5 shadow-md",
                          isActive ? "z-10" : "z-0"
                        )}
                      >
                        <img 
                          src={src} 
                          alt={`Gallery view ${idx + 1}`} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <div className="flex justify-center md:justify-end gap-4 mt-12">
              <CarouselPrevious className="relative inset-0 translate-x-0 translate-y-0 rounded-none h-14 w-14 md:h-16 md:w-16 border-2 border-brand-charcoal bg-transparent text-brand-charcoal hover:bg-brand-gold hover:border-brand-gold transition-all duration-300" />
              <CarouselNext className="relative inset-0 translate-x-0 translate-y-0 rounded-none h-14 w-14 md:h-16 md:w-16 border-2 border-brand-charcoal bg-transparent text-brand-charcoal hover:bg-brand-gold hover:border-brand-gold transition-all duration-300" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
}
