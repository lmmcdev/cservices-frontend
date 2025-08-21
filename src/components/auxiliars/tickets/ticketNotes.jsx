import React, { useMemo, useCallback, useState } from 'react';
import {
  Typography,
  Box,
  IconButton,
  Card,
  CardContent,
  Tooltip,
  Chip,
  Stack
} from '@mui/material';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import { SortAscending, SortDescending } from 'phosphor-react';

const statusColors = {
  New: { bg: '#FFE2EA', text: '#FF6692' },
  Emergency: { bg: '#FFF5DA', text: '#FFB900' },
  'In Progress': { bg: '#DFF3FF', text: '#00A1FF' },
  Pending: { bg: '#EAE8FA', text: '#8965E5' },
  Done: { bg: '#DAF8F4', text: '#00B8A3' },
  Duplicated: { bg: '#FFE3C4', text: '#FF8A00' },
  Total: { bg: 'transparent', text: '#0947D7' },
};

function capitalize(str) {
  if (!str || typeof str !== 'string') return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatAgentName(email) {
  if (!email || typeof email !== 'string' || !email.includes('@')) return 'System';
  const [namePart] = email.split('@');
  const parts = namePart.split('.');
  if (parts.length === 1) return capitalize(parts[0]);
  return parts.map(capitalize).join(' ');
}

function TicketNotesBase({ notes = [], onAddNote, status }) {
  const [showSystemLogs, setShowSystemLogs] = useState(false);
  const [sortAscending, setSortAscending] = useState(true);

  const toggleSystemLogs = useCallback(() => setShowSystemLogs(p => !p), []);
  const toggleSort = useCallback(() => setSortAscending(p => !p), []);

  // Filtrado + orden + “preparación” memoizada
  const preparedNotes = useMemo(() => {
    // por defecto mostramos user_note; ocultamos system_log y quality_note
    const filtered = showSystemLogs
      ? notes
      : notes.filter(n => n?.event_type === 'user_note');

    const sorted = [...filtered].sort((a, b) => {
      const aT = new Date(a?.datetime || 0).getTime();
      const bT = new Date(b?.datetime || 0).getTime();
      return sortAscending ? aT - bT : bT - aT;
    });

    return sorted.map(n => ({
      ...n,
      __displayName: formatAgentName(n?.agent_email),
      __displayDate: n?.datetime ? new Date(n.datetime).toLocaleString() : '',
      __isQuality: n?.event_type === 'quality_note',
      __isSystem: n?.event_type === 'system_log',
      __alignRight: n?.event_type === 'user_note', // user notes a la derecha
      __key: n?.id || `${n?.datetime || ''}-${n?.agent_email || ''}`,
    }));
  }, [notes, showSystemLogs, sortAscending]);

  const color = statusColors[status]?.text || '#00a1ff';
  const bubbleBg = statusColors[status]?.bg || '#e0f7fa';

  return (
    <Card variant="outlined">
      <CardContent sx={{ p: '20px 25px 25px 30px' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 8, height: 24, borderRadius: 10, backgroundColor: color }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold', color }}>
              Notes
            </Typography>
          </Box>
          <Box>
            <Tooltip title={showSystemLogs ? 'Hide system logs' : 'Show system logs'}>
              <IconButton onClick={toggleSystemLogs}>
                <i
                  className={`bi ${showSystemLogs ? 'bi-terminal-dash' : 'bi-terminal-plus'}`}
                  style={{ fontSize: 20, color }}
                />
              </IconButton>
            </Tooltip>
            <Tooltip title="Sort by date">
              <IconButton onClick={toggleSort}>
                {sortAscending ? (
                  <SortAscending size={22} weight="bold" color={color} />
                ) : (
                  <SortDescending size={22} weight="bold" color={color} />
                )}
              </IconButton>
            </Tooltip>
            <Tooltip title="Add note">
              <IconButton onClick={onAddNote}>
                <i className="fa fa-sticky-note" style={{ color: '#FFD700', fontSize: 20 }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Box sx={{ maxHeight: 250, overflowY: 'auto', overflowX: 'hidden', pr: 1 }}>
          {preparedNotes.length > 0 ? (
            preparedNotes.map((note, idx) => {
              const alignRight = note.__alignRight;
              const isQuality = note.__isQuality;
              //const isSystem = note.__isSystem;
              const key = note.__key || `note-${idx}`;

              // 🎨 estilos por tipo
              const bgColor = isQuality
                ? 'rgba(124, 58, 237, 0.08)' // lila suave
                : alignRight
                ? bubbleBg
                : '#f5f5f5';

              const textAccent = isQuality ? '#7c3aed' : alignRight ? color : '#000';
              const boxShadow = isQuality ? '0 0 0 1px rgba(124,58,237,0.12), 0 6px 14px rgba(0,0,0,0.06)' : 1;

              return (
                <Box
                  key={key}
                  sx={{
                    display: 'flex',
                    justifyContent: alignRight ? 'flex-end' : 'flex-start',
                    mb: 1.2,
                  }}
                >
                  <Box
                    sx={{
                      width: '100%',
                      pt: '16px',
                      pb: '14px',
                      pl: '18px',
                      pr: '18px',
                      bgcolor: bgColor,
                      borderRadius: '16px',
                      boxShadow,
                      borderLeft: isQuality ? '4px solid #7c3aed' : 'none',
                    }}
                  >
                    {/* Cabecera opcional para notas de Quality */}
                    {isQuality && (
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                        <WorkspacePremiumOutlinedIcon sx={{ fontSize: 18, color: '#7c3aed' }} />
                        <Chip
                          label="QUALITY"
                          size="small"
                          sx={{
                            height: 22,
                            fontWeight: 700,
                            letterSpacing: 0.4,
                            bgcolor: 'rgba(124,58,237,0.12)',
                            color: '#7c3aed',
                          }}
                        />
                      </Stack>
                    )}

                    {/* contenido de la nota */}
                    {note.content && (
                      <Typography sx={{ whiteSpace: 'pre-wrap', fontSize: 14, wordBreak: 'break-word' }}>
                        {note.content}
                      </Typography>
                    )}
                    {note.event && (
                      <Typography sx={{ mb: 0.5, whiteSpace: 'pre-wrap', fontSize: 14, wordBreak: 'break-word' }}>
                        {note.event}
                      </Typography>
                    )}

                    {/* pie (autor/fecha) */}
                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: 'bold',
                        textAlign: 'right',
                        color: textAccent,
                      }}
                    >
                      {note.__displayName}
                    </Typography>
                    <Typography
                      display="block"
                      sx={{
                        fontSize: 11,
                        fontWeight: 'bold',
                        textAlign: 'right',
                        color: textAccent,
                      }}
                    >
                      {note.__displayDate}
                    </Typography>
                  </Box>
                </Box>
              );
            })
          ) : (
            <Typography variant="body2" color="text.secondary">
              No notes to show
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

// Memo con comparación pensada para evitar renders inútiles
function areEqual(prev, next) {
  if (prev.status !== next.status) return false;
  if (prev.onAddNote !== next.onAddNote) return false;

  const a = prev.notes || [];
  const b = next.notes || [];
  if (a.length !== b.length) return false;

  const lastA = a.length ? a[a.length - 1]?.datetime : undefined;
  const lastB = b.length ? b[b.length - 1]?.datetime : undefined;
  if (lastA !== lastB) return false;

  return true;
}

export default React.memo(TicketNotesBase, areEqual);
