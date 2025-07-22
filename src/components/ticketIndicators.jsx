import React from 'react';
import { Typography, Box, Tooltip } from '@mui/material';
import FlagIcon from '@mui/icons-material/Flag';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import DepartureBoardIcon from '@mui/icons-material/DepartureBoard';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ElderlyIcon from '@mui/icons-material/Elderly';
import NoAccountsIcon from '@mui/icons-material/NoAccounts';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import HelpIcon from '@mui/icons-material/Help';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

export const getPriorityColor = (priority) => {
  switch ((priority || '').toLowerCase()) {
    case 'high': return '#d32f2f';
    case 'medium': return '#fbc02d';
    case 'low': return '#388e3c';
    default: return '#bdbdbd';
  }
};

export const getRiskColor = (risk) => {
  switch ((risk || '').toLowerCase()) {
    case 'none': return '#4caf50';
    case 'legal': return '#ff9800';
    case 'disenrollment': return '#f44336';
    default: return '#bdbdbd';
  }
};

export const getCategoryIcon = (category) => {
  const cat = (category || '').toLowerCase();
  switch (cat) {
    case 'transport': return <DepartureBoardIcon fontSize="small" />;
    case 'appointment': return <CalendarMonthIcon fontSize="small" />;
    case 'new patient': return <ElderlyIcon fontSize="small" />;
    case 'disenrollment': return <NoAccountsIcon fontSize="small" />;
    case 'customer service': return <SupportAgentIcon fontSize="small" />;
    case 'new address': return <AddLocationAltIcon fontSize="small" />;
    case 'hospitalization': return <LocalHospitalIcon fontSize="small" />;
    case 'others': return <HelpIcon fontSize="small" />;
    default: return <HelpIcon fontSize="small" />;
  }
};

export function TicketIndicators({
  ai_data,
  showTooltip = false,
  iconsOnly = false,
  columnLayout = false,
}) {
  if (!ai_data) return null;

  const priorityIcon = (
    <FlagIcon sx={{ color: getPriorityColor(ai_data.priority), fontSize: 20 }} />
  );

  const riskIcon = (
    <ReportProblemIcon sx={{ color: getRiskColor(ai_data.risk), fontSize: 20 }} />
  );

  const categoryIcon = React.cloneElement(getCategoryIcon(ai_data.category), {
    sx: { color: '#00a1ff', fontSize: 20 },
  });

  return (
    <Box
      display="flex"
      flexDirection={columnLayout ? 'column' : 'row'}
      alignItems={columnLayout ? 'flex-start' : 'center'}
      gap={1}
    >
      <Box display="flex" alignItems="center" gap={1}>
        {showTooltip ? (
          <Tooltip title={`Priority: ${ai_data.priority}`}>{priorityIcon}</Tooltip>
        ) : (
          priorityIcon
        )}
        {!iconsOnly && (
          <Typography variant="body2">
            <strong>Priority:</strong> {ai_data.priority}
          </Typography>
        )}
      </Box>

      {ai_data.risk?.toLowerCase() !== 'none' && (
        <Box display="flex" alignItems="center" gap={1}>
          {showTooltip ? (
            <Tooltip title={`Risk: ${ai_data.risk}`}>{riskIcon}</Tooltip>
          ) : (
            riskIcon
          )}
          {!iconsOnly && (
            <Typography variant="body2">
              <strong>Risk:</strong> {ai_data.risk}
            </Typography>
          )}
        </Box>
      )}

      <Box display="flex" alignItems="center" gap={1}>
        {showTooltip ? (
          <Tooltip title={`Category: ${ai_data.category}`}>{categoryIcon}</Tooltip>
        ) : (
          categoryIcon
        )}
        {!iconsOnly && (
          <Typography variant="body2">
            <strong>Category:</strong> {ai_data.category}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
