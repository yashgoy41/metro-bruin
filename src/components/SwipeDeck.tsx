
import { useState, useEffect } from "react";
import { Trip } from "@/types/trip";
import SwipeCard from "./SwipeCard";
import { useTrips } from "@/contexts/TripContext";
import { Undo } from "lucide-react";

const SwipeDeck = () => {
  const { trips, currentCategory, likeTrip } = useTrips();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const [filteredTrips, setFilteredTrips] = useState<Trip[]>([]);
  const [goBackActive, setGoBackActive] = useState(false);
  
  useEffect(() => {
    // Filter trips by category
    const filtered = trips.filter(trip => trip.category === currentCategory);
    setFilteredTrips(filtered);
    // Reset index when category changes
    setCurrentIndex(0);
    setPreviousIndex(null);
  }, [trips, currentCategory]);

  const handleSwipeLeft = () => {
    // Skip this trip
    setPreviousIndex(currentIndex);
    setCurrentIndex(prevIndex => Math.min(prevIndex + 1, filteredTrips.length - 1));
  };

  const handleSwipeRight = () => {
    // Like this trip
    if (filteredTrips[currentIndex]) {
      likeTrip(filteredTrips[currentIndex].id);
    }
    setPreviousIndex(currentIndex);
    setCurrentIndex(prevIndex => Math.min(prevIndex + 1, filteredTrips.length - 1));
  };

  const handleGoBack = () => {
    if (previousIndex !== null) {
      setGoBackActive(true);
      setCurrentIndex(previousIndex);
      setPreviousIndex(null);
      
      // Reset the button state after a brief delay
      setTimeout(() => {
        setGoBackActive(false);
      }, 300);
    }
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
          onClick={() => {
            setCurrentIndex(0);
            setPreviousIndex(null);
          }}
        >
          Start Over
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {/* Go Back Button - now positioned above the card */}
      <div className="flex justify-start px-4 mb-3">
        <button
          onClick={handleGoBack}
          disabled={previousIndex === null}
          className={`w-10 h-10 flex items-center justify-center rounded-full border-2
          ${goBackActive 
            ? "border-yellow-400 bg-yellow-50 scale-110" 
            : previousIndex !== null 
              ? "border-gray-200 bg-white hover:bg-gray-50" 
              : "border-gray-200 bg-gray-100 opacity-50 cursor-not-allowed"
          } shadow-sm transition-all duration-300`}
        >
          <Undo 
            size={18} 
            className={`${goBackActive ? "text-yellow-500" : previousIndex !== null ? "text-gray-500" : "text-gray-300"}`} 
          />
        </button>
      </div>

      <SwipeCard
        trip={filteredTrips[currentIndex]}
        onSwipeLeft={handleSwipeLeft}
        onSwipeRight={handleSwipeRight}
      />
    </div>
  );
};

export default SwipeDeck;
