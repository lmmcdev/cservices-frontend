// src/components/dialogs/agentSelectorDialog.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { Box, Dialog, Typography, Chip } from '@mui/material';
import ActionButtons from '../fields/actionButtons';
import { icons } from '../auxiliars/icons';

import CollaboratorsDeepSearch from './collaboratorsDeepSearch';

export default function AgentSelectorDialog({
  open,
  onClose,
  onAdd,
  agents = [],
  initialSelected = [],
  assigneeEmail,
  existingCollaborators = [],
}) {
  const [selected, setSelected] = useState([]);
  const isConfirmDisabled = selected.length === 0;

  useEffect(() => {
    if (open) setSelected([]);
  }, [open]);

  const existingEmails = useMemo(() => {
    const base = [];
    if (Array.isArray(existingCollaborators)) base.push(...existingCollaborators);
    if (Array.isArray(initialSelected)) base.push(...initialSelected);
    return base
      .map((x) => (typeof x === 'string' ? x : x?.email))
      .filter(Boolean)
      .map((e) => String(e).toLowerCase());
  }, [existingCollaborators, initialSelected]);

  const filteredAgents = useMemo(() => {
    const assignee = (assigneeEmail || '').toLowerCase();
    const exclude = new Set([assignee, ...existingEmails].filter(Boolean));
    return (agents || []).filter((a) => {
      const e = String(a?.email || '').toLowerCase();
      return e && !exclude.has(e);
    });
  }, [agents, assigneeEmail, existingEmails]);

  const handleAdd = () => {
    const unique = Array.from(new Set((selected || []).map((s) => s.trim()).filter(Boolean)));
    if (unique.length === 0) {
      onClose?.();
      return;
    }
    onAdd?.(unique);
    onClose?.();
  };

  const handleClose = () => {
    setSelected([]);
    onClose?.();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          width: '100%',
          maxWidth: 960,
          borderRadius: 3,
          overflow: 'hidden',
          bgcolor: '#fafcff',
          border: '1px solid #eaf1f7',
        },
      }}
    >
      {/* Header sticky con color unificado */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 2,
          px: 3,
          py: 2,
          bgcolor: '#fff',
          borderBottom: '1px solid #e6eef5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* 👇 color centralizado; ícono y texto usan currentColor */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#00a1ff' }}>
          <icons.addCollaborator style={{ fontSize: 24, color: 'currentColor' }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'currentColor' }}>
            Add Collaborators
          </Typography>
        </Box>

        <Chip
          label={`${selected.length} selected`}
          size="small"
          sx={{ bgcolor: '#eef7ff', color: '#007bc7', fontWeight: 600 }}
        />
      </Box>

      {/* Content scrollable */}
      <Box
        sx={{
          px: 3,
          py: 2,
          maxHeight: '70vh',
          overflowY: 'auto',
        }}
      >
        <CollaboratorsDeepSearch
          agents={filteredAgents}
          selectedEmails={selected}
          onChangeSelected={setSelected}
          placeholder="Search by name, email..."
        />
      </Box>

      {/* Footer sticky */}
      <Box
        sx={{
          position: 'sticky',
          bottom: 0,
          zIndex: 2,
          px: 3,
          pt: 1.5,
          pb: 2.5,
          bgcolor: '#fff',
          borderTop: '1px solid #e6eef5',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 1.5,
        }}
      >
        <ActionButtons
          onCancel={handleClose}
          onConfirm={handleAdd}
          confirmDisabled={isConfirmDisabled}
        />
      </Box>
    </Dialog>
  );
}
