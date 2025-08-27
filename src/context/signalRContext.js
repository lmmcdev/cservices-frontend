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

export function SignalRProvider({ children }) {
  const connectionRef = useRef(null);
  const subscribedGroupsRef = useRef(new Set());
  const lastFingerprintRef = useRef(new Map());

  const ticketsDispatch = useTicketsDispatch();
  const dailyStatsDispatch = useDailyStatsDispatch();
  const { user } = useAuth();

  // agents del contexto
  const { state: agentsState } = useAgents();
  const agents = Array.isArray(agentsState?.agents) ? agentsState.agents : [];

  // ---------------- helpers ----------------
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

  // ---------------- grupo desde agentsContext ----------------
  const currentEmail =
    (user?.username || user?.idTokenClaims?.preferred_username || '').toLowerCase();

  const currentAgent = agents.find(a => {
    const mail = (a?.agent_email || a?.email || '').toLowerCase();
    return mail === currentEmail || (user?.localAccountId && a?.id === user.localAccountId);
  });

  // puede venir string u objeto { group: "..." } / { name: "..." }
  function resolveRawLocationGroup(agent) {
    if (!agent) return null;
    const g = agent.group_sys_name;
    if (!g) return null;
    if (typeof g === 'string') return g.trim();
    if (typeof g === 'object') return (g.group || g.name || '').trim() || null;
    return null;
  }

  function normalizeDeptGroup(raw) {
    if (!raw) return null;
    const v = String(raw).trim().toLowerCase();
    return v.includes(':') ? v : `department:${v}`;
  }

  // SOLO el grupo de ubicación (no uses department del auth)
  function resolveDesiredGroups() {
    const privateUser = currentEmail || null; // opcional: grupo privado por email
    const rawLoc = resolveRawLocationGroup(currentAgent);
    const locationGroup = normalizeDeptGroup(rawLoc);

    // Si no quieres grupo privado, quítalo del array:
    const groups = [/* privateUser, */ locationGroup].filter(Boolean);
    return [...new Set(groups)];
  }

  // ---------------- join/leave differencial ----------------
  const syncGroups = useCallback(
    async (targetGroups, { force = false } = {}) => {
      const userId =
        (user?.username || user?.idTokenClaims?.preferred_username || '').trim();
      if (!userId) return;

      const target = Array.isArray(targetGroups)
        ? [...new Set(targetGroups.filter(Boolean))]
        : [];

      // cuáles sacar y cuáles agregar
      const current = subscribedGroupsRef.current;
      const toRemove = force
        ? Array.from(current).filter(g => !target.includes(g))
        : Array.from(current).filter(g => !target.includes(g));

      const toAdd = force
        ? target
        : target.filter(g => !current.has(g));

      // REMOVER
      if (toRemove.length) {
        await Promise.all(
          toRemove.map(groupName =>
            postJSON(`${ENDPOINT_URLS.SIGNALRGROUPS}/signalr/group`, {
              userId,
              groupName,
              action: 'remove',
            }).catch(() => {}) // tolerante
          )
        );
        toRemove.forEach(g => current.delete(g));
        console.debug('[SignalR] left groups:', toRemove);
      }

      // AGREGAR
      if (toAdd.length) {
        await Promise.all(
          toAdd.map(groupName =>
            postJSON(`${ENDPOINT_URLS.SIGNALRGROUPS}/signalr/group`, {
              userId,
              groupName,
              action: 'add',
            })
          )
        );
        toAdd.forEach(g => current.add(g));
        console.debug('[SignalR] joined groups:', toAdd);
      }
    },
    [user?.username, user?.idTokenClaims, postJSON]
  );

  const refreshGroupMembership = useCallback(
    async ({ force = false } = {}) => {
      if (!connectionRef.current || !user?.username) return;
      const desired = resolveDesiredGroups();
      await syncGroups(desired, { force });
    },
    [user?.username, syncGroups, currentAgent]
  );

  // ---------------- iniciar conexión ----------------
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

      // Suscribe sólo a los grupos deseados (leave/then add)
      await refreshGroupMembership({ force: true });

      connection.onreconnected(async () => {
        // fuerza re-sync completo
        subscribedGroupsRef.current.clear();
        await refreshGroupMembership({ force: true });
      });
    },
    [user?.username, postJSON, shouldDispatch, ticketsDispatch, dailyStatsDispatch, refreshGroupMembership]
  );

  // Re-sync cuando cambie el agente o su group_sys_name
  useEffect(() => {
    if (connectionRef.current && user?.username) {
      refreshGroupMembership({ force: false }).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAgent, currentEmail]);

  // ---------------- send & disconnect ----------------
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
    lastFingerprintRef.current.clear();
    if (conn) {
      try { await conn.stop(); } catch {}
    }
  }, []);

  return (
    <SignalRContext.Provider
      value={{ initializeSignalR, refreshGroupMembership, sendToGroup, disconnect }}
    >
      {children}
    </SignalRContext.Provider>
  );
}

export function useSignalR() {
  return useContext(SignalRContext);
}
