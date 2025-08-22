// src/pages/reportsScreen.js
import React, { useMemo, useState } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, Divider,
  TextField, IconButton, Button, Menu, MenuItem, List,
  InputAdornment, Chip, Stack, Tooltip, Select, FormControl,
  InputLabel, OutlinedInput, Checkbox, ListItemIcon, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, ListItemText
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditIcon from '@mui/icons-material/Edit';
import { Iconify } from '../components/auxiliars/icons';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const PRIORITY = ['low', 'medium', 'high'];
const RISK = ['none', 'medical', 'legal', 'disenrollment'];
const CATEGORY = [
  'transportation','appointment','new patient','pharmacy','disenrollment',
  'customer service','new address','hospitalization','adult day care',
  'referral or specialist','medical records','others'
];

/** ---------- TEMPLATE ROW (click = usar; estado seleccionado) ---------- */
function TemplateRow({ tpl, isActive, onSelect, onEditName, onDuplicate, onDetails }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleOpen = (e) => {
    e.stopPropagation(); // que el click del menú no dispare onSelect
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => setAnchorEl(null);

  return (
    <Box
      onClick={() => onSelect(tpl)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelect(tpl); }}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        p: 1.25,
        borderRadius: 1.5,
        border: `1px solid ${isActive ? 'rgba(0,161,255,.35)' : '#eef2f7'}`,
        backgroundColor: isActive ? '#DFF3FF' : '#fff',
        transition: 'box-shadow .18s ease, border-color .18s ease, background-color .18s ease',
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: isActive ? '#DFF3FF' : '#fafcff',
          borderColor: 'rgba(0,161,255,.35)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
        },
        '&:focus-visible': {
          outline: '2px solid rgba(0,161,255,0.45)',
          outlineOffset: 2
        }
      }}
    >
      {/* Texto (truncado) */}
      <Box sx={{ flex: '1 1 auto', minWidth: 0 }}>
        <Typography
          variant="body1"
          fontWeight={700}
          noWrap
          sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
          title={tpl.name}
        >
          {tpl.name}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          noWrap
          sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
          title={tpl.description || tpl.visibility}
        >
          {tpl.description || tpl.visibility}
        </Typography>
      </Box>

      {/* Menú acciones (sin "Use") */}
      <IconButton edge="end" onClick={handleOpen} size="small">
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={() => {
          handleClose();
          const nn = prompt('Template name', tpl.name);
          if (nn) onEditName(tpl.id, nn);
        }}>
          <EditIcon fontSize="small" style={{ marginRight: 8 }} />
          Edit name
        </MenuItem>
        <MenuItem onClick={() => { handleClose(); onDuplicate(tpl); }}>
          <ContentCopyIcon fontSize="small" style={{ marginRight: 8 }} />
          Duplicate
        </MenuItem>
        <MenuItem onClick={() => { handleClose(); onDetails?.(tpl); }}>
          <InfoOutlinedIcon fontSize="small" style={{ marginRight: 8 }} />
          Details
        </MenuItem>
      </Menu>
    </Box>
  );
}
/** --------------------------------------------------------------------- */

