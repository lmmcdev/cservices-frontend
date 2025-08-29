// utils/ticketsReducer.js

const getStatus = (t) => (t?.status ? t.status : 'Unknown');

// firma compacta de la clasificación AI para detectar cambios relevantes
const aiSig = (t) => {
  const ai = t?.aiClassification || t?.ai_classification || null;
  if (!ai) return null;
  const p = (ai.priority || '').toLowerCase();
  const r = (ai.risk || '').toLowerCase();
  const c = (ai.category || '').toLowerCase();
  return `${p}|${r}|${c}`;
};

/**
 * Qué cambios son relevantes para la UI (tabla/contadores).
 * ⚠️ Incluimos aiClassification (firma) para que la tabla se refresque.
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

  // snapshot enlazado
  lps_Name: t.linked_patient_snapshot?.Name ?? null,
  lps_DOB: t.linked_patient_snapshot?.DOB ?? null,

  // QC visibles
  quality_control: t.quality_control ?? null,
  qc_status: t.qc?.status ?? null,

  // 👇 firma AI para detectar cambios (priority/risk/category)
  ai_signature: aiSig(t),

  // timestamps opcionales
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
  tickets: [],
  agents: [],
  updated_agent: [],
  updated_action: [],
  statistics: [],
  historical_statistics: [],
  closedTickets_statistics: [],
  closedHistoricalTickets_statistics: [],
  error: null,

  ids: [],
  byId: {},
  statusCounts: {},
  _ticketsVersion: 0,
};

export const ticketReducer = (state, action) => {
  switch (action.type) {
    case 'SET_TICKETS': {
      const tickets = Array.isArray(action.payload) ? action.payload : [];
      const { ids, byId, statusCounts } = buildDerived(tickets);
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

    case 'ADD_TICKET': {
      const t = action.payload;
      if (!t?.id) return state;

      const prev = state.byId[t.id];
      if (prev) {
        const merged = { ...prev, ...t };
        if (isNoopUpdate(prev, merged)) return state;

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

    case 'UPD_TICKET': {
      const t = action.payload;
      if (!t?.id) return state;

      const prev = state.byId[t.id];
      if (!prev) {
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
      if (isNoopUpdate(prev, merged)) return state;

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

    case 'DEL_TICKET': {
      const t = action.payload;
      if (!t?.id) return state;

      if (!state.byId[t.id]) return state; // ya no estaba

      const tickets = state.tickets.filter(x => x.id !== t.id);
      const ids = state.ids.filter(id => id !== t.id);
      const { [t.id]: _, ...byId } = state.byId;

      const s = getStatus(state.byId[t.id]);
      const statusCounts = {
        ...state.statusCounts,
        [s]: Math.max(0, (state.statusCounts[s] || 1) - 1),
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

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    default:
      return state;
  }
};
