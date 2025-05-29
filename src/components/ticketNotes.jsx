import {
  Typography,
  Box,
  IconButton,
  Card,
  CardContent,
  Tooltip,
} from '@mui/material';
import { Add, Settings } from '@mui/icons-material';
import { useState } from 'react';

function formatAgentName(email) {
  if (!email || typeof email !== 'string' || !email.includes('@')) return 'Unknown';

  const [namePart] = email.split('@');
  const parts = namePart.split('.');

  if (parts.length === 1) return capitalize(parts[0]);

  return parts.map(capitalize).join(' ');
}

function capitalize(str) {
  if (!str || typeof str !== 'string') return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function TicketNotes({ notes, onAddNote }) {
  const [showSystemLogs, setShowSystemLogs] = useState(false);

  const filteredNotes = notes.filter(
    (note) => showSystemLogs || note.event_type === 'user_log'
  );

  return (
    <Card variant="outlined">
      <CardContent sx={{ p: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h6">Notes</Typography>
          <Box>
            <Tooltip title="Toggle system logs">
              <IconButton onClick={() => setShowSystemLogs((prev) => !prev)}>
                <Settings color={showSystemLogs ? 'primary' : 'inherit'} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Add note">
              <IconButton onClick={onAddNote}>
                <Add />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Box sx={{ maxHeight: 250, overflowY: 'auto', pr: 1 }}>
          {filteredNotes.length > 0 ? (
            filteredNotes.map((note, idx) => {
              const name = formatAgentName(note.agent_email);
              const alignRight = note.event_type === 'user_log';

              return (
                <Box
                  key={idx}
                  sx={{
                    display: 'flex',
                    justifyContent: alignRight ? 'flex-end' : 'flex-start',
                    mb: 1,
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: '80%',
                      p: 1.5,
                      bgcolor: alignRight ? '#e0f7fa' : '#f0f0f0',
                      borderRadius: 2,
                      boxShadow: 1,
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      {name}
                    </Typography>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                      {note.event}
                    </Typography>
                    <Typography variant="caption" display="block" color="text.secondary">
                      {new Date(note.datetime).toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              );
            })
          ) : (
            <Typography variant="body2" color="textSecondary">
              No notes to show
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
