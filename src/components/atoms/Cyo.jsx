import React from 'react';
import { Link } from 'react-router-dom';

function Cyo() {
  return (
    <Link to="/creator-studio" className="inline-block">
      <button
        className="
          bg-white text-black
          border-2 border-var-primary
          rounded-full
          py-3 px-8 md:py-4 md:px-10 lg:py-5 lg:px-12
          text-base md:text-lg lg:text-xl
          font-medium font-sans
          transition-all duration-300
          hover:bg-var-primary hover:text-white hover:scale-105
          focus:outline-none focus:ring-2 ring-var-primary
          shadow-sm
        "
      >
        CREATE YOUR ONE
      </button>
    </Link>
  );
}

export default Cyo; 