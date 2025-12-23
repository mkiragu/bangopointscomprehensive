import { useEffect, useState } from 'react';
import Card from '../components/Card';
import { api } from '../services/api';

export default function BEO() {
  const [pending, setPending] = useState([]);

  useEffect(() => {
    api.get('/beo/receipts/pending').then((res) => res.success && setPending(res.data));
  }, []);

  return (
    <div className="grid two">
      <Card title="Pending Receipts" subtitle="Verify submissions">
        <div className="list">
          {pending.map((receipt) => (
            <div key={receipt.id} className="list-item">
              <div>
                <strong>{receipt.store}</strong>
                <p style={{ color: '#9ca3af' }}>KES {receipt.amount.toLocaleString()}</p>
              </div>
              <p>{receipt.date}</p>
            </div>
          ))}
          {!pending.length && <p>No pending receipts 🎉</p>}
        </div>
      </Card>
      <Card title="Guidelines">
        <ul style={{ color: '#cbd5e1', paddingLeft: 16, margin: 0 }}>
          <li>Approve clear receipts with visible totals.</li>
          <li>Flag duplicates and blurry images.</li>
          <li>Reward bonus points for partner brands.</li>
        </ul>
      </Card>
    </div>
  );
}
