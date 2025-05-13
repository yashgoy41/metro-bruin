
import { useState, useEffect } from "react";
import { Trip } from "@/types/trip";
import SwipeCard from "./SwipeCard";
import { useTrips } from "@/contexts/TripContext";

const SwipeDeck = () => {
  const { trips, currentCategory, likeTrip } = useTrips();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filteredTrips, setFilteredTrips] = useState<Trip[]>([]);
  
  useEffect(() => {
    // Filter trips by category
    const filtered = trips.filter(trip => trip.category === currentCategory);
    setFilteredTrips(filtered);
    // Reset index when category changes
    setCurrentIndex(0);
  }, [trips, currentCategory]);

  const handleSwipeLeft = () => {
    // Skip this trip
    setCurrentIndex(prevIndex => Math.min(prevIndex + 1, filteredTrips.length - 1));
  };

  const handleSwipeRight = () => {
    // Like this trip
    if (filteredTrips[currentIndex]) {
      likeTrip(filteredTrips[currentIndex].id);
    }
    setCurrentIndex(prevIndex => Math.min(prevIndex + 1, filteredTrips.length - 1));
  };

  if (filteredTrips.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">No trips available for this category.</p>
      </div>
    );
  }

  if (currentIndex >= filteredTrips.length) {
    return (
      <div className="flex justify-center items-center h-64 flex-col">
        <p className="text-gray-500">No more trips to show.</p>
        <button 
          className="mt-4 px-4 py-2 bg-bettertrip-green text-white rounded-md"
          onClick={() => setCurrentIndex(0)}
        >
          Start Over
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <SwipeCard
        trip={filteredTrips[currentIndex]}
        onSwipeLeft={handleSwipeLeft}
        onSwipeRight={handleSwipeRight}
      />
    </div>
  );
};

export default SwipeDeck;
