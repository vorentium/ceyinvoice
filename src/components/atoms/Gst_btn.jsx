import React from 'react';
import { Link } from 'react-router-dom';

const GstBtn = () => {
  return (
    <Link to="/auth">
      <button className="bg-[var(--color-black-300)] w-50 h-15 text-dark font-bold px-4 py-2 
      rounded-full md:w-60 md:h-15 lg:w-70 lg:h-15 md:text-lg lg:text-xl cursor-pointer 
      hover:scale-105 transition-all duration-300 ease-in-out active:scale-95 font-poppins-semibold">
        GET STARTED NOW
      </button>
    </Link>
  );
};

export default GstBtn;
