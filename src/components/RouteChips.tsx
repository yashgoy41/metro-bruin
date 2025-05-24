
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMetro } from '@/contexts/MetroContext';

const RouteChips = () => {
  const { busLines, visibleRoutes, selectedRoute, setSelectedRoute } = useMetro();

  const visibleBusLines = busLines.filter(line => visibleRoutes.includes(line.id));

  const handleRouteClick = (line: any) => {
    if (selectedRoute?.id === line.id) {
      setSelectedRoute(null);
    } else {
      setSelectedRoute(line);
    }
  };

  return (
    <div className="absolute top-36 left-4 z-[1000] flex flex-col gap-3 pointer-events-auto">
      <AnimatePresence>
        {visibleBusLines.map((line, index) => {
          const isSelected = selectedRoute?.id === line.id;
          return (
            <motion.button
              key={line.id}
              initial={{ scale: 0, opacity: 0, x: -50 }}
              animate={{ 
                scale: 1, 
                opacity: 1, 
                x: 0,
                transition: {
                  delay: index * 0.1,
                  type: 'spring',
                  stiffness: 400,
                  damping: 25
                }
              }}
              exit={{ 
                scale: 0, 
                opacity: 0, 
                x: -50,
                transition: {
                  type: 'spring',
                  stiffness: 400,
                  damping: 25
                }
              }}
              whileHover={{ 
                scale: 1.1,
                y: -2,
                transition: { type: 'spring', stiffness: 400, damping: 25 }
              }}
              whileTap={{ 
                scale: 0.95,
                transition: { type: 'spring', stiffness: 400, damping: 25 }
              }}
              onClick={() => handleRouteClick(line)}
              className={`px-4 py-3 rounded-2xl text-white font-bold shadow-lg min-w-[60px] pointer-events-auto transition-all duration-300 ${
                isSelected ? 'shadow-xl' : 'shadow-lg'
              }`}
              style={{ 
                backgroundColor: line.color,
                boxShadow: isSelected 
                  ? `0 8px 25px -5px ${line.color}40, 0 0 0 3px ${line.color}30`
                  : '0 4px 15px -3px rgba(0, 0, 0, 0.1), 0 2px 6px -2px rgba(0, 0, 0, 0.05)'
              }}
            >
              <motion.span
                animate={{
                  scale: isSelected ? 1.1 : 1
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                {line.name}
              </motion.span>
            </motion.button>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default RouteChips;
