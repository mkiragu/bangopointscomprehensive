import { useEffect, useState } from 'react';
import Card from '../components/Card';
import { BarChart } from '../components/Chart';
import { api } from '../services/api';

export default function Executive() {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    api.get('/brand-manager/analytics').then((res) => res.success && setAnalytics(res.data));
  }, []);

  if (!analytics) return <p>Loading KPIs...</p>;

  const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div className="grid two">
      <Card title="KPI Snapshot">
        <div className="grid three">
          <Stat label="Monthly Revenue (avg)" value={`KES ${avg(analytics.revenue).toLocaleString()}`}
            />
          <Stat label="Transactions" value={sum(analytics.transactions).toLocaleString()} />
          <Stat label="Active Users" value={analytics.users[analytics.users.length - 1].toLocaleString()} />
        </div>
      </Card>
      <Card title="Revenue trend">
        <BarChart data={analytics.revenue} labels={months} height={220} />
      </Card>
      <Card title="Engagement">
        <BarChart data={analytics.transactions} labels={months} height={220} />
      </Card>
      <Card title="Top performing SKUs">
        <div className="list">
          {analytics.topProducts.map((item) => (
            <div key={item} className="list-item">
              <span>{item}</span>
              <span className="pill">Hot</span>
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

const avg = (arr) => Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);
const sum = (arr) => arr.reduce((a, b) => a + b, 0);
