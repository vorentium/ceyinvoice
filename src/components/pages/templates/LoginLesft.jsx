import React from 'react';

const LoginLeft = () => {
  return (
    <div className="flex flex-col h-full w-full bg-black text-white justify-between p-8">
      {/* Top section with CEYINVOICE */}
      <div className="mt-10 flex justify-center">
        <h1 className="text-5xl font-poppins-bold tracking-wider">CEYINVOICE</h1>
      </div>
      
      {/* Middle section with taglines */}
      <div className="flex-grow flex items-center justify-center">
        <div>
          <h2 className="text-7xl text-white opacity-60 font-poppins-bold leading-tight">
            BUILD FASTER
          </h2>
          <h2 className="text-7xl text-white opacity-60 font-poppins-bold leading-tight px-24">
            SMOOTHER
          </h2>
          <h2 className="text-7xl text-white opacity-60 font-poppins-bold leading-tight px-10">
            CREATIVILY
          </h2>
        </div>
      </div>
      
      {/* Bottom section with version */}
      <div className="flex items-center justify-between pt-10 -pb-10">
        <div className="text-sm text-white">VER 2.0.0</div>
        <button 
          className="cursor-pointer active:scale-90 transition-all duration-300 bg-white text-black py-2 px-4 rounded-full text-sm font-poppins-medium"
          onClick={( ) => window.open('/changelog', '_blank')}
        >
          CLICKE HERE TO CHECK CHANGELOG
        </button>
      </div>
    </div>
  );
};

export default LoginLeft;
