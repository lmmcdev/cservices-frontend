// src/context/agentsContext.js
import React, { createContext, useContext, useReducer, useMemo } from 'react';
import { agentsReducer, initialAgentsState } from '../store/agentsReducer';

const AgentsContext = createContext(null);

export const AgentsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(agentsReducer, initialAgentsState);
  // Evita re renders extra por cambio de identidad del objeto
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <AgentsContext.Provider value={value}>{children}</AgentsContext.Provider>;
};

export const useAgents = () => {
  const ctx = useContext(AgentsContext);
  if (!ctx) {
    throw new Error('useAgents debe usarse dentro de <AgentsProvider>');
  }
  return ctx;
};
