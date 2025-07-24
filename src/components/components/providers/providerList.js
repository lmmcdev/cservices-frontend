import React, { useEffect, useState, useRef, useCallback } from 'react';
import { getProviders } from '../../../utils/apiProviders';
import ProviderListUI from './providerListUI';
import ProviderAutocomplete from '../providersAutocomplete';

const ProviderListContainer = ({ onSelect }) => {
  const [providers, setProviders] = useState([]);
  const [continuationToken, setContinuationToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();
  const [isSearching] = useState(false);

  // ✅ Fetch con paginación
  const fetchProviders = useCallback(async () => {
    if (loading || !hasMore || isSearching) return;
    setLoading(true);
    try {
      const response = await getProviders({
        params: { limit: 10, continuationToken }
      });

      const { items, continuationToken: nextToken } = response.message;

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
      setLoading(false);
    }
  }, [continuationToken, hasMore, loading, isSearching]);

  // ✅ Scroll infinito con IntersectionObserver
  const lastProviderRef = useCallback(
    (node) => {
      if (loading || isSearching) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchProviders();
        }
      }, { rootMargin: '300px' });

      if (node) observer.current.observe(node);
    },
    [fetchProviders, hasMore, loading, isSearching]
  );

  // ✅ Cargar al inicio
  useEffect(() => {
    if (!isSearching && providers.length === 0) {
      fetchProviders();
    }
  }, [fetchProviders, isSearching, providers.length]);

  // ✅ Toggle favorito
  const toggleFavorite = (id) => {
    setProviders((prev) =>
      prev.map((p) => (p.id === id ? { ...p, starred: !p.starred } : p))
    );
  };

  return (
    <>
      <ProviderAutocomplete onSelect={onSelect} />
      <ProviderListUI
        providers={providers}
        lastProviderRef={lastProviderRef}
        onSelect={onSelect}
        onToggleFavorite={toggleFavorite}
        hasMore={hasMore}
        loading={loading}
      />
    </>
  );
};

export default ProviderListContainer;
