import { useState, useEffect, useCallback } from 'react';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook for handling API calls with loading and error states
 * @param fetchFunction - The API function to call
 * @param params - Parameters for the API function
 * @param dependencies - Additional dependencies for the useEffect
 * @param initialData - Initial data to use (optional)
 * @param skipInitialFetch - Whether to skip the initial fetch (default: false)
 * @returns ApiState object with data, loading, error, and refetch function
 */
function useApi<T, P extends any[]>(
  fetchFunction: (...args: P) => Promise<T>,
  params: P,
  dependencies: React.DependencyList = [],
  initialData: T | null = null,
  skipInitialFetch: boolean = false
): ApiState<T> {
  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState<boolean>(!skipInitialFetch);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchFunction(...params);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, ...params]);

  useEffect(() => {
    if (!skipInitialFetch) {
      fetchData();
    }
  }, [fetchData, skipInitialFetch, ...dependencies]);

  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
}

export default useApi;