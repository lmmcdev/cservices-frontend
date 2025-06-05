import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Box
} from '@mui/material';

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
  const [day, month, year] = datePart.split('/');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${day} ${months[parseInt(month, 10) - 1]} ${time}`;
};

const TicketWorkTime = ({ workTimeData = [] }) => {
  const totalSeconds = workTimeData.reduce((acc, entry) => acc + (entry.workTime || 0), 0);

  return (
    <Card variant="outlined" sx={{ p: 1 }}>
      <CardContent sx={{ p: 1 }}>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
          ⏱ Total: {formatSeconds(totalSeconds)}
        </Typography>

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
                <Typography variant="caption" sx={{ minWidth: 100 }}>
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
      </CardContent>
    </Card>
  );
};

export default TicketWorkTime;
