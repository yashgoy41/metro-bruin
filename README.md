# Metro Bruin: Empowering UCLA Students to Explore LA via Public Transit

An interactive transit application designed to help UCLA students discover Los Angeles through public transportation, building confidence and encouraging ridership across the city.

## 🌟 Key Features

- **Interactive Transit Map**: Color-coded bus routes with real-time POI discovery
- **Route Visualization**: Routes 17, 18, 2, 20, R12 with distinct styling
- **Smart POI Clustering**: Grouped location markers that expand on zoom
- **Mobile-First Design**: Optimized touch interface for smartphones
- **Route Detail Sheets**: Comprehensive stop information and timing
- **Smooth Animations**: Framer Motion-powered transitions

## 👥 Development Team

**UCLA Transportation Research Project**
- **Joyce Chen** - joycechen721@g.ucla.edu
- **Yash Goyal** - yashgoyal@g.ucla.edu  
- **Lauren Stevens** - laurenstevens@g.ucla.edu
- **Anika Balakrishnan** - anikabala@g.ucla.edu

## 🛠️ Technology Stack

### Frontend Architecture
- **React + TypeScript**: Type-safe component development
- **Framer Motion**: Smooth, performance-optimized animations
- **Tailwind CSS**: Utility-first responsive styling
- **Shadcn/UI**: Accessible, customizable component library

### Mapping & Geospatial
- **OpenStreetMap + Leaflet**: Open-source mapping without API restrictions
- **React-Leaflet**: React integration for interactive maps
- **Leaflet.markercluster**: Intelligent POI grouping and visualization
- **Custom Route Rendering**: GTFS-compatible transit line display

### Data & State Management
- **React Context**: Global transit and POI state management
- **GTFS Integration**: Real transit agency data parsing
- **Custom POI Database**: Curated student-relevant locations

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or bun

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/your-org/metro-bruin.git
cd metro-bruin
```

2. **Install dependencies:**
```bash
npm install
# or
bun install
```

3. **Start development server:**
```bash
npm run dev
# or
bun dev
```

4. **Open in browser:**
Navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
src/
├── components/
│   ├── map/
│   │   ├── OpenStreetMap.tsx      # Main interactive map
│   │   ├── RouteChips.tsx         # Bus route selection UI
│   │   └── LocationButton.tsx     # GPS positioning control
│   ├── sheets/
│   │   ├── RouteDetailSheet.tsx   # Route information display
│   │   ├── POIDetailSheet.tsx     # Point of interest details
│   │   └── StopDetailSheet.tsx    # Bus stop information
│   └── ui/
│       └── TopToolbar.tsx         # App header with Metro Bruin branding
├── contexts/
│   └── MetroContext.tsx           # Global transit state management
├── types/
│   └── metro.ts                   # TypeScript definitions
├── data/
│   ├── busRoutes.ts               # Route definitions and styling
│   └── pointsOfInterest.ts        # Curated POI database
└── pages/
    └── MetroBruinPage.tsx         # Main application page
```

## 🚌 Current Transit Coverage

### Active Bus Routes
- **Route 17** - Sawtelle/UCLA Connection (Green: `#22c55e`)
- **Route 18** - Westwood/Century City Line (Purple: `#a855f7`) 
- **Route 2** - Sunset Boulevard Corridor (Blue: `#3b82f6`)
- **Route 20** - Wilshire/UCLA Express (Orange: `#f97316`)
- **Route R12** - Culver City/UCLA Rapid (Red: `#ef4444`)

### Points of Interest Database
- **Coffee Shops**: 15+ locations along transit routes
- **Restaurants**: Diverse dining options near bus stops  
- **Museums**: 10+ popular museums

## 📄 License

This project is open source under the **MIT License**.

*Metro Bruin is a student-led initiative focused on making Los Angeles public transit accessible and enjoyable for the UCLA community.*
