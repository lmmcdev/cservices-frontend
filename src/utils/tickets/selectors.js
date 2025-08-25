// utils/tickets/selectors.js

import { normalizeTicketDate } from "../js/normalizeDate";

// Estado base
export const selectTickets = (state) => state.tickets || [];
export const selectTicketsIds = (state) => state.ids || [];
export const selectTicketsById = (state) => state.byId || {};
export const selectStatusCounts = (state) => state.statusCounts || {};
export const selectTicketsVersion = (state) => state._ticketsVersion || 0;

// Ticket puntual
export const selectTicketById = (state, id) => (state.byId?.[id] || null);

// Helpers puros (puedes testearlos fácilmente)
export function filterTickets(rows, { status, agents, callers, date, departments }) {
  const list = Array.isArray(rows) ? rows : [];

  return list.filter(r => {
    const byStatus = status === 'Total' || r.status === status;
    const byAgent  = !agents?.length || agents.includes(r.agent_assigned);
    const byCaller = !callers?.length || callers.includes(r.caller_id || r.caller_id?.toString());
    const byDate = normalizeTicketDate(r.creation_date?.split('T')[0]);
    //const dateRoot = r.creation_date;
    //const byDate   = !date || date === dateRoot;
    const byDept   = !departments?.length || departments.includes(r.assigned_department);
    return byStatus && byAgent && byCaller && byDate && byDept;
  });
}

export function sortByCreatedAt(rows, dir = 'desc') {
  const list = [...(rows || [])];
  list.sort((a, b) => {
    const A = new Date(a.creation_date);
    const B = new Date(b.creation_date);
    return dir === 'asc' ? A - B : B - A;
  });
  return list;
}

export function paginate(rows, page, rowsPerPage) {
  const start = page * rowsPerPage;
  return (rows || []).slice(start, start + rowsPerPage);
}

// Selector compuesto de ejemplo (útil dentro de un useMemo)
export function makeSelectVisibleTickets() {
  // podrías usar reselect; aquí un builder simple:
  return function select(state, ui) {
    const rows = selectTickets(state);
    const filtered = filterTickets(rows, {
      status: ui.selectedStatus,
      agents: ui.assignedAgents,
      caller_id: ui.callerIds,
      creation_date: ui.date,
      departments: ui.assignedDepartment,
    });
    const sorted = sortByCreatedAt(filtered, ui.sortDirection);
    return paginate(sorted, ui.page, ui.rowsPerPage);
  };
}


export function countByStatus(rows) {
  return (rows || []).reduce((acc, t) => {
    const s = t.status || 'Unknown';
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});
}
