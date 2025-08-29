// --- file: src/components/auxiliars/tickets/ticketIndicators.jsx
import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { Box, Tooltip, IconButton, Stack } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import FlagIcon from '@mui/icons-material/Flag';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import { getCategoryIcon } from '../../../utils/js/ticketIndicatorGetCatIcon';
import { getRiskColor } from '../../../utils/js/ticketIndicatorGetRiskColor';
import { getPriorityColor } from '../../../utils/js/ticketIndicatorGetPriorColor';
import { RiskSelect } from '../../fields/riskSelect';
import { CategorySelect } from '../../fields/categorySelect';
import { PrioritySelect } from '../../fields/prioritySelect';

/**
 * Props:
 * - ai_data: { priority, risk, category }
 * - ticketId: string (requerido para guardar)
 * - editable?: boolean
 * - iconsOnly?: boolean
 * - columnLayout?: boolean
 * - showTooltip?: boolean
 * - onSaveAiClassification?: (ticketId, {priority, risk, category}) => Promise<any>
 */
export function TicketIndicators({
  ai_data,
  ticketId,
  editable = false,
  showTooltip = false,
  iconsOnly = false,
  columnLayout = false,
  onSaveAiClassification,
}) {
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
  const handleChange = useCallback((k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value })), []);

  const hasChanges = useMemo(() => (
    form.priority !== base.priority ||
    form.risk !== base.risk ||
    form.category !== base.category
  ), [form, base]);

  const handleSave = useCallback(async () => {
    if (!ticketId) return;
    if (!hasChanges) { setIsEditing(false); return; }
    try {
      setSaving(true);
      const aiClassification = {
        priority: form.priority,
        risk: form.risk,
        category: form.category,
      };
      await onSaveAiClassification?.(ticketId, aiClassification);
      setIsEditing(false);
    } finally {
      setSaving(false);
    }
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
          <PrioritySelect value={form.priority} onChange={handleChange('priority')} sx={{ minWidth: 110 }} />
        )}
      </Box>

      {/* RISK */}
      {(isEditing || (ai_data?.risk || '').toLowerCase() !== 'none') && (
        <Box display="flex" alignItems="center" gap={1}>
          {showTooltip ? (
            <Tooltip title={`Risk: ${isEditing ? form.risk : (ai_data?.risk || '')}`}>{riskIcon}</Tooltip>
          ) : riskIcon}

          {!iconsOnly && isEditing && (
            <RiskSelect value={form.risk} onChange={handleChange('risk')} sx={{ minWidth: 120 }} />
          )}
        </Box>
      )}

      {/* CATEGORY */}
      <Box display="flex" alignItems="center" gap={1}>
        {showTooltip ? (
          <Tooltip title={`Category: ${isEditing ? form.category : (ai_data?.category || '')}`}>{categoryIcon}</Tooltip>
        ) : categoryIcon}

        {!iconsOnly && isEditing && (
          <CategorySelect value={form.category} onChange={handleChange('category')} sx={{ minWidth: 160 }} />
        )}
      </Box>
    </Box>
  );
}
