// src/components/dialogs/SettingsDialog.jsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormGroup,
  FormControlLabel,
  Switch,
  Divider,
  Typography,
  Select,
  MenuItem,
  Stack,
} from '@mui/material';
import { useSettings } from '../../context/settingsContext';

// 🔸 Claves de localStorage donde guardamos "Don't ask again"
// Agrega aquí otras si usas más prefKeys en otras pantallas.
const CALL_CONFIRM_SKIP_KEYS = ['callConfirm.providers'];

function clearCallConfirmSkips() {
  try {
    CALL_CONFIRM_SKIP_KEYS.forEach((k) => localStorage.removeItem(k));
  } catch {}
}

const SettingsDialog = ({ open, onClose }) => {
  const { settings, setSettings, resetSettings } = useSettings();

  const toggle = (key) => (e) =>
    setSettings((s) => ({ ...s, [key]: e.target.checked }));

  const change = (key) => (e) =>
    setSettings((s) => ({ ...s, [key]: e.target.value }));

  // ⬇️ Handler específico para "Confirm before calling"
  const handleConfirmBeforeCallChange = (e) => {
    const checked = e.target.checked;
    setSettings((s) => ({ ...s, confirmBeforeCall: checked }));

    // Si el usuario vuelve a encender la confirmación,
    // limpiamos los flags de "Don't ask again" para que se muestre de nuevo.
    if (checked) {
      clearCallConfirmSkips();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>User settings</DialogTitle>

      <DialogContent dividers>
        <FormGroup sx={{ gap: 1.5 }}>
          {/* Llamadas */}
          <FormControlLabel
            control={
              <Switch
                checked={settings.confirmBeforeCall}
                onChange={handleConfirmBeforeCallChange}  // 👈 cambio clave
              />
            }
            label="Confirm before calling"
          />

          {/* Direcciones */}
          <FormControlLabel
            control={
              <Switch
                checked={settings.openAddressInMaps}
                onChange={toggle('openAddressInMaps')}
              />
            }
            label="Open addresses in Google Maps"
          />

          {/* UI */}
          <FormControlLabel
            control={
              <Switch
                checked={settings.compactProviderCards}
                onChange={toggle('compactProviderCards')}
              />
            }
            label="Compact provider cards"
          />

          <Divider sx={{ my: 1.5 }} />

          {/* Tema */}
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="body2" sx={{ minWidth: 120 }}>
              Theme
            </Typography>
            <Select
              size="small"
              value={settings.theme}
              onChange={change('theme')}
            >
              <MenuItem value="system">System</MenuItem>
              <MenuItem value="light">Light</MenuItem>
              <MenuItem value="dark">Dark</MenuItem>
            </Select>
          </Stack>

          {/* Idioma */}
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="body2" sx={{ minWidth: 120 }}>
              Language
            </Typography>
            <Select
              size="small"
              value={settings.language}
              onChange={change('language')}
            >
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="es">Español</MenuItem>
            </Select>
          </Stack>
        </FormGroup>
      </DialogContent>

      <DialogActions>
        <Button
            onClick={() => {
            clearCallConfirmSkips();  // 👈 limpia flags locales
            resetSettings();          // 👈 resetea el contexto
            }}
            color="inherit"
        >
            Reset
        </Button>
        <Button onClick={onClose} variant="contained">
            Close
        </Button>
        </DialogActions>
    </Dialog>
  );
};

export default SettingsDialog;
