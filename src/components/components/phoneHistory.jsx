// hooks/usePhoneHistory.js
import React, { useReducer, useState, useEffect } from 'react';
import { ticketReducer, initialState } from '../../utils/ticketsReducer';
import { useLoading } from '../loadingProvider';
import { phoneHistory } from '../../utils/api';

const usePhoneHistory = (phoneNumber) => {
    const [state, dispatch] = useReducer(ticketReducer, initialState);
      const [errorOpen, setErrorOpen] = useState(false);
      const [successOpen, setSuccessOpen] = useState(false);
      const [editField, setEditField] = useState(null); 
      const [successMessage, setSuccessMessage] = useState('');
      const [errorMessage, setErrorMessage] = useState('');
    
    const { setLoading } = useLoading();
    
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!phoneNumber) return;
      setLoading(true);
      setError(null);

      try {
        const result = await phoneHistory(dispatch, setLoading, phoneNumber);
        console.log(result)
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
  }, [phoneNumber]);

  return { history, error };
};

export default usePhoneHistory;
