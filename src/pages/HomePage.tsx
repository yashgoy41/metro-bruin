
import Header from "@/components/Header";
import CategoryTabs from "@/components/CategoryTabs";
import SwipeDeck from "@/components/SwipeDeck";
import BottomNavBar from "@/components/BottomNavBar";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />
      <div className="px-4 mb-2 relative pt-10">
        <CategoryTabs />
      </div>
      <div className="mt-6 pb-4">
        <SwipeDeck />
      </div>
      <BottomNavBar />
    </div>
  );
};

export default HomePage;
