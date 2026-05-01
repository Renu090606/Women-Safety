import { useCallback, useEffect, useRef, useState } from 'react';
import { AxiosError } from 'axios';
import { api } from './api';

type ApiState<T> = {
  data: T[];
  isLoading: boolean;
  error: string;
  refetch: () => Promise<void>;
};

function normalizeRows<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) {
    return payload as T[];
  }

  if (payload && typeof payload === 'object') {
    const maybeObject = payload as Record<string, unknown>;
    if (Array.isArray(maybeObject.data)) {
      return maybeObject.data as T[];
    }
  }

  return [];
}

export function useApiList<T>(path: string): ApiState<T> {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const fetchData = useCallback(async () => {
    try {
      setError('');
      const response = await api.get(path);
      setData(normalizeRows<T>(response.data));
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(axiosError.response?.data?.message ?? 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  }, [path]);

  useEffect(() => {
    setIsLoading(true);
    void fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}

export function usePollingList<T>(
  path: string,
  intervalMs: number
): ApiState<T> & { secondsLeft: number } {
  const [secondsLeft, setSecondsLeft] = useState(intervalMs / 1000);
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const timerRef = useRef<number | null>(null);
  const countdownRef = useRef<number | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setError('');
      const response = await api.get(path);
      setData(normalizeRows<T>(response.data));
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(axiosError.response?.data?.message ?? 'Failed to load data');
    } finally {
      setIsLoading(false);
      setSecondsLeft(intervalMs / 1000);
    }
  }, [intervalMs, path]);

  useEffect(() => {
    void fetchData();

    timerRef.current = window.setInterval(() => {
      void fetchData();
    }, intervalMs);

    countdownRef.current = window.setInterval(() => {
      setSecondsLeft((prev) => (prev <= 1 ? intervalMs / 1000 : prev - 1));
    }, 1000);

    return () => {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
      }
      if (countdownRef.current !== null) {
        window.clearInterval(countdownRef.current);
      }
    };
  }, [fetchData, intervalMs]);

  return { data, isLoading, error, refetch: fetchData, secondsLeft };
}
