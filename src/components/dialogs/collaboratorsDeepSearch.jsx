// src/components/dialogs/collaboratorsDeepSearch.jsx
import React, { useMemo, useState, useCallback } from 'react';
import {
  Box,
  Stack,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  Chip,
  Paper,
  Typography,
  IconButton,
  Tooltip, List
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import CallerIDAutoComplete from '../fields/callerIDAutocomplete';
import { defaultLocationOptions } from '../../utils/js/constants';
import { AgentRow } from '../auxiliars/agents/agentsRows';

const BRAND = '#00a1ff';
const BORDER_IDLE = '#e0e7ef';

function normalize(str = '') {
  return String(str)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ''); // elimina todos los espacios
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
  const [photoUrls,] = useState({});

  const [callerId, setCallerId] = useState('');

  const { deptOptions, posOptions } = useMemo(() => {
    const depts   = uniqueSorted(agents.map(a => a?.department));
    const poss    = uniqueSorted(agents.map(a => a?.position));
    return { deptOptions: depts, posOptions: poss,  };
  }, [agents]);

  const filtered = useMemo(() => {
    const nq = normalize(q);
    const nd = normalize(dept);
    const np = normalize(pos);
    const nc = normalize(center);
    const nCaller = normalize(callerId);

    return (agents || []).filter(a => {
      const name        = normalize(a?.name);
      const email       = normalize(a?.email);
      const department  = normalize(a?.department);
      const position    = normalize(a?.position);
      const centerName  = normalize(a?.center ?? a?.clinic);
      const callerField = normalize(a?.group_sys_name?.group ?? a?.caller_id ?? '');

      // texto libre en cualquier campo
      const matchesText =
        //!nq ||
        name.includes(nq) ||
        email.includes(nq) ||
        department.includes(nq) ||
        position.includes(nq) ||
        centerName.includes(nq) ||
        callerField.includes(nq);

      const matchesDept   = !nd      || department === nd;
      const matchesPos    = !np      || position === np;
      const matchesCenter = !nc      || centerName === nc;
      const matchesCaller = !nCaller || callerField.includes(nCaller);

      return matchesText && matchesDept && matchesPos && matchesCenter && matchesCaller;
    });
  }, [agents, q, dept, pos, center, callerId]);

  const clearFilters = () => {
    setQ('');
    setDept('');
    setPos('');
    setCenter('');
    setCallerId('');
  };

  const handleCallerIdChange = (value) => {
    const caller = String(value).trim()
    .replace(/\s+/g, '')
    setCallerId(caller || '');
  };


  const handleToggle = useCallback((email) => {
    const set = new Set(selectedEmails);
    if (set.has(email)) set.delete(email);
    else set.add(email);
    onChangeSelected(Array.from(set));
  }, [selectedEmails, onChangeSelected]);

  const selectedSet = useMemo(() => new Set(selectedEmails), [selectedEmails]);

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

            <Box sx={{ display: 'inline-flex' }}>
                <CallerIDAutoComplete
                    onChange={handleCallerIdChange}
                                options={defaultLocationOptions}
                                label="Caller ID"
                              />
                            </Box>
            

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
                {filtered.map(a => (
                  <AgentRow
                    key={a.email}
                    agent={a}
                    isSelected={selectedEmails.includes(a.email)}
                    onToggle={handleToggle}
                    photoUrls={photoUrls}
                  />
                ))}
              </List>

          
        )}
      </Paper>
    </Box>
  );
}
