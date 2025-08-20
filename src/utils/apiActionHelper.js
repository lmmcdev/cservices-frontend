// utils/apiActionHelper.js
/**
 * Helper genérico para ejecutar una acción de API con:
 * - manejo de loading
 * - notificaciones éxito/error
 * - dispatch opcional (uno o varios)
 * - extracción opcional de entidad actualizada
 */
export async function runApiAction({
  // (requerido) función que llama a la API
  fn,
  // args a pasar a fn (array o único valor)
  args = [],

  // === UI handlers (opcionales)
  setLoading,
  setSuccessMessage,
  setSuccessOpen,
  setErrorMessage,
  setErrorOpen,

  // === callbacks (opcionales)
  onSuccess,     // (result) => {}
  onError,       // (err|result) => {}
  onFinally,     // () => {}  // útil si quieres limpiar algo extra

  // === mensajes (opcionales)
  successMessage, // si no se provee, intenta usar result.message
  errorMessage,   // si no se provee, intenta usar result.details || result.message

  // === éxito/fracaso (personalizable)
  isSuccess = (res) => res?.success === true,

  // === store (opcionales)
  dispatch,                   // fn dispatch (Redux/useReducer…)
  dispatches,                 // arreglo de { type, payload } si quieres despachar varios
  actionType,                 // si sólo quieres 1 dispatch: type
  getUpdatedEntity,           // (result) => objeto con { id, ... } o null/undefined
  buildPayload,               // (entity, result) => payload; por defecto usa la entity

  // === transformaciones (opcionales)
  mapResult,                  // (result) => newResult (si el backend es inconsistente)
}) {
  const argArray = Array.isArray(args) ? args : [args];

  try {
    setLoading?.(true);

    let result = await fn(...argArray);
    if (typeof mapResult === 'function') result = mapResult(result);

    if (result?.success) {
      // Notificación de éxito
      //const okMsg = successMessage ?? result?.message ?? 'Operation completed';
      const okMsg = successMessage ?? 'Operation completed';
        if (okMsg) {
        setSuccessMessage?.(okMsg);
        setSuccessOpen?.(true);
        }


      // Dispatch (único o múltiples)
      if (dispatch) {
        // Único a partir de entidad actualizada
        if (actionType && typeof getUpdatedEntity === 'function') {
          const entity = getUpdatedEntity(result);
          if (entity) {
            const payload = typeof buildPayload === 'function' ? buildPayload(entity, result) : entity;
            dispatch({ type: actionType, payload });
          }
        }

        // Múltiples explícitos
        if (Array.isArray(dispatches) && dispatches.length) {
          for (const d of dispatches) {
            if (d?.type) dispatch({ type: d.type, payload: d.payload });
          }
        }
      }

      await onSuccess?.(result);
      return result;
    }

    // Error controlado por backend
    const errMsg = errorMessage ?? result?.details ?? result?.message ?? 'Operation failed';
    setErrorMessage?.(errMsg);
    setErrorOpen?.(true);
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
    await onFinally?.();
  }
}

/**
 * Picker genérico de entidad actualizada: intenta múltiples convenciones.
 * Pásale el nombre base (e.g. 'ticket', 'patient', 'provider').
 */
export function pickUpdatedEntity(result, base) {
  if (!result || !base) return null;
  const candidates = [
    `updated_${base}`,
    `updated${capitalize(base)}`,
    base,
    `${base}Updated`,
    'responseData',
    result?.message?.[base] ? `${base}FromMessage` : null,
  ].filter(Boolean);

  for (const key of candidates) {
    if (key === `${base}FromMessage` && result?.message?.[base]) {
      return result.message[base];
    }
    if (result?.[key]) return result[key];
  }
  return null;
}

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
