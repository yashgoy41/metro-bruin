
import React, { createContext, useContext, useState } from 'react';
import { BusLine, POI, Category, Stop } from '@/types/metro';
import { busRoutes } from '@/data/busRoutes';
import { pois } from '@/data/pois';

interface MetroContextType {
  busLines: BusLine[];
  pois: POI[];
  selectedCategory: Category;
  setSelectedCategory: (category: Category) => void;
  selectedPOI: POI | null;
  setSelectedPOI: (poi: POI | null) => void;
  selectedRoute: BusLine | null;
  setSelectedRoute: (route: BusLine | null) => void;
  selectedStop: Stop | null;
  setSelectedStop: (stop: Stop | null) => void;
  selectedBusStop: Stop | null;
  setSelectedBusStop: (stop: Stop | null) => void;
  mapCenter: [number, number];
  setMapCenter: (center: [number, number]) => void;
  visibleRoutes: string[];
  setVisibleRoutes: (routes: string[]) => void;
  previousRoute: BusLine | null;
  setPreviousRoute: (route: BusLine | null) => void;
  routeSheetScrollPosition: number;
  setRouteSheetScrollPosition: (position: number) => void;
}

const MetroContext = createContext<MetroContextType | undefined>(undefined);

export const MetroProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedCategory, setSelectedCategory] = useState<Category>('cafes');
  const [selectedPOI, setSelectedPOI] = useState<POI | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<BusLine | null>(null);
  const [selectedStop, setSelectedStop] = useState<Stop | null>(null);
  const [selectedBusStop, setSelectedBusStop] = useState<Stop | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([-118.4452, 34.0689]); // UCLA center
  const [visibleRoutes, setVisibleRoutes] = useState<string[]>([]);
  const [previousRoute, setPreviousRoute] = useState<BusLine | null>(null);
  const [routeSheetScrollPosition, setRouteSheetScrollPosition] = useState<number>(0);

  const value = {
    busLines: busRoutes,
    pois,
    selectedCategory,
    setSelectedCategory,
    selectedPOI,
    setSelectedPOI,
    selectedRoute,
    setSelectedRoute,
    selectedStop,
    setSelectedStop,
    selectedBusStop,
    setSelectedBusStop,
    mapCenter,
    setMapCenter,
    visibleRoutes,
    setVisibleRoutes,
    previousRoute,
    setPreviousRoute,
    routeSheetScrollPosition,
    setRouteSheetScrollPosition,
  };

  return <MetroContext.Provider value={value}>{children}</MetroContext.Provider>;
};

export const useMetro = () => {
  const context = useContext(MetroContext);
  if (context === undefined) {
    throw new Error('useMetro must be used within a MetroProvider');
  }
  return context;
};
