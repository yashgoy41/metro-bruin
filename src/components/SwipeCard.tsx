
import { useState } from "react";
import { Trip } from "@/types/trip";
import { X, Heart } from "lucide-react";
import RoutePreview from "./RoutePreview";
import GoButton from "./GoButton";
import { useTrips } from "@/contexts/TripContext";
import { Card, CardContent } from "@/components/ui/card";

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
      <Card
        className="w-full max-w-md overflow-hidden shadow-md"
        style={cardStyle}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <CardContent className="p-8">
          <h2 className="text-2xl font-semibold mb-2">{trip.name}</h2>
          <p className="text-gray-500 mb-6">{trip.location}</p>
          
          <div className="my-10 px-4">
            <RoutePreview route={trip.route} />
          </div>
          
          <div className="flex justify-between items-center mt-8">
            <div className="flex items-center">
              <div className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 mr-2">
                <span className="text-sm">⏱️</span>
              </div>
              <span className="text-sm font-medium">{trip.transitTime}</span>
            </div>
            
            <div className="flex items-center">
              <div className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 mr-2">
                <span className="text-sm">🚌</span>
              </div>
              <span className="text-sm font-medium">{trip.transitRating} ★</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-center items-center gap-8 mt-8">
        <button
          onClick={handleReject}
          className="w-14 h-14 flex items-center justify-center rounded-full border-2 border-gray-200 bg-white shadow-sm transition-colors hover:bg-gray-50"
        >
          <X size={22} className="text-gray-500" />
        </button>
        
        <GoButton tripId={trip.id} />
        
        <button
          onClick={handleLike}
          className="w-14 h-14 flex items-center justify-center rounded-full border-2 border-gray-200 bg-white shadow-sm transition-colors hover:bg-gray-50"
        >
          <Heart size={22} className="text-gray-500" />
        </button>
      </div>
    </div>
  );
};

export default SwipeCard;
