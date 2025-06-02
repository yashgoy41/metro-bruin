
import React from 'react';
import { MapPin } from 'lucide-react';

const CurrentLocationButton = () => {
  const handleLocationClick = () => {
    // Get the map instance and trigger location
    const mapElement = document.querySelector('.leaflet-container') as any;
    if (mapElement && mapElement._leaflet_map) {
      mapElement._leaflet_map.locate({ setView: true, maxZoom: 16 });
    }
  };

  return (
    <button
      onClick={handleLocationClick}
      className="fixed bottom-4 right-4 z-[1000] bg-white rounded-full p-3 shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors pointer-events-auto"
      style={{
        bottom: 'max(1rem, env(safe-area-inset-bottom))',
        right: 'max(1rem, env(safe-area-inset-right))'
      }}
      title="Show my location"
    >
      <MapPin size={24} className="text-blue-500" />
    </button>
  );
};

export default CurrentLocationButton;