export default function ReportsScreen() {
  // Templates
  const [tab, setTab] = useState(0); // 0=My,1=Dept,2=Global
  const [templateQuery, setTemplateQuery] = useState('');
  const [activeTemplateId, setActiveTemplateId] = useState(null); // <- seleccionado

  const [templates, setTemplates] = useState({
    my: [
      {
        id: 't1',
        name: 'Emergencies – Last 7d',
        description: 'High priority + last 7 days',
        visibility: 'user',
        filters: { dateFrom: '', dateTo: '', priority: ['high'], risk: [], category: [], qc: false }
      }
    ],
    dept: [],
    global: []
  });

  // Filters state (solo UI por ahora)
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    agent: '',
    center: '',
    department: '',
    caller: '',
    outcome: '',
    priority: [],
    risk: [],
    category: [],
    qc: ''
  });

  // Export menu
  const [anchorEl, setAnchorEl] = useState(null);

  // Preview table (placeholder / mock)
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRpp] = useState(10);

  const activeTemplates = useMemo(() => {
    const pool = tab === 0 ? templates.my : tab === 1 ? templates.dept : templates.global;
    const q = templateQuery.trim().toLowerCase();
    if (!q) return pool;
    return pool.filter(t =>
      t.name.toLowerCase().includes(q) ||
      (t.description || '').toLowerCase().includes(q)
    );
  }, [tab, templates, templateQuery]);

  const previewRows = useMemo(() => {
    const base = Array.from({ length: 57 }).map((_, i) => ({
      id: `CL-${1000 + i}`,
      date: `2025-08-${String((i % 28) + 1).padStart(2, '0')} 10:${String(i % 60).padStart(2, '0')}`,
      agent: ['Alex','Sam','Pat','Jordan'][i % 4],
      center: ['Hialeah','Kendall','Flagler'][i % 3],
      department: ['Front Desk','CS','Pharmacy'][i % 3],
      caller: `+1 (305) 555-0${String(100 + i)}`,
      outcome: ['resolved','callback','escalated'][i % 3],
      priority: PRIORITY[i % PRIORITY.length],
      risk: RISK[i % RISK.length],
      category: CATEGORY[i % CATEGORY.length],
      qc: i % 2 === 0
    }));
    return base;
  }, []);

  const pagedRows = useMemo(() => {
    const start = page * rowsPerPage;
    return previewRows.slice(start, start + rowsPerPage);
  }, [page, rowsPerPage, previewRows]);

  // Handlers UI
  const updateFilter = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));
  const currentPoolKey = tab === 0 ? 'my' : tab === 1 ? 'dept' : 'global';

  // Seleccionar/aplicar template
  const applyTemplate = (tpl) =>
    setFilters(prev => ({ ...prev, ...tpl.filters }));

  const handleSelectTemplate = (tpl) => {
    setActiveTemplateId(tpl.id);  // queda “fijo” visualmente
    applyTemplate(tpl);
  };

  const duplicateTemplate = (tpl) => {
    const copy = { ...tpl, id: `dup-${Date.now()}`, name: `${tpl.name} (copy)` };
    setTemplates(prev => ({ ...prev, [currentPoolKey]: [copy, ...prev[currentPoolKey]] }));
  };

  const createTemplate = () => {
    const draft = {
      id: `tmp-${Date.now()}`,
      name: 'New Template',
      description: '',
      visibility: currentPoolKey === 'my' ? 'user' : currentPoolKey === 'dept' ? 'department' : 'global',
      filters
    };
    setTemplates(prev => ({ ...prev, [currentPoolKey]: [draft, ...prev[currentPoolKey]] }));
    setActiveTemplateId(draft.id); // opcional: seleccionar recién creado
  };

  const editTemplateName = (tplId, newName) => {
    if (!newName) return;
    setTemplates(prev => ({
      ...prev,
      [currentPoolKey]: prev[currentPoolKey].map(t => t.id === tplId ? { ...t, name: newName } : t)
    }));
  };

  const UI = {
    brand: '#00a1ff',
    radius: 4,
    shadow: '0px 8px 24px rgba(239,241,246,1)',
    border: '#eef2f7',
  };

  const TEMPLATE_SEGMENTS = [
    { key: 0, label: 'Favorites',   icon: 'mdi:heart' },
    { key: 1, label: 'My Templates',icon: 'mdi:account' },
    { key: 2, label: 'Department',  icon: 'mdi:account-group' },
    { key: 3, label: 'Global',      icon: 'mdi:earth' },
  ];

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 150,
        left: 'calc(var(--drawer-width, 80px) + var(--content-gap))',
        right: 39,
        bottom: 39,
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#fff',
        borderRadius: UI.radius,
        border: `1px solid ${UI.border}`,
        boxShadow: UI.shadow,
        overflow: 'hidden',
        minHeight: 0,
        transition: 'left .3s ease',
      }}
    >
      {/* Header sticky */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: (t) => t.zIndex.appBar,
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #eee',
          bgcolor: '#fff'
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Reports</Typography>
          <Typography variant="body2" color="text.secondary">
            Build, preview and export call log reports
          </Typography>
        </Box>

        {/* Actions: New Template + Export */}
        <Stack direction="row" spacing={1}>
          <Tooltip title="Create a new template" arrow>
            <span>
              <Button
                size="small"
                variant="contained"
                startIcon={<AddIcon />}
                onClick={createTemplate}
                sx={{ textTransform: 'none', boxShadow: '0 2px 6px rgba(0,161,255,.25)' }}
              >
                New template
              </Button>
            </span>
          </Tooltip>

          <Tooltip title="Export" arrow>
            <span>
              <Button
                size="small"
                variant="outlined"
                startIcon={<FileDownloadIcon />}
                onClick={(e) => setAnchorEl(e.currentTarget)}
                sx={{ textTransform: 'none' }}
              >
                Export
              </Button>
            </span>
          </Tooltip>
        </Stack>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
          <MenuItem onClick={() => setAnchorEl(null)}>CSV</MenuItem>
          <MenuItem onClick={() => setAnchorEl(null)}>PDF</MenuItem>
          <MenuItem onClick={() => setAnchorEl(null)}>Print</MenuItem>
        </Menu>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        <Grid container spacing={2}>
          {/* Templates Sidebar */}
          <Grid item xs={12} md={4} lg={3}>
            <Card variant="outlined">
              <CardContent sx={{ p: 2 }}>
                {/* Header + Segmented control */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 1.25,
                    gap: 1.25,
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    Templates
                  </Typography>

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'stretch',
                      borderRadius: '999px',
                      overflow: 'hidden',
                      backgroundColor: 'rgba(0,161,255,0.08)',
                      border: '1px solid rgba(0,161,255,0.35)',
                      boxShadow: '0 1px 3px rgba(17,24,39,0.06)',
                    }}
                  >
                    {TEMPLATE_SEGMENTS.map(({ key, label, icon }, idx) => {
                      const isActiveSeg = tab === key;
                      const iconName = icon === 'mdi:heart' && isActiveSeg ? 'mdi:heart' : icon;
                      return (
                        <React.Fragment key={key}>
                          <Tooltip title={label} arrow>
                            <Box
                              onClick={() => setTab(key)}
                              role="button"
                              aria-label={label}
                              tabIndex={0}
                              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setTab(key); }}
                              sx={{
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                px: 1,
                                py: 0.45,
                                minWidth: 32,
                                transition: 'all .18s ease',
                                color: isActiveSeg ? '#fff' : '#00A1FF',
                                backgroundColor: isActiveSeg ? '#00A1FF' : 'transparent',
                                '&:hover': {
                                  boxShadow: isActiveSeg
                                    ? 'inset 0 0 0 999px rgba(255,255,255,0.02)'
                                    : 'inset 0 0 0 999px rgba(0,161,255,0.06)',
                                },
                                '&:focus-visible': {
                                  outline: '2px solid rgba(0,161,255,0.55)',
                                  outlineOffset: 2,
                                },
                              }}
                            >
                              <Iconify icon={iconName} width={14} height={14} />
                            </Box>
                          </Tooltip>
                          {idx !== TEMPLATE_SEGMENTS.length - 1 && (
                            <Box sx={{ width: 1, backgroundColor: 'rgba(0,161,255,0.25)', alignSelf: 'stretch' }} />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </Box>
                </Box>

                {/* Search */}
                <Stack direction="row" spacing={1} sx={{ mb: 1.25 }}>
                  <TextField
                    placeholder="Search templates"
                    size="small"
                    fullWidth
                    value={templateQuery}
                    onChange={(e) => setTemplateQuery(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ width: 350 }}
                  />
                </Stack>

                {/* Results list (cards) */}
                <List
                  dense
                  sx={{
                    maxHeight: 420,
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    pr: 0.5,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                  }}
                >
                  {activeTemplates.length === 0 && (
                    <Typography variant="body2" color="text.secondary" sx={{ px: 1 }}>
                      No templates here yet — create one to get started.
                    </Typography>
                  )}

                  {activeTemplates.map((tpl) => (
                    <li key={tpl.id} style={{ listStyle: 'none' }}>
                      <TemplateRow
                        tpl={tpl}
                        isActive={tpl.id === activeTemplateId}
                        onSelect={handleSelectTemplate}
                        onEditName={(id, nn) => editTemplateName(id, nn)}
                        onDuplicate={duplicateTemplate}
                        onDetails={(t) => { console.log('Details for:', t); }}
                      />
                    </li>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Builder + Preview */}
          <Grid item xs={12} md={8} lg={9}>
            <Grid container spacing={2}>
              {/* Filters */}
              <Grid item xs={12} lg={4}>
                <Card variant="outlined">
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                      Filters
                    </Typography>

                    <Stack spacing={1.2}>
                      <TextField
                        label="Date From"
                        type="datetime-local"
                        size="small"
                        value={filters.dateFrom}
                        onChange={(e) => updateFilter('dateFrom', e.target.value)}
                        InputLabelProps={{ shrink: true }}
                      />
                      <TextField
                        label="Date To"
                        type="datetime-local"
                        size="small"
                        value={filters.dateTo}
                        onChange={(e) => updateFilter('dateTo', e.target.value)}
                        InputLabelProps={{ shrink: true }}
                      />

                      <TextField label="Agent" size="small" value={filters.agent} onChange={(e) => updateFilter('agent', e.target.value)} />
                      <TextField label="Center" size="small" value={filters.center} onChange={(e) => updateFilter('center', e.target.value)} />
                      <TextField label="Department" size="small" value={filters.department} onChange={(e) => updateFilter('department', e.target.value)} />
                      <TextField label="Caller" size="small" value={filters.caller} onChange={(e) => updateFilter('caller', e.target.value)} />
                      <TextField label="Outcome" size="small" value={filters.outcome} onChange={(e) => updateFilter('outcome', e.target.value)} />

                      <Divider sx={{ my: 1 }} />
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>Flags</Typography>

                      {/* Priority */}
                      <FormControl size="small">
                        <InputLabel id="priority-label">Priority</InputLabel>
                        <Select
                          labelId="priority-label"
                          multiple
                          value={filters.priority}
                          onChange={(e) => updateFilter('priority', e.target.value)}
                          input={<OutlinedInput label="Priority" />}
                          renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {selected.map((v) => (<Chip key={v} label={v} size="small" />))}
                            </Box>
                          )}
                        >
                          {PRIORITY.map((v) => (
                            <MenuItem key={v} value={v}>
                              <ListItemIcon><Checkbox checked={filters.priority.indexOf(v) > -1} /></ListItemIcon>
                              <ListItemText primary={v} />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      {/* Risk */}
                      <FormControl size="small">
                        <InputLabel id="risk-label">Risk</InputLabel>
                        <Select
                          labelId="risk-label"
                          multiple
                          value={filters.risk}
                          onChange={(e) => updateFilter('risk', e.target.value)}
                          input={<OutlinedInput label="Risk" />}
                          renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {selected.map((v) => (<Chip key={v} label={v} size="small" />))}
                            </Box>
                          )}
                        >
                          {RISK.map((v) => (
                            <MenuItem key={v} value={v}>
                              <ListItemIcon><Checkbox checked={filters.risk.indexOf(v) > -1} /></ListItemIcon>
                              <ListItemText primary={v} />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      {/* Category */}
                      <FormControl size="small">
                        <InputLabel id="category-label">Category</InputLabel>
                        <Select
                          labelId="category-label"
                          multiple
                          value={filters.category}
                          onChange={(e) => updateFilter('category', e.target.value)}
                          input={<OutlinedInput label="Category" />}
                          renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {selected.map((v) => (<Chip key={v} label={v} size="small" />))}
                            </Box>
                          )}
                        >
                          {CATEGORY.map((v) => (
                            <MenuItem key={v} value={v}>
                              <ListItemIcon><Checkbox checked={filters.category.indexOf(v) > -1} /></ListItemIcon>
                              <ListItemText primary={v} />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      {/* QC */}
                      <FormControl size="small">
                        <InputLabel id="qc-label">QC</InputLabel>
                        <Select
                          labelId="qc-label"
                          value={filters.qc}
                          onChange={(e) => updateFilter('qc', e.target.value)}
                          input={<OutlinedInput label="QC" />}
                        >
                          <MenuItem value=""><em>Any</em></MenuItem>
                          <MenuItem value="true">True</MenuItem>
                          <MenuItem value="false">False</MenuItem>
                        </Select>
                      </FormControl>

                      <Stack direction="row" spacing={1}>
                        <Button
                          variant="contained"
                          fullWidth
                          sx={{ textTransform: 'none' }}
                          onClick={() => {/* TODO: fetch preview con BE */}}
                        >
                          Preview
                        </Button>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              {/* Preview */}
              <Grid item xs={12} lg={8}>
                <Card variant="outlined" sx={{ display: 'flex', flexDirection: 'column', minHeight: 520 }}>
                  <CardContent sx={{ p: 2, pb: 0 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      Preview
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Showing sample data. Hook real data next.
                    </Typography>
                  </CardContent>

                  <Box sx={{ flex: 1, overflow: 'auto', p: 2, pt: 1 }}>
                    <TableContainer>
                      <Table size="small" stickyHeader>
                        <TableHead>
                          <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Agent</TableCell>
                            <TableCell>Center</TableCell>
                            <TableCell>Department</TableCell>
                            <TableCell>Caller</TableCell>
                            <TableCell>Outcome</TableCell>
                            <TableCell>Priority</TableCell>
                            <TableCell>Risk</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>QC</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {pagedRows.map((r) => (
                            <TableRow key={r.id} hover>
                              <TableCell>{r.id}</TableCell>
                              <TableCell>{r.date}</TableCell>
                              <TableCell>{r.agent}</TableCell>
                              <TableCell>{r.center}</TableCell>
                              <TableCell>{r.department}</TableCell>
                              <TableCell>{r.caller}</TableCell>
                              <TableCell>{r.outcome}</TableCell>
                              <TableCell>{r.priority}</TableCell>
                              <TableCell>{r.risk}</TableCell>
                              <TableCell>{r.category}</TableCell>
                              <TableCell>{r.qc ? 'Yes' : 'No'}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>

                  <Box sx={{ px: 2, pb: 2 }}>
                    <TablePagination
                      component="div"
                      count={previewRows.length}
                      page={page}
                      onPageChange={(_, p) => setPage(p)}
                      rowsPerPage={rowsPerPage}
                      onRowsPerPageChange={(e) => { setRpp(parseInt(e.target.value, 10)); setPage(0); }}
                      rowsPerPageOptions={[10, 25, 50]}
                    />
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
