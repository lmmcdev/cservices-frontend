// ticketUtils.js
import { ENDPOINT_URLS } from "./js/constants";

//PROPUESTO A BORRRAR, SUSTITUIR POR ticketsByIds
export const getTicketsByStatus = async (status, date, {params}) => {
  //if (accessToken === null) return { success: false, message: 'No access token provided' };
  const token = params.continuationToken;
  let tokenCosmos = ''
  if (params.continuationToken) {
      tokenCosmos = token;
  }
  try {
    const response = await fetch(`${ENDPOINT_URLS.API}/cosmoGetTicketsByStatus`, {
      method: 'POST',
      body: JSON.stringify({
              limit: params.limit,
              continuationToken: tokenCosmos,
              status: status,
              date: date
          })
    });

    const data = await response.json();
    if (!response.ok) {
      return { success: false, message: data.message || 'API Error' };
    }

    if (data.success === false) {
      return { success: false, message: data.message || 'Validation failed' };
    }

    // Devuelve solo los datos
    return { success: true, message: data.message || 'Updated successfully' };
  } catch (err) {
    const message = err.message || 'Something went wrong';
    return { success: false, message };
  }
};


/**usar para obtener la estadistica por hora de un dia especifico (container tickets_stats) */
export const getTicketsByIds = async (ticketIds, {params}) => {
  //if (accessToken === null) return { success: false, message: 'No access token provided' };
  const token = params.continuationToken;
  let tokenCosmos = ''
  if (params.continuationToken) {
      tokenCosmos = token;
  }
  try {
    const response = await fetch(`${ENDPOINT_URLS.API}/cosmoGetByIds`, {
      method: "POST",
      body: JSON.stringify({ 
        limit: params.limit,
        continuationToken: tokenCosmos,
        ticketIds
       }) 
    });


    const data = await response.json();
    if (!response.ok) {
      return { success: false, message: data.message || 'API Error' };
    }

    if (data.success === false) {
      return { success: false, message: data.message || 'Validation failed' };
    }

    // Devuelve solo los datos
    return { success: true, message: {items: data, continuationToken: data.continuationToken} || 'Updated successfully' };
  } catch (err) {
    const message = err.message || 'Something went wrong';
    return { success: false, message };
  }
};


/**usar para obtener la estadistica por hora de un dia especifico (container tickets_stats) */
export const getDailyStats = async (date, scope='date') => {
  // Si date es null o vacío, usa la fecha actual
  const today = new Date();
  const resolvedDate = date || today.toISOString().split('T')[0]; // YYYY-MM-DD

  try {
    const response = await fetch(`${ENDPOINT_URLS.API}/getTicketStats?${scope}=${encodeURIComponent(resolvedDate)}`, {
      method: 'GET',
    });


    const data = await response.json();
    if (!response.ok) {
      return { success: false, message: data.message || 'API Error' };
    }

    if (data.success === false) {
      return { success: false, message: data.message || 'Validation failed' };
    }

    // Devuelve solo los datos
    return { success: true, message: 'Updated successfully', ...data || []};
  } catch (err) {
    const message = err.message || 'Something went wrong';
    return { success: false, message };
  }
};

