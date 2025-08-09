import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Card, Tooltip, IconButton, CardContent, Typography, Box, Avatar, Stack
} from '@mui/material';
import { getUserPhotoByEmail } from '../../../utils/graphHelper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandHoldingHand, faShuffle } from '@fortawesome/free-solid-svg-icons';
import { BsHousesFill } from 'react-icons/bs';

const statusColors = {
  New: { bg: '#FFE2EA', text: '#FF6692' },
  Emergency: { bg: '#FFF5DA', text: '#FFB900' },
  'In Progress': { bg: '#DFF3FF', text: '#00A1FF' },
  Pending: { bg: '#EAE8FA', text: '#8965E5' },
  Done: { bg: '#DAF8F4', text: '#00B8A3' },
  Duplicated: { bg: '#FFE3C4', text: '#FF8A00' },
};

// cache simple en memoria por email -> url
const photoCache = new Map();

export default function TicketAssignee({
  assigneeEmail,
  status,
  onReassign,
  onChangeDepartment,
  onChangeCenter,
}) {
  const [photoUrl, setPhotoUrl] = useState('');
  const mountedRef = useRef(true);

  // Derivar el nombre a partir del email (sin estado)
  const formattedName = useMemo(() => {
    if (assigneeEmail && assigneeEmail.includes('@')) {
      return assigneeEmail
        .split('@')[0]
        .replace(/\./g, ' ')
        .split(' ')
        .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
        .join(' ');
    }
    return 'Unassigned';
  }, [assigneeEmail]);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      // si no hay email válido, limpia si es necesario y sal
      if (!assigneeEmail || !assigneeEmail.includes('@')) {
        if (photoUrl !== '') setPhotoUrl('');
        return;
      }

      // si ya está en cache, úsalo sin fetch
      if (photoCache.has(assigneeEmail)) {
        const cached = photoCache.get(assigneeEmail) || '';
        if (cached !== photoUrl) setPhotoUrl(cached);
        return;
      }

      try {
        const url = await getUserPhotoByEmail(assigneeEmail);
        if (cancelled || !mountedRef.current) return;

        const safeUrl = url || '';
        // guarda en cache para próximas veces
        photoCache.set(assigneeEmail, safeUrl);
        // evita setState si no cambia
        if (safeUrl !== photoUrl) setPhotoUrl(safeUrl);
      } catch (e) {
        if (cancelled || !mountedRef.current) return;
        photoCache.set(assigneeEmail, '');
        if (photoUrl !== '') setPhotoUrl('');
      }
    };

    load();

    // cleanup para abortar actualizaciones en carrera
    return () => { cancelled = true; };
    // OJO: no pongas photoUrl como dependencia, para no re-disparar por el propio setState
    // eslint-disable-next-line
  }, [assigneeEmail]);

  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent sx={{ p: '20px 25px 25px 30px' }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <Box sx={{
              width: 8, height: 24, borderRadius: 10,
              backgroundColor: statusColors[status]?.text || '#00a1ff',
            }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: statusColors[status]?.text || '#00a1ff' }}>
              Assigned to
            </Typography>
          </Box>

          <Box display="flex" gap={1}>
            {onChangeDepartment && (
              <Tooltip title="Change department">
                <IconButton size="small" onClick={onChangeDepartment}>
                  <BsHousesFill style={{ color: '#00a1ff', fontSize: 18 }} />
                </IconButton>
              </Tooltip>
            )}
            {onReassign && (
              <Tooltip title="Reassign agent">
                <IconButton size="small" onClick={onReassign}>
                  <FontAwesomeIcon icon={faHandHoldingHand} style={{ color: '#00a1ff', fontSize: 16 }} />
                </IconButton>
              </Tooltip>
            )}
            {onChangeCenter && (
              <Tooltip title="Transfer case">
                <IconButton size="small" onClick={onChangeCenter}>
                  <FontAwesomeIcon icon={faShuffle} style={{ color: '#00a1ff', fontSize: 16 }} />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>

        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar src={photoUrl} alt={formattedName} sx={{ width: 40, height: 40 }}>
            {formattedName.charAt(0)}
          </Avatar>
          <Typography variant="body2">{formattedName}</Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
