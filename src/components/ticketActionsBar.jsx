import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserEdit,      // reasignar agente
  faUserPlus,      // agregar colaborador
  faBuilding       // reasignar departamento
} from '@fortawesome/free-solid-svg-icons';

const TicketActionsBar = ({
  onReassignAgent,
  onAddCollaborator,
  onReassignDepartment
}) => {
  return (
    <Box
      display="flex"
      justifyContent="flex-end"
      alignItems="center"
      gap={2}
      px={2}
      py={1}
      sx={{ borderRadius: 2 }}
    >
      <Tooltip title="Reasignar agente">
        <IconButton onClick={onReassignAgent}>
          <FontAwesomeIcon icon={faUserEdit} style={{ color: '#007bff' }} />
        </IconButton>
      </Tooltip>

      <Tooltip title="Agregar colaborador">
        <IconButton onClick={onAddCollaborator}>
          <FontAwesomeIcon icon={faUserPlus} style={{ color: '#28a745' }} />
        </IconButton>
      </Tooltip>

      <Tooltip title="Reasignar a departamento">
        <IconButton onClick={onReassignDepartment}>
          <FontAwesomeIcon icon={faBuilding} style={{ color: '#ffc107' }} />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default TicketActionsBar;
