
import React from 'react';
import { MetroProvider } from '@/contexts/MetroContext';
import TopToolbar from '@/components/TopToolbar';
import OpenStreetMap from '@/components/OpenStreetMap';
import RouteChips from '@/components/RouteChips';
import CurrentLocationButton from '@/components/CurrentLocationButton';
import POIDetailSheet from '@/components/POIDetailSheet';
import RouteDetailSheet from '@/components/RouteDetailSheet';
import StopDetailSheet from '@/components/StopDetailSheet';

const MetroBruinPage = () => {
  return (
    <MetroProvider>
      <div className="h-screen w-screen flex flex-col bg-gray-100 overflow-hidden max-w-full">
        <TopToolbar />
        <div className="flex-1 relative overflow-hidden w-full">
          <OpenStreetMap />
          <RouteChips />
          <CurrentLocationButton />
          <POIDetailSheet />
          <RouteDetailSheet />
          <StopDetailSheet />
        </div>
      </div>
    </MetroProvider>
  );
};

export default MetroBruinPage;
