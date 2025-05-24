
import React from 'react';
import { motion } from 'framer-motion';
import { useMetro } from '@/contexts/MetroContext';

const RouteChips = () => {
  const { busLines, visibleRoutes, setSelectedRoute } = useMetro();

  const visibleBusLines = busLines.filter(line => visibleRoutes.includes(line.id));

  return (
    <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
      {visibleBusLines.map((line) => (
        <motion.button
          key={line.id}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSelectedRoute(line)}
          className="px-4 py-2 rounded-full text-white font-bold shadow-lg min-w-[60px]"
          style={{ backgroundColor: line.color }}
        >
          {line.name}
        </motion.button>
      ))}
    </div>
  );
};

export default RouteChips;
