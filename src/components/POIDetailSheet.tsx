import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, MapPin, Clock, Navigation } from 'lucide-react';
import { useMetro } from '@/contexts/MetroContext';
import { Button } from '@/components/ui/button';
import { TransitRouter } from '@/components/TransitRouter';
import { set } from 'date-fns';
import { BusLine } from '@/types/metro';

const POIDetailSheet = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const { 
    busLines,
    selectedPOI, 
    selectedRoute,
    setSelectedPOI, 
    mapCenter, 
    previousRoute, 
    setPreviousRoute,
    setSelectedRoute,
    setSelectedBusStop
  } = useMetro();
  const { getRouteDirections } = TransitRouter();

  const findNearestBusStop = () => {
    if (!selectedPOI || !busLines || busLines.length === 0) return null;

    let nearestStop = null;
    let shortestDistance = Infinity;
    let associatedLine: BusLine = null;

    busLines.forEach((line) => {
      line.stops.forEach((stop) => {
        const distance = Math.sqrt(
          Math.pow(stop.coordinates[1] - selectedPOI.coordinates[1], 2) +
          Math.pow(stop.coordinates[0] - selectedPOI.coordinates[0], 2)
        );

        if (distance < shortestDistance) {
          shortestDistance = distance;
          nearestStop = stop;
          associatedLine = line;
        }
      });
    });
    
    setSelectedBusStop(nearestStop);
    setSelectedRoute(associatedLine);

    return { stop: nearestStop, line: associatedLine };
  };

  const handleGoClick = () => {
    if (!selectedPOI) return;
    
    // Use our transit router instead of Google Maps
    const route = getRouteDirections(mapCenter, selectedPOI.coordinates);
    
    if (route) {
      // You could show route details in a new component or modal here
      console.log('Route found:', route);
      
      // For now, let's show an alert with the route info
      alert(`Route found!\nDistance: ${route.distance}m\nDuration: ${Math.round(route.duration/60)} min\nInstructions: ${route.instructions.join(' → ')}`);
    } else {
      // Fallback to Google Maps if no transit route found
      const startingLocation = "UCLA, Los Angeles, CA";
      const destinationAddress = selectedPOI.address;
      
      const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(startingLocation)}&destination=${encodeURIComponent(destinationAddress)}&travelmode=transit`;
      
      window.open(mapsUrl, '_blank');
    }
  };

  const handleClose = () => {
    setSelectedRoute(null);
    setSelectedBusStop(null);
    setSelectedPOI(null);
    setIsExpanded(false);
    
    // If there was a previous route, restore it (this will make the route sheet visible again)
    if (previousRoute) {
      setSelectedRoute(previousRoute);
      setPreviousRoute(null);
      // The scroll position will be restored automatically by RouteDetailSheet's effect
    }
  };

  const handleDragEnd = (event, info) => {
    const threshold = -100; // Drag up threshold in pixels
    
    if (info.offset.y < threshold) {
      setIsExpanded(true);
    } else if (info.offset.y > 100) {
      setIsExpanded(false);
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
          initial={{ y: '100%' }}
          animate={{ 
            y: 0,
            height: isExpanded ? '80vh' : '20vh'
          }}
          exit={{ y: '100%' }}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          transition={{ type: 'spring', damping: 25, stiffness: 500 }}
          className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-[1002] overflow-hidden"
        >
          {/* Drag handle */}
          <div className="flex justify-center pt-2 pb-1">
            <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
          </div>
          
          <div className="h-full overflow-y-auto">
            <div className="p-6 pb-24">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{selectedPOI.icon}</span>
                  <div>
                    <h2 className="text-xl font-bold">{selectedPOI.name}</h2>
                    <div className="flex items-center mt-1">
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
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  {/* Description */}
                  <p className="text-gray-700 mb-4">{selectedPOI.description}</p>

                  {/* Address */}
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="text-sm">{selectedPOI.address}</span>
                  </div>

                  {/* Nearest Bus Stop */}
                  <div className="flex items-center mb-4 text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="text-sm">
                      Nearest Stop: {findNearestBusStop()?.stop?.name || 'No nearby stop found'} ({findNearestBusStop()?.line?.name || 'No associated line'})
                    </span>
                  </div>

                  {selectedRoute && selectedRoute.id && selectedRoute.color && (
                    <motion.button
                      key={selectedRoute.id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 rounded-full text-white font-bold shadow-lg min-w-[60px] mb-4"
                      style={{ 
                        backgroundColor: selectedRoute.color,
                        '--tw-ring-color': selectedRoute.color
                      } as any}
                    >
                      {selectedRoute.name}
                    </motion.button>
                  )}

                  {/* Additional content that shows when expanded */}
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="space-y-4"
                    >
                      <div className="border-t pt-4">
                        <h3 className="font-semibold text-lg mb-2">Additional Information</h3>
                        <p className="text-gray-600 text-sm">
                          This location offers great amenities and is easily accessible via public transit. 
                          Check the nearest bus stop information above for the best route to get here.
                        </p>
                      </div>
                      
                      <div className="border-t pt-4">
                        <h3 className="font-semibold text-lg mb-2">Hours</h3>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex justify-between">
                            <span>Monday - Friday</span>
                            <span>9:00 AM - 9:00 PM</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Saturday</span>
                            <span>10:00 AM - 8:00 PM</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Sunday</span>
                            <span>10:00 AM - 6:00 PM</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
                
                <div className="lg:w-1/3">
                  <img 
                    src={selectedPOI.image} 
                    alt={selectedPOI.name} 
                    className="w-full h-32 lg:h-48 object-cover rounded-lg"
                  />
                </div>
              </div>

              {/* Drag instruction - only show when not expanded */}
              {!isExpanded && (
                <div className="text-center mt-4 text-gray-400 text-sm">
                  Drag up to see more details
                </div>
              )}
            </div>
          </div>

          {/* GO Button - Fixed position */}
          <Button
            onClick={handleGoClick}
            className="fixed bottom-6 right-6 bg-bettertrip-green hover:bg-bettertrip-green-hover text-white font-bold py-4 px-8 text-lg rounded-xl flex items-center justify-center shadow-lg z-10"
          >
            <Navigation className="w-5 h-5 mr-2" />
            GO
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default POIDetailSheet;