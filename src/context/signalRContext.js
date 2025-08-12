import React, { createContext, useContext, useRef } from 'react';
import * as signalR from '@microsoft/signalr';
import { useTicketsDispatch } from './ticketsContext';
import { useDailyStatsDispatch } from './dailyStatsContext';
import { useAuth } from './authContext';
//import { useFetchStatistics } from './statsContext';
//import { useDoneFetchStatistics } from './doneTicketsContext';

const SignalRContext = createContext();

// signalRContext.js
export function SignalRProvider({ children }) {
  const connectionRef = useRef(null);
  const dispatch = useTicketsDispatch();
  const dailyStatsDispatch = useDailyStatsDispatch(); 
  //const fetchStats = useFetchStatistics();
  //const fetchDoneStats = useDoneFetchStatistics();
  //const { department, accessTokenMSAL } = useAuth();
  const { department, user } = useAuth();

  //console.log(department)
  const initializeSignalR = async ({ onTicketCreated, onTicketUpdated }) => {
  
    if (connectionRef.current) return;

    try {
      const res = await fetch(`https://signalrcservices.azurewebsites.net/api/negotiate?userId=${user?.username}`,
        
      );
      if (!res.ok) throw new Error('Failed to fetch negotiate info');

      const { url, accessToken } = await res.json();

      const connection = new signalR.HubConnectionBuilder()
        .withUrl(url, {
          accessTokenFactory: () => accessToken,
        })
        .withAutomaticReconnect()
        .build();


      await connection.start();
      console.log('✅ SignalR conectado');

      // 4. Unirse a grupos específicos (vía método expuesto en el servidor)
      //await connection.invoke('JoinGroup', `${user?.username}`);
      //await connection.invoke('JoinGroup', `department:${department}`);
      console.log('📌 Suscrito a grupos del agente y departamento');
      //evento ticket creado
      connection.on('ticketCreated', (ticket) => {
        if (ticket.assigned_department === department) {
          dispatch({ type: 'ADD_TICKET', payload: ticket });
          onTicketCreated?.(ticket);
        }
      });

      //evento ticket actualizado
      connection.on('ticketUpdated', (ticket) => {

        //if (ticket.agent_assigned === user?.username || ticket.assigned_department === department) {
          
          //console.log('own ticket actualizado:', ticket);
          dispatch({ type: 'UPD_TICKET', payload: ticket });
          onTicketUpdated?.(ticket);
        //}
      });

      //evento ticket actualizado por canal (no funcional)
      /*connection.on('ticketUpdatedAgent', (ticket) => {
        console.log('agent channel:', ticket);
          //dispatch({ type: 'UPD_TICKET', payload: ticket });
          //onTicketUpdated?.(ticket);
      });*/

      //evento disparador estadisticas
      /*connection.on('statsUpdated', () => {
        fetchStats();
      });

      //evento disparador tickets closed by agents
      connection.on('ticketClosed', () => {
        fetchDoneStats();
      });*/

      connection.on('dailyStats', (data) => {
        dailyStatsDispatch({type: 'SET_DAILY_STATS', payload: data})
      })

     
      
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