import React from 'react';
import { Upload, Receipt } from 'lucide-react';

const ShopperReceipts = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-accent-primary">My Receipts</h1>
      <div className="card">
        <div className="text-center py-12">
          <Upload className="w-16 h-16 text-accent-primary mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-silver-100 mb-2">Upload Your Receipts</h3>
          <p className="text-silver-400 mb-6">Upload your shopping receipts to earn points</p>
          <button className="btn-primary">Upload Receipt</button>
        </div>
      </div>
    </div>
  );
};

export default ShopperReceipts;
