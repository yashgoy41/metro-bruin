# BetterTrip Transit Compass

A free and open-source transit application built with OpenStreetMap, providing bus route visualization and points of interest discovery without requiring API keys or usage fees.

## 🚀 Key Features

- **Free & Open Source**: No API keys required, no usage limits
- **Transit Route Visualization**: Display bus lines and stops with real-time styling
- **Points of Interest (POI)**: Discover cafes, restaurants, and museums near transit stops
- **Basic Transit Routing**: Calculate routes between points using public transit data
- **Interactive Maps**: Click on POIs and bus stops for detailed information
- **Mobile-Friendly**: Responsive design works on all devices

## 🗺️ Technology Stack

### Mapping & Visualization
- **OpenStreetMap**: Free, community-driven map data
- **Leaflet**: Lightweight, open-source mapping library
- **React-Leaflet**: React components for Leaflet integration

### Frontend
- **React + TypeScript**: Modern, type-safe development
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Smooth animations and transitions
- **Vite**: Fast development and build tooling

### Data Structure
- GTFS-compatible data models for transit information
- Extensible POI categorization system
- Flexible bus line and stop definitions

## 🚌 Current Transit Data

The app currently includes sample data for UCLA area transit:
- **Route 20**: UCLA to Westwood area
- **Route R12**: UCLA Medical Center line
- Sample POIs: Cafes, restaurants, and museums near campus

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd bettertrip-transit-compass
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open http://localhost:8080 in your browser

## 🏗️ Architecture

### Component Structure
```
src/
├── components/
│   ├── OpenStreetMap.tsx      # Main map component
│   ├── TransitRouter.tsx      # Basic routing logic
│   ├── RouteChips.tsx         # Route selection UI
│   ├── POIDetailSheet.tsx     # POI information display
│   ├── RouteDetailSheet.tsx   # Route details and stops
│   └── StopDetailSheet.tsx    # Bus stop information
├── contexts/
│   └── MetroContext.tsx       # Global state management
├── types/
│   └── metro.ts               # TypeScript type definitions
└── pages/
    └── MetroBruinPage.tsx     # Main application page
```

### Data Models
- **BusLine**: Route information with coordinates and stops
- **BusStop**: Individual stop data with arrival times and nearby POIs
- **POI**: Points of interest with ratings, categories, and location data

## 🚀 Next Steps & Roadmap

### Phase 1: Enhanced Routing
- [ ] Integrate with OpenTripPlanner for GTFS-based routing
- [ ] Add real-time transit data support
- [ ] Implement multi-modal routing (walk + transit)
- [ ] Add route optimization for multiple stops

### Phase 2: Data Integration
- [ ] GTFS data import from transit agencies
- [ ] Real-time arrival information
- [ ] Service alerts and disruptions
- [ ] Dynamic route updates

### Phase 3: Advanced Features
- [ ] Offline map support
- [ ] Trip planning with departure times
- [ ] Accessibility information
- [ ] User preferences and favorites

### Phase 4: Deployment & Scaling
- [ ] Progressive Web App (PWA) capabilities
- [ ] Multi-city support
- [ ] Performance optimization
- [ ] Analytics and usage tracking

## 🌍 Adding New Cities

To add support for a new city:

1. **Obtain GTFS Data**: Download GTFS feeds from transit agencies
2. **Update Context**: Add new bus lines and stops to `MetroContext.tsx`
3. **Configure Map Center**: Set appropriate coordinates for the new city
4. **Add Local POIs**: Include relevant points of interest
5. **Test Routes**: Verify transit routing works correctly

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📱 Mobile Development

The current web app can be extended to native mobile apps:
- **React Native**: Reuse React components
- **Capacitor**: Convert to native iOS/Android apps
- **PWA**: Add offline capabilities and app-like experience

## 🔧 Advanced Configuration

### Custom Map Styles
Leaflet supports custom tile servers. You can add different map styles:

```typescript
// In OpenStreetMap.tsx
L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data: OpenStreetMap, SRTM | Map style: OpenTopoMap'
}).addTo(map.current);
```

### Real-time Data Integration
For real-time updates, integrate with GTFS-Realtime feeds:

```typescript
// Example real-time integration
const fetchRealTimeData = async () => {
  const response = await fetch('https://api.transit-agency.com/gtfs-realtime');
  const data = await response.arrayBuffer();
  // Process GTFS-Realtime protobuf data
};
```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **OpenStreetMap**: For providing free, open map data
- **Leaflet**: For the excellent mapping library
- **Transit Agencies**: For making GTFS data publicly available
- **Open Source Community**: For all the libraries and tools that made this possible

## 🐛 Known Issues

- Route calculation is currently basic and may not find optimal paths
- Limited to same-line transfers (no multi-line routing yet)
- POI data is currently static (not real-time)

## 💡 Why We Chose This Stack

### OpenStreetMap vs. Commercial Solutions
- **Cost**: Completely free, no usage limits
- **Data**: Community-maintained, often more detailed than commercial maps
- **Privacy**: No tracking or data collection
- **Customization**: Full control over styling and features

### Leaflet vs. Other Mapping Libraries
- **Lightweight**: Smaller bundle size than alternatives
- **Flexible**: Easy to customize and extend
- **Community**: Large ecosystem of plugins
- **Performance**: Efficient rendering and memory usage

This solution provides a solid foundation for a free, accessible transit application that can serve communities worldwide without the restrictions of commercial mapping APIs.
