
import { X, Heart } from "lucide-react";
import { Trip } from "@/types/trip";
import RoutePreview from "./RoutePreview";
import GoButton from "./GoButton";
import { useTrips } from "@/contexts/TripContext";

interface TripCardExpandedProps {
  trip: Trip;
  onClose: () => void;
}

const TripCardExpanded = ({ trip, onClose }: TripCardExpandedProps) => {
  const { likeTrip, unlikeTrip, likedTrips } = useTrips();
  const isLiked = likedTrips.some((likedTrip) => likedTrip.id === trip.id);

  const toggleLike = () => {
    if (isLiked) {
      unlikeTrip(trip.id);
    } else {
      likeTrip(trip.id);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{trip.name}</h2>
        <div className="flex items-center gap-2">
          <button 
            onClick={toggleLike} 
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <Heart 
              size={24} 
              className={isLiked ? "text-red-500 fill-red-500" : "text-gray-400"} 
            />
          </button>
          <button onClick={onClose} className="p-1">
            <X size={20} />
          </button>
        </div>
      </div>
      
      <p className="text-gray-500 mb-4">{trip.location}</p>
      
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-sm font-medium">Address</p>
          <p className="text-sm text-gray-500">{trip.address}</p>
        </div>
        
        <div className="flex flex-col items-end">
          <div className="flex items-center mb-1">
            <div className="w-5 h-5 flex items-center justify-center rounded-full border border-gray-300 mr-1">
              <span className="text-xs">⏱️</span>
            </div>
            <span className="text-sm">{trip.transitTime}</span>
          </div>
          <div className="flex items-center">
            <div className="w-5 h-5 flex items-center justify-center rounded-full border border-gray-300 mr-1">
              <span className="text-xs">🚌</span>
            </div>
            <span className="text-sm">{trip.transitRating} ★</span>
          </div>
        </div>
      </div>
      
      <div className="border rounded-lg p-4 mb-4">
        <RoutePreview route={trip.route} className="h-20" />
      </div>
      
      <div className="flex justify-center">
        <GoButton tripId={trip.id} />
      </div>
    </div>
  );
};

export default TripCardExpanded;
