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
  { id: '2-13191', name: '2', color: '#F39C12', agency: 'metro', icon: 'Ⓜ️' }, // Metro Route 2
  { id: '3904', name: '1', color: '#0066CC', agency: 'bbb' }, // Big Blue Bus routes
  { id: '3914', name: 'R12', color: '#C298C6', agency: 'bbb' },
  { id: '3918', name: '17', color: '#27AE60', agency: 'bbb' }, // BBB Route 17
  { id: '3919', name: '18', color: '#E74C3C', agency: 'bbb' }, // BBB Route 18
  { id: '3905', name: '2', color: '#8E44AD', agency: 'bbb' } // BBB Route 2
];

// Function to get route data based on agency
const getRouteData = (routeConfig) => {
  const { agency, id, icon } = routeConfig;
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
    id: routeConfig.id,
    name: routeConfig.name + (icon ? ` ${icon}` : ''),
    color: routeConfig.color,
    coordinates,
    stops
  };
};

// Generate route data for all routes
const busRoutes = routeConfigs
  .map(config => getRouteData(config))
  .filter(route => route !== null);

// Write the route data to file
fs.writeFileSync(
  path.join(projectRoot, 'src', 'data', 'busRoutes.ts'),
  `import { BusLine } from '@/types/metro';\n\n` +
  `// LA Metro and Big Blue Bus route data extracted from GTFS\n` +
  `export const busRoutes: BusLine[] = ${JSON.stringify(busRoutes, null, 2)};`
); 