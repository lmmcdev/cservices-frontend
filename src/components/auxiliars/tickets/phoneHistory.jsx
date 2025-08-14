// hooks/usePhoneHistory.js
import   { useReducer, useState, useEffect } from 'react';
import { ticketReducer, initialState } from '../../../store/ticketsReducer';
import { useLoading } from '../../../providers/loadingProvider';
import { phoneHistory } from '../../../utils/apiTickets';

const usePhoneHistory = (phoneNumber) => {
    const [, dispatch] = useReducer(ticketReducer, initialState);
    const [, setErrorOpen] = useState(false);
    const [, setSuccessOpen] = useState(false);
    const [, setSuccessMessage] = useState('');
    const [, setErrorMessage] = useState('');
    
    const { setLoading } = useLoading();
    
    const [history, setHistory] = useState([]);
    const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!phoneNumber) return;
      setError(null);
        setLoading(true)
      try {
        const result = await phoneHistory(dispatch, setLoading, phoneNumber);
        if (result.success) {
            setSuccessMessage(result.message);
            setSuccessOpen(true);
        } else {
            setErrorMessage(result.message);
            setErrorOpen(true);
        }  
        setHistory(result.message || []);
      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [phoneNumber, setLoading]);

  return { history, error };
};

export default usePhoneHistory;
