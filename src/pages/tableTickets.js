import React, { useEffect, useReducer, useState, useCallback } from 'react';
import { ticketReducer, initialState } from '../utils/ticketsReducer';
import { fetchTableData } from '../utils/api';
import { useLoading } from '../components/loadingProvider';
import { useAuth } from '../utils/authContext';
import {
  Box, Chip, Card, CardContent,
  Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TablePagination, IconButton, Tooltip
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AssignAgentModal from '../components/dialogs/assignAgentDialog';
import { icons } from '../components/icons.js';
import { useNavigate } from 'react-router-dom';
import { useFilters } from '../utils/js/filterContext.js';
import { useAgents } from '../components/components/agentsContext';
import StatusFilterBoxes from '../components/statusFilterBoxes.jsx';

const statusColors = {
  New: { bg: '#FFE2EA', text: '#FF6692' },
  Emergency: { bg: '#FFF5DA', text: '#FFB900' },
  'In Progress': { bg: '#DFF3FF', text: '#00A1FF' },
  Pending: { bg: '#EAE8FA', text: '#8965E5' },
  Done: { bg: '#DAF8F4', text: '#00B8A3' },
  Duplicated: { bg: '#FFE3C4', text: '#FF8A00' },
  Total: { bg: 'transparent', text: '#0947D7' },
};

export default function TableTickets() {
  const { state: agentsState } = useAgents();
  const agents = agentsState.agents;
  const { filters } = useFilters();
  const [state, dispatch] = useReducer(ticketReducer, initialState);
  const { setLoading } = useLoading();
  const { user } = useAuth();
  const [selectedStatus, setSelectedStatus] = useState('Total');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const navigate = useNavigate();
  const [sortDirection, setSortDirection] = useState('desc');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      await fetchTableData(dispatch, setLoading, user.username);
    } finally {
      setLoading(false);
    }
  }, [dispatch, setLoading, user.username]);

  useEffect(() => {
    if (!user?.username) return;
    loadData();
  }, [loadData, user?.username]);

  useEffect(() => {
    setPage(0);
  }, [selectedStatus]);

  const handleAssignAgent = (ticketId, agentEmail) => {
    console.log("Asignar", agentEmail, "al ticket", ticketId);
  };

  const filteredRows = Array.isArray(state.tickets)
    ? state.tickets.filter(row => {
        const matchStatus = selectedStatus === 'Total' || row.status === selectedStatus;
        const matchAgent = filters.assignedAgents.length === 0 || filters.assignedAgents.includes(row.agent_assigned);
        const matchCaller = filters.callerIds.length === 0 || filters.callerIds.includes(row.caller_id);
        const matchDate = !filters.date || row.creation_date?.startsWith(filters.date);
        return matchStatus && matchAgent && matchCaller && matchDate;
      })
    : [];

  const sortedRows = [...filteredRows].sort((a, b) => {
    const dateA = new Date(a.creation_date);
    const dateB = new Date(b.creation_date);
    return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
  });

  const paginatedRows = sortedRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const ticketsCountByStatus = state.tickets?.reduce((acc, ticket) => {
    const status = ticket.status || 'Unknown';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {}) || {};
  ticketsCountByStatus.Total = filteredRows.length;

  //ancho fijo para las columnas
  const columnWidths = {
    status: 120,
    callerId: 120,
    name: 160,
    dob: 120,
    phone: 130,
    createdAt: 160,
    edit: 80,
    assign: 80,
    assignedTo: 160
  };
  return (
    <>
      <Card elevation={3} sx={{ borderRadius: 4, position: 'fixed', top: 170, left: 200, right: 20 }}>
        <CardContent>
          <Box sx={{ flexGrow: 1, mt: 4 }}>
            <StatusFilterBoxes
              statusColors={statusColors}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
              ticketsCountByStatus={ticketsCountByStatus}
            />

            <TableContainer component={Paper} elevation={0} sx={{ maxHeight: 500, overflowY: 'auto' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: columnWidths.status, minWidth: columnWidths.status, fontWeight: 'bold', pl: 2 }}>
                      Status
                    </TableCell>
                    <TableCell sx={{ width: columnWidths.callerId, minWidth: columnWidths.callerId, fontWeight: 'bold' }}>
                      Caller ID
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
                      onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
                    >
                      Created At{' '}
                      <FontAwesomeIcon
                        icon={sortDirection === 'asc' ? icons.arrowUp : icons.arrowDown}
                        style={{ marginLeft: 8 }}
                      />
                    </TableCell>
                    <TableCell sx={{ width: columnWidths.edit, minWidth: columnWidths.edit }}></TableCell>
                    <TableCell sx={{ width: columnWidths.assign, minWidth: columnWidths.assign }}></TableCell>
                    <TableCell sx={{ width: columnWidths.assignedTo, minWidth: columnWidths.assignedTo, fontWeight: 'bold' }}>
                      Assigned To
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedRows.map((row, idx) => (
                    <TableRow key={row.id || `fallback-${idx}`} sx={{ '&:hover': { backgroundColor: '#f9fafb' } }}>
                      <TableCell>
                        <Chip
                          label={row.status}
                          sx={{
                            backgroundColor: statusColors[row.status]?.bg || '#e0e0e0',
                            color: statusColors[row.status]?.text || '#000',
                            fontWeight: 'bold',
                            fontSize: 14,
                            px: 1,
                            py: 0.5,
                            borderRadius: '16px',
                          }}
                        />
                      </TableCell>
                      <TableCell>{row.caller_id}</TableCell>
                      <TableCell>{row.patient_name}</TableCell>
                      <TableCell>{row.patient_dob}</TableCell>
                      <TableCell>{row.phone || 'N/A'}</TableCell>
                      <TableCell>{row.creation_date}</TableCell>
                      <TableCell>
                        <Tooltip title="Edit">
                          <Box
                            sx={{ fontSize: 22, color: '#00A1FF', cursor: 'pointer' }}
                            onClick={() => navigate(`/tickets/edit/${row.id}`, {
                              state: { ticket: row, agents: agents },
                            })}
                          >
                            <FontAwesomeIcon icon={icons.edit} />
                          </Box>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        {!row.agent_assigned && (
                          <Tooltip title="Assign to me">
                            <IconButton
                              onClick={() => setSelectedTicket(row)}
                              sx={{ color: '#00a1ff' }}
                            >
                              <icons.assignToMe />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                      <TableCell>{row.agent_assigned}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={filteredRows.length}
              page={page}
              onPageChange={(e, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={e => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              rowsPerPageOptions={[5, 10, 25, 50]}
            />
          </Box>
        </CardContent>
      </Card>

      {selectedTicket && user?.username && (
        <AssignAgentModal
          open={!!selectedTicket}
          onClose={() => setSelectedTicket(null)}
          ticket={selectedTicket}
          agentEmail={user.username}
          dispatch={dispatch}
          setLoading={setLoading}
          onAssign={handleAssignAgent}
        />
      )}
    </>
  );
}
