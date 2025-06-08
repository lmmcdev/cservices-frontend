// agentsContext.js
import React, { createContext, useContext, useReducer } from 'react';
import { ticketReducer, initialState } from '../../store/ticketsReducer';

const AgentsContext = createContext();

export const AgentsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(ticketReducer, initialState);

  return (
    <AgentsContext.Provider value={{ state, dispatch }}>
      {children}
    </AgentsContext.Provider>
  );
};

export const useAgents = () => useContext(AgentsContext);
