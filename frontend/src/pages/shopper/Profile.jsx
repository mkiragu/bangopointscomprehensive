import React from 'react';
import { User } from 'lucide-react';

const ShopperProfile = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-accent-primary">Profile</h1>
      <div className="card">
        <div className="text-center py-12">
          <User className="w-16 h-16 text-accent-primary mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-silver-100 mb-2">Your Profile</h3>
          <p className="text-silver-400">Manage your account settings</p>
        </div>
      </div>
    </div>
  );
};

export default ShopperProfile;
