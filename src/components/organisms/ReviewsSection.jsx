import React from 'react';
import TopRowTestimonials from '../molecules/TopRowTestimonials';
import BottomRowTestimonials from '../molecules/BottomRowTestimonials';

function ReviewsSection() {
  return (
    <section className="reviews-section relative h-screen bg-white flex flex-col justify-center items-center overflow-hidden py-8">
      {/* Faded top edge */}
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-white to-transparent z-10"></div>
      
      {/* Top row testimonials */}
      <div className="w-full mb-12">
        <TopRowTestimonials />
      </div>
      
      {/* Center heading */}
      <div className="z-10 mb-12 text-center px-4">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-black leading-tight">
          WHAT CUSTOMERS<br className="sm:hidden" /> SAID ?
        </h2>
      </div>
      
      {/* Bottom row testimonials */}
      <div className="w-full">
        <BottomRowTestimonials />
      </div>
      
      {/* Faded bottom edge */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent z-10"></div>
    </section>
  );
}

export default ReviewsSection; 