import React from 'react';
import { LayoutDashboard, Users, TrendingUp, DollarSign } from 'lucide-react';

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-accent-primary">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-silver-400">Total Users</p>
              <h3 className="text-3xl font-bold text-accent-primary mt-1">1,234</h3>
            </div>
            <Users className="w-10 h-10 text-accent-primary" />
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-silver-400">Total Points</p>
              <h3 className="text-3xl font-bold text-accent-primary mt-1">5.2M</h3>
            </div>
            <TrendingUp className="w-10 h-10 text-accent-primary" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
