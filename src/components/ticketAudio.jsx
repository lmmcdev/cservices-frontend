import { Card, CardContent, Typography } from '@mui/material';

export default function TicketAudio({ audioUrl, title }) {
  if (!audioUrl) {
    return (
      <Card variant="outlined">
        <CardContent>
          <Typography variant="body2">{title}</Typography>
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
        <Typography variant="body2">{title}</Typography>
        <audio controls style={{ width: '100%' }}>
          <source src={audioUrl} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </CardContent>
    </Card>
  );
}
