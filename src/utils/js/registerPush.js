const vapidPublicKey = 'BPSp8t7UKlJGnDei4H9RV79DfvTkm2isH4gB0GANYuj1t3yqXfbbjftCl2dH8UWnl67DfJclNcpo7Ul6sorFLek';

export async function registerForPushNotifications(agentData = {}) {
    if (agentData === null) {
        console.error('No agent data provided for push registration');
        return;
    }

    const agentDepartment = agentData.agent_department?.toLowerCase() || 'default';
    const agentRole = agentData.agent_rol?.toLowerCase() || 'agent';

    const registration = await navigator.serviceWorker.register('/service-worker.js');
    const permission = await Notification.requestPermission();

    if (permission !== 'granted') {
        alert('Permiso denegado para notificaciones');
        return;
    }

    const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
    });

    // Transformar el subscription para ajustarlo al formato esperado
    const installation = {
        installationId: generateInstallationId(), // Puedes generar un ID único aquí
        platform: 'browser',
        pushChannel: {
        endpoint: subscription.endpoint,
        p256dh: subscription.getKey ? arrayBufferToBase64(subscription.getKey('p256dh')) : '',
        auth: subscription.getKey ? arrayBufferToBase64(subscription.getKey('auth')) : '',
        },
        tags: [`dept:${agentDepartment}`, `role:${agentRole}`], // Opcional, ajusta según necesites
    };

    // Enviar la suscripción ya formateada a la Azure Function
    await fetch('https://cservicesapi.azurewebsites.net/api/registerDevice', {
        method: 'POST',
        body: JSON.stringify(installation),
        headers: { 'Content-Type': 'application/json' },
    });
    }

    // Función para convertir ArrayBuffer a Base64 (pushManager keys vienen como ArrayBuffer)
    function arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
    }

    // Generar un installationId único simple (puedes mejorarlo)
    function generateInstallationId() {
    return 'user-' + Math.random().toString(36).substring(2, 10);
    }

    function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = atob(base64);
    return new Uint8Array([...rawData].map((char) => char.charCodeAt(0)));
    }

