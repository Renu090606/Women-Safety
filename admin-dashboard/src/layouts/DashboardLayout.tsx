import { signOut } from 'firebase/auth';
import type { ReactElement } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

const links = [
  { to: 'buses', label: 'Buses' },
  { to: 'drivers', label: 'Drivers' },
  { to: 'passengers', label: 'Passengers' },
  { to: 'sos-alerts', label: 'SOS Alerts' },
  { to: 'assign-bus', label: 'Assign Bus' },
  { to: 'live-buses', label: 'Live Buses' },
];

export function DashboardLayout(): ReactElement {
  const navigate = useNavigate();

  const handleLogout = async (): Promise<void> => {
    await signOut(auth);
    navigate('/login', { replace: true });
  };

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <h2>Admin Dashboard</h2>
        <nav className="nav-list">
          {links.map((link) => (
            <NavLink
              key={link.to}
              className={({ isActive }) =>
                isActive ? 'nav-link active' : 'nav-link'
              }
              to={link.to}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button className="btn danger" onClick={handleLogout} type="button">
            Logout
          </button>
        </div>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
