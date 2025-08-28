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
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
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

/* ---------- Template Row ---------- */
function TemplateRow({ tpl, isActive, onSelect, onEditName, onDuplicate, onDetails, textScale }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleOpen = (e) => { e.stopPropagation(); setAnchorEl(e.currentTarget); };
  const handleClose = () => setAnchorEl(null);

  return (
    <Box
      onClick={() => onSelect(tpl)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelect(tpl); }}
      sx={{
        display: 'flex', alignItems: 'center', gap: 1,
        p: 1.1, borderRadius: 1.5,
        border: `1px solid ${isActive ? 'rgba(0,161,255,.35)' : '#eef2f7'}`,
        backgroundColor: isActive ? '#DFF3FF' : '#fff',
        transition: 'box-shadow .18s ease, border-color .18s ease, background-color .18s ease',
        cursor: 'pointer',
        '&:hover': { backgroundColor: isActive ? '#DFF3FF' : '#fafcff', borderColor: 'rgba(0,161,255,.35)', boxShadow: '0 4px 16px rgba(0,0,0,0.05)' },
        '&:focus-visible': { outline: '2px solid rgba(0,161,255,0.45)', outlineOffset: 2 }
      }}
    >
      <Box sx={{ flex: '1 1 auto', minWidth: 0 }}>
        <Typography noWrap title={tpl.name} sx={{ fontWeight: 700, fontSize: textScale.title }}>
          {tpl.name}
        </Typography>
        <Typography noWrap color="text.secondary" title={tpl.description || tpl.visibility} sx={{ fontSize: textScale.subtle }}>
          {tpl.description || tpl.visibility}
        </Typography>
      </Box>

      <IconButton edge="end" onClick={handleOpen} size="small"><MoreVertIcon fontSize="small" /></IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={() => { handleClose(); const nn = prompt('Template name', tpl.name); if (nn) onEditName(tpl.id, nn); }}>
          <EditIcon fontSize="small" style={{ marginRight: 8 }} /> Edit name
        </MenuItem>
        <MenuItem onClick={() => { handleClose(); onDuplicate(tpl); }}>
          <ContentCopyIcon fontSize="small" style={{ marginRight: 8 }} /> Duplicate
        </MenuItem>
        <MenuItem onClick={() => { handleClose(); onDetails?.(tpl); }}>
          <InfoOutlinedIcon fontSize="small" style={{ marginRight: 8 }} /> Details
        </MenuItem>
      </Menu>
    </Box>
  );
}
/* ---------------------------------- */

