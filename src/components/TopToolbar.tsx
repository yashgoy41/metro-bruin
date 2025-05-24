
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
    <div className="bg-white shadow-lg z-10 relative">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4">
        <h1 className="text-xl font-bold flex items-center">
          <span className="mr-2">🚌</span>MetroBruin
        </h1>
        
        <div className="flex items-center text-base font-medium">
          <MapPin size={24} className="mr-2 text-bettertrip-green" />
          <span className="text-gray-800 font-bold">UCLA</span>
        </div>
      </div>
      
      {/* Category Tabs */}
      <div className="flex border-t border-gray-200">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
              selectedCategory === category.id
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span className="mr-2">{category.icon}</span>
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TopToolbar;
