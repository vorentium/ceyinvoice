import React from 'react';
import { useInView } from 'react-intersection-observer';
import Steps from '../molecules/Steps';
import OpenSourceText from '../atoms/OpenSourceText';
import Cyo from '../atoms/Cyo';

function HowItWorksSection() {
  // Create a ref for the section
  const [sectionRef, sectionInView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  return (
    <section 
      ref={sectionRef}
      id="how-it-works"
      className="relative overflow-hidden min-h-screen bg-white py-16 md:py-20"
    >
      {/* Background text pattern */}
      <div className="absolute inset-0 z-0 opacity-90">
        <OpenSourceText />
      </div>
      
      {/* Content container */}
      <div className="relative z-10 container mx-auto px-4">
        {/* Section title - positioned on the right */}
        <div className="flex justify-end mb-24">
          <h2 
            className={`
              text-4xl md:text-5xl lg:text-6xl font-normal font-sans text-black
              transition-all duration-700
              ${sectionInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}
            `}
          >
            HOW IT WORKS
          </h2>
        </div>
        
        {/* Add top margin and left padding to bring steps down and position to left */}
        <div className="mt-12 md:mt-16 pl-4 md:pl-10 lg:pl-16">
          {/* Steps content - use the Steps component with alignLeft prop */}
          <Steps showTitle={false} customClass="max-w-5xl" alignLeft={true} />
          
          {/* Cyo button - positioned on the left with some spacing */}
          <div 
            className={`
              mt-12 md:mt-16
              transition-all duration-1000 delay-300
              ${sectionInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
            `}
          >
            <Cyo />
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection; 