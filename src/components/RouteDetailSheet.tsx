
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, PanInfo } from 'framer-motion';
import { X, Clock, ChevronRight } from 'lucide-react';
import { useMetro } from '@/contexts/MetroContext';

const RouteDetailSheet = () => {
  const { selectedRoute, setSelectedRoute } = useMetro();
  
  // Sheet drag states
  const sheetRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [sheetHeight, setSheetHeight] = useState(300); // Default height in pixels
  const y = useMotionValue(0);

  // Snap points for the sheet (in vh)
  const snapPoints = {
    peek: '25vh',
    default: '40vh', 
    expanded: '60vh'
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

  // Reset height when route changes
  useEffect(() => {
    if (selectedRoute) {
      setSheetHeight(getPixelHeight(snapPoints.default));
      y.set(0);
    }
  }, [selectedRoute]);

  if (!selectedRoute) return null;

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
          <div className={`flex justify-center py-3 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}>
            <div className="w-12 h-1.5 bg-gray-300 rounded-full transition-colors hover:bg-gray-400" />
          </div>

          <motion.div 
            className="overflow-y-auto h-full pb-6"
            style={{ 
              touchAction: isDragging ? 'none' : 'pan-y'
            }}
          >
            <div className="px-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
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
              <div className="space-y-1">
                {selectedRoute.stops.map((stop, index) => (
                  <motion.div 
                    key={stop.id} 
                    className="flex items-center py-3 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ 
                      opacity: 1, 
                      x: 0,
                      transition: { delay: index * 0.05 }
                    }}
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
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors ml-2">
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RouteDetailSheet;
