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
  CircularProgress,
  Divider,
} from '@mui/material';
import { Icon } from '@iconify/react';

const typeAvatars = {
  provider: '👨‍⚕️', // Cambié a uno más adecuado
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

  const fetchProviders = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      const response = await getProviders({
        params: {
          limit: 10,
          continuationToken: continuationToken,
        },
      });

      const { items, continuationToken: nextToken } = response.message;

      //const mappedItems = items.map(mapProviderToSimple);
      const mappedItems = items

      setProviders((prev) => {
        const ids = new Set(prev.map((item) => item.id));
        const newItems = mappedItems.filter((item) => !ids.has(item.id));
        return [...prev, ...newItems];
      });

      setContinuationToken(nextToken || null);
      setHasMore(!!nextToken);
    } catch (error) {
      console.error('Error fetching providers:', error);
    } finally {
      setLoading(false);
    }
  }, [continuationToken, hasMore, loading]);

  const lastProviderRef = useCallback(
    (node) => {
      if (loading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchProviders();
        }
      }, { rootMargin: '300px' });

      if (node) observer.current.observe(node);
    },
    [fetchProviders, hasMore, loading]
  );

  useEffect(() => {
    fetchProviders();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box sx={{
        p: 4,
        maxWidth: '600px',
        mx: 'auto',
        height: '500px',
        overflowY: 'auto',
    }}>
      <Stack spacing={2}>
        {providers.map((provider, index) => {
          const isLastItem = index === providers.length - 1;

          return (
            <ListItemButton
              key={provider.id}
              ref={isLastItem ? lastProviderRef : null}
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
                  <Typography
                    className="profile-name"
                    sx={{
                      fontWeight: 'bold',
                      color: '#1A1A1A',
                      transition: 'color 0.3s',
                    }}
                  >
                    {provider["First Name"] - provider["Last Name"]}
                  </Typography>
                }
                secondary={
                  <>
                  <Typography variant="body2" sx={{ color: '#5B5F7B' }}>
                    {provider["Provider Name"]} <Divider />
                    {provider["Office Address"]}
                  </Typography>

                  <Typography variant="p" sx={{ color: '#5B5F7B' }}>
                    {provider["Taxonomy Description"]} <Divider />
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
                {provider.starred ? (
                  <Icon icon="solar:star-bold" style={{ fontSize: '18px' }} />
                ) : (
                  <Icon icon="solar:star-outline" style={{ fontSize: '18px' }} />
                )}
              </IconButton>
            </ListItemButton>
          );
        })}
      </Stack>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {!hasMore && !loading && (
        <Typography
          variant="body2"
          color="textSecondary"
          align="center"
          sx={{ mt: 4 }}
        >
          No hay más datos
        </Typography>
      )}
    </Box>
  );
};

export default ProviderList;
