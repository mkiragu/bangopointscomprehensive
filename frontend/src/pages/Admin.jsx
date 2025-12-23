import { useEffect, useState } from 'react';
import Card from '../components/Card';
import { api } from '../services/api';

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [brands, setBrands] = useState([]);
  const [stores, setStores] = useState([]);

  useEffect(() => {
    api.get('/admin/users').then((res) => res.success && setUsers(res.data));
    api.get('/admin/brands').then((res) => res.success && setBrands(res.data));
    api.get('/admin/stores').then((res) => res.success && setStores(res.data));
  }, []);

  return (
    <div className="grid two">
      <Card title="Users" subtitle="Active demo accounts">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Email / Store</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.role}</td>
                <td>{u.email || u.store || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card title="Brands" subtitle="Point rates">
        <table className="table">
          <thead>
            <tr>
              <th>Brand</th>
              <th>Category</th>
              <th>Point Rate</th>
              <th>Revenue</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((brand) => (
              <tr key={brand.id}>
                <td>{brand.name}</td>
                <td>{brand.category}</td>
                <td>{brand.pointRate}x</td>
                <td>KES {brand.revenue.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card title="Stores" subtitle="Receipt volumes">
        <div className="list">
          {stores.map((store) => (
            <div key={store.id} className="list-item">
              <div>
                <strong>{store.name}</strong>
                <p style={{ color: '#9ca3af' }}>{store.location}</p>
              </div>
              <p>{store.receipts} receipts</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
