import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import MergeIcon from '@mui/icons-material/Merge';

import { toMMDDYYYY } from '../../utils/js/formatDateToMMDDYYY';

const DOBCell = React.memo(function PatientCell({ snapshot, fallbackName, onOpenProfile }) {
  if (snapshot?.DOB) {
    console.log(snapshot.DOB.split('T')[0]);
    return (
      <Box display="flex" alignItems="center" gap={1}>
        <Tooltip title="MDVita patient">
          <IconButton size="small" color="success" onClick={onOpenProfile}>
            <MergeIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        { toMMDDYYYY(snapshot.DOB.split('T')[0]) }
      </Box>
    );
  }
  return <>{ toMMDDYYYY(fallbackName)}</>;
});

export default DOBCell;
