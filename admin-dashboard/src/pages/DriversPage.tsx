import type { ReactElement } from 'react';
import { useApiList } from '../hooks';
import { Driver } from '../types';

export function DriversPage(): ReactElement {
  const { data, isLoading, error, refetch } = useApiList<Driver>('/api/drivers');

  return (
    <section className="panel">
      <div className="panel-header">
        <h1>Drivers</h1>
        <button className="btn primary" onClick={() => void refetch()} type="button">
          Refresh
        </button>
      </div>
      {isLoading ? <div className="state loading">Loading drivers...</div> : null}
      {error ? <div className="state error">{error}</div> : null}
      {!isLoading && !error && data.length === 0 ? (
        <div className="state empty">No drivers found.</div>
      ) : null}
      {!isLoading && !error && data.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>License Number</th>
              <th>Assigned Bus</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((driver) => (
              <tr key={driver.id}>
                <td>{driver.name ?? '-'}</td>
                <td>{driver.phone ?? '-'}</td>
                <td>{driver.licenseNumber ?? '-'}</td>
                <td>{driver.assignedBusId ?? '-'}</td>
                <td>{driver.status ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </section>
  );
}
