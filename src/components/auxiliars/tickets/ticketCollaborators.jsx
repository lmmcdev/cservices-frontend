import React, { useEffect, useMemo, useState } from 'react';
import {
  Card, CardContent, Typography, Box, Avatar, Stack, IconButton, Tooltip
} from '@mui/material';
import { getUserPhotoByEmail } from '../../../utils/graphHelper';
import { icons } from '../icons';
import { Icon } from '@iconify/react';

const statusColors = {
  New: { bg: '#FFE2EA', text: '#FF6692' },
  Emergency: { bg: '#FFF5DA', text: '#FFB900' },
  'In Progress': { bg: '#DFF3FF', text: '#00A1FF' },
  Pending: { bg: '#EAE8FA', text: '#8965E5' },
  Done: { bg: '#DAF8F4', text: '#00B8A3' },
  Duplicated: { bg: '#FFE3C4', text: '#FF8A00' },
};

function shallowEqual(a, b) {
  const aK = Object.keys(a);
  const bK = Object.keys(b);
  if (aK.length !== bK.length) return false;
  for (const k of aK) if (a[k] !== b[k]) return false;
  return true;
}

export default function TicketCollaborators({
  collaborators = [],
  onAddCollaborator,
  onRemoveCollaborator,
  status
}) {
  const [photoUrls, setPhotoUrls] = useState({});

  // Lista estable y limpia de correos
  const cleanCollaborators = useMemo(
    () => collaborators
      .filter(Boolean)
      .map(e => e.trim())
      .filter(Boolean),
    [collaborators]
  );

  useEffect(() => {
    let cancelled = false;

    const fetchPhotos = async () => {
      if (cleanCollaborators.length === 0) {
        if (!shallowEqual(photoUrls, {})) setPhotoUrls({});
        return;
      }

      const entries = await Promise.all(
        cleanCollaborators.map(async (email) => {
          try {
            const url = await getUserPhotoByEmail(email);
            return [email, url || ''];
          } catch {
            return [email, ''];
          }
        })
      );

      if (cancelled) return;

      // construye el nuevo mapa solo con los que tengan algún valor (o vacío controlado)
      const next = entries.reduce((acc, [email, url]) => {
        if (url) acc[email] = url;
        return acc;
      }, {});

      if (!shallowEqual(photoUrls, next)) {
        setPhotoUrls(next);
      }
    };

    fetchPhotos();

    return () => { cancelled = true; };
    // importante: dependemos de la lista limpia y del estado actual para comparar
    // eslint-disable-next-line
  }, [cleanCollaborators]); // no incluyas photoUrls para no re-disparar innecesariamente

  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent sx={{ p: '20px 25px 25px 30px' }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box display="flex" alignItems="center">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{
                width: 8, height: 24, borderRadius: 10,
                backgroundColor: statusColors[status]?.text || '#00a1ff'
              }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: statusColors[status]?.text || '#00a1ff' }}>
                Collaborators
              </Typography>
            </Box>
          </Box>
          {onAddCollaborator && (
            <Tooltip title="Add collaborator">
              <IconButton size="small" onClick={onAddCollaborator}>
                <icons.addCollaborator style={{ color: '#00a1ff', fontSize: '22px' }} />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        {cleanCollaborators.length === 0 ? (
          <Typography variant="body2" color="text.secondary">No collaborators.</Typography>
        ) : (
          <Stack spacing={1}>
            {cleanCollaborators.map((email) => {
              const name = email.replace(/@.*$/, '').replace('.', ' ');
              const formattedName = name
                .split(' ')
                .map(part => part.charAt(0).toUpperCase() + part.slice(1))
                .join(' ');

              return (
                <Box key={email} display="flex" alignItems="center" justifyContent="space-between">
                  <Box display="flex" alignItems="center" gap={1}>
                    <Avatar src={photoUrls[email]} alt={formattedName} sx={{ width: 40, height: 40 }}>
                      {formattedName.charAt(0)}
                    </Avatar>
                    <Typography variant="body2">{formattedName}</Typography>
                  </Box>
                  {onRemoveCollaborator && (
                    <Tooltip title="Remove collaborator">
                      <IconButton size="small" onClick={() => onRemoveCollaborator(email)}>
                        <Icon icon="solar:trash-bin-trash-bold-duotone" width="20" height="20" style={{ color: '#555' }} />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              );
            })}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
