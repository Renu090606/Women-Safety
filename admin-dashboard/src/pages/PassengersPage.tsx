import type { ReactElement } from 'react';
import { useApiList } from '../hooks';
import { Passenger } from '../types';

export function PassengersPage(): ReactElement {
  const { data, isLoading, error, refetch } =
    useApiList<Passenger>('/api/passengers');

  return (
    <section className="panel">
      <div className="panel-header">
        <h1>Passengers</h1>
        <button className="btn primary" onClick={() => void refetch()} type="button">
          Refresh
        </button>
      </div>
      {isLoading ? <div className="state loading">Loading passengers...</div> : null}
      {error ? <div className="state error">{error}</div> : null}
      {!isLoading && !error && data.length === 0 ? (
        <div className="state empty">No passengers found.</div>
      ) : null}
      {!isLoading && !error && data.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Guardian Phone</th>
              <th>Route</th>
              <th>Pickup Stop</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((passenger) => (
              <tr key={passenger.id}>
                <td>{passenger.name ?? '-'}</td>
                <td>{passenger.guardianPhone ?? '-'}</td>
                <td>{passenger.routeName ?? '-'}</td>
                <td>{passenger.pickupStop ?? '-'}</td>
                <td>{passenger.status ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </section>
  );
}
