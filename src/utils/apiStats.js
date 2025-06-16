// ticketUtils.js

//statistics
export const getStats = async (accessToken) => {
  if (accessToken === null) return { success: false, message: 'No access token provided' };

  try {
    const response = await fetch(`https://cservicesapi.azurewebsites.net/api/cosmoGetStats`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();
    console.log(data.message)
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
