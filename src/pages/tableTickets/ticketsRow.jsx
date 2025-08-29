import React from 'react';
import { TableRow, TableCell, Chip, Box } from '@mui/material';
import { getStatusColor } from '../../utils/js/statusColors.js';
import { TicketIndicators } from '../../components/auxiliars/tickets/ticketIndicators.jsx';
import PatientCell from './patientCell.jsx';
import ActionCell from './actionCell.jsx';
import QCFlag from './qcflag.jsx';
import { emailToFullName } from '../../utils/js/emailToFullName.js';
import { formatPhone } from '../../utils/js/formatPhone.js';
import DOBCell from './dobCell.jsx';
import LocationCell from './locationCell.jsx';
import { toMMDDYYYY } from '../../utils/js/formatDateToMMDDYYY.js';

/** Re-render mínimo: ahora también vigilamos cambios de Name/DOB (snapshot o locales) */
function areEqual(prev, next) {
  return (
    prev.row?.id === next.row?.id &&
    prev.row?.status === next.row?.status &&
    prev.row?.agent_assigned === next.row?.agent_assigned &&
    prev.row?.quality_control === next.row?.quality_control &&
    prev.row?.creation_date === next.row?.creation_date &&
    // 👇 aseguran re-render si cambia el link o los datos del paciente
    prev.row?.linked_patient_snapshot?.Name === next.row?.linked_patient_snapshot?.Name &&
    prev.row?.linked_patient_snapshot?.DOB === next.row?.linked_patient_snapshot?.DOB &&
    prev.row?.patient_name === next.row?.patient_name &&
    prev.row?.patient_dob === next.row?.patient_dob
  );
}


const TicketsRow = React.memo(function TicketsRow({
  row, onEdit, onAssignToMe, onOpenPatientProfile,
}) {
  // Nombre y DOB a mostrar: prioriza snapshot si existe
  const displayName = row?.linked_patient_snapshot?.Name ?? row?.patient_name;

  return (
    <TableRow sx={{ '&:hover': { backgroundColor: '#f9fafb' } }}>
      <TableCell>
        <Chip
          label={row.status}
          size="small"
          sx={{
            backgroundColor: getStatusColor(row.status, 'bg') || '#e0e0e0',
            color: getStatusColor(row.status, 'text') || '#000',
            fontWeight: 'bold',
            fontSize: 12,
            borderRadius: '16px',
            '& .MuiChip-label': { display: 'flex', alignItems: 'center', py: '4px', px: '15px' },
          }}
        />
      </TableCell>

      <TableCell>
        <Box display="flex" alignItems="center" gap={1}>
          <TicketIndicators ai_data={row.aiClassification} showTooltip iconsOnly />
          <QCFlag visible={row?.quality_control === true} />
        </Box>
      </TableCell>


      <TableCell>
        <LocationCell
          snapshot={row.linked_patient_snapshot}
          fallbackName={row.caller_id}
          onOpenProfile={() => onOpenPatientProfile?.(row)}
        />
      </TableCell>

      <TableCell>
        <PatientCell
          snapshot={row.linked_patient_snapshot}
          fallbackName={displayName}
          onOpenProfile={() => onOpenPatientProfile?.(row)}
        />
      </TableCell>

      <TableCell>
        <DOBCell
          snapshot={row.linked_patient_snapshot}
          fallbackName={row.patient_dob}
          onOpenProfile={() => onOpenPatientProfile?.(row)}
        />
      </TableCell>

      <TableCell>{formatPhone(row.phone)}</TableCell>
      <TableCell>{toMMDDYYYY(row.creation_date)}</TableCell>
      <TableCell>{emailToFullName(row.agent_assigned)}</TableCell>

      <TableCell>
        <ActionCell
          isAssigned={Boolean(row.agent_assigned)}
          onEdit={() => onEdit?.(row)}
          onAssignToMe={() => onAssignToMe?.(row)}
        />
      </TableCell>
    </TableRow>
  );
}, areEqual);

export default TicketsRow;
