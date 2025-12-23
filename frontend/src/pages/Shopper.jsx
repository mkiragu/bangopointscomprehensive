import { useEffect, useState } from 'react';
import Card from '../components/Card';
import { api } from '../services/api';

export default function Shopper() {
  const [points, setPoints] = useState(null);
  const [receipts, setReceipts] = useState([]);
  const [rewards, setRewards] = useState([]);

  useEffect(() => {
    api.get('/shoppers/points').then((res) => res.success && setPoints(res.data));
    api.get('/shoppers/receipts').then((res) => res.success && setReceipts(res.data));
    api.get('/shoppers/rewards').then((res) => res.success && setRewards(res.data));
  }, []);

  return (
    <div className="grid two">
      <Card title="Points Overview" subtitle="Your current balance">
        {points ? (
          <div className="grid three">
            <Stat label="Points" value={points.points.toLocaleString()} />
            <Stat label="Tier" value={points.tier.toUpperCase()} />
            <Stat label="Multiplier" value={`${points.multiplier}x`} />
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </Card>

      <Card title="Recent Receipts" subtitle="Track approvals">
        <div className="list">
          {receipts.map((receipt) => (
            <div key={receipt.id} className="list-item">
              <div>
                <strong>{receipt.store}</strong>
                <p style={{ color: '#9ca3af' }}>{receipt.date}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p>KES {receipt.amount.toLocaleString()}</p>
                <span className="badge" style={{ background: receipt.status === 'approved' ? 'rgba(16,185,129,0.15)' : 'rgba(250,204,21,0.15)', color: receipt.status === 'approved' ? '#34d399' : '#facc15', borderColor: 'transparent' }}>
                  {receipt.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Rewards" subtitle="Redeem your points">
        <div className="grid three">
          {rewards.map((reward) => (
            <div key={reward.id} className="card" style={{ padding: 14 }}>
              <h4>{reward.name}</h4>
              <p style={{ color: '#9ca3af' }}>{reward.type.toUpperCase()}</p>
              <p style={{ marginTop: 8 }}><strong>{reward.points} pts</strong></p>
              <p style={{ fontSize: 12, color: '#94a3b8' }}>Stock: {reward.stock}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="card" style={{ padding: 14 }}>
      <p style={{ color: '#94a3b8', fontSize: 13 }}>{label}</p>
      <h2 style={{ marginTop: 4 }}>{value}</h2>
    </div>
  );
}
