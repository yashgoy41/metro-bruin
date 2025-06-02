
import React from 'react';
import { MapPin } from 'lucide-react';
import { useMetro } from '@/contexts/MetroContext';
import { Category } from '@/types/metro';

const TopToolbar = () => {
  const { selectedCategory, setSelectedCategory } = useMetro();

  const categories: { id: Category; label: string; icon: string }[] = [
    { id: 'cafes', label: 'Cafes', icon: '☕' },
    { id: 'restaurants', label: 'Restaurants', icon: '🍽️' },
    { id: 'museums', label: 'Museums', icon: '🎨' }
  ];

  return (
    <>
      {/* Header - Fixed height to prevent layout shift */}
      <div className="bg-white shadow-lg z-[1001] relative flex-shrink-0">
        <div className="flex items-center justify-between px-4 py-3 min-h-[60px]">
          <h1 className="text-lg font-bold flex items-center min-w-0 flex-1">
            <img 
              src="/lovable-uploads/fa2f59d0-1bbd-4815-8500-42e40de07c66.png" 
              alt="MetroBruin Logo" 
              className="w-7 h-7 mr-2 flex-shrink-0"
            />
            <span className="truncate">MetroBruin</span>
          </h1>
        </div>
      </div>
      
      {/* Category Pills - Full width with proper padding */}
      <div className="absolute top-[60px] left-0 right-0 z-[1000] px-4 pb-2 pointer-events-auto">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide w-full">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-3 py-2 rounded-full font-medium transition-all shadow-lg pointer-events-auto whitespace-nowrap flex-shrink-0 min-h-[40px] flex items-center text-sm ${
                selectedCategory === category.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="mr-1.5 text-base">{category.icon}</span>
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Current Location - Below categories */}
      <div className="absolute top-[110px] right-4 z-[1000] pointer-events-auto">
        <div className="flex items-center text-sm font-medium bg-white rounded-full px-3 py-2 shadow-lg">
          <MapPin size={16} className="mr-1 text-green-500 flex-shrink-0" />
          <span className="text-gray-800 font-bold">UCLA</span>
        </div>
      </div>
    </>
  );
};

export default TopToolbar;
