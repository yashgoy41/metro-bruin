import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMetro } from '@/contexts/MetroContext';
import { POI } from '@/types/metro';
import MapboxTokenInput from './MapboxTokenInput';

const MetroMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  
  const { 
    busLines, 
    pois, 
    selectedCategory, 
    setSelectedPOI, 
    mapCenter, 
    setMapCenter,
    setVisibleRoutes 
  } = useMetro();

  const handleTokenSubmit = (token: string) => {
    setMapboxToken(token);
  };

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    // Initialize map with user-provided token
    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: mapCenter,
      zoom: 14,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Clean up on unmount
    return () => {
      markers.current.forEach(marker => marker.remove());
      map.current?.remove();
    };
  }, [mapboxToken]);

  // Update map center when context changes
  useEffect(() => {
    if (map.current) {
      map.current.flyTo({
        center: mapCenter,
        zoom: 15,
        duration: 1000
      });
    }
  }, [mapCenter]);

  // Add bus lines to map
  useEffect(() => {
    if (!map.current) return;

    map.current.on('load', () => {
      busLines.forEach((line) => {
        const sourceId = `route-${line.id}`;
        const layerId = `route-${line.id}-layer`;

        // Add source
        map.current?.addSource(sourceId, {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: line.coordinates
            }
          }
        });

        // Add layer
        map.current?.addLayer({
          id: layerId,
          type: 'line',
          source: sourceId,
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': line.color,
            'line-width': 4
          }
        });

        // Add stops
        line.stops.forEach((stop) => {
          const stopElement = document.createElement('div');
          stopElement.className = 'w-3 h-3 bg-white border-2 rounded-full cursor-pointer';
          stopElement.style.borderColor = line.color;

          new mapboxgl.Marker(stopElement)
            .setLngLat(stop.coordinates)
            .addTo(map.current!);
        });
      });
    });
  }, [busLines, mapboxToken]);

  // Update POI markers based on selected category
  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Filter POIs by category
    const filteredPOIs = pois.filter(poi => poi.category === selectedCategory);

    // Add new markers
    filteredPOIs.forEach((poi: POI) => {
      const markerElement = document.createElement('div');
      markerElement.className = 'w-8 h-8 bg-white rounded-full shadow-lg border-2 border-bettertrip-green flex items-center justify-center cursor-pointer hover:scale-110 transition-transform';
      markerElement.innerHTML = poi.icon;
      markerElement.style.fontSize = '16px';

      const marker = new mapboxgl.Marker(markerElement)
        .setLngLat(poi.coordinates)
        .addTo(map.current!);

      markerElement.addEventListener('click', () => {
        setSelectedPOI(poi);
        setMapCenter(poi.coordinates);
      });

      markers.current.push(marker);
    });
  }, [selectedCategory, pois, setSelectedPOI, setMapCenter]);

  // Handle map movement to update visible routes
  useEffect(() => {
    if (!map.current) return;

    const handleMove = () => {
      const bounds = map.current!.getBounds();
      const visibleRouteIds = busLines
        .filter(line => 
          line.coordinates.some(coord => 
            bounds.contains(new mapboxgl.LngLat(coord[0], coord[1]))
          )
        )
        .map(line => line.id);
      
      setVisibleRoutes(visibleRouteIds);
    };

    map.current.on('moveend', handleMove);
    
    return () => {
      map.current?.off('moveend', handleMove);
    };
  }, [busLines, setVisibleRoutes]);

  if (!mapboxToken) {
    return <MapboxTokenInput onTokenSubmit={handleTokenSubmit} />;
  }

  return <div ref={mapContainer} className="flex-1 w-full" />;
};

export default MetroMap;
