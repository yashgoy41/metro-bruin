
import Header from "@/components/Header";
import CategoryTabs from "@/components/CategoryTabs";
import TripList from "@/components/TripList";
import BottomNavBar from "@/components/BottomNavBar";

const ExplorePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <Header />
      <CategoryTabs />
      <TripList />
      <BottomNavBar />
    </div>
  );
};

export default ExplorePage;
