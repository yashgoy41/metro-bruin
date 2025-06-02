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
      <div className="absolute top-24 left-4 right-4 z-[1000] flex flex-row gap-2 pointer-events-auto overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 min-w-max px-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full font-medium transition-all shadow-lg pointer-events-auto whitespace-nowrap flex-shrink-0 ${
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
      </div>
    </>
  );
};

export default TopToolbar;
