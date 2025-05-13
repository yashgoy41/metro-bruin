
import { useState } from "react";
import { Trip } from "@/types/trip";
import { X, Heart } from "lucide-react";
import RoutePreview from "./RoutePreview";
import GoButton from "./GoButton";
import { useTrips } from "@/contexts/TripContext";

interface SwipeCardProps {
  trip: Trip;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

const SwipeCard = ({ trip, onSwipeLeft, onSwipeRight }: SwipeCardProps) => {
  const { likeTrip } = useTrips();
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartPos({ x: e.clientX, y: e.clientY });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - startPos.x,
      y: e.clientY - startPos.y,
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    setOffset({
      x: e.touches[0].clientX - startPos.x,
      y: e.touches[0].clientY - startPos.y,
    });
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    
    if (offset.x > 100) {
      onSwipeRight();
    } else if (offset.x < -100) {
      onSwipeLeft();
    }
    
    setIsDragging(false);
    setOffset({ x: 0, y: 0 });
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    if (offset.x > 100) {
      onSwipeRight();
    } else if (offset.x < -100) {
      onSwipeLeft();
    }
    
    setIsDragging(false);
    setOffset({ x: 0, y: 0 });
  };

  const handleLike = () => {
    likeTrip(trip.id);
    onSwipeRight();
  };

  const handleReject = () => {
    onSwipeLeft();
  };

  const cardStyle = {
    transform: isDragging ? `translateX(${offset.x}px) rotate(${offset.x * 0.05}deg)` : 'none',
    transition: isDragging ? 'none' : 'transform 0.3s ease',
  };

  return (
    <div className="w-full px-4 flex flex-col items-center">
      <div
        className="w-full max-w-md bg-white rounded-xl shadow-md overflow-hidden"
        style={cardStyle}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold">{trip.name}</h2>
          <p className="text-gray-500">{trip.location}</p>
          
          <div className="my-8 px-4">
            <RoutePreview route={trip.route} />
          </div>
          
          <div className="flex justify-between items-center mt-6">
            <div className="flex items-center">
              <div className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-300 mr-2">
                <span className="text-sm">⏱️</span>
              </div>
              <span className="text-sm">{trip.transitTime}</span>
            </div>
            
            <div className="flex items-center">
              <div className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-300 mr-2">
                <span className="text-sm">🚌</span>
              </div>
              <span className="text-sm">{trip.transitRating} ★</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center items-center gap-6 mt-6">
        <button
          onClick={handleReject}
          className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-gray-300"
        >
          <X size={20} />
        </button>
        
        <GoButton tripId={trip.id} />
        
        <button
          onClick={handleLike}
          className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-gray-300"
        >
          <Heart size={20} />
        </button>
      </div>
    </div>
  );
};

export default SwipeCard;
