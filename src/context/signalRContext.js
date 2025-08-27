// src/context/signalRContext.js
import React, {
  createContext,
  useContext,
  useRef,
  useCallback,
  useEffect,
} from 'react';
import * as signalR from '@microsoft/signalr';
import { useTicketsDispatch } from './ticketsContext';
import { useDailyStatsDispatch } from './dailyStatsContext';
import { useAuth } from './authContext';
import { useAgents } from './agentsContext';
import { ENDPOINT_URLS } from '../utils/js/constants';

const SignalRContext = createContext();

function toLower(s) { return (s || '').trim().toLowerCase(); }

// Normaliza a formato "department:<nombre>" en minúsculas
function normalizeDepartmentGroup(raw) {
  if (!raw) return null;
  let v = String(raw).trim();
  if (!v) return null;
  v = v.toLowerCase();
  if (!v.startsWith('department:')) v = `department:${v}`;
  return v;
}

// Extrae group desde agent.group_sys_name
function resolveGroupFromAgent(agent) {
  if (!agent) return null;
  const g = agent.group_sys_name;
  if (!g) return null;
  if (typeof g === 'string') return normalizeDepartmentGroup(g);
  if (typeof g === 'object') return normalizeDepartmentGroup(g.group || g.name);
  return null;
}

export function SignalRProvider({ children }) {
  const connectionRef = useRef(null);
  const subscribedGroupsRef = useRef(new Set());
  const lastFingerprintRef = useRef(new Map());

  const ticketsDispatch = useTicketsDispatch();
  const dailyStatsDispatch = useDailyStatsDispatch();

  const { user } = useAuth();
  const { state: agentsState } = useAgents();
  const agents = Array.isArray(agentsState?.agents) ? agentsState.agents : [];

  // Usuario/email para userId
  const userId = toLower(user?.username || user?.idTokenClaims?.preferred_username);

  // Buscar el agente actual por email o id
  const currentAgent = agents.find(a => {
    const mail = toLower(a?.agent_email || a?.email);
    return mail && mail === userId || (user?.localAccountId && a?.id === user?.localAccountId);
  });

  // Grupo objetivo: SOLO el del department que viene desde agent.group_sys_name.group
  const targetGroup = resolveGroupFromAgent(currentAgent); // ej: "department:switchboard"

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

  // Dedupe para tickets
  const ticketFingerprint = useCallback((t) => {
    if (!t) return '';
    return JSON.stringify({
      id: t.id,
      status: t.status,
      agent_assigned: t.agent_assigned,
      assigned_department: t.assigned_department,
      quality_control: t.quality_control,
      qc_status: t.qc?.status ?? null,
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

  // Unirse a UN grupo (department:<x>)
  const joinGroup = useCallback(async (groupName) => {
    if (!connectionRef.current) return;
    if (!userId || !groupName) return;

    const norm = normalizeDepartmentGroup(groupName);
    if (!norm) return;
    if (subscribedGroupsRef.current.has(norm)) return;

    await postJSON(`${ENDPOINT_URLS.SIGNALRGROUPS}/signalr/group`, {
      userId,
      groupName: norm,
      action: 'add',
    });

    subscribedGroupsRef.current.add(norm);
  }, [userId, postJSON]);

  // Salir de grupo (por si cambia el agente)
  const leaveGroup = useCallback(async (groupName) => {
    if (!connectionRef.current) return;
    if (!userId || !groupName) return;

    const norm = normalizeDepartmentGroup(groupName);
    if (!norm) return;
    if (!subscribedGroupsRef.current.has(norm)) return;

    await postJSON(`${ENDPOINT_URLS.SIGNALRGROUPS}/signalr/group`, {
      userId,
      groupName: norm,
      action: 'remove',
    });

    subscribedGroupsRef.current.delete(norm);
  }, [userId, postJSON]);

  // Garantiza que solo estés suscrito al grupo del agente actual
  const refreshMembership = useCallback(async () => {
    if (!connectionRef.current || !userId) return;

    const desired = targetGroup; // puede ser null si aún no cargó el agente
    const current = Array.from(subscribedGroupsRef.current);

    // salir de todos los que no sean el deseado
    await Promise.all(
      current
        .filter(g => g !== desired)
        .map(g => leaveGroup(g).catch(() => {}))
    );

    // unirse al deseado si no lo tienes aún
    if (desired && !subscribedGroupsRef.current.has(desired)) {
      await joinGroup(desired);
    }
  }, [userId, targetGroup, joinGroup, leaveGroup]);

  // Inicializa SignalR
  const initializeSignalR = useCallback(async (handlers = {}) => {
    if (connectionRef.current || !userId) return;

    const { url, accessToken } = await postJSON(
      `${ENDPOINT_URLS.SIGNALRGROUPS}/negotiate`,
      { userId }
    );

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(url, { accessTokenFactory: () => accessToken })
      .withAutomaticReconnect()
      .build();

    connection.on('ticketCreated', (ticket) => {
      if (!ticket) return;
      if (!shouldDispatch(ticket)) return;
      ticketsDispatch({ type: 'ADD_TICKET', payload: ticket });
      handlers.onTicketCreated?.(ticket);
    });

    connection.on('ticketUpdated', (ticket) => {
      if (!ticket) return;
      if (!shouldDispatch(ticket)) return;
      ticketsDispatch({ type: 'UPD_TICKET', payload: ticket });
      handlers.onTicketUpdated?.(ticket);
    });

    connection.on('dailyStats', (data) => {
      if (!data) return;
      const doc = Array.isArray(data) ? data[0] : data;
      dailyStatsDispatch({ type: 'SET_DAILY_STATS', payload: doc });
      handlers.onDailyStats?.(doc);
    });

    await connection.start();
    connectionRef.current = connection;

    // Primera suscripción (si el agente ya está listo)
    await refreshMembership();

    connection.onreconnected(async () => {
      // limpiar cache local y re-suscribir SOLO al grupo deseado
      subscribedGroupsRef.current.clear();
      await refreshMembership();
    });
  }, [userId, postJSON, shouldDispatch, ticketsDispatch, dailyStatsDispatch, refreshMembership]);

  // Si cambia el agente o su group_sys_name, refrescar membresía
  useEffect(() => {
    if (connectionRef.current && userId) {
      refreshMembership().catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, targetGroup]);

  // Utilidades
  const sendToGroup = useCallback(async (groupName, target, payload) => {
    const norm = normalizeDepartmentGroup(groupName);
    if (!norm) throw new Error('Invalid group name');
    return postJSON(`${ENDPOINT_URLS.SIGNALRGROUPS}/signalr/send-group`, {
      groupName: norm,
      target,
      payload,
    });
  }, [postJSON]);

  const disconnect = useCallback(async () => {
    const conn = connectionRef.current;
    connectionRef.current = null;
    subscribedGroupsRef.current.clear();
    lastFingerprintRef.current.clear();
    if (conn) { try { await conn.stop(); } catch {} }
  }, []);

  return (
    <SignalRContext.Provider
      value={{ initializeSignalR, sendToGroup, disconnect }}
    >
      {children}
    </SignalRContext.Provider>
  );
}

export function useSignalR() {
  return useContext(SignalRContext);
}
