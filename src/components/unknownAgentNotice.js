import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Avatar,
} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const UnknownAgentNotice = ({ userEmail, onRetry }) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="#f9f9f9"
    >
      <Card elevation={3} sx={{ borderRadius: 4, maxWidth: 500, textAlign: 'center' }}>
        <CardContent>
          <Avatar sx={{ bgcolor: '#ff6f61', mx: 'auto', mb: 2 }}>
            <ErrorOutlineIcon />
          </Avatar>
          <Typography variant="h6" color="error" gutterBottom>
            Agent Not Recognized
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            The email <strong>{userEmail}</strong> is not associated with any active agent account.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Please contact your system administrator or try logging in with a different account.
          </Typography>
          <Button variant="contained" onClick={onRetry} sx={{ bgcolor: '#00a1ff' }}>
            Retry
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UnknownAgentNotice;
