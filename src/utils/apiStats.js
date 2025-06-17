// ticketUtils.js

//statistics
export const getStats = async (accessToken, date) => {
  if (accessToken === null) return { success: false, message: 'No access token provided' };

  try {
    const response = await fetch(`https://cservicesapi.azurewebsites.net/api/cosmoGetStats?date=${encodeURIComponent(date)}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Error fetching tickets');
    }

    // Devuelve solo los datos
    return { success: true, message: data.message || 'Updated successfully' };
  } catch (err) {
    const message = err.message || 'Something went wrong';
    return { success: false, message };
  }
};

export const getTicketsByStatus = async (accessToken, status, date) => {
  if (accessToken === null) return { success: false, message: 'No access token provided' };
  
  try {
    const response = await fetch(`https://cservicesapi.azurewebsites.net/api/cosmoGetTicketsByStatus?status=${encodeURIComponent(status)}&date=${encodeURIComponent(date)}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Error fetching tickets');
    }

    // Devuelve solo los datos
    return { success: true, message: data.message || 'Updated successfully' };
  } catch (err) {
    const message = err.message || 'Something went wrong';
    return { success: false, message };
  }
};

export const getTicketResolvedByAgents = async (accessToken, date) => {
  if (accessToken === null) return { success: false, message: 'No access token provided' };
  
  try {
    const response = await fetch(`https://cservicesapi.azurewebsites.net/api/cosmoGetDailyResolvedByAgent?date=${encodeURIComponent(date)}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });


    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Error fetching tickets');
    }

    // Devuelve solo los datos
    return { success: true, message: data.message || 'Updated successfully' };
  } catch (err) {
    const message = err.message || 'Something went wrong';
    return { success: false, message };
  }
};