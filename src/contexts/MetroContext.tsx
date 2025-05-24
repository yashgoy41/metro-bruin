
import React, { createContext, useContext, useState, ReactNode } from "react";
import { BusLine, POI, Category, BusStop } from "@/types/metro";

// Mock data
const mockBusLines: BusLine[] = [
  {
    id: "line-20",
    name: "20",
    color: "#FF6B35",
    coordinates: [
      [-118.4455, 34.0689], // UCLA
      [-118.4434, 34.0712],
      [-118.4398, 34.0745],
      [-118.4362, 34.0778]
    ],
    stops: [
      {
        id: "stop-ucla",
        name: "UCLA / Westwood Plaza",
        coordinates: [-118.4455, 34.0689],
        arrivalTime: "5:10 PM",
        nearbyPOIs: ["kerckhoff", "cafe1919"]
      },
      {
        id: "stop-westwood",
        name: "Westwood Blvd / Weyburn Ave",
        coordinates: [-118.4434, 34.0712],
        arrivalTime: "5:12 PM",
        nearbyPOIs: ["seascafe"]
      }
    ]
  },
  {
    id: "line-r12",
    name: "R12",
    color: "#8B5CF6",
    coordinates: [
      [-118.4455, 34.0689],
      [-118.4423, 34.0634],
      [-118.4391, 34.0579],
      [-118.4359, 34.0524]
    ],
    stops: [
      {
        id: "stop-ucla-r12",
        name: "UCLA Medical Center",
        coordinates: [-118.4455, 34.0689],
        arrivalTime: "5:15 PM",
        nearbyPOIs: ["alfred", "urth"]
      }
    ]
  }
];

const mockPOIs: POI[] = [
  {
    id: "kerckhoff",
    name: "Kerckhoff Coffee House",
    category: "cafes",
    coordinates: [-118.4456, 34.0688],
    rating: 4.3,
    reviewCount: 194,
    priceLevel: 2,
    address: "308 Westwood Plaza #2",
    description: "Enduring coffee shop on the UCLA campus",
    isOpen: true,
    image: "/placeholder.svg",
    icon: "☕"
  },
  {
    id: "alfred",
    name: "Alfred Coffee",
    category: "cafes",
    coordinates: [-118.4434, 34.0715],
    rating: 4.2,
    reviewCount: 156,
    priceLevel: 3,
    address: "123 Westwood Blvd",
    description: "Trendy coffee spot with Instagram-worthy drinks",
    isOpen: true,
    image: "/placeholder.svg",
    icon: "☕"
  },
  {
    id: "urth",
    name: "Urth Caffé",
    category: "cafes",
    coordinates: [-118.4398, 34.0748],
    rating: 4.1,
    reviewCount: 89,
    priceLevel: 3,
    address: "267 S Beverly Dr",
    description: "Organic coffee and fresh pastries",
    isOpen: false,
    image: "/placeholder.svg",
    icon: "☕"
  },
  {
    id: "seascafe",
    name: "SEASCafe",
    category: "cafes",
    coordinates: [-118.4420, 34.0695],
    rating: 4.0,
    reviewCount: 45,
    priceLevel: 2,
    address: "UCLA Engineering Building",
    description: "Campus café in the engineering building",
    isOpen: true,
    image: "/placeholder.svg",
    icon: "☕"
  },
  {
    id: "cafe1919",
    name: "Café 1919",
    category: "cafes",
    coordinates: [-118.4470, 34.0680],
    rating: 3.8,
    reviewCount: 67,
    priceLevel: 2,
    address: "UCLA Campus Store",
    description: "Quick campus coffee stop",
    isOpen: true,
    image: "/placeholder.svg",
    icon: "☕"
  },
  {
    id: "mastros",
    name: "Mastro's Steakhouse",
    category: "restaurants",
    coordinates: [-118.4401, 34.0751],
    rating: 4.8,
    reviewCount: 312,
    priceLevel: 4,
    address: "246 N Canon Dr",
    description: "Upscale steakhouse with premium cuts",
    isOpen: true,
    image: "/placeholder.svg",
    icon: "🥩"
  },
  {
    id: "nobu",
    name: "Nobu Malibu",
    category: "restaurants",
    coordinates: [-118.4425, 34.0720],
    rating: 4.9,
    reviewCount: 189,
    priceLevel: 4,
    address: "22706 Pacific Coast Hwy",
    description: "World-renowned Japanese cuisine",
    isOpen: true,
    image: "/placeholder.svg",
    icon: "🍣"
  },
  {
    id: "broad",
    name: "The Broad",
    category: "museums",
    coordinates: [-118.4445, 34.0698],
    rating: 4.7,
    reviewCount: 423,
    priceLevel: 1,
    address: "221 S Grand Ave",
    description: "Contemporary art museum",
    isOpen: true,
    image: "/placeholder.svg",
    icon: "🎨"
  },
  {
    id: "getty",
    name: "Getty Center",
    category: "museums",
    coordinates: [-118.4480, 34.0665],
    rating: 4.9,
    reviewCount: 567,
    priceLevel: 1,
    address: "1200 Getty Center Dr",
    description: "Art, architecture, and gardens",
    isOpen: false,
    image: "/placeholder.svg",
    icon: "🏛️"
  }
];

interface MetroContextProps {
  busLines: BusLine[];
  pois: POI[];
  selectedCategory: Category;
  setSelectedCategory: (category: Category) => void;
  selectedPOI: POI | null;
  setSelectedPOI: (poi: POI | null) => void;
  selectedRoute: BusLine | null;
  setSelectedRoute: (route: BusLine | null) => void;
  selectedStop: BusStop | null;
  setSelectedStop: (stop: BusStop | null) => void;
  mapCenter: [number, number];
  setMapCenter: (center: [number, number]) => void;
  visibleRoutes: string[];
  setVisibleRoutes: (routes: string[]) => void;
}

const MetroContext = createContext<MetroContextProps | undefined>(undefined);

export function MetroProvider({ children }: { children: ReactNode }) {
  const [selectedCategory, setSelectedCategory] = useState<Category>('cafes');
  const [selectedPOI, setSelectedPOI] = useState<POI | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<BusLine | null>(null);
  const [selectedStop, setSelectedStop] = useState<BusStop | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([-118.4455, 34.0689]); // UCLA
  const [visibleRoutes, setVisibleRoutes] = useState<string[]>(['line-20', 'line-r12']);

  return (
    <MetroContext.Provider value={{
      busLines: mockBusLines,
      pois: mockPOIs,
      selectedCategory,
      setSelectedCategory,
      selectedPOI,
      setSelectedPOI,
      selectedRoute,
      setSelectedRoute,
      selectedStop,
      setSelectedStop,
      mapCenter,
      setMapCenter,
      visibleRoutes,
      setVisibleRoutes
    }}>
      {children}
    </MetroContext.Provider>
  );
}

export function useMetro() {
  const context = useContext(MetroContext);
  if (context === undefined) {
    throw new Error("useMetro must be used within a MetroProvider");
  }
  return context;
}
