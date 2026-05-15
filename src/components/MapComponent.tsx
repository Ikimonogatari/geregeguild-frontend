'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useGame, POI, POIType } from './Providers';
import { useAuth } from './Providers';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

function MapEffects() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [map]);
  return null;
}

const getIcon = (type: POIType, isUnlocked: boolean) => {
  const borderColor = isUnlocked ? '#D4AF37' : '#FFFFFF'; // Gold if unlocked
  const bgColor = isUnlocked ? '#2D2D2D' : '#1A1A1A'; // Charcoal
  const opacity = isUnlocked ? '1' : '0.8';

  let emoji = '📍';
  if (type === 'historic') emoji = '🏛️';
  if (type === 'adventure') emoji = '🏕️';
  if (type === 'view') emoji = '🏔️';
  if (type === 'culture') emoji = '🎭';

  return new L.DivIcon({
    html: `<div style="background-color: ${bgColor}; border: 2px solid ${borderColor}; opacity: ${opacity}; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; font-size: 18px; box-shadow: 0 4px 6px rgba(0,0,0,0.5); transition: all 0.3s ease;">${emoji}</div>`,
    className: 'custom-div-icon bg-transparent border-none',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });
};

import PageTransition from '@/components/PageTransition';

export default function MapComponent() {
  const { gameState, checkIn, pois, feed } = useGame();
  const { user } = useAuth();
  const [selectedPOI, setSelectedPOI] = useState<POI | null>(null);

  const handleCheckIn = async (poi: POI) => {
    if (!user) {
      toast.error('Please login to check in and earn rewards!');
      return;
    }

    const result = await checkIn(poi.id);
    if (result.success) {
      toast.success(
        <div className="flex flex-col gap-1">
          <span className="font-bold text-brand-gold">Location Discovered!</span>
          <span>You earned {poi.points} points.</span>
          {result.newRank && <span className="font-bold text-green-400 mt-2">Rank Up! You are now a {result.newRank}</span>}
        </div>,
        { duration: 5000 }
      );
      setSelectedPOI(poi);
    } else {
      toast.info('You have already visited this location.');
    }
  };

  return (
    <PageTransition>
      <div className="relative w-full h-[calc(100vh-6rem)]">
        <MapContainer
          center={[46.8625, 103.8467]} // Center of Mongolia
          zoom={5}
          scrollWheelZoom={true}
          className="w-full h-full z-0"
        >
          <MapEffects />
          {/* Esri World Imagery or OpenStreetMap */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            className="map-tiles grayscale-[20%]" // Adding a bit of grayscale for aesthetics
          />

          {pois.map((poi) => {
            const isUnlocked = gameState.unlockedPOIs.includes(poi.id);
            return (
              <Marker
                key={poi.id}
                position={poi.coordinates}
                icon={getIcon(poi.type, isUnlocked)}
                eventHandlers={{
                  click: () => setSelectedPOI(poi)
                }}
              >
                <Popup className="custom-popup" minWidth={260} maxWidth={260}>
                  <div className="font-sans -mx-5 -mt-4 mb-3 overflow-hidden rounded-t-lg relative">
                    <img
                      src={poi.imageUrl}
                      alt={poi.name}
                      className="w-full h-32 object-cover"
                    />
                    {isUnlocked && (
                      <div className="absolute top-2 right-2 bg-brand-charcoal text-brand-gold text-[10px] font-bold uppercase px-2 py-1 rounded shadow">
                        Visited
                      </div>
                    )}
                  </div>
                  <div className="font-sans pb-1">
                    <div className="flex items-start justify-between mb-2 gap-2">
                      <h3 className="font-bricolage font-bold text-lg leading-tight text-gray-800 m-0">{poi.name}</h3>
                      <span className="text-[9px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600 px-2 py-1 rounded-full whitespace-nowrap mt-1">
                        {poi.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{poi.description}</p>
                    <Button
                      onClick={() => handleCheckIn(poi)}
                      disabled={isUnlocked}
                      className={`w-full text-xs font-bold uppercase tracking-wider h-9 ${isUnlocked ? 'bg-gray-200 text-gray-500' : 'bg-brand-gold text-brand-charcoal hover:bg-brand-charcoal hover:text-brand-gold'}`}
                    >
                      {isUnlocked ? 'Lore Unlocked' : 'Check In'}
                    </Button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {/* Lore Panel Overlay */}
        <AnimatePresence>
          {selectedPOI && gameState.unlockedPOIs.includes(selectedPOI.id) && (
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              className="absolute top-4 right-4 bottom-4 w-80 bg-brand-charcoal/95 backdrop-blur-md p-6 rounded-xl border border-brand-gold/30 shadow-2xl z-10 overflow-y-auto"
            >
              <div className="mb-6 rounded-lg overflow-hidden border border-white/10 relative h-40">
                <img src={selectedPOI.imageUrl} alt={selectedPOI.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal to-transparent"></div>
                <div className="absolute bottom-3 left-3 text-[10px] font-bold uppercase tracking-widest bg-brand-gold text-brand-charcoal px-2 py-1 rounded">
                  {selectedPOI.type}
                </div>
              </div>

              <h2 className="text-sm font-space-grotesk tracking-[0.2em] uppercase text-white/50 mb-1">Discovered</h2>
              <h3 className="text-2xl font-bricolage font-bold text-brand-gold mb-4">{selectedPOI.name}</h3>

              <div className="w-12 h-1 bg-brand-gold/30 mb-6" />

              <p className="text-white/80 font-space-grotesk leading-relaxed">
                {selectedPOI.lore}
              </p>

              <Button
                onClick={() => setSelectedPOI(null)}
                variant="outline"
                className="mt-8 w-full border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-charcoal font-bold tracking-widest uppercase text-xs"
              >
                Close Journal
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Live Guild Activity Feed */}
        <div className="absolute bottom-6 left-6 z-10 w-64 space-y-2 pointer-events-none">
          <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 mb-3 px-2">Guild Activity</h4>
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {feed.slice(0, 3).map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-brand-charcoal/80 backdrop-blur-md p-3 rounded-lg border border-white/10 shadow-lg flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-brand-gold/10 flex items-center justify-center text-[10px] font-bold text-brand-gold border border-brand-gold/20">
                    {item.user.username[0].toUpperCase()}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[11px] text-white/90 font-bold truncate">
                      {item.user.username} <span className="text-white/40 font-normal">visited</span>
                    </span>
                    <span className="text-[10px] text-brand-gold font-bold truncate">{item.poi.name}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
