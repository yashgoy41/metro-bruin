import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import { useMetro } from '@/contexts/MetroContext';
import { POI, BusLine } from '@/types/metro';
import { useIsMobile } from '@/hooks/use-mobile';

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const OpenStreetMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markerClusterGroup = useRef<L.MarkerClusterGroup | null>(null);
  const busRoutes = useRef<L.Polyline[]>([]);
  const busStops = useRef<L.CircleMarker[]>([]);
  const locationMarker = useRef<L.CircleMarker | null>(null);
  const locationCircle = useRef<L.Circle | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const { 
    busLines, 
    pois, 
    selectedCategory,
    selectedRoute,
    setSelectedRoute, 
    setSelectedPOI, 
    mapCenter, 
    setMapCenter,
    setVisibleRoutes,
    setSelectedBusStop,
    selectedBusStop
  } = useMetro();
  const isMobile = useIsMobile();

  // Convert [lng, lat] to [lat, lng] for Leaflet
  const convertCoordinates = (coords: [number, number]): [number, number] => {
    return [coords[1], coords[0]];
  };

  // Function to calculate parallel offset
  const calculateParallelOffset = (p1: [number, number], p2: [number, number], offsetMeters: number): [number, number] => {
    const dx = p2[0] - p1[0];
    const dy = p2[1] - p1[1];
    const length = Math.sqrt(dx * dx + dy * dy);
    
    if (length === 0) return p1;
    
    // Convert offset from meters to degrees (approximate)
    const offsetDegrees = offsetMeters / 111111;
    
    // Calculate perpendicular vector
    const perpX = -dy / length * offsetDegrees;
    const perpY = dx / length * offsetDegrees;
    
    return [p1[0] + perpX, p1[1] + perpY];
  };

  // Function to offset a route path
  const offsetPath = (coordinates: [number, number][], offsetMeters: number): [number, number][] => {
    return coordinates.map((coord, i) => {
      if (i === 0) return coord;
      const prev = coordinates[i - 1];
      return calculateParallelOffset(coord, prev, offsetMeters);
    });
  };

  // Function to create location button
  const createLocationButton = (map: L.Map) => {
    const LocationControl = L.Control.extend({
      onAdd: () => {
        const button = L.DomUtil.create('button', 'location-button');
        button.innerHTML = '📍';
        button.style.fontSize = '20px';
        button.style.padding = '8px';
        button.style.width = '40px';
        button.style.height = '40px';
        button.style.borderRadius = '50%';
        button.style.border = 'none';
        button.style.backgroundColor = 'white';
        button.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
        button.style.cursor = 'pointer';
        button.title = 'Show my location';

        button.addEventListener('click', () => {
          map.locate({ setView: true, maxZoom: 16 });
        });

        return button;
      }
    });

    return new LocationControl({ position: 'topright' });
  };

  // Function to update location marker
  const updateLocationMarker = (latlng: L.LatLng, accuracy: number) => {
    if (locationMarker.current) {
      locationMarker.current.setLatLng(latlng);
    } else {
      locationMarker.current = L.circleMarker(latlng, {
        radius: 8,
        fillColor: '#4A89F3',
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 1
      }).addTo(map.current!);
    }

    if (locationCircle.current) {
      locationCircle.current.setLatLng(latlng);
      locationCircle.current.setRadius(accuracy);
    } else {
      locationCircle.current = L.circle(latlng, {
        radius: accuracy,
        fillColor: '#4A89F3',
        fillOpacity: 0.15,
        color: '#4A89F3',
        opacity: 0.3
      }).addTo(map.current!);
    }
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const leafletCenter = convertCoordinates(mapCenter);
    map.current = L.map(mapContainer.current, {
      zoomControl: false
    }).setView(leafletCenter, 14);

    // Add map click handler to close route detail sheet
    map.current.on('click', (e) => {
      // Check if click was on a marker or polyline
      const clickedDOMElement = document.elementFromPoint(e.originalEvent.clientX, e.originalEvent.clientY);
      const isMarkerClick = clickedDOMElement?.closest('.leaflet-marker-icon, .leaflet-interactive');
      
      // Only close if clicking directly on the map
      if (!isMarkerClick) {
        setSelectedRoute(null);
        setSelectedPOI(null);
      }
    });

    // Create custom panes for proper z-indexing
    map.current.createPane('routes');
    map.current.createPane('selectedRoute');
    map.current.createPane('markers');
    
    // Set z-index values to ensure proper layering
    map.current.getPane('routes')!.style.zIndex = '350'; // Routes below everything
    map.current.getPane('selectedRoute')!.style.zIndex = '375'; // Selected route slightly above but still below markers
    map.current.getPane('markers')!.style.zIndex = '400'; // Markers and clusters on top

    createLocationButton(map.current).addTo(map.current);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, © <a href="https://carto.com/attribution">CARTO</a>',
      maxZoom: 19,
      className: 'minimal-map',
    }).addTo(map.current);

    map.current.on('locationfound', (e) => {
      setUserLocation([e.latlng.lat, e.latlng.lng]);
      updateLocationMarker(e.latlng, e.accuracy);
    });

    // Create marker cluster group with custom styling and proper pane
    markerClusterGroup.current = L.markerClusterGroup({
      maxClusterRadius: 40,
      spiderfyOnMaxZoom: false,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      animate: true,
      animateAddingMarkers: false,
      removeOutsideVisibleBounds: true,
      disableClusteringAtZoom: 18,
      chunkedLoading: true,
      chunkInterval: 50,
      chunkDelay: 1,
      spiderfyDistanceMultiplier: 1,
      iconCreateFunction: (cluster) => {
        const count = cluster.getChildCount();
        const size = count < 10 ? 'small' : count < 50 ? 'medium' : 'large';
        
        return L.divIcon({
          html: `<div class="cluster-marker ${size}">
                  <span>${count}</span>
                </div>`,
          className: 'custom-cluster-icon',
          iconSize: L.point(40, 40)
        });
      }
    });

    map.current.addLayer(markerClusterGroup.current);

    const style = document.createElement('style');
    style.textContent = `
      .minimal-map {
        filter: saturate(0.8) contrast(0.9) brightness(1.1);
      }
      .leaflet-tile-pane {
        opacity: 0.9;
      }
      .leaflet-control-zoom {
        border: none !important;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
      }
      .leaflet-control-zoom a {
        background-color: white !important;
        color: #666 !important;
        border: none !important;
      }
      .leaflet-control-zoom a:hover {
        background-color: #f4f4f4 !important;
      }
      .location-button:hover {
        background-color: #f4f4f4 !important;
      }
      .route-details-card {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: white;
        border-radius: 20px 20px 0 0;
        padding: 20px;
        box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
        z-index: 1000;
        transition: transform 0.3s ease-out;
      }
      .drag-handle {
        width: 40px;
        height: 4px;
        background: #ddd;
        border-radius: 2px;
        margin: 0 auto 15px;
      }
    `;
    document.head.appendChild(style);

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
      if (locationMarker.current) {
        locationMarker.current.remove();
        locationMarker.current = null;
      }
      if (locationCircle.current) {
        locationCircle.current.remove();
        locationCircle.current = null;
      }
      document.head.removeChild(style);
    };
  }, []);

  // Update map center when context changes
  useEffect(() => {
    if (map.current) {
      const leafletCenter = convertCoordinates(mapCenter);
      map.current.setView(leafletCenter, map.current.getZoom());
    }
  }, [mapCenter]);

  // Add bus lines to map
  useEffect(() => {
    if (!map.current) return;

    // Process bus lines immediately
    requestAnimationFrame(() => {
      // Clear existing bus routes and stops
      busRoutes.current.forEach(route => map.current?.removeLayer(route));
      busStops.current.forEach(stop => map.current?.removeLayer(stop));
      busRoutes.current = [];
      busStops.current = [];

      // Find overlapping route segments
      const routeGroups = new Map<string, BusLine[]>();
      busLines.forEach(line => {
        line.coordinates.forEach((coord, i) => {
          if (i === 0) return;
          const key = `${coord[0]},${coord[1]}-${line.coordinates[i-1][0]},${line.coordinates[i-1][1]}`;
          const group = routeGroups.get(key) || [];
          if (!group.includes(line)) {
            group.push(line);
          }
          routeGroups.set(key, group);
        });
      });

      // Draw routes immediately
      busLines.forEach(line => {
        const isSelected = selectedRoute?.id === line.id;
        const opacity = isSelected ? 0.9 : 0.4;
        const weight = isSelected ? 4 : 3;

        // Create offset path for overlapping segments
        let offsetCoords: [number, number][] = [];
        line.coordinates.forEach((coord, i) => {
          if (i === 0) {
            offsetCoords.push(coord);
            return;
          }

          const prevCoord = line.coordinates[i-1];
          const key = `${coord[0]},${coord[1]}-${prevCoord[0]},${prevCoord[1]}`;
          const group = routeGroups.get(key) || [];
          
          if (group.length > 1) {
            const index = group.indexOf(line);
            const offset = (index - (group.length - 1) / 2) * 20; // 20 meters offset
            const offsetPoint = calculateParallelOffset(coord, prevCoord, offset);
            offsetCoords.push(offsetPoint);
          } else {
            offsetCoords.push(coord);
          }
        });

        // Draw route with proper pane assignment
        const polyline = L.polyline(offsetCoords.map(coord => convertCoordinates(coord)), {
          color: line.color,
          weight: weight,
          opacity: opacity,
          pane: isSelected ? 'selectedRoute' : 'routes'
        }).addTo(map.current!);

        polyline.on('click', () => {
          setSelectedRoute(line);
          setSelectedPOI(null); // Close POI sheet when route is selected
        });

        busRoutes.current.push(polyline);

        // Draw stops only for selected route
        if (isSelected) {
          line.stops.forEach(stop => {
            const isStopSelected = selectedBusStop?.id === stop.id;
            console.log(selectedBusStop)
            const stopMarker = L.circleMarker(convertCoordinates(stop.coordinates), {
              color: line.color,
              fillColor: isStopSelected ? '#FFD700' : '#FFFFFF', // Highlight selected stop with gold color
              fillOpacity: 1,
              radius: isStopSelected ? 8 : 5, // Increase radius for selected stop
              weight: 2,
              opacity: 1,
              pane: 'selectedRoute'
            }).addTo(map.current!);

            // if (isStopSelected) {
            //   const mapIcon = L.divIcon({
            //     html: `<div style="
            //       width: 24px; 
            //       height: 24px; 
            //       background: #FFD700; 
            //       border-radius: 50%; 
            //       display: flex; 
            //       align-items: center; 
            //       justify-content: center; 
            //       box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            //       font-size: 16px;
            //       color: white;
            //     ">📍</div>`,
            //     className: 'selected-stop-icon',
            //     iconSize: [24, 24],
            //     iconAnchor: [12, 12],
            //     popupAnchor: [0, -12]
            //   });

            //   L.marker(convertCoordinates(stop.coordinates), {
            //     icon: mapIcon,
            //     pane: 'selectedRoute'
            //   }).addTo(map.current!);
            // }

            stopMarker.on('click', () => {
              setSelectedBusStop(stop);
              setMapCenter(stop.coordinates);
            });

            busStops.current.push(stopMarker);
          });
        }
      });
    });
  }, [busLines, selectedRoute, setSelectedRoute, setSelectedPOI, setMapCenter, selectedBusStop]);

  // Update POI markers
  useEffect(() => {
    if (!map.current || !markerClusterGroup.current) return;

    // Clear existing markers
    markerClusterGroup.current.clearLayers();

    const filteredPOIs = pois.filter(poi => poi.category === selectedCategory);

    filteredPOIs.forEach((poi: POI) => {
      const customIcon = L.divIcon({
        html: `<div style="
          width: 32px; 
          height: 32px; 
          background: white; 
          border: 2px solid #10b981; 
          border-radius: 50%; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          font-size: 16px;
          z-index: 1000;
        ">${poi.icon}</div>`,
        className: 'custom-poi-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16]
      });

      const marker = L.marker(convertCoordinates(poi.coordinates), {
        icon: customIcon,
        pane: 'markers'
      });

      marker.on('click', () => {
        setSelectedPOI(poi);
        setMapCenter(poi.coordinates);
      });

      markerClusterGroup.current.addLayer(marker);
    });
  }, [selectedCategory, pois, setSelectedPOI, setMapCenter]);

  // Handle map movement
  useEffect(() => {
    if (!map.current) return;

    const handleMoveEnd = () => {
      const bounds = map.current!.getBounds();
      const visibleRouteIds = busLines
        .filter(line => 
          line.coordinates.some(coord => {
            const leafletCoord = convertCoordinates(coord as [number, number]);
            return bounds.contains(L.latLng(leafletCoord[0], leafletCoord[1]));
          })
        )
        .map(line => line.id);
      
      setVisibleRoutes(visibleRouteIds);
    };

    map.current.on('moveend', handleMoveEnd);
    
    return () => {
      map.current?.off('moveend', handleMoveEnd);
    };
  }, [busLines, setVisibleRoutes]);

  return (
    <div className="relative w-full h-full">
      <style>{`
        .cluster-marker {
          background: white;
          border: 2px solid #10b981;
          border-radius: 50%;
          color: #10b981;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }
        .cluster-marker.small {
          width: 32px;
          height: 32px;
          font-size: 14px;
        }
        .cluster-marker.medium {
          width: 36px;
          height: 36px;
          font-size: 16px;
        }
        .cluster-marker.large {
          width: 40px;
          height: 40px;
          font-size: 18px;
        }
        .cluster-marker:hover {
          transform: scale(1.1);
          transition: transform 0.2s ease;
        }
      `}</style>
      <div ref={mapContainer} className="w-full h-full z-0" />
    </div>
  );
};

export default OpenStreetMap;
