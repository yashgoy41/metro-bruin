import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Function to read and parse GTFS files from a directory
const parseGTFSFiles = (gtfsDir) => {
  const shapes = parse(fs.readFileSync(path.join(gtfsDir, 'shapes.txt')), {
    columns: true,
    skip_empty_lines: true
  });

  const trips = parse(fs.readFileSync(path.join(gtfsDir, 'trips.txt')), {
    columns: true,
    skip_empty_lines: true
  });

  const stops = parse(fs.readFileSync(path.join(gtfsDir, 'stops.txt')), {
    columns: true,
    skip_empty_lines: true
  });

  const stopTimes = parse(fs.readFileSync(path.join(gtfsDir, 'stop_times.txt')), {
    columns: true,
    skip_empty_lines: true
  });

  const routes = parse(fs.readFileSync(path.join(gtfsDir, 'routes.txt')), {
    columns: true,
    skip_empty_lines: true
  });

  return { shapes, trips, stops, stopTimes, routes };
};

// Parse both GTFS datasets
const projectRoot = path.join(__dirname, '..', '..');
const LA_METRO_GTFS_DIR = path.join(projectRoot, 'src', 'data', 'gtfs_bus');
const BBB_GTFS_DIR = path.join(projectRoot, 'src', 'data', 'bigblue_gtfs_bus');

const laMetroData = parseGTFSFiles(LA_METRO_GTFS_DIR);
const bbbData = parseGTFSFiles(BBB_GTFS_DIR);

// Define route IDs for both agencies
const routeConfigs = [
  { id: '20-13191', name: '20', color: '#FFA502', agency: 'metro' }, // LA Metro route
  { id: '3904', name: '1', color: '#0066CC', agency: 'bbb' }, // Big Blue Bus routes
  { id: '3914', name: 'R12', color: '#C298C6', agency: 'bbb' }
];

// Function to get route data based on agency
const getRouteData = (routeConfig) => {
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
    .map(shape => [parseFloat(shape.shape_pt_lon), parseFloat(shape.shape_pt_lat)]);
  
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
        coordinates: [parseFloat(stop.stop_lon), parseFloat(stop.stop_lat)],
        arrivalTime: '10 min',
        nearbyPOIs: []
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
const generatePOIsAlongRoute = (coordinates, category) => {
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
    const adjustedCoord = [
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

// Westwood specific POIs
const westwoodPOIs = [
  {
    id: 'cafe-ministry-coffee',
    name: 'Ministry of Coffee',
    coordinates: [-118.4434, 34.0593],
    category: 'cafes',
    description: 'Popular local coffee spot in Westwood',
    rating: 4.5,
    reviewCount: 156,
    priceLevel: 2,
    isOpen: true,
    address: '1010 Glendon Ave, Los Angeles, CA 90024',
    icon: '☕'
  },
  {
    id: 'cafe-upside-down',
    name: 'Upside Down',
    coordinates: [-118.4451, 34.0631],
    category: 'cafes',
    description: 'Cozy cafe near UCLA',
    rating: 4.3,
    reviewCount: 142,
    priceLevel: 2,
    isOpen: true,
    address: '10962 Le Conte Ave, Los Angeles, CA 90024',
    icon: '☕'
  },
  {
    id: 'cafe-elysee',
    name: 'Cafe Elysee',
    coordinates: [-118.4472, 34.0618],
    category: 'cafes',
    description: 'Charming bakery and cafe',
    rating: 4.4,
    reviewCount: 189,
    priceLevel: 2,
    isOpen: true,
    address: '1099 Gayley Ave, Los Angeles, CA 90024',
    icon: '☕'
  },
  {
    id: 'cafe-espresso-profeta',
    name: 'Espresso Profeta',
    coordinates: [-118.4431, 34.0603],
    category: 'cafes',
    description: 'Artisanal coffee and espresso bar',
    rating: 4.6,
    reviewCount: 167,
    priceLevel: 2,
    isOpen: true,
    address: '1129 Glendon Ave, Los Angeles, CA 90024',
    icon: '☕'
  },
  {
    id: 'museum-hammer',
    name: 'Hammer Museum',
    coordinates: [-118.4444, 34.0585],
    category: 'museums',
    description: 'Contemporary art museum featuring rotating exhibitions',
    rating: 4.7,
    reviewCount: 245,
    priceLevel: 1,
    isOpen: true,
    address: '10899 Wilshire Blvd, Los Angeles, CA 90024',
    icon: '🎨'
  }
];

// Generate POIs for each route and category
const categories = ['cafes', 'restaurants', 'museums'];
const allPOIs = [...westwoodPOIs]; // Start with Westwood POIs

// Get unique route shapes to avoid duplicate POIs on overlapping routes
const uniqueShapes = new Map();
busRoutes.forEach(route => {
  if (!route) return;
  const key = route.coordinates[0].join(','); // Use first coordinate as key
  if (!uniqueShapes.has(key)) {
    uniqueShapes.set(key, route);
  }
});

// Add generated POIs along routes, but avoid adding cafes and museums in Westwood area
for (const route of uniqueShapes.values()) {
  for (const category of categories) {
    // Skip generating cafes and museums in Westwood area (roughly)
    if ((category === 'cafes' || category === 'museums') && 
        route.coordinates.some(coord => 
          coord[0] >= -118.45 && coord[0] <= -118.44 && 
          coord[1] >= 34.05 && coord[1] <= 34.07
        )) {
      continue;
    }
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
  // If it's a Westwood POI, preserve its original data
  if (poi.id.startsWith('cafe-') || poi.id.startsWith('museum-')) {
    return poi;
  }

  const details = poiDetails[poi.category];
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
  path.join(projectRoot, 'src', 'data', 'busRoutes.ts'),
  `import { BusLine } from '@/types/metro';\n\n` +
  `// LA Metro and Big Blue Bus route data extracted from GTFS\n` +
  `export const busRoutes: BusLine[] = ${JSON.stringify(busRoutes, null, 2)};`
);

fs.writeFileSync(
  path.join(projectRoot, 'src', 'data', 'pois.ts'),
  `import { POI } from '@/types/metro';\n\n` +
  `// Generated POIs along bus routes\n` +
  `export const pois: POI[] = ${JSON.stringify(enhancedPOIs, null, 2)};`
); 