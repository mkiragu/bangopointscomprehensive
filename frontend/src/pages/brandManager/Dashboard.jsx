import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, ShoppingBag, Users, FileText, Bell } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';

const BrandManagerDashboard = () => {
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    totalTransactions: 0,
    avgTransaction: 0,
    growthRate: 0
  });
  const [loading, setLoading] = useState(true);

  // Mock data for charts
  const revenueData = [
    { month: 'Jan', revenue: 45000, transactions: 890 },
    { month: 'Feb', revenue: 52000, transactions: 1045 },
    { month: 'Mar', revenue: 48000, transactions: 960 },
    { month: 'Apr', revenue: 61000, transactions: 1220 },
    { month: 'May', revenue: 55000, transactions: 1100 },
    { month: 'Jun', revenue: 67000, transactions: 1340 },
  ];

  const topProducts = [
    { name: 'Product A', sales: 450 },
    { name: 'Product B', sales: 380 },
    { name: 'Product C', sales: 320 },
    { name: 'Product D', sales: 290 },
    { name: 'Product E', sales: 250 },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setMetrics({
        totalRevenue: 328000,
        totalTransactions: 6555,
        avgTransaction: 50,
        growthRate: 15.3
      });
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-accent-primary">Brand Manager Dashboard</h1>
        <div className="animate-pulse space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="card h-32"></div>
            <div className="card h-32"></div>
            <div className="card h-32"></div>
            <div className="card h-32"></div>
          </div>
          <div className="card h-96"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-accent-primary">Brand Manager Dashboard</h1>
        <Link to="/brand-manager/billing" className="btn-primary flex items-center gap-2">
          <FileText className="w-5 h-5" />
          View Invoices
        </Link>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card bg-gradient-to-br from-accent-primary/10 to-transparent border-accent-primary/30">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-silver-400 text-sm">Total Revenue</p>
              <h3 className="text-2xl font-bold text-accent-primary mt-2">
                KES {metrics.totalRevenue.toLocaleString()}
              </h3>
              <p className="text-xs text-green-400 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +{metrics.growthRate}% vs last month
              </p>
            </div>
            <div className="p-3 bg-accent-primary/20 rounded-lg">
              <DollarSign className="w-6 h-6 text-accent-primary" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-silver-400 text-sm">Transactions</p>
              <h3 className="text-2xl font-bold text-silver-200 mt-2">
                {metrics.totalTransactions.toLocaleString()}
              </h3>
              <p className="text-xs text-silver-500 mt-1">Last 6 months</p>
            </div>
            <div className="p-3 bg-dark-300 rounded-lg">
              <ShoppingBag className="w-6 h-6 text-silver-400" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-silver-400 text-sm">Avg Transaction</p>
              <h3 className="text-2xl font-bold text-silver-200 mt-2">
                KES {metrics.avgTransaction}
              </h3>
              <p className="text-xs text-silver-500 mt-1">Per receipt</p>
            </div>
            <div className="p-3 bg-dark-300 rounded-lg">
              <TrendingUp className="w-6 h-6 text-silver-400" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-silver-400 text-sm">Active Customers</p>
              <h3 className="text-2xl font-bold text-silver-200 mt-2">
                2,847
              </h3>
              <p className="text-xs text-silver-500 mt-1">This month</p>
            </div>
            <div className="p-3 bg-dark-300 rounded-lg">
              <Users className="w-6 h-6 text-silver-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold text-accent-primary mb-4">Revenue Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#c0c0c0" strokeWidth={2} name="Revenue (KES)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-accent-primary mb-4">Top Products</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topProducts}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
              <Bar dataKey="sales" fill="#c0c0c0" name="Sales" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/brand-manager/analytics" className="card hover:border-accent-primary transition-colors">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-accent-primary/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-accent-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-silver-200">View Analytics</h3>
              <p className="text-sm text-silver-400">Detailed reports & insights</p>
            </div>
          </div>
        </Link>

        <Link to="/brand-manager/brands" className="card hover:border-accent-primary transition-colors">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-accent-primary/20 rounded-lg">
              <ShoppingBag className="w-6 h-6 text-accent-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-silver-200">Manage Brands</h3>
              <p className="text-sm text-silver-400">Configure brand settings</p>
            </div>
          </div>
        </Link>

        <Link to="/brand-manager/customers" className="card hover:border-accent-primary transition-colors">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-accent-primary/20 rounded-lg">
              <Users className="w-6 h-6 text-accent-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-silver-200">Customer Insights</h3>
              <p className="text-sm text-silver-400">Demographics & behavior</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h2 className="text-xl font-semibold text-accent-primary mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {[
            { type: 'transaction', message: 'New transaction processed', time: '2 minutes ago', icon: ShoppingBag },
            { type: 'invoice', message: 'Monthly invoice generated', time: '1 hour ago', icon: FileText },
            { type: 'alert', message: 'New customer milestone reached', time: '3 hours ago', icon: Bell },
            { type: 'transaction', message: '50 transactions approved', time: '5 hours ago', icon: ShoppingBag },
          ].map((activity, index) => (
            <div key={index} className="flex items-center gap-4 p-3 bg-dark-300 rounded-lg">
              <div className="p-2 bg-accent-primary/20 rounded-lg">
                <activity.icon className="w-5 h-5 text-accent-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-silver-200">{activity.message}</p>
                <p className="text-xs text-silver-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrandManagerDashboard;
