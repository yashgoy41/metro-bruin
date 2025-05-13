
import React, { Fragment } from 'react';
import { Route } from "@/types/trip";

interface RoutePreviewProps {
  route: Route;
  className?: string;
}

const RoutePreview = ({ route, className = "" }: RoutePreviewProps) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
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
  );
};

export default RoutePreview;
