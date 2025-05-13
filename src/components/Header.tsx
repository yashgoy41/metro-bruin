
import { MapPin } from "lucide-react";
import { useTrips } from "@/contexts/TripContext";

const Header = () => {
  const { currentLocation } = useTrips();

  return (
    <div className="flex flex-col items-start px-6 pt-6 pb-2">
      <h1 className="text-xl font-bold flex items-center justify-center w-full mb-2">
        <span className="mr-1">🚌</span>BetterTrip
      </h1>
      <div className="flex items-center text-base font-medium">
        <MapPin size={20} className="mr-2 text-bettertrip-green" />
        <span className="text-gray-800">{currentLocation}</span>
      </div>
    </div>
  );
};

export default Header;
