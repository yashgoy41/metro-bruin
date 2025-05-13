
import React, { Fragment } from 'react';
import { Route } from "@/types/trip";

interface RoutePreviewProps {
  route: Route;
  className?: string;
}

const RoutePreview = ({ route, className = "" }: RoutePreviewProps) => {
  return (
    <div className={`${className}`}>
      {/* Route line visualization with centered pills */}
      <div className="relative mt-10 mb-2">
        {/* Transit line/bus number pills positioned above each segment */}
        <div className="absolute -top-8 left-0 right-0 w-full flex items-center justify-around">
          {route.segments.map((segment, index) => (
            <div 
              key={`label-${index}`} 
              className="flex justify-center"
            >
              <div 
                className="px-3 py-1 rounded-full text-white text-xs font-medium"
                style={{ backgroundColor: segment.color }}
              >
                {segment.transitLine || `Line ${index + 1}`}
              </div>
            </div>
          ))}
        </div>
        
        {/* The route line */}
        <div className="flex items-center justify-center">
          {route.segments.map((segment, index) => (
            <Fragment key={index}>
              {index > 0 && (
                <div className={`w-2 h-2 rounded-full mx-1 ${segment.isTransfer ? "bg-gray-800" : "bg-gray-400"}`} />
              )}
              <div
                className="h-2 flex-1 relative"
                style={{ backgroundColor: segment.color }}
              ></div>
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoutePreview;
