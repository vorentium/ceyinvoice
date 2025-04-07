import React from 'react';
import OpenSourceText from './OpenSourceText';

function OpenSourceBanner() {
  return (
    <div className="w-full bg-white relative overflow-hidden">
      {/* Fixed aspect ratio container */}
      <div className="w-full relative" style={{ paddingBottom: '60%' }}>
        <div className="absolute inset-0">
          <OpenSourceText />
        </div>
      </div>
    </div>
  );
}

export default OpenSourceBanner; 