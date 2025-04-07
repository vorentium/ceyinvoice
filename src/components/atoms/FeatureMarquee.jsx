import React from 'react';

function FeatureMarquee() {
  const featureText = 'COMFORTABLE • EASY TO USE • USER-FRIENDLY • FREE SERVICE • CREATIVITY';
  
  return (
    <div className="bg-white w-full overflow-hidden whitespace-nowrap relative h-10 flex items-center">
      <div className="w-[200%] flex absolute">
        <div className="animate-marquee-continuous inline-block w-full text-black text-3xl font-medium pr-16">
          {featureText}
        </div>
        <div className="animate-marquee-continuous inline-block w-full text-black text-3xl font-medium pr-16">
          {featureText}
        </div>
      </div>
    </div>
  );
}

export default FeatureMarquee; 