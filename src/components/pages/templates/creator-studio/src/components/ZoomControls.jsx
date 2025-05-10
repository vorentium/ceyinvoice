import React from 'react';
import { ZoomIn, ZoomOut, Hand, Pointer } from 'lucide-react';

const ZoomControls = ({ 
  zoom, 
  onZoomIn, 
  onZoomOut, 
  isHandToolActive,
  onToggleHandTool
}) => {
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-10">
      <div className="flex items-center bg-white rounded-lg shadow-md p-2 space-x-2">
        <button
          onClick={onZoomOut}
          className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Zoom Out"
          disabled={zoom <= 0.2} // Example minimum zoom
        >
          <ZoomOut size={20} />
        </button>

        <span className="text-sm font-medium w-12 text-center">
          {Math.round(zoom * 100)}%
        </span>

        <button
          onClick={onZoomIn}
          className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Zoom In"
          disabled={zoom >= 3.0} // Example maximum zoom
        >
          <ZoomIn size={20} />
        </button>

        {/* Hand Tool for smaller devices - Only show on smaller screens */}
        <div className="hidden sm:hidden md:hidden lg:hidden xl:hidden md:max-lg:block sm:max-md:block max-sm:block">
          <div className="mx-1 h-8 w-px bg-gray-300"></div> {/* Separator */}
          <button
            onClick={onToggleHandTool}
            className={`p-2 rounded hover:bg-gray-200 ml-1 ${isHandToolActive ? 'bg-blue-100 text-blue-600' : ''}`}
            title={isHandToolActive ? "Exit Hand Tool" : "Hand Tool (Pan Canvas)"}
          >
            {isHandToolActive ? (
              <Pointer size={20} />
            ) : (
              <Hand size={20} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ZoomControls;