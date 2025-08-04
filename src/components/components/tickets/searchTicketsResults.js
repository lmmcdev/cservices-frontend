// SearchTicketResults.jsx
import React, { useRef, useCallback } from 'react';
import {
  Box,
  Card,
  Typography,
  CircularProgress,
  Chip,
  Stack,
} from '@mui/material';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import CakeIcon from '@mui/icons-material/Cake';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ScheduleIcon from '@mui/icons-material/Schedule';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

// -------------------- Helpers --------------------
const lineClamp = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

const normalizeDob = (val) => {
  if (!val) return null;
  const s = String(val).trim();
  const invalids = new Set([
    '1901-01-01', '01-01-1901', '01/01/1901',
    '1900-01-01', '01-01-1900', '01/01/1900',
    'N/A', 'NA', 'null', 'undefined', ''
  ]);
  if (invalids.has(s)) return null;

  let d = dayjs(s);
  if (d.isValid()) return d.format('MMM D, YYYY');

  const FORMATS = [
    'MM/DD/YYYY','M/D/YYYY',
    'MM-DD-YYYY','M-D-YYYY',
    'DD/MM/YYYY','D/M/YYYY',
    'DD-MM-YYYY','D-M-YYYY',
    'YYYY-MM-DD','YYYY/MM/DD',
    'MMM D, YYYY','D MMM YYYY',
    'MM/DD/YY','M/D/YY',
    'YYYYMMDD'
  ];
  for (const f of FORMATS) {
    d = dayjs(s, f, true);
    if (d.isValid()) return d.format('MMM D, YYYY');
  }
  return s;
};

const getTicketDob = (t) =>
  normalizeDob(
    t?.displayDob ??
    t?.patient_dob ??
    t?.patientDOB ??
    t?.DOB ??
    t?.dob ??
    t?.patient_date_of_birth ??
    t?.date_of_birth ??
    t?.linked_patient_snapshot?.DOB ??
    t?.linked_patient_snapshot?.Dob ??
    t?.linked_patient_snapshot?.dob ??
    t?.linked_patient_snapshot?.date_of_birth
  );

const getTicketName = (t) =>
  t?.patient_name ??
  t?.linked_patient_snapshot?.Name ??
  t?.caller_name ?? t?.caller_Name ??
  'No name';

const getTicketPhone = (t) =>
  t?.callback_number ??
  t?.phone ??
  t?.caller_phone ??
  t?.linked_patient_snapshot?.Phone ??
  t?.linked_patient_snapshot?.Phone_Number ??
  'N/A';

const getTicketLocation = (t) =>
  t?.assigned_department || t?.location || 'No location';

const getAgent = (t) => t?.agent_assigned || 'N/A';

const getCreatedAt = (t) =>
  t?.creation_date ? dayjs(t.creation_date).format('MMM D, YYYY h:mm A') : 'N/A';

const statusColors = {
  New:          { fg: '#FF6692', bg: '#FFE2EA', border: '#FF6692' },
  Emergency:    { fg: '#FFB900', bg: '#FFF5DA', border: '#FFB900' },
  'In Progress':{ fg: '#00A1FF', bg: '#DFF3FF', border: '#00A1FF' },
  Pending:      { fg: '#8965E5', bg: '#EAE8FA', border: '#8965E5' },
  Done:         { fg: '#00B8A3', bg: '#DAF8F4', border: '#00B8A3' },
  Duplicated:   { fg: '#FF8A00', bg: '#FFE3C4', border: '#FF8A00' },
};
const getStatusStyle = (status) => statusColors[status] || statusColors.New;

