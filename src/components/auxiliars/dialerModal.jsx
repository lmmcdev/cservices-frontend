import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
  TextField,
  Tooltip,
  DialogActions,
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CallIcon from '@mui/icons-material/Call';
import BackspaceIcon from '@mui/icons-material/Backspace';
import CancelIcon from '@mui/icons-material/Cancel';

export default function DialerModal({ open, onClose }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showCallDialog, setShowCallDialog] = useState(false);
  const inputRef = useRef();

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      });
    }
  }, [open]);

  const handleDigitPress = (digit) => {
    if (phoneNumber.length < 10) {
      setPhoneNumber((prev) => prev + digit);
    }
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleClear = () => {
    setPhoneNumber('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleBackspace = () => {
    setPhoneNumber((prev) => prev.slice(0, -1));
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleCall = () => {
    if (phoneNumber.length > 0) {
      window.location.href = `tel:${phoneNumber}`;
      setShowCallDialog(true);
    }
  };

  const dialerKeys = [
    { digit: '1', letters: '' },
    { digit: '2', letters: 'ABC' },
    { digit: '3', letters: 'DEF' },
    { digit: '4', letters: 'GHI' },
    { digit: '5', letters: 'JKL' },
    { digit: '6', letters: 'MNO' },
    { digit: '7', letters: 'PQRS' },
    { digit: '8', letters: 'TUV' },
    { digit: '9', letters: 'WXYZ' },
    { digit: '*', letters: '' },
    { digit: '0', letters: '+' },
    { digit: '#', letters: '' },
  ];

  const renderButton = (digit, letters) => (
    <Box
      key={digit}
      onClick={() => handleDigitPress(digit)}
      sx={{
        width: 60,
        height: 60,
        borderRadius: '50%',
        border: '2px solid #f1f1f1',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'transform 0.15s, background-color 0.2s, border-color 0.2s',
        '&:hover': {
          transform: 'scale(1.1)',
          backgroundColor: '#00a1ff',
          borderColor: '#00a1ff',
          color: '#fff',
        },
        '&:active': {
          transform: 'scale(0.95)',
        },
      }}
    >
      <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '1.1rem', lineHeight: 1 }}>
        {digit}
      </Typography>
      <Typography
        variant="caption"
        sx={{
          fontSize: '0.65rem',
          visibility: letters ? 'visible' : 'hidden',
          mt: '0.5px',
          lineHeight: 1,
        }}
      >
        {letters || '•'}
      </Typography>
    </Box>
  );

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth={false}
        PaperProps={{
          sx: {
            width: 380,
            borderRadius: 4,
            mx: 'auto',
            my: 5,
            pb: 4,
            boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
          },
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#00a1ff' }}>
            Dialer
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 1, px: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3, mt: 1 }}>
            <TextField
              inputRef={inputRef}
              autoFocus
              placeholder="Enter a phone number"
              variant="standard"
              value={phoneNumber}
              onChange={(e) => {
                const raw = e.target.value.replace(/\D/g, '');
                if (raw.length <= 10) setPhoneNumber(raw);
              }}
              inputProps={{
                inputMode: 'numeric',
                pattern: '[0-9]*',
                style: {
                  fontSize: '1.6rem',
                  textAlign: 'center',
                  letterSpacing: '2px',
                  caretColor: 'transparent',
                },
              }}
              InputProps={{
                disableUnderline: true,
              }}
              sx={{
                width: '100%',
                mx: 2,
                backgroundColor: 'transparent',
                '& input::placeholder': {
                  textAlign: 'center',
                  fontSize: '0.9rem',
                  opacity: 0.5,
                  color: '#999',
                },
              }}
            />
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 3,
              mt: 2,
              px: 5,
              justifyItems: 'center',
              alignItems: 'center',
            }}
          >
            {dialerKeys.map(({ digit, letters }) => {
              if (digit === '0') {
                return (
                  <React.Fragment key="zero-row">
                    {renderButton('*', '')}
                    {renderButton('0', '+')}
                    {renderButton('#', '')}

                    <Box
                      sx={{
                        gridColumn: '1 / span 3',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 3,
                        mt: 2,
                      }}
                    >
                      <Tooltip title="Delete last digit" arrow>
                        <IconButton onClick={handleBackspace} sx={{ color: '#00a1ff' }}>
                          <BackspaceIcon sx={{ fontSize: 23 }} />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Make call" arrow>
                        <IconButton
                          onClick={handleCall}
                          sx={{
                            backgroundColor: '#00b8a3',
                            color: 'white',
                            width: 60,
                            height: 60,
                            '&:hover': { backgroundColor: '#009b8b' },
                          }}
                        >
                          <CallIcon fontSize="large" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Clear number" arrow>
                        <IconButton onClick={handleClear} sx={{ color: '#00a1ff' }}>
                          <CancelIcon sx={{ fontSize: 25 }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </React.Fragment>
                );
              }

              if (digit === '*' || digit === '#') return null;

              return renderButton(digit, letters);
            })}
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog open={showCallDialog} onClose={() => {}} fullWidth maxWidth="xs">
        <DialogTitle>Llamada iniciada</DialogTitle>
        <DialogContent>
          <Typography>
            La llamada se abrió en la app de RingCentral. Puedes colgar desde allá cuando termines.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            sx={{ bgcolor: '#00a1ff', '&:hover': { bgcolor: '#0089d4' } }}
            onClick={() => {
              setShowCallDialog(false);
              onClose(); // cerrar dialer después
            }}
          >
            Entendido
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
