import React from 'react';
import { Box, TableRow, TableCell } from '@mui/material';
import { SortAscending, SortDescending } from 'phosphor-react';

const TicketsTableHeader = React.memo(function TicketsTableHeader({
  columnWidths, sortDirection, onToggleSort,
}) {
  return (
    <TableRow>
      <TableCell sx={{ width: columnWidths.status, minWidth: columnWidths.status, fontWeight: 'bold' }}>
        Status
      </TableCell>
      <TableCell sx={{ width: 100, fontWeight: 'bold' }}>Flags</TableCell>
      <TableCell sx={{ width: columnWidths.callerId, minWidth: columnWidths.callerId, fontWeight: 'bold' }}>
        Location
      </TableCell>
      <TableCell sx={{ width: columnWidths.name, minWidth: columnWidths.name, fontWeight: 'bold' }}>
        Name
      </TableCell>
      <TableCell sx={{ width: columnWidths.dob, minWidth: columnWidths.dob, fontWeight: 'bold' }}>
        DOB
      </TableCell>
      <TableCell sx={{ width: columnWidths.phone, minWidth: columnWidths.phone, fontWeight: 'bold' }}>
        Phone
      </TableCell>
      <TableCell
        sx={{
          width: columnWidths.createdAt,
          minWidth: columnWidths.createdAt,
          fontWeight: 'bold',
          cursor: 'pointer',
          userSelect: 'none',
          whiteSpace: 'nowrap',
        }}
        onClick={onToggleSort}
      >
        <Box display="flex" alignItems="center">
          Created At&nbsp;
          {sortDirection === 'asc'
            ? <SortAscending size={20} weight="bold" style={{ marginLeft: 8 }} />
            : <SortDescending size={20} weight="bold" style={{ marginLeft: 8 }} />
          }
        </Box>
      </TableCell>
      <TableCell sx={{ width: columnWidths.assignedTo, minWidth: columnWidths.assignedTo, fontWeight: 'bold' }}>
        Assigned To
      </TableCell>
      <TableCell sx={{ width: 120, fontWeight: 'bold', textAlign: 'center' }}>
        Action
      </TableCell>
    </TableRow>
  );
});

export default TicketsTableHeader;
