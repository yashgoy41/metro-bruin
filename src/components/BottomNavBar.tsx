
import { Home, Search, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const BottomNavBar = () => {
  const location = useLocation();

  return (
    <div className="fixed bottom-0 inset-x-0 bg-white border-t shadow-lg h-16 flex items-center justify-around">
      <Link to="/" className="flex flex-col items-center px-4 py-2">
        <Home
          size={24}
          className={location.pathname === "/" ? "text-bettertrip-green" : "text-gray-500"}
        />
      </Link>
      <Link to="/explore" className="flex flex-col items-center px-4 py-2">
        <Search
          size={24}
          className={location.pathname === "/explore" ? "text-bettertrip-green" : "text-gray-500"}
        />
      </Link>
      <Link to="/profile" className="flex flex-col items-center px-4 py-2">
        <User
          size={24}
          className={location.pathname === "/profile" ? "text-bettertrip-green" : "text-gray-500"}
        />
      </Link>
    </div>
  );
};

export default BottomNavBar;
