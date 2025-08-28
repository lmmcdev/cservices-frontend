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

  const { state: agentsState } = useAgents();
  const agents = Array.isArray(agentsState?.agents) ? agentsState.agents : [];

  // ---------- helpers ----------
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

  // ---------- grupos ----------
  const currentEmail =
    (user?.username || user?.idTokenClaims?.preferred_username || '').toLowerCase();

  const currentAgent = agents.find(a => {
    const mail = (a?.agent_email || a?.email || '').toLowerCase();
    return mail === currentEmail || (user?.localAccountId && a?.id === user.localAccountId);
  });

  function resolveRawLocationGroup(agent) {
    if (!agent) return null;
    const g = agent.group_sys_name;
    console.log('Agent group_sys_name:', g);
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

  function resolveDesiredGroups() {
    const rawLoc = resolveRawLocationGroup(currentAgent);
    const locationGroup = normalizeDeptGroup(rawLoc);
    return [locationGroup].filter(Boolean);
  }

  // ---------- clean & re-subscribe ----------
  const refreshGroupMembership = useCallback(
    async () => {
      const userId =
        (user?.username || user?.idTokenClaims?.preferred_username || '').trim();
      if (!connectionRef.current || !userId) return;

      const current = Array.from(subscribedGroupsRef.current);
      const desired = [...new Set(resolveDesiredGroups())];

      // 🔴 1) REMOVER TODOS LOS ACTUALES
      if (current.length) {
        await Promise.all(
          current.map(groupName =>
            postJSON(`${ENDPOINT_URLS.SIGNALRGROUPS}/signalr/group`, {
              userId,
              groupName,
              action: 'remove',
            }).catch(() => {})
          )
        );
        subscribedGroupsRef.current.clear();
        console.debug('[SignalR] removed all groups:', current);
      }

      // 🟢 2) AÑADIR SOLO LOS DESEADOS
      if (desired.length) {
        await Promise.all(
          desired.map(groupName =>
            postJSON(`${ENDPOINT_URLS.SIGNALRGROUPS}/signalr/group`, {
              userId,
              groupName,
              action: 'add',
            })
          )
        );
        desired.forEach(g => subscribedGroupsRef.current.add(g));
        console.debug('[SignalR] joined groups:', desired);
      }
    },
    [user?.username, postJSON, currentAgent, currentEmail]
  );

  // ---------- conexión ----------
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

      connection.on('agentAssignment', (data) => {
        console.log('agentAssignment raw data:', data); 
        if (!data) return;

        const doc = Array.isArray(data) ? data[0] : data;

        // helper para normalizar emails
        const norm = (v) => (v && typeof v === 'string' ? v.trim().toLowerCase() : '');

        // email actual del usuario logueado
        const currentEmail =
          norm(user?.username) ||
          norm(user?.idTokenClaims?.preferred_username) ||
          norm(user?.idTokenClaims?.email) ||
          '';

        // normaliza el assigned y collaborators
        const assigned = norm(doc?.agent_assigned);
        const collaborators = Array.isArray(doc?.collaborators)
          ? doc.collaborators.map(norm).filter(Boolean)
          : [];

        // condición: soy el assigned o estoy en los colaboradores
        const isRelevant =
          currentEmail &&
          (currentEmail === assigned || collaborators.includes(currentEmail));

        console.log('[SignalR] agentAssignment check:', {
          currentEmail,
          assigned,
          collaborators,
          matchAssigned: currentEmail === assigned,
          matchCollaborator: collaborators.includes(currentEmail),
          isRelevant,
        });

        if (!isRelevant) {
          console.log('[SignalR] Ignored agentAssignment (not for this user)');
          return;
        }

        // si aplica al usuario logueado, lo paso al handler
        ticketsDispatch({ type: 'UPD_TICKET', payload: doc });
        handlers.onAgentAssignment?.(doc);
    });



      await connection.start();
      connectionRef.current = connection;

      // primera subscripción → limpia todo
      await refreshGroupMembership();

      // reconexión automática → limpia todo y vuelve a suscribir
      connection.onreconnected(async () => {
        subscribedGroupsRef.current.clear();
        await refreshGroupMembership();
      });
    },
    [user?.username, postJSON, shouldDispatch, ticketsDispatch, dailyStatsDispatch, refreshGroupMembership]
  );

  useEffect(() => {
    if (connectionRef.current && user?.username) {
      refreshGroupMembership().catch(() => {});
    }
  }, [currentAgent, currentEmail, refreshGroupMembership, user?.username]);

  // ---------- send & disconnect ----------
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
    const userId = (user?.username || user?.idTokenClaims?.preferred_username || '').trim();

    // 🔴 antes de cerrar → remove all
    const current = Array.from(subscribedGroupsRef.current);
    if (userId && current.length) {
      await Promise.all(
        current.map(groupName =>
          postJSON(`${ENDPOINT_URLS.SIGNALRGROUPS}/signalr/group`, {
            userId,
            groupName,
            action: 'remove',
          }).catch(() => {})
        )
      );
      console.debug('[SignalR] removed on disconnect:', current);
    }

    connectionRef.current = null;
    subscribedGroupsRef.current.clear();
    lastFingerprintRef.current.clear();
    if (conn) {
      try { await conn.stop(); } catch {}
    }
  }, [user?.username, postJSON]);

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
