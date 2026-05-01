import { FormEvent, useState } from 'react';
import type { ReactElement } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';

export function LoginPage(): ReactElement {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const onSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const credentials = await signInWithEmailAndPassword(auth, email, password);
      const userRef = doc(db, 'users', credentials.user.uid);
      const userSnap = await getDoc(userRef);
      const role = userSnap.exists()
        ? (userSnap.data().role as string | undefined)
        : undefined;

      if (role !== 'admin') {
        await auth.signOut();
        setError('Access denied. Admin role required.');
        return;
      }

      navigate('/dashboard/buses', { replace: true });
    } catch (err) {
      const fallback = 'Login failed. Please verify credentials and try again.';
      setError(err instanceof Error ? err.message : fallback);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <form className="card" onSubmit={onSubmit}>
        <h1>Admin Login</h1>
        <p>Sign in with your admin Firebase account.</p>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            autoComplete="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            required
            type="email"
            value={email}
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            autoComplete="current-password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            required
            type="password"
            value={password}
          />
        </div>
        {error ? <p className="error-text">{error}</p> : null}
        <button className="btn primary" disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Signing in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