// -------------------- Component --------------------
const SearchTicketResults = ({ results, loading, inputValue, hasMore, loadMore }) => {
  const observerRef = useRef(null);

  const lastElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [loading, hasMore, loadMore]
  );

  return (
    <Box
      sx={{
        mt: 2,
        maxHeight: '55vh',
        overflowY: 'auto',
        // >>> Alineación con Keyword + Search:
        px: 3,                 // mismo padding horizontal que el header
        // >>> Evita que el primer card se “corte” al hacer hover
        pt: 1.5,
        pb: 1,
        scrollPaddingTop: '12px',
        '& > .MuiCard-root:first-of-type': { mt: 0.5 },
      }}
    >
      {results.map((ticket, index) => {
        const isLast = index === results.length - 1;
        const status = ticket?.status || 'New';
        const sc = getStatusStyle(status);
        const dob = getTicketDob(ticket);

        return (
          <Card
            key={ticket.id || index}
            ref={isLast ? lastElementRef : null}
            role="button"
            tabIndex={0}
            sx={{
              display: 'flex',
              px: 2,
              py: 2,
              mb: 2,
              alignItems: 'center',
              cursor: 'pointer',
              borderRadius: '20px',
              border: '1px solid #e0e0e0',
              backgroundColor: '#f9fbfd',
              boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.05)',
              transition: 'all 0.25s ease',
              '&:hover': {
                backgroundColor: '#eaf6ff',
                boxShadow: '0 6px 16px rgba(0, 0, 0, 0.12)',
                transform: 'translateY(-1px)',
                borderColor: '#00a1ff',
              },
              '&:focus-visible': {
                outline: '2px solid #00a1ff',
                outlineOffset: '2px',
              },
            }}
          >
            {/* marcador redondo con status */}
            <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  border: `2px solid ${sc.border}`,
                  backgroundColor: sc.bg,
                  boxShadow: 'inset 0 0 0 6px white',
                  position: 'relative',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: sc.fg,
                  }}
                />
              </Box>
            </Box>

            {/* contenido */}
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="subtitle1" fontWeight="bold" color="#333" sx={{ ...lineClamp, pr: 1 }}>
                  {getTicketName(ticket)}
                </Typography>

                <Chip
                  label={status}
                  size="small"
                  sx={{
                    height: 18,
                    fontSize: '0.65rem',
                    fontWeight: 500,
                    px: '4px',
                    bgcolor: sc.bg,
                    color: sc.fg,
                    borderRadius: '999px',
                    border: `1px solid ${sc.border}`,
                  }}
                />
              </Box>

              <Typography
                variant="body2"
                sx={{ color: '#6c757d', fontWeight: 500, fontSize: '0.75rem', letterSpacing: 0.3, ...lineClamp }}
              >
                {ticket.call_reason || ticket.summary || '—'}
              </Typography>

              <Typography
                variant="body2"
                sx={{ color: '#5B5F7B', fontWeight: 400, fontSize: '0.7rem', fontStyle: 'italic', ...lineClamp }}
              >
                <FmdGoodIcon style={{ fontSize: 14, marginRight: 6, verticalAlign: '-2px' }} />
                {getTicketLocation(ticket)}
              </Typography>

              <Box sx={{ mt: 1 }}>
                <Stack direction="row" spacing={2} useFlexGap flexWrap="wrap" sx={{ rowGap: 0.5 }}>
                  {dob && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, minWidth: 160 }}>
                      <CakeIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary" sx={lineClamp}>
                        {dob}
                      </Typography>
                    </Box>
                  )}

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, minWidth: 160 }}>
                    <PhoneIphoneIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary" sx={lineClamp}>
                      {getTicketPhone(ticket)}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, minWidth: 180 }}>
                    <PersonOutlineIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary" sx={lineClamp}>
                      {getAgent(ticket)}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, minWidth: 210 }}>
                    <ScheduleIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary" sx={lineClamp}>
                      {getCreatedAt(ticket)}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Box>
          </Card>
        );
      })}

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}

      {!loading && results.length === 0 && (inputValue?.length ?? 0) >= 2 && (
        <Typography sx={{ textAlign: 'center', mt: 2 }}>No results found.</Typography>
      )}
    </Box>
  );
};

export default SearchTicketResults;
