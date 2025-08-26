// ticketUtils.js
import { ENDPOINT_URLS } from "./js/constants";

//statistics


export const searchPatients = async (query, filter, page = 1, size = 50) => {
    let url = `${ENDPOINT_URLS.API}/searchPatients`;
    try {
        const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            query,
            filter,
            page,
            size,
        }),
        });
        const data = await response.json();

        if (!response.ok) {
          return { success: false, message: data.message || 'API Error' };
        }

        if (data.success === false) {
          return { success: false, message: data.message || 'Validation failed' };
        }
        // Devuelve solo los datos
        return { success: true, message: data || 'Updated successfully' };
    } catch (err) {
        const message = err.message || 'Something went wrong';
        return { success: false, message };
    }
};


//statistics
//para implementar la busqueda por patient_id (id del paciente linkeado del ticket)
export const getTicketsByPatientId = async (patientId, limit = 10, continuationToken = null) => {
  if (!patientId) return { success: false, message: 'patientId is required' };

  const url = `${ENDPOINT_URLS.API}/searchTickets`;
  const query = `${patientId}`;
  let page = 1;
  let size = 50;
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        query,
        page,
        size // se envía si existe
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, message: data.message || 'API Error' };
    }

    if (data.success === false) {
      return { success: false, message: data.message || 'Validation failed' };
    }

    // Retorno esperado: items y token para la paginación
    return {
      success: true,
      message: {
        items: data.value || [],
        continuationToken: data.continuationToken || null,
      },
    };
  } catch (err) {
    return { success: false, message: err.message || 'Something went wrong' };
  }
};
