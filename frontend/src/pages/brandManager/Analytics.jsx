import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, Calendar, TrendingUp, DollarSign, Users, ShoppingBag } from 'lucide-react';

const Analytics = () => {
  const [dateRange, setDateRange] = useState('month');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Sample analytics data
  const revenueData = [
    { month: 'Jan', revenue: 45000, transactions: 1200 },
    { month: 'Feb', revenue: 52000, transactions: 1400 },
    { month: 'Mar', revenue: 48000, transactions: 1300 },
    { month: 'Apr', revenue: 61000, transactions: 1600 },
    { month: 'May', revenue: 55000, transactions: 1450 },
    { month: 'Jun', revenue: 67000, transactions: 1750 },
  ];

  const categoryData = [
    { name: 'Dairy', value: 35, color: '#c0c0c0' },
    { name: 'Beverages', value: 25, color: '#a8a8a8' },
    { name: 'Personal Care', value: 20, color: '#909090' },
    { name: 'Household', value: 15, color: '#787878' },
    { name: 'Others', value: 5, color: '#606060' },
  ];

  const storePerformance = [
    { store: 'Carrefour Hub', revenue: 25000, transactions: 680 },
    { store: 'Naivas Westlands', revenue: 22000, transactions: 620 },
    { store: 'Quickmart Junction', revenue: 18000, transactions: 510 },
    { store: 'Chandarana Parklands', revenue: 15000, transactions: 420 },
    { store: 'Tuskys Ngong Road', revenue: 12000, transactions: 350 },
  ];

  const handleExportPDF = () => {
    alert('Exporting report as PDF...');
    // Implement PDF export
  };

  const handleExportCSV = () => {
    alert('Exporting data as CSV...');
    // Implement CSV export
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-silver-100">Analytics & Reports</h1>
          <p className="text-gray-400 mt-1">Custom reports and data insights</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2 bg-silver-600/20 text-silver-100 rounded-lg hover:bg-silver-600/30 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export PDF
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-silver-600/20 text-silver-100 rounded-lg hover:bg-silver-600/30 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Date Range Selector */}
      <div className="card p-6">
        <div className="flex items-center gap-4 flex-wrap">
          <Calendar className="w-5 h-5 text-silver-400" />
          <span className="text-gray-300 font-medium">Date Range:</span>
          
          <div className="flex gap-2">
            {['week', 'month', 'quarter', 'year', 'custom'].map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  dateRange === range
                    ? 'bg-silver-600/30 text-silver-100'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>

          {dateRange === 'custom' && (
            <div className="flex gap-3 ml-4">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:border-silver-500 focus:outline-none"
              />
              <span className="text-gray-500 self-center">to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:border-silver-500 focus:outline-none"
              />
            </div>
          )}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold text-silver-100 mt-1">KES 328,000</p>
              <p className="text-green-400 text-sm mt-2 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                +15.3% vs last period
              </p>
            </div>
            <DollarSign className="w-10 h-10 text-silver-400" />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Transactions</p>
              <p className="text-2xl font-bold text-silver-100 mt-1">7,730</p>
              <p className="text-green-400 text-sm mt-2 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                +12.1% vs last period
              </p>
            </div>
            <ShoppingBag className="w-10 h-10 text-silver-400" />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Avg Transaction</p>
              <p className="text-2xl font-bold text-silver-100 mt-1">KES 42.44</p>
              <p className="text-green-400 text-sm mt-2 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                +2.8% vs last period
              </p>
            </div>
            <DollarSign className="w-10 h-10 text-silver-400" />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Customers</p>
              <p className="text-2xl font-bold text-silver-100 mt-1">2,845</p>
              <p className="text-green-400 text-sm mt-2 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                +8.5% vs last period
              </p>
            </div>
            <Users className="w-10 h-10 text-silver-400" />
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-silver-100 mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
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
              <Line type="monotone" dataKey="revenue" stroke="#c0c0c0" strokeWidth={2} name="Revenue (KES)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-silver-100 mb-4">Sales by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
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
        </div>
      </div>

      {/* Store Performance */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-silver-100 mb-4">Store Performance</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={storePerformance} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis type="number" stroke="#9ca3af" />
            <YAxis dataKey="store" type="category" stroke="#9ca3af" width={150} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Bar dataKey="revenue" fill="#c0c0c0" name="Revenue (KES)" />
            <Bar dataKey="transactions" fill="#909090" name="Transactions" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats Table */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-silver-100 mb-4">Detailed Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Metric</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">Current Period</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">Previous Period</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">Change</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-800 hover:bg-gray-800/50">
                <td className="py-3 px-4 text-gray-300">Total Revenue</td>
                <td className="py-3 px-4 text-right text-silver-100">KES 328,000</td>
                <td className="py-3 px-4 text-right text-gray-400">KES 284,500</td>
                <td className="py-3 px-4 text-right text-green-400">+15.3%</td>
              </tr>
              <tr className="border-b border-gray-800 hover:bg-gray-800/50">
                <td className="py-3 px-4 text-gray-300">Transaction Count</td>
                <td className="py-3 px-4 text-right text-silver-100">7,730</td>
                <td className="py-3 px-4 text-right text-gray-400">6,895</td>
                <td className="py-3 px-4 text-right text-green-400">+12.1%</td>
              </tr>
              <tr className="border-b border-gray-800 hover:bg-gray-800/50">
                <td className="py-3 px-4 text-gray-300">Average Transaction Value</td>
                <td className="py-3 px-4 text-right text-silver-100">KES 42.44</td>
                <td className="py-3 px-4 text-right text-gray-400">KES 41.27</td>
                <td className="py-3 px-4 text-right text-green-400">+2.8%</td>
              </tr>
              <tr className="border-b border-gray-800 hover:bg-gray-800/50">
                <td className="py-3 px-4 text-gray-300">Customer Acquisition</td>
                <td className="py-3 px-4 text-right text-silver-100">342</td>
                <td className="py-3 px-4 text-right text-gray-400">298</td>
                <td className="py-3 px-4 text-right text-green-400">+14.8%</td>
              </tr>
              <tr className="hover:bg-gray-800/50">
                <td className="py-3 px-4 text-gray-300">Repeat Purchase Rate</td>
                <td className="py-3 px-4 text-right text-silver-100">68.5%</td>
                <td className="py-3 px-4 text-right text-gray-400">64.2%</td>
                <td className="py-3 px-4 text-right text-green-400">+6.7%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
