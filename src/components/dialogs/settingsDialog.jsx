// src/components/dialogs/SettingsDialog.jsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  FormGroup,
  Select,
  MenuItem,
  Stack,
  Typography,
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Switch,
  Button,
  Snackbar,
  Alert,
  Slide,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { keyframes } from '@mui/system';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { Icon } from '@iconify/react';
import { useSettings } from '../../context/settingsContext';

const CALL_CONFIRM_SKIP_KEYS = ['callConfirm.providers'];

function clearCallConfirmSkips() {
  try {
    CALL_CONFIRM_SKIP_KEYS.forEach((k) => localStorage.removeItem(k));
  } catch {}
}

const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 44,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '200ms',
    '&.Mui-checked': {
      transform: 'translateX(18px)',
      color: '#fff',
      '& + .MuiSwitch-track': { opacity: 1 },
    },
  },
  '& .MuiSwitch-thumb': { boxSizing: 'border-box', width: 22, height: 22 },
  '& .MuiSwitch-track': { borderRadius: 13, opacity: 1 },
}));

const Row = ({ label, control, noBorder }) => (
  <Box
    display="flex"
    alignItems="center"
    justifyContent="space-between"
    py={2}
    sx={{ borderBottom: noBorder ? 'none' : (t) => `1px solid ${t.palette.divider}` }}
  >
    <Typography variant="body1">{label}</Typography>
    <Box>{control}</Box>
  </Box>
);

const pop = keyframes`
  0% { transform: translateY(8px) scale(0.98); opacity: 0.9; }
  60% { transform: translateY(0) scale(1.02); opacity: 1; }
  100% { transform: translateY(0) scale(1); opacity: 1; }
`;

function TransitionUp(props) {
  return <Slide {...props} direction="up" />;
}

