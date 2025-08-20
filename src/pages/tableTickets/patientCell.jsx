import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import MergeIcon from '@mui/icons-material/Merge';

const PatientCell = React.memo(function PatientCell({ snapshot, fallbackName, onOpenProfile }) {
  if (snapshot?.Name) {
    return (
      <Box display="flex" alignItems="center" gap={1}>
        <Tooltip title="MDVita patient">
          <IconButton size="small" color="success" onClick={onOpenProfile}>
            <MergeIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        {snapshot.Name}
      </Box>
    );
  }
  return <>{fallbackName}</>;
});

export default PatientCell;
