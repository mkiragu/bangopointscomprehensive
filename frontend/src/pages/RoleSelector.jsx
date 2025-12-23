import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DEMO_DATA } from '../services/mockData';

const roles = [
  { name: 'Admin User', key: 'admin', icon: '🛡️', color: '#a855f7', desc: 'Full system access', path: '/admin' },
  { name: 'Brand Manager', key: 'brandManager', icon: '💼', color: '#3b82f6', desc: 'Campaigns & analytics', path: '/brand-manager' },
  { name: 'Shopper', key: 'shopper', icon: '🛒', color: '#10b981', desc: 'Earn & redeem points', path: '/shopper' },
  { name: 'PPG Agent', key: 'ppg', icon: '👤', color: '#f97316', desc: 'Product promotion', path: '/ppg' },
  { name: 'BEO Agent', key: 'beo', icon: '👥', color: '#14b8a6', desc: 'Brand engagement', path: '/beo' },
  { name: 'Executive', key: 'executive', icon: '🏢', color: '#ef4444', desc: 'Executive overview', path: '/executive' }
];

export const RoleSelector = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const selectRole = (role) => {
    setUser(DEMO_DATA.users[role.key]);
    navigate(role.path);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f0f', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '10px', color: 'white' }}>BANGOPOINTS</h1>
      <p style={{ fontSize: '18px', color: '#888', marginBottom: '40px' }}>Choose Your Role</p>

      <div className="role-grid">
        {roles.map((role) => (
          <div
            key={role.name}
            className="role-card"
            style={{ background: role.color }}
            onClick={() => selectRole(role)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                selectRole(role);
              }
            }}
            tabIndex={0}
            role="button"
          >
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>{role.icon}</div>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', marginBottom: '5px' }}>{role.name}</h3>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)' }}>{role.desc}</p>
          </div>
        ))}
      </div>

      <p style={{ marginTop: '40px', color: '#666', textAlign: 'center', maxWidth: '600px' }}>
        This is a demo environment. Click any role to explore features instantly without authentication.
      </p>
    </div>
  );
};

export default RoleSelector;
