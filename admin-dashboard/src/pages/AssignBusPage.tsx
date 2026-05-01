import { FormEvent, useMemo, useState } from 'react';
import type { ReactElement } from 'react';
import { api } from '../api';
import { useApiList } from '../hooks';
import { Bus, Driver } from '../types';

export function AssignBusPage(): ReactElement {
  const buses = useApiList<Bus>('/api/buses');
  const drivers = useApiList<Driver>('/api/drivers');
  const [busId, setBusId] = useState<string>('');
  const [driverId, setDriverId] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const loading = buses.isLoading || drivers.isLoading;
  const error = buses.error || drivers.error;

  const canSubmit = useMemo(
    () => !isSaving && busId.trim() !== '' && driverId.trim() !== '',
    [busId, driverId, isSaving]
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setStatus('');
    setIsSaving(true);
    try {
      await api.post('/api/assign-bus', { busId, driverId });
      setStatus('Bus assigned successfully.');
      await Promise.all([buses.refetch(), drivers.refetch()]);
    } catch (err) {
      setStatus(err instanceof Error ? err.message : 'Failed to assign bus.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="panel">
      <div className="panel-header">
        <h1>Assign Bus</h1>
      </div>
      {loading ? <div className="state loading">Loading data...</div> : null}
      {error ? <div className="state error">{error}</div> : null}
      {!loading && !error ? (
        <form className="card" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="bus-id">Bus</label>
            <select
              id="bus-id"
              onChange={(e) => setBusId(e.target.value)}
              value={busId}
            >
              <option value="">Select bus</option>
              {buses.data.map((bus) => (
                <option key={bus.id} value={bus.id}>
                  {bus.busNumber ?? bus.id}
                </option>
              ))}
            </select>
          </div>
          <div className="input-group">
            <label htmlFor="driver-id">Driver</label>
            <select
              id="driver-id"
              onChange={(e) => setDriverId(e.target.value)}
              value={driverId}
            >
              <option value="">Select driver</option>
              {drivers.data.map((driver) => (
                <option key={driver.id} value={driver.id}>
                  {driver.name ?? driver.id}
                </option>
              ))}
            </select>
          </div>
          <button className="btn primary" disabled={!canSubmit} type="submit">
            {isSaving ? 'Assigning...' : 'Assign Bus'}
          </button>
          {status ? <p>{status}</p> : null}
        </form>
      ) : null}
    </section>
  );
}
