import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import Step1 from '../atoms/Step1';
import Step2 from '../atoms/Step2';
import Step3 from '../atoms/Step3';

function Steps({ showTitle = true, customClass = "", alignLeft = false }) {
  // State for the active step
  const [activeStep, setActiveStep] = useState(1);
  
  // Create a ref for the section
  const [stepsRef, stepsInView] = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });

  // Auto advance steps when in view
  useEffect(() => {
    if (stepsInView) {
      const interval = setInterval(() => {
        setActiveStep((prev) => (prev % 3) + 1);
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [stepsInView]);

  return (
    <div ref={stepsRef} className={`w-full ${customClass}`}>
      {showTitle && (
        <h2 className="text-4xl md:text-5xl font-normal mb-12 md:mb-16 text-center font-sans">
          HOW IT WORKS
        </h2>
      )}
      
      <div 
        className={`
          w-full max-w-5xl px-4 md:px-6 
          flex flex-col gap-10
          transition-opacity duration-1000
          ${alignLeft ? '' : 'mx-auto'}
          ${stepsInView ? 'opacity-100' : 'opacity-0'}
        `}
      >
        <div 
          className={`
            transform transition-all duration-700
            ${stepsInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
            ${activeStep === 1 ? 'scale-105' : 'scale-100'}
          `}
          style={{ transitionDelay: '0ms' }}
        >
          <Step1 isActive={activeStep === 1} />
        </div>

        <div 
          className={`
            transform transition-all duration-700
            ${stepsInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
            ${activeStep === 2 ? 'scale-105' : 'scale-100'}
          `}
          style={{ transitionDelay: '200ms' }}
        >
          <Step2 isActive={activeStep === 2} />
        </div>

        <div 
          className={`
            transform transition-all duration-700
            ${stepsInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
            ${activeStep === 3 ? 'scale-105' : 'scale-100'}
          `}
          style={{ transitionDelay: '400ms' }}
        >
          <Step3 isActive={activeStep === 3} />
        </div>
      </div>
    </div>
  );
}

export default Steps; 