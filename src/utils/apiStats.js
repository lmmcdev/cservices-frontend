// ticketUtils.js

//statistics
export const getStats = async (dispatch, accessToken) => {
  //setLoading(true)
  //console.log(accessToken)
  if (accessToken === null) return
  //console.log(accessToken)
 try {
    const response = await fetch(`https://cservicesapi.azurewebsites.net/api/cosmoGetStats`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }

    );
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Error fetching tickets');
    }
    
    //console.log(data.message)
    dispatch({ type: 'SET_STATS', payload: data.message });
    return { success: true, message: data.message || 'Updated successfully' };
  } catch (err) {
    const message = err.message || 'Something went wrong';
    //dispatch({ type: 'SET_ERROR', payload: message });
    return { success: false, message };
  } finally {
    //setLoading(false);
  }
};