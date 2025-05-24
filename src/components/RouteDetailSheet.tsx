
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Clock } from 'lucide-react';
import { useMetro } from '@/contexts/MetroContext';

const RouteDetailSheet = () => {
  const { selectedRoute, setSelectedRoute, setSelectedStop, pois, selectedCategory } = useMetro();

  const handleStopClick = (stop: any) => {
    setSelectedStop(stop);
    setSelectedRoute(null);
  };

  return (
    <AnimatePresence>
      {selectedRoute && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 500 }}
          className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-20 max-h-[70vh] overflow-y-auto"
        >
          <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <div
                  className="px-4 py-2 rounded-full text-white font-bold mr-4"
                  style={{ backgroundColor: selectedRoute.color }}
                >
                  {selectedRoute.name}
                </div>
                <h2 className="text-xl font-bold">Route Details</h2>
              </div>
              <button
                onClick={() => setSelectedRoute(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Timeline */}
            <div className="space-y-4">
              {selectedRoute.stops.map((stop, index) => {
                const nearbyPOIs = pois.filter(poi => 
                  stop.nearbyPOIs.includes(poi.id) && poi.category === selectedCategory
                );

                return (
                  <div key={stop.id} className="flex items-start">
                    {/* Timeline dot */}
                    <div className="flex flex-col items-center mr-4">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: selectedRoute.color }}
                      />
                      {index < selectedRoute.stops.length - 1 && (
                        <div 
                          className="w-0.5 h-16 mt-2"
                          style={{ backgroundColor: selectedRoute.color }}
                        />
                      )}
                    </div>

                    {/* Stop details */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">{stop.name}</h3>
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="w-3 h-3 mr-1" />
                            {stop.arrivalTime}
                          </div>
                        </div>
                        <button
                          onClick={() => handleStopClick(stop)}
                          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Nearby POIs */}
                      {nearbyPOIs.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {nearbyPOIs.slice(0, 3).map((poi) => (
                            <span
                              key={poi.id}
                              className="px-2 py-1 bg-gray-100 text-xs rounded-full text-gray-700"
                            >
                              {poi.icon} {poi.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RouteDetailSheet;