export default function ReportsScreen() {
  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.down('sm'));

  // tipografías fluidas
  const font = {
    h: 'clamp(16px, 1.4vw, 22px)',
    body: 'clamp(12px, 1.05vw, 14px)',
    subtle: 'clamp(11px, 0.95vw, 13px)',
    chip: 'clamp(10px, 0.9vw, 12px)',
    tableHeader: 'clamp(11px, 0.95vw, 12.5px)',
    tableBody: 'clamp(11.5px, 1vw, 13.5px)',
  };

  const gap = {
    cardPad: { xs: 1.25, md: 1.75, lg: 2 },
    gridGap: { xs: 1.25, md: 2 },
  };

  const UI = {
    brand: '#00A1FF',
    brandHover: '#008de0',
    brandBorder: 'rgba(0,161,255,0.45)',
    brandSurface: 'rgba(0,161,255,0.08)',
    brandSurfaceHover: 'rgba(0,161,255,0.12)',
    radius: 6,
    shadow: '0px 8px 24px rgba(239,241,246,1)',
    border: '#eef2f7',
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
    my: [{ id: 't1', name: 'Emergencies – Last 7d', description: 'High priority in the last 7 days', visibility: 'user', filters: { date: '', priority: ['high'], risk: [], category: [], qc: '' } }],
    dept: [],
    global: []
  });

  const [filters, setFilters] = useState({
    date: '', agent: '', center: '', department: '', caller: '', outcome: '',
    priority: [], risk: [], category: [], qc: ''
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRpp] = useState(10);

  const activeTemplates = useMemo(() => {
    const pool = tab === 0 ? templates.my : tab === 1 ? templates.dept : templates.global;
    const q = templateQuery.trim().toLowerCase();
    if (!q) return pool;
    return pool.filter(t => t.name.toLowerCase().includes(q) || (t.description || '').toLowerCase().includes(q));
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

  const pagedRows = useMemo(
    () => previewRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [page, rowsPerPage, previewRows]
  );

  const updateFilter = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));
  const currentPoolKey = tab === 0 ? 'my' : tab === 1 ? 'dept' : 'global';

  const applyTemplate = (tpl) => {
    const f = tpl?.filters || {};
    setFilters(prev => ({
      ...prev,
      date: ('date' in f) ? (f.date || '') : (f.dateFrom || ''),
      agent: f.agent ?? prev.agent,
      center: f.center ?? prev.center,
      department: f.department ?? prev.department,
      caller: f.caller ?? prev.caller,
      outcome: f.outcome ?? prev.outcome,
      priority: Array.isArray(f.priority) ? f.priority : prev.priority,
      risk: Array.isArray(f.risk) ? f.risk : prev.risk,
      category: Array.isArray(f.category) ? f.category : prev.category,
      qc: f.qc ?? prev.qc
    }));
  };

  const handleSelectTemplate = (tpl) => { setActiveTemplateId(tpl.id); applyTemplate(tpl); };

  const duplicateTemplate = (tpl) => {
    const copy = { ...tpl, id: `dup-${Date.now()}`, name: `${tpl.name} (copy)`, filters: { ...tpl.filters, date: tpl.filters.date ?? '' } };
    setTemplates(prev => ({ ...prev, [currentPoolKey]: [copy, ...prev[currentPoolKey]] }));
  };

  const createTemplate = () => {
    const draft = { id: `tmp-${Date.now()}`, name: 'New Template', description: '', visibility: currentPoolKey === 'my' ? 'user' : currentPoolKey === 'dept' ? 'department' : 'global', filters: { ...filters } };
    setTemplates(prev => ({ ...prev, [currentPoolKey]: [draft, ...prev[currentPoolKey]] }));
    setActiveTemplateId(draft.id);
  };

  const editTemplateName = (id, newName) => {
    if (!newName) return;
    setTemplates(prev => ({
      ...prev,
      [currentPoolKey]: prev[currentPoolKey].map(t => t.id === id ? { ...t, name: newName } : t)
    }));
  };

  // Chip styles responsive
  const chipSize = 'small';
  const baseChip = { borderRadius: 999, height: 22, fontWeight: 600, textTransform: 'capitalize', px: 0.75, fontSize: font.chip };
  const PRIORITY_STYLES = { high:{ fg:'#FF6692', bg:'#FFE2EA', border:'#FF6692' }, medium:{ fg:'#F0A500', bg:'#FFF5DA', border:'#FFB900' }, low:{ fg:'#00B8A3', bg:'#DAF8F4', border:'#00B8A3' } };
  const RISK_STYLES = { none:{ fg:'#2E7D32', bg:'#E6F4EA', border:'#4CAF50' }, medical:{ fg:'#00A1FF', bg:'#DFF3FF', border:'#00A1FF' }, legal:{ fg:'#E68900', bg:'#FFF3E0', border:'#FF9800' }, disenrollment:{ fg:'#E53935', bg:'#FDECEA', border:'#F44336' }, default:{ fg:'#757575', bg:'#F5F5F5', border:'#BDBDBD' } };
  const CATEGORY_STYLE = { fg:'#00A1FF', bg:'#DFF3FF', border:'#00A1FF' };
  const QC_STYLES = { true:{ fg:'#00B8A3', bg:'#DAF8F4', border:'#00B8A3' }, false:{ fg:'#FF6692', bg:'#FFE2EA', border:'#FF6692' } };

  const priorityChipSx = (k) => ({ ...baseChip, bgcolor:PRIORITY_STYLES[k].bg, color:PRIORITY_STYLES[k].fg, border:`1px solid ${PRIORITY_STYLES[k].border}` });
  const riskChipSx     = (k) => { const c = RISK_STYLES[(k||'').toLowerCase()] || RISK_STYLES.default; return { ...baseChip, bgcolor:c.bg, color:c.fg, border:`1px solid ${c.border}` }; };
  const categoryChipSx = { ...baseChip, bgcolor:CATEGORY_STYLE.bg, color:CATEGORY_STYLE.fg, border:`1px solid ${CATEGORY_STYLE.border}`, display:'inline-flex', alignItems:'center', gap:4 };
  const qcChipSx       = (v) => ({ ...baseChip, bgcolor:QC_STYLES[String(v).toLowerCase()].bg, color:QC_STYLES[String(v).toLowerCase()].fg, border:`1px solid ${QC_STYLES[String(v).toLowerCase()].border}` });

  const resetFilters = () => setFilters({ date:'', agent:'', center:'', department:'', caller:'', outcome:'', priority:[], risk:[], category:[], qc:'' });

  const renderClearAdornment = (onClear, disabled = false) => (
    <InputAdornment position="end" sx={{ mr: 0 }}>
      <Tooltip title="Clear" arrow>
        <span>
          <IconButton size="small" edge="end" onMouseDown={(e) => e.preventDefault()} onClick={(e) => { e.stopPropagation(); onClear(); }} disabled={disabled}>
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
    </InputAdornment>
  );

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
        fontSize: font.body,
      }}
    >
      {/* Header sticky */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: (t) => t.zIndex.appBar,
          p: { xs: 1.5, md: 2 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #eee',
          bgcolor: '#fff'
        }}
      >
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: font.h }}>Reports</Typography>
          <Typography sx={{ fontSize: font.subtle }} color="text.secondary">
            Build, preview and export call log reports
          </Typography>
        </Box>

        <Stack direction="row" spacing={1}>
          <Tooltip title="Preview with current filters" arrow>
            <span>
              <Button
                size="small"
                startIcon={<Iconify icon="mdi:eye-check-outline" width={18} height={18} />}
                onClick={()=>{}}
                sx={{ textTransform:'none', borderRadius:'6px', fontWeight:700, px:1.1, py:0.7, height: xs?34:36, fontSize: font.body, color:'#fff', bgcolor:UI.brand, '&:hover':{ bgcolor:UI.brandHover } }}
              >
                Preview
              </Button>
            </span>
          </Tooltip>
          <Tooltip title="Create a new template" arrow>
            <span>
              <Button
                size="small"
                startIcon={<Iconify icon="mdi:file-document-plus-outline" width={18} height={18} />}
                onClick={createTemplate}
                sx={{ textTransform:'none', borderRadius:'6px', fontWeight:700, px:1.1, py:0.7, height: xs?34:36, fontSize: font.body, color:UI.brand, bgcolor:UI.brandSurface, border:`1px solid ${UI.brandBorder}`, '&:hover':{ bgcolor:UI.brandSurfaceHover } }}
              >
                New template
              </Button>
            </span>
          </Tooltip>
          <Tooltip title="Export to CSV" arrow>
            <span>
              <Button
                size="small"
                startIcon={<Iconify icon="mdi:file-delimited-outline" width={18} height={18} />}
                onClick={()=>{
                  const headers=['ID','Date','Agent','Center','Department','Caller','Outcome','Priority','Risk','Category','QC'];
                  const rows=previewRows.map(r=>[r.id,r.date,r.agent,r.center,r.department,r.caller,r.outcome,r.priority,r.risk,r.category,r.qc?'Yes':'No']);
                  const csv=[headers,...rows].map(row=>row.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
                  const blob=new Blob([csv],{type:'text/csv;charset=utf-8;'}); const url=URL.createObjectURL(blob);
                  const a=document.createElement('a'); a.href=url; a.download='reports_export.csv'; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
                }}
                sx={{ textTransform:'none', borderRadius:'6px', fontWeight:700, px:1.1, py:0.7, height: xs?34:36, fontSize: font.body, color:UI.brand, border:`1px solid ${UI.brandBorder}`, bgcolor:'#fff', '&:hover':{ bgcolor:'rgba(0,161,255,0.06)' } }}
              >
                Export
              </Button>
            </span>
          </Tooltip>
        </Stack>
      </Box>

      {/* Content grid */}
      <Box
        sx={{
          flex: 1, minHeight: 0, overflow: 'hidden',
          p: { xs: 1.25, md: 2 },
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(12, minmax(0,1fr))' },
          gridTemplateRows: { xs: 'repeat(3, minmax(0,1fr))', md: 'minmax(0,1fr)' },
          columnGap: gap.gridGap,
          rowGap: gap.gridGap,
          alignItems: 'stretch'
        }}
      >
        {/* Templates (2/12) */}
        <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 2' }, gridRow: 'span 1', minWidth: 0, display: 'flex' }}>
          <Card variant="outlined" sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <CardContent sx={{ p: gap.cardPad, display: 'flex', flexDirection: 'column', gap: 1.1, minHeight: 0, flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                <Typography sx={{ fontWeight: 700, fontSize: font.body }}>Templates</Typography>

                <Box
                  sx={{
                    display: 'flex', alignItems: 'stretch', borderRadius: '999px', overflow: 'hidden',
                    backgroundColor: UI.brandSurface, border: `1px solid ${UI.brandBorder}`,
                  }}
                >
                  {[
                    { key: 0, label: 'Favorites',   icon: 'mdi:heart' },
                    { key: 1, label: 'My Templates',icon: 'mdi:account' },
                    { key: 2, label: 'Department',  icon: 'mdi:account-group' },
                    { key: 3, label: 'Global',      icon: 'mdi:earth' },
                  ].map(({ key, label, icon }, idx) => {
                    const isActiveSeg = tab === key;
                    return (
                      <React.Fragment key={key}>
                        <Tooltip title={label} arrow>
                          <Box
                            onClick={() => setTab(key)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e)=>{ if(e.key==='Enter'||e.key===' ') setTab(key); }}
                            sx={{
                              cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
                              px: 1, py: 0.45, minWidth: 30,
                              color: isActiveSeg ? '#fff' : UI.brand,
                              backgroundColor: isActiveSeg ? UI.brand : 'transparent',
                              fontSize: font.subtle
                            }}
                          >
                            <Iconify icon={icon} width={14} height={14} />
                          </Box>
                        </Tooltip>
                        {idx!==3 && <Box sx={{ width:1, backgroundColor:'rgba(0,161,255,0.25)', alignSelf:'stretch' }} />}
                      </React.Fragment>
                    );
                  })}
                </Box>
              </Box>

              <TextField
                placeholder="Search templates"
                size="small"
                fullWidth
                value={templateQuery}
                onChange={(e) => setTemplateQuery(e.target.value)}
                InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>) }}
                sx={{ '& .MuiInputBase-input': { fontSize: font.body } }}
              />

              <List dense sx={{ flex: 1, minHeight: 0, overflow: 'auto', pr: 0.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
                {activeTemplates.length === 0 && (
                  <Typography sx={{ px: 1, fontSize: font.subtle }} color="text.secondary">
                    No templates here yet — create one to get started.
                  </Typography>
                )}
                {activeTemplates.map((tpl) => (
                  <li key={tpl.id} style={{ listStyle: 'none' }}>
                    <TemplateRow
                      tpl={tpl}
                      isActive={tpl.id === activeTemplateId}
                      onSelect={(t)=>{ setActiveTemplateId(t.id); applyTemplate(t); }}
                      onEditName={(id, nn) => {
                        if (!nn) return;
                        setTemplates(prev => ({
                          ...prev,
                          [currentPoolKey]: prev[currentPoolKey].map(tt => tt.id === id ? { ...tt, name: nn } : tt)
                        }));
                      }}
                      onDuplicate={duplicateTemplate}
                      onDetails={(t) => console.log('Details for:', t)}
                      textScale={{ title: font.body, subtle: font.subtle }}
                    />
                  </li>
                ))}
              </List>
            </CardContent>
          </Card>
        </Box>

        {/* Filters (2/12) — header sticky, scroll Y y X si hace falta */}
        <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 2' }, gridRow: 'span 1', minWidth: 0, display: 'flex' }}>
          <Card variant="outlined" sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <CardContent
              sx={{
                p: 0,
                display: 'flex',
                flexDirection: 'column',
                flex: '1 1 auto',
                minHeight: 0,
                overflow: 'auto',
                scrollbarGutter: 'stable',
              }}
            >
              {/* HEADER STICKY */}
              <Box
                sx={{
                  position: 'sticky',
                  top: 0,
                  zIndex: 2,
                  bgcolor: '#fff',
                  borderBottom: '1px solid #eef2f7',
                  px: gap.cardPad,
                  py: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Typography sx={{ fontWeight: 700, fontSize: font.body }}>Filters</Typography>
                <Button
                  size="small"
                  startIcon={<Iconify icon="mdi:delete-sweep-outline" width={18} height={18} />}
                  onClick={resetFilters}
                  sx={{ textTransform:'none', borderRadius:'6px', fontWeight:700, px:1.1, py:0.7, height: xs?34:36, fontSize: font.body, color:UI.brand, border:`1px solid ${UI.brandBorder}`, bgcolor:'#fff', '&:hover':{ bgcolor:'rgba(0,161,255,0.06)' } }}
                >
                  Clear all
                </Button>
              </Box>

              {/* BODY (scrolleable) */}
              <Box sx={{ px: gap.cardPad, py: 1.25, display: 'flex', flexDirection: 'column', gap: 1.4, minWidth: { xs: 520, md: 'auto' } }}>
                <Box sx={{ mt: 0.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Iconify icon="mdi:calendar-month-outline" width={18} height={18} color={UI.brand} />
                    <Typography sx={{ fontWeight: 700, color: UI.brand, fontSize: font.subtle }}>Date</Typography>
                  </Box>
                  <Divider sx={{ borderColor: UI.brand, opacity: 0.5, mt: 0.5 }} />
                </Box>
                <TextField
                  label="Date"
                  type="date"
                  size="small"
                  value={filters.date}
                  onChange={(e)=>updateFilter('date', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  sx={{ '& .MuiInputBase-input': { fontSize: font.body } }}
                />

                <Box sx={{ mt: 0.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Iconify icon="mdi:tune" width={18} height={18} color={UI.brand} />
                    <Typography sx={{ fontWeight: 700, color: UI.brand, fontSize: font.subtle }}>Core filters</Typography>
                  </Box>
                  <Divider sx={{ borderColor: UI.brand, opacity: 0.5, mt: 0.5 }} />
                </Box>

                {['agent','center','department','caller','outcome'].map((key) => (
                  <TextField
                    key={key}
                    label={key[0].toUpperCase()+key.slice(1)}
                    size="small"
                    value={filters[key]}
                    onChange={(e)=>updateFilter(key, e.target.value)}
                    sx={{ '& .MuiInputBase-input': { fontSize: font.body } }}
                  />
                ))}

                {/* Flags */}
                <Box sx={{ mt: 0.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Iconify icon="mdi:flag" width={18} height={18} color={UI.brand} />
                    <Typography sx={{ fontWeight: 700, color: UI.brand, fontSize: font.subtle }}>Flags</Typography>
                  </Box>
                  <Divider sx={{ borderColor: UI.brand, opacity: 0.5, mt: 0.5 }} />
                </Box>

                {/* Priority */}
                <FormControl size="small">
                  <InputLabel id="priority-label" sx={{ fontSize: font.body }}>Priority</InputLabel>
                  <Select
                    labelId="priority-label"
                    multiple
                    value={filters.priority}
                    onChange={(e)=>updateFilter('priority', e.target.value)}
                    IconComponent={KeyboardArrowUpIcon}
                    sx={{ ...selectIconOffsetSx, '& .MuiSelect-select': { fontSize: font.body } }}
                    input={
                      <OutlinedInput
                        label="Priority"
                        sx={{ pr: `${SELECT_ICON_RIGHT_PX / 8 + 3}rem` }}
                        endAdornment={renderClearAdornment(() => updateFilter('priority', []), filters.priority.length === 0)}
                      />
                    }
                    renderValue={(selected)=>(
                      <Box sx={{ display:'flex', flexWrap:'wrap', gap:0.5 }}>
                        {selected.map(v => <Chip key={v} label={v} size={chipSize} sx={priorityChipSx(v)} />)}
                      </Box>
                    )}
                    MenuProps={{ PaperProps: { sx: { maxHeight: 320 } } }}
                  >
                    {PRIORITY.map(v=>{
                      const checked = filters.priority.indexOf(v)>-1;
                      return (
                        <MenuItem key={v} value={v} dense sx={{ fontSize: font.body }}>
                          <ListItemIcon><Checkbox edge="start" checked={checked} tabIndex={-1} disableRipple /></ListItemIcon>
                          <Chip label={v} size={chipSize} sx={priorityChipSx(v)} />
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>

                {/* Risk */}
                <FormControl size="small">
                  <InputLabel id="risk-label" sx={{ fontSize: font.body }}>Risk</InputLabel>
                  <Select
                    labelId="risk-label"
                    multiple
                    value={filters.risk}
                    onChange={(e)=>updateFilter('risk', e.target.value)}
                    IconComponent={KeyboardArrowUpIcon}
                    sx={{ ...selectIconOffsetSx, '& .MuiSelect-select': { fontSize: font.body } }}
                    input={
                      <OutlinedInput
                        label="Risk"
                        sx={{ pr: `${SELECT_ICON_RIGHT_PX / 8 + 3}rem` }}
                        endAdornment={renderClearAdornment(() => updateFilter('risk', []), filters.risk.length === 0)}
                      />
                    }
                    renderValue={(selected)=>(
                      <Box sx={{ display:'flex', flexWrap:'wrap', gap:0.5 }}>
                        {selected.map(v => <Chip key={v} label={v} size={chipSize} sx={riskChipSx(v)} />)}
                      </Box>
                    )}
                    MenuProps={{ PaperProps: { sx: { maxHeight: 320 } } }}
                  >
                    {RISK.map(v=>{
                      const checked = filters.risk.indexOf(v)>-1;
                      return (
                        <MenuItem key={v} value={v} dense sx={{ fontSize: font.body }}>
                          <ListItemIcon><Checkbox edge="start" checked={checked} tabIndex={-1} disableRipple /></ListItemIcon>
                          <Chip label={v} size={chipSize} sx={riskChipSx(v)} />
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>

                {/* Category */}
                <FormControl size="small">
                  <InputLabel id="category-label" sx={{ fontSize: font.body }}>Category</InputLabel>
                  <Select
                    labelId="category-label"
                    multiple
                    value={filters.category}
                    onChange={(e)=>updateFilter('category', e.target.value)}
                    IconComponent={KeyboardArrowUpIcon}
                    sx={{ ...selectIconOffsetSx, '& .MuiSelect-select': { fontSize: font.body } }}
                    input={
                      <OutlinedInput
                        label="Category"
                        sx={{ pr: `${SELECT_ICON_RIGHT_PX / 8 + 3}rem` }}
                        endAdornment={renderClearAdornment(() => updateFilter('category', []), filters.category.length === 0)}
                      />
                    }
                    renderValue={(selected)=>(
                      <Box sx={{ display:'flex', flexWrap:'wrap', gap:0.5 }}>
                        {selected.map(v=>{
                          const Icon = icons[v.replace(/\s+/g,'_')] || icons.others;
                          return (
                            <Chip
                              key={v}
                              label={<Box sx={{ display:'flex', alignItems:'center', gap:0.5 }}>{Icon && <Icon style={{ fontSize: 14 }} />}{v}</Box>}
                              size={chipSize}
                              sx={categoryChipSx}
                            />
                          );
                        })}
                      </Box>
                    )}
                    MenuProps={{ PaperProps: { sx: { maxHeight: 320 } } }}
                  >
                    {CATEGORY.map(v=>{
                      const checked = filters.category.indexOf(v)>-1;
                      const Icon = icons[v.replace(/\s+/g,'_')] || icons.others;
                      return (
                        <MenuItem key={v} value={v} dense sx={{ fontSize: font.body }}>
                          <ListItemIcon><Checkbox edge="start" checked={checked} tabIndex={-1} disableRipple /></ListItemIcon>
                          <Chip label={<Box sx={{ display:'flex', alignItems:'center', gap:0.5 }}>{Icon && <Icon style={{ fontSize: 14 }} />}{v}</Box>} size={chipSize} sx={categoryChipSx} />
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>

                {/* QC */}
                <FormControl size="small">
                  <InputLabel id="qc-label" sx={{ fontSize: font.body }}>Quality Control</InputLabel>
                  <Select
                    labelId="qc-label"
                    value={filters.qc}
                    onChange={(e)=>updateFilter('qc', e.target.value)}
                    IconComponent={KeyboardArrowUpIcon}
                    sx={{ ...selectIconOffsetSx, '& .MuiSelect-select': { fontSize: font.body } }}
                    input={
                      <OutlinedInput
                        label="Quality Control"
                        sx={{ pr: `${SELECT_ICON_RIGHT_PX / 8 + 3}rem` }}
                        endAdornment={renderClearAdornment(() => updateFilter('qc', ''), !filters.qc)}
                      />
                    }
                    renderValue={(selected)=> !selected ? (
                      <Typography sx={{ fontSize: font.subtle }} color="text.secondary">All</Typography>
                    ) : (
                      <Chip label={selected==='true'?'True':'False'} size={chipSize} sx={qcChipSx(selected)} />
                    )}
                  >
                    <MenuItem value="true" sx={{ fontSize: font.body }}><Chip label="True" size={chipSize} sx={qcChipSx('true')} /></MenuItem>
                    <MenuItem value="false" sx={{ fontSize: font.body }}><Chip label="False" size={chipSize} sx={qcChipSx('false')} /></MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Preview (8/12) — scroll X/Y dentro del TableContainer, sin rendija */}
        <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 8' }, gridRow: 'span 1', minWidth: 0, display: 'flex' }}>
          <Card variant="outlined" sx={{ flex: 1, display: 'grid', gridTemplateRows: 'auto minmax(0,1fr) auto', minHeight: 0 }}>
            <CardContent sx={{ p: gap.cardPad, pb: 0 }}>
              <Typography sx={{ fontWeight: 700, fontSize: font.body }}>Preview</Typography>
              <Typography sx={{ fontSize: font.subtle }} color="text.secondary">Showing sample data. Hook real data next.</Typography>
            </CardContent>

            <TableContainer
              sx={{
                height: '100%',
                minHeight: 0,
                px: gap.cardPad,  // mantenemos padding lateral como te gustaba
                pt: 0,            // sin padding-top => sticky header sin rendija
                overflowX: 'auto',
                overflowY: 'auto',
                scrollbarGutter: 'stable',
              }}
            >
              <Table
                size="small"
                stickyHeader
                sx={{
                  minWidth: 1200,
                  tableLayout: 'fixed',
                  '& .MuiTableCell-stickyHeader': {
                    top: 0,
                    zIndex: 3,
                    background: '#F5FAFF',
                  },
                }}
              >
                <TableHead>
                  <TableRow
                    sx={{
                      '& th': {
                        bgcolor: '#F5FAFF',
                        color: '#334155',
                        fontWeight: 700,
                        fontSize: font.tableHeader,
                        borderBottom: '1px solid #E6F0FA',
                        whiteSpace: 'nowrap',
                      },
                    }}
                  >
                    <TableCell>ID</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Agent</TableCell>
                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' }}}>Center</TableCell>
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' }}}>Department</TableCell>
                    <TableCell>Caller</TableCell>
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' }}}>Outcome</TableCell>
                    <TableCell>Priority</TableCell>
                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' }}}>Risk</TableCell>
                    <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' }}}>Category</TableCell>
                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' }}}>QC</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {pagedRows.map((r) => (
                    <TableRow
                      key={r.id}
                      hover
                      sx={{
                        '&:nth-of-type(odd)': { bgcolor: '#FAFCFF' },
                        '& td': { borderBottom: '1px solid #F1F5F9', fontSize: font.tableBody, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
                      }}
                    >
                      <TableCell>{r.id}</TableCell>
                      <TableCell>{r.date}</TableCell>
                      <TableCell>{r.agent}</TableCell>
                      <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' }}}>{r.center}</TableCell>
                      <TableCell sx={{ display: { xs: 'none', md: 'table-cell' }}}>{r.department}</TableCell>
                      <TableCell>{r.caller}</TableCell>
                      <TableCell sx={{ display: { xs: 'none', md: 'table-cell' }, textTransform: 'capitalize' }}>{r.outcome}</TableCell>
                      <TableCell><Chip label={r.priority} size="small" sx={priorityChipSx(r.priority)} /></TableCell>
                      <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' }}}><Chip label={r.risk} size="small" sx={riskChipSx(r.risk)} /></TableCell>
                      <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' }}}>
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
                      <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' }}}>
                        <Chip label={r.qc ? 'True' : 'False'} size="small" sx={qcChipSx(r.qc ? 'true' : 'false')} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ flexShrink: 0, px: gap.cardPad, py: 1, bgcolor: '#fff' }}>
              <TablePagination
                component="div"
                count={previewRows.length}
                page={page}
                onPageChange={(_, p) => setPage(p)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) => { setRpp(parseInt(e.target.value, 10)); setPage(0); }}
                rowsPerPageOptions={xs ? [10, 25] : [10, 25, 50]}
                sx={{ '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': { fontSize: font.subtle } }}
              />
            </Box>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
