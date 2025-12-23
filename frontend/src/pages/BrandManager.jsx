import { useEffect, useState } from 'react';
import Card from '../components/Card';
import { BarChart } from '../components/Chart';
import { api } from '../services/api';

export default function BrandManager() {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    api.get('/brand-manager/analytics').then((res) => res.success && setAnalytics(res.data));
  }, []);

  if (!analytics) return <p>Loading analytics...</p>;

  const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div className="grid two">
      <Card title="Revenue (last 6 months)">
        <BarChart data={analytics.revenue} labels={months} height={220} />
      </Card>
      <Card title="Transactions (last 6 months)">
        <BarChart data={analytics.transactions} labels={months} height={220} />
      </Card>
      <Card title="User Growth">
        <BarChart data={analytics.users} labels={months} height={220} />
      </Card>
      <Card title="Top Products">
        <div className="list">
          {analytics.topProducts.map((product, idx) => (
            <div key={product} className="list-item">
              <span>{product}</span>
              <span className="pill">#{idx + 1}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
