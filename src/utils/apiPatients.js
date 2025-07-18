// ticketUtils.js

//statistics
export const getPatients = async ({params}, accessToken) => {
  //if (accessToken === null) return { success: false, message: 'No access token provided' };
    const token = params.continuationToken;
    let tokenCosmos = ''
    let url = `https://cservicesapi.azurewebsites.net/api/cosmoGetPatients`;
    if (params.continuationToken) {
      tokenCosmos = token;
    }

    try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          // Authorization: `Bearer ${accessToken}`, si usas autenticación
          },
          body: JSON.stringify({
              limit: params.limit,
              continuationToken: tokenCosmos,
          }),
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


export const searchPatients = async (searchData, page = 1, size = 50, accessToken) => {
  //if (accessToken === null) return { success: false, message: 'No access token provided' };
    let url = `https://cservicesapi.azurewebsites.net/api/searchPatients`;
    try {
        const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        // Authorization: `Bearer ${accessToken}`, si usas autenticación
        },
        body: JSON.stringify({
            query: searchData,
            page,
            size
        }),
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error fetching tickets');
        }
        // Devuelve solo los datos
        return { success: true, message: data || 'Updated successfully' };
    } catch (err) {
        const message = err.message || 'Something went wrong';
        return { success: false, message };
    }
};


