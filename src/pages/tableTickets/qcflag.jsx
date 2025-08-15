import React from 'react';
import { Chip, Tooltip } from '@mui/material';

const QCFlag = React.memo(function QCFlag({ visible }) {
  if (!visible) return null;
  return (
    <Tooltip title="This ticket had been marked by quality control">
      <Chip
        label="QC"
        size="small"
        sx={{
          bgcolor: 'rgba(124, 58, 237, 0.12)',
          color: '#7c3aed',
          fontWeight: 'bold',
          height: 22,
          borderRadius: '8px',
          '& .MuiChip-label': { px: '6px', fontSize: 11 },
        }}
      />
    </Tooltip>
  );
});

export default QCFlag;
