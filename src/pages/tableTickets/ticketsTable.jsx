import React from 'react';
import { Paper, Table, TableBody, TableContainer, TableHead } from '@mui/material';
import TicketsTableHeader from './tableHeader.jsx';
import TicketsRow from './ticketsRow.jsx';

const TicketsTable = React.memo(function TicketsTable({
  rows,
  columnWidths,
  sortDirection,
  onToggleSort,
  onEditRow,
  onAssignRow,
  onOpenPatientProfile,
}) {
  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        maxHeight: '100%',
        overflowY: 'auto',
        '& thead th': {
          position: 'sticky',
          top: 0,
          backgroundColor: '#f6f7f9',
          zIndex: 1,
          boxShadow: '0px 2px 5px rgba(0,0,0,0.05)',
        },
      }}
    >
      <Table stickyHeader sx={{ tableLayout: 'fixed' }}>
        <TableHead>
          <TicketsTableHeader
            columnWidths={columnWidths}
            sortDirection={sortDirection}
            onToggleSort={onToggleSort}
          />
        </TableHead>

        <TableBody>
          {rows.map((row) => (
            <TicketsRow
              key={row.id}
              row={row}
              onEdit={onEditRow}
              onAssignToMe={onAssignRow}
              onOpenPatientProfile={onOpenPatientProfile}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
});

export default TicketsTable;
