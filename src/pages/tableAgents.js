import React, { useState, useReducer } from 'react';
import { ticketReducer, initialState } from '../store/ticketsReducer';
import { createAgent } from '../utils/api';
import { useLoading } from '../providers/loadingProvider';
import AlertSnackbar from '../components/auxiliars/alertSnackbar';

import {
  Box, Button, Card, CardContent, Typography,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, TablePagination, Paper, Tooltip, IconButton
} from '@mui/material';
import { icons } from '../components/auxiliars/icons';
import { useNavigate } from 'react-router-dom';
import CreateAgentModal from '../components/dialogs/createAgentDialog';
import { useAgents } from '../context/agentsContext';

export default function TableAgents({ supEmail }) {
    const { state } = useAgents(); // ⬅️ Aquí usas el contexto
    const agents = state.agents;
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const navigate = useNavigate();
    const [, dispatch] = useReducer(ticketReducer, initialState);
    const { setLoading } = useLoading();

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

  const handleSubmit = async (data) => {
    const form = { ...data, supEmail };
    setLoading(true);
    const result = await createAgent(dispatch, setLoading, form);
    if (result.success) {
      setSuccessMessage(result.message);
      setSuccessOpen(true);
    } else {
      setErrorMessage(result.message);
      setErrorOpen(true);
    }
  };

  return (
    <>
      <Card sx={{ borderRadius: 4, position: 'fixed', top: 150, left: 200, right: 20, boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.04)' }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5">Agent Directory</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenCreateModal(true)}
              sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 'bold' }}
            >
              Add Agent
            </Button>
          </Box>

          <TableContainer component={Paper} elevation={0} sx={{ maxHeight: 500, overflowY: 'auto' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {['Name', 'Email', 'Department', 'Rol', 'Remote?', ''].map((header) => (
                    <TableCell key={header} sx={{ fontWeight: 'bold', fontSize: 16 }}>
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
                            <icons.home sx={{ color: '#1976d2' }} />
                          ) : (
                            <icons.business sx={{ color: '#616161' }} />
                          )}
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Disable/Enable Agent" placement="bottom">
                        <IconButton
                          sx={{ color: '#00A1FF' }}
                        >
                          <icons.edit style={{ fontSize: 26, color: 'inherit' }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Agent" placement="bottom">
                        <IconButton
                          onClick={() =>
                            navigate(`/agent/edit/${agent.agent_email}`)
                          }
                          sx={{ color: '#00A1FF' }}
                        >
                          <icons.edit style={{ fontSize: 16, color: 'inherit' }} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={agents.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        </CardContent>
      </Card>

      {/* Modal para agregar agente */}
      <CreateAgentModal
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        handleOnSubmit={handleSubmit}
      />

      {/* Alertas */}
      <AlertSnackbar
        open={errorOpen}
        onClose={() => setErrorOpen(false)}
        severity="error"
        message={errorMessage}
      />
      <AlertSnackbar
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        severity="success"
        message={successMessage}
      />
    </>
  );
}
