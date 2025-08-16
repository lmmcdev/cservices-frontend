// utils/ticketActionHelper.js
/**
 * Helper genérico para ejecutar una mutación de ticket con:
 * - manejo de loading
 * - notificaciones de éxito/error
 * - dispatch opcional de UPD_TICKET (si hay ticket actualizado)
 */
export async function runTicketAction({
  // (requerido) función que llama a la API
  fn,
  // args a pasar a fn (array o único valor)
  args = [],
  // UI handlers (opcionales)
  setLoading,
  setSuccessMessage,
  setSuccessOpen,
  setErrorMessage,
  setErrorOpen,
  // callbacks opcionales
  onSuccess,   // (result) => {}
  onError,     // (err|result) => {}
  // mensajes opcionales
  successMessage, // si no se provee, intenta usar result.message
  errorMessage,   // si no se provee, intenta usar result.details || result.message
  // store
  dispatch,
  /**
   * Extrae el ticket actualizado desde el "result" para hacer UPD_TICKET.
   * Si no se proporciona, no hace dispatch.
   * Debe retornar un objeto con { id, ... } o null/undefined si no hay ticket.
   */
  getUpdatedTicket
}) {
  const argArray = Array.isArray(args) ? args : [args];

  try {
    setLoading?.(true);

    const result = await fn(...argArray);

    if (result?.success) {
      // Notificación de éxito
      console.log(result)
      const okMsg = successMessage ?? result?.message ?? 'Operation completed';
      if (okMsg && setSuccessMessage && setSuccessOpen) {
        setSuccessMessage(okMsg);
        setSuccessOpen(true);
      }

      // Dispatch si hay ticket actualizado
      if (dispatch && typeof getUpdatedTicket === 'function') {
        const ticket = getUpdatedTicket(result);
        if (ticket && ticket.id) {
          dispatch({ type: 'UPD_TICKET', payload: ticket });
        }

      }

      // Post-proceso
      await onSuccess?.(result);
      return result;
    }

    // Error controlado por backend
    const errMsg =
      errorMessage ??
      result?.details ??
      result?.message ??
      'Operation failed';
    if (setErrorMessage && setErrorOpen) {
      setErrorMessage(errMsg);
      setErrorOpen(true);
    }
    await onError?.(result);
    return result;
  } catch (err) {
    // Error de red/u otra excepción
    const errMsg = errorMessage ?? err?.message ?? 'Unexpected error';
    if (setErrorMessage && setErrorOpen) {
      setErrorMessage(errMsg);
      setErrorOpen(true);
    }
    await onError?.(err);
    throw err;
  } finally {
    setLoading?.(false);
  }
}

/**
 * Utilidad pequeña para “adivinar” el ticket en distintas formas de payload
 * (te evita repetir if result.message.ticket, result.responseData, etc.)
 */
export function pickUpdatedTicket(result) {
  return (
    result?.updated_ticket ||
    result?.updatedTicket ||
    result?.responseData ||
    result?.ticket ||
    result?.message?.ticket ||
    null
  );
}
