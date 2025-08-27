// src/components/dialogs/collaboratorsDeepSearch.jsx
import React, { useMemo, useState, useEffect } from 'react';
import {
  Box,
  Stack,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Checkbox,
  Paper,
  Typography,
  IconButton,
  Tooltip,
  Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { getUserPhotoByEmail } from '../../utils/graphHelper'; // 👈 trae fotos por email

const BRAND = '#00a1ff';
const BORDER_IDLE = '#e0e7ef';

function normalize(str = '') {
  return String(str).toLowerCase().trim();
}

function uniqueSorted(list) {
  return Array.from(new Set(list.filter(Boolean))).sort((a, b) =>
    String(a).localeCompare(String(b))
  );
}

export default function CollaboratorsDeepSearch({
  agents = [],
  selectedEmails = [],
  onChangeSelected = () => {},
  placeholder = 'Search by name, email…',
}) {
  const [q, setQ] = useState('');
  const [dept, setDept] = useState('');
  const [pos, setPos] = useState('');
  const [center, setCenter] = useState(''); // 👈 antes "clinic"

  // cache local de fotos: { [email]: url }
  const [photoUrls, setPhotoUrls] = useState({});

  const { deptOptions, posOptions, centerOptions } = useMemo(() => {
    const depts = uniqueSorted(agents.map(a => a?.department));
    const poss  = uniqueSorted(agents.map(a => a?.position));
    const centers = uniqueSorted(agents.map(a => a?.center ?? a?.clinic)); // 👈 compat
    return { deptOptions: depts, posOptions: poss, centerOptions: centers };
  }, [agents]);

  const filtered = useMemo(() => {
    const nq = normalize(q);
    return (agents || []).filter(a => {
      const name = normalize(a?.name);
      const email = normalize(a?.email);
      const department = normalize(a?.department);
      const position = normalize(a?.position);
      const centerName = normalize(a?.center ?? a?.clinic); // 👈 compat

      const matchesText =
        !nq ||
        name.includes(nq) ||
        email.includes(nq) ||
        department.includes(nq) ||
        position.includes(nq) ||
        centerName.includes(nq);

      const matchesDept   = !dept   || department === normalize(dept);
      const matchesPos    = !pos    || position === normalize(pos);
      const matchesCenter = !center || centerName === normalize(center);

      return matchesText && matchesDept && matchesPos && matchesCenter;
    });
  }, [agents, q, dept, pos, center]);

  // 🔎 fetch de fotos para los visibles (con límite) usando Graph
  useEffect(() => {
    let cancelled = false;

    const fetchPhotos = async () => {
      // emails visibles + aún sin cache
      const visibleEmails = filtered
        .map(a => String(a?.email || '').trim().toLowerCase())
        .filter(Boolean);

      // si algún agente ya trae photoUrl, lo preferimos y lo cacheamos
      const withInline = filtered
        .filter(a => a?.photoUrl && a?.email)
        .map(a => [String(a.email).toLowerCase(), a.photoUrl]);

      if (withInline.length) {
        setPhotoUrls(prev => {
          const next = { ...prev };
          for (const [email, url] of withInline) {
            if (!next[email]) next[email] = url;
          }
          return next;
        });
      }

      const toFetch = visibleEmails.filter(e => !photoUrls[e]);
      if (toFetch.length === 0) return;

      // limita el batch para evitar flood (ajusta si quieres)
      const batch = toFetch.slice(0, 50);

      const results = await Promise.all(
        batch.map(async (email) => {
          try {
            const url = await getUserPhotoByEmail(email);
            return [email, url || ''];
          } catch {
            return [email, ''];
          }
        })
      );

      if (cancelled) return;

      const hasAny = results.some(([, url]) => !!url);
      if (!hasAny) return;

      setPhotoUrls(prev => {
        const next = { ...prev };
        for (const [email, url] of results) {
          if (url) next[email] = url;
        }
        return next;
      });
    };

    fetchPhotos();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered]); // depender de filtered; el cache vive en photoUrls

  const handleToggle = (email) => {
    const set = new Set(selectedEmails);
    if (set.has(email)) set.delete(email);
    else set.add(email);
    onChangeSelected(Array.from(set));
  };

  const clearFilters = () => {
    setQ(''); setDept(''); setPos(''); setCenter('');
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header de filtros: sticky */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: 2,
          border: '1px solid #e6eef5',
          bgcolor: '#fff',
          mb: 2,
          position: 'sticky',
          top: 8, // bajo el header del modal
          zIndex: 1,
        }}
      >
        <Stack spacing={1.5}>
          {/* Fila de Selects */}
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} alignItems="center">
            <Select
              size="small"
              displayEmpty
              value={dept}
              onChange={(e) => setDept(e.target.value)}
              renderValue={(v) =>
                v ? v : <span style={{ color: '#999' }}>Department</span>
              }
              sx={{
                minWidth: 180,
                borderRadius: 2,
                flexShrink: 0,
                '& .MuiOutlinedInput-notchedOutline': { borderColor: BORDER_IDLE },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: BRAND },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: BRAND, borderWidth: 2,
                },
              }}
            >
              <MenuItem value="">All</MenuItem>
              {deptOptions.map((d) => (
                <MenuItem key={d} value={d}>{d}</MenuItem>
              ))}
            </Select>

            <Select
              size="small"
              displayEmpty
              value={pos}
              onChange={(e) => setPos(e.target.value)}
              renderValue={(v) =>
                v ? v : <span style={{ color: '#999' }}>Position</span>
              }
              sx={{
                minWidth: 180,
                borderRadius: 2,
                flexShrink: 0,
                '& .MuiOutlinedInput-notchedOutline': { borderColor: BORDER_IDLE },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: BRAND },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: BRAND, borderWidth: 2,
                },
              }}
            >
              <MenuItem value="">All</MenuItem>
              {posOptions.map((p) => (
                <MenuItem key={p} value={p}>{p}</MenuItem>
              ))}
            </Select>

            <Select
              size="small"
              displayEmpty
              value={center}
              onChange={(e) => setCenter(e.target.value)}
              renderValue={(v) =>
                v ? v : <span style={{ color: '#999' }}>Center</span>
              }
              sx={{
                minWidth: 200,
                borderRadius: 2,
                flexGrow: 1,
                '& .MuiOutlinedInput-notchedOutline': { borderColor: BORDER_IDLE },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: BRAND },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: BRAND, borderWidth: 2,
                },
              }}
            >
              <MenuItem value="">All</MenuItem>
              {centerOptions.map((c) => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </Select>

            <Tooltip title="Clear filters">
              <IconButton onClick={clearFilters} sx={{ ml: { md: 'auto' } }}>
                <ClearIcon />
              </IconButton>
            </Tooltip>
          </Stack>

          {/* Búsqueda live */}
          <TextField
            size="small"
            fullWidth
            value={q}
            onChange={(e) => setQ(e.target.value)}
            label="Search"
            placeholder={placeholder}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: BRAND }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiInputLabel-root.Mui-focused': { color: BRAND },
              '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': { borderColor: BORDER_IDLE },
              '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': { borderColor: BRAND },
              '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: BRAND, borderWidth: 2,
              },
            }}
          />

          {/* Chips de filtros activos */}
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
            {q ? <Chip size="small" label={`Search: ${q}`} onDelete={() => setQ('')} /> : null}
            {dept ? <Chip size="small" label={`Dept: ${dept}`} onDelete={() => setDept('')} /> : null}
            {pos ? <Chip size="small" label={`Position: ${pos}`} onDelete={() => setPos('')} /> : null}
            {center ? <Chip size="small" label={`Center: ${center}`} onDelete={() => setCenter('')} /> : null}
          </Stack>
        </Stack>
      </Paper>

      {/* Resultados */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          border: '1px solid #e6eef5',
          maxHeight: 420,
          overflow: 'auto',
          bgcolor: '#fff',
        }}
      >
        <Box sx={{ p: 1.5, borderBottom: '1px solid #eef5fb', position: 'sticky', top: 0, bgcolor: '#fff', zIndex: 1 }}>
          <Typography variant="body2" sx={{ color: '#5b5f7b' }}>
            {filtered.length} result{filtered.length === 1 ? '' : 's'}
          </Typography>
        </Box>

        {filtered.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center', color: '#798' }}>
            <Typography variant="body2">No matches. Try another filter.</Typography>
          </Box>
        ) : (
          <List disablePadding>
            {filtered.map((a, idx) => {
              const email = String(a?.email || '').trim();
              const isSelected = selectedEmails.includes(email);
              const displayName = a?.name || 'Unknown';
              const initial = (displayName?.[0] || a?.email?.[0] || '?').toUpperCase();
              const normalizedEmail = email.toLowerCase();
              const photoSrc = photoUrls[normalizedEmail] || a?.photoUrl || undefined;
              const displayCenter = a?.center ?? a?.clinic; // 👈 compat

              return (
                <React.Fragment key={email || idx}>
                  <ListItem
                    secondaryAction={
                      <Checkbox
                        edge="end"
                        checked={isSelected}
                        onChange={() => handleToggle(email)}
                        sx={{
                          color: '#b8c0cc', // borde/ícono cuando NO está marcado
                          '&.Mui-checked': { color: BRAND }, // fill del checkbox cuando SÍ está marcado
                          '& .MuiSvgIcon-root': { fontSize: 22 },
                        }}
                      />
                    }
                    sx={{
                      px: 2,
                      py: 1,
                      '&:hover': { bgcolor: 'rgba(0,161,255,0.06)' },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        src={photoSrc}
                        alt={displayName}
                        sx={{ bgcolor: BRAND, color: '#fff' }}
                      >
                        {initial}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography sx={{ fontWeight: 600 }}>
                            {displayName}
                          </Typography>
                          {a?.position ? <Chip size="small" label={a.position} /> : null}
                        </Stack>
                      }
                      secondary={
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.25, flexWrap: 'wrap', gap: 0.5 }}>
                          <Typography variant="body2" sx={{ color: '#6c757d' }}>
                            {email}
                          </Typography>
                          {a?.department ? (
                            <Chip size="small" variant="outlined" label={a.department} />
                          ) : null}
                          {displayCenter ? (
                            <Chip size="small" variant="outlined" label={displayCenter} />
                          ) : null}
                        </Stack>
                      }
                    />
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              );
            })}
          </List>
        )}
      </Paper>
    </Box>
  );
}
