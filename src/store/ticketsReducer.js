// utils/ticketsReducer.js

const getStatus = (t) => (t?.status ? t.status : 'Unknown');

/**
 * Qué cambios son relevantes para la UI (tabla/contadores).
 * Ajusta si tu tabla usa más/menos campos.
 */
const pickRelevant = (t = {}) => ({
  id: t.id,
  status: t.status ?? 'Unknown',
  agent_assigned: t.agent_assigned ?? null,
  assigned_department: t.assigned_department ?? null,

  // columnas visibles
  caller_id: t.caller_id ?? null,
  patient_name: t.patient_name ?? null,
  patient_dob: t.patient_dob ?? null,
  phone: t.phone ?? null,
  creation_date: t.creation_date ?? null,

  // si tu UI muestra snapshot enlazado para nombre/DOB, ténganlo en cuenta
  lps_Name: t.linked_patient_snapshot?.Name ?? null,
  lps_DOB: t.linked_patient_snapshot?.DOB ?? null,

  // indicadores QC visibles
  quality_control: t.quality_control ?? null,
  qc_status: t.qc?.status ?? null,

  // si tienes timestamps/etags, ayudan a detectar cambios reales rápido
  _ts: t._ts ?? null,
});

/** Shallow equal de objetos planos */
const shallowEqual = (a, b) => {
  if (a === b) return true;
  if (!a || !b) return false;
  const ak = Object.keys(a);
  const bk = Object.keys(b);
  if (ak.length !== bk.length) return false;
  for (const k of ak) {
    if (a[k] !== b[k]) return false;
  }
  return true;
};

/** Devuelve true si el update NO cambia nada relevante para la UI */
const isNoopUpdate = (prev, next) => shallowEqual(pickRelevant(prev), pickRelevant(next));

function buildDerived(tickets) {
  const ids = [];
  const byId = {};
  const statusCounts = {};

  for (const t of tickets || []) {
    ids.push(t.id);
    byId[t.id] = t;
    const s = getStatus(t);
    statusCounts[s] = (statusCounts[s] || 0) + 1;
  }
  return { ids, byId, statusCounts };
}

export const initialState = {
  // existentes
  tickets: [],
  agents: [],
  updated_agent: [],
  updated_action: [],
  statistics: [],
  historical_statistics: [],
  closedTickets_statistics: [],
  closedHistoricalTickets_statistics: [],
  error: null,

  // nuevos índices derivados
  ids: [],
  byId: {},               // { [id]: ticket }
  statusCounts: {},       // { 'New': 10, 'Done': 3, ... }
  _ticketsVersion: 0,     // bump en cambios reales
};

export const ticketReducer = (state, action) => {
  switch (action.type) {
    // ------------------------------------------------------
    // Tickets: set masivo
    // ------------------------------------------------------
    case 'SET_TICKETS': {
      const tickets = Array.isArray(action.payload) ? action.payload : [];
      const { ids, byId, statusCounts } = buildDerived(tickets);

      // (opcional) micro-optimización: si ids y counts no cambian, puedes no bumpear versión
      // La dejamos simple: siempre reemplaza el lote (suele venir distinto).
      return {
        ...state,
        tickets,
        ids,
        byId,
        statusCounts,
        _ticketsVersion: state._ticketsVersion + 1,
        error: null,
      };
    }

    // ------------------------------------------------------
    // Tickets: alta (evita duplicados por id) / o actúa como update si cambió
    // ------------------------------------------------------
    case 'ADD_TICKET': {
      const t = action.payload;
      if (!t?.id) return state;

      const prev = state.byId[t.id];
      if (prev) {
        // si ya existe y no cambia nada relevante → no-op
        const merged = { ...prev, ...t };
        if (isNoopUpdate(prev, merged)) return state;

        // si cambia algo relevante → actúa como update manteniendo posición
        const tickets = state.tickets.map(x => (x.id === t.id ? merged : x));
        const byId = { ...state.byId, [t.id]: merged };

        const prevS = getStatus(prev);
        const newS = getStatus(merged);
        let statusCounts = state.statusCounts;
        if (prevS !== newS) {
          statusCounts = {
            ...state.statusCounts,
            [prevS]: Math.max(0, (state.statusCounts[prevS] || 1) - 1),
            [newS]: (state.statusCounts[newS] || 0) + 1,
          };
        }

        return {
          ...state,
          tickets,
          byId,
          statusCounts,
          _ticketsVersion: state._ticketsVersion + 1,
        };
      }

      // no existía → agregar
      const tickets = [t, ...state.tickets];
      const ids = [t.id, ...state.ids];
      const byId = { ...state.byId, [t.id]: t };
      const s = getStatus(t);
      const statusCounts = {
        ...state.statusCounts,
        [s]: (state.statusCounts[s] || 0) + 1,
      };

      return {
        ...state,
        tickets,
        ids,
        byId,
        statusCounts,
        _ticketsVersion: state._ticketsVersion + 1,
      };
    }

    // ------------------------------------------------------
    // Tickets: actualización por id (merge)
    // ------------------------------------------------------
    case 'UPD_TICKET': {
      const t = action.payload;
      if (!t?.id) return state;

      const prev = state.byId[t.id];
      if (!prev) {
        // no existía → agregar al final para no romper orden actual
        const tickets = [...state.tickets, t];
        const ids = [...state.ids, t.id];
        const byId = { ...state.byId, [t.id]: t };
        const s = getStatus(t);
        const statusCounts = {
          ...state.statusCounts,
          [s]: (state.statusCounts[s] || 0) + 1,
        };
        return {
          ...state,
          tickets,
          ids,
          byId,
          statusCounts,
          _ticketsVersion: state._ticketsVersion + 1,
        };
      }

      const merged = { ...prev, ...t };

      // ✅ si el merge NO cambia nada relevante → NOOP (sin bump de versión)
      if (isNoopUpdate(prev, merged)) return state;

      // merge en array tickets (mantiene posición)
      const tickets = state.tickets.map(x => (x.id === t.id ? merged : x));
      // merge en byId
      const byId = { ...state.byId, [t.id]: merged };

      // actualizar contadores por cambio de status (si lo hay)
      const prevS = getStatus(prev);
      const newS = getStatus(merged);
      let statusCounts = state.statusCounts;
      if (prevS !== newS) {
        statusCounts = {
          ...state.statusCounts,
          [prevS]: Math.max(0, (state.statusCounts[prevS] || 1) - 1),
          [newS]: (state.statusCounts[newS] || 0) + 1,
        };
      }

      return {
        ...state,
        tickets,
        byId,
        statusCounts,
        _ticketsVersion: state._ticketsVersion + 1,
      };
    }

    // ------------------------------------------------------
    // Error
    // ------------------------------------------------------
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};
