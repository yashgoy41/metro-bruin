
import Header from "@/components/Header";
import CategoryTabs from "@/components/CategoryTabs";
import SwipeDeck from "@/components/SwipeDeck";
import BottomNavBar from "@/components/BottomNavBar";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <Header />
      <CategoryTabs />
      <div className="mt-4">
        <SwipeDeck />
      </div>
      <BottomNavBar />
    </div>
  );
};

export default HomePage;
