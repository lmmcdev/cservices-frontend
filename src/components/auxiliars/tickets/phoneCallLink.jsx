import React from 'react';
import {
  Link,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  FormControlLabel,
  Checkbox,
  Box,
  Divider, // 👈 añadido
} from '@mui/material';
import { Iconify } from '../icons';
import { useSettings } from '../../../context/settingsContext';
import ActionButtons from '../../components/fields/actionButtons';

/* ---------- Utils: formato de teléfono ---------- */
const formatPhone = (raw) => {
  if (!raw) return { display: '', href: '' };
  const s = String(raw);
  const extMatch = s.match(/(?:ext\.?|x)\s*([0-9]{1,6})/i);
  const ext = extMatch ? extMatch[1] : '';
  let digits = (s.match(/\d/g) || []).join('');
  if (ext && digits.length > 10) {
    const extDigits = (ext.match(/\d/g) || []).join('');
    if (digits.endsWith(extDigits)) digits = digits.slice(0, -extDigits.length);
  }
  if (digits.length >= 11 && digits[0] === '1') digits = digits.slice(1);
  const base = digits.slice(0, 10);
  if (base.length < 10) return { display: s.trim(), href: '' };
  const area = base.slice(0, 3);
  const mid = base.slice(3, 6);
  const last = base.slice(6, 10);
  const display = ext ? `(${area}) ${mid}-${last} x${ext}` : `(${area}) ${mid}-${last}`;
  const href = ext ? `tel:+1${base};ext=${ext}` : `tel:+1${base}`;
  return { display, href };
};

/* ---------- Preferencia local (localStorage) ---------- */
const getSkipPref = (key) => {
  try { return localStorage.getItem(key) === 'skip'; } catch { return false; }
};
const setSkipPref = (key, skip) => {
  try {
    if (skip) localStorage.setItem(key, 'skip');
    else localStorage.removeItem(key);
  } catch {}
};

/* ---------- Componente ---------- */
const PhoneCallLink = ({
  phoneRaw,
  contactName = 'this provider',
  confirm,                         // opcional; si no lo pasas, se usa el setting global
  prefKey = 'callConfirm.providers',
  underline = 'always',
  color = '#6c757d',
  fontSize = '0.75rem',
  stopPropagation = true,
  withIcon = true,
  sx,
}) => {
  const PRIMARY = '#00A1FF';
  const { settings, setSettings } = useSettings();
  const lang = settings?.language || 'en';

  // mini i18n
  const t = (k) => {
    const en = {
      title: 'Confirm Call',
      sentence: 'Do you want to call',
      at: 'at',
      dontAsk: "Don’t ask again on this device",
      cancel: 'Cancel',
      call: 'Call',
    };
    const es = {
      title: 'Confirmar llamada',
      sentence: '¿Deseas llamar a',
      at: 'al',
      dontAsk: 'No volver a preguntar en este dispositivo',
      cancel: 'Cancelar',
      call: 'Llamar',
    };
    const map = lang === 'es' ? es : en;
    return map[k];
  };

  const settingConfirm = settings?.confirmBeforeCall ?? true;
  const effectiveConfirm = (typeof confirm === 'boolean') ? confirm : settingConfirm;

  const { display, href } = formatPhone(phoneRaw);
  const hasPhone = Boolean(display);

  const [open, setOpen] = React.useState(false);
  const [dontAskAgain, setDontAskAgain] = React.useState(false);

  if (!hasPhone) return null;

  const triggerCall = () => {
    try { window.location.href = href; } catch { window.open(href, '_self'); }
  };

  const handleClick = (e) => {
    if (stopPropagation) e.stopPropagation();
    e.preventDefault();
    if (!href) return;

    if (!effectiveConfirm || getSkipPref(prefKey)) {
      triggerCall();
      return;
    }
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
    setDontAskAgain(false);
  };

  const handleCall = () => {
    if (dontAskAgain) {
      setSkipPref(prefKey, true);
      setSettings((s) => ({ ...s, confirmBeforeCall: false })); // sync Settings
    }
    setOpen(false);
    triggerCall();
  };

  // Atajos de teclado: Enter => Call, Esc => Cancel
  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCall();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  return (
    <>
      <Tooltip title={`${t('call')} ${contactName}`}>
        <Link
          href={href || undefined}
          underline={underline}
          color={color}
          variant="body2"
          onClick={handleClick}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
            fontSize,
            ...sx,
          }}
        >
          {withIcon && <Iconify icon="mdi:phone" width={16} height={16} style={{ color: 'inherit' }} />}
          {display}
        </Link>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleCancel}
        onKeyDown={onKeyDown}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: { width: '100%', maxWidth: 360, borderRadius: '15px' },
        }}
      >
        {/* Header alineado a la izquierda + icono más grande */}
        <DialogTitle sx={{ px: 2, pt: 2, pb: 1 }}>
          <Box display="flex" alignItems="center" gap={1.25}>
            <Iconify icon="mdi:phone-outgoing" width={28} height={28} style={{ color: PRIMARY }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: PRIMARY }}>
              {t('title')}
            </Typography>
          </Box>
        </DialogTitle>

        {/* Divider justo bajo el header */}
        <Divider sx={{ mx: 2, mb: 1, borderColor: '#eef2f6' }} />

        {/* Texto izquierda, número bold en la misma línea */}
        <DialogContent sx={{ pt: 0.5, pb: 0, px: 2 }}>
          <Typography variant="body2" sx={{ color: '#343a40' }}>
            {t('sentence')} <strong>{contactName}</strong> {t('at')} <strong>{display}</strong>
          </Typography>

          {/* Checkbox más pequeño y alineado a la izquierda */}
          <Box sx={{ mt: 1 }}>
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={dontAskAgain}
                  onChange={(e) => setDontAskAgain(e.target.checked)}
                  sx={{ '&.Mui-checked': { color: PRIMARY } }}
                />
              }
              label={t('dontAsk')}
              sx={{
                ml: 0,
                '& .MuiFormControlLabel-label': {
                  fontSize: '0.80rem',  // 👈 más pequeño
                  color: '#6c757d',
                },
              }}
            />
          </Box>
        </DialogContent>

        {/* Botones con tu estética: Call a la izquierda */}
        <ActionButtons
          confirmFirst
          onCancel={handleCancel}
          onConfirm={handleCall}
          cancelLabel={t('cancel')}
          confirmLabel={t('call')}
        />
      </Dialog>
    </>
  );
};

export default PhoneCallLink;
