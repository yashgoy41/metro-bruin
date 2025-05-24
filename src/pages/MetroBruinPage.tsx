
import React from 'react';
import { MetroProvider } from '@/contexts/MetroContext';
import TopToolbar from '@/components/TopToolbar';
import MetroMap from '@/components/MetroMap';
import RouteChips from '@/components/RouteChips';
import POIDetailSheet from '@/components/POIDetailSheet';
import RouteDetailSheet from '@/components/RouteDetailSheet';
import StopDetailSheet from '@/components/StopDetailSheet';

const MetroBruinPage = () => {
  return (
    <MetroProvider>
      <div className="h-screen flex flex-col bg-gray-100">
        <TopToolbar />
        <div className="flex-1 relative">
          <MetroMap />
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
