import React, { useState, useReducer } from 'react';
import { ticketReducer, initialState } from '../store/ticketsReducer';
import { useLoading } from '../providers/loadingProvider';
import AlertSnackbar from '../components/auxiliars/alertSnackbar';

import {
  Box, Card, CardContent, Typography,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, TablePagination, Paper, Tooltip, IconButton
} from '@mui/material';
import { icons } from '../components/auxiliars/icons';
import { useNavigate } from 'react-router-dom';
import CreateAgentModal from '../components/dialogs/createAgentDialog';
import { useAgents } from '../context/agentsContext';
import { useGraphEmailCheck } from '../utils/useGraphEmailCheck';
import { useAuth } from '../context/authContext.js';
import { submitNewAgent, updateAgent } from '../utils/js/agentActions.js';

export default function TableAgents() {
  const { state } = useAgents();
  const agents = state.agents;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const navigate = useNavigate();
  const [, dispatch] = useReducer(ticketReducer, initialState);
  const { setLoading } = useLoading();
  const { user } = useAuth();
  const { verifyEmailExists } = useGraphEmailCheck();

  const [errorOpen, setErrorOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');


    const paginatedAgents = agents.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  

  return (
    <>
      <Card
        sx={{
          borderRadius: 4,
          position: 'fixed',
          top: 150,
          left: 220,
          right: 20,
          bottom: 20,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0px 8px 24px rgba(239, 241, 246, 1)',
          backgroundColor: '#fff',
        }}
      >
        <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* HEADER Y BOTÓN */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} mt={2} pl={3} pr={3}>
            <Box display="flex" alignItems="center" gap={1}>
              <Box
                sx={{
                  width: 8,
                  height: 24,
                  borderRadius: 10,
                  backgroundColor: '#00a1ff',
                }}
              />
              <Typography
                variant="h6"
                sx={{ fontWeight: 'bold', color: '#00a1ff' }}
              >
                Agent Directory
              </Typography>
            </Box>
          </Box>

          {/* TABLA */}
          <Box sx={{ flex: 1, overflowY: 'auto' }}>
            <Box sx={{ px: 3 }}>
              <TableContainer
                component={Paper}
                elevation={0}
                sx={{
                  maxHeight: '100%',
                  overflowY: 'auto',
                  '& .MuiTableCell-stickyHeader': {
                    backgroundColor: '#f6f7f9',
                    boxShadow: '0px 2px 5px rgba(0,0,0,0.05)',
                  },
                }}
              >
                <Table stickyHeader sx={{ tableLayout: 'fixed' }}>
                  <TableHead>
                    <TableRow>
                      {['Name', 'Email', 'Department', 'Rol', 'Remote Status', 'Action'].map((header, index) => (
                        <TableCell
                          key={header}
                          align={index === 4 || index === 5 ? 'center' : 'left'}
                          sx={{ fontWeight: 'bold', fontSize: 16 }}
                        >
                          {header}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedAgents.map((agent) => (
                      <TableRow key={agent.id} sx={{ '&:hover': { backgroundColor: '#f9fafb' } }}>
                        <TableCell>{agent.agent_name}</TableCell>
                        <TableCell>{agent.agent_email}</TableCell>
                        <TableCell>{agent.agent_department}</TableCell>
                        <TableCell>{agent.agent_rol}</TableCell>
                        <TableCell align="center">
                          <Tooltip title={agent.remote_agent ? 'Remote' : 'On Site'}>
                            <IconButton>
                              {agent.remote_agent ? (
                                <icons.home sx={{ color: '#8965e5' }} />
                              ) : (
                                <icons.onSite sx={{ color: '#00A1FF' }} />
                              )}
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                        <TableCell align="center">
                          <Box display="flex" justifyContent="center" gap={1}>
                            <Tooltip title="Edit Agent" placement="bottom">
                              <Box
                                sx={{
                                  backgroundColor: '#DFF3FF',
                                  color: '#00A1FF',
                                  borderRadius: '50%',
                                  padding: 1,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  width: 32,
                                  height: 32,
                                  fontSize: 18,
                                  cursor: 'pointer',
                                  transition: 'background-color 0.3s, color 0.3s',
                                  '&:hover': {
                                    backgroundColor: '#00A1FF',
                                    color: '#FFFFFF',
                                  },
                                }}
                                onClick={() => navigate(`/agent/edit/${agent.id}`)}
                              >
                                {icons.edit({ style: { fontSize: 16, color: 'inherit' } })}
                              </Box>
                            </Tooltip>

                            <Tooltip title="Disable/Enable Agent" placement="bottom">
                              <Box
                                sx={{
                                  backgroundColor: agent.is_disabled ? '#FFE2E2' : '#DFF3FF',
                                  color: agent.is_disabled ? '#FF4C4C' : '#00A1FF',
                                  borderRadius: '50%',
                                  padding: 1,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  width: 32,
                                  height: 32,
                                  fontSize: 18,
                                  cursor: 'pointer',
                                  transition: 'background-color 0.3s, color 0.3s',
                                  '&:hover': {
                                    backgroundColor: agent.is_disabled ? '#FF4C4C' : '#00A1FF',
                                    color: '#FFFFFF',
                                  },
                                }}
                                
                              >
                                {agent.accountEnabled
                                  ? icons.lock({ style: { fontSize: 16, color: 'inherit' } })
                                  : icons.unlock({ style: { fontSize: 16, color: 'inherit' } })}
                              </Box>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>

          {/* PAGINACIÓN */}
          <Box sx={{ flexShrink: 0, px: 2, py: 1, backgroundColor: '#fff' }}>
            <TablePagination
              component="div"
              count={agents.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 50]}
            />
          </Box>
        </CardContent>
      </Card>
    </>
  );
}


/**onclick update
 * 
 * <Tooltip title="Disable/Enable Agent" placement="bottom">
                        <IconButton
                          onClick={() =>
                            handleUpdate({
                              agent_id: agent.id,
                              email: agent.agent_email,
                              displayName: agent.agent_name,
                              role: agent.agent_rol,
                              department: agent.agent_department,
                              location: agent.agent_location,
                              isRemote: agent.remote_agent,
                              isDisable: !agent.is_disabled,
                            })
                          }
                          sx={{ color: '#00A1FF' }}
                        >
                          <icons.edit style={{ fontSize: 16, color: 'inherit' }} />
                        </IconButton>
                      </Tooltip>
 * 
 * 
 */