
import { useTrips } from "@/contexts/TripContext";
import TripCard from "./TripCard";
import { Filter } from "lucide-react";

const TripList = () => {
  const { trips, currentCategory } = useTrips();
  
  // Filter trips by current category
  const filteredTrips = trips.filter(trip => trip.category === currentCategory);

  return (
    <div className="px-4 pb-20">
      <div className="flex justify-end mb-2">
        <button className="p-2">
          <Filter size={20} className="text-gray-500" />
        </button>
      </div>
      
      {filteredTrips.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">No trips available for this category.</p>
        </div>
      ) : (
        filteredTrips.map((trip) => (
          <TripCard key={trip.id} trip={trip} />
        ))
      )}
    </div>
  );
};

export default TripList;
