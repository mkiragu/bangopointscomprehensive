import React from 'react';
import { Outlet } from 'react-router-dom';
import { Award } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-dark-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-accent-primary rounded-2xl shadow-silver-lg mb-4">
            <Award className="w-12 h-12 text-dark-500" />
          </div>
          <h1 className="text-4xl font-bold text-accent-primary mb-2">BangoPoints</h1>
          <p className="text-silver-400">Loyalty Rewards Platform</p>
        </div>
        
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
