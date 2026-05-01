import type { ReactElement } from 'react';
import { useApiList } from '../hooks';
import { SosAlert } from '../types';

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

export function SosAlertsPage(): ReactElement {
  const { data, isLoading, error, refetch } = useApiList<SosAlert>('/api/sos-alerts');

  return (
    <section className="panel">
      <div className="panel-header">
        <h1>SOS Alerts</h1>
        <button className="btn primary" onClick={() => void refetch()} type="button">
          Refresh
        </button>
      </div>
      {isLoading ? <div className="state loading">Loading alerts...</div> : null}
      {error ? <div className="state error">{error}</div> : null}
      {!isLoading && !error && data.length === 0 ? (
        <div className="state empty">No active SOS alerts.</div>
      ) : null}
      {!isLoading && !error && data.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Bus Number</th>
              <th>Passenger</th>
              <th>Severity</th>
              <th>Created At</th>
              <th>Status</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {data.map((alert) => (
              <tr key={alert.id}>
                <td>{alert.busNumber ?? '-'}</td>
                <td>{alert.passengerName ?? '-'}</td>
                <td>{alert.severity ?? '-'}</td>
                <td>{alert.createdAt ?? '-'}</td>
                <td>{alert.status ?? '-'}</td>
                <td>{mapLink(alert.latitude, alert.longitude)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </section>
  );
}
