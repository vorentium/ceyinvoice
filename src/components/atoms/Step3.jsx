import React from 'react';

function Step3({ isActive = false }) {
  return (
    <div 
      className={`
        w-full h-32 sm:h-36 md:h-40
        bg-white rounded-3xl
        flex items-center
        transition-all duration-300 ease-out
        hover:scale-105 
        shadow-[0_4px_4px_0_var(--color-primary)]
        p-8 md:p-10
        ${isActive ? 'border-2 border-var-primary scale-103' : ''}
      `}
    >
      <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-left font-sans">
        Step 3 : Send To The Client
      </h3>
    </div>
  );
}

export default Step3; 