import React from 'react';

function OpenSourceText() {
  // Generate multiple rows of text
  const rows = 18;
  const textsPerRow = 5;
  
  return (
    <div className="relative overflow-hidden w-full h-full">
      {/* Semi-transparent white overlay */}
      <div className="absolute inset-0 bg-white opacity-7 z-0"></div>
      
      {/* Rotated text container */}
      <div 
        className="absolute inset-0 z-10 -left-32 -right-32 -top-48 -bottom-24"
        style={{ transform: 'rotate(40deg)', transformOrigin: 'left' }}
      >
        {/* Generate multiple rows of text with alternating animation directions */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div 
            key={rowIndex} 
            className={`
              flex whitespace-nowrap
              ${rowIndex % 2 === 0 ? 'animate-marquee-right' : 'animate-marquee-left'}
            `}
            style={{ 
              marginTop: `${rowIndex * 10}px`,
              marginLeft: `-${rowIndex * 200}px`,
              animationDuration: `${30 + (rowIndex % 5) * 10}s`
            }}
          >
            {/* Double the text for seamless looping */}
            {[...Array.from({ length: textsPerRow * 2 })].map((_, textIndex) => (
              <span 
                key={textIndex}
                className="text-orange-500 font-bold text-xl md:text-2xl lg:text-3xl px-6 opacity-80"
                style={{ 
                  opacity: Math.random() * 0.4 + 0.6,
                  letterSpacing: '1px'
                }}
              >
                OPEN SOURCE PROJECT
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default OpenSourceText; 