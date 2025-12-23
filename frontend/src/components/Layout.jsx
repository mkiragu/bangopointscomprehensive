import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DEMO_DATA } from '../services/mockData';

const links = [
  { label: 'Shopper', path: '/shopper', icon: '🛒', desc: 'Points & rewards', userKey: 'shopper' },
  { label: 'Admin', path: '/admin', icon: '🛡️', desc: 'Users & brands', userKey: 'admin' },
  { label: 'Brand Manager', path: '/brand-manager', icon: '💼', desc: 'Campaign analytics', userKey: 'brandManager' },
  { label: 'PPG Agent', path: '/ppg', icon: '👤', desc: 'Promotions & clocking', userKey: 'ppg' },
  { label: 'BEO Agent', path: '/beo', icon: '👥', desc: 'Receipt processing', userKey: 'beo' },
  { label: 'Executive', path: '/executive', icon: '🏢', desc: 'KPIs overview', userKey: 'executive' }
];

export default function Layout() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const switchRole = (link) => {
    setUser(DEMO_DATA.users[link.userKey]);
    navigate(link.path);
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand">BANGOPOINTS</div>
        <nav className="nav">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                switchRole(link);
              }}
            >
              <span className="icon" aria-hidden>{link.icon}</span>
              <div className="nav-text">
                <strong>{link.label}</strong>
                <small>{link.desc}</small>
              </div>
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="main">
        <header className="topbar">
          <div>
            <p style={{ color: '#94a3b8', fontSize: 13 }}>You're viewing: {location.pathname}</p>
            <h2>{user?.name || 'Select a role'}</h2>
          </div>
          <div className="pill">{user?.role || 'guest'}</div>
        </header>
        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
