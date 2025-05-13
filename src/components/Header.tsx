
import { MapPin } from "lucide-react";
import { useTrips } from "@/contexts/TripContext";

const Header = () => {
  const { currentLocation } = useTrips();

  return (
    <div className="flex flex-col items-center justify-center pt-6 pb-2">
      <h1 className="text-xl font-bold flex items-center">
        <span className="mr-1">🚌</span>BetterTrip
      </h1>
      <div className="flex items-center text-sm text-gray-600 mt-1">
        <MapPin size={14} className="mr-1" />
        <span>{currentLocation}</span>
      </div>
    </div>
  );
};

export default Header;
