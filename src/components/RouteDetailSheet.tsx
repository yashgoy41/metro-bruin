import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, PanInfo } from 'framer-motion';
import { X, Clock, ChevronRight, Star, MapPin, ArrowLeft } from 'lucide-react';
import { useMetro } from '@/contexts/MetroContext';

const RouteDetailSheet = () => {
  const { 
    selectedRoute, 
    setSelectedRoute, 
    setSelectedStop, 
    setMapCenter,
    pois,
    selectedCategory,
    setSelectedPOI,
    selectedBusStop,
    setPreviousRoute,
    routeSheetScrollPosition,
    setRouteSheetScrollPosition
  } = useMetro();
  
  // Sheet drag states
  const sheetRef = useRef<HTMLDivElement>(null);
  const stopsListRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [sheetHeight, setSheetHeight] = useState(300); // Default height in pixels
  const y = useMotionValue(0);
  const [selectedStopId, setSelectedStopId] = useState<string | null>(null);
  const [highlightedStopId, setHighlightedStopId] = useState<string | null>(null);

  // Snap points for the sheet (in vh)
  const snapPoints = {
    peek: '25vh',
    default: '40vh', 
    expanded: '70vh'
  };

  // Convert vh to pixels for calculations
  const getPixelHeight = (vh: string) => {
    const value = parseFloat(vh);
    return (value / 100) * window.innerHeight;
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    const currentHeight = getPixelHeight('40vh'); // Current default height
    
    // Determine which snap point to go to based on drag velocity and distance
    if (info.velocity.y > 800 || info.offset.y > currentHeight * 0.5) {
      // Close the sheet
      setSelectedRoute(null);
      setSelectedStopId(null);
    } else if (info.velocity.y > 400 || info.offset.y > currentHeight * 0.25) {
      // Snap to peek
      setSheetHeight(getPixelHeight(snapPoints.peek));
    } else if (info.velocity.y < -400 || info.offset.y < -currentHeight * 0.2) {
      // Snap to expanded
      setSheetHeight(getPixelHeight(snapPoints.expanded));
    } else {
      // Stay at default
      setSheetHeight(getPixelHeight(snapPoints.default));
    }
    
    // Reset y position
    y.set(0);
  };

  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // Only allow dragging down from peek position, or up/down from other positions
    if (info.offset.y < 0 && sheetHeight <= getPixelHeight(snapPoints.peek)) {
      return;
    }
  };

  const assignPOIsToClosestStops = () => {
    if (!selectedRoute) return new Map();

    const stopPOIs = new Map<string, typeof pois>();
    const categoryPOIs = pois.filter(poi => poi.category === selectedCategory);

    // For each POI, find the closest stop
    categoryPOIs.forEach(poi => {
      let closestStop = null;
      let minDistance = Infinity;

      selectedRoute.stops.forEach(stop => {
        const latDiff = Math.abs(poi.coordinates[1] - stop.coordinates[1]);
        const lonDiff = Math.abs(poi.coordinates[0] - stop.coordinates[0]);
        const distance = Math.sqrt(latDiff * latDiff + lonDiff * lonDiff);

        if (distance < minDistance && distance < 0.005) { // Within ~500m
          minDistance = distance;
          closestStop = stop;
        }
      });

      if (closestStop) {
        const existingPOIs = stopPOIs.get(closestStop.id) || [];
        stopPOIs.set(closestStop.id, [...existingPOIs, poi]);
      }
    });

    return stopPOIs;
  };

  const handleStopClick = (stop: any) => {
    // Save current scroll position before transitioning
    if (stopsListRef.current) {
      setScrollPosition(stopsListRef.current.scrollTop);
    }
    // Center map on the stop
    setMapCenter(stop.coordinates);
    setSelectedStopId(stop.id);
    setSheetHeight(getPixelHeight(snapPoints.expanded));
  };

  const handleBackClick = () => {
    setSelectedStopId(null);
    setSheetHeight(getPixelHeight(snapPoints.default));
    
    // Restore scroll position after the view has transitioned
    setTimeout(() => {
      if (stopsListRef.current) {
        stopsListRef.current.scrollTop = scrollPosition;
      }
    }, 100); // Small delay to ensure the DOM has updated
  };

  const handlePOIClick = (poi: any, event?: React.MouseEvent) => {
    // Prevent event bubbling if this is called from within a stop click handler
    if (event) {
      event.stopPropagation();
    }
    
    // Save current scroll position before transitioning to POI
    if (stopsListRef.current) {
      setRouteSheetScrollPosition(stopsListRef.current.scrollTop);
    }
    
    // Save the current route as previous route before closing
    if (selectedRoute) {
      setPreviousRoute(selectedRoute);
    }
    
    // Set the POI to show the POI sheet
    setSelectedPOI(poi);
    setMapCenter(poi.coordinates);
    
    // Close the route sheet temporarily
    setSelectedRoute(null);
    setSelectedStopId(null);
  };

  // Reset height and selection when route changes
  useEffect(() => {
    if (selectedRoute) {
      setSheetHeight(getPixelHeight(snapPoints.default));
      setSelectedStopId(null);
      y.set(0);
    }
  }, [selectedRoute]);

  // Restore scroll position when route sheet reopens
  useEffect(() => {
    if (selectedRoute && stopsListRef.current && routeSheetScrollPosition > 0) {
      // Small delay to ensure the DOM has updated
      setTimeout(() => {
        if (stopsListRef.current) {
          stopsListRef.current.scrollTop = routeSheetScrollPosition;
          // Clear the saved position after restoring
          setRouteSheetScrollPosition(0);
        }
      }, 100);
    }
  }, [selectedRoute, routeSheetScrollPosition, setRouteSheetScrollPosition]);

  // Scroll to selected bus stop and highlight it
  useEffect(() => {
    if (selectedBusStop && stopsListRef.current) {
      const stopElement = stopsListRef.current.querySelector(`[data-stop-id="${selectedBusStop.id}"]`);
      if (stopElement) {
        stopElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setHighlightedStopId(selectedBusStop.id);
        
        // Remove highlight after animation
        const timer = setTimeout(() => {
          setHighlightedStopId(null);
        }, 2000); // Duration matches the CSS animation

        return () => clearTimeout(timer);
      }
    }
  }, [selectedBusStop]);

  if (!selectedRoute) return null;

  const stopPOIs = assignPOIsToClosestStops();
  const selectedStop = selectedStopId ? selectedRoute.stops.find(s => s.id === selectedStopId) : null;
  const selectedStopPOIs = selectedStopId ? stopPOIs.get(selectedStopId) || [] : [];

  return (
    <AnimatePresence mode="wait">
      {selectedRoute && (
        <motion.div
          ref={sheetRef}
          key={selectedRoute.id}
          initial={{ y: '100%' }}
          animate={{ 
            y: 0,
            transition: { 
              type: 'spring', 
              damping: 30,
              stiffness: 300,
              mass: 0.8
            }
          }}
          exit={{ 
            y: '100%',
            transition: { 
              type: 'spring',
              damping: 30,
              stiffness: 300,
              mass: 0.8
            }
          }}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={{ top: 0, bottom: 0.2 }}
          dragMomentum={false}
          onDragStart={handleDragStart}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          style={{ 
            y,
            height: sheetHeight
          }}
          className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-[1002] overflow-hidden border-t border-gray-200"
        >
          {/* Drag Handle */}
          <div className={`flex justify-center py-4 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}>
            <div className="w-12 h-1.5 bg-gray-300 rounded-full transition-colors hover:bg-gray-400" />
          </div>

          <motion.div 
            className="overflow-y-auto h-full pb-6"
            style={{ 
              touchAction: isDragging ? 'none' : 'pan-y'
            }}
          >
            <style>
              {`
                @keyframes highlightPulse {
                  0% {
                    background-color: rgba(59, 130, 246, 0.1);
                    transform: scale(1);
                  }
                  50% {
                    background-color: rgba(59, 130, 246, 0.15);
                    transform: scale(1.01);
                  }
                  100% {
                    background-color: rgba(59, 130, 246, 0);
                    transform: scale(1);
                  }
                }

                .highlight-animation {
                  animation: highlightPulse 2s ease-out forwards;
                }
              `}
            </style>
            <AnimatePresence mode="wait">
              {!selectedStopId ? (
                // Route View
                <motion.div
                  key="route-view"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="px-6 pt-2"
                >
                  {/* Header */}
                  <div className="flex justify-between items-start mb-8">
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center shadow-md"
                        style={{ backgroundColor: selectedRoute.color }}
                      >
                        <span className="text-white font-bold text-lg">{selectedRoute.name}</span>
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">Route {selectedRoute.name}</h2>
                        <p className="text-gray-600">{selectedRoute.stops.length} stops</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedRoute(null)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>

                  {/* Stops List */}
                  <div className="space-y-1" ref={stopsListRef}>
                    {selectedRoute.stops.map((stop, index) => {
                      const nearbyPOIs = stopPOIs.get(stop.id) || [];
                      const isHighlighted = highlightedStopId === stop.id;

                      return (
                        <motion.div 
                          key={stop.id}
                          data-stop-id={stop.id}
                          className={`rounded-lg transition-colors ${isHighlighted ? 'highlight-animation' : ''}`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ 
                            opacity: 1, 
                            x: 0,
                            transition: { delay: index * 0.05 }
                          }}
                        >
                          <div 
                            className="flex items-center py-3 px-3 hover:bg-gray-50 cursor-pointer"
                            onClick={() => handleStopClick(stop)}
                          >
                            <div className="flex flex-col items-center mr-4">
                              <div 
                                className="w-2.5 h-2.5 rounded-full"
                                style={{ backgroundColor: selectedRoute.color }}
                              />
                              {index < selectedRoute.stops.length - 1 && (
                                <div 
                                  className="w-0.5 h-12 mt-1"
                                  style={{ backgroundColor: selectedRoute.color, opacity: 0.3 }}
                                />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-900 truncate">{stop.name}</h4>
                              <div className="flex items-center mt-1">
                                <Clock className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                                <p className="text-sm text-gray-600">Arrives in {stop.arrivalTime}</p>
                              </div>
                            </div>
                            {nearbyPOIs.length > 0 && (
                              <ChevronRight className="w-4 h-4 text-gray-400" />
                            )}
                          </div>

                          {/* Horizontal POI Pills */}
                          {nearbyPOIs.length > 0 && (
                            <div className="px-12 pb-3 overflow-x-auto whitespace-nowrap hide-scrollbar">
                              <div className="flex gap-2">
                                {nearbyPOIs.map((poi) => (
                                  <button
                                    key={poi.id}
                                    onClick={(e) => handlePOIClick(poi, e)}
                                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium text-gray-700 flex items-center gap-1.5 transition-colors flex-shrink-0"
                                  >
                                    <span className="text-base">{poi.icon}</span>
                                    {poi.name}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              ) : (
                // Stop View
                <motion.div
                  key="stop-view"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="px-6"
                >
                  {/* Stop Header */}
                  <div className="flex items-center gap-4 mb-6 pt-4">
                    <button
                      onClick={handleBackClick}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5 text-gray-500" />
                    </button>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 pt-2">{selectedStop?.name}</h2>
                      <div className="flex items-center mt-1">
                        <Clock className="w-4 h-4 mr-1.5 text-gray-400" />
                        <p className="text-gray-600">Arrives in {selectedStop?.arrivalTime}</p>
                      </div>
                    </div>
                  </div>

                  {/* POI List */}
                  <div className="space-y-3">
                    {selectedStopPOIs.map((poi) => (
                      <motion.div
                        key={poi.id}
                        onClick={(e) => handlePOIClick(poi, e)}
                        className="bg-gray-50 p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
                            <span className="text-xl">{poi.icon}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900">{poi.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex items-center">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="ml-1 text-sm">{poi.rating}</span>
                                <span className="text-sm text-gray-500 ml-1">({poi.reviewCount})</span>
                              </div>
                              <span className="text-gray-300">·</span>
                              <span className="text-sm text-gray-600">{'$'.repeat(poi.priceLevel)}</span>
                            </div>
                            <div className="flex items-center mt-1 text-sm text-gray-600">
                              <MapPin className="w-3.5 h-3.5 mr-1" />
                              <span className="truncate">{poi.address}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RouteDetailSheet;
