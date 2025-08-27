import React, { createContext, useContext, useRef, useCallback } from 'react';
import * as signalR from '@microsoft/signalr';
import { useTicketsDispatch } from './ticketsContext';
import { useDailyStatsDispatch } from './dailyStatsContext';
import { useAuth } from './authContext';
import { ENDPOINT_URLS } from '../utils/js/constants';

const SignalRContext = createContext();

export function SignalRProvider({ children }) {
  const connectionRef = useRef(null);
  const subscribedGroupsRef = useRef(new Set());

  const // 👇 cache para dedupe
        lastFingerprintRef = useRef(new Map());

  const ticketsDispatch = useTicketsDispatch();
  const dailyStatsDispatch = useDailyStatsDispatch();
  const { user, department } = useAuth();

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

  // 🔍 qué consideras “cambió” para la tabla
  const ticketFingerprint = useCallback((t) => {
    if (!t) return '';
    return JSON.stringify({
      id: t.id,
      status: t.status,
      agent_assigned: t.agent_assigned,
      assigned_department: t.assigned_department,
      quality_control: t.quality_control,
      qc_status: t.qc?.status ?? null,
      // si existe timestamp/etag, úsalo para acelerar el short-circuit:
      _ts: t._ts ?? null,
      updatedAt: t.qc?.updatedAt ?? t.updatedAt ?? t.creation_date ?? null,
    });
  }, []);

  const shouldDispatch = useCallback((t) => {
    if (!t?.id) return false;
    const fp = ticketFingerprint(t);
    const prev = lastFingerprintRef.current.get(t.id);
    if (prev === fp) return false;
    lastFingerprintRef.current.set(t.id, fp);
    return true;
  }, [ticketFingerprint]);

  const initializeSignalR = useCallback(
    async (handlers = {}) => {
      if (connectionRef.current || !user?.username) return;

      const { url, accessToken } = await postJSON(
        `${ENDPOINT_URLS.SIGNALRGROUPS}/negotiate`,
        { userId: user.username }
      );

      const connection = new signalR.HubConnectionBuilder()
        .withUrl(url, { accessTokenFactory: () => accessToken })
        .withAutomaticReconnect()
        .build();

      connection.on('ticketCreated', (ticket) => {
        if (!ticket) return;
        // Evita ADD si ya conoces ese exacto snapshot
        if (!shouldDispatch(ticket)) return;
        ticketsDispatch({ type: 'ADD_TICKET', payload: ticket });
        handlers.onTicketCreated?.(ticket);
      });

      connection.on('ticketUpdated', (ticket) => {
        if (!ticket) return;
        // Evita UPD si es idéntico a lo último recibido
        if (!shouldDispatch(ticket)) return;
        ticketsDispatch({ type: 'UPD_TICKET', payload: ticket });
        handlers.onTicketUpdated?.(ticket);
      });

      connection.on('dailyStats', (data) => {
        if (!data) return;
        dailyStatsDispatch({ type: 'SET_DAILY_STATS', payload: data[0] });
        handlers.onDailyStats?.(data);
      });

      await connection.start();
      connectionRef.current = connection;

      const baseGroups = [
        user.username,
        department ? `department:Referrals` : null,
      ];
      await joinGroups(...baseGroups);

      connection.onreconnected(async () => {
        const again = Array.from(subscribedGroupsRef.current);
        if (again.length) await joinGroups(...again);
      });
    },
    [user?.username, department, postJSON, joinGroups, ticketsDispatch, dailyStatsDispatch, shouldDispatch]
  );

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

  const disconnect = useCallback(async () => {
    const conn = connectionRef.current;
    connectionRef.current = null;
    subscribedGroupsRef.current.clear();
    lastFingerprintRef.current.clear(); // limpia dedupe cache
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
