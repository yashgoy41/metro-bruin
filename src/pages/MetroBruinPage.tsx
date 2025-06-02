import React from 'react';
import { MetroProvider } from '@/contexts/MetroContext';
import TopToolbar from '@/components/TopToolbar';
import OpenStreetMap from '@/components/OpenStreetMap';
import RouteChips from '@/components/RouteChips';
import POIDetailSheet from '@/components/POIDetailSheet';
import RouteDetailSheet from '@/components/RouteDetailSheet';
import StopDetailSheet from '@/components/StopDetailSheet';

const MetroBruinPage = () => {
  return (
    <MetroProvider>
      <div className="h-full flex flex-col bg-gray-100 overflow-hidden" style={{ height: 'calc(var(--vh, 1vh) * 100)' }}>
        <TopToolbar />
        <div className="flex-1 relative overflow-hidden">
          <OpenStreetMap />
          <RouteChips />
          <POIDetailSheet />
          <RouteDetailSheet />
          <StopDetailSheet />
        </div>
      </div>
    </MetroProvider>
  );
};

export default MetroBruinPage;
