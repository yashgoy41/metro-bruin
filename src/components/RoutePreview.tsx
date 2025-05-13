
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
      <div className="relative">
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
        
        {/* Transit line/bus number pills positioned above each segment */}
        <div className="absolute top-0 left-0 right-0 transform -translate-y-7 flex items-center justify-center">
          {route.segments.map((segment, index) => (
            <div 
              key={`label-${index}`} 
              className="flex-1 flex justify-center"
              style={{
                marginLeft: index > 0 ? '10px' : '0',
              }}
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
      </div>
    </div>
  );
};

export default RoutePreview;
