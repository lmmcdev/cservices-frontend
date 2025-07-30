import React, { createContext, useContext, useRef } from 'react';
import * as signalR from '@microsoft/signalr';
import { useTicketsDispatch } from './ticketsContext';
import { useDailyStatsDispatch } from './dailyStatsContext';
import { useAuth } from './authContext';
import { useFetchStatistics } from './statsContext';
import { useDoneFetchStatistics } from './doneTicketsContext';

const SignalRContext = createContext();

// signalRContext.js
export function SignalRProvider({ children }) {
  const connectionRef = useRef(null);
  const dispatch = useTicketsDispatch();
  const dailyStatsDispatch = useDailyStatsDispatch(); 
  const fetchStats = useFetchStatistics();
  const fetchDoneStats = useDoneFetchStatistics();
  //const { department, accessTokenMSAL } = useAuth();
  const { department, } = useAuth();

  //console.log(department)
  const initializeSignalR = async ({ onTicketCreated, onTicketUpdated }) => {
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

      //evento ticket creado
      connection.on('ticketCreated', (ticket) => {
        if (ticket.assigned_department === department) {
          dispatch({ type: 'ADD_TICKET', payload: ticket });
          onTicketCreated?.(ticket);
        }
      });

      //evento ticket actualizado
      connection.on('ticketUpdated', (ticket) => {
          console.log('Ticket updated:', ticket);
          dispatch({ type: 'UPD_TICKET', payload: ticket });
          onTicketUpdated?.(ticket);
      });

      //evento disparador estadisticas
      connection.on('statsUpdated', () => {
        fetchStats();
      });

      //evento disparador tickets closed by agents
      connection.on('ticketClosed', () => {
        fetchDoneStats();
      });

      connection.on('dailyStats', (data) => {
        dailyStatsDispatch({type: 'SET_DAILY_STATS', payload: data})
      })

     
      await connection.start();
      console.log('✅ SignalR conectado');
      connectionRef.current = connection;       

    } catch (err) {
      console.error('❌ Error al conectar con SignalR:', err);
    }
  };

  const lockTicket = async ({ ticketId, agent }) => {
    try {
      await connectionRef.current?.invoke('LockTicket', { ticketId, agent });
    } catch (err) {
      console.error(`❌ Error bloqueando ticket ${ticketId}:`, err);
    }
  };

  const unlockTicket = async ({ ticketId }) => {
    try {
      await connectionRef.current?.invoke('UnlockTicket', { ticketId });
    } catch (err) {
      console.error(`❌ Error desbloqueando ticket ${ticketId}:`, err);
    }
  };

  return (
    <SignalRContext.Provider value={{ initializeSignalR, lockTicket, unlockTicket }}>
      {children}
    </SignalRContext.Provider>
  );
}


export function useSignalR() {
  return useContext(SignalRContext);
}