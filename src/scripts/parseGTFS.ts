import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

interface Shape {
  shape_id: string;
  shape_pt_lat: string;
  shape_pt_lon: string;
  shape_pt_sequence: string;
}

interface Trip {
  route_id: string;
  shape_id: string;
  trip_id: string;
}

interface Stop {
  stop_id: string;
  stop_name: string;
  stop_lat: string;
  stop_lon: string;
}

interface StopTime {
  trip_id: string;
  stop_id: string;
  arrival_time: string;
  stop_sequence: string;
}

interface Route {
  route_id: string;
  route_short_name: string;
  route_color: string;
}

// Function to read and parse GTFS files from a directory
const parseGTFSFiles = (gtfsDir: string) => {
  const shapes = parse(fs.readFileSync(path.join(gtfsDir, 'shapes.txt')), {
    columns: true,
    skip_empty_lines: true
  }) as Shape[];

  const trips = parse(fs.readFileSync(path.join(gtfsDir, 'trips.txt')), {
    columns: true,
    skip_empty_lines: true
  }) as Trip[];

  const stops = parse(fs.readFileSync(path.join(gtfsDir, 'stops.txt')), {
    columns: true,
    skip_empty_lines: true
  }) as Stop[];

  const stopTimes = parse(fs.readFileSync(path.join(gtfsDir, 'stop_times.txt')), {
    columns: true,
    skip_empty_lines: true
  }) as StopTime[];

  const routes = parse(fs.readFileSync(path.join(gtfsDir, 'routes.txt')), {
    columns: true,
    skip_empty_lines: true
  }) as Route[];

  return { shapes, trips, stops, stopTimes, routes };
};

// Parse both GTFS datasets
const LA_METRO_GTFS_DIR = path.join(process.cwd(), 'src', 'data', 'gtfs_bus');
const BBB_GTFS_DIR = path.join(process.cwd(), 'src', 'data', 'bigblue_gtfs_bus');

const laMetroData = parseGTFSFiles(LA_METRO_GTFS_DIR);
const bbbData = parseGTFSFiles(BBB_GTFS_DIR);

// Define route IDs for both agencies
const routeConfigs = [
  { id: '2-13191', name: '2', color: '#F7B731', agency: 'metro' }, // LA Metro routes
  { id: '20-13191', name: '20', color: '#FFA502', agency: 'metro' },
  { id: '720-13191', name: '720', color: '#E31837', agency: 'metro' },
  { id: '3904', name: '1', color: '#F8971D', agency: 'bbb' }, // Big Blue Bus routes
  { id: '3914', name: 'R12', color: '#C298C6', agency: 'bbb' }
];

// Function to get route data based on agency
const getRouteData = (routeConfig: typeof routeConfigs[0]) => {
  const { agency, id } = routeConfig;
  const data = agency === 'metro' ? laMetroData : bbbData;
  
  // Get shape ID for the route
  const routeTrips = data.trips.filter(trip => trip.route_id === id);
  if (routeTrips.length === 0) return null;
  
  const shapeId = routeTrips[0].shape_id;
  
  // Get coordinates for the shape
  const coordinates = data.shapes
    .filter(shape => shape.shape_id === shapeId)
    .sort((a, b) => parseInt(a.shape_pt_sequence) - parseInt(b.shape_pt_sequence))
    .map(shape => [parseFloat(shape.shape_pt_lon), parseFloat(shape.shape_pt_lat)] as [number, number]);
  
  // Get stops for the route
  const tripId = routeTrips[0].trip_id;
  const tripStopTimes = data.stopTimes
    .filter(time => time.trip_id === tripId)
    .sort((a, b) => parseInt(a.stop_sequence) - parseInt(b.stop_sequence));
  
  const stops = tripStopTimes
    .map(time => {
      const stop = data.stops.find(s => s.stop_id === time.stop_id);
      if (!stop) return null;
      
      return {
        id: stop.stop_id,
        name: stop.stop_name,
        coordinates: [parseFloat(stop.stop_lon), parseFloat(stop.stop_lat)] as [number, number],
        arrivalTime: '10 min',
        nearbyPOIs: [] as string[]
      };
    })
    .filter(stop => stop !== null);
  
  return {
    id: routeConfig.name,
    name: routeConfig.name,
    color: routeConfig.color,
    coordinates,
    stops
  };
};

