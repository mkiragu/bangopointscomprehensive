import { useState } from 'react';
import Card from '../components/Card';
import { api } from '../services/api';

export default function PPG() {
  const [status, setStatus] = useState(null);

  const clock = async (action) => {
    const res = await api.post('/ppg/clock', { action });
    if (res.success) setStatus(res.message);
  };

  return (
    <div className="grid two">
      <Card title="Clock In/Out" subtitle="For demo purposes">
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="button" onClick={() => clock('in')}>Clock In</button>
          <button className="button" onClick={() => clock('out')}>Clock Out</button>
        </div>
        {status && <p style={{ marginTop: 10, color: '#34d399' }}>{status}</p>}
      </Card>
      <Card title="Tips" subtitle="Promote products effectively">
        <ul style={{ color: '#cbd5e1', paddingLeft: 16, margin: 0 }}>
          <li>Prioritize featured brands in the hero bay.</li>
          <li>Validate receipts instantly to delight shoppers.</li>
          <li>Share promo codes that multiply points.</li>
        </ul>
      </Card>
    </div>
  );
}
