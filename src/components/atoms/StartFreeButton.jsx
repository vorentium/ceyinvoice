import React from 'react';
import { Link } from 'react-router-dom';

function StartFreeButton({ to = "/creator-studio", className = "", size = "normal" }) {
  const buttonClasses = size === "large" 
    ? "inline-block bg-white text-black py-4 px-8 text-xl md:text-2xl font-bold rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
    : "inline-block bg-white text-black py-3 px-6 text-base font-semibold rounded-full shadow-md transform transition-all duration-300 hover:scale-105 hover:shadow-lg";
    
  return (
    <Link
      to={to}
      className={`${buttonClasses} ${className}`}
    >
      START NOW FOR FREE
    </Link>
  );
}

export default StartFreeButton; 