// Generate route data for all routes
const busRoutes = routeConfigs
  .map(config => getRouteData(config))
  .filter(route => route !== null);

// Helper function to generate POIs along a route
const generatePOIsAlongRoute = (coordinates: [number, number][], category: string) => {
  const numPoints = 3; // Exactly 3 points
  const pois = [];
  
  // Get points at relatively even intervals
  const interval = Math.floor(coordinates.length / 4); // Divide route into 4 segments
  for (let i = 0; i < numPoints; i++) {
    // Use points at 25%, 50%, and 75% of the route with small random offsets
    const baseIndex = interval * (i + 1);
    const index = Math.min(
      baseIndex + Math.floor(Math.random() * (interval * 0.5) - interval * 0.25),
      coordinates.length - 1
    );
    const coord = coordinates[index];
    
    // Add small random offset to avoid exact overlap with route
    const offset = 0.0002; // Approximately 22 meters
    const adjustedCoord: [number, number] = [
      coord[0] + (Math.random() - 0.5) * offset,
      coord[1] + (Math.random() - 0.5) * offset
    ];

    pois.push({
      id: `${category}-${i}-${coord[0]}-${coord[1]}`.replace(/\./g, ''),
      coordinates: adjustedCoord,
      category
    });
  }
  
  return pois;
};

// Generate POIs for each route and category
const categories = ['cafes', 'restaurants', 'museums'] as const;
const allPOIs = [];

// Get unique route shapes to avoid duplicate POIs on overlapping routes
const uniqueShapes = new Map();
busRoutes.forEach(route => {
  if (!route) return;
  const key = route.coordinates[0].join(','); // Use first coordinate as key
  if (!uniqueShapes.has(key)) {
    uniqueShapes.set(key, route);
  }
});

for (const route of uniqueShapes.values()) {
  for (const category of categories) {
    const pois = generatePOIsAlongRoute(route.coordinates, category);
    allPOIs.push(...pois);
  }
}

// POI details by category
const poiDetails = {
  cafes: {
    names: ['Coffee Bean', 'Starbucks', 'Blue Bottle', 'Philz Coffee', 'Intelligentsia'],
    descriptions: ['Cozy cafe with great ambiance', 'Popular coffee spot', 'Artisanal coffee shop'],
    icon: '☕'
  },
  restaurants: {
    names: ['The Local Spot', 'Urban Kitchen', 'Taste of LA', 'Metro Diner', 'City Bistro'],
    descriptions: ['Local favorite eatery', 'Modern American cuisine', 'Fusion restaurant'],
    icon: '🍽️'
  },
  museums: {
    names: ['Art Gallery', 'History Museum', 'Cultural Center', 'Science Museum', 'Contemporary Arts'],
    descriptions: ['Featuring local artists', 'Historical exhibits', 'Cultural exhibitions'],
    icon: '🎨'
  }
};

// Enhance POIs with details
const enhancedPOIs = allPOIs.map(poi => {
  const details = poiDetails[poi.category as keyof typeof poiDetails];
  return {
    ...poi,
    name: details.names[Math.floor(Math.random() * details.names.length)],
    description: details.descriptions[Math.floor(Math.random() * details.descriptions.length)],
    rating: (Math.floor(Math.random() * 20) + 35) / 10, // 3.5-5.5
    reviewCount: Math.floor(Math.random() * 200) + 50, // 50-250
    priceLevel: Math.floor(Math.random() * 3) + 1, // 1-3
    isOpen: Math.random() > 0.2, // 80% chance of being open
    address: `${Math.floor(Math.random() * 1000) + 100} Wilshire Blvd`,
    icon: details.icon
  };
});

// Write the route data and POIs to files
fs.writeFileSync(
  path.join(process.cwd(), 'src', 'data', 'busRoutes.ts'),
  `import { BusLine } from '@/types/metro';\n\n` +
  `// LA Metro and Big Blue Bus route data extracted from GTFS\n` +
  `export const busRoutes: BusLine[] = ${JSON.stringify(busRoutes, null, 2)};`
);

fs.writeFileSync(
  path.join(process.cwd(), 'src', 'data', 'pois.ts'),
  `import { POI } from '@/types/metro';\n\n` +
  `// Generated POIs along bus routes\n` +
  `export const pois: POI[] = ${JSON.stringify(enhancedPOIs, null, 2)};`
); 