import { Box, Card, CardContent, Typography } from '@mui/material';

const statusColors = {
  New: { bg: '#FFE2EA', text: '#FF6692' },
  Emergency: { bg: '#FFF5DA', text: '#FFB900' },
  'In Progress': { bg: '#DFF3FF', text: '#00A1FF' },
  Pending: { bg: '#EAE8FA', text: '#8965E5' },
  Done: { bg: '#DAF8F4', text: '#00B8A3' },
  Duplicated: { bg: '#FFE3C4', text: '#FF8A00' },
  Total: { bg: 'transparent', text: '#0947D7' },
};

export default function TicketAudio({ audioUrl, title, status }) {
  if (!audioUrl) {
    return (
      <Card variant="outlined">
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{
              width: 8,
              height: 24,
              borderRadius: 10,
              backgroundColor: statusColors[status]?.text || '#00a1ff'
            }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: statusColors[status]?.text || '#00a1ff' }}>
              Audio
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            No audio file available.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{
              width: 8,
              height: 24,
              borderRadius: 10,
              backgroundColor: statusColors[status]?.text || '#00a1ff'
            }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: statusColors[status]?.text || '#00a1ff' }}>
              Audio
            </Typography>
          </Box>
        <audio controls style={{ width: '100%' }}>
          <source src={audioUrl} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </CardContent>
    </Card>
  );
}
