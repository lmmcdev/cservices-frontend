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

/* ============ Utils ============ */

// Normaliza a E.164 asumiendo USA. Ajusta según tu país/escenario.
const toE164US = (raw = '') => {
  const digits = String(raw).replace(/[^\d]/g, '');
  if (!digits) return '';
  // Permite 10 dígitos -> +1XXXXXXXXXX, 11 si empieza por 1
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  // Si no cuadra, intenta con + y tal cual (fallback conservador)
  return raw.startsWith('+') ? raw : `+${digits}`;
};

const formatUSNational = (raw = '') => {
  const digits = String(raw).replace(/[^\d]/g, '').slice(-10);
  if (!digits) return '';
  const a = digits.slice(0, 3);
  const b = digits.slice(3, 6);
  const c = digits.slice(6, 10);
  if (digits.length <= 3) return a;
  if (digits.length <= 6) return `(${a}) ${b}`;
  return `(${a}) ${b}-${c}`;
};

// Construye URL del dial según configuración
const buildDialUrl = (number, { dialer = 'tel', customPattern, normalizeE164 = true } = {}) => {
  const raw = String(number).trim();
  const hasStarHash = /[*#]/.test(raw);

  // Si el usuario marcó * o # (DTMF/servicios especiales), mejor respeta lo que escribió con tel:
  // De lo contrario, normaliza si se solicita.
  const normalized = hasStarHash
    ? raw
    : (normalizeE164 ? toE164US(raw) : raw);

  switch (dialer) {
    case 'tel':      return `tel:${normalized}`;
    case 'msteams':  return `msteams:/l/call/0/0?users=${encodeURIComponent(normalized)}`;
    case 'skype':    return `skype:${encodeURIComponent(normalized)}?call`;
    case 'sip':      return `sip:${encodeURIComponent(normalized)}`;
    case 'custom':   return (customPattern || '').replace('{number}', encodeURIComponent(normalized));
    default:         return `tel:${normalized}`;
  }
};

/* ============ Constantes UI ============ */

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

/* ============ Componente ============ */

export default function DialerModal({
  open,
  onClose,
  initialNumber = '',
  dialerSettings = { dialer: 'tel', normalizeE164: true }, // { dialer:'tel'|'msteams'|'skype'|'sip'|'custom', customPattern?: 'mysoftphone://call?to={number}', normalizeE164?: boolean }
  onDialStart,     // (href, number) => void
  onDialFail,      // (error) => void
  onNumberChange,  // (number) => void
}) {
  const [rawNumber, setRawNumber] = useState('');
  const [showCallDialog, setShowCallDialog] = useState(false);
  const inputRef = useRef(null);
  const anchorRef = useRef(null); // <a> oculto para invocar el handler

  // Enfocar al abrir
  useEffect(() => {
    if (open) {
      setRawNumber(String(initialNumber || '').replace(/[^\d*#]/g, ''));
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open, initialNumber]);

  // Avisar cambios al padre si se solicita
  useEffect(() => {
    onNumberChange?.(rawNumber);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawNumber]);

  const pretty = useMemo(() => formatUSNational(rawNumber), [rawNumber]);

  const addDigit = useCallback((d) => {
    // Permitimos dígitos, * y #. Limita longitud razonable (extensiones/DTMF).
    setRawNumber(prev => {
      const next = (prev + d).replace(/[^0-9*#]/g, '');
      return next.slice(0, 25);
    });
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
    // Permite pegar y teclear, saneando
    const cleaned = e.target.value.replace(/[^0-9*#]/g, '').slice(0, 25);
    setRawNumber(cleaned);
  };

  const handleKeyDown = (e) => {
    const { key } = e;
    if (/^[0-9*#]$/.test(key)) {
      e.preventDefault();
      addDigit(key);
    } else if (key === 'Backspace') {
      e.preventDefault();
      handleBackspace();
    } else if (key === 'Enter') {
      e.preventDefault();
      handleCall();
    }
  };

  const dialHref = useMemo(
    () => buildDialUrl(rawNumber, dialerSettings),
    [rawNumber, dialerSettings]
  );

  const canCall = rawNumber.length >= 3; // evita llamar con 1–2 dígitos por error

  const handleCall = () => {
    try {
      if (!canCall) return;

      // notifica al padre
      onDialStart?.(dialHref, rawNumber);

      // dispara la navegación al handler usando un <a> oculto
      if (anchorRef.current) {
        anchorRef.current.href = dialHref;
        anchorRef.current.click();
      } else {
        // fallback
        window.location.href = dialHref;
      }

      setShowCallDialog(true);
    } catch (err) {
      console.error('Dial error:', err);
      onDialFail?.(err);
    }
  };

  const renderButton = (digit, letters) => (
    <Box
      key={digit}
      role="button"
      aria-label={`Digit ${digit}`}
      tabIndex={0}
      onClick={() => handleDigitPress(digit)}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleDigitPress(digit)}
      sx={{
        width: 60, height: 60, borderRadius: '50%',
        border: '2px solid #f1f1f1',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
        transition: 'transform 0.15s, background-color 0.2s, border-color 0.2s',
        '&:hover': { transform: 'scale(1.08)', backgroundColor: '#00a1ff', borderColor: '#00a1ff', color: '#fff' },
        '&:active': { transform: 'scale(0.96)' },
        userSelect: 'none',
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
      {/* ancla oculta para invocar el protocolo sin romper SPA */}
      <a ref={anchorRef} href={dialHref} style={{ display: 'none' }} aria-hidden="true" />

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
              placeholder="Enter a phone number"
              variant="standard"
              value={pretty || rawNumber}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              inputProps={{
                inputMode: 'tel',
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
                        <IconButton onClick={handleBackspace} sx={{ color: '#00a1ff' }} aria-label="Backspace">
                          <BackspaceIcon sx={{ fontSize: 23 }} />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title={canCall ? 'Make call' : 'Enter a valid number'} arrow>
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

      {/* Diálogo informativo post-llamada */}
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
