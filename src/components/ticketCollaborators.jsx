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
import GroupIcon from '@mui/icons-material/Group';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { getUserPhotoByEmail } from '../utils/graphHelper'; // asegúrate del nombre correcto del archivo

export default function TicketCollaborators({
  collaborators = [],
  onAddCollaborator,
  onRemoveCollaborator
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
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box display="flex" alignItems="center">
            <GroupIcon sx={{ mr: 1 }} />
            <Typography variant="h6">Collaborators</Typography>
          </Box>
          {onAddCollaborator && (
            <Tooltip title="Add collaborator">
              <IconButton size="small" onClick={onAddCollaborator}>
                <PersonAddIcon fontSize="small" />
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
                      sx={{ width: 24, height: 24 }}
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
