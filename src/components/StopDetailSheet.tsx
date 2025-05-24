
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star } from 'lucide-react';
import { useMetro } from '@/contexts/MetroContext';

const StopDetailSheet = () => {
  const { selectedStop, setSelectedStop, pois, selectedCategory, setSelectedPOI, setMapCenter } = useMetro();

  const nearbyPOIs = selectedStop 
    ? pois.filter(poi => 
        selectedStop.nearbyPOIs.includes(poi.id) && poi.category === selectedCategory
      )
    : [];

  const handlePOIClick = (poi: any) => {
    setSelectedPOI(poi);
    setMapCenter(poi.coordinates);
    setSelectedStop(null);
  };

  return (
    <AnimatePresence>
      {selectedStop && (
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
          <div className="p-6">
            {/* Header with animations */}
            <motion.div 
              className="flex justify-between items-start mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              <div>
                <h2 className="text-xl font-bold mb-2">{selectedStop.name}</h2>
                <p className="text-gray-600">Nearby {selectedCategory}</p>
              </div>
              <motion.button
                onClick={() => setSelectedStop(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <X className="w-6 h-6" />
              </motion.button>
            </motion.div>

            {/* POI List with staggered animations */}
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              {nearbyPOIs.map((poi, index) => (
                <motion.div
                  key={poi.id}
                  onClick={() => handlePOIClick(poi)}
                  className="flex items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ 
                    opacity: 1, 
                    x: 0,
                    transition: { 
                      delay: 0.3 + index * 0.1,
                      type: 'spring',
                      stiffness: 400,
                      damping: 25
                    }
                  }}
                  whileHover={{ 
                    scale: 1.02,
                    x: 4,
                    transition: { type: 'spring', stiffness: 400, damping: 25 }
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div 
                    className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  >
                    <span className="text-xl">{poi.icon}</span>
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{poi.name}</h3>
                    <div className="flex items-center text-sm text-gray-600">
                      <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                      <span>{poi.rating}</span>
                      <span className="mx-2">·</span>
                      <span>{'$'.repeat(poi.priceLevel)}</span>
                      <span className="mx-2">·</span>
                      <span className={poi.isOpen ? 'text-green-600' : 'text-red-600'}>
                        {poi.isOpen ? 'Open' : 'Closed'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {nearbyPOIs.length === 0 && (
                <motion.div 
                  className="text-center py-8 text-gray-500"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                >
                  No {selectedCategory} nearby
                </motion.div>
              )}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StopDetailSheet;
