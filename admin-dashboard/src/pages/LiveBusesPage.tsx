import type { ReactElement } from 'react';
import { usePollingList } from '../hooks';
import { Bus } from '../types';

function mapLink(latitude?: number, longitude?: number): ReactElement | string {
  if (latitude == null || longitude == null) {
    return '-';
  }
  return (
    <a
      className="map-link"
      href={`https://www.google.com/maps?q=${latitude},${longitude}`}
      rel="noreferrer"
      target="_blank"
    >
      Open map
    </a>
  );
}

export function LiveBusesPage(): ReactElement {
  const { data, isLoading, error, refetch, secondsLeft } = usePollingList<Bus>(
    '/api/buses/active',
    10000
  );

  return (
    <section className="panel">
      <div className="panel-header">
        <h1>Live Buses</h1>
        <button className="btn primary" onClick={() => void refetch()} type="button">
          Refresh now
        </button>
      </div>
      <p>Auto-refresh in {secondsLeft}s</p>
      {isLoading ? <div className="state loading">Loading active buses...</div> : null}
      {error ? <div className="state error">{error}</div> : null}
      {!isLoading && !error && data.length === 0 ? (
        <div className="state empty">No active buses right now.</div>
      ) : null}
      {!isLoading && !error && data.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Bus Number</th>
              <th>Route</th>
              <th>Status</th>
              <th>Updated At</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {data.map((bus) => (
              <tr key={bus.id}>
                <td>{bus.busNumber ?? bus.id}</td>
                <td>{bus.routeName ?? '-'}</td>
                <td>{bus.status ?? '-'}</td>
                <td>{bus.updatedAt ?? '-'}</td>
                <td>{mapLink(bus.latitude, bus.longitude)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </section>
  );
}
