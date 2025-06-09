import React, { createContext, useContext, useRef } from 'react';
import * as signalR from '@microsoft/signalr';
import { useTicketsDispatch } from './ticketsContext';
import { useAuth } from './authContext';

const SignalRContext = createContext();

// signalRContext.js
export function SignalRProvider({ children }) {
  const connectionRef = useRef(null);
  const dispatch = useTicketsDispatch();
  const { department } = useAuth();
  console.log(department)
  const initializeSignalR = async (onTicketReceived) => {
    if (connectionRef.current) return;

    try {
      const res = await fetch('https://signalrcservices.azurewebsites.net/api/negotiate');
      if (!res.ok) throw new Error('Failed to fetch negotiate info');

      const { url, accessToken } = await res.json();

      const connection = new signalR.HubConnectionBuilder()
        .withUrl(url, {
          accessTokenFactory: () => accessToken,
        })
        .withAutomaticReconnect()
        .build();

      connection.on('ticketCreated', (ticket) => {
        //console.log('📥 Ticket recibido vía SignalR:', ticket);
        if(ticket.assigned_department === department) {
          dispatch({ type: 'ADD_TICKET', payload: ticket });

          if (onTicketReceived) {
            onTicketReceived(ticket);
          }
        }        
      });

      await connection.start();
      //console.log('✅ SignalR conectado');
      connectionRef.current = connection;

    } catch (err) {
      console.error('❌ Error al conectar con SignalR:', err);
    }
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
