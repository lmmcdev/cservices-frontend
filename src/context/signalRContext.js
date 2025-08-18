// src/context/signalRContext.jsx
import React, { createContext, useContext, useRef, useCallback } from 'react';
import * as signalR from '@microsoft/signalr';
import { useTicketsDispatch } from './ticketsContext';
import { useDailyStatsDispatch } from './dailyStatsContext';
import { useAuth } from './authContext';
import { ENDPOINT_URLS } from '../utils/js/constants';

const SignalRContext = createContext();

export function SignalRProvider({ children }) {
  const connectionRef = useRef(null);
  const subscribedGroupsRef = useRef(new Set()); // para re-suscribir en reconexión
  const dispatch = useTicketsDispatch();
  const dailyStatsDispatch = useDailyStatsDispatch();
  const { department, user } = useAuth();

  // ---------- helpers HTTP ----------
  const postJSON = async (url, body) => {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body || {}),
    });
    if (!res.ok) {
      const txt = await res.text().catch(() => '');
      throw new Error(`${res.status} ${res.statusText} - ${txt || 'Request failed'}`);
    }
    return res.json();
  };

  // Suscribir un userId a varios grupos (v3 serverless: se hace por HTTP)
  const subscribeToGroups = useCallback(async (userId, groups = []) => {
    const unique = [...new Set(groups.filter(Boolean))];
    if (unique.length === 0) return;

    await Promise.all(
      unique.map((groupName) =>
        postJSON(`${ENDPOINT_URLS.SIGNALRGROUPS}/signalr/group`, {
          userId,
          groupName,
          action: 'add',
        })
      )
    );

    // registrar grupos locales para re-suscribir si hay reconexión
    const set = subscribedGroupsRef.current;
    unique.forEach((g) => set.add(g));
  }, [ENDPOINT_URLS?.SIGNALRGROUPS]); // eslint-disable-line react-hooks/exhaustive-deps

  // ---------- inicialización ----------
  const initializeSignalR = useCallback(async ({ onTicketCreated, onTicketUpdated } = {}) => {
    // evitar múltiples conexiones
    if (connectionRef.current) return;
    if (!user?.username) {
      console.warn('SignalR: no user available yet.');
      return;
    }

    try {
      // 1) Negotiate (v3: POST body con { userId })
      const { url, accessToken } = await postJSON(
        `${ENDPOINT_URLS.SIGNALRGROUPS}/negotiate`,
        { userId: user.username }
      );

      // 2) Build connection
      const connection = new signalR.HubConnectionBuilder()
        .withUrl(url, { accessTokenFactory: () => accessToken })
        .withAutomaticReconnect()
        .build();

      // 3) Handlers
      connection.on('ticketCreated', (ticket) => {
        if (!ticket) return;
        // si quieres filtrar por departamento:
        if (!department || ticket.assigned_department === department) {
          dispatch({ type: 'ADD_TICKET', payload: ticket });
          onTicketCreated?.(ticket);
        }
      });

      connection.on('ticketUpdated', (ticket) => {
        console.log('ticketUpdated', ticket)
        if (!ticket) return;
        // si status Done no se pinta en tu vista, puedes condicionar aquí si quieres
        dispatch({ type: 'UPD_TICKET', payload: ticket });
        onTicketUpdated?.(ticket);
      });

      connection.on('dailyStats', (data) => {
        console.log('dailyStats', data);
        dailyStatsDispatch({ type: 'SET_DAILY_STATS', payload: data });
      });

      // 4) Conectar
      await connection.start();
      console.log('✅ SignalR conectado');

      // 5) Suscribir a grupos vía HTTP (no invoke en serverless)
      const baseGroups = [
        user.username,                    // canal personal
        department ? `department:Referrals` : null,
        //department ? `department:${department}` : null,
        // agrega más si quieres: p. ej. roles, módulos, etc.
      ];
      await subscribeToGroups(user.username, baseGroups);

      // 6) Re-suscribir en reconexiones
      connection.onreconnected(async () => {
        try {
          const again = Array.from(subscribedGroupsRef.current);
          if (again.length) {
            await subscribeToGroups(user.username, again);
            console.log('🔁 Re-suscrito a grupos tras reconexión:', again);
          }
        } catch (e) {
          console.warn('⚠️ Falló re-suscripción tras reconexión:', e.message);
        }
      });

      // 7) Guardar ref
      connectionRef.current = connection;
    } catch (err) {
      console.error('❌ Error al conectar con SignalR:', err);
    }
  }, [user?.username, department, ENDPOINT_URLS?.SIGNALRGROUPS, dispatch, dailyStatsDispatch, subscribeToGroups]);

  // ---------- opcional: API para enviar a grupos desde el cliente ----------
  // Útil si necesitas “pedir” al backend que envíe a un grupo (para pruebas/admin)
  const sendToGroup = useCallback(async (groupName, target, payload) => {
    return postJSON(`${ENDPOINT_URLS.SIGNALRGROUPS}/signalr/send`, {
      groupName,
      target: target || 'notify',
      payload: payload || {},
    });
  }, [ENDPOINT_URLS?.SIGNALRGROUPS]); // eslint-disable-line react-hooks/exhaustive-deps

  // ---------- cleanup ----------
  const disconnect = useCallback(async () => {
    const conn = connectionRef.current;
    connectionRef.current = null;
    subscribedGroupsRef.current = new Set();
    if (conn) {
      try { await conn.stop(); } catch {}
    }
  }, []);

  return (
    <SignalRContext.Provider value={{ initializeSignalR, sendToGroup, disconnect }}>
      {children}
    </SignalRContext.Provider>
  );
}

export function useSignalR() {
  return useContext(SignalRContext);
}
