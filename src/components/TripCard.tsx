
import { useState } from "react";
import { Trip } from "@/types/trip";
import { ChevronDown, ChevronUp, Heart } from "lucide-react";
import RoutePreview from "./RoutePreview";
import GoButton from "./GoButton";
import { useTrips } from "@/contexts/TripContext";

interface TripCardProps {
  trip: Trip;
}

const TripCard = ({ trip }: TripCardProps) => {
  const { likeTrip, unlikeTrip, likedTrips } = useTrips();
  const [expanded, setExpanded] = useState(false);
  const isLiked = likedTrips.some(likedTrip => likedTrip.id === trip.id);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const toggleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLiked) {
      unlikeTrip(trip.id);
    } else {
      likeTrip(trip.id);
    }
  };

  return (
    <div className="border rounded-lg mb-4 overflow-hidden bg-white">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-lg font-medium">{trip.name}</h2>
            <p className="text-sm text-gray-500">{trip.location}</p>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center mb-1">
              <div className="w-5 h-5 flex items-center justify-center rounded-full border border-gray-300 mr-1">
                <span className="text-xs">⏱️</span>
              </div>
              <span className="text-xs">{trip.transitTime}</span>
            </div>
            <div className="flex items-center">
              <div className="w-5 h-5 flex items-center justify-center rounded-full border border-gray-300 mr-1">
                <span className="text-xs">🚌</span>
              </div>
              <span className="text-xs">{trip.transitRating} ★</span>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-2">
          <button onClick={toggleLike} className="p-2">
            <Heart 
              size={20} 
              className={isLiked ? "text-red-500 fill-red-500" : "text-gray-400"} 
            />
          </button>
          
          <button onClick={toggleExpand} className="p-2">
            {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </div>
      
      {expanded && (
        <div className="p-4 border-t animate-slide-in-up">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm font-medium mb-1">Address</p>
              <p className="text-xs text-gray-500">{trip.address}</p>
            </div>
            <GoButton tripId={trip.id} size="small" />
          </div>
          
          <div className="border rounded p-4 mt-2">
            <RoutePreview route={trip.route} className="h-16" />
          </div>
          
          <div className="flex justify-center mt-2">
            <button onClick={toggleExpand} className="p-2">
              <ChevronUp size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripCard;
