
import Header from "@/components/Header";
import UserProfile from "@/components/UserProfile";
import TripCarousel from "@/components/TripCarousel";
import BottomNavBar from "@/components/BottomNavBar";
import { useTrips } from "@/contexts/TripContext";

const ProfilePage = () => {
  const { likedTrips, recentTrips } = useTrips();

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <Header />
      <UserProfile />
      <TripCarousel title="Liked Trips" trips={likedTrips} />
      <TripCarousel title="Recent Trips" trips={recentTrips} />
      <BottomNavBar />
    </div>
  );
};

export default ProfilePage;
