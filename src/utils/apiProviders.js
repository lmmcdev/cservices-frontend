// ticketUtils.js

//statistics
export const getProviders = async ({params}, accessToken) => {
  //if (accessToken === null) return { success: false, message: 'No access token provided' };
    const token = params.continuationToken;
    let tokenCosmos = ''
    let url = `https://cservicesapi.azurewebsites.net/api/cosmoGetProviders`;
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


export const searchProviders = async (searchData, accessToken) => {
  //if (accessToken === null) return { success: false, message: 'No access token provided' };
    let url = `https://cservicesapi.azurewebsites.net/api/searchProviders`;
    try {
        const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        // Authorization: `Bearer ${accessToken}`, si usas autenticación
        },
        body: JSON.stringify({
            query: searchData,
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

//update collaborators
export const updateProvider = async (data) => {
  // Transformar el objeto recibido a la estructura esperada
  const transformedData = {
    ProvidOrg: data.ProvidOrg || "",
    First_Name: data.firstName || "",
    Last_Name: data.lastName || "",
    Title: data.title || "",
    Effective_To: data.effectiveTo || "",
    Provider_Name: data.providerName || "",
    Office_Address: data.officeAddress || "",
    Office_City: data.officeCity || "",
    Office_State: data.officeState || "",
    Office_Zip: parseInt(data.officeZip) || 0,
    Office_Phone: parseInt(data.officePhone) || 0,
    Office_Fax: parseInt(data.officeFax) || 0,
    Email: data.email || "",
    InHouse: data.inHouse === true ? "TRUE" : "FALSE",
    Office_County_Name: data.officeCounty || "",
    Taxonomy_Code: data.taxonomyCode || "",
    Taxonomy_Description: data.taxonomyDesc || "",
    Billing_Pay_To_Name: data.billingName || "",
    Billing_Pay_To_Organization: data.billingOrg || "",
    Billing_Pay_To_Address1: data.billingAddress1 || "",
    Billing_Pay_To_Address2: data.billingAddress2 || "",
    Billing_Pay_To_City: data.billingCity || "",
    Billing_Pay_To_State: data.billingState || "",
    Billing_Pay_To_Zip: data.billingZip || "",
    Billing_Pay_To_County: data.billingCounty || "",
    id: data.id,
  };

  try {
    const response = await fetch(`https://cservicesapi.azurewebsites.net/api/cosmoUpdateProvider`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transformedData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Error updating provider');
    }

    return {
      success: true,
      message: result.message || 'Updated successfully',
    };
  } catch (err) {
    return {
      success: false,
      message: err.message || 'Something went wrong',
    };
  }
};
