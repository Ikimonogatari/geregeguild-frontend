'use client';

import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[calc(100vh-6rem)] flex items-center justify-center bg-brand-charcoal text-brand-gold">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-brand-gold border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-space-grotesk tracking-widest uppercase text-sm">Loading Map...</p>
      </div>
    </div>
  )
});

export function InteractiveMap() {
  return <MapComponent />;
}
