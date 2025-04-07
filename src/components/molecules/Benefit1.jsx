import React from 'react';

function Benefit1() {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-var-primary relative overflow-hidden">
      {/* Overlapping text layers - starting with the most faded at the back */}
      <h2 className="absolute text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-bold text-white  z-10">
        WHY CHOOSE US
      </h2>
    </div>
  );
}

export default Benefit1; 