
export type BusLine = {
  id: string;
  name: string;
  color: string;
  coordinates: [number, number][];
  stops: BusStop[];
};

export type BusStop = {
  id: string;
  name: string;
  coordinates: [number, number];
  arrivalTime: string;
  nearbyPOIs: string[]; // POI IDs
};

export type POI = {
  id: string;
  name: string;
  category: 'cafes' | 'restaurants' | 'museums';
  coordinates: [number, number];
  rating: number;
  reviewCount: number;
  priceLevel: number; // 1-4
  address: string;
  description: string;
  isOpen: boolean;
  image: string;
  icon: string;
};

export type Category = 'cafes' | 'restaurants' | 'museums';
