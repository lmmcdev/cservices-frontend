import React, { useEffect, useState, useCallback } from 'react';
import { fetchTableData } from '../utils/api';
import { useLoading } from '../providers/loadingProvider.jsx';
import { useAuth } from '../context/authContext.js';
import { useTickets } from '../context/ticketsContext.js';
import {
  Box, Chip, Typography, Card, CardContent,
  Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TablePagination, IconButton, Tooltip
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AssignAgentModal from '../components/dialogs/assignAgentDialog';
import { icons } from '../components/auxiliars/icons.js';
import { useNavigate } from 'react-router-dom';
import { useFilters } from '../context/filterContext.js';
//import { emailToFullName } from '../utils/js/emailToFullName.js'
import StatusFilterBoxes from '../components/statusFilterBoxes';


const statusColors = {
  New: { bg: '#FFE2EA', text: '#FF6692' },
  Emergency: { bg: '#FFF5DA', text: '#FFB900' },
  'In Progress': { bg: '#DFF3FF', text: '#00A1FF' },
  Pending: { bg: '#EAE8FA', text: '#8965E5' },
  Done: { bg: '#DAF8F4', text: '#00B8A3' },
  Duplicated: { bg: '#FFE3C4', text: '#FF8A00' },
  Total: { bg: '#f1f5ff', text: '#0947D7' },
};

export default function TableTickets() {
  const { filters } = useFilters();
  const { state, dispatch } = useTickets();
  //const [state, dispatch] = useReducer(ticketReducer, initialState);
  const { setLoading } = useLoading();
  const { user } = useAuth();
  const [selectedStatus, setSelectedStatus] = useState('Total');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const navigate = useNavigate();
  const [sortDirection, setSortDirection] = useState('desc');

  //comprobar aqui si existe user.username
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

  const { tickets, error } = state;
  const validTickets = Array.isArray(tickets) ? tickets : [];
     //filtros de la tabla
    const filteredRows = validTickets.filter((row) => {
      const matchStatus = selectedStatus === 'Total' || row.status === selectedStatus;
      const matchAgent =
        filters.assignedAgents.length === 0 || filters.assignedAgents.includes(row.agent_assigned);
      const matchCaller =
        filters.callerIds.length === 0 || filters.callerIds.includes(row.caller_id);
      const matchDate =
        !filters.date || row.creation_date?.startsWith(filters.date); // suponiendo formato 'YYYY-MM-DD...'

      return matchStatus && matchAgent && matchCaller && matchDate;
    });

  const sortedRows = [...filteredRows].sort((a, b) => {
    const dateA = new Date(a.creation_date);
    const dateB = new Date(b.creation_date);
    return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
  });

  const paginatedRows = sortedRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  //conteo de los tickets
  const ticketsCountByStatus = validTickets.reduce((acc, ticket) => {
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
      <Card elevation={3} sx={{ borderRadius: 4, position: 'fixed', top: 170, left: 200, right: 20, bottom: 20, display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/*FILTROS*/}
          <Box sx={{ flexShrink: 0, mt: 4 }}>
            <StatusFilterBoxes
              statusColors={statusColors}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
              ticketsCountByStatus={ticketsCountByStatus}
            />
            {error && (
              <Typography color="error" align="center" sx={{ mb: 2 }}>
                Error al cargar los tickets: {error}
              </Typography>
            )}
          </Box>

          {/*TABLA CON SCROLL INTERNO*/}
          <Box sx={{ flex: 1, overflowY: 'auto' }}>
            <TableContainer component={Paper} elevation={0}>
              <Table stickyHeader sx={{ tableLayout: 'fixed' }}>
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
                    <TableRow key={row.id && row.id !== '' ? row.id : `fallback-${idx}`} sx={{ '&:hover': { backgroundColor: '#f9fafb' } }}>
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
                        <Box display="flex" justifyContent="center">
                          {row.agent_assigned !== '' && (
                              <Tooltip title="Edit" placement="bottom">
                                <Box
                                  sx={{
                                    fontSize: 22,
                                    color: '#00A1FF',
                                    cursor: 'pointer',
                                    '&:hover': { backgroundColor: 'transparent' },
                                  }}
                                  onClick={() =>
                                    navigate(`/tickets/edit/${row.id}`, {
                                      state: { ticket: row },
                                    })
                                  }
                                >
                                  <FontAwesomeIcon icon={icons.edit} />
                                </Box>
                            </Tooltip>
                          )}
                          
                        </Box>
                      </TableCell>
                      <TableCell>
                        {row.agent_assigned === '' && (
                          <Tooltip title="Assign to me" placement="bottom">
                            <IconButton
                              onClick={() => setSelectedTicket(row)}
                              sx={{
                                color: '#00a1ff',
                                '&:hover': {
                                  backgroundColor: 'transparent',
                                },
                              }}
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
          </Box>

          {/*PAGINADOR - FIJO ABAJO*/}
          <Box sx={{ flexShrink: 0, px: 2, py: 1, backgroundColor: '#fff' }}>
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
