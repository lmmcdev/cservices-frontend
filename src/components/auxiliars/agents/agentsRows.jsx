import React from 'react';
import {
  Stack,
  Chip,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Checkbox,
  Typography,
} from '@mui/material';

const BRAND = '#00a1ff';

export const AgentRow = React.memo(function AgentRow({ agent, isSelected, onToggle, photoUrls }) {
  const email = String(agent?.email || '').trim();
  const displayName = agent?.name || 'Unknown';
  const initial = (displayName?.[0] || agent?.email?.[0] || '?').toUpperCase();
  const normalizedEmail = email.toLowerCase();
  const photoSrc = photoUrls[normalizedEmail] || agent?.photoUrl || undefined;
  const displayCenter = agent?.group_sys_name?.group ?? agent?.clinic;
  const displayRole = agent?.group_sys_name?.role ?? agent?.clinic;

  return (
    <React.Fragment key={email}>
      <ListItem
        secondaryAction={
          <Checkbox
            edge="end"
            checked={isSelected}
            onChange={() => onToggle(email)}
            sx={{
              color: '#b8c0cc',
              '&.Mui-checked': { color: BRAND },
              '& .MuiSvgIcon-root': { fontSize: 22 },
            }}
          />
        }
        sx={{ px: 2, py: 1, '&:hover': { bgcolor: 'rgba(0,161,255,0.06)' } }}
      >
        <ListItemAvatar>
          <Avatar src={photoSrc} alt={displayName} sx={{ bgcolor: BRAND, color: '#fff' }}>
            {initial}
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography sx={{ fontWeight: 600 }}>{displayName}</Typography>
              {agent?.position ? <Chip size="small" label={agent.position} /> : null}
            </Stack>
          }
          secondary={
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.25, flexWrap: 'wrap', gap: 0.5 }}>
              <Typography variant="body2" sx={{ color: '#6c757d' }}>{email}</Typography>
              {agent?.department && <Chip size="small" variant="outlined" label={agent.department} />}
              {displayCenter && <Chip size="small" variant="outlined" label={displayCenter} />}
              {displayRole && <Chip size="small" variant="outlined" label={displayRole} />}
            </Stack>
          }
        />
      </ListItem>
    </React.Fragment>
  );
});
