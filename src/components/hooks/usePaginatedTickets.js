import { useState, useCallback, useRef } from 'react';

/**
 * Hook de paginación con:
 * - normalización flexible de la respuesta
 * - deduplicación eficiente por id (configurable)
 * - control de parámetros y reset
 *
 * fetchFn(payload) debe devolver algo tipo:
 *   { message: { items, continuationToken } }  // ✅ recomendado
 *   { items, continuationToken }               // también ok
 *   [ ...items ]                               // array directo
 */
export default function usePaginatedTickets(
  fetchFn,
  initialParams = {},
  { pageSize = 10, idKey = 'id' } = {}
) {
  const [tickets, setTickets] = useState([]);
  const [params, setParamsState] = useState(initialParams);
  const [continuationToken, setContinuationToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // IDs vistos para deduplicar sin O(n^2)
  const seenIdsRef = useRef(new Set());

  const extractItemsAndToken = (res) => {
    const payload = res?.message ?? res;

    // items puede venir en varias formas
    const items = Array.isArray(payload)
      ? payload
      : (payload?.items ?? []);

    const nextToken =
      payload?.continuationToken ??
      payload?.nextToken ??
      res?.continuationToken ??
      null;

    return { items: Array.isArray(items) ? items : [], nextToken };
  };

  const pickId = (item) => {
    // intenta idKey, sino usa campos típicos
    return item?.[idKey] ?? item?.tickets ?? item?._id ?? item?.id;
  };

  const fetchMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const res = await fetchFn({
        ...params,
        continuationToken,
        limit: pageSize,
      });

      const { items, nextToken } = extractItemsAndToken(res);

      // Mezcla + dedupe
      const newItems = [];
      for (const it of items) {
        const key = pickId(it);
        // si no hay clave, igual lo agregamos (no deduplicable)
        if (!key) {
          newItems.push(it);
          continue;
        }
        if (!seenIdsRef.current.has(key)) {
          seenIdsRef.current.add(key);
          newItems.push(it);
        }
      }

      setTickets((prev) => prev.concat(newItems));
      setContinuationToken(nextToken || null);

      // hasMore: si hay token o si el backend devolvió pageSize elementos (heurística)
      setHasMore(Boolean(nextToken) || items.length === pageSize);
    } catch (err) {
      console.error('Error fetching tickets:', err);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line
  }, [fetchFn, params, continuationToken, hasMore, loading, pageSize]);

  const reset = useCallback(() => {
    setTickets([]);
    setContinuationToken(null);
    setHasMore(true);
    seenIdsRef.current = new Set();
  }, []);

  /**
   * Actualiza parámetros. Si reset=true reinicia la paginación.
   */
  const setParams = useCallback((nextParams, { reset: doReset = true } = {}) => {
    setParamsState(nextParams || {});
    if (doReset) {
      // reset limpio para empezar nueva búsqueda
      setTickets([]);
      setContinuationToken(null);
      setHasMore(true);
      seenIdsRef.current = new Set();
    }
  }, []);

  return { tickets, loading, hasMore, fetchMore, reset, setParams };
}
