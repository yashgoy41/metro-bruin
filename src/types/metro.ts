
export type Category = 'cafes' | 'restaurants' | 'museums';

export interface Stop {
  id: string;
  name: string;
  coordinates: [number, number];
  arrivalTime: string;
  nearbyPOIs: string[];
}

export interface BusStop extends Stop {
  // Additional properties specific to bus stops can be added here
}

export interface BusLine {
  id: string;
  name: string;
  color: string;
  coordinates: [number, number][];
  stops: Stop[];
}

export interface POI {
  id: string;
  name: string;
  category: Category;
  coordinates: [number, number];
  rating: number;
  reviewCount: number;
  priceLevel: number;
  address: string;
  description: string;
  isOpen: boolean;
  icon: string;
  image?: string;
}
