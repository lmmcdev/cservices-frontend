// pushRegistration.js
const DEFAULT_BACKEND_URL = 'https://cservicesapi.azurewebsites.net/api/registerDevice';
const VAPID_PUBLIC_KEY = 'BPSp8t7UKlJGnDei4H9RV79DfvTkm2isH4gB0GANYuj1t3yqXfbbjftCl2dH8UWnl67DfJclNcpo7Ul6sorFLek';

export async function registerForPushNotifications(agentData = {}, opts = {}) {
  console.log(JSON.stringify(agentData))
  const {
    onStatus,                      // (payload) => void  -> para UI
    backendUrl = DEFAULT_BACKEND_URL,
    swPath = '/service-worker.js',
    scope = '/',                   // scope del SW
    timeoutMs = 12000,             // timeouts para evitar cuelgues
  } = opts;

  const notify = (payload) => { try { onStatus?.(payload); } catch {} };

  // Helper timeout
  const withTimeout = (p, ms, code, message) =>
    Promise.race([
      p,
      new Promise((_, rej) => setTimeout(() => rej(Object.assign(new Error(message), { code })), ms)),
    ]);

  // ===== 1) Validaciones previas =====
  if (!agentData || typeof agentData !== 'object') {
    notify({ level: 'error', step: 'precheck', code: 'BAD_AGENTDATA', message: 'Datos del agente inválidos.' });
    return false;
  }

  const isSecure = window.isSecureContext || window.location.protocol === 'https:' || window.location.hostname === 'localhost';
  if (!isSecure) {
    notify({
      level: 'error',
      step: 'precheck',
      code: 'NEEDS_HTTPS',
      message: 'Las notificaciones push requieren HTTPS.',
      actions: [{ label: 'Abrir ayuda', href: 'https://developer.mozilla.org/docs/Web/API/Push_API' }]
    });
    return false;
  }

  if (!('serviceWorker' in navigator)) {
    notify({ level: 'error', step: 'precheck', code: 'NO_SW', message: 'Este navegador no soporta Service Workers.' });
    return false;
  }
  if (!('Notification' in window)) {
    notify({ level: 'error', step: 'precheck', code: 'NO_NOTIFICATIONS', message: 'Este navegador no soporta Notificaciones.' });
    return false;
  }
  if (!('PushManager' in window)) {
    notify({ level: 'error', step: 'precheck', code: 'NO_PUSHMANAGER', message: 'Este navegador no soporta Push API.' });
    return false;
  }

  try {
    notify({ level: 'info', step: 'sw', message: 'Registrando Service Worker…' });
    const registration = await withTimeout(
      navigator.serviceWorker.register(swPath, { scope }),
      timeoutMs,
      'SW_TIMEOUT',
      'Timeout registrando Service Worker.'
    );

    // Espera a que esté listo (activo)
    await withTimeout(navigator.serviceWorker.ready, timeoutMs, 'SW_READY_TIMEOUT', 'Service Worker no quedó listo a tiempo.');
    notify({ level: 'success', step: 'sw', message: 'Service Worker listo.' });

    // ===== 2) Permisos =====
    notify({ level: 'info', step: 'permission', message: 'Solicitando permiso de notificaciones…' });

    // Si ya está concedido/denegado, evita pedir de nuevo
    let permission = Notification.permission;
    if (permission === 'default') {
      permission = await withTimeout(
        Notification.requestPermission(),
        timeoutMs,
        'PERMISSION_TIMEOUT',
        'Timeout solicitando permiso de notificaciones.'
      );
    }

    if (permission !== 'granted') {
      notify({
        level: 'warning',
        step: 'permission',
        code: permission === 'denied' ? 'PERMISSION_DENIED' : 'PERMISSION_DISMISSED',
        message:
          permission === 'denied'
            ? 'Has bloqueado las notificaciones para este sitio.'
            : 'No se otorgó permiso para notificaciones.',
        actions: [
          { label: 'Cómo habilitar', href: 'https://support.google.com/chrome/answer/3220216' },
          { label: 'Intentar de nuevo', action: 'retry' },
        ],
      });
      return false;
    }
    notify({ level: 'success', step: 'permission', message: 'Permiso concedido.' });

    // ===== 3) Suscripción =====
    notify({ level: 'info', step: 'subscribe', message: 'Creando suscripción push…' });

    const existing = await withTimeout(
      registration.pushManager.getSubscription(),
      timeoutMs,
      'GET_SUB_TIMEOUT',
      'Timeout obteniendo suscripción existente.'
    );

    const subscription =
      existing ||
      (await withTimeout(
        registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        }),
        timeoutMs,
        'SUBSCRIBE_TIMEOUT',
        'Timeout creando suscripción push.'
      ));

    if (!subscription) {
      notify({
        level: 'error',
        step: 'subscribe',
        code: 'SUBSCRIPTION_NULL',
        message: 'No se pudo crear la suscripción.',
        actions: [{ label: 'Reintentar', action: 'retry' }],
      });
      return false;
    }
    notify({ level: 'success', step: 'subscribe', message: existing ? 'Suscripción reutilizada.' : 'Suscrito a notificaciones.' });

    // ===== 4) Registrar en backend =====
    notify({ level: 'info', step: 'backend', message: 'Registrando dispositivo…' });

    //const agentDepartment = agentData.group_id || 'default';
    //const agentRole = agentData.agent_rol?.toLowerCase() || 'agent';
    /*
      agentData -> {"id":"f5d1f129-4823-46de-b255-9dda907ec9e1","name":"Esteban Ulloa","email":"esteban.ulloa@clmmail.com","agent_name":"Esteban Ulloa","agent_email":"esteban.ulloa@clmmail.com","source":"aad","group_id":"4103988e-0a39-4a6c-aa39-e0c1fad5cf95","group_display_name":"app-cservices-supervisors","group_name":"app cservices","agent_department":"IT Department","accountEnabled":true}
    */

    const installation = {
      installationId: generateInstallationId(),
      platform: 'browser',
      pushChannel: {
        endpoint: subscription.endpoint,
        p256dh: arrayBufferToBase64(subscription.getKey?.('p256dh')),
        auth: arrayBufferToBase64(subscription.getKey?.('auth')),
      },
      //tags: [`dept:${agentDepartment}`, `role:${agentRole}`],
      tags: [`dept:Referrals`, `role:Supervisor`],
    };

    const resp = await withTimeout(
      fetch(backendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(installation),
      }),
      timeoutMs,
      'BACKEND_TIMEOUT',
      'Timeout registrando el dispositivo en backend.'
    );

    if (!resp.ok) {
      const text = await resp.text().catch(() => '');
      notify({
        level: 'error',
        step: 'backend',
        code: 'BACKEND_FAIL',
        message: `No se pudo registrar el dispositivo (${resp.status}).`,
        detail: text || resp.statusText,
        actions: [{ label: 'Reintentar', action: 'retry' }],
      });
      return false;
    }

    notify({ level: 'success', step: 'done', message: 'Dispositivo registrado correctamente.' });
    return true;
  } catch (err) {
    // Categorización básica por nombre/código
    const code = err?.code || err?.name || 'UNKNOWN';
    const isGesture = Notification?.permission === 'default';

    notify({
      level: 'error',
      step: 'exception',
      code,
      message:
        code === 'NotAllowedError'
          ? 'El navegador bloqueó la suscripción (revisa permisos).'
          : code === 'AbortError'
          ? 'La operación se canceló. Intenta de nuevo.'
          : err?.message || 'Error desconocido durante el registro.',
      actions: [
        ...(isGesture ? [{ label: 'Permitir notificaciones', action: 'retry' }] : []),
        { label: 'Reintentar', action: 'retry' },
      ],
      detail: err?.stack || String(err),
    });
    return false;
  }
}

// ===== Helpers =====
export async function unregisterPush() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return false;
  const reg = await navigator.serviceWorker.ready.catch(() => null);
  if (!reg) return false;
  const sub = await reg.pushManager.getSubscription();
  if (!sub) return true;
  try {
    await sub.unsubscribe();
    return true;
  } catch {
    return false;
  }
}

function arrayBufferToBase64(buffer) {
  if (!buffer) return '';
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function generateInstallationId() {
  // usa un ID estable si quieres guardarlo en localStorage
  return 'user-' + Math.random().toString(36).slice(2, 10);
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; ++i) arr[i] = raw.charCodeAt(i);
  return arr;
}
