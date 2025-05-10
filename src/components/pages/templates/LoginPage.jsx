import React from 'react';
import Auth from './Auth';
import LoginLeft from './LoginLesft';

const LoginPage = () => {
  return (
    <div className="flex min-h-screen w-full">
      {/* Left side with branding and taglines */}
      <div className="hidden md:block md:w-1/2 bg-black">
        <LoginLeft />
      </div>
      
      {/* Right side with auth form */}
      <div className="w-full md:w-1/2">
        <Auth />
      </div>
    </div>
  );
};

export default LoginPage;
