
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, PanInfo } from 'framer-motion';
import { X, Clock, ChevronRight } from 'lucide-react';
import { useMetro } from '@/contexts/MetroContext';

const RouteDetailSheet = () => {
  const { selectedRoute, setSelectedRoute } = useMetro();
  
  const sheetRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const y = useMotionValue(0);

  // Snap points as percentages of viewport height
  const snapPoints = {
    peek: 0.25,     // 25vh
    default: 0.4,   // 40vh
    expanded: 0.65  // 65vh
  };

  const [currentSnapPoint, setCurrentSnapPoint] = useState<keyof typeof snapPoints>('default');

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    const velocity = info.velocity.y;
    const offset = info.offset.y;
    const viewportHeight = window.innerHeight;

    // Determine snap point based on velocity and position
    if (velocity > 500 || offset > viewportHeight * 0.2) {
      // Close sheet
      setSelectedRoute(null);
      return;
    } else if (velocity > 200 || offset > viewportHeight * 0.1) {
      // Snap to peek
      setCurrentSnapPoint('peek');
    } else if (velocity < -200 || offset < -viewportHeight * 0.1) {
      // Snap to expanded
      setCurrentSnapPoint('expanded');
    } else {
      // Stay at current or go to default
      setCurrentSnapPoint('default');
    }
    
    y.set(0);
  };

  // Reset to default when route changes
  useEffect(() => {
    if (selectedRoute) {
      setCurrentSnapPoint('default');
      y.set(0);
    }
  }, [selectedRoute]);

  if (!selectedRoute) return null;

  const currentHeight = `${snapPoints[currentSnapPoint] * 100}vh`;

  return (
    <AnimatePresence mode="wait">
      {selectedRoute && (
        <motion.div
          ref={sheetRef}
          key={selectedRoute.id}
          initial={{ y: '100%' }}
          animate={{ 
            y: 0,
            height: currentHeight,
            transition: { 
              type: 'spring', 
              damping: 25,
              stiffness: 400,
              mass: 0.6
            }
          }}
          exit={{ 
            y: '100%',
            transition: { 
              type: 'spring',
              damping: 30,
              stiffness: 400,
              mass: 0.6
            }
          }}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={{ top: 0, bottom: 0.1 }}
          dragMomentum={false}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          style={{ y }}
          className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-[1002] overflow-hidden border-t border-gray-100"
        >
          {/* Enhanced Drag Handle */}
          <div className="flex justify-center py-4 bg-gray-50/50">
            <motion.div 
              className="w-10 h-1 bg-gray-300 rounded-full"
              animate={{
                backgroundColor: isDragging ? '#9CA3AF' : '#D1D5DB'
              }}
              transition={{ duration: 0.2 }}
            />
          </div>

          <motion.div 
            className="overflow-y-auto h-full pb-6"
            style={{ 
              touchAction: isDragging ? 'none' : 'pan-y'
            }}
          >
            <div className="px-6">
              {/* Header with improved animations */}
              <motion.div 
                className="flex justify-between items-start mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                <div className="flex items-center gap-4">
                  <motion.div 
                    className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
                    style={{ backgroundColor: selectedRoute.color }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  >
                    <span className="text-white font-bold text-lg">{selectedRoute.name}</span>
                  </motion.div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Route {selectedRoute.name}</h2>
                    <p className="text-gray-600">{selectedRoute.stops.length} stops</p>
                  </div>
                </div>
                <motion.button
                  onClick={() => setSelectedRoute(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  <X className="w-5 h-5 text-gray-500" />
                </motion.button>
              </motion.div>

              {/* Stops List with staggered animations */}
              <motion.div 
                className="space-y-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                {selectedRoute.stops.map((stop, index) => (
                  <motion.div 
                    key={stop.id} 
                    className="flex items-center py-3 px-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ 
                      opacity: 1, 
                      x: 0,
                      transition: { 
                        delay: 0.3 + index * 0.05,
                        type: 'spring',
                        stiffness: 400,
                        damping: 25
                      }
                    }}
                    whileHover={{ 
                      x: 4,
                      transition: { type: 'spring', stiffness: 400, damping: 25 }
                    }}
                  >
                    <div className="flex flex-col items-center mr-4">
                      <motion.div 
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: selectedRoute.color }}
                        whileHover={{ scale: 1.2 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
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
                    <motion.button 
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors ml-2"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    >
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </motion.button>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RouteDetailSheet;
