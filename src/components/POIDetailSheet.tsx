
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, MapPin, Clock, Navigation } from 'lucide-react';
import { useMetro } from '@/contexts/MetroContext';
import { Button } from '@/components/ui/button';
import { TransitRouter } from '@/components/TransitRouter';

const POIDetailSheet = () => {
  const { selectedPOI, setSelectedPOI, mapCenter } = useMetro();
  const { getRouteDirections } = TransitRouter();

  const handleGoClick = () => {
    if (!selectedPOI) return;
    
    const route = getRouteDirections(mapCenter, selectedPOI.coordinates);
    
    if (route) {
      console.log('Route found:', route);
      alert(`Route found!\nDistance: ${route.distance}m\nDuration: ${Math.round(route.duration/60)} min\nInstructions: ${route.instructions.join(' → ')}`);
    } else {
      const startingLocation = "UCLA, Los Angeles, CA";
      const destinationAddress = selectedPOI.address;
      
      const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(startingLocation)}&destination=${encodeURIComponent(destinationAddress)}&travelmode=transit`;
      
      window.open(mapsUrl, '_blank');
    }
  };

  const getPriceLevel = (level: number) => {
    return '$'.repeat(level) + '·'.repeat(4 - level);
  };

  if (!selectedPOI) return null;

  return (
    <AnimatePresence>
      {selectedPOI && (
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ 
            y: 0, 
            opacity: 1,
            transition: {
              type: 'spring',
              damping: 25,
              stiffness: 400,
              mass: 0.6
            }
          }}
          exit={{ 
            y: '100%', 
            opacity: 0,
            transition: {
              type: 'spring',
              damping: 30,
              stiffness: 400,
              mass: 0.6
            }
          }}
          className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-[1002] max-h-[70vh] overflow-y-auto"
        >
          <div className="p-6 pb-24">
            {/* Header with staggered animations */}
            <motion.div 
              className="flex justify-between items-start mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              <div className="flex items-center">
                <motion.span 
                  className="text-2xl mr-3"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    delay: 0.2, 
                    type: 'spring', 
                    stiffness: 400, 
                    damping: 25 
                  }}
                >
                  {selectedPOI.icon}
                </motion.span>
                <div>
                  <h2 className="text-xl font-bold">{selectedPOI.name}</h2>
                  <motion.div 
                    className="flex items-center mt-1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                  >
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm font-medium">{selectedPOI.rating}</span>
                      <span className="text-sm text-gray-500 ml-1">({selectedPOI.reviewCount})</span>
                    </div>
                    <span className="mx-2 text-gray-300">·</span>
                    <span className="text-sm text-gray-600">{getPriceLevel(selectedPOI.priceLevel)}</span>
                    <span className="mx-2 text-gray-300">·</span>
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      <span className={`text-sm ${selectedPOI.isOpen ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedPOI.isOpen ? 'Open' : 'Closed'}
                      </span>
                    </div>
                  </motion.div>
                </div>
              </div>
              <motion.button
                onClick={() => setSelectedPOI(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <X className="w-6 h-6" />
              </motion.button>
            </motion.div>

            {/* Description with fade-in */}
            <motion.p 
              className="text-gray-700 mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              {selectedPOI.description}
            </motion.p>

            {/* Address with icon animation */}
            <motion.div 
              className="flex items-center text-gray-600"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <MapPin className="w-4 h-4 mr-2" />
              </motion.div>
              <span>{selectedPOI.address}</span>
            </motion.div>

            {/* Enhanced GO Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ 
                delay: 0.6, 
                type: 'spring', 
                stiffness: 400, 
                damping: 25 
              }}
              className="fixed bottom-6 right-6"
            >
              <Button
                onClick={handleGoClick}
                className="bg-bettertrip-green hover:bg-bettertrip-green-hover text-white font-bold py-4 px-8 text-lg rounded-xl flex items-center justify-center shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl active:scale-95"
              >
                <motion.div
                  whileHover={{ x: 2 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  <Navigation className="w-5 h-5 mr-2" />
                </motion.div>
                GO
              </Button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default POIDetailSheet;
