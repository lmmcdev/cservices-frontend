// utils/providersActions.js
import { getTicketsByPatientId } from "../apiPatients";

export async function handleGetTicketsByPatient({ setLoading, dataPatient, setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen }) {
    //console.log('Fetching tickets for patient:', dataPatient);
    setLoading(true);
    const result = await getTicketsByPatientId(dataPatient.id );
    if (result.success) {
        setSuccessMessage('Tickets fetched successfully');
        setSuccessOpen(true);
        setLoading(false);
    } else {
        setErrorMessage(result.message);
        setErrorOpen(true);
        setLoading(false)
    }
  
    return result;
}

