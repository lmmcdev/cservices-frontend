const vapidPublicKey = 'BPSp8t7UKlJGnDei4H9RV79DfvTkm2isH4gB0GANYuj1t3yqXfbbjftCl2dH8UWnl67DfJclNcpo7Ul6sorFLek';

export async function registerForPushNotifications(agentData = {}) {
  try {
    // Validar agentData
    if (!agentData || typeof agentData !== 'object') {
      console.error('❌ agentData inválido o ausente.');
      return false;
    }

    // Validar soporte del navegador
    if (!('serviceWorker' in navigator)) {
      console.error('❌ Este navegador no soporta Service Workers.');
      return false;
    }

    if (!('Notification' in window)) {
      console.error('❌ Este navegador no soporta Notificaciones.');
      return false;
    }

    if (!('PushManager' in window)) {
      console.error('❌ Este navegador no soporta PushManager.');
      return false;
    }

    // Registrar SW
    const registration = await navigator.serviceWorker.register('/service-worker.js');
    console.log('✅ Service Worker registrado');

    // Solicitar permiso
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn('⚠️ Permiso para notificaciones fue denegado');
      return false;
    }

    // Suscripción push
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
    });
    console.log('✅ Usuario suscrito a notificaciones');

    //const agentDepartment = agentData.agent_department?.toLowerCase() || 'default';
    const agentDepartment = 'Referrals';
    const agentRole = agentData.agent_rol?.toLowerCase() || 'agent';

    const installation = {
      installationId: generateInstallationId(),
      platform: 'browser',
      pushChannel: {
        endpoint: subscription.endpoint,
        p256dh: arrayBufferToBase64(subscription.getKey?.('p256dh')),
        auth: arrayBufferToBase64(subscription.getKey?.('auth')),
      },

      tags: [`dept:${agentDepartment}`, `role:${agentRole}`],
    };

    // Registrar dispositivo en backend
    const response = await fetch('https://cservicesapi.azurewebsites.net/api/registerDevice', {
      method: 'POST',
      body: JSON.stringify(installation),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`❌ Fallo en el backend: ${errorText}`);
    }

    console.log('✅ Dispositivo registrado correctamente en backend');
    return true;

  } catch (error) {
    console.error('❌ Error durante el registro de notificaciones:', error);
    return false;
  }
}

function arrayBufferToBase64(buffer) {
  if (!buffer) return '';
  const bytes = new Uint8Array(buffer);
  const binary = bytes.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
  return window.btoa(binary);
}

function generateInstallationId() {
  return 'user-' + Math.random().toString(36).substring(2, 10);
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return new Uint8Array([...rawData].map((char) => char.charCodeAt(0)));
}
