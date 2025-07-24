import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItemButton,
  Avatar,
  ListItemText,
  IconButton,
  Divider
} from '@mui/material';
import { Icon } from '@iconify/react';

const typeAvatars = { provider: '👨‍⚕️' };
const avatarColors = { provider: '#eae8fa', default: '#f1f5ff' };

const ProviderListUI = ({
  providers,
  lastProviderRef,
  onSelect,
  onToggleFavorite,
  hasMore,
  loading
}) => {
  return (
    <Box sx={{ p: 4, maxWidth: '600px', mx: 'auto', height: '500px', overflowY: 'auto' }}>
      <List spacing={2}>
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
                '&:hover .profile-name': { color: '#00a1ff' }
              }}
            >
              <Avatar
                sx={{
                  mr: 2,
                  width: 48,
                  height: 48,
                  fontSize: 24,
                  bgcolor: avatarColors[provider.type] || avatarColors.default,
                  color: '#5B5F7B'
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
                  </>
                }
              />

              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(provider.id);
                }}
                sx={{
                  position: 'absolute',
                  right: 8,
                  color: provider.starred ? '#ffb900' : '#5B5F7B'
                }}
              >
                <Icon
                  icon={provider.starred ? "solar:star-bold" : "solar:star-outline"}
                  style={{ fontSize: '18px' }}
                />
              </IconButton>
            </ListItemButton>
          );
        })}
      </List>

      {!hasMore && !loading && providers.length === 0 && (
        <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 4 }}>
          No hay más datos
        </Typography>
      )}
    </Box>
  );
};

export default ProviderListUI;
