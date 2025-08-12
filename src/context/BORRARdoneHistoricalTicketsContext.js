/*import { createContext, useContext, useReducer } from 'react';
import { ticketReducer, initialState } from '../store/ticketsReducer';
//import { getTicketResolvedByAgents } from '../utils/apiStats';

const DoneHistoricalTicketsContext = createContext();

export function DoneHistoricalTicketsProvider({ children }) {
  const [state, dispatch] = useReducer(ticketReducer, initialState);

  const fetchHistoricalDoneTickets = async (accessToken, date = null) => {
    //dispatch({ type: 'LOADING_CLOSED_TICKETS' }); // opcional
    /*
    try {
      //const res = await getTicketResolvedByAgents(accessToken, date);
      if (res.success) {
        dispatch({ type: 'SET_HISTORICAL_CLOSED_TICKETS', payload: res.message });
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
    <DoneHistoricalTicketsContext.Provider value={{ state, dispatch, fetchHistoricalDoneTickets }}>
      {children}
    </DoneHistoricalTicketsContext.Provider>
  );
}

// Hooks
export const useHistoricalDoneStats = () => useContext(DoneHistoricalTicketsContext);
export const useHistoricalDoneStatsState = () => useContext(DoneHistoricalTicketsContext).state;
export const useHistoricalDoneStatsDispatch = () => useContext(DoneHistoricalTicketsContext).dispatch;
export const useHistoricalDoneFetchStatistics = () => useContext(DoneHistoricalTicketsContext).fetchHistoricalDoneTickets;*/
