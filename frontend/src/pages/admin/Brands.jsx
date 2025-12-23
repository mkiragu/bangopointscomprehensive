import React from 'react';
import { Award } from 'lucide-react';

const AdminBrands = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-accent-primary">Brand Management</h1>
      <div className="card"><Award className="w-16 h-16 text-accent-primary mx-auto" /></div>
    </div>
  );
};

export default AdminBrands;
