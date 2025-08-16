// utils/ticketsReducer.js

const getStatus = (t) => (t?.status ? t.status : 'Unknown');

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
  _ticketsVersion: 0,     // bump en cada cambio para memo/selectores
};

export const ticketReducer = (state, action) => {
  switch (action.type) {
    // ------------------------------------------------------
    // Tickets: set masivo
    // ------------------------------------------------------
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

    // ------------------------------------------------------
    // Tickets: alta (evita duplicados por id)
    // ------------------------------------------------------
    case 'ADD_TICKET': {
      const t = action.payload;
      if (!t?.id) return state;
      if (state.byId[t.id]) return state; // ya existe

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
      // si no existía, lo agregamos al final para no romper orden actual
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

      // merge en array tickets (mantiene posición)
      const tickets = state.tickets.map(x => (x.id === t.id ? { ...x, ...t } : x));
      // merge en byId
      const merged = { ...prev, ...t };
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
