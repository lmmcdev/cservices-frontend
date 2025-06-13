// utils/api/apiClient.js

export const apiRequest = async ({
  url,
  method = 'GET',
  body = null,
  headers = {},
}) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || `Error ${method} ${url}`);
    }

    return data.message ?? data;
  } catch (err) {
    throw new Error(err.message || 'Unexpected error');
  }
};
