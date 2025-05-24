import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, PanInfo } from 'framer-motion';
import { X, GripHorizontal, Clock, ChevronRight } from 'lucide-react';
import { useMetro } from '@/contexts/MetroContext';

const RouteDetailSheet = () => {
  const { selectedRoute, setSelectedRoute } = useMetro();
  
  // Sheet drag states
  const sheetRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [sheetPosition, setSheetPosition] = useState<'expanded' | 'default' | 'peek'>('peek');
  const y = useMotionValue(0);
  const [previousRoute, setPreviousRoute] = useState<any>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Handle route changes
  useEffect(() => {
    if (selectedRoute) {
      if (previousRoute && previousRoute.id !== selectedRoute.id) {
        // Start transition
        setIsTransitioning(true);
        // After the exit animation completes, we'll show the new route
        setTimeout(() => {
          setPreviousRoute(selectedRoute);
          setIsTransitioning(false);
        }, 300); // Match this with exit animation duration
      } else if (!previousRoute) {
        setPreviousRoute(selectedRoute);
      }
    } else {
      setPreviousRoute(null);
    }
  }, [selectedRoute]);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    const sheetHeight = sheetRef.current?.getBoundingClientRect().height || 0;
    
    if (info.velocity.y > 500 || info.offset.y > sheetHeight * 0.6) {
      setSelectedRoute(null);
    } else if (info.velocity.y > 200 || info.offset.y > sheetHeight * 0.3) {
      setSheetPosition('peek');
      y.set(0);
    } else if (info.velocity.y < -200 || info.offset.y < -sheetHeight * 0.2) {
      setSheetPosition('default');
      y.set(0);
    } else {
      setSheetPosition('peek');
      y.set(0);
    }
  };

  if (!selectedRoute) return null;

  // Different heights for different states
  const getSheetHeight = () => {
    switch (sheetPosition) {
      case 'expanded':
        return '50vh';
      case 'default':
        return '40vh';
      case 'peek':
        return '25vh';
      default:
        return '25vh';
    }
  };

  return (
    <AnimatePresence mode="wait">
      {selectedRoute && !isTransitioning && (
        <motion.div
          ref={sheetRef}
          key={selectedRoute.id}
          initial={{ y: '100%' }}
          animate={{ 
            y: 0,
            height: getSheetHeight(),
            transition: { 
              type: 'spring', 
              damping: 70,
              stiffness: 400,
              mass: 1,
              duration: 0.3,
              restDelta: 0.01
            }
          }}
          exit={{ 
            y: '100%',
            transition: { 
              type: 'tween',
              duration: 0.3,
              ease: 'easeInOut'
            }
          }}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.1}
          dragMomentum={false}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          style={{ y }}
          className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-[1002] overflow-hidden"
        >
          {/* Drag Handle */}
          <div className={`flex justify-center pt-2 pb-1 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}>
            <GripHorizontal className="w-8 h-8 text-gray-300" />
          </div>

          <motion.div 
            className="overflow-y-auto h-full"
            style={{ touchAction: 'pan-y' }}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div 
                      className="w-14 h-14 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: selectedRoute.color }}
                    >
                      <span className="text-white font-bold text-2xl">{selectedRoute.name}</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Route Details</h2>
                      <p className="text-gray-600">{selectedRoute.stops.length} stops</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedRoute(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Stops List */}
              <div className="space-y-4">
                {selectedRoute.stops.map((stop, index) => (
                  <div key={stop.id} className="flex items-start">
                    <div className="flex flex-col items-center mr-4">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: selectedRoute.color }}
                      />
                      {index < selectedRoute.stops.length - 1 && (
                        <div 
                          className="w-0.5 h-16"
                          style={{ backgroundColor: selectedRoute.color }}
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-lg">{stop.name}</h4>
                      <div className="flex items-center mt-1">
                        <Clock className="w-4 h-4 mr-1 text-gray-500" />
                        <p className="text-gray-600">Arrives in {stop.arrivalTime}</p>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
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
