
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

  const handleLocationClick = () => {
    if ((window as any).locateUser) {
      (window as any).locateUser();
    }
  };

  return (
    <>
      {/* Header */}
      <div className="bg-white shadow-lg z-[1001] relative">
        <div className="flex items-center justify-between px-6 py-4">
          <h1 className="text-xl font-bold flex items-center">
            <img 
              src="/lovable-uploads/fa2f59d0-1bbd-4815-8500-42e40de07c66.png" 
              alt="MetroBruin Logo" 
              className="w-8 h-8 mr-3"
            />
            MetroBruin
          </h1>
          
          <div className="flex items-center text-base font-medium">
            <MapPin size={24} className="mr-2 text-bettertrip-green" />
            <span className="text-gray-800 font-bold">UCLA</span>
          </div>
        </div>
      </div>
      
      {/* Floating Category Pills - Horizontal Row */}
      <div className="absolute top-24 left-6 z-[1000] flex flex-row gap-2 pointer-events-auto">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-full font-medium transition-all shadow-lg pointer-events-auto ${
              selectedCategory === category.id
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span className="mr-2">{category.icon}</span>
            {category.label}
          </button>
        ))}
      </div>

      {/* Location Button */}
      <div className="absolute top-24 right-6 z-[1000] pointer-events-auto">
        <button
          onClick={handleLocationClick}
          className="w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 flex items-center justify-center group"
          title="Show my location"
        >
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            className="text-gray-700 group-hover:text-bettertrip-green transition-colors"
          >
            <path 
              d="M7 17L17 7M17 7H7M17 7V17" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </>
  );
};

export default TopToolbar;
