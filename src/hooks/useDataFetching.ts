// src/hooks/useDataFetching.ts
import { useState, useEffect } from 'react';

interface DataFetchingOptions<T> {
  initialData: T;
  fetchFn: () => Promise<T>;
  dependencies?: any[];
}

export function useDataFetching<T>({ 
  initialData, 
  fetchFn, 
  dependencies = [] 
}: DataFetchingOptions<T>) {
  const [data, setData] = useState<T>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await fetchFn();
        if (isMounted) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Error desconocido'));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, dependencies);

  return { data, loading, error, setData };
}