// src/components/auxiliars/tickets/ticketIndicators.jsx
import React, { useMemo, useState, useCallback, useEffect } from 'react';
import {
  Typography, Box, Tooltip, IconButton, Stack, Select, MenuItem, Button,
  Divider
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';

import FlagIcon from '@mui/icons-material/Flag';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import DepartureBoardIcon from '@mui/icons-material/DepartureBoard';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ElderlyIcon from '@mui/icons-material/Elderly';
import NoAccountsIcon from '@mui/icons-material/NoAccounts';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import HelpIcon from '@mui/icons-material/Help';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

import { useNotification } from '../../../context/notificationsContext';

// --- helpers de estilo
export const getPriorityColor = (priority) => {
  switch ((priority || '').toLowerCase()) {
    case 'high': return '#d32f2f';
    case 'medium': return '#fbc02d';
    case 'low': return '#388e3c';
    default: return '#bdbdbd';
  }
};
export const getRiskColor = (risk) => {
  switch ((risk || '').toLowerCase()) {
    case 'none': return '#4caf50';
    case 'legal': return '#ff9800';
    case 'disenrollment': return '#f44336';
    default: return '#bdbdbd';
  }
};
export const getCategoryIcon = (category) => {
  const cat = (category || '').toLowerCase();
  switch (cat) {
    case 'transport': return <DepartureBoardIcon fontSize="small" />;
    case 'appointment': return <CalendarMonthIcon fontSize="small" />;
    case 'new patient': return <ElderlyIcon fontSize="small" />;
    case 'disenrollment': return <NoAccountsIcon fontSize="small" />;
    case 'customer service': return <SupportAgentIcon fontSize="small" />;
    case 'new address': return <AddLocationAltIcon fontSize="small" />;
    case 'hospitalization': return <LocalHospitalIcon fontSize="small" />;
    case 'others': return <HelpIcon fontSize="small" />;
    default: return <HelpIcon fontSize="small" />;
  }
};

const PRIORITY_OPTS = ['high', 'medium', 'low'];
const RISK_OPTS = ['none', 'legal', 'disenrollment'];
const CATEGORY_OPTS = [
  'transport',
  'appointment',
  'new patient',
  'disenrollment',
  'customer service',
  'new address',
  'hospitalization',
  'others',
];

/**
 * Props:
 * - ai_data: { priority, risk, category }
 * - ticketId: string (requerido para guardar)
 * - editable?: boolean
 * - iconsOnly?: boolean
 * - columnLayout?: boolean
 * - showTooltip?: boolean
 * - onSaveAiClassification?: (ticketId, {priority, risk, category}) => Promise<any>   <-- callback desde el padre
 * - onUpdated?: (result) => void
 */
export function TicketIndicators({
  ai_data,
  ticketId,
  editable = false,
  showTooltip = false,
  iconsOnly = false,
  columnLayout = false,
  onSaveAiClassification,   // <- usamos esta función
  onUpdated,
}) {
  const { showNotification } = useNotification?.() || { showNotification: () => {} };

  const base = useMemo(() => ({
    priority: ai_data?.priority || 'medium',
    risk: ai_data?.risk || 'none',
    category: ai_data?.category || 'others',
  }), [ai_data?.priority, ai_data?.risk, ai_data?.category]);

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(base);

  useEffect(() => { if (!isEditing) setForm(base); }, [base, isEditing]);

  const canEdit = editable && !iconsOnly;

  const priorityIcon = (
    <FlagIcon sx={{ color: getPriorityColor(isEditing ? form.priority : ai_data?.priority), fontSize: 20 }} />
  );
  const riskIcon = (
    <ReportProblemIcon sx={{ color: getRiskColor(isEditing ? form.risk : ai_data?.risk), fontSize: 20 }} />
  );
  const categoryIcon = React.cloneElement(
    getCategoryIcon(isEditing ? form.category : ai_data?.category),
    { sx: { color: '#00a1ff', fontSize: 20 } }
  );

  const handleEdit = useCallback(() => { setForm(base); setIsEditing(true); }, [base]);
  const handleCancel = useCallback(() => { setForm(base); setIsEditing(false); }, [base]);
  const handleChange = useCallback((k) => (e) => setForm(p => ({ ...p, [k]: e.target.value })), []);

  const hasChanges = useMemo(() => (
    form.priority !== base.priority ||
    form.risk !== base.risk ||
    form.category !== base.category
  ), [form, base]);

  const handleSave = useCallback(async () => {
    if (!ticketId) return;
    if (!hasChanges) { setIsEditing(false); return; }

    const aiClassification = {
      priority: form.priority,
      risk: form.risk,
      category: form.category,
    };

    await onSaveAiClassification?.(ticketId, aiClassification); // 👈 usa la prop
    setIsEditing(false);
  }, [ticketId, hasChanges, form, onSaveAiClassification]);

  if (!ai_data && !isEditing) return null;

  return (
    <Box
      display="flex"
      flexDirection={columnLayout ? 'column' : 'row'}
      alignItems={columnLayout ? 'flex-start' : 'center'}
      gap={1.25}
    >
      {canEdit && (
        <Box display="flex" alignItems="center" gap={0.5} sx={{ mb: columnLayout ? 0.5 : 0 }}>
          {!isEditing ? (
            <Tooltip title="Edit AI classification">
              <IconButton size="small" onClick={handleEdit}><EditIcon fontSize="small" /></IconButton>
            </Tooltip>
          ) : (
            <Stack direction="row" spacing={0.5}>
              <Tooltip title="Save">
                <span>
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={handleSave}
                    disabled={saving || !hasChanges}
                  >
                    <SaveIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title="Cancel">
                <IconButton size="small" color="inherit" onClick={handleCancel} disabled={saving}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          )}
        </Box>
      )}

      {/* PRIORITY */}
      <Box display="flex" alignItems="center" gap={1}>
        {showTooltip ? (
          <Tooltip title={`Priority: ${isEditing ? form.priority : (ai_data?.priority || '')}`}>{priorityIcon}</Tooltip>
        ) : priorityIcon}
        
        {!iconsOnly && isEditing && (
          <Select size="small" value={form.priority} onChange={handleChange('priority')} sx={{ minWidth: 100, borderRadius: 2, fontSize: 10  }}>
            {PRIORITY_OPTS.map(v => <MenuItem key={v} value={v}>{v}</MenuItem>)}
          </Select>
        )}
      </Box>

      {/* RISK */}
      {(isEditing || (ai_data?.risk || '').toLowerCase() !== 'none') && (
        <Box display="flex" alignItems="center" gap={1}>
          {showTooltip ? (
            <Tooltip title={`Risk: ${isEditing ? form.risk : (ai_data?.risk || '')}`}>{riskIcon}</Tooltip>
          ) : riskIcon}
          
          {!iconsOnly && isEditing && (
            <Select size="small" value={form.risk} onChange={handleChange('risk')} sx={{ minWidth: 100, borderRadius: 2, fontSize: 10 }}>
              {RISK_OPTS.map(v => <MenuItem key={v} value={v}>{v}</MenuItem>)}
            </Select>
          )}
        </Box>
      )}

      {/* CATEGORY */}
      <Box display="flex" alignItems="center" gap={1}>
        {showTooltip ? (
          <Tooltip title={`Category: ${isEditing ? form.category : (ai_data?.category || '')}`}>{categoryIcon}</Tooltip>
        ) : categoryIcon}

        {!iconsOnly && isEditing && (
          <Select size="small" value={form.category} onChange={handleChange('category')} sx={{ minWidth: 100, borderRadius: 2, fontSize: 10  }}>
            {CATEGORY_OPTS.map(v => <MenuItem key={v} value={v}>{v}</MenuItem>)}
          </Select>
        )}
      </Box>

      {/*canEdit && isEditing && (
        <Stack direction="row" spacing={1} sx={{ ml: columnLayout ? 0 : 1 }}>
          <Button size="small" variant="contained" onClick={handleSave} startIcon={<SaveIcon />} disabled={saving || !hasChanges}>
            Save
          </Button>
          <Button size="small" variant="text" onClick={handleCancel} startIcon={<CloseIcon />} disabled={saving}>
            Cancel
          </Button>
        </Stack>
      )*/}
    </Box>
  );
}
