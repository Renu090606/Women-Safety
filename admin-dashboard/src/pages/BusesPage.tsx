import type { ReactElement } from 'react';
import { useApiList } from '../hooks';
import { Bus } from '../types';

function mapLink(latitude?: number, longitude?: number): ReactElement | string {
  if (latitude == null || longitude == null) {
    return '-';
  }
  const href = `https://www.google.com/maps?q=${latitude},${longitude}`;
  return (
    <a className="map-link" href={href} rel="noreferrer" target="_blank">
      View map
    </a>
  );
}

export function BusesPage(): ReactElement {
  const { data, isLoading, error, refetch } = useApiList<Bus>('/api/buses');

  return (
    <section className="panel">
      <div className="panel-header">
        <h1>Buses</h1>
        <button className="btn primary" onClick={() => void refetch()} type="button">
          Refresh
        </button>
      </div>
      {isLoading ? <div className="state loading">Loading buses...</div> : null}
      {error ? <div className="state error">{error}</div> : null}
      {!isLoading && !error && data.length === 0 ? (
        <div className="state empty">No buses found.</div>
      ) : null}
      {!isLoading && !error && data.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Bus Number</th>
              <th>Route</th>
              <th>Driver</th>
              <th>Status</th>
              <th>Occupancy</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {data.map((bus) => (
              <tr key={bus.id}>
                <td>{bus.busNumber ?? bus.id}</td>
                <td>{bus.routeName ?? '-'}</td>
                <td>{bus.driverName ?? '-'}</td>
                <td>{bus.status ?? '-'}</td>
                <td>{bus.occupancy ?? '-'}</td>
                <td>{mapLink(bus.latitude, bus.longitude)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </section>
  );
}
