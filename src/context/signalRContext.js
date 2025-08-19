import React, { createContext, useContext, useRef, useCallback } from 'react';
import * as signalR from '@microsoft/signalr';
import { useTicketsDispatch } from './ticketsContext';
import { useDailyStatsDispatch } from './dailyStatsContext';
import { useAuth } from './authContext';
import { ENDPOINT_URLS } from '../utils/js/constants';

const SignalRContext = createContext();

export function SignalRProvider({ children }) {
  const connectionRef = useRef(null);
  const subscribedGroupsRef = useRef(new Set()); // grupos suscritos (para re-suscribir en reconexión)

  const ticketsDispatch = useTicketsDispatch();
  const dailyStatsDispatch = useDailyStatsDispatch();
  const { user, department } = useAuth();

  // ---- helper HTTP POST JSON ----
  const postJSON = useCallback(async (url, body) => {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body ?? {}),
    });
    if (!res.ok) {
      const txt = await res.text().catch(() => '');
      throw new Error(`${res.status} ${res.statusText} - ${txt || 'Request failed'}`);
    }
    return res.json();
  }, []);

  // ---- suscribir a grupos (vía tu función /signalr/group) ----
  const joinGroups = useCallback(
    async (...groups) => {
      const userId = user?.username;
      if (!userId) return;

      const uniq = [...new Set(groups.filter(Boolean))];
      if (!uniq.length) return;

      await Promise.all(
        uniq.map(groupName =>
          postJSON(`${ENDPOINT_URLS.SIGNALRGROUPS}/signalr/group`, {
            userId,
            groupName,
            action: 'add',
          })
        )
      );

      uniq.forEach(g => subscribedGroupsRef.current.add(g));
    },
    [user?.username, postJSON]
  );

  // ---- inicializar y escuchar SOLO eventos por grupos ----
  const initializeSignalR = useCallback(
    async (handlers = {}) => {
      if (connectionRef.current || !user?.username) return;

      // 1) negotiate (vía POST body { userId })
      const { url, accessToken } = await postJSON(
        `${ENDPOINT_URLS.SIGNALRGROUPS}/negotiate`,
        { userId: user.username }
      );

      // 2) construir conexión
      const connection = new signalR.HubConnectionBuilder()
        .withUrl(url, { accessTokenFactory: () => accessToken })
        .withAutomaticReconnect()
        .build();

      // 3) REGISTRO DE EVENTOS (solo los de grupos)
      connection.on('ticketCreated', (ticket) => {
        if (!ticket) return;
        // si quieres filtrar por depto en el cliente:
        if (!department || ticket.assigned_department === department) {
          ticketsDispatch({ type: 'ADD_TICKET', payload: ticket });
        }
        handlers.onTicketCreated?.(ticket);
      });

      connection.on('ticketUpdated', (ticket) => {
        if (!ticket) return;
        ticketsDispatch({ type: 'UPD_TICKET', payload: ticket });
        handlers.onTicketUpdated?.(ticket);
      });

      connection.on('dailyStats', (data) => {
        if (!data) return;
        dailyStatsDispatch({ type: 'SET_DAILY_STATS', payload: data });
        handlers.onDailyStats?.(data);
      });

      // 4) conectar
      await connection.start();
      connectionRef.current = connection;
      console.log('✅ SignalR conectado');

      // 5) suscripciones base (usuario + departamento)
      const baseGroups = [
        user.username,
        department ? `department:${department}` : null,
      ];
      await joinGroups(...baseGroups);

      // 6) re-suscribir al reconectar
      connection.onreconnected(async () => {
        const again = Array.from(subscribedGroupsRef.current);
        if (again.length) {
          await joinGroups(...again);
          console.log('🔁 Re-suscrito a grupos tras reconexión:', again);
        }
      });
    },
    [user?.username, department, postJSON, joinGroups, ticketsDispatch, dailyStatsDispatch]
  );

  // ---- enviar a un grupo (opcional, útil para pruebas/admin) ----
  const sendToGroup = useCallback(
    async (groupName, target, payload) => {
      return postJSON(`${ENDPOINT_URLS.SIGNALRGROUPS}/signalr/send-group`, {
        groupName,
        target,
        payload,
      });
    },
    [postJSON]
  );

  // ---- desconectar ----
  const disconnect = useCallback(async () => {
    const conn = connectionRef.current;
    connectionRef.current = null;
    subscribedGroupsRef.current.clear();
    if (conn) {
      try { await conn.stop(); } catch {}
    }
  }, []);

  return (
    <SignalRContext.Provider value={{ initializeSignalR, joinGroups, sendToGroup, disconnect }}>
      {children}
    </SignalRContext.Provider>
  );
}

export function useSignalR() {
  return useContext(SignalRContext);
}
