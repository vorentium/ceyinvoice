import React from 'react';

function Marquee() {
  return (
    <div className="bg-white text-black font-normal rounded-xl pb-2 pt-3 mx-auto max-w-xl overflow-hidden whitespace-nowrap relative h-10 flex items-center border border-var-primary">
      <div className="w-[200%] flex absolute">
        <div className="animate-marquee inline-block w-full text-right pr-4">
          WELCOME TO AI INVOICE BUILDER. CREATE YOUR INVOICE FASTER AND PROFESSIONALLY
        </div>
        <div className="animate-marquee inline-block w-full text-right pr-4">
          WELCOME TO AI INVOICE BUILDER. CREATE YOUR INVOICE FASTER AND PROFESSIONALLY
        </div>
      </div>
    </div>
  );
}

export default Marquee; 