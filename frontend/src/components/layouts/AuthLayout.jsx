import React from 'react';
import { Outlet } from 'react-router-dom';
import Logo from '../Logo';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-dark-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <Logo variant="full" size="lg" className="drop-shadow-lg" />
          </div>
          <p className="text-silver-400 mt-4">Loyalty Rewards Platform</p>
        </div>
        
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
