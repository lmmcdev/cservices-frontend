import React, { useEffect, useState } from 'react';
import {
  Card,
  Tooltip,
  IconButton,
  CardContent,
  Typography,
  Box,
  Avatar,
  Stack
} from '@mui/material';
import { getUserPhotoByEmail } from '../../../utils/graphHelper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandHoldingHand } from '@fortawesome/free-solid-svg-icons';
import { faShuffle } from '@fortawesome/free-solid-svg-icons';
import { BsHousesFill } from 'react-icons/bs';

const statusColors = {
  New: { bg: '#FFE2EA', text: '#FF6692' },
  Emergency: { bg: '#FFF5DA', text: '#FFB900' },
  'In Progress': { bg: '#DFF3FF', text: '#00A1FF' },
  Pending: { bg: '#EAE8FA', text: '#8965E5' },
  Done: { bg: '#DAF8F4', text: '#00B8A3' },
  Duplicated: { bg: '#FFE3C4', text: '#FF8A00' },
};

export default function TicketAssignee({
  assigneeEmail,
  status,
  onReassign,
  onChangeDepartment,
  onChangeCenter
}) {
  const [photoUrl, setPhotoUrl] = useState('');
  const [formattedName, setFormattedName] = useState('Unassigned');
  
  useEffect(() => {
    const updateInfo = async () => {
      if (assigneeEmail && assigneeEmail.includes('@')) {
        const name = assigneeEmail
          .split('@')[0]
          .replace('.', ' ')
          .split(' ')
          .map(part => part.charAt(0).toUpperCase() + part.slice(1))
          .join(' ');
        setFormattedName(name);

        try {
          const url = await getUserPhotoByEmail(assigneeEmail);
          setPhotoUrl(url || '');
        } catch (err) {
          console.warn(`No se pudo cargar la foto de ${assigneeEmail}:`, err.message);
          setPhotoUrl('');
        }
      } else {
        setFormattedName('Unassigned');
        setPhotoUrl('');
      }
    };

    updateInfo();
  }, [assigneeEmail]);


  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent sx={{ p: '20px 25px 25px 30px' }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <Box
              sx={{
                width: 8,
                height: 24,
                borderRadius: 10,
                backgroundColor: statusColors[status]?.text || '#00a1ff',
              }}
            />
            <Typography
              variant="h6"
              sx={{ fontWeight: 'bold', color: statusColors[status]?.text || '#00a1ff' }}
            >
              Assigned to
            </Typography>
          </Box>

          <Box display="flex" gap={1}>
            {onChangeDepartment && (
              <Tooltip title="Change department">
                <IconButton size="small" onClick={onChangeDepartment}>
                  <BsHousesFill style={{ color: '#00a1ff', fontSize: '18px' }} />
                </IconButton>
              </Tooltip>
            )}

            {onReassign && (
              <Tooltip title="Reassign agent">
                <IconButton size="small" onClick={onReassign}>
                  <FontAwesomeIcon icon={faHandHoldingHand} style={{ color: '#00a1ff', fontSize: '16px' }} />
                </IconButton>
              </Tooltip>
            )}

            <Tooltip title="Transfer case">
                <IconButton size="small" onClick={onChangeCenter}>
                  <FontAwesomeIcon icon={faShuffle} style={{ color: '#00a1ff', fontSize: '16px' }} />
                </IconButton>
              </Tooltip>
          </Box>
        </Box>

        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            src={photoUrl}
            alt={formattedName}
            sx={{ width: 40, height: 40 }}
          >
            {formattedName.charAt(0)}
          </Avatar>
          <Typography variant="body2">{formattedName}</Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
