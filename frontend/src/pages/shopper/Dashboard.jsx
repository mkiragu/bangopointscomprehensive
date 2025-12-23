import React, { useEffect, useState } from 'react';
import { Trophy, TrendingUp, Receipt, Gift, ArrowUp } from 'lucide-react';
import api from '../../services/api';

const ShopperDashboard = () => {
  const [data, setData] = useState({
    points: 0,
    tier: 'bronze',
    tierMultiplier: 1.0,
    receiptsCount: 0,
    pointsToNextTier: 10000,
    recentReceipts: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [pointsRes, receiptsRes, tierRes] = await Promise.all([
        api.get('/shoppers/points'),
        api.get('/shoppers/receipts?limit=5'),
        api.get('/shoppers/tier-info'),
      ]);

      setData({
        points: pointsRes.data.points_balance,
        tier: pointsRes.data.loyalty_tier,
        tierMultiplier: pointsRes.data.tier_multiplier,
        receiptsCount: receiptsRes.data.pagination.total,
        pointsToNextTier: tierRes.data.points_to_next_tier,
        recentReceipts: receiptsRes.data.receipts,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTierBadge = (tier) => {
    const badges = {
      bronze: 'badge-bronze',
      silver: 'badge-silver',
      gold: 'badge-gold',
    };
    return badges[tier] || 'badge-bronze';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="loading-shimmer w-64 h-8 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-accent-primary">Dashboard</h1>
        <p className="text-silver-400 mt-1">Welcome back! Here's your rewards summary</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-silver-400">Available Points</p>
              <h3 className="text-3xl font-bold text-accent-primary mt-1">
                {data.points.toLocaleString()}
              </h3>
            </div>
            <div className="w-12 h-12 bg-accent-primary/20 rounded-lg flex items-center justify-center">
              <Trophy className="w-6 h-6 text-accent-primary" />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-silver-400">Loyalty Tier</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`badge ${getTierBadge(data.tier)}`}>
                  {data.tier.toUpperCase()}
                </span>
                <span className="text-silver-300 text-sm">{data.tierMultiplier}x</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-yellow-600/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-silver-400">Total Receipts</p>
              <h3 className="text-3xl font-bold text-accent-primary mt-1">
                {data.receiptsCount}
              </h3>
            </div>
            <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
              <Receipt className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-silver-400">To Next Tier</p>
              <h3 className="text-2xl font-bold text-accent-primary mt-1">
                {data.pointsToNextTier > 0 ? data.pointsToNextTier.toLocaleString() : 'MAX'}
              </h3>
              <p className="text-xs text-silver-500 mt-1">points needed</p>
            </div>
            <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
              <ArrowUp className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Receipts */}
      <div className="card">
        <h2 className="text-xl font-bold text-accent-primary mb-4">Recent Receipts</h2>
        <div className="space-y-3">
          {data.recentReceipts.length > 0 ? (
            data.recentReceipts.map((receipt) => (
              <div
                key={receipt.id}
                className="flex items-center justify-between p-4 bg-dark-300 rounded-lg border border-silver-700"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-accent-primary/20 rounded-lg flex items-center justify-center">
                    <Receipt className="w-5 h-5 text-accent-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-silver-100">
                      KES {receipt.total_amount.toFixed(2)}
                    </p>
                    <p className="text-sm text-silver-400">
                      {new Date(receipt.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-semibold text-accent-primary">
                      +{receipt.points_awarded} pts
                    </p>
                    <span
                      className={`badge text-xs ${
                        receipt.status === 'approved'
                          ? 'badge-success'
                          : receipt.status === 'pending'
                          ? 'badge-warning'
                          : 'badge-danger'
                      }`}
                    >
                      {receipt.status}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-silver-400 text-center py-8">
              No receipts yet. Upload your first receipt to start earning points!
            </p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <a
          href="/shopper/receipts"
          className="card hover:shadow-silver-lg transition-all cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-accent-primary rounded-lg flex items-center justify-center">
              <Receipt className="w-6 h-6 text-dark-500" />
            </div>
            <div>
              <h3 className="font-semibold text-silver-100">Upload Receipt</h3>
              <p className="text-sm text-silver-400">Earn more points</p>
            </div>
          </div>
        </a>

        <a
          href="/shopper/rewards"
          className="card hover:shadow-silver-lg transition-all cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-accent-primary rounded-lg flex items-center justify-center">
              <Gift className="w-6 h-6 text-dark-500" />
            </div>
            <div>
              <h3 className="font-semibold text-silver-100">Browse Rewards</h3>
              <p className="text-sm text-silver-400">Redeem your points</p>
            </div>
          </div>
        </a>

        <a
          href="/shopper/profile"
          className="card hover:shadow-silver-lg transition-all cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-accent-primary rounded-lg flex items-center justify-center">
              <Trophy className="w-6 h-6 text-dark-500" />
            </div>
            <div>
              <h3 className="font-semibold text-silver-100">View Tier Benefits</h3>
              <p className="text-sm text-silver-400">See your rewards</p>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
};

export default ShopperDashboard;
