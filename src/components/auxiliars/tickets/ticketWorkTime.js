import React, { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Box,
  IconButton,
  Collapse,
  Grid
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const formatSeconds = (totalSeconds) => {
  const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
  const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
  const s = (totalSeconds % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
};

const formatName = (email) => {
  const [user] = email.split('@');
  const parts = user.split('.');
  return parts
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};

const formatShortDate = (raw) => {
  const [datePart, time] = raw.split(', ');
  const [day, month] = datePart.split('/');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${day} ${months[parseInt(month, 10) - 1]} ${time}`;
};

const TicketWorkTime = ({ workTimeData = [] }) => {
  const [showDetails, setShowDetails] = useState(false);

  const totalSeconds = workTimeData.reduce((acc, entry) => acc + (entry.workTime || 0), 0);

  const timeByUser = useMemo(() => {
    const summary = {};
    for (const entry of workTimeData) {
      const name = formatName(entry.agentEmail);
      summary[name] = (summary[name] || 0) + (entry.workTime || 0);
    }
    return summary;
  }, [workTimeData]);

  return (
    <Card variant="outlined" sx={{ p: 1, width: '100%', minWidth: '280px', maxWidth: '320px' }}>
      <CardContent sx={{ p: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">
                ⏱ Total: {formatSeconds(totalSeconds)}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="caption" fontWeight="bold" color="text.secondary">
                Agent worktime:
              </Typography>
              <Stack spacing={0.5} sx={{ mt: 0.5 }}>
                {Object.entries(timeByUser).map(([name, seconds], i) => (
                  <Typography key={i} variant="caption" sx={{ pl: 1 }}>
                    • {name}: {formatSeconds(seconds)}
                  </Typography>
                ))}
              </Stack>
            </Grid>
          </Grid>
          <IconButton size="small" onClick={() => setShowDetails(!showDetails)}>
            {showDetails ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>

        <Collapse in={showDetails} timeout="auto" unmountOnExit>
          {/* Lista de entradas */}
          <Box
            sx={{
              maxHeight: 180,
              overflowY: 'auto',
              pr: 1,
              mt: 1,
            }}
          >
            <Stack spacing={0.5}>
              {workTimeData.map((entry, i) => {
                const fullName = formatName(entry.agentEmail);
                const shortDate = formatShortDate(entry.date);
                return (
                  <Box
                    key={i}
                    sx={{
                      display: 'flex',
                      gap: 1.5,
                      alignItems: 'center',
                      fontSize: '0.875rem',
                      color: '#444',
                    }}
                  >
                    <Typography variant="caption" sx={{ minWidth: 70 }}>
                      ⏱ {formatSeconds(entry.workTime)}
                    </Typography>
                    <Typography variant="caption" sx={{ minWidth: 80, maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {fullName}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ fontStyle: 'italic', color: 'gray' }}
                    >
                      {shortDate}
                    </Typography>
                  </Box>
                );
              })}
            </Stack>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default TicketWorkTime;
