import React from 'react';
import { Gift } from 'lucide-react';

const ShopperRewards = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-accent-primary">Rewards Catalog</h1>
      <div className="card">
        <div className="text-center py-12">
          <Gift className="w-16 h-16 text-accent-primary mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-silver-100 mb-2">Explore Rewards</h3>
          <p className="text-silver-400">Redeem your points for amazing rewards</p>
        </div>
      </div>
    </div>
  );
};

export default ShopperRewards;
