import { useState, useCallback, useRef } from 'react';
import { getProviders } from '../../utils/apiProviders';

export const useProviders = () => {
  const [providers, setProviders] = useState([]);
  const [continuationToken, setContinuationToken] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const loadingRef = useRef(false); // Previene llamadas duplicadas

  const fetchProviders = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;

    loadingRef.current = true;
    setLoading(true);

    try {
      const response = await getProviders({
        params: {
          limit: 10,
          continuationToken: continuationToken,
        },
      });

      if (!response.success) throw new Error('Error fetching providers');

      const { items, continuationToken: nextToken } = response.message;
      console.log(response)
      setProviders((prev) => {
        const ids = new Set(prev.map((item) => item.id));
        const newItems = items.filter((item) => !ids.has(item.id));
        return [...prev, ...newItems];
      });

      setContinuationToken(nextToken || null);
      setHasMore(!!nextToken);

    } catch (error) {
      console.error('Error fetching providers:', error);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [continuationToken, hasMore]);

  return { providers, fetchProviders, hasMore, loading };
};
