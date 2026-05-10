'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

const reviews = [
  {
    name: "NJ Kessler",
    content: "An absolute masterclass in Mongolian travel. Despite fuel shortages, Vanya's herculean efforts ensured our winter expedition was a total success. His local knowledge and English fluency are exceptional.",
    rating: 5,
    image: "/5.jpg"
  },
  {
    name: "Fletcher Bradford",
    content: "Staying with nomadic families and visiting reindeer herders was life-changing. One of the most memorable things I've ever done. Vanya was more than a guide; he became a friend.",
    rating: 5,
    image: "/6.jpg"
  }
];

export default function Reviews() {
  return (
    <section id="reviews" className="py-24 md:py-32 bg-brand-charcoal text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-gold/5 skew-x-12 translate-x-1/2" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-xl">
            <span className="text-brand-gold font-bold tracking-[0.4em] uppercase text-[9px] mb-4 block">Testimonials</span>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold tracking-tighter leading-[0.9] text-white">
              Voices of the <span className="text-brand-gold">Journey</span>
            </h2>
          </div>
          <p className="text-white/70 text-base md:text-lg max-w-sm font-medium tracking-tight">
            Honest stories from those who ventured into the wild with us.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10 border border-white/10">
          {reviews.map((review, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.1 }}
            >
              <Card className="h-full border-none rounded-none bg-brand-charcoal p-8 md:p-12 lg:p-16 relative group">
                <CardContent className="p-0">
                  <Quote className="w-10 h-10 text-brand-gold/20 mb-8" />
                  <div className="flex items-center mb-8">
                    <img 
                      src={review.image} 
                      alt={review.name} 
                      className="w-32 h-32 md:w-48 md:h-48 rounded-none grayscale group-hover:grayscale-0 transition-all duration-500 object-cover mr-6 border border-white/10"
                    />
                    <div>
                      <h3 className="font-heading text-xl md:text-2xl font-bold tracking-tight text-white">{review.name}</h3>
                      <div className="flex text-brand-gold mt-1 gap-0.5">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-2.5 h-2.5 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-lg md:text-xl text-white/90 leading-relaxed font-medium italic">
                    "{review.content}"
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
