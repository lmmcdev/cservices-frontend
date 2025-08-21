// DialerModal.jsx
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Dialog, DialogTitle, DialogContent, IconButton, Box, Typography, TextField,
  Tooltip, DialogActions, Button
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CallIcon from '@mui/icons-material/Call';
import BackspaceIcon from '@mui/icons-material/Backspace';
import CancelIcon from '@mui/icons-material/Cancel';

const toE164US = (raw = '') => {
  const digits = String(raw).replace(/[^\d]/g, '');
  if (digits.length === 10) return `+1${digits}`;
  return '';
};

const formatUSNational = (raw = '') => {
  const digits = String(raw).replace(/[^\d]/g, '').slice(0, 10);
  if (!digits) return '';
  const a = digits.slice(0, 3);
  const b = digits.slice(3, 6);
  const c = digits.slice(6, 10);
  if (digits.length <= 3) return a;
  if (digits.length <= 6) return `(${a}) ${b}`;
  return `(${a}) ${b}-${c}`;
};

const buildDialUrl = (number, { dialer = 'tel', customPattern, normalizeE164 = true } = {}) => {
  const raw = String(number).trim();
  const normalized = normalizeE164 ? toE164US(raw) : raw;
  const target = normalized || '';
  switch (dialer) {
    case 'tel':      return `tel:${target}`;
    case 'msteams':  return `msteams:/l/call/0/0?users=${encodeURIComponent(target)}`;
    case 'skype':    return `skype:${encodeURIComponent(target)}?call`;
    case 'sip':      return `sip:${encodeURIComponent(target)}`;
    case 'custom':   return (customPattern || '').replace('{number}', encodeURIComponent(target));
    default:         return `tel:${target}`;
  }
};

const DIALER_KEYS = Object.freeze([
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
]);

export default function DialerModal({
  open,
  onClose,
  initialNumber = '',
  dialerSettings = { dialer: 'tel', normalizeE164: true },
  onDialStart,
  onDialFail,
  onNumberChange,
}) {
  const [rawNumber, setRawNumber] = useState('');
  const [showCallDialog, setShowCallDialog] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      const onlyDigits = String(initialNumber || '').replace(/[^\d]/g, '').slice(0, 10);
      setRawNumber(onlyDigits);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open, initialNumber]);

  useEffect(() => {
    onNumberChange?.(rawNumber);
  }, [rawNumber, onNumberChange]);

  const pretty = useMemo(() => formatUSNational(rawNumber), [rawNumber]);

  const addDigit = useCallback((d) => {
    if (!/^\d$/.test(d)) return;
    setRawNumber(prev => (prev + d).slice(0, 10));
    inputRef.current?.focus();
  }, []);

  const handleDigitPress = (d) => addDigit(d);

  const handleClear = () => {
    setRawNumber('');
    inputRef.current?.focus();
  };

  const handleBackspace = () => {
    setRawNumber((prev) => prev.slice(0, -1));
    inputRef.current?.focus();
  };

  const handleChange = (e) => {
    const cleaned = e.target.value.replace(/[^\d]/g, '').slice(0, 10);
    setRawNumber(cleaned);
  };

  const handleKeyDown = (e) => {
    const { key } = e;
    if (/^\d$/.test(key)) {
      e.preventDefault();
      addDigit(key);
    } else if (key === 'Backspace') {
      e.preventDefault();
      handleBackspace();
    } else if (key === 'Enter') {
      e.preventDefault();
      handleCall();
    } else if (key === '*' || key === '#') {
      e.preventDefault();
    }
  };

  const canCall = rawNumber.length === 10;

  const dialHref = useMemo(() => (canCall ? buildDialUrl(rawNumber, dialerSettings) : '#'),
    [rawNumber, dialerSettings, canCall]
  );

  const handleCall = () => {
    try {
      if (!canCall) return;
      onDialStart?.(dialHref, rawNumber);
      window.location.href = dialHref;
      setShowCallDialog(true);
    } catch (err) {
      console.error('Dial error:', err);
      onDialFail?.(err);
    }
  };

  const renderButton = (digit, letters, disabled = false) => (
    <Box
      key={digit}
      role="button"
      aria-label={`Digit ${digit}`}
      tabIndex={disabled ? -1 : 0}
      onClick={disabled ? undefined : () => handleDigitPress(digit)}
      onKeyDown={disabled ? undefined : (e) => (e.key === 'Enter' || e.key === ' ') && handleDigitPress(digit)}
      sx={{
        width: 60, height: 60, borderRadius: '50%',
        border: '2px solid #f1f1f1',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'transform 0.15s, background-color 0.2s, border-color 0.2s',
        color: disabled ? '#aaa' : 'inherit',
        '&:hover': disabled ? {} : { transform: 'scale(1.08)', backgroundColor: '#00a1ff', borderColor: '#00a1ff', color: '#fff' },
        '&:active': disabled ? {} : { transform: 'scale(0.96)' },
        userSelect: 'none',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <Typography variant="body1" sx={{ fontWeight: 700, fontSize: '1.15rem', lineHeight: 1 }}>
        {digit}
      </Typography>
      <Typography
        variant="caption"
        sx={{
          fontSize: '0.63rem',
          visibility: letters ? 'visible' : 'hidden',
          mt: '1px',
          lineHeight: 1,
          opacity: 0.9,
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
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#00a1ff' }}>
            Dialer
          </Typography>
          <IconButton onClick={onClose} aria-label="Close dialer">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 1, px: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3, mt: 1 }}>
            <TextField
              inputRef={inputRef}
              placeholder="Enter a 10-digit US number"
              variant="standard"
              value={pretty || rawNumber}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              inputProps={{
                inputMode: 'tel',
                maxLength: 14,
                style: {
                  fontSize: '1.6rem',
                  textAlign: 'center',
                  letterSpacing: '2px',
                  caretColor: '#00a1ff',
                },
                'aria-label': 'Phone number',
              }}
              InputProps={{ disableUnderline: true }}
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
            {DIALER_KEYS.map(({ digit, letters }) => {
              if (digit === '0') {
                return (
                  <React.Fragment key="zero-row">
                    {renderButton('*', '', true)}
                    {renderButton('0', '+')}
                    {renderButton('#', '', true)}

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
                        <IconButton onClick={handleBackspace} sx={{ color: '#00a1ff' }} aria-label="Backspace">
                          <BackspaceIcon sx={{ fontSize: 23 }} />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title={canCall ? 'Make call' : 'Enter a valid 10-digit number'} arrow>
                        <span>
                          <IconButton
                            onClick={handleCall}
                            disabled={!canCall}
                            sx={{
                              backgroundColor: canCall ? '#00b8a3' : '#b2dfd9',
                              color: 'white',
                              width: 60,
                              height: 60,
                              '&:hover': { backgroundColor: canCall ? '#009b8b' : '#b2dfd9' },
                            }}
                            aria-label="Call"
                          >
                            <CallIcon fontSize="large" />
                          </IconButton>
                        </span>
                      </Tooltip>

                      <Tooltip title="Clear number" arrow>
                        <IconButton onClick={handleClear} sx={{ color: '#00a1ff' }} aria-label="Clear number">
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
        <DialogTitle>Call started</DialogTitle>
        <DialogContent>
          <Typography>
            The call was opened in your calling app. You can hang up from there when you finish.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            sx={{ bgcolor: '#00a1ff', '&:hover': { bgcolor: '#0089d4' } }}
            onClick={() => {
              setShowCallDialog(false);
              onClose?.();
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
