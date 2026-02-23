import { useState, useEffect, useCallback } from 'react';

export function useApi(asyncFn, dependencies = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await asyncFn();
      setData(result);
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [...dependencies, retryCount]);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await asyncFn();
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) setError(err.message || 'An error occurred');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => { cancelled = true; };
  }, [execute]);

  const retry = useCallback(() => setRetryCount(c => c + 1), []);

  return { data, loading, error, retry };
}
