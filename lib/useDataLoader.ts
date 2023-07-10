import { useState, useEffect } from 'react';

export function useDataLoader<T>(loadData: () => Promise<T>, watch: any[]) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      setError(null);
  
      try {
        const data = await loadData();
        setData(data);
  
      } catch(error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        setError(errorMessage);
  
      } finally {
        setLoading(false);
      }
    };
    
    getData();
  }, watch);

  return { data, loading, error };
}