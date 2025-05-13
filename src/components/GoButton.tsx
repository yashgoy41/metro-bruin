
import { useTrips } from "@/contexts/TripContext";
import { Button } from "@/components/ui/button";

interface GoButtonProps {
  tripId: string;
  size?: "small" | "large";
}

const GoButton = ({ tripId, size = "large" }: GoButtonProps) => {
  const { visitTrip } = useTrips();

  return (
    <Button
      onClick={() => visitTrip(tripId)}
      className={`bg-bettertrip-green hover:bg-bettertrip-green-hover text-white font-medium rounded-xl shadow-sm transition-colors
        ${size === "large" ? "px-10 py-2 text-lg h-14 w-24" : "px-4 py-1 text-sm"}`}
    >
      GO
    </Button>
  );
};

export default GoButton;
