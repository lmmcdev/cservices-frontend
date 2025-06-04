import React from 'react';
import {
  Box, Button, Card, CardContent, Chip, Typography,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, TablePagination, Paper, Tooltip, IconButton
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icons } from '../components/icons.js';
import { useNavigate } from 'react-router-dom';

export default function TableAgents({ agents, onSelectAgent }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const navigate = useNavigate();


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
    <Card elevation={3} sx={{ borderRadius: 4, position: 'fixed', top: 170, left: 200, right: 20 }}>
      <CardContent>
        <Box>
          <Typography variant="h6" align="center" sx={{ mb: 2 }}>
            Agent Directory
          </Typography>

          <TableContainer component={Paper} elevation={0}>
            <Table>
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
                        <Tooltip title={agent.remote_agent ? "Remote" : "On Site"}>
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
                      <Tooltip title="Select Agent" placement="bottom">
                        <IconButton
                          onClick={() =>
                                navigate(`/agent/edit/${agent.agent_email}`, {
                                  state: { agents: agent },
                                })
                              }
                          sx={{ color: '#00A1FF' }}
                        >
                          <FontAwesomeIcon icon={icons.edit} />
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
        </Box>
      </CardContent>
    </Card>
  );
}
