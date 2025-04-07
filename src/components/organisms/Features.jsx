import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

function Features() {
  // Create a separate ref for the section title
  const [titleRef, titleInView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });
  
  // Create a ref for the feature boxes
  const [featuresRef, featuresInView] = useInView({
    triggerOnce: false,
    threshold: 0.3,
    rootMargin: '-100px 0px',
  });

  // Create a ref for mobile features
  const [mobileRef, mobileInView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  return (
    <section id="features" className="min-h-screen flex flex-col justify-center items-center bg-white py-10 md:py-0">
      <h2 
        ref={titleRef}
        className={`text-4xl md:text-5xl font-normal mb-10 md:mb-20 text-center font-sans transition-all duration-700 ${
          titleInView ? 'opacity-100 transform-none' : 'opacity-0 transform translate-y-10'
        }`}
      >
        FEATURES
      </h2>
      
      {/* Mobile view - stacked in sequence */}
      <div 
        ref={mobileRef}
        className="w-full max-w-5xl px-4 flex flex-col gap-4 md:hidden"
      >
        {/* AI POWERED CHAT */}
        <div
          className={`
            border-2 border-orange-500 rounded-3xl p-6
            flex justify-center items-center h-[100px]
            transition-all duration-1000 ease-out
            hover:scale-105 hover:shadow-lg hover:bg-orange-50
            cursor-pointer
            ${mobileInView 
              ? 'opacity-100 scale-100 transform-none' 
              : 'opacity-0 scale-90 transform-gpu'
            }
          `}
          style={{ transitionDelay: '0ms' }}
        >
          <h3 className="text-2xl font-normal text-center font-sans">AI POWERED CHAT</h3>
        </div>

        {/* CUSTOMIZABLE TEMPLATES */}
        <div
          className={`
            border-2 border-var-primary rounded-3xl p-6
            flex justify-center items-center h-[100px]
            transition-all duration-1000 ease-out
            hover:scale-105 hover:shadow-lg hover:bg-orange-50
            cursor-pointer
            ${mobileInView 
              ? 'opacity-100 scale-100 transform-none' 
              : 'opacity-0 scale-90 transform-gpu'
            }
          `}
          style={{ transitionDelay: '100ms' }}
        >
          <h3 className="text-2xl font-normal text-center font-sans">CUSTOMIZABLE TEMPLATES</h3>
        </div>

        {/* MULTI LANGUAGE SUPPORT */}
        <div
          className={`
            border-2 border-var-primary rounded-3xl p-6
            flex justify-center items-center h-[100px]
            transition-all duration-1000 ease-out
            hover:scale-105 hover:shadow-lg hover:bg-orange-50
            cursor-pointer 
            ${mobileInView 
              ? 'opacity-100 scale-100 transform-none' 
              : 'opacity-0 scale-90 transform-gpu'
            }
          `}
          style={{ transitionDelay: '200ms' }}
        >
          <h3 className="text-2xl font-normal text-center font-sans">MULTI LANGUAGE SUPPORT</h3>
        </div>

        {/* 100% FREE */}
        <div
          className={`
            border-2 border-var-primary rounded-3xl p-6
            flex justify-center items-center h-[100px]
            transition-all duration-1000 ease-out
            hover:scale-105 hover:shadow-lg hover:bg-orange-50
            cursor-pointer
            ${mobileInView 
              ? 'opacity-100 scale-100 transform-none' 
              : 'opacity-0 scale-90 transform-gpu'
            }
          `}
          style={{ transitionDelay: '300ms' }}
        >
          <h3 className="text-2xl font-normal text-center font-sans">100% FREE</h3>
        </div>
      </div>
      
      {/* Desktop view - positioned absolute */}
      <div 
        ref={featuresRef}
        className="w-full max-w-5xl px-4 relative h-[400px] hidden md:block"
      >
        {/* Top left - AI POWERED CHAT */}
        <div
          className={`
            absolute top-0 left-0 w-[45%] h-[130px]
            border-2 border-var-primary rounded-3xl p-6
            flex justify-center items-center 
            transition-all duration-1000 ease-out
            hover:scale-105 hover:shadow-lg hover:bg-orange-50
            cursor-pointer
            ${featuresInView 
              ? 'opacity-100 scale-100 transform-none' 
              : 'opacity-0 scale-90 transform-gpu'
            }
          `}
          style={{ transitionDelay: '0ms' }}
        >
          <h3 className="text-3xl font-normal text-center font-sans">AI POWERED CHAT</h3>
        </div>

        {/* Top right - CUSTOMIZABLE TEMPLATES */}
        <div
          className={`
            absolute top-0 right-0 w-[45%] h-[130px]
            border-2 border-orange-500 rounded-3xl p-6
            flex justify-center items-center mt-20
            transition-all duration-1000 ease-out
            hover:scale-105 hover:shadow-lg hover:bg-orange-50
            cursor-pointer
            ${featuresInView 
              ? 'opacity-100 scale-100 transform-none' 
              : 'opacity-0 scale-90 transform-gpu'
            }
          `}
          style={{ transitionDelay: '200ms' }}
        >
          <h3 className="text-3xl font-normal text-center font-sans">CUSTOMIZABLE<br />TEMPLATES</h3>
        </div>

        {/* Bottom left - MULTI LANGUAGE SUPPORT */}
        <div
          className={`
            absolute bottom-20 left-0 w-[45%] h-[130px]
            border-2 border-orange-500 rounded-3xl p-6 
            flex justify-center items-center 
            transition-all duration-1000 ease-out 
            hover:scale-105 hover:shadow-lg hover:bg-orange-50
            cursor-pointer
            ${featuresInView 
              ? 'opacity-100 scale-100 transform-none' 
              : 'opacity-0 scale-90 transform-gpu'
            }
          `}
          style={{ transitionDelay: '400ms' }}
        >
          <h3 className="text-3xl font-normal text-center font-sans">MULTI LANGUAGE<br />SUPPORT</h3>
        </div>

        {/* Bottom right - 100% FREE */}
        <div
          className={`
            absolute bottom-0 right-0 w-[45%] h-[130px]
            border-2 border-var-primary rounded-3xl p-6
            flex justify-center items-center 
            transition-all duration-1000 ease-out
            hover:scale-105 hover:shadow-lg hover:bg-orange-50
            cursor-pointer
            ${featuresInView 
              ? 'opacity-100 scale-100 transform-none' 
              : 'opacity-0 scale-90 transform-gpu'
            }
          `}
          style={{ transitionDelay: '600ms' }}
        >
          <h3 className="text-3xl font-normal text-center font-sans">100% FREE</h3>
        </div>
      </div>
    </section>
  );
}

export default Features; 