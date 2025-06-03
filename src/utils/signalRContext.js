// utils/signalRContext.js
import React, { createContext, useContext, useRef } from 'react';
import * as signalR from '@microsoft/signalr';

const SignalRContext = createContext();

export function SignalRProvider({ children }) {
  const connectionRef = useRef(null);

  const initializeSignalR = async (dispatch) => {
    if (connectionRef.current) return;

    const res = await fetch('/api/negotiate');
    const { url, accessToken } = await res.json();

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(url, {
        accessTokenFactory: () => accessToken,
      })
      .withAutomaticReconnect()
      .build();

    connection.on('ticketCreated', (ticket) => {
      dispatch({ type: 'ADD_TICKET', payload: ticket });
    });

    try {
      await connection.start();
      console.log('SignalR conectado');
    } catch (err) {
      console.error('Error al conectar con SignalR:', err);
    }

    connectionRef.current = connection;
  };

  return (
    <SignalRContext.Provider value={{ initializeSignalR }}>
      {children}
    </SignalRContext.Provider>
  );
}

export function useSignalR() {
  return useContext(SignalRContext);
}
