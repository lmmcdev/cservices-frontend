import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import InsertLinkIcon from '@mui/icons-material/InsertLink';

const PatientCell = React.memo(function PatientCell({ snapshot, fallbackName, onOpenProfile }) {
  if (snapshot?.Name) {
    return (
      <Box display="flex" alignItems="center" gap={1}>
        <Tooltip title="Ver perfil de paciente">
          <IconButton size="small" color="success" onClick={onOpenProfile}>
            <InsertLinkIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        {snapshot.Name}
      </Box>
    );
  }
  return <>{fallbackName}</>;
});

export default PatientCell;
