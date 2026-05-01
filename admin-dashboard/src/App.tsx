import { useEffect, useState } from 'react';
import type { ReactElement } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import {
  Navigate,
  Outlet,
  Route,
  BrowserRouter as Router,
  Routes,
} from 'react-router-dom';
import { auth, db } from './firebase';
import { DashboardLayout } from './layouts/DashboardLayout';
import { AssignBusPage } from './pages/AssignBusPage';
import { BusesPage } from './pages/BusesPage';
import { DriversPage } from './pages/DriversPage';
import { LiveBusesPage } from './pages/LiveBusesPage';
import { LoginPage } from './pages/LoginPage';
import { PassengersPage } from './pages/PassengersPage';
import { SosAlertsPage } from './pages/SosAlertsPage';

type AuthState = {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
};

function ProtectedRoute({
  authState,
}: {
  authState: AuthState;
}): ReactElement | null {
  if (authState.loading) {
    return <div className="auth-wrapper">Checking access...</div>;
  }
  if (!authState.user) {
    return <Navigate replace to="/login" />;
  }
  if (!authState.isAdmin) {
    return <div className="auth-wrapper error-text">Access denied. Admin role required.</div>;
  }
  return <Outlet />;
}

function App(): ReactElement {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    isAdmin: false,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setAuthState({ user: null, loading: false, isAdmin: false });
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const role = userDoc.exists()
          ? (userDoc.data().role as string | undefined)
          : undefined;
        setAuthState({
          user,
          loading: false,
          isAdmin: role === 'admin',
        });
      } catch {
        setAuthState({ user, loading: false, isAdmin: false });
      }
    });
    return unsubscribe;
  }, []);

  return (
    <div className="app-shell">
      <Router>
        <Routes>
          <Route element={<Navigate replace to="/login" />} path="/" />
          <Route
            element={authState.user ? <Navigate replace to="/dashboard/buses" /> : <LoginPage />}
            path="/login"
          />
          <Route element={<ProtectedRoute authState={authState} />}>
            <Route element={<DashboardLayout />} path="/dashboard">
              <Route element={<Navigate replace to="buses" />} index />
              <Route element={<BusesPage />} path="buses" />
              <Route element={<DriversPage />} path="drivers" />
              <Route element={<PassengersPage />} path="passengers" />
              <Route element={<SosAlertsPage />} path="sos-alerts" />
              <Route element={<AssignBusPage />} path="assign-bus" />
              <Route element={<LiveBusesPage />} path="live-buses" />
            </Route>
          </Route>
          <Route element={<Navigate replace to="/login" />} path="*" />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
