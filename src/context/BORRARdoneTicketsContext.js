/*import { createContext, useContext, useReducer } from 'react';
import { ticketReducer, initialState } from '../store/ticketsReducer';
//import { getTicketResolvedByAgents } from '../utils/apiStats';

const DoneTicketsContext = createContext();

export function DoneTicketsProvider({ children }) {
  const [state, dispatch] = useReducer(ticketReducer, initialState);

  const fetchDoneTickets = async (accessToken, date = null) => {
    //dispatch({ type: 'LOADING_CLOSED_TICKETS' }); // opcional
    try {
      const res = await getTicketResolvedByAgents(accessToken, date);
      if (res.success) {
        dispatch({ type: 'SET_CLOSED_TICKETS', payload: res.message });
      } else {
        //dispatch({ type: 'ERROR_CLOSED_TICKETS', payload: res.message });
        console.error('Error fetching stats:', res.message);
      }
    } catch (error) {
      //dispatch({ type: 'ERROR_CLOSED_TICKETS', payload: error.message });
      console.error('Error fetching stats', error);
    }
  };

  return (
    <DoneTicketsContext.Provider value={{ state, dispatch, fetchDoneTickets }}>
      {children}
    </DoneTicketsContext.Provider>
  );
}

// Hooks
export const useDoneStats = () => useContext(DoneTicketsContext);
export const useDoneStatsState = () => useContext(DoneTicketsContext).state;
export const useDoneStatsDispatch = () => useContext(DoneTicketsContext).dispatch;
export const useDoneFetchStatistics = () => useContext(DoneTicketsContext).fetchDoneTickets;*/
