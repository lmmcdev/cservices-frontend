import { createAgent, editAgent } from "../api";

export async function submitNewAgent({
  data,
  supEmail,
  dispatch,
  setLoading,
  setSuccessMessage,
  setErrorMessage,
  setSuccessOpen,
  setErrorOpen,
}) {
  const form = { ...data, supEmail };

  const result = await createAgent(dispatch, setLoading, form);

  if (result.success) {
    setSuccessMessage(result.message);
    setSuccessOpen(true);
  } else {
    setErrorMessage(result.message);
    setErrorOpen(true);
  }
}

export async function updateAgent({
  values,
  verifyEmailExists,
  agentId,
  supEmail,
  dispatch,
  setLoading,
  setSuccessMessage,
  setErrorMessage,
  setSuccessOpen,
  setErrorOpen,
}) {
  const exists = await verifyEmailExists(values.email);
  if (!exists) {
    setErrorMessage(`Email ${values.email} not found in Office365`);
    setErrorOpen(true);
    return;
  }

  const agent_id = agentId;
  const form = { ...values, agent_id, supEmail };

  const result = await editAgent(dispatch, setLoading, form);

  if (result.success) {
    setSuccessMessage(result.message);
    setSuccessOpen(true);
  } else {
    setErrorMessage(result.message);
    setErrorOpen(true);
  }
}