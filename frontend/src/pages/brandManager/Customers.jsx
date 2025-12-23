import React, { useState } from 'react';
import { Users, TrendingUp, Award, MapPin, Calendar, Filter } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Customers = () => {
  const [filterTier, setFilterTier] = useState('all');
  const [filterStore, setFilterStore] = useState('all');

  // Demographics data
  const tierDistribution = [
    { name: 'Gold', value: 15, color: '#FFD700' },
    { name: 'Silver', value: 30, color: '#C0C0C0' },
    { name: 'Bronze', value: 55, color: '#CD7F32' },
  ];

  const ageDistribution = [
    { age: '18-25', count: 420 },
    { age: '26-35', count: 890 },
    { age: '36-45', count: 720 },
    { age: '46-55', count: 510 },
    { age: '56+', count: 305 },
  ];

  const locationDistribution = [
    { location: 'Nairobi CBD', customers: 1200, revenue: 52000 },
    { location: 'Westlands', customers: 950, revenue: 48000 },
    { location: 'Parklands', customers: 680, revenue: 32000 },
    { location: 'Ngong Road', customers: 580, revenue: 28000 },
    { location: 'Junction', customers: 435, revenue: 22000 },
  ];

  const engagementTrend = [
    { month: 'Jan', active: 2200, new: 180 },
    { month: 'Feb', active: 2350, new: 220 },
    { month: 'Mar', active: 2480, new: 190 },
    { month: 'Apr', active: 2620, new: 240 },
    { month: 'May', active: 2750, new: 210 },
    { month: 'Jun', active: 2845, new: 195 },
  ];

  const topCustomers = [
    { id: 1, name: 'John Kamau', tier: 'Gold', purchases: 124, spent: 18500, lastVisit: '2 days ago' },
    { id: 2, name: 'Mary Wanjiku', tier: 'Gold', purchases: 118, spent: 17200, lastVisit: '1 day ago' },
    { id: 3, name: 'Peter Ochieng', tier: 'Silver', purchases: 96, spent: 14800, lastVisit: '3 days ago' },
    { id: 4, name: 'Jane Akinyi', tier: 'Silver', purchases: 89, spent: 13500, lastVisit: '1 day ago' },
    { id: 5, name: 'David Mwangi', tier: 'Silver', purchases: 82, spent: 12900, lastVisit: '5 days ago' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-silver-100">Customer Insights</h1>
          <p className="text-gray-400 mt-1">Demographics, behavior, and loyalty metrics</p>
        </div>
        <div className="flex gap-3">
          <select
            value={filterTier}
            onChange={(e) => setFilterTier(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:border-silver-500 focus:outline-none"
          >
            <option value="all">All Tiers</option>
            <option value="gold">Gold</option>
            <option value="silver">Silver</option>
            <option value="bronze">Bronze</option>
          </select>
          <select
            value={filterStore}
            onChange={(e) => setFilterStore(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:border-silver-500 focus:outline-none"
          >
            <option value="all">All Stores</option>
            <option value="cbd">Nairobi CBD</option>
            <option value="westlands">Westlands</option>
            <option value="parklands">Parklands</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Customers</p>
              <p className="text-2xl font-bold text-silver-100 mt-1">2,845</p>
              <p className="text-green-400 text-sm mt-2 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                +8.5% this month
              </p>
            </div>
            <Users className="w-10 h-10 text-silver-400" />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">New Customers</p>
              <p className="text-2xl font-bold text-silver-100 mt-1">195</p>
              <p className="text-gray-400 text-sm mt-2">This month</p>
            </div>
            <Calendar className="w-10 h-10 text-silver-400" />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Avg Lifetime Value</p>
              <p className="text-2xl font-bold text-silver-100 mt-1">KES 8,420</p>
              <p className="text-green-400 text-sm mt-2 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                +5.2% vs last month
              </p>
            </div>
            <Award className="w-10 h-10 text-silver-400" />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Retention Rate</p>
              <p className="text-2xl font-bold text-silver-100 mt-1">82.3%</p>
              <p className="text-green-400 text-sm mt-2">Above industry avg</p>
            </div>
            <TrendingUp className="w-10 h-10 text-silver-400" />
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tier Distribution */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-silver-100 mb-4">Loyalty Tier Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={tierDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {tierDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Gold Tier:</span>
              <span className="text-silver-100 font-medium">427 customers</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Silver Tier:</span>
              <span className="text-silver-100 font-medium">854 customers</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Bronze Tier:</span>
              <span className="text-silver-100 font-medium">1,564 customers</span>
            </div>
          </div>
        </div>

        {/* Age Distribution */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-silver-100 mb-4">Age Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ageDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="age" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="count" fill="#c0c0c0" name="Customers" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Engagement Trend */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-silver-100 mb-4">Customer Engagement Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={engagementTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="month" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="active" stroke="#c0c0c0" strokeWidth={2} name="Active Customers" />
            <Line type="monotone" dataKey="new" stroke="#909090" strokeWidth={2} name="New Customers" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Geographic Distribution */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-silver-100 mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Geographic Distribution
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Location</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">Customers</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">Revenue</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">Avg Spend</th>
              </tr>
            </thead>
            <tbody>
              {locationDistribution.map((location, index) => (
                <tr key={index} className="border-b border-gray-800 hover:bg-gray-800/50">
                  <td className="py-3 px-4 text-gray-300">{location.location}</td>
                  <td className="py-3 px-4 text-right text-silver-100">{location.customers}</td>
                  <td className="py-3 px-4 text-right text-silver-100">KES {location.revenue.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right text-gray-400">
                    KES {(location.revenue / location.customers).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Customers */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-silver-100 mb-4">Top Customers</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Customer</th>
                <th className="text-center py-3 px-4 text-gray-400 font-medium">Tier</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">Purchases</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">Total Spent</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">Last Visit</th>
              </tr>
            </thead>
            <tbody>
              {topCustomers.map((customer) => (
                <tr key={customer.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                  <td className="py-3 px-4 text-gray-300">{customer.name}</td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        customer.tier === 'Gold'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : customer.tier === 'Silver'
                          ? 'bg-silver-500/20 text-silver-300'
                          : 'bg-orange-500/20 text-orange-400'
                      }`}
                    >
                      {customer.tier}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-silver-100">{customer.purchases}</td>
                  <td className="py-3 px-4 text-right text-silver-100">KES {customer.spent.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right text-gray-400">{customer.lastVisit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Customers;
