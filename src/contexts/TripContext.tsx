import React, { createContext, useContext, useState, ReactNode } from "react";
import { Trip } from "@/types/trip";

// Sample data
const sampleTrips: Trip[] = [
  {
    id: "1",
    name: "Alfred Coffee",
    location: "Downtown",
    transitTime: "15 min",
    transitRating: 4.2,
    route: {
      segments: [
        { color: "#ef4444", isTransfer: false, transitLine: "702" },
        { color: "#facc15", isTransfer: true, transitLine: "R12" }
      ]
    },
    address: "123 Main St, Downtown",
    category: "cafes"
  },
  {
    id: "2",
    name: "Urth Caffe",
    location: "Beverly Hills",
    transitTime: "27 min",
    transitRating: 4.1,
    route: {
      segments: [
        { color: "#3b82f6", isTransfer: false, transitLine: "CC6" },
        { color: "#ef4444", isTransfer: true, transitLine: "430" }
      ]
    },
    address: "267 S Beverly Dr, Beverly Hills",
    category: "cafes"
  },
  {
    id: "3",
    name: "Blue Bottle Coffee",
    location: "Arts District",
    transitTime: "45 min",
    transitRating: 4.5,
    route: {
      segments: [
        { color: "#ef4444", isTransfer: false },
        { color: "#22c55e", isTransfer: true },
        { color: "#3b82f6", isTransfer: true }
      ]
    },
    address: "582 Mateo St, Los Angeles",
    category: "cafes"
  },
  {
    id: "4",
    name: "The Coffee Bean",
    location: "Hollywood",
    transitTime: "1 Hour",
    transitRating: 3.9,
    route: {
      segments: [
        { color: "#8b5cf6", isTransfer: false },
        { color: "#ef4444", isTransfer: true }
      ]
    },
    address: "7122 Sunset Blvd, Hollywood",
    category: "cafes"
  },
  {
    id: "5",
    name: "Mastro's Steakhouse",
    location: "Beverly Hills",
    transitTime: "35 min",
    transitRating: 4.8,
    route: {
      segments: [
        { color: "#3b82f6", isTransfer: false },
        { color: "#ef4444", isTransfer: true }
      ]
    },
    address: "246 N Canon Dr, Beverly Hills",
    category: "restaurants"
  },
  {
    id: "6",
    name: "Nobu Malibu",
    location: "Malibu",
    transitTime: "1.5 Hours",
    transitRating: 4.9,
    route: {
      segments: [
        { color: "#ef4444", isTransfer: false },
        { color: "#22c55e", isTransfer: true },
        { color: "#8b5cf6", isTransfer: true }
      ]
    },
    address: "22706 Pacific Coast Hwy, Malibu",
    category: "restaurants"
  },
  {
    id: "7",
    name: "The Broad",
    location: "Downtown",
    transitTime: "20 min",
    transitRating: 4.7,
    route: {
      segments: [
        { color: "#ef4444", isTransfer: false }
      ]
    },
    address: "221 S Grand Ave, Los Angeles",
    category: "museums"
  },
  {
    id: "8",
    name: "Getty Center",
    location: "Brentwood",
    transitTime: "55 min",
    transitRating: 4.9,
    route: {
      segments: [
        { color: "#8b5cf6", isTransfer: false },
        { color: "#22c55e", isTransfer: true }
      ]
    },
    address: "1200 Getty Center Dr, Los Angeles",
    category: "museums"
  }
];

interface TripContextProps {
  trips: Trip[];
  currentCategory: 'cafes' | 'restaurants' | 'museums';
  setCurrentCategory: React.Dispatch<React.SetStateAction<'cafes' | 'restaurants' | 'museums'>>;
  currentLocation: string;
  likeTrip: (id: string) => void;
  unlikeTrip: (id: string) => void;
  likedTrips: Trip[];
  recentTrips: Trip[];
  markVisited: (id: string) => void;
  visitTrip: (id: string) => void;
}

const TripContext = createContext<TripContextProps | undefined>(undefined);

export function TripProvider({ children }: { children: ReactNode }) {
  const [trips] = useState<Trip[]>(sampleTrips);
  const [currentCategory, setCurrentCategory] = useState<'cafes' | 'restaurants' | 'museums'>('cafes');
  const [likedTripIds, setLikedTripIds] = useState<string[]>([]);
  const [visitedTripIds, setVisitedTripIds] = useState<string[]>([]);
  
  // For now, we'll use a hardcoded location
  const currentLocation = "Los Angeles";

  const likeTrip = (id: string) => {
    if (!likedTripIds.includes(id)) {
      setLikedTripIds(prev => [...prev, id]);
    }
  };

  const unlikeTrip = (id: string) => {
    setLikedTripIds(prev => prev.filter(tripId => tripId !== id));
  };

  const markVisited = (id: string) => {
    if (!visitedTripIds.includes(id)) {
      setVisitedTripIds(prev => [...prev, id]);
    }
  };

  const visitTrip = (id: string) => {
    // Find the trip by ID
    const trip = trips.find(t => t.id === id);
    if (!trip) return;
    
    // Mark it as visited
    markVisited(id);
    
    // Create the Google Maps URL with origin and destination
    const startingLocation = "Luskin UCLA"; // Hardcoded starting location
    const destinationAddress = trip.address;
    
    // Prepare the Google Maps URL with parameters
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(startingLocation)}&destination=${encodeURIComponent(destinationAddress)}&travelmode=transit`;
    
    // Open Google Maps in a new tab
    window.open(mapsUrl, '_blank');
    
    console.log(`Opening map directions from ${startingLocation} to ${trip.name} at ${trip.address}`);
  };

  // Derive liked trips
  const likedTrips = trips.filter(trip => likedTripIds.includes(trip.id));

  // Derive recent trips (visited trips)
  const recentTrips = trips.filter(trip => visitedTripIds.includes(trip.id));
  
  return (
    <TripContext.Provider value={{
      trips,
      currentCategory,
      setCurrentCategory,
      currentLocation,
      likeTrip,
      unlikeTrip,
      likedTrips,
      recentTrips,
      markVisited,
      visitTrip
    }}>
      {children}
    </TripContext.Provider>
  );
}

export function useTrips() {
  const context = useContext(TripContext);
  if (context === undefined) {
    throw new Error("useTrips must be used within a TripProvider");
  }
  return context;
}
