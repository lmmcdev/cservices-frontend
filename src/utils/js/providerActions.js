// utils/providersActions.js
import { updateProvider } from "../apiProviders";

export async function handleUpdateProvider({ setLoading, dataProvider, setSuccessMessage, setErrorMessage, setSuccessOpen, setErrorOpen }) {
    //console.log(dataProvider)
  setLoading(true);
  const result = await updateProvider(dataProvider);
  if (result.success) {
    setSuccessMessage(result.message);
    setSuccessOpen(true);
    setLoading(false)
  } else {
    setErrorMessage(result.message);
    setErrorOpen(true);
    setLoading(false)
  }
  
}

