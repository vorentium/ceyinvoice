import React from 'react';
import GstBtn from '../atoms/Gst_btn';
import FeatureMarquee from '../atoms/FeatureMarquee';
import invoicesBg from '../../assets/images/invoices-bg.png';

function Hero() {
  return (
    <div className="relative w-full overflow-hidden">
      {/* Mobile Hero Section */}
      <div className="lg:hidden relative h-[90vh] overflow-hidden">
        <div className="container mx-auto px-4 pt-48 flex flex-col">
          {/* Text Content */}
          <div className="z-10 mb-8">
            <h1 className="text-5xl font-medium mb-6 leading-tight">
              <div>EFFORTLESS</div>
              <div>AI-POWERED</div>
              <div>INVOICING</div>
            </h1>
            
            <div className="mb-6">
              <GstBtn />
            </div>
            
            <p className="text-var-primary text-xs">
              &#8226; NO FEE REQUIRED. 100% FREE
            </p>
          </div>
          
          {/* Background Image */}
          <div className="absolute bottom-0 right-0 w-full z-0">
            {/* White diagonal fade effect for mobile */}
            <div className="absolute top-[-15%] right-[-5%] w-[150%] h-12 bg-white opacity-90 blur-lg rotate-[-40deg] origin-top-right z-10"></div>
            
            {/* Feature Marquee overlay for mobile */}
            <div className="absolute top-[-15%] right-[-5%] w-[150%] h-[80%] rotate-[-40deg] origin-top-right z-20 overflow-hidden">
              <div className="absolute top-[5%] left-[10%] w-full">
                <FeatureMarquee />
              </div>
            </div>
            
            <img 
              src={invoicesBg} 
              alt="Invoice Templates" 
              className="w-full opacity-80"
            />
          </div>
        </div>
      </div>

      {/* Desktop Hero Section */}
      <div className="hidden lg:block relative w-full h-screen overflow-hidden">
        <div className="container mx-auto px-4 h-full flex items-center">
          <div className="flex items-start w-full">
            {/* Left Content */}
            <div className="w-3/4 z-10 pt-10">
              <h1 className="text-6xl font-medium mb-6 leading-tight">
                <div>EFFORTLESS</div>
                <div>AI-POWERED INVOICING</div>
              </h1>
              
              <div className="mb-6">
                <GstBtn />
              </div>
              
              <p className="text-var-primary text-sm mb-4">
                &#8226; NO FEE REQUIRED. 100% FREE
              </p>
            </div>
            
            {/* Right Content - Invoice Images */}
            <div className="w-3/5 absolute bottom-0 right-0 z-0">
              {/* Black diagonal fade effect */}
              <div className="absolute top-[-15%] right-0 w-[200%] h-36 bg-white opacity-90 blur-lg rotate-[-40deg] origin-top-right z-10"></div>
              
              {/* Feature Marquee overlay - same position but not blurred */}
              <div className="absolute top-[-15%] right-0 w-[150%] h-[200%] rotate-[-40deg] origin-top-right z-20 overflow-hidden">
                <div className="absolute top-[5%] left-[10%] w-full">
                  <FeatureMarquee />
                </div>
              </div>
              
              {/* Invoice image */}
              <img 
                src={invoicesBg} 
                alt="Invoice Templates" 
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero; 