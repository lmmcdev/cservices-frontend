// usePushRegistration.js
import { useState, useCallback } from 'react';
import { registerForPushNotifications, unregisterPush } from '../../utils/js/registerPush';

export function usePushRegistration(agentData) {
  const [toast, setToast] = useState(null); // {level, message, actions: [{label, onClick}]}
  const [loading, setLoading] = useState(false);

  const onStatus = useCallback((s) => {
    // Mapear a un toast amigable
    const toColor = { info: 'info', success: 'success', warning: 'warning', error: 'error' };
    const actions = (s.actions || []).map(a => ({
      label: a.label,
      onClick: () => {
        if (a.action === 'retry') doRegister();      // reintentar
        if (a.href) window.open(a.href, '_blank');   // abrir ayuda
      }
    }));
    setToast({ color: toColor[s.level] || 'info', message: s.message, actions });
    if (s.detail) console.debug('[push]', s.code, s.detail);
    // eslint-disable-next-line
  }, []);

  const doRegister = useCallback(async () => {
    setLoading(true);
    const ok = await registerForPushNotifications(agentData, { onStatus });
    if (ok) setToast({ color: 'success', message: 'Notificaciones activadas.' });
    setLoading(false);
    return ok;
  }, [agentData, onStatus]);

  const doUnregister = useCallback(async () => {
    setLoading(true);
    const ok = await unregisterPush();
    setToast({ color: ok ? 'success' : 'warning', message: ok ? 'Notificaciones desactivadas.' : 'No fue posible desactivar.' });
    setLoading(false);
    return ok;
  }, []);

  return { doRegister, doUnregister, loading, toast, setToast };
}
