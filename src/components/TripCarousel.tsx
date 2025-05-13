
import { ChevronRight } from "lucide-react";
import { Trip } from "@/types/trip";
import { useState } from "react";
import TripCardExpanded from "./TripCardExpanded";

interface TripCarouselProps {
  title: string;
  trips: Trip[];
}

const TripCarousel = ({ title, trips }: TripCarouselProps) => {
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  return (
    <>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3 px-4">
          <h2 className="text-lg font-medium">{title}</h2>
          <ChevronRight size={20} className="text-gray-500" />
        </div>
        
        {trips.length === 0 ? (
          <div className="px-4">
            <p className="text-sm text-gray-500">No trips yet.</p>
          </div>
        ) : (
          <div className="flex overflow-x-auto hide-scrollbar gap-3 px-4">
            {trips.map((trip) => (
              <div
                key={trip.id}
                className="min-w-[100px] h-[100px] flex-shrink-0 rounded-md overflow-hidden border bg-white flex items-center justify-center"
                onClick={() => setSelectedTrip(trip)}
              >
                <div className="p-2 text-center">
                  <div className="text-sm font-medium truncate w-full">{trip.name}</div>
                  <div className="text-xs text-gray-500 truncate w-full">{trip.location}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {selectedTrip && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-10">
          <div className="bg-white rounded-lg w-full max-w-md">
            <TripCardExpanded 
              trip={selectedTrip} 
              onClose={() => setSelectedTrip(null)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default TripCarousel;
