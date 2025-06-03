import {
  Typography,
  Box,
  IconButton,
  Card,
  CardContent,
  Tooltip,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { SortAscending, SortDescending } from 'phosphor-react';
import { useState } from 'react';

const statusColors = {
  New: { bg: '#FFE2EA', text: '#FF6692' },
  Emergency: { bg: '#FFF5DA', text: '#FFB900' },
  'In Progress': { bg: '#DFF3FF', text: '#00A1FF' },
  Pending: { bg: '#EAE8FA', text: '#8965E5' },
  Done: { bg: '#DAF8F4', text: '#00B8A3' },
  Duplicated: { bg: '#FFE3C4', text: '#FF8A00' },
  Total: { bg: 'transparent', text: '#0947D7' },
};

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

export default function TicketNotes({ notes, onAddNote, status }) {
  const [showSystemLogs, setShowSystemLogs] = useState(false);
  const [sortAscending, setSortAscending] = useState(true);

  const filteredNotes = notes
    .filter((note) => showSystemLogs || note.event_type === 'user_note')
    .sort((a, b) => {
      const dateA = new Date(a.datetime);
      const dateB = new Date(b.datetime);
      return sortAscending ? dateA - dateB : dateB - dateA;
    });

  return (
    <Card variant="outlined">
      <CardContent sx={{ p: '20px 25px 25px 30px' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{
              width: 8,
              height: 24,
              borderRadius: 10,
              backgroundColor: statusColors[status]?.text || '#00a1ff'
            }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: statusColors[status]?.text || '#00a1ff' }}>
              Notes
            </Typography>
          </Box>
          <Box>
            <Tooltip title="Toggle system logs">
              <IconButton onClick={() => setShowSystemLogs((prev) => !prev)}>
                <i
                  className={`bi ${showSystemLogs ? 'bi-terminal-dash' : 'bi-terminal-plus'}`}
                  style={{
                    fontSize: 20,
                    color: '#00a1ff',
                  }}
                />
              </IconButton>
            </Tooltip>
            <Tooltip title="Sort by date">
              <IconButton onClick={() => setSortAscending(prev => !prev)}>
                {sortAscending ? (
                  <SortAscending size={22} weight="bold" color="#00a1ff" />
                ) : (
                  <SortDescending size={22} weight="bold" color="#00a1ff" />
                )}
              </IconButton>
            </Tooltip>
            <Tooltip title="Add note">
              <IconButton onClick={onAddNote}>
                <i className="fa fa-sticky-note" style={{ color: '#FFD700', fontSize: '20px' }}></i>
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Box sx={{ maxHeight: 250, overflowY: 'auto', overflowX: 'hidden', pr: 1 }}>
          {filteredNotes.length > 0 ? (
            filteredNotes.map((note, idx) => {
              const name = formatAgentName(note.agent_email);
              const alignRight = note.event_type === 'user_note';

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
                      width: '100%',
                      pt: '20px',
                      pb: '15px',
                      pl: '20px',
                      pr: '20px',
                      bgcolor: alignRight ? statusColors[status]?.bg || '#e0f7fa' : '#f0f0f0',
                      borderRadius: '30px',
                      boxShadow: 1,
                    }}
                  >
                    <Typography
                      sx={{
                        whiteSpace: 'pre-wrap',
                        fontSize: '14px',
                        wordBreak: 'break-word'
                      }}
                    >
                      {note.content}
                    </Typography>
                    <Typography
                      sx={{
                        mb: 0.5,
                        whiteSpace: 'pre-wrap',
                        fontSize: '14px',
                        wordBreak: 'break-word'
                      }}
                    >
                      {note.event}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '12px',
                        fontWeight: 'bold',
                        textAlign: 'right',
                        color: alignRight
                          ? statusColors[status]?.text || '#000'
                          : '#000'
                      }}
                    >
                      {name}
                    </Typography>
                    <Typography
                      display="block"
                      sx={{
                        fontSize: '11px',
                        fontWeight: 'bold',
                        textAlign: 'right',
                        color: alignRight
                          ? statusColors[status]?.text || '#000'
                          : '#000'
                      }}
                    >
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
