import React, { useEffect, useState, useRef, useCallback } from 'react';
import { getProviders } from '../utils/apiProviders';
import {
  Box,
  Typography,
  Stack,
  ListItemButton,
  Avatar,
  ListItemText,
  IconButton,
  Divider,
} from '@mui/material';
import { Icon } from '@iconify/react';
import ProviderAutocomplete from './components/providersAutocomplete';

const typeAvatars = {
  provider: '👨‍⚕️',
};

const avatarColors = {
  provider: '#eae8fa',
  default: '#f1f5ff',
};

const ProviderList = ({ onSelect }) => {
  const [providers, setProviders] = useState([]);
  const [continuationToken, setContinuationToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();
  const [isSearching, ] = useState(false);

  // 🔹 Cargar paginación por defecto
  const fetchProviders = useCallback(async () => {
    if (loading || !hasMore || isSearching) return;
    setLoading(true);
    try {
      const response = await getProviders({
        params: {
          limit: 10,
          continuationToken: continuationToken,
        },
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

  // 🔹 Observador para scroll infinito
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

  // 🔹 Cargar los primeros resultados SOLO si no estamos buscando
  useEffect(() => {
    if (!isSearching && providers.length === 0) {
      fetchProviders();
    }
  }, [fetchProviders, isSearching, providers.length]);



  return (
    <Box sx={{ p: 4, maxWidth: '600px', mx: 'auto', height: '500px', overflowY: 'auto' }}>
      <ProviderAutocomplete onSelect={(provider) => onSelect(provider)} />

      <Stack spacing={2}>
        {providers.map((provider, index) => {
          const isLastItem = index === providers.length - 1;

          return (
            <ListItemButton
              key={provider.id}
              ref={isLastItem && !isSearching ? lastProviderRef : null}
              onClick={() => onSelect(provider)}
              sx={{
                borderRadius: 2,
                mb: 1,
                position: 'relative',
                '&:hover .profile-name': {
                  color: '#00a1ff',
                },
              }}
            >
              <Avatar
                sx={{
                  mr: 2,
                  width: 48,
                  height: 48,
                  fontSize: 24,
                  bgcolor: avatarColors[provider.type] || avatarColors.default,
                  color: '#5B5F7B',
                }}
              >
                {typeAvatars[provider.type] || '👤'}
              </Avatar>

              <ListItemText
                primary={
                  <Typography className="profile-name" sx={{ fontWeight: 'bold', color: '#1A1A1A' }}>
                    {provider["First_Name"] || "N/A"} {provider["Last_Name"] || "N/A"}
                  </Typography>
                }
                secondary={
                  <>
                    <Typography variant="body2" sx={{ color: '#5B5F7B' }}>
                      {provider["Provider_Name"]} <Divider />
                      {provider["Office_Address"]}
                    </Typography>
                    <Typography variant="p" sx={{ color: '#5B5F7B' }}>
                      {provider["Taxonomy_Description"]} <Divider />
                    </Typography>
                  </>
                }
              />

              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  setProviders((prev) =>
                    prev.map((p) =>
                      p.id === provider.id ? { ...p, starred: !p.starred } : p
                    )
                  );
                }}
                sx={{
                  position: 'absolute',
                  right: 8,
                  color: provider.starred ? '#ffb900' : '#5B5F7B',
                }}
              >
                <Icon icon={provider.starred ? "solar:star-bold" : "solar:star-outline"} style={{ fontSize: '18px' }} />
              </IconButton>
            </ListItemButton>
          );
        })}
      </Stack>

      {!hasMore && !loading && providers.length === 0 && (
        <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 4 }}>
          No hay más datos
        </Typography>
      )}
    </Box>
  );
};

export default ProviderList;
