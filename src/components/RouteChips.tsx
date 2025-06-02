
import React from 'react';
import { motion } from 'framer-motion';
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
    <div className="absolute top-[120px] left-2 z-[1000] flex flex-col gap-2 pointer-events-auto max-h-[calc(100vh-180px)] overflow-y-auto scrollbar-hide max-w-[200px]">
      {visibleBusLines.map((line) => {
        const isSelected = selectedRoute?.id === line.id;
        return (
          <motion.button
            key={line.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleRouteClick(line)}
            className={`px-3 py-2 rounded-full text-white font-bold shadow-lg min-w-[50px] min-h-[40px] text-sm pointer-events-auto transition-all flex items-center justify-center ${
              isSelected ? 'ring-4 ring-opacity-50' : ''
            }`}
            style={{ 
              backgroundColor: line.color,
              '--tw-ring-color': line.color
            } as any}
          >
            {line.name}
          </motion.button>
        );
      })}
    </div>
  );
};

export default RouteChips;
