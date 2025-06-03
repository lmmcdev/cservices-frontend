import React, { useEffect, useReducer, useState, useCallback } from 'react';
import { ticketReducer, initialState } from '../utils/ticketsReducer';
import { fetchTableData } from '../utils/api';
import { useLoading } from '../components/loadingProvider';
import { useAuth } from '../utils/authContext';
import {
  Box, Button, Chip, Typography, Card, CardContent,
  Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TablePagination, IconButton, Tooltip
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AssignAgentModal from '../components/dialogs/assignAgentDialog';
import { icons } from '../components/icons.js';
import { useNavigate } from 'react-router-dom';
import { useFilters } from '../utils/js/filterContext.js';
//import { emailToFullName } from '../utils/js/emailToFullName.js'


const statusColors = {
  New: { bg: '#FFE2EA', text: '#FF6692' },
  Emergency: { bg: '#FFF5DA', text: '#FFB900' },
  'In Progress': { bg: '#DFF3FF', text: '#00A1FF' },
  Pending: { bg: '#EAE8FA', text: '#8965E5' },
  Done: { bg: '#DAF8F4', text: '#00B8A3' },
  Duplicated: { bg: '#FFE3C4', text: '#FF8A00' },
  Total: { bg: 'transparent', text: '#0947D7' },
};

export default function TableTickets({ agents }) {
  const { filters } = useFilters();
  const [state, dispatch] = useReducer(ticketReducer, initialState);
  const { setLoading } = useLoading();
  const { user } = useAuth();
  const [selectedStatus, setSelectedStatus] = useState('Total');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const navigate = useNavigate();

  
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


  /*const filteredRows =
  selectedStatus === 'Total'
    ? validTickets
    : validTickets.filter((row) => row.status === selectedStatus);*/

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


  
  const paginatedRows = filteredRows.slice(
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

  return (
    <>
      <Card elevation={3} sx={{ borderRadius: 4, position: 'fixed', top: 170, left: 200, right: 20 }}>
        <CardContent>
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3, justifyContent: 'center' }}>
              {Object.keys(statusColors).map((status) => (
                <Button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  variant={selectedStatus === status ? 'contained' : 'outlined'}
                  sx={{
                    minWidth: 180,
                    aspectRatio: '1 / 0.5',
                    textTransform: 'none',
                    fontSize: 13,
                    fontWeight: 'bold',
                    borderRadius: 4,
                    backgroundColor: statusColors[status].bg,
                    color: statusColors[status].text,
                    borderColor: statusColors[status].text,
                    '&:hover': {
                      backgroundColor: statusColors[status].bg,
                    },
                  }}
                >
                  {status}
                </Button>
              ))}
            </Box>

            {error && (
              <Typography color="error" align="center" sx={{ mb: 2 }}>
                Error al cargar los tickets: {error}
              </Typography>
            )}

            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow>
                    {['Status', 'Caller ID', 'Name', 'DOB', 'Phone', 'Create At', '', ''].map((header) => (
                      <TableCell key={header} sx={{ fontWeight: 'bold', fontSize: 16 }}>
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedRows.map((row, idx) => (
                    <TableRow key={row.id} sx={{ '&:hover': { backgroundColor: '#f9fafb' } }}>
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
                      <TableCell>{row.phone}</TableCell>
                      <TableCell>{row.creation_date}</TableCell>
                      <TableCell>
                        <Box display="flex" justifyContent="center">
                          <Tooltip
                            title="Edit"
                            placement="bottom"
                            PopperProps={{
                              modifiers: [
                                {
                                  name: 'offset',
                                  options: {
                                    offset: [0, -8],
                                  },
                                },
                              ],
                            }}
                          >
                            <Box
                              sx={{
                                fontSize: 22,
                                color: '#00A1FF',
                                cursor: 'pointer',
                                '&:hover': { backgroundColor: 'transparent' },
                              }}
                              onClick={() =>
                                navigate(`/tickets/edit/${row.id}/${user.username}`, {
                                  state: { ticket: row, agents: agents },
                                })
                              }
                            >
                              <FontAwesomeIcon icon={icons.edit} />
                            </Box>
                          </Tooltip>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {row.agent_assigned === '' && (
                          <Tooltip
                            title="Assign to me"
                            placement="bottom"
                            PopperProps={{
                              modifiers: [
                                {
                                  name: 'offset',
                                  options: {
                                    offset: [0, -12],
                                  },
                                },
                              ],
                            }}
                          >
                            <IconButton
                              onClick={() => setSelectedTicket(row)}
                              sx={{
                                color: '#00a1ff',
                                '&:hover': {
                                  backgroundColor: 'transparent',
                                }}
                              }
                            >
                              <icons.assignToMe />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>

                      <TableCell>
                        {
                          row.agent_assigned
                          /*{(() => {
                          const [local] = row.agent_assigned[0].split("@");
                          const [first, last] = local.split(".");
                          return first && last
                            ? `${first[0].toUpperCase() + first.slice(1)} ${last[0].toUpperCase() + last.slice(1)}`
                            : row.agent_assigned;
                        })()}*/
                      }
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

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
