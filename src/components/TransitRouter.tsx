
import React, { useState } from 'react';
import { useMetro } from '@/contexts/MetroContext';
import { BusLine, Stop } from '@/types/metro';

interface RouteResult {
  distance: number;
  duration: number;
  instructions: string[];
  busLines: BusLine[];
}

export const TransitRouter = () => {
  const { busLines } = useMetro();
  const [routeResult, setRouteResult] = useState<RouteResult | null>(null);

  // Simple routing algorithm for finding routes between stops
  const findRoute = (fromCoords: [number, number], toCoords: [number, number]): RouteResult | null => {
    const nearbyStartStops = findNearbyStops(fromCoords, 0.01); // ~1km radius
    const nearbyEndStops = findNearbyStops(toCoords, 0.01);

    for (const startStop of nearbyStartStops) {
      for (const endStop of nearbyEndStops) {
        const route = findRouteBetweenStops(startStop, endStop);
        if (route) {
          return route;
        }
      }
    }

    return null;
  };

  const findNearbyStops = (coords: [number, number], radius: number): Array<Stop & { lineId: string; lineName: string; lineColor: string }> => {
    const stops: Array<Stop & { lineId: string; lineName: string; lineColor: string }> = [];
    
    busLines.forEach(line => {
      line.stops.forEach(stop => {
        const distance = calculateDistance(coords, stop.coordinates);
        if (distance <= radius) {
          stops.push({
            ...stop,
            lineId: line.id,
            lineName: line.name,
            lineColor: line.color
          });
        }
      });
    });

    return stops;
  };

  const findRouteBetweenStops = (
    startStop: Stop & { lineId: string; lineName: string; lineColor: string }, 
    endStop: Stop & { lineId: string; lineName: string; lineColor: string }
  ): RouteResult | null => {
    // Check if both stops are on the same line
    if (startStop.lineId === endStop.lineId) {
      const line = busLines.find(l => l.id === startStop.lineId);
      if (line) {
        const distance = calculateDistance(startStop.coordinates, endStop.coordinates);
        const duration = Math.round(distance * 100); // Rough estimate: 100 seconds per km
        
        return {
          distance: Math.round(distance * 1000), // Convert to meters
          duration,
          instructions: [
            `Walk to ${startStop.name}`,
            `Take Route ${line.name} to ${endStop.name}`,
            `Walk to destination`
          ],
          busLines: [line]
        };
      }
    }

    return null;
  };

  const calculateDistance = (coord1: [number, number], coord2: [number, number]): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (coord2[1] - coord1[1]) * Math.PI / 180;
    const dLon = (coord2[0] - coord1[0]) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(coord1[1] * Math.PI / 180) * Math.cos(coord2[1] * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const getRouteDirections = (from: [number, number], to: [number, number]) => {
    const result = findRoute(from, to);
    setRouteResult(result);
    return result;
  };

  return {
    getRouteDirections,
    routeResult,
    setRouteResult
  };
};

export default TransitRouter;
