// src/pages/tableTickets.jsx
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useAuth } from '../context/authContext.js';
import { useTickets } from '../context/ticketsContext.js';
import { Box, Card, CardContent, TablePagination } from '@mui/material';
import AssignAgentModal from '../components/dialogs/assignAgentDialog';
import { useNavigate } from 'react-router-dom';
import { useFilters } from '../context/filterContext.js';
import StatusFilterBoxes from '../components/auxiliars/statusFilterBoxes.jsx';
import {
  filterTickets,
  sortByCreatedAt,
  paginate,
} from '../utils/tickets/selectors.js';
import TicketsTable from './tableTickets/ticketsTable.jsx';
import { useTicketsData } from '../components/hooks/useTicketsData.js';

// <-- helper local (puedes moverlo a selectors.js si quieres reutilizarlo)
const KNOWN_STATUSES = ['New', 'Emergency', 'In Progress', 'Pending', 'Done', 'Duplicated'];
function countByStatus(rows = []) {
  const acc = Object.fromEntries(KNOWN_STATUSES.map(s => [s, 0]));
  for (const r of rows) {
    const s = r?.status;
    if (acc.hasOwnProperty(s)) acc[s] += 1;
  }
  acc.Total = rows.length;
  return acc;
}

export default function TableTickets() {
  const { filters } = useFilters();
  const { dispatch } = useTickets();
  const { user } = useAuth();
  const navigate = useNavigate();

  const { tickets, ticketsVersion } = useTicketsData({ auto: true });

  const [selectedStatus, setSelectedStatus] = useState('Total');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [sortDirection, setSortDirection] = useState('desc');

  useEffect(() => { setPage(0); }, [selectedStatus]);

  const columnWidths = useMemo(() => ({
    status: 110, callerId: 120, name: 160, dob: 120, phone: 130, createdAt: 160, assignedTo: 160
  }), []);

  // 1) Base filtrada por TODO excepto status -> sirve para los contadores
  const baseRows = useMemo(() => (
    filterTickets(tickets, {
      status: 'Total', // <-- sin filtro de estado
      agents: filters.assignedAgents,
      callers: filters.callerIds,
      date: filters.date,
      departments: filters.assignedDepartment
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [ticketsVersion, tickets, filters]);

  // 2) Filtrado final para la tabla (incluye selectedStatus)
  const filteredRows = useMemo(() => (
    filterTickets(tickets, {
      status: selectedStatus,
      agents: filters.assignedAgents,
      callers: filters.callerIds,
      date: filters.date,
      departments: filters.assignedDepartment
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [ticketsVersion, tickets, selectedStatus, filters]);

  const sortedRows = useMemo(
    () => sortByCreatedAt(filteredRows, sortDirection),
    [filteredRows, sortDirection]
  );

  const paginatedRows = useMemo(
    () => paginate(sortedRows, page, rowsPerPage),
    [sortedRows, page, rowsPerPage]
  );

  // 3) Contadores dinámicos basados en baseRows
  const ticketsCountByStatus = useMemo(
    () => countByStatus(baseRows),
    [baseRows]
  );

  const handleChangePage = (_e, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); };
  const handleToggleSort = () => setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));

  const handleEditRow = useCallback((row) => {
    navigate(`/tickets/edit/${row.id}`, { state: { row } });
  }, [navigate]);

  const handleAssignRow = useCallback((row) => {
    setSelectedTicket(row);
  }, []);

  const handleAssignedSuccess = useCallback((updatedTicket) => {
    if (updatedTicket?.id) dispatch({ type: 'UPD_TICKET', payload: updatedTicket });
  }, [dispatch]);

  return (
    <>
      <Card
        sx={{
          borderRadius: 4,
          position: 'fixed',
          top: 150,
          left: 'calc(var(--drawer-width, 80px) + var(--content-gap))',
          right: 39,
          bottom: 39,
          transition: 'left .3s ease',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0px 8px 24px rgba(239, 241, 246, 1)',
          bgcolor: '#fff',
        }}
      >
        <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <Box sx={{ flexShrink: 0, px: 4, pt: 4, pb: 2 }}>
            <StatusFilterBoxes
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
              ticketsCountByStatus={ticketsCountByStatus} // <-- ahora dinámico
            />
          </Box>

          <Box sx={{ flex: 1, overflow: 'hidden', px: 4 }}>
            <TicketsTable
              rows={paginatedRows}
              columnWidths={columnWidths}
              sortDirection={sortDirection}
              onToggleSort={handleToggleSort}
              onEditRow={handleEditRow}
              onAssignRow={handleAssignRow}
              onOpenPatientProfile={() => {}}
            />
          </Box>

          <Box sx={{ flexShrink: 0, px: 4, py: 1, bgcolor: '#fff' }}>
            <TablePagination
              component="div"
              count={filteredRows.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 50]}
            />
          </Box>
        </CardContent>
      </Card>

      {selectedTicket && user?.username && (
        <AssignAgentModal
          open
          onClose={() => setSelectedTicket(null)}
          ticket={selectedTicket}
          agentEmail={user.username}
          dispatch={dispatch}
          onAssigned={handleAssignedSuccess}
        />
      )}
    </>
  );
}
