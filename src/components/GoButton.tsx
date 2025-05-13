
import { useTrips } from "@/contexts/TripContext";

interface GoButtonProps {
  tripId: string;
  size?: "small" | "large";
}

const GoButton = ({ tripId, size = "large" }: GoButtonProps) => {
  const { visitTrip } = useTrips();

  return (
    <button
      onClick={() => visitTrip(tripId)}
      className={`bg-bettertrip-green hover:bg-bettertrip-green-hover text-white font-medium rounded-md transition-colors
        ${size === "large" ? "px-8 py-2 text-lg" : "px-4 py-1 text-sm"}`}
    >
      GO
    </button>
  );
};

export default GoButton;
