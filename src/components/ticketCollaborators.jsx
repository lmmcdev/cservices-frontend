import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Stack,
  IconButton,
  Tooltip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { getUserPhotoByEmail } from '../utils/graphHelper'; // asegúrate del nombre correcto del archivo
import { icons } from '../components/icons';

const statusColors = {
  New: { bg: '#FFE2EA', text: '#FF6692' },
  Emergency: { bg: '#FFF5DA', text: '#FFB900' },
  'In Progress': { bg: '#DFF3FF', text: '#00A1FF' },
  Pending: { bg: '#EAE8FA', text: '#8965E5' },
  Done: { bg: '#DAF8F4', text: '#00B8A3' },
  Duplicated: { bg: '#FFE3C4', text: '#FF8A00' },
};

export default function TicketCollaborators({
  collaborators = [],
  onAddCollaborator,
  onRemoveCollaborator,
  status
}) {
  const [photoUrls, setPhotoUrls] = useState({});

  useEffect(() => {
    const fetchPhotos = async () => {
      const results = {};
      await Promise.all(
        collaborators.map(async (email) => {
          try {
            const url = await getUserPhotoByEmail(email);
            if (url) results[email] = url;
          } catch (err) {
            console.warn(`No se pudo cargar la foto de ${email}:`, err.message);
          }
        })
      );
      setPhotoUrls(results);
    };

    if (collaborators.length > 0) fetchPhotos();
  }, [collaborators]);

  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent sx={{ p: '20px 25px 25px 30px' }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box display="flex" alignItems="center">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{
                width: 8,
                height: 24,
                borderRadius: 10,
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

        {collaborators.length === 0 ? (
          <Typography variant="body2">No collaborators.</Typography>
        ) : (
          <Stack spacing={1}>
            {collaborators.map((email, index) => {
              const name = email.replace(/@.*$/, '').replace('.', ' ');
              const formattedName = name
                .split(' ')
                .map(part => part.charAt(0).toUpperCase() + part.slice(1))
                .join(' ');

              return (
                <Box
                  key={index}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Box display="flex" alignItems="center" gap={1}>
                    <Avatar
                      src={photoUrls[email]}
                      alt={formattedName}
                      sx={{ width: 40, height: 40 }}
                    >
                      {formattedName.charAt(0)}
                    </Avatar>
                    <Typography variant="body2">{formattedName}</Typography>
                  </Box>
                  {onRemoveCollaborator && (
                    <Tooltip title="Remove collaborator">
                      <IconButton
                        size="small"
                        onClick={() => onRemoveCollaborator(email)}
                      >
                        <DeleteIcon fontSize="small" />
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
