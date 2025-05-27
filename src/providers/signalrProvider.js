import { HubConnectionBuilder } from '@microsoft/signalr';

export const setupSignalR = () => {
  const connection = new HubConnectionBuilder()
    .withUrl('https://<tu-app>.azurewebsites.net/api') // tu endpoint negociado
    .withAutomaticReconnect()
    .build();

  connection.on('newTicket', (ticket) => {
    console.log('Nuevo ticket recibido vía SignalR:', ticket);
    // Aquí podrías hacer dispatch a tu useReducer o actualizar el estado
  });

  connection
    .start()
    .then(() => console.log('Conectado a SignalR'))
    .catch((err) => console.error('Error al conectar a SignalR', err));

  return connection;
};
