
import { useTrips } from "@/contexts/TripContext";

const CategoryTabs = () => {
  const { currentCategory, setCurrentCategory } = useTrips();

  return (
    <div className="flex justify-center gap-2 my-4">
      <button
        className={`px-4 py-1 rounded-full text-sm ${
          currentCategory === 'cafes' 
            ? 'bg-bettertrip-green text-white' 
            : 'bg-bettertrip-light-gray text-gray-800'
        }`}
        onClick={() => setCurrentCategory('cafes')}
      >
        Cafés
      </button>
      <button
        className={`px-4 py-1 rounded-full text-sm ${
          currentCategory === 'restaurants' 
            ? 'bg-bettertrip-green text-white' 
            : 'bg-bettertrip-light-gray text-gray-800'
        }`}
        onClick={() => setCurrentCategory('restaurants')}
      >
        Restaurants
      </button>
      <button
        className={`px-4 py-1 rounded-full text-sm ${
          currentCategory === 'museums' 
            ? 'bg-bettertrip-green text-white' 
            : 'bg-bettertrip-light-gray text-gray-800'
        }`}
        onClick={() => setCurrentCategory('museums')}
      >
        Museums
      </button>
    </div>
  );
};

export default CategoryTabs;
