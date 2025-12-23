import React, { useState } from 'react';
import { Bell, DollarSign, TrendingUp, AlertCircle, CheckCircle, XCircle, Filter, Search } from 'lucide-react';

const Notifications = () => {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Sample notifications
  const notifications = [
    {
      id: 1,
      type: 'billing',
      title: 'Invoice Ready for June 2025',
      message: 'Your monthly invoice for June 2025 is now available. Amount due: KES 7,818',
      time: '2 hours ago',
      read: false,
      icon: DollarSign,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
    },
    {
      id: 2,
      type: 'payment',
      title: 'Payment Confirmed',
      message: 'Your payment of KES 7,200 for May 2025 invoice has been processed successfully.',
      time: '1 day ago',
      read: true,
      icon: CheckCircle,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
    },
    {
      id: 3,
      type: 'performance',
      title: 'Weekly Performance Summary',
      message: 'Transaction volume increased by 12% this week. 287 receipts processed.',
      time: '2 days ago',
      read: false,
      icon: TrendingUp,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
    },
    {
      id: 4,
      type: 'alert',
      title: 'Invoice Due Soon',
      message: 'Your invoice for May 2025 (KES 7,200) is due in 5 days. Please make payment to avoid late fees.',
      time: '3 days ago',
      read: false,
      icon: AlertCircle,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20',
    },
    {
      id: 5,
      type: 'system',
      title: 'New Analytics Features Available',
      message: 'Check out the new customer segmentation report in the Analytics section.',
      time: '5 days ago',
      read: true,
      icon: Bell,
      color: 'text-silver-400',
      bgColor: 'bg-silver-500/20',
    },
    {
      id: 6,
      type: 'billing',
      title: 'Volume Discount Applied',
      message: 'Congratulations! You qualified for a 10% volume discount this month (1,245 transactions).',
      time: '1 week ago',
      read: true,
      icon: DollarSign,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
    },
    {
      id: 7,
      type: 'alert',
      title: 'Payment Failed',
      message: 'Your automatic payment failed. Please update your payment method.',
      time: '1 week ago',
      read: true,
      icon: XCircle,
      color: 'text-red-400',
      bgColor: 'bg-red-500/20',
    },
    {
      id: 8,
      type: 'performance',
      title: 'Monthly Report Available',
      message: 'Your May 2025 performance report is ready for download.',
      time: '2 weeks ago',
      read: true,
      icon: TrendingUp,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
    },
  ];

  const filteredNotifications = notifications.filter((notif) => {
    const matchesFilter = filter === 'all' || notif.type === filter;
    const matchesSearch = notif.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notif.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id) => {
    // Implement mark as read functionality
    console.log('Mark as read:', id);
  };

  const markAllAsRead = () => {
    // Implement mark all as read functionality
    console.log('Mark all as read');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-silver-100 flex items-center gap-3">
            Notifications
            {unreadCount > 0 && (
              <span className="px-3 py-1 bg-silver-600/30 text-silver-100 rounded-full text-sm font-medium">
                {unreadCount} unread
              </span>
            )}
          </h1>
          <p className="text-gray-400 mt-1">Stay updated with important alerts and messages</p>
        </div>
        <button
          onClick={markAllAsRead}
          className="px-4 py-2 bg-silver-600/20 text-silver-100 rounded-lg hover:bg-silver-600/30 transition-colors"
        >
          Mark all as read
        </button>
      </div>

      {/* Filters and Search */}
      <div className="card p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 placeholder-gray-500 focus:border-silver-500 focus:outline-none"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2">
            {[
              { value: 'all', label: 'All' },
              { value: 'billing', label: 'Billing' },
              { value: 'payment', label: 'Payment' },
              { value: 'performance', label: 'Performance' },
              { value: 'alert', label: 'Alerts' },
              { value: 'system', label: 'System' },
            ].map((filterOption) => (
              <button
                key={filterOption.value}
                onClick={() => setFilter(filterOption.value)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === filterOption.value
                    ? 'bg-silver-600/30 text-silver-100'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {filterOption.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="card p-12 text-center">
            <Bell className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No notifications found</p>
            <p className="text-gray-500 text-sm mt-2">Try adjusting your filters or search query</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => {
            const Icon = notification.icon;
            return (
              <div
                key={notification.id}
                className={`card p-6 cursor-pointer transition-colors ${
                  !notification.read ? 'border-l-4 border-silver-500' : ''
                } hover:bg-gray-800/50`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`p-3 rounded-lg ${notification.bgColor}`}>
                    <Icon className={`w-6 h-6 ${notification.color}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className={`font-semibold ${notification.read ? 'text-gray-300' : 'text-silver-100'}`}>
                          {notification.title}
                          {!notification.read && (
                            <span className="ml-2 inline-block w-2 h-2 bg-silver-500 rounded-full"></span>
                          )}
                        </h3>
                        <p className="text-gray-400 mt-1">{notification.message}</p>
                      </div>
                      <span className="text-gray-500 text-sm whitespace-nowrap ml-4">{notification.time}</span>
                    </div>

                    {/* Type Badge */}
                    <div className="mt-3">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          notification.type === 'billing'
                            ? 'bg-green-500/20 text-green-400'
                            : notification.type === 'payment'
                            ? 'bg-green-500/20 text-green-400'
                            : notification.type === 'performance'
                            ? 'bg-blue-500/20 text-blue-400'
                            : notification.type === 'alert'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-silver-500/20 text-silver-300'
                        }`}
                      >
                        {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Notification Preferences */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-silver-100 mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          {[
            { label: 'Billing & Invoices', description: 'Get notified about new invoices and payment confirmations' },
            { label: 'Performance Updates', description: 'Receive weekly and monthly performance summaries' },
            { label: 'Payment Alerts', description: 'Reminders for upcoming payment due dates' },
            { label: 'System Updates', description: 'Announcements about new features and platform updates' },
          ].map((pref, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-gray-800 last:border-0">
              <div>
                <p className="text-gray-300 font-medium">{pref.label}</p>
                <p className="text-gray-500 text-sm mt-1">{pref.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-silver-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
