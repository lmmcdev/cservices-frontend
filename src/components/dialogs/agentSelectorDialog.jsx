// src/components/dialogs/agentSelectorDialog.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { Box, Dialog, DialogTitle, DialogContent, Typography } from '@mui/material';
import CollaboratorAutoComplete from '../fields/collaboratorAutocomplete';
import ActionButtons from '../fields/actionButtons';
import { icons } from '../auxiliars/icons';

export default function AgentSelectorDialog({
  open,
  onClose,
  onAdd,
  agents = [],
  // legacy: antes lo usabas para chips preseleccionados; ahora solo lo usamos para excluir
  initialSelected = [],
  // nuevo: email del Assigned To (se excluye del listado)
  assigneeEmail,
  // nuevo: lista de colaboradores actuales (emails o objetos con {email})
  existingCollaborators = [],
}) {
  // selección local SIEMPRE vacía al abrir (sin chips puestos)
  const [selected, setSelected] = useState([]);

  const isConfirmDisabled = selected.length === 0;

  useEffect(() => {
    if (open) setSelected([]); // reset al abrir
  }, [open]);

  // Normaliza emails ya colaboradores (usa existingCollaborators y también initialSelected por compatibilidad)
  const existingEmails = useMemo(() => {
    const base = [];
    if (Array.isArray(existingCollaborators)) base.push(...existingCollaborators);
    if (Array.isArray(initialSelected)) base.push(...initialSelected);
    return base
      .map((x) => (typeof x === 'string' ? x : x?.email))
      .filter(Boolean)
      .map((e) => String(e).toLowerCase());
  }, [existingCollaborators, initialSelected]);

  // Opciones disponibles: excluye Assigned y ya colaboradores
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
      maxWidth="xs"
      PaperProps={{
        sx: { width: '100%', maxWidth: 320, borderRadius: '15px' },
      }}
    >
      <DialogTitle sx={{ color: '#00A1FF', p: 2, textAlign: 'center' }}>
        <Box display="flex" alignItems="center" justifyContent="center">
          <icons.addCollaborator style={{ color: '#00a1ff', fontSize: 24, marginRight: 8 }} />
          <Typography variant="h6" sx={{ color: '#00A1FF', fontWeight: 'bold' }}>
            Add Collaborators
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent
        sx={{
          display: 'flex',
          justifyContent: 'center',
          px: 4,
          overflowY: 'visible',
          overflowX: 'visible',
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 400 }}>
          <Box display="flex" justifyContent="center" width="100%">
            <Box width="94%">
              <CollaboratorAutoComplete
                // 👉 ya viene filtrada sin Assigned ni colaboradores actuales
                agents={filteredAgents}
                // emails seleccionados en este diálogo
                selectedEmails={selected}
                // deduplicamos siempre
                onChange={(emails) =>
                  setSelected(
                    Array.from(new Set((emails || []).map((e) => String(e).trim()).filter(Boolean)))
                  )
                }
                label="Select users"
              />
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <ActionButtons
        onCancel={handleClose}
        onConfirm={handleAdd}
        confirmDisabled={isConfirmDisabled}
      />
    </Dialog>
  );
}
