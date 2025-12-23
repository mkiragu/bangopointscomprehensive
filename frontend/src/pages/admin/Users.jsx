import React from 'react';
import { Users } from 'lucide-react';

const AdminUsers = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-accent-primary">User Management</h1>
      <div className="card">
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-accent-primary mx-auto mb-4" />
          <p className="text-silver-400">Manage platform users</p>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
