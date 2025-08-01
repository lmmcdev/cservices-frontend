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

export const getTicketsByStatus = async (accessToken, status, date, {params}) => {
  if (accessToken === null) return { success: false, message: 'No access token provided' };
  const token = params.continuationToken;
  let tokenCosmos = ''
  if (params.continuationToken) {
      tokenCosmos = token;
  }
  try {
    const response = await fetch(`https://cservicesapi.azurewebsites.net/api/cosmoGetTicketsByStatus`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
              limit: params.limit,
              continuationToken: tokenCosmos,
              status: status,
              date: date
          })
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


/**usar para obtener la estadistica por hora de un dia especifico (container tickets_stats) */
export const getTicketsByIds = async (accessToken, ticketIds, {params}) => {
  //if (accessToken === null) return { success: false, message: 'No access token provided' };
  const token = params.continuationToken;
  let tokenCosmos = ''
  if (params.continuationToken) {
      tokenCosmos = token;
  }
  console.log(ticketIds)
  try {
    const response = await fetch(`https://cservicesapi.azurewebsites.net/api/cosmoGetByIds`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
       "Authorization": `Bearer ${accessToken}`
      },
      body: JSON.stringify({ 
        limit: params.limit,
        continuationToken: tokenCosmos,
        ticketIds
       }) 
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
  
  // Si date es null o vacío, usa la fecha actual
  const today = new Date();
  const resolvedDate = date || today.toISOString().split('T')[0]; // YYYY-MM-DD

  try {
    const response = await fetch(`https://cservicesapi.azurewebsites.net/api/cosmoGetDailyResolvedByAgent?date=${encodeURIComponent(resolvedDate)}`, {
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


/**usar para obtener la estadistica por hora de un dia especifico (container tickets_stats) */
export const getDailyStats = async (date, scope='date') => {
  //if (accessToken === null) return { success: false, message: 'No access token provided' };
  
  // Si date es null o vacío, usa la fecha actual
  const today = new Date();
  const resolvedDate = date || today.toISOString().split('T')[0]; // YYYY-MM-DD

  try {
    const response = await fetch(`https://cservicesapi.azurewebsites.net/api/getTicketStats?${scope}=${encodeURIComponent(resolvedDate)}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer `,
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

