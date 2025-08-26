import React, { useRef, useCallback, useEffect } from 'react';
import { Box, Card, Typography, Chip, Stack } from '@mui/material';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import CakeIcon from '@mui/icons-material/Cake';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ScheduleIcon from '@mui/icons-material/Schedule';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import EmptyState from '../../auxiliars/emptyState';

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
  t?.linked_patient_snapshot?.Name ??
  t?.patient_name ??
  t?.caller_name ??
  t?.caller_Name ??
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
const SearchTicketResults = ({
  results,
  inputValue,
  hasMore,
  loadMore,
  selectedTicket,
  loading = false,
}) => {
  const ioRef = useRef(null);
  const scrollRootRef = useRef(null);

  const lastElementRef = useCallback(
    (node) => {
      if (ioRef.current) ioRef.current.disconnect();

      ioRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore && !loading) {
            loadMore();
          }
        },
        {
          root: scrollRootRef.current,     // 👈 observa el scroll interno
          rootMargin: '0px 0px 200px 0px', // prefetch antes del final
          threshold: 0,
        }
      );

      if (node) ioRef.current.observe(node);
    },
    [hasMore, loading, loadMore]
  );

  useEffect(() => () => ioRef.current?.disconnect(), []);

  if (!results || results.length === 0) return <EmptyState />;

  return (
    <Box
      ref={scrollRootRef}
      sx={{
        // ocupa todo el alto disponible del body del drawer
        height: '100%',
        overflowY: 'auto',
        mt: { xs: 1, sm: 2 },
        px: { xs: 1.5, sm: 2, md: 3 },
        pt: { xs: 1, sm: 1.5 },
        pb: { xs: 0.5, sm: 1 },
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
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'flex-start', sm: 'center' },
              px: { xs: 1.5, sm: 2 },
              py: { xs: 1.25, sm: 2 },
              mb: { xs: 1.25, sm: 2 },
              cursor: 'pointer',
              borderRadius: { xs: 2, sm: 3 },
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
            onClick={() => selectedTicket(ticket)}
          >
            {/* marcador redondo con status */}
            <Box
              sx={{
                mr: { xs: 0, sm: 2 },
                mb: { xs: 1, sm: 0 },
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  width: { xs: 28, sm: 36 },
                  height: { xs: 28, sm: 36 },
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
                    width: { xs: 6, sm: 8 },
                    height: { xs: 6, sm: 8 },
                    borderRadius: '50%',
                    backgroundColor: sc.fg,
                  }}
                />
              </Box>
            </Box>

            {/* contenido */}
            <Box sx={{ flex: 1, width: '100%' }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: { xs: 0.5, sm: 1 },
                }}
              >
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  color="#333"
                  sx={{
                    ...lineClamp,
                    pr: 1,
                    fontSize: { xs: 15, sm: 16 },
                    lineHeight: { xs: 1.25, sm: 1.3 },
                    maxWidth: { xs: '100%', sm: 'auto' },
                  }}
                >
                  {getTicketName(ticket)}
                </Typography>

                <Chip
                  label={status}
                  size="small"
                  sx={{
                    height: { xs: 20, sm: 18 },
                    fontSize: { xs: '0.7rem', sm: '0.65rem' },
                    fontWeight: 500,
                    px: '6px',
                    bgcolor: sc.bg,
                    color: sc.fg,
                    borderRadius: '999px',
                    border: `1px solid ${sc.border}`,
                  }}
                />
              </Box>

              {/* Resumen SIN ellipsis: wrap a múltiples líneas */}
              <Typography
                variant="body2"
                sx={{
                  color: '#6c757d',
                  fontWeight: 500,
                  fontSize: { xs: '0.85rem', sm: '0.78rem', md: '0.75rem' },
                  letterSpacing: 0.3,
                  lineHeight: { xs: 1.35, sm: 1.3 },
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                  overflowWrap: 'anywhere',
                  mt: { xs: 0.25, sm: 0.25 },
                }}
                title={ticket.call_reason || ticket.summary || '—'}
              >
                {ticket.call_reason || ticket.summary || '—'}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: '#5B5F7B',
                  fontWeight: 400,
                  fontSize: { xs: '0.78rem', sm: '0.7rem' },
                  fontStyle: 'italic',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.75,
                  ...lineClamp,
                }}
              >
                <FmdGoodIcon sx={{ fontSize: { xs: 16, sm: 14 }, verticalAlign: 'middle' }} />
                {getTicketLocation(ticket)}
              </Typography>

              <Box sx={{ mt: { xs: 0.75, sm: 1 } }}>
                <Stack
                  direction="row"
                  spacing={{ xs: 1.25, sm: 2 }}
                  useFlexGap
                  flexWrap="wrap"
                  sx={{ rowGap: { xs: 0.75, sm: 0.5 } }}
                >
                  {dob && (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.75,
                        flexBasis: { xs: '48%', sm: 'auto' },
                        minWidth: { xs: '48%', sm: 160 },
                      }}
                    >
                      <CakeIcon sx={{ fontSize: { xs: 18, sm: 18 }, color: 'text.secondary' }} />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ ...lineClamp, fontSize: { xs: '0.82rem', sm: '0.8rem' } }}
                      >
                        {dob}
                      </Typography>
                    </Box>
                  )}

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.75,
                      flexBasis: { xs: '48%', sm: 'auto' },
                      minWidth: { xs: '48%', sm: 160 },
                    }}
                  >
                    <PhoneIphoneIcon sx={{ fontSize: { xs: 18, sm: 18 }, color: 'text.secondary' }} />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ ...lineClamp, fontSize: { xs: '0.82rem', sm: '0.8rem' } }}
                    >
                      {getTicketPhone(ticket)}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.75,
                      flexBasis: { xs: '48%', sm: 'auto' },
                      minWidth: { xs: '48%', sm: 180 },
                    }}
                  >
                    <PersonOutlineIcon sx={{ fontSize: { xs: 18, sm: 18 }, color: 'text.secondary' }} />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ ...lineClamp, fontSize: { xs: '0.82rem', sm: '0.8rem' } }}
                    >
                      {getAgent(ticket)}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.75,
                      flexBasis: { xs: '48%', sm: 'auto' },
                      minWidth: { xs: '48%', sm: 210 },
                    }}
                  >
                    <ScheduleIcon sx={{ fontSize: { xs: 18, sm: 18 }, color: 'text.secondary' }} />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ ...lineClamp, fontSize: { xs: '0.82rem', sm: '0.8rem' } }}
                    >
                      {getCreatedAt(ticket)}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Box>
          </Card>
        );
      })}
    </Box>
  );
};

export default SearchTicketResults;