const SettingsDialog = ({ open, onClose }) => {
  const { settings, setSettings, resetSettings } = useSettings();
  const [tab, setTab] = useState('general');
  const [showSaved, setShowSaved] = useState(false);

  const instantSave = (updates, clearFlags = false) => {
    if (clearFlags) clearCallConfirmSkips();
    setSettings((prev) => ({ ...prev, ...updates }));
    setShowSaved(true);
  };

  const toggle = (key, clearFlags = false) => (e) =>
    instantSave({ [key]: e.target.checked }, clearFlags);

  const change = (key) => (e) => instantSave({ [key]: e.target.value });

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth={false}
        PaperProps={{
          sx: {
            borderRadius: 2,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            width: 747,
            height: 660,
            maxWidth: '96vw',
            maxHeight: '92dvh',
          },
        }}
      >
        <DialogTitle sx={{ pb: 1.5 }}>Settings</DialogTitle>

        <DialogContent dividers sx={{ p: 0, flex: 1, overflow: 'auto' }}>
          <Box display="flex" sx={{ minHeight: '100%' }}>
            <Box
              sx={{
                width: 197,
                borderRight: (t) => `1px solid ${t.palette.divider}`,
                bgcolor: (t) =>
                  t.palette.mode === 'light' ? 'background.default' : 'background.paper',
                flexShrink: 0,
                position: 'sticky',
                top: 0,
                alignSelf: 'flex-start',
                height: '100%',
              }}
            >
              <List disablePadding>
                <ListItemButton selected={tab === 'general'} onClick={() => setTab('general')}>
                  <ListItemIcon
                    sx={{ minWidth: 32, color: tab === 'general' ? 'primary.main' : 'text.secondary' }}
                  >
                    <Icon icon="lucide:settings" width={20} />
                  </ListItemIcon>
                  <ListItemText primary="General" />
                </ListItemButton>

                <ListItemButton selected={tab === 'notifications'} onClick={() => setTab('notifications')}>
                  <ListItemIcon
                    sx={{ minWidth: 32, color: tab === 'notifications' ? 'primary.main' : 'text.secondary' }}
                  >
                    <Icon icon="lucide:bell" width={20} />
                  </ListItemIcon>
                  <ListItemText primary="Notifications" />
                </ListItemButton>
              </List>
            </Box>

            <Box sx={{ flex: 1, p: 3 }}>
              {tab === 'general' && (
                <>
                  <Typography variant="h6" sx={{ mb: 1.5 }}>
                    General
                  </Typography>
                  <Divider />
                  <Box sx={{ mt: 1 }}>
                    <FormGroup>
                      <Row
                        label="Confirm before calling"
                        control={
                          <IOSSwitch
                            checked={!!settings.confirmBeforeCall}
                            onChange={toggle('confirmBeforeCall', true)}
                          />
                        }
                      />
                      <Row
                        label="Open addresses in Google Maps"
                        control={
                          <IOSSwitch
                            checked={!!settings.openAddressInMaps}
                            onChange={toggle('openAddressInMaps')}
                          />
                        }
                      />
                      <Row
                        label="Compact provider cards"
                        control={
                          <IOSSwitch
                            checked={!!settings.compactProviderCards}
                            onChange={toggle('compactProviderCards')}
                          />
                        }
                      />

                      <Divider sx={{ my: 2 }} />

                      <Row
                        label={
                          <Stack spacing={0.5}>
                            <Typography variant="body1">Theme</Typography>
                            <Typography variant="body2" color="text.secondary">
                              Use system to match your device
                            </Typography>
                          </Stack>
                        }
                        control={
                          <Select
                            size="small"
                            value={settings.theme}
                            onChange={change('theme')}
                            sx={{ minWidth: 160, borderRadius: 2 }}
                          >
                            <MenuItem value="system">System</MenuItem>
                            <MenuItem value="light">Light</MenuItem>
                            <MenuItem value="dark">Dark</MenuItem>
                          </Select>
                        }
                      />
                      <Row
                        label={
                          <Stack spacing={0.5}>
                            <Typography variant="body1">Language</Typography>
                            <Typography variant="body2" color="text.secondary">
                              Interface language
                            </Typography>
                          </Stack>
                        }
                        control={
                          <Select
                            size="small"
                            value={settings.language}
                            onChange={change('language')}
                            sx={{ minWidth: 160, borderRadius: 2 }}
                          >
                            <MenuItem value="en">English</MenuItem>
                            <MenuItem value="es">Español</MenuItem>
                          </Select>
                        }
                        noBorder
                      />
                    </FormGroup>

                    <Box
                      sx={{
                        mt: 3,
                        p: 2,
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: (t) => t.palette.error.light,
                        bgcolor: (t) =>
                          t.palette.mode === 'light' ? 'rgba(176,32,12,0.05)' : 'rgba(176,32,12,0.12)',
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ mb: 1 }}>
                        Danger zone
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                        Reset all settings to defaults and clear “Don’t ask again” flags.
                      </Typography>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => {
                          clearCallConfirmSkips();
                          resetSettings();
                          setShowSaved(true);
                        }}
                      >
                        Reset all
                      </Button>
                    </Box>
                  </Box>
                </>
              )}

              {tab === 'notifications' && (
                <>
                  <Typography variant="h6" sx={{ mb: 1.5 }}>
                    Notifications
                  </Typography>
                  <Divider />
                  <Box sx={{ mt: 1 }}>
                    <FormGroup>
                      <Row
                        label={
                          <Stack spacing={0.5}>
                            <Typography variant="body1">Desktop notifications</Typography>
                            <Typography variant="body2" color="text.secondary">
                              Show system notifications for new activity
                            </Typography>
                          </Stack>
                        }
                        control={
                          <IOSSwitch
                            checked={!!settings.desktopNotifications}
                            onChange={toggle('desktopNotifications')}
                          />
                        }
                      />
                      <Row
                        label="Play sound on new activity"
                        control={
                          <IOSSwitch
                            checked={!!settings.soundEnabled}
                            onChange={toggle('soundEnabled')}
                          />
                        }
                      />
                      <Row
                        label="Email alerts"
                        control={
                          <IOSSwitch
                            checked={!!settings.emailAlerts}
                            onChange={toggle('emailAlerts')}
                          />
                        }
                        noBorder
                      />
                    </FormGroup>
                  </Box>
                </>
              )}
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={showSaved}
        TransitionComponent={TransitionUp}
        autoHideDuration={1800}
        onClose={() => setShowSaved(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity="success"
          variant="filled"
          icon={<CheckCircleRoundedIcon fontSize="inherit" />}
          sx={{
            width: '100%',
            borderRadius: 2,
            boxShadow: 3,
            px: 2,
            py: 1,
            animation: `${pop} 320ms cubic-bezier(.2,.8,.2,1)`,
          }}
        >
          Changes saved
        </Alert>
      </Snackbar>
    </>
  );
};

export default SettingsDialog;
