// src/pages/reportsScreen.js
import React, { useMemo, useState } from 'react';
import {
  Box, Card, CardContent, Typography, Divider,
  TextField, IconButton, Button, Menu, MenuItem, List,
  InputAdornment, Chip, Stack, Tooltip, Select, FormControl,
  InputLabel, OutlinedInput, Checkbox, ListItemIcon, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditIcon from '@mui/icons-material/Edit';
import { Iconify } from '../components/auxiliars/icons';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { icons } from '../components/auxiliars/icons';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const PRIORITY = ['low', 'medium', 'high'];
const RISK = ['none', 'medical', 'legal', 'disenrollment'];
const CATEGORY = [
  'transportation','appointment','new patient','pharmacy','disenrollment',
  'customer service','new address','hospitalization','adult day care',
  'referral or specialist','medical records','others'
];

/** ---------- TEMPLATE ROW ---------- */
function TemplateRow({ tpl, isActive, onSelect, onEditName, onDuplicate, onDetails }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleOpen = (e) => {
    e.stopPropagation();
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
  // UI tokens
  const UI = {
    brand: '#00A1FF',
    brandHover: '#008de0',
    brandBorder: 'rgba(0,161,255,0.45)',
    brandSurface: 'rgba(0,161,255,0.08)',
    brandSurfaceHover: 'rgba(0,161,255,0.12)',
    radius: 6,
    shadow: '0px 8px 24px rgba(239,241,246,1)',
    border: '#eef2f7',
    laneGapPx: 16,
    LANE_MIN_W: 1760,
    LANE_MAX_W: 2080,
  };

  const SELECT_ICON_RIGHT_PX = 36;
  const selectIconOffsetSx = {
    '& .MuiSelect-icon': { right: SELECT_ICON_RIGHT_PX, transition: 'transform .2s ease' },
    '& .MuiSelect-iconOpen': { transform: 'rotate(180deg)' },
  };

  const [tab, setTab] = useState(0);
  const [templateQuery, setTemplateQuery] = useState('');
  const [activeTemplateId, setActiveTemplateId] = useState(null);

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

  // Filters state
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

  const updateFilter = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));
  const currentPoolKey = tab === 0 ? 'my' : tab === 1 ? 'dept' : 'global';

  const applyTemplate = (tpl) => setFilters(prev => ({ ...prev, ...tpl.filters }));

  const handleSelectTemplate = (tpl) => {
    setActiveTemplateId(tpl.id);
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
    setActiveTemplateId(draft.id);
  };

  const editTemplateName = (tplId, newName) => {
    if (!newName) return;
    setTemplates(prev => ({
      ...prev,
      [currentPoolKey]: prev[currentPoolKey].map(t => t.id === tplId ? { ...t, name: newName } : t)
    }));
  };

  const TEMPLATE_SEGMENTS = [
    { key: 0, label: 'Favorites',   icon: 'mdi:heart' },
    { key: 1, label: 'My Templates',icon: 'mdi:account' },
    { key: 2, label: 'Department',  icon: 'mdi:account-group' },
    { key: 3, label: 'Global',      icon: 'mdi:earth' },
  ];

  const handlePreview = () => {
    /* hook BE call here if needed */
  };

  // ---- Export único a CSV (sin menú) ----
  const handleExportCSV = () => {
    const headers = ['ID','Date','Agent','Center','Department','Caller','Outcome','Priority','Risk','Category','QC'];
    const rows = previewRows.map(r => [
      r.id, r.date, r.agent, r.center, r.department, r.caller,
      r.outcome, r.priority, r.risk, r.category, r.qc ? 'Yes' : 'No'
    ]);
    const csv = [headers, ...rows]
      .map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reports_export.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  /** ====== Styles for chips ====== */
  const PRIORITY_STYLES = {
    high:   { fg: '#FF6692', bg: '#FFE2EA', border: '#FF6692' },
    medium: { fg: '#F0A500', bg: '#FFF5DA', border: '#FFB900' },
    low:    { fg: '#00B8A3', bg: '#DAF8F4', border: '#00B8A3' },
  };

  const RISK_STYLES = {
    none: { fg: '#2E7D32', bg: '#E6F4EA', border: '#4CAF50' },
    medical: { fg: '#00A1FF', bg: '#DFF3FF', border: '#00A1FF' },
    legal: { fg: '#E68900', bg: '#FFF3E0', border: '#FF9800' },
    disenrollment: { fg: '#E53935', bg: '#FDECEA', border: '#F44336' },
    default: { fg: '#757575', bg: '#F5F5F5', border: '#BDBDBD' },
  };

  const CATEGORY_STYLE = { fg: '#00A1FF', bg: '#DFF3FF', border: '#00A1FF' };

  const QC_STYLES = {
    true:  { fg: '#00B8A3', bg: '#DAF8F4', border: '#00B8A3' },
    false: { fg: '#FF6692', bg: '#FFE2EA', border: '#FF6692' },
  };

  const priorityChipSx = (level) => {
    const c = PRIORITY_STYLES[level];
    if (!c) return {};
    return {
      bgcolor: c.bg, color: c.fg, border: `1px solid ${c.border}`,
      borderRadius: 999, height: 22, fontWeight: 600, textTransform: 'capitalize', px: 0.75,
    };
  };

  const riskChipSx = (level) => {
    const key = (level || '').toLowerCase();
    const c = RISK_STYLES[key] || RISK_STYLES.default;
    return {
      bgcolor: c.bg, color: c.fg, border: `1px solid ${c.border}`,
      borderRadius: 999, height: 22, fontWeight: 600, textTransform: 'capitalize', px: 0.75,
    };
  };

  const categoryChipSx = {
    bgcolor: CATEGORY_STYLE.bg,
    color: CATEGORY_STYLE.fg,
    border: `1px solid ${CATEGORY_STYLE.border}`,
    borderRadius: 999,
    height: 22,
    fontWeight: 600,
    textTransform: 'capitalize',
    px: 0.75,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
  };

  const qcChipSx = (val) => {
    const key = String(val).toLowerCase();
    const c = QC_STYLES[key];
    if (!c) return {};
    return {
      bgcolor: c.bg, color: c.fg, border: `1px solid ${c.border}`,
      borderRadius: 999, height: 22, fontWeight: 600, textTransform: 'capitalize', px: 0.75,
    };
  };

  const resetFilters = () => setFilters({
    dateFrom: '', dateTo: '', agent: '', center: '', department: '',
    caller: '', outcome: '', priority: [], risk: [], category: [], qc: ''
  });

  const renderClearAdornment = (onClear, disabled = false) => (
    <InputAdornment position="end" sx={{ mr: 0 }}>
      <Tooltip title="Clear" arrow>
        <span>
          <IconButton
            size="small"
            edge="end"
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => { e.stopPropagation(); onClear(); }}
            disabled={disabled}
          >
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
    </InputAdornment>
  );

  const columnWidths = useMemo(() => ({
    id: 110, date: 160, agent: 120, center: 120, department: 140,
    caller: 150, outcome: 120, priority: 110, risk: 130, category: 180, qc: 90
  }), []);
  const MIN_TABLE_WIDTH_PX = 1720;

  const HeaderAction = ({ icon, children, onClick, variant = 'primary', title }) => {
    const common = {
      textTransform: 'none',
      borderRadius: '6px',
      fontWeight: 700,
      letterSpacing: 0.2,
      px: 1.25,
      py: 0.75,
      height: 36,
      lineHeight: 1,
      gap: 0.75,
      '& .MuiButton-startIcon > *': { color: 'currentColor' },
      '&:focus-visible': { outline: `2px solid ${UI.brand}`, outlineOffset: 2 },
    };
    const variants = {
      primary: { ...common, color: '#fff', bgcolor: UI.brand, boxShadow: '0 2px 6px rgba(0,161,255,.25)', '&:hover': { bgcolor: UI.brandHover } },
      soft:    { ...common, color: UI.brand, bgcolor: UI.brandSurface, border: `1px solid ${UI.brandBorder}`, '&:hover': { bgcolor: UI.brandSurfaceHover } },
      outline: { ...common, color: UI.brand, border: `1px solid ${UI.brandBorder}`, bgcolor: '#fff', '&:hover': { bgcolor: 'rgba(0,161,255,0.06)' } },
    };
    return (
      <Button
        size="small"
        startIcon={<Iconify icon={icon} width={18} height={18} />}
        onClick={onClick}
        sx={variants[variant] || variants.primary}
        title={title}
      >
        {children}
      </Button>
    );
  };

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

        <Stack direction="row" spacing={1}>
          <Tooltip title="Preview with current filters" arrow>
            <span>
              <HeaderAction
                icon="mdi:eye-check-outline"
                onClick={handlePreview}
                variant="primary"
                title="Preview with current filters"
              >
                Preview
              </HeaderAction>
            </span>
          </Tooltip>

          <Tooltip title="Create a new template" arrow>
            <span>
              <HeaderAction
                icon="mdi:file-document-plus-outline"
                onClick={createTemplate}
                variant="soft"
                title="Create a new template"
              >
                New template
              </HeaderAction>
            </span>
          </Tooltip>

          {/* Export directo a CSV (sin dropdown) */}
          <Tooltip title="Export to CSV" arrow>
            <span>
              <HeaderAction
                icon="mdi:file-delimited-outline"
                onClick={handleExportCSV}
                variant="outline"
                title="Export to CSV"
              >
                Export
              </HeaderAction>
            </span>
          </Tooltip>
        </Stack>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, overflowY: 'auto', overflowX: 'auto' }}>
        <Box
          sx={{
            width: `clamp(${UI.LANE_MIN_W}px, 100%, ${UI.LANE_MAX_W}px)`,
            mx: 'auto',
            px: 2,
            py: 2,
            display: 'grid',
            gridTemplateColumns: 'minmax(300px, 1fr) minmax(360px, 1.2fr) minmax(1100px, 3fr)',
            columnGap: `${UI.laneGapPx}px`,
            rowGap: `${UI.laneGapPx}px`,
            alignItems: 'start',
            minHeight: 0,
          }}
        >
          {/* Templates */}
          <Box>
            <Card variant="outlined">
              <CardContent sx={{ p: 2 }}>
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
                      backgroundColor: UI.brandSurface,
                      border: `1px solid ${UI.brandBorder}`,
                      boxShadow: '0 1px 3px rgba(17,24,39,0.06)',
                    }}
                  >
                    {[
                      { key: 0, label: 'Favorites',   icon: 'mdi:heart' },
                      { key: 1, label: 'My Templates',icon: 'mdi:account' },
                      { key: 2, label: 'Department',  icon: 'mdi:account-group' },
                      { key: 3, label: 'Global',      icon: 'mdi:earth' },
                    ].map(({ key, label, icon }, idx) => {
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
                                color: isActiveSeg ? '#fff' : UI.brand,
                                backgroundColor: isActiveSeg ? UI.brand : 'transparent',
                                '&:hover': {
                                  boxShadow: isActiveSeg
                                    ? 'inset 0 0 0 999px rgba(255,255,255,0.02)'
                                    : 'inset 0 0 0 999px rgba(0,161,255,0.06)',
                                },
                                '&:focus-visible': { outline: `2px solid ${UI.brand}`, outlineOffset: 2 },
                              }}
                            >
                              <Iconify icon={iconName} width={14} height={14} />
                            </Box>
                          </Tooltip>
                          {idx !== 3 && (
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
                  />
                </Stack>

                {/* Results list */}
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
          </Box>

          {/* Filters */}
          <Box>
            <Card variant="outlined">
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Filters</Typography>
                  <Button
                    size="small"
                    startIcon={<Iconify icon="mdi:delete-sweep-outline" width={18} height={18} />}
                    onClick={resetFilters}
                    sx={{
                      textTransform: 'none',
                      px: 1.25,
                      py: 0.5,
                      borderRadius: 999,
                      border: `1px solid ${UI.brandBorder}`,
                      color: UI.brand,
                      bgcolor: UI.brandSurface,
                      '&:hover': { bgcolor: UI.brandSurfaceHover },
                      fontWeight: 700,
                      gap: 0.75,
                      height: 34,
                    }}
                  >
                    Clear all
                  </Button>
                </Box>

                <Stack spacing={1.6}>
                  {/* Date range */}
                  <Box sx={{ mt: 2, mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Iconify icon="mdi:calendar-month-outline" width={20} height={20} color={UI.brand} />
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: UI.brand }}>
                        Date range
                      </Typography>
                    </Box>
                    <Divider sx={{ borderColor: UI.brand, opacity: 0.5, mt: 0.5 }} />
                  </Box>

                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                    <TextField
                      label="Date From"
                      type="datetime-local"
                      size="small"
                      value={filters.dateFrom}
                      onChange={(e) => updateFilter('dateFrom', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                    />
                    <TextField
                      label="Date To"
                      type="datetime-local"
                      size="small"
                      value={filters.dateTo}
                      onChange={(e) => updateFilter('dateTo', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                    />
                  </Box>

                  {/* Core filters */}
                  <Box sx={{ mt: 2, mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Iconify icon="mdi:tune" width={20} height={20} color={UI.brand} />
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: UI.brand }}>
                        Core filters
                      </Typography>
                    </Box>
                    <Divider sx={{ borderColor: UI.brand, opacity: 0.5, mt: 0.5 }} />
                  </Box>

                  <TextField label="Agent" size="small" value={filters.agent} onChange={(e) => updateFilter('agent', e.target.value)} />
                  <TextField label="Center" size="small" value={filters.center} onChange={(e) => updateFilter('center', e.target.value)} />
                  <TextField label="Department" size="small" value={filters.department} onChange={(e) => updateFilter('department', e.target.value)} />
                  <TextField label="Caller" size="small" value={filters.caller} onChange={(e) => updateFilter('caller', e.target.value)} />
                  <TextField label="Outcome" size="small" value={filters.outcome} onChange={(e) => updateFilter('outcome', e.target.value)} />

                  {/* Flags */}
                  <Box sx={{ mt: 2, mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Iconify icon="mdi:flag" width={20} height={20} color={UI.brand} />
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: UI.brand }}>
                        Flags
                      </Typography>
                    </Box>
                    <Divider sx={{ borderColor: UI.brand, opacity: 0.5, mt: 0.5 }} />
                  </Box>

                  {/* Priority */}
                  <FormControl size="small">
                    <InputLabel id="priority-label">Priority</InputLabel>
                    <Select
                      labelId="priority-label"
                      multiple
                      value={filters.priority}
                      onChange={(e) => updateFilter('priority', e.target.value)}
                      IconComponent={KeyboardArrowUpIcon}
                      sx={selectIconOffsetSx}
                      input={
                        <OutlinedInput
                          label="Priority"
                          sx={{ pr: `${SELECT_ICON_RIGHT_PX / 8 + 3}rem` }}
                          endAdornment={renderClearAdornment(() => updateFilter('priority', []), filters.priority.length === 0)}
                        />
                      }
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((v) => (
                            <Chip key={v} label={v} size="small" sx={priorityChipSx(v)} />
                          ))}
                        </Box>
                      )}
                      MenuProps={{ PaperProps: { sx: { maxHeight: 320 } } }}
                    >
                      {PRIORITY.map((v) => {
                        const checked = filters.priority.indexOf(v) > -1;
                        return (
                          <MenuItem key={v} value={v} dense>
                            <ListItemIcon>
                              <Checkbox edge="start" checked={checked} tabIndex={-1} disableRipple />
                            </ListItemIcon>
                            <Chip label={v} size="small" sx={priorityChipSx(v)} />
                          </MenuItem>
                        );
                      })}
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
                      IconComponent={KeyboardArrowUpIcon}
                      sx={selectIconOffsetSx}
                      input={
                        <OutlinedInput
                          label="Risk"
                          sx={{ pr: `${SELECT_ICON_RIGHT_PX / 8 + 3}rem` }}
                          endAdornment={renderClearAdornment(() => updateFilter('risk', []), filters.risk.length === 0)}
                        />
                      }
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((v) => (
                            <Chip key={v} label={v} size="small" sx={riskChipSx(v)} />
                          ))}
                        </Box>
                      )}
                      MenuProps={{ PaperProps: { sx: { maxHeight: 320 } } }}
                    >
                      {RISK.map((v) => {
                        const checked = filters.risk.indexOf(v) > -1;
                        return (
                          <MenuItem key={v} value={v} dense>
                            <ListItemIcon>
                              <Checkbox edge="start" checked={checked} tabIndex={-1} disableRipple />
                            </ListItemIcon>
                            <Chip label={v} size="small" sx={riskChipSx(v)} />
                          </MenuItem>
                        );
                      })}
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
                      IconComponent={KeyboardArrowUpIcon}
                      sx={selectIconOffsetSx}
                      input={
                        <OutlinedInput
                          label="Category"
                          sx={{ pr: `${SELECT_ICON_RIGHT_PX / 8 + 3}rem` }}
                          endAdornment={renderClearAdornment(() => updateFilter('category', []), filters.category.length === 0)}
                        />
                      }
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((v) => {
                            const Icon = icons[v.replace(/\s+/g, '_')] || icons.others;
                            return (
                              <Chip
                                key={v}
                                label={
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    {Icon && <Icon style={{ fontSize: 14 }} />}
                                    {v}
                                  </Box>
                                }
                                size="small"
                                sx={categoryChipSx}
                              />
                            );
                          })}
                        </Box>
                      )}
                      MenuProps={{ PaperProps: { sx: { maxHeight: 320 } } }}
                    >
                      {CATEGORY.map((v) => {
                        const checked = filters.category.indexOf(v) > -1;
                        const Icon = icons[v.replace(/\s+/g, '_')] || icons.others;
                        return (
                          <MenuItem key={v} value={v} dense>
                            <ListItemIcon>
                              <Checkbox edge="start" checked={checked} tabIndex={-1} disableRipple />
                            </ListItemIcon>
                            <Chip
                              label={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  {Icon && <Icon style={{ fontSize: 14 }} />}
                                  {v}
                                </Box>
                              }
                              size="small"
                              sx={categoryChipSx}
                            />
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>

                  {/* Quality Control */}
                  <FormControl size="small">
                    <InputLabel id="qc-label">Quality Control</InputLabel>
                    <Select
                      labelId="qc-label"
                      value={filters.qc}
                      onChange={(e) => updateFilter('qc', e.target.value)}
                      IconComponent={KeyboardArrowUpIcon}
                      sx={selectIconOffsetSx}
                      input={
                        <OutlinedInput
                          label="Quality Control"
                          sx={{ pr: `${SELECT_ICON_RIGHT_PX / 8 + 3}rem` }}
                          endAdornment={renderClearAdornment(() => updateFilter('qc', ''), !filters.qc)}
                        />
                      }
                      renderValue={(selected) => {
                        if (!selected) return <Typography variant="body2" color="text.secondary">All</Typography>;
                        return <Chip label={selected === 'true' ? 'True' : 'False'} size="small" sx={qcChipSx(selected)} />;
                      }}
                    >
                      <MenuItem value="true"><Chip label="True" size="small" sx={qcChipSx('true')} /></MenuItem>
                      <MenuItem value="false"><Chip label="False" size="small" sx={qcChipSx('false')} /></MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
              </CardContent>
            </Card>
          </Box>

          {/* Preview */}
          <Box>
            <Card variant="outlined" sx={{ display: 'flex', flexDirection: 'column', minHeight: 520 }}>
              <CardContent sx={{ p: 2, pb: 0 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Preview
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Showing sample data. Hook real data next.
                </Typography>
              </CardContent>

              <Box sx={{ flex: 1, px: 2, pt: 1 }}>
                <TableContainer
                  sx={{
                    border: '1px solid #eef2f7',
                    borderRadius: 2,
                    boxShadow: '0 1px 2px rgba(16,24,40,0.04)',
                    bgcolor: '#fff',
                    maxHeight: 420,
                    overflowX: 'auto',
                    WebkitOverflowScrolling: 'touch',
                  }}
                >
                  <Table size="small" stickyHeader sx={{ minWidth: MIN_TABLE_WIDTH_PX }}>
                    <TableHead>
                      <TableRow
                        sx={{
                          '& th': {
                            bgcolor: '#F5FAFF',
                            color: '#334155',
                            fontWeight: 700,
                            fontSize: 12.5,
                            borderBottom: '1px solid #E6F0FA',
                            whiteSpace: 'nowrap',
                          },
                        }}
                      >
                        <TableCell sx={{ width: columnWidths.id }}>ID</TableCell>
                        <TableCell sx={{ width: columnWidths.date }}>Date</TableCell>
                        <TableCell sx={{ width: columnWidths.agent }}>Agent</TableCell>
                        <TableCell sx={{ width: columnWidths.center }}>Center</TableCell>
                        <TableCell sx={{ width: columnWidths.department }}>Department</TableCell>
                        <TableCell sx={{ width: columnWidths.caller }}>Caller</TableCell>
                        <TableCell sx={{ width: columnWidths.outcome }}>Outcome</TableCell>
                        <TableCell sx={{ width: columnWidths.priority }}>Priority</TableCell>
                        <TableCell sx={{ width: columnWidths.risk }}>Risk</TableCell>
                        <TableCell sx={{ width: columnWidths.category }}>Category</TableCell>
                        <TableCell sx={{ width: columnWidths.qc }}>QC</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {pagedRows.map((r) => (
                        <TableRow
                          key={r.id}
                          hover
                          sx={{
                            '&:nth-of-type(odd)': { bgcolor: '#FAFCFF' },
                            '& td': { borderBottom: '1px solid #F1F5F9', fontSize: 13.5, whiteSpace: 'nowrap' },
                          }}
                        >
                          <TableCell>{r.id}</TableCell>
                          <TableCell>{r.date}</TableCell>
                          <TableCell>{r.agent}</TableCell>
                          <TableCell>{r.center}</TableCell>
                          <TableCell>{r.department}</TableCell>
                          <TableCell>{r.caller}</TableCell>
                          <TableCell sx={{ textTransform: 'capitalize' }}>{r.outcome}</TableCell>
                          <TableCell>
                            <Chip label={r.priority} size="small" sx={priorityChipSx(r.priority)} />
                          </TableCell>
                          <TableCell>
                            <Chip label={r.risk} size="small" sx={riskChipSx(r.risk)} />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  {(icons[r.category.replace(/\s+/g, '_')] || icons.others) &&
                                    React.createElement(icons[r.category.replace(/\s+/g, '_')] || icons.others, { style: { fontSize: 14 } })
                                  }
                                  {r.category}
                                </Box>
                              }
                              size="small"
                              sx={categoryChipSx}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={r.qc ? 'True' : 'False'}
                              size="small"
                              sx={qcChipSx(r.qc ? 'true' : 'false')}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>

              <Box sx={{ flexShrink: 0, px: 2, py: 1, bgcolor: '#fff' }}>
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
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
