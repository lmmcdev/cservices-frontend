// ticketUtils.js
import { ENDPOINT_URLS } from "./js/constants";

export const getProviders = async (query, filter, page = 1, size = 50) => {
  //if (accessToken === null) return { success: false, message: 'No access token provided' };
    let url = `${ENDPOINT_URLS.API}/searchProviders`;
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
