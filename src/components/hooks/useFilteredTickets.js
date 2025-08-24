// src/components/hooks/useFilteredTickets.js
import { useMemo } from 'react';
import { useFilters } from '../../context/filterContext.js';
import {
  filterTickets,
  sortByCreatedAt,
  paginate,
} from '../../utils/tickets/selectors.js';

const KNOWN_STATUSES = ['New', 'Emergency', 'In Progress', 'Pending', 'Done', 'Duplicated'];

function countByStatus(rows = []) {
  const acc = Object.fromEntries(KNOWN_STATUSES.map(s => [s, 0]));
  for (const r of rows) {
    const s = r?.status;
    if (acc.hasOwnProperty(s)) acc[s] += 1;
  }
  acc.Total = rows.length;
  return acc;
}

export function useFilteredTickets({
  tickets,
  ticketsVersion,
  selectedStatus,
  sortDirection,
  page,
  rowsPerPage,
}) {
  const { filters } = useFilters();

  // 1) Base sin filtro de status (para contadores)
  const baseRows = useMemo(() => (
    filterTickets(tickets, {
      status: 'Total',
      agents: filters.assignedAgents,
      callers: filters.callerIds,
      date: filters.date,
      departments: filters.assignedDepartment,
    })
    //eslint-disable-next-line
  ), [tickets, ticketsVersion, filters]);

  // 2) Filtrado final para tabla
  const filteredRows = useMemo(() => (
    filterTickets(tickets, {
      status: selectedStatus,
      agents: filters.assignedAgents,
      callers: filters.callerIds,
      date: filters.date,
      departments: filters.assignedDepartment,
    })
    //eslint-disable-next-line
  ), [tickets, ticketsVersion, selectedStatus, filters]);

  // 3) Ordenado
  const sortedRows = useMemo(
    () => sortByCreatedAt(filteredRows, sortDirection),
    [filteredRows, sortDirection]
  );

  // 4) Paginado
  const paginatedRows = useMemo(
    () => paginate(sortedRows, page, rowsPerPage),
    [sortedRows, page, rowsPerPage]
  );

  // 5) Contadores
  const ticketsCountByStatus = useMemo(
    () => countByStatus(baseRows),
    [baseRows]
  );

  return {
    filteredRows,
    sortedRows,
    paginatedRows,
    ticketsCountByStatus,
  };
}