
import React, { Fragment } from 'react';
import { Route } from "@/types/trip";

interface RoutePreviewProps {
  route: Route;
  className?: string;
}

const RoutePreview = ({ route, className = "" }: RoutePreviewProps) => {
  return (
    <div className={`${className}`}>
      {/* Transit line/bus number pills */}
      <div className="flex items-center justify-center mb-2">
        {route.segments.map((segment, index) => (
          <div key={`label-${index}`} className="flex items-center">
            {index > 0 && (
              <div className="mx-1" />
            )}
            <div 
              className="px-2 py-0.5 rounded-full text-white text-xs font-medium"
              style={{ backgroundColor: segment.color }}
            >
              {segment.line}
            </div>
          </div>
        ))}
      </div>
      
      {/* Route line visualization */}
      <div className="flex items-center justify-center">
        {route.segments.map((segment, index) => (
          <Fragment key={index}>
            {index > 0 && (
              <div className={`w-2 h-2 rounded-full mx-1 ${segment.isTransfer ? "bg-gray-800" : "bg-gray-400"}`} />
            )}
            <div
              className="h-2 flex-1"
              style={{ backgroundColor: segment.color }}
            ></div>
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default RoutePreview;
